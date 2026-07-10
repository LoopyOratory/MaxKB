/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
import { resetUrl } from '@/utils/common';
import { postUploadFile } from '@/api/application/application';
const props = withDefaults(defineProps(), {
    modelValue: '',
    shape: 'square',
    accept: 'image/jpeg,image/png,image/gif,image/svg+xml',
});
const emit = defineEmits();
const defaultIcon = './favicon.ico';
const fileInputRef = ref();
const uploading = ref(false);
const handleClick = () => {
    fileInputRef.value?.click();
};
const handleFileChange = async (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file)
        return;
    // Validate file size (max 10MB)
    const isLimit = file.size / 1024 / 1024 < 10;
    if (!isLimit) {
        MsgError(t('common.EditAvatarDialog.fileSizeExceeded'));
        input.value = '';
        return;
    }
    uploading.value = true;
    try {
        const result = await postUploadFile(file, props.applicationId, 'APPLICATION', uploading);
        // The API returns the path as './oss/file/{uuid}'
        const path = result?.data || result;
        if (path) {
            emit('update:modelValue', typeof path === 'string' ? path : path?.path || path?.data || '');
        }
    }
    catch (e) {
        MsgError('Upload failed');
    }
    finally {
        uploading.value = false;
        input.value = '';
    }
};
const handleReset = () => {
    emit('update:modelValue', '');
};
const __VLS_defaults = {
    modelValue: '',
    shape: 'square',
    accept: 'image/jpeg,image/png,image/gif,image/svg+xml',
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
/** @type {__VLS_StyleScopedClasses['icon-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-uploader" },
});
/** @type {__VLS_StyleScopedClasses['icon-uploader']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.handleClick) },
    ...{ class: "icon-preview" },
});
/** @type {__VLS_StyleScopedClasses['icon-preview']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    shape: (__VLS_ctx.shape),
    size: (56),
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    shape: (__VLS_ctx.shape),
    size: (56),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.modelValue) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(__VLS_ctx.modelValue, __VLS_ctx.resetUrl(__VLS_ctx.defaultIcon))),
        alt: "",
    });
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(__VLS_ctx.defaultIcon)),
        alt: "",
    });
}
// @ts-ignore
[handleClick, shape, modelValue, modelValue, resetUrl, resetUrl, resetUrl, defaultIcon, defaultIcon,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-overlay" },
});
/** @type {__VLS_StyleScopedClasses['icon-overlay']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    iconName: "app-magnify",
    ...{ class: "color-white" },
    ...{ style: {} },
}));
const __VLS_8 = __VLS_7({
    iconName: "app-magnify",
    ...{ class: "color-white" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['color-white']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "icon-actions ml-12" },
});
/** @type {__VLS_StyleScopedClasses['icon-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ 'onClick': {} },
    size: "small",
    loading: (__VLS_ctx.uploading),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onClick': {} },
    size: "small",
    loading: (__VLS_ctx.uploading),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_16;
const __VLS_17 = {
    /** @type {typeof __VLS_16.click} */
    onClick: (__VLS_ctx.handleClick),
};
const { default: __VLS_18 } = __VLS_14.slots;
(__VLS_ctx.uploading ? 'Uploading...' : __VLS_ctx.$t('common.EditAvatarDialog.upload'));
// @ts-ignore
[handleClick, uploading, uploading, $t,];
var __VLS_14;
var __VLS_15;
if (__VLS_ctx.modelValue) {
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        size: "small",
        disabled: (__VLS_ctx.uploading),
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        size: "small",
        disabled: (__VLS_ctx.uploading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        /** @type {typeof __VLS_24.click} */
        onClick: (__VLS_ctx.handleReset),
    };
    const { default: __VLS_26 } = __VLS_22.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [modelValue, uploading, $t, handleReset,];
    var __VLS_22;
    var __VLS_23;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onChange: (__VLS_ctx.handleFileChange) },
    ref: "fileInputRef",
    type: "file",
    accept: (__VLS_ctx.accept),
    ...{ style: {} },
});
// @ts-ignore
[handleFileChange, accept,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
