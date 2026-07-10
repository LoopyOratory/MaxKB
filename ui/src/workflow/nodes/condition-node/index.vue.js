/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { ref, computed, onMounted } from 'vue';
import { randomId } from '@/utils/common';
import { compareList } from '@/workflow/common/data';
import { VueDraggable } from 'vue-draggable-plus';
const props = defineProps();
const form = {
    branch: [
        {
            conditions: [
                {
                    field: [],
                    compare: '',
                    value: '',
                },
            ],
            id: randomId(),
            type: 'IF',
            condition: 'and',
        },
        {
            conditions: [],
            id: randomId(),
            type: 'ELSE',
            condition: 'and',
        },
    ],
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
const resizeCondition = (wh, row, index) => {
    const branch_condition_list = cloneDeep(props.nodeModel.properties.branch_condition_list
        ? props.nodeModel.properties.branch_condition_list
        : []);
    const new_branch_condition_list = branch_condition_list.map((item) => {
        if (item.id === row.id) {
            return { ...item, height: wh.height, index: index };
        }
        return item;
    });
    set(props.nodeModel.properties, 'branch_condition_list', new_branch_condition_list);
    refreshBranchAnchor(props.nodeModel.properties.node_data.branch, true);
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
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
const ConditionNodeFormRef = ref();
const nodeCascaderRef = ref();
const validate = () => {
    const v_list = [
        ConditionNodeFormRef.value?.validate(),
        ...nodeCascaderRef.value.map((item) => item.validate()),
    ];
    return Promise.all(v_list).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
function onEnd(event) {
    const { oldIndex, newIndex } = event;
    if (oldIndex === undefined || newIndex === undefined)
        return;
    const list = cloneDeep(props.nodeModel.properties.node_data.branch);
    if (oldIndex === list.length - 1 || newIndex === list.length - 1) {
        return;
    }
    const newInstance = { ...list[oldIndex], type: list[newIndex].type, id: list[newIndex].id };
    const oldInstance = { ...list[newIndex], type: list[oldIndex].type, id: list[oldIndex].id };
    list[newIndex] = newInstance;
    list[oldIndex] = oldInstance;
    set(props.nodeModel.properties.node_data, 'branch', list);
}
function addBranch() {
    const list = cloneDeep(props.nodeModel.properties.node_data.branch);
    const obj = {
        conditions: [
            {
                field: [],
                compare: '',
                value: '',
            },
        ],
        type: 'ELSE IF ' + (list.length - 1),
        id: randomId(),
        condition: 'and',
    };
    list.splice(list.length - 1, 0, obj);
    refreshBranchAnchor(list, true);
    set(props.nodeModel.properties.node_data, 'branch', list);
}
function refreshBranchAnchor(list, is_add) {
    const branch_condition_list = cloneDeep(props.nodeModel.properties.branch_condition_list
        ? props.nodeModel.properties.branch_condition_list
        : []);
    const new_branch_condition_list = list
        .map((item, index) => {
        const find = branch_condition_list.find((b) => b.id === item.id);
        if (find) {
            return { index: index, height: find.height, id: item.id };
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
function addCondition(index) {
    const list = cloneDeep(props.nodeModel.properties.node_data.branch);
    list[index]['conditions'].push({
        field: [],
        compare: '',
        value: '',
    });
    set(props.nodeModel.properties.node_data, 'branch', list);
}
function deleteCondition(index, cIndex) {
    const list = cloneDeep(props.nodeModel.properties.node_data.branch);
    list[index]['conditions'].splice(cIndex, 1);
    if (list[index]['conditions'].length === 0) {
        const delete_edge = list.splice(index, 1);
        const delete_target_anchor_id_list = delete_edge.map((item) => props.nodeModel.id + '_' + item.id + '_right');
        props.nodeModel.graphModel.eventCenter.emit('delete_edge', props.nodeModel.outgoing.edges
            .filter((item) => delete_target_anchor_id_list.includes(item.sourceAnchorId))
            .map((item) => item.id));
        refreshBranchAnchor(list, false);
        list.forEach((item, index) => {
            if (item.type === 'ELSE IF ' + (index + 1)) {
                item.type = 'ELSE IF ' + index;
            }
        });
    }
    set(props.nodeModel.properties.node_data, 'branch', list);
}
function changeCondition(val, index, cIndex) {
    if (['is_null', 'is_not_null', 'is_true', 'is_not_true'].includes(val)) {
        const list = cloneDeep(props.nodeModel.properties.node_data.branch);
        list[index]['conditions'][cIndex].value = 1;
        set(props.nodeModel.properties.node_data, 'branch', list);
    }
}
onMounted(() => {
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
    ref: "ConditionNodeFormRef",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "ConditionNodeFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.VueDraggable | typeof __VLS_components.VueDraggable} */
VueDraggable;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ 'onEnd': {} },
    ref: "el",
    modelValue: (__VLS_ctx.form_data.branch),
    disabled: (__VLS_ctx.form_data.branch.length === 2),
    handle: ".handle",
    animation: (150),
    ghostClass: "ghost",
}));
const __VLS_19 = __VLS_18({
    ...{ 'onEnd': {} },
    ref: "el",
    modelValue: (__VLS_ctx.form_data.branch),
    disabled: (__VLS_ctx.form_data.branch.length === 2),
    handle: ".handle",
    animation: (150),
    ghostClass: "ghost",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
const __VLS_23 = {
    /** @type {typeof __VLS_22.end} */
    onEnd: (__VLS_ctx.onEnd),
};
var __VLS_24;
const { default: __VLS_26 } = __VLS_20.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.form_data.branch))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (item.id),
    });
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        shadow: "never",
        ...{ class: "drag-card card-never mb-8" },
        ...{ class: ({
                'no-drag': index === __VLS_ctx.form_data.branch.length - 1 || __VLS_ctx.form_data.branch.length === 2,
            }) },
        ...{ style: {} },
    }));
    const __VLS_29 = __VLS_28({
        shadow: "never",
        ...{ class: "drag-card card-never mb-8" },
        ...{ class: ({
                'no-drag': index === __VLS_ctx.form_data.branch.length - 1 || __VLS_ctx.form_data.branch.length === 2,
            }) },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    __VLS_asFunctionalDirective(__VLS_directives.vResize, {})(null, { ...__VLS_directiveBindingRestFields, value: ((wh) => __VLS_ctx.resizeCondition(wh, item, index)) }, null, null);
    /** @type {__VLS_StyleScopedClasses['drag-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['no-drag']} */ ;
    const { default: __VLS_32 } = __VLS_30.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "handle flex-between lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['handle']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/sort.svg",
        alt: "",
        height: "15",
        ...{ class: "handle-img mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['handle-img']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (item.type);
    if (item.conditions.length > 1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "info" },
        });
        /** @type {__VLS_StyleScopedClasses['info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.info'));
        let __VLS_33;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
            teleported: (false),
            modelValue: (item.condition),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_35 = __VLS_34({
            teleported: (false),
            modelValue: (item.condition),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        const { default: __VLS_38 } = __VLS_36.slots;
        let __VLS_39;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
            label: (__VLS_ctx.$t('workflow.condition.AND')),
            value: "and",
        }));
        const __VLS_41 = __VLS_40({
            label: (__VLS_ctx.$t('workflow.condition.AND')),
            value: "and",
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        let __VLS_44;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
            label: (__VLS_ctx.$t('workflow.condition.OR')),
            value: "or",
        }));
        const __VLS_46 = __VLS_45({
            label: (__VLS_ctx.$t('workflow.condition.OR')),
            value: "or",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        // @ts-ignore
        [nodeModel, form_data, form_data, form_data, form_data, form_data, form_data, onEnd, vResize, resizeCondition, $t, $t, $t,];
        var __VLS_36;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.label'));
    }
    if (index !== __VLS_ctx.form_data.branch.length - 1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mt-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        for (const [condition, cIndex] of __VLS_vFor((item.conditions))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (cIndex),
            });
            let __VLS_49;
            /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
            elRow;
            // @ts-ignore
            const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
                gutter: (8),
            }));
            const __VLS_51 = __VLS_50({
                gutter: (8),
            }, ...__VLS_functionalComponentArgsRest(__VLS_50));
            const { default: __VLS_54 } = __VLS_52.slots;
            let __VLS_55;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
                span: (11),
            }));
            const __VLS_57 = __VLS_56({
                span: (11),
            }, ...__VLS_functionalComponentArgsRest(__VLS_56));
            const { default: __VLS_60 } = __VLS_58.slots;
            let __VLS_61;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
                prop: ('branch.' + index + '.conditions.' + cIndex + '.field'),
                rules: ({
                    type: 'array',
                    required: true,
                    message: __VLS_ctx.$t('workflow.variable.placeholder'),
                    trigger: 'change',
                }),
            }));
            const __VLS_63 = __VLS_62({
                prop: ('branch.' + index + '.conditions.' + cIndex + '.field'),
                rules: ({
                    type: 'array',
                    required: true,
                    message: __VLS_ctx.$t('workflow.variable.placeholder'),
                    trigger: 'change',
                }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
            const { default: __VLS_66 } = __VLS_64.slots;
            const __VLS_67 = NodeCascader;
            // @ts-ignore
            const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
                ref: "nodeCascaderRef",
                nodeModel: (__VLS_ctx.nodeModel),
                ...{ class: "w-full" },
                placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
                modelValue: (condition.field),
            }));
            const __VLS_69 = __VLS_68({
                ref: "nodeCascaderRef",
                nodeModel: (__VLS_ctx.nodeModel),
                ...{ class: "w-full" },
                placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
                modelValue: (condition.field),
            }, ...__VLS_functionalComponentArgsRest(__VLS_68));
            var __VLS_72;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            var __VLS_70;
            // @ts-ignore
            [nodeModel, form_data, $t, $t, $t,];
            var __VLS_64;
            // @ts-ignore
            [];
            var __VLS_58;
            let __VLS_74;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
                span: (6),
            }));
            const __VLS_76 = __VLS_75({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_75));
            const { default: __VLS_79 } = __VLS_77.slots;
            let __VLS_80;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                prop: ('branch.' + index + '.conditions.' + cIndex + '.compare'),
                rules: ({
                    required: true,
                    message: __VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage'),
                    trigger: 'change',
                }),
            }));
            const __VLS_82 = __VLS_81({
                prop: ('branch.' + index + '.conditions.' + cIndex + '.compare'),
                rules: ({
                    required: true,
                    message: __VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage'),
                    trigger: 'change',
                }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            const { default: __VLS_85 } = __VLS_83.slots;
            let __VLS_86;
            /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
            elSelect;
            // @ts-ignore
            const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                ...{ 'onWheel': {} },
                ...{ 'onChange': {} },
                teleported: (false),
                modelValue: (condition.compare),
                placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage')),
                clearable: true,
            }));
            const __VLS_88 = __VLS_87({
                ...{ 'onWheel': {} },
                ...{ 'onChange': {} },
                teleported: (false),
                modelValue: (condition.compare),
                placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage')),
                clearable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_87));
            let __VLS_91;
            const __VLS_92 = {
                /** @type {typeof __VLS_91.wheel} */
                onWheel: (__VLS_ctx.wheel),
            };
            const __VLS_93 = {
                /** @type {typeof __VLS_91.change} */
                onChange: (...[$event]) => {
                    if (!(index !== __VLS_ctx.form_data.branch.length - 1))
                        throw 0;
                    return __VLS_ctx.changeCondition($event, index, cIndex);
                    // @ts-ignore
                    [$t, $t, wheel, changeCondition,];
                },
            };
            const { default: __VLS_94 } = __VLS_89.slots;
            for (const [item, index] of __VLS_vFor((__VLS_ctx.compareList))) {
                __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                    key: (index),
                });
                let __VLS_95;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
                    label: (item.label),
                    value: (item.value),
                }));
                const __VLS_97 = __VLS_96({
                    label: (item.label),
                    value: (item.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_96));
                // @ts-ignore
                [compareList,];
            }
            // @ts-ignore
            [];
            var __VLS_89;
            var __VLS_90;
            // @ts-ignore
            [];
            var __VLS_83;
            // @ts-ignore
            [];
            var __VLS_77;
            let __VLS_100;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
                span: (6),
            }));
            const __VLS_102 = __VLS_101({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            const { default: __VLS_105 } = __VLS_103.slots;
            if (!['is_null', 'is_not_null', 'is_true', 'is_not_true'].includes(condition.compare)) {
                let __VLS_106;
                /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
                elFormItem;
                // @ts-ignore
                const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
                    prop: ('branch.' + index + '.conditions.' + cIndex + '.value'),
                    rules: ({
                        required: true,
                        message: __VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage'),
                        trigger: 'blur',
                    }),
                }));
                const __VLS_108 = __VLS_107({
                    prop: ('branch.' + index + '.conditions.' + cIndex + '.value'),
                    rules: ({
                        required: true,
                        message: __VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage'),
                        trigger: 'blur',
                    }),
                }, ...__VLS_functionalComponentArgsRest(__VLS_107));
                const { default: __VLS_111 } = __VLS_109.slots;
                let __VLS_112;
                /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
                elInput;
                // @ts-ignore
                const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
                    modelValue: (condition.value),
                    placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
                }));
                const __VLS_114 = __VLS_113({
                    modelValue: (condition.value),
                    placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
                }, ...__VLS_functionalComponentArgsRest(__VLS_113));
                // @ts-ignore
                [$t, $t,];
                var __VLS_109;
            }
            // @ts-ignore
            [];
            var __VLS_103;
            let __VLS_117;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
                span: (1),
            }));
            const __VLS_119 = __VLS_118({
                span: (1),
            }, ...__VLS_functionalComponentArgsRest(__VLS_118));
            const { default: __VLS_122 } = __VLS_120.slots;
            let __VLS_123;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
                ...{ 'onClick': {} },
                disabled: (__VLS_ctx.form_data.branch.length === 2 && item.conditions.length === 1),
                link: true,
                type: "info",
                ...{ class: "mt-4" },
            }));
            const __VLS_125 = __VLS_124({
                ...{ 'onClick': {} },
                disabled: (__VLS_ctx.form_data.branch.length === 2 && item.conditions.length === 1),
                link: true,
                type: "info",
                ...{ class: "mt-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_124));
            let __VLS_128;
            const __VLS_129 = {
                /** @type {typeof __VLS_128.click} */
                onClick: (...[$event]) => {
                    if (!(index !== __VLS_ctx.form_data.branch.length - 1))
                        throw 0;
                    return __VLS_ctx.deleteCondition(index, cIndex);
                    // @ts-ignore
                    [form_data, deleteCondition,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            const { default: __VLS_130 } = __VLS_126.slots;
            let __VLS_131;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
                iconName: "app-delete",
            }));
            const __VLS_133 = __VLS_132({
                iconName: "app-delete",
            }, ...__VLS_functionalComponentArgsRest(__VLS_132));
            // @ts-ignore
            [];
            var __VLS_126;
            var __VLS_127;
            // @ts-ignore
            [];
            var __VLS_120;
            // @ts-ignore
            [];
            var __VLS_52;
            // @ts-ignore
            [];
        }
    }
    if (index !== __VLS_ctx.form_data.branch.length - 1) {
        let __VLS_136;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_138 = __VLS_137({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        let __VLS_141;
        const __VLS_142 = {
            /** @type {typeof __VLS_141.click} */
            onClick: (...[$event]) => {
                if (!(index !== __VLS_ctx.form_data.branch.length - 1))
                    throw 0;
                return __VLS_ctx.addCondition(index);
                // @ts-ignore
                [form_data, addCondition,];
            },
        };
        const { default: __VLS_143 } = __VLS_139.slots;
        let __VLS_144;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }));
        const __VLS_146 = __VLS_145({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('workflow.nodes.conditionNode.addCondition'));
        // @ts-ignore
        [$t,];
        var __VLS_139;
        var __VLS_140;
    }
    // @ts-ignore
    [];
    var __VLS_30;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_20;
var __VLS_21;
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_151 = __VLS_150({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
let __VLS_154;
const __VLS_155 = {
    /** @type {typeof __VLS_154.click} */
    onClick: (__VLS_ctx.addBranch),
};
const { default: __VLS_156 } = __VLS_152.slots;
let __VLS_157;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_159 = __VLS_158({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('workflow.nodes.conditionNode.addBranch'));
// @ts-ignore
[$t, addBranch,];
var __VLS_152;
var __VLS_153;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_25 = __VLS_24, __VLS_73 = __VLS_72;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
