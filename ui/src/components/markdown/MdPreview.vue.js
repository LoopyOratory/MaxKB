/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { MdPreview, config } from 'md-editor-v3';
import { getBrowserLang } from '@/locales/index';
import useStore from '@/stores';
// IntroducePublicDatabase in LanguageConfiguration
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
defineOptions({ name: 'MdPreview' });
const emit = defineEmits(['clickPreview']);
const { user } = useStore();
const language = computed(() => user.getLanguage() || getBrowserLang() || '');
config({
    editorConfig: {
        languageUserDefined: {
            'zh-Hant': ZH_TW,
        },
    },
});
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
/** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
MdPreview;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    language: (__VLS_ctx.language),
    noIconfont: true,
    noPrettier: true,
    codeFoldable: (false),
}));
const __VLS_2 = __VLS_1({
    language: (__VLS_ctx.language),
    noIconfont: true,
    noPrettier: true,
    codeFoldable: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
var __VLS_5;
var __VLS_3;
// @ts-ignore
[language, $attrs,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
});
export default {};
