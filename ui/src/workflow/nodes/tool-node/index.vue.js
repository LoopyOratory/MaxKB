/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { ref, computed, onMounted, inject } from 'vue';
import FieldFormDialog from '@/views/tool/component/FieldFormDialog.vue';
import { isLastNode } from '@/workflow/common/data';
import { WorkflowMode } from '@/enums/application';
const workflowMode = inject('workflowMode') || WorkflowMode.Application;
const props = defineProps();
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
const FieldFormDialogRef = ref();
const nodeCascaderRef = ref();
const form = {
    code: '',
    input_field_list: [],
    is_result: false,
};
const currentIndex = ref(null);
const showEditor = ref(false);
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
function submitCodemirrorEditor(val) {
    set(props.nodeModel.properties.node_data, 'code', val);
}
function openAddDialog(data, index) {
    if (typeof index !== 'undefined') {
        currentIndex.value = index;
    }
    FieldFormDialogRef.value.open(data);
}
function deleteField(index) {
    const list = cloneDeep(props.nodeModel.properties.node_data.input_field_list);
    list.splice(index, 1);
    set(props.nodeModel.properties.node_data, 'input_field_list', list);
}
function refreshFieldList(data) {
    const list = cloneDeep(props.nodeModel.properties.node_data.input_field_list);
    const obj = {
        ...data,
        value: data.source === 'reference' ? [] : '',
    };
    if (currentIndex.value !== null) {
        list.splice(currentIndex.value, 1, obj);
    }
    else {
        list.push(obj);
    }
    set(props.nodeModel.properties.node_data, 'input_field_list', list);
    currentIndex.value = null;
}
onMounted(() => {
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
    set(props.nodeModel, 'validate', validate);
    setTimeout(() => {
        showEditor.value = true;
    }, 100);
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "lighter mb-8" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('common.param.inputParam'));
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddDialog();
        // @ts-ignore
        [nodeModel, $t, $t, openAddDialog,];
    },
};
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_17 = __VLS_16({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t,];
var __VLS_10;
var __VLS_11;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    ...{ 'onSubmit': {} },
    ref: "ToolNodeFormRef",
    model: (__VLS_ctx.chat_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    hideRequiredAsterisk: true,
}));
const __VLS_22 = __VLS_21({
    ...{ 'onSubmit': {} },
    ref: "ToolNodeFormRef",
    model: (__VLS_ctx.chat_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_25;
const __VLS_26 = {
    /** @type {typeof __VLS_25.submit} */
    onSubmit: () => { },
};
var __VLS_27;
const { default: __VLS_29 } = __VLS_23.slots;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    shadow: "never",
    ...{ class: "card-never mb-16" },
    ...{ style: {} },
}));
const __VLS_32 = __VLS_31({
    shadow: "never",
    ...{ class: "card-never mb-16" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_35 } = __VLS_33.slots;
if (__VLS_ctx.chat_data.input_field_list?.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [item, index] of __VLS_vFor((__VLS_ctx.chat_data.input_field_list))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
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
        const __VLS_38 = __VLS_37({
            label: (item.name),
            prop: ('input_field_list.' + index + '.value'),
            rules: ({
                required: item.is_required,
                message: item.source === 'reference'
                    ? __VLS_ctx.$t('views.tool.form.param.selectPlaceholder')
                    : __VLS_ctx.$t('views.tool.form.param.inputPlaceholder'),
                trigger: 'blur',
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        const { default: __VLS_41 } = __VLS_39.slots;
        {
            const { label: __VLS_42 } = __VLS_39.slots;
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
            let __VLS_43;
            /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
            autoTooltip;
            // @ts-ignore
            const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
                content: (item.name),
                ...{ style: {} },
            }));
            const __VLS_45 = __VLS_44({
                content: (item.name),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_44));
            const { default: __VLS_48 } = __VLS_46.slots;
            (item.name);
            // @ts-ignore
            [$t, $t, chat_data, chat_data, chat_data,];
            var __VLS_46;
            if (item.desc) {
                let __VLS_49;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
                    effect: "dark",
                    placement: "right",
                    popperClass: "max-w-200",
                }));
                const __VLS_51 = __VLS_50({
                    effect: "dark",
                    placement: "right",
                    popperClass: "max-w-200",
                }, ...__VLS_functionalComponentArgsRest(__VLS_50));
                const { default: __VLS_54 } = __VLS_52.slots;
                {
                    const { content: __VLS_55 } = __VLS_52.slots;
                    (item.desc);
                    // @ts-ignore
                    [];
                }
                let __VLS_56;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }));
                const __VLS_58 = __VLS_57({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
                // @ts-ignore
                [];
                var __VLS_52;
            }
            if (item.is_required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            let __VLS_61;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-4" },
            }));
            const __VLS_63 = __VLS_62({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            const { default: __VLS_66 } = __VLS_64.slots;
            (item.type);
            // @ts-ignore
            [];
            var __VLS_64;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            let __VLS_67;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_69 = __VLS_68({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_68));
            let __VLS_72;
            const __VLS_73 = {
                /** @type {typeof __VLS_72.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.chat_data.input_field_list?.length > 0))
                        throw 0;
                    return __VLS_ctx.openAddDialog(item, index);
                    // @ts-ignore
                    [openAddDialog,];
                },
            };
            const { default: __VLS_74 } = __VLS_70.slots;
            let __VLS_75;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
                iconName: "app-edit",
            }));
            const __VLS_77 = __VLS_76({
                iconName: "app-edit",
            }, ...__VLS_functionalComponentArgsRest(__VLS_76));
            // @ts-ignore
            [];
            var __VLS_70;
            var __VLS_71;
            let __VLS_80;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                ...{ 'onClick': {} },
                text: true,
                ...{ style: {} },
            }));
            const __VLS_82 = __VLS_81({
                ...{ 'onClick': {} },
                text: true,
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            let __VLS_85;
            const __VLS_86 = {
                /** @type {typeof __VLS_85.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.chat_data.input_field_list?.length > 0))
                        throw 0;
                    return __VLS_ctx.deleteField(index);
                    // @ts-ignore
                    [deleteField,];
                },
            };
            const { default: __VLS_87 } = __VLS_83.slots;
            let __VLS_88;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
                iconName: "app-delete",
            }));
            const __VLS_90 = __VLS_89({
                iconName: "app-delete",
            }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            // @ts-ignore
            [];
            var __VLS_83;
            var __VLS_84;
            // @ts-ignore
            [];
        }
        if (item.source === 'reference') {
            const __VLS_93 = NodeCascader;
            // @ts-ignore
            const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
                ref: "nodeCascaderRef",
                nodeModel: (__VLS_ctx.nodeModel),
                ...{ class: "w-full" },
                placeholder: (__VLS_ctx.$t('views.tool.form.param.selectPlaceholder')),
                modelValue: (item.value),
                width: (100),
            }));
            const __VLS_95 = __VLS_94({
                ref: "nodeCascaderRef",
                nodeModel: (__VLS_ctx.nodeModel),
                ...{ class: "w-full" },
                placeholder: (__VLS_ctx.$t('views.tool.form.param.selectPlaceholder')),
                modelValue: (item.value),
                width: (100),
            }, ...__VLS_functionalComponentArgsRest(__VLS_94));
            var __VLS_98;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            var __VLS_96;
        }
        else {
            let __VLS_100;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
                modelValue: (item.value),
                placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
            }));
            const __VLS_102 = __VLS_101({
                modelValue: (item.value),
                placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        }
        // @ts-ignore
        [nodeModel, $t, $t,];
        var __VLS_39;
        // @ts-ignore
        [];
    }
}
else {
    let __VLS_105;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
        type: "info",
    }));
    const __VLS_107 = __VLS_106({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    const { default: __VLS_110 } = __VLS_108.slots;
    (__VLS_ctx.$t('common.noData'));
    // @ts-ignore
    [$t,];
    var __VLS_108;
}
// @ts-ignore
[];
var __VLS_33;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "lighter mb-8" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.tool.form.param.code'));
if (__VLS_ctx.showEditor) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.CodemirrorEditor} */
    CodemirrorEditor;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        ...{ 'onWheel': {} },
        ...{ 'onSubmitDialog': {} },
        title: (__VLS_ctx.$t('views.tool.form.param.code')),
        modelValue: (__VLS_ctx.chat_data.code),
        ...{ style: {} },
    }));
    const __VLS_113 = __VLS_112({
        ...{ 'onWheel': {} },
        ...{ 'onSubmitDialog': {} },
        title: (__VLS_ctx.$t('views.tool.form.param.code')),
        modelValue: (__VLS_ctx.chat_data.code),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    let __VLS_116;
    const __VLS_117 = {
        /** @type {typeof __VLS_116.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const __VLS_118 = {
        /** @type {typeof __VLS_116.submitDialog} */
        onSubmitDialog: (__VLS_ctx.submitCodemirrorEditor),
    };
    var __VLS_114;
    var __VLS_115;
}
if ([
    __VLS_ctx.WorkflowMode.Application,
    __VLS_ctx.WorkflowMode.ApplicationLoop,
    __VLS_ctx.WorkflowMode.Tool,
    __VLS_ctx.WorkflowMode.ToolLoop,
].includes(__VLS_ctx.workflowMode)) {
    let __VLS_119;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }));
    const __VLS_121 = __VLS_120({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    let __VLS_124;
    const __VLS_125 = {
        /** @type {typeof __VLS_124.click} */
        onClick: () => { },
    };
    const { default: __VLS_126 } = __VLS_122.slots;
    {
        const { label: __VLS_127 } = __VLS_122.slots;
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
        let __VLS_128;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }));
        const __VLS_130 = __VLS_129({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        const { default: __VLS_133 } = __VLS_131.slots;
        {
            const { content: __VLS_134 } = __VLS_131.slots;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.tooltip'));
            // @ts-ignore
            [$t, $t, $t, $t, $t, chat_data, showEditor, wheel, submitCodemirrorEditor, WorkflowMode, WorkflowMode, WorkflowMode, WorkflowMode, workflowMode,];
        }
        let __VLS_135;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_137 = __VLS_136({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_136));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_131;
        // @ts-ignore
        [];
    }
    let __VLS_140;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.is_result),
    }));
    const __VLS_142 = __VLS_141({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.is_result),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    // @ts-ignore
    [chat_data,];
    var __VLS_122;
    var __VLS_123;
}
// @ts-ignore
[];
var __VLS_23;
var __VLS_24;
const __VLS_145 = FieldFormDialog;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    ...{ 'onRefresh': {} },
    ref: "FieldFormDialogRef",
}));
const __VLS_147 = __VLS_146({
    ...{ 'onRefresh': {} },
    ref: "FieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
let __VLS_150;
const __VLS_151 = {
    /** @type {typeof __VLS_150.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_152;
var __VLS_148;
var __VLS_149;
// @ts-ignore
[refreshFieldList,];
var __VLS_3;
// @ts-ignore
var __VLS_28 = __VLS_27, __VLS_99 = __VLS_98, __VLS_153 = __VLS_152;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
