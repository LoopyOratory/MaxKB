/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, reactive, ref, watch } from 'vue';
const props = withDefaults(defineProps(), {
    needAddButton: true
});
const formRef = ref();
const formItem = {};
const form = defineModel('form', {
    default: () => [],
});
const loadingStates = reactive({});
const selectedRoles = computed(() => {
    return form.value.map((item) => item.role_id);
});
function getOptions(element, model) {
    const dynamicOptions = element[`_${model.path}_options`];
    // Check whether dynamic options have already been set (include empty array)
    if (element.hasOwnProperty(`_${model.path}_options`)) {
        return dynamicOptions;
    }
    return model.selectProps?.options || [];
}
function getSelectProps(model) {
    const { options, ...restProps } = model.selectProps || {};
    return restProps;
}
async function handleRemoteSearch(query, element, model) {
    if (!model.selectProps?.remoteMethod) {
        return;
    }
    const key = `${form.value.indexOf(element)}-${model.path}`;
    loadingStates[key] = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        element[`_${model.path}_options`] = await model.selectProps.remoteMethod(query, element);
    }
    catch (error) {
        console.error('Remote search failed:', error);
        element[`_${model.path}_options`] = [];
    }
    finally {
        loadingStates[key] = false;
    }
}
async function filterLocalOptions(query, element, model) {
    const options = model.selectProps?.options || [];
    element[`_${model.path}_options`] = options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));
}
function handleAdd() {
    form.value.push({ ...formItem });
}
watch(() => props.models, () => {
    props.models.forEach((e) => {
        formItem[e.path] = [];
    });
}, { immediate: true });
function handleDelete(index) {
    form.value.splice(index, 1);
}
const validate = () => {
    if (formRef.value) {
        return formRef.value?.validate();
    }
    return Promise.resolve();
};
const resetValidation = () => {
    if (formRef.value) {
        formRef.value.clearValidate();
    }
};
const __VLS_exposed = { validate, resetValidation };
defineExpose(__VLS_exposed);
const __VLS_defaultModels = {
    'form': () => [],
};
let __VLS_modelEmit;
const __VLS_defaults = {
    needAddButton: true
};
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
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.form),
    ref: "formRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.form),
    ref: "formRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
for (const [element, index] of __VLS_vFor((__VLS_ctx.form))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (index),
        ...{ class: "flex w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    for (const [model] of __VLS_vFor((props.models))) {
        let __VLS_14;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            key: (model.path),
            prop: (`[${String(index)}].${model.path}`),
            rules: (model.rules),
            label: (index === 0 && model.label ? model.label : ''),
            ...{ class: "mr-8" },
            ...{ style: {} },
        }));
        const __VLS_16 = __VLS_15({
            key: (model.path),
            prop: (`[${String(index)}].${model.path}`),
            rules: (model.rules),
            label: (index === 0 && model.label ? model.label : ''),
            ...{ class: "mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_19 } = __VLS_17.slots;
        if (!model?.hidden?.(element)) {
            let __VLS_20;
            /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
            elSelect;
            // @ts-ignore
            const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
                modelValue: (element[model.path]),
                placeholder: (model.selectProps?.placeholder ?? __VLS_ctx.$t('common.selectPlaceholder')),
                clearable: (model.selectProps?.clearableFunction
                    ? model.selectProps?.clearableFunction?.(element)
                    : true),
                filterable: true,
                remote: true,
                remoteMethod: ((query) => __VLS_ctx.handleRemoteSearch(query, element, model)),
                filterMethod: (!model.selectProps?.remoteMethod ? (query) => __VLS_ctx.filterLocalOptions(query, element, model) : undefined),
                loading: (__VLS_ctx.loadingStates[`${String(index)}-${model.path}`]),
                multiple: true,
                reserveKeyword: (false),
                ...{ style: {} },
                collapseTags: true,
                collapseTagsTooltip: true,
                ...(__VLS_ctx.getSelectProps(model)),
            }));
            const __VLS_22 = __VLS_21({
                modelValue: (element[model.path]),
                placeholder: (model.selectProps?.placeholder ?? __VLS_ctx.$t('common.selectPlaceholder')),
                clearable: (model.selectProps?.clearableFunction
                    ? model.selectProps?.clearableFunction?.(element)
                    : true),
                filterable: true,
                remote: true,
                remoteMethod: ((query) => __VLS_ctx.handleRemoteSearch(query, element, model)),
                filterMethod: (!model.selectProps?.remoteMethod ? (query) => __VLS_ctx.filterLocalOptions(query, element, model) : undefined),
                loading: (__VLS_ctx.loadingStates[`${String(index)}-${model.path}`]),
                multiple: true,
                reserveKeyword: (false),
                ...{ style: {} },
                collapseTags: true,
                collapseTagsTooltip: true,
                ...(__VLS_ctx.getSelectProps(model)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_21));
            const { default: __VLS_25 } = __VLS_23.slots;
            for (const [opt] of __VLS_vFor((__VLS_ctx.getOptions(element, model)))) {
                let __VLS_26;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
                    key: (opt.value),
                    label: (opt.label),
                    value: (opt.value),
                    disabled: (__VLS_ctx.selectedRoles.includes(opt.value)),
                }));
                const __VLS_28 = __VLS_27({
                    key: (opt.value),
                    label: (opt.label),
                    value: (opt.value),
                    disabled: (__VLS_ctx.selectedRoles.includes(opt.value)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_27));
                const { default: __VLS_31 } = __VLS_29.slots;
                let __VLS_32;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                    effect: "dark",
                    content: (opt.label),
                    placement: "top",
                    showAfter: (500),
                }));
                const __VLS_34 = __VLS_33({
                    effect: "dark",
                    content: (opt.label),
                    placement: "top",
                    showAfter: (500),
                }, ...__VLS_functionalComponentArgsRest(__VLS_33));
                const { default: __VLS_37 } = __VLS_35.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "ellipsis" },
                    ...{ style: {} },
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
                (opt.label);
                // @ts-ignore
                [form, form, $t, handleRemoteSearch, filterLocalOptions, loadingStates, getSelectProps, getOptions, selectedRoles,];
                var __VLS_35;
                // @ts-ignore
                [];
                var __VLS_29;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_23;
        }
        // @ts-ignore
        [];
        var __VLS_17;
        // @ts-ignore
        [];
    }
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        ...{ 'onClick': {} },
        disabled: ((props.keepOneLine && __VLS_ctx.form.length === 1) || props.deleteButtonDisabled?.(element)),
        text: true,
        ...{ style: ({
                'margin-top': index === 0 && props.models.some((item) => item.label) ? '32px' : '2px',
            }) },
    }));
    const __VLS_40 = __VLS_39({
        ...{ 'onClick': {} },
        disabled: ((props.keepOneLine && __VLS_ctx.form.length === 1) || props.deleteButtonDisabled?.(element)),
        text: true,
        ...{ style: ({
                'margin-top': index === 0 && props.models.some((item) => item.label) ? '32px' : '2px',
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    const __VLS_44 = {
        /** @type {typeof __VLS_43.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.handleDelete(index);
            // @ts-ignore
            [form, handleDelete,];
        },
    };
    const { default: __VLS_45 } = __VLS_41.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        iconName: "app-delete",
    }));
    const __VLS_48 = __VLS_47({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [];
    var __VLS_41;
    var __VLS_42;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_11;
if (__VLS_ctx.needAddButton) {
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        ...{ class: "mt-2" },
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        ...{ class: "mt-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (__VLS_ctx.handleAdd),
    };
    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
    const { default: __VLS_58 } = __VLS_54.slots;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_61 = __VLS_60({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (props.addText ?? __VLS_ctx.$t('views.role.member.add'));
    // @ts-ignore
    [$t, needAddButton, handleAdd,];
    var __VLS_54;
    var __VLS_55;
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
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
