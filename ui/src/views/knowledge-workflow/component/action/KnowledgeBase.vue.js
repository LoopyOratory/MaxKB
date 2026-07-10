/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { WorkflowType } from '@/enums/application';
const props = defineProps();
const loading = ref();
const form_data = ref({});
const dynamicsFormRef = ref();
const validate = () => {
    return dynamicsFormRef.value?.validate();
};
const chat_title = computed(() => {
    const kBase = props.workflow?.nodes?.find((n) => n.type === WorkflowType.KnowledgeBase);
    return kBase.properties.user_input_config.title;
});
const base_form_list = computed(() => {
    const kBase = props.workflow?.nodes?.find((n) => n.type === WorkflowType.KnowledgeBase);
    if (kBase) {
        return kBase.properties.user_input_field_list;
    }
    return [];
});
const get_data = () => {
    return form_data.value;
};
const __VLS_exposed = { validate, get_data };
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
const __VLS_0 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.base_form_list),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.base_form_list),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
{
    const { default: __VLS_8 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16 mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    (__VLS_ctx.chat_title || __VLS_ctx.$t('aiChat.userInput'));
    // @ts-ignore
    [form_data, form_data, base_form_list, vLoading, loading, chat_title, $t,];
}
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
