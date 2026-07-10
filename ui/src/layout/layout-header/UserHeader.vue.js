/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TopMenu from './top-menu/index.vue';
import Avatar from './avatar/index.vue';
import TopAbout from './top-about/index.vue';
import { EditionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import useStore from '@/stores';
const router = useRouter();
const route = useRoute();
const { user } = useStore();
const currentWorkspace = computed(() => {
    return user.workspace_list.find((w) => w.id == user.workspace_id);
});
function changeWorkspace(item) {
    const { meta: { activeMenu }, } = route;
    if (item.id === user.workspace_id)
        return;
    user.setWorkspaceId(item.id || 'default');
    if (activeMenu.includes('application') && route.path != '/application') {
        router.push('/application');
    }
    else if (activeMenu.includes('knowledge') && route.path != '/knowledge') {
        router.push('/knowledge');
    }
    else {
        window.location.reload();
    }
}
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
    ...{ class: "flex-between w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-24 flex align-center w-120" },
});
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-120']} */ ;
if (__VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')) {
    let __VLS_5;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        ...{ class: "mr-8" },
        direction: "vertical",
    }));
    const __VLS_7 = __VLS_6({
        ...{ class: "mr-8" },
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
}
if (__VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')) {
    let __VLS_10;
    /** @ts-ignore @type { | typeof __VLS_components.WorkspaceDropdown} */
    WorkspaceDropdown;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        ...{ 'onChangeWorkspace': {} },
        data: (__VLS_ctx.user.workspace_list),
        currentWorkspace: (__VLS_ctx.currentWorkspace),
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onChangeWorkspace': {} },
        data: (__VLS_ctx.user.workspace_list),
        currentWorkspace: (__VLS_ctx.currentWorkspace),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_15;
    const __VLS_16 = {
        /** @type {typeof __VLS_15.changeWorkspace} */
        onChangeWorkspace: (__VLS_ctx.changeWorkspace),
    };
    var __VLS_13;
    var __VLS_14;
}
const __VLS_17 = TopMenu || TopMenu;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const __VLS_22 = TopAbout || TopAbout;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    ...{ class: "mr-12" },
}));
const __VLS_24 = __VLS_23({
    ...{ class: "mr-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
const __VLS_27 = Avatar || Avatar;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
// @ts-ignore
[hasPermission, hasPermission, EditionConst, EditionConst, user, currentWorkspace, changeWorkspace,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
