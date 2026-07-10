/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { cloneDeep } from 'lodash';
import DynamicsFormConstructor from '@/components/dynamics-form/constructor/index.vue';
import _ from 'lodash';
import { t } from '@/locales';
const emit = defineEmits(['refresh']);
const props = defineProps();
const DynamicsFormConstructorRef = ref();
const loading = ref(false);
const isEdit = ref(false);
const currentItem = ref();
const check_field = (field_list, obj) => {
    return field_list.every((field) => _.get(obj, field, undefined) !== undefined);
};
const currentRow = computed(() => {
    if (currentItem.value) {
        const row = currentItem.value;
        switch (row.type) {
            case 'input':
                if (check_field(['field', 'input_type', 'label', 'required', 'attrs'], currentItem.value)) {
                    return currentItem.value;
                }
                return {
                    attrs: row.attrs || { maxlength: 200, minlength: 0 },
                    field: row.field || row.variable,
                    input_type: 'TextInput',
                    label: row.label || row.name,
                    default_value: row.default_value,
                    required: row.required != undefined ? row.required : row.is_required,
                };
            case 'select':
                if (check_field(['field', 'input_type', 'label', 'required', 'option_list'], currentItem.value)) {
                    return currentItem.value;
                }
                return {
                    attrs: row.attrs || {},
                    field: row.field || row.variable,
                    input_type: 'SingleSelect',
                    label: row.label || row.name,
                    default_value: row.default_value,
                    required: row.required != undefined ? row.required : row.is_required,
                    option_list: row.option_list
                        ? row.option_list
                        : row.optionList.map((o) => {
                            return { key: o, value: o };
                        }),
                };
            case 'date':
                if (check_field([
                    'field',
                    'input_type',
                    'label',
                    'required',
                    'attrs.format',
                    'attrs.value-format',
                    'attrs.type',
                ], currentItem.value)) {
                    return currentItem.value;
                }
                return {
                    field: row.field || row.variable,
                    input_type: 'DatePicker',
                    label: row.label || row.name,
                    default_value: row.default_value || new Date(),
                    required: row.required != undefined ? row.required : row.is_required,
                    attrs: {
                        format: 'YYYY-MM-DD HH:mm:ss',
                        'value-format': 'YYYY-MM-DD HH:mm:ss',
                        type: 'datetime',
                    },
                };
            default:
                return currentItem.value;
        }
    }
    else {
        return {
            input_type: 'TextInput',
            required: false,
            attrs: { maxlength: 200, minlength: 0 },
            show_default_value: true,
        };
    }
});
const currentIndex = ref(null);
const inputTypeList = ref([
    { label: t('dynamicsForm.input_type_list.TextInput'), value: 'TextInputConstructor' },
    { label: t('dynamicsForm.input_type_list.PasswordInput'), value: 'PasswordInputConstructor' },
    { label: t('dynamicsForm.input_type_list.SingleSelect'), value: 'SingleSelectConstructor' },
    { label: t('dynamicsForm.input_type_list.MultiSelect'), value: 'MultiSelectConstructor' },
    { label: t('dynamicsForm.input_type_list.RadioCard'), value: 'RadioCardConstructor' },
    { label: t('dynamicsForm.input_type_list.DatePicker'), value: 'DatePickerConstructor' },
    { label: t('dynamicsForm.input_type_list.SwitchInput'), value: 'SwitchInputConstructor' },
    { label: t('dynamicsForm.input_type_list.RadioRow'), value: 'RadioRowConstructor' },
    { label: t('dynamicsForm.input_type_list.TextareaInput'), value: 'TextareaInputConstructor' },
    { label: t('dynamicsForm.input_type_list.MultiRow'), value: 'MultiRowConstructor' },
    { label: t('dynamicsForm.input_type_list.Model'), value: 'ModelConstructor' },
    { label: t('dynamicsForm.input_type_list.Knowledge'), value: 'KnowledgeConstructor' },
    { label: t('dynamicsForm.TreeSelect.label'), value: 'TreeSelectConstructor' },
]);
const dialogVisible = ref(false);
const open = (row, index) => {
    dialogVisible.value = true;
    if (row) {
        isEdit.value = true;
        currentItem.value = cloneDeep(row);
        currentIndex.value = index;
    }
    else {
        currentItem.value = null;
    }
};
const close = () => {
    dialogVisible.value = false;
    isEdit.value = false;
    currentIndex.value = null;
    currentItem.value = null;
};
const submit = async () => {
    const formEl = DynamicsFormConstructorRef.value;
    if (!formEl)
        return;
    await formEl.validate().then(() => {
        emit('refresh', formEl?.getData(), currentIndex.value);
        isEdit.value = false;
        currentItem.value = null;
        currentIndex.value = null;
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
    title: (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.param.editParam') : __VLS_ctx.$t('common.param.addParam')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.param.editParam') : __VLS_ctx.$t('common.param.addParam')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
const __VLS_7 = DynamicsFormConstructor || DynamicsFormConstructor;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.currentRow),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    input_type_list: (__VLS_ctx.inputTypeList),
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.currentNodeFields),
    currentEditingIndex: (__VLS_ctx.isEdit ? (__VLS_ctx.currentIndex ?? undefined) : (__VLS_ctx.currentNodeFields?.length ?? 0)),
    enableVisibility: (true),
    ref: "DynamicsFormConstructorRef",
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.currentRow),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    input_type_list: (__VLS_ctx.inputTypeList),
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.currentNodeFields),
    currentEditingIndex: (__VLS_ctx.isEdit ? (__VLS_ctx.currentIndex ?? undefined) : (__VLS_ctx.currentNodeFields?.length ?? 0)),
    enableVisibility: (true),
    ref: "DynamicsFormConstructorRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
var __VLS_10;
{
    const { footer: __VLS_14 } = __VLS_3.slots;
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
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_22 } = __VLS_18.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [isEdit, isEdit, $t, $t, $t, dialogVisible, close, close, currentRow, inputTypeList, nodeModel, currentNodeFields, currentNodeFields, currentIndex,];
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
        onClick: (...[$event]) => {
            return __VLS_ctx.submit();
            // @ts-ignore
            [loading, submit,];
        },
    };
    const { default: __VLS_30 } = __VLS_26.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [isEdit, $t, $t,];
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
    __typeProps: {},
});
export default {};
