/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getChildRouteListByPathAndName } from '@/router/index';
import SidebarItem from './SidebarItem.vue';
import AppBreadcrumb from './../breadcrumb/index.vue';
const route = useRoute();
const showBreadcrumb = computed(() => {
    const { meta } = route;
    return meta?.breadcrumb;
});
const subMenuList = computed(() => {
    const { meta } = route;
    return getChildRouteListByPathAndName(meta.parentPath, meta.parentName);
});
const activeMenu = computed(() => {
    const { path, meta } = route;
    return meta.active || path;
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar p-8" },
});
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
if (__VLS_ctx.showBreadcrumb) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_0 = AppBreadcrumb;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
let __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    wrapClass: "scrollbar-wrapper",
}));
const __VLS_7 = __VLS_6({
    wrapClass: "scrollbar-wrapper",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_10 } = __VLS_8.slots;
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components['el-menu'] | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components['el-menu']} */
elMenu;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    defaultActive: (__VLS_ctx.activeMenu),
    router: true,
}));
const __VLS_13 = __VLS_12({
    defaultActive: (__VLS_ctx.activeMenu),
    router: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_16 } = __VLS_14.slots;
for (const [menu, index] of __VLS_vFor((__VLS_ctx.subMenuList))) {
    const __VLS_17 = SidebarItem || SidebarItem;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        key: (index),
        menu: (menu),
        activeMenu: (__VLS_ctx.activeMenu),
    }));
    const __VLS_19 = __VLS_18({
        key: (index),
        menu: (menu),
        activeMenu: (__VLS_ctx.activeMenu),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (menu.meta?.permission) }, null, null);
    // @ts-ignore
    [showBreadcrumb, activeMenu, activeMenu, subMenuList, vHasPermission,];
}
// @ts-ignore
[];
var __VLS_14;
// @ts-ignore
[];
var __VLS_8;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
