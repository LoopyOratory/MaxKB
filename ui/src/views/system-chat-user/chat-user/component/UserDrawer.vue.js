/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch } from 'vue';
import userManageApi from '@/api/system/user-manage';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { copyClick } from '@/utils/clipboard';
import { loadPermissionApi } from "@/utils/dynamics-api/permission-api.ts";
import JSEncrypt from "jsencrypt";
import useStore from "@/stores";
const { user } = useStore();
const props = defineProps();
const emit = defineEmits(['refresh']);
const userFormRef = ref();
const userForm = ref({
    username: '',
    email: '',
    password: '',
    phone: '',
    nick_name: '',
    user_group_ids: []
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
    phone: [
        {
            pattern: /^1[3-9]\d{9}$/,
            message: t('views.userManage.userForm.phone.invalidMessage'),
            trigger: 'blur',
        },
    ],
    user_group_ids: [
        {
            type: 'array',
            required: true,
            message: t('views.chatUser.group.requiredMessage'),
            trigger: 'change',
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
            user_group_ids: []
        };
        isEdit.value = false;
        userFormRef.value?.clearValidate();
    }
});
const open = (data) => {
    if (data) {
        userForm.value['id'] = data.id;
        userForm.value.username = data.username;
        userForm.value.email = data.email;
        userForm.value.phone = data.phone;
        userForm.value.nick_name = data.nick_name;
        userForm.value.user_group_ids = data.user_group_ids;
        isEdit.value = true;
    }
    else {
        userManageApi.getSystemDefaultPassword().then((res) => {
            userForm.value.password = res.data.password;
        });
    }
    visible.value = true;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (isEdit.value) {
                loadPermissionApi('chatUser').putUserManage(userForm.value.id, userForm.value, loading).then(() => {
                    emit('refresh');
                    MsgSuccess(t('common.editSuccess'));
                    visible.value = false;
                });
            }
            else {
                const params = {
                    ...userForm.value,
                };
                const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
                const js = new JSEncryptCtor();
                js.setPublicKey(user.rsaKey);
                params.password = js.encrypt(userForm.value.password);
                params.encrypted = true;
                loadPermissionApi('chatUser').postUserManage(params, loading).then(() => {
                    emit('refresh');
                    MsgSuccess(t('common.createSuccess'));
                    visible.value = false;
                });
            }
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: "60%",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: "60%",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (props.title);
    // @ts-ignore
    [visible,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16 mt-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
(__VLS_ctx.$t('common.info'));
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "userFormRef",
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onSubmit': {} },
    ref: "userFormRef",
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
const __VLS_14 = {
    /** @type {typeof __VLS_13.submit} */
    onSubmit: () => { },
};
var __VLS_15;
const { default: __VLS_17 } = __VLS_11.slots;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    prop: (__VLS_ctx.isEdit ? '' : 'username'),
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}));
const __VLS_20 = __VLS_19({
    prop: (__VLS_ctx.isEdit ? '' : 'username'),
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.userForm.username),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.isEdit),
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.userForm.username),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.isEdit),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
// @ts-ignore
[$t, $t, $t, userForm, userForm, rules, isEdit, isEdit,];
var __VLS_21;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
}));
const __VLS_31 = __VLS_30({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.userForm.nick_name),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.nick_name.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.userForm.nick_name),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.nick_name.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
// @ts-ignore
[$t, $t, userForm,];
var __VLS_32;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    prop: "email",
}));
const __VLS_42 = __VLS_41({
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    type: "email",
    modelValue: (__VLS_ctx.userForm.email),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.email.placeholder')),
}));
const __VLS_48 = __VLS_47({
    type: "email",
    modelValue: (__VLS_ctx.userForm.email),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.email.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
// @ts-ignore
[$t, $t, userForm,];
var __VLS_43;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
    prop: "phone",
}));
const __VLS_53 = __VLS_52({
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    modelValue: (__VLS_ctx.userForm.phone),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.phone.placeholder')),
}));
const __VLS_59 = __VLS_58({
    modelValue: (__VLS_ctx.userForm.phone),
    placeholder: (__VLS_ctx.$t('views.userManage.userForm.phone.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
// @ts-ignore
[$t, $t, userForm,];
var __VLS_54;
if (!__VLS_ctx.isEdit) {
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        label: (__VLS_ctx.$t('views.userManage.defaultPassword')),
    }));
    const __VLS_64 = __VLS_63({
        label: (__VLS_ctx.$t('views.userManage.defaultPassword')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_67 } = __VLS_65.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.userForm.password);
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_73;
    const __VLS_74 = {
        /** @type {typeof __VLS_73.click} */
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.isEdit))
                throw 0;
            return __VLS_ctx.copyClick(__VLS_ctx.userForm.password);
            // @ts-ignore
            [$t, userForm, userForm, isEdit, copyClick,];
        },
    };
    const { default: __VLS_75 } = __VLS_71.slots;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        iconName: "app-copy",
    }));
    const __VLS_78 = __VLS_77({
        iconName: "app-copy",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    // @ts-ignore
    [];
    var __VLS_71;
    var __VLS_72;
    // @ts-ignore
    [];
    var __VLS_65;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16 mt-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
(__VLS_ctx.$t('views.chatUser.group.title'));
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    label: (__VLS_ctx.$t('views.chatUser.group.title')),
    prop: "user_group_ids",
}));
const __VLS_83 = __VLS_82({
    label: (__VLS_ctx.$t('views.chatUser.group.title')),
    prop: "user_group_ids",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
const { default: __VLS_86 } = __VLS_84.slots;
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    modelValue: (__VLS_ctx.userForm.user_group_ids),
    multiple: true,
    filterable: true,
    placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.chatUser.group.title')}`),
    loading: (props.optionLoading),
}));
const __VLS_89 = __VLS_88({
    modelValue: (__VLS_ctx.userForm.user_group_ids),
    multiple: true,
    filterable: true,
    placeholder: (`${__VLS_ctx.$t('common.selectPlaceholder')}${__VLS_ctx.$t('views.chatUser.group.title')}`),
    loading: (props.optionLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_92 } = __VLS_90.slots;
for (const [item] of __VLS_vFor((props.chatGroupList))) {
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_95 = __VLS_94({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    // @ts-ignore
    [$t, $t, $t, $t, userForm,];
}
// @ts-ignore
[];
var __VLS_90;
// @ts-ignore
[];
var __VLS_84;
// @ts-ignore
[];
var __VLS_11;
var __VLS_12;
{
    const { footer: __VLS_98 } = __VLS_3.slots;
    let __VLS_99;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        ...{ 'onClick': {} },
    }));
    const __VLS_101 = __VLS_100({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_104;
    const __VLS_105 = {
        /** @type {typeof __VLS_104.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.visible = false;
            // @ts-ignore
            [visible,];
        },
    };
    const { default: __VLS_106 } = __VLS_102.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_102;
    var __VLS_103;
    let __VLS_107;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_109 = __VLS_108({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    let __VLS_112;
    const __VLS_113 = {
        /** @type {typeof __VLS_112.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.userFormRef);
            // @ts-ignore
            [loading, submit, userFormRef,];
        },
    };
    const { default: __VLS_114 } = __VLS_110.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_110;
    var __VLS_111;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_16 = __VLS_15;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
