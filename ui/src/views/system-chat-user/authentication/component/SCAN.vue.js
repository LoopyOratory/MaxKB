/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, onMounted } from 'vue';
import { copyClick } from '@/utils/clipboard';
import EditModel from './EditModal.vue';
import platformApi from '@/api/chat-user/auth-setting.ts';
import { MsgError, MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
const EditModelRef = ref();
const loading = ref(false);
const platforms = reactive(initializePlatforms());
const showPassword = reactive({});
onMounted(() => {
    getPlatformInfo();
});
function initializePlatforms() {
    return [
        createPlatform('wecom', t('views.system.authentication.scanTheQRCode.wecom')),
        createPlatform('dingtalk', t('views.system.authentication.scanTheQRCode.dingtalk')),
        createPlatform('lark', t('views.system.authentication.scanTheQRCode.lark')),
    ];
}
function createPlatform(key, name) {
    let logo = '';
    switch (key) {
        case 'wecom':
            logo = 'wechat-work';
            break;
        case 'dingtalk':
            logo = 'dingtalk';
            break;
        case 'lark':
            logo = 'lark';
            break;
        default:
            logo = ''; // DefaultValue
            break;
    }
    const config = {
        ...(key === 'wecom' ? { corp_id: '', agent_id: '' } : { app_key: '' }),
        app_secret: '',
        callback_url: '',
    };
    return {
        key,
        logoSrc: new URL(`../../../../assets/logo/logo_${logo}.svg`, import.meta.url).href,
        name,
        isActive: false,
        isValid: false,
        config,
    };
}
function formatFieldName(key, item) {
    const fieldNames = {
        corp_id: 'Corp ID',
        app_key: item?.key != 'lark' ? 'APP Key' : 'App ID',
        app_secret: 'APP Secret',
        agent_id: 'Agent ID',
        callback_url: t('views.application.applicationAccess.callback'),
    };
    return (fieldNames[key] ||
        (key ? key.charAt(0).toUpperCase() + key.slice(1) : ''));
}
function getPlatformInfo() {
    loading.value = true;
    platformApi.getPlatformInfo(loading).then((res) => {
        if (res) {
            platforms.forEach((platform) => {
                const data = res.data.find((item) => item.auth_type === platform.key);
                if (data) {
                    Object.assign(platform, {
                        isValid: data.is_valid,
                        isActive: data.is_active,
                        config: data.config,
                    });
                    if (platform.key === 'dingtalk') {
                        const { corp_id, app_key, app_secret } = platform.config;
                        platform.config = {
                            corp_id,
                            app_key,
                            app_secret,
                            callback_url: platform.config.callback_url,
                        };
                    }
                    showPassword[platform.key] = {};
                    showPassword[platform.key]['app_secret'] = false;
                }
            });
        }
    });
}
function validateConnection(currentPlatform) {
    platformApi.validateConnection(currentPlatform, loading).then((res) => {
        res.data
            ? MsgSuccess(t('views.system.authentication.scanTheQRCode.validateSuccess'))
            : MsgError(t('views.system.authentication.scanTheQRCode.validateFailed'));
    });
}
function refresh() {
    getPlatformInfo();
}
function changeStatus(currentPlatform) {
    platformApi.updateConfig(currentPlatform, loading).then((res) => {
        MsgSuccess(t('common.saveSuccess'));
    });
}
function toggleShowPassword(platformKey) {
    if (!showPassword[platformKey]) {
        showPassword[platformKey] = {};
    }
    showPassword[platformKey]['app_secret'] = !showPassword[platformKey]['app_secret'];
}
function showDialog(platform) {
    EditModelRef.value?.open(platform);
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "scan-height" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['scan-height']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.platforms))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.key),
        ...{ class: "mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        ...{ class: "border-none mb-16" },
        shadow: "never",
    }));
    const __VLS_8 = __VLS_7({
        ...{ class: "border-none mb-16" },
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['border-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_11 } = __VLS_9.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (item.logoSrc),
        alt: "",
        width: "24px",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    (item.name);
    if (item.isValid) {
        let __VLS_12;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            size: "small",
            type: "success",
            ...{ class: "ml-8" },
        }));
        const __VLS_14 = __VLS_13({
            size: "small",
            type: "success",
            ...{ class: "ml-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        const { default: __VLS_17 } = __VLS_15.slots;
        (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.effective'));
        // @ts-ignore
        [vLoading, loading, platforms, $t,];
        var __VLS_15;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (!item.isValid) {
        let __VLS_18;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_20 = __VLS_19({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        let __VLS_23;
        const __VLS_24 = {
            /** @type {typeof __VLS_23.click} */
            onClick: (...[$event]) => {
                if (!(!item.isValid))
                    throw 0;
                return __VLS_ctx.showDialog(item);
                // @ts-ignore
                [showDialog,];
            },
        };
        const { default: __VLS_25 } = __VLS_21.slots;
        (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.access'));
        // @ts-ignore
        [$t,];
        var __VLS_21;
        var __VLS_22;
    }
    if (item.isValid) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (item.isActive
            ? __VLS_ctx.$t('views.system.authentication.scanTheQRCode.alreadyTurnedOn')
            : __VLS_ctx.$t('views.system.authentication.scanTheQRCode.notEnabled'));
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            ...{ 'onChange': {} },
            size: "small",
            modelValue: (item.isActive),
            disabled: (!item.isValid),
        }));
        const __VLS_28 = __VLS_27({
            ...{ 'onChange': {} },
            size: "small",
            modelValue: (item.isActive),
            disabled: (!item.isValid),
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        let __VLS_31;
        const __VLS_32 = {
            /** @type {typeof __VLS_31.change} */
            onChange: (...[$event]) => {
                if (!(item.isValid))
                    throw 0;
                return __VLS_ctx.changeStatus(item);
                // @ts-ignore
                [$t, $t, changeStatus,];
            },
        };
        var __VLS_29;
        var __VLS_30;
    }
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
    elCollapseTransition;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
    const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const { default: __VLS_38 } = __VLS_36.slots;
    if (item.isValid) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "border-t mt-16" },
        });
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
        let __VLS_39;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
            gutter: (12),
            ...{ class: "mt-16" },
        }));
        const __VLS_41 = __VLS_40({
            gutter: (12),
            ...{ class: "mt-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
        const { default: __VLS_44 } = __VLS_42.slots;
        for (const [value, key] of __VLS_vFor((item.config))) {
            let __VLS_45;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
                key: (key),
                span: (12),
            }));
            const __VLS_47 = __VLS_46({
                key: (key),
                span: (12),
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
            const { default: __VLS_50 } = __VLS_48.slots;
            let __VLS_51;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
                ...{ class: "color-secondary lighter" },
            }));
            const __VLS_53 = __VLS_52({
                ...{ class: "color-secondary lighter" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_52));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            const { default: __VLS_56 } = __VLS_54.slots;
            (__VLS_ctx.formatFieldName(key, item));
            // @ts-ignore
            [formatFieldName,];
            var __VLS_54;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mt-4 mb-16 flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (key !== 'app_secret') {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "vertical-middle lighter break-all ellipsis-1" },
                });
                /** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                (value);
            }
            if (key === 'app_secret' && !__VLS_ctx.showPassword[item.key]?.[key]) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "vertical-middle lighter break-all ellipsis-1" },
                });
                /** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            }
            if (key === 'app_secret' && __VLS_ctx.showPassword[item.key]?.[key]) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "vertical-middle lighter break-all ellipsis-1" },
                });
                /** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                (value);
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            let __VLS_57;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }));
            const __VLS_59 = __VLS_58({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
            let __VLS_62;
            const __VLS_63 = {
                /** @type {typeof __VLS_62.click} */
                onClick: (() => __VLS_ctx.copyClick(value)),
            };
            const { default: __VLS_64 } = __VLS_60.slots;
            let __VLS_65;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
                iconName: "app-copy",
            }));
            const __VLS_67 = __VLS_66({
                iconName: "app-copy",
            }, ...__VLS_functionalComponentArgsRest(__VLS_66));
            // @ts-ignore
            [showPassword, showPassword, copyClick,];
            var __VLS_60;
            var __VLS_61;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-4" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            if (key === 'app_secret') {
                let __VLS_70;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
                    ...{ 'onClick': {} },
                    type: "primary",
                    text: true,
                }));
                const __VLS_72 = __VLS_71({
                    ...{ 'onClick': {} },
                    type: "primary",
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_71));
                let __VLS_75;
                const __VLS_76 = {
                    /** @type {typeof __VLS_75.click} */
                    onClick: (...[$event]) => {
                        if (!(item.isValid))
                            throw 0;
                        if (!(key === 'app_secret'))
                            throw 0;
                        return __VLS_ctx.toggleShowPassword(item.key);
                        // @ts-ignore
                        [toggleShowPassword,];
                    },
                };
                const { default: __VLS_77 } = __VLS_73.slots;
                if (key === 'app_secret' && !__VLS_ctx.showPassword[item.key]?.[key]) {
                    let __VLS_78;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
                        iconName: "app-password-hide",
                    }));
                    const __VLS_80 = __VLS_79({
                        iconName: "app-password-hide",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
                }
                if (key === 'app_secret' && __VLS_ctx.showPassword[item.key]?.[key]) {
                    let __VLS_83;
                    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                    elIcon;
                    // @ts-ignore
                    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({}));
                    const __VLS_85 = __VLS_84({}, ...__VLS_functionalComponentArgsRest(__VLS_84));
                    const { default: __VLS_88 } = __VLS_86.slots;
                    let __VLS_89;
                    /** @ts-ignore @type { | typeof __VLS_components.View} */
                    View;
                    // @ts-ignore
                    const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({}));
                    const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
                    // @ts-ignore
                    [showPassword, showPassword,];
                    var __VLS_86;
                }
                // @ts-ignore
                [];
                var __VLS_73;
                var __VLS_74;
            }
            // @ts-ignore
            [];
            var __VLS_48;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_42;
        let __VLS_94;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_96 = __VLS_95({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        let __VLS_99;
        const __VLS_100 = {
            /** @type {typeof __VLS_99.click} */
            onClick: (...[$event]) => {
                if (!(item.isValid))
                    throw 0;
                return __VLS_ctx.showDialog(item);
                // @ts-ignore
                [showDialog,];
            },
        };
        const { default: __VLS_101 } = __VLS_97.slots;
        (__VLS_ctx.$t('common.edit'));
        // @ts-ignore
        [$t,];
        var __VLS_97;
        var __VLS_98;
        let __VLS_102;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
            ...{ 'onClick': {} },
        }));
        const __VLS_104 = __VLS_103({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_103));
        let __VLS_107;
        const __VLS_108 = {
            /** @type {typeof __VLS_107.click} */
            onClick: (...[$event]) => {
                if (!(item.isValid))
                    throw 0;
                return __VLS_ctx.validateConnection(item);
                // @ts-ignore
                [validateConnection,];
            },
        };
        const { default: __VLS_109 } = __VLS_105.slots;
        (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.validate'));
        // @ts-ignore
        [$t,];
        var __VLS_105;
        var __VLS_106;
    }
    // @ts-ignore
    [];
    var __VLS_36;
    // @ts-ignore
    [];
    var __VLS_9;
    // @ts-ignore
    [];
}
const __VLS_110 = EditModel;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    ...{ 'onRefresh': {} },
    ref: "EditModelRef",
}));
const __VLS_112 = __VLS_111({
    ...{ 'onRefresh': {} },
    ref: "EditModelRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
let __VLS_115;
const __VLS_116 = {
    /** @type {typeof __VLS_115.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_117;
var __VLS_113;
var __VLS_114;
// @ts-ignore
[refresh,];
var __VLS_3;
// @ts-ignore
var __VLS_118 = __VLS_117;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
