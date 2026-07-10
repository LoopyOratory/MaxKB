/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash';
import ChatRecordDrawer from './component/ChatRecordDrawer.vue';
import SelectKnowledgeDocument from '@/components/select-knowledge-document/index.vue';
import { MsgSuccess } from '@/utils/message';
import { beforeDay, datetimeFormat, nowDate } from '@/utils/time';
import { t } from '@/locales';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { Permission } from '@/utils/permission/type';
import { hasPermission } from '@/utils/permission';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap['application'][apiType.value];
});
const { params: { id }, } = route;
const emit = defineEmits(['refresh']);
const search_type = ref('abstract');
const search_form = ref({
    abstract: '',
    username: '',
});
const search_type_change = () => {
    search_form.value = { abstract: '', username: '' };
};
// Define source type enum
var SourceType;
(function (SourceType) {
    SourceType["ONLINE"] = "ONLINE";
    SourceType["API_CALL"] = "API_CALL";
    SourceType["ENTERPRISE_WECHAT"] = "ENTERPRISE_WECHAT";
    SourceType["WECHAT_PUBLIC_ACCOUNT"] = "WECHAT_PUBLIC_ACCOUNT";
    SourceType["LARK"] = "LARK";
    SourceType["DINGTALK"] = "DINGTALK";
    SourceType["ENTERPRISE_WECHAT_ROBOT"] = "ENTERPRISE_WECHAT_ROBOT";
    SourceType["TRIGGER"] = "TRIGGER";
    SourceType["SLACK"] = "SLACK";
})(SourceType || (SourceType = {}));
// Create internationalization key-value mapping
const SOURCE_TYPE_TRANSLATIONS = {
    [SourceType.ONLINE]: 'views.chatLog.online',
    [SourceType.API_CALL]: 'views.chatLog.apiCall',
    [SourceType.ENTERPRISE_WECHAT]: 'views.chatLog.enterpriseWeChat',
    [SourceType.WECHAT_PUBLIC_ACCOUNT]: 'views.chatLog.wechatPublicAccount',
    [SourceType.LARK]: 'views.chatLog.lark',
    [SourceType.DINGTALK]: 'views.chatLog.dingtalk',
    [SourceType.ENTERPRISE_WECHAT_ROBOT]: 'views.chatLog.enterpriseWeChatRobot',
    [SourceType.TRIGGER]: 'views.trigger.title',
    [SourceType.SLACK]: 'views.chatLog.slack',
};
const dayOptions = [
    {
        value: 7,
        label: t('home.pastDayOptions.past7Days'), // Use t MethodToInternationalizationShowText
    },
    {
        value: 30,
        label: t('home.pastDayOptions.past30Days'),
    },
    {
        value: 90,
        label: t('home.pastDayOptions.past90Days'),
    },
    {
        value: 183,
        label: t('home.pastDayOptions.past183Days'),
    },
    {
        value: 'other',
        label: t('common.custom'),
    },
];
const daterangeValue = ref('');
// SubmitDateTime
const daterange = ref({
    start_time: '',
    end_time: '',
});
const multipleTableRef = ref();
const multipleSelection = ref([]);
const ChatRecordRef = ref();
const loading = ref(false);
const documentLoading = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const dialogVisible = ref(false);
const documentDialogVisible = ref(false);
const days = ref(180);
const file_days = ref(180);
const tableData = ref([]);
const tableIndexMap = computed(() => {
    return tableData.value
        .map((row, index) => ({
        [row.id]: index,
    }))
        .reduce((pre, next) => ({ ...pre, ...next }), {});
});
const history_day = ref(7);
const detail = ref(null);
const currentChatId = ref('');
const currentAbstract = ref('');
const popoverVisible = ref(false);
const defaultFilter = {
    min_star: 0,
    min_trample: 0,
    comparer: 'and',
};
const filter = ref({
    min_star: 0,
    min_trample: 0,
    comparer: 'and',
});
const postKnowledgeHandler = (knowledgeList) => {
    return knowledgeList.filter((item) => {
        if (apiType.value === 'workspace') {
            if (item.resource_type === 'folder') {
                return true;
            }
            if (item.resource_type === 'knowledge') {
                return hasPermission([
                    RoleConst.WORKSPACE_MANAGE.getWorkspaceRole(),
                    new Permission('KNOWLEDGE_DOCUMENT:READ+EDIT')
                        .getWorkspacePermissionWorkspaceManageRole,
                    new Permission('KNOWLEDGE_DOCUMENT:READ+EDIT').getWorkspaceResourcePermission('KNOWLEDGE', item.id),
                ], 'OR');
            }
        }
        else if (apiType.value === 'systemManage') {
            return hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_DOCUMENT_EDIT], 'OR');
        }
    });
};
function filterChange(val) {
    if (val === 'clear') {
        filter.value = cloneDeep(defaultFilter);
    }
    getList();
    popoverVisible.value = false;
}
/**
 * Next page
 */
const nextChatRecord = () => {
    let index = tableIndexMap.value[currentChatId.value] + 1;
    if (index >= tableData.value.length) {
        if (index + (paginationConfig.current_page - 1) * paginationConfig.page_size >=
            paginationConfig.total - 1) {
            return;
        }
        paginationConfig.current_page = paginationConfig.current_page + 1;
        getList().then(() => {
            index = 0;
            currentChatId.value = tableData.value[index].id;
            currentAbstract.value = tableData.value[index].abstract;
        });
    }
    else {
        currentChatId.value = tableData.value[index].id;
        currentAbstract.value = tableData.value[index].abstract;
    }
};
const pre_disable = computed(() => {
    const index = tableIndexMap.value[currentChatId.value] - 1;
    return index < 0 && paginationConfig.current_page <= 1;
});
const next_disable = computed(() => {
    const index = tableIndexMap.value[currentChatId.value] + 1;
    return (index >= tableData.value.length &&
        index + (paginationConfig.current_page - 1) * paginationConfig.page_size >=
            paginationConfig.total - 1);
});
/**
 * Previous page
 */
const preChatRecord = () => {
    let index = tableIndexMap.value[currentChatId.value] - 1;
    if (index < 0) {
        if (paginationConfig.current_page <= 1) {
            return;
        }
        paginationConfig.current_page = paginationConfig.current_page - 1;
        getList().then(() => {
            index = paginationConfig.page_size - 1;
            currentChatId.value = tableData.value[index].id;
            currentAbstract.value = tableData.value[index].abstract;
        });
    }
    else {
        currentChatId.value = tableData.value[index].id;
        currentAbstract.value = tableData.value[index].abstract;
    }
};
function rowClickHandle(row, column) {
    if (column && column.type === 'selection') {
        return;
    }
    currentChatId.value = row.id;
    currentAbstract.value = row.abstract;
    ChatRecordRef.value.open();
}
const setRowClass = ({ row }) => {
    return currentChatId.value === row?.id ? 'highlight' : '';
};
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
};
function getList() {
    const obj = {
        start_time: daterange.value.start_time,
        end_time: daterange.value.end_time,
        ...filter.value,
    };
    if (search_form.value[search_type.value]) {
        obj[search_type.value] = search_form.value[search_type.value];
    }
    return loadSharedApi({ type: 'chatLog', systemType: apiType.value })
        .getChatLog(id, paginationConfig, obj, loading)
        .then((res) => {
        tableData.value = res.data.records;
        if (currentChatId.value) {
            currentChatId.value = tableData.value[0]?.id;
        }
        paginationConfig.total = res.data.total;
    });
}
function getDetail(isLoading = false) {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getApplicationDetail(id, isLoading ? loading : undefined)
        .then((res) => {
        detail.value = res.data;
        days.value = res.data.clean_time;
        file_days.value = res.data.file_clean_time;
    });
}
const exportLog = () => {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    if (detail.value) {
        const obj = {
            start_time: daterange.value.start_time,
            end_time: daterange.value.end_time,
            ...filter.value,
        };
        if (search_form.value[search_type.value]) {
            obj[search_type.value] = search_form.value[search_type.value];
        }
        loadSharedApi({ type: 'chatLog', systemType: apiType.value }).postExportChatLog(detail.value.id, detail.value.name, obj, { select_ids: arr }, loading);
    }
};
function refresh() {
    getList();
}
function changeDayRangeHandle(val) {
    daterange.value.start_time = val[0];
    daterange.value.end_time = val[1];
    getList();
}
function changeDayHandle(val) {
    if (val !== 'other') {
        daterange.value.start_time = beforeDay(val);
        daterange.value.end_time = nowDate;
        getList();
    }
}
function saveCleanTime() {
    if (file_days.value > days.value) {
        file_days.value = days.value;
    }
    const obj = {
        clean_time: days.value,
        file_clean_time: file_days.value,
    };
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .putApplication(id, obj, loading)
        .then(() => {
        MsgSuccess(t('common.saveSuccess'));
        dialogVisible.value = false;
        getDetail(true);
    })
        .catch(() => {
        dialogVisible.value = false;
    });
}
const SelectKnowledgeDocumentRef = ref();
const submitForm = async () => {
    if (await SelectKnowledgeDocumentRef.value?.validate()) {
        const arr = [];
        multipleSelection.value.map((v) => {
            if (v) {
                arr.push(v.id);
            }
        });
        const obj = {
            ...SelectKnowledgeDocumentRef.value.form,
            chat_ids: arr,
        };
        loadSharedApi({ type: 'chatLog', systemType: apiType.value })
            .postChatLogAddKnowledge(id, obj, documentLoading)
            .then((res) => {
            multipleTableRef.value?.clearSelection();
            documentDialogVisible.value = false;
        });
    }
};
function openDocumentDialog() {
    SelectKnowledgeDocumentRef.value?.clearValidate();
    documentDialogVisible.value = true;
}
const getSourceTypeName = (sourceType) => {
    if (!sourceType)
        return '-';
    const translationKey = SOURCE_TYPE_TRANSLATIONS[sourceType];
    return translationKey ? t(translationKey) : '-';
};
onMounted(() => {
    changeDayHandle(history_day.value);
    getDetail();
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.chatLog.title'));
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
    ...{ class: "mb-16 flex-between" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search_type),
    ...{ class: "complex-search__left" },
    ...{ style: {} },
}));
const __VLS_8 = __VLS_7({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search_type),
    ...{ class: "complex-search__left" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_13 } = __VLS_9.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    label: (__VLS_ctx.$t('views.chatLog.table.abstract')),
    value: "abstract",
}));
const __VLS_16 = __VLS_15({
    label: (__VLS_ctx.$t('views.chatLog.table.abstract')),
    value: "abstract",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: (__VLS_ctx.$t('views.chatLog.table.user')),
    value: "username",
}));
const __VLS_21 = __VLS_20({
    label: (__VLS_ctx.$t('views.chatLog.table.user')),
    value: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[$t, $t, $t, search_type, search_type_change,];
var __VLS_9;
var __VLS_10;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search_form[__VLS_ctx.search_type]),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ class: "w-240" },
    clearable: true,
}));
const __VLS_26 = __VLS_25({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search_form[__VLS_ctx.search_type]),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ class: "w-240" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
const __VLS_30 = {
    /** @type {typeof __VLS_29.change} */
    onChange: (__VLS_ctx.getList),
};
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
var __VLS_27;
var __VLS_28;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "ml-12 w-180" },
}));
const __VLS_33 = __VLS_32({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "ml-12 w-180" },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_36;
const __VLS_37 = {
    /** @type {typeof __VLS_36.change} */
    onChange: (__VLS_ctx.changeDayHandle),
};
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-180']} */ ;
const { default: __VLS_38 } = __VLS_34.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.dayOptions))) {
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_41 = __VLS_40({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    // @ts-ignore
    [$t, search_type, search_form, getList, history_day, changeDayHandle, dayOptions,];
}
// @ts-ignore
[];
var __VLS_34;
var __VLS_35;
if (__VLS_ctx.history_day === 'other') {
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
    elDatePicker;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        ...{ style: {} },
        ...{ class: "mr-12" },
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
        ...{ style: {} },
        ...{ class: "mr-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_49;
    const __VLS_50 = {
        /** @type {typeof __VLS_49.change} */
        onChange: (__VLS_ctx.changeDayRangeHandle),
    };
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    var __VLS_47;
    var __VLS_48;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
    ...{ class: "float-right" },
});
/** @type {__VLS_StyleScopedClasses['float-right']} */ ;
if (__VLS_ctx.permissionPrecise.chat_log_clear(__VLS_ctx.id)) {
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.permissionPrecise.chat_log_clear(__VLS_ctx.id)))
                throw 0;
            return __VLS_ctx.dialogVisible = true;
            // @ts-ignore
            [$t, $t, history_day, daterangeValue, changeDayRangeHandle, permissionPrecise, id, dialogVisible,];
        },
    };
    const { default: __VLS_58 } = __VLS_54.slots;
    (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy'));
    // @ts-ignore
    [$t,];
    var __VLS_54;
    var __VLS_55;
}
if (__VLS_ctx.permissionPrecise.chat_log_export(__VLS_ctx.id)) {
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (__VLS_ctx.exportLog),
    };
    const { default: __VLS_66 } = __VLS_62.slots;
    (__VLS_ctx.$t('common.export'));
    // @ts-ignore
    [$t, permissionPrecise, id, exportLog,];
    var __VLS_62;
    var __VLS_63;
}
if (__VLS_ctx.permissionPrecise.chat_log_add_knowledge(__VLS_ctx.id)) {
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_69 = __VLS_68({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    let __VLS_72;
    const __VLS_73 = {
        /** @type {typeof __VLS_72.click} */
        onClick: (__VLS_ctx.openDocumentDialog),
    };
    const { default: __VLS_74 } = __VLS_70.slots;
    (__VLS_ctx.$t('views.chatLog.addToKnowledge'));
    // @ts-ignore
    [$t, permissionPrecise, id, multipleSelection, openDocumentDialog,];
    var __VLS_70;
    var __VLS_71;
}
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onRowClick': {} },
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    rowClassName: (__VLS_ctx.setRowClass),
    ...{ class: "log-table" },
    ref: "multipleTableRef",
}));
const __VLS_77 = __VLS_76({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onRowClick': {} },
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    rowClassName: (__VLS_ctx.setRowClass),
    ...{ class: "log-table" },
    ref: "multipleTableRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
let __VLS_80;
const __VLS_81 = {
    /** @type {typeof __VLS_80.sizeChange} */
    onSizeChange: (__VLS_ctx.getList),
};
const __VLS_82 = {
    /** @type {typeof __VLS_80.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_83 = {
    /** @type {typeof __VLS_80.rowClick} */
    onRowClick: (__VLS_ctx.rowClickHandle),
};
const __VLS_84 = {
    /** @type {typeof __VLS_80.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_85;
/** @type {__VLS_StyleScopedClasses['log-table']} */ ;
const { default: __VLS_87 } = __VLS_78.slots;
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    type: "selection",
    width: "55",
}));
const __VLS_90 = __VLS_89({
    type: "selection",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    prop: "abstract",
    label: (__VLS_ctx.$t('views.chatLog.table.abstract')),
    showOverflowTooltip: true,
}));
const __VLS_95 = __VLS_94({
    prop: "abstract",
    label: (__VLS_ctx.$t('views.chatLog.table.abstract')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    prop: "chat_record_count",
    label: (__VLS_ctx.$t('views.chatLog.table.chat_record_count')),
    align: "right",
}));
const __VLS_100 = __VLS_99({
    prop: "chat_record_count",
    label: (__VLS_ctx.$t('views.chatLog.table.chat_record_count')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    prop: "star_num",
    align: "right",
}));
const __VLS_105 = __VLS_104({
    prop: "star_num",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const { default: __VLS_108 } = __VLS_106.slots;
{
    const { header: __VLS_109 } = __VLS_106.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.chatLog.table.feedback.label'));
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
    elPopover;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        width: (200),
        trigger: "click",
        visible: (__VLS_ctx.popoverVisible),
        persistent: (false),
    }));
    const __VLS_112 = __VLS_111({
        width: (200),
        trigger: "click",
        visible: (__VLS_ctx.popoverVisible),
        persistent: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    const { default: __VLS_115 } = __VLS_113.slots;
    {
        const { reference: __VLS_116 } = __VLS_113.slots;
        let __VLS_117;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            ...{ 'onClick': {} },
            ...{ style: {} },
            type: (__VLS_ctx.filter.min_star || __VLS_ctx.filter.min_trample ? 'primary' : ''),
            link: true,
        }));
        const __VLS_119 = __VLS_118({
            ...{ 'onClick': {} },
            ...{ style: {} },
            type: (__VLS_ctx.filter.min_star || __VLS_ctx.filter.min_trample ? 'primary' : ''),
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        let __VLS_122;
        const __VLS_123 = {
            /** @type {typeof __VLS_122.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.popoverVisible = !__VLS_ctx.popoverVisible;
                // @ts-ignore
                [$t, $t, $t, getList, getList, tableData, paginationConfig, setRowClass, rowClickHandle, handleSelectionChange, vLoading, loading, popoverVisible, popoverVisible, popoverVisible, filter, filter,];
            },
        };
        const { default: __VLS_124 } = __VLS_120.slots;
        let __VLS_125;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({}));
        const __VLS_127 = __VLS_126({}, ...__VLS_functionalComponentArgsRest(__VLS_126));
        const { default: __VLS_130 } = __VLS_128.slots;
        let __VLS_131;
        /** @ts-ignore @type { | typeof __VLS_components.Filter} */
        Filter;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({}));
        const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
        // @ts-ignore
        [];
        var __VLS_128;
        // @ts-ignore
        [];
        var __VLS_120;
        var __VLS_121;
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "filter" },
    });
    /** @type {__VLS_StyleScopedClasses['filter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-item mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    (__VLS_ctx.$t('views.chatLog.table.feedback.star'));
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        modelValue: (__VLS_ctx.filter.min_star),
        min: (0),
        step: (1),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ style: {} },
        size: "small",
        stepStrictly: true,
    }));
    const __VLS_138 = __VLS_137({
        modelValue: (__VLS_ctx.filter.min_star),
        min: (0),
        step: (1),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ style: {} },
        size: "small",
        stepStrictly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-item mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    (__VLS_ctx.$t('views.chatLog.table.feedback.trample'));
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        modelValue: (__VLS_ctx.filter.min_trample),
        min: (0),
        step: (1),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ style: {} },
        size: "small",
        stepStrictly: true,
    }));
    const __VLS_143 = __VLS_142({
        modelValue: (__VLS_ctx.filter.min_trample),
        min: (0),
        step: (1),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ style: {} },
        size: "small",
        stepStrictly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-right" },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    let __VLS_146;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_148 = __VLS_147({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    let __VLS_151;
    const __VLS_152 = {
        /** @type {typeof __VLS_151.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.filterChange('clear');
            // @ts-ignore
            [$t, $t, filter, filter, filterChange,];
        },
    };
    const { default: __VLS_153 } = __VLS_149.slots;
    (__VLS_ctx.$t('common.clear'));
    // @ts-ignore
    [$t,];
    var __VLS_149;
    var __VLS_150;
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
    }));
    const __VLS_156 = __VLS_155({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    let __VLS_159;
    const __VLS_160 = {
        /** @type {typeof __VLS_159.click} */
        onClick: (__VLS_ctx.filterChange),
    };
    const { default: __VLS_161 } = __VLS_157.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, filterChange,];
    var __VLS_157;
    var __VLS_158;
    // @ts-ignore
    [];
    var __VLS_113;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_162 } = __VLS_106.slots;
    const [{ row }] = __VLS_vSlot(__VLS_162);
    if (!row.trample_num && !row.star_num) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        if (row.star_num) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            let __VLS_163;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
                iconName: "app-like-color",
            }));
            const __VLS_165 = __VLS_164({
                iconName: "app-like-color",
            }, ...__VLS_functionalComponentArgsRest(__VLS_164));
            (row.star_num);
        }
        if (row.trample_num) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            let __VLS_168;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
                iconName: "app-oppose-color",
            }));
            const __VLS_170 = __VLS_169({
                iconName: "app-oppose-color",
            }, ...__VLS_functionalComponentArgsRest(__VLS_169));
            (row.trample_num);
        }
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_106;
let __VLS_173;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
    prop: "mark_sum",
    label: (__VLS_ctx.$t('views.chatLog.table.mark')),
    align: "right",
}));
const __VLS_175 = __VLS_174({
    prop: "mark_sum",
    label: (__VLS_ctx.$t('views.chatLog.table.mark')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
let __VLS_178;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
    prop: "asker",
    label: (__VLS_ctx.$t('views.chatLog.table.user')),
}));
const __VLS_180 = __VLS_179({
    prop: "asker",
    label: (__VLS_ctx.$t('views.chatLog.table.user')),
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
const { default: __VLS_183 } = __VLS_181.slots;
{
    const { default: __VLS_184 } = __VLS_181.slots;
    const [{ row }] = __VLS_vSlot(__VLS_184);
    (row.asker?.username);
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_181;
let __VLS_185;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
    prop: "ip_address",
    label: (__VLS_ctx.$t('views.operateLog.table.ip_address')),
    width: "120",
}));
const __VLS_187 = __VLS_186({
    prop: "ip_address",
    label: (__VLS_ctx.$t('views.operateLog.table.ip_address')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
const { default: __VLS_190 } = __VLS_188.slots;
{
    const { default: __VLS_191 } = __VLS_188.slots;
    const [{ row }] = __VLS_vSlot(__VLS_191);
    (row.ip_address || '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_188;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    prop: "source",
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}));
const __VLS_194 = __VLS_193({
    prop: "source",
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const { default: __VLS_197 } = __VLS_195.slots;
{
    const { default: __VLS_198 } = __VLS_195.slots;
    const [{ row }] = __VLS_vSlot(__VLS_198);
    (__VLS_ctx.getSourceTypeName(row.source?.type));
    // @ts-ignore
    [$t, getSourceTypeName,];
}
// @ts-ignore
[];
var __VLS_195;
let __VLS_199;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
    label: (__VLS_ctx.$t('views.chatLog.table.recenTimes')),
    width: "180",
}));
const __VLS_201 = __VLS_200({
    label: (__VLS_ctx.$t('views.chatLog.table.recenTimes')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
const { default: __VLS_204 } = __VLS_202.slots;
{
    const { default: __VLS_205 } = __VLS_202.slots;
    const [{ row }] = __VLS_vSlot(__VLS_205);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_202;
// @ts-ignore
[];
var __VLS_78;
var __VLS_79;
// @ts-ignore
[];
var __VLS_3;
const __VLS_206 = ChatRecordDrawer;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
    ...{ 'onRefresh': {} },
    next: (__VLS_ctx.nextChatRecord),
    pre: (__VLS_ctx.preChatRecord),
    ref: "ChatRecordRef",
    chatId: (__VLS_ctx.currentChatId),
    currentAbstract: (__VLS_ctx.currentAbstract),
    application: (__VLS_ctx.detail),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}));
const __VLS_208 = __VLS_207({
    ...{ 'onRefresh': {} },
    next: (__VLS_ctx.nextChatRecord),
    pre: (__VLS_ctx.preChatRecord),
    ref: "ChatRecordRef",
    chatId: (__VLS_ctx.currentChatId),
    currentAbstract: (__VLS_ctx.currentAbstract),
    application: (__VLS_ctx.detail),
    pre_disable: (__VLS_ctx.pre_disable),
    next_disable: (__VLS_ctx.next_disable),
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
let __VLS_211;
const __VLS_212 = {
    /** @type {typeof __VLS_211.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_213;
var __VLS_209;
var __VLS_210;
let __VLS_215;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
    title: (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "25%",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_217 = __VLS_216({
    title: (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "25%",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
const { default: __VLS_220 } = __VLS_218.slots;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    gutter: (20),
}));
const __VLS_223 = __VLS_222({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
const { default: __VLS_226 } = __VLS_224.slots;
let __VLS_227;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
    span: (24),
}));
const __VLS_229 = __VLS_228({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
const { default: __VLS_232 } = __VLS_230.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('common.delete'));
let __VLS_233;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number'] | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
    modelValue: (__VLS_ctx.days),
    controlsPosition: "right",
    min: (1),
    max: (100000),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ style: {} },
}));
const __VLS_235 = __VLS_234({
    modelValue: (__VLS_ctx.days),
    controlsPosition: "right",
    min: (1),
    max: (100000),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('views.chatLog.daysText'));
// @ts-ignore
[$t, $t, $t, dialogVisible, nextChatRecord, preChatRecord, currentChatId, currentAbstract, detail, pre_disable, next_disable, refresh, days,];
var __VLS_230;
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    span: (24),
}));
const __VLS_240 = __VLS_239({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
const { default: __VLS_243 } = __VLS_241.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('common.delete'));
let __VLS_244;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number'] | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.file_days),
    controlsPosition: "right",
    min: (1),
    max: (__VLS_ctx.days),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ style: {} },
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.file_days),
    controlsPosition: "right",
    min: (1),
    max: (__VLS_ctx.days),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('views.chatLog.fileDaysText'));
// @ts-ignore
[$t, $t, days, file_days,];
var __VLS_241;
// @ts-ignore
[];
var __VLS_224;
{
    const { footer: __VLS_249 } = __VLS_218.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_250;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
        ...{ 'onClick': {} },
    }));
    const __VLS_252 = __VLS_251({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    let __VLS_255;
    const __VLS_256 = {
        /** @type {typeof __VLS_255.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_257 } = __VLS_253.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_253;
    var __VLS_254;
    let __VLS_258;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_260 = __VLS_259({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_259));
    let __VLS_263;
    const __VLS_264 = {
        /** @type {typeof __VLS_263.click} */
        onClick: (__VLS_ctx.saveCleanTime),
    };
    const { default: __VLS_265 } = __VLS_261.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, saveCleanTime,];
    var __VLS_261;
    var __VLS_262;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_218;
let __VLS_266;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
    title: (__VLS_ctx.$t('views.chatLog.addToKnowledge')),
    modelValue: (__VLS_ctx.documentDialogVisible),
    width: "50%",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_268 = __VLS_267({
    title: (__VLS_ctx.$t('views.chatLog.addToKnowledge')),
    modelValue: (__VLS_ctx.documentDialogVisible),
    width: "50%",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
const { default: __VLS_271 } = __VLS_269.slots;
const __VLS_272 = SelectKnowledgeDocument;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    postKnowledgeHandler: (__VLS_ctx.postKnowledgeHandler),
    ref: "SelectKnowledgeDocumentRef",
    apiType: (__VLS_ctx.apiType),
    workspaceId: (__VLS_ctx.detail.workspace_id),
}));
const __VLS_274 = __VLS_273({
    postKnowledgeHandler: (__VLS_ctx.postKnowledgeHandler),
    ref: "SelectKnowledgeDocumentRef",
    apiType: (__VLS_ctx.apiType),
    workspaceId: (__VLS_ctx.detail.workspace_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
var __VLS_277;
var __VLS_275;
{
    const { footer: __VLS_279 } = __VLS_269.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_280;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
        ...{ 'onClick': {} },
    }));
    const __VLS_282 = __VLS_281({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    let __VLS_285;
    const __VLS_286 = {
        /** @type {typeof __VLS_285.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.documentDialogVisible = false;
            // @ts-ignore
            [$t, detail, documentDialogVisible, documentDialogVisible, postKnowledgeHandler, apiType,];
        },
    };
    const { default: __VLS_287 } = __VLS_283.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_283;
    var __VLS_284;
    let __VLS_288;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.documentLoading),
    }));
    const __VLS_290 = __VLS_289({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.documentLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    let __VLS_293;
    const __VLS_294 = {
        /** @type {typeof __VLS_293.click} */
        onClick: (__VLS_ctx.submitForm),
    };
    const { default: __VLS_295 } = __VLS_291.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, documentLoading, submitForm,];
    var __VLS_291;
    var __VLS_292;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_269;
// @ts-ignore
var __VLS_86 = __VLS_85, __VLS_214 = __VLS_213, __VLS_278 = __VLS_277;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
});
export default {};
