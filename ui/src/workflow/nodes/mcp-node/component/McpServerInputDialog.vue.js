/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const emit = defineEmits();
const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref();
const form = ref({});
const input_field_list = ref([]);
function open(vars) {
    dialogVisible.value = true;
    input_field_list.value = vars;
}
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            emit('refresh', form.value);
            dialogVisible.value = false;
        }
    });
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
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
    width: "600",
    title: "Set variables",
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    width: "600",
    title: "Set variables",
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelPosition: "top",
    ref: "formRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "formRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.input_field_list))) {
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        label: (item),
        key: (item),
        prop: (item),
        rules: ({ required: true, message: __VLS_ctx.$t('dynamicsForm.tip.requiredMessage'), trigger: 'blur' }),
    }));
    const __VLS_17 = __VLS_16({
        label: (item),
        key: (item),
        prop: (item),
        rules: ({ required: true, message: __VLS_ctx.$t('dynamicsForm.tip.requiredMessage'), trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    const { default: __VLS_20 } = __VLS_18.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        modelValue: (__VLS_ctx.form[item]),
    }));
    const __VLS_23 = __VLS_22({
        modelValue: (__VLS_ctx.form[item]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    // @ts-ignore
    [dialogVisible, form, form, input_field_list, $t,];
    var __VLS_18;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_26 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        ...{ 'onClick': {} },
    }));
    const __VLS_29 = __VLS_28({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    let __VLS_32;
    const __VLS_33 = {
        /** @type {typeof __VLS_32.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_34 } = __VLS_30.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_30;
    var __VLS_31;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_37 = __VLS_36({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    let __VLS_40;
    const __VLS_41 = {
        /** @type {typeof __VLS_40.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.formRef);
            // @ts-ignore
            [loading, submit, formRef,];
        },
    };
    const { default: __VLS_42 } = __VLS_38.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_38;
    var __VLS_39;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
});
export default {};
