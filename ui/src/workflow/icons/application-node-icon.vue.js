/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { isAppIcon } from '@/utils/common';
const props = defineProps();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (__VLS_ctx.isAppIcon(__VLS_ctx.item?.icon)) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        shape: "square",
        size: (__VLS_ctx.size || 32),
        ...{ style: {} },
        ...{ class: "mr-8" },
    }));
    const __VLS_2 = __VLS_1({
        shape: "square",
        size: (__VLS_ctx.size || 32),
        ...{ style: {} },
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    const { default: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.item?.icon),
        alt: "",
    });
    // @ts-ignore
    [isAppIcon, item, item, size,];
    var __VLS_3;
}
else {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
    LogoIcon;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        height: (`${__VLS_ctx.size}px`),
    }));
    const __VLS_9 = __VLS_8({
        height: (`${__VLS_ctx.size}px`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    var __VLS_12;
    var __VLS_10;
}
// @ts-ignore
[size,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
