/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed, inject } from 'vue';
import { getMenuNodes, toolLibNode, toolWorkflowLibNode } from '@/workflow/common/data';
import { iconComponent } from '@/workflow/icons/utils';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
import NodeContent from './NodeContent.vue';
import { SourceTypeEnum } from '@/enums/common';
import permissionMap from '@/permission';
import { useRoute } from 'vue-router';
import { WorkflowKind, WorkflowMode } from '@/enums/application';
const workflowModel = inject('workflowMode');
const route = useRoute();
const { user, folder } = useStore();
const menuNodes = getMenuNodes(workflowModel || WorkflowMode.Application);
const search_text = ref('');
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        default: '',
    },
    workflowRef: Object,
});
const emit = defineEmits(['clickNodes', 'onmousedown']);
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
const permissionPrecise = computed(() => {
    return permissionMap['tool'][apiType.value];
});
const loading = ref(false);
const activeName = ref('base');
const filter_menu_nodes = computed(() => {
    if (!search_text.value)
        return menuNodes || [];
    const searchTerm = search_text.value.toLowerCase();
    return (menuNodes || []).reduce((result, item) => {
        const filteredList = item.list.filter((listItem) => listItem.label.toLowerCase().includes(searchTerm));
        if (filteredList.length) {
            result.push({ ...item, list: filteredList });
        }
        return result;
    }, []);
});
function clickNodes(item, data) {
    if (data) {
        item['properties']['stepName'] = data.name;
        if (data.tool_type == 'DATA_SOURCE') {
            item['properties'].kind = WorkflowKind.DataSource;
        }
        item['properties']['node_data'] = {
            ...data,
            tool_lib_id: data.id,
            input_field_list: data.input_field_list.map((field) => ({
                ...field,
                value: field.source == 'reference' ? [] : '',
            })),
        };
    }
    item['properties']['condition'] = 'OR';
    props.workflowRef?.addNode(item);
    emit('clickNodes', item);
}
function onmousedown(item, data) {
    if (data) {
        item['properties']['stepName'] = data.name;
        if (data.tool_type == 'DATA_SOURCE') {
            item['properties'].kind = WorkflowKind.DataSource;
        }
        item['properties']['node_data'] = {
            ...data,
            tool_lib_id: data.id,
            input_field_list: data.input_field_list.map((field) => ({
                ...field,
                value: field.source == 'reference' ? [] : '',
            })),
        };
    }
    item['properties']['condition'] = 'OR';
    props.workflowRef?.onmousedown(item);
    emit('onmousedown', item);
}
const toolTreeData = ref([]);
const toolList = ref([]);
async function getToolFolder() {
    const res = await folder.asyncGetFolder(SourceTypeEnum.TOOL, { source_id: props.id }, apiType.value, loading);
    toolTreeData.value = res.data;
    folder.setCurrentFolder(res.data?.[0] || {});
}
async function getToolList() {
    const baseType = activeName.value == 'DATA_SOURCE_TOOL' ? 'DATA_SOURCE' : 'CUSTOM';
    const res = await loadSharedApi({
        type: 'tool',
        isShared: folder.currentFolder?.id === 'share',
        systemType: apiType.value,
    }).getToolList({
        folder_id: folder.currentFolder?.id || user.getWorkspaceId(),
        tool_type_list: [baseType, 'WORKFLOW'],
    });
    toolList.value = res.data?.tools || res.data || [];
    toolList.value = toolList.value?.filter((item) => item.is_active && item.id !== props.id);
}
function folderClickHandle(row) {
    folder.setCurrentFolder(row);
    if (['DATA_SOURCE_TOOL', 'CUSTOM_TOOL'].includes(activeName.value)) {
        getToolList();
    }
}
async function handleClick(val) {
    if (['DATA_SOURCE_TOOL', 'CUSTOM_TOOL'].includes(val)) {
        if (!route.path.includes('shared')) {
            await getToolFolder();
        }
        getToolList();
    }
}
onMounted(() => { });
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "workflow-dropdown-menu border border-r-6 white-bg" },
    ...{ style: ({ width: __VLS_ctx.activeName === 'base' || __VLS_ctx.route.path.includes('shared') ? '400px' : '640px' }) },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.show) }, null, null);
/** @type {__VLS_StyleScopedClasses['workflow-dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "workflow-dropdown-tabs" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "workflow-dropdown-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.tabChange} */
    onTabChange: (__VLS_ctx.handleClick),
};
/** @type {__VLS_StyleScopedClasses['workflow-dropdown-tabs']} */ ;
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
    ...{ class: "mb-12 mt-12" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeName === 'base') }, null, null);
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.search_text),
    ...{ class: "mr-12 ml-12" },
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.search_text),
    ...{ class: "mr-12 ml-12" },
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
const { default: __VLS_13 } = __VLS_11.slots;
{
    const { suffix: __VLS_14 } = __VLS_11.slots;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        ...{ class: "el-input__icon" },
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: "el-input__icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    /** @type {__VLS_StyleScopedClasses['el-input__icon']} */ ;
    const { default: __VLS_20 } = __VLS_18.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.search | typeof __VLS_components.Search} */
    search;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    // @ts-ignore
    [activeName, activeName, activeName, route, show, handleClick, search_text, $t,];
    var __VLS_18;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_11;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    label: (__VLS_ctx.$t('workflow.baseComponent')),
    name: "base",
}));
const __VLS_28 = __VLS_27({
    label: (__VLS_ctx.$t('workflow.baseComponent')),
    name: "base",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    height: "400",
}));
const __VLS_34 = __VLS_33({
    height: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
if (__VLS_ctx.filter_menu_nodes.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [node, index] of __VLS_vFor((__VLS_ctx.filter_menu_nodes))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            type: "info",
            size: "small",
            ...{ class: "color-secondary ml-12" },
        }));
        const __VLS_40 = __VLS_39({
            type: "info",
            size: "small",
            ...{ class: "color-secondary ml-12" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
        const { default: __VLS_43 } = __VLS_41.slots;
        (node.label);
        // @ts-ignore
        [$t, filter_menu_nodes, filter_menu_nodes,];
        var __VLS_41;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-wrap" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
        for (const [item, index] of __VLS_vFor((node.list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            let __VLS_44;
            /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
            elPopover;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
                placement: "right",
                width: (280),
                showAfter: (500),
                persistent: (false),
            }));
            const __VLS_46 = __VLS_45({
                placement: "right",
                width: (280),
                showAfter: (500),
                persistent: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            const { default: __VLS_49 } = __VLS_47.slots;
            {
                const { reference: __VLS_50 } = __VLS_47.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.filter_menu_nodes.length > 0))
                                throw 0;
                            return __VLS_ctx.clickNodes(item);
                            // @ts-ignore
                            [clickNodes,];
                        } },
                    ...{ onMousedown: (...[$event]) => {
                            if (!(__VLS_ctx.filter_menu_nodes.length > 0))
                                throw 0;
                            return __VLS_ctx.onmousedown(item);
                            // @ts-ignore
                            [onmousedown,];
                        } },
                    ...{ class: "list-item flex align-center border border-r-6 p-8-12 cursor" },
                    ...{ style: {} },
                });
                /** @type {__VLS_StyleScopedClasses['list-item']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                const __VLS_51 = (__VLS_ctx.iconComponent(`${item.type}-icon`));
                // @ts-ignore
                const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
                    ...{ class: "mr-8" },
                    size: (20),
                    ...{ style: {} },
                }));
                const __VLS_53 = __VLS_52({
                    ...{ class: "mr-8" },
                    size: (20),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_52));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (item.label);
                // @ts-ignore
                [iconComponent,];
            }
            {
                const { default: __VLS_56 } = __VLS_47.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                const __VLS_57 = (__VLS_ctx.iconComponent(`${item.type}-icon`));
                // @ts-ignore
                const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
                    ...{ class: "mr-8" },
                    size: (32),
                }));
                const __VLS_59 = __VLS_58({
                    ...{ class: "mr-8" },
                    size: (32),
                }, ...__VLS_functionalComponentArgsRest(__VLS_58));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter color-text-primary" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
                (item.label);
                let __VLS_62;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary lighter" },
                }));
                const __VLS_64 = __VLS_63({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary lighter" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_63));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                const { default: __VLS_67 } = __VLS_65.slots;
                (item.text);
                // @ts-ignore
                [iconComponent,];
                var __VLS_65;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_47;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-16 mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        type: "info",
    }));
    const __VLS_70 = __VLS_69({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const { default: __VLS_73 } = __VLS_71.slots;
    (__VLS_ctx.$t('workflow.tip.noData'));
    // @ts-ignore
    [$t,];
    var __VLS_71;
}
// @ts-ignore
[];
var __VLS_35;
// @ts-ignore
[];
var __VLS_29;
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    label: (__VLS_ctx.$t('views.tool.title')),
    name: "CUSTOM_TOOL",
}));
const __VLS_76 = __VLS_75({
    label: (__VLS_ctx.$t('views.tool.title')),
    name: "CUSTOM_TOOL",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const { default: __VLS_79 } = __VLS_77.slots;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.LayoutContainer | typeof __VLS_components.LayoutContainer} */
LayoutContainer;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    showLeft: (!__VLS_ctx.route.path.includes('shared')),
}));
const __VLS_82 = __VLS_81({
    showLeft: (!__VLS_ctx.route.path.includes('shared')),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
{
    const { left: __VLS_86 } = __VLS_83.slots;
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.FolderVirtualizedTree} */
    FolderVirtualizedTree;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        ...{ 'onHandleNodeClick': {} },
        source: (__VLS_ctx.SourceTypeEnum.TOOL),
        data: (__VLS_ctx.toolTreeData),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        shareTitle: (__VLS_ctx.$t('views.shared.shared_tool')),
        showShared: (__VLS_ctx.permissionPrecise['is_share']()),
        canOperation: (false),
        treeStyle: ({ height: '400px' }),
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onHandleNodeClick': {} },
        source: (__VLS_ctx.SourceTypeEnum.TOOL),
        data: (__VLS_ctx.toolTreeData),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        shareTitle: (__VLS_ctx.$t('views.shared.shared_tool')),
        showShared: (__VLS_ctx.permissionPrecise['is_share']()),
        canOperation: (false),
        treeStyle: ({ height: '400px' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_92;
    const __VLS_93 = {
        /** @type {typeof __VLS_92.handleNodeClick} */
        onHandleNodeClick: (__VLS_ctx.folderClickHandle),
    };
    var __VLS_90;
    var __VLS_91;
    // @ts-ignore
    [route, $t, $t, SourceTypeEnum, toolTreeData, folder, permissionPrecise, folderClickHandle,];
}
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    height: "450",
}));
const __VLS_96 = __VLS_95({
    height: "450",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const { default: __VLS_99 } = __VLS_97.slots;
const __VLS_100 = NodeContent;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    ...{ 'onClickNodes': {} },
    ...{ 'onOnmousedown': {} },
    list: (__VLS_ctx.toolList),
}));
const __VLS_102 = __VLS_101({
    ...{ 'onClickNodes': {} },
    ...{ 'onOnmousedown': {} },
    list: (__VLS_ctx.toolList),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_105;
const __VLS_106 = {
    /** @type {typeof __VLS_105.clickNodes} */
    onClickNodes: ((val) => __VLS_ctx.clickNodes(val.tool_type === 'WORKFLOW' ? __VLS_ctx.toolWorkflowLibNode : __VLS_ctx.toolLibNode, val)),
};
const __VLS_107 = {
    /** @type {typeof __VLS_105.onmousedown} */
    onOnmousedown: ((val) => __VLS_ctx.onmousedown(val.tool_type === 'WORKFLOW' ? __VLS_ctx.toolWorkflowLibNode : __VLS_ctx.toolLibNode, val)),
};
var __VLS_103;
var __VLS_104;
// @ts-ignore
[clickNodes, onmousedown, toolList, toolWorkflowLibNode, toolWorkflowLibNode, toolLibNode, toolLibNode,];
var __VLS_97;
// @ts-ignore
[];
var __VLS_83;
// @ts-ignore
[];
var __VLS_77;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        id: {
            type: String,
            default: '',
        },
        workflowRef: Object,
    },
});
export default {};
