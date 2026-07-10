/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, ref } from 'vue';
import { ComplexPermission } from '@/utils/permission/type';
import { EditionConst, PermissionConst, RoleConst } from '@/utils/permission/data';
import { t } from '@/locales';
import authApi from '@/api/system-settings/auth-setting.ts';
import { MsgSuccess } from '@/utils/message.ts';
import WorkspaceApi from '@/api/workspace/workspace.ts';
import useStore from '@/stores';
import { AuthorizationEnum } from '@/enums/system.ts';
import { hasPermission } from '@/utils/permission';
const loginMethods = ref([]);
const systemLoginMethods = ref([]);
const loading = ref(false);
// Explicitly allow null, avoid when unmountedAccessError
const authFormRef = ref(null);
const form = ref({
    default_value: 'LOCAL',
    max_attempts: 1,
    failed_attempts: 5,
    lock_time: 10,
    role_id: 'USER',
    workspace_id: 'default',
    permission: 'NOT_AUTH',
    login_methods: ['LOCAL'],
});
const normalizeInputValue = (val) => {
    // If input is empty or cannot be transformed to a valid number, default to 1
    let normalizedVal = typeof val === 'number' ? Math.trunc(val) : NaN;
    if (!Number.isFinite(normalizedVal)) {
        normalizedVal = 1;
    }
    if (normalizedVal === 0) {
        normalizedVal = 1;
    }
    else if (normalizedVal < -1) {
        normalizedVal = -1;
    }
    return normalizedVal;
};
const onFailedAttemptsChange = (val) => {
    form.value.failed_attempts = normalizeInputValue(val);
};
const onMaxAttemptsChange = (val) => {
    form.value.max_attempts = normalizeInputValue(val);
};
// Submit: use authFormRef.value.validate() promise style, and ensure loading is restored in finally
const submit = async () => {
    const formRef = authFormRef.value;
    if (!formRef)
        return;
    try {
        await formRef.validate();
        loading.value = true;
        const params = {
            default_value: form.value.default_value,
            max_attempts: form.value.max_attempts,
            failed_attempts: form.value.failed_attempts,
            lock_time: form.value.lock_time,
            role_id: form.value.role_id,
            workspace_id: form.value.workspace_id,
            permission: form.value.permission,
            login_methods: form.value.login_methods,
        };
        await authApi.putLoginSetting(params);
        MsgSuccess(t('common.saveSuccess'));
    }
    catch (err) {
        // VerifyorRequestFailure: On-demandProcess, avoid uncapturedException
        // console.error(err);
    }
    finally {
        loading.value = false;
    }
};
const roleOptions = ref([]);
const workspaceOptions = ref([]);
const { user } = useStore();
const selectedRoleType = ref(''); // StorageSelectRoleType，Used forControl workspace Show
const showWorkspaceSelector = computed(() => selectedRoleType.value !== 'ADMIN');
const showPermissionSelector = computed(() => selectedRoleType.value === 'USER');
const permissionOptions = computed(() => {
    const baseOptions = [
        {
            label: t('views.system.resourceAuthorization.setting.check'),
            value: AuthorizationEnum.VIEW,
            desc: t('views.system.resourceAuthorization.setting.checkDesc'),
        },
        {
            label: t('views.system.resourceAuthorization.setting.management'),
            value: AuthorizationEnum.MANAGE,
            desc: t('views.system.resourceAuthorization.setting.managementDesc'),
        },
        {
            label: t('views.system.resourceAuthorization.setting.notAuthorized'),
            value: AuthorizationEnum.NOT_AUTH,
            desc: '',
        },
    ];
    if (hasPermission([EditionConst.IS_EE, EditionConst.IS_PE], 'OR')) {
        baseOptions.splice(2, 0, {
            label: t('views.system.resourceAuthorization.setting.role'),
            value: AuthorizationEnum.ROLE,
            desc: t('views.system.resourceAuthorization.setting.roleDesc'),
        });
    }
    return baseOptions;
});
// When role changes, update selectedRoleType
const handleRoleChange = (roleId) => {
    const selectedRole = roleOptions.value.find((role) => role.id === roleId);
    selectedRoleType.value = selectedRole?.type || '';
    if (form.value.workspace_id === 'None' && showWorkspaceSelector) {
        form.value.workspace_id = 'default';
    }
};
const handleLoginMethodsChange = (values) => {
    // Based onSelected in LoginMethodFilter systemLoginMethods
    loginMethods.value = systemLoginMethods.value.filter(method => values.includes(method.value));
    // If current default login method is not in selection range, reset to the selected method
    if (values.length > 0 && !values.includes(form.value.default_value)) {
        form.value.default_value = values[0];
    }
    // IfNoneAny selected in LoginMethod, clearDefaultLoginMethod
    if (values.length === 0) {
        form.value.default_value = '';
        // Re-TriggerVerify
        setTimeout(() => {
            authFormRef.value?.validateField('login_methods');
        }, 0);
    }
};
onMounted(async () => {
    loading.value = true;
    try {
        const isEE = typeof user?.isEE === 'function' ? user.isEE() : false;
        // ParallelRequest：RoleList + LoginSettings; if EE SimultaneouslyRequest workspace List
        const roleP = WorkspaceApi.getWorkspaceRoleList()
            .then((r) => r)
            .catch(() => ({ data: [] }));
        const settingP = authApi
            .getLoginSetting()
            .then((r) => r)
            .catch(() => ({ data: {} }));
        const tasks = [roleP, settingP];
        if (isEE) {
            tasks.push(WorkspaceApi.getWorkspaceList()
                .then((r) => r)
                .catch(() => ({ data: [] })));
        }
        const results = await Promise.all(tasks);
        const roleRes = results[0] ?? { data: [] };
        const settingRes = results[1] ?? { data: {} };
        const workspaceRes = isEE ? (results[2] ?? { data: [] }) : null;
        // ProcessRoleList(Early echo)
        const rolesData = Array.isArray(roleRes?.data) ? roleRes.data : [];
        roleOptions.value = rolesData.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
        }));
        // Process settings (merge default values, avoid accessing undefined)
        const data = settingRes?.data ?? {};
        form.value = {
            ...form.value,
            ...data,
            failed_attempts: data.failed_attempts ?? form.value.failed_attempts ?? 5,
            lock_time: data.lock_time ?? form.value.lock_time ?? 10,
            role_id: data.role_id ?? form.value.role_id ?? 'USER',
            workspace_id: data.workspace_id ?? form.value.workspace_id ?? 'default',
            permission: data.permission ?? form.value.permission ?? 'NOT_AUTH',
        };
        loginMethods.value = Array.isArray(data.auth_types) ? data.auth_types : [];
        systemLoginMethods.value = Array.isArray(data.system_options) ? data.system_options : [];
        // Process workspace List（IfNeeds）
        if (isEE && workspaceRes) {
            const wks = Array.isArray(workspaceRes.data) ? workspaceRes.data : [];
            workspaceOptions.value = wks.map((item) => ({ id: item.id, name: item.name }));
        }
        // Initialize selectedRoleType(Based onCurrentEchoed role_id With existingLoad roleOptions）
        const initRole = roleOptions.value.find((r) => r.id === form.value.role_id);
        selectedRoleType.value = initRole?.type || '';
    }
    catch (e) {
        // overall error, MaintainDefaultEcho
        // console.error(e);
    }
    finally {
        loading.value = false;
    }
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
    ...{ 'onSubmit': {} },
    ref: "authFormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_8 = __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "authFormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.submit} */
    onSubmit: () => { },
};
var __VLS_13;
const { default: __VLS_15 } = __VLS_9.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.$t('views.system.login_method')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
            trigger: 'change',
        },
    ]),
    prop: "login_methods",
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.$t('views.system.login_method')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
            trigger: 'change',
        },
    ]),
    prop: "login_methods",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
elCheckboxGroup;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.login_methods),
}));
const __VLS_24 = __VLS_23({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.login_methods),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_27;
const __VLS_28 = {
    /** @type {typeof __VLS_27.change} */
    onChange: (__VLS_ctx.handleLoginMethodsChange),
};
const { default: __VLS_29 } = __VLS_25.slots;
for (const [t] of __VLS_vFor((__VLS_ctx.systemLoginMethods))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (t.value),
    });
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        label: (t.label),
        value: (t.value),
    }));
    const __VLS_32 = __VLS_31({
        label: (t.label),
        value: (t.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    // @ts-ignore
    [vLoading, loading, form, form, $t, $t, handleLoginMethodsChange, systemLoginMethods,];
}
// @ts-ignore
[];
var __VLS_25;
var __VLS_26;
// @ts-ignore
[];
var __VLS_19;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    label: (__VLS_ctx.$t('views.system.default_login')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
            trigger: 'change',
        },
    ]),
    prop: "default_value",
}));
const __VLS_37 = __VLS_36({
    label: (__VLS_ctx.$t('views.system.default_login')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
            trigger: 'change',
        },
    ]),
    prop: "default_value",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const { default: __VLS_40 } = __VLS_38.slots;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    modelValue: (__VLS_ctx.form.default_value),
    ...{ class: "radio-group" },
    ...{ style: {} },
}));
const __VLS_43 = __VLS_42({
    modelValue: (__VLS_ctx.form.default_value),
    ...{ class: "radio-group" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
/** @type {__VLS_StyleScopedClasses['radio-group']} */ ;
const { default: __VLS_46 } = __VLS_44.slots;
for (const [method] of __VLS_vFor((__VLS_ctx.loginMethods))) {
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        key: (method.value),
        label: (method.value),
        ...{ class: "radio-item" },
    }));
    const __VLS_49 = __VLS_48({
        key: (method.value),
        label: (method.value),
        ...{ class: "radio-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    /** @type {__VLS_StyleScopedClasses['radio-item']} */ ;
    const { default: __VLS_52 } = __VLS_50.slots;
    (method.label);
    // @ts-ignore
    [form, $t, $t, loginMethods,];
    var __VLS_50;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_44;
// @ts-ignore
[];
var __VLS_38;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    label: (__VLS_ctx.$t('views.system.display_code')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.displayCodeRequired'),
            trigger: 'change',
        },
    ]),
    prop: "max_attempts",
}));
const __VLS_55 = __VLS_54({
    label: (__VLS_ctx.$t('views.system.display_code')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.displayCodeRequired'),
            trigger: 'change',
        },
    ]),
    prop: "max_attempts",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_58 } = __VLS_56.slots;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    gutter: (16),
    ...{ style: {} },
}));
const __VLS_61 = __VLS_60({
    gutter: (16),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    span: (24),
}));
const __VLS_67 = __VLS_66({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ style: {} },
});
(__VLS_ctx.$t('views.system.loginFailed'));
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    ...{ style: {} },
    modelValue: (__VLS_ctx.form.max_attempts),
    min: (-1),
    max: (10),
    step: (1),
    controlsPosition: "right",
}));
const __VLS_73 = __VLS_72({
    ...{ style: {} },
    modelValue: (__VLS_ctx.form.max_attempts),
    min: (-1),
    max: (10),
    step: (1),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-8" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
(__VLS_ctx.$t('views.system.loginFailedMessage'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-8 font-small" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['font-small']} */ ;
(__VLS_ctx.$t('views.system.display_codeTip'));
// @ts-ignore
[form, $t, $t, $t, $t, $t,];
var __VLS_68;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    span: (24),
    ...{ style: {} },
}));
const __VLS_78 = __VLS_77({
    span: (24),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const { default: __VLS_81 } = __VLS_79.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ style: {} },
});
(__VLS_ctx.$t('views.system.loginFailed'));
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    ...{ 'onChange': {} },
    ...{ style: {} },
    modelValue: (__VLS_ctx.form.failed_attempts),
    min: (-1),
    max: (10),
    step: (1),
    controlsPosition: "right",
}));
const __VLS_84 = __VLS_83({
    ...{ 'onChange': {} },
    ...{ style: {} },
    modelValue: (__VLS_ctx.form.failed_attempts),
    min: (-1),
    max: (10),
    step: (1),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
const __VLS_88 = {
    /** @type {typeof __VLS_87.change} */
    onChange: (__VLS_ctx.onFailedAttemptsChange),
};
var __VLS_85;
var __VLS_86;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ style: {} },
});
(__VLS_ctx.$t('views.system.failedTip'));
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    ...{ style: {} },
    modelValue: (__VLS_ctx.form.lock_time),
    min: (1),
    step: (1),
    controlsPosition: "right",
}));
const __VLS_91 = __VLS_90({
    ...{ style: {} },
    modelValue: (__VLS_ctx.form.lock_time),
    min: (1),
    step: (1),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ style: {} },
});
(__VLS_ctx.$t('views.system.minute'));
// @ts-ignore
[form, form, $t, $t, $t, onFailedAttemptsChange,];
var __VLS_79;
// @ts-ignore
[];
var __VLS_62;
// @ts-ignore
[];
var __VLS_56;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    label: (__VLS_ctx.$t('views.system.third_party_user_default_role')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.system.thirdPartyUserDefaultRoleRequired'),
            trigger: 'change',
        },
    ]),
}));
const __VLS_96 = __VLS_95({
    label: (__VLS_ctx.$t('views.system.third_party_user_default_role')),
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('views.system.thirdPartyUserDefaultRoleRequired'),
            trigger: 'change',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const { default: __VLS_99 } = __VLS_97.slots;
let __VLS_100;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    gutter: (16),
    ...{ style: {} },
}));
const __VLS_102 = __VLS_101({
    gutter: (16),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const { default: __VLS_105 } = __VLS_103.slots;
let __VLS_106;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
    span: (24),
}));
const __VLS_108 = __VLS_107({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
const { default: __VLS_111 } = __VLS_109.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ style: {} },
    ...{ class: "text-right mr-8" },
});
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
(__VLS_ctx.$t('views.role.member.role'));
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    ...{ 'onChange': {} },
    filterable: true,
    clearable: true,
    modelValue: (__VLS_ctx.form.role_id),
    placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.role.member.role')}`),
    ...{ class: "w-240" },
}));
const __VLS_114 = __VLS_113({
    ...{ 'onChange': {} },
    filterable: true,
    clearable: true,
    modelValue: (__VLS_ctx.form.role_id),
    placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.role.member.role')}`),
    ...{ class: "w-240" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = {
    /** @type {typeof __VLS_117.change} */
    onChange: (__VLS_ctx.handleRoleChange),
};
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
const { default: __VLS_119 } = __VLS_115.slots;
for (const [role] of __VLS_vFor((__VLS_ctx.roleOptions))) {
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        key: (role.id),
        label: (role.name),
        value: (role.id),
    }));
    const __VLS_122 = __VLS_121({
        key: (role.id),
        label: (role.name),
        value: (role.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    // @ts-ignore
    [form, $t, $t, $t, $t, $t, handleRoleChange, roleOptions,];
}
// @ts-ignore
[];
var __VLS_115;
var __VLS_116;
// @ts-ignore
[];
var __VLS_109;
if (__VLS_ctx.user.isEE() && __VLS_ctx.showWorkspaceSelector) {
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        span: (24),
        ...{ class: "mt-16" },
    }));
    const __VLS_127 = __VLS_126({
        span: (24),
        ...{ class: "mt-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_130 } = __VLS_128.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
        ...{ class: "text-right mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.role.member.workspace'));
    let __VLS_131;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
        filterable: true,
        clearable: true,
        modelValue: (__VLS_ctx.form.workspace_id),
        placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.role.member.workspace')}`),
        ...{ class: "w-240" },
    }));
    const __VLS_133 = __VLS_132({
        filterable: true,
        clearable: true,
        modelValue: (__VLS_ctx.form.workspace_id),
        placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.role.member.workspace')}`),
        ...{ class: "w-240" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    /** @type {__VLS_StyleScopedClasses['w-240']} */ ;
    const { default: __VLS_136 } = __VLS_134.slots;
    for (const [workspace] of __VLS_vFor((__VLS_ctx.workspaceOptions))) {
        let __VLS_137;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
            key: (workspace.id),
            label: (workspace.name),
            value: (workspace.id),
        }));
        const __VLS_139 = __VLS_138({
            key: (workspace.id),
            label: (workspace.name),
            value: (workspace.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        // @ts-ignore
        [form, $t, $t, $t, user, showWorkspaceSelector, workspaceOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_134;
    // @ts-ignore
    [];
    var __VLS_128;
}
if ((__VLS_ctx.user.isEE() || __VLS_ctx.user.isPE()) && __VLS_ctx.showPermissionSelector) {
    let __VLS_142;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
        span: (24),
        ...{ class: "mt-16" },
    }));
    const __VLS_144 = __VLS_143({
        span: (24),
        ...{ class: "mt-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_147 } = __VLS_145.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
        ...{ class: "text-right mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        filterable: true,
        clearable: true,
        modelValue: (__VLS_ctx.form.permission),
        placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.system.resourceAuthorization.title')}`),
        ...{ class: "w-240" },
    }));
    const __VLS_150 = __VLS_149({
        filterable: true,
        clearable: true,
        modelValue: (__VLS_ctx.form.permission),
        placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.system.resourceAuthorization.title')}`),
        ...{ class: "w-240" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    /** @type {__VLS_StyleScopedClasses['w-240']} */ ;
    const { default: __VLS_153 } = __VLS_151.slots;
    for (const [permission] of __VLS_vFor((__VLS_ctx.permissionOptions))) {
        let __VLS_154;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
            key: (permission.value),
            label: (permission.label),
            value: (permission.value),
        }));
        const __VLS_156 = __VLS_155({
            key: (permission.value),
            label: (permission.label),
            value: (permission.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_155));
        // @ts-ignore
        [form, $t, $t, $t, user, user, showPermissionSelector, permissionOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_151;
    // @ts-ignore
    [];
    var __VLS_145;
}
// @ts-ignore
[];
var __VLS_103;
// @ts-ignore
[];
var __VLS_97;
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-12" },
});
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.LOGIN_AUTH_EDIT], [], 'OR')) }, null, null);
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_161 = __VLS_160({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
let __VLS_164;
const __VLS_165 = {
    /** @type {typeof __VLS_164.click} */
    onClick: (__VLS_ctx.submit),
};
const { default: __VLS_166 } = __VLS_162.slots;
(__VLS_ctx.$t('common.save'));
// @ts-ignore
[loading, $t, vHasPermission, ComplexPermission, RoleConst, PermissionConst, submit,];
var __VLS_162;
var __VLS_163;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
