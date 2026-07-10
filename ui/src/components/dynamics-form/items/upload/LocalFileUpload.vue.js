/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, useAttrs, nextTick, inject, ref, reactive } from 'vue';
import { MsgError } from '@/utils/message';
import { filesize, getImgUrl, fileType } from '@/utils/common';
import applicationApi from '@/api/application/application';
import { t } from '@/locales';
const upload = inject('upload');
const attrs = useAttrs();
const props = withDefaults(defineProps(), {
    modelValue: () => [],
});
const onExceed = () => {
    MsgError(t('views.document.tip.fileLimitCountTip1') +
        file_count_limit.value +
        t('views.document.tip.fileLimitCountTip2'));
};
const emit = defineEmits(['update:modelValue']);
const fileArray = ref([]);
const loading = ref(false);
// UploadSuccessCount
const successCount = computed(() => fileArray.value.filter((i) => i.status !== 'uploading').length);
// UploadFailureCount
const errorCount = computed(() => fileArray.value.filter((i) => i.status === 'error').length);
// Upload in Count
const uploadingCount = computed(() => fileArray.value.filter((i) => i.status === 'uploading').length);
// canRe-UploadFailureItems (networkErroretc.)
const retryList = computed(() => fileArray.value.filter((i) => i.status === 'error' && i.canRetry));
const getFileStatusOrder = (item) => {
    if (item.status === 'error' && item.canRetry)
        return 0;
    if (item.status === 'error')
        return 1;
    if (item.status === 'uploading')
        return 2;
    return 3;
};
const sortedFileArray = computed(() => fileArray.value
    .map((item, index) => ({ item, index }))
    .sort((a, b) => getFileStatusOrder(a.item) - getFileStatusOrder(b.item) || a.index - b.index)
    .map(({ item }) => item));
// Re-UploadAllRetryableFailureFile
const retryAll = () => {
    retryList.value.forEach((i) => uploadFile(i));
};
// Uploadon-changeEvent
const fileHandleChange = (file, fileList) => {
    // Confirm position by file unique identifier and remove current file
    // Note: cannotUse splice(-1, 1) Blind delete tailElement，FolderUploadwill mistakenly delete normalFilewhile letting over-limit ones throughFile
    const removeCurrentFile = () => {
        const index = fileList.findIndex((item) => item.uid === file.uid);
        if (index !== -1) {
            fileList.splice(index, 1);
        }
    };
    if (fileArray.value.length >= file_count_limit.value) {
        onExceed();
        removeCurrentFile();
        return false;
    }
    const item = reactive({
        uid: file.uid,
        name: file.name,
        size: file.size,
        file_id: '',
        percentage: 0,
        status: 'uploading',
        errMsg: '',
        canRetry: false,
        raw: file.raw,
        abort: null,
        aborted: false,
    });
    //1、DetermineFileSizeWhetherValid, FileLimitCannot be greater than100M
    const isLimit = file?.size / 1024 / 1024 < file_size_limit.value;
    if (!isLimit) {
        item.status = 'error';
        item.errMsg = t('dynamicsForm.UploadInput.errorTip.sizeError');
        // MsgError(t('views.document.tip.fileLimitSizeTip1') + file_size_limit.value + 'MB')
        // fileList.splice(-1, 1) //RemoveCurrentExceedSizeFile
        fileArray.value?.push(item);
        removeCurrentFile();
        return false;
    }
    if (!file_type_list.value.includes(fileType(file.name).toLocaleUpperCase())) {
        if (file?.name !== '.DS_Store') {
            MsgError(t('views.document.upload.errorMessage2'));
        }
        removeCurrentFile();
        return false;
    }
    if (file?.size === 0) {
        MsgError(t('views.document.upload.errorMessage3'));
        removeCurrentFile();
        return false;
    }
    fileArray.value?.push(item);
    removeCurrentFile();
    uploadFile(item);
};
// ExecuteUpload
const uploadFile = (item) => {
    item.status = 'uploading';
    item.percentage = 0;
    item.errMsg = '';
    item.canRetry = false;
    item.aborted = false;
    const res = upload(item.raw, (percent) => {
        item.percentage = percent;
    }, loading);
    // When provider returns { request, abort }, save interrupt method so upload can be interrupted on deletion
    item.abort = typeof res?.abort === 'function' ? res.abort : null;
    const request = res?.then ? res : res?.request;
    request
        .then((ok) => {
        const split_path = ok.data.split('/');
        item.file_id = split_path[split_path.length - 1];
        item.percentage = 100;
        item.status = 'success';
        emit('update:modelValue', fileArray.value);
    })
        .catch(() => {
        // ActiveInterrupt（Deletion) caused byFailureNo longer markError
        if (item.aborted)
            return;
        item.status = 'error';
        item.errMsg = t('dynamicsForm.UploadInput.errorTip.networkError');
        item.canRetry = true;
    });
};
function deleteFile(item) {
    // Interrupt upload request on deletion during upload
    if (item?.status === 'uploading' && typeof item.abort === 'function') {
        item.aborted = true;
        item.abort();
    }
    else if (item?.status === 'success' && item?.file_id) {
        applicationApi.deleteFile(item.file_id);
    }
    const index = fileArray.value.indexOf(item);
    if (index !== -1) {
        fileArray.value.splice(index, 1);
    }
    emit('update:modelValue', fileArray.value);
}
const handlePreview = (bool) => {
    let inputDom = null;
    nextTick(() => {
        if (document.querySelector('.el-upload__input') != null) {
            inputDom = document.querySelector('.el-upload__input');
            inputDom.webkitdirectory = bool;
        }
    });
};
const accept = computed(() => {
    return (attrs.file_type_list || []).map((item) => '.' + item.toLowerCase()).join(',');
});
const file_type_list = computed(() => {
    return attrs.file_type_list.map((item) => item.toUpperCase()) || [];
});
const formats = computed(() => {
    return file_type_list.value.join('、');
});
const file_size_limit = computed(() => {
    return attrs.file_size_limit || 50;
});
const file_count_limit = computed(() => {
    return attrs.file_count_limit || 100;
});
const __VLS_defaults = {
    modelValue: () => [],
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    ref: "UploadRef",
    webkitdirectory: (false),
    ...{ class: "w-full" },
    drag: true,
    multiple: true,
    fileList: (__VLS_ctx.fileArray),
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: (__VLS_ctx.accept),
    onExceed: (__VLS_ctx.onExceed),
    onChange: (__VLS_ctx.fileHandleChange),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    ref: "UploadRef",
    webkitdirectory: (false),
    ...{ class: "w-full" },
    drag: true,
    multiple: true,
    fileList: (__VLS_ctx.fileArray),
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: (__VLS_ctx.accept),
    onExceed: (__VLS_ctx.onExceed),
    onChange: (__VLS_ctx.fileHandleChange),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.handlePreview(false);
        // @ts-ignore
        [fileArray, accept, onExceed, fileHandleChange, handlePreview,];
    },
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_9 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/upload-icon.svg",
    alt: "",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "el-upload__text" },
});
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.upload.uploadMessage'));
__VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.handlePreview(false);
            // @ts-ignore
            [handlePreview, $t,];
        } },
    ...{ class: "hover" },
});
/** @type {__VLS_StyleScopedClasses['hover']} */ ;
(__VLS_ctx.$t('views.document.upload.selectFile'));
__VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.handlePreview(true);
            // @ts-ignore
            [handlePreview, $t,];
        } },
    ...{ class: "hover ml-4" },
});
/** @type {__VLS_StyleScopedClasses['hover']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.$t('views.document.upload.selectFiles'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload__decoration" },
});
/** @type {__VLS_StyleScopedClasses['upload__decoration']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.tip.fileLimitCountTip1'));
(__VLS_ctx.file_count_limit);
(__VLS_ctx.$t('views.document.tip.fileLimitCountTip2'));
(__VLS_ctx.$t('views.document.tip.fileLimitSizeTip1'));
(__VLS_ctx.file_size_limit);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.upload.formats'));
(__VLS_ctx.formats);
// @ts-ignore
[$t, $t, $t, $t, $t, file_count_limit, file_size_limit, formats,];
var __VLS_3;
var __VLS_4;
if (__VLS_ctx.fileArray?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('dynamicsForm.UploadInput.uploadStatus', {
        success: __VLS_ctx.successCount,
        total: __VLS_ctx.fileArray.length,
    }));
    if (__VLS_ctx.uploadingCount) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_10;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
            ...{ class: "is-loading color-primary" },
            size: "18",
        }));
        const __VLS_12 = __VLS_11({
            ...{ class: "is-loading color-primary" },
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_15 } = __VLS_13.slots;
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({}));
        const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
        // @ts-ignore
        [fileArray, fileArray, $t, successCount, uploadingCount,];
        var __VLS_13;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.$t('dynamicsForm.UploadInput.uploading'));
    }
    else if (__VLS_ctx.errorCount) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }));
        const __VLS_23 = __VLS_22({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_26 } = __VLS_24.slots;
        let __VLS_27;
        /** @ts-ignore @type { | typeof __VLS_components.WarningFilled} */
        WarningFilled;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({}));
        const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
        // @ts-ignore
        [$t, errorCount,];
        var __VLS_24;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.$t('dynamicsForm.UploadInput.failedStatus', { count: __VLS_ctx.errorCount }));
        if (__VLS_ctx.retryList.length) {
            let __VLS_32;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_34 = __VLS_33({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            let __VLS_37;
            const __VLS_38 = {
                /** @type {typeof __VLS_37.click} */
                onClick: (__VLS_ctx.retryAll),
            };
            const { default: __VLS_39 } = __VLS_35.slots;
            let __VLS_40;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
                iconName: "app-refresh",
            }));
            const __VLS_42 = __VLS_41({
                iconName: "app-refresh",
            }, ...__VLS_functionalComponentArgsRest(__VLS_41));
            (__VLS_ctx.$t('dynamicsForm.UploadInput.reUpload'));
            // @ts-ignore
            [$t, $t, errorCount, retryList, retryAll,];
            var __VLS_35;
            var __VLS_36;
        }
    }
    else if (__VLS_ctx.successCount === __VLS_ctx.fileArray.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            ...{ class: "color-success" },
        }));
        const __VLS_47 = __VLS_46({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_50 } = __VLS_48.slots;
        let __VLS_51;
        /** @ts-ignore @type { | typeof __VLS_components.WarningFilled} */
        WarningFilled;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({}));
        const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
        // @ts-ignore
        [fileArray, successCount,];
        var __VLS_48;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.$t('dynamicsForm.UploadInput.allSuccess'));
    }
}
if (__VLS_ctx.fileArray?.length) {
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        gutter: (8),
        ...{ class: "mt-8" },
    }));
    const __VLS_58 = __VLS_57({
        gutter: (8),
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    const { default: __VLS_61 } = __VLS_59.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.sortedFileArray))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_62;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
            span: (12),
            ...{ class: "mb-8" },
        }));
        const __VLS_64 = __VLS_63({
            span: (12),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_67 } = __VLS_65.slots;
        let __VLS_68;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
            shadow: "never",
            ...{ style: {} },
            ...{ class: (item.status === 'error' ? 'border-danger' : '') },
        }));
        const __VLS_70 = __VLS_69({
            shadow: "never",
            ...{ style: {} },
            ...{ class: (item.status === 'error' ? 'border-danger' : '') },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        const { default: __VLS_73 } = __VLS_71.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(item && item?.name)),
            alt: "",
            width: "40",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "ellipsis-1" },
            title: (item && item?.name),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (item && item?.name);
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            type: "info",
            size: "small",
        }));
        const __VLS_76 = __VLS_75({
            type: "info",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        const { default: __VLS_79 } = __VLS_77.slots;
        if (item.status === 'uploading') {
            (__VLS_ctx.filesize((item.size * item.percentage) / 100));
            (__VLS_ctx.filesize(item.size) || '0K');
        }
        else {
            (__VLS_ctx.filesize(item && item?.size) || '0K');
        }
        // @ts-ignore
        [fileArray, $t, sortedFileArray, getImgUrl, filesize, filesize, filesize,];
        var __VLS_77;
        if (item.status === 'error') {
            let __VLS_80;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                ...{ class: "ml-8" },
                type: "danger",
                size: "small",
            }));
            const __VLS_82 = __VLS_81({
                ...{ class: "ml-8" },
                type: "danger",
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_85 } = __VLS_83.slots;
            (item.errMsg);
            // @ts-ignore
            [];
            var __VLS_83;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (item.canRetry) {
            let __VLS_86;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_88 = __VLS_87({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_87));
            let __VLS_91;
            const __VLS_92 = {
                /** @type {typeof __VLS_91.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.fileArray?.length))
                        throw 0;
                    if (!(item.canRetry))
                        throw 0;
                    return __VLS_ctx.uploadFile(item);
                    // @ts-ignore
                    [uploadFile,];
                },
            };
            const { default: __VLS_93 } = __VLS_89.slots;
            let __VLS_94;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
                iconName: "app-refresh",
            }));
            const __VLS_96 = __VLS_95({
                iconName: "app-refresh",
            }, ...__VLS_functionalComponentArgsRest(__VLS_95));
            // @ts-ignore
            [];
            var __VLS_89;
            var __VLS_90;
        }
        let __VLS_99;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_101 = __VLS_100({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        let __VLS_104;
        const __VLS_105 = {
            /** @type {typeof __VLS_104.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.fileArray?.length))
                    throw 0;
                return __VLS_ctx.deleteFile(item);
                // @ts-ignore
                [deleteFile,];
            },
        };
        const { default: __VLS_106 } = __VLS_102.slots;
        let __VLS_107;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
            iconName: "app-delete",
        }));
        const __VLS_109 = __VLS_108({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        // @ts-ignore
        [];
        var __VLS_102;
        var __VLS_103;
        if (item.status === 'uploading') {
            let __VLS_112;
            /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
            elProgress;
            // @ts-ignore
            const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
                ...{ class: "card-progress" },
                percentage: (item.percentage),
                strokeWidth: (4),
                showText: (false),
            }));
            const __VLS_114 = __VLS_113({
                ...{ class: "card-progress" },
                percentage: (item.percentage),
                strokeWidth: (4),
                showText: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_113));
            /** @type {__VLS_StyleScopedClasses['card-progress']} */ ;
        }
        // @ts-ignore
        [];
        var __VLS_71;
        // @ts-ignore
        [];
        var __VLS_65;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_59;
}
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
