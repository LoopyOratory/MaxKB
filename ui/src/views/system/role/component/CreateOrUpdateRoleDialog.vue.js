/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive } from 'vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { roleTypeMap } from '../index';
import { loadPermissionApi } from "@/utils/dynamics-api/permission-api.ts";
const emit = defineEmits();
const dialogVisible = ref(false);
const defaultForm = {
    role_name: ''
};
const form = ref({
    ...defaultForm,
});
function open(item) {
    if (item) {
        form.value = {
            role_name: item.role_name,
            role_type: item.type,
            role_id: item.id,
        };
    }
    else {
        form.value = { ...defaultForm };
    }
    dialogVisible.value = true;
}
const formRef = ref();
const rules = reactive({
    role_name: [{ required: true, message: `${t('common.inputPlaceholder')}${t('views.role.roleName')}`, trigger: 'blur' }],
    role_type: [{ required: true, message: `${t('common.selectPlaceholder')}${t('views.role.inheritingRole')}`, trigger: 'blur' }]
});
const loading = ref(false);
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            loadPermissionApi('role').CreateOrUpdateRole(form.value, loading).then((res) => {
                MsgSuccess(!form.value.role_id ? t('common.createSuccess') : t('common.renameSuccess'));
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
    title: (`${!__VLS_ctx.form.role_id ? __VLS_ctx.$t('common.create') : __VLS_ctx.$t('common.rename')}${__VLS_ctx.$t('views.role.customRole')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    title: (`${!__VLS_ctx.form.role_id ? __VLS_ctx.$t('common.create') : __VLS_ctx.$t('common.rename')}${__VLS_ctx.$t('views.role.customRole')}`),
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
    labelPosition: "top",
    ref: "formRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "formRef",
    rules: (__VLS_ctx.rules),
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
    label: (__VLS_ctx.$t('views.role.roleName')),
    prop: "role_name",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.role.roleName')),
    prop: "role_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.role_name),
    maxlength: "64",
    showWordLimit: true,
    placeholder: (`${__VLS_ctx.$t('common.inputPlaceholder')}${__VLS_ctx.$t('views.role.roleName')}`),
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.role_name),
    maxlength: "64",
    showWordLimit: true,
    placeholder: (`${__VLS_ctx.$t('common.inputPlaceholder')}${__VLS_ctx.$t('views.role.roleName')}`),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[form, form, form, $t, $t, $t, $t, $t, $t, dialogVisible, rules,];
var __VLS_18;
if (!__VLS_ctx.form.role_id) {
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        label: (__VLS_ctx.$t('views.role.inheritingRole')),
        prop: "role_type",
    }));
    const __VLS_28 = __VLS_27({
        label: (__VLS_ctx.$t('views.role.inheritingRole')),
        prop: "role_type",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    const { default: __VLS_31 } = __VLS_29.slots;
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        modelValue: (__VLS_ctx.form.role_type),
        placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.role.inheritingRole')}`),
    }));
    const __VLS_34 = __VLS_33({
        modelValue: (__VLS_ctx.form.role_type),
        placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.role.inheritingRole')}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const { default: __VLS_37 } = __VLS_35.slots;
    for (const [label, value] of __VLS_vFor((__VLS_ctx.roleTypeMap))) {
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            key: (value),
            label: (label),
            value: (value),
        }));
        const __VLS_40 = __VLS_39({
            key: (value),
            label: (label),
            value: (value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        // @ts-ignore
        [form, form, $t, $t, $t, roleTypeMap,];
    }
    // @ts-ignore
    [];
    var __VLS_35;
    // @ts-ignore
    [];
    var __VLS_29;
}
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_43 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_49;
    const __VLS_50 = {
        /** @type {typeof __VLS_49.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_51 } = __VLS_47.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_47;
    var __VLS_48;
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.formRef);
            // @ts-ignore
            [loading, submit, formRef,];
        },
    };
    const { default: __VLS_59 } = __VLS_55.slots;
    (!__VLS_ctx.form.role_id ? __VLS_ctx.$t('common.create') : __VLS_ctx.$t('common.save'));
    // @ts-ignore
    [form, $t, $t,];
    var __VLS_55;
    var __VLS_56;
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
    __typeEmits: {},
});
export default {};
