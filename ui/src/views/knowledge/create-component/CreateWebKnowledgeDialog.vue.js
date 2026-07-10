/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseForm from '@/views/knowledge/component/BaseForm.vue';
import { MsgSuccess } from '@/utils/message';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { t } from '@/locales';
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
const KnowledgeFormRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const knowledgeForm = ref({
    source_url: '',
    selector: '',
});
const rules = reactive({
    source_url: [
        {
            required: true,
            message: t('views.knowledge.form.source_url.requiredMessage'),
            trigger: 'blur',
        },
    ],
});
const currentFolder = ref(null);
watch(dialogVisible, (bool) => {
    if (!bool) {
        currentFolder.value = null;
        knowledgeForm.value = {
            source_url: '',
            selector: '',
        };
        KnowledgeFormRef.value?.clearValidate();
    }
});
const open = (folder) => {
    currentFolder.value = folder;
    dialogVisible.value = true;
};
const submitHandle = async () => {
    if (await BaseFormRef.value?.validate()) {
        await KnowledgeFormRef.value.validate((valid) => {
            if (valid) {
                const obj = {
                    folder_id: currentFolder.value?.id,
                    ...BaseFormRef.value.form,
                    ...knowledgeForm.value,
                };
                loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                    .postWebKnowledge(obj, loading)
                    .then(async (res) => {
                    await user.profile().then(() => {
                        MsgSuccess(t('common.createSuccess'));
                        router.push({
                            path: `/knowledge/${res.data.id}/${currentFolder.value.id || 'shared'}/1/document`,
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
    title: (__VLS_ctx.$t('views.knowledge.knowledgeType.createWebKnowledge')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "720",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.knowledge.knowledgeType.createWebKnowledge')),
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
    ref: "KnowledgeFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.knowledgeForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_16 = __VLS_15({
    ref: "KnowledgeFormRef",
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
    label: (__VLS_ctx.$t('views.knowledge.form.source_url.label')),
    prop: "source_url",
}));
const __VLS_24 = __VLS_23({
    label: (__VLS_ctx.$t('views.knowledge.form.source_url.label')),
    prop: "source_url",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.knowledgeForm.source_url),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.source_url.placeholder')),
}));
const __VLS_30 = __VLS_29({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.knowledgeForm.source_url),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.source_url.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_33;
const __VLS_34 = {
    /** @type {typeof __VLS_33.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.knowledgeForm.source_url = __VLS_ctx.knowledgeForm.source_url.trim();
        // @ts-ignore
        [$t, $t, $t, dialogVisible, dialogVisible, apiType, rules, knowledgeForm, knowledgeForm, knowledgeForm, knowledgeForm,];
    },
};
var __VLS_31;
var __VLS_32;
// @ts-ignore
[];
var __VLS_25;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    label: (__VLS_ctx.$t('views.knowledge.form.selector.label')),
}));
const __VLS_37 = __VLS_36({
    label: (__VLS_ctx.$t('views.knowledge.form.selector.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const { default: __VLS_40 } = __VLS_38.slots;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.knowledgeForm.selector),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.selector.placeholder')),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.knowledgeForm.selector),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.selector.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_46;
const __VLS_47 = {
    /** @type {typeof __VLS_46.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.knowledgeForm.selector = __VLS_ctx.knowledgeForm.selector.trim();
        // @ts-ignore
        [$t, $t, knowledgeForm, knowledgeForm, knowledgeForm,];
    },
};
var __VLS_44;
var __VLS_45;
// @ts-ignore
[];
var __VLS_38;
// @ts-ignore
[];
var __VLS_17;
{
    const { footer: __VLS_48 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_51 = __VLS_50({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    let __VLS_54;
    const __VLS_55 = {
        /** @type {typeof __VLS_54.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, loading,];
        },
    };
    const { default: __VLS_56 } = __VLS_52.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_52;
    var __VLS_53;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_64 } = __VLS_60.slots;
    (__VLS_ctx.$t('common.create'));
    // @ts-ignore
    [$t, loading, submitHandle,];
    var __VLS_60;
    var __VLS_61;
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
