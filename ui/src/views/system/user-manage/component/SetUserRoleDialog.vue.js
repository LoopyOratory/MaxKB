/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onBeforeMount } from 'vue';
import { t } from '@/locales';
const memberFormContentLoading = ref(false);
import userManageApi from '@/api/system/user-manage';
import MemberFormContent from '@/views/system/role/component/MemberFormContent.vue';
import WorkspaceApi from '@/api/workspace/workspace.ts';
import useStore from '@/stores';
import { RoleTypeEnum } from '@/enums/system.ts';
import { MsgSuccess } from '@/utils/message.ts';
const list = ref([]);
const formItemModel = ref([]);
const { user, common } = useStore();
const workspaceFormItem = ref([]);
const roleFormItem = ref([]);
const emit = defineEmits();
const dialogVisible = ref(false);
const defaultForm = {
    role_ids: [],
    is_append: true,
    ids: [],
};
const form = ref({
    ...defaultForm,
});
function open(ids) {
    form.value = { ...defaultForm, ids };
    list.value = [{ role_id: '', workspace_ids: [] }];
    if (memberFormContentRef.value) {
        memberFormContentRef.value.resetValidation();
    }
    dialogVisible.value = true;
}
const formRef = ref();
const adminRoleList = ref([]);
const rules = reactive({
    is_append: [{ required: true, message: t('common.selectPlaceholder'), trigger: 'blur' }],
});
const memberFormContentRef = ref();
const loading = ref(false);
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate(async (valid) => {
        if (valid) {
            if (memberFormContentRef.value) {
                await memberFormContentRef.value?.validate();
            }
            if (user.isPE()) {
                const data = {
                    is_append: form.value.is_append,
                    ids: form.value.ids,
                    role_ids: list.value[0].role_id,
                };
                userManageApi.batchSetRolePE(data, loading).then(() => {
                    MsgSuccess(t('common.settingSuccess'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            if (user.isEE()) {
                list.value = list.value.map((item) => {
                    const isAdminRole = adminRoleList.value.find((item1) => item1.id === item.role_id);
                    // IfAdminRole, thenSettingsis ['None']
                    if (isAdminRole) {
                        return { ...item, workspace_ids: ['None'] };
                    }
                    return item;
                });
                const data = {
                    is_append: form.value.is_append,
                    ids: form.value.ids,
                    role_setting: list.value,
                };
                userManageApi.batchSetRoleEE(data, loading).then(() => {
                    MsgSuccess(t('common.settingSuccess'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
        }
    });
};
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
                    multiple: !!user.isPE(),
                },
            },
        ];
        adminRoleList.value = res.data.filter((item) => item.type === RoleTypeEnum.ADMIN);
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
                    })) || [],
                    placeholder: `${t('common.selectPlaceholder')}${t('views.role.member.workspace')}`,
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
    width: "600",
    title: (__VLS_ctx.$t('views.userManage.settingRole')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    width: "600",
    title: (__VLS_ctx.$t('views.userManage.settingRole')),
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
    label: (__VLS_ctx.$t('views.chatUser.settingMethod')),
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.chatUser.settingMethod')),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.is_append),
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.is_append),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    value: (true),
}));
const __VLS_29 = __VLS_28({
    value: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
(__VLS_ctx.$t('views.chatUser.append'));
// @ts-ignore
[$t, $t, $t, dialogVisible, rules, form, form,];
var __VLS_30;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    value: (false),
}));
const __VLS_35 = __VLS_34({
    value: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.replace'));
// @ts-ignore
[$t,];
var __VLS_36;
// @ts-ignore
[];
var __VLS_24;
// @ts-ignore
[];
var __VLS_18;
if (__VLS_ctx.user.isEE() || __VLS_ctx.user.isPE()) {
    const __VLS_39 = MemberFormContent;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ref: "memberFormContentRef",
        models: (__VLS_ctx.formItemModel),
        form: (__VLS_ctx.list),
        keepOneLine: true,
        needAddButton: (!__VLS_ctx.user.isPE()),
        addText: (__VLS_ctx.$t('views.userManage.addRole')),
    }));
    const __VLS_41 = __VLS_40({
        ref: "memberFormContentRef",
        models: (__VLS_ctx.formItemModel),
        form: (__VLS_ctx.list),
        keepOneLine: true,
        needAddButton: (!__VLS_ctx.user.isPE()),
        addText: (__VLS_ctx.$t('views.userManage.addRole')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.memberFormContentLoading) }, null, null);
    var __VLS_44;
    var __VLS_42;
}
// @ts-ignore
[$t, user, user, user, formItemModel, list, vLoading, memberFormContentLoading,];
var __VLS_10;
{
    const { footer: __VLS_46 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        ...{ 'onClick': {} },
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    let __VLS_52;
    const __VLS_53 = {
        /** @type {typeof __VLS_52.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_54 } = __VLS_50.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_50;
    var __VLS_51;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_60;
    const __VLS_61 = {
        /** @type {typeof __VLS_60.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.formRef);
            // @ts-ignore
            [loading, submit, formRef,];
        },
    };
    const { default: __VLS_62 } = __VLS_58.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_58;
    var __VLS_59;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12, __VLS_45 = __VLS_44;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
});
export default {};
