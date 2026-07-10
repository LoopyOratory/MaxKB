/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { ref } from 'vue';
import { cloneDeep, get } from 'lodash';
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const dialogVisible = ref(false);
const dynamicsFormRef = ref();
const form_data = ref(undefined);
const open = () => {
    if (props.modelValue) {
        form_data.value = cloneDeep(props.modelValue);
    }
    dialogVisible.value = true;
};
const close = () => {
    dialogVisible.value = false;
    form_data.value = undefined;
};
/**
 * Current fieldWhetherDisplay
 * @param field
 */
const show = (field) => {
    if (field.relation_show_field_dict) {
        const keys = Object.keys(field.relation_show_field_dict);
        for (const index in keys) {
            const key = keys[index];
            const v = get(props.formValue, key);
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
    return true;
};
const submit = () => {
    dynamicsFormRef.value?.validate().then(() => {
        dialogVisible.value = false;
        emit('update:modelValue', form_data.value);
        form_data.value = undefined;
    });
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between w-full my-required" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['my-required']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.label.label);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-danger" },
});
/** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
if (__VLS_ctx.label.attrs?.tooltip) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        effect: "dark",
        placement: "right",
    }));
    const __VLS_2 = __VLS_1({
        effect: "dark",
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    {
        const { content: __VLS_6 } = __VLS_3.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        (__VLS_ctx.label.attrs.tooltip);
        // @ts-ignore
        [label, label, label,];
    }
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
        ...{ style: {} },
    }));
    const __VLS_9 = __VLS_8({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_3;
}
if (__VLS_ctx.show(__VLS_ctx.label)) {
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_17;
    const __VLS_18 = {
        /** @type {typeof __VLS_17.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.show(__VLS_ctx.label)))
                throw 0;
            return __VLS_ctx.open();
            // @ts-ignore
            [label, show, open,];
        },
    };
    const { default: __VLS_19 } = __VLS_15.slots;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        iconName: "app-setting",
    }));
    const __VLS_22 = __VLS_21({
        iconName: "app-setting",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [];
    var __VLS_15;
    var __VLS_16;
}
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    destroyOnClose: true,
    modelValue: (__VLS_ctx.dialogVisible),
    title: "Tips",
    width: "500",
    beforeClose: (__VLS_ctx.close),
}));
const __VLS_27 = __VLS_26({
    destroyOnClose: true,
    modelValue: (__VLS_ctx.dialogVisible),
    title: "Tips",
    width: "500",
    beforeClose: (__VLS_ctx.close),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
const __VLS_31 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    readOnly: (__VLS_ctx.view),
    ref: "dynamicsFormRef",
    render_data: (__VLS_ctx.label.children ? __VLS_ctx.label.children : []),
    labelPosition: "top",
    modelValue: (__VLS_ctx.form_data),
    requireAsteriskPosition: "right",
    model: (__VLS_ctx.form_data),
}));
const __VLS_33 = __VLS_32({
    readOnly: (__VLS_ctx.view),
    ref: "dynamicsFormRef",
    render_data: (__VLS_ctx.label.children ? __VLS_ctx.label.children : []),
    labelPosition: "top",
    modelValue: (__VLS_ctx.form_data),
    requireAsteriskPosition: "right",
    model: (__VLS_ctx.form_data),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
var __VLS_36;
var __VLS_34;
{
    const { footer: __VLS_38 } = __VLS_28.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ 'onClick': {} },
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    const __VLS_45 = {
        /** @type {typeof __VLS_44.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_46 } = __VLS_42.slots;
    // @ts-ignore
    [label, label, dialogVisible, close, close, view, form_data, form_data,];
    var __VLS_42;
    var __VLS_43;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    let __VLS_52;
    const __VLS_53 = {
        /** @type {typeof __VLS_52.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_54 } = __VLS_50.slots;
    // @ts-ignore
    [submit,];
    var __VLS_50;
    var __VLS_51;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_28;
// @ts-ignore
var __VLS_37 = __VLS_36;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
