/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, computed } from 'vue';
import { resetUrl } from '@/utils/common';
import triggerAPI from '@/api/trigger/trigger';
import { datetimeFormat } from '@/utils/time';
import ExecutionDetailDrawer from './ExecutionDetailDrawer.vue';
const searchType = ref('name');
const drawer = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const tableData = ref([]);
const query = ref({
    state: '',
    name: '',
    source_type: '',
    order: '',
});
const loading = ref(false);
const current_trigger_id = ref();
const tableIndexMap = computed(() => {
    return tableData.value
        .map((row, index) => ({
        [row.id]: index,
    }))
        .reduce((pre, next) => ({ ...pre, ...next }), {});
});
const ExecutionDetailDrawerRef = ref();
const currentId = ref('');
const currentContent = ref('');
const toDetails = (row) => {
    currentContent.value = row;
    currentId.value = row.id;
    ExecutionDetailDrawerRef.value?.open(row);
};
const changeFilterHandle = () => {
    query.value = { name: '', statu: '' };
};
const changeSize = () => {
    paginationConfig.current_page = 1;
    getList();
};
function handleSortChange({ prop, order }) {
    query.value.order = order === 'ascending' ? `ett.${prop}` : `-ett.${prop}`;
    getList();
}
const getList = (isLoading) => {
    if (current_trigger_id.value) {
        return triggerAPI
            .pageTriggerTaskRecord(current_trigger_id.value, paginationConfig, { ...query.value }, isLoading ? loading : undefined)
            .then((ok) => {
            tableData.value = ok.data.records;
            paginationConfig.total = ok.data.total;
        });
    }
    else
        return Promise.resolve();
};
const pre_disable = computed(() => {
    const index = tableData.value.findIndex((item) => item.id === currentId.value);
    return index === 0 && paginationConfig.current_page === 1;
});
const next_disable = computed(() => {
    const index = tableData.value.findIndex((item) => item.id === currentId.value) + 1;
    return (index >= tableData.value.length &&
        index + (paginationConfig.current_page - 1) * paginationConfig.page_size >=
            paginationConfig.total - 1);
});
/**
 * Next page
 */
const nextRecord = () => {
    const index = tableData.value.findIndex((item) => item.id === currentId.value) + 1;
    if (index >= tableData.value.length) {
        if (paginationConfig.current_page * paginationConfig.page_size >= paginationConfig.total) {
            return;
        }
        paginationConfig.current_page = paginationConfig.current_page + 1;
        getList(true).then(() => {
            currentId.value = tableData.value[index].id;
            currentContent.value = tableData.value[index];
        });
        return;
    }
    else {
        currentId.value = tableData.value[index].id;
        currentContent.value = tableData.value[index];
    }
};
/**
 * Previous page
 */
const preRecord = () => {
    const index = tableData.value.findIndex((item) => item.id === currentId.value) - 1;
    if (index < 0 && 1) {
        if (paginationConfig.current_page === 1) {
            return;
        }
        paginationConfig.current_page = paginationConfig.current_page - 1;
        getList(true).then(() => {
            currentId.value = tableData.value[tableData.value.length - 1].id;
            currentContent.value = tableData.value[tableData.value.length - 1];
        });
    }
    else {
        currentId.value = tableData.value[index].id;
        currentContent.value = tableData.value[index];
    }
};
const open = (trigger_id) => {
    current_trigger_id.value = trigger_id;
    getList(true);
    drawer.value = true;
};
const close = () => {
    paginationConfig.current_page = 1;
    paginationConfig.total = 0;
    tableData.value = [];
    drawer.value = false;
};
const __VLS_exposed = { open, close };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
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
    modelValue: (__VLS_ctx.drawer),
    title: (__VLS_ctx.$t('common.ExecutionRecord.title')),
    direction: "rtl",
    size: "800px",
    beforeClose: (__VLS_ctx.close),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawer),
    title: (__VLS_ctx.$t('common.ExecutionRecord.title')),
    direction: "rtl",
    size: "800px",
    beforeClose: (__VLS_ctx.close),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.change} */
    onChange: (__VLS_ctx.changeFilterHandle),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "state",
}));
const __VLS_22 = __VLS_21({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "state",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    label: (__VLS_ctx.$t('common.sourceType')),
    value: "source_type",
}));
const __VLS_27 = __VLS_26({
    label: (__VLS_ctx.$t('common.sourceType')),
    value: "source_type",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
// @ts-ignore
[drawer, $t, $t, $t, $t, close, searchType, changeFilterHandle,];
var __VLS_10;
var __VLS_11;
if (__VLS_ctx.searchType === 'name') {
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.change} */
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.searchType === 'name'))
                throw 0;
            return __VLS_ctx.getList(true);
            // @ts-ignore
            [$t, searchType, query, getList,];
        },
    };
    var __VLS_33;
    var __VLS_34;
}
else if (__VLS_ctx.searchType === 'source_type') {
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.source_type),
        filterable: true,
        clearable: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.search')),
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.source_type),
        filterable: true,
        clearable: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.search')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_42;
    const __VLS_43 = {
        /** @type {typeof __VLS_42.change} */
        onChange: (...[$event]) => {
            if (!!(__VLS_ctx.searchType === 'name'))
                throw 0;
            if (!(__VLS_ctx.searchType === 'source_type'))
                throw 0;
            return __VLS_ctx.getList(true);
            // @ts-ignore
            [$t, searchType, query, getList,];
        },
    };
    const { default: __VLS_44 } = __VLS_40.slots;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        label: (__VLS_ctx.$t('views.application.title')),
        value: "APPLICATION",
    }));
    const __VLS_47 = __VLS_46({
        label: (__VLS_ctx.$t('views.application.title')),
        value: "APPLICATION",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        label: (__VLS_ctx.$t('views.tool.title')),
        value: "TOOL",
    }));
    const __VLS_52 = __VLS_51({
        label: (__VLS_ctx.$t('views.tool.title')),
        value: "TOOL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    // @ts-ignore
    [$t, $t,];
    var __VLS_40;
    var __VLS_41;
}
else if (__VLS_ctx.searchType === 'state') {
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.state),
        filterable: true,
        clearable: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.search')),
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.state),
        filterable: true,
        clearable: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.search')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_60;
    const __VLS_61 = {
        /** @type {typeof __VLS_60.change} */
        onChange: (...[$event]) => {
            if (!!(__VLS_ctx.searchType === 'name'))
                throw 0;
            if (!!(__VLS_ctx.searchType === 'source_type'))
                throw 0;
            if (!(__VLS_ctx.searchType === 'state'))
                throw 0;
            return __VLS_ctx.getList(true);
            // @ts-ignore
            [$t, searchType, query, getList,];
        },
    };
    const { default: __VLS_62 } = __VLS_58.slots;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        label: (__VLS_ctx.$t('common.status.success')),
        value: "SUCCESS",
    }));
    const __VLS_65 = __VLS_64({
        label: (__VLS_ctx.$t('common.status.success')),
        value: "SUCCESS",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        label: (__VLS_ctx.$t('common.status.STARTED')),
        value: "STARTED",
    }));
    const __VLS_70 = __VLS_69({
        label: (__VLS_ctx.$t('common.status.STARTED')),
        value: "STARTED",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_73;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
        label: (__VLS_ctx.$t('common.status.fail')),
        value: "FAILURE",
    }));
    const __VLS_75 = __VLS_74({
        label: (__VLS_ctx.$t('common.status.fail')),
        value: "FAILURE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    // @ts-ignore
    [$t, $t, $t,];
    var __VLS_58;
    var __VLS_59;
}
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSortChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    defaultSort: ({ prop: 'create_time', order: 'descending' }),
    maxTableHeight: (200),
    rowKey: ((row) => row.id),
}));
const __VLS_80 = __VLS_79({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSortChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    defaultSort: ({ prop: 'create_time', order: 'descending' }),
    maxTableHeight: (200),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
let __VLS_83;
const __VLS_84 = {
    /** @type {typeof __VLS_83.sizeChange} */
    onSizeChange: (__VLS_ctx.changeSize),
};
const __VLS_85 = {
    /** @type {typeof __VLS_83.changePage} */
    onChangePage: (...[$event]) => {
        return __VLS_ctx.getList(true);
        // @ts-ignore
        [getList, tableData, paginationConfig, changeSize,];
    },
};
const __VLS_86 = {
    /** @type {typeof __VLS_83.sortChange} */
    onSortChange: (__VLS_ctx.handleSortChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_87;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_89 } = __VLS_81.slots;
let __VLS_90;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    prop: "name",
    label: (__VLS_ctx.$t('views.trigger.triggerTask')),
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_92 = __VLS_91({
    prop: "name",
    label: (__VLS_ctx.$t('views.trigger.triggerTask')),
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
const { default: __VLS_95 } = __VLS_93.slots;
{
    const { default: __VLS_96 } = __VLS_93.slots;
    const [{ row }] = __VLS_vSlot(__VLS_96);
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        size: (8),
    }));
    const __VLS_99 = __VLS_98({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    const { default: __VLS_102 } = __VLS_100.slots;
    if (row.source_type === 'TOOL' && !row.source_icon) {
        let __VLS_103;
        /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
        ToolIcon;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
            size: (22),
        }));
        const __VLS_105 = __VLS_104({
            size: (22),
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    }
    else {
        let __VLS_108;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
            shape: "square",
            size: (22),
            ...{ style: {} },
        }));
        const __VLS_110 = __VLS_109({
            shape: "square",
            size: (22),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        const { default: __VLS_113 } = __VLS_111.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.resetUrl(row?.source_icon, __VLS_ctx.resetUrl('./favicon.ico'))),
            alt: "",
        });
        // @ts-ignore
        [$t, handleSortChange, vLoading, loading, resetUrl, resetUrl,];
        var __VLS_111;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.source_name);
    // @ts-ignore
    [];
    var __VLS_100;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_93;
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    prop: "source_type",
    width: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('common.type')),
}));
const __VLS_116 = __VLS_115({
    prop: "source_type",
    width: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('common.type')),
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
const { default: __VLS_119 } = __VLS_117.slots;
{
    const { default: __VLS_120 } = __VLS_117.slots;
    const [{ row }] = __VLS_vSlot(__VLS_120);
    (row.source_type === 'APPLICATION'
        ? __VLS_ctx.$t('views.application.title')
        : __VLS_ctx.$t('views.tool.title'));
    // @ts-ignore
    [$t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_117;
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    prop: "state",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}));
const __VLS_123 = __VLS_122({
    prop: "state",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
const { default: __VLS_126 } = __VLS_124.slots;
{
    const { default: __VLS_127 } = __VLS_124.slots;
    const [{ row }] = __VLS_vSlot(__VLS_127);
    if (row.state === 'SUCCESS') {
        let __VLS_128;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_130 = __VLS_129({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_133 } = __VLS_131.slots;
        let __VLS_134;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
            ...{ class: "color-success" },
        }));
        const __VLS_136 = __VLS_135({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_139 } = __VLS_137.slots;
        let __VLS_140;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({}));
        const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
        // @ts-ignore
        [$t,];
        var __VLS_137;
        (__VLS_ctx.$t('common.status.success'));
        // @ts-ignore
        [$t,];
        var __VLS_131;
    }
    else if (row.state === 'FAILURE') {
        let __VLS_145;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_147 = __VLS_146({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_150 } = __VLS_148.slots;
        let __VLS_151;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
            ...{ class: "color-danger" },
        }));
        const __VLS_153 = __VLS_152({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_152));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_156 } = __VLS_154.slots;
        let __VLS_157;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({}));
        const __VLS_159 = __VLS_158({}, ...__VLS_functionalComponentArgsRest(__VLS_158));
        // @ts-ignore
        [];
        var __VLS_154;
        (__VLS_ctx.$t('common.status.fail'));
        // @ts-ignore
        [$t,];
        var __VLS_148;
    }
    else if (row.state === 'REVOKED') {
        let __VLS_162;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_164 = __VLS_163({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_163));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_167 } = __VLS_165.slots;
        let __VLS_168;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
            ...{ class: "color-danger" },
        }));
        const __VLS_170 = __VLS_169({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_173 } = __VLS_171.slots;
        let __VLS_174;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({}));
        const __VLS_176 = __VLS_175({}, ...__VLS_functionalComponentArgsRest(__VLS_175));
        // @ts-ignore
        [];
        var __VLS_171;
        (__VLS_ctx.$t('common.status.REVOKED'));
        // @ts-ignore
        [$t,];
        var __VLS_165;
    }
    else if (row.state === 'REVOKE') {
        let __VLS_179;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_181 = __VLS_180({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_180));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_184 } = __VLS_182.slots;
        let __VLS_185;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_187 = __VLS_186({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_186));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_190 } = __VLS_188.slots;
        let __VLS_191;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({}));
        const __VLS_193 = __VLS_192({}, ...__VLS_functionalComponentArgsRest(__VLS_192));
        // @ts-ignore
        [];
        var __VLS_188;
        (__VLS_ctx.$t('common.status.REVOKE'));
        // @ts-ignore
        [$t,];
        var __VLS_182;
    }
    else {
        let __VLS_196;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_198 = __VLS_197({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_201 } = __VLS_199.slots;
        let __VLS_202;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_204 = __VLS_203({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_203));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_207 } = __VLS_205.slots;
        let __VLS_208;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({}));
        const __VLS_210 = __VLS_209({}, ...__VLS_functionalComponentArgsRest(__VLS_209));
        // @ts-ignore
        [];
        var __VLS_205;
        (__VLS_ctx.$t('common.status.STARTED'));
        // @ts-ignore
        [$t,];
        var __VLS_199;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_124;
let __VLS_213;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
    prop: "run_time",
    label: (__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime')),
}));
const __VLS_215 = __VLS_214({
    prop: "run_time",
    label: (__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime')),
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
const { default: __VLS_218 } = __VLS_216.slots;
{
    const { default: __VLS_219 } = __VLS_216.slots;
    const [{ row }] = __VLS_vSlot(__VLS_219);
    (row.run_time != undefined ? row.run_time?.toFixed(2) + 's' : '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_216;
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    sortable: true,
    prop: "create_time",
    label: (__VLS_ctx.$t('aiChat.executionDetails.createTime')),
    width: "180",
}));
const __VLS_222 = __VLS_221({
    sortable: true,
    prop: "create_time",
    label: (__VLS_ctx.$t('aiChat.executionDetails.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const { default: __VLS_225 } = __VLS_223.slots;
{
    const { default: __VLS_226 } = __VLS_223.slots;
    const [{ row }] = __VLS_vSlot(__VLS_226);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_223;
let __VLS_227;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
    label: (__VLS_ctx.$t('common.operation')),
    width: "90",
}));
const __VLS_229 = __VLS_228({
    label: (__VLS_ctx.$t('common.operation')),
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
const { default: __VLS_232 } = __VLS_230.slots;
{
    const { default: __VLS_233 } = __VLS_230.slots;
    const [{ row }] = __VLS_vSlot(__VLS_233);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_234;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.executionDetails.title')),
        placement: "top",
    }));
    const __VLS_236 = __VLS_235({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.executionDetails.title')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    const { default: __VLS_239 } = __VLS_237.slots;
    let __VLS_240;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_242 = __VLS_241({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    let __VLS_245;
    const __VLS_246 = {
        /** @type {typeof __VLS_245.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.toDetails(row);
            // @ts-ignore
            [$t, $t, toDetails,];
        },
    };
    const { default: __VLS_247 } = __VLS_243.slots;
    let __VLS_248;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
        iconName: "app-operate-log",
    }));
    const __VLS_250 = __VLS_249({
        iconName: "app-operate-log",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    // @ts-ignore
    [];
    var __VLS_243;
    var __VLS_244;
    // @ts-ignore
    [];
    var __VLS_237;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_230;
// @ts-ignore
[];
var __VLS_81;
var __VLS_82;
const __VLS_253 = ExecutionDetailDrawer;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
    ref: "ExecutionDetailDrawerRef",
    currentId: (__VLS_ctx.currentId),
    currentContent: (__VLS_ctx.currentContent),
    next: (__VLS_ctx.nextRecord),
    pre: (__VLS_ctx.preRecord),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}));
const __VLS_255 = __VLS_254({
    ref: "ExecutionDetailDrawerRef",
    currentId: (__VLS_ctx.currentId),
    currentContent: (__VLS_ctx.currentContent),
    next: (__VLS_ctx.nextRecord),
    pre: (__VLS_ctx.preRecord),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
var __VLS_258;
var __VLS_256;
// @ts-ignore
[currentId, currentContent, nextRecord, preRecord, pre_disable, next_disable,];
var __VLS_3;
// @ts-ignore
var __VLS_88 = __VLS_87, __VLS_259 = __VLS_258;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
