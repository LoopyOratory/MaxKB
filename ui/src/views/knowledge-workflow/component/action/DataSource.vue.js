/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, watch, provide } from 'vue';
import { WorkflowKind, WorkflowType } from '@/enums/application';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { iconComponent } from '@/workflow/icons/utils';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { useRoute } from 'vue-router';
import { t } from '@/locales';
import useStore from '@/stores';
const { user } = useStore();
const route = useRoute();
const props = defineProps();
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const model_form_field = ref([]);
const workspace_id = computed(() => {
    return user.getWorkspaceId();
});
const emit = defineEmits(['update:loading']);
const _loading = computed({
    get: () => {
        return props.loading;
    },
    set: (v) => {
        emit('update:loading', v);
    },
});
const dynamicsFormRef = ref();
const base_form_data = ref({ node_id: '' });
const dynamics_form_data = ref({});
const form_data = computed({
    get: () => {
        return { ...dynamics_form_data.value, ...base_form_data.value };
    },
    set: (event) => {
        dynamics_form_data.value = event;
    },
});
const source_node_list = computed(() => {
    return props.workflow?.nodes?.filter((n) => n.properties.kind === WorkflowKind.DataSource);
});
const extra = ref({
    current_tool_id: undefined,
});
const get_extra = () => {
    return extra.value;
};
provide('get_extra', get_extra);
const sourceChange = (node_id) => {
    base_form_data.value.node_id = node_id;
    const n = source_node_list.value.find((n) => n.id == node_id);
    if (n.properties.node_data && n.properties.node_data.tool_lib_id) {
        extra.value.current_tool_id = n.properties.node_data.tool_lib_id;
    }
    node_id = n
        ? [WorkflowType.DataSourceLocalNode, WorkflowType.DataSourceWebNode].includes(n.type)
            ? n.type
            : n.properties.node_data.tool_lib_id
        : node_id;
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .getKnowledgeWorkflowFormList(props.knowledge_id, [WorkflowType.DataSourceLocalNode, WorkflowType.DataSourceWebNode].includes(n.type)
        ? 'local'
        : 'tool', node_id, n, _loading)
        .then((ok) => {
        dynamicsFormRef.value?.render(ok.data);
    });
};
const base_form_data_rule = ref({
    node_id: {
        required: true,
        trigger: 'blur',
        message: t('views.tool.dataSource.requiredMessage'),
    },
});
const validate = () => {
    return dynamicsFormRef.value?.validate();
};
const uploadingCount = computed(() => form_data.value?.file_list?.filter((f) => f.status === 'uploading').length || 0);
const filterSuccessFiles = (data) => {
    return {
        ...data,
        file_list: data?.file_list?.filter((f) => f.status === 'success') || [],
    };
};
const get_data = () => {
    return filterSuccessFiles(form_data.value);
};
watch(source_node_list, () => {
    if (!base_form_data.value.node_id) {
        if (source_node_list.value && source_node_list.value.length > 0) {
            sourceChange(source_node_list.value[0].id);
        }
    }
}, { immediate: true });
const __VLS_exposed = { validate, get_data, uploadingCount };
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
const __VLS_0 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.model_form_field),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    otherParams: ({ current_workspace_id: __VLS_ctx.workspace_id, current_knowledge_id: __VLS_ctx.knowledge_id }),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.model_form_field),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    otherParams: ({ current_workspace_id: __VLS_ctx.workspace_id, current_knowledge_id: __VLS_ctx.knowledge_id }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
{
    const { default: __VLS_8 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16 mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    (__VLS_ctx.$t('views.tool.dataSource.selectDataSource'));
    let __VLS_9;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        label: (__VLS_ctx.$t('views.tool.dataSource.title')),
        prop: "node_id",
        rules: (__VLS_ctx.base_form_data_rule.node_id),
    }));
    const __VLS_11 = __VLS_10({
        label: (__VLS_ctx.$t('views.tool.dataSource.title')),
        prop: "node_id",
        rules: (__VLS_ctx.base_form_data_rule.node_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    const { default: __VLS_14 } = __VLS_12.slots;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        ...{ class: "w-full" },
        gutter: (8),
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: "w-full" },
        gutter: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_20 } = __VLS_18.slots;
    for (const [node] of __VLS_vFor((__VLS_ctx.source_node_list))) {
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            span: (8),
            key: (node.id),
        }));
        const __VLS_23 = __VLS_22({
            span: (8),
            key: (node.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        const { default: __VLS_26 } = __VLS_24.slots;
        let __VLS_27;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
            ...{ 'onClick': {} },
            shadow: "never",
            ...{ class: "card-checkbox cursor w-full mb-8" },
            ...{ class: (__VLS_ctx.base_form_data.node_id === node.id ? 'border-active' : '') },
            ...{ style: {} },
        }));
        const __VLS_29 = __VLS_28({
            ...{ 'onClick': {} },
            shadow: "never",
            ...{ class: "card-checkbox cursor w-full mb-8" },
            ...{ class: (__VLS_ctx.base_form_data.node_id === node.id ? 'border-active' : '') },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_28));
        let __VLS_32;
        const __VLS_33 = {
            /** @type {typeof __VLS_32.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.sourceChange(node.id);
                // @ts-ignore
                [form_data, form_data, model_form_field, workspace_id, knowledge_id, $t, $t, base_form_data_rule, source_node_list, base_form_data, sourceChange,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['card-checkbox']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_34 } = __VLS_30.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        const __VLS_35 = (__VLS_ctx.iconComponent(`${node.type}-icon`));
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
            ...{ class: "mr-8" },
            size: (20),
            item: (node?.properties.node_data),
        }));
        const __VLS_37 = __VLS_36({
            ...{ class: "mr-8" },
            size: (20),
            item: (node?.properties.node_data),
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        (node.properties.stepName);
        // @ts-ignore
        [iconComponent,];
        var __VLS_30;
        var __VLS_31;
        // @ts-ignore
        [];
        var __VLS_24;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_18;
    // @ts-ignore
    [];
    var __VLS_12;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
