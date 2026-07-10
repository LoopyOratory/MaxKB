/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { groupBy } from 'lodash';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const props = defineProps();
const form = ref({
    name: '',
    desc: '',
    embedding_model_id: '',
});
const workspace_id = ref('');
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.knowledge.form.knowledgeName.requiredMessage'),
            trigger: 'blur',
        },
    ],
    desc: [
        {
            required: true,
            message: t('views.knowledge.form.knowledgeDescription.requiredMessage'),
            trigger: 'blur',
        },
    ],
    embedding_model_id: [
        {
            required: true,
            message: t('views.knowledge.form.EmbeddingModel.requiredMessage'),
            trigger: 'change',
        },
    ],
});
const FormRef = ref();
const loading = ref(false);
const modelOptions = ref([]);
watch(() => props.data, (value) => {
    if (value && JSON.stringify(value) !== '{}') {
        form.value.name = value.name;
        form.value.desc = value.desc;
        form.value.embedding_model_id = value.embedding_model_id;
        workspace_id.value = value.workspace_id || '';
        // Re-RefreshModelList
        getSelectModel();
    }
}, {
    immediate: true,
});
/*
  FormValidate
*/
function validate() {
    if (!FormRef.value)
        return;
    return FormRef.value.validate((valid) => {
        return valid;
    });
}
function getSelectModel() {
    loading.value = true;
    const obj = props.apiType === 'systemManage'
        ? {
            model_type: 'EMBEDDING',
            workspace_id: workspace_id.value,
        }
        : {
            model_type: 'EMBEDDING',
        };
    loadSharedApi({ type: 'model', systemType: props.apiType })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
onMounted(() => {
    if (props.apiType !== 'systemManage') {
        getSelectModel();
    }
});
onUnmounted(() => {
    form.value = {
        name: '',
        desc: '',
        embedding_model_id: '',
    };
    FormRef.value?.clearValidate();
});
const __VLS_exposed = {
    validate,
    form,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_2 = __VLS_1({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    label: (__VLS_ctx.$t('views.knowledge.form.knowledgeName.label')),
    prop: "name",
}));
const __VLS_10 = __VLS_9({
    label: (__VLS_ctx.$t('views.knowledge.form.knowledgeName.label')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.knowledgeName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_16 = __VLS_15({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.knowledgeName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
const __VLS_20 = {
    /** @type {typeof __VLS_19.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.name = __VLS_ctx.form.name.trim();
        // @ts-ignore
        [form, form, form, form, rules, vLoading, loading, $t, $t,];
    },
};
var __VLS_17;
var __VLS_18;
// @ts-ignore
[];
var __VLS_11;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.$t('views.knowledge.form.knowledgeDescription.label')),
    prop: "desc",
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.$t('views.knowledge.form.knowledgeDescription.label')),
    prop: "desc",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.knowledge.form.knowledgeDescription.placeholder')),
    maxlength: "256",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}));
const __VLS_29 = __VLS_28({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.knowledge.form.knowledgeDescription.placeholder')),
    maxlength: "256",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
const __VLS_33 = {
    /** @type {typeof __VLS_32.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.desc = __VLS_ctx.form.desc.trim();
        // @ts-ignore
        [form, form, form, $t, $t,];
    },
};
var __VLS_30;
var __VLS_31;
// @ts-ignore
[];
var __VLS_24;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    label: (__VLS_ctx.$t('views.knowledge.form.EmbeddingModel.label')),
    prop: "embedding_model_id",
}));
const __VLS_36 = __VLS_35({
    label: (__VLS_ctx.$t('views.knowledge.form.EmbeddingModel.label')),
    prop: "embedding_model_id",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
ModelSelect;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    ...{ 'onSubmitModel': {} },
    modelValue: (__VLS_ctx.form.embedding_model_id),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.EmbeddingModel.placeholder')),
    options: (__VLS_ctx.modelOptions),
    modelType: ('EMBEDDING'),
    showFooter: true,
}));
const __VLS_42 = __VLS_41({
    ...{ 'onSubmitModel': {} },
    modelValue: (__VLS_ctx.form.embedding_model_id),
    placeholder: (__VLS_ctx.$t('views.knowledge.form.EmbeddingModel.placeholder')),
    options: (__VLS_ctx.modelOptions),
    modelType: ('EMBEDDING'),
    showFooter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_45;
const __VLS_46 = {
    /** @type {typeof __VLS_45.submitModel} */
    onSubmitModel: (__VLS_ctx.getSelectModel),
};
var __VLS_43;
var __VLS_44;
// @ts-ignore
[form, $t, $t, modelOptions, getSelectModel,];
var __VLS_37;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeProps: {},
});
export default {};
