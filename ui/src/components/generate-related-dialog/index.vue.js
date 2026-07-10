/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
import { groupBy } from 'lodash';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
const props = defineProps();
const route = useRoute();
const { params: { id, documentId }, // idisknowledgeID
 } = route;
const { model, prompt, user } = useStore();
const emit = defineEmits(['refresh']);
const loading = ref(false);
const dialogVisible = ref(false);
const modelOptions = ref(null);
const idList = ref([]);
const apiSubmitType = ref(''); // DocumentdocumentorParagraphparagraph
const state = ref('error');
const stateMap = {
    all: ['0', '1', '2', '3', '4', '5', 'n'],
    error: ['0', '1', '3', '4', '5', 'n'],
};
const FormRef = ref();
const currentKnowledge = ref(null);
const userId = user.userInfo?.id;
const form = ref(prompt.get(userId));
const rules = reactive({
    model_id: [
        {
            required: true,
            message: t('views.application.form.aiModel.placeholder'),
            trigger: 'blur',
        },
    ],
    prompt: [
        {
            required: true,
            message: t('common.prompt.placeholder'),
            trigger: 'blur',
        },
    ],
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = prompt.get(userId);
        FormRef.value?.clearValidate();
    }
});
const AIModeParamSettingDialogRef = ref();
const openAIParamSettingDialog = () => {
    if (form.value.model_id) {
        AIModeParamSettingDialogRef.value?.open(form.value.model_id, id, form.value.model_params_setting);
    }
};
function modelChange() {
    if (form.value.model_id) {
        AIModeParamSettingDialogRef.value?.reset_default(form.value.model_id, id);
    }
    else {
        refreshForm({});
    }
}
function refreshForm(data) {
    form.value.model_params_setting = data;
}
const open = (ids, type, _knowledge) => {
    currentKnowledge.value = _knowledge;
    getModelFn();
    idList.value = ids;
    apiSubmitType.value = type;
    dialogVisible.value = true;
};
const submitHandle = async (formEl) => {
    if (!formEl) {
        return;
    }
    await formEl.validate((valid, fields) => {
        if (valid) {
            // SaveTipPrompt
            prompt.save(user.userInfo?.id, form.value);
            if (apiSubmitType.value === 'paragraph') {
                const data = {
                    ...form.value,
                    paragraph_id_list: idList.value,
                };
                loadSharedApi({ type: 'paragraph', systemType: props.apiType })
                    .putBatchGenerateRelated(id, documentId, data, loading)
                    .then(() => {
                    MsgSuccess(t('views.document.generateQuestion.successMessage'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            else if (apiSubmitType.value === 'document') {
                const data = {
                    ...form.value,
                    document_id_list: idList.value,
                    state_list: stateMap[state.value],
                };
                loadSharedApi({ type: 'document', systemType: props.apiType })
                    .putBatchGenerateRelated(id, data, loading)
                    .then(() => {
                    MsgSuccess(t('views.document.generateQuestion.successMessage'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            else if (apiSubmitType.value === 'knowledge') {
                const data = {
                    ...form.value,
                    state_list: stateMap[state.value],
                };
                loadSharedApi({ type: 'knowledge', systemType: props.apiType })
                    .putGenerateRelated(id ? id : currentKnowledge.value?.id, data, loading)
                    .then(() => {
                    MsgSuccess(t('views.document.generateQuestion.successMessage'));
                    dialogVisible.value = false;
                });
            }
        }
    });
};
function getModelFn() {
    loading.value = true;
    const obj = props.apiType === 'systemManage'
        ? {
            model_type: 'LLM',
            workspace_id: currentKnowledge.value?.workspace_id,
        }
        : {
            model_type: 'LLM',
        };
    loadSharedApi({ type: 'model', systemType: props.apiType })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
const __VLS_exposed = { open, dialogVisible };
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
    ...{ 'onClick': {} },
    title: (__VLS_ctx.$t('views.document.generateQuestion.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "650",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    title: (__VLS_ctx.$t('views.document.generateQuestion.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "650",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: () => { },
};
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-height" },
});
/** @type {__VLS_StyleScopedClasses['content-height']} */ ;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    hideRequiredAsterisk: true,
}));
const __VLS_10 = __VLS_9({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_13;
const { default: __VLS_15 } = __VLS_11.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "update-info flex border-r-6 mb-16 p-8-12" },
});
/** @type {__VLS_StyleScopedClasses['update-info']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-4" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    iconName: "app-warning-colorful",
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    iconName: "app-warning-colorful",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-12 lighter" },
});
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.generateQuestion.tip1', { data: '{data}' }));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.generateQuestion.tip2') + '<question></question>' +
    __VLS_ctx.$t('views.document.generateQuestion.tip3'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.generateQuestion.tip4'));
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    prop: "model_id",
}));
const __VLS_23 = __VLS_22({
    prop: "model_id",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
{
    const { label: __VLS_27 } = __VLS_24.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.aiModel.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.form.model_id),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.form.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_33;
    const __VLS_34 = {
        /** @type {typeof __VLS_33.click} */
        onClick: (__VLS_ctx.openAIParamSettingDialog),
    };
    const { default: __VLS_35 } = __VLS_31.slots;
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        iconName: "app-setting",
        ...{ class: "mr-4" },
    }));
    const __VLS_38 = __VLS_37({
        iconName: "app-setting",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.paramSetting'));
    // @ts-ignore
    [$t, $t, $t, $t, $t, $t, $t, dialogVisible, form, form, rules, openAIParamSettingDialog,];
    var __VLS_31;
    var __VLS_32;
    // @ts-ignore
    [];
}
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
ModelSelect;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
    options: (__VLS_ctx.modelOptions),
    showFooter: true,
    modelType: ('LLM'),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
    options: (__VLS_ctx.modelOptions),
    showFooter: true,
    modelType: ('LLM'),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_46;
const __VLS_47 = {
    /** @type {typeof __VLS_46.change} */
    onChange: (__VLS_ctx.modelChange),
};
var __VLS_44;
var __VLS_45;
// @ts-ignore
[$t, form, modelOptions, modelChange,];
var __VLS_24;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    prop: "prompt",
}));
const __VLS_50 = __VLS_49({
    prop: "prompt",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_53 } = __VLS_51.slots;
{
    const { label: __VLS_54 } = __VLS_51.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('common.prompt.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t,];
}
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    modelValue: (__VLS_ctx.form.prompt),
    placeholder: (__VLS_ctx.$t('common.prompt.placeholder')),
    rows: (7),
    type: "textarea",
}));
const __VLS_57 = __VLS_56({
    modelValue: (__VLS_ctx.form.prompt),
    placeholder: (__VLS_ctx.$t('common.prompt.placeholder')),
    rows: (7),
    type: "textarea",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
// @ts-ignore
[$t, form,];
var __VLS_51;
if (['document', 'knowledge'].includes(__VLS_ctx.apiSubmitType)) {
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        label: (__VLS_ctx.$t('components.selectParagraph.title')),
        prop: "state",
    }));
    const __VLS_62 = __VLS_61({
        label: (__VLS_ctx.$t('components.selectParagraph.title')),
        prop: "state",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const { default: __VLS_65 } = __VLS_63.slots;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        modelValue: (__VLS_ctx.state),
        ...{ class: "radio-block" },
    }));
    const __VLS_68 = __VLS_67({
        modelValue: (__VLS_ctx.state),
        ...{ class: "radio-block" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    /** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
    const { default: __VLS_71 } = __VLS_69.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        value: "error",
        size: "large",
    }));
    const __VLS_74 = __VLS_73({
        value: "error",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    const { default: __VLS_77 } = __VLS_75.slots;
    (__VLS_ctx.$t('components.selectParagraph.error'));
    // @ts-ignore
    [$t, $t, apiSubmitType, state,];
    var __VLS_75;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        value: "all",
        size: "large",
    }));
    const __VLS_80 = __VLS_79({
        value: "all",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const { default: __VLS_83 } = __VLS_81.slots;
    (__VLS_ctx.$t('components.selectParagraph.all'));
    // @ts-ignore
    [$t,];
    var __VLS_81;
    // @ts-ignore
    [];
    var __VLS_69;
    // @ts-ignore
    [];
    var __VLS_63;
}
// @ts-ignore
[];
var __VLS_11;
{
    const { footer: __VLS_84 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ 'onClick': {} },
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_90;
    const __VLS_91 = {
        /** @type {typeof __VLS_90.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_92 } = __VLS_88.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_88;
    var __VLS_89;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.model || __VLS_ctx.loading),
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.model || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    const __VLS_99 = {
        /** @type {typeof __VLS_98.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submitHandle(__VLS_ctx.FormRef);
            // @ts-ignore
            [model, loading, submitHandle, FormRef,];
        },
    };
    const { default: __VLS_100 } = __VLS_96.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t,];
    var __VLS_96;
    var __VLS_97;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
const __VLS_101 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_103 = __VLS_102({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
let __VLS_106;
const __VLS_107 = {
    /** @type {typeof __VLS_106.refresh} */
    onRefresh: (__VLS_ctx.refreshForm),
};
var __VLS_108;
var __VLS_104;
var __VLS_105;
// @ts-ignore
var __VLS_14 = __VLS_13, __VLS_109 = __VLS_108;
// @ts-ignore
[refreshForm,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
