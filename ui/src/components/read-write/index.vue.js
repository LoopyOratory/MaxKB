/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, onMounted, nextTick } from 'vue';
defineOptions({ name: 'ReadWrite' });
const props = defineProps({
    data: {
        type: String,
        default: '',
    },
    showEditIcon: {
        type: Boolean,
        default: false,
    },
    maxlength: {
        type: Number,
        default: () => 0,
    },
    trigger: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'dblclick', 'manual'].includes(value),
    },
    write: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['change', 'close']);
const inputRef = ref();
const isEdit = ref(false);
const writeValue = ref('');
const loading = ref(false);
watch(isEdit, (bool) => {
    if (!bool) {
        writeValue.value = '';
        emit('close');
    }
    else {
        setTimeout(() => {
            nextTick(() => {
                inputRef.value?.focus();
            });
        }, 200);
    }
});
watch(() => props.write, (bool) => {
    if (bool && props.trigger === 'manual') {
        editNameHandle();
    }
    else {
        isEdit.value = false;
    }
});
function dblclick() {
    if (props.trigger === 'dblclick') {
        editNameHandle();
    }
}
function submit() {
    loading.value = true;
    emit('change', writeValue.value);
    setTimeout(() => {
        isEdit.value = false;
        loading.value = false;
    }, 200);
}
function editNameHandle() {
    writeValue.value = props.data;
    isEdit.value = true;
}
onMounted(() => { });
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
    ...{ class: "cursor w-full" },
});
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_0 = {};
if (!__VLS_ctx.isEdit) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onDblclick: (__VLS_ctx.dblclick) },
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_2;
    /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
    autoTooltip;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent1(__VLS_2, new __VLS_2({
        content: (__VLS_ctx.data),
    }));
    const __VLS_4 = __VLS_3({
        content: (__VLS_ctx.data),
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    const { default: __VLS_7 } = __VLS_5.slots;
    (__VLS_ctx.data);
    // @ts-ignore
    [isEdit, dblclick, data, data,];
    var __VLS_5;
    if (__VLS_ctx.trigger === 'default' && __VLS_ctx.showEditIcon) {
        let __VLS_8;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            ...{ 'onClick': {} },
            ...{ class: "ml-4" },
            text: true,
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick': {} },
            ...{ class: "ml-4" },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_13;
        const __VLS_14 = {
            /** @type {typeof __VLS_13.click} */
            onClick: (__VLS_ctx.editNameHandle),
        };
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_15 } = __VLS_11.slots;
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            iconName: "app-edit",
        }));
        const __VLS_18 = __VLS_17({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        // @ts-ignore
        [trigger, showEditIcon, editNameHandle,];
        var __VLS_11;
        var __VLS_12;
    }
}
var __VLS_21 = {};
if (__VLS_ctx.isEdit) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ 'onBlur': {} },
        ...{ 'onKeyup': {} },
        ref: "inputRef",
        modelValue: (__VLS_ctx.writeValue),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        autofocus: true,
        maxlength: (__VLS_ctx.maxlength || '-'),
        showWordLimit: (__VLS_ctx.maxlength ? true : false),
        clearable: true,
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onBlur': {} },
        ...{ 'onKeyup': {} },
        ref: "inputRef",
        modelValue: (__VLS_ctx.writeValue),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        autofocus: true,
        maxlength: (__VLS_ctx.maxlength || '-'),
        showWordLimit: (__VLS_ctx.maxlength ? true : false),
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    const __VLS_29 = {
        /** @type {typeof __VLS_28.blur} */
        onBlur: (...[$event]) => {
            if (!(__VLS_ctx.isEdit))
                throw 0;
            return __VLS_ctx.isEdit = false;
            // @ts-ignore
            [isEdit, isEdit, writeValue, $t, maxlength, maxlength,];
        },
    };
    const __VLS_30 = {
        /** @type {typeof __VLS_28.keyup} */
        onKeyup: (__VLS_ctx.submit),
    };
    var __VLS_31;
    var __VLS_26;
    var __VLS_27;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        ...{ 'onMousedown': {} },
        type: "primary",
        text: true,
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_35 = __VLS_34({
        ...{ 'onMousedown': {} },
        type: "primary",
        text: true,
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_38;
    const __VLS_39 = {
        /** @type {typeof __VLS_38.mousedown} */
        onMousedown: (__VLS_ctx.submit),
    };
    const { default: __VLS_40 } = __VLS_36.slots;
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
    const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
    const { default: __VLS_46 } = __VLS_44.slots;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.Select} */
    Select;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({}));
    const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
    // @ts-ignore
    [submit, submit, loading,];
    var __VLS_44;
    // @ts-ignore
    [];
    var __VLS_36;
    var __VLS_37;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        text: true,
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        text: true,
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isEdit))
                throw 0;
            return __VLS_ctx.isEdit = false;
            // @ts-ignore
            [isEdit, loading,];
        },
    };
    const { default: __VLS_59 } = __VLS_55.slots;
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({}));
    const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const { default: __VLS_65 } = __VLS_63.slots;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.CloseBold} */
    CloseBold;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
    const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
    // @ts-ignore
    [];
    var __VLS_63;
    // @ts-ignore
    [];
    var __VLS_55;
    var __VLS_56;
}
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_22 = __VLS_21, __VLS_32 = __VLS_31;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
    props: {
        data: {
            type: String,
            default: '',
        },
        showEditIcon: {
            type: Boolean,
            default: false,
        },
        maxlength: {
            type: Number,
            default: () => 0,
        },
        trigger: {
            type: String,
            default: 'default',
            validator: (value) => ['default', 'dblclick', 'manual'].includes(value),
        },
        write: {
            type: Boolean,
            default: false,
        },
    },
});
const __VLS_export = {};
export default {};
