/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { cloneDeep } from 'lodash';
import applicationApi from '@/api/application/application';
import { MsgSuccess } from '@/utils/message';
import { isWorkFlow } from '@/utils/application';
import { t } from '@/locales';
import useStore from '@/stores';
const router = useRouter();
const { common, user } = useStore();
const defaultPrompt = t('views.application.form.prompt.defaultPrompt', {
    data: '{data}',
    question: '{question}',
});
const applicationFormRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const applicationForm = ref({
    name: '',
    desc: '',
    model_id: '',
    dialogue_number: 0,
    prologue: t('views.application.form.defaultPrologue'),
    knowledge_id_list: [],
    knowledge_setting: {
        top_n: 3,
        similarity: 0.6,
        max_paragraph_char_number: 5000,
        search_mode: 'embedding',
        no_references_setting: {
            status: 'ai_questioning',
            value: '{question}',
        },
    },
    model_setting: {
        prompt: defaultPrompt,
    },
    problem_optimization: false,
    type: 'SIMPLE',
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.application.form.appName.placeholder'),
            trigger: 'blur',
        },
    ],
});
const currentFolder = ref('');
watch(dialogVisible, (bool) => {
    if (!bool) {
        applicationForm.value = {
            name: '',
            desc: '',
            model_id: '',
            dialogue_number: 0,
            prologue: t('views.application.form.defaultPrologue'),
            knowledge_id_list: [],
            knowledge_setting: {
                top_n: 3,
                similarity: 0.6,
                max_paragraph_char_number: 5000,
                search_mode: 'embedding',
                no_references_setting: {
                    status: 'ai_questioning',
                    value: '{question}',
                },
            },
            model_setting: {
                prompt: defaultPrompt,
            },
            problem_optimization: false,
            type: 'SIMPLE',
        };
        applicationFormRef.value?.clearValidate();
    }
});
const open = (data, folder) => {
    currentFolder.value = folder;
    const obj = cloneDeep(data);
    delete obj['id'];
    obj['name'] = obj['name'] + ` ${t('common.copyTitle')}`;
    applicationForm.value = obj;
    dialogVisible.value = true;
};
const submitHandle = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            applicationApi
                .postApplication({ ...applicationForm.value, folder_id: currentFolder.value }, loading)
                .then((res) => {
                return user.profile().then(() => {
                    MsgSuccess(t('common.createSuccess'));
                    if (isWorkFlow(applicationForm.value.type)) {
                        router.push({ path: `/application/workspace/${res.data.id}/workflow` });
                    }
                    else {
                        router.push({
                            path: `/application/workspace/${res.data.id}/${res.data.type}/setting`,
                        });
                    }
                    dialogVisible.value = false;
                });
            });
        }
    });
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
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
    title: (__VLS_ctx.$t('views.application.copyApplication')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "650",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.application.copyApplication')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "650",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "applicationFormRef",
    model: (__VLS_ctx.applicationForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "applicationFormRef",
    model: (__VLS_ctx.applicationForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
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
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.applicationForm.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.applicationForm.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[$t, $t, $t, dialogVisible, applicationForm, applicationForm, rules,];
var __VLS_20;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('common.desc')),
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('common.desc')),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.applicationForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.applicationForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, $t, applicationForm,];
var __VLS_31;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_39 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        /** @type {typeof __VLS_45.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, loading,];
        },
    };
    const { default: __VLS_47 } = __VLS_43.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_43;
    var __VLS_44;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submitHandle(__VLS_ctx.applicationFormRef);
            // @ts-ignore
            [loading, submitHandle, applicationFormRef,];
        },
    };
    const { default: __VLS_55 } = __VLS_51.slots;
    (__VLS_ctx.$t('common.copy'));
    // @ts-ignore
    [$t,];
    var __VLS_51;
    var __VLS_52;
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
});
export default {};
