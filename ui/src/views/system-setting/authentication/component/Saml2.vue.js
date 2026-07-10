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
    auth_type: 'SAML2',
    config: {
        idpMetaUrl: '',
        wantAssertionsSigned: true,
        wantAuthnRequestsSigned: true,
        privateKey: '',
        certificate: '',
        mapping: '',
        spEntityId: window.location.origin + window.MaxKB.prefix + '/api/saml2/metadata',
        spAcs: window.location.origin + window.MaxKB.prefix + '/api/saml2/sso',
    },
    is_active: true,
});
const authFormRef = ref();
const loading = ref(false);
const rules = reactive({
    'config.idpMetaUrl': [
        {
            required: true,
            message: t('views.system.authentication.saml2.ldpPlaceholder'),
            trigger: 'blur',
        },
    ],
    'config.privateKey': [
        {
            required: true,
            message: t('views.system.authentication.saml2.privateKeyPlaceholder'),
            trigger: 'blur',
        },
    ],
    'config.certificate': [
        {
            required: true,
            message: t('views.system.authentication.saml2.certificatePlaceholder'),
            trigger: 'blur',
        },
    ],
    'config.mapping': [
        {
            required: true,
            message: t('views.system.authentication.saml2.filedMappingPlaceholder'),
            trigger: 'blur',
        },
    ],
});
const submit = async (formEl, test) => {
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
            form.value = res.data;
            if (res.data.config.mapping) {
                form.value.config.mapping = JSON.stringify(JSON.parse(res.data.config.mapping));
            }
            if (!form.value.config.spEntityId) {
                form.value.config.spEntityId = window.location.origin + window.MaxKB.prefix + '/api/saml2/metadata';
            }
            if (!form.value.config.spAcs) {
                form.value.config.spAcs = window.location.origin + window.MaxKB.prefix + '/api/saml2/sso';
            }
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
    label: (__VLS_ctx.$t('views.system.authentication.saml2.ldp')),
    prop: "config.idpMetaUrl",
}));
const __VLS_16 = __VLS_15({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.ldp')),
    prop: "config.idpMetaUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.form.config.idpMetaUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.ldpPlaceholder')),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.form.config.idpMetaUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.ldpPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
// @ts-ignore
[vLoading, loading, rules, form, form, $t, $t,];
var __VLS_17;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({}));
const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.form.config.wantAssertionsSigned),
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.form.config.wantAssertionsSigned),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_36 } = __VLS_34.slots;
(__VLS_ctx.$t('views.system.authentication.saml2.enableAuthnRequests'));
// @ts-ignore
[form, $t,];
var __VLS_34;
// @ts-ignore
[];
var __VLS_28;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({}));
const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.form.config.wantAuthnRequestsSigned),
}));
const __VLS_45 = __VLS_44({
    modelValue: (__VLS_ctx.form.config.wantAuthnRequestsSigned),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
(__VLS_ctx.$t('views.system.authentication.saml2.enableAssertions'));
// @ts-ignore
[form, $t,];
var __VLS_46;
// @ts-ignore
[];
var __VLS_40;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.privateKey')),
    prop: "config.privateKey",
}));
const __VLS_51 = __VLS_50({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.privateKey')),
    prop: "config.privateKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const { default: __VLS_54 } = __VLS_52.slots;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    modelValue: (__VLS_ctx.form.config.privateKey),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.privateKeyPlaceholder')),
}));
const __VLS_57 = __VLS_56({
    modelValue: (__VLS_ctx.form.config.privateKey),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.privateKeyPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
// @ts-ignore
[form, $t, $t,];
var __VLS_52;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.certificate')),
    prop: "config.certificate",
}));
const __VLS_62 = __VLS_61({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.certificate')),
    prop: "config.certificate",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const { default: __VLS_65 } = __VLS_63.slots;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    modelValue: (__VLS_ctx.form.config.certificate),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.certificatePlaceholder')),
}));
const __VLS_68 = __VLS_67({
    modelValue: (__VLS_ctx.form.config.certificate),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.certificatePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
// @ts-ignore
[form, $t, $t,];
var __VLS_63;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.filedMapping')),
    prop: "config.mapping",
}));
const __VLS_73 = __VLS_72({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.filedMapping')),
    prop: "config.mapping",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    modelValue: (__VLS_ctx.form.config.mapping),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.filedMappingPlaceholder')),
}));
const __VLS_79 = __VLS_78({
    modelValue: (__VLS_ctx.form.config.mapping),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.filedMappingPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
// @ts-ignore
[form, $t, $t,];
var __VLS_74;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.spEntityId')),
    prop: "config.spEntityId",
}));
const __VLS_84 = __VLS_83({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.spEntityId')),
    prop: "config.spEntityId",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
const { default: __VLS_87 } = __VLS_85.slots;
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    modelValue: (__VLS_ctx.form.config.spEntityId),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.spEntityIdPlaceholder')),
}));
const __VLS_90 = __VLS_89({
    modelValue: (__VLS_ctx.form.config.spEntityId),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.spEntityIdPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
// @ts-ignore
[form, $t, $t,];
var __VLS_85;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.spAcs')),
    prop: "config.spAcs",
}));
const __VLS_95 = __VLS_94({
    label: (__VLS_ctx.$t('views.system.authentication.saml2.spAcs')),
    prop: "config.spAcs",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const { default: __VLS_98 } = __VLS_96.slots;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.form.config.spAcs),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.spAcsPlaceholder')),
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.form.config.spAcs),
    placeholder: (__VLS_ctx.$t('views.system.authentication.saml2.spAcsPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
// @ts-ignore
[form, $t, $t,];
var __VLS_96;
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const { default: __VLS_109 } = __VLS_107.slots;
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    modelValue: (__VLS_ctx.form.is_active),
}));
const __VLS_112 = __VLS_111({
    modelValue: (__VLS_ctx.form.is_active),
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
const { default: __VLS_115 } = __VLS_113.slots;
(__VLS_ctx.$t('views.system.authentication.saml2.enableAuthentication'));
// @ts-ignore
[form, $t,];
var __VLS_113;
// @ts-ignore
[];
var __VLS_107;
// @ts-ignore
[];
var __VLS_9;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-12" },
});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.LOGIN_AUTH_EDIT], [], 'OR')) }, null, null);
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_118 = __VLS_117({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_121;
const __VLS_122 = {
    /** @type {typeof __VLS_121.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.submit(__VLS_ctx.authFormRef);
        // @ts-ignore
        [loading, vHasPermission, ComplexPermission, RoleConst, PermissionConst, submit, authFormRef,];
    },
};
const { default: __VLS_123 } = __VLS_119.slots;
(__VLS_ctx.$t('common.save'));
// @ts-ignore
[$t,];
var __VLS_119;
var __VLS_120;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_12 = __VLS_11;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
