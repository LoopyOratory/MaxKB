/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, onMounted } from 'vue';
import authApi from '@/api/system-settings/auth-setting';
import { t } from '@/locales';
import { MsgSuccess } from '@/utils/message';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { ComplexPermission } from '@/utils/permission/type';
const form = ref({
    id: '',
    auth_type: 'CAS',
    config: {
        ldpUri: '',
        validateUrl: '',
        redirectUrl: ''
    },
    is_active: true
});
const authFormRef = ref();
const loading = ref(false);
const rules = reactive({
    'config.ldpUri': [
        {
            required: true,
            message: t('views.system.authentication.cas.ldpUriPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.validateUrl': [
        {
            required: true,
            message: t('views.system.authentication.cas.validateUrlPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.redirectUrl': [
        {
            required: true,
            message: t('views.system.authentication.cas.redirectUrlPlaceholder'),
            trigger: 'blur'
        }
    ]
});
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            authApi.putAuthSetting(form.value.auth_type, form.value, loading).then((res) => {
                MsgSuccess(t('common.saveSuccess'));
            });
        }
    });
};
function getDetail() {
    authApi.getAuthSetting(form.value.auth_type, loading).then((res) => {
        if (res.data && JSON.stringify(res.data) !== '{}') {
            if (!res.data.config.validateUrl) {
                res.data.config.validateUrl = res.data.config.ldpUri;
            }
            form.value = res.data;
        }
        if (!form.value.config.redirectUrl) {
            form.value.config.redirectUrl = window.location.origin + window.MaxKB.prefix + '/api/cas';
        }
    });
}
onMounted(() => {
    getDetail();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "authentication-setting__main main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['authentication-setting__main']} */ ;
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-container p-24" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ref: "authFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_8 = __VLS_7({
    ref: "authFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
var __VLS_11;
const { default: __VLS_13 } = __VLS_9.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    label: (__VLS_ctx.$t('views.system.authentication.cas.ldpUri')),
    prop: "config.ldpUri",
}));
const __VLS_16 = __VLS_15({
    label: (__VLS_ctx.$t('views.system.authentication.cas.ldpUri')),
    prop: "config.ldpUri",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.form.config.ldpUri),
    placeholder: (__VLS_ctx.$t('views.system.authentication.cas.ldpUriPlaceholder')),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.form.config.ldpUri),
    placeholder: (__VLS_ctx.$t('views.system.authentication.cas.ldpUriPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
// @ts-ignore
[vLoading, loading, rules, form, form, $t, $t,];
var __VLS_17;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    label: (__VLS_ctx.$t('views.system.authentication.cas.validateUrl')),
    prop: "config.validateUrl",
}));
const __VLS_27 = __VLS_26({
    label: (__VLS_ctx.$t('views.system.authentication.cas.validateUrl')),
    prop: "config.validateUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.form.config.validateUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.cas.validateUrlPlaceholder')),
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.form.config.validateUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.cas.validateUrlPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
// @ts-ignore
[form, $t, $t,];
var __VLS_28;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    label: (__VLS_ctx.$t('views.system.authentication.cas.redirectUrl')),
    prop: "config.redirectUrl",
}));
const __VLS_38 = __VLS_37({
    label: (__VLS_ctx.$t('views.system.authentication.cas.redirectUrl')),
    prop: "config.redirectUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.form.config.redirectUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.cas.redirectUrlPlaceholder')),
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.form.config.redirectUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.cas.redirectUrlPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
// @ts-ignore
[form, $t, $t,];
var __VLS_39;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({}));
const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.form.is_active),
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.form.is_active),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_58 } = __VLS_56.slots;
(__VLS_ctx.$t('views.system.authentication.cas.enableAuthentication'));
// @ts-ignore
[form, $t,];
var __VLS_56;
// @ts-ignore
[];
var __VLS_50;
// @ts-ignore
[];
var __VLS_9;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_64;
const __VLS_65 = {
    /** @type {typeof __VLS_64.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.submit(__VLS_ctx.authFormRef);
        // @ts-ignore
        [loading, submit, authFormRef,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.LOGIN_AUTH_EDIT], [], 'OR')) }, null, null);
const { default: __VLS_66 } = __VLS_62.slots;
(__VLS_ctx.$t('common.save'));
// @ts-ignore
[$t, vHasPermission, ComplexPermission, RoleConst, PermissionConst,];
var __VLS_62;
var __VLS_63;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_12 = __VLS_11;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
