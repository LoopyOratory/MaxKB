/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import AddFormCollect from '@/workflow/common/AddFormCollect.vue';
import EditFormCollect from '@/workflow/common/EditFormCollect.vue';
import { ref, onMounted, computed, provide, inject } from 'vue';
import { input_type_list } from '@/components/dynamics-form/constructor/data';
import { WorkflowMode } from '@/enums/application';
import { MsgError } from '@/utils/message';
import { set, cloneDeep } from 'lodash';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import Sortable from 'sortablejs';
import { t } from '@/locales';
const props = defineProps();
provide('getModel', () => props.nodeModel);
const workflowMode = inject('workflowMode', WorkflowMode.Application);
const enableVisibility = computed(() => workflowMode === WorkflowMode.Application || workflowMode === WorkflowMode.ApplicationLoop);
const getResourceDetail = inject('getResourceDetail');
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
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
const formNodeFormRef = ref();
const tableRef = ref();
const editFormField = (form_field_data, field_index) => {
    const _value = form_data.value.form_field_list.map((item, index) => {
        if (field_index === index) {
            return cloneDeep(form_field_data);
        }
        return cloneDeep(item);
    });
    form_data.value.form_field_list = _value;
    sync_form_field_list();
};
const addFormField = (form_field_data) => {
    if (form_data.value.form_field_list.some((field) => field.field === form_field_data.field)) {
        MsgError(t('workflow.tip.paramErrorMessage') + form_field_data.field);
        return;
    }
    form_data.value.form_field_list = cloneDeep([...form_data.value.form_field_list, form_field_data]);
    sync_form_field_list();
};
const sync_form_field_list = () => {
    const fields = [
        {
            label: t('workflow.nodes.formNode.formAllContent'),
            value: 'form_data',
        },
        ...form_data.value.form_field_list.map((item) => ({
            value: item.field,
            label: typeof item.label == 'string' ? item.label : item.label.label,
        })),
    ];
    set(props.nodeModel.properties.config, 'fields', fields);
    props.nodeModel.clear_next_node_field(false);
    onDragHandle();
};
const addFormCollectRef = ref();
const editFormCollectRef = ref();
const openAddFormCollect = () => {
    addFormCollectRef.value?.open();
};
const openEditFormCollect = (form_field_data, index) => {
    editFormCollectRef.value?.open(cloneDeep(form_field_data), index);
};
const deleteField = (form_field_data) => {
    form_data.value.form_field_list = form_data.value.form_field_list.filter((field) => field.field !== form_field_data.field);
    sync_form_field_list();
};
const form = ref({
    is_result: true,
    form_content_format: `${t('workflow.nodes.formNode.form_content_format1')}
{{form}}
${t('workflow.nodes.formNode.form_content_format2')}`,
    form_field_list: [],
});
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            return props.nodeModel.properties.node_data;
        }
        else {
            set(props.nodeModel.properties, 'node_data', form.value);
        }
        return props.nodeModel.properties.node_data;
    },
    set: (value) => {
        set(props.nodeModel.properties, 'node_data', value);
    },
});
const getDefaultValue = (row) => {
    if (row.default_value) {
        const default_value = row.option_list
            ?.filter((v) => row.default_value.indexOf(v.value) > -1)
            .map((v) => v.label)
            .join(',');
        if (default_value) {
            return default_value;
        }
        return row.default_value;
    }
    if (row.default_value !== undefined) {
        return row.default_value;
    }
};
const validate = () => {
    const v_list = [formNodeFormRef.value?.validate()];
    const upstreamNodes = props.nodeModel.get_up_node_field_list(true, true);
    if (props.nodeModel.graphModel.get_up_node_field_list) {
        const outer = props.nodeModel.graphModel.get_up_node_field_list(true, true);
        outer.forEach((item) => upstreamNodes.push(item));
    }
    for (const field of form_data.value.form_field_list) {
        for (const cond of field.visibility_rules?.conditions || []) {
            if (!cond.field || cond.field.length < 2 || !cond.field[0] || !cond.field[1])
                continue;
            if (cond.field[0] === props.nodeModel.id) {
                // Same node: check form_field_list
                if (!form_data.value.form_field_list.some((f) => f.field === cond.field[1])) {
                    v_list.push(Promise.reject(t('workflow.variable.NoReferencing')));
                }
            }
            else {
                // Cross-node: check upstream (including loop outer graph nodes)
                const nodeEntry = upstreamNodes.find((n) => n.value === cond.field[0]);
                if (!nodeEntry || !nodeEntry.children?.some((c) => c.value === cond.field[1])) {
                    v_list.push(Promise.reject(t('workflow.variable.NoReferencing')));
                }
            }
        }
    }
    return Promise.all(v_list).catch((err) => Promise.reject({ node: props.nodeModel, errMessage: err }));
};
function submitDialog(val) {
    set(props.nodeModel.properties.node_data, 'form_content_format', val);
}
// Table sort drag
function onDragHandle() {
    if (!tableRef.value)
        return;
    // Get table tbody DOM element
    const wrapper = tableRef.value.$el;
    const tbody = wrapper.querySelector('.el-table__body-wrapper tbody');
    if (!tbody)
        return;
    // Initialize Sortable
    Sortable.create(tbody, {
        animation: 150,
        ghostClass: 'ghost-row',
        onEnd: (evt) => {
            if (evt.oldIndex === undefined || evt.newIndex === undefined)
                return;
            // Update data order
            const items = cloneDeep([...form_data.value.form_field_list]);
            const [movedItem] = items.splice(evt.oldIndex, 1);
            items.splice(evt.newIndex, 0, movedItem);
            form_data.value.form_field_list = items;
            sync_form_field_list();
        },
    });
}
onMounted(() => {
    set(props.nodeModel, 'validate', validate);
    sync_form_field_list();
    props.nodeModel.graphModel.eventCenter.emit('refresh_incoming_node_field');
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
    ref: "formNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "formNodeFormRef",
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
    label: (__VLS_ctx.$t('workflow.nodes.formNode.formContent.label')),
    prop: "form_content_format",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.formNode.formContent.requiredMessage'),
        trigger: 'blur',
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('workflow.nodes.formNode.formContent.label')),
    prop: "form_content_format",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.formNode.formContent.requiredMessage'),
        trigger: 'blur',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
{
    const { label: __VLS_29 } = __VLS_26.slots;
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
    (__VLS_ctx.$t('workflow.nodes.formNode.formContent.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }));
    const __VLS_32 = __VLS_31({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    {
        const { content: __VLS_36 } = __VLS_33.slots;
        (__VLS_ctx.$t('workflow.nodes.formNode.formContent.tooltip', {
            form: '{ form }',
        }));
        // @ts-ignore
        [nodeModel, $t, $t, $t, $t, $t, form_data,];
    }
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_39 = __VLS_38({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_33;
    // @ts-ignore
    [];
}
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('workflow.nodes.formNode.formContent.label')),
    modelValue: (__VLS_ctx.form_data.form_content_format),
    ...{ style: {} },
}));
const __VLS_44 = __VLS_43({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('workflow.nodes.formNode.formContent.label')),
    modelValue: (__VLS_ctx.form_data.form_content_format),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_47;
const __VLS_48 = {
    /** @type {typeof __VLS_47.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitDialog),
};
var __VLS_45;
var __VLS_46;
// @ts-ignore
[$t, form_data, submitDialog,];
var __VLS_26;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.formNode.formSetting')),
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.formNode.formSetting')),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
const __VLS_55 = {
    /** @type {typeof __VLS_54.click} */
    onClick: () => { },
};
const { default: __VLS_56 } = __VLS_52.slots;
{
    const { label: __VLS_57 } = __VLS_52.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('workflow.nodes.formNode.formSetting'));
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_60 = __VLS_59({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    let __VLS_63;
    const __VLS_64 = {
        /** @type {typeof __VLS_63.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddFormCollect();
            // @ts-ignore
            [$t, $t, openAddFormCollect,];
        },
    };
    const { default: __VLS_65 } = __VLS_61.slots;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_68 = __VLS_67({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t,];
    var __VLS_61;
    var __VLS_62;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.form_field_list.length > 0) {
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        ...{ class: "border" },
        data: (__VLS_ctx.form_data.form_field_list),
        ref: "tableRef",
        rowKey: "field",
    }));
    const __VLS_73 = __VLS_72({
        ...{ class: "border" },
        data: (__VLS_ctx.form_data.form_field_list),
        ref: "tableRef",
        rowKey: "field",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    var __VLS_76;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    const { default: __VLS_78 } = __VLS_74.slots;
    let __VLS_79;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
        prop: "field",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        width: "95",
    }));
    const __VLS_81 = __VLS_80({
        prop: "field",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        width: "95",
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    const { default: __VLS_84 } = __VLS_82.slots;
    {
        const { default: __VLS_85 } = __VLS_82.slots;
        const [{ row }] = __VLS_vSlot(__VLS_85);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.field),
            ...{ class: "ellipsis-1" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.field);
        // @ts-ignore
        [$t, form_data, form_data,];
    }
    // @ts-ignore
    [];
    var __VLS_82;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        prop: "label",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    }));
    const __VLS_88 = __VLS_87({
        prop: "label",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const { default: __VLS_91 } = __VLS_89.slots;
    {
        const { default: __VLS_92 } = __VLS_89.slots;
        const [{ row }] = __VLS_vSlot(__VLS_92);
        if (row.label && row.label.input_type === 'TooltipLabel') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                title: (row.label.label),
                ...{ class: "ellipsis-1" },
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (row.label.label);
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                title: (row.label),
                ...{ class: "ellipsis-1" },
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (row.label);
        }
        // @ts-ignore
        [$t,];
    }
    // @ts-ignore
    [];
    var __VLS_89;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        width: "110px",
    }));
    const __VLS_95 = __VLS_94({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        width: "110px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    const { default: __VLS_98 } = __VLS_96.slots;
    {
        const { default: __VLS_99 } = __VLS_96.slots;
        const [{ row }] = __VLS_vSlot(__VLS_99);
        let __VLS_100;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_102 = __VLS_101({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_105 } = __VLS_103.slots;
        (__VLS_ctx.input_type_list.find((item) => item.value === row.input_type)?.label);
        // @ts-ignore
        [$t, input_type_list,];
        var __VLS_103;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_96;
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        prop: "default_value",
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    }));
    const __VLS_108 = __VLS_107({
        prop: "default_value",
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    const { default: __VLS_111 } = __VLS_109.slots;
    {
        const { default: __VLS_112 } = __VLS_109.slots;
        const [{ row }] = __VLS_vSlot(__VLS_112);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.default_value),
            ...{ class: "ellipsis-1" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (__VLS_ctx.getDefaultValue(row));
        // @ts-ignore
        [$t, getDefaultValue,];
    }
    // @ts-ignore
    [];
    var __VLS_109;
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        label: (__VLS_ctx.$t('common.required')),
        width: "55",
    }));
    const __VLS_115 = __VLS_114({
        label: (__VLS_ctx.$t('common.required')),
        width: "55",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    const { default: __VLS_118 } = __VLS_116.slots;
    {
        const { default: __VLS_119 } = __VLS_116.slots;
        const [{ row }] = __VLS_vSlot(__VLS_119);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
        });
        let __VLS_120;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
            disabled: true,
            size: "small",
            modelValue: (row.required),
        }));
        const __VLS_122 = __VLS_121({
            disabled: true,
            size: "small",
            modelValue: (row.required),
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        // @ts-ignore
        [$t,];
    }
    // @ts-ignore
    [];
    var __VLS_116;
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "80",
    }));
    const __VLS_127 = __VLS_126({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    const { default: __VLS_130 } = __VLS_128.slots;
    {
        const { default: __VLS_131 } = __VLS_128.slots;
        const [{ row, $index }] = __VLS_vSlot(__VLS_131);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_132;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }));
        const __VLS_134 = __VLS_133({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        const { default: __VLS_137 } = __VLS_135.slots;
        let __VLS_138;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_140 = __VLS_139({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
        let __VLS_143;
        const __VLS_144 = {
            /** @type {typeof __VLS_143.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form_data.form_field_list.length > 0))
                    throw 0;
                return __VLS_ctx.openEditFormCollect(row, $index);
                // @ts-ignore
                [$t, $t, openEditFormCollect,];
            },
        };
        const { default: __VLS_145 } = __VLS_141.slots;
        let __VLS_146;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
            iconName: "app-edit",
        }));
        const __VLS_148 = __VLS_147({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_147));
        // @ts-ignore
        [];
        var __VLS_141;
        var __VLS_142;
        // @ts-ignore
        [];
        var __VLS_135;
        let __VLS_151;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }));
        const __VLS_153 = __VLS_152({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_152));
        const { default: __VLS_156 } = __VLS_154.slots;
        let __VLS_157;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_159 = __VLS_158({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        let __VLS_162;
        const __VLS_163 = {
            /** @type {typeof __VLS_162.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form_data.form_field_list.length > 0))
                    throw 0;
                return __VLS_ctx.deleteField(row);
                // @ts-ignore
                [$t, deleteField,];
            },
        };
        const { default: __VLS_164 } = __VLS_160.slots;
        let __VLS_165;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
            iconName: "app-delete",
        }));
        const __VLS_167 = __VLS_166({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        // @ts-ignore
        [];
        var __VLS_160;
        var __VLS_161;
        // @ts-ignore
        [];
        var __VLS_154;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_128;
    // @ts-ignore
    [];
    var __VLS_74;
}
// @ts-ignore
[];
var __VLS_52;
var __VLS_53;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_170 = AddFormCollect || AddFormCollect;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    ref: "addFormCollectRef",
    addFormField: (__VLS_ctx.addFormField),
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.form_data.form_field_list),
    enableVisibility: (__VLS_ctx.enableVisibility),
}));
const __VLS_172 = __VLS_171({
    ref: "addFormCollectRef",
    addFormField: (__VLS_ctx.addFormField),
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.form_data.form_field_list),
    enableVisibility: (__VLS_ctx.enableVisibility),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
var __VLS_175;
var __VLS_173;
const __VLS_177 = EditFormCollect;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    ref: "editFormCollectRef",
    editFormField: (__VLS_ctx.editFormField),
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.form_data.form_field_list),
    enableVisibility: (__VLS_ctx.enableVisibility),
}));
const __VLS_179 = __VLS_178({
    ref: "editFormCollectRef",
    editFormField: (__VLS_ctx.editFormField),
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.form_data.form_field_list),
    enableVisibility: (__VLS_ctx.enableVisibility),
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
var __VLS_182;
var __VLS_180;
// @ts-ignore
[nodeModel, nodeModel, form_data, form_data, addFormField, enableVisibility, enableVisibility, editFormField,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_77 = __VLS_76, __VLS_176 = __VLS_175, __VLS_183 = __VLS_182;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
