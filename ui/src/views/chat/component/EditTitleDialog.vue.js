/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import chatAPI from '@/api/chat/chat';
const emit = defineEmits(['refresh']);
const fieldFormRef = ref();
const loading = ref(false);
const applicationId = ref('');
const chatId = ref('');
const form = ref({
    abstract: ''
});
const dialogVisible = ref(false);
const open = (row, id) => {
    applicationId.value = id;
    chatId.value = row.id;
    form.value.abstract = row.abstract;
    dialogVisible.value = true;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            chatAPI.modifyChat(chatId.value, form.value, loading).then(() => {
                emit('refresh', chatId.value, form.value.abstract);
                dialogVisible.value = false;
            });
        }
    });
};
const __VLS_exposed = { open, close };
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
    ...{ class: "responsive-dialog" },
    title: (__VLS_ctx.$t('aiChat.editTitle')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ class: "responsive-dialog" },
    title: (__VLS_ctx.$t('aiChat.editTitle')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['responsive-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelPosition: "top",
    ref: "fieldFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "fieldFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    prop: "abstract",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'blur'
        }
    ]),
}));
const __VLS_17 = __VLS_16({
    prop: "abstract",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('common.inputPlaceholder'),
            trigger: 'blur'
        }
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.abstract),
    maxlength: "1024",
    showWordLimit: true,
    type: "textarea",
}));
const __VLS_23 = __VLS_22({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.abstract),
    maxlength: "1024",
    showWordLimit: true,
    type: "textarea",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    /** @type {typeof __VLS_26.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.abstract = __VLS_ctx.form.abstract.trim();
        // @ts-ignore
        [$t, $t, dialogVisible, form, form, form, form,];
    },
};
var __VLS_24;
var __VLS_25;
// @ts-ignore
[];
var __VLS_18;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_28 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    const __VLS_35 = {
        /** @type {typeof __VLS_34.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_36 } = __VLS_32.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_32;
    var __VLS_33;
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_42;
    const __VLS_43 = {
        /** @type {typeof __VLS_42.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_44 } = __VLS_40.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_40;
    var __VLS_41;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
