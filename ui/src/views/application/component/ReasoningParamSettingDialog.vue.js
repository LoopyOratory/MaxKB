/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
const emit = defineEmits(['refresh']);
const form = ref({
    reasoning_content_start: '<think>',
    reasoning_content_end: '</think>'
});
const dialogVisible = ref(false);
const loading = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            reasoning_content_start: '<think>',
            reasoning_content_end: '</think>'
        };
    }
});
const open = (data) => {
    form.value = { ...form.value, ...data };
    dialogVisible.value = true;
};
const submit = () => {
    emit('refresh', form.value);
    dialogVisible.value = false;
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
    alignCenter: true,
    title: (__VLS_ctx.$t('common.setting')),
    ...{ class: "param-dialog" },
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    title: (__VLS_ctx.$t('common.setting')),
    ...{ class: "param-dialog" },
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['param-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    type: "info",
    ...{ class: "color-secondary" },
}));
const __VLS_17 = __VLS_16({
    type: "info",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_20 } = __VLS_18.slots;
(__VLS_ctx.$t('views.application.form.reasoningContent.tooltip'));
// @ts-ignore
[$t, $t, dialogVisible, form,];
var __VLS_18;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ class: "mt-16" },
    gutter: (20),
}));
const __VLS_23 = __VLS_22({
    ...{ class: "mt-16" },
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    span: (12),
}));
const __VLS_29 = __VLS_28({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    label: (__VLS_ctx.$t('views.application.form.reasoningContent.start')),
}));
const __VLS_35 = __VLS_34({
    label: (__VLS_ctx.$t('views.application.form.reasoningContent.start')),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    type: "textarea",
    modelValue: (__VLS_ctx.form.reasoning_content_start),
    rows: (6),
    maxlength: "50",
    placeholder: "<think>",
}));
const __VLS_41 = __VLS_40({
    type: "textarea",
    modelValue: (__VLS_ctx.form.reasoning_content_start),
    rows: (6),
    maxlength: "50",
    placeholder: "<think>",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
// @ts-ignore
[$t, form,];
var __VLS_36;
// @ts-ignore
[];
var __VLS_30;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    span: (12),
}));
const __VLS_46 = __VLS_45({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    label: (__VLS_ctx.$t('views.application.form.reasoningContent.end')),
}));
const __VLS_52 = __VLS_51({
    label: (__VLS_ctx.$t('views.application.form.reasoningContent.end')),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    type: "textarea",
    modelValue: (__VLS_ctx.form.reasoning_content_end),
    rows: (6),
    maxlength: "50",
    placeholder: "</think>",
}));
const __VLS_58 = __VLS_57({
    type: "textarea",
    modelValue: (__VLS_ctx.form.reasoning_content_end),
    rows: (6),
    maxlength: "50",
    placeholder: "</think>",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
// @ts-ignore
[$t, form,];
var __VLS_53;
// @ts-ignore
[];
var __VLS_47;
// @ts-ignore
[];
var __VLS_24;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_61 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer p-16" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-16']} */ ;
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        ...{ 'onClick': {} },
    }));
    const __VLS_64 = __VLS_63({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    let __VLS_67;
    const __VLS_68 = {
        /** @type {typeof __VLS_67.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_69 } = __VLS_65.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_65;
    var __VLS_66;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_72 = __VLS_71({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    let __VLS_75;
    const __VLS_76 = {
        /** @type {typeof __VLS_75.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit();
            // @ts-ignore
            [loading, submit,];
        },
    };
    const { default: __VLS_77 } = __VLS_73.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_73;
    var __VLS_74;
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
    emits: {},
});
export default {};
