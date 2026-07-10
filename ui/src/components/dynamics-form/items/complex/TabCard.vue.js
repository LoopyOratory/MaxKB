/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import Result from '@/request/Result';
const props = defineProps();
const render_data = () => {
    return Promise.resolve(Result.success(props.formField.children));
};
const emit = defineEmits(['update:modelValue', 'change']);
// ValidateInstanceObject
const dynamicsFormRef = ref([]);
const _data = computed({
    get() {
        if (props.modelValue) {
            return props.modelValue;
        }
        else {
            emit('update:modelValue', [{}]);
            return [];
        }
    },
    set(value) {
        emit('update:modelValue', value);
    },
});
const props_info = computed(() => {
    return props.formField.props_info ? props.formField.props_info : {};
});
const tabs_label = computed(() => {
    return props_info.value.tabs_label ? props_info.value.tabs_label : 'label';
});
/**
 * ComponentStyle
 */
const formStyle = computed(() => {
    return props_info.value.form_style ? props_info.value.form_style : {};
});
const attr = computed(() => {
    if (props.formField.attrs) {
        return props.formField.attrs;
    }
    return {};
});
const activeTab = ref(0);
/**
 * ValidateMethod
 */
function validate() {
    return Promise.all(dynamicsFormRef.value.map((item) => item.validate()));
}
const other = computed(() => {
    return { ...(props.formValue ? props.formValue : {}), ...props.otherParams };
});
const style = computed(() => {
    return props_info.value.style ? props_info.value.style : {};
});
const handleTabsEdit = (targetName, action) => {
    if (action === 'add') {
        _data.value = [..._data.value, {}];
        activeTab.value = _data.value.length;
    }
    else if (action === 'remove') {
        const update_value = _data.value.filter((item, index) => index != targetName);
        _data.value = update_value;
        activeTab.value = update_value.length - 1;
    }
};
const __VLS_exposed = {
    validate,
    field: props.field,
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onEdit': {} },
    modelValue: (__VLS_ctx.activeTab),
    editable: true,
    type: "card",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onEdit': {} },
    modelValue: (__VLS_ctx.activeTab),
    editable: true,
    type: "card",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.edit} */
    onEdit: (__VLS_ctx.handleTabsEdit),
};
const { default: __VLS_7 } = __VLS_3.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx._data))) {
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        key: (index),
        label: (__VLS_ctx.tabs_label + (index + 1)),
        name: (index),
    }));
    const __VLS_10 = __VLS_9({
        key: (index),
        label: (__VLS_ctx.tabs_label + (index + 1)),
        name: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const { default: __VLS_13 } = __VLS_11.slots;
    if (__VLS_ctx.formField.children) {
        let __VLS_14;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            ...{ style: (__VLS_ctx.style) },
        }));
        const __VLS_16 = __VLS_15({
            ...{ style: (__VLS_ctx.style) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
        const { default: __VLS_19 } = __VLS_17.slots;
        const __VLS_20 = DynamicsForm || DynamicsForm;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            ...{ style: (__VLS_ctx.formStyle) },
            view: (__VLS_ctx.view),
            ref: "ceFormRef",
            modelValue: (__VLS_ctx._data[index]),
            model: (__VLS_ctx._data[index]),
            otherParams: (__VLS_ctx.other),
            render_data: (__VLS_ctx.render_data()),
            ...(__VLS_ctx.attr),
            parent_field: (__VLS_ctx.formField.field + '.' + index),
            labelPosition: "top",
            requireAsteriskPosition: "right",
        }));
        const __VLS_22 = __VLS_21({
            ...{ style: (__VLS_ctx.formStyle) },
            view: (__VLS_ctx.view),
            ref: "ceFormRef",
            modelValue: (__VLS_ctx._data[index]),
            model: (__VLS_ctx._data[index]),
            otherParams: (__VLS_ctx.other),
            render_data: (__VLS_ctx.render_data()),
            ...(__VLS_ctx.attr),
            parent_field: (__VLS_ctx.formField.field + '.' + index),
            labelPosition: "top",
            requireAsteriskPosition: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        var __VLS_25;
        var __VLS_23;
        // @ts-ignore
        [activeTab, handleTabsEdit, _data, _data, _data, tabs_label, formField, formField, style, formStyle, view, other, render_data, attr,];
        var __VLS_17;
    }
    // @ts-ignore
    [];
    var __VLS_11;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_26 = __VLS_25;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
