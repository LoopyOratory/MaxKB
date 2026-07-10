/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import AddKnowledgeDialog from '@/views/application/component/AddKnowledgeDialog.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { relatedObject } from '@/utils/array';
import { t } from '@/locales';
import AppIcon from '@/components/app-icon/AppIcon.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps();
const nodeCascaderRef = ref();
const nodeCascaderRef2 = ref();
const compareList = [
    { value: 'contain', label: t('workflow.compare.contain') },
    { value: 'not_contain', label: t('workflow.compare.not_contain') },
    { value: 'eq', label: t('workflow.compare.eq') },
];
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('share/')) {
        return 'workspaceShare';
    }
    else {
        return 'workspace';
    }
});
const all_knowledge_tags = ref([]);
const form = {
    knowledge_id_list: [],
    search_scope_type: 'custom',
    search_scope_source: 'knowledge',
    search_scope_reference: [],
    search_mode: 'auto',
    question_reference: [],
    search_condition_type: 'AND',
    search_condition_list: [],
    knowledge_tags: [],
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
const AddKnowledgeDialogRef = ref();
const knowledgeList = ref([]);
const knowledgeLoading = ref(false);
function removeKnowledge(id) {
    const list = props.nodeModel.properties.node_data.knowledge_id_list.filter((v) => v !== id);
    set(props.nodeModel.properties.node_data, 'knowledge_id_list', list);
}
function addKnowledge(val) {
    set(props.nodeModel.properties.node_data, 'knowledge_id_list', val.map((item) => item.id));
    set(props.nodeModel.properties.node_data, 'knowledge_list', val);
    knowledgeList.value = val;
}
function openKnowledgeDialog() {
    if (AddKnowledgeDialogRef.value) {
        AddKnowledgeDialogRef.value.open(form_data.value.knowledge_id_list);
    }
}
function addCondition() {
    const list = cloneDeep(form_data.value.search_condition_list);
    list.push({
        key: '',
        compare: 'contain',
        value: '',
    });
    set(form_data.value, 'search_condition_list', list);
}
function delCondition(index) {
    const list = cloneDeep(form_data.value.search_condition_list);
    list.splice(index, 1);
    set(form_data.value, 'search_condition_list', list);
}
function getAllTags(knowledge_ids) {
    if (knowledge_ids.length === 0) {
        set(form_data.value, 'knowledge_tags', []);
        return;
    }
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .getAllTags({ knowledge_ids: knowledge_ids }, {})
        .then((res) => {
        set(form_data.value, 'knowledge_tags', res.data.slice(0, 100));
        all_knowledge_tags.value = res.data;
    });
}
function filterMethod(val) {
    form_data.value.knowledge_tags = all_knowledge_tags.value
        .filter((item) => item.key.indexOf(val) > -1)
        .slice(0, 100);
}
watch(() => form_data.value.knowledge_id_list, (newVal) => {
    getAllTags(newVal);
}, { immediate: true, deep: true });
const validate = () => {
    return Promise.all([
        nodeCascaderRef.value?.validate(),
        nodeCascaderRef2.value?.validate(),
        knowledgeNodeFormRef.value?.validate(),
    ]).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
onMounted(() => {
    // console.log(props.nodeModel.properties.node_data)
    knowledgeList.value = props.nodeModel.properties.node_data.knowledge_list;
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
    hideRequiredAsterisk: true,
    labelWidth: "auto",
    ref: "knowledgeNodeFormRef",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    hideRequiredAsterisk: true,
    labelWidth: "auto",
    ref: "knowledgeNodeFormRef",
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
            onClick: (__VLS_ctx.openKnowledgeDialog),
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
        [nodeModel, $t, $t, form_data, form_data, openKnowledgeDialog,];
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
                    return __VLS_ctx.removeKnowledge(item);
                    // @ts-ignore
                    [form_data, relatedObject, relatedObject, relatedObject, knowledgeList, knowledgeList, knowledgeList, removeKnowledge,];
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
    label: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.searchSetting')),
}));
const __VLS_135 = __VLS_134({
    label: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.searchSetting')),
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    modelValue: (__VLS_ctx.form_data.search_mode),
}));
const __VLS_141 = __VLS_140({
    modelValue: (__VLS_ctx.form_data.search_mode),
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
const { default: __VLS_144 } = __VLS_142.slots;
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    value: "auto",
}));
const __VLS_147 = __VLS_146({
    value: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
(__VLS_ctx.$t('workflow.nodes.searchDocumentNode.auto'));
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    content: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.autoTooltip')),
    placement: "top",
}));
const __VLS_153 = __VLS_152({
    content: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.autoTooltip')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
const { default: __VLS_156 } = __VLS_154.slots;
const __VLS_157 = AppIcon || AppIcon;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    iconName: "app-warning",
    ...{ class: "app-warning-icon ml-4" },
}));
const __VLS_159 = __VLS_158({
    iconName: "app-warning",
    ...{ class: "app-warning-icon ml-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
/** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
// @ts-ignore
[$t, $t, $t, form_data,];
var __VLS_154;
// @ts-ignore
[];
var __VLS_148;
if (__VLS_ctx.form_data.search_scope_type === 'custom') {
    let __VLS_162;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
        value: "custom",
    }));
    const __VLS_164 = __VLS_163({
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    const { default: __VLS_167 } = __VLS_165.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.custom'));
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        c: true,
        content: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.customTooltip')),
        placement: "top",
    }));
    const __VLS_170 = __VLS_169({
        c: true,
        content: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.customTooltip')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    const { default: __VLS_173 } = __VLS_171.slots;
    const __VLS_174 = AppIcon || AppIcon;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }));
    const __VLS_176 = __VLS_175({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    // @ts-ignore
    [$t, $t, form_data,];
    var __VLS_171;
    // @ts-ignore
    [];
    var __VLS_165;
}
// @ts-ignore
[];
var __VLS_142;
// @ts-ignore
[];
var __VLS_136;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
if (__VLS_ctx.form_data.search_mode === 'auto') {
    let __VLS_179;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
        prop: "question_reference",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
            trigger: 'blur',
            required: true,
        }),
    }));
    const __VLS_181 = __VLS_180({
        prop: "question_reference",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
            trigger: 'blur',
            required: true,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    const { default: __VLS_184 } = __VLS_182.slots;
    {
        const { label: __VLS_185 } = __VLS_182.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.label'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        // @ts-ignore
        [$t, $t, form_data,];
    }
    const __VLS_186 = NodeCascader;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
        ref: "nodeCascaderRef2",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
        modelValue: (__VLS_ctx.form_data.question_reference),
    }));
    const __VLS_188 = __VLS_187({
        ref: "nodeCascaderRef2",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.placeholder')),
        modelValue: (__VLS_ctx.form_data.question_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    var __VLS_191;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_189;
    // @ts-ignore
    [nodeModel, $t, form_data,];
    var __VLS_182;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_193;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
        type: "info",
        ...{ class: "lighter" },
        size: "small",
    }));
    const __VLS_195 = __VLS_194({
        type: "info",
        ...{ class: "lighter" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    const { default: __VLS_198 } = __VLS_196.slots;
    (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.info'));
    // @ts-ignore
    [$t,];
    var __VLS_196;
    let __VLS_199;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
        modelValue: (__VLS_ctx.form_data.search_condition_type),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_201 = __VLS_200({
        modelValue: (__VLS_ctx.form_data.search_condition_type),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_200));
    const { default: __VLS_204 } = __VLS_202.slots;
    let __VLS_205;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
        label: (__VLS_ctx.$t('workflow.condition.AND')),
        value: "AND",
    }));
    const __VLS_207 = __VLS_206({
        label: (__VLS_ctx.$t('workflow.condition.AND')),
        value: "AND",
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    let __VLS_210;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
        label: (__VLS_ctx.$t('workflow.condition.OR')),
        value: "OR",
    }));
    const __VLS_212 = __VLS_211({
        label: (__VLS_ctx.$t('workflow.condition.OR')),
        value: "OR",
    }, ...__VLS_functionalComponentArgsRest(__VLS_211));
    // @ts-ignore
    [$t, $t, form_data,];
    var __VLS_202;
    let __VLS_215;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
        type: "info",
        ...{ class: "lighter" },
        size: "small",
    }));
    const __VLS_217 = __VLS_216({
        type: "info",
        ...{ class: "lighter" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    const { default: __VLS_220 } = __VLS_218.slots;
    (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.label'));
    // @ts-ignore
    [$t,];
    var __VLS_218;
    for (const [c, index] of __VLS_vFor((__VLS_ctx.form_data.search_condition_list))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (index),
        });
        let __VLS_221;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
            gutter: (8),
            ...{ class: "mb-8" },
        }));
        const __VLS_223 = __VLS_222({
            gutter: (8),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_222));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_226 } = __VLS_224.slots;
        let __VLS_227;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
            span: (8),
        }));
        const __VLS_229 = __VLS_228({
            span: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_228));
        const { default: __VLS_232 } = __VLS_230.slots;
        let __VLS_233;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
            modelValue: (c.key),
            filterable: true,
            filterMethod: (__VLS_ctx.filterMethod),
        }));
        const __VLS_235 = __VLS_234({
            modelValue: (c.key),
            filterable: true,
            filterMethod: (__VLS_ctx.filterMethod),
        }, ...__VLS_functionalComponentArgsRest(__VLS_234));
        const { default: __VLS_238 } = __VLS_236.slots;
        for (const [tag] of __VLS_vFor((__VLS_ctx.form_data.knowledge_tags))) {
            let __VLS_239;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
                key: (tag),
                label: (tag.key),
                value: (tag.key),
            }));
            const __VLS_241 = __VLS_240({
                key: (tag),
                label: (tag.key),
                value: (tag.key),
            }, ...__VLS_functionalComponentArgsRest(__VLS_240));
            // @ts-ignore
            [form_data, form_data, filterMethod,];
        }
        // @ts-ignore
        [];
        var __VLS_236;
        // @ts-ignore
        [];
        var __VLS_230;
        let __VLS_244;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
            span: (7),
        }));
        const __VLS_246 = __VLS_245({
            span: (7),
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        const { default: __VLS_249 } = __VLS_247.slots;
        let __VLS_250;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
            modelValue: (c.compare),
        }));
        const __VLS_252 = __VLS_251({
            modelValue: (c.compare),
        }, ...__VLS_functionalComponentArgsRest(__VLS_251));
        const { default: __VLS_255 } = __VLS_253.slots;
        for (const [item] of __VLS_vFor((__VLS_ctx.compareList))) {
            let __VLS_256;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
                key: (item.value),
                value: (item.value),
                label: (item.label),
            }));
            const __VLS_258 = __VLS_257({
                key: (item.value),
                value: (item.value),
                label: (item.label),
            }, ...__VLS_functionalComponentArgsRest(__VLS_257));
            // @ts-ignore
            [compareList,];
        }
        // @ts-ignore
        [];
        var __VLS_253;
        // @ts-ignore
        [];
        var __VLS_247;
        let __VLS_261;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
            span: (8),
        }));
        const __VLS_263 = __VLS_262({
            span: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_262));
        const { default: __VLS_266 } = __VLS_264.slots;
        let __VLS_267;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
            modelValue: (c.value),
            placeholder: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.valueMessage')),
        }));
        const __VLS_269 = __VLS_268({
            modelValue: (c.value),
            placeholder: (__VLS_ctx.$t('workflow.nodes.searchDocumentNode.valueMessage')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_268));
        // @ts-ignore
        [$t,];
        var __VLS_264;
        let __VLS_272;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
            span: (1),
        }));
        const __VLS_274 = __VLS_273({
            span: (1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
        const { default: __VLS_277 } = __VLS_275.slots;
        let __VLS_278;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
            ...{ class: "mt-4" },
        }));
        const __VLS_280 = __VLS_279({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
            ...{ class: "mt-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_279));
        let __VLS_283;
        const __VLS_284 = {
            /** @type {typeof __VLS_283.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.form_data.search_mode === 'auto'))
                    throw 0;
                return __VLS_ctx.delCondition(index);
                // @ts-ignore
                [delCondition,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        const { default: __VLS_285 } = __VLS_281.slots;
        const __VLS_286 = AppIcon || AppIcon;
        // @ts-ignore
        const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
            iconName: "app-delete",
        }));
        const __VLS_288 = __VLS_287({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_287));
        // @ts-ignore
        [];
        var __VLS_281;
        var __VLS_282;
        // @ts-ignore
        [];
        var __VLS_275;
        // @ts-ignore
        [];
        var __VLS_224;
        // @ts-ignore
        [];
    }
    let __VLS_291;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        ...{ class: "mt-8" },
    }));
    const __VLS_293 = __VLS_292({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
    let __VLS_296;
    const __VLS_297 = {
        /** @type {typeof __VLS_296.click} */
        onClick: (__VLS_ctx.addCondition),
    };
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    const { default: __VLS_298 } = __VLS_294.slots;
    const __VLS_299 = AppIcon || AppIcon;
    // @ts-ignore
    const __VLS_300 = __VLS_asFunctionalComponent1(__VLS_299, new __VLS_299({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_301 = __VLS_300({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_300));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('workflow.nodes.conditionNode.addCondition'));
    // @ts-ignore
    [$t, addCondition,];
    var __VLS_294;
    var __VLS_295;
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_304 = AddKnowledgeDialog;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
    ...{ 'onAddData': {} },
    ref: "AddKnowledgeDialogRef",
    data: (__VLS_ctx.knowledgeList),
    loading: (__VLS_ctx.knowledgeLoading),
}));
const __VLS_306 = __VLS_305({
    ...{ 'onAddData': {} },
    ref: "AddKnowledgeDialogRef",
    data: (__VLS_ctx.knowledgeList),
    loading: (__VLS_ctx.knowledgeLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
let __VLS_309;
const __VLS_310 = {
    /** @type {typeof __VLS_309.addData} */
    onAddData: (__VLS_ctx.addKnowledge),
};
var __VLS_311;
var __VLS_307;
var __VLS_308;
// @ts-ignore
[knowledgeList, knowledgeLoading, addKnowledge,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_132 = __VLS_131, __VLS_192 = __VLS_191, __VLS_312 = __VLS_311;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
