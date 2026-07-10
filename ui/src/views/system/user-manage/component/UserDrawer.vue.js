/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import userManageApi from '@/api/system/user-manage';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import WorkspaceApi from '@/api/workspace/workspace';
import MemberFormContent from '@/views/system/role/component/MemberFormContent.vue';
import { AuthorizationEnum, RoleTypeEnum } from '@/enums/system';
import useStore from '@/stores';
import { hasPermission } from '@/utils/permission';
import { EditionConst } from '@/utils/permission/data.ts';
import JSEncrypt from "jsencrypt";
const { user } = useStore();
const props = defineProps({
    title: String,
});
const emit = defineEmits(['refresh']);
const userFormRef = ref();
const userForm = ref({
    username: '',
    email: '',
    password: '',
    phone: '',
    nick_name: '',
});
const list = ref([]);
const memberFormContentLoading = ref(false);
const formItemModel = ref([]);
const roleFormItem = ref([]);
const adminRoleList = ref([]);
const userRoleList = ref([]);
const workspaceFormItem = ref([]);
const isAdmin = computed(() => userForm.value['id'] === 'f0dd8f71-e4ee-11ee-8c84-a8a1595801ab');
const dialogVisible = ref(false);
const radioPermission = ref('NOT_AUTH');
const defaultPermission = ref('NOT_AUTH');
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
const showPermission = computed(() => {
    //Community version can show; other versions can show even if expired
    if (user.isCE() || user.isExpire()) {
        return true;
    }
    const hasUserRole = list.value.some((item) => userRoleList.value.includes(item.role_id));
    return (user.isEE() || user.isPE()) && hasUserRole;
});
function deleteButtonDisabled(element) {
    return isAdmin.value && ['ADMIN', 'WORKSPACE_MANAGE', 'USER'].includes(element.role_id);
}
async function getRoleFormItem() {
    try {
        const res = await WorkspaceApi.getWorkspaceRoleList(memberFormContentLoading);
        roleFormItem.value = [
            {
                path: 'role_id',
                label: t('views.role.member.role'),
                rules: [
                    {
                        required: true,
                        message: `${t('common.selectPlaceholder')}${t('views.role.member.role')}`,
                    },
                ],
                selectProps: {
                    options: res.data?.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })) || [],
                    placeholder: `${t('common.selectPlaceholder')}${t('views.role.member.role')}`,
                    multiple: false,
                },
            },
        ];
        adminRoleList.value = res.data.filter((item) => item.type === RoleTypeEnum.ADMIN);
        userRoleList.value = res.data
            .filter((item) => item.type === RoleTypeEnum.USER)
            .map((item) => item.id);
    }
    catch (e) {
        console.error(e);
    }
}
async function getWorkspaceFormItem() {
    try {
        const res = await WorkspaceApi.getWorkspaceList(memberFormContentLoading);
        workspaceFormItem.value = [
            {
                path: 'workspace_ids',
                label: t('views.role.member.workspace'),
                hidden: (e) => adminRoleList.value.find((item) => item.id === e.role_id),
                rules: [
                    {
                        validator: (rule, value, callback) => {
                            const match = rule.field?.match(/\[(\d+)\]/);
                            const isAdmin = adminRoleList.value.some((role) => role.id === list.value[parseInt(match?.[1] ?? '', 10)].role_id);
                            if (!isAdmin && (!value || value.length === 0)) {
                                callback(new Error(`${t('common.selectPlaceholder')}${t('views.role.member.workspace')}`));
                            }
                            else {
                                callback();
                            }
                        },
                        trigger: 'blur',
                    },
                ],
                selectProps: {
                    options: res.data?.map((item) => ({
                        label: item.name,
                        value: item.id,
                        disabledFunction: (e) => isAdmin.value &&
                            ['WORKSPACE_MANAGE', 'USER'].includes(e.role_id) &&
                            item.id === 'default',
                    })) || [],
                    placeholder: `${t('common.selectPlaceholder')}${t('views.role.member.workspace')}`,
                    clearableFunction: (e) => {
                        return !(isAdmin.value && ['WORKSPACE_MANAGE', 'USER'].includes(e.role_id));
                    },
                },
            },
        ];
    }
    catch (e) {
        console.error(e);
    }
}
onBeforeMount(async () => {
    if (user.isEE() || user.isPE()) {
        await getRoleFormItem();
        if (user.isEE()) {
            await getWorkspaceFormItem();
        }
        formItemModel.value = [...roleFormItem.value, ...workspaceFormItem.value];
    }
    list.value = [{ role_id: '', workspace_ids: [] }];
});
const rules = reactive({
    username: [
        {
            required: true,
            message: t('views.login.loginForm.username.requiredMessage'),
            trigger: 'blur',
        },
        {
            min: 4,
            max: 64,
            message: t('views.login.loginForm.username.lengthMessage'),
            trigger: 'blur',
        },
    ],
    nick_name: [
        {
            required: true,
            message: t('views.userManage.userForm.nick_name.placeholder'),
            trigger: 'blur',
        },
        {
            min: 1,
            max: 64,
            message: t('views.userManage.userForm.nick_name.lengthMessage'),
            trigger: 'blur',
        },
    ],
    email: [
        {
            required: true,
            message: t('views.login.loginForm.email.requiredMessage'),
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: t('views.login.loginForm.password.requiredMessage'),
            trigger: 'blur',
        },
        {
            min: 6,
            max: 20,
            message: t('views.login.loginForm.password.lengthMessage'),
            trigger: 'blur',
        },
    ],
    phone: [
        {
            pattern: /^1[3-9]\d{9}$/,
            message: t('views.userManage.userForm.phone.invalidMessage'),
            trigger: 'blur',
        },
    ],
});
const visible = ref(false);
const loading = ref(false);
const isEdit = ref(false);
watch(visible, (bool) => {
    if (!bool) {
        userForm.value = {
            username: '',
            email: '',
            password: '',
            phone: '',
            nick_name: '',
        };
        isEdit.value = false;
        list.value = [{ role_id: '', workspace_ids: [] }];
        userFormRef.value?.clearValidate();
    }
});
const open = (data) => {
    if (data) {
        userForm.value['id'] = data.id;
        userForm.value.username = data.username;
        userForm.value.email = data.email;
        userForm.value.password = data.password;
        userForm.value.phone = data.phone;
        userForm.value.nick_name = data.nick_name;
        list.value = data.role_setting?.map((item) => ({
            ...item,
            workspace_ids: item.workspace_ids.includes('None') ? [] : item.workspace_ids,
        }));
        isEdit.value = true;
    }
    else {
        userManageApi.getSystemDefaultPassword().then((res) => {
            userForm.value.password = res.data.password;
        });
    }
    if (memberFormContentRef.value) {
        memberFormContentRef.value.resetValidation();
    }
    visible.value = true;
};
const memberFormContentRef = ref();
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (memberFormContentRef.value) {
                await memberFormContentRef.value?.validate();
            }
            if (user.isPE() || user.isEE()) {
                list.value = list.value.map((item) => {
                    const isAdminRole = adminRoleList.value.find((item1) => item1.id === item.role_id);
                    // IfAdminRole, thenSettingsis ['None']
                    if (isAdminRole) {
                        return { ...item, workspace_ids: ['None'] };
                    }
                    // IfNormalUserAnd is PE Type, thenSettingsis ['default']
                    if (user.isPE()) {
                        return { ...item, workspace_ids: ['default'] };
                    }
                    // OtherKeep situation as-is
                    return item;
                });
            }
            const params = {
                ...userForm.value,
                role_setting: list.value,
            };
            if (isEdit.value) {
                userManageApi.putUserManage(userForm.value.id, params, loading).then((res) => {
                    return user.profile(loading).then(() => {
                        emit('refresh');
                        MsgSuccess(t('common.editSuccess'));
                        visible.value = false;
                    });
                });
            }
            else {
                params.defaultPermission = defaultPermission.value;
                const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
                const js = new JSEncryptCtor();
                js.setPublicKey(user.rsaKey);
                params.password = js.encrypt(params.password);
                params.encrypted = true;
                userManageApi.postUserManage(params, loading).then((res) => {
                    return user.profile(loading).then(() => {
                        emit('refresh');
                        MsgSuccess(t('common.createSuccess'));
                        visible.value = false;
                    });
                });
            }
        }
    });
};
const openDialog = () => {
    dialogVisible.value = true;
};
const closeDialog = () => {
    dialogVisible.value = false;
};
const submitDialog = () => {
    defaultPermission.value = radioPermission.value;
    closeDialog();
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: "600",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: "600",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.title);
    // @ts-ignore
    [visible, title,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16 mt-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
(__VLS_ctx.$t('common.info'));
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "userFormRef",
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "userFormRef",
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
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
    prop: (__VLS_ctx.isEdit ? '' : 'username'),
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}));
const __VLS_19 = __VLS_18({
    prop: (__VLS_ctx.isEdit ? '' : 'username'),
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.userForm.username),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.isEdit),
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.userForm.username),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.isEdit),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[$t, $t, $t, userForm, userForm, rules, isEdit, isEdit,];
var __VLS_20;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    prop: "nick_name",
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    prop: "nick_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.userForm.nick_name),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.nick_name.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.userForm.nick_name),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.nick_name.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, $t, userForm,];
var __VLS_31;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    prop: "email",
}));
const __VLS_41 = __VLS_40({
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    type: "email",
    modelValue: (__VLS_ctx.userForm.email),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.email.placeholder')),
}));
const __VLS_47 = __VLS_46({
    type: "email",
    modelValue: (__VLS_ctx.userForm.email),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.email.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
// @ts-ignore
[$t, $t, userForm,];
var __VLS_42;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
    prop: "phone",
}));
const __VLS_52 = __VLS_51({
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.userForm.phone),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.phone.placeholder')),
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.userForm.phone),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.phone.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
// @ts-ignore
[$t, $t, userForm,];
var __VLS_53;
if (!__VLS_ctx.isEdit) {
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        label: (__VLS_ctx.$t('views.userManage.defaultPassword')),
    }));
    const __VLS_63 = __VLS_62({
        label: (__VLS_ctx.$t('views.userManage.defaultPassword')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    const { default: __VLS_66 } = __VLS_64.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.userForm.password);
    // @ts-ignore
    [$t, userForm, isEdit,];
    var __VLS_64;
}
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
if (__VLS_ctx.user.isEE() || __VLS_ctx.user.isPE()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16 mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    (__VLS_ctx.$t('views.userManage.roleSetting'));
}
if (__VLS_ctx.user.isEE() || __VLS_ctx.user.isPE()) {
    const __VLS_67 = MemberFormContent;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ref: "memberFormContentRef",
        models: (__VLS_ctx.formItemModel),
        form: (__VLS_ctx.list),
        keepOneLine: true,
        addText: (__VLS_ctx.$t('views.userManage.addRole')),
        deleteButtonDisabled: (__VLS_ctx.deleteButtonDisabled),
    }));
    const __VLS_69 = __VLS_68({
        ref: "memberFormContentRef",
        models: (__VLS_ctx.formItemModel),
        form: (__VLS_ctx.list),
        keepOneLine: true,
        addText: (__VLS_ctx.$t('views.userManage.addRole')),
        deleteButtonDisabled: (__VLS_ctx.deleteButtonDisabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.memberFormContentLoading) }, null, null);
    var __VLS_72;
    var __VLS_70;
}
{
    const { footer: __VLS_74 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    if (!__VLS_ctx.isEdit && __VLS_ctx.showPermission) {
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            ...{ 'onClick': {} },
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_80;
        const __VLS_81 = {
            /** @type {typeof __VLS_80.click} */
            onClick: (__VLS_ctx.openDialog),
        };
        const { default: __VLS_82 } = __VLS_78.slots;
        (__VLS_ctx.$t('views.system.resourceAuthorization.setting.defaultPermission'));
        // @ts-ignore
        [$t, $t, $t, isEdit, user, user, user, user, formItemModel, list, deleteButtonDisabled, vLoading, memberFormContentLoading, showPermission, openDialog,];
        var __VLS_78;
        var __VLS_79;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        ...{ 'onClick': {} },
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_88;
    const __VLS_89 = {
        /** @type {typeof __VLS_88.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.visible = false;
            // @ts-ignore
            [visible,];
        },
    };
    const { default: __VLS_90 } = __VLS_86.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_86;
    var __VLS_87;
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_96;
    const __VLS_97 = {
        /** @type {typeof __VLS_96.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.userFormRef);
            // @ts-ignore
            [loading, submit, userFormRef,];
        },
    };
    const { default: __VLS_98 } = __VLS_94.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_94;
    var __VLS_95;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.defaultPermission')),
    destroyOnClose: true,
}));
const __VLS_101 = __VLS_100({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.defaultPermission')),
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
const __VLS_105 = {
    /** @type {typeof __VLS_104.close} */
    onClose: (__VLS_ctx.closeDialog),
};
const { default: __VLS_106 } = __VLS_102.slots;
if (__VLS_ctx.user.isEE()) {
    {
        const { header: __VLS_107 } = __VLS_102.slots;
        const [{ titleId, titleClass }] = __VLS_vSlot(__VLS_107);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "dialog-header" },
        });
        /** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
            id: (titleId),
            ...{ class: (titleClass) },
            ...{ style: {} },
        });
        (__VLS_ctx.$t('views.system.resourceAuthorization.setting.defaultPermission'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "dialog-subtitle" },
        });
        /** @type {__VLS_StyleScopedClasses['dialog-subtitle']} */ ;
        (__VLS_ctx.$t('views.system.resourceAuthorization.setting.defaultPermissionTip'));
        // @ts-ignore
        [$t, $t, $t, user, dialogVisible, closeDialog,];
    }
}
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.radioPermission),
    ...{ class: "radio-block" },
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.radioPermission),
    ...{ class: "radio-block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
/** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
const { default: __VLS_113 } = __VLS_111.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.permissionOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        value: (item.value),
        ...{ class: "mr-16" },
    }));
    const __VLS_116 = __VLS_115({
        value: (item.value),
        ...{ class: "mr-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    const { default: __VLS_119 } = __VLS_117.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-text-primary lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (item.label);
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        ...{ class: "color-secondary lighter" },
    }));
    const __VLS_122 = __VLS_121({
        ...{ class: "color-secondary lighter" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    const { default: __VLS_125 } = __VLS_123.slots;
    (item.desc);
    // @ts-ignore
    [radioPermission, permissionOptions,];
    var __VLS_123;
    // @ts-ignore
    [];
    var __VLS_117;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_111;
{
    const { footer: __VLS_126 } = __VLS_102.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    let __VLS_127;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
        ...{ 'onClick': {} },
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_132;
    const __VLS_133 = {
        /** @type {typeof __VLS_132.click} */
        onClick: (__VLS_ctx.closeDialog),
    };
    const { default: __VLS_134 } = __VLS_130.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, closeDialog,];
    var __VLS_130;
    var __VLS_131;
    let __VLS_135;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_137 = __VLS_136({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    let __VLS_140;
    const __VLS_141 = {
        /** @type {typeof __VLS_140.click} */
        onClick: (__VLS_ctx.submitDialog),
    };
    const { default: __VLS_142 } = __VLS_138.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, submitDialog,];
    var __VLS_138;
    var __VLS_139;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_102;
var __VLS_103;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_73 = __VLS_72;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        title: String,
    },
});
export default {};
