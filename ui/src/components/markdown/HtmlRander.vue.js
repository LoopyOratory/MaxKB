/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, onMounted, onBeforeUnmount, inject } from 'vue';
const chatUserProfile = inject('chatUserProfile');
const htmlRef = ref();
const props = withDefaults(defineProps(), {
    source: '',
    script_exec: true,
});
// EachInstanceGenerateUnique id, prevent multiple iframe MessageCrosstalk
const instanceId = Math.random().toString(36).slice(2);
function createIframeHtml(sourceHtml) {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { margin: 0 !important; padding: 0 !important; overflow: hidden; }
</style>
<script>
const _INSTANCE_ID = '${instanceId}';
window.jump=function jump(url){
  window.parent.postMessage({ type: 'jump', instanceId: INSTANCE_ID, url }, '*');
}
window.chatUserProfile=function chatUserProfile() {
  return new Promise((resolve, reject) => {
    const requestId = Date.now() + '_' + Math.random()

    function handler(e) {
      const data = e.data

      if (
        data?.type === 'chatUserProfile:response' &&
        data.requestId === requestId
      ) {
        window.removeEventListener('message', handler)
        resolve(data.data)
      }
    }
    window.addEventListener('message', handler)
    parent.postMessage(
      {
        type: 'chatUserProfile',
        requestId,
        instanceId: _INSTANCE_ID
      },
      '*'
    )

    setTimeout(() => {
      window.removeEventListener('message', handler)
      reject(new Error('timeout'))
    }, 10000)
  })
}
<\/script>
</head>
<body>
${sourceHtml}
<script>
const INSTANCE_ID = '${instanceId}';

function sendMessage(message,other_params_data) {
  parent.postMessage({ type: 'chatMessage', instanceId: INSTANCE_ID, message,other_params_data }, '*');
}
let lastSentHeight = 0;
let timer = null;

function sendHeight() {
  const height = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
  if (height === lastSentHeight) return;
  lastSentHeight = height;
  parent.postMessage({ type: 'resize', instanceId: INSTANCE_ID, height }, '*');
}

window.onload = sendHeight;

const observer = new ResizeObserver(() => {
  clearTimeout(timer);
  timer = setTimeout(sendHeight, 100);
});
observer.observe(document.body);
<\/script>
</body>
</html>
`;
}
const fSource = computed(() => createIframeHtml(props.source));
function onMessage(e) {
    if (e.data?.instanceId !== instanceId)
        return;
    if (e.data.type === 'resize') {
        const iframe = htmlRef.value;
        if (!iframe)
            return;
        iframe.style.height = e.data.height + 'px';
    }
    if (e.data.type === 'jump') {
        window.open(e.data.url, '_blank');
    }
    if (e.data.type === 'chatMessage') {
        props.sendMessage?.(e.data.message, 'new', e.data.other_params_data);
    }
    if (e.data?.type === 'chatUserProfile') {
        const iframe = htmlRef.value;
        if (!iframe)
            return;
        chatUserProfile().then((ok) => {
            iframe.contentWindow?.postMessage({
                type: 'chatUserProfile:response',
                requestId: e.data.requestId,
                data: ok,
            }, '*');
        });
    }
}
onMounted(() => {
    window.addEventListener('message', onMessage);
});
onBeforeUnmount(() => {
    window.removeEventListener('message', onMessage);
});
const __VLS_defaults = {
    source: '',
    script_exec: true,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.iframe)({
    ref: "htmlRef",
    ...{ class: "iframe" },
    ...{ style: {} },
    srcdoc: (__VLS_ctx.fSource),
    allow: "geolocation",
    sandbox: "allow-scripts",
});
/** @type {__VLS_StyleScopedClasses['iframe']} */ ;
// @ts-ignore
[fSource,];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
