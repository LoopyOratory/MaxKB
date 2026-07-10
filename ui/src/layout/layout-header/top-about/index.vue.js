/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import useStore from '@/stores';
import { hasPermission } from '@/utils/permission';
import { EditionConst, PermissionConst, RoleConst } from '@/utils/permission/data';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const { theme, user } = useStore();
const __VLS_props = withDefaults(defineProps(), {
    type: 'workspace',
});
function toUrl(url) {
    window.open(url, '_blank');
}
const __VLS_defaults = {
    type: 'workspace',
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center top-about" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['top-about']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    round: true,
    ...{ class: "pricing-button mr-8" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    round: true,
    ...{ class: "pricing-button mr-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.toUrl('https://maxkb.cn/pricing.html');
        // @ts-ignore
        [toUrl,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.EditionConst.IS_CE) }, null, null);
/** @type {__VLS_StyleScopedClasses['pricing-button']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    iconName: "app-pricing",
    ...{ class: "mr-8" },
}));
const __VLS_10 = __VLS_9({
    iconName: "app-pricing",
    ...{ class: "mr-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
(__VLS_ctx.$t('common.upgrade'));
// @ts-ignore
[vHasPermission, EditionConst, $t,];
var __VLS_3;
var __VLS_4;
if (__VLS_ctx.hasPermission([
    __VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
    __VLS_ctx.PermissionConst.TRIGGER_READ.getWorkspacePermissionWorkspaceManageRole,
], 'OR') && __VLS_ctx.type === 'workspace') {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        effect: "dark",
        content: (__VLS_ctx.$t('views.trigger.title')),
        placement: "top",
    }));
    const __VLS_15 = __VLS_14({
        effect: "dark",
        content: (__VLS_ctx.$t('views.trigger.title')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: (__VLS_ctx.route.path.includes('trigger') ? 'active' : '') },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: (__VLS_ctx.route.path.includes('trigger') ? 'active' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        /** @type {typeof __VLS_24.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.hasPermission([
                __VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
                __VLS_ctx.PermissionConst.TRIGGER_READ.getWorkspacePermissionWorkspaceManageRole,
            ], 'OR') && __VLS_ctx.type === 'workspace'))
                throw 0;
            return __VLS_ctx.router.push({ name: 'trigger' });
            // @ts-ignore
            [$t, hasPermission, RoleConst, PermissionConst, type, route, router,];
        },
    };
    const { default: __VLS_26 } = __VLS_22.slots;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        iconName: "app-trigger",
        ...{ class: (__VLS_ctx.route.path.includes('trigger') ? 'color-primary' : 'color-secondary') },
        ...{ style: {} },
    }));
    const __VLS_29 = __VLS_28({
        iconName: "app-trigger",
        ...{ class: (__VLS_ctx.route.path.includes('trigger') ? 'color-primary' : 'color-secondary') },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    // @ts-ignore
    [route,];
    var __VLS_22;
    var __VLS_23;
    // @ts-ignore
    [];
    var __VLS_16;
}
if (__VLS_ctx.theme.themeInfo?.showProject) {
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        effect: "dark",
        content: (__VLS_ctx.$t('layout.github')),
        placement: "top",
    }));
    const __VLS_34 = __VLS_33({
        effect: "dark",
        content: (__VLS_ctx.$t('layout.github')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const { default: __VLS_37 } = __VLS_35.slots;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_40 = __VLS_39({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    const __VLS_44 = {
        /** @type {typeof __VLS_43.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.theme.themeInfo?.showProject))
                throw 0;
            return __VLS_ctx.toUrl(__VLS_ctx.theme.themeInfo?.projectUrl);
            // @ts-ignore
            [toUrl, $t, theme, theme,];
        },
    };
    const { default: __VLS_45 } = __VLS_41.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        iconName: "app-github",
        ...{ class: "cursor color-secondary" },
        ...{ style: {} },
    }));
    const __VLS_48 = __VLS_47({
        iconName: "app-github",
        ...{ class: "cursor color-secondary" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_41;
    var __VLS_42;
    // @ts-ignore
    [];
    var __VLS_35;
}
if (__VLS_ctx.theme.themeInfo?.showUserManual) {
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        effect: "dark",
        content: (__VLS_ctx.$t('layout.wiki')),
        placement: "top",
    }));
    const __VLS_53 = __VLS_52({
        effect: "dark",
        content: (__VLS_ctx.$t('layout.wiki')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_56 } = __VLS_54.slots;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.theme.themeInfo?.showUserManual))
                throw 0;
            return __VLS_ctx.toUrl(__VLS_ctx.theme.themeInfo?.userManualUrl);
            // @ts-ignore
            [toUrl, $t, theme, theme,];
        },
    };
    const { default: __VLS_64 } = __VLS_60.slots;
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        iconName: "app-user-manual",
        ...{ class: "cursor color-secondary" },
        ...{ style: {} },
    }));
    const __VLS_67 = __VLS_66({
        iconName: "app-user-manual",
        ...{ class: "cursor color-secondary" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_60;
    var __VLS_61;
    // @ts-ignore
    [];
    var __VLS_54;
}
if (__VLS_ctx.theme.themeInfo?.showForum) {
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        effect: "dark",
        content: (__VLS_ctx.$t('layout.forum')),
        placement: "top",
    }));
    const __VLS_72 = __VLS_71({
        effect: "dark",
        content: (__VLS_ctx.$t('layout.forum')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_81;
    const __VLS_82 = {
        /** @type {typeof __VLS_81.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.theme.themeInfo?.showForum))
                throw 0;
            return __VLS_ctx.toUrl(__VLS_ctx.theme.themeInfo?.forumUrl);
            // @ts-ignore
            [toUrl, $t, theme, theme,];
        },
    };
    const { default: __VLS_83 } = __VLS_79.slots;
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        iconName: "app-problems",
        ...{ class: "cursor color-secondary" },
        ...{ style: {} },
    }));
    const __VLS_86 = __VLS_85({
        iconName: "app-problems",
        ...{ class: "cursor color-secondary" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_79;
    var __VLS_80;
    // @ts-ignore
    [];
    var __VLS_73;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
