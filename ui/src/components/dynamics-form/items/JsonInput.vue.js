/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { Codemirror } from 'vue-codemirror';
import { linter } from '@codemirror/lint';
import { computed, ref } from 'vue';
import { t } from '@/locales';
const props = withDefaults(defineProps(), { modelValue: () => { } });
const emit = defineEmits(['update:modelValue']);
const cache_model_value_str = ref();
const model_value = computed({
    get: () => {
        if (cache_model_value_str.value) {
            return cache_model_value_str.value;
        }
        return JSON.stringify(props.modelValue, null, 4);
    },
    set: (v) => {
        if (!v) {
            emit('update:modelValue', JSON.parse('{}'));
        }
        else {
            try {
                cache_model_value_str.value = v;
                const result = JSON.parse(v);
                emit('update:modelValue', result);
            }
            catch (e) { }
        }
    },
});
const extensions = [json(), linter(jsonParseLinter()), oneDark];
const codemirrorStyle = {
    height: '210px!important',
    width: '100%',
};
// Popup dialog related code
const dialogVisible = ref(false);
const cloneContent = ref('');
const openCodemirrorDialog = () => {
    cloneContent.value = model_value.value;
    dialogVisible.value = true;
};
const format = () => {
    try {
        const json_str = JSON.parse(model_value.value);
        model_value.value = JSON.stringify(json_str, null, 4);
    }
    catch (e) { }
};
function submitDialog() {
    model_value.value = cloneContent.value;
    dialogVisible.value = false;
}
/**
 * ValidateFormat
 * @param rule
 * @param value
 * @param callback
 */
const validate_rules = (rule, value, callback) => {
    if (model_value.value) {
        try {
            JSON.parse(model_value.value);
        }
        catch (e) {
            callback(new Error(t('dynamicsForm.tip.jsonMessage')));
            return false;
        }
    }
    return true;
};
const __VLS_exposed = { validate_rules: validate_rules };
defineExpose(__VLS_exposed);
const __VLS_defaults = { modelValue: () => { } };
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
    ...{ class: "function-CodemirrorEditor" },
});
/** @type {__VLS_StyleScopedClasses['function-CodemirrorEditor']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Codemirror} */
Codemirror;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ref: "cmRef",
    modelValue: (__VLS_ctx.model_value),
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
}));
const __VLS_2 = __VLS_1({
    ref: "cmRef",
    modelValue: (__VLS_ctx.model_value),
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
var __VLS_5;
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "function-CodemirrorEditor__format" },
});
/** @type {__VLS_StyleScopedClasses['function-CodemirrorEditor__format']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    text: true,
    type: "info",
    ...{ class: "magnify" },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    text: true,
    type: "info",
    ...{ class: "magnify" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (__VLS_ctx.format),
};
/** @type {__VLS_StyleScopedClasses['magnify']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.DocumentChecked} */
DocumentChecked;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[model_value, extensions, codemirrorStyle, $attrs, format,];
var __VLS_18;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "function-CodemirrorEditor__footer" },
});
/** @type {__VLS_StyleScopedClasses['function-CodemirrorEditor__footer']} */ ;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    ...{ 'onClick': {} },
    text: true,
    type: "info",
    ...{ class: "magnify" },
}));
const __VLS_28 = __VLS_27({
    ...{ 'onClick': {} },
    text: true,
    type: "info",
    ...{ class: "magnify" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_31;
const __VLS_32 = {
    /** @type {typeof __VLS_31.click} */
    onClick: (__VLS_ctx.openCodemirrorDialog),
};
/** @type {__VLS_StyleScopedClasses['magnify']} */ ;
const { default: __VLS_33 } = __VLS_29.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    iconName: "app-magnify",
    ...{ style: {} },
}));
const __VLS_36 = __VLS_35({
    iconName: "app-magnify",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[openCodemirrorDialog,];
var __VLS_29;
var __VLS_30;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('dynamicsForm.default.label')),
    appendToBody: true,
    fullscreen: true,
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('dynamicsForm.default.label')),
    appendToBody: true,
    fullscreen: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.Codemirror} */
Codemirror;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.cloneContent),
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
    ...{ style: {} },
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.cloneContent),
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
{
    const { footer: __VLS_50 } = __VLS_42.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (__VLS_ctx.submitDialog),
    };
    const { default: __VLS_58 } = __VLS_54.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [extensions, codemirrorStyle, dialogVisible, $t, $t, cloneContent, submitDialog,];
    var __VLS_54;
    var __VLS_55;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_42;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
