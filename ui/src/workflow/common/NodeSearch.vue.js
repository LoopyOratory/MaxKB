/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
const props = withDefaults(defineProps(), {});
// State
const showSearch = ref(false);
const searchText = ref('');
const searchInputRef = ref(null);
// Keyboard shortcut handling
const handleKeyDown = (e) => {
    // Ctrl+F or Cmd+F (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault(); // Prevent browser default search
        openSearch();
    }
    // Close on ESC
    if (e.key === 'Escape' && showSearch.value) {
        closeSearch();
    }
};
const focusOn = (node) => {
    props.lf?.graphModel.transformModel.focusOn(node.x, node.y, props.lf?.container.clientWidth, props.lf?.container.clientHeight);
};
const selectedNodes = ref();
const currentIndex = ref(0);
const selectedCount = computed(() => {
    return selectedNodes.value?.length;
});
const getSelectNodes = (kw) => {
    const result = [];
    const graph_data = props.lf?.getGraphData();
    graph_data.nodes.filter((node) => {
        if (node.properties.stepName.includes(kw)) {
            if (node.type !== 'loop-body-node') {
                result.push({
                    ...node,
                    order: 1,
                    focusOn: () => {
                        focusOn(node);
                        props.lf?.graphModel.getNodeModelById(node.id)?.focusOn(searchText.value);
                    },
                    selectOn: () => {
                        props.lf?.graphModel.getNodeModelById(node.id)?.selectOn(searchText.value);
                    },
                    clearSelectOn: () => {
                        props.lf?.graphModel.getNodeModelById(node.id)?.clearSelectOn(searchText.value);
                    },
                });
            }
        }
        if (node.type == 'loop-body-node') {
            const nodeModel = props.lf?.graphModel;
            const childNodeModel = nodeModel.getNodeModelById(node.id);
            childNodeModel.getSelectNodes(searchText.value).map((childNode) => {
                result.push({
                    ...childNode,
                    order: 2,
                    focusOn: () => {
                        focusOn(node);
                        childNodeModel.focusOn({ node: childNode, kw: searchText.value });
                    },
                    selectOn: () => {
                        childNodeModel.selectOn({ node: childNode, kw: searchText.value });
                    },
                    clearSelectOn: () => {
                        childNodeModel.clearSelectOn({ node: childNode, kw: searchText.value });
                    },
                });
            });
        }
    });
    result.sort((a, b) => a.order - b.order || a.y - b.y || a.x - b.x);
    return result;
};
const selectNodes = (nodes) => {
    nodes.forEach((node) => node.selectOn());
};
const next = () => {
    if (selectedNodes.value && selectedNodes.value.length > 0) {
        selectedNodes.value[currentIndex.value]?.selectOn();
        if (selectedNodes.value.length - 1 >= currentIndex.value + 1) {
            currentIndex.value++;
        }
        else {
            currentIndex.value = 0;
        }
        selectedNodes.value[currentIndex.value]?.focusOn();
    }
};
const up = () => {
    if (selectedNodes.value && selectedNodes.value.length > 0) {
        selectedNodes.value[currentIndex.value]?.selectOn();
        if (currentIndex.value - 1 < 0) {
            currentIndex.value = selectedNodes.value.length - 1;
        }
        else {
            currentIndex.value--;
        }
        selectedNodes.value[currentIndex.value]?.focusOn();
    }
};
const onSearch = (kw) => {
    if (selectedNodes.value === undefined) {
        const selected = getSelectNodes(kw);
        if (selected && selected.length > 0) {
            selectedNodes.value = selected;
            selectNodes(selected);
            selected[currentIndex.value].focusOn();
        }
    }
};
// Open search
const openSearch = () => {
    showSearch.value = true;
    searchText.value = '';
    nextTick(() => {
        searchInputRef.value?.focus();
    });
};
// Close search
const closeSearch = () => {
    clearSelect();
    showSearch.value = false;
    searchText.value = '';
};
const clearSelect = () => {
    if (selectedNodes.value) {
        selectedNodes.value.forEach((node) => {
            node.clearSelectOn();
        });
    }
    selectedNodes.value = undefined;
    currentIndex.value = 0;
    props.lf?.graphModel.clearSelectElements();
    const graph_data = props.lf?.getGraphData();
    graph_data.nodes.forEach((node) => {
        if (node.type == 'loop-body-node') {
            props.lf?.graphModel.getNodeModelById(node.id).clearSelectElements();
        }
    });
};
// Execute search
const handleSearch = (kw) => {
    searchText.value = kw;
    clearSelect();
    if (searchText.value.trim()) {
        onSearch?.(searchText.value);
    }
};
const reSearch = () => {
    handleSearch(searchText.value);
};
// Lifecycle
onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
const __VLS_exposed = { reSearch };
defineExpose(__VLS_exposed);
const __VLS_defaults = {};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.showSearch) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "workflow-search" },
        shadow: "always",
        ...{ style: {} },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "workflow-search" },
        shadow: "always",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['workflow-search']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "workflow-search-container flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['workflow-search-container']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        ...{ 'onUpdate:modelValue': {} },
        ...{ 'onKeyup': {} },
        ...{ 'onKeyup': {} },
        ref: "searchInputRef",
        modelValue: (__VLS_ctx.searchText),
        placeholder: (__VLS_ctx.$t('workflow.tip.searchPlaceholder')),
        clearable: true,
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onUpdate:modelValue': {} },
        ...{ 'onKeyup': {} },
        ...{ 'onKeyup': {} },
        ref: "searchInputRef",
        modelValue: (__VLS_ctx.searchText),
        placeholder: (__VLS_ctx.$t('workflow.tip.searchPlaceholder')),
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_11;
    const __VLS_12 = {
        /** @type {typeof __VLS_11.'update:modelValue'} */
        'onUpdate:modelValue': (__VLS_ctx.handleSearch),
    };
    const __VLS_13 = {
        /** @type {typeof __VLS_11.keyup} */
        onKeyup: (__VLS_ctx.next),
    };
    const __VLS_14 = {
        /** @type {typeof __VLS_11.keyup} */
        onKeyup: (__VLS_ctx.closeSearch),
    };
    var __VLS_15;
    var __VLS_9;
    var __VLS_10;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        size: (4),
    }));
    const __VLS_19 = __VLS_18({
        size: (4),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    const { default: __VLS_22 } = __VLS_20.slots;
    if (__VLS_ctx.selectedCount && __VLS_ctx.selectedCount > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.currentIndex + 1);
        (__VLS_ctx.selectedCount);
    }
    else if (__VLS_ctx.searchText.length > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "lighter color-secondary" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    }
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        direction: "vertical",
    }));
    const __VLS_25 = __VLS_24({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        text: true,
    }));
    const __VLS_30 = __VLS_29({
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const { default: __VLS_33 } = __VLS_31.slots;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = {
        /** @type {typeof __VLS_39.click} */
        onClick: (__VLS_ctx.up),
    };
    const { default: __VLS_41 } = __VLS_37.slots;
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.ArrowUp} */
    ArrowUp;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({}));
    const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
    // @ts-ignore
    [showSearch, searchText, searchText, $t, handleSearch, next, closeSearch, selectedCount, selectedCount, selectedCount, currentIndex, up,];
    var __VLS_37;
    var __VLS_38;
    // @ts-ignore
    [];
    var __VLS_31;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        text: true,
    }));
    const __VLS_49 = __VLS_48({
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const { default: __VLS_52 } = __VLS_50.slots;
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_58;
    const __VLS_59 = {
        /** @type {typeof __VLS_58.click} */
        onClick: (__VLS_ctx.next),
    };
    const { default: __VLS_60 } = __VLS_56.slots;
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
    ArrowDown;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({}));
    const __VLS_63 = __VLS_62({}, ...__VLS_functionalComponentArgsRest(__VLS_62));
    // @ts-ignore
    [next,];
    var __VLS_56;
    var __VLS_57;
    // @ts-ignore
    [];
    var __VLS_50;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_68 = __VLS_67({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    let __VLS_71;
    const __VLS_72 = {
        /** @type {typeof __VLS_71.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.showSearch))
                throw 0;
            return __VLS_ctx.closeSearch();
            // @ts-ignore
            [closeSearch,];
        },
    };
    const { default: __VLS_73 } = __VLS_69.slots;
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({}));
    const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
    const { default: __VLS_79 } = __VLS_77.slots;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.Close} */
    Close;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({}));
    const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
    // @ts-ignore
    [];
    var __VLS_77;
    // @ts-ignore
    [];
    var __VLS_69;
    var __VLS_70;
    // @ts-ignore
    [];
    var __VLS_20;
    // @ts-ignore
    [];
    var __VLS_3;
}
else {
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ 'onClick': {} },
        circle: true,
        ...{ class: "workflow-search-button" },
        size: "large",
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onClick': {} },
        circle: true,
        ...{ class: "workflow-search-button" },
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_90;
    const __VLS_91 = {
        /** @type {typeof __VLS_90.click} */
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.showSearch))
                throw 0;
            return __VLS_ctx.openSearch();
            // @ts-ignore
            [openSearch,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['workflow-search-button']} */ ;
    const { default: __VLS_92 } = __VLS_88.slots;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        size: (20),
    }));
    const __VLS_95 = __VLS_94({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    const { default: __VLS_98 } = __VLS_96.slots;
    let __VLS_99;
    /** @ts-ignore @type { | typeof __VLS_components.Search} */
    Search;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({}));
    const __VLS_101 = __VLS_100({}, ...__VLS_functionalComponentArgsRest(__VLS_100));
    // @ts-ignore
    [];
    var __VLS_96;
    // @ts-ignore
    [];
    var __VLS_88;
    var __VLS_89;
}
// @ts-ignore
var __VLS_16 = __VLS_15;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
