/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive } from 'vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import userManageApi from '@/api/system/chat-user';
import systemChatUserApi from '@/api/system/chat-user';
const syncTypeOptions = ref([
    { label: t('views.userManage.source.local'), value: 'LOCAL' },
    { label: t('views.system.authentication.scanTheQRCode.wecom'), value: 'wecom' },
    { label: 'LDAP', value: 'LDAP' },
    { label: t('views.system.authentication.scanTheQRCode.lark'), value: 'lark' },
]);
const emit = defineEmits();
const dialogVisible = ref(false);
const defaultForm = {
    sync_type: 'LOCAL',
};
const form = ref({
    ...defaultForm,
});
function open() {
    form.value = { ...defaultForm };
    getSyncType();
    dialogVisible.value = true;
}
async function getSyncType() {
    return systemChatUserApi.getSyncType().then((res) => {
        if (res.data && res.data.length > 0) {
            syncTypeOptions.value = syncTypeOptions.value.filter(option => res.data.includes(option.value));
        }
    });
}
const formRef = ref();
const rules = reactive({
    sync_type: [{ required: true, message: t('common.selectPlaceholder'), trigger: 'blur' }],
});
const loading = ref(false);
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            userManageApi.batchSync(form.value.sync_type, loading).then((res) => {
                if (res.data) {
                    const count = res.data.success_count;
                    let ErrorMsg = '';
                    if (res.data.conflict_users && res.data.conflict_users.length > 0) {
                        // Traverseres.data.conflict_users， He isOneArrayContainsObject
                        res.data.conflict_users.forEach((item) => {
                            if (item.type === 'username') {
                                ErrorMsg += '\n\n' + t('views.chatUser.syncMessage.usernameExist') + " [ " + item.users.join(',') + '\n' + ' ]';
                            }
                            if (item.type === 'nick_name') {
                                ErrorMsg += '\n\n' + t('views.chatUser.syncMessage.nicknameExist') + " [ " + item.users.join(',') + '\n' + ' ]';
                            }
                        });
                    }
                    MsgSuccess(t('views.chatUser.syncMessage.title', { count: count }) + ErrorMsg);
                    emit('refresh');
                    dialogVisible.value = false;
                }
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
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    width: "600",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    width: "600",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "mb-8 medium" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['medium']} */ ;
    (__VLS_ctx.t('views.chatUser.syncUsers'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "color-secondary lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.t('views.chatUser.syncUsersTip'));
    // @ts-ignore
    [dialogVisible, t, t,];
}
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    labelPosition: "top",
    ref: "formRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_10 = __VLS_9({
    labelPosition: "top",
    ref: "formRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_13;
const { default: __VLS_15 } = __VLS_11.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    prop: "sync_type",
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    prop: "sync_type",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    modelValue: (__VLS_ctx.form.sync_type),
    placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
}));
const __VLS_24 = __VLS_23({
    modelValue: (__VLS_ctx.form.sync_type),
    placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
for (const [option] of __VLS_vFor((__VLS_ctx.syncTypeOptions))) {
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        key: (option.value),
        label: (option.label),
        value: (option.value),
    }));
    const __VLS_30 = __VLS_29({
        key: (option.value),
        label: (option.label),
        value: (option.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    // @ts-ignore
    [rules, form, form, $t, $t, syncTypeOptions,];
}
// @ts-ignore
[];
var __VLS_25;
// @ts-ignore
[];
var __VLS_19;
// @ts-ignore
[];
var __VLS_11;
{
    const { footer: __VLS_33 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = {
        /** @type {typeof __VLS_39.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_41 } = __VLS_37.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_37;
    var __VLS_38;
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_47;
    const __VLS_48 = {
        /** @type {typeof __VLS_47.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.formRef);
            // @ts-ignore
            [loading, submit, formRef,];
        },
    };
    const { default: __VLS_49 } = __VLS_45.slots;
    (__VLS_ctx.$t('common.import'));
    // @ts-ignore
    [$t,];
    var __VLS_45;
    var __VLS_46;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
});
export default {};
