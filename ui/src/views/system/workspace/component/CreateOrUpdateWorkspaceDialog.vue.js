/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive } from 'vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { loadPermissionApi } from "@/utils/dynamics-api/permission-api.ts";
const emit = defineEmits();
const dialogVisible = ref(false);
const defaultForm = {
    name: ''
};
const form = ref({
    ...defaultForm,
});
function open(item) {
    if (item) {
        form.value = { id: item.id, name: item.name };
    }
    else {
        form.value = { ...defaultForm };
    }
    dialogVisible.value = true;
}
const formRef = ref();
const rules = reactive({
    name: [{ required: true, message: `${t('common.inputPlaceholder')}${t('views.workspace.name')}`, trigger: 'blur' }],
});
const loading = ref(false);
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            loadPermissionApi('workspace').CreateOrUpdateWorkspace(form.value, loading).then((res) => {
                MsgSuccess(!form.value.id ? t('common.createSuccess') : t('common.renameSuccess'));
                emit('refresh', res.data);
                dialogVisible.value = false;
            });
        }
    });
};
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
    title: (`${!__VLS_ctx.form.id ? __VLS_ctx.$t('common.create') : __VLS_ctx.$t('common.rename')}${__VLS_ctx.$t('views.workspace.title')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    title: (`${!__VLS_ctx.form.id ? __VLS_ctx.$t('common.create') : __VLS_ctx.$t('common.rename')}${__VLS_ctx.$t('views.workspace.title')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "formRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "formRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.$t('views.workspace.name')),
    prop: "name",
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('views.workspace.name')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.form.name),
    maxlength: "64",
    showWordLimit: true,
    placeholder: (`${__VLS_ctx.$t('common.inputPlaceholder')}${__VLS_ctx.$t('views.workspace.name')}`),
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.form.name),
    maxlength: "64",
    showWordLimit: true,
    placeholder: (`${__VLS_ctx.$t('common.inputPlaceholder')}${__VLS_ctx.$t('views.workspace.name')}`),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[form, form, form, $t, $t, $t, $t, $t, $t, dialogVisible, rules,];
var __VLS_20;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
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
            return __VLS_ctx.submit(__VLS_ctx.formRef);
            // @ts-ignore
            [loading, submit, formRef,];
        },
    };
    const { default: __VLS_44 } = __VLS_40.slots;
    (!__VLS_ctx.form.id ? __VLS_ctx.$t('common.create') : __VLS_ctx.$t('common.save'));
    // @ts-ignore
    [form, $t, $t,];
    var __VLS_40;
    var __VLS_41;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
});
export default {};
