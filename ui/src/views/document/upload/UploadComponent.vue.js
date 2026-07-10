/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onUnmounted, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { filesize, getImgUrl, isRightType } from '@/utils/common';
import { MsgError } from '@/utils/message';
import applicationApi from '@/api/application/application';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
import { t } from '@/locales';
const route = useRoute();
const { query: { id }, // id is knowledgeID, hasid isUploadDocument
 } = route;
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const { knowledge } = useStore();
const documentsFiles = computed(() => knowledge.documentsFiles);
const documentsType = computed(() => knowledge.documentsType);
const FormRef = ref();
const loading = ref(false);
const uploadLoading = ref(false);
const form = ref({
    fileType: 'txt',
    fileList: [],
});
const rules = reactive({
    fileList: [
        { required: true, message: t('views.document.upload.requiredMessage'), trigger: 'change' },
    ],
});
const file_count_limit = ref(50);
const file_size_limit = ref(100);
const successCount = computed(() => form.value.fileList.filter((i) => i.status !== 'uploading').length);
const errorCount = computed(() => form.value.fileList.filter((i) => i.status === 'error').length);
const uploadingCount = computed(() => form.value.fileList.filter((i) => i.status === 'uploading').length);
const retryList = computed(() => form.value.fileList.filter((i) => i.status === 'error' && i.canRetry));
const getFileStatusOrder = (item) => {
    if (item.status === 'error' && item.canRetry)
        return 0;
    if (item.status === 'error')
        return 1;
    if (item.status === 'uploading')
        return 2;
    return 3;
};
const sortedFileList = computed(() => form.value.fileList
    .map((item, index) => ({ item, index }))
    .sort((a, b) => getFileStatusOrder(a.item) - getFileStatusOrder(b.item) || a.index - b.index)
    .map(({ item }) => item));
const retryAll = () => {
    retryList.value.forEach((i) => uploadFile(i));
};
const filterSuccessFiles = (data) => {
    return data?.filter((f) => f.status === 'success') || [];
};
watch(form.value, (value) => {
    knowledge.saveDocumentsType(value.fileType);
    knowledge.saveDocumentsFile(filterSuccessFiles(value.fileList));
});
function downloadTemplate(type) {
    loadSharedApi({ type: 'document', systemType: apiType.value }).exportQATemplate(`${type}${t('views.document.upload.template')}.${type == 'csv' ? type : 'xlsx'}`, type);
}
function downloadTableTemplate(type) {
    loadSharedApi({ type: 'document', systemType: apiType.value }).exportTableTemplate(`${type}${t('views.document.upload.template')}.${type == 'csv' ? type : 'xlsx'}`, type);
}
function radioChange() {
    form.value.fileList.forEach((item) => {
        if (item?.status === 'uploading' && typeof item.abort === 'function') {
            item.aborted = true;
            item.abort();
        }
    });
    form.value.fileList = [];
}
function deleteFile(item) {
    if (item?.status === 'uploading' && typeof item.abort === 'function') {
        item.aborted = true;
        item.abort();
    }
    else if (item?.status === 'success' && item?.file_id) {
        applicationApi.deleteFile(item.file_id);
    }
    const index = form.value.fileList.indexOf(item);
    if (index !== -1) {
        form.value.fileList.splice(index, 1);
    }
}
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
    if (form.value.fileList.length >= file_count_limit.value) {
        onExceed();
        removeCurrentFile();
        return false;
    }
    const item = reactive({
        uid: file.uid,
        name: file.name,
        size: file.size,
        file_id: '',
        source_file_id: '',
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
        form.value.fileList?.push(item);
        removeCurrentFile();
        return false;
    }
    if (!isRightType(file?.name, form.value.fileType)) {
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
    form.value.fileList.push(item);
    removeCurrentFile();
    uploadFile(item);
};
const uploadFile = (item) => {
    item.status = 'uploading';
    item.percentage = 0;
    item.errMsg = '';
    item.canRetry = false;
    item.aborted = false;
    const res = applicationApi.postUploadFileProgress(item.raw, 'TEMPORARY_120_MINUTE', 'TEMPORARY_120_MINUTE', (percent) => {
        item.percentage = percent;
    }, uploadLoading);
    item.abort = typeof res?.abort === 'function' ? res.abort : null;
    const request = res?.then ? res : res?.request;
    request
        .then((ok) => {
        const split_path = ok.data.split('/');
        item.file_id = split_path[split_path.length - 1];
        item.source_file_id = item.file_id;
        item.percentage = 100;
        item.status = 'success';
    })
        .catch(() => {
        if (item.aborted)
            return;
        item.status = 'error';
        item.errMsg = t('dynamicsForm.UploadInput.errorTip.networkError');
        item.canRetry = true;
    });
};
const onExceed = () => {
    MsgError(t('views.document.tip.fileLimitCountTip1') +
        file_count_limit.value +
        t('views.document.tip.fileLimitCountTip2'));
};
const handlePreview = (bool) => {
    let inputDom = null;
    nextTick(() => {
        if (document.querySelector('.el-upload__input') != null) {
            inputDom = document.querySelector('.el-upload__input');
            inputDom.webkitdirectory = bool;
        }
    });
};
/*
  FormValidate
*/
function validate() {
    if (!FormRef.value)
        return;
    return FormRef.value.validate((valid) => {
        return valid;
    });
}
function getDetail() {
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .getKnowledgeDetail(id, loading)
        .then((res) => {
        file_count_limit.value = res.data.file_count_limit;
        file_size_limit.value = res.data.file_size_limit;
    });
}
onMounted(() => {
    if (documentsType.value) {
        form.value.fileType = documentsType.value;
    }
    if (documentsFiles.value) {
        form.value.fileList = documentsFiles.value;
    }
    getDetail();
});
onUnmounted(() => {
    form.value = {
        fileType: 'txt',
        fileList: [],
    };
});
const __VLS_exposed = {
    validate,
    form,
    uploadingCount,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.document.uploadDocument'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_2 = __VLS_1({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-16 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.fileType),
    ...{ class: "app-radio-button-group" },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.fileType),
    ...{ class: "app-radio-button-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
const __VLS_14 = {
    /** @type {typeof __VLS_13.change} */
    onChange: (__VLS_ctx.radioChange),
};
/** @type {__VLS_StyleScopedClasses['app-radio-button-group']} */ ;
const { default: __VLS_15 } = __VLS_11.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    value: "txt",
}));
const __VLS_18 = __VLS_17({
    value: "txt",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
(__VLS_ctx.$t('views.document.fileType.txt.label'));
// @ts-ignore
[$t, $t, form, form, rules, vLoading, loading, radioChange,];
var __VLS_19;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    value: "table",
}));
const __VLS_24 = __VLS_23({
    value: "table",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
(__VLS_ctx.$t('views.document.fileType.table.label'));
// @ts-ignore
[$t,];
var __VLS_25;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    value: "QA",
}));
const __VLS_30 = __VLS_29({
    value: "QA",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
(__VLS_ctx.$t('views.document.fileType.QA.label'));
// @ts-ignore
[$t,];
var __VLS_31;
// @ts-ignore
[];
var __VLS_11;
var __VLS_12;
if (__VLS_ctx.form.fileType === 'QA') {
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        prop: "fileList",
    }));
    const __VLS_36 = __VLS_35({
        prop: "fileList",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    const { default: __VLS_39 } = __VLS_37.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "update-info flex p-8-12 border-r-6 mb-16 w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['update-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        iconName: "app-warning-colorful",
        ...{ style: {} },
    }));
    const __VLS_42 = __VLS_41({
        iconName: "app-warning-colorful",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-16 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.fileType.QA.tip1'));
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_50;
    const __VLS_51 = {
        /** @type {typeof __VLS_50.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form.fileType === 'QA'))
                throw 0;
            return __VLS_ctx.downloadTemplate('excel');
            // @ts-ignore
            [$t, form, downloadTemplate,];
        },
    };
    const { default: __VLS_52 } = __VLS_48.slots;
    (__VLS_ctx.$t('views.document.upload.download'));
    (__VLS_ctx.$t('views.document.upload.template'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_48;
    var __VLS_49;
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_58;
    const __VLS_59 = {
        /** @type {typeof __VLS_58.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form.fileType === 'QA'))
                throw 0;
            return __VLS_ctx.downloadTemplate('csv');
            // @ts-ignore
            [downloadTemplate,];
        },
    };
    const { default: __VLS_60 } = __VLS_56.slots;
    (__VLS_ctx.$t('views.document.upload.download'));
    (__VLS_ctx.$t('views.document.upload.template'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_56;
    var __VLS_57;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.fileType.QA.tip2'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.tip.fileLimitCountTip1'));
    (__VLS_ctx.file_count_limit);
    (__VLS_ctx.$t('views.document.tip.fileLimitCountTip2'));
    (__VLS_ctx.$t('views.document.tip.fileLimitSizeTip1'));
    (__VLS_ctx.file_size_limit);
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
    elUpload;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        ...{ 'onClick': {} },
        webkitdirectory: (false),
        ...{ class: "w-full mb-4" },
        drag: true,
        multiple: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".xlsx, .xls, .csv,.zip",
        onExceed: (__VLS_ctx.onExceed),
        onChange: (__VLS_ctx.fileHandleChange),
    }));
    const __VLS_63 = __VLS_62({
        ...{ 'onClick': {} },
        webkitdirectory: (false),
        ...{ class: "w-full mb-4" },
        drag: true,
        multiple: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".xlsx, .xls, .csv,.zip",
        onExceed: (__VLS_ctx.onExceed),
        onChange: (__VLS_ctx.fileHandleChange),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_66;
    const __VLS_67 = {
        /** @type {typeof __VLS_66.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form.fileType === 'QA'))
                throw 0;
            return __VLS_ctx.handlePreview(false);
            // @ts-ignore
            [$t, $t, $t, $t, form, file_count_limit, file_size_limit, onExceed, fileHandleChange, handlePreview,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    const { default: __VLS_68 } = __VLS_64.slots;
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
                if (!(__VLS_ctx.form.fileType === 'QA'))
                    throw 0;
                return __VLS_ctx.handlePreview(false);
                // @ts-ignore
                [$t, handlePreview,];
            } },
        ...{ class: "hover" },
    });
    /** @type {__VLS_StyleScopedClasses['hover']} */ ;
    (__VLS_ctx.$t('views.document.upload.selectFile'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.fileType === 'QA'))
                    throw 0;
                return __VLS_ctx.handlePreview(true);
                // @ts-ignore
                [$t, handlePreview,];
            } },
        ...{ class: "hove ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['hove']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.$t('views.document.upload.selectFiles'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "upload__decoration" },
    });
    /** @type {__VLS_StyleScopedClasses['upload__decoration']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.upload.formats'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_64;
    var __VLS_65;
    // @ts-ignore
    [];
    var __VLS_37;
}
else if (__VLS_ctx.form.fileType === 'table') {
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        prop: "fileList",
    }));
    const __VLS_71 = __VLS_70({
        prop: "fileList",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    const { default: __VLS_74 } = __VLS_72.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "update-info flex p-8-12 border-r-6 mb-16 w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['update-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        iconName: "app-warning-colorful",
        ...{ style: {} },
    }));
    const __VLS_77 = __VLS_76({
        iconName: "app-warning-colorful",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-16 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.fileType.table.tip1'));
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_85;
    const __VLS_86 = {
        /** @type {typeof __VLS_85.click} */
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.form.fileType === 'QA'))
                throw 0;
            if (!(__VLS_ctx.form.fileType === 'table'))
                throw 0;
            return __VLS_ctx.downloadTableTemplate('excel');
            // @ts-ignore
            [$t, form, downloadTableTemplate,];
        },
    };
    const { default: __VLS_87 } = __VLS_83.slots;
    (__VLS_ctx.$t('views.document.upload.download'));
    (__VLS_ctx.$t('views.document.upload.template'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_83;
    var __VLS_84;
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_93;
    const __VLS_94 = {
        /** @type {typeof __VLS_93.click} */
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.form.fileType === 'QA'))
                throw 0;
            if (!(__VLS_ctx.form.fileType === 'table'))
                throw 0;
            return __VLS_ctx.downloadTableTemplate('csv');
            // @ts-ignore
            [downloadTableTemplate,];
        },
    };
    const { default: __VLS_95 } = __VLS_91.slots;
    (__VLS_ctx.$t('views.document.upload.download'));
    (__VLS_ctx.$t('views.document.upload.template'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_91;
    var __VLS_92;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.fileType.table.tip2'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.fileType.table.tip3'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.tip.fileLimitCountTip1'));
    (__VLS_ctx.file_count_limit);
    (__VLS_ctx.$t('views.document.tip.fileLimitCountTip2'));
    (__VLS_ctx.$t('views.document.tip.fileLimitSizeTip1'));
    (__VLS_ctx.file_size_limit);
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
    elUpload;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        webkitdirectory: (false),
        ...{ class: "w-full mb-4" },
        drag: true,
        multiple: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".xlsx, .xls, .csv",
        onExceed: (__VLS_ctx.onExceed),
        onChange: (__VLS_ctx.fileHandleChange),
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        webkitdirectory: (false),
        ...{ class: "w-full mb-4" },
        drag: true,
        multiple: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".xlsx, .xls, .csv",
        onExceed: (__VLS_ctx.onExceed),
        onChange: (__VLS_ctx.fileHandleChange),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_101;
    const __VLS_102 = {
        /** @type {typeof __VLS_101.click} */
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.form.fileType === 'QA'))
                throw 0;
            if (!(__VLS_ctx.form.fileType === 'table'))
                throw 0;
            return __VLS_ctx.handlePreview(false);
            // @ts-ignore
            [$t, $t, $t, $t, $t, form, file_count_limit, file_size_limit, onExceed, fileHandleChange, handlePreview,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    const { default: __VLS_103 } = __VLS_99.slots;
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
                if (!!(__VLS_ctx.form.fileType === 'QA'))
                    throw 0;
                if (!(__VLS_ctx.form.fileType === 'table'))
                    throw 0;
                return __VLS_ctx.handlePreview(false);
                // @ts-ignore
                [$t, handlePreview,];
            } },
        ...{ class: "hover" },
    });
    /** @type {__VLS_StyleScopedClasses['hover']} */ ;
    (__VLS_ctx.$t('views.document.upload.selectFile'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.form.fileType === 'QA'))
                    throw 0;
                if (!(__VLS_ctx.form.fileType === 'table'))
                    throw 0;
                return __VLS_ctx.handlePreview(true);
                // @ts-ignore
                [$t, handlePreview,];
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
    (__VLS_ctx.$t('views.document.upload.formats'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_99;
    var __VLS_100;
    // @ts-ignore
    [];
    var __VLS_72;
}
else {
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        prop: "fileList",
    }));
    const __VLS_106 = __VLS_105({
        prop: "fileList",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const { default: __VLS_109 } = __VLS_107.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "update-info flex p-8-12 border-r-6 mb-16 w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['update-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        iconName: "app-warning-colorful",
        ...{ style: {} },
    }));
    const __VLS_112 = __VLS_111({
        iconName: "app-warning-colorful",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-16 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.fileType.txt.tip1'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.tip.fileLimitCountTip1'));
    (__VLS_ctx.file_count_limit);
    (__VLS_ctx.$t('views.document.tip.fileLimitCountTip2'));
    (__VLS_ctx.$t('views.document.tip.fileLimitSizeTip1'));
    (__VLS_ctx.file_size_limit);
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
    elUpload;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        ...{ 'onClick': {} },
        webkitdirectory: (false),
        ...{ class: "w-full" },
        drag: true,
        multiple: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".txt, .md, .log, .docx, .pdf, .html,.zip,.xlsx,.xls,.csv",
        onExceed: (__VLS_ctx.onExceed),
        onChange: (__VLS_ctx.fileHandleChange),
    }));
    const __VLS_117 = __VLS_116({
        ...{ 'onClick': {} },
        webkitdirectory: (false),
        ...{ class: "w-full" },
        drag: true,
        multiple: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".txt, .md, .log, .docx, .pdf, .html,.zip,.xlsx,.xls,.csv",
        onExceed: (__VLS_ctx.onExceed),
        onChange: (__VLS_ctx.fileHandleChange),
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    let __VLS_120;
    const __VLS_121 = {
        /** @type {typeof __VLS_120.click} */
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.form.fileType === 'QA'))
                throw 0;
            if (!!(__VLS_ctx.form.fileType === 'table'))
                throw 0;
            return __VLS_ctx.handlePreview(false);
            // @ts-ignore
            [$t, $t, $t, $t, form, file_count_limit, file_size_limit, onExceed, fileHandleChange, handlePreview,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_122 } = __VLS_118.slots;
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
                if (!!(__VLS_ctx.form.fileType === 'QA'))
                    throw 0;
                if (!!(__VLS_ctx.form.fileType === 'table'))
                    throw 0;
                return __VLS_ctx.handlePreview(false);
                // @ts-ignore
                [$t, handlePreview,];
            } },
        ...{ class: "hover" },
    });
    /** @type {__VLS_StyleScopedClasses['hover']} */ ;
    (__VLS_ctx.$t('views.document.upload.selectFile'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.form.fileType === 'QA'))
                    throw 0;
                if (!!(__VLS_ctx.form.fileType === 'table'))
                    throw 0;
                return __VLS_ctx.handlePreview(true);
                // @ts-ignore
                [$t, handlePreview,];
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
    (__VLS_ctx.$t('views.document.upload.formats'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_118;
    var __VLS_119;
    // @ts-ignore
    [];
    var __VLS_107;
}
// @ts-ignore
[];
var __VLS_3;
if (__VLS_ctx.form.fileList?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('dynamicsForm.UploadInput.uploadStatus', {
        success: __VLS_ctx.successCount,
        total: __VLS_ctx.form.fileList.length,
    }));
    if (__VLS_ctx.uploadingCount) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_123;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
            ...{ class: "is-loading color-primary" },
            size: "18",
        }));
        const __VLS_125 = __VLS_124({
            ...{ class: "is-loading color-primary" },
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_128 } = __VLS_126.slots;
        let __VLS_129;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({}));
        const __VLS_131 = __VLS_130({}, ...__VLS_functionalComponentArgsRest(__VLS_130));
        // @ts-ignore
        [$t, form, form, successCount, uploadingCount,];
        var __VLS_126;
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
        let __VLS_134;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }));
        const __VLS_136 = __VLS_135({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_139 } = __VLS_137.slots;
        let __VLS_140;
        /** @ts-ignore @type { | typeof __VLS_components.WarningFilled} */
        WarningFilled;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({}));
        const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
        // @ts-ignore
        [$t, errorCount,];
        var __VLS_137;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.$t('dynamicsForm.UploadInput.failedStatus', { count: __VLS_ctx.errorCount }));
        if (__VLS_ctx.retryList.length) {
            let __VLS_145;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_147 = __VLS_146({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_146));
            let __VLS_150;
            const __VLS_151 = {
                /** @type {typeof __VLS_150.click} */
                onClick: (__VLS_ctx.retryAll),
            };
            const { default: __VLS_152 } = __VLS_148.slots;
            let __VLS_153;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
                iconName: "app-refresh",
            }));
            const __VLS_155 = __VLS_154({
                iconName: "app-refresh",
            }, ...__VLS_functionalComponentArgsRest(__VLS_154));
            (__VLS_ctx.$t('dynamicsForm.UploadInput.reUpload'));
            // @ts-ignore
            [$t, $t, errorCount, retryList, retryAll,];
            var __VLS_148;
            var __VLS_149;
        }
    }
    else if (__VLS_ctx.successCount === __VLS_ctx.form.fileList.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_158;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
            ...{ class: "color-success" },
        }));
        const __VLS_160 = __VLS_159({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_159));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_163 } = __VLS_161.slots;
        let __VLS_164;
        /** @ts-ignore @type { | typeof __VLS_components.WarningFilled} */
        WarningFilled;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({}));
        const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
        // @ts-ignore
        [form, successCount,];
        var __VLS_161;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.$t('dynamicsForm.UploadInput.allSuccess'));
    }
}
if (__VLS_ctx.form.fileList?.length) {
    let __VLS_169;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
        gutter: (8),
        ...{ class: "mt-8" },
    }));
    const __VLS_171 = __VLS_170({
        gutter: (8),
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    const { default: __VLS_174 } = __VLS_172.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.sortedFileList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_175;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
            span: (12),
            ...{ class: "mb-8" },
        }));
        const __VLS_177 = __VLS_176({
            span: (12),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_176));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_180 } = __VLS_178.slots;
        let __VLS_181;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
            shadow: "never",
            ...{ style: {} },
            ...{ class: (item.status === 'error' ? 'border-danger' : '') },
        }));
        const __VLS_183 = __VLS_182({
            shadow: "never",
            ...{ style: {} },
            ...{ class: (item.status === 'error' ? 'border-danger' : '') },
        }, ...__VLS_functionalComponentArgsRest(__VLS_182));
        const { default: __VLS_186 } = __VLS_184.slots;
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
        let __VLS_187;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
            type: "info",
            size: "small",
        }));
        const __VLS_189 = __VLS_188({
            type: "info",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_188));
        const { default: __VLS_192 } = __VLS_190.slots;
        if (item.status === 'uploading') {
            (__VLS_ctx.filesize((item.size * item.percentage) / 100));
            (__VLS_ctx.filesize(item.size) || '0K');
        }
        else {
            (__VLS_ctx.filesize(item && item?.size) || '0K');
        }
        // @ts-ignore
        [$t, form, sortedFileList, getImgUrl, filesize, filesize, filesize,];
        var __VLS_190;
        if (item.status === 'error') {
            let __VLS_193;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
                ...{ class: "ml-8" },
                type: "danger",
                size: "small",
            }));
            const __VLS_195 = __VLS_194({
                ...{ class: "ml-8" },
                type: "danger",
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_194));
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_198 } = __VLS_196.slots;
            (item.errMsg);
            // @ts-ignore
            [];
            var __VLS_196;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (item.canRetry) {
            let __VLS_199;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_201 = __VLS_200({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_200));
            let __VLS_204;
            const __VLS_205 = {
                /** @type {typeof __VLS_204.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.form.fileList?.length))
                        throw 0;
                    if (!(item.canRetry))
                        throw 0;
                    return __VLS_ctx.uploadFile(item);
                    // @ts-ignore
                    [uploadFile,];
                },
            };
            const { default: __VLS_206 } = __VLS_202.slots;
            let __VLS_207;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
                iconName: "app-refresh",
            }));
            const __VLS_209 = __VLS_208({
                iconName: "app-refresh",
            }, ...__VLS_functionalComponentArgsRest(__VLS_208));
            // @ts-ignore
            [];
            var __VLS_202;
            var __VLS_203;
        }
        let __VLS_212;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_214 = __VLS_213({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        let __VLS_217;
        const __VLS_218 = {
            /** @type {typeof __VLS_217.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.fileList?.length))
                    throw 0;
                return __VLS_ctx.deleteFile(item);
                // @ts-ignore
                [deleteFile,];
            },
        };
        const { default: __VLS_219 } = __VLS_215.slots;
        let __VLS_220;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
            iconName: "app-delete",
        }));
        const __VLS_222 = __VLS_221({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        // @ts-ignore
        [];
        var __VLS_215;
        var __VLS_216;
        if (item.status === 'uploading') {
            let __VLS_225;
            /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
            elProgress;
            // @ts-ignore
            const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
                ...{ class: "card-progress" },
                percentage: (item.percentage),
                strokeWidth: (4),
                showText: (false),
            }));
            const __VLS_227 = __VLS_226({
                ...{ class: "card-progress" },
                percentage: (item.percentage),
                strokeWidth: (4),
                showText: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_226));
            /** @type {__VLS_StyleScopedClasses['card-progress']} */ ;
        }
        // @ts-ignore
        [];
        var __VLS_184;
        // @ts-ignore
        [];
        var __VLS_178;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_172;
}
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
