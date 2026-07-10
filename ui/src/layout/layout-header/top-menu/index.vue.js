/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { getChildRouteListByPathAndName } from '@/router/index';
import { hasPermission } from '@/utils/permission/index';
import MenuItem from './MenuItem.vue';
const topMenuList = computed(() => {
    const menu = getChildRouteListByPathAndName('/', 'root').filter((item) => item.meta?.menu &&
        (item.meta.permission ? hasPermission(item.meta.permission, 'OR') : true));
    menu.sort((a, b) => (a.meta ? (a.meta.order ? a.meta.order : 1) : 1) -
        (b.meta ? (b.meta.order ? b.meta.order : 1) : 1));
    return menu;
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "top-menu-container flex align-center h-full" },
});
/** @type {__VLS_StyleScopedClasses['top-menu-container']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
for (const [menu, index] of __VLS_vFor((__VLS_ctx.topMenuList))) {
    const __VLS_0 = MenuItem || MenuItem;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        menu: (menu),
        key: (index),
    }));
    const __VLS_2 = __VLS_1({
        menu: (menu),
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (menu.meta?.permission) }, null, null);
    // @ts-ignore
    [topMenuList, vHasPermission,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
