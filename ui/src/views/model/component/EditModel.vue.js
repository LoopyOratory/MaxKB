/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ProviderApi from '@/api/model/provider';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
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
const providerValue = ref();
const dynamicsFormRef = ref();
const emit = defineEmits(['change', 'submit']);
const loading = ref(false);
const formLoading = ref(false);
const model_type_loading = ref(false);
const base_model_loading = ref(false);
const model_type_list = ref([]);
const modelValue = ref();
const base_model_list = ref([]);
const model_form_field = ref([]);
const dialogVisible = ref(false);
const base_form_data_rule = ref({
    name: {
        required: true,
        trigger: 'blur',
        message: t('views.model.modelForm.modeName.requiredMessage'),
    },
    model_type: {
        required: true,
        trigger: 'change',
        message: t('views.model.modelForm.model_type.requiredMessage'),
    },
    model_name: {
        required: true,
        trigger: 'change',
        message: t('views.model.modelForm.base_model.requiredMessage'),
    },
});
const base_form_data = ref({ name: '', model_type: '', model_name: '' });
const credential_form_data = ref({});
const form_data = computed({
    get: () => {
        return { ...credential_form_data.value, ...base_form_data.value };
    },
    set: (event) => {
        credential_form_data.value = event;
    },
});
const getModelForm = (model_name) => {
    if (providerValue.value) {
        ProviderApi.getModelCreateForm(providerValue.value.provider, form_data.value.model_type, model_name).then((ok) => {
            model_form_field.value = ok.data;
            if (modelValue.value) {
                // RenderDynamicForm
                dynamicsFormRef.value?.render(model_form_field.value, modelValue.value.credential);
            }
        });
    }
};
const list_base_model = (model_type, change) => {
    if (change) {
        base_form_data.value.model_name = '';
    }
    if (providerValue.value) {
        ProviderApi.listBaseModel(providerValue.value.provider, model_type, base_model_loading).then((ok) => {
            base_model_list.value = ok.data;
        });
    }
};
const open = (provider, model) => {
    modelValue.value = model;
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getModelById(model.id, formLoading)
        .then((ok) => {
        modelValue.value = ok.data;
        ProviderApi.listModelType(model.provider, model_type_loading).then((ok) => {
            model_type_list.value = ok.data;
            list_base_model(model.model_type);
        });
        providerValue.value = provider;
        base_form_data.value = {
            name: model.name,
            model_type: model.model_type,
            model_name: model.model_name,
        };
        form_data.value = model.credential;
        getModelForm(model.model_name);
    });
    dialogVisible.value = true;
};
const close = () => {
    base_form_data.value = { name: '', model_type: '', model_name: '' };
    dynamicsFormRef.value?.ruleFormRef?.resetFields();
    credential_form_data.value = {};
    model_form_field.value = [];
    base_model_list.value = [];
    dialogVisible.value = false;
};
const submit = () => {
    dynamicsFormRef.value?.validate().then(() => {
        if (modelValue.value) {
            loadSharedApi({ type: 'model', systemType: apiType.value })
                .updateModel(modelValue.value.id, {
                ...base_form_data.value,
                credential: credential_form_data.value,
            }, loading)
                .then((ok) => {
                MsgSuccess(t('views.model.tip.updateSuccessMessage'));
                close();
                emit('submit');
            });
        }
    });
};
const __VLS_exposed = { open, close };
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
    width: "600px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
    elBreadcrumb;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        separator: ">",
    }));
    const __VLS_10 = __VLS_9({
        separator: ">",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const { default: __VLS_13 } = __VLS_11.slots;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
    elBreadcrumbItem;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({}));
    const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const { default: __VLS_19 } = __VLS_17.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "active-breadcrumb" },
    });
    /** @type {__VLS_StyleScopedClasses['active-breadcrumb']} */ ;
    (`${__VLS_ctx.$t('common.edit')} ${__VLS_ctx.providerValue?.name}`);
    // @ts-ignore
    [dialogVisible, close, $t, providerValue,];
    var __VLS_17;
    // @ts-ignore
    [];
    var __VLS_11;
    // @ts-ignore
    [];
}
const __VLS_20 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.model_form_field),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.model_form_field),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.formLoading) }, null, null);
var __VLS_25;
const { default: __VLS_27 } = __VLS_23.slots;
{
    const { default: __VLS_28 } = __VLS_23.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        prop: "name",
        rules: (__VLS_ctx.base_form_data_rule.name),
    }));
    const __VLS_31 = __VLS_30({
        prop: "name",
        rules: (__VLS_ctx.base_form_data_rule.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    const { default: __VLS_34 } = __VLS_32.slots;
    {
        const { label: __VLS_35 } = __VLS_32.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.model.modelForm.modeName.label'));
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
            effect: "dark",
            placement: "right",
        }));
        const __VLS_38 = __VLS_37({
            effect: "dark",
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        const { default: __VLS_41 } = __VLS_39.slots;
        {
            const { content: __VLS_42 } = __VLS_39.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.modeName.tooltip'));
            // @ts-ignore
            [$t, $t, form_data, form_data, model_form_field, vLoading, formLoading, base_form_data_rule,];
        }
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_45 = __VLS_44({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_39;
        // @ts-ignore
        [];
    }
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        modelValue: (__VLS_ctx.base_form_data.name),
        maxlength: "64",
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('views.model.modelForm.modeName.placeholder')),
    }));
    const __VLS_50 = __VLS_49({
        modelValue: (__VLS_ctx.base_form_data.name),
        maxlength: "64",
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('views.model.modelForm.modeName.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    // @ts-ignore
    [$t, base_form_data,];
    var __VLS_32;
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        prop: "model_type",
        rules: (__VLS_ctx.base_form_data_rule.model_type),
    }));
    const __VLS_55 = __VLS_54({
        prop: "model_type",
        rules: (__VLS_ctx.base_form_data_rule.model_type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    const { default: __VLS_58 } = __VLS_56.slots;
    {
        const { label: __VLS_59 } = __VLS_56.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.model.modelForm.model_type.label'));
        // @ts-ignore
        [$t, base_form_data_rule,];
    }
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        ...{ 'onChange': {} },
        disabled: true,
        modelValue: (__VLS_ctx.base_form_data.model_type),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.model_type.placeholder')),
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onChange': {} },
        disabled: true,
        modelValue: (__VLS_ctx.base_form_data.model_type),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.model_type.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_65;
    const __VLS_66 = {
        /** @type {typeof __VLS_65.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.list_base_model($event, true);
            // @ts-ignore
            [$t, base_form_data, list_base_model,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.model_type_loading) }, null, null);
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-2']} */ ;
    const { default: __VLS_67 } = __VLS_63.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.model_type_list))) {
        let __VLS_68;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
            key: (item.value),
            label: (item.key),
            value: (item.value),
        }));
        const __VLS_70 = __VLS_69({
            key: (item.value),
            label: (item.key),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        // @ts-ignore
        [vLoading, model_type_loading, model_type_list,];
    }
    // @ts-ignore
    [];
    var __VLS_63;
    var __VLS_64;
    // @ts-ignore
    [];
    var __VLS_56;
    let __VLS_73;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
        prop: "model_name",
        rules: (__VLS_ctx.base_form_data_rule.model_name),
    }));
    const __VLS_75 = __VLS_74({
        prop: "model_name",
        rules: (__VLS_ctx.base_form_data_rule.model_name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    const { default: __VLS_78 } = __VLS_76.slots;
    {
        const { label: __VLS_79 } = __VLS_76.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.model.modelForm.base_model.label'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger ml-4" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.$t('views.model.modelForm.base_model.tooltip'));
        // @ts-ignore
        [$t, $t, base_form_data_rule,];
    }
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.base_form_data.model_name),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.base_model.requiredMessage')),
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.base_form_data.model_name),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.base_model.requiredMessage')),
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_85;
    const __VLS_86 = {
        /** @type {typeof __VLS_85.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.getModelForm($event);
            // @ts-ignore
            [$t, base_form_data, getModelForm,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.base_model_loading) }, null, null);
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-2']} */ ;
    const { default: __VLS_87 } = __VLS_83.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.base_model_list))) {
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            key: (item.name),
            value: (item.name),
        }));
        const __VLS_90 = __VLS_89({
            key: (item.name),
            value: (item.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        const { default: __VLS_93 } = __VLS_91.slots;
        {
            const { default: __VLS_94 } = __VLS_91.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (item.name);
            if (item.desc) {
                let __VLS_95;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
                    effect: "dark",
                    placement: "right",
                }));
                const __VLS_97 = __VLS_96({
                    effect: "dark",
                    placement: "right",
                }, ...__VLS_functionalComponentArgsRest(__VLS_96));
                const { default: __VLS_100 } = __VLS_98.slots;
                {
                    const { content: __VLS_101 } = __VLS_98.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
                    (item.desc);
                    // @ts-ignore
                    [vLoading, base_model_loading, base_model_list,];
                }
                let __VLS_102;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }));
                const __VLS_104 = __VLS_103({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_103));
                /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
                // @ts-ignore
                [];
                var __VLS_98;
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_91;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_83;
    var __VLS_84;
    // @ts-ignore
    [];
    var __VLS_76;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_23;
{
    const { footer: __VLS_107 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_113;
    const __VLS_114 = {
        /** @type {typeof __VLS_113.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_115 } = __VLS_111.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [close, $t,];
    var __VLS_111;
    var __VLS_112;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_121;
    const __VLS_122 = {
        /** @type {typeof __VLS_121.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_123 } = __VLS_119.slots;
    (__VLS_ctx.$t('common.modify'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_119;
    var __VLS_120;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_26 = __VLS_25;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
