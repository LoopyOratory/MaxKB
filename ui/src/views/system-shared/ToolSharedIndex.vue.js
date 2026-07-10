/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import ToolListContainer from '@/views/tool/component/ToolListContainer.vue';
import useStore from '@/stores';
const { tool } = useStore();
const toolType = ref('');
function radioChange() {
    tool.setToolType(toolType.value);
}
onMounted(() => { });
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tool-shared" },
});
/** @type {__VLS_StyleScopedClasses['tool-shared']} */ ;
const __VLS_0 = ToolListContainer || ToolListContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        wrap: true,
    }));
    const __VLS_9 = __VLS_8({
        wrap: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
    elBreadcrumb;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        separatorIcon: "ArrowRight",
    }));
    const __VLS_15 = __VLS_14({
        separatorIcon: "ArrowRight",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
    elBreadcrumbItem;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    (__VLS_ctx.$t('views.shared.shared_resources'));
    // @ts-ignore
    [$t,];
    var __VLS_22;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
    elBreadcrumbItem;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const { default: __VLS_30 } = __VLS_28.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "ml-4 color-text-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    (__VLS_ctx.$t('views.tool.title'));
    // @ts-ignore
    [$t,];
    var __VLS_28;
    // @ts-ignore
    [];
    var __VLS_16;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        direction: "vertical",
    }));
    const __VLS_33 = __VLS_32({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.toolType),
        ...{ class: "app-radio-button-group" },
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.toolType),
        ...{ class: "app-radio-button-group" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_41;
    const __VLS_42 = {
        /** @type {typeof __VLS_41.change} */
        onChange: (__VLS_ctx.radioChange),
    };
    /** @type {__VLS_StyleScopedClasses['app-radio-button-group']} */ ;
    const { default: __VLS_43 } = __VLS_39.slots;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        value: "",
    }));
    const __VLS_46 = __VLS_45({
        value: "",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const { default: __VLS_49 } = __VLS_47.slots;
    (__VLS_ctx.$t('common.status.all'));
    // @ts-ignore
    [$t, toolType, radioChange,];
    var __VLS_47;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        value: "CUSTOM",
    }));
    const __VLS_52 = __VLS_51({
        value: "CUSTOM",
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_55 } = __VLS_53.slots;
    (__VLS_ctx.$t('views.tool.title'));
    // @ts-ignore
    [$t,];
    var __VLS_53;
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        value: "WORKFLOW",
    }));
    const __VLS_58 = __VLS_57({
        value: "WORKFLOW",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const { default: __VLS_61 } = __VLS_59.slots;
    (__VLS_ctx.$t('views.tool.toolWorkflow.title'));
    // @ts-ignore
    [$t,];
    var __VLS_59;
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        value: "SKILL",
    }));
    const __VLS_64 = __VLS_63({
        value: "SKILL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_67 } = __VLS_65.slots;
    // @ts-ignore
    [];
    var __VLS_65;
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        value: "MCP",
    }));
    const __VLS_70 = __VLS_69({
        value: "MCP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const { default: __VLS_73 } = __VLS_71.slots;
    // @ts-ignore
    [];
    var __VLS_71;
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        value: "DATA_SOURCE",
    }));
    const __VLS_76 = __VLS_75({
        value: "DATA_SOURCE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    const { default: __VLS_79 } = __VLS_77.slots;
    (__VLS_ctx.$t('views.tool.dataSource.title'));
    // @ts-ignore
    [$t,];
    var __VLS_77;
    // @ts-ignore
    [];
    var __VLS_39;
    var __VLS_40;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
