/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { resetUrl } from '@/utils/common';
import { datetimeFormat } from '@/utils/time';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import ExecutionDetailCard from '@/components/execution-detail-card/index.vue';
import { arraySort } from '@/utils/array';
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
    if (!props.currentContent) {
        return;
    }
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .getToolRecordDetail(props.currentContent?.tool_id, props.currentContent?.id, loading)
        .then((ok) => {
        detail.value = ok.data;
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
(__VLS_ctx.$t('views.trigger.triggerSource'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (props.currentContent?.source_type === 'KNOWLEDGE') {
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
    KnowledgeIcon;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        size: (22),
        type: (4),
    }));
    const __VLS_53 = __VLS_52({
        size: (22),
        type: (4),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
}
else if (props.currentContent?.source_type === 'TRIGGER') {
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.TriggerIcon} */
    TriggerIcon;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        type: (props.currentContent?.trigger_type),
        size: (22),
    }));
    const __VLS_58 = __VLS_57({
        type: (props.currentContent?.trigger_type),
        size: (22),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
}
else {
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        shape: "square",
        size: (22),
        ...{ style: {} },
    }));
    const __VLS_63 = __VLS_62({
        shape: "square",
        size: (22),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    const { default: __VLS_66 } = __VLS_64.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(props.currentContent?.source_icon, __VLS_ctx.resetUrl('./favicon.ico'))),
        alt: "",
    });
    // @ts-ignore
    [$t, $t, resetUrl, resetUrl,];
    var __VLS_64;
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
if (__VLS_ctx.apiType === 'systemShare') {
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        span: (6),
    }));
    const __VLS_69 = __VLS_68({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    const { default: __VLS_72 } = __VLS_70.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (__VLS_ctx.$t('views.workspace.title'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    (props.currentContent?.workspace_name);
    // @ts-ignore
    [$t, apiType,];
    var __VLS_70;
}
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    span: (6),
}));
const __VLS_75 = __VLS_74({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-secondary mb-4" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('common.status.label'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
if (props.currentContent?.state === 'SUCCESS') {
    let __VLS_79;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_81 = __VLS_80({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_84 } = __VLS_82.slots;
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ class: "color-success" },
    }));
    const __VLS_87 = __VLS_86({
        ...{ class: "color-success" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
    const { default: __VLS_90 } = __VLS_88.slots;
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
    SuccessFilled;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({}));
    const __VLS_93 = __VLS_92({}, ...__VLS_functionalComponentArgsRest(__VLS_92));
    // @ts-ignore
    [$t,];
    var __VLS_88;
    (__VLS_ctx.$t('common.status.success'));
    // @ts-ignore
    [$t,];
    var __VLS_82;
}
else if (props.currentContent?.state === 'FAILURE') {
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_98 = __VLS_97({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_101 } = __VLS_99.slots;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ class: "color-danger" },
    }));
    const __VLS_104 = __VLS_103({
        ...{ class: "color-danger" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    const { default: __VLS_107 } = __VLS_105.slots;
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
    CircleCloseFilled;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({}));
    const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
    // @ts-ignore
    [];
    var __VLS_105;
    (__VLS_ctx.$t('common.status.fail'));
    // @ts-ignore
    [$t,];
    var __VLS_99;
}
else if (props.currentContent?.state === 'REVOKED') {
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_115 = __VLS_114({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_118 } = __VLS_116.slots;
    let __VLS_119;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
        ...{ class: "color-danger" },
    }));
    const __VLS_121 = __VLS_120({
        ...{ class: "color-danger" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    const { default: __VLS_124 } = __VLS_122.slots;
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
    CircleCloseFilled;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({}));
    const __VLS_127 = __VLS_126({}, ...__VLS_functionalComponentArgsRest(__VLS_126));
    // @ts-ignore
    [];
    var __VLS_122;
    (__VLS_ctx.$t('common.status.REVOKED'));
    // @ts-ignore
    [$t,];
    var __VLS_116;
}
else if (props.currentContent?.state === 'REVOKE') {
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_132 = __VLS_131({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_135 } = __VLS_133.slots;
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        ...{ class: "is-loading color-primary" },
    }));
    const __VLS_138 = __VLS_137({
        ...{ class: "is-loading color-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    const { default: __VLS_141 } = __VLS_139.slots;
    let __VLS_142;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({}));
    const __VLS_144 = __VLS_143({}, ...__VLS_functionalComponentArgsRest(__VLS_143));
    // @ts-ignore
    [];
    var __VLS_139;
    (__VLS_ctx.$t('common.status.REVOKE'));
    // @ts-ignore
    [$t,];
    var __VLS_133;
}
else {
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        ...{ class: "color-text-primary" },
    }));
    const __VLS_149 = __VLS_148({
        ...{ class: "color-text-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    const { default: __VLS_152 } = __VLS_150.slots;
    let __VLS_153;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
        ...{ class: "is-loading color-primary" },
    }));
    const __VLS_155 = __VLS_154({
        ...{ class: "is-loading color-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    const { default: __VLS_158 } = __VLS_156.slots;
    let __VLS_159;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({}));
    const __VLS_161 = __VLS_160({}, ...__VLS_functionalComponentArgsRest(__VLS_160));
    // @ts-ignore
    [];
    var __VLS_156;
    (__VLS_ctx.$t('common.status.STARTED'));
    // @ts-ignore
    [$t,];
    var __VLS_150;
}
// @ts-ignore
[];
var __VLS_76;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    span: (6),
}));
const __VLS_166 = __VLS_165({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const { default: __VLS_169 } = __VLS_167.slots;
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
var __VLS_167;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    span: (6),
}));
const __VLS_172 = __VLS_171({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
const { default: __VLS_175 } = __VLS_173.slots;
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
var __VLS_173;
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
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    ...{ class: "mb-8" },
    shadow: "never",
    ...{ style: {} },
}));
const __VLS_178 = __VLS_177({
    ...{ class: "mb-8" },
    shadow: "never",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_181 } = __VLS_179.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.showDetail = !__VLS_ctx.showDetail;
            // @ts-ignore
            [$t, showDetail, showDetail,];
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
let __VLS_182;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.showDetail ? 'rotate-90' : '') },
}));
const __VLS_184 = __VLS_183({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.showDetail ? 'rotate-90' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_187 } = __VLS_185.slots;
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
CaretRight;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({}));
const __VLS_190 = __VLS_189({}, ...__VLS_functionalComponentArgsRest(__VLS_189));
// @ts-ignore
[showDetail,];
var __VLS_185;
if (props.currentContent?.tool_icon) {
    let __VLS_193;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
        shape: "square",
        size: (24),
        ...{ style: {} },
    }));
    const __VLS_195 = __VLS_194({
        shape: "square",
        size: (24),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    const { default: __VLS_198 } = __VLS_196.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(props.currentContent?.tool_icon)),
        alt: "",
    });
    // @ts-ignore
    [resetUrl,];
    var __VLS_196;
}
else {
    let __VLS_199;
    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
    ToolIcon;
    // @ts-ignore
    const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
        size: (24),
        type: "WORKFLOW",
    }));
    const __VLS_201 = __VLS_200({
        size: (24),
        type: "WORKFLOW",
    }, ...__VLS_functionalComponentArgsRest(__VLS_200));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "ml-8" },
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
(props.currentContent?.source_name);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (__VLS_ctx.detail?.state !== 'STARTED') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-16 color-secondary" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    (__VLS_ctx.detail?.run_time?.toFixed(2) || 0.0);
}
if (__VLS_ctx.detail?.state === 'SUCCESS') {
    let __VLS_204;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
        ...{ class: "color-success" },
        size: (16),
    }));
    const __VLS_206 = __VLS_205({
        ...{ class: "color-success" },
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
    const { default: __VLS_209 } = __VLS_207.slots;
    let __VLS_210;
    /** @ts-ignore @type { | typeof __VLS_components.CircleCheck} */
    CircleCheck;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({}));
    const __VLS_212 = __VLS_211({}, ...__VLS_functionalComponentArgsRest(__VLS_211));
    // @ts-ignore
    [detail, detail, detail,];
    var __VLS_207;
}
else if (__VLS_ctx.detail?.state === 'STARTED') {
    let __VLS_215;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
        ...{ class: "is-loading" },
        size: (16),
    }));
    const __VLS_217 = __VLS_216({
        ...{ class: "is-loading" },
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    const { default: __VLS_220 } = __VLS_218.slots;
    let __VLS_221;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({}));
    const __VLS_223 = __VLS_222({}, ...__VLS_functionalComponentArgsRest(__VLS_222));
    // @ts-ignore
    [detail,];
    var __VLS_218;
}
else {
    let __VLS_226;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
        ...{ class: "color-danger" },
        size: (16),
    }));
    const __VLS_228 = __VLS_227({
        ...{ class: "color-danger" },
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    const { default: __VLS_231 } = __VLS_229.slots;
    let __VLS_232;
    /** @ts-ignore @type { | typeof __VLS_components.CircleClose} */
    CircleClose;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({}));
    const __VLS_234 = __VLS_233({}, ...__VLS_functionalComponentArgsRest(__VLS_233));
    // @ts-ignore
    [];
    var __VLS_229;
}
let __VLS_237;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({}));
const __VLS_239 = __VLS_238({}, ...__VLS_functionalComponentArgsRest(__VLS_238));
const { default: __VLS_242 } = __VLS_240.slots;
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
    for (const [f, i] of __VLS_vFor((__VLS_ctx.detail?.meta?.input))) {
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
        [$t, showDetail, detail,];
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
    for (const [f, i] of __VLS_vFor((__VLS_ctx.detail?.meta?.output))) {
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
        [$t, detail,];
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
    for (const [cLoop, cIndex] of __VLS_vFor((__VLS_ctx.arraySort(Object.values(__VLS_ctx.detail?.meta?.details ?? {}) ?? [], 'index')))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (cIndex),
        });
        const __VLS_243 = ExecutionDetailCard || ExecutionDetailCard;
        // @ts-ignore
        const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
            data: (cLoop),
        }));
        const __VLS_245 = __VLS_244({
            data: (cLoop),
        }, ...__VLS_functionalComponentArgsRest(__VLS_244));
        // @ts-ignore
        [$t, detail, arraySort,];
    }
}
// @ts-ignore
[];
var __VLS_240;
// @ts-ignore
[];
var __VLS_179;
// @ts-ignore
[];
var __VLS_30;
{
    const { footer: __VLS_248 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_249;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }));
    const __VLS_251 = __VLS_250({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    let __VLS_254;
    const __VLS_255 = {
        /** @type {typeof __VLS_254.click} */
        onClick: (__VLS_ctx.pre),
    };
    const { default: __VLS_256 } = __VLS_252.slots;
    (__VLS_ctx.$t('common.pages.prev'));
    // @ts-ignore
    [$t, pre_disable, loading, pre,];
    var __VLS_252;
    var __VLS_253;
    let __VLS_257;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }));
    const __VLS_259 = __VLS_258({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    let __VLS_262;
    const __VLS_263 = {
        /** @type {typeof __VLS_262.click} */
        onClick: (__VLS_ctx.next),
    };
    const { default: __VLS_264 } = __VLS_260.slots;
    (__VLS_ctx.$t('common.pages.next'));
    // @ts-ignore
    [$t, loading, next_disable, next,];
    var __VLS_260;
    var __VLS_261;
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
