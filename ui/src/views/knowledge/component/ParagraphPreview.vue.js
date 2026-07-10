/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { getImgUrl } from '@/utils/common';
import ParagraphList from './ParagraphList.vue';
const __VLS_props = defineProps({
    data: {
        type: (Array),
        default: () => [],
    },
    isConnect: Boolean,
    knowledgeId: String,
});
const activeName = ref(0);
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
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "paragraph-tabs" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "paragraph-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['paragraph-tabs']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.data))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        label: (item.name),
        name: (index),
    }));
    const __VLS_9 = __VLS_8({
        label: (item.name),
        name: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    {
        const { label: __VLS_13 } = __VLS_10.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(item && item?.name)),
            alt: "",
            height: "16",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (item?.name);
        // @ts-ignore
        [activeName, data, getImgUrl,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        type: "info",
    }));
    const __VLS_16 = __VLS_15({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const { default: __VLS_19 } = __VLS_17.slots;
    (item.content.length);
    (__VLS_ctx.$t('views.paragraph.title'));
    // @ts-ignore
    [$t,];
    var __VLS_17;
    if (__VLS_ctx.activeName == index) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "paragraph-list" },
        });
        /** @type {__VLS_StyleScopedClasses['paragraph-list']} */ ;
        let __VLS_20;
        /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
        elScrollbar;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({}));
        const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
        const { default: __VLS_25 } = __VLS_23.slots;
        const __VLS_26 = ParagraphList;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            modelValue: (item.content),
            isConnect: (__VLS_ctx.isConnect),
            knowledgeId: (__VLS_ctx.knowledgeId),
        }));
        const __VLS_28 = __VLS_27({
            modelValue: (item.content),
            isConnect: (__VLS_ctx.isConnect),
            knowledgeId: (__VLS_ctx.knowledgeId),
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        // @ts-ignore
        [activeName, isConnect, knowledgeId,];
        var __VLS_23;
    }
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        data: {
            type: (Array),
            default: () => [],
        },
        isConnect: Boolean,
        knowledgeId: String,
    },
});
export default {};
