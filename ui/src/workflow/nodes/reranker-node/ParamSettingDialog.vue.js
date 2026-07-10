/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash';
const emit = defineEmits(['refresh']);
const paramFormRef = ref();
const form = ref({
    top_n: 3,
    similarity: 0,
    max_paragraph_char_number: 5000,
});
const dialogVisible = ref(false);
const loading = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            top_n: 3,
            similarity: 0,
            max_paragraph_char_number: 5000,
        };
    }
});
const open = (data) => {
    form.value = { ...form.value, ...cloneDeep(data) };
    dialogVisible.value = true;
};
const submit = () => {
    paramFormRef?.value?.validate((valid, fields) => {
        if (valid) {
            emit('refresh', cloneDeep(form.value));
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
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
    ...{ class: "param-dialog" },
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
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
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    gutter: (12),
}));
const __VLS_17 = __VLS_16({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    span: (12),
}));
const __VLS_23 = __VLS_22({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
{
    const { label: __VLS_33 } = __VLS_30.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('workflow.nodes.rerankerNode.higher'));
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        effect: "dark",
        content: (__VLS_ctx.$t('workflow.nodes.rerankerNode.ScoreTooltip')),
        placement: "right",
    }));
    const __VLS_36 = __VLS_35({
        effect: "dark",
        content: (__VLS_ctx.$t('workflow.nodes.rerankerNode.ScoreTooltip')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    const { default: __VLS_39 } = __VLS_37.slots;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_42 = __VLS_41({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, $t, $t, dialogVisible, form,];
    var __VLS_37;
    // @ts-ignore
    [];
}
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.form.similarity),
    min: (0),
    max: (__VLS_ctx.form.search_mode === 'blend' ? 2 : 1),
    precision: (3),
    step: (0.1),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.form.similarity),
    min: (0),
    max: (__VLS_ctx.form.search_mode === 'blend' ? 2 : 1),
    precision: (3),
    step: (0.1),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[form, form,];
var __VLS_30;
// @ts-ignore
[];
var __VLS_24;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    span: (12),
}));
const __VLS_52 = __VLS_51({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    label: (__VLS_ctx.$t('views.application.dialog.topReferences')),
}));
const __VLS_58 = __VLS_57({
    label: (__VLS_ctx.$t('views.application.dialog.topReferences')),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    modelValue: (__VLS_ctx.form.top_n),
    min: (1),
    max: (10000),
    valueOnClear: (1),
    controlsPosition: "right",
    ...{ class: "w-full" },
}));
const __VLS_64 = __VLS_63({
    modelValue: (__VLS_ctx.form.top_n),
    min: (1),
    max: (10000),
    valueOnClear: (1),
    controlsPosition: "right",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, form,];
var __VLS_59;
// @ts-ignore
[];
var __VLS_53;
// @ts-ignore
[];
var __VLS_18;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    label: (__VLS_ctx.$t('views.application.dialog.maxCharacters')),
}));
const __VLS_69 = __VLS_68({
    label: (__VLS_ctx.$t('views.application.dialog.maxCharacters')),
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_72 } = __VLS_70.slots;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
elSlider;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    modelValue: (__VLS_ctx.form.max_paragraph_char_number),
    showInput: true,
    showInputControls: (false),
    min: (500),
    max: (100000),
    ...{ class: "custom-slider" },
}));
const __VLS_75 = __VLS_74({
    modelValue: (__VLS_ctx.form.max_paragraph_char_number),
    showInput: true,
    showInputControls: (false),
    min: (500),
    max: (100000),
    ...{ class: "custom-slider" },
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
/** @type {__VLS_StyleScopedClasses['custom-slider']} */ ;
// @ts-ignore
[$t, form,];
var __VLS_70;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_78 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_79;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
        ...{ 'onClick': {} },
    }));
    const __VLS_81 = __VLS_80({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    let __VLS_84;
    const __VLS_85 = {
        /** @type {typeof __VLS_84.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_86 } = __VLS_82.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_82;
    var __VLS_83;
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_92;
    const __VLS_93 = {
        /** @type {typeof __VLS_92.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit();
            // @ts-ignore
            [loading, submit,];
        },
    };
    const { default: __VLS_94 } = __VLS_90.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_90;
    var __VLS_91;
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
