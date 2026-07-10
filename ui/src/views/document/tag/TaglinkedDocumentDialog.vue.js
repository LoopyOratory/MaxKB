/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import { cloneDeep } from 'lodash';
import { datetimeFormat } from '@/utils/time';
import { getImgUrl } from '@/utils/common';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
const route = useRoute();
const { params: { id, folderId, type }, // id is knowledgeID
 } = route;
const emit = defineEmits(['refresh']);
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
const isShared = computed(() => {
    return folderId === 'share';
});
const loading = ref(false);
const dialogVisible = ref(false);
const activeTab = ref('linked');
function handleTabChange(tabName) {
    activeTab.value = tabName || 'linked';
    resetPage();
    multipleSelection.value = [];
    multipleTableRef.value?.clearSelection();
    filterMethod.value = {};
    filterText.value = '';
    getList();
}
function handleSearch() {
    resetPage();
    getList();
}
const paginationConfig = ref({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const filterText = ref('');
const currentTag = ref({});
const tableData = ref([]);
const multipleSelection = ref([]);
const multipleTableRef = ref();
const filterMethod = ref({});
const orderBy = ref('');
function dropdownHandle(obj) {
    filterMethod.value = {
        ...filterMethod.value,
        [obj.attr]: obj.command,
    };
    resetPage();
    getList();
}
function beforeCommand(attr, val, task_type) {
    return {
        attr: attr,
        command: val,
        task_type,
    };
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
};
function afterOperateSuccess() {
    multipleSelection.value = [];
    multipleTableRef.value?.clearSelection();
    resetPage();
    getList();
    emit('refresh');
}
function operate(docIds) {
    if (!currentTag.value?.id || docIds.length === 0)
        return;
    const res = activeTab.value === 'linked' ? unrelateDocuments(docIds) : relateDocuments(docIds);
    res.then(() => {
        MsgSuccess(t('common.settingSuccess'));
        afterOperateSuccess();
    });
}
function handleSizeChange() {
    paginationConfig.value.current_page = 1;
    getList();
}
function batchOperate() {
    if (!currentTag.value.id || multipleSelection.value.length === 0)
        return;
    const docIds = multipleSelection.value.map((item) => item.id);
    operate(docIds);
}
function rowOperate(row) {
    if (!currentTag.value?.id)
        return;
    operate([row.id]);
}
function relateDocuments(doc_ids) {
    return loadSharedApi({
        type: 'document',
        isShared: isShared.value,
        systemType: apiType.value,
    }).postMulDocumentTags(id, { tag_ids: [currentTag.value.id], document_ids: doc_ids }, loading);
}
function unrelateDocuments(doc_ids) {
    return loadSharedApi({
        type: 'document',
        isShared: isShared.value,
        systemType: apiType.value,
    }).delDocsTag(id, currentTag.value.id, doc_ids, loading);
}
function resetPage() {
    paginationConfig.value.current_page = 1;
}
function getList() {
    if (!currentTag.value?.id) {
        tableData.value = [];
        paginationConfig.value.total = 0;
        return;
    }
    multipleSelection.value = [];
    const params = {
        ...filterMethod.value,
        folder_id: folderId,
        order_by: orderBy.value,
        'tags[]': [currentTag.value.id],
    };
    if (filterText.value) {
        params.name = filterText.value;
    }
    if (activeTab.value === 'unlinked') {
        params.tag_exclude = true;
    }
    loadSharedApi({ type: 'document', isShared: isShared.value, systemType: apiType.value })
        .getDocumentPage(id, paginationConfig.value, params, loading)
        .then((res) => {
        tableData.value = res?.data?.records || [];
        paginationConfig.value.total = res?.data?.total || 0;
    });
}
const open = (row) => {
    filterText.value = '';
    filterMethod.value = {};
    activeTab.value = 'linked';
    orderBy.value = '';
    tableData.value = [];
    multipleSelection.value = [];
    multipleTableRef.value?.clearSelection();
    paginationConfig.value = {
        current_page: 1,
        page_size: 10,
        total: 0,
    };
    currentTag.value = cloneDeep(row || {});
    dialogVisible.value = true;
    getList();
};
const close = () => {
    multipleSelection.value = [];
    multipleTableRef.value?.clearSelection();
    dialogVisible.value = false;
};
const __VLS_exposed = { open, close };
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    alignCenter: true,
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    alignCenter: true,
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.currentTag.key);
    (__VLS_ctx.currentTag.value);
    // @ts-ignore
    [dialogVisible, close, currentTag, currentTag,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
const __VLS_14 = {
    /** @type {typeof __VLS_13.tabChange} */
    onTabChange: (__VLS_ctx.handleTabChange),
};
const { default: __VLS_15 } = __VLS_11.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.$t('views.document.tag.relatedDoc')),
    name: "linked",
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.$t('views.document.tag.relatedDoc')),
    name: "linked",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.$t('views.document.tag.unrelatedDoc')),
    name: "unlinked",
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.$t('views.document.tag.unrelatedDoc')),
    name: "unlinked",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[activeTab, handleTabChange, $t, $t,];
var __VLS_11;
var __VLS_12;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0 || __VLS_ctx.loading),
}));
const __VLS_28 = __VLS_27({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0 || __VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_31;
const __VLS_32 = {
    /** @type {typeof __VLS_31.click} */
    onClick: (__VLS_ctx.batchOperate),
};
const { default: __VLS_33 } = __VLS_29.slots;
(__VLS_ctx.activeTab === 'linked' ? __VLS_ctx.$t('views.document.tag.unrelate') : __VLS_ctx.$t('views.document.tag.relate'));
// @ts-ignore
[activeTab, $t, $t, multipleSelection, loading, batchOperate,];
var __VLS_29;
var __VLS_30;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
    placeholder: (__VLS_ctx.$t('common.search')),
}));
const __VLS_36 = __VLS_35({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
    placeholder: (__VLS_ctx.$t('common.search')),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_39;
const __VLS_40 = {
    /** @type {typeof __VLS_39.change} */
    onChange: (__VLS_ctx.handleSearch),
};
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
var __VLS_37;
var __VLS_38;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    paginationConfig: (__VLS_ctx.paginationConfig),
    data: (__VLS_ctx.tableData),
    rowKey: ((row) => row.id),
    ...{ class: "mt-16" },
    ...{ style: {} },
}));
const __VLS_43 = __VLS_42({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    paginationConfig: (__VLS_ctx.paginationConfig),
    data: (__VLS_ctx.tableData),
    rowKey: ((row) => row.id),
    ...{ class: "mt-16" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_46;
const __VLS_47 = {
    /** @type {typeof __VLS_46.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_48 = {
    /** @type {typeof __VLS_46.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_49 = {
    /** @type {typeof __VLS_46.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_50;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_52 } = __VLS_44.slots;
if (!__VLS_ctx.isShared) {
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
}
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    prop: "name",
    label: (__VLS_ctx.multipleSelection.length === 0
        ? __VLS_ctx.$t('views.document.table.name')
        : `${__VLS_ctx.$t('common.selected')} ${__VLS_ctx.multipleSelection.length} ${__VLS_ctx.$t('views.document.items')}`),
    minWidth: "280",
    showOverflowTooltip: true,
}));
const __VLS_60 = __VLS_59({
    prop: "name",
    label: (__VLS_ctx.multipleSelection.length === 0
        ? __VLS_ctx.$t('views.document.table.name')
        : `${__VLS_ctx.$t('common.selected')} ${__VLS_ctx.multipleSelection.length} ${__VLS_ctx.$t('views.document.items')}`),
    minWidth: "280",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
{
    const { default: __VLS_64 } = __VLS_61.slots;
    const [{ row }] = __VLS_vSlot(__VLS_64);
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        size: (8),
    }));
    const __VLS_67 = __VLS_66({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    const { default: __VLS_70 } = __VLS_68.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.getImgUrl(row && row?.name)),
        alt: "",
        width: "24",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.name);
    // @ts-ignore
    [$t, $t, $t, $t, multipleSelection, multipleSelection, loading, filterText, handleSearch, paginationConfig, tableData, handleSizeChange, getList, handleSelectionChange, vLoading, isShared, getImgUrl,];
    var __VLS_68;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_61;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    width: "130",
}));
const __VLS_73 = __VLS_72({
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
{
    const { header: __VLS_77 } = __VLS_74.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.document.enableStatus.label'));
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        ...{ 'onCommand': {} },
        trigger: "click",
    }));
    const __VLS_80 = __VLS_79({
        ...{ 'onCommand': {} },
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    let __VLS_83;
    const __VLS_84 = {
        /** @type {typeof __VLS_83.command} */
        onCommand: (__VLS_ctx.dropdownHandle),
    };
    const { default: __VLS_85 } = __VLS_81.slots;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['is_active'] ? 'primary' : ''),
    }));
    const __VLS_88 = __VLS_87({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['is_active'] ? 'primary' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const { default: __VLS_91 } = __VLS_89.slots;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({}));
    const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const { default: __VLS_97 } = __VLS_95.slots;
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.Filter} */
    Filter;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({}));
    const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
    // @ts-ignore
    [$t, dropdownHandle, filterMethod,];
    var __VLS_95;
    // @ts-ignore
    [];
    var __VLS_89;
    {
        const { dropdown: __VLS_103 } = __VLS_81.slots;
        let __VLS_104;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
            ...{ style: {} },
        }));
        const __VLS_106 = __VLS_105({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        const { default: __VLS_109 } = __VLS_107.slots;
        let __VLS_110;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === '' ? 'is-active' : '') },
            command: (__VLS_ctx.beforeCommand('is_active', '')),
            ...{ class: "justify-center" },
        }));
        const __VLS_112 = __VLS_111({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === '' ? 'is-active' : '') },
            command: (__VLS_ctx.beforeCommand('is_active', '')),
            ...{ class: "justify-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_111));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_115 } = __VLS_113.slots;
        (__VLS_ctx.$t('common.status.all'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_113;
        let __VLS_116;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === true ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', true)),
        }));
        const __VLS_118 = __VLS_117({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === true ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', true)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_121 } = __VLS_119.slots;
        (__VLS_ctx.$t('common.status.enabled'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_119;
        let __VLS_122;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === false ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', false)),
        }));
        const __VLS_124 = __VLS_123({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === false ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', false)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_123));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_127 } = __VLS_125.slots;
        (__VLS_ctx.$t('common.status.disabled'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_125;
        // @ts-ignore
        [];
        var __VLS_107;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_81;
    var __VLS_82;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_128 } = __VLS_74.slots;
    const [{ row }] = __VLS_vSlot(__VLS_128);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_129;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_131 = __VLS_130({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_134 } = __VLS_132.slots;
        let __VLS_135;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({}));
        const __VLS_137 = __VLS_136({}, ...__VLS_functionalComponentArgsRest(__VLS_136));
        // @ts-ignore
        [];
        var __VLS_132;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.enabled'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_140;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_142 = __VLS_141({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.disabled'));
    }
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_74;
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "175",
    sortable: true,
}));
const __VLS_147 = __VLS_146({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "175",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
{
    const { default: __VLS_151 } = __VLS_148.slots;
    const [{ row }] = __VLS_vSlot(__VLS_151);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_148;
if (!__VLS_ctx.isShared) {
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "80",
        fixed: "right",
    }));
    const __VLS_154 = __VLS_153({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "80",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    const { default: __VLS_157 } = __VLS_155.slots;
    {
        const { default: __VLS_158 } = __VLS_155.slots;
        const [{ row }] = __VLS_vSlot(__VLS_158);
        if (__VLS_ctx.activeTab === 'linked') {
            let __VLS_159;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
                effect: "dark",
                content: (__VLS_ctx.$t('views.document.tag.unrelate')),
                placement: "top",
            }));
            const __VLS_161 = __VLS_160({
                effect: "dark",
                content: (__VLS_ctx.$t('views.document.tag.unrelate')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_160));
            const { default: __VLS_164 } = __VLS_162.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
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
                    if (!(!__VLS_ctx.isShared))
                        throw 0;
                    if (!(__VLS_ctx.activeTab === 'linked'))
                        throw 0;
                    return __VLS_ctx.rowOperate(row);
                    // @ts-ignore
                    [activeTab, $t, $t, isShared, rowOperate,];
                },
            };
            const { default: __VLS_172 } = __VLS_168.slots;
            let __VLS_173;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
                iconName: "app-unlink",
            }));
            const __VLS_175 = __VLS_174({
                iconName: "app-unlink",
            }, ...__VLS_functionalComponentArgsRest(__VLS_174));
            // @ts-ignore
            [];
            var __VLS_168;
            var __VLS_169;
            // @ts-ignore
            [];
            var __VLS_162;
        }
        else {
            let __VLS_178;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
                effect: "dark",
                content: (__VLS_ctx.$t('views.document.tag.relate')),
                placement: "top",
            }));
            const __VLS_180 = __VLS_179({
                effect: "dark",
                content: (__VLS_ctx.$t('views.document.tag.relate')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_179));
            const { default: __VLS_183 } = __VLS_181.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_184;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }));
            const __VLS_186 = __VLS_185({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_185));
            let __VLS_189;
            const __VLS_190 = {
                /** @type {typeof __VLS_189.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.isShared))
                        throw 0;
                    if (!!(__VLS_ctx.activeTab === 'linked'))
                        throw 0;
                    return __VLS_ctx.rowOperate(row);
                    // @ts-ignore
                    [$t, rowOperate,];
                },
            };
            const { default: __VLS_191 } = __VLS_187.slots;
            let __VLS_192;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
                iconName: "app-generate-question",
            }));
            const __VLS_194 = __VLS_193({
                iconName: "app-generate-question",
            }, ...__VLS_functionalComponentArgsRest(__VLS_193));
            // @ts-ignore
            [];
            var __VLS_187;
            var __VLS_188;
            // @ts-ignore
            [];
            var __VLS_181;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_155;
}
// @ts-ignore
[];
var __VLS_44;
var __VLS_45;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_51 = __VLS_50;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
