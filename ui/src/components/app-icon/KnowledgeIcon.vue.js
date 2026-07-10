/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
defineOptions({ name: 'KnowledgeIcon' });
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
if (__VLS_ctx.type == 1) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "avatar-purple" },
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "avatar-purple" },
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
    const { default: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/icon_web.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_3;
}
else if (__VLS_ctx.type == 2) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ class: "avatar-purple" },
        shape: "square",
        size: (__VLS_ctx.size),
        ...{ style: {} },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: "avatar-purple" },
        shape: "square",
        size: (__VLS_ctx.size),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    var __VLS_12;
    /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
    const { default: __VLS_13 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/logo_lark.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_10;
}
else if (__VLS_ctx.type == 4) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ class: "avatar-purple" },
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_16 = __VLS_15({
        ...{ class: "avatar-purple" },
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    var __VLS_19;
    /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
    const { default: __VLS_20 } = __VLS_17.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/workflow/logo_workflow.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_17;
}
else {
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        ...{ class: "avatar-blue" },
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_23 = __VLS_22({
        ...{ class: "avatar-blue" },
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    var __VLS_26;
    /** @type {__VLS_StyleScopedClasses['avatar-blue']} */ ;
    const { default: __VLS_27 } = __VLS_24.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/icon_document.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [size,];
    var __VLS_24;
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
