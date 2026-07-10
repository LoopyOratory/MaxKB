/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onBeforeMount, ref } from 'vue';
import UserApi from '@/api/user/user';
import MemberFormContent from '@/views/system/role/component/MemberFormContent.vue';
import { t } from '@/locales';
import { MsgSuccess } from '@/utils/message';
import { RoleTypeEnum } from '@/enums/system';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import { i18n_name } from '@/utils/common';
const props = defineProps();
const emit = defineEmits();
const loading = ref(false);
const visible = ref(false);
const list = ref([]);
const memberFormContentLoading = ref(false);
const formItemModel = ref([]);
const userFormItem = ref([]);
const roleFormItem = ref([]);
const userOptions = ref([]);
async function getUserFormItem() {
    try {
        const fetchUserOptions = async (query) => {
            const res = await UserApi.getUserList(query ? { nick_name: query } : {}, memberFormContentLoading);
            return res.data?.map((item) => ({
                label: item.nick_name,
                value: item.id,
            })) || [];
        };
        // InitialLoad
        userOptions.value = await fetchUserOptions();
        userFormItem.value = [
            {
                path: 'user_ids',
                label: t('views.role.member.title'),
                rules: [
                    {
                        required: true,
                        message: `${t('common.selectPlaceholder')}${t('views.role.member.title')}`,
                    },
                ],
                selectProps: {
                    options: userOptions.value,
                    placeholder: `${t('common.selectPlaceholder')}${t('views.role.member.title')}`,
                    remoteMethod: async (query, element) => {
                        // Key: DirectUpdate selectProps.options
                        const newOptions = await fetchUserOptions(query);
                        // UpdateCurrentItem options
                        const currentItem = userFormItem.value.find(item => item.path === 'user_ids');
                        if (currentItem?.selectProps) {
                            currentItem.selectProps.options = newOptions;
                        }
                        return newOptions;
                    }
                },
            },
        ];
    }
    catch (e) {
        console.error(e);
    }
}
async function getRoleFormItem() {
    try {
        const res = await loadPermissionApi('workspace').getWorkspaceRoleList(memberFormContentLoading);
        roleFormItem.value = [
            {
                path: 'role_ids',
                label: t('views.role.member.role'),
                rules: [
                    {
                        required: true,
                        message: `${t('common.selectPlaceholder')}${t('views.role.member.role')}`,
                    },
                ],
                selectProps: {
                    options: res.data
                        .filter((item) => item.type !== RoleTypeEnum.ADMIN)
                        ?.map((item) => ({
                        label: i18n_name(item.name),
                        value: item.id,
                    })) || [],
                    placeholder: `${t('common.selectPlaceholder')}${t('views.role.member.role')}`,
                },
            },
        ];
    }
    catch (e) {
        console.error(e);
    }
}
function init() {
    formItemModel.value = [...userFormItem.value, ...roleFormItem.value];
    list.value = [{ user_ids: [], role_ids: [] }];
}
onBeforeMount(async () => {
    await getUserFormItem();
    await getRoleFormItem();
    init();
});
function open() {
    init();
    visible.value = true;
}
function handleCancel() {
    visible.value = false;
}
const memberFormContentRef = ref();
function handleAdd() {
    memberFormContentRef.value?.validate().then(async (valid) => {
        if (valid) {
            await loadPermissionApi('workspace').CreateWorkspaceMember(props.currentWorkspace?.id, list.value, loading);
            MsgSuccess(t('common.addSuccess'));
            handleCancel();
            emit('refresh');
        }
    });
}
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
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.handleCancel),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: "600",
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.handleCancel),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.role.member.add'));
    // @ts-ignore
    [visible, handleCancel, $t,];
}
{
    const { default: __VLS_8 } = __VLS_3.slots;
    const __VLS_9 = MemberFormContent;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        ref: "memberFormContentRef",
        models: (__VLS_ctx.formItemModel),
        form: (__VLS_ctx.list),
        keepOneLine: true,
    }));
    const __VLS_11 = __VLS_10({
        ref: "memberFormContentRef",
        models: (__VLS_ctx.formItemModel),
        form: (__VLS_ctx.list),
        keepOneLine: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.memberFormContentLoading) }, null, null);
    var __VLS_14;
    var __VLS_12;
    // @ts-ignore
    [formItemModel, list, vLoading, memberFormContentLoading,];
}
{
    const { footer: __VLS_16 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        /** @type {typeof __VLS_22.click} */
        onClick: (__VLS_ctx.handleCancel),
    };
    const { default: __VLS_24 } = __VLS_20.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [handleCancel, $t,];
    var __VLS_20;
    var __VLS_21;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        /** @type {typeof __VLS_30.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.handleAdd();
            // @ts-ignore
            [loading, handleAdd,];
        },
    };
    const { default: __VLS_32 } = __VLS_28.slots;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t,];
    var __VLS_28;
    var __VLS_29;
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
    __typeProps: {},
});
export default {};
