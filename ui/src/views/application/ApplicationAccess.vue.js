/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, onMounted, computed } from 'vue';
import AccessSettingDrawer from './component/AccessSettingDrawer.vue';
import { MsgSuccess } from '@/utils/message';
import { useRoute } from 'vue-router';
import { t } from '@/locales';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap['application'][apiType.value];
});
// PlatformData
const platforms = reactive([
    {
        key: 'wecomBot',
        logoSrc: new URL(`../../assets/logo/logo_wechat-bot.svg`, import.meta.url).href,
        name: t('views.application.applicationAccess.wecomBot'),
        description: t('views.application.applicationAccess.wecomBotTip'),
        isActive: false,
        exists: false,
    },
    {
        key: 'wecom',
        logoSrc: new URL(`../../assets/logo/logo_wechat-work.svg`, import.meta.url).href,
        name: t('views.application.applicationAccess.wecom'),
        description: t('views.application.applicationAccess.wecomTip'),
        isActive: false,
        exists: false,
    },
    {
        key: 'dingtalk',
        logoSrc: new URL(`../../assets/logo/logo_dingtalk.svg`, import.meta.url).href,
        name: t('views.application.applicationAccess.dingtalk'),
        description: t('views.application.applicationAccess.dingtalkTip'),
        isActive: false,
        exists: false,
    },
    {
        key: 'wechat',
        logoSrc: new URL(`../../assets/logo/logo_wechat.svg`, import.meta.url).href,
        name: t('views.application.applicationAccess.wechat'),
        description: t('views.application.applicationAccess.wechatTip'),
        isActive: false,
        exists: false,
    },
    {
        key: 'lark',
        logoSrc: new URL(`../../assets/logo/logo_lark.svg`, import.meta.url).href,
        name: t('views.application.applicationAccess.lark'),
        description: t('views.application.applicationAccess.larkTip'),
        isActive: false,
        exists: false,
    },
    {
        key: 'slack',
        logoSrc: new URL(`../../assets/logo/logo_slack.svg`, import.meta.url).href,
        name: t('views.application.applicationAccess.slack'),
        description: t('views.application.applicationAccess.slackTip'),
        isActive: false,
        exists: false,
    },
]);
const AccessSettingDrawerRef = ref();
const loading = ref(false);
const { params: { id }, } = route;
function openDrawer(key) {
    AccessSettingDrawerRef.value.open(id, key);
}
function refresh() {
    getPlatformStatus();
}
function getPlatformStatus() {
    loading.value = true;
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getPlatformStatus(id)
        .then((res) => {
        platforms.forEach((platform) => {
            platform.isActive = res.data[platform.key][1];
            platform.exists = res.data[platform.key][0];
        });
        loading.value = false;
    });
}
function changeStatus(type, value) {
    const data = {
        type: type,
        status: value,
    };
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .updatePlatformStatus(id, data)
        .then(() => {
        MsgSuccess(t('common.saveSuccess'));
    });
}
onMounted(() => {
    getPlatformStatus();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.application.applicationAccess.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (16),
}));
const __VLS_2 = __VLS_1({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.platforms))) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        xs: (24),
        sm: (24),
        md: (12),
        lg: (12),
        xl: (12),
        ...{ class: "mb-16" },
        key: (index),
    }));
    const __VLS_8 = __VLS_7({
        xs: (24),
        sm: (24),
        md: (12),
        lg: (12),
        xl: (12),
        ...{ class: "mb-16" },
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_11 } = __VLS_9.slots;
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        shadow: "never",
        ...{ class: "border-none cursor" },
    }));
    const __VLS_14 = __VLS_13({
        shadow: "never",
        ...{ class: "border-none cursor" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['border-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center ml-8 mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (item.logoSrc),
        alt: "",
        ...{ class: "icon" },
    });
    /** @type {__VLS_StyleScopedClasses['icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-12" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (item.name);
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        type: "info",
        ...{ class: "font-small" },
    }));
    const __VLS_20 = __VLS_19({
        type: "info",
        ...{ class: "font-small" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    const { default: __VLS_23 } = __VLS_21.slots;
    (item.description);
    // @ts-ignore
    [$t, platforms,];
    var __VLS_21;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.permissionPrecise.access_edit(__VLS_ctx.id)) {
        let __VLS_24;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            ...{ 'onChange': {} },
            size: "small",
            modelValue: (item.isActive),
            disabled: (!item.exists),
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onChange': {} },
            size: "small",
            modelValue: (item.isActive),
            disabled: (!item.exists),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_29;
        const __VLS_30 = {
            /** @type {typeof __VLS_29.change} */
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.access_edit(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.changeStatus(item.key, item.isActive);
                // @ts-ignore
                [permissionPrecise, id, changeStatus,];
            },
        };
        var __VLS_27;
        var __VLS_28;
    }
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        direction: "vertical",
    }));
    const __VLS_33 = __VLS_32({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    if (__VLS_ctx.permissionPrecise.access_edit(__VLS_ctx.id)) {
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
            ...{ 'onClick': {} },
            ...{ class: "mr-4" },
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onClick': {} },
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_41;
        const __VLS_42 = {
            /** @type {typeof __VLS_41.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.access_edit(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.openDrawer(item.key);
                // @ts-ignore
                [permissionPrecise, id, openDrawer,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        const { default: __VLS_43 } = __VLS_39.slots;
        (__VLS_ctx.$t('views.application.applicationAccess.setting'));
        // @ts-ignore
        [$t,];
        var __VLS_39;
        var __VLS_40;
    }
    // @ts-ignore
    [];
    var __VLS_15;
    // @ts-ignore
    [];
    var __VLS_9;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
const __VLS_44 = AccessSettingDrawer;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onRefresh': {} },
    ref: "AccessSettingDrawerRef",
}));
const __VLS_46 = __VLS_45({
    ...{ 'onRefresh': {} },
    ref: "AccessSettingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    /** @type {typeof __VLS_49.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_51;
var __VLS_47;
var __VLS_48;
// @ts-ignore
var __VLS_52 = __VLS_51;
// @ts-ignore
[refresh,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
