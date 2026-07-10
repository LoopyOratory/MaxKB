/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, computed } from 'vue';
import { resetUrl } from '@/utils/common';
import { datetimeFormat } from '@/utils/time';
import ExecutionDetailDrawer from './ExecutionDetailDrawer.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import { useRoute } from 'vue-router';
const route = useRoute();
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
const searchType = ref('source_name');
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
    order: '',
});
const loading = ref(false);
const current_trigger_id = ref();
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
        return loadSharedApi({ type: 'tool', systemType: apiType.value })
            .pageToolRecord(current_trigger_id.value, paginationConfig, { ...query.value }, isLoading ? loading : undefined)
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
const open = (tool) => {
    current_trigger_id.value = tool.id;
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
    label: (__VLS_ctx.$t('views.trigger.triggerSource')),
    value: "source_name",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.trigger.triggerSource')),
    value: "source_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    label: (__VLS_ctx.$t('common.type')),
    value: "source_type",
}));
const __VLS_22 = __VLS_21({
    label: (__VLS_ctx.$t('common.type')),
    value: "source_type",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "state",
}));
const __VLS_27 = __VLS_26({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "state",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
// @ts-ignore
[drawer, $t, $t, $t, $t, close, searchType, changeFilterHandle,];
var __VLS_10;
var __VLS_11;
if (__VLS_ctx.searchType === 'source_name') {
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.source_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.source_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.change} */
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.searchType === 'source_name'))
                throw 0;
            return __VLS_ctx.getList(true);
            // @ts-ignore
            [$t, searchType, query, getList,];
        },
    };
    var __VLS_33;
    var __VLS_34;
}
else if (__VLS_ctx.searchType === 'state') {
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
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
    const __VLS_39 = __VLS_38({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.state),
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
            if (!!(__VLS_ctx.searchType === 'source_name'))
                throw 0;
            if (!(__VLS_ctx.searchType === 'state'))
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
        label: (__VLS_ctx.$t('common.status.success')),
        value: "SUCCESS",
    }));
    const __VLS_47 = __VLS_46({
        label: (__VLS_ctx.$t('common.status.success')),
        value: "SUCCESS",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        label: (__VLS_ctx.$t('common.status.STARTED')),
        value: "STARTED",
    }));
    const __VLS_52 = __VLS_51({
        label: (__VLS_ctx.$t('common.status.STARTED')),
        value: "STARTED",
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        label: (__VLS_ctx.$t('common.status.fail')),
        value: "FAILURE",
    }));
    const __VLS_57 = __VLS_56({
        label: (__VLS_ctx.$t('common.status.fail')),
        value: "FAILURE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    // @ts-ignore
    [$t, $t, $t,];
    var __VLS_40;
    var __VLS_41;
}
else {
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
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
    const __VLS_62 = __VLS_61({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.source_type),
        filterable: true,
        clearable: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.search')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_65;
    const __VLS_66 = {
        /** @type {typeof __VLS_65.change} */
        onChange: (...[$event]) => {
            if (!!(__VLS_ctx.searchType === 'source_name'))
                throw 0;
            if (!!(__VLS_ctx.searchType === 'state'))
                throw 0;
            return __VLS_ctx.getList(true);
            // @ts-ignore
            [$t, query, getList,];
        },
    };
    const { default: __VLS_67 } = __VLS_63.slots;
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        label: (__VLS_ctx.$t('views.application.title')),
        value: "APPLICATION",
    }));
    const __VLS_70 = __VLS_69({
        label: (__VLS_ctx.$t('views.application.title')),
        value: "APPLICATION",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_73;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
        label: (__VLS_ctx.$t('views.knowledge.title')),
        value: "KNOWLEDGE",
    }));
    const __VLS_75 = __VLS_74({
        label: (__VLS_ctx.$t('views.knowledge.title')),
        value: "KNOWLEDGE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        label: (__VLS_ctx.$t('views.trigger.title')),
        value: "TRIGGER",
    }));
    const __VLS_80 = __VLS_79({
        label: (__VLS_ctx.$t('views.trigger.title')),
        value: "TRIGGER",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    // @ts-ignore
    [$t, $t, $t,];
    var __VLS_63;
    var __VLS_64;
}
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
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
const __VLS_85 = __VLS_84({
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
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
const __VLS_89 = {
    /** @type {typeof __VLS_88.sizeChange} */
    onSizeChange: (__VLS_ctx.changeSize),
};
const __VLS_90 = {
    /** @type {typeof __VLS_88.changePage} */
    onChangePage: (...[$event]) => {
        return __VLS_ctx.getList(true);
        // @ts-ignore
        [getList, tableData, paginationConfig, changeSize,];
    },
};
const __VLS_91 = {
    /** @type {typeof __VLS_88.sortChange} */
    onSortChange: (__VLS_ctx.handleSortChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_92;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_94 } = __VLS_86.slots;
let __VLS_95;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
    prop: "name",
    label: (__VLS_ctx.$t('views.trigger.triggerSource')),
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_97 = __VLS_96({
    prop: "name",
    label: (__VLS_ctx.$t('views.trigger.triggerSource')),
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const { default: __VLS_100 } = __VLS_98.slots;
{
    const { default: __VLS_101 } = __VLS_98.slots;
    const [{ row }] = __VLS_vSlot(__VLS_101);
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        size: (8),
    }));
    const __VLS_104 = __VLS_103({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    const { default: __VLS_107 } = __VLS_105.slots;
    if (row.source_type === 'KNOWLEDGE') {
        let __VLS_108;
        /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
        KnowledgeIcon;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
            size: (22),
            type: (4),
        }));
        const __VLS_110 = __VLS_109({
            size: (22),
            type: (4),
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    }
    else if (row.source_type === 'TRIGGER') {
        let __VLS_113;
        /** @ts-ignore @type { | typeof __VLS_components.TriggerIcon} */
        TriggerIcon;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
            type: (row.trigger_type),
            size: (22),
        }));
        const __VLS_115 = __VLS_114({
            type: (row.trigger_type),
            size: (22),
        }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    }
    else {
        let __VLS_118;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
            shape: "square",
            size: (22),
            ...{ style: {} },
        }));
        const __VLS_120 = __VLS_119({
            shape: "square",
            size: (22),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_119));
        const { default: __VLS_123 } = __VLS_121.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.resetUrl(row?.source_icon, __VLS_ctx.resetUrl('./favicon.ico'))),
            alt: "",
        });
        // @ts-ignore
        [$t, handleSortChange, vLoading, loading, resetUrl, resetUrl,];
        var __VLS_121;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.source_name);
    // @ts-ignore
    [];
    var __VLS_105;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_98;
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    prop: "source_type",
    width: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('common.type')),
}));
const __VLS_126 = __VLS_125({
    prop: "source_type",
    width: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('common.type')),
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const { default: __VLS_129 } = __VLS_127.slots;
{
    const { default: __VLS_130 } = __VLS_127.slots;
    const [{ row }] = __VLS_vSlot(__VLS_130);
    if (row.source_type === 'APPLICATION') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.application.title'));
    }
    else if (row.source_type === 'KNOWLEDGE') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.knowledge.title'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.trigger.title'));
    }
    // @ts-ignore
    [$t, $t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_127;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    prop: "state",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}));
const __VLS_133 = __VLS_132({
    prop: "state",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
{
    const { default: __VLS_137 } = __VLS_134.slots;
    const [{ row }] = __VLS_vSlot(__VLS_137);
    if (row.state === 'SUCCESS') {
        let __VLS_138;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_140 = __VLS_139({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_143 } = __VLS_141.slots;
        let __VLS_144;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
            ...{ class: "color-success" },
        }));
        const __VLS_146 = __VLS_145({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_149 } = __VLS_147.slots;
        let __VLS_150;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({}));
        const __VLS_152 = __VLS_151({}, ...__VLS_functionalComponentArgsRest(__VLS_151));
        // @ts-ignore
        [$t,];
        var __VLS_147;
        (__VLS_ctx.$t('common.status.success'));
        // @ts-ignore
        [$t,];
        var __VLS_141;
    }
    else if (row.state === 'FAILURE') {
        let __VLS_155;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_157 = __VLS_156({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_156));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_160 } = __VLS_158.slots;
        let __VLS_161;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
            ...{ class: "color-danger" },
        }));
        const __VLS_163 = __VLS_162({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_166 } = __VLS_164.slots;
        let __VLS_167;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({}));
        const __VLS_169 = __VLS_168({}, ...__VLS_functionalComponentArgsRest(__VLS_168));
        // @ts-ignore
        [];
        var __VLS_164;
        (__VLS_ctx.$t('common.status.fail'));
        // @ts-ignore
        [$t,];
        var __VLS_158;
    }
    else if (row.state === 'REVOKED') {
        let __VLS_172;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_174 = __VLS_173({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_177 } = __VLS_175.slots;
        let __VLS_178;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
            ...{ class: "color-danger" },
        }));
        const __VLS_180 = __VLS_179({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_179));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_183 } = __VLS_181.slots;
        let __VLS_184;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({}));
        const __VLS_186 = __VLS_185({}, ...__VLS_functionalComponentArgsRest(__VLS_185));
        // @ts-ignore
        [];
        var __VLS_181;
        (__VLS_ctx.$t('common.status.REVOKED'));
        // @ts-ignore
        [$t,];
        var __VLS_175;
    }
    else if (row.state === 'REVOKE') {
        let __VLS_189;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_191 = __VLS_190({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_190));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_194 } = __VLS_192.slots;
        let __VLS_195;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_197 = __VLS_196({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_196));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_200 } = __VLS_198.slots;
        let __VLS_201;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({}));
        const __VLS_203 = __VLS_202({}, ...__VLS_functionalComponentArgsRest(__VLS_202));
        // @ts-ignore
        [];
        var __VLS_198;
        (__VLS_ctx.$t('common.status.REVOKE'));
        // @ts-ignore
        [$t,];
        var __VLS_192;
    }
    else {
        let __VLS_206;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_208 = __VLS_207({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_207));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_211 } = __VLS_209.slots;
        let __VLS_212;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_214 = __VLS_213({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_217 } = __VLS_215.slots;
        let __VLS_218;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({}));
        const __VLS_220 = __VLS_219({}, ...__VLS_functionalComponentArgsRest(__VLS_219));
        // @ts-ignore
        [];
        var __VLS_215;
        (__VLS_ctx.$t('common.status.STARTED'));
        // @ts-ignore
        [$t,];
        var __VLS_209;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_134;
let __VLS_223;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
    prop: "run_time",
    label: (__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime')),
}));
const __VLS_225 = __VLS_224({
    prop: "run_time",
    label: (__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime')),
}, ...__VLS_functionalComponentArgsRest(__VLS_224));
const { default: __VLS_228 } = __VLS_226.slots;
{
    const { default: __VLS_229 } = __VLS_226.slots;
    const [{ row }] = __VLS_vSlot(__VLS_229);
    (row.run_time != undefined ? row.run_time?.toFixed(2) + 's' : '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_226;
if (__VLS_ctx.apiType === 'systemShare') {
    let __VLS_230;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
    }));
    const __VLS_232 = __VLS_231({
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    const { default: __VLS_235 } = __VLS_233.slots;
    {
        const { default: __VLS_236 } = __VLS_233.slots;
        const [{ row }] = __VLS_vSlot(__VLS_236);
        (row.workspace_name);
        // @ts-ignore
        [$t, apiType,];
    }
    // @ts-ignore
    [];
    var __VLS_233;
}
let __VLS_237;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
    sortable: true,
    prop: "create_time",
    label: (__VLS_ctx.$t('aiChat.executionDetails.createTime')),
    width: "180",
}));
const __VLS_239 = __VLS_238({
    sortable: true,
    prop: "create_time",
    label: (__VLS_ctx.$t('aiChat.executionDetails.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
const { default: __VLS_242 } = __VLS_240.slots;
{
    const { default: __VLS_243 } = __VLS_240.slots;
    const [{ row }] = __VLS_vSlot(__VLS_243);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_240;
let __VLS_244;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    label: (__VLS_ctx.$t('common.operation')),
    width: "90",
}));
const __VLS_246 = __VLS_245({
    label: (__VLS_ctx.$t('common.operation')),
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
const { default: __VLS_249 } = __VLS_247.slots;
{
    const { default: __VLS_250 } = __VLS_247.slots;
    const [{ row }] = __VLS_vSlot(__VLS_250);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_251;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_252 = __VLS_asFunctionalComponent1(__VLS_251, new __VLS_251({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.executionDetails.title')),
        placement: "top",
    }));
    const __VLS_253 = __VLS_252({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.executionDetails.title')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_252));
    const { default: __VLS_256 } = __VLS_254.slots;
    let __VLS_257;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_259 = __VLS_258({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    let __VLS_262;
    const __VLS_263 = {
        /** @type {typeof __VLS_262.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.toDetails(row);
            // @ts-ignore
            [$t, $t, toDetails,];
        },
    };
    const { default: __VLS_264 } = __VLS_260.slots;
    let __VLS_265;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
        iconName: "app-operate-log",
    }));
    const __VLS_267 = __VLS_266({
        iconName: "app-operate-log",
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    // @ts-ignore
    [];
    var __VLS_260;
    var __VLS_261;
    // @ts-ignore
    [];
    var __VLS_254;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_247;
// @ts-ignore
[];
var __VLS_86;
var __VLS_87;
const __VLS_270 = ExecutionDetailDrawer;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    ref: "ExecutionDetailDrawerRef",
    currentId: (__VLS_ctx.currentId),
    currentContent: (__VLS_ctx.currentContent),
    next: (__VLS_ctx.nextRecord),
    pre: (__VLS_ctx.preRecord),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}));
const __VLS_272 = __VLS_271({
    ref: "ExecutionDetailDrawerRef",
    currentId: (__VLS_ctx.currentId),
    currentContent: (__VLS_ctx.currentContent),
    next: (__VLS_ctx.nextRecord),
    pre: (__VLS_ctx.preRecord),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
var __VLS_275;
var __VLS_273;
// @ts-ignore
[currentId, currentContent, nextRecord, preRecord, pre_disable, next_disable,];
var __VLS_3;
// @ts-ignore
var __VLS_93 = __VLS_92, __VLS_276 = __VLS_275;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
