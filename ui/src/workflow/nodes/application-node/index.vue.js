/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set, cloneDeep } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { ref, computed, onMounted } from 'vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { isWorkFlow } from '@/utils/application';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const form = {
    question_reference_address: ['start-node', 'question'],
    api_input_field_list: [],
    user_input_field_list: [],
    document_list: ['start-node', 'document'],
    image_list: ['start-node', 'image'],
    audio_list: ['start-node', 'audio'],
    video_list: ['start-node', 'video'],
};
const applicationNodeFormRef = ref();
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
function handleFileUpload(type, isEnabled) {
    const listKey = `${type}_list`;
    if (isEnabled) {
        if (!props.nodeModel.properties.node_data[listKey]) {
            set(props.nodeModel.properties.node_data, listKey, []);
        }
    }
    else {
        // eslint-disable-next-line vue/no-mutating-props
        delete props.nodeModel.properties.node_data[listKey];
    }
}
const update_field = () => {
    if (!props.nodeModel.properties.node_data.application_id) {
        set(props.nodeModel.properties, 'status', 500);
        return;
    }
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getApplicationDetail(props.nodeModel.properties.node_data.application_id)
        .then((ok) => {
        if (ok.data.name) {
            set(props.nodeModel.properties.node_data, 'name', ok.data.name);
        }
        const old_api_input_field_list = cloneDeep(props.nodeModel.properties.node_data.api_input_field_list);
        const old_user_input_field_list = cloneDeep(props.nodeModel.properties.node_data.user_input_field_list);
        if (isWorkFlow(ok.data.type)) {
            const nodeData = ok.data.work_flow.nodes[0].properties.node_data;
            const new_api_input_field_list = cloneDeep(ok.data.work_flow.nodes[0].properties.api_input_field_list);
            const new_user_input_field_list = cloneDeep(ok.data.work_flow.nodes[0].properties.user_input_field_list);
            const merge_api_input_field_list = (new_api_input_field_list || []).map((item) => {
                const find_field = old_api_input_field_list?.find((old_item) => old_item.variable == item.variable);
                if (find_field) {
                    return {
                        ...item,
                        value: find_field.value,
                        label: typeof item.label === 'object' && item.label != null
                            ? item.label.label
                            : item.label,
                    };
                }
                else {
                    return item;
                }
            });
            set(props.nodeModel.properties.node_data, 'api_input_field_list', merge_api_input_field_list);
            const merge_user_input_field_list = (new_user_input_field_list || []).map((item) => {
                const find_field = old_user_input_field_list?.find((old_item) => old_item.field == item.field);
                if (find_field) {
                    return {
                        ...item,
                        value: find_field.value,
                        label: typeof item.label === 'object' && item.label != null
                            ? item.label.label
                            : item.label,
                    };
                }
                else {
                    return item;
                }
            });
            set(props.nodeModel.properties.node_data, 'user_input_field_list', merge_user_input_field_list);
            const fileEnable = nodeData.file_upload_enable;
            const fileUploadSetting = nodeData.file_upload_setting;
            if (fileEnable) {
                handleFileUpload('document', fileUploadSetting.document);
                handleFileUpload('image', fileUploadSetting.image);
                handleFileUpload('audio', fileUploadSetting.audio);
                handleFileUpload('video', fileUploadSetting.video);
            }
            else {
                ;
                ['document_list', 'image_list', 'audio_list', 'video_list'].forEach((list) => {
                    // eslint-disable-next-line vue/no-mutating-props
                    delete props.nodeModel.properties.node_data[list];
                });
            }
            set(props.nodeModel.properties, 'status', ok.data.id ? 200 : 500);
        }
    })
        .catch((err) => {
        console.log(err);
        set(props.nodeModel.properties, 'status', 500);
    });
};
const props = defineProps();
const validate = () => {
    return applicationNodeFormRef.value?.validate().catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
onMounted(() => {
    update_field();
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
}));
const __VLS_9 = __VLS_8({
    shadow: "never",
    ...{ class: "card-never" },
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
    ref: "applicationNodeFormRef",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "applicationNodeFormRef",
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
    label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
    prop: "question_reference_address",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
    prop: "question_reference_address",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
const __VLS_29 = NodeCascader;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    ref: "applicationNodeFormRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
    modelValue: (__VLS_ctx.form_data.question_reference_address),
}));
const __VLS_31 = __VLS_30({
    ref: "applicationNodeFormRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
    modelValue: (__VLS_ctx.form_data.question_reference_address),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_34;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_32;
// @ts-ignore
[nodeModel, nodeModel, $t, $t, $t, $t, form_data, form_data,];
var __VLS_26;
if (__VLS_ctx.form_data.hasOwnProperty('document_list') || 'document_list' in __VLS_ctx.form_data) {
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        label: (__VLS_ctx.$t('views.problem.relateParagraph.selectDocument')),
        prop: "document_list",
        rules: ({
            message: __VLS_ctx.$t('views.chatLog.documentPlaceholder'),
            trigger: 'blur',
            required: false,
        }),
    }));
    const __VLS_38 = __VLS_37({
        label: (__VLS_ctx.$t('views.problem.relateParagraph.selectDocument')),
        prop: "document_list",
        rules: ({
            message: __VLS_ctx.$t('views.chatLog.documentPlaceholder'),
            trigger: 'blur',
            required: false,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const { default: __VLS_41 } = __VLS_39.slots;
    const __VLS_42 = NodeCascader;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
        modelValue: (__VLS_ctx.form_data.document_list),
    }));
    const __VLS_44 = __VLS_43({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
        modelValue: (__VLS_ctx.form_data.document_list),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    var __VLS_47;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_45;
    // @ts-ignore
    [nodeModel, $t, $t, $t, form_data, form_data, form_data,];
    var __VLS_39;
}
if (__VLS_ctx.form_data.hasOwnProperty('image_list') || 'image_list' in __VLS_ctx.form_data) {
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        label: (__VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.label')),
        prop: "image_list",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage'),
            trigger: 'blur',
            required: false,
        }),
    }));
    const __VLS_51 = __VLS_50({
        label: (__VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.label')),
        prop: "image_list",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage'),
            trigger: 'blur',
            required: false,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const { default: __VLS_54 } = __VLS_52.slots;
    const __VLS_55 = NodeCascader;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage')),
        modelValue: (__VLS_ctx.form_data.image_list),
    }));
    const __VLS_57 = __VLS_56({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage')),
        modelValue: (__VLS_ctx.form_data.image_list),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    var __VLS_60;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_58;
    // @ts-ignore
    [nodeModel, $t, $t, $t, form_data, form_data, form_data,];
    var __VLS_52;
}
if (__VLS_ctx.form_data.hasOwnProperty('audio_list') || 'audio_list' in __VLS_ctx.form_data) {
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        label: (__VLS_ctx.$t('workflow.nodes.speechToTextNode.audio.label')),
        prop: "audio_list",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.speechToTextNode.audio.placeholder'),
            trigger: 'blur',
            required: false,
        }),
    }));
    const __VLS_64 = __VLS_63({
        label: (__VLS_ctx.$t('workflow.nodes.speechToTextNode.audio.label')),
        prop: "audio_list",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.speechToTextNode.audio.placeholder'),
            trigger: 'blur',
            required: false,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_67 } = __VLS_65.slots;
    const __VLS_68 = NodeCascader;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.speechToTextNode.audio.placeholder')),
        modelValue: (__VLS_ctx.form_data.audio_list),
    }));
    const __VLS_70 = __VLS_69({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.speechToTextNode.audio.placeholder')),
        modelValue: (__VLS_ctx.form_data.audio_list),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_73;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_71;
    // @ts-ignore
    [nodeModel, $t, $t, $t, form_data, form_data, form_data,];
    var __VLS_65;
}
if (__VLS_ctx.form_data.hasOwnProperty('video_list') || 'video_list' in __VLS_ctx.form_data) {
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        label: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.label')),
        prop: "video_list",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage'),
            trigger: 'blur',
            required: false,
        }),
    }));
    const __VLS_77 = __VLS_76({
        label: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.label')),
        prop: "video_list",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage'),
            trigger: 'blur',
            required: false,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    const { default: __VLS_80 } = __VLS_78.slots;
    const __VLS_81 = NodeCascader;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage')),
        modelValue: (__VLS_ctx.form_data.video_list),
    }));
    const __VLS_83 = __VLS_82({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage')),
        modelValue: (__VLS_ctx.form_data.video_list),
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    var __VLS_86;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_84;
    // @ts-ignore
    [nodeModel, $t, $t, $t, form_data, form_data, form_data,];
    var __VLS_78;
}
for (const [field, index] of __VLS_vFor((__VLS_ctx.form_data.api_input_field_list))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: ('api-input-' + index),
    });
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        label: (typeof field.variable === 'object' && field.variable !== null ? field.variable.label : field.variable),
        prop: ('api_input_field_list.' + index + '.value'),
        rules: ([
            {
                required: field.is_required,
                message: `${__VLS_ctx.$t('common.inputPlaceholder')}${typeof field.variable === 'object' && field.variable !== null ? field.variable.label : field.variable}`,
                trigger: 'blur',
            },
        ]),
    }));
    const __VLS_90 = __VLS_89({
        label: (typeof field.variable === 'object' && field.variable !== null ? field.variable.label : field.variable),
        prop: ('api_input_field_list.' + index + '.value'),
        rules: ([
            {
                required: field.is_required,
                message: `${__VLS_ctx.$t('common.inputPlaceholder')}${typeof field.variable === 'object' && field.variable !== null ? field.variable.label : field.variable}`,
                trigger: 'blur',
            },
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const { default: __VLS_93 } = __VLS_91.slots;
    const __VLS_94 = NodeCascader;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
        modelValue: (__VLS_ctx.form_data.api_input_field_list[index].value),
    }));
    const __VLS_96 = __VLS_95({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
        modelValue: (__VLS_ctx.form_data.api_input_field_list[index].value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    var __VLS_99;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_97;
    // @ts-ignore
    [nodeModel, $t, $t, form_data, form_data,];
    var __VLS_91;
    // @ts-ignore
    [];
}
for (const [field, index] of __VLS_vFor((__VLS_ctx.form_data.user_input_field_list))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: ('user-input-' + index),
    });
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        label: (typeof field.label === 'object' && field.label !== null ? field.label.label : field.label),
        prop: ('user_input_field_list.' + index + '.value'),
        rules: ([
            {
                required: field.required,
                message: `${__VLS_ctx.$t('common.inputPlaceholder')}${typeof field.label === 'object' && field.label !== null ? field.label.label : field.label}`,
                trigger: 'blur',
            },
        ]),
    }));
    const __VLS_103 = __VLS_102({
        label: (typeof field.label === 'object' && field.label !== null ? field.label.label : field.label),
        prop: ('user_input_field_list.' + index + '.value'),
        rules: ([
            {
                required: field.required,
                message: `${__VLS_ctx.$t('common.inputPlaceholder')}${typeof field.label === 'object' && field.label !== null ? field.label.label : field.label}`,
                trigger: 'blur',
            },
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    const { default: __VLS_106 } = __VLS_104.slots;
    const __VLS_107 = NodeCascader;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
        modelValue: (__VLS_ctx.form_data.user_input_field_list[index].value),
    }));
    const __VLS_109 = __VLS_108({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
        modelValue: (__VLS_ctx.form_data.user_input_field_list[index].value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    var __VLS_112;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_110;
    // @ts-ignore
    [nodeModel, $t, $t, form_data, form_data,];
    var __VLS_104;
    // @ts-ignore
    [];
}
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
}));
const __VLS_116 = __VLS_115({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
let __VLS_119;
const __VLS_120 = {
    /** @type {typeof __VLS_119.click} */
    onClick: () => { },
};
const { default: __VLS_121 } = __VLS_117.slots;
{
    const { label: __VLS_122 } = __VLS_117.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label'));
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }));
    const __VLS_125 = __VLS_124({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    const { default: __VLS_128 } = __VLS_126.slots;
    {
        const { content: __VLS_129 } = __VLS_126.slots;
        (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.tooltip'));
        // @ts-ignore
        [$t, $t, $t,];
    }
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_132 = __VLS_131({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_126;
    // @ts-ignore
    [];
}
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    size: "small",
    modelValue: (__VLS_ctx.form_data.is_result),
}));
const __VLS_137 = __VLS_136({
    size: "small",
    modelValue: (__VLS_ctx.form_data.is_result),
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
// @ts-ignore
[form_data,];
var __VLS_117;
var __VLS_118;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_35 = __VLS_34, __VLS_48 = __VLS_47, __VLS_61 = __VLS_60, __VLS_74 = __VLS_73, __VLS_87 = __VLS_86, __VLS_100 = __VLS_99, __VLS_113 = __VLS_112;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
