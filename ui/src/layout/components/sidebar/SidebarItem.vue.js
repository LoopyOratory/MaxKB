/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isWorkFlow } from '@/utils/application';
const props = defineProps();
const router = useRouter();
const route = useRoute();
const { params: { id, type, from, folderId }, } = route;
function showMenu() {
    if (isWorkFlow(type)) {
        return props.menu.name !== 'AppHitTest';
    }
    else {
        return true;
    }
}
function clickHandle(item) {
    if (isWorkFlow(type) && item?.name === 'AppSetting') {
        router.push({ path: `/application/${from}/${id}/workflow` });
    }
    else if (type === '4' && item?.name === 'knowledgeWorkflowSetting') {
        router.push({ path: `/knowledge/${id}/${folderId}/workflow` });
    }
}
const menuIcon = computed(() => {
    if (props.activeMenu === props.menu.path) {
        return props.menu.meta?.iconActive || props.menu?.meta?.icon;
    }
    else {
        return props.menu?.meta?.icon;
    }
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
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
if ((!__VLS_ctx.menu.meta || !__VLS_ctx.menu.meta.hidden) && __VLS_ctx.showMenu()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "sidebar-item" },
    });
    /** @type {__VLS_StyleScopedClasses['sidebar-item']} */ ;
    if (__VLS_ctx.menu?.children && __VLS_ctx.menu?.children.length > 0) {
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.elSubMenu | typeof __VLS_components.ElSubMenu | typeof __VLS_components['el-sub-menu'] | typeof __VLS_components.elSubMenu | typeof __VLS_components.ElSubMenu | typeof __VLS_components['el-sub-menu']} */
        elSubMenu;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            index: (__VLS_ctx.menu.path),
            popperClass: "sidebar-container-popper",
        }));
        const __VLS_2 = __VLS_1({
            index: (__VLS_ctx.menu.path),
            popperClass: "sidebar-container-popper",
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        const { default: __VLS_5 } = __VLS_3.slots;
        {
            const { title: __VLS_6 } = __VLS_3.slots;
            if (__VLS_ctx.menu.meta && __VLS_ctx.menu.meta.icon) {
                let __VLS_7;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
                    iconName: (__VLS_ctx.menuIcon),
                    ...{ class: "sidebar-icon" },
                }));
                const __VLS_9 = __VLS_8({
                    iconName: (__VLS_ctx.menuIcon),
                    ...{ class: "sidebar-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_8));
                /** @type {__VLS_StyleScopedClasses['sidebar-icon']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.$t(__VLS_ctx.menu.meta?.title));
            // @ts-ignore
            [menu, menu, menu, menu, menu, menu, menu, menu, showMenu, menuIcon, $t,];
        }
        for (const [child, index] of __VLS_vFor((__VLS_ctx.menu?.children))) {
            let __VLS_12;
            /** @ts-ignore @type { | typeof __VLS_components.sidebarItem | typeof __VLS_components.SidebarItem | typeof __VLS_components['sidebar-item'] | typeof __VLS_components.sidebarItem | typeof __VLS_components.SidebarItem | typeof __VLS_components['sidebar-item']} */
            sidebarItem;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
                key: (index),
                menu: (child),
                activeMenu: (__VLS_ctx.activeMenu),
            }));
            const __VLS_14 = __VLS_13({
                key: (index),
                menu: (child),
                activeMenu: (__VLS_ctx.activeMenu),
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            __VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (child.meta?.permission) }, null, null);
            // @ts-ignore
            [menu, activeMenu, vHasPermission,];
        }
        // @ts-ignore
        [];
        var __VLS_3;
    }
    else {
        let __VLS_17;
        /** @ts-ignore @type { | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item'] | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item']} */
        elMenuItem;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
            ...{ 'onClick': {} },
            ref: "subMenu",
            index: (__VLS_ctx.menu.path),
            popperClass: "sidebar-popper",
        }));
        const __VLS_19 = __VLS_18({
            ...{ 'onClick': {} },
            ref: "subMenu",
            index: (__VLS_ctx.menu.path),
            popperClass: "sidebar-popper",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        let __VLS_22;
        const __VLS_23 = {
            /** @type {typeof __VLS_22.click} */
            onClick: (...[$event]) => {
                if (!((!__VLS_ctx.menu.meta || !__VLS_ctx.menu.meta.hidden) && __VLS_ctx.showMenu()))
                    throw 0;
                if (!!(__VLS_ctx.menu?.children && __VLS_ctx.menu?.children.length > 0))
                    throw 0;
                return __VLS_ctx.clickHandle(__VLS_ctx.menu);
                // @ts-ignore
                [menu, menu, clickHandle,];
            },
        };
        var __VLS_24;
        const { default: __VLS_26 } = __VLS_20.slots;
        {
            const { title: __VLS_27 } = __VLS_20.slots;
            if (__VLS_ctx.menu.meta && __VLS_ctx.menu.meta.icon) {
                let __VLS_28;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
                    iconName: (__VLS_ctx.menuIcon),
                    ...{ class: "sidebar-icon" },
                }));
                const __VLS_30 = __VLS_29({
                    iconName: (__VLS_ctx.menuIcon),
                    ...{ class: "sidebar-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_29));
                /** @type {__VLS_StyleScopedClasses['sidebar-icon']} */ ;
            }
            if (__VLS_ctx.menu.meta && __VLS_ctx.menu.meta.title) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.$t(__VLS_ctx.menu.meta?.title));
            }
            // @ts-ignore
            [menu, menu, menu, menu, menu, menuIcon, $t,];
        }
        // @ts-ignore
        [];
        var __VLS_20;
        var __VLS_21;
    }
}
// @ts-ignore
var __VLS_25 = __VLS_24;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
