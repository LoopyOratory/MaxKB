/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { MdEditor, config } from 'md-editor-v3';
import { getBrowserLang } from '@/locales/index';
import './assets/markdown-iconfont.js';
// IntroducePublicDatabase in LanguageConfiguration
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
defineOptions({ name: 'MdEditor' });
const language = computed(() => localStorage.getItem('MaxKB-locale') || getBrowserLang() || '');
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
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.MdEditor | typeof __VLS_components.MdEditor} */
MdEditor;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    language: (__VLS_ctx.language),
    noIconfont: true,
    noPrettier: true,
}));
const __VLS_2 = __VLS_1({
    language: (__VLS_ctx.language),
    noIconfont: true,
    noPrettier: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { defFooters: __VLS_7 } = __VLS_3.slots;
    var __VLS_8 = {};
    // @ts-ignore
    [language, $attrs,];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_9 = __VLS_8;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({});
const __VLS_export = {};
export default {};
