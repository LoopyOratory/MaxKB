/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const props = defineProps({
    lf: Object || String || null,
});
const isDrag = ref(false);
function zoomIn() {
    props.lf?.zoom(true, [0, 0]);
}
function zoomOut() {
    props.lf?.zoom(false, [0, 0]);
}
function fitView() {
    props.lf?.resetZoom();
    props.lf?.resetTranslate();
    props.lf?.fitView();
}
const layout = () => {
    props.lf?.extension.dagre.layout();
    props.lf?.graphModel.nodes.forEach((node) => {
        if (node.type === 'loop-body-node') {
            node?.loopLayout?.();
        }
    });
};
const retract = () => {
    props.lf?.graphModel.nodes.forEach((element) => {
        element.properties.showNode = false;
    });
};
const extend = () => {
    props.lf?.graphModel.nodes.forEach((element) => {
        element.properties.showNode = true;
    });
};
const changeCursor = (bool) => {
    const element = document.querySelector('.lf-drag-able');
    isDrag.value = bool;
    if (bool) {
        element.style.cursor = 'default';
        props.lf?.openSelectionSelect();
        props.lf?.extension.selectionSelect.setSelectionSense(true, false);
    }
    else {
        element.style.cursor = 'pointer';
        props.lf?.closeSelectionSelect();
    }
};
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
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    shadow: "always",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    shadow: "always",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    ...{ style: {} },
    ...{ class: ({ 'is-drag-active': __VLS_ctx.isDrag }) },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    ...{ style: {} },
    ...{ class: ({ 'is-drag-active': __VLS_ctx.isDrag }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.changeCursor(true);
        // @ts-ignore
        [isDrag, changeCursor,];
    },
};
/** @type {__VLS_StyleScopedClasses['is-drag-active']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    size: (16),
}));
const __VLS_17 = __VLS_16({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.Position} */
Position;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[];
var __VLS_18;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    ...{ 'onClick': {} },
    ...{ style: {} },
    ...{ class: ({ 'is-drag-active': !__VLS_ctx.isDrag }) },
}));
const __VLS_28 = __VLS_27({
    ...{ 'onClick': {} },
    ...{ style: {} },
    ...{ class: ({ 'is-drag-active': !__VLS_ctx.isDrag }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_31;
const __VLS_32 = {
    /** @type {typeof __VLS_31.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.changeCursor(false);
        // @ts-ignore
        [isDrag, changeCursor,];
    },
};
/** @type {__VLS_StyleScopedClasses['is-drag-active']} */ ;
const { default: __VLS_33 } = __VLS_29.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    iconName: "app-raisehand",
    size: (16),
}));
const __VLS_36 = __VLS_35({
    iconName: "app-raisehand",
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[];
var __VLS_29;
var __VLS_30;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    direction: "vertical",
}));
const __VLS_41 = __VLS_40({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    /** @type {typeof __VLS_49.click} */
    onClick: (__VLS_ctx.zoomOut),
};
const { default: __VLS_51 } = __VLS_47.slots;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.zoomOut')),
    placement: "top",
}));
const __VLS_54 = __VLS_53({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.zoomOut')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const { default: __VLS_57 } = __VLS_55.slots;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    size: (16),
    title: (__VLS_ctx.$t('workflow.control.zoomOut')),
}));
const __VLS_60 = __VLS_59({
    size: (16),
    title: (__VLS_ctx.$t('workflow.control.zoomOut')),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.ZoomOut} */
ZoomOut;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
// @ts-ignore
[zoomOut, $t, $t,];
var __VLS_61;
// @ts-ignore
[];
var __VLS_55;
// @ts-ignore
[];
var __VLS_47;
var __VLS_48;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}));
const __VLS_71 = __VLS_70({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
const __VLS_75 = {
    /** @type {typeof __VLS_74.click} */
    onClick: (__VLS_ctx.zoomIn),
};
const { default: __VLS_76 } = __VLS_72.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.zoomIn')),
    placement: "top",
}));
const __VLS_79 = __VLS_78({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.zoomIn')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_82 } = __VLS_80.slots;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    size: (16),
    title: (__VLS_ctx.$t('workflow.control.zoomIn')),
}));
const __VLS_85 = __VLS_84({
    size: (16),
    title: (__VLS_ctx.$t('workflow.control.zoomIn')),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_88 } = __VLS_86.slots;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.ZoomIn} */
ZoomIn;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({}));
const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
// @ts-ignore
[$t, $t, zoomIn,];
var __VLS_86;
// @ts-ignore
[];
var __VLS_80;
// @ts-ignore
[];
var __VLS_72;
var __VLS_73;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}));
const __VLS_96 = __VLS_95({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
let __VLS_99;
const __VLS_100 = {
    /** @type {typeof __VLS_99.click} */
    onClick: (__VLS_ctx.fitView),
};
const { default: __VLS_101 } = __VLS_97.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.fitView')),
    placement: "top",
}));
const __VLS_104 = __VLS_103({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.fitView')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const { default: __VLS_107 } = __VLS_105.slots;
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    iconName: "app-fitview",
    title: (__VLS_ctx.$t('workflow.control.fitView')),
}));
const __VLS_110 = __VLS_109({
    iconName: "app-fitview",
    title: (__VLS_ctx.$t('workflow.control.fitView')),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
// @ts-ignore
[$t, $t, fitView,];
var __VLS_105;
// @ts-ignore
[];
var __VLS_97;
var __VLS_98;
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    direction: "vertical",
}));
const __VLS_115 = __VLS_114({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}));
const __VLS_120 = __VLS_119({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_123;
const __VLS_124 = {
    /** @type {typeof __VLS_123.click} */
    onClick: (__VLS_ctx.retract),
};
const { default: __VLS_125 } = __VLS_121.slots;
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.retract')),
    placement: "top",
}));
const __VLS_128 = __VLS_127({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.retract')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
const { default: __VLS_131 } = __VLS_129.slots;
let __VLS_132;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
    ...{ style: {} },
    iconName: "app-retract",
    title: (__VLS_ctx.$t('workflow.control.retract')),
}));
const __VLS_134 = __VLS_133({
    ...{ style: {} },
    iconName: "app-retract",
    title: (__VLS_ctx.$t('workflow.control.retract')),
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
// @ts-ignore
[$t, $t, retract,];
var __VLS_129;
// @ts-ignore
[];
var __VLS_121;
var __VLS_122;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}));
const __VLS_139 = __VLS_138({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
let __VLS_142;
const __VLS_143 = {
    /** @type {typeof __VLS_142.click} */
    onClick: (__VLS_ctx.extend),
};
const { default: __VLS_144 } = __VLS_140.slots;
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.extend')),
    placement: "top",
}));
const __VLS_147 = __VLS_146({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.extend')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    ...{ style: {} },
    iconName: "app-extend",
    title: (__VLS_ctx.$t('workflow.control.extend')),
}));
const __VLS_153 = __VLS_152({
    ...{ style: {} },
    iconName: "app-extend",
    title: (__VLS_ctx.$t('workflow.control.extend')),
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
// @ts-ignore
[$t, $t, extend,];
var __VLS_148;
// @ts-ignore
[];
var __VLS_140;
var __VLS_141;
let __VLS_156;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}));
const __VLS_158 = __VLS_157({
    ...{ 'onClick': {} },
    link: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
let __VLS_161;
const __VLS_162 = {
    /** @type {typeof __VLS_161.click} */
    onClick: (__VLS_ctx.layout),
};
const { default: __VLS_163 } = __VLS_159.slots;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.beautify')),
    placement: "top",
}));
const __VLS_166 = __VLS_165({
    effect: "dark",
    content: (__VLS_ctx.$t('workflow.control.beautify')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const { default: __VLS_169 } = __VLS_167.slots;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    ...{ style: {} },
    iconName: "app-beautify",
    title: (__VLS_ctx.$t('workflow.control.beautify')),
}));
const __VLS_172 = __VLS_171({
    ...{ style: {} },
    iconName: "app-beautify",
    title: (__VLS_ctx.$t('workflow.control.beautify')),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
// @ts-ignore
[$t, $t, layout,];
var __VLS_167;
// @ts-ignore
[];
var __VLS_159;
var __VLS_160;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        lf: Object || String || null,
    },
});
export default {};
