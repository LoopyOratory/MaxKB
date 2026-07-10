/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { MsgError } from '@/utils/message';
import { isAppIcon } from '@/utils/common';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import { useRoute } from 'vue-router';
const props = defineProps();
const emit = defineEmits(['refresh']);
const route = useRoute();
const iconFile = ref(null);
const fileURL = ref(null);
const dialogVisible = ref(false);
const loading = ref(false);
const detail = ref(null);
const radioType = ref('default');
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
const isShared = computed(() => {
    return route.path.includes('shared');
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        iconFile.value = null;
        fileURL.value = null;
    }
});
const open = (data) => {
    radioType.value = isAppIcon(data.icon) ? 'custom' : 'default';
    fileURL.value = isAppIcon(data.icon) ? data.icon : null;
    detail.value = cloneDeep(data);
    dialogVisible.value = true;
};
const onChange = (file) => {
    //1、DetermineFileSizeWhetherValid, FileLimitCannot be greater than10MB
    const isLimit = file?.size / 1024 / 1024 < 10;
    if (!isLimit) {
        MsgError(t('common.EditAvatarDialog.fileSizeExceeded'));
        return false;
    }
    else {
        iconFile.value = file;
        fileURL.value = URL.createObjectURL(file.raw);
    }
};
function submit() {
    if (radioType.value === 'default') {
        emit('refresh', '');
        dialogVisible.value = false;
    }
    else if (radioType.value === 'custom' && iconFile.value) {
        const fd = new FormData();
        fd.append('file', iconFile.value.raw);
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .putToolIcon(detail.value.id, fd, loading)
            .then((res) => {
            emit('refresh', res.data);
            dialogVisible.value = false;
        });
    }
    else {
        MsgError(t('common.EditAvatarDialog.uploadImagePrompt'));
    }
}
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (`Logo ${__VLS_ctx.$t('common.setting')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    width: "550",
}));
const __VLS_2 = __VLS_1({
    title: (`Logo ${__VLS_ctx.$t('common.setting')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    width: "550",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.radioType),
    ...{ class: "radio-block mb-16" },
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.radioType),
    ...{ class: "radio-block mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    value: "default",
}));
const __VLS_15 = __VLS_14({
    value: "default",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('common.EditAvatarDialog.default'));
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
ToolIcon;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    size: (32),
    type: (__VLS_ctx.iconType),
}));
const __VLS_21 = __VLS_20({
    size: (32),
    type: (__VLS_ctx.iconType),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[$t, $t, dialogVisible, radioType, iconType,];
var __VLS_16;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    value: "custom",
}));
const __VLS_26 = __VLS_25({
    value: "custom",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('common.EditAvatarDialog.customizeUpload'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex mt-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
if (__VLS_ctx.fileURL) {
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        shape: "square",
        size: (32),
        ...{ style: {} },
        ...{ class: "mr-16" },
    }));
    const __VLS_32 = __VLS_31({
        shape: "square",
        size: (32),
        ...{ style: {} },
        ...{ class: "mr-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    const { default: __VLS_35 } = __VLS_33.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.fileURL),
        alt: "",
    });
    // @ts-ignore
    [$t, fileURL, fileURL,];
    var __VLS_33;
}
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: (__VLS_ctx.onChange),
}));
const __VLS_38 = __VLS_37({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: (__VLS_ctx.onChange),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_41;
const { default: __VLS_43 } = __VLS_39.slots;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    icon: "Upload",
    disabled: (__VLS_ctx.radioType !== 'custom'),
}));
const __VLS_46 = __VLS_45({
    icon: "Upload",
    disabled: (__VLS_ctx.radioType !== 'custom'),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
(__VLS_ctx.$t('common.EditAvatarDialog.upload'));
// @ts-ignore
[$t, radioType, onChange,];
var __VLS_47;
// @ts-ignore
[];
var __VLS_39;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "el-upload__tip info mt-8" },
});
/** @type {__VLS_StyleScopedClasses['el-upload__tip']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
(__VLS_ctx.$t('common.EditAvatarDialog.sizeTip'));
// @ts-ignore
[$t,];
var __VLS_27;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_50 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_58 } = __VLS_54.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_54;
    var __VLS_55;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_66 } = __VLS_62.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_62;
    var __VLS_63;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_42 = __VLS_41;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
