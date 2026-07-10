/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive } from 'vue';
import { isWorkFlow } from '@/utils/application';
import { t } from '@/locales';
import { cloneDeep } from 'lodash';
const emit = defineEmits(['refresh']);
const paramFormRef = ref();
const noReferencesformRef = ref();
const defaultValue = {
    ai_questioning: '{question}',
    designated_answer: t('views.application.dialog.designated_answer'),
};
const defaultPrompt = t('views.application.dialog.defaultPrompt1', {
    question: '{question}',
}) +
    '<data></data>' +
    t('views.application.dialog.defaultPrompt2');
const form = ref({
    knowledge_setting: {
        search_mode: 'embedding',
        top_n: 3,
        similarity: 0.6,
        max_paragraph_char_number: 5000,
        no_references_setting: {
            status: 'ai_questioning',
            value: '{question}',
        },
    },
    problem_optimization: false,
    problem_optimization_prompt: defaultPrompt,
});
const noReferencesform = ref({
    ai_questioning: defaultValue['ai_questioning'],
    designated_answer: defaultValue['designated_answer'],
});
const noReferencesRules = reactive({
    ai_questioning: [
        {
            required: true,
            message: t('views.application.form.aiModel.placeholder'),
            trigger: 'blur',
        },
    ],
    designated_answer: [
        {
            required: true,
            message: t('common.prompt.placeholder'),
            trigger: 'blur',
        },
    ],
});
const dialogVisible = ref(false);
const loading = ref(false);
const isWorkflowType = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        noReferencesform.value = {
            ai_questioning: defaultValue['ai_questioning'],
            designated_answer: defaultValue['designated_answer'],
        };
        noReferencesformRef.value?.clearValidate();
    }
});
const open = (data, type) => {
    isWorkflowType.value = isWorkFlow(type);
    form.value = {
        knowledge_setting: cloneDeep(data.knowledge_setting),
        problem_optimization: data.problem_optimization,
        problem_optimization_prompt: data.problem_optimization_prompt,
    };
    if (!isWorkflowType.value) {
        noReferencesform.value[form.value.knowledge_setting.no_references_setting.status] =
            form.value.knowledge_setting.no_references_setting.value;
    }
    dialogVisible.value = true;
};
const submit = async (formEl) => {
    if (isWorkflowType.value) {
        delete form.value['no_references_setting'];
        emit('refresh', form.value);
        dialogVisible.value = false;
    }
    else {
        if (!formEl)
            return;
        await formEl.validate((valid, fields) => {
            if (valid) {
                form.value.knowledge_setting.no_references_setting.value =
                    noReferencesform.value[form.value.knowledge_setting.no_references_setting.status];
                emit('refresh', form.value);
                dialogVisible.value = false;
            }
        });
    }
};
function changeHandle(val) {
    if (val === 'keywords') {
        form.value.knowledge_setting.similarity = 0;
    }
    else {
        form.value.knowledge_setting.similarity = 0.6;
    }
}
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
    ...{ class: "scrollbar-dialog" },
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "550px",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    ...{ class: "scrollbar-dialog" },
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "550px",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['scrollbar-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    maxHeight: "550",
}));
const __VLS_9 = __VLS_8({
    maxHeight: "550",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_15 = __VLS_14({
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_18;
const { default: __VLS_20 } = __VLS_16.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.$t('views.application.dialog.selectSearchMode')),
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.$t('views.application.dialog.selectSearchMode')),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.knowledge_setting.search_mode),
    ...{ class: "card__radio" },
}));
const __VLS_29 = __VLS_28({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.knowledge_setting.search_mode),
    ...{ class: "card__radio" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
const __VLS_33 = {
    /** @type {typeof __VLS_32.change} */
    onChange: (__VLS_ctx.changeHandle),
};
/** @type {__VLS_StyleScopedClasses['card__radio']} */ ;
const { default: __VLS_34 } = __VLS_30.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.form.knowledge_setting.search_mode === 'embedding' ? 'border-active' : '') },
}));
const __VLS_37 = __VLS_36({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.form.knowledge_setting.search_mode === 'embedding' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_40 } = __VLS_38.slots;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    value: "embedding",
    size: "large",
}));
const __VLS_43 = __VLS_42({
    value: "embedding",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.application.dialog.vectorSearch'));
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    type: "info",
}));
const __VLS_49 = __VLS_48({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
(__VLS_ctx.$t('views.application.dialog.vectorSearchTooltip'));
// @ts-ignore
[$t, $t, $t, $t, dialogVisible, form, form, form, vLoading, loading, changeHandle,];
var __VLS_50;
// @ts-ignore
[];
var __VLS_44;
// @ts-ignore
[];
var __VLS_38;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.form.knowledge_setting.search_mode === 'keywords' ? 'border-active' : '') },
}));
const __VLS_55 = __VLS_54({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.form.knowledge_setting.search_mode === 'keywords' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_58 } = __VLS_56.slots;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    value: "keywords",
    size: "large",
}));
const __VLS_61 = __VLS_60({
    value: "keywords",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.application.dialog.fullTextSearch'));
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    type: "info",
}));
const __VLS_67 = __VLS_66({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
(__VLS_ctx.$t('views.application.dialog.fullTextSearchTooltip'));
// @ts-ignore
[$t, $t, form,];
var __VLS_68;
// @ts-ignore
[];
var __VLS_62;
// @ts-ignore
[];
var __VLS_56;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    shadow: "never",
    ...{ class: (__VLS_ctx.form.knowledge_setting.search_mode === 'blend' ? 'border-active' : '') },
}));
const __VLS_73 = __VLS_72({
    shadow: "never",
    ...{ class: (__VLS_ctx.form.knowledge_setting.search_mode === 'blend' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    value: "blend",
    size: "large",
}));
const __VLS_79 = __VLS_78({
    value: "blend",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_82 } = __VLS_80.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.application.dialog.hybridSearch'));
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    type: "info",
}));
const __VLS_85 = __VLS_84({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_88 } = __VLS_86.slots;
(__VLS_ctx.$t('views.application.dialog.hybridSearchTooltip'));
// @ts-ignore
[$t, $t, form,];
var __VLS_86;
// @ts-ignore
[];
var __VLS_80;
// @ts-ignore
[];
var __VLS_74;
// @ts-ignore
[];
var __VLS_30;
var __VLS_31;
// @ts-ignore
[];
var __VLS_24;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    gutter: (10),
}));
const __VLS_91 = __VLS_90({
    gutter: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const { default: __VLS_94 } = __VLS_92.slots;
let __VLS_95;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
    span: (12),
}));
const __VLS_97 = __VLS_96({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const { default: __VLS_100 } = __VLS_98.slots;
let __VLS_101;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({}));
const __VLS_103 = __VLS_102({}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const { default: __VLS_106 } = __VLS_104.slots;
{
    const { label: __VLS_107 } = __VLS_104.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.dialog.similarityThreshold'));
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.dialog.similarityTooltip')),
        placement: "right",
    }));
    const __VLS_110 = __VLS_109({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.dialog.similarityTooltip')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const { default: __VLS_113 } = __VLS_111.slots;
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_116 = __VLS_115({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, $t,];
    var __VLS_111;
    // @ts-ignore
    [];
}
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    modelValue: (__VLS_ctx.form.knowledge_setting.similarity),
    min: (0),
    max: (__VLS_ctx.form.knowledge_setting.search_mode === 'blend' ? 2 : 1),
    precision: (3),
    step: (0.1),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
}));
const __VLS_121 = __VLS_120({
    modelValue: (__VLS_ctx.form.knowledge_setting.similarity),
    min: (0),
    max: (__VLS_ctx.form.knowledge_setting.search_mode === 'blend' ? 2 : 1),
    precision: (3),
    step: (0.1),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[form, form,];
var __VLS_104;
// @ts-ignore
[];
var __VLS_98;
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    span: (12),
}));
const __VLS_126 = __VLS_125({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const { default: __VLS_129 } = __VLS_127.slots;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    label: (__VLS_ctx.$t('views.application.dialog.topReferences')),
}));
const __VLS_132 = __VLS_131({
    label: (__VLS_ctx.$t('views.application.dialog.topReferences')),
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const { default: __VLS_135 } = __VLS_133.slots;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.form.knowledge_setting.top_n),
    min: (1),
    max: (10000),
    valueOnClear: (1),
    controlsPosition: "right",
    ...{ class: "w-full" },
}));
const __VLS_138 = __VLS_137({
    modelValue: (__VLS_ctx.form.knowledge_setting.top_n),
    min: (1),
    max: (10000),
    valueOnClear: (1),
    controlsPosition: "right",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, form,];
var __VLS_133;
// @ts-ignore
[];
var __VLS_127;
// @ts-ignore
[];
var __VLS_92;
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    label: (__VLS_ctx.$t('views.application.dialog.maxCharacters')),
}));
const __VLS_143 = __VLS_142({
    label: (__VLS_ctx.$t('views.application.dialog.maxCharacters')),
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
const { default: __VLS_146 } = __VLS_144.slots;
let __VLS_147;
/** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
elSlider;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    modelValue: (__VLS_ctx.form.knowledge_setting.max_paragraph_char_number),
    showInput: true,
    showInputControls: (false),
    min: (500),
    max: (100000),
    ...{ class: "custom-slider" },
}));
const __VLS_149 = __VLS_148({
    modelValue: (__VLS_ctx.form.knowledge_setting.max_paragraph_char_number),
    showInput: true,
    showInputControls: (false),
    min: (500),
    max: (100000),
    ...{ class: "custom-slider" },
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
/** @type {__VLS_StyleScopedClasses['custom-slider']} */ ;
// @ts-ignore
[$t, form,];
var __VLS_144;
if (!__VLS_ctx.isWorkflowType) {
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        label: (__VLS_ctx.$t('views.application.dialog.noReferencesAction')),
    }));
    const __VLS_154 = __VLS_153({
        label: (__VLS_ctx.$t('views.application.dialog.noReferencesAction')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    const { default: __VLS_157 } = __VLS_155.slots;
    let __VLS_158;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
        labelPosition: "top",
        ref: "noReferencesformRef",
        model: (__VLS_ctx.noReferencesform),
        rules: (__VLS_ctx.noReferencesRules),
        hideRequiredAsterisk: (true),
        ...{ class: "w-full" },
    }));
    const __VLS_160 = __VLS_159({
        labelPosition: "top",
        ref: "noReferencesformRef",
        model: (__VLS_ctx.noReferencesform),
        rules: (__VLS_ctx.noReferencesRules),
        hideRequiredAsterisk: (true),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    var __VLS_163;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_165 } = __VLS_161.slots;
    let __VLS_166;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
        modelValue: (__VLS_ctx.form.knowledge_setting.no_references_setting.status),
        ...{ class: "radio-block-avatar" },
    }));
    const __VLS_168 = __VLS_167({
        modelValue: (__VLS_ctx.form.knowledge_setting.no_references_setting.status),
        ...{ class: "radio-block-avatar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    /** @type {__VLS_StyleScopedClasses['radio-block-avatar']} */ ;
    const { default: __VLS_171 } = __VLS_169.slots;
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        value: "ai_questioning",
    }));
    const __VLS_174 = __VLS_173({
        value: "ai_questioning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    const { default: __VLS_177 } = __VLS_175.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.application.dialog.continueQuestioning'));
    // @ts-ignore
    [$t, $t, form, isWorkflowType, noReferencesform, noReferencesRules,];
    var __VLS_175;
    let __VLS_178;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
        value: "designated_answer",
    }));
    const __VLS_180 = __VLS_179({
        value: "designated_answer",
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    const { default: __VLS_183 } = __VLS_181.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.application.dialog.provideAnswer'));
    if (__VLS_ctx.form.knowledge_setting.no_references_setting.status === 'designated_answer') {
        let __VLS_184;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
            prop: "designated_answer",
        }));
        const __VLS_186 = __VLS_185({
            prop: "designated_answer",
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        const { default: __VLS_189 } = __VLS_187.slots;
        let __VLS_190;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
            modelValue: (__VLS_ctx.noReferencesform.designated_answer),
            rows: (2),
            type: "textarea",
            maxlength: "2048",
            placeholder: (__VLS_ctx.defaultValue['designated_answer']),
        }));
        const __VLS_192 = __VLS_191({
            modelValue: (__VLS_ctx.noReferencesform.designated_answer),
            rows: (2),
            type: "textarea",
            maxlength: "2048",
            placeholder: (__VLS_ctx.defaultValue['designated_answer']),
        }, ...__VLS_functionalComponentArgsRest(__VLS_191));
        // @ts-ignore
        [$t, form, noReferencesform, defaultValue,];
        var __VLS_187;
    }
    // @ts-ignore
    [];
    var __VLS_181;
    // @ts-ignore
    [];
    var __VLS_169;
    // @ts-ignore
    [];
    var __VLS_161;
    // @ts-ignore
    [];
    var __VLS_155;
}
if (!__VLS_ctx.isWorkflowType) {
    let __VLS_195;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
        ...{ 'onClick': {} },
    }));
    const __VLS_197 = __VLS_196({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    let __VLS_200;
    const __VLS_201 = {
        /** @type {typeof __VLS_200.click} */
        onClick: () => { },
    };
    const { default: __VLS_202 } = __VLS_198.slots;
    {
        const { label: __VLS_203 } = __VLS_198.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.application.form.problemOptimization.label'));
        // @ts-ignore
        [$t, isWorkflowType,];
    }
    let __VLS_204;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
        size: "small",
        modelValue: (__VLS_ctx.form.problem_optimization),
    }));
    const __VLS_206 = __VLS_205({
        size: "small",
        modelValue: (__VLS_ctx.form.problem_optimization),
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    // @ts-ignore
    [form,];
    var __VLS_198;
    var __VLS_199;
}
if (__VLS_ctx.form.problem_optimization) {
    let __VLS_209;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
        label: (__VLS_ctx.$t('common.prompt.label')),
    }));
    const __VLS_211 = __VLS_210({
        label: (__VLS_ctx.$t('common.prompt.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    const { default: __VLS_214 } = __VLS_212.slots;
    let __VLS_215;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
        modelValue: (__VLS_ctx.form.problem_optimization_prompt),
        rows: (6),
        type: "textarea",
        maxlength: "2048",
        placeholder: (__VLS_ctx.defaultPrompt),
    }));
    const __VLS_217 = __VLS_216({
        modelValue: (__VLS_ctx.form.problem_optimization_prompt),
        rows: (6),
        type: "textarea",
        maxlength: "2048",
        placeholder: (__VLS_ctx.defaultPrompt),
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    // @ts-ignore
    [$t, form, form, defaultPrompt,];
    var __VLS_212;
}
// @ts-ignore
[];
var __VLS_16;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_220 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_221;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
        ...{ 'onClick': {} },
    }));
    const __VLS_223 = __VLS_222({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    let __VLS_226;
    const __VLS_227 = {
        /** @type {typeof __VLS_226.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_228 } = __VLS_224.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_224;
    var __VLS_225;
    let __VLS_229;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent1(__VLS_229, new __VLS_229({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_231 = __VLS_230({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_230));
    let __VLS_234;
    const __VLS_235 = {
        /** @type {typeof __VLS_234.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.noReferencesformRef);
            // @ts-ignore
            [loading, submit, noReferencesformRef,];
        },
    };
    const { default: __VLS_236 } = __VLS_232.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_232;
    var __VLS_233;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_19 = __VLS_18, __VLS_164 = __VLS_163;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
