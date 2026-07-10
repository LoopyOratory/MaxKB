/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import * as htmlToImage from 'html-to-image';
import { ref, nextTick } from 'vue';
import { jsPDF } from 'jspdf';
const loading = ref(false);
const svgContainerRef = ref();
const dialogVisible = ref(false);
// SaveOriginalElementReference，Used forExport
const originalElement = ref(null);
const open = (element) => {
    dialogVisible.value = true;
    loading.value = true;
    if (!element) {
        loading.value = false;
        return;
    }
    // SaveOriginalElementReference
    originalElement.value = element;
    nextTick(() => {
        htmlToImage
            .toCanvas(element, {
            pixelRatio: window.devicePixelRatio || 1,
            quality: 1,
            skipFonts: false,
            backgroundColor: '#ffffff',
        })
            .then((canvas) => {
            // Clear previousContent
            svgContainerRef.value.innerHTML = '';
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            svgContainerRef.value.appendChild(canvas);
        })
            .finally(() => {
            loading.value = false;
        })
            .catch((e) => {
            console.error(e);
            loading.value = false;
        });
    });
};
const exportPDF = () => {
    loading.value = true;
    setTimeout(() => {
        nextTick(async () => {
            try {
                const targetEl = originalElement.value;
                if (!targetEl)
                    return;
                const canvas = await htmlToImage.toCanvas(targetEl, {
                    pixelRatio: 2,
                    quality: 1,
                    skipFonts: false,
                    backgroundColor: '#ffffff',
                });
                generatePDF(canvas);
            }
            catch (e) {
                console.error('PDF export error:', e);
            }
            finally {
                loading.value = false;
            }
        });
    });
};
const generatePDF = (canvas) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 1);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    let heightLeft = imgHeight - pageHeight;
    while (heightLeft > 0) {
        const position = -(imgHeight - heightLeft);
        doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }
    doc.save('ExportDocument.pdf');
};
const exportJepg = () => {
    loading.value = true;
    setTimeout(() => {
        nextTick(async () => {
            try {
                const targetEl = originalElement.value;
                if (!targetEl)
                    return;
                const canvas = await htmlToImage.toCanvas(targetEl, {
                    pixelRatio: window.devicePixelRatio || 1,
                    quality: 1,
                    skipFonts: false,
                    backgroundColor: '#ffffff',
                });
                downloadJpeg(canvas);
            }
            catch (e) {
                console.error('JPEG export error:', e);
            }
            finally {
                loading.value = false;
            }
        });
    }, 1);
};
const downloadJpeg = (canvas) => {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const ctx = newCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    ctx.drawImage(canvas, 0, 0);
    const imgData = newCanvas.toDataURL('image/jpeg', 1);
    const link = document.createElement('a');
    link.download = 'webpage-screenshot.jpeg';
    link.href = imgData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
const close = () => {
    dialogVisible.value = false;
    originalElement.value = null;
    // ClearPreviewContent
    if (svgContainerRef.value) {
        svgContainerRef.value.innerHTML = '';
    }
};
const __VLS_exposed = { open, close };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('aiChat.preview')),
    ...{ style: {} },
    width: "60%",
    beforeClose: (__VLS_ctx.close),
    destroyOnClose: true,
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('aiChat.preview')),
    ...{ style: {} },
    width: "60%",
    beforeClose: (__VLS_ctx.close),
    destroyOnClose: true,
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "svgContainerRef",
});
{
    const { footer: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (__VLS_ctx.exportPDF),
    };
    const { default: __VLS_15 } = __VLS_11.slots;
    (__VLS_ctx.$t('aiChat.exportPDF'));
    // @ts-ignore
    [dialogVisible, $t, $t, close, vLoading, loading, loading, exportPDF,];
    var __VLS_11;
    var __VLS_12;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
        type: "primary",
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_21;
    const __VLS_22 = {
        /** @type {typeof __VLS_21.click} */
        onClick: (() => {
            __VLS_ctx.loading = true;
            __VLS_ctx.exportJepg();
        }),
    };
    const { default: __VLS_23 } = __VLS_19.slots;
    (__VLS_ctx.$t('aiChat.exportImg'));
    // @ts-ignore
    [$t, loading, loading, exportJepg,];
    var __VLS_19;
    var __VLS_20;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
