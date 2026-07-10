/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import SystemHeader from '@/layout/layout-header/SystemHeader.vue';
import Sidebar from '@/layout/components/sidebar/index.vue';
import AppMain from '@/layout/app-main/index.vue';
import useStore from '@/stores';
const { theme, user } = useStore();
const isDefaultTheme = computed(() => {
    return theme.isDefaultTheme();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-layout" },
});
/** @type {__VLS_StyleScopedClasses['app-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-header" },
    ...{ class: (!__VLS_ctx.isDefaultTheme ? 'custom-header' : '') },
});
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
if (__VLS_ctx.user.isExpire()) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
    elAlert;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        title: (__VLS_ctx.$t('layout.isExpire')),
        type: "warning",
        ...{ class: "border-b" },
        showIcon: true,
        closable: (false),
    }));
    const __VLS_2 = __VLS_1({
        title: (__VLS_ctx.$t('layout.isExpire')),
        type: "warning",
        ...{ class: "border-b" },
        showIcon: true,
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
}
const __VLS_5 = SystemHeader;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-main" },
    ...{ class: (__VLS_ctx.user.isExpire() ? 'isExpire' : '') },
});
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.layoutContainer | typeof __VLS_components.LayoutContainer | typeof __VLS_components['layout-container'] | typeof __VLS_components.layoutContainer | typeof __VLS_components.LayoutContainer | typeof __VLS_components['layout-container']} */
layoutContainer;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
{
    const { left: __VLS_16 } = __VLS_13.slots;
    const __VLS_17 = Sidebar;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    // @ts-ignore
    [isDefaultTheme, user, user, $t,];
}
const __VLS_22 = AppMain;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
// @ts-ignore
[];
var __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
