/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import RankingDrawer from './RankingDrawer.vue';
import homeApi from '@/api/home-page/home';
import { nowDate, beforeDay } from '@/utils/time';
import { numberFormat } from '@/utils/common';
import { t } from '@/locales';
const loading = ref(true);
const tokensRankding = ref([]);
const questionRanking = ref();
const userTokensRanking = ref();
const paginationConfig = reactive({
    current_page: 1,
    page_size: 5,
    total: 0,
});
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
    homeApi.getChatRecordAggregation(daterange.value, loading).then((res) => {
        ChatRecordTotal.value = res.data;
    });
    homeApi.getTokensAggregation(daterange.value, loading).then((res) => {
        TokenTotal.value = res.data;
    });
    homeApi.getTokensRanking(paginationConfig, daterange.value, loading).then((res) => {
        tokensRankding.value = res.data?.records;
    });
    homeApi.getQuestionsRanking(paginationConfig, daterange.value, loading).then((res) => {
        questionRanking.value = res.data?.records;
    });
    homeApi.getUserTokensRanking(paginationConfig, daterange.value, loading).then((res) => {
        userTokensRanking.value = res.data?.records;
    });
}
const RankingDrawerRef = ref();
const openDrawer = (name) => {
    RankingDrawerRef.value.open(name, history_day.value, daterangeValue.value, daterange.value);
};
onMounted(() => {
    changeDayHandle(history_day.value);
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
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.$t('home.rank'));
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
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    gutter: (16),
}));
const __VLS_29 = __VLS_28({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_32 } = __VLS_30.slots;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_35 = __VLS_34({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    shadow: "never",
    ...{ style: {} },
}));
const __VLS_41 = __VLS_40({
    shadow: "never",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.$t('home.usage'));
(__VLS_ctx.$t('views.application.title'));
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    ...{ 'onClick': {} },
    link: true,
    ...{ class: "flex align-center lighter" },
}));
const __VLS_47 = __VLS_46({
    ...{ 'onClick': {} },
    link: true,
    ...{ class: "flex align-center lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_50;
const __VLS_51 = {
    /** @type {typeof __VLS_50.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openDrawer('tokens_agent');
        // @ts-ignore
        [$t, $t, $t, $t, history_day, daterangeValue, changeDayRangeHandle, vLoading, loading, openDrawer,];
    },
};
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_52 } = __VLS_48.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-4" },
});
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.detail'));
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_58 } = __VLS_56.slots;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.ArrowRight} */
ArrowRight;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({}));
const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
// @ts-ignore
[$t,];
var __VLS_56;
// @ts-ignore
[];
var __VLS_48;
var __VLS_49;
if (!__VLS_ctx.tokensRankding || __VLS_ctx.tokensRankding.length === 0) {
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
}
else {
    for (const [item, index] of __VLS_vFor((__VLS_ctx.tokensRankding))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between mt-24" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "rank" },
            ...{ class: ('rank-' + (index + 1)) },
        });
        /** @type {__VLS_StyleScopedClasses['rank']} */ ;
        (index + 1);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ml-12" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (item?.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "color-secondary font-small lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('home.chats'));
        (__VLS_ctx.numberFormat(item?.chat_record_count || 0));
        (__VLS_ctx.$t('views.system.time'));
        let __VLS_69;
        /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
        elDivider;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
            direction: "vertical",
        }));
        const __VLS_71 = __VLS_70({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        (__VLS_ctx.$t('home.average‌'));
        (__VLS_ctx.numberFormat(Number((item?.total_tokens / item?.chat_record_count || 0).toFixed(1))));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
        elProgress;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            percentage: (__VLS_ctx.TokenTotal
                ? Number((((item?.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1))
                : 0),
            showText: (false),
        }));
        const __VLS_76 = __VLS_75({
            percentage: (__VLS_ctx.TokenTotal
                ? Number((((item?.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1))
                : 0),
            showText: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "color-secondary mt-4" },
        });
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        (__VLS_ctx.numberFormat(item?.total_tokens || 0));
        // @ts-ignore
        [$t, $t, $t, tokensRankding, tokensRankding, tokensRankding, numberFormat, numberFormat, numberFormat, TokenTotal, TokenTotal,];
    }
}
// @ts-ignore
[];
var __VLS_42;
// @ts-ignore
[];
var __VLS_36;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_81 = __VLS_80({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const { default: __VLS_84 } = __VLS_82.slots;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    shadow: "never",
    ...{ style: {} },
}));
const __VLS_87 = __VLS_86({
    shadow: "never",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const { default: __VLS_90 } = __VLS_88.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.$t('home.chatCount'));
(__VLS_ctx.$t('views.application.title'));
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    ...{ 'onClick': {} },
    link: true,
    ...{ class: "flex align-center lighter" },
}));
const __VLS_93 = __VLS_92({
    ...{ 'onClick': {} },
    link: true,
    ...{ class: "flex align-center lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
let __VLS_96;
const __VLS_97 = {
    /** @type {typeof __VLS_96.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openDrawer('questions_agent');
        // @ts-ignore
        [$t, $t, openDrawer,];
    },
};
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_98 } = __VLS_94.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-4" },
});
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.detail'));
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({}));
const __VLS_101 = __VLS_100({}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.ArrowRight} */
ArrowRight;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
// @ts-ignore
[$t,];
var __VLS_102;
// @ts-ignore
[];
var __VLS_94;
var __VLS_95;
if (!__VLS_ctx.questionRanking || __VLS_ctx.questionRanking.length === 0) {
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.questionRanking))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "rank" },
        ...{ class: ('rank-' + (index + 1)) },
    });
    /** @type {__VLS_StyleScopedClasses['rank']} */ ;
    (index + 1);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-12" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (item?.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary font-small lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('home.activeUsers'));
    (__VLS_ctx.numberFormat(item?.chat_user_count || 0));
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        direction: "vertical",
    }));
    const __VLS_117 = __VLS_116({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    (__VLS_ctx.$t('home.average‌'));
    (__VLS_ctx.numberFormat(Number((item?.chat_record_count / item?.chat_user_count || 0).toFixed(1))));
    (__VLS_ctx.$t('home.wheel'));
    (__VLS_ctx.$t('home.person'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-right" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        percentage: (__VLS_ctx.ChatRecordTotal
            ? Number((((item?.chat_record_count || 0) / __VLS_ctx.ChatRecordTotal) * 100).toFixed(1))
            : 0),
        showText: (false),
    }));
    const __VLS_122 = __VLS_121({
        percentage: (__VLS_ctx.ChatRecordTotal
            ? Number((((item?.chat_record_count || 0) / __VLS_ctx.ChatRecordTotal) * 100).toFixed(1))
            : 0),
        showText: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    (__VLS_ctx.numberFormat(item?.chat_record_count || 0));
    // @ts-ignore
    [$t, $t, $t, $t, numberFormat, numberFormat, numberFormat, questionRanking, questionRanking, questionRanking, ChatRecordTotal, ChatRecordTotal,];
}
// @ts-ignore
[];
var __VLS_88;
// @ts-ignore
[];
var __VLS_82;
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}));
const __VLS_127 = __VLS_126({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (8),
    xl: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const { default: __VLS_130 } = __VLS_128.slots;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    shadow: "never",
    ...{ style: {} },
}));
const __VLS_133 = __VLS_132({
    shadow: "never",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.$t('home.usage'));
(__VLS_ctx.$t('views.chatLog.table.user'));
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    ...{ 'onClick': {} },
    link: true,
    ...{ class: "flex align-center lighter" },
}));
const __VLS_139 = __VLS_138({
    ...{ 'onClick': {} },
    link: true,
    ...{ class: "flex align-center lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
let __VLS_142;
const __VLS_143 = {
    /** @type {typeof __VLS_142.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openDrawer('user_tokens_agent');
        // @ts-ignore
        [$t, $t, openDrawer,];
    },
};
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_144 } = __VLS_140.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-4" },
});
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.detail'));
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({}));
const __VLS_147 = __VLS_146({}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.ArrowRight} */
ArrowRight;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({}));
const __VLS_153 = __VLS_152({}, ...__VLS_functionalComponentArgsRest(__VLS_152));
// @ts-ignore
[$t,];
var __VLS_148;
// @ts-ignore
[];
var __VLS_140;
var __VLS_141;
if (!__VLS_ctx.userTokensRanking || __VLS_ctx.userTokensRanking.length === 0) {
    let __VLS_156;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({}));
    const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.userTokensRanking))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "rank" },
        ...{ class: ('rank-' + (index + 1)) },
    });
    /** @type {__VLS_StyleScopedClasses['rank']} */ ;
    (index + 1);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-12" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (item?.asker?.username);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary font-small lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('home.chats'));
    (__VLS_ctx.numberFormat(item?.chat_record_count || 0));
    (__VLS_ctx.$t('views.system.time'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-right" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    let __VLS_161;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
        percentage: (__VLS_ctx.TokenTotal
            ? Number((((item?.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1))
            : 0),
        showText: (false),
    }));
    const __VLS_163 = __VLS_162({
        percentage: (__VLS_ctx.TokenTotal
            ? Number((((item?.total_tokens || 0) / __VLS_ctx.TokenTotal) * 100).toFixed(1))
            : 0),
        showText: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    (__VLS_ctx.numberFormat(item?.total_tokens || 0));
    // @ts-ignore
    [$t, $t, numberFormat, numberFormat, TokenTotal, TokenTotal, userTokensRanking, userTokensRanking, userTokensRanking,];
}
// @ts-ignore
[];
var __VLS_134;
// @ts-ignore
[];
var __VLS_128;
// @ts-ignore
[];
var __VLS_30;
const __VLS_166 = RankingDrawer;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    ref: "RankingDrawerRef",
}));
const __VLS_168 = __VLS_167({
    ref: "RankingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
var __VLS_171;
var __VLS_169;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_172 = __VLS_171;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
