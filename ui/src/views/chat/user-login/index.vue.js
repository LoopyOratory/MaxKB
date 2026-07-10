/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onBeforeMount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserLoginLayout from '@/layout/login-layout/UserLoginLayout.vue';
import loginApi from '@/api/chat/chat.ts';
import { t } from '@/locales';
import useResize from '@/layout/hooks/useResize';
import useStore from '@/stores';
import { useI18n } from 'vue-i18n';
import QrCodeTab from '@/views/chat/user-login/scanCompinents/QrCodeTab.vue';
import { MsgConfirm, MsgError } from '@/utils/message.ts';
import PasswordAuth from '@/views/chat/auth/component/password.vue';
import { isAppIcon, loadScript } from '@/utils/common';
import * as dd from 'dingtalk-jsapi';
import JSEncrypt from 'jsencrypt';
useResize();
const router = useRouter();
const { theme, chatUser, common } = useStore();
const { locale } = useI18n({ useScope: 'global' });
const loading = ref(false);
const route = useRoute();
const identifyCode = ref('');
const { params: { accessToken }, query: { mode }, } = route;
const isPc = computed(() => {
    console.log(common.isMobile());
    let modeName = '';
    if (!mode || mode === 'pc') {
        modeName = common.isMobile() ? 'mobile' : 'pc';
    }
    else {
        modeName = mode;
    }
    console.log(modeName);
    return modeName === 'pc';
});
const loginFormRef = ref();
const loginForm = ref({
    username: '',
    password: '',
    captcha: '',
});
const max_attempts = ref(1); // Declared as ref
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
    loginFormRef.value?.validate().then(() => {
        if (loginMode.value === 'LDAP') {
            chatUser.ldapLogin(loginForm.value).then((ok) => {
                router.push({
                    name: 'chat',
                    params: { accessToken: chatUser.accessToken },
                    query: route.query,
                });
            });
        }
        else {
            // JSEncrypt In some packagingEnvironmentPossibleAs default export orDirectExport，CompatibleTwo cases
            const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
            const js = new JSEncryptCtor();
            js.setPublicKey(chatUser?.chat_profile?.rsaKey);
            const jsonData = JSON.stringify(loginForm.value);
            const encryptedBase64 = js.encrypt(jsonData);
            chatUser
                .login({
                encryptedData: encryptedBase64,
                username: loginForm.value.username,
            })
                .then((ok) => {
                router.push({
                    name: 'chat',
                    params: { accessToken: chatUser.accessToken },
                    query: route.query,
                });
            })
                .catch(() => {
                makeCode(loginForm.value.username);
            });
        }
    });
};
function makeCode(username) {
    loginApi.getCaptcha(username, accessToken).then((res) => {
        identifyCode.value = res.data.captcha;
    });
}
onBeforeMount(() => {
    locale.value = chatUser.getLanguage();
});
const modeList = ref([]);
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
function redirectAuth(authType, needMessage = false) {
    if (authType === 'LDAP' || authType === '' || authType === 'password') {
        return;
    }
    loginApi.getAuthSetting(authType, loading).then((res) => {
        if (!res.data || !res.data.config) {
            return;
        }
        const config = res.data.config;
        const queryParams = new URLSearchParams(route.query).toString();
        // Construct withQueryParametersredirectUrl
        let redirectUrl = `${config.redirectUrl}`;
        let redirectUrlCallback = `${config.redirectUrl}/${accessToken}`;
        if (queryParams) {
            redirectUrlCallback += `?${queryParams}`;
            redirectUrl += `&${queryParams}`;
        }
        let url;
        if (authType === 'CAS') {
            url = config.ldpUri;
            url +=
                url.indexOf('?') !== -1
                    ? `&service=${encodeURIComponent(redirectUrlCallback)}`
                    : `?service=${encodeURIComponent(redirectUrlCallback)}`;
        }
        else if (authType === 'OIDC') {
            const scope = config.scope || 'openid+profile+email';
            url = `${config.authEndpoint}?client_id=${config.clientId}&redirect_uri=${redirectUrlCallback}&response_type=code&scope=${scope}`;
            if (config.state) {
                url += `&state=${config.state}`;
            }
        }
        else if (authType === 'OAuth2') {
            url = `${config.authEndpoint}?client_id=${config.clientId}&response_type=code&redirect_uri=${redirectUrl}&state=${uuidv4()}_${accessToken}`;
            if (config.scope) {
                url += `&scope=${config.scope}`;
            }
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
function changeMode(val) {
    loginMode.value = val === 'LDAP' ? val : 'LOCAL';
    if (val !== 'LOCAL') {
        loginMode.value = val;
    }
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
    redirectAuth(val);
    loginFormRef.value?.clearValidate();
}
function handleUsernameBlur(username) {
    makeCode(username);
}
onBeforeMount(() => {
    if (chatUser.chat_profile?.max_attempts) {
        max_attempts.value = chatUser.chat_profile.max_attempts;
    }
    if (!chatUser.chat_profile?.authentication) {
        return;
    }
    if (chatUser.chat_profile?.login_value) {
        modeList.value = chatUser.chat_profile.login_value;
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
        if (modeList.value.length == 1 && ['CAS', 'OIDC', 'OAuth2'].includes(modeList.value[0])) {
            redirectAuth(modeList.value[0]);
        }
        // HeremodeList Isoauth2 cas ldap oidc These four There will also be lark wecom dingtalk
        // Get to modeListExcept in'CAS', 'OIDC', 'OAuth2' LOCALOutside ofLoginMethod
        QrList.value = modeList.value.filter((item) => !['CAS', 'OIDC', 'OAuth2', 'LOCAL', 'LDAP'].includes(item));
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
});
onBeforeMount(() => {
    const route = useRoute();
    const currentUrl = ref(route.fullPath);
    const params = new URLSearchParams(currentUrl.value.split('?')[1]);
    const client = params.get('client');
    const handleDingTalk = () => {
        const code = params.get('corpId');
        if (code) {
            dd.runtime.permission.requestAuthCode({ corpId: code }).then((res) => {
                console.log('DingTalk client request success:', res);
                chatUser.dingOauth2Callback(res.code, accessToken).then(() => {
                    router.push({
                        name: 'chat',
                        params: { accessToken: accessToken },
                        query: route.query,
                    });
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
                    chatUser.larkCallback(res.code, accessToken).then(() => {
                        router.push({
                            name: 'chat',
                            params: { accessToken: accessToken },
                            query: route.query,
                        });
                    });
                },
                fail: (error) => {
                    MsgError(error);
                },
            });
        };
        loadScript('https://lf-scm-cn.feishucdn.com/lark/op/h5-js-sdk-1.5.44.js', {
            jsId: 'lark-sdk',
            forceReload: true,
        })
            .then(() => {
            if (window.tt) {
                window.tt?.requestAccess({
                    appID: appId,
                    scopeList: [],
                    success: (res) => {
                        chatUser.larkCallback(res.code, accessToken).then(() => {
                            router.push({
                                name: 'chat',
                                params: { accessToken: accessToken },
                                query: route.query,
                            });
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
    const __VLS_0 = UserLoginLayout || UserLoginLayout;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    var __VLS_5;
    const { default: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "user-login-container p-24" },
    });
    /** @type {__VLS_StyleScopedClasses['user-login-container']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    if (__VLS_ctx.isPc) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
        if (__VLS_ctx.isAppIcon(__VLS_ctx.chatUser.chat_profile?.icon)) {
            let __VLS_7;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
                shape: "square",
                size: (32),
                ...{ class: "mr-8" },
                ...{ style: {} },
            }));
            const __VLS_9 = __VLS_8({
                shape: "square",
                size: (32),
                ...{ class: "mr-8" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_8));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_12 } = __VLS_10.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.chatUser.chat_profile?.icon),
                alt: "",
            });
            // @ts-ignore
            [loading, loading, vLoading, isPc, isAppIcon, chatUser, chatUser,];
            var __VLS_10;
        }
        else {
            let __VLS_13;
            /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
            LogoIcon;
            // @ts-ignore
            const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
                height: "32px",
                ...{ class: "mr-8" },
            }));
            const __VLS_15 = __VLS_14({
                height: "32px",
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_14));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
        (__VLS_ctx.chatUser.chat_profile?.application_name);
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "user-login__header" },
        });
        /** @type {__VLS_StyleScopedClasses['user-login__header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mr-12 ml-16 flex" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        if (__VLS_ctx.isAppIcon(__VLS_ctx.chatUser.chat_profile?.icon)) {
            let __VLS_18;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
                shape: "square",
                size: (32),
                ...{ style: {} },
            }));
            const __VLS_20 = __VLS_19({
                shape: "square",
                size: (32),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_19));
            const { default: __VLS_23 } = __VLS_21.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.chatUser.chat_profile?.icon),
                alt: "",
            });
            // @ts-ignore
            [isAppIcon, chatUser, chatUser, chatUser,];
            var __VLS_21;
        }
        else {
            let __VLS_24;
            /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
            LogoIcon;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
                height: "32px",
            }));
            const __VLS_26 = __VLS_25({
                height: "32px",
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
            ...{ class: "ellipsis" },
            ...{ style: {} },
            title: (__VLS_ctx.chatUser.chat_profile?.application_name),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (__VLS_ctx.chatUser.chat_profile?.application_name);
    }
    if (__VLS_ctx.chatUser.chat_profile?.authentication &&
        __VLS_ctx.chatUser.chat_profile?.authentication_type == 'password') {
        let __VLS_29;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
            ...{ class: "login-card" },
        }));
        const __VLS_31 = __VLS_30({
            ...{ class: "login-card" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        /** @type {__VLS_StyleScopedClasses['login-card']} */ ;
        const { default: __VLS_34 } = __VLS_32.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "mb-24" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
        (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.authenticationValue'));
        const __VLS_35 = PasswordAuth || PasswordAuth;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({}));
        const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
        // @ts-ignore
        [chatUser, chatUser, chatUser, chatUser, $t,];
        var __VLS_32;
    }
    else {
        let __VLS_40;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
            ...{ class: "login-card" },
            ...{ style: {} },
        }));
        const __VLS_42 = __VLS_41({
            ...{ class: "login-card" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        /** @type {__VLS_StyleScopedClasses['login-card']} */ ;
        const { default: __VLS_45 } = __VLS_43.slots;
        if (!__VLS_ctx.showQrCodeTab && (__VLS_ctx.loginMode === 'LDAP' || __VLS_ctx.loginMode === 'LOCAL')) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
                ...{ class: "mb-24" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
            (__VLS_ctx.loginMode == 'LOCAL' ? __VLS_ctx.$t('views.login.title') : __VLS_ctx.loginMode);
        }
        if (!__VLS_ctx.showQrCodeTab && (__VLS_ctx.loginMode === 'LDAP' || __VLS_ctx.loginMode === 'LOCAL')) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            let __VLS_46;
            /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
            elForm;
            // @ts-ignore
            const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
                ...{ 'onKeyup': {} },
                ...{ class: "login-form" },
                rules: (__VLS_ctx.rules),
                model: (__VLS_ctx.loginForm),
                ref: "loginFormRef",
            }));
            const __VLS_48 = __VLS_47({
                ...{ 'onKeyup': {} },
                ...{ class: "login-form" },
                rules: (__VLS_ctx.rules),
                model: (__VLS_ctx.loginForm),
                ref: "loginFormRef",
            }, ...__VLS_functionalComponentArgsRest(__VLS_47));
            let __VLS_51;
            const __VLS_52 = {
                /** @type {typeof __VLS_51.keyup} */
                onKeyup: (__VLS_ctx.loginHandle),
            };
            var __VLS_53;
            /** @type {__VLS_StyleScopedClasses['login-form']} */ ;
            const { default: __VLS_55 } = __VLS_49.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-24" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
            let __VLS_56;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
                prop: "username",
            }));
            const __VLS_58 = __VLS_57({
                prop: "username",
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            const { default: __VLS_61 } = __VLS_59.slots;
            let __VLS_62;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
                ...{ 'onBlur': {} },
                size: "large",
                ...{ class: "input-item" },
                modelValue: (__VLS_ctx.loginForm.username),
                placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
            }));
            const __VLS_64 = __VLS_63({
                ...{ 'onBlur': {} },
                size: "large",
                ...{ class: "input-item" },
                modelValue: (__VLS_ctx.loginForm.username),
                placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_63));
            let __VLS_67;
            const __VLS_68 = {
                /** @type {typeof __VLS_67.blur} */
                onBlur: (...[$event]) => {
                    if (!(!__VLS_ctx.loading))
                        throw 0;
                    if (!!(__VLS_ctx.chatUser.chat_profile?.authentication &&
                        __VLS_ctx.chatUser.chat_profile?.authentication_type == 'password'))
                        throw 0;
                    if (!(!__VLS_ctx.showQrCodeTab && (__VLS_ctx.loginMode === 'LDAP' || __VLS_ctx.loginMode === 'LOCAL')))
                        throw 0;
                    return __VLS_ctx.handleUsernameBlur(__VLS_ctx.loginForm.username);
                    // @ts-ignore
                    [$t, $t, showQrCodeTab, showQrCodeTab, loginMode, loginMode, loginMode, loginMode, loginMode, loginMode, rules, loginForm, loginForm, loginForm, loginHandle, handleUsernameBlur,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['input-item']} */ ;
            var __VLS_65;
            var __VLS_66;
            // @ts-ignore
            [];
            var __VLS_59;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-24" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
            let __VLS_69;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
                prop: "password",
            }));
            const __VLS_71 = __VLS_70({
                prop: "password",
            }, ...__VLS_functionalComponentArgsRest(__VLS_70));
            const { default: __VLS_74 } = __VLS_72.slots;
            let __VLS_75;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
                type: "password",
                size: "large",
                ...{ class: "input-item" },
                modelValue: (__VLS_ctx.loginForm.password),
                placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
                showPassword: true,
            }));
            const __VLS_77 = __VLS_76({
                type: "password",
                size: "large",
                ...{ class: "input-item" },
                modelValue: (__VLS_ctx.loginForm.password),
                placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
                showPassword: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_76));
            /** @type {__VLS_StyleScopedClasses['input-item']} */ ;
            // @ts-ignore
            [$t, loginForm,];
            var __VLS_72;
            if (__VLS_ctx.loginMode !== 'LDAP' && __VLS_ctx.identifyCode) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "mb-24" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
                let __VLS_80;
                /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
                elFormItem;
                // @ts-ignore
                const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                    prop: "captcha",
                }));
                const __VLS_82 = __VLS_81({
                    prop: "captcha",
                }, ...__VLS_functionalComponentArgsRest(__VLS_81));
                const { default: __VLS_85 } = __VLS_83.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex-between w-full" },
                });
                /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                let __VLS_86;
                /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
                elInput;
                // @ts-ignore
                const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                    size: "large",
                    ...{ class: "input-item" },
                    modelValue: (__VLS_ctx.loginForm.captcha),
                    placeholder: (__VLS_ctx.$t('views.login.loginForm.captcha.placeholder')),
                }));
                const __VLS_88 = __VLS_87({
                    size: "large",
                    ...{ class: "input-item" },
                    modelValue: (__VLS_ctx.loginForm.captcha),
                    placeholder: (__VLS_ctx.$t('views.login.loginForm.captcha.placeholder')),
                }, ...__VLS_functionalComponentArgsRest(__VLS_87));
                /** @type {__VLS_StyleScopedClasses['input-item']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    ...{ onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.loading))
                                throw 0;
                            if (!!(__VLS_ctx.chatUser.chat_profile?.authentication &&
                                __VLS_ctx.chatUser.chat_profile?.authentication_type == 'password'))
                                throw 0;
                            if (!(!__VLS_ctx.showQrCodeTab && (__VLS_ctx.loginMode === 'LDAP' || __VLS_ctx.loginMode === 'LOCAL')))
                                throw 0;
                            if (!(__VLS_ctx.loginMode !== 'LDAP' && __VLS_ctx.identifyCode))
                                throw 0;
                            return __VLS_ctx.makeCode(__VLS_ctx.loginForm.username);
                            // @ts-ignore
                            [$t, loginMode, loginForm, loginForm, identifyCode, makeCode,];
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
                var __VLS_83;
            }
            // @ts-ignore
            [];
            var __VLS_49;
            var __VLS_50;
            let __VLS_91;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
                ...{ 'onClick': {} },
                size: "large",
                type: "primary",
                ...{ class: "w-full" },
                loading: (__VLS_ctx.loading),
            }));
            const __VLS_93 = __VLS_92({
                ...{ 'onClick': {} },
                size: "large",
                type: "primary",
                ...{ class: "w-full" },
                loading: (__VLS_ctx.loading),
            }, ...__VLS_functionalComponentArgsRest(__VLS_92));
            let __VLS_96;
            const __VLS_97 = {
                /** @type {typeof __VLS_96.click} */
                onClick: (__VLS_ctx.loginHandle),
            };
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            const { default: __VLS_98 } = __VLS_94.slots;
            (__VLS_ctx.$t('views.login.buttons.login'));
            // @ts-ignore
            [loading, $t, loginHandle,];
            var __VLS_94;
            var __VLS_95;
        }
        if (__VLS_ctx.showQrCodeTab) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            const __VLS_99 = QrCodeTab;
            // @ts-ignore
            const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
                tabs: (__VLS_ctx.orgOptions),
            }));
            const __VLS_101 = __VLS_100({
                tabs: (__VLS_ctx.orgOptions),
            }, ...__VLS_functionalComponentArgsRest(__VLS_100));
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
            if (item !== 'LOCAL' && __VLS_ctx.loginMode !== item && item !== 'QR_CODE') {
                let __VLS_104;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
                    ...{ 'onClick': {} },
                    circle: true,
                    key: (item),
                    ...{ class: "login-button-circle color-secondary" },
                }));
                const __VLS_106 = __VLS_105({
                    ...{ 'onClick': {} },
                    circle: true,
                    key: (item),
                    ...{ class: "login-button-circle color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_105));
                let __VLS_109;
                const __VLS_110 = {
                    /** @type {typeof __VLS_109.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.loading))
                            throw 0;
                        if (!!(__VLS_ctx.chatUser.chat_profile?.authentication &&
                            __VLS_ctx.chatUser.chat_profile?.authentication_type == 'password'))
                            throw 0;
                        if (!(item !== 'LOCAL' && __VLS_ctx.loginMode !== item && item !== 'QR_CODE'))
                            throw 0;
                        return __VLS_ctx.changeMode(item);
                        // @ts-ignore
                        [$t, showQrCodeTab, loginMode, orgOptions, modeList, modeList, changeMode,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['login-button-circle']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                const { default: __VLS_111 } = __VLS_107.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ style: ({
                            'font-size': item === 'OAUTH2' ? '8px' : '10px',
                            color: __VLS_ctx.theme.themeInfo?.theme,
                        }) },
                });
                (item);
                // @ts-ignore
                [theme,];
                var __VLS_107;
                var __VLS_108;
            }
            if (item === 'QR_CODE' && __VLS_ctx.loginMode !== item) {
                let __VLS_112;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
                    ...{ 'onClick': {} },
                    circle: true,
                    key: (item),
                    ...{ class: "login-button-circle color-secondary" },
                }));
                const __VLS_114 = __VLS_113({
                    ...{ 'onClick': {} },
                    circle: true,
                    key: (item),
                    ...{ class: "login-button-circle color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_113));
                let __VLS_117;
                const __VLS_118 = {
                    /** @type {typeof __VLS_117.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.loading))
                            throw 0;
                        if (!!(__VLS_ctx.chatUser.chat_profile?.authentication &&
                            __VLS_ctx.chatUser.chat_profile?.authentication_type == 'password'))
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
                const { default: __VLS_119 } = __VLS_115.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/icon_qr_outlined.svg",
                    width: "25px",
                });
                // @ts-ignore
                [];
                var __VLS_115;
                var __VLS_116;
            }
            if (item === 'LOCAL' && __VLS_ctx.loginMode != 'LOCAL') {
                let __VLS_120;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
                    ...{ 'onClick': {} },
                    circle: true,
                    key: (item),
                    ...{ class: "login-button-circle color-secondary" },
                    ...{ style: {} },
                    icon: "UserFilled",
                }));
                const __VLS_122 = __VLS_121({
                    ...{ 'onClick': {} },
                    circle: true,
                    key: (item),
                    ...{ class: "login-button-circle color-secondary" },
                    ...{ style: {} },
                    icon: "UserFilled",
                }, ...__VLS_functionalComponentArgsRest(__VLS_121));
                let __VLS_125;
                const __VLS_126 = {
                    /** @type {typeof __VLS_125.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.loading))
                            throw 0;
                        if (!!(__VLS_ctx.chatUser.chat_profile?.authentication &&
                            __VLS_ctx.chatUser.chat_profile?.authentication_type == 'password'))
                            throw 0;
                        if (!(item === 'LOCAL' && __VLS_ctx.loginMode != 'LOCAL'))
                            throw 0;
                        return __VLS_ctx.changeMode('LOCAL');
                        // @ts-ignore
                        [loginMode, changeMode,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['login-button-circle']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                var __VLS_123;
                var __VLS_124;
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_43;
    }
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
var __VLS_54 = __VLS_53;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
