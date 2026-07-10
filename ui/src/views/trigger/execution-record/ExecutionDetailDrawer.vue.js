/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { arraySort } from '@/utils/array';
import { resetUrl } from '@/utils/common';
import ExecutionDetailCard from '@/components/execution-detail-card/index.vue';
import ExecutionDetailContent from '@/components/ai-chat/component/knowledge-source-component/ExecutionDetailContent.vue';
import { datetimeFormat } from '@/utils/time';
import triggerAPI from '@/api/trigger/trigger';
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
const taskRecordDetails = ref();
const detail = ref(null);
const showDetail = ref(true);
const loading = ref(false);
const visible = ref(false);
function closeHandle() { }
watch(() => props.currentId, () => {
    if (props.currentId) {
        getDetail();
    }
});
watch(visible, (bool) => {
    if (!bool) {
        emit('update:currentId', '');
        emit('update:currentContent', null);
    }
});
function getDetail() {
    triggerAPI
        .getTriggerTaskRecordDetails(props.currentContent?.trigger_id, props.currentContent?.trigger_task_id, props.currentContent?.id)
        .then((ok) => {
        if (ok.data.details) {
            if ('tool_call' in ok.data.details) {
                if (props.currentContent?.source_name) {
                    ok.data.details['tool_call']['name'] = props.currentContent.source_name;
                }
            }
            detail.value = Object.values(ok.data.details);
        }
        taskRecordDetails.value = ok.data;
    });
}
const open = (row) => {
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
(__VLS_ctx.$t('views.trigger.triggerTask'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (props.currentContent?.source_type === 'TOOL' &&
    !props.currentContent?.source_icon) {
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
    ToolIcon;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        size: (22),
    }));
    const __VLS_53 = __VLS_52({
        size: (22),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
}
else {
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        shape: "square",
        size: (22),
        ...{ style: {} },
    }));
    const __VLS_58 = __VLS_57({
        shape: "square",
        size: (22),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const { default: __VLS_61 } = __VLS_59.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(props.currentContent?.source_icon, __VLS_ctx.resetUrl('./favicon.ico'))),
        alt: "",
    });
    // @ts-ignore
    [$t, $t, resetUrl, resetUrl,];
    var __VLS_59;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ellipsis-1 ml-8" },
    title: (props.currentContent?.source_name),
});
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
(props.currentContent?.source_name || '-');
// @ts-ignore
[];
var __VLS_48;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    span: (6),
}));
const __VLS_64 = __VLS_63({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.status.label'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
if (props.currentContent?.state === 'SUCCESS') {
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_70 = __VLS_69({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_73 } = __VLS_71.slots;
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        ...{ class: "color-success" },
    }));
    const __VLS_76 = __VLS_75({
        ...{ class: "color-success" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
    const { default: __VLS_79 } = __VLS_77.slots;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
    SuccessFilled;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({}));
    const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
    // @ts-ignore
    [$t,];
    var __VLS_77;
    (__VLS_ctx.$t('common.status.success'));
    // @ts-ignore
    [$t,];
    var __VLS_71;
}
else if (props.currentContent?.state === 'FAILURE') {
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
        ...{ class: "color-danger" },
    }));
    const __VLS_93 = __VLS_92({
        ...{ class: "color-danger" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    const { default: __VLS_96 } = __VLS_94.slots;
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
    CircleCloseFilled;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({}));
    const __VLS_99 = __VLS_98({}, ...__VLS_functionalComponentArgsRest(__VLS_98));
    // @ts-ignore
    [];
    var __VLS_94;
    (__VLS_ctx.$t('common.status.fail'));
    // @ts-ignore
    [$t,];
    var __VLS_88;
}
else if (props.currentContent?.state === 'REVOKED') {
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
    (__VLS_ctx.$t('common.status.REVOKED'));
    // @ts-ignore
    [$t,];
    var __VLS_105;
}
else if (props.currentContent?.state === 'REVOKE') {
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
        ...{ class: "is-loading color-primary" },
    }));
    const __VLS_127 = __VLS_126({
        ...{ class: "is-loading color-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    const { default: __VLS_130 } = __VLS_128.slots;
    let __VLS_131;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({}));
    const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
    // @ts-ignore
    [];
    var __VLS_128;
    (__VLS_ctx.$t('common.status.REVOKE'));
    // @ts-ignore
    [$t,];
    var __VLS_122;
}
else {
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
    (__VLS_ctx.$t('common.status.STARTED'));
    // @ts-ignore
    [$t,];
    var __VLS_139;
}
// @ts-ignore
[];
var __VLS_65;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    span: (6),
}));
const __VLS_155 = __VLS_154({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
const { default: __VLS_158 } = __VLS_156.slots;
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
var __VLS_156;
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    span: (6),
}));
const __VLS_161 = __VLS_160({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
const { default: __VLS_164 } = __VLS_162.slots;
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
var __VLS_162;
// @ts-ignore
[];
var __VLS_42;
// @ts-ignore
[];
var __VLS_36;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('aiChat.executionDetails.title'));
if (__VLS_ctx.taskRecordDetails && __VLS_ctx.taskRecordDetails.state === 'TRIGGER_ERROR') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-never border-r-6 mb-12" },
    });
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "p-8-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    (__VLS_ctx.$t('views.trigger.triggerParam'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8-12 border-t-dashed lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.taskRecordDetails.meta.input);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-never border-r-6 mb-12" },
    });
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "p-8-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    (__VLS_ctx.$t('views.trigger.errorMsg'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8-12 border-t-dashed lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.taskRecordDetails.meta.err_message);
}
else if (props.currentContent?.source_type === 'APPLICATION') {
    const __VLS_165 = ExecutionDetailContent || ExecutionDetailContent;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        detail: (__VLS_ctx.detail),
        appType: (props.currentContent.type),
    }));
    const __VLS_167 = __VLS_166({
        detail: (__VLS_ctx.detail),
        appType: (props.currentContent.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
}
else if (props.currentContent?.type === 'WORKFLOW') {
    let __VLS_170;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
        ...{ class: "mb-8" },
        shadow: "never",
        ...{ style: {} },
    }));
    const __VLS_172 = __VLS_171({
        ...{ class: "mb-8" },
        shadow: "never",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    const { default: __VLS_175 } = __VLS_173.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.taskRecordDetails && __VLS_ctx.taskRecordDetails.state === 'TRIGGER_ERROR'))
                    throw 0;
                if (!!(props.currentContent?.source_type === 'APPLICATION'))
                    throw 0;
                if (!(props.currentContent?.type === 'WORKFLOW'))
                    throw 0;
                return __VLS_ctx.showDetail = !__VLS_ctx.showDetail;
                // @ts-ignore
                [$t, $t, $t, taskRecordDetails, taskRecordDetails, taskRecordDetails, taskRecordDetails, detail, showDetail, showDetail,];
            } },
        ...{ class: "flex-between cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_176;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.showDetail ? 'rotate-90' : '') },
    }));
    const __VLS_178 = __VLS_177({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.showDetail ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_181 } = __VLS_179.slots;
    let __VLS_182;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({}));
    const __VLS_184 = __VLS_183({}, ...__VLS_functionalComponentArgsRest(__VLS_183));
    // @ts-ignore
    [showDetail,];
    var __VLS_179;
    if (__VLS_ctx.taskRecordDetails?.tool_icon) {
        let __VLS_187;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
            shape: "square",
            size: (24),
            ...{ style: {} },
        }));
        const __VLS_189 = __VLS_188({
            shape: "square",
            size: (24),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_188));
        const { default: __VLS_192 } = __VLS_190.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.resetUrl(__VLS_ctx.taskRecordDetails?.tool_icon)),
            alt: "",
        });
        // @ts-ignore
        [resetUrl, taskRecordDetails, taskRecordDetails,];
        var __VLS_190;
    }
    else {
        let __VLS_193;
        /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
        ToolIcon;
        // @ts-ignore
        const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
            size: (24),
            type: "WORKFLOW",
        }));
        const __VLS_195 = __VLS_194({
            size: (24),
            type: "WORKFLOW",
        }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    (__VLS_ctx.currentContent?.source_name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    if (__VLS_ctx.taskRecordDetails?.state !== 'STARTED') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-16 color-secondary" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.taskRecordDetails?.run_time?.toFixed(2) || 0.0);
    }
    if (__VLS_ctx.taskRecordDetails?.state === 'SUCCESS') {
        let __VLS_198;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
            ...{ class: "color-success" },
            size: (16),
        }));
        const __VLS_200 = __VLS_199({
            ...{ class: "color-success" },
            size: (16),
        }, ...__VLS_functionalComponentArgsRest(__VLS_199));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_203 } = __VLS_201.slots;
        let __VLS_204;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCheck} */
        CircleCheck;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({}));
        const __VLS_206 = __VLS_205({}, ...__VLS_functionalComponentArgsRest(__VLS_205));
        // @ts-ignore
        [taskRecordDetails, taskRecordDetails, taskRecordDetails, currentContent,];
        var __VLS_201;
    }
    else if (__VLS_ctx.taskRecordDetails?.state === 'STARTED') {
        let __VLS_209;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
            ...{ class: "is-loading" },
            size: (16),
        }));
        const __VLS_211 = __VLS_210({
            ...{ class: "is-loading" },
            size: (16),
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        const { default: __VLS_214 } = __VLS_212.slots;
        let __VLS_215;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({}));
        const __VLS_217 = __VLS_216({}, ...__VLS_functionalComponentArgsRest(__VLS_216));
        // @ts-ignore
        [taskRecordDetails,];
        var __VLS_212;
    }
    else {
        let __VLS_220;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
            ...{ class: "color-danger" },
            size: (16),
        }));
        const __VLS_222 = __VLS_221({
            ...{ class: "color-danger" },
            size: (16),
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_225 } = __VLS_223.slots;
        let __VLS_226;
        /** @ts-ignore @type { | typeof __VLS_components.CircleClose} */
        CircleClose;
        // @ts-ignore
        const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({}));
        const __VLS_228 = __VLS_227({}, ...__VLS_functionalComponentArgsRest(__VLS_227));
        // @ts-ignore
        [];
        var __VLS_223;
    }
    let __VLS_231;
    /** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
    elCollapseTransition;
    // @ts-ignore
    const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({}));
    const __VLS_233 = __VLS_232({}, ...__VLS_functionalComponentArgsRest(__VLS_232));
    const { default: __VLS_236 } = __VLS_234.slots;
    if (__VLS_ctx.showDetail) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mt-12" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-never border-r-6" },
        });
        /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        (__VLS_ctx.$t('common.param.inputParam'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        for (const [f, i] of __VLS_vFor((__VLS_ctx.taskRecordDetails?.meta?.input))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                key: (i),
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (i);
            (f);
            // @ts-ignore
            [$t, taskRecordDetails, showDetail,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-never border-r-6 mt-8" },
        });
        /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        (__VLS_ctx.$t('common.param.outputParam'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12 border-t-dashed lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        for (const [f, i] of __VLS_vFor((__VLS_ctx.taskRecordDetails?.meta?.output))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                key: (i),
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (i);
            (f);
            // @ts-ignore
            [$t, taskRecordDetails,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-never border-r-6 mt-8" },
        });
        /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        (__VLS_ctx.$t('aiChat.executionDetails.title'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12 border-t-dashed lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        for (const [cLoop, cIndex] of __VLS_vFor((__VLS_ctx.arraySort(Object.values(__VLS_ctx.taskRecordDetails?.meta?.details ?? {}) ?? [], 'index')))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (cIndex),
            });
            const __VLS_237 = ExecutionDetailCard || ExecutionDetailCard;
            // @ts-ignore
            const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
                data: (cLoop),
            }));
            const __VLS_239 = __VLS_238({
                data: (cLoop),
            }, ...__VLS_functionalComponentArgsRest(__VLS_238));
            // @ts-ignore
            [$t, taskRecordDetails, arraySort,];
        }
    }
    // @ts-ignore
    [];
    var __VLS_234;
    // @ts-ignore
    [];
    var __VLS_173;
}
else {
    for (const [item, index] of __VLS_vFor((__VLS_ctx.arraySort(__VLS_ctx.detail ?? [], 'index')))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        const __VLS_242 = ExecutionDetailCard || ExecutionDetailCard;
        // @ts-ignore
        const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
            data: (item),
        }));
        const __VLS_244 = __VLS_243({
            data: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_243));
        // @ts-ignore
        [detail, arraySort,];
    }
}
// @ts-ignore
[];
var __VLS_30;
{
    const { footer: __VLS_247 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_248;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }));
    const __VLS_250 = __VLS_249({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    let __VLS_253;
    const __VLS_254 = {
        /** @type {typeof __VLS_253.click} */
        onClick: (__VLS_ctx.pre),
    };
    const { default: __VLS_255 } = __VLS_251.slots;
    (__VLS_ctx.$t('common.pages.prev'));
    // @ts-ignore
    [$t, pre_disable, loading, pre,];
    var __VLS_251;
    var __VLS_252;
    let __VLS_256;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }));
    const __VLS_258 = __VLS_257({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    let __VLS_261;
    const __VLS_262 = {
        /** @type {typeof __VLS_261.click} */
        onClick: (__VLS_ctx.next),
    };
    const { default: __VLS_263 } = __VLS_259.slots;
    (__VLS_ctx.$t('common.pages.next'));
    // @ts-ignore
    [$t, loading, next_disable, next,];
    var __VLS_259;
    var __VLS_260;
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
