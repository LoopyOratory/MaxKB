/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoginContainer from '@/layout/login-layout/LoginContainer.vue';
import LoginLayout from '@/layout/login-layout/LoginLayout.vue';
import loginApi from '@/api/user/login';
import authApi from '@/api/system-settings/auth-setting';
import { getBrowserLang, t } from '@/locales';
import useStore from '@/stores';
import { useI18n } from 'vue-i18n';
import QrCodeTab from '@/views/login/scanCompinents/QrCodeTab.vue';
import { MsgConfirm, MsgError } from '@/utils/message.ts';
import * as dd from 'dingtalk-jsapi';
import { loadScript } from '@/utils/common';
import JSEncrypt from 'jsencrypt';
const router = useRouter();
const { login, user, theme } = useStore();
const { locale } = useI18n({ useScope: 'global' });
const loading = ref(false);
const route = useRoute();
const identifyCode = ref('');
const loginFormRef = ref();
const authSetting = ref(null);
const defaultQrTab = ref('');
const loginForm = ref({
    username: '',
    password: '',
    captcha: '',
});
const rules = ref({
    username: [
        {
            required: true,
            message: t('views.login.loginForm.username.requiredMessage'),
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: t('views.login.loginForm.password.requiredMessage'),
            trigger: 'blur',
        },
    ],
    captcha: [
        {
            required: false,
            message: t('views.login.loginForm.captcha.requiredMessage'),
            trigger: 'blur',
        },
    ],
});
const loginHandle = () => {
    if (!loginFormRef.value) {
        return;
    }
    loginFormRef.value.validate((valid) => {
        if (valid) {
            loading.value = true;
            if (loginMode.value === 'LDAP') {
                login
                    .asyncLdapLogin(loginForm.value)
                    .then(() => {
                    locale.value = localStorage.getItem('MaxKB-locale') || getBrowserLang() || 'en-US';
                    router.push({ name: 'home' });
                })
                    .catch(() => {
                    loading.value = false;
                });
            }
            else {
                // JSEncrypt In some packagingEnvironmentPossibleAs default export orDirectExport，CompatibleTwo cases
                const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
                const js = new JSEncryptCtor();
                js.setPublicKey(user.rsaKey);
                const jsonData = JSON.stringify(loginForm.value);
                const encryptedBase64 = js.encrypt(jsonData);
                login
                    .asyncLogin({ encryptedData: encryptedBase64, username: loginForm.value.username })
                    .then(() => {
                    locale.value = localStorage.getItem('MaxKB-locale') || getBrowserLang() || 'en-US';
                    localStorage.setItem('workspace_id', 'default');
                    router.push({ name: 'home' });
                })
                    .catch(() => {
                    const username = loginForm.value.username;
                    loading.value = false;
                    makeCode(username);
                });
            }
        }
    });
};
function makeCode(username) {
    loginApi
        .getCaptcha(username)
        .then((res) => {
        if (res && res.data && res.data.captcha) {
            identifyCode.value = res.data.captcha;
        }
    })
        .catch((error) => {
        console.error('Failed to get captcha:', error);
    });
}
function handleUsernameBlur(username) {
    makeCode(username);
}
onBeforeMount(() => {
    loading.value = true;
    user.asyncGetProfile().then((res) => {
        // EnterpriseAnd Professional: Third-partyLogin
        if (user.isPE() || user.isEE()) {
            authApi.getLoginAuthSetting().then((res) => {
                if (Object.keys(res.data).length > 0) {
                    authSetting.value = res.data;
                }
                else {
                    authSetting.value = {
                        max_attempts: 1,
                        default_value: 'LOCAL',
                    };
                }
                const params = route.query;
                if (params.login_mode !== 'manual') {
                    if (authSetting.value?.login_methods) {
                        modeList.value = authSetting.value?.login_methods;
                        if (modeList.value.includes('LOCAL')) {
                            modeList.value = ['LOCAL', ...modeList.value.filter((item) => item !== 'LOCAL')];
                        }
                        else if (modeList.value.includes('LDAP')) {
                            modeList.value = ['LDAP', ...modeList.value.filter((item) => item !== 'LDAP')];
                        }
                        loginMode.value = modeList.value[0] || 'LOCAL';
                        if (!modeList.value.includes('LOCAL') && !modeList.value.includes('LDAP')) {
                            loginMode.value = '';
                        }
                        if (modeList.value.length == 1 &&
                            ['CAS', 'OIDC', 'OAuth2', 'SAML2'].includes(modeList.value[0])) {
                            redirectAuth(modeList.value[0]);
                        }
                        // HeremodeList Isoauth2 cas ldap oidc These four There will also be lark wecom dingtalk
                        // Get to modeListExcept in'CAS', 'OIDC', 'OAuth2' LOCALOutside ofLoginMethod
                        QrList.value = modeList.value.filter((item) => !['CAS', 'OIDC', 'OAuth2', 'LOCAL', 'LDAP', 'SAML2'].includes(item));
                        // modeListNeedsRemovelark wecom dingtalk
                        modeList.value = modeList.value.filter((item) => !['lark', 'wecom', 'dingtalk'].includes(item));
                        if (QrList.value.length > 0) {
                            QrList.value.forEach((item) => {
                                orgOptions.value.push({
                                    key: item,
                                    value: item === 'wecom'
                                        ? t('views.system.authentication.scanTheQRCode.wecom')
                                        : item === 'dingtalk'
                                            ? t('views.system.authentication.scanTheQRCode.dingtalk')
                                            : t('views.system.authentication.scanTheQRCode.lark'),
                                });
                            });
                            if (!modeList.value.includes('LOCAL') && !modeList.value.includes('LDAP')) {
                                showQrCodeTab.value = true;
                            }
                            modeList.value = ['QR_CODE', ...modeList.value];
                        }
                    }
                    const defaultMode = authSetting.value.default_value;
                    if (['lark', 'wecom', 'dingtalk'].includes(defaultMode)) {
                        changeMode('QR_CODE', false);
                        defaultQrTab.value = defaultMode;
                    }
                    else {
                        changeMode(defaultMode, false);
                    }
                }
            });
        }
        else {
            authSetting.value = {
                max_attempts: 1,
                default_value: 'LOCAL',
            };
        }
        loading.value = false;
    });
});
const modeList = ref(['']);
const QrList = ref(['']);
const loginMode = ref('');
const showQrCodeTab = ref(false);
const orgOptions = ref([]);
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
const newDefaultSlogan = computed(() => {
    const default_login = 'Powerful and easy-to-use enterprise-gradeAgentPlatform';
    if (!theme.themeInfo?.slogan || default_login == theme.themeInfo?.slogan) {
        return t('theme.defaultSlogan');
    }
    else {
        return theme.themeInfo?.slogan;
    }
});
function redirectAuth(authType, needMessage = true) {
    if (authType === 'LDAP' || authType === '' || authType === 'LOCAL') {
        return;
    }
    authApi.getLoginViewAuthSetting(authType, loading).then((res) => {
        if (!res.data || !res.data.config) {
            return;
        }
        const config = res.data.config;
        // Construct withQueryParametersredirectUrl
        const redirectUrl = `${config.redirectUrl}`;
        let url;
        if (authType === 'CAS') {
            url = config.ldpUri;
            url +=
                url.indexOf('?') !== -1
                    ? `&service=${encodeURIComponent(redirectUrl)}`
                    : `?service=${encodeURIComponent(redirectUrl)}`;
        }
        else if (authType === 'OIDC') {
            const scope = config.scope || 'openid+profile+email';
            url = `${config.authEndpoint}?client_id=${config.clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}`;
            if (config.state) {
                url += `&state=${config.state}`;
            }
        }
        else if (authType === 'OAuth2') {
            url = `${config.authEndpoint}?client_id=${config.clientId}&response_type=code&redirect_uri=${redirectUrl}&state=${uuidv4()}`;
            if (config.scope) {
                url += `&scope=${config.scope}`;
            }
        }
        else if (authType === 'SAML2') {
            loginApi.samlLogin().then((res) => {
                window.location.href = res.data;
            });
        }
        if (!url) {
            return;
        }
        if (needMessage) {
            MsgConfirm(t('views.login.jump_tip'), '', {
                confirmButtonText: t('views.login.jump'),
                cancelButtonText: t('common.cancel'),
                confirmButtonClass: '',
            })
                .then(() => {
                window.location.href = url;
            })
                .catch(() => { });
        }
        else {
            console.log('url', url);
            window.location.href = url;
        }
    });
}
function changeMode(val, needMessage = true) {
    loginMode.value = val === 'LDAP' ? val : '';
    if (val === 'QR_CODE') {
        loginMode.value = val;
        showQrCodeTab.value = true;
        return;
    }
    showQrCodeTab.value = false;
    loginForm.value = {
        username: '',
        password: '',
        captcha: '',
    };
    redirectAuth(val, needMessage);
    loginFormRef.value?.clearValidate();
}
onMounted(() => {
    const route = useRoute();
    const currentUrl = ref(route.fullPath);
    const params = new URLSearchParams(currentUrl.value.split('?')[1]);
    const client = params.get('client');
    const handleDingTalk = () => {
        const code = params.get('corpId');
        if (code) {
            dd.runtime.permission.requestAuthCode({ corpId: code }).then((res) => {
                console.log('DingTalk client request success:', res);
                login.dingOauth2Callback(res.code).then(() => {
                    router.push({ name: 'home' });
                });
            });
        }
    };
    const handleLark = () => {
        const appId = params.get('appId');
        const callRequestAuthCode = () => {
            window.tt?.requestAuthCode({
                appId: appId,
                success: (res) => {
                    login.larkCallback(res.code).then(() => {
                        router.push({ name: 'home' });
                    });
                },
                fail: (error) => {
                    MsgError(error);
                },
            });
        };
        loadScript('https://lf-scm-cn.feishucdn.com/lark/op/h5-js-sdk-1.5.35.js', {
            jsId: 'lark-sdk',
            forceReload: true,
        })
            .then(() => {
            if (window.tt) {
                window.tt.requestAccess({
                    appID: appId,
                    scopeList: [],
                    success: (res) => {
                        login.larkCallback(res.code).then(() => {
                            router.push({ name: 'home' });
                        });
                    },
                    fail: (error) => {
                        const { errno } = error;
                        if (errno === 103) {
                            callRequestAuthCode();
                        }
                    },
                });
            }
            else {
                callRequestAuthCode();
            }
        })
            .catch((error) => {
            console.error('SDK LoadFailure:', error);
        });
    };
    switch (client) {
        case 'dingtalk':
            handleDingTalk();
            break;
        case 'lark':
            handleLark();
            break;
        default:
            break;
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (!__VLS_ctx.loading) {
    const __VLS_0 = LoginLayout || LoginLayout;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    var __VLS_5;
    const { default: __VLS_6 } = __VLS_3.slots;
    const __VLS_7 = LoginContainer || LoginContainer;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        subTitle: (__VLS_ctx.newDefaultSlogan),
    }));
    const __VLS_9 = __VLS_8({
        subTitle: (__VLS_ctx.newDefaultSlogan),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    if (!__VLS_ctx.showQrCodeTab) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "mb-24" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
        (__VLS_ctx.loginMode || __VLS_ctx.$t('views.login.title'));
    }
    if (!__VLS_ctx.showQrCodeTab) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        let __VLS_13;
        /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
        elForm;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
            ...{ 'onKeyup': {} },
            ...{ class: "login-form" },
            rules: (__VLS_ctx.rules),
            model: (__VLS_ctx.loginForm),
            ref: "loginFormRef",
        }));
        const __VLS_15 = __VLS_14({
            ...{ 'onKeyup': {} },
            ...{ class: "login-form" },
            rules: (__VLS_ctx.rules),
            model: (__VLS_ctx.loginForm),
            ref: "loginFormRef",
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        let __VLS_18;
        const __VLS_19 = {
            /** @type {typeof __VLS_18.keyup} */
            onKeyup: (__VLS_ctx.loginHandle),
        };
        var __VLS_20;
        /** @type {__VLS_StyleScopedClasses['login-form']} */ ;
        const { default: __VLS_22 } = __VLS_16.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-24" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
        let __VLS_23;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            prop: "username",
        }));
        const __VLS_25 = __VLS_24({
            prop: "username",
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        const { default: __VLS_28 } = __VLS_26.slots;
        let __VLS_29;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
            ...{ 'onBlur': {} },
            size: "large",
            ...{ class: "input-item" },
            modelValue: (__VLS_ctx.loginForm.username),
            placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
        }));
        const __VLS_31 = __VLS_30({
            ...{ 'onBlur': {} },
            size: "large",
            ...{ class: "input-item" },
            modelValue: (__VLS_ctx.loginForm.username),
            placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        let __VLS_34;
        const __VLS_35 = {
            /** @type {typeof __VLS_34.blur} */
            onBlur: (...[$event]) => {
                if (!(!__VLS_ctx.loading))
                    throw 0;
                if (!(!__VLS_ctx.showQrCodeTab))
                    throw 0;
                return __VLS_ctx.handleUsernameBlur(__VLS_ctx.loginForm.username);
                // @ts-ignore
                [loading, loading, vLoading, newDefaultSlogan, showQrCodeTab, showQrCodeTab, loginMode, $t, $t, rules, loginForm, loginForm, loginForm, loginHandle, handleUsernameBlur,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['input-item']} */ ;
        var __VLS_32;
        var __VLS_33;
        // @ts-ignore
        [];
        var __VLS_26;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-24" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
            prop: "password",
        }));
        const __VLS_38 = __VLS_37({
            prop: "password",
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        const { default: __VLS_41 } = __VLS_39.slots;
        let __VLS_42;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
            type: "password",
            size: "large",
            ...{ class: "input-item" },
            modelValue: (__VLS_ctx.loginForm.password),
            placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
            showPassword: true,
        }));
        const __VLS_44 = __VLS_43({
            type: "password",
            size: "large",
            ...{ class: "input-item" },
            modelValue: (__VLS_ctx.loginForm.password),
            placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
            showPassword: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        /** @type {__VLS_StyleScopedClasses['input-item']} */ ;
        // @ts-ignore
        [$t, loginForm,];
        var __VLS_39;
        if (__VLS_ctx.loginMode !== 'LDAP' && __VLS_ctx.identifyCode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-24" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
            let __VLS_47;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
                prop: "captcha",
            }));
            const __VLS_49 = __VLS_48({
                prop: "captcha",
            }, ...__VLS_functionalComponentArgsRest(__VLS_48));
            const { default: __VLS_52 } = __VLS_50.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between w-full" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            let __VLS_53;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
                size: "large",
                ...{ class: "input-item" },
                modelValue: (__VLS_ctx.loginForm.captcha),
                placeholder: (__VLS_ctx.$t('views.login.loginForm.captcha.placeholder')),
            }));
            const __VLS_55 = __VLS_54({
                size: "large",
                ...{ class: "input-item" },
                modelValue: (__VLS_ctx.loginForm.captcha),
                placeholder: (__VLS_ctx.$t('views.login.loginForm.captcha.placeholder')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_54));
            /** @type {__VLS_StyleScopedClasses['input-item']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                ...{ onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.loading))
                            throw 0;
                        if (!(!__VLS_ctx.showQrCodeTab))
                            throw 0;
                        if (!(__VLS_ctx.loginMode !== 'LDAP' && __VLS_ctx.identifyCode))
                            throw 0;
                        return __VLS_ctx.makeCode(__VLS_ctx.loginForm.username);
                        // @ts-ignore
                        [loginMode, $t, loginForm, loginForm, identifyCode, makeCode,];
                    } },
                src: (__VLS_ctx.identifyCode),
                alt: "",
                height: "38",
                ...{ class: "ml-8 cursor border border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            // @ts-ignore
            [identifyCode,];
            var __VLS_50;
        }
        // @ts-ignore
        [];
        var __VLS_16;
        var __VLS_17;
        let __VLS_58;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
            ...{ 'onClick': {} },
            size: "large",
            type: "primary",
            ...{ class: "w-full" },
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_60 = __VLS_59({
            ...{ 'onClick': {} },
            size: "large",
            type: "primary",
            ...{ class: "w-full" },
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        let __VLS_63;
        const __VLS_64 = {
            /** @type {typeof __VLS_63.click} */
            onClick: (__VLS_ctx.loginHandle),
        };
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        const { default: __VLS_65 } = __VLS_61.slots;
        (__VLS_ctx.$t('views.login.buttons.login'));
        // @ts-ignore
        [loading, $t, loginHandle,];
        var __VLS_61;
        var __VLS_62;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "operate-container flex-between mt-12" },
        });
        /** @type {__VLS_StyleScopedClasses['operate-container']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
        let __VLS_66;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
            ...{ class: "forgot-password" },
            link: true,
            type: "primary",
        }));
        const __VLS_68 = __VLS_67({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
            ...{ class: "forgot-password" },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        let __VLS_71;
        const __VLS_72 = {
            /** @type {typeof __VLS_71.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.loading))
                    throw 0;
                if (!(!__VLS_ctx.showQrCodeTab))
                    throw 0;
                return __VLS_ctx.router.push('/forgot_password');
                // @ts-ignore
                [loading, router,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['forgot-password']} */ ;
        const { default: __VLS_73 } = __VLS_69.slots;
        (__VLS_ctx.$t('views.login.forgotPassword'));
        // @ts-ignore
        [$t,];
        var __VLS_69;
        var __VLS_70;
    }
    if (__VLS_ctx.showQrCodeTab) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        const __VLS_74 = QrCodeTab;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            tabs: (__VLS_ctx.orgOptions),
            defaultTab: (__VLS_ctx.defaultQrTab),
        }));
        const __VLS_76 = __VLS_75({
            tabs: (__VLS_ctx.orgOptions),
            defaultTab: (__VLS_ctx.defaultQrTab),
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    }
    if (__VLS_ctx.modeList.length > 1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "login-gradient-divider lighter mt-24" },
        });
        /** @type {__VLS_StyleScopedClasses['login-gradient-divider']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.login.moreMethod'));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    for (const [item] of __VLS_vFor((__VLS_ctx.modeList))) {
        if (item !== '' && __VLS_ctx.loginMode !== item && item !== 'QR_CODE') {
            let __VLS_79;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
                ...{ 'onClick': {} },
                circle: true,
                key: (item),
                ...{ class: "login-button-circle color-secondary" },
            }));
            const __VLS_81 = __VLS_80({
                ...{ 'onClick': {} },
                circle: true,
                key: (item),
                ...{ class: "login-button-circle color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_80));
            let __VLS_84;
            const __VLS_85 = {
                /** @type {typeof __VLS_84.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.loading))
                        throw 0;
                    if (!(item !== '' && __VLS_ctx.loginMode !== item && item !== 'QR_CODE'))
                        throw 0;
                    return __VLS_ctx.changeMode(item);
                    // @ts-ignore
                    [showQrCodeTab, loginMode, $t, orgOptions, defaultQrTab, modeList, modeList, changeMode,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['login-button-circle']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            const { default: __VLS_86 } = __VLS_82.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ style: ({
                        'font-size': item === 'OAUTH2' ? '8px' : '10px',
                        color: __VLS_ctx.theme.themeInfo?.theme,
                    }) },
            });
            (item);
            // @ts-ignore
            [theme,];
            var __VLS_82;
            var __VLS_83;
        }
        if (item === 'QR_CODE' && __VLS_ctx.loginMode !== item) {
            let __VLS_87;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
                ...{ 'onClick': {} },
                circle: true,
                key: (item),
                ...{ class: "login-button-circle color-secondary" },
            }));
            const __VLS_89 = __VLS_88({
                ...{ 'onClick': {} },
                circle: true,
                key: (item),
                ...{ class: "login-button-circle color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_88));
            let __VLS_92;
            const __VLS_93 = {
                /** @type {typeof __VLS_92.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.loading))
                        throw 0;
                    if (!(item === 'QR_CODE' && __VLS_ctx.loginMode !== item))
                        throw 0;
                    return __VLS_ctx.changeMode('QR_CODE');
                    // @ts-ignore
                    [loginMode, changeMode,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['login-button-circle']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            const { default: __VLS_94 } = __VLS_90.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/icon_qr_outlined.svg",
                width: "25px",
            });
            // @ts-ignore
            [];
            var __VLS_90;
            var __VLS_91;
        }
        if (item === '' && __VLS_ctx.loginMode !== '') {
            let __VLS_95;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
                ...{ 'onClick': {} },
                circle: true,
                key: (item),
                ...{ class: "login-button-circle color-secondary" },
                ...{ style: {} },
                icon: "UserFilled",
            }));
            const __VLS_97 = __VLS_96({
                ...{ 'onClick': {} },
                circle: true,
                key: (item),
                ...{ class: "login-button-circle color-secondary" },
                ...{ style: {} },
                icon: "UserFilled",
            }, ...__VLS_functionalComponentArgsRest(__VLS_96));
            let __VLS_100;
            const __VLS_101 = {
                /** @type {typeof __VLS_100.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.loading))
                        throw 0;
                    if (!(item === '' && __VLS_ctx.loginMode !== ''))
                        throw 0;
                    return __VLS_ctx.changeMode('');
                    // @ts-ignore
                    [loginMode, changeMode,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['login-button-circle']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            var __VLS_98;
            var __VLS_99;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
var __VLS_21 = __VLS_20;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
