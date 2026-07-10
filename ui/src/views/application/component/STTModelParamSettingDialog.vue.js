/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const { params: { id } } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const dialogVisible = ref(false);
const form_data = ref({});
const dynamicsFormRef = ref();
const stt_model_id = ref('');
const loading = ref(false);
const model_form_field = ref([]);
const emit = defineEmits(['refresh']);
const open = (model_id, application_id, model_setting_data) => {
    form_data.value = {};
    stt_model_id.value = model_id;
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getModelParamsForm(model_id, loading)
        .then((ok) => {
        model_form_field.value = ok.data;
        const resp = ok.data
            .map((item) => ({
            [item.field]: item.show_default_value !== false ? item.default_value : undefined,
        }))
            .reduce((x, y) => ({ ...x, ...y }), {});
        if (model_setting_data) {
            Object.keys(model_setting_data).forEach((key) => {
                if (!(key in resp)) {
                    delete model_setting_data[key];
                }
            });
        }
        model_setting_data = { ...resp, ...model_setting_data };
        // RenderDynamicForm
        dynamicsFormRef.value?.render(model_form_field.value, model_setting_data);
    });
    dialogVisible.value = true;
};
const submit = async () => {
    dynamicsFormRef.value?.validate().then(() => {
        emit('refresh', form_data.value);
        dialogVisible.value = false;
    });
};
const reset_default = (model_id, application_id) => {
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getModelParamsForm(model_id, loading)
        .then((ok) => {
        model_form_field.value = ok.data;
        const model_setting_data = ok.data
            .map((item) => ({
            [item.field]: item.show_default_value !== false ? item.default_value : undefined,
        }))
            .reduce((x, y) => (({ ...x, ...y })), {});
        emit('refresh', model_setting_data);
    });
};
const __VLS_exposed = { open, reset_default };
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
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
const __VLS_7 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    render_data: (__VLS_ctx.model_form_field),
    ref: "dynamicsFormRef",
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    render_data: (__VLS_ctx.model_form_field),
    ref: "dynamicsFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
var __VLS_10;
{
    const { footer: __VLS_14 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        ...{ 'onClick': {} },
    }));
    const __VLS_17 = __VLS_16({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_20;
    const __VLS_21 = {
        /** @type {typeof __VLS_20.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [$t, dialogVisible, dialogVisible, form_data, form_data, model_form_field,];
        },
    };
    const { default: __VLS_22 } = __VLS_18.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_18;
    var __VLS_19;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    const __VLS_29 = {
        /** @type {typeof __VLS_28.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_30 } = __VLS_26.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_26;
    var __VLS_27;
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
    emits: {},
});
export default {};
