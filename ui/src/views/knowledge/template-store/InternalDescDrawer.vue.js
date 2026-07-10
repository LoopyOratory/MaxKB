/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { numberFormat } from '@/utils/common';
const emit = defineEmits(['refresh', 'addTool']);
const visibleInternalDesc = ref(false);
const markdownContent = ref('');
const toolDetail = ref({});
watch(visibleInternalDesc, (bool) => {
    if (!bool) {
        markdownContent.value = '';
    }
});
const open = (data, detail) => {
    toolDetail.value = detail;
    if (data) {
        markdownContent.value = cloneDeep(data);
    }
    visibleInternalDesc.value = true;
};
const addInternalTool = (data) => {
    emit('addTool', data);
    visibleInternalDesc.value = false;
};
const __VLS_exposed = {
    open,
};
defineExpose(__VLS_exposed);
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
    modelValue: (__VLS_ctx.visibleInternalDesc),
    size: "60%",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visibleInternalDesc),
    size: "60%",
    appendToBody: (true),
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
            return __VLS_ctx.visibleInternalDesc = false;
            // @ts-ignore
            [visibleInternalDesc, visibleInternalDesc,];
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
    (__VLS_ctx.$t('common.detail'));
    // @ts-ignore
    [$t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border-b" },
});
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-24" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    shape: "square",
    size: (64),
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    shape: "square",
    size: (64),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/knowledge/icon_basic_template.svg",
    alt: "",
});
// @ts-ignore
[];
var __VLS_30;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-16" },
});
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ class: "mb-8" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.toolDetail.name);
if (__VLS_ctx.toolDetail?.desc) {
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        type: "info",
    }));
    const __VLS_35 = __VLS_34({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const { default: __VLS_38 } = __VLS_36.slots;
    (__VLS_ctx.toolDetail.desc);
    // @ts-ignore
    [toolDetail, toolDetail, toolDetail,];
    var __VLS_36;
}
if (__VLS_ctx.toolDetail?.downloads != undefined) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-secondary flex align-center mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        iconName: "app-download",
        ...{ class: "mr-4" },
    }));
    const __VLS_41 = __VLS_40({
        iconName: "app-download",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.numberFormat(__VLS_ctx.toolDetail.downloads || 0));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: () => { } },
});
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    /** @type {typeof __VLS_49.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.addInternalTool(__VLS_ctx.toolDetail);
        // @ts-ignore
        [toolDetail, toolDetail, toolDetail, numberFormat, addInternalTool,];
    },
};
const { default: __VLS_51 } = __VLS_47.slots;
(__VLS_ctx.$t('common.use'));
// @ts-ignore
[$t,];
var __VLS_47;
var __VLS_48;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
MdPreview;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.markdownContent),
    ...{ style: {} },
    noImgZoomIn: true,
}));
const __VLS_54 = __VLS_53({
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.markdownContent),
    ...{ style: {} },
    noImgZoomIn: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_57;
var __VLS_55;
// @ts-ignore
[markdownContent,];
var __VLS_3;
// @ts-ignore
var __VLS_58 = __VLS_57;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
