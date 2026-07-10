/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set } from 'lodash';
import { useRoute } from 'vue-router';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import JsonInput from '@/components/dynamics-form/items/JsonInput.vue';
import { ref, computed, onMounted } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const props = defineProps();
const route = useRoute();
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
const onSourceChange = (item) => {
    if (item.type === 'boolean') {
        item.value = false;
    }
    else if (['array', 'dict'].includes(item.type)) {
        item.value = [];
    }
    else {
        item.value = '';
    }
};
const form = {
    input_field_list: [],
    is_result: false,
    source: 'custom',
};
const chat_data = computed({
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
const ToolNodeFormRef = ref();
const validate = () => {
    return ToolNodeFormRef.value?.validate().catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
const update_field = () => {
    if (!props.nodeModel.properties.node_data.tool_lib_id) {
        set(props.nodeModel.properties, 'status', 500);
        return;
    }
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .getToolById(props.nodeModel.properties.node_data.tool_lib_id)
        .then((ok) => {
        const workflowNodes = ok.data?.work_flow?.nodes || [];
        const baseNode = workflowNodes.find((n) => n.type === 'tool-base-node');
        if (baseNode) {
            const new_input_list = baseNode.properties.user_input_field_list || [];
            const new_output_list = baseNode.properties.user_output_field_list || [];
            const old_config_fields = props.nodeModel.properties.config?.fields || [];
            const config_field_list = new_output_list.map((item) => {
                const old = old_config_fields.find((o) => o.value === item.field);
                return old ? JSON.parse(JSON.stringify(old)) : { label: item.label, value: item.field };
            });
            const input_title = baseNode.properties.user_input_config?.title;
            const output_title = baseNode.properties.user_output_config?.title;
            const old_input_list = props.nodeModel.properties.node_data.input_field_list || [];
            const merged_input_list = new_input_list.map((item) => {
                const find_field = old_input_list.find((old_item) => old_item.field === item.field);
                if (find_field) {
                    return {
                        ...item,
                        source: find_field.source,
                        value: JSON.parse(JSON.stringify(find_field.value)),
                    };
                }
                return { ...item, source: 'custom', value: '' };
            });
            set(props.nodeModel.properties.node_data, 'input_field_list', merged_input_list);
            set(props.nodeModel.properties, 'config', {
                fields: config_field_list,
                output_title: output_title,
            });
            set(props.nodeModel.properties.node_data, 'input_title', input_title);
        }
        set(props.nodeModel.properties, 'status', ok.data.is_active ? 200 : 500);
        props.nodeModel.clear_next_node_field(true);
    })
        .catch(() => {
        set(props.nodeModel.properties, 'status', 500);
    });
};
onMounted(() => {
    if (props.nodeModel.properties.config?.fields?.length) {
        set(props.nodeModel.properties.config, 'fields', props.nodeModel.properties.config.fields);
    }
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
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
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "ToolNodeFormRef",
    model: (__VLS_ctx.chat_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    hideRequiredAsterisk: true,
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "ToolNodeFormRef",
    model: (__VLS_ctx.chat_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.chat_data.input_title);
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}));
const __VLS_19 = __VLS_18({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
const { default: __VLS_22 } = __VLS_20.slots;
if (__VLS_ctx.chat_data.input_field_list?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [item, index] of __VLS_vFor((__VLS_ctx.chat_data.input_field_list))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (item.field),
        });
        let __VLS_23;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            label: (item.label),
            prop: ('input_field_list.' + index + '.value'),
            rules: ({
                required: item.is_required,
                message: item.source === 'reference'
                    ? __VLS_ctx.$t('views.tool.form.param.selectPlaceholder')
                    : __VLS_ctx.$t('views.tool.form.param.inputPlaceholder'),
                trigger: 'blur',
            }),
        }));
        const __VLS_25 = __VLS_24({
            label: (item.label),
            prop: ('input_field_list.' + index + '.value'),
            rules: ({
                required: item.is_required,
                message: item.source === 'reference'
                    ? __VLS_ctx.$t('views.tool.form.param.selectPlaceholder')
                    : __VLS_ctx.$t('views.tool.form.param.inputPlaceholder'),
                trigger: 'blur',
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        const { default: __VLS_28 } = __VLS_26.slots;
        {
            const { label: __VLS_29 } = __VLS_26.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_30;
            /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
            autoTooltip;
            // @ts-ignore
            const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
                content: (item.label),
                ...{ style: {} },
            }));
            const __VLS_32 = __VLS_31({
                content: (item.label),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            const { default: __VLS_35 } = __VLS_33.slots;
            (item.label);
            // @ts-ignore
            [nodeModel, chat_data, chat_data, chat_data, chat_data, $t, $t,];
            var __VLS_33;
            if (item.is_required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            let __VLS_36;
            /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
            elSelect;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
                ...{ 'onChange': {} },
                teleported: (false),
                modelValue: (item.source),
                size: "small",
                ...{ style: {} },
            }));
            const __VLS_38 = __VLS_37({
                ...{ 'onChange': {} },
                teleported: (false),
                modelValue: (item.source),
                size: "small",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            let __VLS_41;
            const __VLS_42 = {
                /** @type {typeof __VLS_41.change} */
                onChange: (...[$event]) => {
                    if (!(__VLS_ctx.chat_data.input_field_list?.length))
                        throw 0;
                    return __VLS_ctx.onSourceChange(item);
                    // @ts-ignore
                    [onSourceChange,];
                },
            };
            const { default: __VLS_43 } = __VLS_39.slots;
            let __VLS_44;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
                label: (__VLS_ctx.$t('workflow.variable.Referencing')),
                value: "reference",
            }));
            const __VLS_46 = __VLS_45({
                label: (__VLS_ctx.$t('workflow.variable.Referencing')),
                value: "reference",
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            let __VLS_49;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
                label: (__VLS_ctx.$t('common.custom')),
                value: "custom",
            }));
            const __VLS_51 = __VLS_50({
                label: (__VLS_ctx.$t('common.custom')),
                value: "custom",
            }, ...__VLS_functionalComponentArgsRest(__VLS_50));
            // @ts-ignore
            [$t, $t,];
            var __VLS_39;
            var __VLS_40;
            // @ts-ignore
            [];
        }
        if (item.source === 'reference') {
            const __VLS_54 = NodeCascader;
            // @ts-ignore
            const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
                ref: "nodeCascaderRef",
                nodeModel: (__VLS_ctx.nodeModel),
                ...{ class: "w-full" },
                placeholder: (__VLS_ctx.$t('views.tool.form.param.selectPlaceholder')),
                modelValue: (item.value),
            }));
            const __VLS_56 = __VLS_55({
                ref: "nodeCascaderRef",
                nodeModel: (__VLS_ctx.nodeModel),
                ...{ class: "w-full" },
                placeholder: (__VLS_ctx.$t('views.tool.form.param.selectPlaceholder')),
                modelValue: (item.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_55));
            var __VLS_59;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            var __VLS_57;
        }
        else {
            if (['string'].includes(item.type)) {
                let __VLS_61;
                /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
                elInput;
                // @ts-ignore
                const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
                    modelValue: (item.value),
                    placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
                }));
                const __VLS_63 = __VLS_62({
                    modelValue: (item.value),
                    placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
                }, ...__VLS_functionalComponentArgsRest(__VLS_62));
            }
            if (['array', 'dict'].includes(item.type)) {
                const __VLS_66 = JsonInput;
                // @ts-ignore
                const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
                    modelValue: (item.value),
                }));
                const __VLS_68 = __VLS_67({
                    modelValue: (item.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_67));
            }
            if (['int', 'float'].includes(item.type)) {
                let __VLS_71;
                /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
                elInputNumber;
                // @ts-ignore
                const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
                    modelValue: (item.value),
                }));
                const __VLS_73 = __VLS_72({
                    modelValue: (item.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_72));
            }
            if (['boolean'].includes(item.type)) {
                let __VLS_76;
                /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
                elSwitch;
                // @ts-ignore
                const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
                    modelValue: (item.value),
                    activeValue: (true),
                    inactiveValue: (false),
                }));
                const __VLS_78 = __VLS_77({
                    modelValue: (item.value),
                    activeValue: (true),
                    inactiveValue: (false),
                }, ...__VLS_functionalComponentArgsRest(__VLS_77));
            }
        }
        // @ts-ignore
        [nodeModel, $t, $t,];
        var __VLS_26;
        // @ts-ignore
        [];
    }
}
else {
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
        type: "info",
    }));
    const __VLS_83 = __VLS_82({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    const { default: __VLS_86 } = __VLS_84.slots;
    (__VLS_ctx.$t('common.noData'));
    // @ts-ignore
    [$t,];
    var __VLS_84;
}
// @ts-ignore
[];
var __VLS_20;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_60 = __VLS_59;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
