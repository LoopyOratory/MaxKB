/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const dialogVisible = ref(false);
const with_source_file = ref(false);
const submit_handle = ref();
const submit = () => {
    if (submit_handle.value) {
        submit_handle.value(with_source_file.value);
    }
    close();
};
const open = (handle) => {
    submit_handle.value = handle;
    dialogVisible.value = true;
};
const close = () => {
    submit_handle.value = undefined;
    dialogVisible.value = false;
};
const __VLS_exposed = { open, close };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.document.setting.exportKnowledge')),
    beforeClose: (__VLS_ctx.close),
    width: "450",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.document.setting.exportKnowledge')),
    beforeClose: (__VLS_ctx.close),
    width: "450",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.with_source_file),
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.with_source_file),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "bold mb-8" },
});
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary pre-wrap line-height-22" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
// @ts-ignore
[dialogVisible, $t, close, with_source_file,];
var __VLS_10;
{
    const { footer: __VLS_13 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ 'onClick': {} },
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_19;
    const __VLS_20 = {
        /** @type {typeof __VLS_19.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_21 } = __VLS_17.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_17;
    var __VLS_18;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_27;
    const __VLS_28 = {
        /** @type {typeof __VLS_27.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_29 } = __VLS_25.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, submit,];
    var __VLS_25;
    var __VLS_26;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
