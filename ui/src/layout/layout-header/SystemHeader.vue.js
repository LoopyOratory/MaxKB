/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { RoleConst } from '@/utils/permission/data';
import Avatar from './avatar/index.vue';
import TopAbout from './top-about/index.vue';
import { useRouter } from 'vue-router';
import { hasPermission } from '@/utils/permission';
const router = useRouter();
const goHome = () => {
    router.push('/');
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-top-bar-container border-b flex-center" },
});
/** @type {__VLS_StyleScopedClasses['app-top-bar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo mt-4" },
});
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.LogoFull} */
LogoFull;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between w-full align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
let __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    ...{ class: "ml-16 mr-16" },
    direction: "vertical",
}));
const __VLS_7 = __VLS_6({
    ...{ class: "ml-16 mr-16" },
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
(__VLS_ctx.$t('views.system.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mr-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
const __VLS_10 = TopAbout || TopAbout;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    type: "system",
}));
const __VLS_12 = __VLS_11({
    type: "system",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ...{ class: "ml-8 mr-8" },
    direction: "vertical",
}));
const __VLS_17 = __VLS_16({
    ...{ class: "ml-8 mr-8" },
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
if (__VLS_ctx.hasPermission([
    __VLS_ctx.RoleConst.USER.getWorkspaceRole,
    __VLS_ctx.RoleConst.EXTENDS_USER.getWorkspaceRole,
    __VLS_ctx.RoleConst.EXTENDS_WORKSPACE_MANAGE.getWorkspaceRole,
    __VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
], 'OR')) {
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        link: true,
        ...{ style: {} },
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        link: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_25;
    const __VLS_26 = {
        /** @type {typeof __VLS_25.click} */
        onClick: (__VLS_ctx.goHome),
    };
    const { default: __VLS_27 } = __VLS_23.slots;
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        ...{ class: "mr-8" },
        iconName: "app-workspace",
        ...{ style: {} },
    }));
    const __VLS_30 = __VLS_29({
        ...{ class: "mr-8" },
        iconName: "app-workspace",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.workspace.toWorkspace'));
    // @ts-ignore
    [$t, $t, hasPermission, RoleConst, RoleConst, RoleConst, RoleConst, goHome,];
    var __VLS_23;
    var __VLS_24;
}
const __VLS_33 = Avatar || Avatar;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
