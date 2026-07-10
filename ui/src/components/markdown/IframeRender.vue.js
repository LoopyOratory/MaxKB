/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
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
</head>
<body>
${sourceHtml}
<script>
const INSTANCE_ID = '${instanceId}';

function sendMessage(message) {
  parent.postMessage({ type: 'chatMessage', instanceId: INSTANCE_ID, message }, '*');
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
const props = withDefaults(defineProps(), {
    source: '',
    script_exec: true,
    visible: true,
});
const iframeRef = ref();
// If not allowed to execute script, filter it out
const finalSource = computed(() => {
    if (props.script_exec)
        return fSource.value;
    return fSource.value.replace(/<script.*?>.*?<\/script>/gsi, '');
});
function onMessage(e) {
    if (e.data?.instanceId !== instanceId)
        return;
    if (e.data.type === 'resize') {
        const iframe = iframeRef.value;
        if (!iframe)
            return;
        iframe.style.height = e.data.height + 'px';
    }
    if (e.data.type === 'chatMessage') {
        props.sendMessage?.(e.data.message, 'new');
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
    visible: true,
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "iframe-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['iframe-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.iframe)({
    ref: "iframeRef",
    ...{ style: {} },
    ...{ class: "iframe" },
    srcdoc: (__VLS_ctx.finalSource),
    allow: "geolocation",
    sandbox: "allow-scripts",
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.visible) }, null, null);
/** @type {__VLS_StyleScopedClasses['iframe']} */ ;
// @ts-ignore
[finalSource, visible,];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
