/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, onBeforeUnmount, nextTick, watch, ref } from 'vue';
import * as echarts from 'echarts';
import { randomId } from '@/utils/common';
const props = defineProps();
// ── refs ───────────────────────────────────────────────────────────────────
const chartsRef = ref();
const iframeRef = ref();
const style = ref({ height: '220px', width: '100%' });
const iframeHtml = /* html */ `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body><script>
  window.parent.postMessage({ type: 'IFRAME_READY' }, '*')
  window.addEventListener('message', ({ data, source, origin }) => {
    if (data?.type !== 'EVAL_OPTION') return
    try {
      const option_json = JSON.parse(data.option_str)
      const style = { value: null }
      if (option_json.style) style.value = option_json.style
      let option = {}
      eval(option_json.option)
      source.postMessage(
        { type: 'EVAL_RESULT', id: data.id, result_str: JSON.stringify({ option, style: style.value }) },
        origin || '*'
      )
    } catch (e) {
      source.postMessage({ type: 'EVAL_ERROR', id: data.id, error: e.message }, origin || '*')
    }
  })
<\/script></body></html>`;
let iframeReady = false;
let pendingOption = null;
const onIframeLoad = () => {
    iframeReady = true;
    if (pendingOption) {
        runEval(pendingOption);
        pendingOption = null;
    }
};
const evalSeq = 0;
const EVAL_TIMEOUT_MS = 5000;
const evalInSandbox = (option_json) => {
    return new Promise((resolve, reject) => {
        const id = randomId();
        let settled = false;
        const timer = setTimeout(() => {
            if (settled)
                return;
            settled = true;
            window.removeEventListener('message', handler);
            reject(new Error(`evalInSandbox timeout (id=${id})`));
        }, EVAL_TIMEOUT_MS);
        function handler(event) {
            const { type, id: rid, result_str, error } = event.data || {};
            if (rid !== id)
                return; // IgnoreOtherInstanceOr oldRequestMessage
            if (type !== 'EVAL_RESULT' && type !== 'EVAL_ERROR')
                return;
            settled = true;
            clearTimeout(timer);
            window.removeEventListener('message', handler);
            if (type === 'EVAL_RESULT') {
                try {
                    resolve(JSON.parse(result_str));
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                reject(new Error(error));
            }
        }
        window.addEventListener('message', handler);
        iframeRef.value?.contentWindow?.postMessage({ type: 'EVAL_OPTION', id, option_str: JSON.stringify(option_json) }, '*');
    });
};
const ensureChart = () => {
    if (!chartsRef.value)
        return null;
    return echarts.getInstanceByDom(chartsRef.value) ?? echarts.init(chartsRef.value);
};
const runEval = (option) => {
    const chart = ensureChart();
    if (!chart)
        return;
    evalInSandbox(option)
        .then(({ option: opt, style: s }) => {
        if (s)
            style.value = s;
        chart.setOption(opt, true);
    })
        .catch((e) => console.error('[ECharts EVAL error]', e));
};
const applyOption = (raw) => {
    if (raw.actionType === 'EVAL') {
        if (iframeReady)
            runEval(raw);
        else
            pendingOption = raw;
        return;
    }
    const chart = ensureChart();
    if (!chart)
        return;
    if (raw.style)
        style.value = raw.style;
    chart.setOption(raw.option ?? raw, true);
};
const initChart = () => {
    if (!chartsRef.value || !props.option)
        return;
    try {
        applyOption(JSON.parse(props.option));
    }
    catch (e) {
        console.error('[ECharts] invalid option JSON', e);
    }
};
// ── resize Debounce ────────────────────────────────────────────────────────────
let resizeTimer = null;
const onResize = () => {
    if (resizeTimer)
        clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        echarts.getInstanceByDom(chartsRef.value)?.resize();
    }, 100);
};
// ── Lifecycle ───────────────────────────────────────────────────────────────
watch(() => props.option, (val) => {
    if (val)
        nextTick(initChart);
});
onMounted(() => nextTick(initChart));
onBeforeUnmount(() => {
    if (resizeTimer)
        clearTimeout(resizeTimer);
    if (chartsRef.value)
        echarts.getInstanceByDom(chartsRef.value)?.dispose();
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
/** @type {__VLS_StyleScopedClasses['charts-container']} */ ;
/** @type {__VLS_StyleScopedClasses['charts-container']} */ ;
/** @type {__VLS_StyleScopedClasses['charts-container']} */ ;
/** @type {__VLS_StyleScopedClasses['charts-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "charts-container" },
});
/** @type {__VLS_StyleScopedClasses['charts-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.iframe, __VLS_intrinsics.iframe)({
    ...{ onLoad: (__VLS_ctx.onIframeLoad) },
    ref: "iframeRef",
    sandbox: "allow-scripts",
    srcdoc: (__VLS_ctx.iframeHtml),
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (false) }, null, null);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "chartsRef",
    ...{ style: (__VLS_ctx.style) },
});
__VLS_asFunctionalDirective(__VLS_directives.vResize, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.onResize) }, null, null);
// @ts-ignore
[onIframeLoad, iframeHtml, style, vResize, onResize,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
