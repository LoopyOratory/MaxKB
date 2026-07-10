/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const __VLS_props = defineProps();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['download-button']} */ ;
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
/** @type {__VLS_StyleScopedClasses['el-space__item']} */ ;
/** @type {__VLS_StyleScopedClasses['media_1']} */ ;
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
/** @type {__VLS_StyleScopedClasses['el-space__item']} */ ;
/** @type {__VLS_StyleScopedClasses['media_1']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "question-content item-content mb-16 lighter" },
});
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['item-content']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content p-12-16 border-r-8" },
});
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.text);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "dotting" },
});
/** @type {__VLS_StyleScopedClasses['dotting']} */ ;
if (__VLS_ctx.application.show_user_avatar) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "avatar ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['avatar']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    if (__VLS_ctx.application.user_avatar) {
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            src: (__VLS_ctx.application.user_avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }));
        const __VLS_2 = __VLS_1({
            src: (__VLS_ctx.application.user_avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    else {
        let __VLS_5;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
        const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
        const { default: __VLS_10 } = __VLS_8.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/user-icon.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [text, application, application, application,];
        var __VLS_8;
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
