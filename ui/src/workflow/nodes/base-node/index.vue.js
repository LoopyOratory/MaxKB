/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { groupBy, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { ref, computed, onMounted, nextTick, inject, provide } from 'vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import TTSModeParamSettingDialog from '@/views/application/component/TTSModeParamSettingDialog.vue';
import ApiInputFieldTable from './component/ApiInputFieldTable.vue';
import UserInputFieldTable from './component/UserInputFieldTable.vue';
import FileUploadSettingDialog from '@/workflow/nodes/base-node/component/FileUploadSettingDialog.vue';
import ChatFieldTable from './component/ChatFieldTable.vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import AppIcon from '@/components/app-icon/AppIcon.vue';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
import LongTermSettingDialog from '@/views/application/component/LongTermSettingDialog.vue';
const getResourceDetail = inject('getResourceDetail');
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const props = defineProps();
const sttModelOptions = ref(null);
const ttsModelOptions = ref(null);
const TTSModeParamSettingDialogRef = ref();
const UserInputFieldTableFef = ref();
const ApiInputFieldTableFef = ref();
const FileUploadSettingDialogRef = ref();
const form = {
    name: '',
    desc: '',
    prologue: t('views.application.form.defaultPrologue'),
};
const longTermTips = t('views.application.longTermMemory.tips1') +
    `{{${t('workflow.nodes.startNode.label')}.memory}}` +
    t('views.application.longTermMemory.tips2');
const wheel = (e) => {
    if (e.ctrlKey === true) {
        e.preventDefault();
        return true;
    }
    else {
        e.stopPropagation();
        return true;
    }
};
function submitDialog(val) {
    set(props.nodeModel.properties.node_data, 'prologue', val);
}
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            return props.nodeModel.properties.node_data;
        }
        else {
            set(props.nodeModel.properties, 'node_data', form);
        }
        return props.nodeModel.properties.node_data;
    },
    set: (value) => {
        set(props.nodeModel.properties, 'node_data', value);
    },
});
const baseNodeFormRef = ref();
const validate = () => {
    if (form_data.value.tts_model_enable &&
        !form_data.value.tts_model_id &&
        form_data.value.tts_type === 'TTS') {
        return Promise.reject({
            node: props.nodeModel,
            errMessage: t('views.application.form.voicePlay.requiredMessage'),
        });
    }
    if (form_data.value.stt_model_enable && !form_data.value.stt_model_id) {
        return Promise.reject({
            node: props.nodeModel,
            errMessage: t('views.application.form.voiceInput.requiredMessage'),
        });
    }
    const fieldList = props.nodeModel.properties?.user_input_field_list || [];
    for (const field of fieldList) {
        for (const cond of field.visibility_rules?.conditions || []) {
            if (!cond.field || cond.field.length < 2 || !cond.field[0] || !cond.field[1])
                continue;
            const isCurrentNode = cond.field[0] === props.nodeModel.id ||
                (props.nodeModel.id === 'base-node' && cond.field[0] === 'global');
            if (isCurrentNode) {
                if (!fieldList.some((f) => f.field === cond.field[1])) {
                    return Promise.reject({
                        node: props.nodeModel,
                        errMessage: t('workflow.variable.NoReferencing'),
                    });
                }
            }
        }
    }
    return baseNodeFormRef.value?.validate().catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
const resource = getResourceDetail();
provide('getSelectModelList', (params) => {
    const obj = apiType.value === 'systemManage'
        ? { ...params, workspace_id: resource.value?.workspace_id }
        : { ...params };
    return loadSharedApi({ type: 'model', systemType: apiType.value }).getSelectModelList(obj);
});
provide('getModelParamsForm', (model_id) => {
    return loadSharedApi({ type: 'model', systemType: apiType.value }).getModelParamsForm(model_id);
});
function getSTTModel() {
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'STT',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            model_type: 'STT',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        sttModelOptions.value = groupBy(res?.data, 'provider');
    });
}
function getTTSModel() {
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'TTS',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            model_type: 'TTS',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        ttsModelOptions.value = groupBy(res?.data, 'provider');
    });
}
function ttsModelChange() {
    nextTick(() => {
        if (form_data.value.tts_model_id) {
            TTSModeParamSettingDialogRef.value?.reset_default(form_data.value.tts_model_id, id);
        }
        else {
            refreshTTSForm({});
        }
    });
}
function ttsModelEnableChange() {
    if (!form_data.value.tts_model_enable) {
        form_data.value.tts_model_id = '';
        form_data.value.tts_type = 'BROWSER';
    }
}
function sttModelEnableChange() {
    if (!form_data.value.stt_model_enable) {
        form_data.value.stt_model_id = '';
    }
}
const openTTSParamSettingDialog = () => {
    const model_id = form_data.value.tts_model_id;
    if (!model_id) {
        MsgSuccess(t('views.application.form.voicePlay.requiredMessage'));
        return;
    }
    TTSModeParamSettingDialogRef.value?.open(model_id, id, form_data.value.tts_model_params_setting);
};
const refreshTTSForm = (data) => {
    form_data.value.tts_model_params_setting = data;
};
const switchFileUpload = () => {
    const default_upload_setting = {
        maxFiles: 3,
        fileLimit: 50,
        document: true,
        image: false,
        audio: false,
        video: false,
        other: false,
        otherExtensions: ['ppt', 'doc'],
    };
    if (form_data.value.file_upload_enable) {
        form_data.value.file_upload_setting =
            form_data.value.file_upload_setting || default_upload_setting;
    }
    props.nodeModel.graphModel.eventCenter.emit('refreshFileUploadConfig');
};
const openFileUploadSettingDialog = () => {
    FileUploadSettingDialogRef.value?.open(form_data.value.file_upload_setting);
};
const refreshFileUploadForm = (data) => {
    form_data.value.file_upload_setting = data;
};
const LongTermModeParamSettingDialogRef = ref();
const LongTermSettingDialogRef = ref();
const modelOptions = ref(null);
const loading = ref(false);
const long_term_model_change = (model_id) => {
    form_data.value.long_term_model_id = model_id;
    if (model_id) {
        LongTermModeParamSettingDialogRef.value?.reset_default(model_id, id);
    }
    else {
        refreshLongTermForm({});
    }
};
function switchLongTerm() {
    props.nodeModel.graphModel.eventCenter.emit('refreshLongTermConfig');
}
function openLongTermConfigDialog() {
    LongTermSettingDialogRef.value?.open(form_data.value.long_term_trigger_type, form_data.value.long_term_trigger_setting);
}
function submitLongTermSettingDialog(data) {
    form_data.value.long_term_trigger_type = data.trigger_type;
    form_data.value.long_term_trigger_setting = data.trigger_setting;
}
function refreshLongTermForm(data) {
    form_data.value.long_term_model_params_setting = data;
}
function openLongTermParamSettingDialog() {
    if (form_data.value.long_term_model_id) {
        LongTermModeParamSettingDialogRef.value?.open(form_data.value.long_term_model_id, id, form_data.value.long_term_model_params_setting);
    }
}
function refreshParam(data) {
    form_data.value = { ...form_data.value, ...data };
}
function getSelectModel() {
    loading.value = true;
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'LLM',
            workspace_id: form_data.value?.workspace_id,
        }
        : {
            model_type: 'LLM',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
onMounted(() => {
    set(props.nodeModel, 'validate', validate);
    if (!props.nodeModel.properties.node_data.tts_type) {
        set(props.nodeModel.properties.node_data, 'tts_type', 'BROWSER');
    }
    getTTSModel();
    getSTTModel();
    getSelectModel();
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = NodeContainer || NodeContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_2 = __VLS_1({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "mb-24" },
    labelWidth: "auto",
    ref: "baseNodeFormRef",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "mb-24" },
    labelWidth: "auto",
    ref: "baseNodeFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
    rules: ({
        message: __VLS_ctx.t('views.application.form.appName.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
    rules: ({
        message: __VLS_ctx.t('views.application.form.appName.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form_data.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}));
const __VLS_25 = __VLS_24({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form_data.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form_data.name = __VLS_ctx.form_data.name?.trim();
        // @ts-ignore
        [nodeModel, form_data, form_data, form_data, form_data, $t, t, t,];
    },
};
var __VLS_26;
var __VLS_27;
// @ts-ignore
[];
var __VLS_20;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: (__VLS_ctx.$t('common.desc')),
}));
const __VLS_32 = __VLS_31({
    label: (__VLS_ctx.$t('common.desc')),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.form_data.desc),
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    type: "textarea",
    maxlength: "256",
    showWordLimit: true,
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.form_data.desc),
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    type: "textarea",
    maxlength: "256",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
// @ts-ignore
[form_data, $t, $t,];
var __VLS_33;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    label: (__VLS_ctx.$t('views.application.form.prologue')),
}));
const __VLS_43 = __VLS_42({
    label: (__VLS_ctx.$t('views.application.form.prologue')),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onWheel': {} },
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prologue')),
    modelValue: (__VLS_ctx.form_data.prologue),
    ...{ style: {} },
}));
const __VLS_49 = __VLS_48({
    ...{ 'onWheel': {} },
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prologue')),
    modelValue: (__VLS_ctx.form_data.prologue),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = {
    /** @type {typeof __VLS_52.wheel} */
    onWheel: (__VLS_ctx.wheel),
};
const __VLS_54 = {
    /** @type {typeof __VLS_52.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitDialog),
};
var __VLS_50;
var __VLS_51;
// @ts-ignore
[form_data, $t, $t, wheel, submitDialog,];
var __VLS_44;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({}));
const __VLS_57 = __VLS_56({}, ...__VLS_functionalComponentArgsRest(__VLS_56));
const { default: __VLS_60 } = __VLS_58.slots;
{
    const { label: __VLS_61 } = __VLS_58.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.longTermMemory.title'));
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        effect: "dark",
        content: (__VLS_ctx.longTermTips),
        placement: "right",
        popperClass: "max-w-350",
    }));
    const __VLS_64 = __VLS_63({
        effect: "dark",
        content: (__VLS_ctx.longTermTips),
        placement: "right",
        popperClass: "max-w-350",
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_67 } = __VLS_65.slots;
    const __VLS_68 = AppIcon || AppIcon;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_70 = __VLS_69({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, longTermTips,];
    var __VLS_65;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.form_data.long_term_enable) {
        let __VLS_73;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_75 = __VLS_74({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        let __VLS_78;
        const __VLS_79 = {
            /** @type {typeof __VLS_78.click} */
            onClick: (__VLS_ctx.openLongTermConfigDialog),
        };
        const { default: __VLS_80 } = __VLS_76.slots;
        const __VLS_81 = AppIcon || AppIcon;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
            iconName: "app-setting",
            ...{ class: "mr-4" },
        }));
        const __VLS_83 = __VLS_82({
            iconName: "app-setting",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        // @ts-ignore
        [form_data, openLongTermConfigDialog,];
        var __VLS_76;
        var __VLS_77;
    }
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.form_data.long_term_enable),
    }));
    const __VLS_88 = __VLS_87({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.form_data.long_term_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    let __VLS_91;
    const __VLS_92 = {
        /** @type {typeof __VLS_91.change} */
        onChange: (__VLS_ctx.switchLongTerm),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    var __VLS_89;
    var __VLS_90;
    // @ts-ignore
    [form_data, switchLongTerm,];
}
if (__VLS_ctx.form_data.long_term_enable) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        ...{ 'onChange': {} },
        ...{ 'onSubmitModel': {} },
        modelValue: (__VLS_ctx.form_data.long_term_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onChange': {} },
        ...{ 'onSubmitModel': {} },
        modelValue: (__VLS_ctx.form_data.long_term_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    const __VLS_99 = {
        /** @type {typeof __VLS_98.change} */
        onChange: (__VLS_ctx.long_term_model_change),
    };
    const __VLS_100 = {
        /** @type {typeof __VLS_98.submitModel} */
        onSubmitModel: (__VLS_ctx.getSelectModel),
    };
    var __VLS_96;
    var __VLS_97;
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        ...{ class: "ml-8" },
        disabled: (!__VLS_ctx.form_data.long_term_model_id),
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        ...{ class: "ml-8" },
        disabled: (!__VLS_ctx.form_data.long_term_model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_106;
    const __VLS_107 = {
        /** @type {typeof __VLS_106.click} */
        onClick: (__VLS_ctx.openLongTermParamSettingDialog),
    };
    const __VLS_108 = {
        /** @type {typeof __VLS_106.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    const { default: __VLS_109 } = __VLS_104.slots;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
    const { default: __VLS_115 } = __VLS_113.slots;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({}));
    const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
    // @ts-ignore
    [form_data, form_data, form_data, $t, modelOptions, long_term_model_change, getSelectModel, openLongTermParamSettingDialog, refreshParam,];
    var __VLS_113;
    // @ts-ignore
    [];
    var __VLS_104;
    var __VLS_105;
}
// @ts-ignore
[];
var __VLS_58;
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({}));
const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
const { default: __VLS_126 } = __VLS_124.slots;
{
    const { label: __VLS_127 } = __VLS_124.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('workflow.nodes.baseNode.fileUpload.label'));
    let __VLS_128;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
        effect: "dark",
        content: (__VLS_ctx.$t('workflow.nodes.baseNode.fileUpload.tooltip')),
        placement: "right",
    }));
    const __VLS_130 = __VLS_129({
        effect: "dark",
        content: (__VLS_ctx.$t('workflow.nodes.baseNode.fileUpload.tooltip')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    const { default: __VLS_133 } = __VLS_131.slots;
    const __VLS_134 = AppIcon || AppIcon;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_136 = __VLS_135({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, $t,];
    var __VLS_131;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.form_data.file_upload_enable) {
        let __VLS_139;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            ...{ class: "mr-4" },
        }));
        const __VLS_141 = __VLS_140({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_140));
        let __VLS_144;
        const __VLS_145 = {
            /** @type {typeof __VLS_144.click} */
            onClick: (__VLS_ctx.openFileUploadSettingDialog),
        };
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        const { default: __VLS_146 } = __VLS_142.slots;
        const __VLS_147 = AppIcon || AppIcon;
        // @ts-ignore
        const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
            iconName: "app-setting",
            ...{ class: "mr-4" },
        }));
        const __VLS_149 = __VLS_148({
            iconName: "app-setting",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_148));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        // @ts-ignore
        [form_data, openFileUploadSettingDialog,];
        var __VLS_142;
        var __VLS_143;
    }
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        ...{ 'onChange': {} },
        size: "small",
        modelValue: (__VLS_ctx.form_data.file_upload_enable),
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onChange': {} },
        size: "small",
        modelValue: (__VLS_ctx.form_data.file_upload_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_157;
    const __VLS_158 = {
        /** @type {typeof __VLS_157.change} */
        onChange: (__VLS_ctx.switchFileUpload),
    };
    var __VLS_155;
    var __VLS_156;
    // @ts-ignore
    [form_data, switchFileUpload,];
}
// @ts-ignore
[];
var __VLS_124;
const __VLS_159 = UserInputFieldTable;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    ref: "UserInputFieldTableFef",
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_161 = __VLS_160({
    ref: "UserInputFieldTableFef",
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
var __VLS_164;
var __VLS_162;
const __VLS_166 = ApiInputFieldTable;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    ref: "ApiInputFieldTableFef",
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_168 = __VLS_167({
    ref: "ApiInputFieldTableFef",
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
var __VLS_171;
var __VLS_169;
const __VLS_173 = ChatFieldTable || ChatFieldTable;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
    ref: "ChatFieldTeble",
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_175 = __VLS_174({
    ref: "ChatFieldTeble",
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
var __VLS_178;
var __VLS_176;
let __VLS_180;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({}));
const __VLS_182 = __VLS_181({}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const { default: __VLS_185 } = __VLS_183.slots;
{
    const { label: __VLS_186 } = __VLS_183.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.voiceInput.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.form_data.stt_model_enable) {
        let __VLS_187;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
            modelValue: (__VLS_ctx.form_data.stt_autosend),
        }));
        const __VLS_189 = __VLS_188({
            modelValue: (__VLS_ctx.form_data.stt_autosend),
        }, ...__VLS_functionalComponentArgsRest(__VLS_188));
        const { default: __VLS_192 } = __VLS_190.slots;
        (__VLS_ctx.$t('views.application.form.voiceInput.autoSend'));
        // @ts-ignore
        [nodeModel, nodeModel, nodeModel, form_data, form_data, $t, $t,];
        var __VLS_190;
    }
    let __VLS_193;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.form_data.stt_model_enable),
    }));
    const __VLS_195 = __VLS_194({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.form_data.stt_model_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    let __VLS_198;
    const __VLS_199 = {
        /** @type {typeof __VLS_198.change} */
        onChange: (__VLS_ctx.sttModelEnableChange),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    var __VLS_196;
    var __VLS_197;
    // @ts-ignore
    [form_data, sttModelEnableChange,];
}
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
ModelSelect;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    ...{ 'onWheel': {} },
    modelValue: (__VLS_ctx.form_data.stt_model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.voiceInput.placeholder')),
    options: (__VLS_ctx.sttModelOptions),
    showFooter: true,
    modelType: ('STT'),
}));
const __VLS_202 = __VLS_201({
    ...{ 'onWheel': {} },
    modelValue: (__VLS_ctx.form_data.stt_model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.voiceInput.placeholder')),
    options: (__VLS_ctx.sttModelOptions),
    showFooter: true,
    modelType: ('STT'),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_205;
const __VLS_206 = {
    /** @type {typeof __VLS_205.wheel} */
    onWheel: (__VLS_ctx.wheel),
};
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.form_data.stt_model_enable) }, null, null);
var __VLS_203;
var __VLS_204;
// @ts-ignore
[form_data, form_data, $t, wheel, sttModelOptions,];
var __VLS_183;
let __VLS_207;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({}));
const __VLS_209 = __VLS_208({}, ...__VLS_functionalComponentArgsRest(__VLS_208));
const { default: __VLS_212 } = __VLS_210.slots;
{
    const { label: __VLS_213 } = __VLS_210.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.voicePlay.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.form_data.tts_model_enable) {
        let __VLS_214;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
            modelValue: (__VLS_ctx.form_data.tts_autoplay),
        }));
        const __VLS_216 = __VLS_215({
            modelValue: (__VLS_ctx.form_data.tts_autoplay),
        }, ...__VLS_functionalComponentArgsRest(__VLS_215));
        const { default: __VLS_219 } = __VLS_217.slots;
        (__VLS_ctx.$t('views.application.form.voicePlay.autoPlay'));
        // @ts-ignore
        [form_data, form_data, $t, $t,];
        var __VLS_217;
    }
    let __VLS_220;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.form_data.tts_model_enable),
    }));
    const __VLS_222 = __VLS_221({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.form_data.tts_model_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    let __VLS_225;
    const __VLS_226 = {
        /** @type {typeof __VLS_225.change} */
        onChange: (__VLS_ctx.ttsModelEnableChange),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    var __VLS_223;
    var __VLS_224;
    // @ts-ignore
    [form_data, ttsModelEnableChange,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_227;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
    modelValue: (__VLS_ctx.form_data.tts_type),
}));
const __VLS_229 = __VLS_228({
    modelValue: (__VLS_ctx.form_data.tts_type),
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.form_data.tts_model_enable) }, null, null);
const { default: __VLS_232 } = __VLS_230.slots;
let __VLS_233;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
    label: (__VLS_ctx.$t('views.application.form.voicePlay.browser')),
    value: "BROWSER",
}));
const __VLS_235 = __VLS_234({
    label: (__VLS_ctx.$t('views.application.form.voicePlay.browser')),
    value: "BROWSER",
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    label: (__VLS_ctx.$t('views.application.form.voicePlay.tts')),
    value: "TTS",
}));
const __VLS_240 = __VLS_239({
    label: (__VLS_ctx.$t('views.application.form.voicePlay.tts')),
    value: "TTS",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
// @ts-ignore
[form_data, form_data, $t, $t,];
var __VLS_230;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
if (__VLS_ctx.form_data.tts_type === 'TTS' && __VLS_ctx.form_data.tts_model_enable) {
    let __VLS_243;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
        ...{ 'onWheel': {} },
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.tts_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.voicePlay.placeholder')),
        options: (__VLS_ctx.ttsModelOptions),
        showFooter: true,
        modelType: ('TTS'),
    }));
    const __VLS_245 = __VLS_244({
        ...{ 'onWheel': {} },
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.tts_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.voicePlay.placeholder')),
        options: (__VLS_ctx.ttsModelOptions),
        showFooter: true,
        modelType: ('TTS'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_244));
    let __VLS_248;
    const __VLS_249 = {
        /** @type {typeof __VLS_248.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const __VLS_250 = {
        /** @type {typeof __VLS_248.change} */
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.form_data.tts_type === 'TTS' && __VLS_ctx.form_data.tts_model_enable))
                throw 0;
            return __VLS_ctx.ttsModelChange();
            // @ts-ignore
            [form_data, form_data, form_data, $t, wheel, ttsModelOptions, ttsModelChange,];
        },
    };
    var __VLS_246;
    var __VLS_247;
}
if (__VLS_ctx.form_data.tts_type === 'TTS' && __VLS_ctx.form_data.tts_model_enable) {
    let __VLS_251;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_252 = __VLS_asFunctionalComponent1(__VLS_251, new __VLS_251({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.form_data.tts_model_id),
        ...{ class: "ml-8" },
    }));
    const __VLS_253 = __VLS_252({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.form_data.tts_model_id),
        ...{ class: "ml-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_252));
    let __VLS_256;
    const __VLS_257 = {
        /** @type {typeof __VLS_256.click} */
        onClick: (__VLS_ctx.openTTSParamSettingDialog),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    const { default: __VLS_258 } = __VLS_254.slots;
    let __VLS_259;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({}));
    const __VLS_261 = __VLS_260({}, ...__VLS_functionalComponentArgsRest(__VLS_260));
    const { default: __VLS_264 } = __VLS_262.slots;
    let __VLS_265;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({}));
    const __VLS_267 = __VLS_266({}, ...__VLS_functionalComponentArgsRest(__VLS_266));
    const { default: __VLS_270 } = __VLS_268.slots;
    let __VLS_271;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({}));
    const __VLS_273 = __VLS_272({}, ...__VLS_functionalComponentArgsRest(__VLS_272));
    // @ts-ignore
    [form_data, form_data, form_data, openTTSParamSettingDialog,];
    var __VLS_268;
    // @ts-ignore
    [];
    var __VLS_262;
    // @ts-ignore
    [];
    var __VLS_254;
    var __VLS_255;
}
// @ts-ignore
[];
var __VLS_210;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
const __VLS_276 = TTSModeParamSettingDialog;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent1(__VLS_276, new __VLS_276({
    ...{ 'onRefresh': {} },
    ref: "TTSModeParamSettingDialogRef",
}));
const __VLS_278 = __VLS_277({
    ...{ 'onRefresh': {} },
    ref: "TTSModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
let __VLS_281;
const __VLS_282 = {
    /** @type {typeof __VLS_281.refresh} */
    onRefresh: (__VLS_ctx.refreshTTSForm),
};
var __VLS_283;
var __VLS_279;
var __VLS_280;
const __VLS_285 = FileUploadSettingDialog;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
    ...{ 'onRefresh': {} },
    ref: "FileUploadSettingDialogRef",
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_287 = __VLS_286({
    ...{ 'onRefresh': {} },
    ref: "FileUploadSettingDialogRef",
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_286));
let __VLS_290;
const __VLS_291 = {
    /** @type {typeof __VLS_290.refresh} */
    onRefresh: (__VLS_ctx.refreshFileUploadForm),
};
var __VLS_292;
var __VLS_288;
var __VLS_289;
const __VLS_294 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
    ...{ 'onRefresh': {} },
    ref: "LongTermModeParamSettingDialogRef",
}));
const __VLS_296 = __VLS_295({
    ...{ 'onRefresh': {} },
    ref: "LongTermModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_295));
let __VLS_299;
const __VLS_300 = {
    /** @type {typeof __VLS_299.refresh} */
    onRefresh: (__VLS_ctx.refreshLongTermForm),
};
var __VLS_301;
var __VLS_297;
var __VLS_298;
const __VLS_303 = LongTermSettingDialog;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
    ...{ 'onRefresh': {} },
    ref: "LongTermSettingDialogRef",
}));
const __VLS_305 = __VLS_304({
    ...{ 'onRefresh': {} },
    ref: "LongTermSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
let __VLS_308;
const __VLS_309 = {
    /** @type {typeof __VLS_308.refresh} */
    onRefresh: (__VLS_ctx.submitLongTermSettingDialog),
};
var __VLS_310;
var __VLS_306;
var __VLS_307;
// @ts-ignore
[nodeModel, refreshTTSForm, refreshFileUploadForm, refreshLongTermForm, submitLongTermSettingDialog,];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_165 = __VLS_164, __VLS_172 = __VLS_171, __VLS_179 = __VLS_178, __VLS_284 = __VLS_283, __VLS_293 = __VLS_292, __VLS_302 = __VLS_301, __VLS_311 = __VLS_310;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
