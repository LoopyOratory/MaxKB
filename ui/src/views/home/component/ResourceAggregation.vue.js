/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import homeApi from '@/api/home-page/home';
import { toThousands } from '@/utils/common';
const router = useRouter();
const loading = ref(true);
const applicationAggregation = ref();
const knowledgeAggregation = ref();
const toolAggregation = ref();
const modelAggregation = ref();
function getDetail() {
    homeApi.getApplicationAggregation(loading).then((res) => {
        applicationAggregation.value = res.data;
    });
    homeApi.getKnowledgeAggregation(loading).then((res) => {
        knowledgeAggregation.value = res.data;
    });
    homeApi.getToolAggregation(loading).then((res) => {
        toolAggregation.value = res.data;
    });
    homeApi.getModelAggregation(loading).then((res) => {
        modelAggregation.value = res.data;
    });
}
onMounted(() => {
    getDetail();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elSkeleton | typeof __VLS_components.ElSkeleton | typeof __VLS_components['el-skeleton'] | typeof __VLS_components.elSkeleton | typeof __VLS_components.ElSkeleton | typeof __VLS_components['el-skeleton']} */
elSkeleton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    loading: (__VLS_ctx.loading),
    animated: true,
}));
const __VLS_2 = __VLS_1({
    loading: (__VLS_ctx.loading),
    animated: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    gutter: (16),
}));
const __VLS_9 = __VLS_8({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}));
const __VLS_15 = __VLS_14({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = {
    /** @type {typeof __VLS_24.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.router.push('/application');
        // @ts-ignore
        [loading, router,];
    },
};
/** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_26 } = __VLS_22.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.application.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "large-number" },
});
/** @type {__VLS_StyleScopedClasses['large-number']} */ ;
(__VLS_ctx.toThousands(__VLS_ctx.applicationAggregation?.total || 0));
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    size: (48),
    shape: "square",
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    size: (48),
    shape: "square",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon} */
appIcon;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    iconName: "app-agent-active",
    ...{ style: ({ fontSize: '28px', color: '#3370FF' }) },
}));
const __VLS_35 = __VLS_34({
    iconName: "app-agent-active",
    ...{ style: ({ fontSize: '28px', color: '#3370FF' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
// @ts-ignore
[$t, toThousands, applicationAggregation,];
var __VLS_30;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ class: "mt-12" },
}));
const __VLS_40 = __VLS_39({
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
const { default: __VLS_43 } = __VLS_41.slots;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    span: (12),
}));
const __VLS_46 = __VLS_45({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.status.published'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.applicationAggregation?.publish_count || 0));
// @ts-ignore
[$t, toThousands, applicationAggregation,];
var __VLS_47;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    span: (12),
}));
const __VLS_52 = __VLS_51({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.status.unpublished'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.applicationAggregation?.un_publish_count || 0));
// @ts-ignore
[$t, toThousands, applicationAggregation,];
var __VLS_53;
// @ts-ignore
[];
var __VLS_41;
// @ts-ignore
[];
var __VLS_22;
var __VLS_23;
// @ts-ignore
[];
var __VLS_16;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}));
const __VLS_58 = __VLS_57({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_61 } = __VLS_59.slots;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}));
const __VLS_64 = __VLS_63({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_67;
const __VLS_68 = {
    /** @type {typeof __VLS_67.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.router.push('/knowledge');
        // @ts-ignore
        [router,];
    },
};
/** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_69 } = __VLS_65.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.knowledge.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "large-number" },
});
/** @type {__VLS_StyleScopedClasses['large-number']} */ ;
(__VLS_ctx.toThousands(__VLS_ctx.knowledgeAggregation?.total || 0));
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    size: (48),
    shape: "square",
    ...{ style: {} },
}));
const __VLS_72 = __VLS_71({
    size: (48),
    shape: "square",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
const { default: __VLS_75 } = __VLS_73.slots;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon} */
appIcon;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    iconName: "app-knowledge-active",
    ...{ style: ({ fontSize: '28px', color: '#7F3BF5' }) },
}));
const __VLS_78 = __VLS_77({
    iconName: "app-knowledge-active",
    ...{ style: ({ fontSize: '28px', color: '#7F3BF5' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
// @ts-ignore
[$t, toThousands, knowledgeAggregation,];
var __VLS_73;
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    ...{ class: "mt-12" },
}));
const __VLS_83 = __VLS_82({
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
const { default: __VLS_86 } = __VLS_84.slots;
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    span: (12),
}));
const __VLS_89 = __VLS_88({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_92 } = __VLS_90.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.fileUpload.document'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.knowledgeAggregation?.document_count || 0));
// @ts-ignore
[$t, toThousands, knowledgeAggregation,];
var __VLS_90;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    span: (12),
}));
const __VLS_95 = __VLS_94({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const { default: __VLS_98 } = __VLS_96.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.status.fail'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.knowledgeAggregation?.failure_count || 0));
// @ts-ignore
[$t, toThousands, knowledgeAggregation,];
var __VLS_96;
// @ts-ignore
[];
var __VLS_84;
// @ts-ignore
[];
var __VLS_65;
var __VLS_66;
// @ts-ignore
[];
var __VLS_59;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}));
const __VLS_101 = __VLS_100({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_104 } = __VLS_102.slots;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}));
const __VLS_107 = __VLS_106({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
let __VLS_110;
const __VLS_111 = {
    /** @type {typeof __VLS_110.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.router.push('/tool');
        // @ts-ignore
        [router,];
    },
};
/** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_112 } = __VLS_108.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.tool.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "large-number" },
});
/** @type {__VLS_StyleScopedClasses['large-number']} */ ;
(__VLS_ctx.toThousands(__VLS_ctx.toolAggregation?.total || 0));
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    size: (48),
    shape: "square",
    ...{ style: {} },
}));
const __VLS_115 = __VLS_114({
    size: (48),
    shape: "square",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
const { default: __VLS_118 } = __VLS_116.slots;
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon} */
appIcon;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    iconName: "app-tool-active",
    ...{ style: ({ fontSize: '28px', color: '#2CA91F' }) },
}));
const __VLS_121 = __VLS_120({
    iconName: "app-tool-active",
    ...{ style: ({ fontSize: '28px', color: '#2CA91F' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
// @ts-ignore
[$t, toThousands, toolAggregation,];
var __VLS_116;
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    ...{ class: "mt-12" },
}));
const __VLS_126 = __VLS_125({
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
const { default: __VLS_129 } = __VLS_127.slots;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    span: (8),
}));
const __VLS_132 = __VLS_131({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const { default: __VLS_135 } = __VLS_133.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.tool.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.toolAggregation?.custom_count || 0));
// @ts-ignore
[$t, toThousands, toolAggregation,];
var __VLS_133;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    span: (8),
}));
const __VLS_138 = __VLS_137({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('workflow.workflow'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.toolAggregation?.workflow_count || 0));
// @ts-ignore
[$t, toThousands, toolAggregation,];
var __VLS_139;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    span: (8),
}));
const __VLS_144 = __VLS_143({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const { default: __VLS_147 } = __VLS_145.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.other'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.toolAggregation?.total -
    __VLS_ctx.toolAggregation?.custom_count -
    __VLS_ctx.toolAggregation?.workflow_count || 0));
// @ts-ignore
[$t, toThousands, toolAggregation, toolAggregation, toolAggregation,];
var __VLS_145;
// @ts-ignore
[];
var __VLS_127;
// @ts-ignore
[];
var __VLS_108;
var __VLS_109;
// @ts-ignore
[];
var __VLS_102;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}));
const __VLS_150 = __VLS_149({
    xs: (12),
    sm: (12),
    md: (12),
    lg: (6),
    xl: (6),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_153 } = __VLS_151.slots;
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}));
const __VLS_156 = __VLS_155({
    ...{ 'onClick': {} },
    ...{ class: "resource-card cursor" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_159;
const __VLS_160 = {
    /** @type {typeof __VLS_159.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.router.push('/model');
        // @ts-ignore
        [router,];
    },
};
/** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_161 } = __VLS_157.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.model.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "large-number" },
});
/** @type {__VLS_StyleScopedClasses['large-number']} */ ;
(__VLS_ctx.toThousands(__VLS_ctx.modelAggregation?.total || 0));
let __VLS_162;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
    size: (48),
    shape: "square",
    ...{ style: {} },
}));
const __VLS_164 = __VLS_163({
    size: (48),
    shape: "square",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
const { default: __VLS_167 } = __VLS_165.slots;
let __VLS_168;
/** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon} */
appIcon;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
    iconName: "app-model-active",
    ...{ style: ({ fontSize: '28px', color: '#FF8800' }) },
}));
const __VLS_170 = __VLS_169({
    iconName: "app-model-active",
    ...{ style: ({ fontSize: '28px', color: '#FF8800' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
// @ts-ignore
[$t, toThousands, modelAggregation,];
var __VLS_165;
let __VLS_173;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
    ...{ class: "mt-12" },
}));
const __VLS_175 = __VLS_174({
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
const { default: __VLS_178 } = __VLS_176.slots;
let __VLS_179;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    span: (8),
}));
const __VLS_181 = __VLS_180({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
const { default: __VLS_184 } = __VLS_182.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('home.llm'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.modelAggregation?.llm_count || 0));
// @ts-ignore
[$t, toThousands, modelAggregation,];
var __VLS_182;
let __VLS_185;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
    span: (8),
}));
const __VLS_187 = __VLS_186({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
const { default: __VLS_190 } = __VLS_188.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('home.embedding'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.modelAggregation?.embedding_count || 0));
// @ts-ignore
[$t, toThousands, modelAggregation,];
var __VLS_188;
let __VLS_191;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
    span: (8),
}));
const __VLS_193 = __VLS_192({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
const { default: __VLS_196 } = __VLS_194.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary lighter mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.other'));
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.toThousands(__VLS_ctx.modelAggregation?.total -
    __VLS_ctx.modelAggregation?.llm_count -
    __VLS_ctx.modelAggregation?.embedding_count || 0));
// @ts-ignore
[$t, toThousands, modelAggregation, modelAggregation, modelAggregation,];
var __VLS_194;
// @ts-ignore
[];
var __VLS_176;
// @ts-ignore
[];
var __VLS_157;
var __VLS_158;
// @ts-ignore
[];
var __VLS_151;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
