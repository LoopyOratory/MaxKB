/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
const router = useRouter();
const route = useRoute();
const props = defineProps();
const isActive = computed(() => {
    const { name, path, meta } = route;
    return (name == props.menu.name && path == props.menu.path) || meta?.activeMenu == props.menu.path;
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.router.push({ name: __VLS_ctx.menu.name });
            // @ts-ignore
            [router, menu,];
        } },
    ...{ class: "menu-item-container h-full border-r-6" },
    ...{ class: (__VLS_ctx.isActive ? 'active' : '') },
});
/** @type {__VLS_StyleScopedClasses['menu-item-container']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    iconName: (__VLS_ctx.isActive ? __VLS_ctx.menu.meta?.iconActive || __VLS_ctx.menu.meta?.icon : __VLS_ctx.menu?.meta?.icon),
    ...{ style: {} },
    ...{ class: "mr-4" },
}));
const __VLS_2 = __VLS_1({
    iconName: (__VLS_ctx.isActive ? __VLS_ctx.menu.meta?.iconActive || __VLS_ctx.menu.meta?.icon : __VLS_ctx.menu?.meta?.icon),
    ...{ style: {} },
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "title-text" },
});
/** @type {__VLS_StyleScopedClasses['title-text']} */ ;
(__VLS_ctx.$t(__VLS_ctx.menu.meta?.title));
// @ts-ignore
[menu, menu, menu, menu, isActive, isActive, $t,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
