/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import Result from '@/request/Result';
const props = defineProps();
const render_data = () => {
    return Promise.resolve(Result.success(props.formField.children));
};
const deleteKnowledge = (item) => {
    _data.value = _data.value.filter((row) => row !== item);
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
const add_msg = computed(() => {
    return props_info.value.add_msg ? props_info.value.add_msg : 'Add';
});
/**
 * AddOnecard
 */
const add_card = () => {
    _data.value = [..._data.value, {}];
};
/**
 * ComponentStyle
 */
const formStyle = computed(() => {
    return props_info.value.form_style ? props_info.value.form_style : {};
});
const style = computed(() => {
    return props_info.value.style ? props_info.value.style : {};
});
const attr = computed(() => {
    if (props.formField.attrs) {
        return props.formField.attrs;
    }
    return {};
});
/**
 * ValidateMethod
 */
function validate() {
    return Promise.all(dynamicsFormRef.value.map((item) => item.validate()));
}
const other = computed(() => {
    return { ...(props.formValue ? props.formValue : {}), ...props.otherParams };
});
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
/** @type {__VLS_StyleScopedClasses['add-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "arrt-object-card flex w-full" },
});
/** @type {__VLS_StyleScopedClasses['arrt-object-card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
for (const [item, index] of __VLS_vFor((__VLS_ctx._data))) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "box-card" },
        ...{ style: (__VLS_ctx.style) },
        key: (index),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "box-card" },
        ...{ style: (__VLS_ctx.style) },
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['box-card']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    const __VLS_6 = DynamicsForm || DynamicsForm;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
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
    const __VLS_8 = __VLS_7({
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
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    var __VLS_11;
    var __VLS_9;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_15 = __VLS_14({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "delete-button" },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "delete-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        /** @type {typeof __VLS_24.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteKnowledge(item);
            // @ts-ignore
            [_data, _data, _data, style, formStyle, view, other, render_data, attr, formField, $t, deleteKnowledge,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['delete-button']} */ ;
    const { default: __VLS_26 } = __VLS_22.slots;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        iconName: "app-delete",
    }));
    const __VLS_29 = __VLS_28({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    // @ts-ignore
    [];
    var __VLS_22;
    var __VLS_23;
    // @ts-ignore
    [];
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_3;
    // @ts-ignore
    [];
}
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "card-add box-card" },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "card-add box-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
const __VLS_38 = {
    /** @type {typeof __VLS_37.click} */
    onClick: (__VLS_ctx.add_card),
};
/** @type {__VLS_StyleScopedClasses['card-add']} */ ;
/** @type {__VLS_StyleScopedClasses['box-card']} */ ;
const { default: __VLS_39 } = __VLS_35.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-center" },
});
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    iconName: "app-add-outlined",
    ...{ class: "add-icon layout-bg p-8 border-r-6" },
}));
const __VLS_42 = __VLS_41({
    iconName: "app-add-outlined",
    ...{ class: "add-icon layout-bg p-8 border-r-6" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
/** @type {__VLS_StyleScopedClasses['add-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.add_msg);
// @ts-ignore
[add_card, add_msg,];
var __VLS_35;
var __VLS_36;
// @ts-ignore
var __VLS_12 = __VLS_11;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
