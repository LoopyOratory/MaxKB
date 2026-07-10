/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Result from '@/views/knowledge-workflow/component/action/Result.vue';
import { datetimeFormat } from '@/utils/time';
const props = withDefaults(defineProps(), {});
const emit = defineEmits(['update:currentId', 'update:currentContent']);
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
const loading = ref(false);
const visible = ref(false);
function closeHandle() { }
watch(() => props.currentId, () => { });
watch(visible, (bool) => {
    if (!bool) {
        emit('update:currentId', '');
        emit('update:currentContent', null);
    }
});
const open = () => {
    visible.value = true;
};
const __VLS_exposed = {
    open,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {};
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: "800px",
    modal: (false),
    destroyOnClose: true,
    beforeClose: (__VLS_ctx.closeHandle),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    showClose: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: "800px",
    modal: (false),
    destroyOnClose: true,
    beforeClose: (__VLS_ctx.closeHandle),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    showClose: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        ...{ class: "cursor mr-4" },
        link: true,
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        ...{ class: "cursor mr-4" },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.visible = false;
            // @ts-ignore
            [visible, visible, closeHandle,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_15 } = __VLS_11.slots;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        size: (20),
    }));
    const __VLS_18 = __VLS_17({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    const { default: __VLS_21 } = __VLS_19.slots;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.Back} */
    Back;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    // @ts-ignore
    [];
    var __VLS_19;
    // @ts-ignore
    [];
    var __VLS_11;
    var __VLS_12;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('aiChat.executionDetails.title'));
    // @ts-ignore
    [$t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('common.ExecutionRecord.title'));
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ class: "mb-24" },
    shadow: "never",
    ...{ style: {} },
}));
const __VLS_35 = __VLS_34({
    ...{ class: "mb-24" },
    shadow: "never",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
const { default: __VLS_38 } = __VLS_36.slots;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    gutter: (16),
    ...{ class: "lighter" },
}));
const __VLS_41 = __VLS_40({
    gutter: (16),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    span: (6),
}));
const __VLS_47 = __VLS_46({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('workflow.initiator'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(props.currentContent?.meta?.user_name || '-');
// @ts-ignore
[$t, $t,];
var __VLS_48;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    span: (6),
}));
const __VLS_53 = __VLS_52({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.status.label'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
if (props.currentContent?.state === 'SUCCESS') {
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_59 = __VLS_58({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_62 } = __VLS_60.slots;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ class: "color-success" },
    }));
    const __VLS_65 = __VLS_64({
        ...{ class: "color-success" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
    const { default: __VLS_68 } = __VLS_66.slots;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
    SuccessFilled;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({}));
    const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
    // @ts-ignore
    [$t,];
    var __VLS_66;
    (__VLS_ctx.$t('common.status.success'));
    // @ts-ignore
    [$t,];
    var __VLS_60;
}
else if (props.currentContent?.state === 'FAILURE') {
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_76 = __VLS_75({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_79 } = __VLS_77.slots;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ...{ class: "color-danger" },
    }));
    const __VLS_82 = __VLS_81({
        ...{ class: "color-danger" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    const { default: __VLS_85 } = __VLS_83.slots;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
    CircleCloseFilled;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({}));
    const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
    // @ts-ignore
    [];
    var __VLS_83;
    (__VLS_ctx.$t('common.status.fail'));
    // @ts-ignore
    [$t,];
    var __VLS_77;
}
else if (props.currentContent?.state === 'REVOKED') {
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_93 = __VLS_92({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_96 } = __VLS_94.slots;
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        ...{ class: "color-danger" },
    }));
    const __VLS_99 = __VLS_98({
        ...{ class: "color-danger" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    const { default: __VLS_102 } = __VLS_100.slots;
    let __VLS_103;
    /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
    CircleCloseFilled;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({}));
    const __VLS_105 = __VLS_104({}, ...__VLS_functionalComponentArgsRest(__VLS_104));
    // @ts-ignore
    [];
    var __VLS_100;
    (__VLS_ctx.$t('common.status.REVOKED'));
    // @ts-ignore
    [$t,];
    var __VLS_94;
}
else if (props.currentContent?.state === 'REVOKE') {
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_110 = __VLS_109({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_113 } = __VLS_111.slots;
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        ...{ class: "is-loading color-primary" },
    }));
    const __VLS_116 = __VLS_115({
        ...{ class: "is-loading color-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    const { default: __VLS_119 } = __VLS_117.slots;
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({}));
    const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
    // @ts-ignore
    [];
    var __VLS_117;
    (__VLS_ctx.$t('common.status.REVOKE'));
    // @ts-ignore
    [$t,];
    var __VLS_111;
}
else {
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_127 = __VLS_126({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_130 } = __VLS_128.slots;
    let __VLS_131;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
        ...{ class: "is-loading color-primary" },
    }));
    const __VLS_133 = __VLS_132({
        ...{ class: "is-loading color-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    const { default: __VLS_136 } = __VLS_134.slots;
    let __VLS_137;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({}));
    const __VLS_139 = __VLS_138({}, ...__VLS_functionalComponentArgsRest(__VLS_138));
    // @ts-ignore
    [];
    var __VLS_134;
    (__VLS_ctx.$t('common.status.STARTED'));
    // @ts-ignore
    [$t,];
    var __VLS_128;
}
// @ts-ignore
[];
var __VLS_54;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    span: (6),
}));
const __VLS_144 = __VLS_143({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const { default: __VLS_147 } = __VLS_145.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(props.currentContent?.run_time != undefined
    ? props.currentContent?.run_time?.toFixed(2) + 's'
    : '-');
// @ts-ignore
[$t,];
var __VLS_145;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    span: (6),
}));
const __VLS_150 = __VLS_149({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const { default: __VLS_153 } = __VLS_151.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('aiChat.executionDetails.createTime'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.datetimeFormat(props.currentContent?.create_time));
// @ts-ignore
[$t, datetimeFormat,];
var __VLS_151;
// @ts-ignore
[];
var __VLS_42;
// @ts-ignore
[];
var __VLS_36;
if (props.currentContent) {
    const __VLS_154 = Result;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        knowledge_id: (props.currentContent.knowledge_id),
        id: (__VLS_ctx.currentId),
        isRecord: true,
    }));
    const __VLS_156 = __VLS_155({
        knowledge_id: (props.currentContent.knowledge_id),
        id: (__VLS_ctx.currentId),
        isRecord: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
}
// @ts-ignore
[currentId,];
var __VLS_30;
{
    const { footer: __VLS_159 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_160;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_165;
    const __VLS_166 = {
        /** @type {typeof __VLS_165.click} */
        onClick: (__VLS_ctx.pre),
    };
    const { default: __VLS_167 } = __VLS_163.slots;
    (__VLS_ctx.$t('common.pages.prev'));
    // @ts-ignore
    [$t, pre_disable, loading, pre,];
    var __VLS_163;
    var __VLS_164;
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_173;
    const __VLS_174 = {
        /** @type {typeof __VLS_173.click} */
        onClick: (__VLS_ctx.next),
    };
    const { default: __VLS_175 } = __VLS_171.slots;
    (__VLS_ctx.$t('common.pages.next'));
    // @ts-ignore
    [$t, loading, next_disable, next,];
    var __VLS_171;
    var __VLS_172;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
