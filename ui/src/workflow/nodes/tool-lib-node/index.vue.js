/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set } from 'lodash';
import { useRoute } from 'vue-router';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { ref, computed, onMounted, inject } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { WorkflowMode } from '@/enums/application';
const workflowMode = inject('workflowMode') || WorkflowMode.Application;
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
const nodeCascaderRef = ref();
const form = {
    input_field_list: [],
    is_result: false,
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
        if (ok.data.name) {
            set(props.nodeModel.properties.node_data, 'name', ok.data.name);
        }
        const old_input_field_list = props.nodeModel.properties.node_data.input_field_list;
        const merge_input_field_list = ok.data.input_field_list.map((item) => {
            const find_field = old_input_field_list.find((old_item) => old_item.name == item.name);
            if (find_field && find_field.source == item.source) {
                return { ...item, value: JSON.parse(JSON.stringify(find_field.value)) };
            }
            return { ...item, value: item.source == 'reference' ? [] : '' };
        });
        set(props.nodeModel.properties.node_data, 'input_field_list', merge_input_field_list);
        set(props.nodeModel.properties, 'status', ok.data.is_active ? 200 : 500);
    })
        .catch(() => {
        set(props.nodeModel.properties, 'status', 500);
    });
};
onMounted(() => {
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
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('workflow.nodeSetting'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "lighter mb-8" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('common.param.inputParam'));
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
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    shadow: "never",
    ...{ class: "card-never mb-16" },
    ...{ style: {} },
}));
const __VLS_19 = __VLS_18({
    shadow: "never",
    ...{ class: "card-never mb-16" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_22 } = __VLS_20.slots;
if (__VLS_ctx.chat_data.input_field_list?.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [item, index] of __VLS_vFor((__VLS_ctx.chat_data.input_field_list))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (item.name),
        });
        let __VLS_23;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            label: (item.name),
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
            label: (item.name),
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
                content: (item.name),
                ...{ style: {} },
            }));
            const __VLS_32 = __VLS_31({
                content: (item.name),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            const { default: __VLS_35 } = __VLS_33.slots;
            (item.name);
            // @ts-ignore
            [nodeModel, $t, $t, $t, $t, chat_data, chat_data, chat_data,];
            var __VLS_33;
            if (item.desc) {
                let __VLS_36;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
                    effect: "dark",
                    placement: "right",
                    popperClass: "max-w-200",
                }));
                const __VLS_38 = __VLS_37({
                    effect: "dark",
                    placement: "right",
                    popperClass: "max-w-200",
                }, ...__VLS_functionalComponentArgsRest(__VLS_37));
                const { default: __VLS_41 } = __VLS_39.slots;
                {
                    const { content: __VLS_42 } = __VLS_39.slots;
                    (item.desc);
                    // @ts-ignore
                    [];
                }
                let __VLS_43;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }));
                const __VLS_45 = __VLS_44({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_44));
                /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
                // @ts-ignore
                [];
                var __VLS_39;
            }
            if (item.is_required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            let __VLS_48;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-4" },
            }));
            const __VLS_50 = __VLS_49({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            const { default: __VLS_53 } = __VLS_51.slots;
            (item.type);
            // @ts-ignore
            [];
            var __VLS_51;
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
        // @ts-ignore
        [nodeModel, $t, $t,];
        var __VLS_26;
        // @ts-ignore
        [];
    }
}
else {
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        type: "info",
    }));
    const __VLS_68 = __VLS_67({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    const { default: __VLS_71 } = __VLS_69.slots;
    (__VLS_ctx.$t('common.noData'));
    // @ts-ignore
    [$t,];
    var __VLS_69;
}
// @ts-ignore
[];
var __VLS_20;
if ([
    __VLS_ctx.WorkflowMode.Application,
    __VLS_ctx.WorkflowMode.ApplicationLoop,
    __VLS_ctx.WorkflowMode.Tool,
    __VLS_ctx.WorkflowMode.ToolLoop,
].includes(__VLS_ctx.workflowMode)) {
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_77;
    const __VLS_78 = {
        /** @type {typeof __VLS_77.click} */
        onClick: () => { },
    };
    const { default: __VLS_79 } = __VLS_75.slots;
    {
        const { label: __VLS_80 } = __VLS_75.slots;
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
        let __VLS_81;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }));
        const __VLS_83 = __VLS_82({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        const { default: __VLS_86 } = __VLS_84.slots;
        {
            const { content: __VLS_87 } = __VLS_84.slots;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.tooltip'));
            // @ts-ignore
            [$t, $t, $t, WorkflowMode, WorkflowMode, WorkflowMode, WorkflowMode, workflowMode,];
        }
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_90 = __VLS_89({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_84;
        // @ts-ignore
        [];
    }
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.is_result),
    }));
    const __VLS_95 = __VLS_94({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.is_result),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    // @ts-ignore
    [chat_data,];
    var __VLS_75;
    var __VLS_76;
}
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
