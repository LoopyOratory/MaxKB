/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Codemirror } from 'vue-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { linter } from '@codemirror/lint';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { throttle } from 'lodash';
defineOptions({ name: 'CodemirrorEditor' });
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'submitDialog']);
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const data = computed({
    set: (value) => {
        emit('update:modelValue', value);
    },
    get: () => {
        return props.modelValue;
    },
});
function getRangeFromLineAndColumn(state, line, column, end_column) {
    const l = state.doc.line(line);
    const lineLength = l.length;
    const safeColumn = Math.max(0, Math.min(column, lineLength));
    const fromPos = l.from + safeColumn;
    let safeEndColumn;
    if (end_column !== undefined) {
        safeEndColumn = Math.max(0, Math.min(end_column, lineLength));
    }
    else {
        safeEndColumn = lineLength;
    }
    const toPos = l.from + safeEndColumn;
    const finalFrom = Math.min(fromPos, toPos);
    const finalTo = Math.max(fromPos, toPos);
    return {
        from: finalFrom,
        to: finalTo,
    };
}
const asyncLint = throttle(async (view) => {
    const sendString = view.state.doc.toString();
    const res = await loadSharedApi({ type: 'tool', systemType: apiType.value }).postPylint(view.state.doc.toString());
    if (sendString !== view.state.doc.toString()) {
        return [];
    }
    return res.data;
}, 500);
const regexpLinter = linter(async (view) => {
    const currentstate = view.state;
    const diagnostics = [];
    const lintResults = await asyncLint(view);
    if (!lintResults || lintResults.length === 0) {
        return diagnostics;
    }
    // LimitDiagnosisCount, avoid excessive diagnosticsInfo
    const maxDiagnostics = 50;
    const limitedResults = lintResults.slice(0, maxDiagnostics);
    limitedResults.forEach((element) => {
        try {
            const range = getRangeFromLineAndColumn(currentstate, element.line, element.column, element.endColumn);
            // VerifyRangeValidity
            if (range.from >= 0 && range.to >= range.from) {
                diagnostics.push({
                    from: range.from,
                    to: range.to,
                    severity: element.type === 'error' ? 'error' : 'warning',
                    message: element.message,
                });
            }
        }
        catch (error) {
            // console.error('Error processing lint result:', error)
        }
    });
    return diagnostics;
});
const extensions = [python(), oneDark, regexpLinter];
const codemirrorStyle = {
    height: '210px!important',
    width: '100%',
};
const cmRef = ref();
// Popup dialog related code
const dialogVisible = ref(false);
const cloneContent = ref('');
watch(dialogVisible, (bool) => {
    if (!bool) {
        emit('submitDialog', cloneContent.value);
    }
});
watch(() => props.modelValue, (newValue) => {
    cloneContent.value = newValue;
});
const openCodemirrorDialog = () => {
    cloneContent.value = props.modelValue;
    dialogVisible.value = true;
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "codemirror-editor w-full" },
});
/** @type {__VLS_StyleScopedClasses['codemirror-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: () => { } },
});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Codemirror} */
Codemirror;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.data),
    ref: "cmRef",
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.data),
    ref: "cmRef",
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
var __VLS_5;
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "codemirror-editor__footer" },
});
/** @type {__VLS_StyleScopedClasses['codemirror-editor__footer']} */ ;
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
    onClick: (__VLS_ctx.openCodemirrorDialog),
};
/** @type {__VLS_StyleScopedClasses['magnify']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    iconName: "app-magnify",
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    iconName: "app-magnify",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[data, extensions, codemirrorStyle, $attrs, openCodemirrorDialog,];
var __VLS_10;
var __VLS_11;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.title),
    appendToBody: true,
    fullscreen: true,
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.title),
    appendToBody: true,
    fullscreen: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
{
    const { title: __VLS_26 } = __VLS_23.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.title);
    var __VLS_27 = {};
    // @ts-ignore
    [dialogVisible, title, title,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: () => { } },
});
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.Codemirror} */
Codemirror;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.cloneContent),
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
    ...{ style: {} },
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.cloneContent),
    extensions: (__VLS_ctx.extensions),
    ...{ style: (__VLS_ctx.codemirrorStyle) },
    tabSize: (4),
    autofocus: (true),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
{
    const { footer: __VLS_34 } = __VLS_23.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_37 = __VLS_36({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    let __VLS_40;
    const __VLS_41 = {
        /** @type {typeof __VLS_40.click} */
        onClick: (__VLS_ctx.submitDialog),
    };
    const { default: __VLS_42 } = __VLS_38.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [extensions, codemirrorStyle, cloneContent, submitDialog, $t,];
    var __VLS_38;
    var __VLS_39;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_23;
// @ts-ignore
var __VLS_6 = __VLS_5, __VLS_28 = __VLS_27;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
const __VLS_export = {};
export default {};
