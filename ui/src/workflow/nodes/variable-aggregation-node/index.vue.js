/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set, cloneDeep } from 'lodash';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import GroupFieldDialog from './component/GroupFieldDialog.vue';
import { ref, computed, onMounted } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import { t } from '@/locales';
import { randomId } from '@/utils/common';
import { MsgError } from '@/utils/message';
import { VueDraggable } from 'vue-draggable-plus';
const props = defineProps();
const VariableAggregationRef = ref();
const nodeCascaderRef = ref();
const GroupFieldDialogRef = ref();
const form = {
    strategy: 'first_non_null',
    group_list: [
        {
            id: randomId(),
            label: 'Group1',
            field: 'Group1',
            variable_list: [
                {
                    v_id: randomId(),
                    variable: [],
                },
            ],
        },
    ],
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            // Backward compatibility
            if (props.nodeModel.properties.node_data.strategy === 'variable_to_json') {
                props.nodeModel.properties.node_data.strategy = 'variable_to_array';
            }
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
const inputFieldList = ref([]);
function openAddOrEditDialog(group, index) {
    let data = null;
    if (group && index !== undefined) {
        data = {
            field: group.field,
            label: group.label,
        };
    }
    GroupFieldDialogRef.value.open(data, index);
}
function refreshFieldList(data, index) {
    for (let i = 0; i < inputFieldList.value.length; i++) {
        if (inputFieldList.value[i].field === data.field && index !== i) {
            MsgError(t('workflow.tip.paramErrorMessage') + data.field);
            return;
        }
    }
    if ([undefined, null].includes(index)) {
        inputFieldList.value.push(data);
        addGroup(data);
    }
    else {
        inputFieldList.value.splice(index, 1, data);
        editGroupDesc(data, index);
    }
    GroupFieldDialogRef.value.close();
    const fields = [...inputFieldList.value.map((item) => ({ label: item.label, value: item.field }))];
    set(props.nodeModel.properties.config, 'fields', fields);
}
const editGroupDesc = (data, gIndex) => {
    const c_group_list = cloneDeep(form_data.value.group_list);
    c_group_list[gIndex].field = data.field;
    c_group_list[gIndex].label = data.label;
    form_data.value.group_list = c_group_list;
};
const deleteGroup = (gIndex) => {
    const c_group_list = cloneDeep(form_data.value.group_list);
    c_group_list.splice(gIndex, 1);
    form_data.value.group_list = c_group_list;
    inputFieldList.value.splice(gIndex, 1);
    const fields = c_group_list.map((item) => ({ label: item.label, value: item.field }));
    set(props.nodeModel.properties.config, 'fields', fields);
};
const addVariable = (gIndex) => {
    const c_group_list = cloneDeep(form_data.value.group_list);
    c_group_list[gIndex].variable_list.push({
        v_id: randomId(),
        variable: [],
    });
    form_data.value.group_list = c_group_list;
};
const deleteVariable = (gIndex, vIndex) => {
    const c_group_list = cloneDeep(form_data.value.group_list);
    c_group_list[gIndex].variable_list.splice(vIndex, 1);
    form_data.value.group_list = c_group_list;
};
const addGroup = (data) => {
    const c_group_list = cloneDeep(form_data.value.group_list);
    c_group_list.push({
        id: randomId(),
        field: data.field,
        label: data.label,
        variable_list: [
            {
                v_id: randomId(),
                variable: [],
            },
        ],
    });
    form_data.value.group_list = c_group_list;
};
const validate = async () => {
    const validate_list = [
        ...nodeCascaderRef.value.map((item) => item.validate()),
        VariableAggregationRef.value?.validate(),
    ];
    return Promise.all(validate_list).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
function onEnd(event, gIndex) {
    const { oldIndex, newIndex } = event;
    if (oldIndex === undefined || newIndex === undefined)
        return;
    const list = cloneDeep(props.nodeModel.properties.node_data.group_list[gIndex].variable_list);
    const newInstance = { ...list[oldIndex] };
    const oldInstance = { ...list[newIndex] };
    list[newIndex] = newInstance;
    list[oldIndex] = oldInstance;
    set(props.nodeModel.properties.node_data.group_list[gIndex], 'variable_list', list);
}
onMounted(() => {
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
    set(props.nodeModel, 'validate', validate);
    if (props.nodeModel.properties.node_data.group_list) {
        inputFieldList.value = form_data.value.group_list.map((item) => ({
            label: item.label,
            field: item.field,
        }));
    }
    const fields = form_data.value.group_list.map((item) => ({
        label: item.label,
        value: item.field,
    }));
    set(props.nodeModel.properties.config, 'fields', fields);
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
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "VariableAggregationRef",
    hideRequiredAsterisk: true,
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "VariableAggregationRef",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.$t('workflow.nodes.variableAggregationNode.Strategy')),
    rules: ({
        required: true,
        trigger: 'change',
    }),
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('workflow.nodes.variableAggregationNode.Strategy')),
    rules: ({
        required: true,
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
{
    const { label: __VLS_23 } = __VLS_20.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.variableAggregationNode.Strategy'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [nodeModel, $t, $t, $t, form_data,];
}
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.form_data.strategy),
    teleported: (false),
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.form_data.strategy),
    teleported: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: (__VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder')),
    value: "first_non_null",
}));
const __VLS_32 = __VLS_31({
    label: (__VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder')),
    value: "first_non_null",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    label: (__VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder1')),
    value: "variable_to_array",
}));
const __VLS_37 = __VLS_36({
    label: (__VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder1')),
    value: "variable_to_array",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    label: (__VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder2')),
    value: "variable_to_dict",
}));
const __VLS_42 = __VLS_41({
    label: (__VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder2')),
    value: "variable_to_dict",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
// @ts-ignore
[form_data, t, t, t,];
var __VLS_27;
// @ts-ignore
[];
var __VLS_20;
for (const [group, gIndex] of __VLS_vFor((__VLS_ctx.form_data.group_list))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (group.id),
        ...{ class: "mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        shadow: "never",
        ...{ class: "card-never" },
        ...{ style: {} },
    }));
    const __VLS_47 = __VLS_46({
        shadow: "never",
        ...{ class: "card-never" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    const { default: __VLS_50 } = __VLS_48.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between mb-12" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        title: (group.label),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (group.label);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddOrEditDialog(group, gIndex);
            // @ts-ignore
            [form_data, openAddOrEditDialog,];
        },
    };
    const { default: __VLS_58 } = __VLS_54.slots;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({}));
    const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
    const { default: __VLS_64 } = __VLS_62.slots;
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.EditPen} */
    EditPen;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({}));
    const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
    // @ts-ignore
    [];
    var __VLS_62;
    // @ts-ignore
    [];
    var __VLS_54;
    var __VLS_55;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        ...{ 'onClick': {} },
        link: true,
        disabled: (__VLS_ctx.form_data.group_list.length <= 1),
    }));
    const __VLS_72 = __VLS_71({
        ...{ 'onClick': {} },
        link: true,
        disabled: (__VLS_ctx.form_data.group_list.length <= 1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    let __VLS_75;
    const __VLS_76 = {
        /** @type {typeof __VLS_75.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteGroup(gIndex);
            // @ts-ignore
            [form_data, deleteGroup,];
        },
    };
    const { default: __VLS_77 } = __VLS_73.slots;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        iconName: "app-delete",
    }));
    const __VLS_80 = __VLS_79({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    // @ts-ignore
    [];
    var __VLS_73;
    var __VLS_74;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.VueDraggable | typeof __VLS_components.VueDraggable} */
    VueDraggable;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        ...{ 'onEnd': {} },
        ref: "el",
        modelValue: (group.variable_list),
        disabled: (group.variable_list.length === 1),
        handle: ".handle",
        animation: (150),
        ghostClass: "ghost",
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onEnd': {} },
        ref: "el",
        modelValue: (group.variable_list),
        disabled: (group.variable_list.length === 1),
        handle: ".handle",
        animation: (150),
        ghostClass: "ghost",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_88;
    const __VLS_89 = {
        /** @type {typeof __VLS_88.end} */
        onEnd: (...[$event]) => {
            return __VLS_ctx.onEnd($event, gIndex);
            // @ts-ignore
            [onEnd,];
        },
    };
    var __VLS_90;
    const { default: __VLS_92 } = __VLS_86.slots;
    for (const [item, vIndex] of __VLS_vFor((group.variable_list))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (item.v_id),
            ...{ class: "drag-card" },
        });
        /** @type {__VLS_StyleScopedClasses['drag-card']} */ ;
        let __VLS_93;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
            ...{ class: "handle" },
        }));
        const __VLS_95 = __VLS_94({
            ...{ class: "handle" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        /** @type {__VLS_StyleScopedClasses['handle']} */ ;
        const { default: __VLS_98 } = __VLS_96.slots;
        let __VLS_99;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
            span: (22),
            ...{ class: "flex" },
        }));
        const __VLS_101 = __VLS_100({
            span: (22),
            ...{ class: "flex" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        const { default: __VLS_104 } = __VLS_102.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/sort.svg",
            alt: "",
            height: "15",
            ...{ class: "mr-4 mt-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        let __VLS_105;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
            prop: (`group_list.${gIndex}.variable_list.${vIndex}.variable`),
            rules: ({
                type: 'array',
                required: true,
                message: __VLS_ctx.$t('workflow.variable.placeholder'),
                trigger: 'change',
            }),
        }));
        const __VLS_107 = __VLS_106({
            prop: (`group_list.${gIndex}.variable_list.${vIndex}.variable`),
            rules: ({
                type: 'array',
                required: true,
                message: __VLS_ctx.$t('workflow.variable.placeholder'),
                trigger: 'change',
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        const { default: __VLS_110 } = __VLS_108.slots;
        if (__VLS_ctx.form_data.strategy === 'variable_to_dict') {
            let __VLS_111;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
                modelValue: (item.key),
                placeholder: (__VLS_ctx.$t('workflow.variable.placeholder_key')),
                ...{ style: {} },
                maxlength: "256",
            }));
            const __VLS_113 = __VLS_112({
                modelValue: (item.key),
                placeholder: (__VLS_ctx.$t('workflow.variable.placeholder_key')),
                ...{ style: {} },
                maxlength: "256",
            }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        }
        const __VLS_116 = NodeCascader;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
            ref: "nodeCascaderRef",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ style: ({ width: __VLS_ctx.form_data.strategy === 'variable_to_dict' ? '200px' : '308px' }) },
            placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
            modelValue: (item.variable),
        }));
        const __VLS_118 = __VLS_117({
            ref: "nodeCascaderRef",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ style: ({ width: __VLS_ctx.form_data.strategy === 'variable_to_dict' ? '200px' : '308px' }) },
            placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
            modelValue: (item.variable),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        var __VLS_121;
        var __VLS_119;
        // @ts-ignore
        [nodeModel, $t, $t, $t, form_data, form_data,];
        var __VLS_108;
        // @ts-ignore
        [];
        var __VLS_102;
        let __VLS_123;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
            span: (2),
        }));
        const __VLS_125 = __VLS_124({
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        const { default: __VLS_128 } = __VLS_126.slots;
        let __VLS_129;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
            ...{ 'onClick': {} },
            link: true,
            ...{ class: "mt-4 ml-4" },
            disabled: (group.variable_list.length <= 1),
        }));
        const __VLS_131 = __VLS_130({
            ...{ 'onClick': {} },
            link: true,
            ...{ class: "mt-4 ml-4" },
            disabled: (group.variable_list.length <= 1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        let __VLS_134;
        const __VLS_135 = {
            /** @type {typeof __VLS_134.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.deleteVariable(gIndex, vIndex);
                // @ts-ignore
                [deleteVariable,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_136 } = __VLS_132.slots;
        let __VLS_137;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
            iconName: "app-delete",
        }));
        const __VLS_139 = __VLS_138({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        // @ts-ignore
        [];
        var __VLS_132;
        var __VLS_133;
        // @ts-ignore
        [];
        var __VLS_126;
        // @ts-ignore
        [];
        var __VLS_96;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_86;
    var __VLS_87;
    let __VLS_142;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
        ...{ 'onClick': {} },
        type: "primary",
        size: "large",
        link: true,
    }));
    const __VLS_144 = __VLS_143({
        ...{ 'onClick': {} },
        type: "primary",
        size: "large",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    let __VLS_147;
    const __VLS_148 = {
        /** @type {typeof __VLS_147.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.addVariable(gIndex);
            // @ts-ignore
            [addVariable,];
        },
    };
    const { default: __VLS_149 } = __VLS_145.slots;
    let __VLS_150;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_152 = __VLS_151({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t,];
    var __VLS_145;
    var __VLS_146;
    // @ts-ignore
    [];
    var __VLS_48;
    // @ts-ignore
    [];
}
let __VLS_155;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    link: true,
}));
const __VLS_157 = __VLS_156({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
let __VLS_160;
const __VLS_161 = {
    /** @type {typeof __VLS_160.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddOrEditDialog();
        // @ts-ignore
        [openAddOrEditDialog,];
    },
};
const { default: __VLS_162 } = __VLS_158.slots;
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_165 = __VLS_164({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('workflow.nodes.variableAggregationNode.addGroup'));
// @ts-ignore
[$t,];
var __VLS_158;
var __VLS_159;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
const __VLS_168 = GroupFieldDialog || GroupFieldDialog;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
    ...{ 'onRefresh': {} },
    ref: "GroupFieldDialogRef",
}));
const __VLS_170 = __VLS_169({
    ...{ 'onRefresh': {} },
    ref: "GroupFieldDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
let __VLS_173;
const __VLS_174 = {
    /** @type {typeof __VLS_173.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_175;
var __VLS_171;
var __VLS_172;
// @ts-ignore
[refreshFieldList,];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_91 = __VLS_90, __VLS_122 = __VLS_121, __VLS_176 = __VLS_175;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
