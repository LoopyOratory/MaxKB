/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import _ from 'lodash';
import TableColumn from '@/components/dynamics-form/items/table/TableColumn.vue';
const filterText = ref('');
const props = defineProps();
const rowTemp = ref();
const evalF = (text, row) => {
    rowTemp.value = row;
    return eval(text);
};
const emit = defineEmits(['update:modelValue', 'change']);
const multipleTableRef = ref();
const _data = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
        emit('change', props.formField);
    }
});
const handleSelectionChange = (val) => {
    _data.value = val.map((row) => row[valueField.value]);
};
const propsInfo = computed(() => {
    return props.formField.props_info ? props.formField.props_info : {};
});
const activeMsg = computed(() => {
    return propsInfo.value.active_msg ? propsInfo.value.active_msg : '';
});
const title = computed(() => {
    return propsInfo.value.title ? propsInfo.value.title : '';
});
const tableColumns = computed(() => {
    return propsInfo.value.table_columns ? propsInfo.value.table_columns : [];
});
const option_list = computed(() => {
    return props.formField.option_list ? props.formField.option_list : [];
});
const textField = computed(() => {
    return props.formField.text_field ? props.formField.text_field : 'key';
});
const valueField = computed(() => {
    return props.formField.value_field ? props.formField.value_field : 'value';
});
const tableData = computed(() => {
    if (option_list.value) {
        if (filterText.value) {
            return option_list.value.filter((item) => tableColumns.value.some((c) => {
                let v = '';
                if (c.type === 'eval') {
                    v = evalF(c.property, item);
                }
                else if (c.type === 'component') {
                    return false;
                }
                else {
                    v = item[c.property];
                }
                return typeof v == 'string' ? v.indexOf(filterText.value) >= 0 : false;
            }));
        }
        else {
            return option_list.value.filter((item) => item[valueField.value]);
        }
    }
    return [];
});
/**
 * ListenTableData，SettingsDefaultValue
 */
watch(() => tableData.value, () => {
    if (tableData.value && tableData.value.length > 0) {
        const defaultItem = _.head(tableData.value);
        let defaultItemValue = _.get(defaultItem, valueField.value);
        if (props.modelValue) {
            const row = option_list.value.find((f) => f[valueField.value] === props.modelValue);
            if (row) {
                defaultItemValue = row[valueField.value];
            }
        }
        emit('update:modelValue', defaultItemValue);
    }
    else {
        emit('update:modelValue', undefined);
    }
    emit('change', props.formField);
});
const activeText = computed(() => {
    if (props.modelValue) {
        const rows = option_list.value.filter((f) => props.modelValue?.includes(f[valueField.value]));
        if (rows) {
            if (rows.length > 3) {
                return (rows
                    .map((row) => row[textField.value])
                    .splice(0, 3)
                    .join(',') + '...');
            }
            else {
                return rows.map((row) => row[textField.value]).join(',');
            }
        }
    }
    return props.modelValue;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "table-checkbox" },
});
/** @type {__VLS_StyleScopedClasses['table-checkbox']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header" },
});
/** @type {__VLS_StyleScopedClasses['header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
(__VLS_ctx.title);
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.filterText),
    validateEvent: (false),
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
    ...{ class: "input-with-select" },
    ...{ style: {} },
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.filterText),
    validateEvent: (false),
    placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
    ...{ class: "input-with-select" },
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['input-with-select']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { prepend: __VLS_6 } = __VLS_3.slots;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        icon: (__VLS_ctx.Search),
    }));
    const __VLS_9 = __VLS_8({
        icon: (__VLS_ctx.Search),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    // @ts-ignore
    [title, filterText, $t, Search,];
}
// @ts-ignore
[];
var __VLS_3;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    data: (__VLS_ctx.tableData),
    highlightCurrentRow: true,
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    data: (__VLS_ctx.tableData),
    highlightCurrentRow: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = {
    /** @type {typeof __VLS_17.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
var __VLS_19;
const { default: __VLS_21 } = __VLS_15.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    type: "selection",
    width: "55",
}));
const __VLS_24 = __VLS_23({
    type: "selection",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
for (const [column, index] of __VLS_vFor((__VLS_ctx.tableColumns))) {
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        key: (index),
        ...(column),
        label: (column.label),
    }));
    const __VLS_29 = __VLS_28({
        key: (index),
        ...(column),
        label: (column.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    const { default: __VLS_32 } = __VLS_30.slots;
    {
        const { default: __VLS_33 } = __VLS_30.slots;
        const [scope] = __VLS_vSlot(__VLS_33);
        if (column.type === 'component') {
            const __VLS_34 = TableColumn || TableColumn;
            // @ts-ignore
            const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
                column: (column),
                row: (scope.row),
            }));
            const __VLS_36 = __VLS_35({
                column: (column),
                row: (scope.row),
            }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        }
        else if (column.type === 'eval') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            __VLS_asFunctionalDirective(__VLS_directives.vHtml, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.evalF(column.property, scope.row)) }, null, null);
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (scope.row[column.property]);
        }
        // @ts-ignore
        [tableData, handleSelectionChange, tableColumns, evalF,];
    }
    // @ts-ignore
    [];
    var __VLS_30;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_15;
var __VLS_16;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "msg" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (props.modelValue) }, null, null);
/** @type {__VLS_StyleScopedClasses['msg']} */ ;
(__VLS_ctx.activeMsg);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "active" },
});
/** @type {__VLS_StyleScopedClasses['active']} */ ;
(__VLS_ctx.activeText);
// @ts-ignore
var __VLS_20 = __VLS_19;
// @ts-ignore
[activeMsg, activeText,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
