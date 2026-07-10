/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { compareList } from '@/workflow/common/data';
import FieldSelector from './FieldSelector.vue';
import { inferFieldType, getAllowedOps, getFieldConfig } from './field-type';
const props = defineProps();
const __VLS_emit = defineEmits();
function onFieldChange() {
    props.cond._fieldError = '';
    props.cond._compareError = '';
    props.cond._valueError = '';
    const fieldType = inferFieldType(props.cond.field, props.nodeModel, props.currentNodeFields);
    const fieldConfig = getFieldConfig(props.cond.field, props.nodeModel, props.currentNodeFields);
    const isTreeMultiple = fieldType === 'TreeSelect' && fieldConfig?.attrs?.multiple;
    const allowed = isTreeMultiple ? ['contain', 'not_contain'] : getAllowedOps(fieldType);
    props.cond._ops = compareList.filter((op) => allowed.includes(op.value));
    props.cond._fieldType = fieldType;
    props.cond._options = fieldConfig?.option_list ?? [];
    props.cond._treeData = fieldConfig?.attrs?.data ?? [];
    props.cond._treeMultiple = isTreeMultiple;
    // Reset value on type switch
    const isMultiple = ['MultiSelect'].includes(fieldType || '') || isTreeMultiple;
    if (!allowed.includes(props.cond.compare)) {
        props.cond.compare = '';
        props.cond.value = isMultiple ? [] : '';
    }
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
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (8),
    ...{ class: "w-full" },
}));
const __VLS_2 = __VLS_1({
    gutter: (8),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    span: (10),
}));
const __VLS_9 = __VLS_8({
    span: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    error: (__VLS_ctx.cond._fieldError),
}));
const __VLS_15 = __VLS_14({
    error: (__VLS_ctx.cond._fieldError),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
const __VLS_19 = FieldSelector;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onChange': {} },
    nodeModel: (__VLS_ctx.nodeModel),
    modelValue: (__VLS_ctx.cond.field),
    currentNodeFields: (__VLS_ctx.currentNodeFields),
    currentEditingIndex: (__VLS_ctx.currentEditingIndex),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
}));
const __VLS_21 = __VLS_20({
    ...{ 'onChange': {} },
    nodeModel: (__VLS_ctx.nodeModel),
    modelValue: (__VLS_ctx.cond.field),
    currentNodeFields: (__VLS_ctx.currentNodeFields),
    currentEditingIndex: (__VLS_ctx.currentEditingIndex),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = {
    /** @type {typeof __VLS_24.change} */
    onChange: (__VLS_ctx.onFieldChange),
};
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_22;
var __VLS_23;
// @ts-ignore
[cond, cond, nodeModel, currentNodeFields, currentEditingIndex, $t, onFieldChange,];
var __VLS_16;
// @ts-ignore
[];
var __VLS_10;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    span: (6),
}));
const __VLS_28 = __VLS_27({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    error: (__VLS_ctx.cond._compareError),
}));
const __VLS_34 = __VLS_33({
    error: (__VLS_ctx.cond._compareError),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.cond.compare),
    clearable: true,
    placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage')),
}));
const __VLS_40 = __VLS_39({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.cond.compare),
    clearable: true,
    placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage')),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    /** @type {typeof __VLS_43.change} */
    onChange: (...[$event]) => {
        return __VLS_ctx.cond._compareError = '';
        // @ts-ignore
        [cond, cond, cond, $t,];
    },
};
const { default: __VLS_45 } = __VLS_41.slots;
for (const [op] of __VLS_vFor((__VLS_ctx.cond._ops || __VLS_ctx.compareList))) {
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        key: (op.value),
        label: (op.label),
        value: (op.value),
    }));
    const __VLS_48 = __VLS_47({
        key: (op.value),
        label: (op.label),
        value: (op.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [cond, compareList,];
}
// @ts-ignore
[];
var __VLS_41;
var __VLS_42;
// @ts-ignore
[];
var __VLS_35;
// @ts-ignore
[];
var __VLS_29;
if (!['is_true', 'is_not_true'].includes(__VLS_ctx.cond.compare)) {
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        span: (6),
    }));
    const __VLS_53 = __VLS_52({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_56 } = __VLS_54.slots;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        error: (__VLS_ctx.cond._valueError),
    }));
    const __VLS_59 = __VLS_58({
        error: (__VLS_ctx.cond._valueError),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const { default: __VLS_62 } = __VLS_60.slots;
    if (['SingleSelect', 'RadioCard', 'RadioRow'].includes(__VLS_ctx.cond._fieldType || '')) {
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.cond.value),
            clearable: true,
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }));
        const __VLS_65 = __VLS_64({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.cond.value),
            clearable: true,
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
        let __VLS_68;
        const __VLS_69 = {
            /** @type {typeof __VLS_68.change} */
            onChange: (...[$event]) => {
                if (!(!['is_true', 'is_not_true'].includes(__VLS_ctx.cond.compare)))
                    throw 0;
                if (!(['SingleSelect', 'RadioCard', 'RadioRow'].includes(__VLS_ctx.cond._fieldType || '')))
                    throw 0;
                return __VLS_ctx.cond._valueError = '';
                // @ts-ignore
                [cond, cond, cond, cond, cond, $t,];
            },
        };
        const { default: __VLS_70 } = __VLS_66.slots;
        for (const [o] of __VLS_vFor((__VLS_ctx.cond._options || []))) {
            let __VLS_71;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
                key: (o.value),
                label: (`${o.label} (${o.value})`),
                value: (o.value),
            }));
            const __VLS_73 = __VLS_72({
                key: (o.value),
                label: (`${o.label} (${o.value})`),
                value: (o.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_72));
            // @ts-ignore
            [cond,];
        }
        // @ts-ignore
        [];
        var __VLS_66;
        var __VLS_67;
    }
    else if (__VLS_ctx.cond._fieldType === 'MultiSelect') {
        let __VLS_76;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.cond.value),
            multiple: true,
            clearable: true,
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }));
        const __VLS_78 = __VLS_77({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.cond.value),
            multiple: true,
            clearable: true,
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        let __VLS_81;
        const __VLS_82 = {
            /** @type {typeof __VLS_81.change} */
            onChange: (...[$event]) => {
                if (!(!['is_true', 'is_not_true'].includes(__VLS_ctx.cond.compare)))
                    throw 0;
                if (!!(['SingleSelect', 'RadioCard', 'RadioRow'].includes(__VLS_ctx.cond._fieldType || '')))
                    throw 0;
                if (!(__VLS_ctx.cond._fieldType === 'MultiSelect'))
                    throw 0;
                return __VLS_ctx.cond._valueError = '';
                // @ts-ignore
                [cond, cond, cond, $t,];
            },
        };
        const { default: __VLS_83 } = __VLS_79.slots;
        for (const [o] of __VLS_vFor((__VLS_ctx.cond._options || []))) {
            let __VLS_84;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
                key: (o.value),
                label: (`${o.label} (${o.value})`),
                value: (o.value),
            }));
            const __VLS_86 = __VLS_85({
                key: (o.value),
                label: (`${o.label} (${o.value})`),
                value: (o.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_85));
            // @ts-ignore
            [cond,];
        }
        // @ts-ignore
        [];
        var __VLS_79;
        var __VLS_80;
    }
    else if (__VLS_ctx.cond._fieldType === 'TreeSelect') {
        let __VLS_89;
        /** @ts-ignore @type { | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select']} */
        elTreeSelect;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.cond.value),
            data: (__VLS_ctx.cond._treeData || []),
            multiple: (__VLS_ctx.cond._treeMultiple),
            renderAfterExpand: (false),
            clearable: true,
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }));
        const __VLS_91 = __VLS_90({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.cond.value),
            data: (__VLS_ctx.cond._treeData || []),
            multiple: (__VLS_ctx.cond._treeMultiple),
            renderAfterExpand: (false),
            clearable: true,
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        let __VLS_94;
        const __VLS_95 = {
            /** @type {typeof __VLS_94.change} */
            onChange: (...[$event]) => {
                if (!(!['is_true', 'is_not_true'].includes(__VLS_ctx.cond.compare)))
                    throw 0;
                if (!!(['SingleSelect', 'RadioCard', 'RadioRow'].includes(__VLS_ctx.cond._fieldType || '')))
                    throw 0;
                if (!!(__VLS_ctx.cond._fieldType === 'MultiSelect'))
                    throw 0;
                if (!(__VLS_ctx.cond._fieldType === 'TreeSelect'))
                    throw 0;
                return __VLS_ctx.cond._valueError = '';
                // @ts-ignore
                [cond, cond, cond, cond, cond, $t,];
            },
        };
        var __VLS_92;
        var __VLS_93;
    }
    else {
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            ...{ 'onInput': {} },
            modelValue: (__VLS_ctx.cond.value),
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }));
        const __VLS_98 = __VLS_97({
            ...{ 'onInput': {} },
            modelValue: (__VLS_ctx.cond.value),
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        let __VLS_101;
        const __VLS_102 = {
            /** @type {typeof __VLS_101.input} */
            onInput: (...[$event]) => {
                if (!(!['is_true', 'is_not_true'].includes(__VLS_ctx.cond.compare)))
                    throw 0;
                if (!!(['SingleSelect', 'RadioCard', 'RadioRow'].includes(__VLS_ctx.cond._fieldType || '')))
                    throw 0;
                if (!!(__VLS_ctx.cond._fieldType === 'MultiSelect'))
                    throw 0;
                if (!!(__VLS_ctx.cond._fieldType === 'TreeSelect'))
                    throw 0;
                return __VLS_ctx.cond._valueError = '';
                // @ts-ignore
                [cond, cond, $t,];
            },
        };
        var __VLS_99;
        var __VLS_100;
    }
    // @ts-ignore
    [];
    var __VLS_60;
    // @ts-ignore
    [];
    var __VLS_54;
}
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    span: (1),
}));
const __VLS_105 = __VLS_104({
    span: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const { default: __VLS_108 } = __VLS_106.slots;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    ...{ 'onClick': {} },
    link: true,
    type: "info",
    ...{ class: "mt-4" },
}));
const __VLS_111 = __VLS_110({
    ...{ 'onClick': {} },
    link: true,
    type: "info",
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
let __VLS_114;
const __VLS_115 = {
    /** @type {typeof __VLS_114.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.$emit('delete');
        // @ts-ignore
        [$emit,];
    },
};
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const { default: __VLS_116 } = __VLS_112.slots;
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    iconName: "app-delete",
}));
const __VLS_119 = __VLS_118({
    iconName: "app-delete",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
// @ts-ignore
[];
var __VLS_112;
var __VLS_113;
// @ts-ignore
[];
var __VLS_106;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
