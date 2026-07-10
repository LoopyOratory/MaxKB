/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import MdRenderer from '@/components/markdown/MdRenderer.vue';
import { t } from '@/locales';
const props = defineProps();
const showAvatar = computed(() => {
    return props.application.show_avatar == undefined ? true : props.application.show_avatar;
});
const showUserAvatar = computed(() => {
    return props.application.show_user_avatar == undefined ? true : props.application.show_user_avatar;
});
const toQuickQuestion = (match, offset, input) => {
    return `<quick_question>${match.replace('- ', '')}</quick_question>`;
};
const prologue = computed(() => {
    const temp = props.available ? props.application?.prologue : t('aiChat.tip.prologueMessage');
    if (temp) {
        const tag_list = [
            /<html_rander>.*?<\/html_rander>/gs,
            /<echarts_rander>.*?<\/echarts_rander>/gs,
            /<quick_question>.*?<\/quick_question>/gs,
            /<form_rander>.*?<\/form_rander>/gs,
        ];
        let _temp = temp;
        for (const index in tag_list) {
            _temp = _temp.replaceAll(tag_list[index], '');
        }
        const quick_question_list = _temp.match(/-\s.+/g);
        let result = temp;
        for (const index in quick_question_list) {
            const quick_question = quick_question_list[index];
            result = result.replace(quick_question, toQuickQuestion);
        }
        return result;
    }
    return '';
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "item-content mb-16" },
});
/** @type {__VLS_StyleScopedClasses['item-content']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
if (__VLS_ctx.prologue && __VLS_ctx.showAvatar) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "avatar mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['avatar']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    if (__VLS_ctx.application.avatar) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.application.avatar),
            height: "28px",
            width: "28px",
        });
    }
    else {
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
        LogoIcon;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            height: "28px",
            width: "28px",
        }));
        const __VLS_2 = __VLS_1({
            height: "28px",
            width: "28px",
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
}
if (__VLS_ctx.prologue) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "content" },
        ...{ style: ({
                'padding-right': __VLS_ctx.showUserAvatar ? 'var(--padding-left)' : '0',
            }) },
    });
    /** @type {__VLS_StyleScopedClasses['content']} */ ;
    let __VLS_5;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        shadow: "always",
        ...{ class: "border-r-8" },
        ...{ style: {} },
    }));
    const __VLS_7 = __VLS_6({
        shadow: "always",
        ...{ class: "border-r-8" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
    const { default: __VLS_10 } = __VLS_8.slots;
    const __VLS_11 = MdRenderer || MdRenderer;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        source: (__VLS_ctx.prologue),
        sendMessage: (__VLS_ctx.sendMessage),
        reasoning_content: "",
        type: (__VLS_ctx.type),
        selection: (__VLS_ctx.selection),
    }));
    const __VLS_13 = __VLS_12({
        source: (__VLS_ctx.prologue),
        sendMessage: (__VLS_ctx.sendMessage),
        reasoning_content: "",
        type: (__VLS_ctx.type),
        selection: (__VLS_ctx.selection),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    // @ts-ignore
    [prologue, prologue, prologue, showAvatar, application, application, showUserAvatar, sendMessage, type, selection,];
    var __VLS_8;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
