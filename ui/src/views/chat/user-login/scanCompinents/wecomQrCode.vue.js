/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBrowserLang } from '@/locales';
import useStore from '@/stores';
const props = defineProps();
const router = useRouter();
const route = useRoute();
const { chatUser } = useStore();
const { params: { accessToken }, } = route;
let iframe = null;
function createTransparentIFrame(el) {
    const container = document.querySelector(el);
    if (!container)
        return null;
    const iframeEl = document.createElement('iframe');
    iframeEl.style.cssText = `
    display: block;
    border: none;
    background: transparent;
  `;
    iframeEl.referrerPolicy = 'origin';
    iframeEl.setAttribute('frameborder', '0');
    iframeEl.setAttribute('allowtransparency', 'true');
    iframeEl.setAttribute('allow', 'local-network-access');
    container.appendChild(iframeEl);
    return iframeEl;
}
function getLang() {
    const lang = localStorage.getItem('MaxKB-locale') || getBrowserLang();
    return lang === 'en-US' ? 'en' : 'zh';
}
function cleanup() {
    iframe?.remove();
    iframe = null;
}
const init = async () => {
    await nextTick();
    iframe = createTransparentIFrame('#wecom-qr');
    if (!iframe)
        return;
    const redirectUri = encodeURIComponent(props.config.callback_url);
    iframe.src =
        `${props.config.qr_url}` +
            `?login_type=CorpApp` +
            `&appid=${props.config.corp_id}` +
            `&agentid=${props.config.agent_id}` +
            `&redirect_uri=${redirectUri}` +
            `&state=${accessToken}` +
            `&lang=${getLang()}` +
            `&panel_size=small` +
            `&redirect_type=self`;
    iframe.addEventListener('load', (e) => {
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage('getToken', '*');
        }
    });
    window.addEventListener('message', (event) => {
        if (event.data.type === 'token') {
            chatUser.setToken(event.data.value);
            router.push({
                name: 'chat',
                params: { accessToken },
                query: route.query,
            });
        }
    });
};
onBeforeUnmount(cleanup);
init();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "wecom-qr",
    ...{ class: "wecom-qr flex" },
});
/** @type {__VLS_StyleScopedClasses['wecom-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
