/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { ref } from 'vue';
const damo_data = [
    {
        field: 'aaa',
        input_type: 'Tree',
        attrs: {
            lazy: true,
            url: '/workspace/${current_workspace_id}/knowledge/${current_knowledge_id}/datasource/tool/019aa0bb-552d-73a3-b0c6-1809eaedb139/get_file_list',
        },
        label: '',
    },
    {
        field: 'aa',
        input_type: 'LocalFileUpload',
        attrs: {
            file_count_limit: 10,
            file_size_limit: 10,
            file_type_list: ['TXT'],
        },
        label: '',
    },
    {
        field: 'name',
        input_type: 'PasswordInput',
        label: {
            label: 'Username',
            input_type: 'SettingLabel',
            field: 'name_setting',
            relation_show_field_dict: {
                name: {
                    values: ['01993837-5b09-7f20-9360-801d11d43d28'],
                },
            },
            relation_trigger_field_dict: {
                name: {
                    values: ['01993837-5b09-7f20-9360-801d11d43d28'],
                    request: 'self.children=()=>request.get(extra.renderTemplate(trigger_setting.url)).then(ok=>{return ok})',
                    url: '/workspace/${current_workspace_id}/model/${trigger_value}/model_params_form',
                },
            },
            children: [],
        },
        required: false,
    },
    { field: 'json_text', input_type: 'JsonInput', label: 'aa', required: false },
    {
        field: 'array_object_card_field',
        input_type: 'ArrayObjectCard',
        label: 'Test',
        trigger_type: 'CHILD_FORMS',
        attrs: { 'label-width': '120px', 'label-suffix': ':ssss', 'label-position': 'top' },
        required: false,
        children: [
            { field: 'name1', input_type: 'TextInput', label: 'Username1' },
            { field: 'name2', input_type: 'TextInput', label: 'Username2' },
            { field: 'name3', input_type: 'TextInput', label: 'Username3' },
        ],
    },
    {
        field: 'maxkb_tokens',
        input_type: 'Slider',
        default_value: 1,
        attrs: {
            min: 0,
            max: 10,
            step: 1,
            precision: 1,
            'show-input-controls': false,
            'show-input': true,
        },
        label: { label: 'Temperature', attrs: { tooltip: 'sss' }, input_type: 'TooltipLabel' },
    },
    {
        field: 'object_card_field',
        input_type: 'ObjectCard',
        label: 'Test',
        trigger_type: 'CHILD_FORMS',
        attrs: { 'label-width': '120px', 'label-suffix': ':ssss', 'label-position': 'left' },
        required: false,
        children: [
            { field: 'name1', input_type: 'TextInput', label: 'Username1' },
            { field: 'name2', input_type: 'TextInput', label: 'Username2' },
            { field: 'name3', input_type: 'TextInput', label: 'Username3' },
        ],
    },
    {
        field: 'tab_card_field',
        input_type: 'TabCard',
        label: 'Test',
        trigger_type: 'CHILD_FORMS',
        attrs: { 'label-width': '120px', 'label-suffix': ':ssss', 'label-position': 'left' },
        required: false,
        props_info: { tabs_label: 'User' },
        children: [
            { field: 'name1', input_type: 'TextInput', label: 'Username1' },
            { field: 'name2', input_type: 'TextInput', label: 'Username2' },
            { field: 'name3', input_type: 'TextInput', label: 'Username3' },
        ],
    },
    {
        field: 'single_select_field',
        input_type: 'SingleSelect',
        text_field: 'name',
        value_field: 'id',
        required: true,
        attrs: { placeholder: 'Please select' },
        required_asterisk: true,
        label: {
            label: 'TestSingle select',
            input_type: 'SettingLabel',
            field: 'name_setting',
            relation_show_field_dict: {
                single_select_field: {
                    values: [],
                },
            },
            relation_trigger_field_dict: {
                single_select_field: {
                    values: [],
                    request: 'self.children=()=>request.get(extra.renderTemplate(trigger_setting.url)).then(ok=>{return ok})',
                    url: '/workspace/${current_workspace_id}/model/${trigger_value}/model_params_form',
                },
            },
            children: [],
        },
        relation_trigger_field_dict: {
            name: {
                values: [],
                url: '/workspace/${current_workspace_id}/model_list?model_type=LLM',
                change_field: 'option_list',
            },
        },
    },
    {
        field: 'multi_select_field',
        input_type: 'MultiSelect',
        default_value: ['test1'],
        relation_show_field_dict: {
            'object_card_field.name1': [],
        },
        label: 'TestMulti-selectDropdown',
        required: true,
        attrs: { placeholder: 'Please select' },
        option_list: [
            {
                key: 'Test',
                value: 'test',
            },
            {
                key: 'Test1',
                value: 'test1',
            },
        ],
    },
    {
        field: 'radio_field',
        input_type: 'Radio',
        label: 'TestSingle select',
        required: true,
        attrs: { placeholder: 'Please select' },
        option_list: [
            {
                key: 'Test',
                value: 'test',
            },
            {
                key: 'Test1',
                value: 'test1',
            },
        ],
    },
    {
        field: 'radio_button_field',
        input_type: 'RadioButton',
        label: 'TestSingle select',
        required: true,
        attrs: { placeholder: 'Please select' },
        option_list: [
            {
                key: 'Test',
                value: 'test',
            },
            {
                key: 'Test1',
                value: 'test1',
            },
        ],
    },
    {
        field: 'radio_card_field',
        input_type: 'RadioCard',
        label: 'TestSingle select1',
        required: true,
        attrs: { placeholder: 'Please select' },
        option_list: [
            {
                key: 'Test',
                value: 'test',
            },
            {
                key: 'Test111111',
                value: 'test1',
            },
        ],
    },
    {
        field: 'table_radio_field',
        input_type: 'TableRadio',
        label: 'TableSingle select',
        required: true,
        attrs: { placeholder: 'Please select' },
        props_info: {
            active_msg: 'CurrentSelect',
            table_columns: [
                {
                    property: '`${row.key}${row.number}`',
                    label: 'Name',
                    type: 'eval',
                },
                {
                    property: 'ProgressTableItem',
                    label: 'Number',
                    type: 'component',
                    value_field: 'number',
                    attrs: {
                        color: [
                            { color: '#f56c6c', percentage: 20 },
                            { color: '#e6a23c', percentage: 40 },
                            { color: '#5cb87a', percentage: 60 },
                            { color: '#1989fa', percentage: 80 },
                            { color: '#6f7ad3', percentage: 100 },
                        ],
                    },
                    props_info: {
                        view_card: [
                            {
                                type: 'eval',
                                title: 'Test',
                                value_field: '`${parseFloat(row.number).toLocaleString("en-US",{style: "decimal",maximumFractionDigits:1})}%&nbsp;&nbsp;&nbsp;`',
                            },
                            {
                                type: 'eval',
                                title: 'Name',
                                value_field: '`${row.key}&nbsp;&nbsp;&nbsp;`',
                            },
                        ],
                    },
                },
            ],
            style: { width: '500px' },
        },
        option_list: [
            {
                key: 'Test',
                value: 'test',
                number: 10,
            },
            {
                key: 'Test111111',
                value: 'test1',
                number: 100,
            },
        ],
    },
    {
        field: 'table_checkbox_field',
        input_type: 'TableCheckbox',
        label: 'TableMulti-select',
        required: true,
        attrs: { placeholder: 'Please select' },
        props_info: {
            active_msg: 'CurrentSelect',
            table_columns: [
                {
                    property: '`${row.key}${row.number}`',
                    label: 'Name',
                    type: 'eval',
                },
                {
                    property: 'ProgressTableItem',
                    label: 'Number',
                    type: 'component',
                    value_field: 'number',
                    attrs: {
                        color: [
                            { color: '#f56c6c', percentage: 20 },
                            { color: '#e6a23c', percentage: 40 },
                            { color: '#5cb87a', percentage: 60 },
                            { color: '#1989fa', percentage: 80 },
                            { color: '#6f7ad3', percentage: 100 },
                        ],
                    },
                    props_info: {
                        view_card: [
                            {
                                type: 'eval',
                                title: 'Test',
                                value_field: '`${parseFloat(row.number).toLocaleString("en-US",{style: "decimal",maximumFractionDigits:1})}%&nbsp;&nbsp;&nbsp;`',
                            },
                            {
                                type: 'eval',
                                title: 'Name',
                                value_field: '`${row.key}&nbsp;&nbsp;&nbsp;`',
                            },
                        ],
                    },
                },
            ],
            style: { width: '500px' },
        },
        option_list: [
            {
                key: 'Test',
                value: 'test',
                number: 10,
            },
            {
                key: 'Test111111',
                value: 'test1',
                number: 100,
            },
        ],
    },
];
const form_data = ref({});
const dynamicsFormRef = ref();
const click = () => {
    dynamicsFormRef.value?.validate();
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
const __VLS_0 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.damo_data),
    ref: "dynamicsFormRef",
    otherParams: ({ current_workspace_id: 'default' }),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.damo_data),
    ref: "dynamicsFormRef",
    otherParams: ({ current_workspace_id: 'default' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
{
    const { default: __VLS_8 } = __VLS_3.slots;
    const [scope] = __VLS_vSlot(__VLS_8);
    let __VLS_9;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        label: "OtherField",
    }));
    const __VLS_11 = __VLS_10({
        label: "OtherField",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    const { default: __VLS_14 } = __VLS_12.slots;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        modelValue: (scope.form_value['zha']),
    }));
    const __VLS_17 = __VLS_16({
        modelValue: (scope.form_value['zha']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    // @ts-ignore
    [form_data, form_data, damo_data,];
    var __VLS_12;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_25;
const __VLS_26 = {
    /** @type {typeof __VLS_25.click} */
    onClick: (__VLS_ctx.click),
};
const { default: __VLS_27 } = __VLS_23.slots;
// @ts-ignore
[click,];
var __VLS_23;
var __VLS_24;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
