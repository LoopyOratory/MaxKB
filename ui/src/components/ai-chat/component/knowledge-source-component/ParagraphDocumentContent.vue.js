/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, } from 'vue';
import { FullScreen, Loading } from '@element-plus/icons-vue';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
const props = defineProps();
const viewerRef = ref(null);
const stageRef = ref(null);
const pagesRef = ref(null);
const loading = ref(false);
const error = ref('');
const isFullscreen = ref(false);
const pdfDoc = shallowRef(null);
const loadingTaskRef = shallowRef(null);
const renderTasks = shallowRef([]);
const requestToken = ref(0);
const isPdf = computed(() => !!props.detail?.meta?.source_file_id);
const pdfSrc = computed(() => {
    const fileId = props.detail?.meta?.source_file_id;
    return fileId ? `${window.MaxKB.prefix}/oss/file/${fileId}` : '';
});
const overlayText = computed(() => {
    if (error.value)
        return error.value;
    if (!isPdf.value)
        return 'No PDF Preview';
    return '';
});
function clearPages() {
    if (pagesRef.value) {
        pagesRef.value.innerHTML = '';
    }
}
async function cancelRenderTasks() {
    if (!renderTasks.value.length)
        return;
    for (const task of renderTasks.value) {
        try {
            task.cancel();
        }
        catch {
            //
        }
    }
    renderTasks.value = [];
}
async function destroyLoadingTask() {
    if (!loadingTaskRef.value)
        return;
    try {
        await loadingTaskRef.value.destroy();
    }
    catch {
        //
    }
    finally {
        loadingTaskRef.value = null;
    }
}
async function destroyPdfDoc() {
    if (!pdfDoc.value)
        return;
    try {
        await pdfDoc.value.destroy();
    }
    catch {
        //
    }
    finally {
        pdfDoc.value = null;
    }
}
function getAvailableWidth() {
    if (!stageRef.value)
        return 0;
    const style = getComputedStyle(stageRef.value);
    const paddingLeft = Number.parseFloat(style.paddingLeft || '0');
    const paddingRight = Number.parseFloat(style.paddingRight || '0');
    return stageRef.value.clientWidth - paddingLeft - paddingRight;
}
async function renderAllPages() {
    if (!pdfDoc.value || !pagesRef.value)
        return;
    const currentToken = requestToken.value;
    const container = pagesRef.value;
    clearPages();
    renderTasks.value = [];
    const availableWidth = getAvailableWidth();
    for (let pageNum = 1; pageNum <= pdfDoc.value.numPages; pageNum++) {
        if (currentToken !== requestToken.value)
            return;
        const page = await pdfDoc.value.getPage(pageNum);
        if (currentToken !== requestToken.value)
            return;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = availableWidth > 0 && baseViewport.width > 0
            ? Math.min(3, Math.max(0.5, availableWidth / baseViewport.width))
            : 1;
        const viewport = page.getViewport({ scale: fitScale });
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-canvas';
        const context = canvas.getContext('2d');
        if (!context)
            continue;
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
        container.appendChild(canvas);
        const task = markRaw(page.render({
            canvasContext: context,
            viewport,
        }));
        renderTasks.value = [...renderTasks.value, task];
        try {
            await task.promise;
        }
        catch (err) {
            if (err?.name !== 'RenderingCancelledException') {
                throw err;
            }
        }
        finally {
            renderTasks.value = renderTasks.value.filter((item) => item !== task);
        }
    }
}
async function loadPdf(url) {
    const currentToken = ++requestToken.value;
    loading.value = true;
    error.value = '';
    await cancelRenderTasks();
    await destroyLoadingTask();
    await destroyPdfDoc();
    clearPages();
    try {
        const loadingTask = pdfjsLib.getDocument({
            url,
        });
        loadingTaskRef.value = markRaw(loadingTask);
        const doc = await loadingTask.promise;
        if (currentToken !== requestToken.value) {
            await doc.destroy();
            return;
        }
        loadingTaskRef.value = null;
        pdfDoc.value = markRaw(doc);
        await nextTick();
        await renderAllPages();
    }
    catch (err) {
        console.error(err);
        error.value = err?.message || 'PDF LoadFailure';
        clearPages();
    }
    finally {
        if (currentToken === requestToken.value) {
            loading.value = false;
        }
    }
}
async function handleResize() {
    if (!pdfDoc.value || loading.value)
        return;
    const currentToken = ++requestToken.value;
    loading.value = true;
    error.value = '';
    try {
        await cancelRenderTasks();
        if (currentToken !== requestToken.value)
            return;
        clearPages();
        await nextTick();
        await renderAllPages();
    }
    catch (err) {
        console.error(err);
        error.value = err?.message || 'PDF RepaintFailure';
    }
    finally {
        if (currentToken === requestToken.value) {
            loading.value = false;
        }
    }
}
async function toggleFullscreen() {
    try {
        if (!document.fullscreenElement) {
            await viewerRef.value?.requestFullscreen();
        }
        else {
            await document.exitFullscreen();
        }
    }
    catch (err) {
        console.error('toggle fullscreen failed:', err);
    }
}
function syncFullscreenState() {
    isFullscreen.value = document.fullscreenElement === viewerRef.value;
}
async function onFullscreenChange() {
    syncFullscreenState();
    await nextTick();
    await handleResize();
}
watch(pdfSrc, async (url) => {
    await nextTick();
    if (!isPdf.value || !url) {
        error.value = '';
        await cancelRenderTasks();
        await destroyLoadingTask();
        await destroyPdfDoc();
        clearPages();
        return;
    }
    await loadPdf(url);
}, { immediate: true });
let resizeTimer = null;
function onWindowResize() {
    if (resizeTimer) {
        window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
        handleResize();
    }, 200);
}
onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('resize', onWindowResize);
});
onBeforeUnmount(async () => {
    if (resizeTimer) {
        window.clearTimeout(resizeTimer);
        resizeTimer = null;
    }
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    window.removeEventListener('resize', onWindowResize);
    requestToken.value++;
    await cancelRenderTasks();
    await destroyLoadingTask();
    await destroyPdfDoc();
    clearPages();
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
/** @type {__VLS_StyleScopedClasses['pdf-viewer']} */ ;
/** @type {__VLS_StyleScopedClasses['pdf-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pdf-pages']} */ ;
/** @type {__VLS_StyleScopedClasses['pdf-canvas']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "viewerRef",
    ...{ class: "pdf-viewer" },
});
/** @type {__VLS_StyleScopedClasses['pdf-viewer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pdf-stage" },
    ref: "stageRef",
});
/** @type {__VLS_StyleScopedClasses['pdf-stage']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pdf-actions" },
});
/** @type {__VLS_StyleScopedClasses['pdf-actions']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.toggleFullscreen),
};
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.FullScreen} */
FullScreen;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
// @ts-ignore
[toggleFullscreen,];
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.isFullscreen ? 'Exit fullscreen' : 'Fullscreen');
// @ts-ignore
[isFullscreen,];
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "pagesRef",
    ...{ class: "pdf-pages" },
    ...{ class: ({ 'is-hidden': !!__VLS_ctx.overlayText }) },
});
/** @type {__VLS_StyleScopedClasses['pdf-pages']} */ ;
/** @type {__VLS_StyleScopedClasses['is-hidden']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "pdf-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['pdf-overlay']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ class: "is-loading" },
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: "is-loading" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    const { default: __VLS_24 } = __VLS_22.slots;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    // @ts-ignore
    [overlayText, loading,];
    var __VLS_22;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
else if (__VLS_ctx.overlayText) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "pdf-overlay" },
        ...{ class: ({ 'pdf-overlay--error': !!__VLS_ctx.error }) },
    });
    /** @type {__VLS_StyleScopedClasses['pdf-overlay']} */ ;
    /** @type {__VLS_StyleScopedClasses['pdf-overlay--error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.overlayText);
}
// @ts-ignore
[overlayText, overlayText, error,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
