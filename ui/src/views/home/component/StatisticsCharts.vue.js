/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted } from 'vue';
import AppCharts from '@/components/app-charts/index.vue';
import { relatedObject } from '@/utils/array';
import homeApi from '@/api/home-page/home';
import { nowDate, beforeDay } from '@/utils/time';
import { getAttrsArray, getSum } from '@/utils/array';
import { numberFormat } from '@/utils/common';
import ApplicationApi from '@/api/application/application';
import { resetUrl } from '@/utils/common';
import { t } from '@/locales';
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
const data = ref([]);
const loading = ref(false);
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
const statisticsType = computed(() => [
    {
        id: 'customerCharts',
        name: t('home.activeUsers'),
        icon: 'app-user',
        background: '#EBF1FF',
        color: '#3370FF',
        sum: [
            getSum(getAttrsArray(data.value, 'customer_num') || 0),
            getSum(getAttrsArray(data.value, 'customer_added_count') || 0),
        ],
        option: {
            title: t('home.activeUsers'),
            xData: getAttrsArray(data.value, 'day'),
            yData: [
                {
                    name: t('home.activeUsers'),
                    area: true,
                    data: getAttrsArray(data.value, 'customer_num'),
                },
                {
                    name: t('home.newUsers'),
                    area: true,
                    data: getAttrsArray(data.value, 'customer_added_count'),
                },
            ],
        },
    },
    {
        id: 'chatRecordCharts',
        name: t('home.chatCount'),
        icon: 'app-question',
        background: '#FFF3E5',
        color: '#FF8800',
        sum: [getSum(getAttrsArray(data.value, 'chat_record_count') || 0)],
        option: {
            title: t('home.chatCount'),
            xData: getAttrsArray(data.value, 'day'),
            yData: [
                {
                    data: getAttrsArray(data.value, 'chat_record_count'),
                    area: true,
                },
            ],
        },
    },
    {
        id: 'tokensCharts',
        name: t('home.charts.tokensTotal'),
        icon: 'app-tokens',
        background: '#E5FBF8',
        color: '#00D6B9',
        sum: [getSum(getAttrsArray(data.value, 'tokens_num') || 0)],
        option: {
            title: t('home.charts.tokensTotal'),
            xData: getAttrsArray(data.value, 'day'),
            yData: [
                {
                    data: getAttrsArray(data.value, 'tokens_num'),
                    area: true,
                },
            ],
        },
    },
    {
        id: 'starCharts',
        name: t('home.charts.userSatisfaction'),
        icon: 'app-user-stars',
        background: '#FEEDEC',
        color: '#F54A45',
        sum: [
            getSum(getAttrsArray(data.value, 'star_num') || 0),
            getSum(getAttrsArray(data.value, 'trample_num') || 0),
        ],
        option: {
            title: t('home.charts.userSatisfaction'),
            xData: getAttrsArray(data.value, 'day'),
            yData: [
                {
                    name: t('home.charts.approval'),
                    data: getAttrsArray(data.value, 'star_num'),
                    area: true,
                },
                {
                    name: t('home.charts.disapproval'),
                    data: getAttrsArray(data.value, 'trample_num'),
                    area: true,
                },
            ],
        },
    },
]);
const application_id = ref('all');
const agentOptions = ref([]);
function getAgentList(query) {
    const pagination = {
        current_page: 1,
        page_size: 200,
    };
    ApplicationApi.getApplication(pagination, { name: query }).then((res) => {
        agentOptions.value = res.data.records;
    });
}
function changeAgent(val) {
    application_id.value = val;
    getDetail();
}
function getDetail() {
    homeApi
        .getMonitorAggregation({
        ...daterange.value,
        ...(application_id.value !== 'all' ? { application_id: application_id.value } : {}),
    }, loading)
        .then((res) => {
        data.value = res.data;
    });
}
onMounted(() => {
    changeDayHandle(history_day.value);
    getAgentList('');
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
    ...{ class: "mt-16" },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('home.monitoringStatistics'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "w-180" },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "w-180" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.change} */
    onChange: (__VLS_ctx.changeDayHandle),
};
/** @type {__VLS_StyleScopedClasses['w-180']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.dayOptions))) {
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_17 = __VLS_16({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    // @ts-ignore
    [$t, history_day, changeDayHandle, dayOptions,];
}
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
if (__VLS_ctx.history_day === 'other') {
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
    elDatePicker;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        ...{ 'onChange': {} },
        ...{ class: "ml-12" },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onChange': {} },
        ...{ class: "ml-12" },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_25;
    const __VLS_26 = {
        /** @type {typeof __VLS_25.change} */
        onChange: (__VLS_ctx.changeDayRangeHandle),
    };
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    var __VLS_23;
    var __VLS_24;
}
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    ...{ 'onChange': {} },
    ...{ class: "ml-12" },
    modelValue: (__VLS_ctx.application_id),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.getAgentList),
    ...{ style: {} },
    'valueOnClear:': ('all'),
    popperClass: "max-w-350",
}));
const __VLS_29 = __VLS_28({
    ...{ 'onChange': {} },
    ...{ class: "ml-12" },
    modelValue: (__VLS_ctx.application_id),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.getAgentList),
    ...{ style: {} },
    'valueOnClear:': ('all'),
    popperClass: "max-w-350",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
const __VLS_33 = {
    /** @type {typeof __VLS_32.change} */
    onChange: (__VLS_ctx.changeAgent),
};
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
const { default: __VLS_34 } = __VLS_30.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    label: (__VLS_ctx.$t('home.allAgents')),
    value: ('all'),
}));
const __VLS_37 = __VLS_36({
    label: (__VLS_ctx.$t('home.allAgents')),
    value: ('all'),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const { default: __VLS_40 } = __VLS_38.slots;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
elSpace;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    size: (8),
}));
const __VLS_43 = __VLS_42({
    size: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    shape: "square",
    size: (24),
    ...{ style: {} },
}));
const __VLS_49 = __VLS_48({
    shape: "square",
    size: (24),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    iconName: ('app-all-menu'),
    ...{ class: "color-secondary" },
    ...{ style: {} },
}));
const __VLS_55 = __VLS_54({
    iconName: ('app-all-menu'),
    ...{ class: "color-secondary" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
// @ts-ignore
[$t, $t, $t, history_day, daterangeValue, changeDayRangeHandle, application_id, getAgentList, changeAgent,];
var __VLS_50;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('home.allAgents'));
// @ts-ignore
[$t,];
var __VLS_44;
// @ts-ignore
[];
var __VLS_38;
for (const [u] of __VLS_vFor((__VLS_ctx.agentOptions))) {
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        key: (u.id),
        value: (u.id),
        label: (u.name),
    }));
    const __VLS_60 = __VLS_59({
        key: (u.id),
        value: (u.id),
        label: (u.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const { default: __VLS_63 } = __VLS_61.slots;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        size: (8),
    }));
    const __VLS_66 = __VLS_65({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        shape: "square",
        size: (24),
        ...{ style: {} },
    }));
    const __VLS_72 = __VLS_71({
        shape: "square",
        size: (24),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(u?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
        alt: "",
    });
    // @ts-ignore
    [agentOptions, resetUrl, resetUrl,];
    var __VLS_73;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        title: (u.name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (u.name);
    // @ts-ignore
    [];
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_61;
    // @ts-ignore
    [];
}
{
    const { label: __VLS_76 } = __VLS_30.slots;
    const [{ label, value }] = __VLS_vSlot(__VLS_76);
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        size: (8),
    }));
    const __VLS_79 = __VLS_78({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    const { default: __VLS_82 } = __VLS_80.slots;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        shape: "square",
        size: (20),
        ...{ style: {} },
    }));
    const __VLS_85 = __VLS_84({
        shape: "square",
        size: (20),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    const { default: __VLS_88 } = __VLS_86.slots;
    if (value === 'all') {
        let __VLS_89;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
            iconName: ('app-all-menu'),
            ...{ class: "color-text-primary" },
            ...{ style: {} },
        }));
        const __VLS_91 = __VLS_90({
            iconName: ('app-all-menu'),
            ...{ class: "color-text-primary" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.agentOptions, value, 'id')?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
            alt: "",
        });
    }
    // @ts-ignore
    [agentOptions, resetUrl, resetUrl, relatedObject,];
    var __VLS_86;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        title: (label),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (label);
    // @ts-ignore
    [];
    var __VLS_80;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_30;
var __VLS_31;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    gutter: (16),
}));
const __VLS_96 = __VLS_95({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_99 } = __VLS_97.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.statisticsType))) {
    let __VLS_100;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        key: (index),
        ...{ class: "mb-16" },
    }));
    const __VLS_102 = __VLS_101({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        key: (index),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_105 } = __VLS_103.slots;
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        shadow: "never",
    }));
    const __VLS_108 = __VLS_107({
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    const { default: __VLS_111 } = __VLS_109.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center ml-8 mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary lighter mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (item.name);
    if (item.id !== 'starCharts') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-baseline" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-baseline']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
        (__VLS_ctx.numberFormat(item.sum?.[0]));
        if (item.sum.length > 1) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-12" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
            (__VLS_ctx.numberFormat(item.sum?.[1]));
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_112;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
            iconName: "app-like-color",
        }));
        const __VLS_114 = __VLS_113({
            iconName: "app-like-color",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (item.sum?.[0]);
        let __VLS_117;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            ...{ class: "ml-12" },
            iconName: "app-oppose-color",
        }));
        const __VLS_119 = __VLS_118({
            ...{ class: "ml-12" },
            iconName: "app-oppose-color",
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (item.sum?.[1]);
    }
    // @ts-ignore
    [vLoading, loading, statisticsType, numberFormat, numberFormat,];
    var __VLS_109;
    // @ts-ignore
    [];
    var __VLS_103;
    // @ts-ignore
    [];
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.statisticsType))) {
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        xs: (24),
        sm: (24),
        md: (24),
        lg: (12),
        xl: (12),
        key: (index),
        ...{ class: "mb-16" },
    }));
    const __VLS_124 = __VLS_123({
        xs: (24),
        sm: (24),
        md: (24),
        lg: (12),
        xl: (12),
        key: (index),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_127 } = __VLS_125.slots;
    let __VLS_128;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
        shadow: "never",
    }));
    const __VLS_130 = __VLS_129({
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    const { default: __VLS_133 } = __VLS_131.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    if (__VLS_ctx.data.length) {
        const __VLS_134 = AppCharts;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
            height: "316px",
            id: (item.id),
            type: "line",
            option: (item.option),
        }));
        const __VLS_136 = __VLS_135({
            height: "316px",
            id: (item.id),
            type: "line",
            option: (item.option),
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    }
    // @ts-ignore
    [statisticsType, data,];
    var __VLS_131;
    // @ts-ignore
    [];
    var __VLS_125;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_97;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
