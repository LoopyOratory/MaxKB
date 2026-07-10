/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { nextTick, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { MsgWarning } from '@/utils/message';
import { t } from '@/locales';
const emit = defineEmits(['refresh']);
const props = defineProps();
const dialogVisible = ref(false);
const inputVisible = ref(false);
const inputValue = ref('');
const loading = ref(false);
const fieldFormRef = ref();
const InputRef = ref();
const documentExtensions = ['TXT', 'MD', 'DOCX', 'HTML', 'CSV', 'XLSX', 'XLS', 'PDF'];
const imageExtensions = ['JPG', 'JPEG', 'PNG', 'GIF'];
const audioExtensions = ['MP3', 'WAV', 'OGG', 'ACC', 'M4A'];
const videoExtensions = ['MP4', 'AVI', 'MKV', 'MOV', 'FLV', 'WMV'];
const form_data = ref({
    maxFiles: 3,
    fileLimit: 50,
    document: true,
    image: false,
    audio: false,
    video: false,
    other: false,
    otherExtensions: ['PPT', 'DOC'],
    local_upload: true,
    url_upload: false,
});
function open(data) {
    dialogVisible.value = true;
    nextTick(() => {
        form_data.value = { ...form_data.value, ...data };
    });
}
function close() {
    dialogVisible.value = false;
}
const handleClose = (tag) => {
    form_data.value.otherExtensions = form_data.value.otherExtensions.filter((item) => item !== tag);
};
const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
        InputRef.value.input.focus();
    });
};
const handleInputConfirm = () => {
    if (inputValue.value) {
        inputValue.value = inputValue.value.toUpperCase();
        if (form_data.value.otherExtensions.includes(inputValue.value) ||
            documentExtensions.includes(inputValue.value) ||
            imageExtensions.includes(inputValue.value) ||
            audioExtensions.includes(inputValue.value)) {
            inputVisible.value = false;
            inputValue.value = '';
            MsgWarning(t('common.fileUpload.existingExtensionsTip'));
            return;
        }
        form_data.value.otherExtensions.push(inputValue.value);
    }
    inputVisible.value = false;
    inputValue.value = '';
};
async function submit() {
    const formEl = fieldFormRef.value;
    if (!form_data.value.local_upload && !form_data.value.url_upload) {
        MsgWarning(t('common.fileUpload.uploadMethodTip'));
        return;
    }
    if (!formEl)
        return;
    await formEl.validate().then(() => {
        const formattedData = cloneDeep(form_data.value);
        emit('refresh', formattedData);
        // emit('refresh', form_data.value)
        props.nodeModel.graphModel.eventCenter.emit('refreshFileUploadConfig');
        dialogVisible.value = false;
    });
}
const __VLS_exposed = {
    open,
};
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
    title: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    width: "800",
    alignCenter: true,
    ...{ class: "scrollbar-dialog" },
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    width: "800",
    alignCenter: true,
    ...{ class: "scrollbar-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['scrollbar-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    labelPosition: "top",
    ref: "fieldFormRef",
    model: (__VLS_ctx.form_data),
    requireAsteriskPosition: "right",
}));
const __VLS_15 = __VLS_14({
    labelPosition: "top",
    ref: "fieldFormRef",
    model: (__VLS_ctx.form_data),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_18;
const { default: __VLS_20 } = __VLS_16.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.maxFiles')),
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.maxFiles')),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
elSlider;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.form_data.maxFiles),
    showInput: true,
    showInputControls: (false),
    min: (1),
    max: (100),
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.form_data.maxFiles),
    showInput: true,
    showInputControls: (false),
    min: (1),
    max: (100),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
// @ts-ignore
[$t, $t, dialogVisible, close, form_data, form_data,];
var __VLS_24;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileLimit')),
}));
const __VLS_34 = __VLS_33({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileLimit')),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
elSlider;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    modelValue: (__VLS_ctx.form_data.fileLimit),
    showInput: true,
    showInputControls: (false),
    min: (1),
    max: (1000),
}));
const __VLS_40 = __VLS_39({
    modelValue: (__VLS_ctx.form_data.fileLimit),
    showInput: true,
    showInputControls: (false),
    min: (1),
    max: (1000),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
// @ts-ignore
[$t, form_data,];
var __VLS_35;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.label')),
}));
const __VLS_45 = __VLS_44({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.document ? 'border-active' : '') },
    ...{ style: {} },
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.document ? 'border-active' : '') },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
const __VLS_55 = {
    /** @type {typeof __VLS_54.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.form_data.document = !__VLS_ctx.form_data.document;
        // @ts-ignore
        [$t, form_data, form_data, form_data,];
    },
};
/** @type {__VLS_StyleScopedClasses['card-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_56 } = __VLS_52.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    ...{ class: "mr-12" },
    src: "@/assets/workflow/icon_file-doc.svg",
    alt: "",
});
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "line-height-22 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('common.fileUpload.document'));
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    ...{ class: "color-secondary" },
}));
const __VLS_59 = __VLS_58({
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_62 } = __VLS_60.slots;
(__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.documentText'));
// @ts-ignore
[$t, $t,];
var __VLS_60;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.documentExtensions.join('、'));
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.document),
}));
const __VLS_65 = __VLS_64({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.document),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
const __VLS_69 = {
    /** @type {typeof __VLS_68.change} */
    onChange: (...[$event]) => {
        return __VLS_ctx.form_data.document = !__VLS_ctx.form_data.document;
        // @ts-ignore
        [form_data, form_data, form_data, documentExtensions,];
    },
};
var __VLS_66;
var __VLS_67;
// @ts-ignore
[];
var __VLS_52;
var __VLS_53;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.image ? 'border-active' : '') },
    ...{ style: {} },
}));
const __VLS_72 = __VLS_71({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.image ? 'border-active' : '') },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
const __VLS_76 = {
    /** @type {typeof __VLS_75.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.form_data.image = !__VLS_ctx.form_data.image;
        // @ts-ignore
        [form_data, form_data, form_data,];
    },
};
/** @type {__VLS_StyleScopedClasses['card-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_77 } = __VLS_73.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    ...{ class: "mr-12" },
    src: "@/assets/workflow/icon_file-image.svg",
    alt: "",
});
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "line-height-22 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('common.fileUpload.image'));
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    ...{ class: "color-secondary" },
}));
const __VLS_80 = __VLS_79({
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_83 } = __VLS_81.slots;
(__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.imageText'));
// @ts-ignore
[$t, $t,];
var __VLS_81;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.imageExtensions.join('、'));
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.image),
}));
const __VLS_86 = __VLS_85({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.image),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
let __VLS_89;
const __VLS_90 = {
    /** @type {typeof __VLS_89.change} */
    onChange: (...[$event]) => {
        return __VLS_ctx.form_data.image = !__VLS_ctx.form_data.image;
        // @ts-ignore
        [form_data, form_data, form_data, imageExtensions,];
    },
};
var __VLS_87;
var __VLS_88;
// @ts-ignore
[];
var __VLS_73;
var __VLS_74;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.audio ? 'border-active' : '') },
    ...{ style: {} },
}));
const __VLS_93 = __VLS_92({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.audio ? 'border-active' : '') },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
let __VLS_96;
const __VLS_97 = {
    /** @type {typeof __VLS_96.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.form_data.audio = !__VLS_ctx.form_data.audio;
        // @ts-ignore
        [form_data, form_data, form_data,];
    },
};
/** @type {__VLS_StyleScopedClasses['card-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_98 } = __VLS_94.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    ...{ class: "mr-12" },
    src: "@/assets/workflow/icon_file-audio.svg",
    alt: "",
});
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "line-height-22 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('common.fileUpload.audio'));
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ class: "color-secondary" },
}));
const __VLS_101 = __VLS_100({
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_104 } = __VLS_102.slots;
(__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.audioText'));
// @ts-ignore
[$t, $t,];
var __VLS_102;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.audioExtensions.join('、'));
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.audio),
}));
const __VLS_107 = __VLS_106({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.audio),
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
let __VLS_110;
const __VLS_111 = {
    /** @type {typeof __VLS_110.change} */
    onChange: (...[$event]) => {
        return __VLS_ctx.form_data.audio = !__VLS_ctx.form_data.audio;
        // @ts-ignore
        [form_data, form_data, form_data, audioExtensions,];
    },
};
var __VLS_108;
var __VLS_109;
// @ts-ignore
[];
var __VLS_94;
var __VLS_95;
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.video ? 'border-active' : '') },
    ...{ style: {} },
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.video ? 'border-active' : '') },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = {
    /** @type {typeof __VLS_117.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.form_data.video = !__VLS_ctx.form_data.video;
        // @ts-ignore
        [form_data, form_data, form_data,];
    },
};
/** @type {__VLS_StyleScopedClasses['card-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_119 } = __VLS_115.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    ...{ class: "mr-12" },
    width: "32",
    src: "@/assets/workflow/icon_file-video.svg",
    alt: "",
});
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "line-height-22 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('common.fileUpload.video'));
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    ...{ class: "color-secondary" },
}));
const __VLS_122 = __VLS_121({
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_125 } = __VLS_123.slots;
(__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.videoText'));
// @ts-ignore
[$t, $t,];
var __VLS_123;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.videoExtensions.join('、'));
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.video),
}));
const __VLS_128 = __VLS_127({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.video),
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
let __VLS_131;
const __VLS_132 = {
    /** @type {typeof __VLS_131.change} */
    onChange: (...[$event]) => {
        return __VLS_ctx.form_data.video = !__VLS_ctx.form_data.video;
        // @ts-ignore
        [form_data, form_data, form_data, videoExtensions,];
    },
};
var __VLS_129;
var __VLS_130;
// @ts-ignore
[];
var __VLS_115;
var __VLS_116;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.other ? 'border-active' : '') },
    ...{ style: {} },
}));
const __VLS_135 = __VLS_134({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor w-full mb-8" },
    ...{ class: (__VLS_ctx.form_data.other ? 'border-active' : '') },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
let __VLS_138;
const __VLS_139 = {
    /** @type {typeof __VLS_138.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.form_data.other = !__VLS_ctx.form_data.other;
        // @ts-ignore
        [form_data, form_data, form_data,];
    },
};
/** @type {__VLS_StyleScopedClasses['card-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_140 } = __VLS_136.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    ...{ class: "mr-12" },
    width: (32),
    src: "@/assets/fileType/unknown-icon.svg",
    alt: "",
});
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "line-height-22 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('common.fileUpload.other'));
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    ...{ class: "color-secondary" },
}));
const __VLS_143 = __VLS_142({
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_146 } = __VLS_144.slots;
(__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.otherText'));
// @ts-ignore
[$t, $t,];
var __VLS_144;
let __VLS_147;
/** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
elSpace;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    wrap: true,
    size: (6),
    ...{ class: "mt-4" },
}));
const __VLS_149 = __VLS_148({
    wrap: true,
    size: (6),
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const { default: __VLS_152 } = __VLS_150.slots;
for (const [tag] of __VLS_vFor((__VLS_ctx.form_data.otherExtensions))) {
    let __VLS_153;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
        ...{ 'onClose': {} },
        key: (tag),
        closable: true,
        disableTransitions: (false),
        type: "info",
        effect: "plain",
    }));
    const __VLS_155 = __VLS_154({
        ...{ 'onClose': {} },
        key: (tag),
        closable: true,
        disableTransitions: (false),
        type: "info",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    let __VLS_158;
    const __VLS_159 = {
        /** @type {typeof __VLS_158.close} */
        onClose: (...[$event]) => {
            return __VLS_ctx.handleClose(tag);
            // @ts-ignore
            [form_data, handleClose,];
        },
    };
    const { default: __VLS_160 } = __VLS_156.slots;
    (tag);
    // @ts-ignore
    [];
    var __VLS_156;
    var __VLS_157;
    // @ts-ignore
    [];
}
if (__VLS_ctx.inputVisible) {
    let __VLS_161;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
        ...{ 'onKeyup': {} },
        ...{ 'onBlur': {} },
        ref: "InputRef",
        modelValue: (__VLS_ctx.inputValue),
        size: "small",
        ...{ style: ({
                '--el-input-border-radius': '4px',
            }) },
    }));
    const __VLS_163 = __VLS_162({
        ...{ 'onKeyup': {} },
        ...{ 'onBlur': {} },
        ref: "InputRef",
        modelValue: (__VLS_ctx.inputValue),
        size: "small",
        ...{ style: ({
                '--el-input-border-radius': '4px',
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    let __VLS_166;
    const __VLS_167 = {
        /** @type {typeof __VLS_166.keyup} */
        onKeyup: (__VLS_ctx.handleInputConfirm),
    };
    const __VLS_168 = {
        /** @type {typeof __VLS_166.blur} */
        onBlur: (__VLS_ctx.handleInputConfirm),
    };
    var __VLS_169;
    var __VLS_164;
    var __VLS_165;
}
else {
    let __VLS_171;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        ...{ 'onClick': {} },
        ...{ class: "button-new-tag" },
        size: "small",
    }));
    const __VLS_173 = __VLS_172({
        ...{ 'onClick': {} },
        ...{ class: "button-new-tag" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    let __VLS_176;
    const __VLS_177 = {
        /** @type {typeof __VLS_176.click} */
        onClick: (__VLS_ctx.showInput),
    };
    /** @type {__VLS_StyleScopedClasses['button-new-tag']} */ ;
    const { default: __VLS_178 } = __VLS_174.slots;
    let __VLS_179;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_181 = __VLS_180({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.fileUpload.addExtensions'));
    // @ts-ignore
    [$t, inputVisible, inputValue, handleInputConfirm, handleInputConfirm, showInput,];
    var __VLS_174;
    var __VLS_175;
}
// @ts-ignore
[];
var __VLS_150;
let __VLS_184;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.other),
}));
const __VLS_186 = __VLS_185({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form_data.other),
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
let __VLS_189;
const __VLS_190 = {
    /** @type {typeof __VLS_189.change} */
    onChange: (...[$event]) => {
        return __VLS_ctx.form_data.other = !__VLS_ctx.form_data.other;
        // @ts-ignore
        [form_data, form_data, form_data,];
    },
};
var __VLS_187;
var __VLS_188;
// @ts-ignore
[];
var __VLS_136;
var __VLS_137;
let __VLS_191;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.uploadMethod')),
}));
const __VLS_193 = __VLS_192({
    label: (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.uploadMethod')),
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
const { default: __VLS_196 } = __VLS_194.slots;
{
    const { label: __VLS_197 } = __VLS_194.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.baseNode.FileUploadSetting.fileUploadType.uploadMethod'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    modelValue: (__VLS_ctx.form_data.local_upload),
    ...{ class: "mr-16" },
}));
const __VLS_200 = __VLS_199({
    modelValue: (__VLS_ctx.form_data.local_upload),
    ...{ class: "mr-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
/** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
const { default: __VLS_203 } = __VLS_201.slots;
(__VLS_ctx.$t('common.fileUpload.localUpload'));
// @ts-ignore
[$t, form_data,];
var __VLS_201;
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.form_data.url_upload),
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.form_data.url_upload),
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
const { default: __VLS_209 } = __VLS_207.slots;
(__VLS_ctx.$t('common.fileUpload.urlUpload'));
// @ts-ignore
[$t, form_data,];
var __VLS_207;
// @ts-ignore
[];
var __VLS_194;
// @ts-ignore
[];
var __VLS_46;
// @ts-ignore
[];
var __VLS_16;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_210 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_211;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
        ...{ 'onClick': {} },
    }));
    const __VLS_213 = __VLS_212({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    let __VLS_216;
    const __VLS_217 = {
        /** @type {typeof __VLS_216.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_218 } = __VLS_214.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_214;
    var __VLS_215;
    let __VLS_219;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_221 = __VLS_220({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_220));
    let __VLS_224;
    const __VLS_225 = {
        /** @type {typeof __VLS_224.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit();
            // @ts-ignore
            [loading, submit,];
        },
    };
    const { default: __VLS_226 } = __VLS_222.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t,];
    var __VLS_222;
    var __VLS_223;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_19 = __VLS_18, __VLS_170 = __VLS_169;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
