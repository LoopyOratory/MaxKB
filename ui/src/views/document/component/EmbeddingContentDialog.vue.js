/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const dialogVisible = ref(false);
const state = ref('error');
const stateMap = {
    all: ['0', '1', '2', '3', '4', '5', 'n'],
    error: ['0', '1', '3', '4', '5', 'n']
};
const submit_handle = ref();
const submit = () => {
    if (submit_handle.value) {
        submit_handle.value(stateMap[state.value]);
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
    title: (__VLS_ctx.$t('components.selectParagraph.title')),
    beforeClose: (__VLS_ctx.close),
    width: "450",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('components.selectParagraph.title')),
    beforeClose: (__VLS_ctx.close),
    width: "450",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.state),
    ...{ class: "radio-block" },
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.state),
    ...{ class: "radio-block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    value: "error",
    size: "large",
}));
const __VLS_15 = __VLS_14({
    value: "error",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
(__VLS_ctx.$t('components.selectParagraph.error'));
// @ts-ignore
[dialogVisible, $t, $t, close, state,];
var __VLS_16;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    value: "all",
    size: "large",
}));
const __VLS_21 = __VLS_20({
    value: "all",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
(__VLS_ctx.$t('components.selectParagraph.all'));
// @ts-ignore
[$t,];
var __VLS_22;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_25 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_31;
    const __VLS_32 = {
        /** @type {typeof __VLS_31.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_33 } = __VLS_29.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_29;
    var __VLS_30;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = {
        /** @type {typeof __VLS_39.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_41 } = __VLS_37.slots;
    (__VLS_ctx.$t('common.submit'));
    // @ts-ignore
    [$t, submit,];
    var __VLS_37;
    var __VLS_38;
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
