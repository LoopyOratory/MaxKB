/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n({ useScope: 'global' });
const route = useRoute();
const { chatUser, common } = useStore();
const components = import.meta.glob('@/views/chat/**/index.vue', {
    eager: true,
});
const { query: { mode }, } = route;
const currentTemplate = computed(() => {
    let modeName = '';
    if (chatUser.application) {
        if (!mode || mode === 'pc') {
            modeName = common.isMobile() ? 'mobile' : 'pc';
        }
        else {
            modeName = mode;
        }
    }
    else {
        modeName = 'no-service';
    }
    const name = `/src/views/chat/${modeName}/index.vue`;
    return components[name].default;
});
const applicationAvailable = ref(true);
onBeforeMount(() => {
    locale.value = chatUser.getLanguage();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = (__VLS_ctx.currentTemplate);
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    applicationAvailable: (__VLS_ctx.applicationAvailable),
    application_profile: (__VLS_ctx.chatUser.application),
    key: (__VLS_ctx.route.fullPath),
}));
const __VLS_2 = __VLS_1({
    applicationAvailable: (__VLS_ctx.applicationAvailable),
    application_profile: (__VLS_ctx.chatUser.application),
    key: (__VLS_ctx.route.fullPath),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
var __VLS_3;
// @ts-ignore
[currentTemplate, applicationAvailable, chatUser, route,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
