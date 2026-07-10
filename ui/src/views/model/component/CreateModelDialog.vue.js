/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ProviderApi from '@/api/model/provider';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import AddParamDrawer from '@/views/model/component/AddParamDrawer.vue';
import { input_type_list } from '@/components/dynamics-form/constructor/data';
import { MsgError, MsgSuccess, MsgWarning } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
const route = useRoute();
const { user } = useStore();
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
const model_type_loading = ref(false);
const base_model_loading = ref(false);
const model_type_list = ref([]);
const base_model_list = ref();
const model_form_field = ref([]);
const dialogVisible = ref(false);
const activeName = ref('base-info');
const AddParamRef = ref();
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
const base_form_data = ref({ name: '', model_type: '', model_name: '', model_params_form: [] });
const credential_form_data = ref({});
const form_data = computed({
    get: () => {
        return {
            ...credential_form_data.value,
            name: base_form_data.value.name,
            model_type: base_form_data.value.model_type,
            model_name: base_form_data.value.model_name,
            model_params_form: base_form_data.value.model_params_form,
        };
    },
    set: (event) => {
        credential_form_data.value = event;
    },
});
const getModelForm = (model_name) => {
    if (!form_data.value.model_type) {
        MsgWarning(t('views.model.modelForm.model_type.requiredMessage'));
        base_form_data.value.model_name = '';
        return;
    }
    if (providerValue.value) {
        ProviderApi.getModelCreateForm(providerValue.value.provider, form_data.value.model_type, model_name).then((ok) => {
            model_form_field.value = ok.data;
            // RenderDynamicForm
            dynamicsFormRef.value?.render(model_form_field.value, undefined);
        });
        ProviderApi.listBaseModelParamsForm(providerValue.value.provider, form_data.value.model_type, model_name, base_model_loading).then((ok) => {
            base_form_data.value.model_params_form = ok.data;
        });
    }
};
const open = (provider, model_type) => {
    ProviderApi.listModelType(provider.provider, model_type_loading).then((ok) => {
        model_type_list.value = ok.data;
    });
    providerValue.value = provider;
    dialogVisible.value = true;
    base_form_data.value.model_type = model_type || '';
    activeName.value = 'base-info';
    if (model_type) {
        list_base_model(model_type);
    }
};
const list_base_model = (model_type, change) => {
    if (change) {
        base_form_data.value.model_name = '';
        base_form_data.value.model_params_form = [];
    }
    if (providerValue.value) {
        ProviderApi.listBaseModel(providerValue.value.provider, model_type, base_model_loading).then((ok) => {
            base_model_list.value = ok.data;
        });
    }
};
const close = () => {
    base_form_data.value = {
        name: '',
        model_type: '',
        model_name: '',
        model_params_form: [],
    };
    credential_form_data.value = {};
    model_form_field.value = [];
    base_model_list.value = [];
    loading.value = false;
    dialogVisible.value = false;
};
const submit = () => {
    dynamicsFormRef.value
        ?.validate()
        .then(() => {
        if (providerValue.value) {
            loadSharedApi({ type: 'model', systemType: apiType.value })
                .createModel({
                ...base_form_data.value,
                credential: credential_form_data.value,
                provider: providerValue.value.provider,
            }, loading)
                .then((ok) => {
                close();
                MsgSuccess(t('views.model.tip.createSuccessMessage'));
                emit('submit');
                return user.profile();
            });
        }
    })
        .catch(() => {
        MsgError(t('views.model.tip.createErrorMessage'));
    });
};
function openAddDrawer(data, index) {
    AddParamRef.value?.open(data, index);
}
function deleteParam(index) {
    base_form_data.value.model_params_form.splice(index, 1);
}
function refresh(data, index) {
    for (let i = 0; i < base_form_data.value.model_params_form.length; i++) {
        const field = base_form_data.value.model_params_form[i].field;
        let label = base_form_data.value.model_params_form[i].label;
        if (label && label.input_type === 'TooltipLabel') {
            label = label.label;
        }
        let label2 = data.label;
        if (label2 && label2.input_type === 'TooltipLabel') {
            label2 = label2.label;
        }
        if (field === data.field && index !== i) {
            MsgError(t('views.model.tip.errorMessage') + data.field);
            return;
        }
        if (label === label2 && index !== i) {
            MsgError(t('views.model.tip.errorMessage') + label);
            return;
        }
    }
    if (index !== null) {
        base_form_data.value.model_params_form.splice(index, 1, data);
    }
    else {
        base_form_data.value.model_params_form.push(data);
    }
}
const toSelectProvider = () => {
    close();
    emit('change');
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
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
    elBreadcrumb;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        separator: ">",
    }));
    const __VLS_9 = __VLS_8({
        separator: ">",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
    elBreadcrumbItem;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onClick: (__VLS_ctx.toSelectProvider) },
        ...{ class: "select-provider" },
    });
    /** @type {__VLS_StyleScopedClasses['select-provider']} */ ;
    (__VLS_ctx.$t('views.model.providerPlaceholder'));
    // @ts-ignore
    [dialogVisible, close, toSelectProvider, $t,];
    var __VLS_16;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
    elBreadcrumbItem;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "active-breadcrumb" },
    });
    /** @type {__VLS_StyleScopedClasses['active-breadcrumb']} */ ;
    (`${__VLS_ctx.$t('common.add')} ${__VLS_ctx.providerValue?.name}`);
    // @ts-ignore
    [$t, providerValue,];
    var __VLS_22;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
}
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.activeName),
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.activeName),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    label: (__VLS_ctx.$t('views.model.modelForm.title.baseInfo')),
    name: "base-info",
}));
const __VLS_33 = __VLS_32({
    label: (__VLS_ctx.$t('views.model.modelForm.title.baseInfo')),
    name: "base-info",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_36 } = __VLS_34.slots;
const __VLS_37 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.model_form_field),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "mb-24" },
    labelWidth: "auto",
}));
const __VLS_39 = __VLS_38({
    modelValue: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.model_form_field),
    model: (__VLS_ctx.form_data),
    ref: "dynamicsFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "mb-24" },
    labelWidth: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
var __VLS_42;
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
const { default: __VLS_44 } = __VLS_40.slots;
{
    const { default: __VLS_45 } = __VLS_40.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        prop: "name",
        rules: (__VLS_ctx.base_form_data_rule.name),
    }));
    const __VLS_48 = __VLS_47({
        prop: "name",
        rules: (__VLS_ctx.base_form_data_rule.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    const { default: __VLS_51 } = __VLS_49.slots;
    {
        const { label: __VLS_52 } = __VLS_49.slots;
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
        let __VLS_53;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
            effect: "dark",
            placement: "right",
        }));
        const __VLS_55 = __VLS_54({
            effect: "dark",
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        const { default: __VLS_58 } = __VLS_56.slots;
        {
            const { content: __VLS_59 } = __VLS_56.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.modeName.tooltip'));
            // @ts-ignore
            [$t, $t, $t, activeName, form_data, form_data, model_form_field, base_form_data_rule,];
        }
        let __VLS_60;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_62 = __VLS_61({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_56;
        // @ts-ignore
        [];
    }
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        modelValue: (__VLS_ctx.base_form_data.name),
        maxlength: "64",
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('views.model.modelForm.modeName.placeholder')),
    }));
    const __VLS_67 = __VLS_66({
        modelValue: (__VLS_ctx.base_form_data.name),
        maxlength: "64",
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('views.model.modelForm.modeName.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    // @ts-ignore
    [$t, base_form_data,];
    var __VLS_49;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        prop: "model_type",
        rules: (__VLS_ctx.base_form_data_rule.model_type),
    }));
    const __VLS_72 = __VLS_71({
        prop: "model_type",
        rules: (__VLS_ctx.base_form_data_rule.model_type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    {
        const { label: __VLS_76 } = __VLS_73.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.model.modelForm.model_type.label'));
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            effect: "dark",
            placement: "right",
        }));
        const __VLS_79 = __VLS_78({
            effect: "dark",
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        const { default: __VLS_82 } = __VLS_80.slots;
        {
            const { content: __VLS_83 } = __VLS_80.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip1'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip2'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip3'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip4'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip5'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip6'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip7'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip8'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (__VLS_ctx.$t('views.model.modelForm.model_type.tooltip9'));
            // @ts-ignore
            [$t, $t, $t, $t, $t, $t, $t, $t, $t, $t, base_form_data_rule,];
        }
        let __VLS_84;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_86 = __VLS_85({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_80;
        // @ts-ignore
        [];
    }
    let __VLS_89;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.base_form_data.model_type),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.model_type.placeholder')),
    }));
    const __VLS_91 = __VLS_90({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.base_form_data.model_type),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.model_type.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    let __VLS_94;
    const __VLS_95 = {
        /** @type {typeof __VLS_94.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.list_base_model($event, true);
            // @ts-ignore
            [$t, base_form_data, list_base_model,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.model_type_loading) }, null, null);
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-2']} */ ;
    const { default: __VLS_96 } = __VLS_92.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.model_type_list))) {
        let __VLS_97;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
            key: (item.value),
            label: (item.key),
            value: (item.value),
        }));
        const __VLS_99 = __VLS_98({
            key: (item.value),
            label: (item.key),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        // @ts-ignore
        [vLoading, model_type_loading, model_type_list,];
    }
    // @ts-ignore
    [];
    var __VLS_92;
    var __VLS_93;
    // @ts-ignore
    [];
    var __VLS_73;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        prop: "model_name",
        rules: (__VLS_ctx.base_form_data_rule.model_name),
    }));
    const __VLS_104 = __VLS_103({
        prop: "model_name",
        rules: (__VLS_ctx.base_form_data_rule.model_name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    const { default: __VLS_107 } = __VLS_105.slots;
    {
        const { label: __VLS_108 } = __VLS_105.slots;
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
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.$t('views.model.modelForm.base_model.tooltip'));
        // @ts-ignore
        [$t, $t, base_form_data_rule,];
    }
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.base_form_data.model_name),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.base_model.placeholder')),
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }));
    const __VLS_111 = __VLS_110({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.base_form_data.model_name),
        ...{ class: "w-full m-2" },
        placeholder: (__VLS_ctx.$t('views.model.modelForm.base_model.placeholder')),
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    let __VLS_114;
    const __VLS_115 = {
        /** @type {typeof __VLS_114.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.getModelForm($event);
            // @ts-ignore
            [$t, base_form_data, getModelForm,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.base_model_loading) }, null, null);
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-2']} */ ;
    const { default: __VLS_116 } = __VLS_112.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.base_model_list))) {
        let __VLS_117;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            key: (item.name),
            value: (item.name),
        }));
        const __VLS_119 = __VLS_118({
            key: (item.name),
            value: (item.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        const { default: __VLS_122 } = __VLS_120.slots;
        {
            const { default: __VLS_123 } = __VLS_120.slots;
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
                let __VLS_124;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
                    effect: "dark",
                    placement: "right",
                }));
                const __VLS_126 = __VLS_125({
                    effect: "dark",
                    placement: "right",
                }, ...__VLS_functionalComponentArgsRest(__VLS_125));
                const { default: __VLS_129 } = __VLS_127.slots;
                {
                    const { content: __VLS_130 } = __VLS_127.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                        ...{ class: "w-280" },
                    });
                    /** @type {__VLS_StyleScopedClasses['w-280']} */ ;
                    (item.desc);
                    // @ts-ignore
                    [vLoading, base_model_loading, base_model_list,];
                }
                let __VLS_131;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }));
                const __VLS_133 = __VLS_132({
                    iconName: "app-warning",
                    ...{ class: "app-warning-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_132));
                /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
                // @ts-ignore
                [];
                var __VLS_127;
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_120;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_112;
    var __VLS_113;
    // @ts-ignore
    [];
    var __VLS_105;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_40;
// @ts-ignore
[];
var __VLS_34;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
elTabPane;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    label: (__VLS_ctx.$t('views.model.modelForm.title.advancedInfo')),
    name: "advanced-info",
}));
const __VLS_138 = __VLS_137({
    label: (__VLS_ctx.$t('views.model.modelForm.title.advancedInfo')),
    name: "advanced-info",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
if (!__VLS_ctx.base_form_data.model_type || !__VLS_ctx.base_form_data.model_name) {
    let __VLS_142;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
        description: (__VLS_ctx.$t('views.model.tip.emptyMessage1')),
    }));
    const __VLS_144 = __VLS_143({
        description: (__VLS_ctx.$t('views.model.tip.emptyMessage1')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
}
else if (__VLS_ctx.base_form_data.model_type === 'RERANKER') {
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        description: (__VLS_ctx.$t('views.model.tip.emptyMessage2')),
    }));
    const __VLS_149 = __VLS_148({
        description: (__VLS_ctx.$t('views.model.tip.emptyMessage2')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({});
    (__VLS_ctx.$t('views.model.modelForm.title.modelParams'));
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        ...{ 'onClick': {} },
        type: "text",
        disabled: (!['TTS', 'LLM', 'IMAGE', 'TTI', 'TTV', 'ITV', 'STT', 'EMBEDDING'].includes(__VLS_ctx.base_form_data.model_type)),
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onClick': {} },
        type: "text",
        disabled: (!['TTS', 'LLM', 'IMAGE', 'TTI', 'TTV', 'ITV', 'STT', 'EMBEDDING'].includes(__VLS_ctx.base_form_data.model_type)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_157;
    const __VLS_158 = {
        /** @type {typeof __VLS_157.click} */
        onClick: (...[$event]) => {
            if (!!(!__VLS_ctx.base_form_data.model_type || !__VLS_ctx.base_form_data.model_name))
                throw 0;
            if (!!(__VLS_ctx.base_form_data.model_type === 'RERANKER'))
                throw 0;
            return __VLS_ctx.openAddDrawer();
            // @ts-ignore
            [$t, $t, $t, $t, base_form_data, base_form_data, base_form_data, base_form_data, openAddDrawer,];
        },
    };
    const { default: __VLS_159 } = __VLS_155.slots;
    let __VLS_160;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_162 = __VLS_161({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t,];
    var __VLS_155;
    var __VLS_156;
}
if (__VLS_ctx.base_form_data.model_params_form?.length > 0 && __VLS_ctx.base_form_data.model_type !== 'RERANKER') {
    let __VLS_165;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        data: (__VLS_ctx.base_form_data.model_params_form),
        ...{ class: "mb-16" },
    }));
    const __VLS_167 = __VLS_166({
        data: (__VLS_ctx.base_form_data.model_params_form),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_170 } = __VLS_168.slots;
    let __VLS_171;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        prop: "label",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
        showOverflowTooltip: true,
    }));
    const __VLS_173 = __VLS_172({
        prop: "label",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    const { default: __VLS_176 } = __VLS_174.slots;
    {
        const { default: __VLS_177 } = __VLS_174.slots;
        const [{ row }] = __VLS_vSlot(__VLS_177);
        if (row.label && row.label.input_type === 'TooltipLabel') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (row.label.label);
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (row.label);
        }
        // @ts-ignore
        [$t, base_form_data, base_form_data, base_form_data,];
    }
    // @ts-ignore
    [];
    var __VLS_174;
    let __VLS_178;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
        prop: "field",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        showOverflowTooltip: true,
        width: "95px",
    }));
    const __VLS_180 = __VLS_179({
        prop: "field",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        showOverflowTooltip: true,
        width: "95px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    let __VLS_183;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        width: "110px",
    }));
    const __VLS_185 = __VLS_184({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        width: "110px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    const { default: __VLS_188 } = __VLS_186.slots;
    {
        const { default: __VLS_189 } = __VLS_186.slots;
        const [{ row }] = __VLS_vSlot(__VLS_189);
        let __VLS_190;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_192 = __VLS_191({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_191));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_195 } = __VLS_193.slots;
        (__VLS_ctx.input_type_list.find((item) => item.value === row.input_type)?.label);
        // @ts-ignore
        [$t, $t, input_type_list,];
        var __VLS_193;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_186;
    let __VLS_196;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
        prop: "default_value",
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
        showOverflowTooltip: true,
    }));
    const __VLS_198 = __VLS_197({
        prop: "default_value",
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_201;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
        label: (__VLS_ctx.$t('common.required')),
    }));
    const __VLS_203 = __VLS_202({
        label: (__VLS_ctx.$t('common.required')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    const { default: __VLS_206 } = __VLS_204.slots;
    {
        const { default: __VLS_207 } = __VLS_204.slots;
        const [{ row }] = __VLS_vSlot(__VLS_207);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
        });
        let __VLS_208;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
            disabled: true,
            size: "small",
            modelValue: (row.required),
        }));
        const __VLS_210 = __VLS_209({
            disabled: true,
            size: "small",
            modelValue: (row.required),
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        // @ts-ignore
        [$t, $t,];
    }
    // @ts-ignore
    [];
    var __VLS_204;
    let __VLS_213;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "90",
    }));
    const __VLS_215 = __VLS_214({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    const { default: __VLS_218 } = __VLS_216.slots;
    {
        const { default: __VLS_219 } = __VLS_216.slots;
        const [{ row, $index }] = __VLS_vSlot(__VLS_219);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_220;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }));
        const __VLS_222 = __VLS_221({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        const { default: __VLS_225 } = __VLS_223.slots;
        let __VLS_226;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_228 = __VLS_227({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_227));
        let __VLS_231;
        const __VLS_232 = {
            /** @type {typeof __VLS_231.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.base_form_data.model_params_form?.length > 0 && __VLS_ctx.base_form_data.model_type !== 'RERANKER'))
                    throw 0;
                return __VLS_ctx.openAddDrawer(row, $index);
                // @ts-ignore
                [$t, $t, openAddDrawer,];
            },
        };
        const { default: __VLS_233 } = __VLS_229.slots;
        let __VLS_234;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
            iconName: "app-edit",
        }));
        const __VLS_236 = __VLS_235({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_235));
        // @ts-ignore
        [];
        var __VLS_229;
        var __VLS_230;
        // @ts-ignore
        [];
        var __VLS_223;
        let __VLS_239;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }));
        const __VLS_241 = __VLS_240({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_240));
        const { default: __VLS_244 } = __VLS_242.slots;
        let __VLS_245;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_247 = __VLS_246({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_246));
        let __VLS_250;
        const __VLS_251 = {
            /** @type {typeof __VLS_250.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.base_form_data.model_params_form?.length > 0 && __VLS_ctx.base_form_data.model_type !== 'RERANKER'))
                    throw 0;
                return __VLS_ctx.deleteParam($index);
                // @ts-ignore
                [$t, deleteParam,];
            },
        };
        const { default: __VLS_252 } = __VLS_248.slots;
        let __VLS_253;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
            iconName: "app-delete",
        }));
        const __VLS_255 = __VLS_254({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_254));
        // @ts-ignore
        [];
        var __VLS_248;
        var __VLS_249;
        // @ts-ignore
        [];
        var __VLS_242;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_216;
    // @ts-ignore
    [];
    var __VLS_168;
}
// @ts-ignore
[];
var __VLS_139;
// @ts-ignore
[];
var __VLS_28;
{
    const { footer: __VLS_258 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_259;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
        ...{ 'onClick': {} },
    }));
    const __VLS_261 = __VLS_260({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    let __VLS_264;
    const __VLS_265 = {
        /** @type {typeof __VLS_264.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_266 } = __VLS_262.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [close, $t,];
    var __VLS_262;
    var __VLS_263;
    let __VLS_267;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_269 = __VLS_268({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_268));
    let __VLS_272;
    const __VLS_273 = {
        /** @type {typeof __VLS_272.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_274 } = __VLS_270.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_270;
    var __VLS_271;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
const __VLS_275 = AddParamDrawer;
// @ts-ignore
const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({
    ...{ 'onRefresh': {} },
    ref: "AddParamRef",
}));
const __VLS_277 = __VLS_276({
    ...{ 'onRefresh': {} },
    ref: "AddParamRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_276));
let __VLS_280;
const __VLS_281 = {
    /** @type {typeof __VLS_280.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_282;
var __VLS_278;
var __VLS_279;
// @ts-ignore
var __VLS_43 = __VLS_42, __VLS_283 = __VLS_282;
// @ts-ignore
[refresh,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
