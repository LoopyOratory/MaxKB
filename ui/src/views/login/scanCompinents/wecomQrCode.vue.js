/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, nextTick } from 'vue';
import { getBrowserLang } from '@/locales';
const props = defineProps();
const iframeUrl = ref('');
const init = async () => {
    await nextTick(); // Ensure DOM has been updated
    const data = {
        corpId: props.config.corp_id,
        agentId: props.config.agent_id,
        redirectUri: props.config.callback_url,
    };
    let lang = localStorage.getItem('MaxKB-locale') || getBrowserLang() || 'en-US';
    if (lang === 'en-US') {
        lang = 'en';
    }
    else {
        lang = 'zh';
    }
    const redirectUri = encodeURIComponent(data.redirectUri);
    console.log('redirectUri', data.redirectUri);
    // ManualBuildGenerateQR codeurl
    iframeUrl.value = `${props.config.qr_url}?login_type=CorpApp&appid=${data.corpId}&agentid=${data.agentId}&redirect_uri=${redirectUri}&state=fit2cloud-wecom-qr&lang=${lang}&panel_size=small`;
};
init();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.iframe, __VLS_intrinsics.iframe)({
    src: (__VLS_ctx.iframeUrl),
    width: "100%",
    height: "380px",
    frameborder: "0",
    ...{ style: {} },
});
// @ts-ignore
[iframeUrl,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
