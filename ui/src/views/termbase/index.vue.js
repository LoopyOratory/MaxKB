/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, reactive, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import CreateTermBaseDialog from './component/CreateTermbaseDialog.vue';
import { datetimeFormat } from '@/utils/time';
import { MsgSuccess, MsgError } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
const route = useRoute();
const { params: { id, folderId }, // Knowledge database id
 } = route;
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('share/')) {
        return 'workspaceShare';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][apiType.value];
});
const isShared = computed(() => {
    return folderId === 'share';
});
const CreateTermbaseDialogRef = ref();
const loading = ref(false);
// CurrentNeedsModificationQuestionid
const currentMouseId = ref('');
// CurrentClickOpendrawerid
const currentClickId = ref('');
const currentContent = ref('');
const paginationConfig = reactive({
    current_page: 1,
    page_size: 10,
    total: 0,
    page_sizes: [10, 20, 50, 100, 1000],
});
const filterText = ref('');
const termbaseData = ref([]);
const multipleTableRef = ref();
const multipleSelection = ref([]);
function exportMulTermbase(row) {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    loadSharedApi({ type: 'termbase', systemType: apiType.value })
        .exportMulTermbase(id, arr, loading)
        .then((res) => {
        const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'termbase_export.txt';
        a.click();
        URL.revokeObjectURL(url);
        multipleTableRef.value?.clearSelection();
    });
}
function createTermbase() {
    CreateTermbaseDialogRef.value.open();
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
};
/*
  QuickCreationBlankDocument
*/
function creatQuickHandle(val) {
    loading.value = true;
    const obj = [val];
    loadSharedApi({ type: 'termbase', systemType: apiType.value })
        .postTermbase(id, obj)
        .then(() => {
        getList();
        MsgSuccess(t('common.createSuccess'));
    })
        .catch(() => {
        loading.value = false;
    });
}
function deleteMulDocument() {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    loadSharedApi({ type: 'termbase', systemType: apiType.value })
        .putMulTermbase(id, arr, loading)
        .then(() => {
        MsgSuccess(t('views.document.delete.successMessage'));
        multipleTableRef.value?.clearSelection();
        getList();
    });
}
function deleteTermbase(row) {
    loadSharedApi({ type: 'termbase', systemType: apiType.value })
        .delTermbase(id, row.id, loading)
        .then(() => {
        MsgSuccess(t('common.deleteSuccess'));
        getList();
    });
}
function editName(val, termbaseId) {
    if (val) {
        const obj = {
            content: val,
        };
        loadSharedApi({ type: 'termbase', systemType: apiType.value })
            .putTermbase(id, termbaseId, obj, loading)
            .then(() => {
            getList();
            MsgSuccess(t('common.modifySuccess'));
        });
    }
    else {
        MsgError(t('views.problem.tip.errorMessage'));
    }
}
function cellMouseEnter(row, column) {
    if (column && column.property === 'content') {
        currentMouseId.value = row.id;
    }
}
function cellMouseLeave() {
    currentMouseId.value = '';
}
const setRowClass = ({ row }) => {
    return currentClickId.value === row?.id ? 'highlight' : '';
};
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getList();
}
function getList() {
    return loadSharedApi({ type: 'termbase', isShared: isShared.value, systemType: apiType.value })
        .getTermbasePage(id, paginationConfig, filterText.value && { content: filterText.value }, loading)
        .then((res) => {
        termbaseData.value = res.data.records;
        paginationConfig.total = res.data.total;
    });
}
function refreshRelate() {
    getList();
    multipleTableRef.value?.clearSelection();
}
function refresh() {
    paginationConfig.current_page = 1;
    getList();
}
onMounted(() => {
    getList();
});
onBeforeUnmount(() => { });
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "document p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['document']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.knowledge.customSegmentation.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    effect: "dark",
    content: (__VLS_ctx.$t('views.knowledge.customSegmentation.tip')),
    placement: "right",
}));
const __VLS_2 = __VLS_1({
    effect: "dark",
    content: (__VLS_ctx.$t('views.knowledge.customSegmentation.tip')),
    placement: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    iconName: "app-problems",
    ...{ class: "color-secondary ml-4" },
}));
const __VLS_8 = __VLS_7({
    iconName: "app-problems",
    ...{ class: "color-secondary ml-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
// @ts-ignore
[$t, $t,];
var __VLS_3;
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ style: {} },
}));
const __VLS_13 = __VLS_12({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_16 } = __VLS_14.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.permissionPrecise.termbase_create(__VLS_ctx.id)) {
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        /** @type {typeof __VLS_22.click} */
        onClick: (__VLS_ctx.createTermbase),
    };
    const { default: __VLS_24 } = __VLS_20.slots;
    (__VLS_ctx.$t('views.knowledge.customSegmentation.create'));
    // @ts-ignore
    [$t, permissionPrecise, id, createTermbase,];
    var __VLS_20;
    var __VLS_21;
}
if (__VLS_ctx.permissionPrecise.termbase_delete(__VLS_ctx.id)) {
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        /** @type {typeof __VLS_30.click} */
        onClick: (__VLS_ctx.deleteMulDocument),
    };
    const { default: __VLS_32 } = __VLS_28.slots;
    (__VLS_ctx.$t('views.problem.setting.batchDelete'));
    // @ts-ignore
    [$t, permissionPrecise, id, multipleSelection, deleteMulDocument,];
    var __VLS_28;
    var __VLS_29;
}
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
const __VLS_39 = {
    /** @type {typeof __VLS_38.click} */
    onClick: (__VLS_ctx.exportMulTermbase),
};
const { default: __VLS_40 } = __VLS_36.slots;
(__VLS_ctx.$t('common.export'));
// @ts-ignore
[$t, multipleSelection, exportMulTermbase,];
var __VLS_36;
var __VLS_37;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
}));
const __VLS_43 = __VLS_42({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_46;
const __VLS_47 = {
    /** @type {typeof __VLS_46.change} */
    onChange: (__VLS_ctx.getList),
};
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
var __VLS_44;
var __VLS_45;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ...{ 'onCreatQuick': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.termbaseData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    quickCreate: (__VLS_ctx.permissionPrecise.termbase_create(__VLS_ctx.id)),
    quickCreateName: (__VLS_ctx.$t('views.knowledge.customSegmentation.quickCreate')),
    quickCreatePlaceholder: (__VLS_ctx.$t('views.knowledge.customSegmentation.quickCreate')),
    quickCreateMaxlength: (256),
    rowClassName: (__VLS_ctx.setRowClass),
    rowKey: ((row) => row.id),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ...{ 'onCreatQuick': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.termbaseData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    quickCreate: (__VLS_ctx.permissionPrecise.termbase_create(__VLS_ctx.id)),
    quickCreateName: (__VLS_ctx.$t('views.knowledge.customSegmentation.quickCreate')),
    quickCreatePlaceholder: (__VLS_ctx.$t('views.knowledge.customSegmentation.quickCreate')),
    quickCreateMaxlength: (256),
    rowClassName: (__VLS_ctx.setRowClass),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_53;
const __VLS_54 = {
    /** @type {typeof __VLS_53.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_55 = {
    /** @type {typeof __VLS_53.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_56 = {
    /** @type {typeof __VLS_53.cellMouseEnter} */
    onCellMouseEnter: (__VLS_ctx.cellMouseEnter),
};
const __VLS_57 = {
    /** @type {typeof __VLS_53.cellMouseLeave} */
    onCellMouseLeave: (__VLS_ctx.cellMouseLeave),
};
const __VLS_58 = {
    /** @type {typeof __VLS_53.creatQuick} */
    onCreatQuick: (__VLS_ctx.creatQuickHandle),
};
const __VLS_59 = {
    /** @type {typeof __VLS_53.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_60;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_62 } = __VLS_51.slots;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}));
const __VLS_65 = __VLS_64({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    prop: "content",
    label: (__VLS_ctx.$t('views.knowledge.customSegmentation.word')),
    minWidth: "280",
}));
const __VLS_70 = __VLS_69({
    prop: "content",
    label: (__VLS_ctx.$t('views.knowledge.customSegmentation.word')),
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const { default: __VLS_73 } = __VLS_71.slots;
{
    const { default: __VLS_74 } = __VLS_71.slots;
    const [{ row }] = __VLS_vSlot(__VLS_74);
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.ReadWrite} */
    ReadWrite;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        ...{ 'onChange': {} },
        data: (row.content),
        showEditIcon: (__VLS_ctx.permissionPrecise.termbase_edit(__VLS_ctx.id) && row.id === __VLS_ctx.currentMouseId),
        maxlength: (256),
    }));
    const __VLS_77 = __VLS_76({
        ...{ 'onChange': {} },
        data: (row.content),
        showEditIcon: (__VLS_ctx.permissionPrecise.termbase_edit(__VLS_ctx.id) && row.id === __VLS_ctx.currentMouseId),
        maxlength: (256),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    let __VLS_80;
    const __VLS_81 = {
        /** @type {typeof __VLS_80.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.editName($event, row.id);
            // @ts-ignore
            [$t, $t, $t, $t, permissionPrecise, permissionPrecise, id, id, filterText, getList, getList, termbaseData, paginationConfig, setRowClass, handleSizeChange, cellMouseEnter, cellMouseLeave, creatQuickHandle, handleSelectionChange, vLoading, loading, currentMouseId, editName,];
        },
    };
    var __VLS_78;
    var __VLS_79;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_71;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "170",
}));
const __VLS_84 = __VLS_83({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
const { default: __VLS_87 } = __VLS_85.slots;
{
    const { default: __VLS_88 } = __VLS_85.slots;
    const [{ row }] = __VLS_vSlot(__VLS_88);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_85;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    prop: "update_time",
    label: (__VLS_ctx.$t('views.problem.table.updateTime')),
    width: "170",
}));
const __VLS_91 = __VLS_90({
    prop: "update_time",
    label: (__VLS_ctx.$t('views.problem.table.updateTime')),
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const { default: __VLS_94 } = __VLS_92.slots;
{
    const { default: __VLS_95 } = __VLS_92.slots;
    const [{ row }] = __VLS_vSlot(__VLS_95);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_92;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    fixed: "right",
}));
const __VLS_98 = __VLS_97({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
{
    const { default: __VLS_102 } = __VLS_99.slots;
    const [{ row }] = __VLS_vSlot(__VLS_102);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_103;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_105 = __VLS_104({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    const { default: __VLS_108 } = __VLS_106.slots;
    if (__VLS_ctx.permissionPrecise.termbase_delete(__VLS_ctx.id)) {
        let __VLS_109;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_111 = __VLS_110({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        let __VLS_114;
        const __VLS_115 = {
            /** @type {typeof __VLS_114.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.termbase_delete(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.deleteTermbase(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, id, deleteTermbase,];
            },
        };
        const { default: __VLS_116 } = __VLS_112.slots;
        let __VLS_117;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            iconName: "app-delete",
        }));
        const __VLS_119 = __VLS_118({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        // @ts-ignore
        [];
        var __VLS_112;
        var __VLS_113;
    }
    // @ts-ignore
    [];
    var __VLS_106;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_99;
// @ts-ignore
[];
var __VLS_51;
var __VLS_52;
// @ts-ignore
[];
var __VLS_14;
const __VLS_122 = CreateTermBaseDialog;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    ...{ 'onRefresh': {} },
    ref: "CreateTermbaseDialogRef",
}));
const __VLS_124 = __VLS_123({
    ...{ 'onRefresh': {} },
    ref: "CreateTermbaseDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
let __VLS_127;
const __VLS_128 = {
    /** @type {typeof __VLS_127.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_129;
var __VLS_125;
var __VLS_126;
// @ts-ignore
var __VLS_61 = __VLS_60, __VLS_130 = __VLS_129;
// @ts-ignore
[refresh,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
