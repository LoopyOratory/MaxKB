/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, reactive } from 'vue';
import operateLog from '@/api/system/operate-log';
import DetailDialog from './component/DetailDialog.vue';
import { t } from '@/locales';
import { beforeDay, datetimeFormat } from '@/utils/time';
import useStore from '@/stores';
import WorkspaceApi from '@/api/system/workspace.ts';
import { EditionConst, PermissionConst, RoleConst } from '@/utils/permission/data.ts';
import { ComplexPermission } from '@/utils/permission/type.ts';
import { MsgSuccess } from '@/utils/message.ts';
const { user } = useStore();
const popoverVisible = ref(false);
const operateTypeArr = ref([]);
const workspaceVisible = ref(false);
const workspaceArr = ref([]);
const DetailDialogRef = ref();
const loading = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const searchValue = ref('');
const tableData = ref([]);
const history_day = ref(7);
const filter_type = ref('user');
const filter_status = ref('');
const daterange = ref({
    start_time: '',
    end_time: '',
});
const daterangeValue = ref('');
const dialogVisible = ref(false);
const days = ref(180);
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
const filterOptions = [
    {
        value: 'user',
        label: t('views.operateLog.table.user'),
    },
    {
        value: 'status',
        label: t('common.status.label'),
    },
    {
        value: 'ip_address',
        label: t('views.operateLog.table.ip_address'),
    },
];
const statusOptions = [
    {
        value: '200',
        label: t('common.status.success'),
    },
    {
        value: '500',
        label: t('common.status.fail'),
    },
];
const operateOptions = ref([]);
const workspaceOptions = ref([]);
function filterChange(val) {
    if (val === 'clear') {
        operateTypeArr.value = [];
    }
    getList();
    popoverVisible.value = false;
}
function filterWorkspaceChange(val) {
    if (val === 'clear') {
        workspaceArr.value = [];
    }
    getList();
    workspaceVisible.value = false;
}
function changeStatusHandle(val) {
    getList();
}
function changeFilterHandle(val) {
    filter_type.value = val;
    if (searchValue.value) {
        getList();
    }
}
function changeDayHandle(val) {
    if (val !== 'other') {
        daterange.value.start_time = beforeDay(val);
        daterange.value.end_time = '';
        getList();
    }
}
function changeDayRangeHandle(val) {
    daterange.value.start_time = val[0];
    daterange.value.end_time = val[1];
    getList();
}
function showDetails(row) {
    DetailDialogRef.value.open(row);
}
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getList();
}
function getRequestParams() {
    const obj = {
        start_time: daterange.value.start_time,
        end_time: daterange.value.end_time,
    };
    if (searchValue.value && filter_type.value !== 'status') {
        obj[filter_type.value] = searchValue.value;
    }
    if (filter_type.value === 'status') {
        obj['status'] = filter_status.value;
    }
    if (operateTypeArr.value.length > 0) {
        obj['menu'] = JSON.stringify(operateTypeArr.value);
    }
    if (workspaceArr.value.length > 0) {
        obj['workspace_ids'] = JSON.stringify(workspaceArr.value);
    }
    return obj;
}
function getList() {
    return operateLog.getOperateLog(paginationConfig, getRequestParams(), loading).then((res) => {
        tableData.value = res.data.records;
        paginationConfig.total = res.data.total;
    });
}
function getMenuList() {
    return operateLog.getMenuList().then((res) => {
        const arr = res.data;
        arr
            .filter((item, index, self) => index === self.findIndex((i) => i['menu'] === item['menu']))
            .forEach((ele) => {
            operateOptions.value.push({ label: ele.menu_label, value: ele.menu });
        });
    });
}
const exportLog = () => {
    operateLog.exportOperateLog(getRequestParams(), loading);
};
async function getWorkspaceList() {
    if (user.isEE()) {
        const res = await WorkspaceApi.getSystemWorkspaceList(loading);
        workspaceOptions.value = res.data.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }
}
function saveCleanTime() {
    const obj = {
        clean_time: days.value,
    };
    operateLog
        .saveCleanTime(obj, loading)
        .then(() => {
        MsgSuccess(t('common.saveSuccess'));
        dialogVisible.value = false;
        getCleanTime();
    })
        .catch(() => {
        dialogVisible.value = false;
    });
}
function getCleanTime() {
    operateLog.getCleanTime().then((res) => {
        days.value = res.data;
    });
}
onMounted(() => {
    getMenuList();
    getCleanTime();
    getWorkspaceList();
    changeDayHandle(history_day.value);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate-log p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['operate-log']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.operateLog.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
    ...{ class: "main-calc-height" },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
    ...{ class: "main-calc-height" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "mr-12 w-180" },
}));
const __VLS_8 = __VLS_7({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "mr-12 w-180" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.change} */
    onChange: (__VLS_ctx.changeDayHandle),
};
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-180']} */ ;
const { default: __VLS_13 } = __VLS_9.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.dayOptions))) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_16 = __VLS_15({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    // @ts-ignore
    [$t, history_day, changeDayHandle, dayOptions,];
}
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
if (__VLS_ctx.history_day === 'other') {
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
    elDatePicker;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        /** @type {typeof __VLS_24.change} */
        onChange: (__VLS_ctx.changeDayRangeHandle),
    };
    var __VLS_22;
    var __VLS_23;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filter_type),
    ...{ class: "complex-search__left" },
    ...{ style: {} },
}));
const __VLS_28 = __VLS_27({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filter_type),
    ...{ class: "complex-search__left" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_31;
const __VLS_32 = {
    /** @type {typeof __VLS_31.change} */
    onChange: (__VLS_ctx.changeFilterHandle),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_33 } = __VLS_29.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.filterOptions))) {
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_36 = __VLS_35({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    // @ts-ignore
    [$t, $t, history_day, daterangeValue, changeDayRangeHandle, filter_type, changeFilterHandle, filterOptions,];
}
// @ts-ignore
[];
var __VLS_29;
var __VLS_30;
if (__VLS_ctx.filter_type === 'status') {
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.filter_status),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.filter_status),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    const __VLS_45 = {
        /** @type {typeof __VLS_44.change} */
        onChange: (__VLS_ctx.changeStatusHandle),
    };
    const { default: __VLS_46 } = __VLS_42.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.statusOptions))) {
        let __VLS_47;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }));
        const __VLS_49 = __VLS_48({
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_48));
        // @ts-ignore
        [filter_type, filter_status, changeStatusHandle, statusOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_42;
    var __VLS_43;
}
else {
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchValue),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchValue),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_55;
    var __VLS_56;
}
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
    ...{ style: {} },
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_64;
const __VLS_65 = {
    /** @type {typeof __VLS_64.click} */
    onClick: (__VLS_ctx.exportLog),
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.OPERATION_LOG_EXPORT], [__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.EditionConst.IS_PE], 'OR')) }, null, null);
const { default: __VLS_66 } = __VLS_62.slots;
(__VLS_ctx.$t('common.export'));
// @ts-ignore
[$t, $t, searchValue, getList, exportLog, vHasPermission, ComplexPermission, RoleConst, PermissionConst, EditionConst, EditionConst,];
var __VLS_62;
var __VLS_63;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    ...{ 'onClick': {} },
}));
const __VLS_69 = __VLS_68({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
let __VLS_72;
const __VLS_73 = {
    /** @type {typeof __VLS_72.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.dialogVisible = true;
        // @ts-ignore
        [dialogVisible,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.OPERATION_LOG_CLEAR_POLICY], [__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.EditionConst.IS_PE], 'OR')) }, null, null);
const { default: __VLS_74 } = __VLS_70.slots;
(__VLS_ctx.$t('views.chatLog.buttons.clearStrategy'));
// @ts-ignore
[$t, vHasPermission, ComplexPermission, RoleConst, PermissionConst, EditionConst, EditionConst,];
var __VLS_70;
var __VLS_71;
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16 w-full" },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    showOverflowTooltip: true,
}));
const __VLS_77 = __VLS_76({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16 w-full" },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
let __VLS_80;
const __VLS_81 = {
    /** @type {typeof __VLS_80.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_82 = {
    /** @type {typeof __VLS_80.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_83 } = __VLS_78.slots;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    prop: "menu",
    label: (__VLS_ctx.$t('views.operateLog.table.menu')),
    width: "160",
}));
const __VLS_86 = __VLS_85({
    prop: "menu",
    label: (__VLS_ctx.$t('views.operateLog.table.menu')),
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_89 } = __VLS_87.slots;
{
    const { header: __VLS_90 } = __VLS_87.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.operateLog.table.menu'));
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
    elPopover;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        width: (200),
        trigger: "click",
        visible: (__VLS_ctx.popoverVisible),
        persistent: (false),
    }));
    const __VLS_93 = __VLS_92({
        width: (200),
        trigger: "click",
        visible: (__VLS_ctx.popoverVisible),
        persistent: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    const { default: __VLS_96 } = __VLS_94.slots;
    {
        const { reference: __VLS_97 } = __VLS_94.slots;
        let __VLS_98;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
            ...{ 'onClick': {} },
            ...{ style: {} },
            type: (__VLS_ctx.operateTypeArr && __VLS_ctx.operateTypeArr.length > 0 ? 'primary' : ''),
            link: true,
        }));
        const __VLS_100 = __VLS_99({
            ...{ 'onClick': {} },
            ...{ style: {} },
            type: (__VLS_ctx.operateTypeArr && __VLS_ctx.operateTypeArr.length > 0 ? 'primary' : ''),
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_99));
        let __VLS_103;
        const __VLS_104 = {
            /** @type {typeof __VLS_103.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.popoverVisible = !__VLS_ctx.popoverVisible;
                // @ts-ignore
                [$t, $t, getList, tableData, paginationConfig, handleSizeChange, vLoading, loading, popoverVisible, popoverVisible, popoverVisible, operateTypeArr, operateTypeArr,];
            },
        };
        const { default: __VLS_105 } = __VLS_101.slots;
        let __VLS_106;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({}));
        const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
        const { default: __VLS_111 } = __VLS_109.slots;
        let __VLS_112;
        /** @ts-ignore @type { | typeof __VLS_components.Filter} */
        Filter;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({}));
        const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
        // @ts-ignore
        [];
        var __VLS_109;
        // @ts-ignore
        [];
        var __VLS_101;
        var __VLS_102;
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
    let __VLS_117;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
        height: "300",
        ...{ style: {} },
    }));
    const __VLS_119 = __VLS_118({
        height: "300",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
    const { default: __VLS_122 } = __VLS_120.slots;
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
    elCheckboxGroup;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        modelValue: (__VLS_ctx.operateTypeArr),
        ...{ style: {} },
    }));
    const __VLS_125 = __VLS_124({
        modelValue: (__VLS_ctx.operateTypeArr),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    const { default: __VLS_128 } = __VLS_126.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.operateOptions))) {
        let __VLS_129;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }));
        const __VLS_131 = __VLS_130({
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        // @ts-ignore
        [operateTypeArr, operateOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_126;
    // @ts-ignore
    [];
    var __VLS_120;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-right" },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    let __VLS_134;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_136 = __VLS_135({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    let __VLS_139;
    const __VLS_140 = {
        /** @type {typeof __VLS_139.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.filterChange('clear');
            // @ts-ignore
            [filterChange,];
        },
    };
    const { default: __VLS_141 } = __VLS_137.slots;
    (__VLS_ctx.$t('common.clear'));
    // @ts-ignore
    [$t,];
    var __VLS_137;
    var __VLS_138;
    let __VLS_142;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
    }));
    const __VLS_144 = __VLS_143({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    let __VLS_147;
    const __VLS_148 = {
        /** @type {typeof __VLS_147.click} */
        onClick: (__VLS_ctx.filterChange),
    };
    const { default: __VLS_149 } = __VLS_145.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, filterChange,];
    var __VLS_145;
    var __VLS_146;
    // @ts-ignore
    [];
    var __VLS_94;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_87;
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
    prop: "operate",
    label: (__VLS_ctx.$t('views.operateLog.table.detail')),
    tooltipFormatter: (({ row }) => row.operate + (row.operation_object?.name ? `【${row.operation_object.name}】` : '')),
}));
const __VLS_152 = __VLS_151({
    prop: "operate",
    label: (__VLS_ctx.$t('views.operateLog.table.detail')),
    tooltipFormatter: (({ row }) => row.operate + (row.operation_object?.name ? `【${row.operation_object.name}】` : '')),
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
const { default: __VLS_155 } = __VLS_153.slots;
{
    const { default: __VLS_156 } = __VLS_153.slots;
    const [{ row }] = __VLS_vSlot(__VLS_156);
    (row.operate + (row.operation_object?.name ? `【${row.operation_object.name}】` : ''));
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_153;
let __VLS_157;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    width: "140",
    prop: "user.username",
    label: (__VLS_ctx.$t('views.operateLog.table.user')),
}));
const __VLS_159 = __VLS_158({
    width: "140",
    prop: "user.username",
    label: (__VLS_ctx.$t('views.operateLog.table.user')),
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
if (__VLS_ctx.user.isEE()) {
    let __VLS_162;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
        width: "200",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
    }));
    const __VLS_164 = __VLS_163({
        width: "200",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    const { default: __VLS_167 } = __VLS_165.slots;
    {
        const { header: __VLS_168 } = __VLS_165.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.workspace.title'));
        let __VLS_169;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }));
        const __VLS_171 = __VLS_170({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        const { default: __VLS_174 } = __VLS_172.slots;
        {
            const { reference: __VLS_175 } = __VLS_172.slots;
            let __VLS_176;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }));
            const __VLS_178 = __VLS_177({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_177));
            let __VLS_181;
            const __VLS_182 = {
                /** @type {typeof __VLS_181.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.user.isEE()))
                        throw 0;
                    return __VLS_ctx.workspaceVisible = !__VLS_ctx.workspaceVisible;
                    // @ts-ignore
                    [$t, $t, $t, user, workspaceVisible, workspaceVisible, workspaceVisible, workspaceArr, workspaceArr,];
                },
            };
            const { default: __VLS_183 } = __VLS_179.slots;
            let __VLS_184;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({}));
            const __VLS_186 = __VLS_185({}, ...__VLS_functionalComponentArgsRest(__VLS_185));
            const { default: __VLS_189 } = __VLS_187.slots;
            let __VLS_190;
            /** @ts-ignore @type { | typeof __VLS_components.Filter} */
            Filter;
            // @ts-ignore
            const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({}));
            const __VLS_192 = __VLS_191({}, ...__VLS_functionalComponentArgsRest(__VLS_191));
            // @ts-ignore
            [];
            var __VLS_187;
            // @ts-ignore
            [];
            var __VLS_179;
            var __VLS_180;
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
        let __VLS_195;
        /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
        elScrollbar;
        // @ts-ignore
        const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
            height: "300",
            ...{ style: {} },
        }));
        const __VLS_197 = __VLS_196({
            height: "300",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_196));
        const { default: __VLS_200 } = __VLS_198.slots;
        let __VLS_201;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
        elCheckboxGroup;
        // @ts-ignore
        const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
            modelValue: (__VLS_ctx.workspaceArr),
            ...{ style: {} },
        }));
        const __VLS_203 = __VLS_202({
            modelValue: (__VLS_ctx.workspaceArr),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_202));
        const { default: __VLS_206 } = __VLS_204.slots;
        for (const [item] of __VLS_vFor((__VLS_ctx.workspaceOptions))) {
            let __VLS_207;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
            elCheckbox;
            // @ts-ignore
            const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
                key: (item.value),
                label: (item.label),
                value: (item.value),
            }));
            const __VLS_209 = __VLS_208({
                key: (item.value),
                label: (item.label),
                value: (item.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_208));
            // @ts-ignore
            [workspaceArr, workspaceOptions,];
        }
        // @ts-ignore
        [];
        var __VLS_204;
        // @ts-ignore
        [];
        var __VLS_198;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        let __VLS_212;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_214 = __VLS_213({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        let __VLS_217;
        const __VLS_218 = {
            /** @type {typeof __VLS_217.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.user.isEE()))
                    throw 0;
                return __VLS_ctx.filterWorkspaceChange('clear');
                // @ts-ignore
                [filterWorkspaceChange,];
            },
        };
        const { default: __VLS_219 } = __VLS_215.slots;
        (__VLS_ctx.$t('common.clear'));
        // @ts-ignore
        [$t,];
        var __VLS_215;
        var __VLS_216;
        let __VLS_220;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }));
        const __VLS_222 = __VLS_221({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        let __VLS_225;
        const __VLS_226 = {
            /** @type {typeof __VLS_225.click} */
            onClick: (__VLS_ctx.filterWorkspaceChange),
        };
        const { default: __VLS_227 } = __VLS_223.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, filterWorkspaceChange,];
        var __VLS_223;
        var __VLS_224;
        // @ts-ignore
        [];
        var __VLS_172;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_165;
}
let __VLS_228;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
    prop: "status",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}));
const __VLS_230 = __VLS_229({
    prop: "status",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const { default: __VLS_233 } = __VLS_231.slots;
{
    const { default: __VLS_234 } = __VLS_231.slots;
    const [{ row }] = __VLS_vSlot(__VLS_234);
    if (row.status === 200) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('common.status.success'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ style: {} },
        });
        (__VLS_ctx.$t('common.status.fail'));
    }
    // @ts-ignore
    [$t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_231;
let __VLS_235;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
    prop: "ip_address",
    label: (__VLS_ctx.$t('views.operateLog.table.ip_address')),
    width: "160",
}));
const __VLS_237 = __VLS_236({
    prop: "ip_address",
    label: (__VLS_ctx.$t('views.operateLog.table.ip_address')),
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
let __VLS_240;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
    label: (__VLS_ctx.$t('views.operateLog.table.operateTime')),
    width: "180",
}));
const __VLS_242 = __VLS_241({
    label: (__VLS_ctx.$t('views.operateLog.table.operateTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
const { default: __VLS_245 } = __VLS_243.slots;
{
    const { default: __VLS_246 } = __VLS_243.slots;
    const [{ row }] = __VLS_vSlot(__VLS_246);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_243;
let __VLS_247;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent1(__VLS_247, new __VLS_247({
    label: (__VLS_ctx.$t('common.operation')),
    width: "70",
    align: "left",
    fixed: "right",
}));
const __VLS_249 = __VLS_248({
    label: (__VLS_ctx.$t('common.operation')),
    width: "70",
    align: "left",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
const { default: __VLS_252 } = __VLS_250.slots;
{
    const { default: __VLS_253 } = __VLS_250.slots;
    const [{ row }] = __VLS_vSlot(__VLS_253);
    let __VLS_254;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
        effect: "dark",
        content: (__VLS_ctx.$t('views.operateLog.table.opt')),
        placement: "top",
    }));
    const __VLS_256 = __VLS_255({
        effect: "dark",
        content: (__VLS_ctx.$t('views.operateLog.table.opt')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_255));
    const { default: __VLS_259 } = __VLS_257.slots;
    let __VLS_260;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_262 = __VLS_261({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    let __VLS_265;
    const __VLS_266 = {
        /** @type {typeof __VLS_265.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.showDetails(row);
            // @ts-ignore
            [$t, $t, showDetails,];
        },
    };
    const { default: __VLS_267 } = __VLS_263.slots;
    let __VLS_268;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
        iconName: "app-operate-log",
    }));
    const __VLS_270 = __VLS_269({
        iconName: "app-operate-log",
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    // @ts-ignore
    [];
    var __VLS_263;
    var __VLS_264;
    // @ts-ignore
    [];
    var __VLS_257;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_250;
// @ts-ignore
[];
var __VLS_78;
var __VLS_79;
const __VLS_273 = DetailDialog;
// @ts-ignore
const __VLS_274 = __VLS_asFunctionalComponent1(__VLS_273, new __VLS_273({
    ref: "DetailDialogRef",
}));
const __VLS_275 = __VLS_274({
    ref: "DetailDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_274));
var __VLS_278;
var __VLS_276;
// @ts-ignore
[];
var __VLS_3;
let __VLS_280;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
    title: (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "25%",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_282 = __VLS_281({
    title: (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "25%",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
const { default: __VLS_285 } = __VLS_283.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('common.delete'));
let __VLS_286;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number'] | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
    modelValue: (__VLS_ctx.days),
    controlsPosition: "right",
    min: (1),
    max: (100000),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ style: {} },
}));
const __VLS_288 = __VLS_287({
    modelValue: (__VLS_ctx.days),
    controlsPosition: "right",
    min: (1),
    max: (100000),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('views.chatLog.daysText'));
{
    const { footer: __VLS_291 } = __VLS_283.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_292;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
        ...{ 'onClick': {} },
    }));
    const __VLS_294 = __VLS_293({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    let __VLS_297;
    const __VLS_298 = {
        /** @type {typeof __VLS_297.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [$t, $t, $t, dialogVisible, dialogVisible, days,];
        },
    };
    const { default: __VLS_299 } = __VLS_295.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_295;
    var __VLS_296;
    let __VLS_300;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_302 = __VLS_301({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    let __VLS_305;
    const __VLS_306 = {
        /** @type {typeof __VLS_305.click} */
        onClick: (__VLS_ctx.saveCleanTime),
    };
    const { default: __VLS_307 } = __VLS_303.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, saveCleanTime,];
    var __VLS_303;
    var __VLS_304;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_283;
// @ts-ignore
var __VLS_279 = __VLS_278;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
