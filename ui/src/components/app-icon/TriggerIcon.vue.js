/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
defineOptions({ name: 'TriggerIcon' });
const props = defineProps({
    type: {
        type: [String, Number],
        default: '',
    },
    size: {
        type: [String, Number],
        default: 32,
    },
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (__VLS_ctx.type == 'EVENT') {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "avatar-orange" },
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "avatar-orange" },
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    /** @type {__VLS_StyleScopedClasses['avatar-orange']} */ ;
    const { default: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/trigger/icon_event.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_3;
}
else {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_9 = __VLS_8({
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    var __VLS_12;
    const { default: __VLS_13 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/trigger/icon_scheduled.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [size,];
    var __VLS_10;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        type: {
            type: [String, Number],
            default: '',
        },
        size: {
            type: [String, Number],
            default: 32,
        },
    },
});
export default {};
