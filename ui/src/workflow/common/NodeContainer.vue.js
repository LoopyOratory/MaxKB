/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted, watch } from 'vue';
import { set } from 'lodash';
import { iconComponent } from '../icons/utils';
import { copyClick } from '@/utils/clipboard';
import { WorkflowType, WorkflowKind } from '@/enums/application';
import { MsgError, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import { useRoute } from 'vue-router';
import DropdownMenu from '@/components/workflow-dropdown-menu/index.vue';
const route = useRoute();
const { params: { id }, } = route;
const height = ref({
    stepContainerHeight: 0,
    inputContainerHeight: 0,
    outputContainerHeight: 0,
});
const showAnchor = ref(false);
const anchorData = ref();
const dropdownMenuStyle = computed(() => {
    return {
        top: anchorData.value
            ? anchorData.value.y - props.nodeModel.y + props.nodeModel.height / 2 + 'px'
            : '0px',
    };
});
const nodeDisabled = computed({
    get: () => {
        return props.nodeModel.properties.disabled || false;
    },
    set: (v) => {
        set(props.nodeModel.properties, 'disabled', v);
    },
});
const nodeEnabled = computed({
    get: () => !nodeDisabled.value,
    set: (v) => {
        nodeDisabled.value = !v;
    },
});
const titleFormRef = ref();
const nodeNameDialogVisible = ref(false);
const form = ref({
    title: '',
});
const condition = computed({
    set: (v) => {
        set(props.nodeModel.properties, 'condition', v);
    },
    get: () => {
        if (props.nodeModel.properties.condition) {
            return props.nodeModel.properties.condition;
        }
        set(props.nodeModel.properties, 'condition', 'AND');
        return true;
    },
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
const handleWheel = (event) => {
    const isCombinationKeyPressed = event.ctrlKey || event.metaKey;
    if (!isCombinationKeyPressed) {
        event.stopPropagation();
    }
};
const node_status = computed(() => {
    if (props.nodeModel.properties.status) {
        return props.nodeModel.properties.status;
    }
    return 200;
});
const sourceName = computed(() => {
    if (['application-node', 'tool-lib-node'].includes(props.nodeModel.type)) {
        return props.nodeModel.properties.node_data?.name || '';
    }
    return '';
});
function renameNode() {
    form.value.title = props.nodeModel.properties.stepName;
    nodeNameDialogVisible.value = true;
}
const editName = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            if (!props.nodeModel.graphModel.nodes
                .filter((node) => node.id !== props.nodeModel.id)
                ?.some((node) => node.properties.stepName === form.value.title)) {
                set(props.nodeModel.properties, 'stepName', form.value.title);
                props.nodeModel.clear_next_node_field(true);
                nodeNameDialogVisible.value = false;
                formEl.resetFields();
            }
            else {
                MsgError(t('workflow.tip.repeatedNodeError'));
            }
        }
    });
};
const mousedown = (event) => {
    if (!event?.shiftKey) {
        props.nodeModel.graphModel.clearSelectElements();
    }
    set(props.nodeModel, 'isSelected', !props.nodeModel.isSelected);
    set(props.nodeModel, 'isHovered', !props.nodeModel.isSelected);
    props.nodeModel.graphModel.toFront(props.nodeModel.id);
};
const showicon = ref(null);
const copyNode = () => {
    props.nodeModel.graphModel.clearSelectElements();
    const cloneNode = props.nodeModel.graphModel.cloneNode(props.nodeModel.id);
    set(cloneNode, 'isSelected', true);
    set(cloneNode, 'isHovered', true);
    props.nodeModel.graphModel.toFront(cloneNode.id);
};
const deleteNode = () => {
    MsgConfirm(t('common.tip'), t('workflow.delete.confirmTitle'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    }).then(() => {
        if (props.nodeModel.type === WorkflowType.LoopNode) {
            const next = props.nodeModel.graphModel.getNodeOutgoingNode(props.nodeModel.id);
            next.forEach((n) => {
                if (n.type === 'loop-body-node') {
                    props.nodeModel.graphModel.deleteNode(n.id);
                }
            });
        }
        props.nodeModel.graphModel.deleteNode(props.nodeModel.id);
    });
    props.nodeModel.graphModel.eventCenter.emit('delete_node');
};
const resizeStepContainer = (wh) => {
    if (wh.height) {
        if (!props.nodeModel.virtual) {
            height.value.stepContainerHeight = wh.height;
            props.nodeModel.setHeight(height.value.stepContainerHeight);
        }
    }
};
function clickNodes(item) {
    const width = item.properties.width ? item.properties.width : 214;
    const nodeModel = props.nodeModel.graphModel.addNode({
        type: item.type,
        properties: item.properties,
        x: anchorData.value?.x + width / 2 + 200,
        y: anchorData.value?.y - item.height,
    });
    props.nodeModel.graphModel.addEdge({
        type: 'app-edge',
        sourceNodeId: props.nodeModel.id,
        sourceAnchorId: anchorData.value?.id,
        targetNodeId: nodeModel.id,
        targetAnchorId: nodeModel.id + '_left',
    });
    closeNodeMenu();
}
const enable_exception = computed({
    set: (v) => {
        set(props.nodeModel.properties, 'enableException', v);
    },
    get: () => {
        if (props.nodeModel.properties.enableException !== undefined) {
            return props.nodeModel.properties.enableException;
        }
        set(props.nodeModel.properties, 'enableException', false);
        return false;
    },
});
const props = withDefaults(defineProps(), {
    exceptionNodeList: () => [
        'ai-chat-node',
        'video-understand-node',
        'image-generate-node',
        'image-understand-node',
    ],
});
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
const output_title = computed(() => {
    return props.nodeModel.properties.config.output_title ?? t('common.param.outputParam');
});
const abnormalNodeFields = computed(() => {
    return [
        {
            label: t('workflow.abnormalInformation'),
            value: 'exception_message',
            globeLabel: `{{${props.nodeModel.properties.stepName}.exception_message}}`,
            globeValue: `{{context['${props.nodeModel.id}'].exception_message}}`,
        },
    ];
});
watch(enable_exception, () => {
    props.nodeModel.graphModel.eventCenter.emit('delete_edge', props.nodeModel.outgoing.edges
        .filter((item) => [`${props.nodeModel.id}_exception_right`].includes(item.sourceAnchorId))
        .map((item) => item.id));
});
function showOperate(type) {
    return ![
        WorkflowType.Start,
        WorkflowType.Base,
        WorkflowType.KnowledgeBase,
        WorkflowType.LoopStartNode.toString(),
        WorkflowType.ToolBaseNode,
        WorkflowType.ToolStartNode,
    ].includes(type);
}
function showConditionOperate(type) {
    return (![
        WorkflowType.Start,
        WorkflowType.Base,
        WorkflowType.ToolBaseNode,
        WorkflowType.ToolStartNode,
        WorkflowType.KnowledgeBase,
        WorkflowType.LoopStartNode.toString(),
        WorkflowType.DataSourceLocalNode,
        WorkflowType.DataSourceWebNode,
    ].includes(type) && props.nodeModel.properties.kind != WorkflowKind.DataSource);
}
const openNodeMenu = (anchorValue) => {
    showAnchor.value = true;
    anchorData.value = anchorValue;
};
const closeNodeMenu = () => {
    showAnchor.value = false;
    anchorData.value = undefined;
};
/**
 * Triggered when search selection is made
 * @param kw
 */
const keyWord = ref('');
const currentKeyWord = ref(false);
const selectOn = (kw) => {
    keyWord.value = kw;
    props.nodeModel.isSelected = false;
    currentKeyWord.value = false;
};
/**
 * Triggered when positioning
 * @param kw
 */
const focusOn = (kw) => {
    props.nodeModel.setSelected(true);
    currentKeyWord.value = true;
};
/**
 * Triggered when clearing
 */
const clearSelectOn = () => {
    keyWord.value = '';
    currentKeyWord.value = false;
};
// Highlight selected keywords
const highlightedStepName = (contentText) => {
    let res = contentText;
    if (keyWord.value === '') {
        return res;
    }
    else {
        const wordsArray = contentText.split('');
        for (let i = 0; i < wordsArray.length; i++) {
            if (keyWord.value.includes(wordsArray[i])) {
                wordsArray[i] = currentKeyWord.value
                    ? `<span style='background: #FF8800;'>${wordsArray[i]}</span>`
                    : `<span style='background: #FFC60A;'>${wordsArray[i]}</span>`;
            }
        }
        res = wordsArray.join('');
        return res;
    }
};
onMounted(() => {
    set(props.nodeModel, 'openNodeMenu', (anchorData) => {
        showAnchor.value ? closeNodeMenu() : openNodeMenu(anchorData);
    });
    set(props.nodeModel, 'selectOn', selectOn);
    set(props.nodeModel, 'focusOn', focusOn);
    set(props.nodeModel, 'clearSelectOn', clearSelectOn);
});
const __VLS_defaults = {
    exceptionNodeList: () => [
        'ai-chat-node',
        'video-understand-node',
        'image-generate-node',
        'image-understand-node',
    ],
};
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
__VLS_asFunctionalDirective(__VLS_directives.vResize, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.resizeStepContainer) }, null, null);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onDragstart: () => { } },
    ...{ onDrag: () => { } },
    ...{ onDragover: () => { } },
    ...{ onDragend: () => { } },
    ...{ class: "flex align-center" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
const __VLS_0 = (__VLS_ctx.iconComponent(`${__VLS_ctx.nodeModel.type}-icon`));
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "mr-8" },
    size: (24),
    item: (__VLS_ctx.nodeModel?.properties.node_data),
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "mr-8" },
    size: (24),
    item: (__VLS_ctx.nodeModel?.properties.node_data),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "ellipsis-1 break-all" },
});
__VLS_asFunctionalDirective(__VLS_directives.vHtml, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.highlightedStepName(__VLS_ctx.nodeModel.properties.stepName)) }, null, null);
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMousemove: () => { } },
    ...{ onMousedown: () => { } },
    ...{ onKeydown: () => { } },
    ...{ onClick: () => { } },
});
let __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_7 = __VLS_6({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_10;
const __VLS_11 = {
    /** @type {typeof __VLS_10.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.showNode = !__VLS_ctx.showNode;
        // @ts-ignore
        [mousedown, node_status, vResize, resizeStepContainer, iconComponent, nodeModel, nodeModel, nodeModel, highlightedStepName, showNode, showNode,];
    },
};
const { default: __VLS_12 } = __VLS_8.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ class: "arrow-icon color-secondary" },
    ...{ class: (__VLS_ctx.showNode ? 'rotate-180' : '') },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "arrow-icon color-secondary" },
    ...{ class: (__VLS_ctx.showNode ? 'rotate-180' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.ArrowDownBold} */
ArrowDownBold;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[showNode,];
var __VLS_16;
// @ts-ignore
[];
var __VLS_8;
var __VLS_9;
if (__VLS_ctx.showConditionOperate(__VLS_ctx.nodeModel.type)) {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        teleported: (false),
        trigger: "click",
        placement: "bottom-start",
    }));
    const __VLS_26 = __VLS_25({
        teleported: (false),
        trigger: "click",
        placement: "bottom-start",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_29 } = __VLS_27.slots;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        text: true,
    }));
    const __VLS_32 = __VLS_31({
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    if (__VLS_ctx.condition === 'OR') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/workflow/icon_or.svg",
            alt: "",
        });
    }
    if (__VLS_ctx.condition === 'AND') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/workflow/icon_and.svg",
            alt: "",
        });
    }
    // @ts-ignore
    [nodeModel, showConditionOperate, condition, condition,];
    var __VLS_33;
    {
        const { dropdown: __VLS_36 } = __VLS_27.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
            ...{ class: "p-12-16" },
        });
        /** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({});
        (__VLS_ctx.$t('workflow.condition.title'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "mt-8 lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.condition.front'));
        let __VLS_37;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            modelValue: (__VLS_ctx.condition),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_39 = __VLS_38({
            modelValue: (__VLS_ctx.condition),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        const { default: __VLS_42 } = __VLS_40.slots;
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
            label: (__VLS_ctx.$t('workflow.condition.AND')),
            value: "AND",
        }));
        const __VLS_45 = __VLS_44({
            label: (__VLS_ctx.$t('workflow.condition.AND')),
            value: "AND",
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        let __VLS_48;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            label: (__VLS_ctx.$t('workflow.condition.OR')),
            value: "OR",
        }));
        const __VLS_50 = __VLS_49({
            label: (__VLS_ctx.$t('workflow.condition.OR')),
            value: "OR",
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        // @ts-ignore
        [condition, $t, $t, $t, $t,];
        var __VLS_40;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.condition.text'));
        // @ts-ignore
        [$t,];
    }
    // @ts-ignore
    [];
    var __VLS_27;
}
if (__VLS_ctx.showOperate(__VLS_ctx.nodeModel.type)) {
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        teleported: (false),
        trigger: "click",
    }));
    const __VLS_55 = __VLS_54({
        teleported: (false),
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    const { default: __VLS_58 } = __VLS_56.slots;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        text: true,
    }));
    const __VLS_61 = __VLS_60({
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    const { default: __VLS_64 } = __VLS_62.slots;
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        iconName: "app-more",
        ...{ class: "color-secondary" },
    }));
    const __VLS_67 = __VLS_66({
        iconName: "app-more",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [nodeModel, showOperate,];
    var __VLS_62;
    {
        const { dropdown: __VLS_70 } = __VLS_56.slots;
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            ...{ style: {} },
        }));
        const __VLS_73 = __VLS_72({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        const { default: __VLS_76 } = __VLS_74.slots;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            ...{ 'onClick': {} },
            ...{ class: "p-8" },
        }));
        const __VLS_79 = __VLS_78({
            ...{ 'onClick': {} },
            ...{ class: "p-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        let __VLS_82;
        const __VLS_83 = {
            /** @type {typeof __VLS_82.click} */
            onClick: (__VLS_ctx.renameNode),
        };
        /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
        const { default: __VLS_84 } = __VLS_80.slots;
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            iconName: "app-rename",
            ...{ class: "color-secondary" },
        }));
        const __VLS_87 = __VLS_86({
            iconName: "app-rename",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.$t('common.rename'));
        // @ts-ignore
        [$t, renameNode,];
        var __VLS_80;
        var __VLS_81;
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
            ...{ 'onClick': {} },
            ...{ class: "p-8" },
        }));
        const __VLS_92 = __VLS_91({
            ...{ 'onClick': {} },
            ...{ class: "p-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        let __VLS_95;
        const __VLS_96 = {
            /** @type {typeof __VLS_95.click} */
            onClick: (__VLS_ctx.copyNode),
        };
        /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
        const { default: __VLS_97 } = __VLS_93.slots;
        let __VLS_98;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
            iconName: "app-copy",
            ...{ class: "color-secondary" },
        }));
        const __VLS_100 = __VLS_99({
            iconName: "app-copy",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_99));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.$t('common.copy'));
        // @ts-ignore
        [$t, copyNode,];
        var __VLS_93;
        var __VLS_94;
        if (!((__VLS_ctx.nodeModel.type == 'tool-lib-node' &&
            __VLS_ctx.nodeModel['properties'].kind == __VLS_ctx.WorkflowKind.DataSource) ||
            __VLS_ctx.nodeModel.type == 'data-source-local-node' ||
            __VLS_ctx.nodeModel.type == 'data-source-web-node')) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: () => { } },
                ...{ class: "flex-between p-8" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
            let __VLS_103;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
                iconName: "app-active",
                ...{ class: "color-secondary" },
            }));
            const __VLS_105 = __VLS_104({
                iconName: "app-active",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_104));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-16" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
            (__VLS_ctx.$t('common.status.enableStatus'));
            let __VLS_108;
            /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
            elSwitch;
            // @ts-ignore
            const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
                modelValue: (__VLS_ctx.nodeEnabled),
                size: "small",
            }));
            const __VLS_110 = __VLS_109({
                modelValue: (__VLS_ctx.nodeEnabled),
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        }
        let __VLS_113;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
            ...{ 'onClick': {} },
            ...{ class: "border-t p-8" },
        }));
        const __VLS_115 = __VLS_114({
            ...{ 'onClick': {} },
            ...{ class: "border-t p-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        let __VLS_118;
        const __VLS_119 = {
            /** @type {typeof __VLS_118.click} */
            onClick: (__VLS_ctx.deleteNode),
        };
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
        const { default: __VLS_120 } = __VLS_116.slots;
        let __VLS_121;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
            iconName: "app-delete",
            ...{ class: "color-secondary" },
        }));
        const __VLS_123 = __VLS_122({
            iconName: "app-delete",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.$t('common.delete'));
        // @ts-ignore
        [nodeModel, nodeModel, nodeModel, nodeModel, $t, $t, WorkflowKind, nodeEnabled, deleteNode,];
        var __VLS_116;
        var __VLS_117;
        if (__VLS_ctx.sourceName) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: () => { } },
                ...{ class: "border-t p-8" },
            });
            /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
            /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "color-secondary font-small" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
            (__VLS_ctx.$t('common.source'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "lighter mt-4 break-all" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
            (__VLS_ctx.sourceName);
        }
        // @ts-ignore
        [$t, sourceName, sourceName,];
        var __VLS_74;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_56;
}
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({}));
const __VLS_128 = __VLS_127({}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const { default: __VLS_131 } = __VLS_129.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMousedown: () => { } },
    ...{ onKeydown: () => { } },
    ...{ onClick: () => { } },
    ...{ class: "mt-16" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showNode) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
if (__VLS_ctx.nodeDisabled) {
    let __VLS_132;
    /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
    elAlert;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
        ...{ class: "mb-16" },
        title: (__VLS_ctx.$t('workflow.tip.disabled')),
        type: "error",
        showIcon: true,
        closable: (false),
    }));
    const __VLS_134 = __VLS_133({
        ...{ class: "mb-16" },
        title: (__VLS_ctx.$t('workflow.tip.disabled')),
        type: "error",
        showIcon: true,
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
}
if (__VLS_ctx.node_status != 200) {
    let __VLS_137;
    /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
    elAlert;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
        ...{ class: "mb-16" },
        title: (props.nodeModel.type === 'application-node'
            ? __VLS_ctx.$t('workflow.tip.applicationNodeError')
            : __VLS_ctx.$t('workflow.tip.toolNodeError')),
        type: "error",
        showIcon: true,
        closable: (false),
    }));
    const __VLS_139 = __VLS_138({
        ...{ class: "mb-16" },
        title: (props.nodeModel.type === 'application-node'
            ? __VLS_ctx.$t('workflow.tip.applicationNodeError')
            : __VLS_ctx.$t('workflow.tip.toolNodeError')),
        type: "error",
        showIcon: true,
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
}
var __VLS_142 = {};
if (__VLS_ctx.nodeFields.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "title-decoration-1 mb-8 mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    (__VLS_ctx.output_title);
    if (__VLS_ctx.exceptionNodeList.includes(__VLS_ctx.nodeModel.type)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mt-8 mr-8 lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('common.param.exception'));
        let __VLS_144;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
            modelValue: (__VLS_ctx.enable_exception),
            size: "small",
        }));
        const __VLS_146 = __VLS_145({
            modelValue: (__VLS_ctx.enable_exception),
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "border-r-6 p-4-12 layout-bg lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
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
                    [node_status, nodeModel, showNode, $t, $t, $t, $t, nodeDisabled, nodeFields, nodeFields, output_title, exceptionNodeList, enable_exception, showicon,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.nodeFields.length > 0))
                        throw 0;
                    return __VLS_ctx.showicon = null;
                    // @ts-ignore
                    [showicon,];
                } },
            ...{ class: "flex-between mb-8 mt-8" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "break-all" },
        });
        /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
        (item.label);
        ('{' + item.value + '}');
        if (__VLS_ctx.showicon === index) {
            let __VLS_149;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }));
            const __VLS_151 = __VLS_150({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_150));
            const { default: __VLS_154 } = __VLS_152.slots;
            let __VLS_155;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }));
            const __VLS_157 = __VLS_156({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_156));
            let __VLS_160;
            const __VLS_161 = {
                /** @type {typeof __VLS_160.click} */
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
            const { default: __VLS_162 } = __VLS_158.slots;
            let __VLS_163;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
                iconName: "app-copy",
            }));
            const __VLS_165 = __VLS_164({
                iconName: "app-copy",
            }, ...__VLS_functionalComponentArgsRest(__VLS_164));
            // @ts-ignore
            [];
            var __VLS_158;
            var __VLS_159;
            // @ts-ignore
            [];
            var __VLS_152;
        }
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.enable_exception) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "border-r-6 p-4-12 layout-bg lighter mt-8" },
        });
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-4-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.abnormalNodeFields))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onMouseenter: (...[$event]) => {
                        if (!(__VLS_ctx.nodeFields.length > 0))
                            throw 0;
                        if (!(__VLS_ctx.enable_exception))
                            throw 0;
                        return __VLS_ctx.showicon = 'abnormal' + index;
                        // @ts-ignore
                        [enable_exception, showicon, abnormalNodeFields,];
                    } },
                ...{ onMouseleave: (...[$event]) => {
                        if (!(__VLS_ctx.nodeFields.length > 0))
                            throw 0;
                        if (!(__VLS_ctx.enable_exception))
                            throw 0;
                        return __VLS_ctx.showicon = null;
                        // @ts-ignore
                        [showicon,];
                    } },
                ...{ class: "flex-between mb-8 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "break-all" },
            });
            /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
            (item.label);
            ('{' + item.value + '}');
            if (__VLS_ctx.showicon === 'abnormal' + index) {
                let __VLS_168;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
                    effect: "dark",
                    content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                    placement: "top",
                }));
                const __VLS_170 = __VLS_169({
                    effect: "dark",
                    content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_169));
                const { default: __VLS_173 } = __VLS_171.slots;
                let __VLS_174;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
                    ...{ 'onClick': {} },
                    link: true,
                    ...{ style: {} },
                }));
                const __VLS_176 = __VLS_175({
                    ...{ 'onClick': {} },
                    link: true,
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_175));
                let __VLS_179;
                const __VLS_180 = {
                    /** @type {typeof __VLS_179.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.nodeFields.length > 0))
                            throw 0;
                        if (!(__VLS_ctx.enable_exception))
                            throw 0;
                        if (!(__VLS_ctx.showicon === 'abnormal' + index))
                            throw 0;
                        return __VLS_ctx.copyClick(item.globeLabel);
                        // @ts-ignore
                        [$t, showicon, copyClick,];
                    },
                };
                const { default: __VLS_181 } = __VLS_177.slots;
                let __VLS_182;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
                    iconName: "app-copy",
                }));
                const __VLS_184 = __VLS_183({
                    iconName: "app-copy",
                }, ...__VLS_functionalComponentArgsRest(__VLS_183));
                // @ts-ignore
                [];
                var __VLS_177;
                var __VLS_178;
                // @ts-ignore
                [];
                var __VLS_171;
            }
            // @ts-ignore
            [];
        }
    }
}
// @ts-ignore
[];
var __VLS_129;
let __VLS_187;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({}));
const __VLS_189 = __VLS_188({}, ...__VLS_functionalComponentArgsRest(__VLS_188));
const { default: __VLS_192 } = __VLS_190.slots;
if (__VLS_ctx.showAnchor) {
    const __VLS_193 = DropdownMenu;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
        ...{ 'onMousemove': {} },
        ...{ 'onMousedown': {} },
        ...{ 'onClick': {} },
        ...{ 'onWheel': {} },
        ...{ 'onClickNodes': {} },
        show: (__VLS_ctx.showAnchor),
        inner: (true),
        id: (__VLS_ctx.id),
        ...{ style: {} },
        ...{ style: (__VLS_ctx.dropdownMenuStyle) },
    }));
    const __VLS_195 = __VLS_194({
        ...{ 'onMousemove': {} },
        ...{ 'onMousedown': {} },
        ...{ 'onClick': {} },
        ...{ 'onWheel': {} },
        ...{ 'onClickNodes': {} },
        show: (__VLS_ctx.showAnchor),
        inner: (true),
        id: (__VLS_ctx.id),
        ...{ style: {} },
        ...{ style: (__VLS_ctx.dropdownMenuStyle) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    let __VLS_198;
    const __VLS_199 = {
        /** @type {typeof __VLS_198.mousemove} */
        onMousemove: () => { },
    };
    const __VLS_200 = {
        /** @type {typeof __VLS_198.mousedown} */
        onMousedown: () => { },
    };
    const __VLS_201 = {
        /** @type {typeof __VLS_198.click} */
        onClick: () => { },
    };
    const __VLS_202 = {
        /** @type {typeof __VLS_198.wheel} */
        onWheel: (__VLS_ctx.handleWheel),
    };
    const __VLS_203 = {
        /** @type {typeof __VLS_198.clickNodes} */
        onClickNodes: (__VLS_ctx.clickNodes),
    };
    var __VLS_196;
    var __VLS_197;
}
// @ts-ignore
[showAnchor, showAnchor, id, dropdownMenuStyle, handleWheel, clickNodes,];
var __VLS_190;
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
    ...{ 'onSubmit': {} },
    title: (__VLS_ctx.$t('workflow.nodeName')),
    modelValue: (__VLS_ctx.nodeNameDialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    appendToBody: true,
}));
const __VLS_206 = __VLS_205({
    ...{ 'onSubmit': {} },
    title: (__VLS_ctx.$t('workflow.nodeName')),
    modelValue: (__VLS_ctx.nodeNameDialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
let __VLS_209;
const __VLS_210 = {
    /** @type {typeof __VLS_209.submit} */
    onSubmit: () => { },
};
const { default: __VLS_211 } = __VLS_207.slots;
let __VLS_212;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
    labelPosition: "top",
    ref: "titleFormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_214 = __VLS_213({
    labelPosition: "top",
    ref: "titleFormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_217;
const { default: __VLS_219 } = __VLS_215.slots;
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    prop: "title",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'blur',
        },
    ]),
}));
const __VLS_222 = __VLS_221({
    prop: "title",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'blur',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const { default: __VLS_225 } = __VLS_223.slots;
let __VLS_226;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.title),
}));
const __VLS_228 = __VLS_227({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
let __VLS_231;
const __VLS_232 = {
    /** @type {typeof __VLS_231.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.title = __VLS_ctx.form.title.trim();
        // @ts-ignore
        [$t, $t, nodeNameDialogVisible, form, form, form, form,];
    },
};
var __VLS_229;
var __VLS_230;
// @ts-ignore
[];
var __VLS_223;
// @ts-ignore
[];
var __VLS_215;
{
    const { footer: __VLS_233 } = __VLS_207.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_234;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
        ...{ 'onClick': {} },
    }));
    const __VLS_236 = __VLS_235({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    let __VLS_239;
    const __VLS_240 = {
        /** @type {typeof __VLS_239.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.nodeNameDialogVisible = false;
            // @ts-ignore
            [nodeNameDialogVisible,];
        },
    };
    const { default: __VLS_241 } = __VLS_237.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_237;
    var __VLS_238;
    let __VLS_242;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_244 = __VLS_243({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_243));
    let __VLS_247;
    const __VLS_248 = {
        /** @type {typeof __VLS_247.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.editName(__VLS_ctx.titleFormRef);
            // @ts-ignore
            [editName, titleFormRef,];
        },
    };
    const { default: __VLS_249 } = __VLS_245.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_245;
    var __VLS_246;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_207;
var __VLS_208;
// @ts-ignore
var __VLS_143 = __VLS_142, __VLS_218 = __VLS_217;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
