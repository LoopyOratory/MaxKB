/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, onMounted } from 'vue';
import emailApi from '@/api/system-settings/email-setting';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { ComplexPermission } from '@/utils/permission/type';
const form = ref({
    email_host: '',
    email_port: '',
    email_host_user: '',
    email_host_password: '',
    email_use_tls: false,
    email_use_ssl: false,
    from_email: '',
});
const emailFormRef = ref();
const loading = ref(false);
const rules = reactive({
    email_host: [
        { required: true, message: t('views.system.email.smtpHostPlaceholder'), trigger: 'blur' },
    ],
    email_port: [
        { required: true, message: t('views.system.email.smtpPortPlaceholder'), trigger: 'blur' },
    ],
    email_host_user: [
        { required: true, message: t('views.system.email.smtpUserPlaceholder'), trigger: 'blur' },
    ],
    email_host_password: [
        { required: true, message: t('views.system.email.smtpPasswordPlaceholder'), trigger: 'blur' },
    ],
    from_email: [
        { required: true, message: t('views.system.email.sendEmailPlaceholder'), trigger: 'blur' },
    ],
});
const submit = async (formEl, test) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (test) {
                emailApi.postTestEmail(form.value, loading).then((res) => {
                    MsgSuccess(t('views.system.testSuccess'));
                });
            }
            else {
                emailApi.putEmailSetting(form.value, loading).then((res) => {
                    MsgSuccess(t('common.saveSuccess'));
                });
            }
        }
    });
};
function getDetail() {
    emailApi.getEmailSetting(loading).then((res) => {
        if (res.data && JSON.stringify(res.data) !== '{}') {
            form.value = res.data;
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
    ...{ class: "email-setting p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['email-setting']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
elBreadcrumb;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}));
const __VLS_2 = __VLS_1({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.t('views.system.subTitle'));
// @ts-ignore
[t,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "ml-4 color-text-primary" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
(__VLS_ctx.$t('views.system.email.title'));
// @ts-ignore
[$t,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ style: {} },
}));
const __VLS_20 = __VLS_19({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "email-setting__main p-16" },
});
/** @type {__VLS_StyleScopedClasses['email-setting__main']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ref: "emailFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_32 = __VLS_31({
    ref: "emailFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
var __VLS_35;
const { default: __VLS_37 } = __VLS_33.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    label: (__VLS_ctx.$t('views.system.email.smtpHost')),
    prop: "email_host",
}));
const __VLS_40 = __VLS_39({
    label: (__VLS_ctx.$t('views.system.email.smtpHost')),
    prop: "email_host",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_43 } = __VLS_41.slots;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.form.email_host),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpHostPlaceholder')),
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.form.email_host),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpHostPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
// @ts-ignore
[$t, $t, vLoading, loading, rules, form, form,];
var __VLS_41;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    label: (__VLS_ctx.$t('views.system.email.smtpPort')),
    prop: "email_port",
}));
const __VLS_51 = __VLS_50({
    label: (__VLS_ctx.$t('views.system.email.smtpPort')),
    prop: "email_port",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const { default: __VLS_54 } = __VLS_52.slots;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    modelValue: (__VLS_ctx.form.email_port),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpPortPlaceholder')),
}));
const __VLS_57 = __VLS_56({
    modelValue: (__VLS_ctx.form.email_port),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpPortPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
// @ts-ignore
[$t, $t, form,];
var __VLS_52;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    label: (__VLS_ctx.$t('views.system.email.smtpUser')),
    prop: "email_host_user",
}));
const __VLS_62 = __VLS_61({
    label: (__VLS_ctx.$t('views.system.email.smtpUser')),
    prop: "email_host_user",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const { default: __VLS_65 } = __VLS_63.slots;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    modelValue: (__VLS_ctx.form.email_host_user),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpUserPlaceholder')),
}));
const __VLS_68 = __VLS_67({
    modelValue: (__VLS_ctx.form.email_host_user),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpUserPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
// @ts-ignore
[$t, $t, form,];
var __VLS_63;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    label: (__VLS_ctx.$t('views.system.email.sendEmail')),
    prop: "from_email",
}));
const __VLS_73 = __VLS_72({
    label: (__VLS_ctx.$t('views.system.email.sendEmail')),
    prop: "from_email",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    modelValue: (__VLS_ctx.form.from_email),
    placeholder: (__VLS_ctx.$t('views.system.email.sendEmailPlaceholder')),
}));
const __VLS_79 = __VLS_78({
    modelValue: (__VLS_ctx.form.from_email),
    placeholder: (__VLS_ctx.$t('views.system.email.sendEmailPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
// @ts-ignore
[$t, $t, form,];
var __VLS_74;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    label: (__VLS_ctx.$t('views.system.password')),
    prop: "email_host_password",
}));
const __VLS_84 = __VLS_83({
    label: (__VLS_ctx.$t('views.system.password')),
    prop: "email_host_password",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
const { default: __VLS_87 } = __VLS_85.slots;
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    modelValue: (__VLS_ctx.form.email_host_password),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpPasswordPlaceholder')),
    showPassword: true,
}));
const __VLS_90 = __VLS_89({
    modelValue: (__VLS_ctx.form.email_host_password),
    placeholder: (__VLS_ctx.$t('views.system.email.smtpPasswordPlaceholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
// @ts-ignore
[$t, $t, form,];
var __VLS_85;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({}));
const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const { default: __VLS_98 } = __VLS_96.slots;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.form.email_use_ssl),
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.form.email_use_ssl),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
(__VLS_ctx.$t('views.system.email.enableSSL'));
// @ts-ignore
[$t, form,];
var __VLS_102;
// @ts-ignore
[];
var __VLS_96;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const { default: __VLS_110 } = __VLS_108.slots;
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    modelValue: (__VLS_ctx.form.email_use_tls),
}));
const __VLS_113 = __VLS_112({
    modelValue: (__VLS_ctx.form.email_use_tls),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
const { default: __VLS_116 } = __VLS_114.slots;
(__VLS_ctx.$t('views.system.email.enableTLS'));
// @ts-ignore
[$t, form,];
var __VLS_114;
// @ts-ignore
[];
var __VLS_108;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-12" },
});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.EMAIL_SETTING_EDIT], [], 'OR')) }, null, null);
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_119 = __VLS_118({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
let __VLS_122;
const __VLS_123 = {
    /** @type {typeof __VLS_122.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.submit(__VLS_ctx.emailFormRef);
        // @ts-ignore
        [loading, vHasPermission, ComplexPermission, RoleConst, PermissionConst, submit, emailFormRef,];
    },
};
const { default: __VLS_124 } = __VLS_120.slots;
(__VLS_ctx.$t('common.save'));
// @ts-ignore
[$t,];
var __VLS_120;
var __VLS_121;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.loading),
}));
const __VLS_127 = __VLS_126({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
let __VLS_130;
const __VLS_131 = {
    /** @type {typeof __VLS_130.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.submit(__VLS_ctx.emailFormRef, 'test');
        // @ts-ignore
        [loading, submit, emailFormRef,];
    },
};
const { default: __VLS_132 } = __VLS_128.slots;
(__VLS_ctx.$t('views.system.test'));
// @ts-ignore
[$t,];
var __VLS_128;
var __VLS_129;
// @ts-ignore
[];
var __VLS_33;
// @ts-ignore
[];
var __VLS_27;
// @ts-ignore
[];
var __VLS_21;
// @ts-ignore
var __VLS_36 = __VLS_35;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
