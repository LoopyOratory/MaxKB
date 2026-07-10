/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { Draggable, dragContext } from '@he-tree/vue';
import '@he-tree/vue/style/default.css';
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    currentNodeKey: {
        type: String,
        default: 'default',
    },
    filterNodeMethod: {
        type: Function,
        default: (node, filterText) => {
            return node.name?.toLowerCase().includes(filterText.toLowerCase());
        },
    },
    draggable: {
        type: Boolean,
        default: false,
    },
});
const treeRef = ref(null);
const emit = defineEmits(['handleNodeClick', 'node-drop']);
const handleNodeClick = (node) => {
    if (node.data.id === props.currentNodeKey) {
        node.open = !node.open;
        return;
    }
    emit('handleNodeClick', node.data);
};
const buildNodeDropArgs = () => {
    const draggingNode = dragContext.dragNode;
    const targetInfo = dragContext.targetInfo;
    if (!draggingNode || !targetInfo) {
        return null;
    }
    const newParent = targetInfo.parent ?? null;
    const siblings = Array.isArray(targetInfo.siblings) ? targetInfo.siblings : [];
    let newIndex = typeof targetInfo.indexBeforeDrop === 'number'
        ? targetInfo.indexBeforeDrop
        : siblings.indexOf(draggingNode);
    if (newIndex < 0) {
        newIndex = siblings.indexOf(draggingNode);
    }
    let dropNode = null;
    let dropType = 'after';
    if (newParent && siblings.length === 1 && siblings[0] === draggingNode) {
        dropNode = newParent;
        dropType = 'inner';
        return [draggingNode, dropNode, dropType];
    }
    if (siblings.length <= 1) {
        return [draggingNode, newParent, 'inner'];
    }
    if (newIndex === 0) {
        dropNode = siblings[1];
        dropType = 'before';
        return [draggingNode, dropNode, dropType];
    }
    dropNode = siblings[newIndex - 1];
    dropType = 'after';
    return [draggingNode, dropNode, dropType];
};
function onAfterDrop() {
    const args = buildNodeDropArgs();
    if (args) {
        emit('node-drop', args[0], args[1], args[2]);
    }
}
const containsCurrentNodeKey = (node) => {
    if (node.id === props.currentNodeKey) {
        return true;
    }
    if (node.children && node.children.length) {
        return node.children.some((child) => containsCurrentNodeKey(child));
    }
    return false;
};
const statHandler = (stat) => {
    stat.open = stat.level === 1;
    if (filterText.value) {
        stat.open = true;
    }
    if (containsCurrentNodeKey(stat.data)) {
        stat.open = true;
    }
    return stat;
};
// FilterText
const filterText = ref('');
/**
 * Recursive filter tree
 * @param nodes NodeArray
 * @param text FilterText
 * @returns Filter afterNew tree (newObject, butNodeWithinBasicProperties remainReference）
 */
const filterTree = (nodes, text) => {
    if (!text || !props.filterNodeMethod) {
        return nodes;
    }
    const result = [];
    for (const node of nodes) {
        const isMatch = props.filterNodeMethod(node, text);
        let filteredChildren = [];
        if (node.children && node.children.length) {
            filteredChildren = filterTree(node.children, text);
        }
        if (isMatch || filteredChildren.length) {
            // Create new node object, retain original properties, replace children
            result.push({
                ...node,
                children: filteredChildren,
            });
        }
    }
    return result;
};
// Calculate filtered tree data
const filteredTreeData = computed(() => {
    return filterTree(props.modelValue, filterText.value);
});
// ExposeFilterMethodTo parentComponent
const filter = (text) => {
    filterText.value = text;
};
const __VLS_exposed = {
    filter,
};
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Draggable | typeof __VLS_components.Draggable} */
Draggable;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick:node': {} },
    ...{ 'onAfterDrop': {} },
    ref: "treeRef",
    virtualization: true,
    defaultOpen: (false),
    modelValue: (__VLS_ctx.filteredTreeData),
    ...{ class: "maxkb-virtualized-tree" },
    rootDroppable: (false),
    statHandler: (__VLS_ctx.statHandler),
    disableDrag: (!__VLS_ctx.draggable),
    disableDrop: (!__VLS_ctx.draggable),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick:node': {} },
    ...{ 'onAfterDrop': {} },
    ref: "treeRef",
    virtualization: true,
    defaultOpen: (false),
    modelValue: (__VLS_ctx.filteredTreeData),
    ...{ class: "maxkb-virtualized-tree" },
    rootDroppable: (false),
    statHandler: (__VLS_ctx.statHandler),
    disableDrag: (!__VLS_ctx.draggable),
    disableDrop: (!__VLS_ctx.draggable),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.'click:node'} */
    'onClick:node': (__VLS_ctx.handleNodeClick),
};
const __VLS_7 = {
    /** @type {typeof __VLS_5.afterDrop} */
    onAfterDrop: (__VLS_ctx.onAfterDrop),
};
var __VLS_8;
/** @type {__VLS_StyleScopedClasses['maxkb-virtualized-tree']} */ ;
const { default: __VLS_10 } = __VLS_3.slots;
{
    const { default: __VLS_11 } = __VLS_3.slots;
    const [{ node, stat }] = __VLS_vSlot(__VLS_11);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center maxkb-tree-node" },
        ...{ class: (__VLS_ctx.currentNodeKey === node.id ? 'is-current' : '') },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['maxkb-tree-node']} */ ;
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        ...{ class: "tree-arrow-icon" },
        ...{ class: (stat.open ? 'rotate-90' : '') },
        ...{ style: ({ visibility: stat.children.length ? 'visible' : 'hidden' }) },
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        ...{ class: "tree-arrow-icon" },
        ...{ class: (stat.open ? 'rotate-90' : '') },
        ...{ style: ({ visibility: stat.children.length ? 'visible' : 'hidden' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_17;
    const __VLS_18 = {
        /** @type {typeof __VLS_17.click} */
        onClick: (...[$event]) => {
            return stat.open = !stat.open;
            // @ts-ignore
            [filteredTreeData, statHandler, draggable, draggable, $attrs, handleNodeClick, onAfterDrop, currentNodeKey,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['tree-arrow-icon']} */ ;
    const { default: __VLS_19 } = __VLS_15.slots;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [];
    var __VLS_15;
    var __VLS_16;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "tree-label lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['tree-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    var __VLS_25 = {
        ...({ node, stat }),
    };
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        title: (node.name),
    });
    (node.name);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_9 = __VLS_8, __VLS_26 = __VLS_25;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        currentNodeKey: {
            type: String,
            default: 'default',
        },
        filterNodeMethod: {
            type: Function,
            default: (node, filterText) => {
                return node.name?.toLowerCase().includes(filterText.toLowerCase());
            },
        },
        draggable: {
            type: Boolean,
            default: false,
        },
    },
});
const __VLS_export = {};
export default {};
