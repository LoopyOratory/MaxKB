/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, reactive, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import CreateProblemDialog from './component/CreateProblemDialog.vue';
import DetailProblemDrawer from './component/DetailProblemDrawer.vue';
import RelateProblemDialog from './component/RelateProblemDialog.vue';
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
const RelateProblemDialogRef = ref();
const DetailProblemRef = ref();
const CreateProblemDialogRef = ref();
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
const problemData = ref([]);
const problemIndexMap = computed(() => {
    return problemData.value
        .map((row, index) => ({
        [row.id]: index,
    }))
        .reduce((pre, next) => ({ ...pre, ...next }), {});
});
const multipleTableRef = ref();
const multipleSelection = ref([]);
function relateProblem(row) {
    const arr = [];
    if (row) {
        arr.push(row.id);
    }
    else {
        multipleSelection.value.map((v) => {
            if (v) {
                arr.push(v.id);
            }
        });
    }
    RelateProblemDialogRef.value.open(arr);
}
function createProblem() {
    CreateProblemDialogRef.value.open();
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
    loadSharedApi({ type: 'problem', systemType: apiType.value })
        .postProblems(id, obj)
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
    loadSharedApi({ type: 'problem', systemType: apiType.value })
        .putMulProblem(id, arr, loading)
        .then(() => {
        MsgSuccess(t('views.document.delete.successMessage'));
        multipleTableRef.value?.clearSelection();
        getList();
    });
}
function deleteProblem(row) {
    loadSharedApi({ type: 'problem', systemType: apiType.value })
        .delProblems(id, row.id, loading)
        .then(() => {
        MsgSuccess(t('common.deleteSuccess'));
        getList();
    });
}
function editName(val, problemId) {
    if (val) {
        const obj = {
            content: val,
        };
        loadSharedApi({ type: 'problem', systemType: apiType.value })
            .putProblems(id, problemId, obj, loading)
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
/**
 * Next page
 */
const nextChatRecord = () => {
    let index = problemIndexMap.value[currentClickId.value] + 1;
    if (index >= problemData.value.length) {
        if (index + (paginationConfig.current_page - 1) * paginationConfig.page_size >=
            paginationConfig.total - 1) {
            return;
        }
        paginationConfig.current_page = paginationConfig.current_page + 1;
        getList().then(() => {
            index = 0;
            currentClickId.value = problemData.value[index].id;
            currentContent.value = problemData.value[index].content;
        });
    }
    else {
        currentClickId.value = problemData.value[index].id;
        currentContent.value = problemData.value[index].content;
    }
};
const pre_disable = computed(() => {
    const index = problemIndexMap.value[currentClickId.value] - 1;
    return index < 0 && paginationConfig.current_page <= 1;
});
const next_disable = computed(() => {
    const index = problemIndexMap.value[currentClickId.value] + 1;
    return (index >= problemData.value.length &&
        index + (paginationConfig.current_page - 1) * paginationConfig.page_size >=
            paginationConfig.total - 1);
});
/**
 * Previous page
 */
const preChatRecord = () => {
    let index = problemIndexMap.value[currentClickId.value] - 1;
    if (index < 0) {
        if (paginationConfig.current_page <= 1) {
            return;
        }
        paginationConfig.current_page = paginationConfig.current_page - 1;
        getList().then(() => {
            index = paginationConfig.page_size - 1;
            currentClickId.value = problemData.value[index].id;
            currentContent.value = problemData.value[index].content;
        });
    }
    else {
        currentClickId.value = problemData.value[index].id;
        currentContent.value = problemData.value[index].content;
    }
};
function rowClickHandle(row, column) {
    if (column && column.type === 'selection') {
        return;
    }
    if (route.path.includes('share/')) {
        return;
    }
    if (row.paragraph_count) {
        currentClickId.value = row.id;
        currentContent.value = row.content;
        DetailProblemRef.value.open();
    }
}
const setRowClass = ({ row }) => {
    return currentClickId.value === row?.id ? 'highlight' : '';
};
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getList();
}
function getList() {
    return loadSharedApi({ type: 'problem', isShared: isShared.value, systemType: apiType.value })
        .getProblemsPage(id, paginationConfig, filterText.value && { content: filterText.value }, loading)
        .then((res) => {
        problemData.value = res.data.records;
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
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.problem.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
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
if (__VLS_ctx.permissionPrecise.problem_create(__VLS_ctx.id)) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_11;
    const __VLS_12 = {
        /** @type {typeof __VLS_11.click} */
        onClick: (__VLS_ctx.createProblem),
    };
    const { default: __VLS_13 } = __VLS_9.slots;
    (__VLS_ctx.$t('views.problem.createProblem'));
    // @ts-ignore
    [$t, $t, permissionPrecise, id, createProblem,];
    var __VLS_9;
    var __VLS_10;
}
if (__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id)) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_19;
    const __VLS_20 = {
        /** @type {typeof __VLS_19.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id)))
                throw 0;
            return __VLS_ctx.relateProblem();
            // @ts-ignore
            [permissionPrecise, id, multipleSelection, relateProblem,];
        },
    };
    const { default: __VLS_21 } = __VLS_17.slots;
    (__VLS_ctx.$t('views.problem.relateParagraph.title'));
    // @ts-ignore
    [$t,];
    var __VLS_17;
    var __VLS_18;
}
if (__VLS_ctx.permissionPrecise.problem_delete(__VLS_ctx.id)) {
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_27;
    const __VLS_28 = {
        /** @type {typeof __VLS_27.click} */
        onClick: (__VLS_ctx.deleteMulDocument),
    };
    const { default: __VLS_29 } = __VLS_25.slots;
    (__VLS_ctx.$t('views.problem.setting.batchDelete'));
    // @ts-ignore
    [$t, permissionPrecise, id, multipleSelection, deleteMulDocument,];
    var __VLS_25;
    var __VLS_26;
}
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
}));
const __VLS_32 = __VLS_31({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.change} */
    onChange: (__VLS_ctx.getList),
};
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
var __VLS_33;
var __VLS_34;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ...{ 'onCreatQuick': {} },
    ...{ 'onRowClick': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.problemData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    quickCreate: (__VLS_ctx.permissionPrecise.problem_create(__VLS_ctx.id)),
    quickCreateName: (__VLS_ctx.$t('views.problem.quickCreateName')),
    quickCreatePlaceholder: (__VLS_ctx.$t('views.problem.quickCreateProblem')),
    quickCreateMaxlength: (256),
    rowClassName: (__VLS_ctx.setRowClass),
    rowKey: ((row) => row.id),
}));
const __VLS_39 = __VLS_38({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ...{ 'onCreatQuick': {} },
    ...{ 'onRowClick': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.problemData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    quickCreate: (__VLS_ctx.permissionPrecise.problem_create(__VLS_ctx.id)),
    quickCreateName: (__VLS_ctx.$t('views.problem.quickCreateName')),
    quickCreatePlaceholder: (__VLS_ctx.$t('views.problem.quickCreateProblem')),
    quickCreateMaxlength: (256),
    rowClassName: (__VLS_ctx.setRowClass),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_42;
const __VLS_43 = {
    /** @type {typeof __VLS_42.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_44 = {
    /** @type {typeof __VLS_42.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_45 = {
    /** @type {typeof __VLS_42.cellMouseEnter} */
    onCellMouseEnter: (__VLS_ctx.cellMouseEnter),
};
const __VLS_46 = {
    /** @type {typeof __VLS_42.cellMouseLeave} */
    onCellMouseLeave: (__VLS_ctx.cellMouseLeave),
};
const __VLS_47 = {
    /** @type {typeof __VLS_42.creatQuick} */
    onCreatQuick: (__VLS_ctx.creatQuickHandle),
};
const __VLS_48 = {
    /** @type {typeof __VLS_42.rowClick} */
    onRowClick: (__VLS_ctx.rowClickHandle),
};
const __VLS_49 = {
    /** @type {typeof __VLS_42.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_50;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_52 } = __VLS_40.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}));
const __VLS_55 = __VLS_54({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    prop: "content",
    label: (__VLS_ctx.$t('views.problem.title')),
    minWidth: "280",
}));
const __VLS_60 = __VLS_59({
    prop: "content",
    label: (__VLS_ctx.$t('views.problem.title')),
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
{
    const { default: __VLS_64 } = __VLS_61.slots;
    const [{ row }] = __VLS_vSlot(__VLS_64);
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.ReadWrite} */
    ReadWrite;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        ...{ 'onChange': {} },
        data: (row.content),
        showEditIcon: (__VLS_ctx.permissionPrecise.problem_edit(__VLS_ctx.id) && row.id === __VLS_ctx.currentMouseId),
        maxlength: (256),
    }));
    const __VLS_67 = __VLS_66({
        ...{ 'onChange': {} },
        data: (row.content),
        showEditIcon: (__VLS_ctx.permissionPrecise.problem_edit(__VLS_ctx.id) && row.id === __VLS_ctx.currentMouseId),
        maxlength: (256),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    let __VLS_70;
    const __VLS_71 = {
        /** @type {typeof __VLS_70.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.editName($event, row.id);
            // @ts-ignore
            [$t, $t, $t, $t, permissionPrecise, permissionPrecise, id, id, filterText, getList, getList, problemData, paginationConfig, setRowClass, handleSizeChange, cellMouseEnter, cellMouseLeave, creatQuickHandle, rowClickHandle, handleSelectionChange, vLoading, loading, currentMouseId, editName,];
        },
    };
    var __VLS_68;
    var __VLS_69;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_61;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    prop: "paragraph_count",
    label: (__VLS_ctx.$t('views.problem.table.paragraph_count')),
    align: "right",
    minWidth: "100",
}));
const __VLS_74 = __VLS_73({
    prop: "paragraph_count",
    label: (__VLS_ctx.$t('views.problem.table.paragraph_count')),
    align: "right",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const { default: __VLS_77 } = __VLS_75.slots;
{
    const { default: __VLS_78 } = __VLS_75.slots;
    const [{ row }] = __VLS_vSlot(__VLS_78);
    if (row.paragraph_count) {
        let __VLS_79;
        /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
        elLink;
        // @ts-ignore
        const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_81 = __VLS_80({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_80));
        let __VLS_84;
        const __VLS_85 = {
            /** @type {typeof __VLS_84.click} */
            onClick: (...[$event]) => {
                if (!(row.paragraph_count))
                    throw 0;
                return __VLS_ctx.rowClickHandle(row);
                // @ts-ignore
                [$t, rowClickHandle,];
            },
        };
        const { default: __VLS_86 } = __VLS_82.slots;
        (row.paragraph_count);
        // @ts-ignore
        [];
        var __VLS_82;
        var __VLS_83;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.paragraph_count);
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_75;
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "170",
}));
const __VLS_89 = __VLS_88({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_92 } = __VLS_90.slots;
{
    const { default: __VLS_93 } = __VLS_90.slots;
    const [{ row }] = __VLS_vSlot(__VLS_93);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_90;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    prop: "update_time",
    label: (__VLS_ctx.$t('views.problem.table.updateTime')),
    width: "170",
}));
const __VLS_96 = __VLS_95({
    prop: "update_time",
    label: (__VLS_ctx.$t('views.problem.table.updateTime')),
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const { default: __VLS_99 } = __VLS_97.slots;
{
    const { default: __VLS_100 } = __VLS_97.slots;
    const [{ row }] = __VLS_vSlot(__VLS_100);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_97;
let __VLS_101;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    fixed: "right",
}));
const __VLS_103 = __VLS_102({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const { default: __VLS_106 } = __VLS_104.slots;
{
    const { default: __VLS_107 } = __VLS_104.slots;
    const [{ row }] = __VLS_vSlot(__VLS_107);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        effect: "dark",
        content: (__VLS_ctx.$t('views.problem.relateParagraph.title')),
        placement: "top",
    }));
    const __VLS_110 = __VLS_109({
        effect: "dark",
        content: (__VLS_ctx.$t('views.problem.relateParagraph.title')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const { default: __VLS_113 } = __VLS_111.slots;
    if (__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id)) {
        let __VLS_114;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_116 = __VLS_115({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        let __VLS_119;
        const __VLS_120 = {
            /** @type {typeof __VLS_119.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.relateProblem(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, id, relateProblem,];
            },
        };
        const { default: __VLS_121 } = __VLS_117.slots;
        let __VLS_122;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
            iconName: "app-generate-question",
        }));
        const __VLS_124 = __VLS_123({
            iconName: "app-generate-question",
        }, ...__VLS_functionalComponentArgsRest(__VLS_123));
        // @ts-ignore
        [];
        var __VLS_117;
        var __VLS_118;
    }
    // @ts-ignore
    [];
    var __VLS_111;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_127;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_129 = __VLS_128({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    const { default: __VLS_132 } = __VLS_130.slots;
    if (__VLS_ctx.permissionPrecise.problem_delete(__VLS_ctx.id)) {
        let __VLS_133;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_135 = __VLS_134({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_134));
        let __VLS_138;
        const __VLS_139 = {
            /** @type {typeof __VLS_138.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.problem_delete(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.deleteProblem(row);
                // @ts-ignore
                [$t, permissionPrecise, id, deleteProblem,];
            },
        };
        const { default: __VLS_140 } = __VLS_136.slots;
        let __VLS_141;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
            iconName: "app-delete",
        }));
        const __VLS_143 = __VLS_142({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        // @ts-ignore
        [];
        var __VLS_136;
        var __VLS_137;
    }
    // @ts-ignore
    [];
    var __VLS_130;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_104;
// @ts-ignore
[];
var __VLS_40;
var __VLS_41;
// @ts-ignore
[];
var __VLS_3;
const __VLS_146 = CreateProblemDialog;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    ...{ 'onRefresh': {} },
    ref: "CreateProblemDialogRef",
}));
const __VLS_148 = __VLS_147({
    ...{ 'onRefresh': {} },
    ref: "CreateProblemDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
let __VLS_151;
const __VLS_152 = {
    /** @type {typeof __VLS_151.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_153;
var __VLS_149;
var __VLS_150;
const __VLS_155 = DetailProblemDrawer;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
    ...{ 'onRefresh': {} },
    next: (__VLS_ctx.nextChatRecord),
    pre: (__VLS_ctx.preChatRecord),
    ref: "DetailProblemRef",
    currentId: (__VLS_ctx.currentClickId),
    currentContent: (__VLS_ctx.currentContent),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}));
const __VLS_157 = __VLS_156({
    ...{ 'onRefresh': {} },
    next: (__VLS_ctx.nextChatRecord),
    pre: (__VLS_ctx.preChatRecord),
    ref: "DetailProblemRef",
    currentId: (__VLS_ctx.currentClickId),
    currentContent: (__VLS_ctx.currentContent),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
let __VLS_160;
const __VLS_161 = {
    /** @type {typeof __VLS_160.refresh} */
    onRefresh: (__VLS_ctx.refreshRelate),
};
var __VLS_162;
var __VLS_158;
var __VLS_159;
const __VLS_164 = RelateProblemDialog;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    ...{ 'onRefresh': {} },
    ref: "RelateProblemDialogRef",
}));
const __VLS_166 = __VLS_165({
    ...{ 'onRefresh': {} },
    ref: "RelateProblemDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
const __VLS_170 = {
    /** @type {typeof __VLS_169.refresh} */
    onRefresh: (__VLS_ctx.refreshRelate),
};
var __VLS_171;
var __VLS_167;
var __VLS_168;
// @ts-ignore
var __VLS_51 = __VLS_50, __VLS_154 = __VLS_153, __VLS_163 = __VLS_162, __VLS_172 = __VLS_171;
// @ts-ignore
[refresh, nextChatRecord, preChatRecord, currentClickId, currentContent, pre_disable, next_disable, refreshRelate, refreshRelate,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
