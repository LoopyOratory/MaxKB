/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import AddknowledgeDialog from '@/views/application/component/AddKnowledgeDialog.vue';
import ParamSettingDialog from '@/views/application/component/ParamSettingDialog.vue';
import { ref, computed, onMounted } from 'vue';
import { relatedObject } from '@/utils/array';
import { SearchMode } from '@/enums/application';
import AppIcon from '@/components/app-icon/AppIcon.vue';
const props = defineProps();
const nodeCascaderRef = ref();
const form = {
    knowledge_id_list: [],
    knowledge_setting: {
        top_n: 3,
        similarity: 0.6,
        max_paragraph_char_number: 5000,
        search_mode: 'embedding',
    },
    question_reference_address: [],
    show_knowledge: false,
    search_scope_type: 'custom',
    search_scope_source: 'knowledge',
    search_scope_reference: [],
};
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
const knowledgeNodeFormRef = ref();
const ParamSettingDialogRef = ref();
const AddknowledgeDialogRef = ref();
const knowledgeList = ref([]);
const knowledgeLoading = ref(false);
function refreshParam(data) {
    set(props.nodeModel.properties.node_data, 'knowledge_setting', data.knowledge_setting);
}
const openParamSettingDialog = () => {
    ParamSettingDialogRef.value?.open(form_data.value, 'WORK_FLOW');
};
function removeknowledge(id) {
    const list = props.nodeModel.properties.node_data.knowledge_id_list.filter((v) => v !== id);
    set(props.nodeModel.properties.node_data, 'knowledge_id_list', list);
    if (props.nodeModel.properties.node_data.knowledge_list) {
        const objList = props.nodeModel.properties?.node_data.knowledge_list.filter((v) => v.id !== id);
        set(props.nodeModel.properties.node_data, 'knowledge_list', cloneDeep(objList));
    }
    knowledgeList.value = knowledgeList.value.filter((v) => v.id !== id);
    if (props.nodeModel.properties.node_data.all_knowledge_id_list) {
        const allList = props.nodeModel.properties.node_data.all_knowledge_id_list.filter((v) => v !== id);
        set(props.nodeModel.properties.node_data, 'all_knowledge_id_list', cloneDeep(allList));
    }
}
function addKnowledge(val) {
    set(props.nodeModel.properties.node_data, 'knowledge_id_list', val.map((item) => item.id));
    set(props.nodeModel.properties.node_data, 'knowledge_list', cloneDeep(val));
    knowledgeList.value = val;
}
function openknowledgeDialog() {
    if (AddknowledgeDialogRef.value) {
        AddknowledgeDialogRef.value.open(form_data.value.knowledge_id_list);
    }
}
const validate = () => {
    return Promise.all([
        nodeCascaderRef.value.validate(),
        knowledgeNodeFormRef.value?.validate(),
    ]).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
onMounted(() => {
    // console.log(props.nodeModel.properties.node_data)
    knowledgeList.value = props.nodeModel.properties.node_data.knowledge_list;
    form_data.value.show_knowledge = form_data.value.show_knowledge
        ? form_data.value.show_knowledge
        : false;
    form_data.value.search_scope_type = form_data.value.search_scope_type
        ? form_data.value.search_scope_type
        : 'custom';
    form_data.value.search_scope_source = form_data.value.search_scope_source
        ? form_data.value.search_scope_source
        : 'knowledge';
    form_data.value.knowledge_id_list = form_data.value.knowledge_id_list
        ? form_data.value.knowledge_id_list
        : [];
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
    ref: "knowledgeNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "knowledgeNodeFormRef",
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
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({}));
const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
{
    const { label: __VLS_29 } = __VLS_26.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.selectKnowledge'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    if (__VLS_ctx.form_data.search_scope_type === 'custom') {
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_32 = __VLS_31({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        let __VLS_35;
        const __VLS_36 = {
            /** @type {typeof __VLS_35.click} */
            onClick: (__VLS_ctx.openknowledgeDialog),
        };
        const { default: __VLS_37 } = __VLS_33.slots;
        const __VLS_38 = AppIcon || AppIcon;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            iconName: "app-add-outlined",
        }));
        const __VLS_40 = __VLS_39({
            iconName: "app-add-outlined",
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        // @ts-ignore
        [nodeModel, $t, $t, form_data, form_data, openknowledgeDialog,];
        var __VLS_33;
        var __VLS_34;
    }
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        teleported: (false),
        size: "small",
        modelValue: (__VLS_ctx.form_data.search_scope_type),
        ...{ style: {} },
    }));
    const __VLS_45 = __VLS_44({
        teleported: (false),
        size: "small",
        modelValue: (__VLS_ctx.form_data.search_scope_type),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }));
    const __VLS_51 = __VLS_50({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_56 = __VLS_55({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    // @ts-ignore
    [$t, $t, form_data,];
    var __VLS_46;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.search_scope_type === 'custom') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (__VLS_ctx.form_data.knowledge_id_list?.length === 0) {
        let __VLS_59;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
            type: "info",
        }));
        const __VLS_61 = __VLS_60({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        const { default: __VLS_64 } = __VLS_62.slots;
        (__VLS_ctx.$t('views.application.form.relatedKnowledge.placeholder'));
        // @ts-ignore
        [$t, form_data, form_data,];
        var __VLS_62;
    }
    else {
        for (const [item, index] of __VLS_vFor((__VLS_ctx.form_data.knowledge_id_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between border border-r-6 white-bg mb-4" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_65;
            /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
            KnowledgeIcon;
            // @ts-ignore
            const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
                type: (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.type),
                ...{ class: "mr-8" },
                size: (20),
            }));
            const __VLS_67 = __VLS_66({
                type: (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.type),
                ...{ class: "mr-8" },
                size: (20),
            }, ...__VLS_functionalComponentArgsRest(__VLS_66));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis" },
                title: (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.name);
            let __VLS_70;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_72 = __VLS_71({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_71));
            let __VLS_75;
            const __VLS_76 = {
                /** @type {typeof __VLS_75.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.form_data.search_scope_type === 'custom'))
                        throw 0;
                    if (!!(__VLS_ctx.form_data.knowledge_id_list?.length === 0))
                        throw 0;
                    return __VLS_ctx.removeknowledge(item);
                    // @ts-ignore
                    [form_data, relatedObject, relatedObject, relatedObject, knowledgeList, knowledgeList, knowledgeList, removeknowledge,];
                },
            };
            const { default: __VLS_77 } = __VLS_73.slots;
            let __VLS_78;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({}));
            const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
            const { default: __VLS_83 } = __VLS_81.slots;
            let __VLS_84;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({}));
            const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
            // @ts-ignore
            [];
            var __VLS_81;
            // @ts-ignore
            [];
            var __VLS_73;
            var __VLS_74;
            // @ts-ignore
            [];
        }
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_89;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
        prop: "search_scope_reference",
        rules: ({
            message: __VLS_ctx.$t('workflow.variable.placeholder'),
            trigger: 'blur',
            required: true,
        }),
    }));
    const __VLS_91 = __VLS_90({
        prop: "search_scope_reference",
        rules: ({
            message: __VLS_ctx.$t('workflow.variable.placeholder'),
            trigger: 'blur',
            required: true,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    const { default: __VLS_94 } = __VLS_92.slots;
    {
        const { label: __VLS_95 } = __VLS_92.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between align-center " },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.select_variable'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            effect: "dark",
            placement: "right",
        }));
        const __VLS_98 = __VLS_97({
            effect: "dark",
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        const { default: __VLS_101 } = __VLS_99.slots;
        {
            const { content: __VLS_102 } = __VLS_99.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: {} },
            });
            (['019d8ac3-e2c6-7ff2-8956-c9c98f0e11f4', '019d8ac3-e2c6-7ff2-8956-c9c98f0e11f3']);
            // @ts-ignore
            [$t, $t,];
        }
        const __VLS_103 = AppIcon || AppIcon;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_105 = __VLS_104({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_99;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        let __VLS_108;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
            ...{ 'onChange': {} },
            teleported: (false),
            size: "small",
            modelValue: (__VLS_ctx.form_data.search_scope_source),
            ...{ style: {} },
        }));
        const __VLS_110 = __VLS_109({
            ...{ 'onChange': {} },
            teleported: (false),
            size: "small",
            modelValue: (__VLS_ctx.form_data.search_scope_source),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        let __VLS_113;
        const __VLS_114 = {
            /** @type {typeof __VLS_113.change} */
            onChange: (...[$event]) => {
                if (!!(__VLS_ctx.form_data.search_scope_type === 'custom'))
                    throw 0;
                return __VLS_ctx.form_data.search_scope_reference = [];
                // @ts-ignore
                [form_data, form_data,];
            },
        };
        const { default: __VLS_115 } = __VLS_111.slots;
        let __VLS_116;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
            label: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.knowledgeList')),
            value: "knowledge",
        }));
        const __VLS_118 = __VLS_117({
            label: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.knowledgeList')),
            value: "knowledge",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        let __VLS_121;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
            label: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.documentList')),
            value: "document",
        }));
        const __VLS_123 = __VLS_122({
            label: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.documentList')),
            value: "document",
        }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        // @ts-ignore
        [$t, $t,];
        var __VLS_111;
        var __VLS_112;
        // @ts-ignore
        [];
    }
    const __VLS_126 = NodeCascader;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.search_scope_reference),
    }));
    const __VLS_128 = __VLS_127({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.search_scope_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    var __VLS_131;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_129;
    // @ts-ignore
    [nodeModel, $t, form_data,];
    var __VLS_92;
}
// @ts-ignore
[];
var __VLS_26;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchParam')),
}));
const __VLS_135 = __VLS_134({
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchParam')),
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
{
    const { label: __VLS_139 } = __VLS_136.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchParam'));
    let __VLS_140;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_145;
    const __VLS_146 = {
        /** @type {typeof __VLS_145.click} */
        onClick: (__VLS_ctx.openParamSettingDialog),
    };
    const { default: __VLS_147 } = __VLS_143.slots;
    const __VLS_148 = AppIcon || AppIcon;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        iconName: "app-setting",
    }));
    const __VLS_150 = __VLS_149({
        iconName: "app-setting",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    // @ts-ignore
    [$t, $t, openParamSettingDialog,];
    var __VLS_143;
    var __VLS_144;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({}));
const __VLS_155 = __VLS_154({}, ...__VLS_functionalComponentArgsRest(__VLS_154));
const { default: __VLS_158 } = __VLS_156.slots;
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    span: (12),
    ...{ class: "color-secondary lighter" },
}));
const __VLS_161 = __VLS_160({
    span: (12),
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_164 } = __VLS_162.slots;
(__VLS_ctx.$t('views.application.dialog.selectSearchMode'));
// @ts-ignore
[$t,];
var __VLS_162;
let __VLS_165;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
    span: (12),
    ...{ class: "lighter" },
}));
const __VLS_167 = __VLS_166({
    span: (12),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_170 } = __VLS_168.slots;
(__VLS_ctx.$t(__VLS_ctx.SearchMode[__VLS_ctx.form_data.knowledge_setting.search_mode]));
// @ts-ignore
[$t, form_data, SearchMode, SearchMode,];
var __VLS_168;
let __VLS_171;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
    span: (12),
    ...{ class: "color-secondary lighter" },
}));
const __VLS_173 = __VLS_172({
    span: (12),
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_176 } = __VLS_174.slots;
(__VLS_ctx.$t('views.application.dialog.similarityThreshold'));
// @ts-ignore
[$t,];
var __VLS_174;
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    span: (12),
    ...{ class: "lighter" },
}));
const __VLS_179 = __VLS_178({
    span: (12),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_182 } = __VLS_180.slots;
(__VLS_ctx.form_data.knowledge_setting.similarity?.toFixed(3));
// @ts-ignore
[form_data,];
var __VLS_180;
let __VLS_183;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    span: (12),
    ...{ class: "color-secondary lighter" },
}));
const __VLS_185 = __VLS_184({
    span: (12),
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_188 } = __VLS_186.slots;
(__VLS_ctx.$t('views.application.dialog.topReferences'));
// @ts-ignore
[$t,];
var __VLS_186;
let __VLS_189;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
    span: (12),
    ...{ class: "lighter" },
}));
const __VLS_191 = __VLS_190({
    span: (12),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_194 } = __VLS_192.slots;
(__VLS_ctx.form_data.knowledge_setting.top_n);
// @ts-ignore
[form_data,];
var __VLS_192;
let __VLS_195;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
    span: (12),
    ...{ class: "color-secondary lighter" },
}));
const __VLS_197 = __VLS_196({
    span: (12),
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_200 } = __VLS_198.slots;
(__VLS_ctx.$t('views.application.dialog.maxCharacters'));
// @ts-ignore
[$t,];
var __VLS_198;
let __VLS_201;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    span: (12),
    ...{ class: "lighter" },
}));
const __VLS_203 = __VLS_202({
    span: (12),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_206 } = __VLS_204.slots;
(__VLS_ctx.form_data.knowledge_setting.max_paragraph_char_number);
// @ts-ignore
[form_data,];
var __VLS_204;
// @ts-ignore
[];
var __VLS_156;
// @ts-ignore
[];
var __VLS_136;
let __VLS_207;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
    prop: "question_reference_address",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_209 = __VLS_208({
    prop: "question_reference_address",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
const { default: __VLS_212 } = __VLS_210.slots;
{
    const { label: __VLS_213 } = __VLS_210.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t,];
}
const __VLS_214 = NodeCascader;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
    modelValue: (__VLS_ctx.form_data.question_reference_address),
}));
const __VLS_216 = __VLS_215({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
    modelValue: (__VLS_ctx.form_data.question_reference_address),
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
var __VLS_219;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_217;
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_210;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    ...{ 'onClick': {} },
    prop: "show_knowledge",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.showKnowledge.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_223 = __VLS_222({
    ...{ 'onClick': {} },
    prop: "show_knowledge",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.showKnowledge.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
let __VLS_226;
const __VLS_227 = {
    /** @type {typeof __VLS_226.click} */
    onClick: () => { },
};
const { default: __VLS_228 } = __VLS_224.slots;
{
    const { label: __VLS_229 } = __VLS_224.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.showKnowledge.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t,];
}
let __VLS_230;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
    size: "small",
    modelValue: (__VLS_ctx.form_data.show_knowledge),
}));
const __VLS_232 = __VLS_231({
    size: "small",
    modelValue: (__VLS_ctx.form_data.show_knowledge),
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
// @ts-ignore
[form_data,];
var __VLS_224;
var __VLS_225;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_235 = ParamSettingDialog;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
    ...{ 'onRefresh': {} },
    ref: "ParamSettingDialogRef",
}));
const __VLS_237 = __VLS_236({
    ...{ 'onRefresh': {} },
    ref: "ParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
let __VLS_240;
const __VLS_241 = {
    /** @type {typeof __VLS_240.refresh} */
    onRefresh: (__VLS_ctx.refreshParam),
};
var __VLS_242;
var __VLS_238;
var __VLS_239;
const __VLS_244 = AddknowledgeDialog;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    ...{ 'onAddData': {} },
    ref: "AddknowledgeDialogRef",
    data: (__VLS_ctx.knowledgeList),
    loading: (__VLS_ctx.knowledgeLoading),
}));
const __VLS_246 = __VLS_245({
    ...{ 'onAddData': {} },
    ref: "AddknowledgeDialogRef",
    data: (__VLS_ctx.knowledgeList),
    loading: (__VLS_ctx.knowledgeLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
let __VLS_249;
const __VLS_250 = {
    /** @type {typeof __VLS_249.addData} */
    onAddData: (__VLS_ctx.addKnowledge),
};
var __VLS_251;
var __VLS_247;
var __VLS_248;
// @ts-ignore
[knowledgeList, refreshParam, knowledgeLoading, addKnowledge,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_132 = __VLS_131, __VLS_220 = __VLS_219, __VLS_243 = __VLS_242, __VLS_252 = __VLS_251;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
