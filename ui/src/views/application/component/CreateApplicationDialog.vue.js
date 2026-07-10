/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import applicationApi from '@/api/application/application';
import { MsgSuccess } from '@/utils/message';
import { isWorkFlow } from '@/utils/application';
import { baseNodes } from '@/workflow/common/data';
import { applicationTemplate } from '@/workflow/common/template';
import { t } from '@/locales';
import useStore from '@/stores';
const { user } = useStore();
const router = useRouter();
const emit = defineEmits(['refresh']);
const defaultPrompt = t('views.application.form.prompt.defaultPrompt', {
    data: '{data}',
    question: '{question}',
});
const optimizationPrompt = t('views.application.dialog.defaultPrompt1', {
    question: '{question}',
}) +
    '<data></data>' +
    t('views.application.dialog.defaultPrompt2');
const workflowDefault = ref({
    edges: [],
    nodes: baseNodes,
});
const appTemplate = ref('blank');
const applicationFormRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const work_flow_template = ref();
const applicationForm = ref({
    name: '',
    desc: '',
    model_id: undefined,
    dialogue_number: 1,
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
        system: '',
        no_references_prompt: '{question}',
    },
    model_params_setting: {},
    problem_optimization: false,
    problem_optimization_prompt: optimizationPrompt,
    stt_model_id: undefined,
    tts_model_id: undefined,
    stt_model_enable: false,
    tts_model_enable: false,
    tts_type: 'BROWSER',
    type: 'SIMPLE',
    work_flow_template: undefined,
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.application.form.appName.placeholder'),
            trigger: 'blur',
        },
    ],
    model_id: [
        {
            required: false,
            message: t('views.application.form.aiModel.placeholder'),
            trigger: 'change',
        },
    ],
});
const currentFolder = ref('');
watch(dialogVisible, (bool) => {
    if (!bool) {
        applicationForm.value = {
            name: '',
            desc: '',
            model_id: undefined,
            dialogue_number: 1,
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
                system: '',
                no_references_prompt: '{question}',
            },
            model_params_setting: {},
            problem_optimization: false,
            problem_optimization_prompt: optimizationPrompt,
            stt_model_id: undefined,
            tts_model_id: undefined,
            stt_model_enable: false,
            tts_model_enable: false,
            tts_type: 'BROWSER',
            type: 'SIMPLE',
        };
        applicationFormRef.value?.clearValidate();
    }
});
const open = (folder, type, work_flow) => {
    currentFolder.value = folder;
    applicationForm.value.type = type || 'SIMPLE';
    dialogVisible.value = true;
    work_flow_template.value = work_flow;
};
const submitHandle = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            if (isWorkFlow(applicationForm.value.type)) {
                workflowDefault.value.nodes[0].properties.node_data.desc = applicationForm.value.desc;
                workflowDefault.value.nodes[0].properties.node_data.name = applicationForm.value.name;
                applicationForm.value['work_flow'] = workflowDefault.value;
                if (work_flow_template.value) {
                    applicationForm.value['work_flow_template'] = work_flow_template.value;
                }
            }
            loading.value = true;
            applicationApi
                .postApplication({ ...applicationForm.value, folder_id: currentFolder.value })
                .then((res) => {
                return user.profile().then(() => {
                    MsgSuccess(t('common.createSuccess'));
                    emit('refresh');
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
            })
                .finally(() => {
                loading.value = false;
            });
        }
    });
};
function selectedType(type) {
    appTemplate.value = type;
    workflowDefault.value = applicationTemplate[type];
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.isWorkFlow(__VLS_ctx.applicationForm.type)
        ? __VLS_ctx.$t('views.application.createWorkFlowApplication')
        : __VLS_ctx.$t('views.application.createApplication')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "650",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.isWorkFlow(__VLS_ctx.applicationForm.type)
        ? __VLS_ctx.$t('views.application.createWorkFlowApplication')
        : __VLS_ctx.$t('views.application.createApplication')),
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
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.applicationForm.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}));
const __VLS_25 = __VLS_24({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.applicationForm.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.applicationForm.name = __VLS_ctx.applicationForm.name?.trim();
        // @ts-ignore
        [isWorkFlow, applicationForm, applicationForm, applicationForm, applicationForm, applicationForm, $t, $t, $t, $t, dialogVisible, rules,];
    },
};
var __VLS_26;
var __VLS_27;
// @ts-ignore
[];
var __VLS_20;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: (__VLS_ctx.$t('common.desc')),
}));
const __VLS_32 = __VLS_31({
    label: (__VLS_ctx.$t('common.desc')),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.applicationForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.applicationForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
// @ts-ignore
[applicationForm, $t, $t,];
var __VLS_33;
if (__VLS_ctx.applicationForm.type === 'WORK_FLOW' && !__VLS_ctx.work_flow_template) {
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        label: (__VLS_ctx.$t('views.document.upload.template')),
    }));
    const __VLS_43 = __VLS_42({
        label: (__VLS_ctx.$t('views.document.upload.template')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    const { default: __VLS_46 } = __VLS_44.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        gutter: (16),
    }));
    const __VLS_49 = __VLS_48({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const { default: __VLS_52 } = __VLS_50.slots;
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        span: (12),
    }));
    const __VLS_55 = __VLS_54({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    const { default: __VLS_58 } = __VLS_56.slots;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        ...{ class: "template-radio-card cursor text-center flex-center" },
        shadow: "never",
        ...{ class: (__VLS_ctx.appTemplate === 'blank' ? 'border-active' : '') },
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        ...{ class: "template-radio-card cursor text-center flex-center" },
        shadow: "never",
        ...{ class: (__VLS_ctx.appTemplate === 'blank' ? 'border-active' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.applicationForm.type === 'WORK_FLOW' && !__VLS_ctx.work_flow_template))
                throw 0;
            return __VLS_ctx.selectedType('blank');
            // @ts-ignore
            [applicationForm, $t, work_flow_template, appTemplate, selectedType,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['template-radio-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
    const { default: __VLS_66 } = __VLS_62.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-center p-24" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        iconName: "app-add-outlined",
        ...{ class: "mr-12" },
    }));
    const __VLS_69 = __VLS_68({
        iconName: "app-add-outlined",
        ...{ class: "mr-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    (__VLS_ctx.$t('views.application.form.appTemplate.blankApp.title'));
    // @ts-ignore
    [$t,];
    var __VLS_62;
    var __VLS_63;
    // @ts-ignore
    [];
    var __VLS_56;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        span: (12),
    }));
    const __VLS_74 = __VLS_73({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    const { default: __VLS_77 } = __VLS_75.slots;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
    CardBox;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        ...{ 'onClick': {} },
        title: (__VLS_ctx.$t('views.application.form.appTemplate.assistantApp.title')),
        description: (__VLS_ctx.$t('views.application.form.appTemplate.assistantApp.description')),
        shadow: "never",
        ...{ class: "template-radio-card cursor" },
        ...{ class: (__VLS_ctx.appTemplate === 'assistant' ? 'border-active' : '') },
    }));
    const __VLS_80 = __VLS_79({
        ...{ 'onClick': {} },
        title: (__VLS_ctx.$t('views.application.form.appTemplate.assistantApp.title')),
        description: (__VLS_ctx.$t('views.application.form.appTemplate.assistantApp.description')),
        shadow: "never",
        ...{ class: "template-radio-card cursor" },
        ...{ class: (__VLS_ctx.appTemplate === 'assistant' ? 'border-active' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    let __VLS_83;
    const __VLS_84 = {
        /** @type {typeof __VLS_83.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.applicationForm.type === 'WORK_FLOW' && !__VLS_ctx.work_flow_template))
                throw 0;
            return __VLS_ctx.selectedType('assistant');
            // @ts-ignore
            [$t, $t, appTemplate, selectedType,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['template-radio-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    const { default: __VLS_85 } = __VLS_81.slots;
    {
        const { icon: __VLS_86 } = __VLS_81.slots;
        let __VLS_87;
        /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
        LogoIcon;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
            height: "32px",
        }));
        const __VLS_89 = __VLS_88({
            height: "32px",
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_81;
    var __VLS_82;
    // @ts-ignore
    [];
    var __VLS_75;
    // @ts-ignore
    [];
    var __VLS_50;
    // @ts-ignore
    [];
    var __VLS_44;
}
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_92 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    const __VLS_99 = {
        /** @type {typeof __VLS_98.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, loading,];
        },
    };
    const { default: __VLS_100 } = __VLS_96.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_96;
    var __VLS_97;
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_106;
    const __VLS_107 = {
        /** @type {typeof __VLS_106.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submitHandle(__VLS_ctx.applicationFormRef);
            // @ts-ignore
            [loading, submitHandle, applicationFormRef,];
        },
    };
    const { default: __VLS_108 } = __VLS_104.slots;
    (__VLS_ctx.$t('common.create'));
    // @ts-ignore
    [$t,];
    var __VLS_104;
    var __VLS_105;
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
    emits: {},
});
export default {};
