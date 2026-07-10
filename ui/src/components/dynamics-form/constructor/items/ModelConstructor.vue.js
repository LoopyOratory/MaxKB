/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, inject, ref } from 'vue';
import { modelTypeList } from '@/views/model/component/data';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
import { groupBy } from 'lodash';
import { providerList as providerOptions } from '../../items/model/provider-data';
import { relatedObject } from '@/utils/array';
const getSelectModelList = inject('getSelectModelList');
const getModelParamsForm = inject('getModelParamsForm');
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    },
});
const selectedIds = computed({
    get: () => (formValue.value.provider_list || []).map((p) => p.model_id),
    set: (newIds) => {
        const oldList = formValue.value.provider_list || [];
        const newList = newIds.map((id) => {
            const existing = oldList.find((p) => p.model_id === id);
            return existing || { model_id: id, model_params_setting: {} };
        });
        formValue.value.provider_list = newList;
        const currentId = formValue.value.default_value?.model_id;
        if (currentId && !newIds.includes(currentId)) {
            formValue.value.default_value = {};
        }
        // find new model then get it default value
        const oldIds = oldList.map((p) => p.model_id);
        const addedIds = newIds.filter((id) => !oldIds.includes(id));
        addedIds.forEach((id) => {
            fetchDefaultParams(id);
        });
    },
});
const selectedModelsOptions = computed(() => {
    const ids = (formValue.value.provider_list || []).map((p) => p.model_id);
    const filtered = rawModelOptions.value.filter((m) => ids.includes(m.id));
    return groupBy(filtered, 'provider');
});
function fetchDefaultParams(modelId) {
    if (!getModelParamsForm)
        return;
    getModelParamsForm(modelId).then((res) => {
        const formFields = res?.data || [];
        const defaults = (res?.data || [])
            .map((item) => {
            if (item.show_default_value === false) {
                return { [item.field]: undefined };
            }
            else {
                return { [item.field]: item.default_value };
            }
        })
            .reduce((x, y) => ({ ...x, ...y }), {});
        // update to model_params_setting
        const target = formValue.value.provider_list.find((p) => p.model_id === modelId);
        if (target) {
            target.model_params_setting = defaults;
            target.model_form_field = formFields;
        }
    });
}
const AIModeParamSettingDialogRef = ref();
const openParamSetting = () => {
    const dv = formValue.value.default_value;
    if (!dv?.model_id)
        return;
    AIModeParamSettingDialogRef.value?.open(dv.model_id, undefined, dv?.model_params_setting);
};
const handleParamRefresh = (paramData) => {
    const dv = formValue.value.default_value;
    if (dv?.model_id) {
        formValue.value.default_value = { ...dv, model_params_setting: paramData };
        const target = formValue.value.provider_list.find((p) => p.model_id === dv.model_id);
        if (target) {
            target.model_params_setting = paramData;
        }
    }
};
const rawModelOptions = ref([]);
const groupedModelOptions = ref({});
const fetchModelByType = (type) => {
    if (!type || !getSelectModelList)
        return;
    getSelectModelList({ model_type: type }).then((res) => {
        rawModelOptions.value = res?.data || [];
        groupedModelOptions.value = groupBy(res?.data, 'provider');
    });
};
const handleModelTypeChange = (val) => {
    formValue.value.provider_list = [];
    formValue.value.default_value = {};
    if (val) {
        fetchModelByType(val);
    }
    else {
        rawModelOptions.value = [];
        groupedModelOptions.value = {};
    }
};
const getModelInfo = (modelId) => {
    return rawModelOptions.value.find((item) => item.id === modelId);
};
// default_value Assign
const getProviderItem = (modelId) => {
    const found = formValue.value.provider_list.find((p) => p.model_id === modelId);
    if (found) {
        const { model_form_field, ...rest } = found;
        return rest;
    }
    return { model_id: modelId, model_params_setting: {} };
};
const getData = () => {
    const providerList = (formValue.value.provider_list || []).map((p) => {
        const modelInfo = getModelInfo(p.model_id);
        return {
            model_id: p.model_id,
            model_name: modelInfo?.name || '',
            provider: modelInfo?.provider || '',
            model_params_setting: p.model_params_setting || {},
            model_form_field: p.model_form_field || [],
        };
    });
    return {
        input_type: 'Model',
        model_type: formValue.value.model_type,
        default_value: formValue.value.default_value,
        attrs: {
            provider_list: providerList,
        },
    };
};
const rander = (form_data) => {
    formValue.value.model_type = form_data.model_type;
    formValue.value.provider_list = form_data.attrs?.provider_list || [];
    formValue.value.default_value = form_data.default_value || {};
    if (form_data.model_type) {
        fetchModelByType(form_data.model_type);
    }
};
const __VLS_exposed = { getData, rander };
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
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
    required: true,
    prop: "model_type",
    rules: ([{ required: true, message: __VLS_ctx.$t('views.model.modelForm.model_type.requiredMessage') }]),
}));
const __VLS_2 = __VLS_1({
    label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
    required: true,
    prop: "model_type",
    rules: ([{ required: true, message: __VLS_ctx.$t('views.model.modelForm.model_type.requiredMessage') }]),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.formValue.model_type),
    placeholder: (__VLS_ctx.$t('views.model.modelForm.model_type.placeholder')),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.formValue.model_type),
    placeholder: (__VLS_ctx.$t('views.model.modelForm.model_type.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.change} */
    onChange: (__VLS_ctx.handleModelTypeChange),
};
const { default: __VLS_13 } = __VLS_9.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.modelTypeList))) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        key: (item.value),
        label: (item.text),
        value: (item.value),
    }));
    const __VLS_16 = __VLS_15({
        key: (item.value),
        label: (item.text),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    // @ts-ignore
    [$t, $t, $t, formValue, handleModelTypeChange, modelTypeList,];
}
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.optionalModel')),
    required: true,
    prop: "provider_list",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder'),
            type: 'array',
        },
    ]),
}));
const __VLS_21 = __VLS_20({
    label: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.optionalModel')),
    required: true,
    prop: "provider_list",
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder'),
            type: 'array',
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
ModelSelect;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    multiple: true,
    modelValue: (__VLS_ctx.selectedIds),
    placeholder: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder')),
    options: (__VLS_ctx.groupedModelOptions),
    modelType: (__VLS_ctx.formValue.model_type),
}));
const __VLS_27 = __VLS_26({
    multiple: true,
    modelValue: (__VLS_ctx.selectedIds),
    placeholder: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder')),
    options: (__VLS_ctx.groupedModelOptions),
    modelType: (__VLS_ctx.formValue.model_type),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
// @ts-ignore
[$t, $t, $t, formValue, selectedIds, groupedModelOptions,];
var __VLS_22;
if (__VLS_ctx.formValue.provider_list && __VLS_ctx.formValue.provider_list.length > 0) {
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        label: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.defaultModel')),
        prop: "default_value.model_id",
        required: (__VLS_ctx.formValue.required),
        rules: (__VLS_ctx.formValue.required
            ? [
                {
                    required: true,
                    message: __VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder'),
                },
            ]
            : []),
    }));
    const __VLS_32 = __VLS_31({
        label: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.defaultModel')),
        prop: "default_value.model_id",
        required: (__VLS_ctx.formValue.required),
        rules: (__VLS_ctx.formValue.required
            ? [
                {
                    required: true,
                    message: __VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder'),
                },
            ]
            : []),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        modelValue: (__VLS_ctx.formValue.default_value),
        valueKey: "model_id",
        placeholder: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder')),
    }));
    const __VLS_38 = __VLS_37({
        modelValue: (__VLS_ctx.formValue.default_value),
        valueKey: "model_id",
        placeholder: (__VLS_ctx.$t('dynamicsForm.ModelConstructor.modelPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const { default: __VLS_41 } = __VLS_39.slots;
    for (const [modelList, providerName] of __VLS_vFor((__VLS_ctx.selectedModelsOptions))) {
        let __VLS_42;
        /** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
        elOptionGroup;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
            key: (providerName),
            label: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, providerName, 'provider')?.name),
        }));
        const __VLS_44 = __VLS_43({
            key: (providerName),
            label: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, providerName, 'provider')?.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        const { default: __VLS_47 } = __VLS_45.slots;
        for (const [item] of __VLS_vFor((modelList))) {
            let __VLS_48;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
                key: (item.id),
                label: (item.name),
                value: (__VLS_ctx.getProviderItem(item.id)),
            }));
            const __VLS_50 = __VLS_49({
                key: (item.id),
                label: (item.name),
                value: (__VLS_ctx.getProviderItem(item.id)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            const { default: __VLS_53 } = __VLS_51.slots;
            let __VLS_54;
            /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
            elSpace;
            // @ts-ignore
            const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
                size: (8),
            }));
            const __VLS_56 = __VLS_55({
                size: (8),
            }, ...__VLS_functionalComponentArgsRest(__VLS_55));
            const { default: __VLS_59 } = __VLS_57.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                innerHTML: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, providerName, 'provider')?.icon),
                ...{ class: "select-model-icon" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['select-model-icon']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (item.name);
            // @ts-ignore
            [$t, $t, $t, formValue, formValue, formValue, formValue, formValue, selectedModelsOptions, relatedObject, relatedObject, providerOptions, providerOptions, getProviderItem,];
            var __VLS_57;
            // @ts-ignore
            [];
            var __VLS_51;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_45;
        // @ts-ignore
        [];
    }
    {
        const { label: __VLS_60 } = __VLS_39.slots;
        const [{ label, value }] = __VLS_vSlot(__VLS_60);
        if (value?.model_id) {
            let __VLS_61;
            /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
            elSpace;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
                size: (8),
            }));
            const __VLS_63 = __VLS_62({
                size: (8),
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
            const { default: __VLS_66 } = __VLS_64.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "select-model-icon" },
                innerHTML: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, __VLS_ctx.getModelInfo(value.model_id)?.provider, 'provider')
                    ?.icon),
            });
            /** @type {__VLS_StyleScopedClasses['select-model-icon']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (label);
            // @ts-ignore
            [relatedObject, providerOptions, getModelInfo,];
            var __VLS_64;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_39;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
    }));
    const __VLS_69 = __VLS_68({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    let __VLS_72;
    const __VLS_73 = {
        /** @type {typeof __VLS_72.click} */
        onClick: (__VLS_ctx.openParamSetting),
    };
    const __VLS_74 = {
        /** @type {typeof __VLS_72.refreshForm} */
        onRefreshForm: (__VLS_ctx.handleParamRefresh),
    };
    const { default: __VLS_75 } = __VLS_70.slots;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        iconName: "app-operation",
        ...{ class: "color-secondary" },
    }));
    const __VLS_78 = __VLS_77({
        iconName: "app-operation",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [openParamSetting, handleParamRefresh,];
    var __VLS_70;
    var __VLS_71;
    // @ts-ignore
    [];
    var __VLS_33;
}
const __VLS_81 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_83 = __VLS_82({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_86;
const __VLS_87 = {
    /** @type {typeof __VLS_86.refresh} */
    onRefresh: (__VLS_ctx.handleParamRefresh),
};
var __VLS_88;
var __VLS_84;
var __VLS_85;
// @ts-ignore
var __VLS_89 = __VLS_88;
// @ts-ignore
[handleParamRefresh,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
