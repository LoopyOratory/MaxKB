/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseForm from '@/views/knowledge/component/BaseForm.vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
const emit = defineEmits(['refresh']);
const { user } = useStore();
const router = useRouter();
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const BaseFormRef = ref();
const knowledgeFormRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const currentFolder = ref(null);
const knowledgeForm = ref({
    type: '0',
    source_url: '',
    selector: '',
    app_id: '',
    app_secret: '',
    folder_token: '',
});
const rules = reactive({
    source_url: [
        {
            required: true,
            message: t('views.knowledge.form.source_url.requiredMessage'),
            trigger: 'blur',
        },
    ],
    app_id: [
        {
            required: true,
            message: t('views.application.applicationAccess.larkSetting.appIdPlaceholder'),
            trigger: 'blur',
        },
    ],
    app_secret: [
        {
            required: true,
            message: t('views.application.applicationAccess.larkSetting.appSecretPlaceholder'),
            trigger: 'blur',
        },
    ],
    folder_token: [
        {
            required: true,
            message: t('views.application.applicationAccess.larkSetting.folderTokenPlaceholder'),
            trigger: 'blur',
        },
    ],
    user_id: [
        {
            required: true,
            message: t('views.knowledge.form.user_id.requiredMessage'),
            trigger: 'blur',
        },
    ],
    token: [
        {
            required: true,
            message: t('views.knowledge.form.token.requiredMessage'),
            trigger: 'blur',
        },
    ],
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        knowledgeForm.value = {
            type: '0',
            source_url: '',
            selector: '',
        };
        knowledgeFormRef.value?.clearValidate();
    }
});
const open = (folder) => {
    currentFolder.value = folder;
    dialogVisible.value = true;
};
const submitHandle = async () => {
    if (await BaseFormRef.value?.validate()) {
        await knowledgeFormRef.value.validate((valid) => {
            if (valid) {
                const obj = {
                    folder_id: currentFolder.value?.id,
                    ...BaseFormRef.value.form,
                    ...knowledgeForm.value,
                };
                loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                    .postLarkKnowledge(obj, loading)
                    .then(async (res) => {
                    await user.profile().then(() => {
                        MsgSuccess(t('common.createSuccess'));
                        router.push({
                            path: `/knowledge/${res.data.id}/${currentFolder.value.id || 'shared'}/2/document`,
                            query: {
                                from: apiType.value,
                            },
                        });
                        emit('refresh');
                    });
                });
            }
            else {
                return false;
            }
        });
    }
    else {
        return false;
    }
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
    title: (__VLS_ctx.$t('views.knowledge.knowledgeType.createLarkKnowledge')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "720",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.knowledge.knowledgeType.createLarkKnowledge')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "720",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.dialogVisible) {
    const __VLS_7 = BaseForm;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ref: "BaseFormRef",
        apiType: (__VLS_ctx.apiType),
    }));
    const __VLS_9 = __VLS_8({
        ref: "BaseFormRef",
        apiType: (__VLS_ctx.apiType),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    var __VLS_12;
    var __VLS_10;
}
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    ref: "knowledgeFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.knowledgeForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_16 = __VLS_15({
    ref: "knowledgeFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.knowledgeForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_19;
const { default: __VLS_21 } = __VLS_17.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    label: "App ID",
    prop: "app_id",
}));
const __VLS_24 = __VLS_23({
    label: "App ID",
    prop: "app_id",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.knowledgeForm.app_id),
    placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appIdPlaceholder')),
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.knowledgeForm.app_id),
    placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appIdPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
// @ts-ignore
[$t, $t, dialogVisible, dialogVisible, apiType, rules, knowledgeForm, knowledgeForm,];
var __VLS_25;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    label: "App Secret",
    prop: "app_secret",
}));
const __VLS_35 = __VLS_34({
    label: "App Secret",
    prop: "app_secret",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.knowledgeForm.app_secret),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appSecretPlaceholder')),
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.knowledgeForm.app_secret),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appSecretPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
// @ts-ignore
[$t, knowledgeForm,];
var __VLS_36;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    label: "Folder Token",
    prop: "folder_token",
}));
const __VLS_46 = __VLS_45({
    label: "Folder Token",
    prop: "folder_token",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    modelValue: (__VLS_ctx.knowledgeForm.folder_token),
    placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.folderTokenPlaceholder')),
}));
const __VLS_52 = __VLS_51({
    modelValue: (__VLS_ctx.knowledgeForm.folder_token),
    placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.folderTokenPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
// @ts-ignore
[$t, knowledgeForm,];
var __VLS_47;
// @ts-ignore
[];
var __VLS_17;
{
    const { footer: __VLS_55 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_61;
    const __VLS_62 = {
        /** @type {typeof __VLS_61.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, loading,];
        },
    };
    const { default: __VLS_63 } = __VLS_59.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_59;
    var __VLS_60;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    (__VLS_ctx.$t('common.create'));
    // @ts-ignore
    [$t, loading, submitHandle,];
    var __VLS_67;
    var __VLS_68;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12, __VLS_20 = __VLS_19;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
