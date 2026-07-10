/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import AppCharts from '@/components/app-charts/index.vue';
import { getAttrsArray, getSum } from '@/utils/array';
import { numberFormat } from '@/utils/common';
import { t } from '@/locales';
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    tokenUsage: {
        type: Array,
        default: () => [],
    },
    topQuestions: {
        type: Array,
        default: () => [],
    },
});
const statisticsType = computed(() => [
    {
        id: 'customerCharts',
        name: t('home.activeUsers'),
        icon: 'app-user',
        background: '#EBF1FF',
        color: '#3370FF',
        sum: [
            getSum(getAttrsArray(props.data, 'customer_num') || 0),
            getSum(getAttrsArray(props.data, 'customer_added_count') || 0),
        ],
        option: {
            title: t('home.activeUsers'),
            xData: getAttrsArray(props.data, 'day'),
            yData: [
                {
                    name: t('home.activeUsers'),
                    area: true,
                    data: getAttrsArray(props.data, 'customer_num'),
                },
                {
                    name: t('home.newUsers'),
                    area: true,
                    data: getAttrsArray(props.data, 'customer_added_count'),
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
        sum: [getSum(getAttrsArray(props.data, 'chat_record_count') || 0)],
        option: {
            title: t('home.chatCount'),
            xData: getAttrsArray(props.data, 'day'),
            yData: [
                {
                    data: getAttrsArray(props.data, 'chat_record_count'),
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
        sum: [getSum(getAttrsArray(props.data, 'tokens_num') || 0)],
        option: {
            title: t('home.charts.tokensTotal'),
            xData: getAttrsArray(props.data, 'day'),
            yData: [
                {
                    data: getAttrsArray(props.data, 'tokens_num'),
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
            getSum(getAttrsArray(props.data, 'star_num') || 0),
            getSum(getAttrsArray(props.data, 'trample_num') || 0),
        ],
        option: {
            title: t('home.charts.userSatisfaction'),
            xData: getAttrsArray(props.data, 'day'),
            yData: [
                {
                    name: t('home.charts.approval'),
                    data: getAttrsArray(props.data, 'star_num'),
                    area: true,
                },
                {
                    name: t('home.charts.disapproval'),
                    data: getAttrsArray(props.data, 'trample_num'),
                    area: true,
                },
            ],
        },
    },
]);
const topOptions = [
    { label: 'TOP 10', value: 10 },
    { label: 'TOP 20', value: 20 },
    { label: 'TOP 50', value: 50 },
    { label: 'TOP 100', value: 100 },
];
const tokenUsageCount = ref(10);
const topQuestionsCount = ref(10);
const tokenUsageOption = computed(() => {
    return {
        title: 'Tokens ' + t('home.usage') + ' · Top ' + t('views.chatLog.table.user'),
        xData: getAttrsArray(props.tokenUsage?.slice(0, tokenUsageCount.value), 'username'),
        yData: [
            {
                data: getAttrsArray(props.tokenUsage?.slice(0, tokenUsageCount.value), 'token_usage'),
                area: true,
            },
        ],
        dataZoom: props.tokenUsage.length > 20,
    };
});
const topQuestionsOption = computed(() => {
    return {
        title: t('home.chatCount') + ' · Top ' + t('views.chatLog.table.user'),
        xData: getAttrsArray(props.topQuestions?.slice(0, topQuestionsCount.value), 'username'),
        yData: [
            {
                data: getAttrsArray(props.topQuestions?.slice(0, topQuestionsCount.value), 'chat_record_count'),
                area: true,
            },
        ],
        dataZoom: props.topQuestions.length > 20,
    };
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (16),
}));
const __VLS_2 = __VLS_1({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.statisticsType))) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        key: (index),
        ...{ class: "mb-16" },
    }));
    const __VLS_9 = __VLS_8({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        key: (index),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        shadow: "never",
    }));
    const __VLS_15 = __VLS_14({
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center ml-8 mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        size: (40),
        shape: "square",
        ...{ style: ({ background: item.background }) },
    }));
    const __VLS_21 = __VLS_20({
        size: (40),
        shape: "square",
        ...{ style: ({ background: item.background }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon} */
    appIcon;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        iconName: (item.icon),
        ...{ style: ({ fontSize: '24px', color: item.color }) },
    }));
    const __VLS_27 = __VLS_26({
        iconName: (item.icon),
        ...{ style: ({ fontSize: '24px', color: item.color }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    // @ts-ignore
    [statisticsType,];
    var __VLS_22;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-12" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
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
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            iconName: "app-like-color",
        }));
        const __VLS_32 = __VLS_31({
            iconName: "app-like-color",
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (item.sum?.[0]);
        let __VLS_35;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
            ...{ class: "ml-12" },
            iconName: "app-oppose-color",
        }));
        const __VLS_37 = __VLS_36({
            ...{ class: "ml-12" },
            iconName: "app-oppose-color",
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (item.sum?.[1]);
    }
    // @ts-ignore
    [numberFormat, numberFormat,];
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.statisticsType))) {
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        xs: (24),
        sm: (24),
        md: (24),
        lg: (12),
        xl: (12),
        key: (index),
        ...{ class: "mb-16" },
    }));
    const __VLS_42 = __VLS_41({
        xs: (24),
        sm: (24),
        md: (24),
        lg: (12),
        xl: (12),
        key: (index),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_45 } = __VLS_43.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        shadow: "never",
    }));
    const __VLS_48 = __VLS_47({
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    const { default: __VLS_51 } = __VLS_49.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    const __VLS_52 = AppCharts;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        height: "316px",
        id: (item.id),
        type: "line",
        option: (item.option),
    }));
    const __VLS_54 = __VLS_53({
        height: "316px",
        id: (item.id),
        type: "line",
        option: (item.option),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    // @ts-ignore
    [statisticsType,];
    var __VLS_49;
    // @ts-ignore
    [];
    var __VLS_43;
    // @ts-ignore
    [];
}
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    xs: (24),
    sm: (24),
    md: (24),
    lg: (12),
    xl: (12),
    ...{ class: "mb-16" },
}));
const __VLS_59 = __VLS_58({
    xs: (24),
    sm: (24),
    md: (24),
    lg: (12),
    xl: (12),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_62 } = __VLS_60.slots;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    shadow: "never",
    ...{ class: "StatisticsCharts-card" },
}));
const __VLS_65 = __VLS_64({
    shadow: "never",
    ...{ class: "StatisticsCharts-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
/** @type {__VLS_StyleScopedClasses['StatisticsCharts-card']} */ ;
const { default: __VLS_68 } = __VLS_66.slots;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    modelValue: (__VLS_ctx.tokenUsageCount),
    ...{ class: "top-select" },
}));
const __VLS_71 = __VLS_70({
    modelValue: (__VLS_ctx.tokenUsageCount),
    ...{ class: "top-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
/** @type {__VLS_StyleScopedClasses['top-select']} */ ;
const { default: __VLS_74 } = __VLS_72.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.topOptions))) {
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_77 = __VLS_76({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    // @ts-ignore
    [tokenUsageCount, topOptions,];
}
// @ts-ignore
[];
var __VLS_72;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
if (__VLS_ctx.tokenUsage.length > 0) {
    const __VLS_80 = AppCharts;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        height: "316px",
        id: "tokenUsageCharts",
        type: "bar",
        option: (__VLS_ctx.tokenUsageOption),
    }));
    const __VLS_82 = __VLS_81({
        height: "316px",
        id: "tokenUsageCharts",
        type: "bar",
        option: (__VLS_ctx.tokenUsageOption),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.tokenUsageOption.title);
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        description: (__VLS_ctx.$t('common.noData')),
        ...{ style: {} },
    }));
    const __VLS_87 = __VLS_86({
        description: (__VLS_ctx.$t('common.noData')),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
}
// @ts-ignore
[tokenUsage, tokenUsageOption, tokenUsageOption, $t,];
var __VLS_66;
// @ts-ignore
[];
var __VLS_60;
let __VLS_90;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    xs: (24),
    sm: (24),
    md: (24),
    lg: (12),
    xl: (12),
    ...{ class: "mb-16" },
}));
const __VLS_92 = __VLS_91({
    xs: (24),
    sm: (24),
    md: (24),
    lg: (12),
    xl: (12),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_95 } = __VLS_93.slots;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    shadow: "never",
    ...{ class: "StatisticsCharts-card" },
}));
const __VLS_98 = __VLS_97({
    shadow: "never",
    ...{ class: "StatisticsCharts-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
/** @type {__VLS_StyleScopedClasses['StatisticsCharts-card']} */ ;
const { default: __VLS_101 } = __VLS_99.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    modelValue: (__VLS_ctx.topQuestionsCount),
    ...{ class: "top-select" },
}));
const __VLS_104 = __VLS_103({
    modelValue: (__VLS_ctx.topQuestionsCount),
    ...{ class: "top-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
/** @type {__VLS_StyleScopedClasses['top-select']} */ ;
const { default: __VLS_107 } = __VLS_105.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.topOptions))) {
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_110 = __VLS_109({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    // @ts-ignore
    [topOptions, topQuestionsCount,];
}
// @ts-ignore
[];
var __VLS_105;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
if (__VLS_ctx.topQuestions.length > 0) {
    const __VLS_113 = AppCharts;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        height: "316px",
        id: "topQuestionsCharts",
        type: "bar",
        option: (__VLS_ctx.topQuestionsOption),
    }));
    const __VLS_115 = __VLS_114({
        height: "316px",
        id: "topQuestionsCharts",
        type: "bar",
        option: (__VLS_ctx.topQuestionsOption),
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.topQuestionsOption.title);
    let __VLS_118;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
        description: (__VLS_ctx.$t('common.noData')),
        ...{ style: {} },
    }));
    const __VLS_120 = __VLS_119({
        description: (__VLS_ctx.$t('common.noData')),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
}
// @ts-ignore
[$t, topQuestions, topQuestionsOption, topQuestionsOption,];
var __VLS_99;
// @ts-ignore
[];
var __VLS_93;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        tokenUsage: {
            type: Array,
            default: () => [],
        },
        topQuestions: {
            type: Array,
            default: () => [],
        },
    },
});
export default {};
