/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onBeforeMount } from 'vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
const emit = defineEmits();
const dialogVisible = ref(false);
const defaultForm = {
    user: [],
};
const form = ref({
    ...defaultForm,
});
const optionLoading = ref(false);
const chatUserList = ref([]);
const originalChatUserList = ref([]);
async function getChatUserList() {
    try {
        const res = await loadPermissionApi('chatUser').getChatUserList(optionLoading);
        originalChatUserList.value = res.data;
        chatUserList.value = [...res.data];
    }
    catch (e) {
        console.error(e);
    }
}
const filterUser = (query) => {
    if (!query) {
        chatUserList.value = originalChatUserList.value;
        return;
    }
    const q = query.toLowerCase();
    chatUserList.value = originalChatUserList.value.filter((item) => item.nick_name?.toLowerCase().includes(q) || item.username?.toLowerCase().includes(q));
};
onBeforeMount(() => {
    getChatUserList();
});
const groupId = ref('');
function open(id) {
    form.value = { ...defaultForm };
    groupId.value = id;
    dialogVisible.value = true;
}
const formRef = ref();
const rules = reactive({
    user: [{ required: true, message: t('common.selectPlaceholder'), trigger: 'blur' }],
});
const loading = ref(false);
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            loadPermissionApi('userGroup')
                .postAddMember(groupId.value, { user_ids: form.value.user }, loading)
                .then(() => {
                MsgSuccess(t('common.addSuccess'));
                emit('refresh');
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
    title: (__VLS_ctx.$t('views.role.member.add')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.role.member.add')),
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
    label: (__VLS_ctx.$t('views.chatUser.group.usernameOrName')),
    prop: "user",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.chatUser.group.usernameOrName')),
    prop: "user",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.user),
    multiple: true,
    filterable: true,
    reserveKeyword: (false),
    placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
    loading: (__VLS_ctx.optionLoading),
    filterMethod: (__VLS_ctx.filterUser),
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.user),
    multiple: true,
    filterable: true,
    reserveKeyword: (false),
    placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
    loading: (__VLS_ctx.optionLoading),
    filterMethod: (__VLS_ctx.filterUser),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.chatUserList))) {
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        key: (item.id),
        label: (item.nick_name),
        value: (item.id),
    }));
    const __VLS_29 = __VLS_28({
        key: (item.id),
        label: (item.nick_name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    // @ts-ignore
    [$t, $t, $t, dialogVisible, rules, form, form, optionLoading, filterUser, chatUserList,];
}
// @ts-ignore
[];
var __VLS_24;
// @ts-ignore
[];
var __VLS_18;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_32 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        ...{ 'onClick': {} },
    }));
    const __VLS_35 = __VLS_34({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_38;
    const __VLS_39 = {
        /** @type {typeof __VLS_38.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_40 } = __VLS_36.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_36;
    var __VLS_37;
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_46;
    const __VLS_47 = {
        /** @type {typeof __VLS_46.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.formRef);
            // @ts-ignore
            [loading, submit, formRef,];
        },
    };
    const { default: __VLS_48 } = __VLS_44.slots;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t,];
    var __VLS_44;
    var __VLS_45;
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
