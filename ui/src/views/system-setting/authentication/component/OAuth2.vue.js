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
    auth_type: 'OAuth2',
    config: {
        authEndpoint: '',
        tokenEndpoint: '',
        userInfoEndpoint: '',
        scope: '',
        clientId: '',
        clientSecret: '',
        redirectUrl: '',
        fieldMapping: ''
    },
    is_active: true
});
const authFormRef = ref();
const loading = ref(false);
const rules = reactive({
    'config.authEndpoint': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.authEndpointPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.tokenEndpoint': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.tokenEndpointPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.userInfoEndpoint': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.userInfoEndpointPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.scope': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.scopePlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.clientId': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.clientIdPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.clientSecret': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.clientSecretPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.redirectUrl': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.redirectUrlPlaceholder'),
            trigger: 'blur'
        }
    ],
    'config.fieldMapping': [
        {
            required: true,
            message: t('views.system.authentication.oauth2.filedMappingPlaceholder'),
            trigger: 'blur'
        }
    ]
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
        }
        if (!form.value.config.redirectUrl) {
            form.value.config.redirectUrl = window.location.origin + window.MaxKB.prefix + '/api/oauth2';
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
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.authEndpoint')),
    prop: "config.authEndpoint",
}));
const __VLS_16 = __VLS_15({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.authEndpoint')),
    prop: "config.authEndpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.form.config.authEndpoint),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.authEndpointPlaceholder')),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.form.config.authEndpoint),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.authEndpointPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
// @ts-ignore
[vLoading, loading, rules, form, form, $t, $t,];
var __VLS_17;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.tokenEndpoint')),
    prop: "config.tokenEndpoint",
}));
const __VLS_27 = __VLS_26({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.tokenEndpoint')),
    prop: "config.tokenEndpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.form.config.tokenEndpoint),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.tokenEndpointPlaceholder')),
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.form.config.tokenEndpoint),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.tokenEndpointPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
// @ts-ignore
[form, $t, $t,];
var __VLS_28;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.userInfoEndpoint')),
    prop: "config.userInfoEndpoint",
}));
const __VLS_38 = __VLS_37({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.userInfoEndpoint')),
    prop: "config.userInfoEndpoint",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.form.config.userInfoEndpoint),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.userInfoEndpointPlaceholder')),
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.form.config.userInfoEndpoint),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.userInfoEndpointPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
// @ts-ignore
[form, $t, $t,];
var __VLS_39;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.scope')),
    prop: "config.scope",
}));
const __VLS_49 = __VLS_48({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.scope')),
    prop: "config.scope",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.form.config.scope),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.scopePlaceholder')),
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.form.config.scope),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.scopePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
// @ts-ignore
[form, $t, $t,];
var __VLS_50;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.clientId')),
    prop: "config.clientId",
}));
const __VLS_60 = __VLS_59({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.clientId')),
    prop: "config.clientId",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.form.config.clientId),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.clientIdPlaceholder')),
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.form.config.clientId),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.clientIdPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
// @ts-ignore
[form, $t, $t,];
var __VLS_61;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.clientSecret')),
    prop: "config.clientSecret",
}));
const __VLS_71 = __VLS_70({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.clientSecret')),
    prop: "config.clientSecret",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const { default: __VLS_74 } = __VLS_72.slots;
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    modelValue: (__VLS_ctx.form.config.clientSecret),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.clientSecretPlaceholder')),
    showPassword: true,
}));
const __VLS_77 = __VLS_76({
    modelValue: (__VLS_ctx.form.config.clientSecret),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.clientSecretPlaceholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
// @ts-ignore
[form, $t, $t,];
var __VLS_72;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.filedMapping')),
    prop: "config.fieldMapping",
}));
const __VLS_82 = __VLS_81({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.filedMapping')),
    prop: "config.fieldMapping",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.form.config.fieldMapping),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.filedMappingPlaceholder')),
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.form.config.fieldMapping),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.filedMappingPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
// @ts-ignore
[form, $t, $t,];
var __VLS_83;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.redirectUrl')),
    prop: "config.redirectUrl",
}));
const __VLS_93 = __VLS_92({
    label: (__VLS_ctx.$t('views.system.authentication.oauth2.redirectUrl')),
    prop: "config.redirectUrl",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
const { default: __VLS_96 } = __VLS_94.slots;
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    modelValue: (__VLS_ctx.form.config.redirectUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.redirectUrlPlaceholder')),
}));
const __VLS_99 = __VLS_98({
    modelValue: (__VLS_ctx.form.config.redirectUrl),
    placeholder: (__VLS_ctx.$t('views.system.authentication.oauth2.redirectUrlPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
// @ts-ignore
[form, $t, $t,];
var __VLS_94;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({}));
const __VLS_104 = __VLS_103({}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const { default: __VLS_107 } = __VLS_105.slots;
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.form.is_active),
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.form.is_active),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const { default: __VLS_113 } = __VLS_111.slots;
(__VLS_ctx.$t('views.system.authentication.oauth2.enableAuthentication'));
// @ts-ignore
[form, $t,];
var __VLS_111;
// @ts-ignore
[];
var __VLS_105;
// @ts-ignore
[];
var __VLS_9;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_116 = __VLS_115({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
let __VLS_119;
const __VLS_120 = {
    /** @type {typeof __VLS_119.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.submit(__VLS_ctx.authFormRef);
        // @ts-ignore
        [loading, submit, authFormRef,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.LOGIN_AUTH_EDIT], [], 'OR')) }, null, null);
const { default: __VLS_121 } = __VLS_117.slots;
(__VLS_ctx.$t('common.save'));
// @ts-ignore
[$t, vHasPermission, ComplexPermission, RoleConst, PermissionConst,];
var __VLS_117;
var __VLS_118;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_12 = __VLS_11;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
