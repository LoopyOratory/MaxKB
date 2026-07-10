/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { t } from '@/locales';
const props = defineProps();
const inputValue = ref('');
const inputVisible = ref(false);
const InputRef = ref();
const handleClose = (tag) => {
    formValue.value.accept.splice(formValue.value.accept.indexOf(tag), 1);
};
const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
        InputRef.value.input.focus();
    });
};
const handleInputConfirm = () => {
    if (formValue.value.accept.find((item) => item === inputValue.value)) {
        ElMessage.warning(t('common.fileUpload.existingExtensionsTip'));
        return;
    }
    if (inputValue.value) {
        formValue.value.accept.push(inputValue.value);
    }
    inputVisible.value = false;
    inputValue.value = '';
};
const emit = defineEmits(['update:modelValue']);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    },
});
const rander = (form_data) => {
    formValue.value.default_value = [];
    formValue.value.limit = form_data.attrs.limit || 3;
    formValue.value.max_file_size = form_data.max_file_size || 10;
    formValue.value.accept = form_data.attrs.accept
        ? form_data.attrs.accept.split(',').map((item) => item.substring(1))
        : ['jpg'];
};
const getData = () => {
    return {
        input_type: 'UploadInput',
        attrs: {
            accept: formValue.value.accept.map((item) => '.' + item).join(','),
            limit: formValue.value.limit,
        },
        max_file_size: formValue.value.max_file_size,
        default_value: [],
        show_default_value: formValue.value.show_default_value,
    };
};
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onMounted(() => {
    formValue.value.default_value = [];
    formValue.value.limit = 3;
    formValue.value.max_file_size = 10;
    formValue.value.accept = ['jpg'];
    if (formValue.value.show_default_value === undefined) {
        formValue.value.show_default_value = true;
    }
});
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
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    label: (__VLS_ctx.$t('dynamicsForm.UploadInput.limit.label')),
    required: true,
    prop: "limit",
}));
const __VLS_2 = __VLS_1({
    label: (__VLS_ctx.$t('dynamicsForm.UploadInput.limit.label')),
    required: true,
    prop: "limit",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.limit),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.UploadInput.limit.required'),
            trigger: 'change',
        },
    ]),
    min: (0),
    controlsPosition: "right",
}));
const __VLS_8 = __VLS_7({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.limit),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.UploadInput.limit.required'),
            trigger: 'change',
        },
    ]),
    min: (0),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
// @ts-ignore
[$t, $t, formValue,];
var __VLS_3;
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    label: (__VLS_ctx.$t('dynamicsForm.UploadInput.max_file_size.label')),
    required: true,
    prop: "max_file_size",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.UploadInput.max_file_size.required'),
            trigger: 'change',
        },
    ]),
}));
const __VLS_13 = __VLS_12({
    label: (__VLS_ctx.$t('dynamicsForm.UploadInput.max_file_size.label')),
    required: true,
    prop: "max_file_size",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.UploadInput.max_file_size.required'),
            trigger: 'change',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_16 } = __VLS_14.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.max_file_size),
    min: (0),
    controlsPosition: "right",
}));
const __VLS_19 = __VLS_18({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.max_file_size),
    min: (0),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
// @ts-ignore
[$t, $t, formValue,];
var __VLS_14;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    label: (__VLS_ctx.$t('dynamicsForm.UploadInput.accept.label')),
    required: true,
    prop: "accept",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.UploadInput.accept.required'),
            trigger: 'change',
        },
    ]),
}));
const __VLS_24 = __VLS_23({
    label: (__VLS_ctx.$t('dynamicsForm.UploadInput.accept.label')),
    required: true,
    prop: "accept",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.UploadInput.accept.required'),
            trigger: 'change',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
elSpace;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    wrap: true,
    size: (6),
    ...{ class: "mt-4" },
}));
const __VLS_30 = __VLS_29({
    wrap: true,
    size: (6),
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const { default: __VLS_33 } = __VLS_31.slots;
for (const [tag] of __VLS_vFor((__VLS_ctx.formValue.accept))) {
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onClose': {} },
        key: (tag),
        closable: true,
        disableTransitions: (false),
        type: "info",
        effect: "plain",
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClose': {} },
        key: (tag),
        closable: true,
        disableTransitions: (false),
        type: "info",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = {
        /** @type {typeof __VLS_39.close} */
        onClose: (...[$event]) => {
            return __VLS_ctx.handleClose(tag);
            // @ts-ignore
            [$t, $t, formValue, handleClose,];
        },
    };
    const { default: __VLS_41 } = __VLS_37.slots;
    (tag);
    // @ts-ignore
    [];
    var __VLS_37;
    var __VLS_38;
    // @ts-ignore
    [];
}
if (__VLS_ctx.inputVisible) {
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ...{ 'onKeyup': {} },
        ...{ 'onBlur': {} },
        ref: "InputRef",
        modelValue: (__VLS_ctx.inputValue),
        size: "small",
        ...{ style: ({
                '--el-input-border-radius': '4px',
            }) },
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onKeyup': {} },
        ...{ 'onBlur': {} },
        ref: "InputRef",
        modelValue: (__VLS_ctx.inputValue),
        size: "small",
        ...{ style: ({
                '--el-input-border-radius': '4px',
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_47;
    const __VLS_48 = {
        /** @type {typeof __VLS_47.keyup} */
        onKeyup: (__VLS_ctx.handleInputConfirm),
    };
    const __VLS_49 = {
        /** @type {typeof __VLS_47.blur} */
        onBlur: (__VLS_ctx.handleInputConfirm),
    };
    var __VLS_50;
    var __VLS_45;
    var __VLS_46;
}
else {
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        ...{ class: "button-new-tag" },
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        ...{ class: "button-new-tag" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.click} */
        onClick: (__VLS_ctx.showInput),
    };
    /** @type {__VLS_StyleScopedClasses['button-new-tag']} */ ;
    const { default: __VLS_59 } = __VLS_55.slots;
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_62 = __VLS_61({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.fileUpload.addExtensions'));
    // @ts-ignore
    [$t, inputVisible, inputValue, handleInputConfirm, handleInputConfirm, showInput,];
    var __VLS_55;
    var __VLS_56;
}
// @ts-ignore
[];
var __VLS_31;
// @ts-ignore
[];
var __VLS_25;
// @ts-ignore
var __VLS_51 = __VLS_50;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
