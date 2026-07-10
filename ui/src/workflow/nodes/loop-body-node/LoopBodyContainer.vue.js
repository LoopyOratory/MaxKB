/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, provide, inject } from 'vue';
import { set } from 'lodash';
import { iconComponent } from '../../icons/utils';
import { copyClick } from '@/utils/clipboard';
import { ElMessage } from 'element-plus';
import { t } from '@/locales';
provide('workflowMode', inject('loopWorkflowMode'));
const props = defineProps();
const titleFormRef = ref();
const nodeNameDialogVisible = ref(false);
const form = ref({
    title: '',
});
const showNode = computed({
    set: (v) => {
        set(props.nodeModel.properties, 'showNode', v);
    },
    get: () => {
        if (props.nodeModel.properties.showNode !== undefined) {
            return props.nodeModel.properties.showNode;
        }
        set(props.nodeModel.properties, 'showNode', true);
        return true;
    },
});
const node_status = computed(() => {
    if (props.nodeModel.properties.status) {
        return props.nodeModel.properties.status;
    }
    return 200;
});
const editName = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            if (!props.nodeModel.graphModel.nodes?.some((node) => node.properties.stepName === form.value.title)) {
                set(props.nodeModel.properties, 'stepName', form.value.title);
                nodeNameDialogVisible.value = false;
                formEl.resetFields();
            }
            else {
                ElMessage.error(t('workflow.tip.repeatedNodeError'));
            }
        }
    });
};
const mousedown = () => {
    props.nodeModel.graphModel.clearSelectElements();
    set(props.nodeModel, 'isSelected', true);
    set(props.nodeModel, 'isHovered', true);
    props.nodeModel.graphModel.toFront(props.nodeModel.id);
};
const showicon = ref(null);
const height = ref(600);
const nodeFields = computed(() => {
    if (props.nodeModel.properties.config.fields) {
        const fields = props.nodeModel.properties.config.fields?.map((field) => {
            return {
                label: field.label,
                value: field.value,
                globeLabel: `{{${props.nodeModel.properties.stepName}.${field.value}}}`,
                globeValue: `{{context['${props.nodeModel.id}'].${field.value}}}`,
            };
        });
        return fields;
    }
    return [];
});
const enlarge = ref(false);
function enlargeHandle() {
    enlarge.value = !enlarge.value;
    if (enlarge.value) {
        props.nodeModel.graphModel.transformModel.focusOn(props.nodeModel.x, props.nodeModel.y, props.nodeModel.width + window.innerWidth - props.nodeModel.width, props.nodeModel.height - 30);
        height.value =
            (props.nodeModel.graphModel.height - 100) / props.nodeModel.graphModel.transformModel.SCALE_Y;
        const width = window.innerWidth / props.nodeModel.graphModel.transformModel.SCALE_X;
        props.nodeModel.width = width;
        props.nodeModel.setHeight(height.value);
    }
    else {
        height.value = 600;
        const width = 1920;
        props.nodeModel.width = width;
        props.nodeModel.setHeight(height.value);
    }
}
const zoom = () => {
    if (enlarge.value) {
        enlargeHandle();
    }
};
const __VLS_exposed = { close, zoom };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMousedown: (__VLS_ctx.mousedown) },
    ...{ class: "workflow-node-container p-16" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['workflow-node-container']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "step-container white-bg border-r-8 p-16" },
    ...{ class: ({ isSelected: props.nodeModel.isSelected, error: __VLS_ctx.node_status !== 200 }) },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['step-container']} */ ;
/** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['isSelected']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
const __VLS_0 = (__VLS_ctx.iconComponent(`${__VLS_ctx.nodeModel.type}-icon`));
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "mr-8" },
    size: (24),
    item: (__VLS_ctx.nodeModel?.properties.node_data),
}));
const __VLS_2 = __VLS_1({
    ...{ class: "mr-8" },
    size: (24),
    item: (__VLS_ctx.nodeModel?.properties.node_data),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "ellipsis-1 break-all" },
});
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
(__VLS_ctx.nodeModel.properties.stepName);
let __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
    link: true,
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_10;
const __VLS_11 = {
    /** @type {typeof __VLS_10.click} */
    onClick: (__VLS_ctx.enlargeHandle),
};
const { default: __VLS_12 } = __VLS_8.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    iconName: (__VLS_ctx.enlarge ? 'app-minify' : 'app-magnify'),
    ...{ class: "color-secondary" },
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    iconName: (__VLS_ctx.enlarge ? 'app-minify' : 'app-magnify'),
    ...{ class: "color-secondary" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
// @ts-ignore
[mousedown, node_status, iconComponent, nodeModel, nodeModel, nodeModel, enlargeHandle, enlarge,];
var __VLS_8;
var __VLS_9;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMousedown: () => { } },
    ...{ onKeydown: () => { } },
    ...{ onClick: () => { } },
    ...{ class: "mt-16" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showNode) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
if (__VLS_ctx.node_status != 200) {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
    elAlert;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        ...{ class: "mb-16" },
        title: (props.nodeModel.type === 'application-node'
            ? __VLS_ctx.$t('workflow.tip.applicationNodeError')
            : __VLS_ctx.$t('workflow.tip.functionNodeError')),
        type: "error",
        showIcon: true,
        closable: (false),
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "mb-16" },
        title: (props.nodeModel.type === 'application-node'
            ? __VLS_ctx.$t('workflow.tip.applicationNodeError')
            : __VLS_ctx.$t('workflow.tip.functionNodeError')),
        type: "error",
        showIcon: true,
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: (`height:${__VLS_ctx.height}px`) },
});
var __VLS_29 = {};
if (__VLS_ctx.nodeFields.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "title-decoration-1 mb-8 mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    (__VLS_ctx.$t('common.param.outputParam'));
    for (const [item, index] of __VLS_vFor((__VLS_ctx.nodeFields))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.nodeFields.length > 0))
                        throw 0;
                    return __VLS_ctx.showicon = index;
                    // @ts-ignore
                    [node_status, showNode, $t, $t, $t, height, nodeFields, nodeFields, showicon,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.nodeFields.length > 0))
                        throw 0;
                    return __VLS_ctx.showicon = null;
                    // @ts-ignore
                    [showicon,];
                } },
            ...{ class: "flex-between border-r-4 p-8-12 mb-8 layout-bg lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "break-all" },
        });
        /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
        (item.label);
        ('{' + item.value + '}');
        if (__VLS_ctx.showicon === index) {
            let __VLS_31;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }));
            const __VLS_33 = __VLS_32({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_32));
            const { default: __VLS_36 } = __VLS_34.slots;
            let __VLS_37;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }));
            const __VLS_39 = __VLS_38({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_38));
            let __VLS_42;
            const __VLS_43 = {
                /** @type {typeof __VLS_42.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.nodeFields.length > 0))
                        throw 0;
                    if (!(__VLS_ctx.showicon === index))
                        throw 0;
                    return __VLS_ctx.copyClick(item.globeLabel);
                    // @ts-ignore
                    [$t, showicon, copyClick,];
                },
            };
            const { default: __VLS_44 } = __VLS_40.slots;
            let __VLS_45;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
                iconName: "app-copy",
            }));
            const __VLS_47 = __VLS_46({
                iconName: "app-copy",
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
            // @ts-ignore
            [];
            var __VLS_40;
            var __VLS_41;
            // @ts-ignore
            [];
            var __VLS_34;
        }
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
var __VLS_21;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    ...{ 'onSubmit': {} },
    title: (__VLS_ctx.$t('workflow.nodeName')),
    modelValue: (__VLS_ctx.nodeNameDialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    appendToBody: true,
}));
const __VLS_52 = __VLS_51({
    ...{ 'onSubmit': {} },
    title: (__VLS_ctx.$t('workflow.nodeName')),
    modelValue: (__VLS_ctx.nodeNameDialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_55;
const __VLS_56 = {
    /** @type {typeof __VLS_55.submit} */
    onSubmit: () => { },
};
const { default: __VLS_57 } = __VLS_53.slots;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    labelPosition: "top",
    ref: "titleFormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_60 = __VLS_59({
    labelPosition: "top",
    ref: "titleFormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
var __VLS_63;
const { default: __VLS_65 } = __VLS_61.slots;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    prop: "title",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'blur',
        },
    ]),
}));
const __VLS_68 = __VLS_67({
    prop: "title",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'blur',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
const { default: __VLS_71 } = __VLS_69.slots;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.title),
}));
const __VLS_74 = __VLS_73({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_77;
const __VLS_78 = {
    /** @type {typeof __VLS_77.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.title = __VLS_ctx.form.title.trim();
        // @ts-ignore
        [$t, $t, nodeNameDialogVisible, form, form, form, form,];
    },
};
var __VLS_75;
var __VLS_76;
// @ts-ignore
[];
var __VLS_69;
// @ts-ignore
[];
var __VLS_61;
{
    const { footer: __VLS_79 } = __VLS_53.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_85;
    const __VLS_86 = {
        /** @type {typeof __VLS_85.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.nodeNameDialogVisible = false;
            // @ts-ignore
            [nodeNameDialogVisible,];
        },
    };
    const { default: __VLS_87 } = __VLS_83.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_83;
    var __VLS_84;
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_93;
    const __VLS_94 = {
        /** @type {typeof __VLS_93.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.editName(__VLS_ctx.titleFormRef);
            // @ts-ignore
            [editName, titleFormRef,];
        },
    };
    const { default: __VLS_95 } = __VLS_91.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_91;
    var __VLS_92;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_53;
var __VLS_54;
// @ts-ignore
var __VLS_30 = __VLS_29, __VLS_64 = __VLS_63;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
