/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { computed, onMounted, ref, inject } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import { randomId } from '@/utils/common';
import { t } from '@/locales';
import { WorkflowMode } from '@/enums/application';
const workflowMode = inject('workflowMode');
const props = defineProps();
const typeOptions = ['string', 'num', 'json', 'bool'];
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
const form = {
    variable_list: [
        {
            id: randomId(),
            fields: [],
            value: null,
            reference: [],
            type: 'string',
            source: 'custom',
            name: '',
        },
    ],
};
const boolValue = ref(1);
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
function submitDialog(val) {
    set(props.nodeModel.properties.node_data, 'content', val);
}
const replyNodeFormRef = ref();
const nodeCascaderRef = ref();
const nodeCascaderRef2 = ref();
const validate = async () => {
    // console.log(replyNodeFormRef.value.validate())
    let ps = [
        replyNodeFormRef.value?.validate(),
        ...nodeCascaderRef.value.map((item) => item.validate()),
    ];
    if (nodeCascaderRef2.value) {
        ps = [...ps, ...nodeCascaderRef.value.map((item) => item.validate())];
    }
    return Promise.all(ps).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
function addVariable() {
    const list = cloneDeep(props.nodeModel.properties.node_data.variable_list);
    const obj = {
        id: randomId(),
        fields: [],
        value: null,
        reference: [],
        type: 'string',
        source: 'custom',
        name: '',
    };
    list.push(obj);
    set(props.nodeModel.properties.node_data, 'variable_list', list);
}
function deleteVariable(index) {
    const list = cloneDeep(props.nodeModel.properties.node_data.variable_list);
    list.splice(index, 1);
    set(props.nodeModel.properties.node_data, 'variable_list', list);
}
function variableChange(item) {
    ;
    (workflowMode == WorkflowMode.ApplicationLoop
        ? [...props.nodeModel.graphModel.nodes, ...props.nodeModel.graphModel.get_parent_nodes()]
        : props.nodeModel.graphModel.nodes).map((node) => {
        if (node.id === 'start-node') {
            node.properties.config.globalFields.forEach((field) => {
                if (field.value === item.fields[1]) {
                    item.name = field.label;
                }
            });
            node.properties.config.chatFields.forEach((field) => {
                if (field.value === item.fields[1]) {
                    item.name = field.label;
                }
            });
        }
        if (node.id === 'loop-start-node') {
            node.properties.loop_input_field_list.forEach((field) => {
                if (field.field === item.fields[1]) {
                    item.name = field.label;
                }
            });
        }
    });
}
onMounted(() => {
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
    ref: "replyNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "replyNodeFormRef",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.form_data.variable_list))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (item.id),
    });
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        shadow: "never",
        ...{ class: "card-never mb-8" },
        ...{ style: {} },
    }));
    const __VLS_19 = __VLS_18({
        shadow: "never",
        ...{ class: "card-never mb-8" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    const { default: __VLS_22 } = __VLS_20.slots;
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
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (__VLS_ctx.$t('common.variable'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        if (__VLS_ctx.form_data.variable_list.length > 1) {
            let __VLS_30;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_32 = __VLS_31({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            let __VLS_35;
            const __VLS_36 = {
                /** @type {typeof __VLS_35.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.form_data.variable_list.length > 1))
                        throw 0;
                    return __VLS_ctx.deleteVariable(index);
                    // @ts-ignore
                    [nodeModel, form_data, form_data, form_data, $t, deleteVariable,];
                },
            };
            const { default: __VLS_37 } = __VLS_33.slots;
            let __VLS_38;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
                iconName: "app-delete",
            }));
            const __VLS_40 = __VLS_39({
                iconName: "app-delete",
            }, ...__VLS_functionalComponentArgsRest(__VLS_39));
            // @ts-ignore
            [];
            var __VLS_33;
            var __VLS_34;
        }
        // @ts-ignore
        [];
    }
    const __VLS_43 = NodeCascader;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onChange': {} },
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (item.fields),
        global: (true),
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onChange': {} },
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (item.fields),
        global: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.variableChange(item);
            // @ts-ignore
            [nodeModel, $t, variableChange,];
        },
    };
    var __VLS_50;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_46;
    var __VLS_47;
    // @ts-ignore
    [];
    var __VLS_26;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('workflow.nodes.variableAssignNode.assign'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        teleported: (false),
        modelValue: (item.source),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_54 = __VLS_53({
        teleported: (false),
        modelValue: (item.source),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const { default: __VLS_57 } = __VLS_55.slots;
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }));
    const __VLS_60 = __VLS_59({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_65 = __VLS_64({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        label: "null",
        value: "null",
    }));
    const __VLS_70 = __VLS_69({
        label: "null",
        value: "null",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    // @ts-ignore
    [$t, $t, $t,];
    var __VLS_55;
    if (item.source === 'custom') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        let __VLS_73;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
            ...{ 'onChange': {} },
            modelValue: (item.type),
            ...{ style: {} },
            ...{ class: "mr-8" },
        }));
        const __VLS_75 = __VLS_74({
            ...{ 'onChange': {} },
            modelValue: (item.type),
            ...{ style: {} },
            ...{ class: "mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        let __VLS_78;
        const __VLS_79 = {
            /** @type {typeof __VLS_78.change} */
            onChange: ((val) => {
                if (val === 'bool') {
                    __VLS_ctx.form_data.variable_list[index].value = true;
                }
                else {
                    __VLS_ctx.form_data.variable_list[index].value = null;
                }
            }),
        };
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_80 } = __VLS_76.slots;
        for (const [item] of __VLS_vFor((__VLS_ctx.typeOptions))) {
            let __VLS_81;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
                key: (item),
                label: (item),
                value: (item),
            }));
            const __VLS_83 = __VLS_82({
                key: (item),
                label: (item),
                value: (item),
            }, ...__VLS_functionalComponentArgsRest(__VLS_82));
            // @ts-ignore
            [form_data, form_data, typeOptions,];
        }
        // @ts-ignore
        [];
        var __VLS_76;
        var __VLS_77;
        if (item.type === 'string') {
            let __VLS_86;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                prop: ('variable_list.' + index + '.value'),
                rules: ({
                    message: __VLS_ctx.t('common.inputPlaceholder'),
                    trigger: 'blur',
                    required: true,
                }),
            }));
            const __VLS_88 = __VLS_87({
                prop: ('variable_list.' + index + '.value'),
                rules: ({
                    message: __VLS_ctx.t('common.inputPlaceholder'),
                    trigger: 'blur',
                    required: true,
                }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_87));
            const { default: __VLS_91 } = __VLS_89.slots;
            let __VLS_92;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
                ...{ 'onWheel': {} },
                modelValue: (item.value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
                showWordLimit: true,
                clearable: true,
            }));
            const __VLS_94 = __VLS_93({
                ...{ 'onWheel': {} },
                modelValue: (item.value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
                showWordLimit: true,
                clearable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_93));
            let __VLS_97;
            const __VLS_98 = {
                /** @type {typeof __VLS_97.wheel} */
                onWheel: (__VLS_ctx.wheel),
            };
            var __VLS_95;
            var __VLS_96;
            // @ts-ignore
            [$t, t, wheel,];
            var __VLS_89;
        }
        else if (item.type === 'num') {
            let __VLS_99;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
                prop: ('variable_list.' + index + '.value'),
                rules: ({
                    message: __VLS_ctx.$t('common.inputPlaceholder'),
                    trigger: 'blur',
                    required: true,
                }),
            }));
            const __VLS_101 = __VLS_100({
                prop: ('variable_list.' + index + '.value'),
                rules: ({
                    message: __VLS_ctx.$t('common.inputPlaceholder'),
                    trigger: 'blur',
                    required: true,
                }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_100));
            const { default: __VLS_104 } = __VLS_102.slots;
            let __VLS_105;
            /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number'] | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
            elInputNumber;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
                modelValue: (item.value),
            }));
            const __VLS_107 = __VLS_106({
                modelValue: (item.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_106));
            // @ts-ignore
            [$t,];
            var __VLS_102;
        }
        else if (item.type === 'json') {
            let __VLS_110;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
                ...{ class: "w-full" },
                prop: ('variable_list.' + index + '.value'),
                rules: ([
                    {
                        message: __VLS_ctx.$t('common.inputPlaceholder'),
                        trigger: 'blur',
                        required: true,
                    },
                    {
                        validator: (rule, value, callback) => {
                            try {
                                JSON.parse(value);
                                callback(); // Valid JSON
                            }
                            catch (e) {
                                callback(new Error('Invalid JSON format'));
                            }
                        },
                        trigger: 'blur',
                    },
                ]),
            }));
            const __VLS_112 = __VLS_111({
                ...{ class: "w-full" },
                prop: ('variable_list.' + index + '.value'),
                rules: ([
                    {
                        message: __VLS_ctx.$t('common.inputPlaceholder'),
                        trigger: 'blur',
                        required: true,
                    },
                    {
                        validator: (rule, value, callback) => {
                            try {
                                JSON.parse(value);
                                callback(); // Valid JSON
                            }
                            catch (e) {
                                callback(new Error('Invalid JSON format'));
                            }
                        },
                        trigger: 'blur',
                    },
                ]),
            }, ...__VLS_functionalComponentArgsRest(__VLS_111));
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            const { default: __VLS_115 } = __VLS_113.slots;
            let __VLS_116;
            /** @ts-ignore @type { | typeof __VLS_components.CodemirrorEditor} */
            CodemirrorEditor;
            // @ts-ignore
            const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
                ...{ 'onSubmitDialog': {} },
                title: "JSON",
                modelValue: (item.value),
                ...{ style: ({
                        height: '100px',
                        width: '155px',
                    }) },
            }));
            const __VLS_118 = __VLS_117({
                ...{ 'onSubmitDialog': {} },
                title: "JSON",
                modelValue: (item.value),
                ...{ style: ({
                        height: '100px',
                        width: '155px',
                    }) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_117));
            let __VLS_121;
            const __VLS_122 = {
                /** @type {typeof __VLS_121.submitDialog} */
                onSubmitDialog: ((val) => (__VLS_ctx.form_data.variable_list[index].value = val)),
            };
            var __VLS_119;
            var __VLS_120;
            // @ts-ignore
            [form_data, $t,];
            var __VLS_113;
        }
        else if (item.type === 'bool') {
            let __VLS_123;
            /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
            elFormItem;
            // @ts-ignore
            const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
                prop: ('variable_list.' + index + '.value'),
                rules: ({
                    message: __VLS_ctx.$t('common.inputPlaceholder'),
                    trigger: 'blur',
                    required: true,
                }),
            }));
            const __VLS_125 = __VLS_124({
                prop: ('variable_list.' + index + '.value'),
                rules: ({
                    message: __VLS_ctx.$t('common.inputPlaceholder'),
                    trigger: 'blur',
                    required: true,
                }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_124));
            const { default: __VLS_128 } = __VLS_126.slots;
            let __VLS_129;
            /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
            elSelect;
            // @ts-ignore
            const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
                modelValue: (item.value),
                ...{ style: {} },
                teleported: (false),
            }));
            const __VLS_131 = __VLS_130({
                modelValue: (item.value),
                ...{ style: {} },
                teleported: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_130));
            const { default: __VLS_134 } = __VLS_132.slots;
            let __VLS_135;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
                label: "true",
                value: (true),
            }));
            const __VLS_137 = __VLS_136({
                label: "true",
                value: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_136));
            let __VLS_140;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
                label: "false",
                value: (false),
            }));
            const __VLS_142 = __VLS_141({
                label: "false",
                value: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            // @ts-ignore
            [$t,];
            var __VLS_132;
            // @ts-ignore
            [];
            var __VLS_126;
        }
    }
    else if (item.source === 'referencing') {
        let __VLS_145;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({}));
        const __VLS_147 = __VLS_146({}, ...__VLS_functionalComponentArgsRest(__VLS_146));
        const { default: __VLS_150 } = __VLS_148.slots;
        const __VLS_151 = NodeCascader;
        // @ts-ignore
        const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
            ref: "nodeCascaderRef2",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
            modelValue: (item.reference),
        }));
        const __VLS_153 = __VLS_152({
            ref: "nodeCascaderRef2",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
            modelValue: (item.reference),
        }, ...__VLS_functionalComponentArgsRest(__VLS_152));
        var __VLS_156;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        var __VLS_154;
        // @ts-ignore
        [nodeModel, $t,];
        var __VLS_148;
    }
    // @ts-ignore
    [];
    var __VLS_20;
    // @ts-ignore
    [];
}
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_160 = __VLS_159({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
let __VLS_163;
const __VLS_164 = {
    /** @type {typeof __VLS_163.click} */
    onClick: (__VLS_ctx.addVariable),
};
const { default: __VLS_165 } = __VLS_161.slots;
let __VLS_166;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_168 = __VLS_167({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t, addVariable,];
var __VLS_161;
var __VLS_162;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_51 = __VLS_50, __VLS_157 = __VLS_156;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
