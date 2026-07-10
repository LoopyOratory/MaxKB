/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive } from 'vue';
import useStore from '@/stores';
import { numberFormat } from '@/utils/common';
import homeApi from '@/api/home-page/home';
import { nowDate, beforeDay } from '@/utils/time';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
const { user } = useStore();
const drawerVisible = ref(false);
const activeName = ref('tokens_agent');
const loading = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const tokensRankding = ref([]);
const questionRanking = ref();
const userTokensRanking = ref();
const search_text = ref('');
function searchHandle() {
    getDetail();
}
function handleClick(tab) {
    activeName.value = tab;
    paginationConfig.current_page = 1;
    changeDayHandle(history_day.value);
}
const dayOptions = [
    {
        value: 7,
        label: t('home.pastDayOptions.past7Days'),
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
const history_day = ref(7);
// Date component time
const daterangeValue = ref('');
// SubmitDateTime
const daterange = ref({
    start_time: '',
    end_time: '',
});
function changeDayHandle(val) {
    if (val !== 'other') {
        daterange.value.start_time = beforeDay(val);
        daterange.value.end_time = nowDate;
        getDetail();
    }
}
function changeDayRangeHandle(val) {
    daterange.value.start_time = val[0];
    daterange.value.end_time = val[1];
    getDetail();
}
const ChatRecordTotal = ref(0);
const TokenTotal = ref(0);
function getDetail() {
    if (activeName.value === 'tokens_agent') {
        homeApi.getTokensAggregation(daterange.value, loading).then((res) => {
            TokenTotal.value = res.data;
        });
        homeApi
            .getTokensRanking(paginationConfig, { name: search_text.value, ...daterange.value }, loading)
            .then((res) => {
            paginationConfig.total = res.data?.total || 0;
            tokensRankding.value = res.data?.records;
        });
    }
    else if (activeName.value === 'questions_agent') {
        homeApi.getChatRecordAggregation(daterange.value, loading).then((res) => {
            ChatRecordTotal.value = res.data;
        });
        homeApi
            .getQuestionsRanking(paginationConfig, { name: search_text.value, ...daterange.value }, loading)
            .then((res) => {
            paginationConfig.total = res.data?.total || 0;
            questionRanking.value = res.data?.records;
        });
    }
    else if (activeName.value === 'user_tokens_agent') {
        homeApi.getTokensAggregation(daterange.value, loading).then((res) => {
            TokenTotal.value = res.data;
        });
        homeApi
            .getUserTokensRanking(paginationConfig, { name: search_text.value, ...daterange.value }, loading)
            .then((res) => {
            paginationConfig.total = res.data?.total || 0;
            userTokensRanking.value = res.data?.records;
        });
    }
}
function handleSizeChange() {
    paginationConfig.current_page = 1;
    changeDayHandle(history_day.value);
}
function exportHandle() {
    console.log('sss');
    if (activeName.value === 'tokens_agent') {
        homeApi
            .exportTokensRankings({ name: search_text.value, ...daterange.value }, loading)
            .catch((e) => {
            if (e.response.status !== 403) {
                e.response.data.text().then((res) => {
                    MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
                });
            }
        });
    }
    else if (activeName.value === 'questions_agent') {
        homeApi
            .exportQuestionsRankings({ name: search_text.value, ...daterange.value }, loading)
            .catch((e) => {
            if (e.response.status !== 403) {
                e.response.data.text().then((res) => {
                    MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
                });
            }
        });
    }
    else if (activeName.value === 'user_tokens_agent') {
        homeApi
            .exportUserTokensRankings({ name: search_text.value, ...daterange.value }, loading)
            .catch((e) => {
            if (e.response.status !== 403) {
                e.response.data.text().then((res) => {
                    MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
                });
            }
        });
    }
}
watch(drawerVisible, (bool) => {
    if (!bool) {
        search_text.value = '';
        activeName.value = 'tokens_agent';
        tokensRankding.value = [];
        paginationConfig.current_page = 1;
        paginationConfig.total = 0;
        history_day.value = 7;
    }
});
const open = (name, historyDay, daterangeVal, daterange) => {
    activeName.value = name;
    history_day.value = historyDay;
    daterangeValue.value = daterangeVal;
    daterange.value = daterange;
    changeDayHandle(history_day.value);
    drawerVisible.value = true;
};
const __VLS_exposed = {
    open,
};
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
    modelValue: (__VLS_ctx.drawerVisible),
    title: (__VLS_ctx.$t('home.rankDetail')),
    size: "1000",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawerVisible),
    title: (__VLS_ctx.$t('home.rankDetail')),
    size: "1000",
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeName),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeName),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.tabChange} */
    onTabChange: (__VLS_ctx.handleClick),
};
const { default: __VLS_14 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-12 mt-12" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search_text),
    ...{ class: "mr-12 ml-12 w-240" },
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
}));
const __VLS_17 = __VLS_16({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search_text),
    ...{ class: "mr-12 ml-12 w-240" },
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
const __VLS_21 = {
    /** @type {typeof __VLS_20.change} */
    onChange: (__VLS_ctx.searchHandle),
};
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
const { default: __VLS_22 } = __VLS_18.slots;
{
    const { suffix: __VLS_23 } = __VLS_18.slots;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        ...{ class: "el-input__icon" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "el-input__icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    /** @type {__VLS_StyleScopedClasses['el-input__icon']} */ ;
    const { default: __VLS_29 } = __VLS_27.slots;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.search | typeof __VLS_components.Search} */
    search;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({}));
    const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
    // @ts-ignore
    [drawerVisible, $t, $t, activeName, handleClick, search_text, searchHandle,];
    var __VLS_27;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_18;
var __VLS_19;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "mr-12 w-120" },
}));
const __VLS_37 = __VLS_36({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "mr-12 w-120" },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_40;
const __VLS_41 = {
    /** @type {typeof __VLS_40.change} */
    onChange: (__VLS_ctx.changeDayHandle),
};
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-120']} */ ;
const { default: __VLS_42 } = __VLS_38.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.dayOptions))) {
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_45 = __VLS_44({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    // @ts-ignore
    [history_day, changeDayHandle, dayOptions,];
}
// @ts-ignore
[];
var __VLS_38;
var __VLS_39;
if (__VLS_ctx.history_day === 'other') {
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
    elDatePicker;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.change} */
        onChange: (__VLS_ctx.changeDayRangeHandle),
    };
    var __VLS_51;
    var __VLS_52;
}
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    ...{ 'onClick': {} },
}));
const __VLS_57 = __VLS_56({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_60;
const __VLS_61 = {
    /** @type {typeof __VLS_60.click} */
    onClick: (__VLS_ctx.exportHandle),
};
const { default: __VLS_62 } = __VLS_58.slots;
(__VLS_ctx.$t('common.export'));
// @ts-ignore
[$t, $t, $t, history_day, daterangeValue, changeDayRangeHandle, exportHandle,];
var __VLS_58;
var __VLS_59;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    label: ('Tokens ' + __VLS_ctx.$t('home.usage') + ' · Top ' + __VLS_ctx.$t('views.application.title')),
    name: "tokens_agent",
}));
const __VLS_65 = __VLS_64({
    label: ('Tokens ' + __VLS_ctx.$t('home.usage') + ' · Top ' + __VLS_ctx.$t('views.application.title')),
    name: "tokens_agent",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const { default: __VLS_68 } = __VLS_66.slots;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.tokensRankding),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
    rowKey: ((row) => row.id),
}));
const __VLS_71 = __VLS_70({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.tokensRankding),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
const __VLS_75 = {
    /** @type {typeof __VLS_74.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_76 = {
    /** @type {typeof __VLS_74.changePage} */
    onChangePage: (__VLS_ctx.getDetail),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_77 } = __VLS_72.slots;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    label: (__VLS_ctx.$t('home.rank')),
    width: "80",
}));
const __VLS_80 = __VLS_79({
    label: (__VLS_ctx.$t('home.rank')),
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
{
    const { default: __VLS_84 } = __VLS_81.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_84);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "rank" },
        ...{ class: ('rank-' + ($index + 1)) },
    });
    /** @type {__VLS_StyleScopedClasses['rank']} */ ;
    ($index + 1);
    // @ts-ignore
    [$t, $t, $t, tokensRankding, paginationConfig, handleSizeChange, getDetail, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_81;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    prop: "name",
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.application.form.appName.label')),
}));
const __VLS_87 = __VLS_86({
    prop: "name",
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.application.form.appName.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
let __VLS_90;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    minWidth: "100",
    label: ('Tokens ' + __VLS_ctx.$t('home.usage')),
    align: "right",
}));
const __VLS_92 = __VLS_91({
    minWidth: "100",
    label: ('Tokens ' + __VLS_ctx.$t('home.usage')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
const { default: __VLS_95 } = __VLS_93.slots;
{
    const { default: __VLS_96 } = __VLS_93.slots;
    const [{ row }] = __VLS_vSlot(__VLS_96);
    (__VLS_ctx.numberFormat(row.total_tokens));
    // @ts-ignore
    [$t, $t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_93;
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    width: "200",
    label: (__VLS_ctx.$t('home.proportion')),
}));
const __VLS_99 = __VLS_98({
    width: "200",
    label: (__VLS_ctx.$t('home.proportion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const { default: __VLS_102 } = __VLS_100.slots;
{
    const { default: __VLS_103 } = __VLS_100.slots;
    const [{ row }] = __VLS_vSlot(__VLS_103);
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        percentage: (__VLS_ctx.TokenTotal
            ? Number((((row?.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1))
            : 0),
    }));
    const __VLS_106 = __VLS_105({
        percentage: (__VLS_ctx.TokenTotal
            ? Number((((row?.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1))
            : 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    // @ts-ignore
    [$t, TokenTotal, TokenTotal,];
}
// @ts-ignore
[];
var __VLS_100;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.chatCount')),
    align: "right",
}));
const __VLS_111 = __VLS_110({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.chatCount')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
const { default: __VLS_114 } = __VLS_112.slots;
{
    const { default: __VLS_115 } = __VLS_112.slots;
    const [{ row }] = __VLS_vSlot(__VLS_115);
    (__VLS_ctx.numberFormat(row.chat_record_count));
    // @ts-ignore
    [$t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_112;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.activeUsers')),
    align: "right",
}));
const __VLS_118 = __VLS_117({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.activeUsers')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
{
    const { default: __VLS_122 } = __VLS_119.slots;
    const [{ row }] = __VLS_vSlot(__VLS_122);
    (__VLS_ctx.numberFormat(row.chat_user_count));
    // @ts-ignore
    [$t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_119;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.average‌') + ' tokens/' + __VLS_ctx.$t('views.system.time')),
    align: "right",
}));
const __VLS_125 = __VLS_124({
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.average‌') + ' tokens/' + __VLS_ctx.$t('views.system.time')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
const { default: __VLS_128 } = __VLS_126.slots;
{
    const { default: __VLS_129 } = __VLS_126.slots;
    const [{ row }] = __VLS_vSlot(__VLS_129);
    (__VLS_ctx.numberFormat(Number((row?.total_tokens / row?.chat_record_count || 0).toFixed(1))));
    // @ts-ignore
    [$t, $t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_126;
// @ts-ignore
[];
var __VLS_72;
var __VLS_73;
// @ts-ignore
[];
var __VLS_66;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    label: (__VLS_ctx.$t('home.chatCount') + ' · Top ' + __VLS_ctx.$t('views.application.title')),
    name: "questions_agent",
}));
const __VLS_132 = __VLS_131({
    label: (__VLS_ctx.$t('home.chatCount') + ' · Top ' + __VLS_ctx.$t('views.application.title')),
    name: "questions_agent",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const { default: __VLS_135 } = __VLS_133.slots;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.questionRanking),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
    rowKey: ((row) => row.id),
}));
const __VLS_138 = __VLS_137({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.questionRanking),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
let __VLS_141;
const __VLS_142 = {
    /** @type {typeof __VLS_141.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_143 = {
    /** @type {typeof __VLS_141.changePage} */
    onChangePage: (__VLS_ctx.getDetail),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_144 } = __VLS_139.slots;
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    label: (__VLS_ctx.$t('home.rank')),
    width: "80",
}));
const __VLS_147 = __VLS_146({
    label: (__VLS_ctx.$t('home.rank')),
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
{
    const { default: __VLS_151 } = __VLS_148.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_151);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "rank" },
        ...{ class: ('rank-' + ($index + 1)) },
    });
    /** @type {__VLS_StyleScopedClasses['rank']} */ ;
    ($index + 1);
    // @ts-ignore
    [$t, $t, $t, paginationConfig, handleSizeChange, getDetail, vLoading, loading, questionRanking,];
}
// @ts-ignore
[];
var __VLS_148;
let __VLS_152;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
    prop: "name",
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.application.form.appName.label')),
}));
const __VLS_154 = __VLS_153({
    prop: "name",
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.application.form.appName.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
let __VLS_157;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.chatCount')),
    align: "right",
}));
const __VLS_159 = __VLS_158({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.chatCount')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
const { default: __VLS_162 } = __VLS_160.slots;
{
    const { default: __VLS_163 } = __VLS_160.slots;
    const [{ row }] = __VLS_vSlot(__VLS_163);
    (__VLS_ctx.numberFormat(row.chat_record_count));
    // @ts-ignore
    [$t, $t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_160;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    width: "200",
    label: (__VLS_ctx.$t('home.proportion')),
}));
const __VLS_166 = __VLS_165({
    width: "200",
    label: (__VLS_ctx.$t('home.proportion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const { default: __VLS_169 } = __VLS_167.slots;
{
    const { default: __VLS_170 } = __VLS_167.slots;
    const [{ row }] = __VLS_vSlot(__VLS_170);
    let __VLS_171;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        percentage: (__VLS_ctx.ChatRecordTotal
            ? Number((((row?.chat_record_count || 0) / __VLS_ctx.ChatRecordTotal) * 100).toFixed(1))
            : 0),
    }));
    const __VLS_173 = __VLS_172({
        percentage: (__VLS_ctx.ChatRecordTotal
            ? Number((((row?.chat_record_count || 0) / __VLS_ctx.ChatRecordTotal) * 100).toFixed(1))
            : 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    // @ts-ignore
    [$t, ChatRecordTotal, ChatRecordTotal,];
}
// @ts-ignore
[];
var __VLS_167;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.activeUsers')),
    align: "right",
}));
const __VLS_178 = __VLS_177({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.activeUsers')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const { default: __VLS_181 } = __VLS_179.slots;
{
    const { default: __VLS_182 } = __VLS_179.slots;
    const [{ row }] = __VLS_vSlot(__VLS_182);
    (__VLS_ctx.numberFormat(row.chat_user_count));
    // @ts-ignore
    [$t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_179;
let __VLS_183;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.perDialogueRounds')),
    align: "right",
}));
const __VLS_185 = __VLS_184({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.perDialogueRounds')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
const { default: __VLS_188 } = __VLS_186.slots;
{
    const { default: __VLS_189 } = __VLS_186.slots;
    const [{ row }] = __VLS_vSlot(__VLS_189);
    (__VLS_ctx.numberFormat(Number((row?.chat_record_count / row?.chat_user_count || 0).toFixed(1))));
    // @ts-ignore
    [$t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_186;
// @ts-ignore
[];
var __VLS_139;
var __VLS_140;
// @ts-ignore
[];
var __VLS_133;
let __VLS_190;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
    label: ('Tokens ' + __VLS_ctx.$t('home.usage') + ' · Top ' + __VLS_ctx.$t('views.chatLog.table.user')),
    name: "user_tokens_agent",
}));
const __VLS_192 = __VLS_191({
    label: ('Tokens ' + __VLS_ctx.$t('home.usage') + ' · Top ' + __VLS_ctx.$t('views.chatLog.table.user')),
    name: "user_tokens_agent",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
const { default: __VLS_195 } = __VLS_193.slots;
let __VLS_196;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.userTokensRanking),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
    rowKey: ((row) => row.id),
}));
const __VLS_198 = __VLS_197({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.userTokensRanking),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
let __VLS_201;
const __VLS_202 = {
    /** @type {typeof __VLS_201.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_203 = {
    /** @type {typeof __VLS_201.changePage} */
    onChangePage: (__VLS_ctx.getDetail),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_204 } = __VLS_199.slots;
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
    label: (__VLS_ctx.$t('home.rank')),
    width: "80",
}));
const __VLS_207 = __VLS_206({
    label: (__VLS_ctx.$t('home.rank')),
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
const { default: __VLS_210 } = __VLS_208.slots;
{
    const { default: __VLS_211 } = __VLS_208.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_211);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "rank" },
        ...{ class: ('rank-' + ($index + 1)) },
    });
    /** @type {__VLS_StyleScopedClasses['rank']} */ ;
    ($index + 1);
    // @ts-ignore
    [$t, $t, $t, paginationConfig, handleSizeChange, getDetail, vLoading, loading, userTokensRanking,];
}
// @ts-ignore
[];
var __VLS_208;
let __VLS_212;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.chatLog.table.user')),
}));
const __VLS_214 = __VLS_213({
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.chatLog.table.user')),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
const { default: __VLS_217 } = __VLS_215.slots;
{
    const { default: __VLS_218 } = __VLS_215.slots;
    const [{ row }] = __VLS_vSlot(__VLS_218);
    (row?.asker?.username || '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_215;
let __VLS_219;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
    minWidth: "100",
    label: ('Tokens ' + __VLS_ctx.$t('home.usage')),
    align: "right",
}));
const __VLS_221 = __VLS_220({
    minWidth: "100",
    label: ('Tokens ' + __VLS_ctx.$t('home.usage')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_220));
const { default: __VLS_224 } = __VLS_222.slots;
{
    const { default: __VLS_225 } = __VLS_222.slots;
    const [{ row }] = __VLS_vSlot(__VLS_225);
    (__VLS_ctx.numberFormat(row.total_tokens));
    // @ts-ignore
    [$t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_222;
let __VLS_226;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
    width: "200",
    label: (__VLS_ctx.$t('home.proportion')),
}));
const __VLS_228 = __VLS_227({
    width: "200",
    label: (__VLS_ctx.$t('home.proportion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
const { default: __VLS_231 } = __VLS_229.slots;
{
    const { default: __VLS_232 } = __VLS_229.slots;
    const [{ row }] = __VLS_vSlot(__VLS_232);
    let __VLS_233;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
        percentage: (__VLS_ctx.TokenTotal ? Number((((row.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1)) : 0),
    }));
    const __VLS_235 = __VLS_234({
        percentage: (__VLS_ctx.TokenTotal ? Number((((row.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1)) : 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
    // @ts-ignore
    [$t, TokenTotal, TokenTotal,];
}
// @ts-ignore
[];
var __VLS_229;
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.chatCount')),
    align: "right",
}));
const __VLS_240 = __VLS_239({
    minWidth: "80",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.chatCount')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
const { default: __VLS_243 } = __VLS_241.slots;
{
    const { default: __VLS_244 } = __VLS_241.slots;
    const [{ row }] = __VLS_vSlot(__VLS_244);
    (__VLS_ctx.numberFormat(row.chat_record_count));
    // @ts-ignore
    [$t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_241;
let __VLS_245;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.average‌') + ' tokens/' + __VLS_ctx.$t('views.system.time')),
    align: "right",
}));
const __VLS_247 = __VLS_246({
    minWidth: "100",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('home.average‌') + ' tokens/' + __VLS_ctx.$t('views.system.time')),
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
const { default: __VLS_250 } = __VLS_248.slots;
{
    const { default: __VLS_251 } = __VLS_248.slots;
    const [{ row }] = __VLS_vSlot(__VLS_251);
    (__VLS_ctx.numberFormat(Number((row.total_tokens / row.chat_record_count || 0).toFixed(1))));
    // @ts-ignore
    [$t, $t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_248;
// @ts-ignore
[];
var __VLS_199;
var __VLS_200;
// @ts-ignore
[];
var __VLS_193;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
