/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
defineOptions({ name: 'MdEditorMagnify' });
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'submitDialog']);
const data = computed({
    set: (value) => {
        emit('update:modelValue', value);
    },
    get: () => {
        return props.modelValue;
    }
});
const dialogVisible = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        emit('submitDialog', cloneContent.value);
    }
});
const cloneContent = ref('');
const footers = [null, '=', 0];
function openDialog() {
    cloneContent.value = props.modelValue;
    dialogVisible.value = true;
}
function submitDialog() {
    emit('submitDialog', cloneContent.value);
    dialogVisible.value = false;
}
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
/** @ts-ignore @type { | typeof __VLS_components.MdEditor | typeof __VLS_components.MdEditor} */
MdEditor;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.data),
    preview: (false),
    toolbars: ([]),
    ...{ class: "magnify-md-editor" },
    footers: (__VLS_ctx.footers),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.data),
    preview: (false),
    toolbars: ([]),
    ...{ class: "magnify-md-editor" },
    footers: (__VLS_ctx.footers),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
/** @type {__VLS_StyleScopedClasses['magnify-md-editor']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { defFooters: __VLS_6 } = __VLS_3.slots;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ 'onClick': {} },
        text: true,
        type: "info",
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onClick': {} },
        text: true,
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_12;
    const __VLS_13 = {
        /** @type {typeof __VLS_12.click} */
        onClick: (__VLS_ctx.openDialog),
    };
    const { default: __VLS_14 } = __VLS_10.slots;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        ...{ class: "color-secondary" },
        iconName: "app-magnify",
        ...{ style: {} },
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: "color-secondary" },
        iconName: "app-magnify",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [data, footers, $attrs, openDialog,];
    var __VLS_10;
    var __VLS_11;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.title),
    appendToBody: true,
    alignCenter: true,
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.title),
    appendToBody: true,
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.MdEditor | typeof __VLS_components.MdEditor} */
MdEditor;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    modelValue: (__VLS_ctx.cloneContent),
    preview: (false),
    toolbars: ([]),
    footers: ([]),
}));
const __VLS_28 = __VLS_27({
    modelValue: (__VLS_ctx.cloneContent),
    preview: (false),
    toolbars: ([]),
    footers: ([]),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
{
    const { footer: __VLS_31 } = __VLS_23.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_37;
    const __VLS_38 = {
        /** @type {typeof __VLS_37.click} */
        onClick: (__VLS_ctx.submitDialog),
    };
    const { default: __VLS_39 } = __VLS_35.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [dialogVisible, title, cloneContent, submitDialog, $t,];
    var __VLS_35;
    var __VLS_36;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_23;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
