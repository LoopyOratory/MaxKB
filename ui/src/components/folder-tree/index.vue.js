/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import CreateFolderDialog from '@/components/folder-tree/CreateFolderDialog.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import { t } from '@/locales';
import MoveToDialog from '@/components/folder-tree/MoveToDialog.vue';
import { i18n_name } from '@/utils/common';
import { SORT_MENU_CONFIG, SORT_TYPES } from '@/components/folder-tree/constant';
import { debounce } from 'lodash-es';
import { encode, mid, rebalance } from '@/utils/folder';
import folderApi from '@/api/workspace/folder';
import { EditionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import useStore from '@/stores';
import { TreeToFlatten } from '@/utils/array';
import { MsgConfirm, MsgError, MsgSuccess } from '@/utils/message';
import permissionMap from '@/permission';
import bus from '@/bus';
const { folder, user } = useStore();
defineOptions({ name: 'FolderTree' });
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
const MoreFilledPermission = (node, data) => {
    return (permissionPrecise.value.folderCreate(data.id) ||
        permissionPrecise.value.folderEdit(data.id) ||
        permissionPrecise.value.folderDelete(data.id) ||
        permissionPrecise.value.folderAuth(data.id));
};
const MoveToDialogRef = ref();
function openMoveToDialog(data) {
    const obj = {
        id: data.id,
        folder_type: props.source,
    };
    MoveToDialogRef.value.open(obj, true);
}
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
const savePositions = debounce(doSave, 300);
function savePositionsInit(parentId, positions) {
    doSave(parentId, positions);
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
function initAllPositions(parentId, children) {
    const allPositions = collectAllPositions(parentId, children);
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(allPositions));
}
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
const allowDrag = (node) => {
    return permissionPrecise.value.folderEdit(node.data.id);
};
const allowDrop = (draggingNode, dropNode, type) => {
    const dropData = dropNode.data;
    if (type === 'inner') {
        return permissionPrecise.value.folderEdit(dropData.id);
    }
    else if ((type === 'prev' || type === 'next') && currentSort.value === SORT_TYPES.CUSTOM) {
        if (!dropData.parent_id) {
            return false;
        }
        else {
            return permissionPrecise.value.folderEdit(dropData.parent_id);
        }
    }
    return false;
};
const handleDrop = (draggingNode, dropNode, dropType, ev) => {
    const dragData = draggingNode.data;
    const dropData = dropNode.data;
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
function getSortContext(positions, nodeId) {
    const dropPos = positions[nodeId];
    const sortedNodes = Object.entries(positions).sort((a, b) => a[1] - b[1]);
    const dropIndex = sortedNodes.findIndex(([id]) => id === nodeId);
    return { dropPos, sortedNodes, dropIndex };
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
onBeforeRouteLeave((to, from) => {
    if (from?.name === 'ToolWorkflow')
        return;
    if (from?.name === 'AppSetting')
        return;
    folder.setCurrentFolder({});
});
function loadSortPreference() {
    const savedSort = localStorage.getItem(FOLDER_SORT_TYPE);
    if (savedSort) {
        currentSort.value = savedSort;
    }
}
onMounted(() => {
    bus.on('select_node', (id) => {
        treeRef.value?.setCurrentKey(id);
        hoverNodeId.value = id;
    });
    loadSortPreference();
});
const defaultProps = {
    children: 'children',
    label: 'name',
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
const filterNode = (value, data) => {
    if (!value)
        return true;
    return data.name.toLowerCase().includes(value.toLowerCase());
};
let time;
function handleMouseEnter(data) {
    clearTimeout(time);
    hoverNodeId.value = data.id;
}
function handleMouseleave() {
    time = setTimeout(() => {
        clearTimeout(time);
        document.body.click();
    }, 300);
}
const handleNodeClick = (data) => {
    emit('handleNodeClick', data);
};
const handleSharedNodeClick = () => {
    treeRef.value?.setCurrentKey(undefined);
    emit('handleNodeClick', { id: 'share', name: props.shareTitle });
};
function deleteFolder(row) {
    MsgConfirm(`${t('common.deleteConfirm')}：${row.name}`, t('components.folder.deleteConfirmMessage'), {
        confirmButtonText: t('common.delete'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        folderApi.delFolder(row.id, props.source, loading).then(() => {
            treeRef.value?.setCurrentKey(row.parent_id || 'default');
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
const CreateFolderDialogRef = ref();
function openCreateFolder(row) {
    title.value = t('components.folder.addChildFolder');
    CreateFolderDialogRef.value.open(props.source, row.id);
}
function openEditFolder(row) {
    title.value = t('components.folder.editFolder');
    CreateFolderDialogRef.value.open(props.source, row.id, row);
}
const currentNode = ref(null);
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(data) {
    currentNode.value = data;
    ResourceAuthorizationDrawerRef.value.open(data.id, data);
}
function refreshFolder() {
    emit('refreshTree');
}
function clearCurrentKey() {
    treeRef.value?.setCurrentKey(undefined);
}
const __VLS_exposed = {
    clearCurrentKey,
};
defineExpose(__VLS_exposed);
onUnmounted(() => {
    treeRef.value?.setCurrentKey(undefined);
});
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
/** @type {__VLS_StyleScopedClasses['el-tree-node']} */ ;
/** @type {__VLS_StyleScopedClasses['el-tree-node__content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "folder-tree" },
});
/** @type {__VLS_StyleScopedClasses['folder-tree']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex ml-4 p-8 pb-0" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
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
        ...{ class: "border-b" },
    });
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
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
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({}));
const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree'] | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree']} */
elTree;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    ...{ 'onNodeClick': {} },
    ...{ 'onNodeDrop': {} },
    ...{ class: "folder-tree__main p-8" },
    ...{ class: (__VLS_ctx.showShared && __VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')
            ? 'tree-height-shared'
            : 'tree-height') },
    ...{ style: (__VLS_ctx.treeStyle) },
    ref: "treeRef",
    data: (__VLS_ctx.sortedData),
    props: (__VLS_ctx.defaultProps),
    filterNodeMethod: (__VLS_ctx.filterNode),
    defaultExpandedKeys: ([__VLS_ctx.currentNodeKey]),
    currentNodeKey: (__VLS_ctx.currentNodeKey),
    highlightCurrent: true,
    draggable: (__VLS_ctx.draggable),
    allowDrop: (__VLS_ctx.allowDrop),
    allowDrag: (__VLS_ctx.allowDrag),
    nodeKey: "id",
}));
const __VLS_66 = __VLS_65({
    ...{ 'onNodeClick': {} },
    ...{ 'onNodeDrop': {} },
    ...{ class: "folder-tree__main p-8" },
    ...{ class: (__VLS_ctx.showShared && __VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')
            ? 'tree-height-shared'
            : 'tree-height') },
    ...{ style: (__VLS_ctx.treeStyle) },
    ref: "treeRef",
    data: (__VLS_ctx.sortedData),
    props: (__VLS_ctx.defaultProps),
    filterNodeMethod: (__VLS_ctx.filterNode),
    defaultExpandedKeys: ([__VLS_ctx.currentNodeKey]),
    currentNodeKey: (__VLS_ctx.currentNodeKey),
    highlightCurrent: true,
    draggable: (__VLS_ctx.draggable),
    allowDrop: (__VLS_ctx.allowDrop),
    allowDrag: (__VLS_ctx.allowDrag),
    nodeKey: "id",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
(__VLS_ctx.$attrs);
let __VLS_69;
const __VLS_70 = {
    /** @type {typeof __VLS_69.nodeClick} */
    onNodeClick: (__VLS_ctx.handleNodeClick),
};
const __VLS_71 = {
    /** @type {typeof __VLS_69.nodeDrop} */
    onNodeDrop: (__VLS_ctx.handleDrop),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_72;
/** @type {__VLS_StyleScopedClasses['folder-tree__main']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
const { default: __VLS_74 } = __VLS_67.slots;
{
    const { default: __VLS_75 } = __VLS_67.slots;
    const [{ node, data }] = __VLS_vSlot(__VLS_75);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseenter: (...[$event]) => {
                return __VLS_ctx.handleMouseEnter(data);
                // @ts-ignore
                [showShared, showShared, hasPermission, hasPermission, EditionConst, EditionConst, handleSharedNodeClick, currentNodeKey, currentNodeKey, currentNodeKey, shareTitle, treeStyle, sortedData, defaultProps, filterNode, draggable, allowDrop, allowDrag, $attrs, handleNodeClick, handleDrop, vLoading, loading, handleMouseEnter,];
            } },
        ...{ class: "flex align-center w-full custom-tree-node" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['custom-tree-node']} */ ;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        iconName: "app-folder",
        ...{ style: {} },
    }));
    const __VLS_78 = __VLS_77({
        iconName: "app-folder",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "tree-label ml-8" },
        title: (node.label),
    });
    /** @type {__VLS_StyleScopedClasses['tree-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    (__VLS_ctx.i18n_name(node.label));
    if (__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node, data)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node, data)))
                        throw 0;
                    return __VLS_ctx.handleMouseEnter(data);
                    // @ts-ignore
                    [handleMouseEnter, i18n_name, canOperation, MoreFilledPermission,];
                } },
            ...{ onMouseleave: (__VLS_ctx.handleMouseleave) },
            ...{ class: "mr-8 tree-operation-button" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.hoverNodeId === data.id) }, null, null);
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['tree-operation-button']} */ ;
        let __VLS_81;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
            trigger: "click",
            teleported: (false),
        }));
        const __VLS_83 = __VLS_82({
            trigger: "click",
            teleported: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        const { default: __VLS_86 } = __VLS_84.slots;
        if (__VLS_ctx.MoreFilledPermission(node, data)) {
            let __VLS_87;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
                text: true,
                ...{ class: "w-full" },
            }));
            const __VLS_89 = __VLS_88({
                text: true,
                ...{ class: "w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_88));
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            const { default: __VLS_92 } = __VLS_90.slots;
            let __VLS_93;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
                iconName: "app-more",
            }));
            const __VLS_95 = __VLS_94({
                iconName: "app-more",
            }, ...__VLS_functionalComponentArgsRest(__VLS_94));
            // @ts-ignore
            [MoreFilledPermission, handleMouseleave, hoverNodeId,];
            var __VLS_90;
        }
        {
            const { dropdown: __VLS_98 } = __VLS_84.slots;
            let __VLS_99;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({}));
            const __VLS_101 = __VLS_100({}, ...__VLS_functionalComponentArgsRest(__VLS_100));
            const { default: __VLS_104 } = __VLS_102.slots;
            if (__VLS_ctx.permissionPrecise.folderCreate(data.id)) {
                let __VLS_105;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
                    ...{ 'onClick': {} },
                }));
                const __VLS_107 = __VLS_106({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_106));
                let __VLS_110;
                const __VLS_111 = {
                    /** @type {typeof __VLS_110.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node, data)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderCreate(data.id)))
                            throw 0;
                        return __VLS_ctx.openCreateFolder(data);
                        // @ts-ignore
                        [permissionPrecise, openCreateFolder,];
                    },
                };
                const { default: __VLS_112 } = __VLS_108.slots;
                let __VLS_113;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
                    iconName: "app-add-folder",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_115 = __VLS_114({
                    iconName: "app-add-folder",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_114));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('components.folder.addChildFolder'));
                // @ts-ignore
                [$t,];
                var __VLS_108;
                var __VLS_109;
            }
            if (__VLS_ctx.permissionPrecise.folderEdit(data.id)) {
                let __VLS_118;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
                    ...{ 'onClick': {} },
                }));
                const __VLS_120 = __VLS_119({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_119));
                let __VLS_123;
                const __VLS_124 = {
                    /** @type {typeof __VLS_123.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node, data)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderEdit(data.id)))
                            throw 0;
                        return __VLS_ctx.openEditFolder(data);
                        // @ts-ignore
                        [permissionPrecise, openEditFolder,];
                    },
                };
                const { default: __VLS_125 } = __VLS_121.slots;
                let __VLS_126;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_128 = __VLS_127({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_127));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.edit'));
                // @ts-ignore
                [$t,];
                var __VLS_121;
                var __VLS_122;
            }
            if (node.level !== 1 && __VLS_ctx.permissionPrecise.folderEdit(data.id)) {
                let __VLS_131;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
                    ...{ 'onClick': {} },
                }));
                const __VLS_133 = __VLS_132({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_132));
                let __VLS_136;
                const __VLS_137 = {
                    /** @type {typeof __VLS_136.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node, data)))
                            throw 0;
                        if (!(node.level !== 1 && __VLS_ctx.permissionPrecise.folderEdit(data.id)))
                            throw 0;
                        return __VLS_ctx.openMoveToDialog(data);
                        // @ts-ignore
                        [permissionPrecise, openMoveToDialog,];
                    },
                };
                const { default: __VLS_138 } = __VLS_134.slots;
                let __VLS_139;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
                    iconName: "app-migrate",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_141 = __VLS_140({
                    iconName: "app-migrate",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_140));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.moveTo'));
                // @ts-ignore
                [$t,];
                var __VLS_134;
                var __VLS_135;
            }
            if (__VLS_ctx.permissionPrecise.folderAuth(data.id)) {
                let __VLS_144;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
                    ...{ 'onClick': {} },
                }));
                const __VLS_146 = __VLS_145({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_145));
                let __VLS_149;
                const __VLS_150 = {
                    /** @type {typeof __VLS_149.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node, data)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderAuth(data.id)))
                            throw 0;
                        return __VLS_ctx.openAuthorization(data);
                        // @ts-ignore
                        [permissionPrecise, openAuthorization,];
                    },
                };
                const { default: __VLS_151 } = __VLS_147.slots;
                let __VLS_152;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_154 = __VLS_153({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_153));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                // @ts-ignore
                [$t,];
                var __VLS_147;
                var __VLS_148;
            }
            if (__VLS_ctx.permissionPrecise.folderDelete(data.id)) {
                let __VLS_157;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (!data.parent_id),
                }));
                const __VLS_159 = __VLS_158({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (!data.parent_id),
                }, ...__VLS_functionalComponentArgsRest(__VLS_158));
                let __VLS_162;
                const __VLS_163 = {
                    /** @type {typeof __VLS_162.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.canOperation && __VLS_ctx.MoreFilledPermission(node, data)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.folderDelete(data.id)))
                            throw 0;
                        return __VLS_ctx.deleteFolder(data);
                        // @ts-ignore
                        [permissionPrecise, deleteFolder,];
                    },
                };
                const { default: __VLS_164 } = __VLS_160.slots;
                let __VLS_165;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_167 = __VLS_166({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_166));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_160;
                var __VLS_161;
            }
            // @ts-ignore
            [];
            var __VLS_102;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_84;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_67;
var __VLS_68;
// @ts-ignore
[];
var __VLS_61;
const __VLS_170 = CreateFolderDialog;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    ...{ 'onRefresh': {} },
    ref: "CreateFolderDialogRef",
    title: (__VLS_ctx.title),
}));
const __VLS_172 = __VLS_171({
    ...{ 'onRefresh': {} },
    ref: "CreateFolderDialogRef",
    title: (__VLS_ctx.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
let __VLS_175;
const __VLS_176 = {
    /** @type {typeof __VLS_175.refresh} */
    onRefresh: (__VLS_ctx.refreshFolder),
};
var __VLS_177;
var __VLS_173;
var __VLS_174;
const __VLS_179 = MoveToDialog;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    ...{ 'onRefresh': {} },
    ref: "MoveToDialogRef",
    source: (props.source),
}));
const __VLS_181 = __VLS_180({
    ...{ 'onRefresh': {} },
    ref: "MoveToDialogRef",
    source: (props.source),
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
let __VLS_184;
const __VLS_185 = {
    /** @type {typeof __VLS_184.refresh} */
    onRefresh: (...[$event]) => {
        return __VLS_ctx.emit('refreshTree');
        // @ts-ignore
        [title, refreshFolder, emit,];
    },
};
var __VLS_186;
var __VLS_182;
var __VLS_183;
const __VLS_188 = ResourceAuthorizationDrawer;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    type: (`${props.source}_FOLDER`),
    isFolder: (true),
    isRootFolder: (!__VLS_ctx.currentNode?.parent_id),
    ref: "ResourceAuthorizationDrawerRef",
}));
const __VLS_190 = __VLS_189({
    type: (`${props.source}_FOLDER`),
    isFolder: (true),
    isRootFolder: (!__VLS_ctx.currentNode?.parent_id),
    ref: "ResourceAuthorizationDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
var __VLS_193;
var __VLS_191;
// @ts-ignore
var __VLS_73 = __VLS_72, __VLS_178 = __VLS_177, __VLS_187 = __VLS_186, __VLS_194 = __VLS_193;
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
