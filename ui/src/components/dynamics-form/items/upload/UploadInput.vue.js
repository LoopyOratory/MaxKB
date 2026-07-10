/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, inject, ref, useAttrs } from 'vue';
import { ElMessage } from 'element-plus';
import { getImgUrl, downloadByURL, getFileUrl, fileType } from '@/utils/common';
import { getAttrsArray } from '@/utils/array';
import { t } from '@/locales';
import { useFormDisabled } from 'element-plus';
const inputDisabled = useFormDisabled();
const attrs = useAttrs();
const upload = inject('upload');
const props = withDefaults(defineProps(), {
    modelValue: () => [],
});
const emit = defineEmits(['update:modelValue']);
function formatSize(sizeInBytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return size.toFixed(2) + ' ' + units[unitIndex];
}
const deleteFile = (file) => {
    if (inputDisabled.value) {
        return;
    }
    fileArray.value = fileArray.value.filter((f) => f.uid != file.uid);
    emit('update:modelValue', fileArray.value);
};
const model_value = computed({
    get: () => {
        if (!props.modelValue) {
            emit('update:modelValue', []);
        }
        return props.modelValue;
    },
    set: (v) => {
        emit('update:modelValue', v);
    },
});
const fileArray = ref([]);
const imageExtensions = ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP'];
const videoExtensions = ['MP4', 'AVI', 'MKV', 'MOV', 'FLV', 'WMV'];
const audioExtensions = ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'];
const ofType = (exts) => (f) => exts.includes(fileType(f?.name || '').toUpperCase());
const files_with_url = computed(() => (model_value.value || []).map((f) => ({ ...f, url: f.url || getFileUrl(f.file_id) })));
const image_list = computed(() => files_with_url.value.filter(ofType(imageExtensions)));
const audio_list = computed(() => files_with_url.value.filter(ofType(audioExtensions)));
const video_list = computed(() => files_with_url.value.filter(ofType(videoExtensions)));
// Non-image/audio/video (documents, compressed packages, etc.) uniformly use download card
const download_list = computed(() => files_with_url.value.filter((f) => !ofType([...imageExtensions, ...audioExtensions, ...videoExtensions])(f)));
function downloadFile(item) {
    downloadByURL(item.url, item.name);
}
const loading = ref(false);
const uploadFile = async (file, fileList) => {
    fileList.splice(fileList.indexOf(file), 1);
    if (fileArray.value.find((f) => f.name === file.name)) {
        ElMessage.warning(t('aiChat.uploadFile.fileRepeat'));
        return;
    }
    const max_file_size = props.formField.max_file_size;
    if (file.size / 1024 / 1024 > max_file_size) {
        ElMessage.warning(t('aiChat.uploadFile.sizeLimit') + max_file_size + 'MB');
        return;
    }
    if (fileList.length > attrs.limit) {
        ElMessage.warning(t('aiChat.uploadFile.limitMessage1') + attrs.limit + t('aiChat.uploadFile.limitMessage2'));
        return;
    }
    upload(file.raw, loading).then((ok) => {
        const split_path = ok.data.split('/');
        const file_id = split_path[split_path.length - 1];
        fileArray.value?.push({ name: file.name, file_id, size: file.size });
        emit('update:modelValue', fileArray.value);
    });
};
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
/** @type {__VLS_StyleScopedClasses['download-button']} */ ;
/** @type {__VLS_StyleScopedClasses['upload_content']} */ ;
/** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
/** @type {__VLS_StyleScopedClasses['el-space__item']} */ ;
/** @type {__VLS_StyleScopedClasses['upload_content']} */ ;
/** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
/** @type {__VLS_StyleScopedClasses['el-space__item']} */ ;
/** @type {__VLS_StyleScopedClasses['upload_content']} */ ;
/** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
/** @type {__VLS_StyleScopedClasses['el-space__item']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
    action: "#",
    autoUpload: (false),
    onChange: ((file, fileList) => __VLS_ctx.uploadFile(file, fileList)),
    fileList: (__VLS_ctx.model_value),
    multiple: true,
    showFileList: (false),
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
    action: "#",
    autoUpload: (false),
    onChange: ((file, fileList) => __VLS_ctx.uploadFile(file, fileList)),
    fileList: (__VLS_ctx.model_value),
    multiple: true,
    showFileList: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    type: "primary",
}));
const __VLS_8 = __VLS_7({
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.$t('aiChat.uploadFile.label'));
// @ts-ignore
[uploadFile, model_value, $attrs, vLoading, loading, $t,];
var __VLS_9;
// @ts-ignore
[];
var __VLS_3;
if (!__VLS_ctx.inputDisabled) {
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        wrap: true,
        ...{ class: "w-full media-file-width upload_content mt-16" },
    }));
    const __VLS_14 = __VLS_13({
        wrap: true,
        ...{ class: "w-full media-file-width upload_content mt-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
    /** @type {__VLS_StyleScopedClasses['upload_content']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    for (const [file, index] of __VLS_vFor((__VLS_ctx.model_value))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_18;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            ...{ style: {} },
            shadow: "never",
        }));
        const __VLS_20 = __VLS_19({
            ...{ style: {} },
            shadow: "never",
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        const { default: __VLS_23 } = __VLS_21.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
            ...{ class: ([__VLS_ctx.inputDisabled ? 'is-disabled' : '']) },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(file && file?.name)),
            alt: "",
            width: "24",
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ellipsis-1" },
            title: (file.name),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (file.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ellipsis-1" },
            title: (__VLS_ctx.formatSize(file.size)),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (__VLS_ctx.formatSize(file.size));
        if (!__VLS_ctx.inputDisabled) {
            let __VLS_24;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
                ...{ 'onClick': {} },
                link: true,
                ...{ class: "ml-8" },
            }));
            const __VLS_26 = __VLS_25({
                ...{ 'onClick': {} },
                link: true,
                ...{ class: "ml-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            let __VLS_29;
            const __VLS_30 = {
                /** @type {typeof __VLS_29.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.inputDisabled))
                        throw 0;
                    if (!(!__VLS_ctx.inputDisabled))
                        throw 0;
                    return __VLS_ctx.deleteFile(file);
                    // @ts-ignore
                    [model_value, inputDisabled, inputDisabled, inputDisabled, getImgUrl, formatSize, formatSize, deleteFile,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_31 } = __VLS_27.slots;
            let __VLS_32;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                iconName: "app-delete",
            }));
            const __VLS_34 = __VLS_33({
                iconName: "app-delete",
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            // @ts-ignore
            [];
            var __VLS_27;
            var __VLS_28;
        }
        // @ts-ignore
        [];
        var __VLS_21;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_15;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8 w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (__VLS_ctx.download_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_37;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            wrap: true,
            ...{ class: "w-full media-file-width upload_content" },
        }));
        const __VLS_39 = __VLS_38({
            wrap: true,
            ...{ class: "w-full media-file-width upload_content" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
        /** @type {__VLS_StyleScopedClasses['upload_content']} */ ;
        const { default: __VLS_42 } = __VLS_40.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.download_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            let __VLS_43;
            /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
            elCard;
            // @ts-ignore
            const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
                shadow: "never",
                ...{ style: {} },
                ...{ class: "download-file cursor" },
            }));
            const __VLS_45 = __VLS_44({
                shadow: "never",
                ...{ style: {} },
                ...{ class: "download-file cursor" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_44));
            /** @type {__VLS_StyleScopedClasses['download-file']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            const { default: __VLS_48 } = __VLS_46.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(!__VLS_ctx.inputDisabled))
                            throw 0;
                        if (!(__VLS_ctx.download_list.length))
                            throw 0;
                        return __VLS_ctx.downloadFile(item);
                        // @ts-ignore
                        [download_list, download_list, downloadFile,];
                    } },
                ...{ class: "download-button flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['download-button']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_49;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
                ...{ class: "mr-4" },
            }));
            const __VLS_51 = __VLS_50({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_50));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            const { default: __VLS_54 } = __VLS_52.slots;
            let __VLS_55;
            /** @ts-ignore @type { | typeof __VLS_components.Download} */
            Download;
            // @ts-ignore
            const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({}));
            const __VLS_57 = __VLS_56({}, ...__VLS_functionalComponentArgsRest(__VLS_56));
            // @ts-ignore
            [];
            var __VLS_52;
            (__VLS_ctx.$t('aiChat.download'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "show flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['show']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.getImgUrl(item && item?.name)),
                alt: "",
                width: "24",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ml-4 ellipsis-1" },
                title: (item && item?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (item && item?.name);
            // @ts-ignore
            [$t, getImgUrl,];
            var __VLS_46;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_40;
    }
    if (__VLS_ctx.image_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_60;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
            wrap: true,
        }));
        const __VLS_62 = __VLS_61({
            wrap: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        const { default: __VLS_65 } = __VLS_63.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.image_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (item.url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "file cursor border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['file']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                let __VLS_66;
                /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                elImage;
                // @ts-ignore
                const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
                    src: (item.url),
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                    previewSrcList: (__VLS_ctx.getAttrsArray(__VLS_ctx.image_list, 'url')),
                    initialIndex: (index),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                }));
                const __VLS_68 = __VLS_67({
                    src: (item.url),
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                    previewSrcList: (__VLS_ctx.getAttrsArray(__VLS_ctx.image_list, 'url')),
                    initialIndex: (index),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_67));
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            // @ts-ignore
            [image_list, image_list, image_list, getAttrsArray,];
        }
        // @ts-ignore
        [];
        var __VLS_63;
    }
    if (__VLS_ctx.audio_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            wrap: true,
        }));
        const __VLS_73 = __VLS_72({
            wrap: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        const { default: __VLS_76 } = __VLS_74.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.audio_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (item.url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "file cursor border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['file']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.audio)({
                    src: (item.url),
                    controls: true,
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            // @ts-ignore
            [audio_list, audio_list,];
        }
        // @ts-ignore
        [];
        var __VLS_74;
    }
    if (__VLS_ctx.video_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            wrap: true,
        }));
        const __VLS_79 = __VLS_78({
            wrap: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        const { default: __VLS_82 } = __VLS_80.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.video_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (item.url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "file cursor border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['file']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                    src: (item.url),
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                    controls: true,
                });
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            // @ts-ignore
            [video_list, video_list,];
        }
        // @ts-ignore
        [];
        var __VLS_80;
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
