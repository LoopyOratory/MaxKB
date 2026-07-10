/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set, groupBy, cloneDeep } from 'lodash';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
import { ref, computed, onMounted, inject } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import { t } from '@/locales';
import { useRoute } from 'vue-router';
import { randomId } from '@/utils/common';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const getResourceDetail = inject('getResourceDetail');
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else {
        return 'workspace';
    }
});
const nodeCascaderRef = ref();
const AIModeParamSettingDialogRef = ref();
function addClassfiyBranch() {
    const list = cloneDeep(props.nodeModel.properties.node_data.branch);
    const obj = {
        id: randomId(),
        content: '',
        isOther: false,
    };
    list.splice(list.length - 1, 0, obj);
    refreshBranchAnchor(list, true);
    set(props.nodeModel.properties.node_data, 'branch', list);
    props.nodeModel.refreshBranch();
}
function deleteClassifyBranch(id) {
    const list = cloneDeep(props.nodeModel.properties.node_data.branch);
    const itemToDelete = list.find((item) => item.id === id);
    if (!itemToDelete || itemToDelete.isOther) {
        return;
    }
    const commonItems = list.filter((item) => !item.isOther);
    if (commonItems.length <= 1) {
        return;
    }
    // Delete connection line
    const delete_anchor_id = `${props.nodeModel.id}_${id}_right`;
    const edgetToDelete = (props.nodeModel.outgoing?.edges || [])
        .filter((edge) => edge.sourceAnchorId === delete_anchor_id)
        .map((edge) => edge.id);
    if (edgetToDelete.length > 0) {
        props.nodeModel.graphModel.eventCenter.emit('delete_edge', edgetToDelete);
    }
    const newList = list.filter((item) => item.id !== id); // Delete branch
    set(props.nodeModel.properties.node_data, 'branch', newList); // Update data
    refreshBranchAnchor(newList, false); // Refresh anchor
}
function refreshBranchAnchor(list, is_add) {
    const branch_condition_list = cloneDeep(props.nodeModel.properties.branch_condition_list
        ? props.nodeModel.properties.branch_condition_list
        : []);
    const new_branch_condition_list = list
        .map((item, index) => {
        const exist = branch_condition_list.find((b) => b.id === item.id);
        if (exist) {
            return { index: index, height: exist.height, id: item.id };
        }
        else {
            if (is_add) {
                return { index: index, height: 12, id: item.id };
            }
        }
    })
        .filter((item) => item);
    set(props.nodeModel.properties, 'branch_condition_list', new_branch_condition_list);
    props.nodeModel.refreshBranch();
}
const resizeBranch = (wh, row, index) => {
    const branch_condition_list = cloneDeep(props.nodeModel.properties.branch_condition_list
        ? props.nodeModel.properties.branch_condition_list
        : []);
    const new_branch_condition_list = branch_condition_list.map((item) => {
        if (item.id === row.id) {
            return {
                ...item,
                height: wh.height, //Branch height
                index: index,
            };
        }
        return item;
    });
    set(props.nodeModel.properties, 'branch_condition_list', new_branch_condition_list);
    refreshBranchAnchor(props.nodeModel.properties.node_data.branch, true);
};
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
const model_change = (model_id) => {
    if (model_id) {
        AIModeParamSettingDialogRef.value?.reset_default(model_id, id);
    }
    else {
        refreshParam({});
    }
};
const form = {
    model_id: '',
    model_id_type: 'custom',
    model_id_reference: [],
    branch: [
        {
            id: randomId(),
            content: '',
            isOther: false,
        },
        {
            id: randomId(),
            content: t('common.other'),
            isOther: true,
        },
    ],
    dialogue_number: 1,
    content_list: [],
};
function refreshParam(data) {
    set(props.nodeModel.properties.node_data, 'model_params_setting', data);
}
const openAIParamSettingDialog = (modelId) => {
    if (modelId) {
        AIModeParamSettingDialogRef.value?.open(modelId, id, form_data.value.model_params_setting);
    }
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            if (!props.nodeModel.properties.node_data.model_id_type) {
                set(props.nodeModel.properties.node_data, 'model_id_type', 'custom');
            }
            if (!props.nodeModel.properties.node_data.model_id_reference) {
                set(props.nodeModel.properties.node_data, 'model_id_reference', []);
            }
            return props.nodeModel.properties.node_data;
        }
        else {
            set(props.nodeModel.properties, 'node_data', form);
            refreshBranchAnchor(form.branch, true);
        }
        return props.nodeModel.properties.node_data;
    },
    set: (value) => {
        set(props.nodeModel.properties, 'node_data', value);
    },
});
const props = defineProps();
const IntentClassifyNodeFormRef = ref();
const modelOptions = ref(null);
const modelCascaderRef = ref();
const validate = () => {
    return Promise.all([
        nodeCascaderRef.value ? nodeCascaderRef.value.validate() : Promise.resolve(''),
        modelCascaderRef.value ? modelCascaderRef.value.validate() : Promise.resolve(''),
        IntentClassifyNodeFormRef.value?.validate(),
    ])
        .then(() => {
        if (form_data.value.branch.length !=
            new Set(form_data.value.branch.map((item) => item.content)).size) {
            throw t('workflow.nodes.intentNode.error2');
        }
    })
        .catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
const resource = getResourceDetail();
function getSelectModel() {
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'LLM',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            model_type: 'LLM',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
    });
}
onMounted(() => {
    getSelectModel();
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
    set(props.nodeModel, 'validate', validate);
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
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('workflow.nodeSetting'));
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "IntentClassifyNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "IntentClassifyNodeFormRef",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = {
    /** @type {typeof __VLS_18.submit} */
    onSubmit: () => { },
};
var __VLS_20;
const { default: __VLS_22 } = __VLS_16.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
    prop: (__VLS_ctx.form_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('views.application.form.aiModel.placeholder'),
        trigger: 'change',
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
    prop: (__VLS_ctx.form_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('views.application.form.aiModel.placeholder'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
{
    const { label: __VLS_29 } = __VLS_26.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.aiModel.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.form_data.model_id_reference = [];
            // @ts-ignore
            [nodeModel, $t, $t, $t, $t, $t, form_data, form_data, form_data, form_data, form_data,];
        },
    };
    const { default: __VLS_37 } = __VLS_33.slots;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "reference",
    }));
    const __VLS_40 = __VLS_39({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "reference",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_45 = __VLS_44({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    // @ts-ignore
    [$t, $t,];
    var __VLS_33;
    var __VLS_34;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.model_id_type !== 'reference') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onChange': {} },
        ...{ 'onWheel': {} },
        ...{ 'onSubmitModel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onChange': {} },
        ...{ 'onWheel': {} },
        ...{ 'onSubmitModel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.change} */
        onChange: (__VLS_ctx.model_change),
    };
    const __VLS_55 = {
        /** @type {typeof __VLS_53.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const __VLS_56 = {
        /** @type {typeof __VLS_53.submitModel} */
        onSubmitModel: (__VLS_ctx.getSelectModel),
    };
    var __VLS_51;
    var __VLS_52;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        disabled: (!__VLS_ctx.form_data.model_id),
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        disabled: (!__VLS_ctx.form_data.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form_data.model_id_type !== 'reference'))
                throw 0;
            return __VLS_ctx.openAIParamSettingDialog(__VLS_ctx.form_data.model_id);
            // @ts-ignore
            [$t, form_data, form_data, form_data, form_data, modelOptions, model_change, wheel, getSelectModel, openAIParamSettingDialog,];
        },
    };
    const __VLS_64 = {
        /** @type {typeof __VLS_62.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_65 } = __VLS_60.slots;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
    const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
    const { default: __VLS_71 } = __VLS_69.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({}));
    const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
    // @ts-ignore
    [refreshParam,];
    var __VLS_69;
    // @ts-ignore
    [];
    var __VLS_60;
    var __VLS_61;
}
else {
    const __VLS_77 = NodeCascader;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.model_id_reference),
    }));
    const __VLS_79 = __VLS_78({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.model_id_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    var __VLS_82;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_80;
}
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_26;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    prop: "content_list",
    label: (__VLS_ctx.$t('workflow.nodes.intentNode.input.label')),
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label'),
        trigger: 'change',
        required: true,
    }),
}));
const __VLS_86 = __VLS_85({
    prop: "content_list",
    label: (__VLS_ctx.$t('workflow.nodes.intentNode.input.label')),
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label'),
        trigger: 'change',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_89 } = __VLS_87.slots;
{
    const { label: __VLS_90 } = __VLS_87.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.intentNode.input.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t, $t,];
}
const __VLS_91 = NodeCascader;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    modelValue: (__VLS_ctx.form_data.content_list),
}));
const __VLS_93 = __VLS_92({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    modelValue: (__VLS_ctx.form_data.content_list),
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
var __VLS_96;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_94;
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_87;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    label: (__VLS_ctx.$t('views.application.form.historyRecord.label')),
}));
const __VLS_100 = __VLS_99({
    label: (__VLS_ctx.$t('views.application.form.historyRecord.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
const { default: __VLS_103 } = __VLS_101.slots;
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    modelValue: (__VLS_ctx.form_data.dialogue_number),
    min: (0),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}));
const __VLS_106 = __VLS_105({
    modelValue: (__VLS_ctx.form_data.dialogue_number),
    min: (0),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, form_data,];
var __VLS_101;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({}));
const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
const { default: __VLS_114 } = __VLS_112.slots;
{
    const { label: __VLS_115 } = __VLS_112.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.intentNode.classify.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        type: "primary",
        size: "large",
        link: true,
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        type: "primary",
        size: "large",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_121;
    const __VLS_122 = {
        /** @type {typeof __VLS_121.click} */
        onClick: (__VLS_ctx.addClassfiyBranch),
    };
    const { default: __VLS_123 } = __VLS_119.slots;
    let __VLS_124;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
        iconName: "app-add-outlined",
    }));
    const __VLS_126 = __VLS_125({
        iconName: "app-add-outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    // @ts-ignore
    [$t, addClassfiyBranch,];
    var __VLS_119;
    var __VLS_120;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
for (const [item, index] of __VLS_vFor((__VLS_ctx.form_data.branch))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.id),
        ...{ class: "mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_129;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
        prop: (`branch.${index}.content`),
        rules: ({
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'change',
            required: true,
        }),
    }));
    const __VLS_131 = __VLS_130({
        prop: (`branch.${index}.content`),
        rules: ({
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'change',
            required: true,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    const { default: __VLS_134 } = __VLS_132.slots;
    let __VLS_135;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
        gutter: (12),
        align: "middle",
    }));
    const __VLS_137 = __VLS_136({
        gutter: (12),
        align: "middle",
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    const { default: __VLS_140 } = __VLS_138.slots;
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        span: (21),
    }));
    const __VLS_143 = __VLS_142({
        span: (21),
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    const { default: __VLS_146 } = __VLS_144.slots;
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        modelValue: (item.content),
        ...{ style: {} },
        disabled: (item.isOther),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }));
    const __VLS_149 = __VLS_148({
        modelValue: (item.content),
        ...{ style: {} },
        disabled: (item.isOther),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    // @ts-ignore
    [$t, $t, form_data,];
    var __VLS_144;
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        span: (3),
    }));
    const __VLS_154 = __VLS_153({
        span: (3),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    const { default: __VLS_157 } = __VLS_155.slots;
    if (!item.isOther) {
        let __VLS_158;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
            ...{ 'onClick': {} },
            link: true,
            size: "large",
            disabled: (__VLS_ctx.form_data.branch.filter((b) => !b.isOther).length <= 1),
        }));
        const __VLS_160 = __VLS_159({
            ...{ 'onClick': {} },
            link: true,
            size: "large",
            disabled: (__VLS_ctx.form_data.branch.filter((b) => !b.isOther).length <= 1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_159));
        let __VLS_163;
        const __VLS_164 = {
            /** @type {typeof __VLS_163.click} */
            onClick: (...[$event]) => {
                if (!(!item.isOther))
                    throw 0;
                return __VLS_ctx.deleteClassifyBranch(item.id);
                // @ts-ignore
                [form_data, deleteClassifyBranch,];
            },
        };
        const { default: __VLS_165 } = __VLS_161.slots;
        let __VLS_166;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
            iconName: "app-delete",
        }));
        const __VLS_168 = __VLS_167({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_167));
        // @ts-ignore
        [];
        var __VLS_161;
        var __VLS_162;
    }
    // @ts-ignore
    [];
    var __VLS_155;
    // @ts-ignore
    [];
    var __VLS_138;
    // @ts-ignore
    [];
    var __VLS_132;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_112;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_171 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_173 = __VLS_172({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
let __VLS_176;
const __VLS_177 = {
    /** @type {typeof __VLS_176.refresh} */
    onRefresh: (__VLS_ctx.refreshParam),
};
var __VLS_178;
var __VLS_174;
var __VLS_175;
// @ts-ignore
[refreshParam,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_83 = __VLS_82, __VLS_97 = __VLS_96, __VLS_179 = __VLS_178;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
