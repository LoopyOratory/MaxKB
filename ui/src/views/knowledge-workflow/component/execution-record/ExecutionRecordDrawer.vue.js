/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import ExecutionDetailDrawer from './ExecutionDetailDrawer.vue';
import { computed, ref, reactive, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { datetimeFormat } from '@/utils/time';
import { MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
const drawer = ref(false);
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
const paginationConfig = reactive({
    current_page: 1,
    page_size: 10,
    total: 0,
});
const query = ref({
    user_name: '',
    state: '',
});
const loading = ref(false);
const filter_type = ref('user_name');
const active_knowledge_id = ref('');
const tableData = ref([]);
const ExecutionDetailDrawerRef = ref();
const currentId = ref('');
const currentContent = ref('');
const toDetails = (row) => {
    currentContent.value = row;
    currentId.value = row.id;
    ExecutionDetailDrawerRef.value?.open();
};
const cancelExecution = (row) => {
    MsgConfirm(t('common.tip'), t('aiChat.executionDetails.cancelExecutionTip'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    }).then(() => {
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .cancelWorkflowAction(active_knowledge_id.value, row.id, loading)
            .then((ok) => { });
    });
};
const changeFilterHandle = () => {
    query.value = { user_name: '', status: '' };
};
const changeSize = () => {
    paginationConfig.current_page = 1;
    getList();
};
const getList = (isLoading) => {
    return loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .getWorkflowActionPage(active_knowledge_id.value, paginationConfig, query.value, isLoading ? loading : undefined)
        .then((ok) => {
        paginationConfig.total = ok.data?.total;
        tableData.value = ok.data.records;
    });
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
const interval = ref();
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
const open = (knowledge_id) => {
    interval.value = setInterval(() => {
        getList(false);
    }, 6000);
    active_knowledge_id.value = knowledge_id;
    getList(true);
    drawer.value = true;
};
const close = () => {
    paginationConfig.current_page = 1;
    paginationConfig.total = 0;
    tableData.value = [];
    drawer.value = false;
    if (interval.value) {
        clearInterval(interval.value);
    }
};
onBeforeUnmount(() => {
    if (interval.value) {
        clearInterval(interval.value);
    }
});
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
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawer),
    title: (__VLS_ctx.$t('common.ExecutionRecord.title')),
    direction: "rtl",
    size: "800px",
    beforeClose: (__VLS_ctx.close),
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
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
    modelValue: (__VLS_ctx.filter_type),
    ...{ class: "complex-search__left" },
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filter_type),
    ...{ class: "complex-search__left" },
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
    label: (__VLS_ctx.$t('workflow.initiator')),
    value: "user_name",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('workflow.initiator')),
    value: "user_name",
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
// @ts-ignore
[drawer, $t, $t, $t, close, filter_type, changeFilterHandle,];
var __VLS_10;
var __VLS_11;
if (__VLS_ctx.filter_type === 'state') {
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.state),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.state),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        /** @type {typeof __VLS_30.change} */
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.filter_type === 'state'))
                throw 0;
            return __VLS_ctx.getList(true);
            // @ts-ignore
            [filter_type, query, getList,];
        },
    };
    const { default: __VLS_32 } = __VLS_28.slots;
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        label: (__VLS_ctx.$t('common.status.success')),
        value: "SUCCESS",
    }));
    const __VLS_35 = __VLS_34({
        label: (__VLS_ctx.$t('common.status.success')),
        value: "SUCCESS",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        label: (__VLS_ctx.$t('common.status.fail')),
        value: "FAILURE",
    }));
    const __VLS_40 = __VLS_39({
        label: (__VLS_ctx.$t('common.status.fail')),
        value: "FAILURE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        label: (__VLS_ctx.$t('common.status.STARTED')),
        value: "STARTED",
    }));
    const __VLS_45 = __VLS_44({
        label: (__VLS_ctx.$t('common.status.STARTED')),
        value: "STARTED",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        label: (__VLS_ctx.$t('common.status.REVOKED')),
        value: "REVOKED",
    }));
    const __VLS_50 = __VLS_49({
        label: (__VLS_ctx.$t('common.status.REVOKED')),
        value: "REVOKED",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    // @ts-ignore
    [$t, $t, $t, $t,];
    var __VLS_28;
    var __VLS_29;
}
else {
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.user_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.user_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_58;
    const __VLS_59 = {
        /** @type {typeof __VLS_58.change} */
        onChange: (...[$event]) => {
            if (!!(__VLS_ctx.filter_type === 'state'))
                throw 0;
            return __VLS_ctx.getList(true);
            // @ts-ignore
            [$t, query, getList,];
        },
    };
    var __VLS_56;
    var __VLS_57;
}
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16 document-table" },
    data: (__VLS_ctx.tableData),
    maxTableHeight: (200),
    paginationConfig: (__VLS_ctx.paginationConfig),
    rowKey: ((row) => row.id),
}));
const __VLS_62 = __VLS_61({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16 document-table" },
    data: (__VLS_ctx.tableData),
    maxTableHeight: (200),
    paginationConfig: (__VLS_ctx.paginationConfig),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_65;
const __VLS_66 = {
    /** @type {typeof __VLS_65.sizeChange} */
    onSizeChange: (__VLS_ctx.changeSize),
};
const __VLS_67 = {
    /** @type {typeof __VLS_65.changePage} */
    onChangePage: (...[$event]) => {
        return __VLS_ctx.getList(true);
        // @ts-ignore
        [getList, tableData, paginationConfig, changeSize,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_68;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['document-table']} */ ;
const { default: __VLS_70 } = __VLS_63.slots;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    prop: "user_name",
    label: (__VLS_ctx.$t('workflow.initiator')),
}));
const __VLS_73 = __VLS_72({
    prop: "user_name",
    label: (__VLS_ctx.$t('workflow.initiator')),
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
{
    const { default: __VLS_77 } = __VLS_74.slots;
    const [{ row }] = __VLS_vSlot(__VLS_77);
    (row.meta.user_name);
    // @ts-ignore
    [$t, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_74;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    prop: "state",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "180",
}));
const __VLS_80 = __VLS_79({
    prop: "state",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
{
    const { default: __VLS_84 } = __VLS_81.slots;
    const [{ row }] = __VLS_vSlot(__VLS_84);
    if (row.state === 'SUCCESS') {
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_87 = __VLS_86({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_90 } = __VLS_88.slots;
        let __VLS_91;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
            ...{ class: "color-success" },
        }));
        const __VLS_93 = __VLS_92({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_96 } = __VLS_94.slots;
        let __VLS_97;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({}));
        const __VLS_99 = __VLS_98({}, ...__VLS_functionalComponentArgsRest(__VLS_98));
        // @ts-ignore
        [$t,];
        var __VLS_94;
        (__VLS_ctx.$t('common.status.success'));
        // @ts-ignore
        [$t,];
        var __VLS_88;
    }
    else if (row.state === 'FAILURE') {
        let __VLS_102;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_104 = __VLS_103({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_103));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_107 } = __VLS_105.slots;
        let __VLS_108;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
            ...{ class: "color-danger" },
        }));
        const __VLS_110 = __VLS_109({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_113 } = __VLS_111.slots;
        let __VLS_114;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({}));
        const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
        // @ts-ignore
        [];
        var __VLS_111;
        (__VLS_ctx.$t('common.status.fail'));
        // @ts-ignore
        [$t,];
        var __VLS_105;
    }
    else if (row.state === 'REVOKED') {
        let __VLS_119;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_121 = __VLS_120({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_120));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_124 } = __VLS_122.slots;
        let __VLS_125;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
            ...{ class: "color-danger" },
        }));
        const __VLS_127 = __VLS_126({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_130 } = __VLS_128.slots;
        let __VLS_131;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({}));
        const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
        // @ts-ignore
        [];
        var __VLS_128;
        (__VLS_ctx.$t('common.status.REVOKED'));
        // @ts-ignore
        [$t,];
        var __VLS_122;
    }
    else if (row.state === 'REVOKE') {
        let __VLS_136;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_138 = __VLS_137({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_141 } = __VLS_139.slots;
        let __VLS_142;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_144 = __VLS_143({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_143));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_147 } = __VLS_145.slots;
        let __VLS_148;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({}));
        const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
        // @ts-ignore
        [];
        var __VLS_145;
        (__VLS_ctx.$t('common.status.REVOKE'));
        // @ts-ignore
        [$t,];
        var __VLS_139;
    }
    else {
        let __VLS_153;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_155 = __VLS_154({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_158 } = __VLS_156.slots;
        let __VLS_159;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_161 = __VLS_160({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_160));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_164 } = __VLS_162.slots;
        let __VLS_165;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({}));
        const __VLS_167 = __VLS_166({}, ...__VLS_functionalComponentArgsRest(__VLS_166));
        // @ts-ignore
        [];
        var __VLS_162;
        (__VLS_ctx.$t('common.status.STARTED'));
        // @ts-ignore
        [$t,];
        var __VLS_156;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_81;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    prop: "run_time",
    label: (__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime')),
}));
const __VLS_172 = __VLS_171({
    prop: "run_time",
    label: (__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime')),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
const { default: __VLS_175 } = __VLS_173.slots;
{
    const { default: __VLS_176 } = __VLS_173.slots;
    const [{ row }] = __VLS_vSlot(__VLS_176);
    (row.run_time != undefined ? row.run_time?.toFixed(2) + 's' : '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_173;
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    prop: "create_time",
    label: (__VLS_ctx.$t('aiChat.executionDetails.createTime')),
    width: "180",
}));
const __VLS_179 = __VLS_178({
    prop: "create_time",
    label: (__VLS_ctx.$t('aiChat.executionDetails.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
const { default: __VLS_182 } = __VLS_180.slots;
{
    const { default: __VLS_183 } = __VLS_180.slots;
    const [{ row }] = __VLS_vSlot(__VLS_183);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_180;
let __VLS_184;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
    label: (__VLS_ctx.$t('common.operation')),
    width: "90",
}));
const __VLS_186 = __VLS_185({
    label: (__VLS_ctx.$t('common.operation')),
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
const { default: __VLS_189 } = __VLS_187.slots;
{
    const { default: __VLS_190 } = __VLS_187.slots;
    const [{ row }] = __VLS_vSlot(__VLS_190);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_191;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.executionDetails.title')),
        placement: "top",
    }));
    const __VLS_193 = __VLS_192({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.executionDetails.title')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_192));
    const { default: __VLS_196 } = __VLS_194.slots;
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_199 = __VLS_198({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    let __VLS_202;
    const __VLS_203 = {
        /** @type {typeof __VLS_202.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.toDetails(row);
            // @ts-ignore
            [$t, $t, toDetails,];
        },
    };
    const { default: __VLS_204 } = __VLS_200.slots;
    let __VLS_205;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
        iconName: "app-operate-log",
    }));
    const __VLS_207 = __VLS_206({
        iconName: "app-operate-log",
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    // @ts-ignore
    [];
    var __VLS_200;
    var __VLS_201;
    // @ts-ignore
    [];
    var __VLS_194;
    if (['PADDING', 'STARTED'].includes(row.state)) {
        let __VLS_210;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.executionDetails.cancel')),
            placement: "top",
        }));
        const __VLS_212 = __VLS_211({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.executionDetails.cancel')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_211));
        const { default: __VLS_215 } = __VLS_213.slots;
        let __VLS_216;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
            ...{ 'onClick': {} },
            type: "danger",
            text: true,
        }));
        const __VLS_218 = __VLS_217({
            ...{ 'onClick': {} },
            type: "danger",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        let __VLS_221;
        const __VLS_222 = {
            /** @type {typeof __VLS_221.click} */
            onClick: (...[$event]) => {
                if (!(['PADDING', 'STARTED'].includes(row.state)))
                    throw 0;
                return __VLS_ctx.cancelExecution(row);
                // @ts-ignore
                [$t, cancelExecution,];
            },
        };
        const { default: __VLS_223 } = __VLS_219.slots;
        let __VLS_224;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({}));
        const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
        const { default: __VLS_229 } = __VLS_227.slots;
        let __VLS_230;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({}));
        const __VLS_232 = __VLS_231({}, ...__VLS_functionalComponentArgsRest(__VLS_231));
        // @ts-ignore
        [];
        var __VLS_227;
        // @ts-ignore
        [];
        var __VLS_219;
        var __VLS_220;
        // @ts-ignore
        [];
        var __VLS_213;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_187;
// @ts-ignore
[];
var __VLS_63;
var __VLS_64;
const __VLS_235 = ExecutionDetailDrawer;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
    ref: "ExecutionDetailDrawerRef",
    currentId: (__VLS_ctx.currentId),
    currentContent: (__VLS_ctx.currentContent),
    next: (__VLS_ctx.nextRecord),
    pre: (__VLS_ctx.preRecord),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}));
const __VLS_237 = __VLS_236({
    ref: "ExecutionDetailDrawerRef",
    currentId: (__VLS_ctx.currentId),
    currentContent: (__VLS_ctx.currentContent),
    next: (__VLS_ctx.nextRecord),
    pre: (__VLS_ctx.preRecord),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
var __VLS_240;
var __VLS_238;
// @ts-ignore
[currentId, currentContent, nextRecord, preRecord, pre_disable, next_disable,];
var __VLS_3;
// @ts-ignore
var __VLS_69 = __VLS_68, __VLS_241 = __VLS_240;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
