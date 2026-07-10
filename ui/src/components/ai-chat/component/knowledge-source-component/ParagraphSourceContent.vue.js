/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import ParagraphCard from '@/components/ai-chat/component/knowledge-source-component/ParagraphCard.vue';
const props = defineProps();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "paragraph-source-height" },
});
/** @type {__VLS_StyleScopedClasses['paragraph-source-height']} */ ;
if (props.detail?.paragraph_list.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    for (const [item, index] of __VLS_vFor((props.detail.paragraph_list))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        const __VLS_0 = ParagraphCard;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            data: (item),
            content: (item.content),
            index: (index),
        }));
        const __VLS_2 = __VLS_1({
            data: (item),
            content: (item.content),
            index: (index),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('aiChat.KnowledgeSource.noSource'));
}
// @ts-ignore
[$t,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
