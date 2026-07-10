/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import CreateTagDialog from './CreateTagDialog.vue';
import TaglinkedDocumentDialog from './TaglinkedDocumentDialog.vue';
import { MsgConfirm } from '@/utils/message.ts';
import { t } from '@/locales';
import EditTagDialog from '@/views/document/tag/EditTagDialog.vue';
import permissionMap from '@/permission';
const emit = defineEmits(['refresh', 'tag-changed']);
function notifyTagChanged() {
    emit('tag-changed');
}
function handleDialogRefresh() {
    getList();
    notifyTagChanged();
}
const route = useRoute();
const { params: { id, folderId }, // id is knowledgeID
 } = route;
const isShared = computed(() => {
    return folderId === 'share';
});
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
    return permissionMap['knowledge'][apiType.value];
});
const loading = ref(false);
const debugVisible = ref(false);
const filterText = ref('');
const tags = ref([]);
const currentMouseId = ref(null);
const pageNum = ref(1);
const pageSize = ref(20);
const tableMaxHeight = computed(() => `calc(100vh - 200px)`);
function cellMouseEnter(row, column) {
    if (column && column.property === 'key') {
        currentMouseId.value = row.id;
    }
}
function cellMouseLeave() {
    currentMouseId.value = null;
}
// 1) Still send full backend data tags Convert to“Flatten row”, each row with keyIndex
const tableData = computed(() => {
    const result = [];
    tags.value.forEach((tag) => {
        if (tag.values && tag.values.length > 0) {
            tag.values.forEach((value, index) => {
                result.push({
                    id: value.id,
                    key: tag.key,
                    value: value.value,
                    doc_count: value.doc_count,
                    keyIndex: index, // SameOne key Which row below
                });
            });
        }
    });
    return result;
});
// 2) Paginate by "key group": per page pageSize keys
const pagedGroups = computed(() => {
    const start = (pageNum.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});
// 5) Merge cells: only merge within current page; same key first row rowspan = count of this key in current page
const spanMethod = ({ row, columnIndex }) => {
    // Note: You currently have a selection column, so key column index is 1; adjust on-demand if also merging value columns
    if (columnIndex === 0 || columnIndex === 1) {
        const sameKeyItems = pagedGroups.value.filter((item) => item.key === row.key);
        const isFirstItem = sameKeyItems.length > 0 && sameKeyItems[0].id === row.id;
        if (isFirstItem) {
            return { rowspan: sameKeyItems.length, colspan: 1 };
        }
        return { rowspan: 0, colspan: 0 };
    }
};
const multipleSelection = ref([]);
const tableRef = ref(null);
const syncingSelection = ref(false);
const handleSelectionChange = async (val) => {
    if (syncingSelection.value)
        return;
    // CurrentSelected in  id Set (Used forDetermineWhich lines were justCancel）
    const selectedIds = new Set(val.map((r) => r.id));
    // Find rows that were just deselected
    const deselectedRows = multipleSelection.value.filter((r) => !selectedIds.has(r.id));
    if (deselectedRows.length === 0) {
        multipleSelection.value = val;
        return;
    }
    // CancelSelectWhen: same key GroupOther lines here are alsoCancel
    syncingSelection.value = true;
    await nextTick();
    for (const dr of deselectedRows) {
        const sameGroupRows = pagedGroups.value.filter((r) => r.key === dr.key);
        for (const r of sameGroupRows) {
            if (!selectedIds.has(r.id))
                continue;
            tableRef.value?.toggleRowSelection?.(r, false);
        }
    }
    await nextTick();
    syncingSelection.value = false;
    // Use table final state as standard to update cache (val passed in here may be expired)
    // Simplified: Re-derive from table selection (Element Plus has internal store, no need to expose via val + patch)
    multipleSelection.value = pagedGroups.value.filter((r) => tableRef.value?.getSelectionRows
        ? tableRef.value.getSelectionRows().some((s) => s.id === r.id)
        : selectedIds.has(r.id));
};
const createTagDialogRef = ref();
function openCreateTagDialog(row) {
    createTagDialogRef.value?.open(row);
}
function batchDelete() {
    MsgConfirm(t('views.document.tag.deleteConfirm'), t('views.document.tag.deleteTip'), {
        confirmButtonText: t('common.delete'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        const tagsToDelete = multipleSelection.value.map((item) => item.id);
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .delMulTag(id, tagsToDelete)
            .then(() => {
            getList();
            notifyTagChanged();
        });
    })
        .catch(() => { });
}
const editTagDialogRef = ref();
function editTagKey(row) {
    editTagDialogRef.value?.open(row, true);
}
function delTag(row) {
    MsgConfirm(t('views.document.tag.deleteConfirm') + row.key, t('views.document.tag.deleteTip'), {
        confirmButtonText: t('common.delete'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .delTag(id, row.id, 'key')
            .then(() => {
            getList();
            notifyTagChanged();
        });
    })
        .catch(() => { });
}
const taglinkedDocumentDialogRef = ref();
const openTagLinkedDocumentDialog = (row) => {
    taglinkedDocumentDialogRef.value?.open(row);
};
function editTagValue(row) {
    editTagDialogRef.value?.open(row, false);
}
function delTagValue(row) {
    MsgConfirm(t('views.document.tag.deleteConfirm') + row.value, t('views.document.tag.deleteTip'), {
        confirmButtonText: t('common.delete'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .delTag(id, row.id, 'one')
            .then(() => {
            getList();
            notifyTagChanged();
        });
    })
        .catch(() => { });
}
function getList() {
    const params = {
        ...(filterText.value && { name: filterText.value }),
    };
    loadSharedApi({ type: 'knowledge', systemType: apiType.value, isShared: isShared.value })
        .getTags(id, params, loading)
        .then((res) => {
        tags.value = res.data;
        pageNum.value = 1;
    });
}
const open = () => {
    filterText.value = '';
    debugVisible.value = true;
    pageNum.value = 1;
    getList();
};
const __VLS_exposed = {
    open,
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.document.tag.label'));
    // @ts-ignore
    [debugVisible, $t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.permissionPrecise.tag_create(__VLS_ctx.id)) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_12;
    const __VLS_13 = {
        /** @type {typeof __VLS_12.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.permissionPrecise.tag_create(__VLS_ctx.id)))
                throw 0;
            return __VLS_ctx.openCreateTagDialog();
            // @ts-ignore
            [permissionPrecise, id, openCreateTagDialog,];
        },
    };
    const { default: __VLS_14 } = __VLS_10.slots;
    (__VLS_ctx.$t('views.document.tag.create'));
    // @ts-ignore
    [$t,];
    var __VLS_10;
    var __VLS_11;
}
if (__VLS_ctx.permissionPrecise.tag_delete(__VLS_ctx.id)) {
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_17 = __VLS_16({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_20;
    const __VLS_21 = {
        /** @type {typeof __VLS_20.click} */
        onClick: (__VLS_ctx.batchDelete),
    };
    const { default: __VLS_22 } = __VLS_18.slots;
    (__VLS_ctx.$t('common.delete'));
    // @ts-ignore
    [$t, permissionPrecise, id, multipleSelection, batchDelete,];
    var __VLS_18;
    var __VLS_19;
}
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
    placeholder: (__VLS_ctx.$t('common.search')),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
    placeholder: (__VLS_ctx.$t('common.search')),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.change} */
    onChange: (__VLS_ctx.getList),
};
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
var __VLS_26;
var __VLS_27;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onSelectionChange': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ref: "tableRef",
    data: (__VLS_ctx.pagedGroups),
    spanMethod: (__VLS_ctx.spanMethod),
    maxHeight: (__VLS_ctx.tableMaxHeight),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onSelectionChange': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ref: "tableRef",
    data: (__VLS_ctx.pagedGroups),
    spanMethod: (__VLS_ctx.spanMethod),
    maxHeight: (__VLS_ctx.tableMaxHeight),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
const __VLS_37 = {
    /** @type {typeof __VLS_35.cellMouseEnter} */
    onCellMouseEnter: (__VLS_ctx.cellMouseEnter),
};
const __VLS_38 = {
    /** @type {typeof __VLS_35.cellMouseLeave} */
    onCellMouseLeave: (__VLS_ctx.cellMouseLeave),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_39;
const { default: __VLS_41 } = __VLS_33.slots;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    type: "selection",
    width: "55",
}));
const __VLS_44 = __VLS_43({
    type: "selection",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    prop: "key",
    label: (__VLS_ctx.$t('views.document.tag.key')),
}));
const __VLS_49 = __VLS_48({
    prop: "key",
    label: (__VLS_ctx.$t('views.document.tag.key')),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
{
    const { default: __VLS_53 } = __VLS_50.slots;
    const [{ row }] = __VLS_vSlot(__VLS_53);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    (row.key);
    if (__VLS_ctx.currentMouseId === row.id) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.tag.addValue')),
        }));
        const __VLS_56 = __VLS_55({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.tag.addValue')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        const { default: __VLS_59 } = __VLS_57.slots;
        if (__VLS_ctx.permissionPrecise.tag_create(__VLS_ctx.id)) {
            let __VLS_60;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }));
            const __VLS_62 = __VLS_61({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            let __VLS_65;
            const __VLS_66 = {
                /** @type {typeof __VLS_65.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentMouseId === row.id))
                        throw 0;
                    if (!(__VLS_ctx.permissionPrecise.tag_create(__VLS_ctx.id)))
                        throw 0;
                    return __VLS_ctx.openCreateTagDialog(row);
                    // @ts-ignore
                    [$t, $t, $t, permissionPrecise, id, openCreateTagDialog, filterText, getList, pagedGroups, spanMethod, tableMaxHeight, handleSelectionChange, cellMouseEnter, cellMouseLeave, vLoading, loading, currentMouseId,];
                },
            };
            const { default: __VLS_67 } = __VLS_63.slots;
            let __VLS_68;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
                iconName: "app-add-outlined",
            }));
            const __VLS_70 = __VLS_69({
                iconName: "app-add-outlined",
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            // @ts-ignore
            [];
            var __VLS_63;
            var __VLS_64;
        }
        // @ts-ignore
        [];
        var __VLS_57;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_73;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.tag.edit')),
        }));
        const __VLS_75 = __VLS_74({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.tag.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        const { default: __VLS_78 } = __VLS_76.slots;
        if (__VLS_ctx.permissionPrecise.tag_edit(__VLS_ctx.id)) {
            let __VLS_79;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }));
            const __VLS_81 = __VLS_80({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_80));
            let __VLS_84;
            const __VLS_85 = {
                /** @type {typeof __VLS_84.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentMouseId === row.id))
                        throw 0;
                    if (!(__VLS_ctx.permissionPrecise.tag_edit(__VLS_ctx.id)))
                        throw 0;
                    return __VLS_ctx.editTagKey(row);
                    // @ts-ignore
                    [$t, permissionPrecise, id, editTagKey,];
                },
            };
            const { default: __VLS_86 } = __VLS_82.slots;
            let __VLS_87;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
                iconName: "app-edit",
            }));
            const __VLS_89 = __VLS_88({
                iconName: "app-edit",
            }, ...__VLS_functionalComponentArgsRest(__VLS_88));
            // @ts-ignore
            [];
            var __VLS_82;
            var __VLS_83;
        }
        // @ts-ignore
        [];
        var __VLS_76;
        let __VLS_92;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
        }));
        const __VLS_94 = __VLS_93({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        const { default: __VLS_97 } = __VLS_95.slots;
        if (__VLS_ctx.permissionPrecise.tag_delete(__VLS_ctx.id)) {
            let __VLS_98;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }));
            const __VLS_100 = __VLS_99({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_99));
            let __VLS_103;
            const __VLS_104 = {
                /** @type {typeof __VLS_103.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentMouseId === row.id))
                        throw 0;
                    if (!(__VLS_ctx.permissionPrecise.tag_delete(__VLS_ctx.id)))
                        throw 0;
                    return __VLS_ctx.delTag(row);
                    // @ts-ignore
                    [$t, permissionPrecise, id, delTag,];
                },
            };
            const { default: __VLS_105 } = __VLS_101.slots;
            let __VLS_106;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
                iconName: "app-delete",
            }));
            const __VLS_108 = __VLS_107({
                iconName: "app-delete",
            }, ...__VLS_functionalComponentArgsRest(__VLS_107));
            // @ts-ignore
            [];
            var __VLS_101;
            var __VLS_102;
        }
        // @ts-ignore
        [];
        var __VLS_95;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_50;
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    label: (__VLS_ctx.$t('views.document.tag.value')),
    className: "border-l",
}));
const __VLS_113 = __VLS_112({
    label: (__VLS_ctx.$t('views.document.tag.value')),
    className: "border-l",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
const { default: __VLS_116 } = __VLS_114.slots;
{
    const { default: __VLS_117 } = __VLS_114.slots;
    const [{ row }] = __VLS_vSlot(__VLS_117);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    (row.value);
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_114;
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    label: (__VLS_ctx.$t('views.document.tag.relatedDoc')),
    align: "right",
}));
const __VLS_120 = __VLS_119({
    label: (__VLS_ctx.$t('views.document.tag.relatedDoc')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
{
    const { default: __VLS_124 } = __VLS_121.slots;
    const [{ row }] = __VLS_vSlot(__VLS_124);
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        ...{ 'onClick': {} },
        type: "primary",
        underline: true,
    }));
    const __VLS_127 = __VLS_126({
        ...{ 'onClick': {} },
        type: "primary",
        underline: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    let __VLS_130;
    const __VLS_131 = {
        /** @type {typeof __VLS_130.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openTagLinkedDocumentDialog(row);
            // @ts-ignore
            [$t, openTagLinkedDocumentDialog,];
        },
    };
    const { default: __VLS_132 } = __VLS_128.slots;
    (row.doc_count);
    // @ts-ignore
    [];
    var __VLS_128;
    var __VLS_129;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_121;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "100",
    fixed: "right",
}));
const __VLS_135 = __VLS_134({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "100",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
{
    const { default: __VLS_139 } = __VLS_136.slots;
    const [{ row }] = __VLS_vSlot(__VLS_139);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_140;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
        effect: "dark",
        content: (__VLS_ctx.$t('views.document.tag.editValue')),
    }));
    const __VLS_142 = __VLS_141({
        effect: "dark",
        content: (__VLS_ctx.$t('views.document.tag.editValue')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    const { default: __VLS_145 } = __VLS_143.slots;
    if (__VLS_ctx.permissionPrecise.tag_edit(__VLS_ctx.id)) {
        let __VLS_146;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_148 = __VLS_147({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_147));
        let __VLS_151;
        const __VLS_152 = {
            /** @type {typeof __VLS_151.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.tag_edit(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.editTagValue(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, id, editTagValue,];
            },
        };
        const { default: __VLS_153 } = __VLS_149.slots;
        let __VLS_154;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
            iconName: "app-edit",
        }));
        const __VLS_156 = __VLS_155({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_155));
        // @ts-ignore
        [];
        var __VLS_149;
        var __VLS_150;
    }
    // @ts-ignore
    [];
    var __VLS_143;
    let __VLS_159;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
    }));
    const __VLS_161 = __VLS_160({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    const { default: __VLS_164 } = __VLS_162.slots;
    if (__VLS_ctx.permissionPrecise.tag_delete(__VLS_ctx.id)) {
        let __VLS_165;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_167 = __VLS_166({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        let __VLS_170;
        const __VLS_171 = {
            /** @type {typeof __VLS_170.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.tag_delete(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.delTagValue(row);
                // @ts-ignore
                [$t, permissionPrecise, id, delTagValue,];
            },
        };
        const { default: __VLS_172 } = __VLS_168.slots;
        let __VLS_173;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
            iconName: "app-delete",
        }));
        const __VLS_175 = __VLS_174({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_174));
        // @ts-ignore
        [];
        var __VLS_168;
        var __VLS_169;
    }
    // @ts-ignore
    [];
    var __VLS_162;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_136;
// @ts-ignore
[];
var __VLS_33;
var __VLS_34;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-16 flex justify-end" },
});
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
let __VLS_178;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
    currentPage: (__VLS_ctx.pageNum),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.tableData.length),
    layout: "prev, pager, next, sizes",
    pageSizes: ([10, 20, 50, 100]),
}));
const __VLS_180 = __VLS_179({
    currentPage: (__VLS_ctx.pageNum),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.tableData.length),
    layout: "prev, pager, next, sizes",
    pageSizes: ([10, 20, 50, 100]),
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
// @ts-ignore
[pageNum, pageSize, tableData,];
var __VLS_3;
const __VLS_183 = CreateTagDialog;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    ...{ 'onRefresh': {} },
    ref: "createTagDialogRef",
}));
const __VLS_185 = __VLS_184({
    ...{ 'onRefresh': {} },
    ref: "createTagDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
let __VLS_188;
const __VLS_189 = {
    /** @type {typeof __VLS_188.refresh} */
    onRefresh: (__VLS_ctx.handleDialogRefresh),
};
var __VLS_190;
var __VLS_186;
var __VLS_187;
const __VLS_192 = EditTagDialog;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    ...{ 'onRefresh': {} },
    ref: "editTagDialogRef",
}));
const __VLS_194 = __VLS_193({
    ...{ 'onRefresh': {} },
    ref: "editTagDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
let __VLS_197;
const __VLS_198 = {
    /** @type {typeof __VLS_197.refresh} */
    onRefresh: (__VLS_ctx.handleDialogRefresh),
};
var __VLS_199;
var __VLS_195;
var __VLS_196;
const __VLS_201 = TaglinkedDocumentDialog;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    ...{ 'onRefresh': {} },
    ref: "taglinkedDocumentDialogRef",
}));
const __VLS_203 = __VLS_202({
    ...{ 'onRefresh': {} },
    ref: "taglinkedDocumentDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
let __VLS_206;
const __VLS_207 = {
    /** @type {typeof __VLS_206.refresh} */
    onRefresh: (__VLS_ctx.handleDialogRefresh),
};
var __VLS_208;
var __VLS_204;
var __VLS_205;
// @ts-ignore
var __VLS_40 = __VLS_39, __VLS_191 = __VLS_190, __VLS_200 = __VLS_199, __VLS_209 = __VLS_208;
// @ts-ignore
[handleDialogRefresh, handleDialogRefresh, handleDialogRefresh,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
