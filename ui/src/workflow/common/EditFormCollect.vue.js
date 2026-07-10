/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import DynamicsFormConstructor from '@/components/dynamics-form/constructor/index.vue';
import { t } from '@/locales';
const props = withDefaults(defineProps(), { title: t('common.param.editParam'), enableVisibility: false });
const dialogVisible = ref(false);
const dynamicsFormConstructorRef = ref();
const emit = defineEmits(['submit']);
const dynamicsFormData = ref({});
const currentIndex = ref(0);
const loading = ref(false);
const open = (form_data, index) => {
    dialogVisible.value = true;
    dynamicsFormData.value = form_data;
    currentIndex.value = index;
};
const close = () => {
    dialogVisible.value = false;
    dynamicsFormData.value = {};
};
const submit = () => {
    dynamicsFormConstructorRef.value?.validate().then(() => {
        props.editFormField(dynamicsFormConstructorRef.value?.getData(), currentIndex.value);
        close();
    });
};
const __VLS_exposed = { close, open };
defineExpose(__VLS_exposed);
const __VLS_defaults = { title: t('common.param.editParam'), enableVisibility: false };
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
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
const __VLS_7 = DynamicsFormConstructor || DynamicsFormConstructor;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.dynamicsFormData),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "dynamicsFormConstructorRef",
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.currentNodeFields),
    currentEditingIndex: (__VLS_ctx.currentIndex),
    enableVisibility: (__VLS_ctx.enableVisibility),
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.dynamicsFormData),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "dynamicsFormConstructorRef",
    nodeModel: (__VLS_ctx.nodeModel),
    currentNodeFields: (__VLS_ctx.currentNodeFields),
    currentEditingIndex: (__VLS_ctx.currentIndex),
    enableVisibility: (__VLS_ctx.enableVisibility),
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
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [title, dialogVisible, dialogVisible, close, dynamicsFormData, nodeModel, currentNodeFields, currentIndex, enableVisibility,];
        },
    };
    const { default: __VLS_22 } = __VLS_18.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
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
    (__VLS_ctx.$t('common.modify'));
    // @ts-ignore
    [$t,];
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
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
