/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { copyClick } from '@/utils/clipboard';
const mcp_servers = ref('');
const dialogVisible = ref(false);
const showIcon = ref(false);
const close = () => {
    dialogVisible.value = false;
};
const open = (item) => {
    mcp_servers.value = item.code;
    dialogVisible.value = true;
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
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
    title: (__VLS_ctx.$t('views.tool.mcp.mcpConfig')),
    width: "600",
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    ...{ class: "mcp-config-dialog" },
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.tool.mcp.mcpConfig')),
    width: "600",
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
    ...{ class: "mcp-config-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['mcp-config-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelWidth: "auto",
    labelPosition: "top",
}));
const __VLS_9 = __VLS_8({
    labelWidth: "auto",
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = {
    /** @type {typeof __VLS_18.mouseenter} */
    onMouseenter: (...[$event]) => {
        return __VLS_ctx.showIcon = true;
        // @ts-ignore
        [$t, dialogVisible, close, showIcon,];
    },
};
const __VLS_20 = {
    /** @type {typeof __VLS_18.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.showIcon = false;
        // @ts-ignore
        [showIcon,];
    },
};
const { default: __VLS_21 } = __VLS_16.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    type: "textarea",
    modelValue: (__VLS_ctx.mcp_servers),
    rows: "8",
    disabled: true,
    ...{ class: "config-textarea" },
}));
const __VLS_24 = __VLS_23({
    type: "textarea",
    modelValue: (__VLS_ctx.mcp_servers),
    rows: "8",
    disabled: true,
    ...{ class: "config-textarea" },
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
/** @type {__VLS_StyleScopedClasses['config-textarea']} */ ;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    ...{ 'onClick': {} },
    circle: true,
    ...{ class: "copy-icon" },
}));
const __VLS_29 = __VLS_28({
    ...{ 'onClick': {} },
    circle: true,
    ...{ class: "copy-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
const __VLS_33 = {
    /** @type {typeof __VLS_32.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.mcp_servers);
        // @ts-ignore
        [mcp_servers, mcp_servers, copyClick,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showIcon) }, null, null);
/** @type {__VLS_StyleScopedClasses['copy-icon']} */ ;
const { default: __VLS_34 } = __VLS_30.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    iconName: "app-copy",
    ...{ class: "color-secondary" },
}));
const __VLS_37 = __VLS_36({
    iconName: "app-copy",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
// @ts-ignore
[showIcon,];
var __VLS_30;
var __VLS_31;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
