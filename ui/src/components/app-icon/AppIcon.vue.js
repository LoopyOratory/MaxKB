/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { iconMap } from './index';
import { computed } from 'vue';
defineOptions({ name: 'AppIcon' });
const props = withDefaults(defineProps(), {
    iconName: 'app-404',
});
const isIconfont = computed(() => props.iconName?.includes('app-'));
const __VLS_defaults = {
    iconName: 'app-404',
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
if (__VLS_ctx.isIconfont) {
    const __VLS_0 = (Object.keys(__VLS_ctx.iconMap).includes(__VLS_ctx.iconName)
        ? __VLS_ctx.iconMap[__VLS_ctx.iconName].iconReader()
        : __VLS_ctx.iconMap['app-404'].iconReader());
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "el-icon app-icon" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "el-icon app-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    /** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['app-icon']} */ ;
    var __VLS_3;
}
else if (__VLS_ctx.iconName) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
    const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
    var __VLS_11;
    const { default: __VLS_12 } = __VLS_9.slots;
    const __VLS_13 = (__VLS_ctx.iconName);
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    // @ts-ignore
    [isIconfont, iconMap, iconMap, iconMap, iconName, iconName, iconName, iconName,];
    var __VLS_9;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
