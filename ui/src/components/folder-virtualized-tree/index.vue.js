/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import VirtualizedTree from './VirtualizedTree.vue';
import CreateFolderDialog from '@/components/folder-virtualized-tree/CreateFolderDialog.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import MoveToDialog from '@/components/folder-virtualized-tree/MoveToDialog.vue';
import { SORT_MENU_CONFIG, SORT_TYPES, } from '@/components/folder-virtualized-tree/constant';
import { t } from '@/locales';
import { debounce } from 'lodash';
import { i18n_name } from '@/utils/common';
import { encode, mid, rebalance } from '@/utils/folder';
import folderApi from '@/api/workspace/folder';
import { EditionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { TreeToFlatten } from '@/utils/array';
import { MsgConfirm, MsgError, MsgSuccess } from '@/utils/message';
import permissionMap from '@/permission';
import useStore from '@/stores';
import bus from '@/bus';
const { folder, user } = useStore();
defineOptions({ name: 'FolderVirtualizedTree' });
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    currentNodeKey: {
        type: String,
        default: 'default',
    },
    source: {
        type: String,
        default: 'APPLICATION',
    },
    showShared: {
        type: Boolean,
        default: false,
    },
    shareTitle: {
        type: String,
        default: '',
    },
    canOperation: {
        type: Boolean,
        default: true,
    },
    treeStyle: {
        type: Object,
        default: () => ({}),
    },
    draggable: {
        type: Boolean,
        default: false,
    },
});
onBeforeRouteLeave((to, from) => {
    if (from?.name === 'ToolWorkflow')
        return;
    if (from?.name === 'AppSetting')
        return;
    folder.setCurrentFolder({});
});
const resourceType = computed(() => {
    if (props.source === 'APPLICATION') {
        return 'application';
    }
    else if (props.source === 'KNOWLEDGE') {
        return 'knowledge';
    }
    else if (props.source === 'MODEL') {
        return 'model';
    }
    else if (props.source === 'TOOL') {
        return 'tool';
    }
    else {
        return 'application';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap[resourceType.value]['workspace'];
});
const MoreFilledPermission = (node) => {
    return (permissionPrecise.value.folderCreate(node.id) ||
        permissionPrecise.value.folderEdit(node.id) ||
        permissionPrecise.value.folderDelete(node.id) ||
        permissionPrecise.value.folderAuth(node.id));
};
const emit = defineEmits(['handleNodeClick', 'refreshTree']);
const treeRef = ref();
const filterText = ref('');
const hoverNodeId = ref('');
const title = ref('');
const loading = ref(false);
watch(filterText, (val) => {
    let v = val;
    if (val) {
        v = val.trim();
    }
    treeRef.value.filter(v);
});
const filterNode = (data, value) => {
    if (!value)
        return true;
    return data.name.toLowerCase().includes(value.toLowerCase());
};
const handleDrop = (draggingNode, dropNode, dropType) => {
    const dragData = draggingNode.data;
    const dropData = dropNode.data;
    console.log(draggingNode, dropNode, dropType);
    const oldParentId = dragData.parent_id;
    let newParentId;
    if (dropType === 'inner') {
        newParentId = dropData.id;
    }
    else if (dropType === 'prev' || dropType === 'next') {
        newParentId = dropData.parent_id;
    }
    else {
        newParentId = dropData.parent_id;
    }
    const isCrossNode = oldParentId !== newParentId;
    if (isCrossNode) {
        const obj = {
            ...dragData,
            parent_id: newParentId,
        };
        folderApi
            .putFolder(dragData.id, props.source, obj, loading)
            .then(() => {
            emit('refreshTree');
            MsgSuccess(t('common.saveSuccess'));
        })
            .catch(() => {
            emit('refreshTree');
        });
    }
    else {
        // SiblingDrag，DirectPlace
        sortAfterDrop(dragData, dropData, dropType, newParentId);
    }
};
const savePositions = debounce(doSave, 300);
function sortAfterDrop(draggingNodeData, dropNodeData, dropType, newParentId) {
    const sortMethod = localStorage.getItem(FOLDER_SORT_TYPE);
    currentSort.value = sortMethod;
    if (sortMethod === SORT_TYPES.CUSTOM) {
        const positions = getPositions(newParentId);
        let prevPos;
        let nextPos;
        if (dropType === 'inner') {
            const childrenPositions = Object.values(positions);
            if (childrenPositions.length === 0) {
                positions[draggingNodeData.id] = encode(1, 0);
                savePositions(newParentId, positions);
                return;
            }
            // Put inLast
            const maxPos = Math.max(...childrenPositions);
            positions[draggingNodeData.id] = maxPos + encode(1, 0);
            savePositions(newParentId, positions);
        }
        else if (dropType === 'before') {
            const { dropPos, sortedNodes, dropIndex } = getSortContext(positions, dropNodeData.id);
            const prevNode = sortedNodes[dropIndex - 1];
            prevPos = prevNode ? prevNode[1] : 0;
            nextPos = dropPos;
            const newPos = mid(prevPos, nextPos);
            if (newPos === null) {
                // rebalance
                rebalanceAndInsert(newParentId, draggingNodeData.id, dropNodeData.id, 'before');
                return;
            }
            positions[draggingNodeData.id] = newPos;
            savePositions(newParentId, positions);
        }
        else if (dropType === 'after') {
            const { dropPos, sortedNodes, dropIndex } = getSortContext(positions, dropNodeData.id);
            const nextNode = sortedNodes[dropIndex + 1];
            prevPos = dropPos;
            nextPos = nextNode ? nextNode[1] : Infinity;
            if (nextPos === Infinity) {
                positions[draggingNodeData.id] = prevPos + encode(1, 0);
            }
            else {
                const newPos = mid(prevPos, nextPos);
                if (newPos === null) {
                    rebalanceAndInsert(newParentId, draggingNodeData.id, dropNodeData.id, 'after');
                    return;
                }
                positions[draggingNodeData.id] = newPos;
            }
            savePositions(newParentId, positions);
        }
    }
    else {
        emit('refreshTree');
    }
}
function rebalanceAndInsert(parentId, dragNodeId, dropNodeId, position) {
    const positions = getPositions(parentId);
    const sortedIds = Object.entries(positions)
        .sort((a, b) => a[1] - b[1])
        .map(([id]) => id);
    const dragIndex = sortedIds.indexOf(dragNodeId);
    if (dragIndex > -1) {
        sortedIds.splice(dragIndex, 1);
    }
    const dropIndex = sortedIds.indexOf(dropNodeId);
    if (position === 'before') {
        sortedIds.splice(dropIndex, 0, dragNodeId);
    }
    else {
        sortedIds.splice(dropIndex + 1, 0, dragNodeId);
    }
    const tempPositions = {};
    sortedIds.forEach((id, index) => {
        tempPositions[id] = index;
    });
    const newPositions = rebalance(tempPositions);
    savePositionsInit(parentId, newPositions);
    // rebalance finish
}
function getSortContext(positions, nodeId) {
    const dropPos = positions[nodeId];
    const sortedNodes = Object.entries(positions).sort((a, b) => a[1] - b[1]);
    const dropIndex = sortedNodes.findIndex(([id]) => id === nodeId);
    return { dropPos, sortedNodes, dropIndex };
}
const isDropdownOpen = ref(false);
let time;
function handleMouseEnter(data) {
    clearTimeout(time);
    hoverNodeId.value = data.id;
}
function handleMouseleave() {
    if (isDropdownOpen.value)
        return;
    time = setTimeout(() => {
        clearTimeout(time);
        document.body.click();
    }, 300);
}
const onDropdownVisibleChange = (visible) => {
    isDropdownOpen.value = visible;
};
const handleSharedNodeClick = () => {
    emit('handleNodeClick', { id: 'share', name: props.shareTitle });
};
const handleNodeClick = (node) => {
    emit('handleNodeClick', node);
};
// DeletionFolder
function deleteFolder(row) {
    MsgConfirm(`${t('common.deleteConfirm')}：${row.name}`, t('components.folder.deleteConfirmMessage'), {
        confirmButtonText: t('common.delete'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        folderApi.delFolder(row.id, props.source, loading).then(() => {
            const prevFolder = TreeToFlatten(props.data).find((item) => item.id === row.parent_id);
            folder.setCurrentFolder(prevFolder);
            if (currentSort.value === SORT_TYPES.CUSTOM) {
                const parentId = row.parent_id || 'default';
                const positions = getPositions(parentId);
                if (positions[row.id] !== undefined) {
                    delete positions[row.id];
                    savePositionsInit(parentId, positions);
                }
            }
            emit('refreshTree');
        });
    })
        .catch(() => { });
}
// CreationFolder
const CreateFolderDialogRef = ref();
function openCreateFolder(row) {
    title.value = t('components.folder.addChildFolder');
    CreateFolderDialogRef.value.open(props.source, row.id);
}
function openEditFolder(row) {
    title.value = t('components.folder.editFolder');
    CreateFolderDialogRef.value.open(props.source, row.id, row);
}
// Authorization
const currentNode = ref(null);
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(data) {
    currentNode.value = data;
    ResourceAuthorizationDrawerRef.value.open(data.id, data);
}
// Move to
const MoveToDialogRef = ref();
function openMoveToDialog(data) {
    const obj = {
        id: data.id,
        folder_type: props.source,
    };
    MoveToDialogRef.value.open(obj, true);
}
// Sort
const sortIconName = computed(() => {
    const sort = currentSort.value;
    if (sort.endsWith('asc')) {
        return 'app-folder-asc';
    }
    if (sort.endsWith('desc')) {
        return 'app-folder-desc';
    }
    return 'app-folder-custom';
});
const currentSort = ref(SORT_TYPES.CREATE_TIME_DESC);
const CUSTOM_STORAGE_KEY = `${user.userInfo?.id}-${user.getWorkspaceId()}-${props.source}-folder-custom-positions`;
const FOLDER_SORT_TYPE = `${user.userInfo?.id}-${user.getWorkspaceId()}-${props.source}-folder-sort-type`;
const dataWithOrder = computed(() => {
    if (currentSort.value !== SORT_TYPES.CUSTOM || !props.data?.length) {
        return props.data;
    }
    const rootNode = props.data[0];
    return [
        {
            ...rootNode,
            children: rootNode.children ? addOrderToTree(rootNode.children, rootNode.id) : [],
        },
    ];
});
const sortedData = computed(() => {
    const treeData = dataWithOrder.value;
    const sortMethods = {
        [SORT_TYPES.CREATE_TIME_ASC]: (a, b) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime(),
        [SORT_TYPES.CREATE_TIME_DESC]: (a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime(),
        [SORT_TYPES.NAME_ASC]: (a, b) => a.name.localeCompare(b.name),
        [SORT_TYPES.NAME_DESC]: (a, b) => b.name.localeCompare(a.name),
        [SORT_TYPES.CUSTOM]: (a, b) => a.order - b.order,
    };
    const compareFn = sortMethods[currentSort.value];
    if (!treeData || !compareFn) {
        return treeData;
    }
    return sortTreeData(treeData, compareFn);
});
// Recursively sort original data
function sortTreeData(nodes, compareFn) {
    if (!compareFn || nodes.length === 0 || !nodes) {
        return nodes;
    }
    const sortedNodes = [...nodes].sort(compareFn);
    return sortedNodes.map((node) => ({
        ...node,
        children: node.children && node.children.length > 0
            ? sortTreeData(node.children, compareFn)
            : node.children,
    }));
}
function switchSortMethod(method) {
    currentSort.value = method;
    localStorage.setItem(FOLDER_SORT_TYPE, method);
    if (method === SORT_TYPES.CUSTOM) {
        const rootNode = props.data?.[0];
        if (rootNode) {
            const folderPositions = getPositions(rootNode.id);
            if (Object.keys(folderPositions).length === 0) {
                if (rootNode.children?.length > 0) {
                    initAllPositions(rootNode.id, rootNode.children);
                }
            }
        }
    }
}
function initAllPositions(parentId, children) {
    const allPositions = collectAllPositions(parentId, children);
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(allPositions));
}
function collectAllPositions(parentId, children) {
    const allPositions = {};
    if (!children || children.length === 0) {
        return allPositions;
    }
    const positions = {};
    children.forEach((child, index) => {
        positions[child.id] = encode(index + 1, 0);
        if (child.children && child.children.length > 0) {
            const childPositions = collectAllPositions(child.id, child.children);
            Object.assign(allPositions, childPositions);
        }
    });
    allPositions[parentId] = positions;
    return allPositions;
}
function addOrderToTree(nodes, parentId) {
    if (!nodes || nodes.length === 0) {
        return nodes;
    }
    const positions = getPositions(parentId);
    let needSave = false;
    nodes.forEach((node) => {
        if (positions[node.id] === undefined) {
            const existingPositions = Object.values(positions);
            const maxPos = existingPositions.length > 0 ? Math.max(...existingPositions) : 0;
            positions[node.id] = maxPos + encode(1, 0);
            needSave = true;
        }
    });
    if (needSave) {
        savePositionsInit(parentId, positions);
    }
    return nodes.map((node) => ({
        ...node,
        order: positions[node.id] ?? Infinity,
        children: node.children && node.children.length > 0
            ? addOrderToTree(node.children, node.id)
            : node.children,
    }));
}
// Get specified parent node position data
function getPositions(parentId) {
    try {
        const data = localStorage.getItem(CUSTOM_STORAGE_KEY);
        const allNodesData = data ? JSON.parse(data) : {};
        return allNodesData[parentId] || {};
    }
    catch (error) {
        MsgError(error);
        return {};
    }
}
function savePositionsInit(parentId, positions) {
    doSave(parentId, positions);
}
function doSave(parentId, positions) {
    try {
        const data = localStorage.getItem(CUSTOM_STORAGE_KEY);
        const allNodesData = data ? JSON.parse(data) : {};
        allNodesData[parentId] = positions;
        localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(allNodesData));
    }
    catch (error) {
        MsgError(error);
    }
}
function refreshFolder() {
    emit('refreshTree');
}
function loadSortPreference() {
    const savedSort = localStorage.getItem(FOLDER_SORT_TYPE);
    if (savedSort) {
        currentSort.value = savedSort;
    }
}
const __VLS_exposed = {};
defineExpose(__VLS_exposed);
onMounted(() => {
    bus.on('select_node', (id) => {
        hoverNodeId.value = id;
    });
    loadSortPreference();
});
onUnmounted(() => { });
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
    ...{ class: "folder-tree" },
});
/** @type {__VLS_StyleScopedClasses['folder-tree']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex p-16 pb-0 folder-tree__search" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['folder-tree__search']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    ...{ 'onCommand': {} },
    trigger: "click",
    teleported: (false),
}));
const __VLS_7 = __VLS_6({
    ...{ 'onCommand': {} },
    trigger: "click",
    teleported: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
let __VLS_10;
const __VLS_11 = {
    /** @type {typeof __VLS_10.command} */
    onCommand: (__VLS_ctx.switchSortMethod),
};
const { default: __VLS_12 } = __VLS_8.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ class: "ml-8" },
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "ml-8" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    iconName: (__VLS_ctx.sortIconName),
}));
const __VLS_21 = __VLS_20({
    iconName: (__VLS_ctx.sortIconName),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[filterText, $t, switchSortMethod, sortIconName,];
var __VLS_16;
{
    const { dropdown: __VLS_24 } = __VLS_8.slots;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ style: {} },
    }));
    const __VLS_27 = __VLS_26({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const { default: __VLS_30 } = __VLS_28.slots;
    for (const [group, index] of __VLS_vFor((__VLS_ctx.SORT_MENU_CONFIG))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        for (const [obj] of __VLS_vFor((group.items))) {
            let __VLS_31;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
                key: (obj.value),
                command: (obj.value),
                ...{ class: (`${__VLS_ctx.currentSort === obj.value ? 'active' : ''} flex-between`) },
            }));
            const __VLS_33 = __VLS_32({
                key: (obj.value),
                command: (obj.value),
                ...{ class: (`${__VLS_ctx.currentSort === obj.value ? 'active' : ''} flex-between`) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_32));
            const { default: __VLS_36 } = __VLS_34.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (obj.label);
            if (__VLS_ctx.currentSort === obj.value) {
                let __VLS_37;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
                    ...{ class: "ml-4" },
                }));
                const __VLS_39 = __VLS_38({
                    ...{ class: "ml-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_38));
                /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                const { default: __VLS_42 } = __VLS_40.slots;
                let __VLS_43;
                /** @ts-ignore @type { | typeof __VLS_components.Check} */
                Check;
                // @ts-ignore
                const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
                const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
                // @ts-ignore
                [SORT_MENU_CONFIG, currentSort, currentSort,];
                var __VLS_40;
            }
            // @ts-ignore
            [];
            var __VLS_34;
            // @ts-ignore
            [];
        }
        if (index < __VLS_ctx.SORT_MENU_CONFIG.length - 1) {
            let __VLS_48;
            /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
            elDivider;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
                ...{ class: "mb-4 mt-4" },
            }));
            const __VLS_50 = __VLS_49({
                ...{ class: "mb-4 mt-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        }
        // @ts-ignore
        [SORT_MENU_CONFIG,];
    }
    // @ts-ignore
    [];
    var __VLS_28;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_8;
var __VLS_9;
if (__VLS_ctx.showShared && __VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8 pb-0" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "border-b pt-0 pb-0" },
    });
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.handleSharedNodeClick) },
        ...{ class: "shared-button flex cursor border-r-6" },
        ...{ class: (__VLS_ctx.currentNodeKey === 'share' && 'active') },
    });
    /** @type {__VLS_StyleScopedClasses['shared-button']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        iconName: "app-shared-active",
        ...{ style: {} },
        ...{ class: "color-primary" },
    }));
    const __VLS_55 = __VLS_54({
        iconName: "app-shared-active",
        ...{ style: {} },
        ...{ class: "color-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    (__VLS_ctx.shareTitle);
}
const __VLS_58 = VirtualizedTree || VirtualizedTree;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    ...{ 'onNodeDrop': {} },
    ...{ 'onHandleNodeClick': {} },
    ref: "treeRef",
    ...{ class: "folder-tree__main" },
    modelValue: (__VLS_ctx.sortedData),
    ...{ class: (__VLS_ctx.showShared && __VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR') ? 'tree-height-shared' : 'tree-height') },
    currentNodeKey: (__VLS_ctx.currentNodeKey),
    filterNodeMethod: (__VLS_ctx.filterNode),
    draggable: (__VLS_ctx.draggable),
    ...{ style: (__VLS_ctx.treeStyle) },
}));
const __VLS_60 = __VLS_59({
    ...{ 'onNodeDrop': {} },
    ...{ 'onHandleNodeClick': {} },
    ref: "treeRef",
    ...{ class: "folder-tree__main" },
    modelValue: (__VLS_ctx.sortedData),
    ...{ class: (__VLS_ctx.showShared && __VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR') ? 'tree-height-shared' : 'tree-height') },
    currentNodeKey: (__VLS_ctx.currentNodeKey),
    filterNodeMethod: (__VLS_ctx.filterNode),
    draggable: (__VLS_ctx.draggable),
    ...{ style: (__VLS_ctx.treeStyle) },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_63;
const __VLS_64 = {
    /** @type {typeof __VLS_63.nodeDrop} */
    onNodeDrop: (__VLS_ctx.handleDrop),
};
const __VLS_65 = {
    /** @type {typeof __VLS_63.handleNodeClick} */
    onHandleNodeClick: (__VLS_ctx.handleNodeClick),
};
var __VLS_66;
/** @type {__VLS_StyleScopedClasses['folder-tree__main']} */ ;
const { default: __VLS_68 } = __VLS_61.slots;
{
    const { default: __VLS_69 } = __VLS_61.slots;
    const [{ node, stat }] = __VLS_vSlot(__VLS_69);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseenter: (...[$event]) => {
                return __VLS_ctx.handleMouseEnter(node);
                // @ts-ignore
                [showShared, showShared, hasPermission, hasPermission, EditionConst, EditionConst, handleSharedNodeClick, currentNodeKey, currentNodeKey, shareTitle, sortedData, filterNode, draggable, treeStyle, handleDrop, handleNodeClick, handleMouseEnter,];
            } },
        ...{ class: "flex align-center custom-tree-node" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['custom-tree-node']} */ ;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        iconName: "app-folder",
        ...{ style: {} },
    }));
    const __VLS_72 = __VLS_71({
        iconName: "app-folder",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "tree-label ml-8 lighter" },
        title: (node.name),
    });
    /** @type {__VLS_StyleScopedClasses['tree-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.i18n_name(node.name));
    if (__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node) && __VLS_ctx.hoverNodeId === node.id) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node) && __VLS_ctx.hoverNodeId === node.id))
                        throw 0;
                    return __VLS_ctx.handleMouseEnter(node);
                    // @ts-ignore
                    [handleMouseEnter, i18n_name, canOperation, MoreFilledPermission, hoverNodeId,];
                } },
            ...{ onMouseleave: (__VLS_ctx.handleMouseleave) },
            ...{ class: "mr-8 tree-operation-button" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['tree-operation-button']} */ ;
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            ...{ 'onVisibleChange': {} },
            trigger: "click",
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onVisibleChange': {} },
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_80;
        const __VLS_81 = {
            /** @type {typeof __VLS_80.visibleChange} */
            onVisibleChange: (__VLS_ctx.onDropdownVisibleChange),
        };
        const { default: __VLS_82 } = __VLS_78.slots;
        if (__VLS_ctx.MoreFilledPermission(node)) {
            let __VLS_83;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                text: true,
                ...{ class: "w-full" },
            }));
            const __VLS_85 = __VLS_84({
                text: true,
                ...{ class: "w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            const { default: __VLS_88 } = __VLS_86.slots;
            let __VLS_89;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
                iconName: "app-more",
            }));
            const __VLS_91 = __VLS_90({
                iconName: "app-more",
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
            // @ts-ignore
            [MoreFilledPermission, handleMouseleave, onDropdownVisibleChange,];
            var __VLS_86;
        }
        {
            const { dropdown: __VLS_94 } = __VLS_78.slots;
            let __VLS_95;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({}));
            const __VLS_97 = __VLS_96({}, ...__VLS_functionalComponentArgsRest(__VLS_96));
            const { default: __VLS_100 } = __VLS_98.slots;
            if (__VLS_ctx.permissionPrecise.folderCreate(node.id)) {
                let __VLS_101;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
                    ...{ 'onClick': {} },
                }));
                const __VLS_103 = __VLS_102({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_102));
                let __VLS_106;
                const __VLS_107 = {
                    /** @type {typeof __VLS_106.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node) && __VLS_ctx.hoverNodeId === node.id))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderCreate(node.id)))
                            throw 0;
                        return __VLS_ctx.openCreateFolder(node);
                        // @ts-ignore
                        [permissionPrecise, openCreateFolder,];
                    },
                };
                const { default: __VLS_108 } = __VLS_104.slots;
                let __VLS_109;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
                    iconName: "app-add-folder",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_111 = __VLS_110({
                    iconName: "app-add-folder",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_110));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('components.folder.addChildFolder'));
                // @ts-ignore
                [$t,];
                var __VLS_104;
                var __VLS_105;
            }
            if (__VLS_ctx.permissionPrecise.folderEdit(node.id)) {
                let __VLS_114;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
                    ...{ 'onClick': {} },
                }));
                const __VLS_116 = __VLS_115({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_115));
                let __VLS_119;
                const __VLS_120 = {
                    /** @type {typeof __VLS_119.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node) && __VLS_ctx.hoverNodeId === node.id))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderEdit(node.id)))
                            throw 0;
                        return __VLS_ctx.openEditFolder(node);
                        // @ts-ignore
                        [permissionPrecise, openEditFolder,];
                    },
                };
                const { default: __VLS_121 } = __VLS_117.slots;
                let __VLS_122;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_124 = __VLS_123({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_123));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.edit'));
                // @ts-ignore
                [$t,];
                var __VLS_117;
                var __VLS_118;
            }
            if (node.level !== 1 && __VLS_ctx.permissionPrecise.folderEdit(node.id)) {
                let __VLS_127;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
                    ...{ 'onClick': {} },
                }));
                const __VLS_129 = __VLS_128({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_128));
                let __VLS_132;
                const __VLS_133 = {
                    /** @type {typeof __VLS_132.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node) && __VLS_ctx.hoverNodeId === node.id))
                            throw 0;
                        if (!(node.level !== 1 && __VLS_ctx.permissionPrecise.folderEdit(node.id)))
                            throw 0;
                        return __VLS_ctx.openMoveToDialog(node);
                        // @ts-ignore
                        [permissionPrecise, openMoveToDialog,];
                    },
                };
                const { default: __VLS_134 } = __VLS_130.slots;
                let __VLS_135;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
                    iconName: "app-migrate",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_137 = __VLS_136({
                    iconName: "app-migrate",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_136));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.moveTo'));
                // @ts-ignore
                [$t,];
                var __VLS_130;
                var __VLS_131;
            }
            if (__VLS_ctx.permissionPrecise.folderAuth(node.id)) {
                let __VLS_140;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
                    ...{ 'onClick': {} },
                }));
                const __VLS_142 = __VLS_141({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_141));
                let __VLS_145;
                const __VLS_146 = {
                    /** @type {typeof __VLS_145.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node) && __VLS_ctx.hoverNodeId === node.id))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderAuth(node.id)))
                            throw 0;
                        return __VLS_ctx.openAuthorization(node);
                        // @ts-ignore
                        [permissionPrecise, openAuthorization,];
                    },
                };
                const { default: __VLS_147 } = __VLS_143.slots;
                let __VLS_148;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_150 = __VLS_149({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_149));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                // @ts-ignore
                [$t,];
                var __VLS_143;
                var __VLS_144;
            }
            if (__VLS_ctx.permissionPrecise.folderDelete(node.id)) {
                let __VLS_153;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (!node.parent_id),
                }));
                const __VLS_155 = __VLS_154({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (!node.parent_id),
                }, ...__VLS_functionalComponentArgsRest(__VLS_154));
                let __VLS_158;
                const __VLS_159 = {
                    /** @type {typeof __VLS_158.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node) && __VLS_ctx.hoverNodeId === node.id))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderDelete(node.id)))
                            throw 0;
                        return __VLS_ctx.deleteFolder(node);
                        // @ts-ignore
                        [permissionPrecise, deleteFolder,];
                    },
                };
                const { default: __VLS_160 } = __VLS_156.slots;
                let __VLS_161;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_163 = __VLS_162({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_162));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_156;
                var __VLS_157;
            }
            // @ts-ignore
            [];
            var __VLS_98;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_78;
        var __VLS_79;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_61;
var __VLS_62;
const __VLS_166 = CreateFolderDialog;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    ...{ 'onRefresh': {} },
    ref: "CreateFolderDialogRef",
    title: (__VLS_ctx.title),
}));
const __VLS_168 = __VLS_167({
    ...{ 'onRefresh': {} },
    ref: "CreateFolderDialogRef",
    title: (__VLS_ctx.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
let __VLS_171;
const __VLS_172 = {
    /** @type {typeof __VLS_171.refresh} */
    onRefresh: (__VLS_ctx.refreshFolder),
};
var __VLS_173;
var __VLS_169;
var __VLS_170;
const __VLS_175 = MoveToDialog;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    ...{ 'onRefresh': {} },
    ref: "MoveToDialogRef",
    source: (props.source),
}));
const __VLS_177 = __VLS_176({
    ...{ 'onRefresh': {} },
    ref: "MoveToDialogRef",
    source: (props.source),
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
let __VLS_180;
const __VLS_181 = {
    /** @type {typeof __VLS_180.refresh} */
    onRefresh: (...[$event]) => {
        return __VLS_ctx.emit('refreshTree');
        // @ts-ignore
        [title, refreshFolder, emit,];
    },
};
var __VLS_182;
var __VLS_178;
var __VLS_179;
const __VLS_184 = ResourceAuthorizationDrawer;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
    type: (`${props.source}_FOLDER`),
    isFolder: (true),
    isRootFolder: (!__VLS_ctx.currentNode?.parent_id),
    ref: "ResourceAuthorizationDrawerRef",
}));
const __VLS_186 = __VLS_185({
    type: (`${props.source}_FOLDER`),
    isFolder: (true),
    isRootFolder: (!__VLS_ctx.currentNode?.parent_id),
    ref: "ResourceAuthorizationDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_189;
var __VLS_187;
// @ts-ignore
var __VLS_67 = __VLS_66, __VLS_174 = __VLS_173, __VLS_183 = __VLS_182, __VLS_190 = __VLS_189;
// @ts-ignore
[currentNode,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        currentNodeKey: {
            type: String,
            default: 'default',
        },
        source: {
            type: String,
            default: 'APPLICATION',
        },
        showShared: {
            type: Boolean,
            default: false,
        },
        shareTitle: {
            type: String,
            default: '',
        },
        canOperation: {
            type: Boolean,
            default: true,
        },
        treeStyle: {
            type: Object,
            default: () => ({}),
        },
        draggable: {
            type: Boolean,
            default: false,
        },
    },
});
export default {};
