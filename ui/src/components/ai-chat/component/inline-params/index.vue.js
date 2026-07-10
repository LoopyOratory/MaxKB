/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed, onMounted } from 'vue';
import { computeVisibilityMap } from '@/components/dynamics-form/visibility';
import InlineFormItem from './InlineFormItem.vue';
import { t } from '@/locales';
import _ from 'lodash';
import { MsgWarning } from '@/utils/message';
const props = defineProps();
const emit = defineEmits(['update:formData', 'openDialog']);
const triggerBtnRef = ref();
const fieldList = ref([]);
const formValue = ref({});
const setting = ref({
    exposed_fields: [],
    menu_title: t('common.moreSettings'),
});
watch(formValue, () => {
    emit('update:formData', formValue.value);
}, { deep: true });
watch(() => props.formData, (val) => {
    if (val && JSON.stringify(val) !== JSON.stringify(formValue.value)) {
        formValue.value = val;
        for (const field of fieldList.value) {
            if (field.default_value !== undefined &&
                field.default_value !== null &&
                (formValue.value[field.field] === undefined || formValue.value[field.field] === null) &&
                (field.show_default_value === true || field.show_default_value === undefined)) {
                formValue.value[field.field] = field.default_value;
            }
        }
    }
}, { immediate: true, deep: true });
watch(() => props.application, () => {
    handleInputFieldList();
});
function handleInputFieldList() {
    props.application?.work_flow?.nodes
        ?.filter((v) => v.id === 'base-node')
        .map((v) => {
        fieldList.value = v.properties.user_input_field_list
            ? v.properties.user_input_field_list.map((v) => {
                let field;
                switch (v.type) {
                    case 'input':
                        field = {
                            field: v.variable,
                            input_type: 'TextInput',
                            label: v.name,
                            default_value: v.default_value,
                            required: v.is_required,
                        };
                        break;
                    case 'select':
                        field = {
                            field: v.variable,
                            input_type: 'SingleSelect',
                            label: v.name,
                            default_value: v.default_value,
                            required: v.is_required,
                            option_list: v.optionList.map((o) => ({ key: o, value: o })),
                        };
                        break;
                    case 'date':
                        field = {
                            field: v.variable,
                            input_type: 'DatePicker',
                            label: v.name,
                            default_value: v.default_value,
                            required: v.is_required,
                            attrs: {
                                format: 'YYYY-MM-DD HH:mm:ss',
                                'value-format': 'YYYY-MM-DD HH:mm:ss',
                                type: 'datetime',
                            },
                        };
                        break;
                    default:
                        field = { ...v };
                        break;
                }
                const isEmpty = !field.default_value ||
                    (Array.isArray(field.default_value) && field.default_value.length === 0) ||
                    (typeof field.default_value === 'object' &&
                        Object.keys(field.default_value).length === 0);
                if (isEmpty) {
                    const label = typeof field.label === 'string' ? field.label : field.label?.label || field.field;
                    const truncated = label.length > 5 ? label.slice(0, 5) + '…' : label;
                    field.attrs = { ...field.attrs, placeholder: truncated };
                }
                field.attrs = {
                    ...field.attrs,
                    popperHeader: {
                        label: typeof field.label === 'string' ? field.label : field.label?.label || field.field,
                        required: field.required,
                        tooltip: typeof field.label === 'object' ? field.label?.attrs?.tooltip : undefined,
                    },
                };
                return field;
            })
            : [];
        setting.value = v.properties.user_input_field_list_setting || {
            exposed_fields: [],
            menu_title: t('common.moreSettings'),
        };
    });
}
const exposedFields = computed(() => {
    if (setting.value.exposed_fields.length === 0)
        return [];
    return setting.value.exposed_fields
        .map((field) => fieldList.value.find((f) => f.field === field))
        .filter(Boolean)
        .slice(0, props.maxExposed ?? 3);
});
const dialogFields = computed(() => {
    const inlineKeys = new Set(exposedFields.value.map((f) => f.field));
    return fieldList.value.filter((f) => !inlineKeys.has(f.field));
});
const visibilityMap = computed(() => computeVisibilityMap(fieldList.value, formValue.value));
const show = (field) => {
    if (field.relation_show_field_dict) {
        const keys = Object.keys(field.relation_show_field_dict);
        for (const index in keys) {
            const key = keys[index];
            const v = _.get(formValue.value, key);
            if (v && v !== undefined && v !== null) {
                const values = field.relation_show_field_dict[key];
                if (values && values.length > 0) {
                    return values.includes(v);
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    }
    if (field.visibility_rules?.node_id) {
        return visibilityMap.value[field.field] ?? true;
    }
    return true;
};
const __VLS_exposed = {
    triggerBtnRef,
    validate: () => {
        for (const field of fieldList.value) {
            if (!show(field)) {
                formValue.value[field.field] = null;
            }
        }
        for (const item of exposedFields.value) {
            if (!show(item))
                continue;
            const isRequired = item.required ?? item.is_required;
            if (isRequired) {
                const value = formValue.value[item.field];
                const isEmpty = value === undefined ||
                    value === null ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0) ||
                    (typeof value === 'object' && Object.keys(value).length === 0);
                if (isEmpty) {
                    const name = typeof item.label === 'string' ? item.label : item.label?.label || item.field;
                    MsgWarning(`${name} is a required field`);
                    return Promise.reject(false);
                }
            }
        }
        return Promise.resolve(true);
    },
};
defineExpose(__VLS_exposed);
const change = (field, value) => {
    formValue.value[field.field] = value;
};
const trigger = (trigger_field, trigger_value, trigger_setting, self, loading) => {
    // Leave empty for now, fill in later as needed
};
const initDefaultData = (formField) => {
    if (formField.default_value !== undefined &&
        formField.default_value !== null &&
        (formValue.value[formField.field] === undefined || formValue.value[formField.field] === null) &&
        (formField.show_default_value === true || formField.show_default_value === undefined)) {
        formValue.value[formField.field] = formField.default_value;
    }
};
onMounted(() => {
    handleInputFieldList();
});
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
if (__VLS_ctx.fieldList.length > 0 || __VLS_ctx.apiInput) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "inline-params" },
    });
    /** @type {__VLS_StyleScopedClasses['inline-params']} */ ;
    for (const [item] of __VLS_vFor((__VLS_ctx.exposedFields))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (item.field),
        });
        if (__VLS_ctx.show(item)) {
            const __VLS_0 = InlineFormItem;
            // @ts-ignore
            const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
                ...{ 'onChange': {} },
                modelValue: (__VLS_ctx.formValue[item.field]),
                formfield: (item),
                trigger: (__VLS_ctx.trigger),
                view: (false),
                initDefaultData: (__VLS_ctx.initDefaultData),
                defaultItemWidth: "auto",
                otherParams: ({}),
                formValue: (__VLS_ctx.formValue),
                formfieldList: (__VLS_ctx.fieldList),
            }));
            const __VLS_2 = __VLS_1({
                ...{ 'onChange': {} },
                modelValue: (__VLS_ctx.formValue[item.field]),
                formfield: (item),
                trigger: (__VLS_ctx.trigger),
                view: (false),
                initDefaultData: (__VLS_ctx.initDefaultData),
                defaultItemWidth: "auto",
                otherParams: ({}),
                formValue: (__VLS_ctx.formValue),
                formfieldList: (__VLS_ctx.fieldList),
            }, ...__VLS_functionalComponentArgsRest(__VLS_1));
            let __VLS_5;
            const __VLS_6 = {
                /** @type {typeof __VLS_5.change} */
                onChange: (...[$event]) => {
                    if (!(__VLS_ctx.fieldList.length > 0 || __VLS_ctx.apiInput))
                        throw 0;
                    if (!(__VLS_ctx.show(item)))
                        throw 0;
                    return __VLS_ctx.change(item, $event);
                    // @ts-ignore
                    [fieldList, fieldList, apiInput, exposedFields, show, formValue, formValue, trigger, initDefaultData, change,];
                },
            };
            var __VLS_3;
            var __VLS_4;
        }
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.dialogFields.length > 0 || __VLS_ctx.apiInput) {
        let __VLS_7;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
            ...{ 'onClick': {} },
            ref: "triggerBtnRef",
            ...{ style: {} },
        }));
        const __VLS_9 = __VLS_8({
            ...{ 'onClick': {} },
            ref: "triggerBtnRef",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        let __VLS_12;
        const __VLS_13 = {
            /** @type {typeof __VLS_12.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.fieldList.length > 0 || __VLS_ctx.apiInput))
                    throw 0;
                if (!(__VLS_ctx.dialogFields.length > 0 || __VLS_ctx.apiInput))
                    throw 0;
                return __VLS_ctx.emit('openDialog');
                // @ts-ignore
                [apiInput, dialogFields, emit,];
            },
        };
        var __VLS_14;
        const { default: __VLS_16 } = __VLS_10.slots;
        let __VLS_17;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
            iconName: "app-all-menu",
        }));
        const __VLS_19 = __VLS_18({
            iconName: "app-all-menu",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        // @ts-ignore
        [];
        var __VLS_10;
        var __VLS_11;
    }
}
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
