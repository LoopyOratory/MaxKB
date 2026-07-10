/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
defineOptions({ name: 'ToolIcon' });
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
if (__VLS_ctx.type == 'MCP') {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_2 = __VLS_1({
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    const { default: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/tool/icon_mcp.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_3;
}
else if (__VLS_ctx.type == 'SKILL') {
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
        src: "@/assets/tool/icon_skill.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_10;
}
else if (__VLS_ctx.type == 'DATA_SOURCE') {
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
        src: "@/assets/tool/icon_datasource.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_17;
}
else if (__VLS_ctx.type == 'WORKFLOW') {
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        ...{ class: "avatar-green" },
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_23 = __VLS_22({
        ...{ class: "avatar-green" },
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    var __VLS_26;
    /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
    const { default: __VLS_27 } = __VLS_24.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/workflow/logo_workflow.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [type, size,];
    var __VLS_24;
}
else {
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        ...{ class: "avatar-green" },
        shape: "square",
        size: (__VLS_ctx.size),
    }));
    const __VLS_30 = __VLS_29({
        ...{ class: "avatar-green" },
        shape: "square",
        size: (__VLS_ctx.size),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    var __VLS_33;
    /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
    const { default: __VLS_34 } = __VLS_31.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/tool/icon_tool.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [size,];
    var __VLS_31;
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
