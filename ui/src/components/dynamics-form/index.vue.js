/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import FormItem from '@/components/dynamics-form/FormItem.vue';
import { ref, onBeforeMount, watch, nextTick, computed } from 'vue';
import _ from 'lodash';
import { get, post, put, del } from '@/request/index';
import { computeVisibilityMap } from './visibility';
const request = {
    get,
    post,
    put,
    del,
};
defineOptions({ name: 'dynamicsForm' });
const props = withDefaults(defineProps(), { view: false, defaultItemWidth: '75%', otherParams: () => { } });
const formValue = ref({});
const loading = ref(false);
const formFieldList = ref([]);
const ruleFormRef = ref();
const formFieldRef = ref([]);
const visibilityMap = computed(() => computeVisibilityMap(formFieldList.value, formValue.value));
/**
 * Current fieldWhetherDisplay
 * @param field
 */
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
    // new
    if (field.visibility_rules?.node_id) {
        return visibilityMap.value[field.field] ?? true;
    }
    return true;
};
const emit = defineEmits(['update:modelValue']);
/**
 * FormFieldModification
 * @param field
 * @param value
 */
const change = (field, value) => {
    formValue.value[field.field] = value;
};
/**
 * FormFieldModification
 * @param field
 * @param value
 */
const changeLabel = (field, value) => {
    formValue.value[field.label.field] = value;
};
watch(formValue, () => {
    emit('update:modelValue', formValue.value);
}, { deep: true });
watch(() => props.modelValue, (val) => {
    if (!val)
        return;
    if (_.isEqual(val, formValue.value))
        return;
    formValue.value = _.cloneDeep(val);
}, { deep: true });
function renderTemplate(template, data) {
    return template.replace(/\$\{(\w+)\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}
/**
 * Trigger to let user get sub-form or dropdown options
 * @param field
 * @param loading
 */
const trigger = (trigger_field, trigger_value, trigger_setting, self, loading) => {
    const request_call = new Function('self', 'trigger_setting', 'request', 'extra', trigger_setting.request
        ? trigger_setting.request
        : 'return  request.get(extra.renderTemplate(trigger_setting.url));')(self, trigger_setting, request, {
        renderTemplate: (url) => renderTemplate(url, {
            trigger_value: trigger_value,
            ...props.otherParams,
        }),
    });
    if (!trigger_setting.change && !trigger_setting.change_field) {
        return;
    }
    request_call.then((ok) => {
        new Function('self', 'trigger_setting', 'response', 'extra', trigger_setting.change
            ? trigger_setting.change
            : `self[trigger_setting.change_field]=[
        ...response.data.shared_model.map((m) => {
          return { ...m, type: 'share' }
        }),
        ...response.data.model.map((m) => {
          return { ...m, type: 'workspace' }
        })
      ];`)(self, trigger_setting, ok, { form_data: formValue, getDefault: getFormDefaultValue });
    });
};
/**
 * InitializeDefaultData
 */
const initDefaultData = (formField) => {
    if (formField.default_value &&
        (formValue.value[formField.field] === undefined ||
            formValue.value[formField.field] === null ||
            !formValue.value[formField.field]) &&
        formValue.value[formField.field] != false) {
        if (formField.show_default_value === true) {
            formValue.value[formField.field] = formField.default_value;
        }
    }
};
onBeforeMount(() => {
    render(props.render_data, props.modelValue);
});
const render = (render_data, data) => {
    formFieldList.value = [];
    nextTick(() => {
        if (typeof render_data == 'string') {
            get(render_data, {}, loading).then((ok) => {
                formFieldList.value = ok.data;
            });
        }
        else if (render_data instanceof Array) {
            formFieldList.value = render_data;
        }
        else if (typeof render_data === 'function') {
            render_data().then((ok) => {
                formFieldList.value = ok.data;
                const form_data = data ? data : {};
                if (form_data) {
                    const value = getFormDefaultValue(formFieldList.value, form_data);
                    formValue.value = _.cloneDeep(value);
                }
            });
        }
        else {
            render_data.then((ok) => {
                formFieldList.value = ok.data;
            });
        }
        const form_data = data ? data : {};
        if (form_data) {
            const value = getFormDefaultValue(formFieldList.value, form_data);
            formValue.value = _.cloneDeep(value);
        }
    });
};
const getFormDefaultValue = (fieldList, form_data) => {
    form_data = form_data ? form_data : {};
    const value = fieldList
        .map((item) => {
        if (form_data[item.field] !== undefined) {
            if (item.value_field && item.option_list && item.option_list.length > 0) {
                const value_field = item.value_field;
                const find = item.option_list?.find((i) => {
                    if (typeof form_data[item.field] === 'string') {
                        return i[value_field] === form_data[item.field];
                    }
                    else {
                        return form_data[item.field]
                            ? form_data[item.field].indexOf([value_field]) === -1
                            : false;
                    }
                });
                if (find) {
                    return { [item.field]: form_data[item.field] };
                }
                if (item.show_default_value === true || item.show_default_value === undefined) {
                    return { [item.field]: item.default_value };
                }
            }
            else {
                return { [item.field]: form_data[item.field] };
            }
        }
        if (item.show_default_value === true || item.show_default_value === undefined) {
            return { [item.field]: item.default_value };
        }
        return {};
    })
        .reduce((x, y) => ({ ...x, ...y }), { ...form_data });
    return value;
};
/**
 * ValidateFunction
 */
const validate = () => {
    for (const field of formFieldList.value) {
        if (!show(field)) {
            formValue.value[field.field] = null;
        }
    }
    return Promise.all([
        ...formFieldRef.value.map((item) => item.validate()),
        ruleFormRef.value ? ruleFormRef.value.validate() : Promise.resolve(),
    ]);
};
// ExposeGetCurrentFormDataFunction
const __VLS_exposed = {
    initDefaultData,
    validate,
    render,
    ruleFormRef,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = { view: false, defaultItemWidth: '75%', otherParams: () => { } };
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
    ...{ 'onSubmit': {} },
    ref: "ruleFormRef",
    labelWidth: "130px",
    labelSuffix: ":",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    ref: "ruleFormRef",
    labelWidth: "130px",
    labelSuffix: ":",
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.submit} */
    onSubmit: () => { },
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
var __VLS_10 = {
    form_value: (__VLS_ctx.formValue),
};
for (const [item] of __VLS_vFor((__VLS_ctx.formFieldList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (item.field),
    });
    if (__VLS_ctx.show(item)) {
        const __VLS_12 = FormItem || FormItem;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            ...{ 'onChange': {} },
            ...{ 'onChangeLabel': {} },
            ref: "formFieldRef",
            key: (item.field),
            modelValue: (__VLS_ctx.formValue[item.field]),
            formfield: (item),
            trigger: (__VLS_ctx.trigger),
            view: (__VLS_ctx.view),
            initDefaultData: (__VLS_ctx.initDefaultData),
            defaultItemWidth: (__VLS_ctx.defaultItemWidth),
            otherParams: (__VLS_ctx.otherParams),
            formValue: (__VLS_ctx.formValue),
            formfieldList: (__VLS_ctx.formFieldList),
            parent_field: (__VLS_ctx.parent_field),
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onChange': {} },
            ...{ 'onChangeLabel': {} },
            ref: "formFieldRef",
            key: (item.field),
            modelValue: (__VLS_ctx.formValue[item.field]),
            formfield: (item),
            trigger: (__VLS_ctx.trigger),
            view: (__VLS_ctx.view),
            initDefaultData: (__VLS_ctx.initDefaultData),
            defaultItemWidth: (__VLS_ctx.defaultItemWidth),
            otherParams: (__VLS_ctx.otherParams),
            formValue: (__VLS_ctx.formValue),
            formfieldList: (__VLS_ctx.formFieldList),
            parent_field: (__VLS_ctx.parent_field),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_17;
        const __VLS_18 = {
            /** @type {typeof __VLS_17.change} */
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.show(item)))
                    throw 0;
                return __VLS_ctx.change(item, $event);
                // @ts-ignore
                [$attrs, vLoading, loading, formValue, formValue, formValue, formFieldList, formFieldList, show, trigger, view, initDefaultData, defaultItemWidth, otherParams, parent_field, change,];
            },
        };
        const __VLS_19 = {
            /** @type {typeof __VLS_17.changeLabel} */
            onChangeLabel: (...[$event]) => {
                if (!(__VLS_ctx.show(item)))
                    throw 0;
                return __VLS_ctx.changeLabel(item, $event);
                // @ts-ignore
                [changeLabel,];
            },
        };
        var __VLS_20;
        var __VLS_15;
        var __VLS_16;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_11 = __VLS_10, __VLS_21 = __VLS_20;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
