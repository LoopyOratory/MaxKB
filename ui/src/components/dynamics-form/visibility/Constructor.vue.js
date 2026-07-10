/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import { randomId } from '@/utils/common';
import { inferFieldType, getAllowedOps, getFieldConfig } from './field-type';
import { compareList } from '@/workflow/common/data';
import ConditionRow from './ConditionRow.vue';
import { t } from '@/locales';
const props = defineProps();
const formData = ref({
    action: 'show',
    condition: 'and',
    conditions: [],
});
function addCondition() {
    formData.value.conditions.push({
        id: randomId(),
        field: ['', ''],
        compare: '',
        value: '',
    });
}
function removeCondition(idx) {
    formData.value.conditions.splice(idx, 1);
}
function validate() {
    let hasError = false;
    for (const cond of formData.value.conditions) {
        cond._fieldError = '';
        cond._compareError = '';
        cond._valueError = '';
    }
    for (const cond of formData.value.conditions) {
        const hasAny = cond.field[0] || cond.field[1] || cond.compare;
        if (!hasAny)
            continue;
        if (!cond.field[0] || !cond.field[1]) {
            cond._fieldError = t('workflow.variable.placeholder');
            hasError = true;
        }
        if (!cond.compare) {
            cond._compareError = t('workflow.nodes.conditionNode.conditions.requiredMessage');
            hasError = true;
        }
        const isEmpty = Array.isArray(cond.value)
            ? cond.value.length === 0
            : !cond.value && cond.value !== 0;
        if (!['is_true', 'is_not_true'].includes(cond.compare) && isEmpty) {
            cond._valueError = t('workflow.nodes.conditionNode.valueMessage');
            hasError = true;
        }
    }
    return hasError ? Promise.reject() : Promise.resolve();
}
function getData() {
    const conds = formData.value.conditions;
    if (conds.length === 0)
        return null;
    return {
        action: formData.value.action,
        condition: formData.value.condition,
        node_id: props.nodeModel?.id,
        node_name: props.nodeModel?.properties?.stepName,
        conditions: conds
            .filter((c) => c.field[0] && c.field[1] && c.compare)
            .map((c) => ({
            id: c.id,
            field: c.field,
            compare: c.compare,
            value: c.value,
            // _ops, _fieldType, _options Not persistent
        })),
    };
}
function restore(rules) {
    if (rules && rules.conditions?.length) {
        formData.value.action = rules.action;
        formData.value.condition = rules.condition;
        formData.value.conditions = rules.conditions.map((c) => ({
            id: c.id || randomId(),
            field: [c.field[0], c.field[1]],
            compare: c.compare,
            value: c.value,
        }));
        formData.value.conditions.forEach((cond) => {
            if (cond.field && cond.field[0] && cond.field[1]) {
                const fieldType = inferFieldType(cond.field, props.nodeModel, props.currentNodeFields);
                const fieldConfig = getFieldConfig(cond.field, props.nodeModel, props.currentNodeFields);
                const isTreeMultiple = fieldType === 'TreeSelect' && fieldConfig?.attrs?.multiple;
                const allowed = isTreeMultiple ? ['contain', 'not_contain'] : getAllowedOps(fieldType);
                cond._ops = compareList.filter((op) => allowed.includes(op.value));
                cond._fieldType = fieldType;
                cond._options = fieldConfig?.option_list ?? [];
                cond._treeData = fieldConfig?.attrs?.data ?? [];
                cond._treeMultiple = isTreeMultiple;
                const isMultiple = ['MultiSelect'].includes(fieldType || '') || isTreeMultiple;
                // Clean up dirty data
                if (cond.compare && !allowed.includes(cond.compare)) {
                    cond.compare = '';
                    cond.value = isMultiple ? [] : '';
                }
            }
        });
    }
}
onMounted(() => {
    formData.value.conditions = [
        {
            id: randomId(),
            field: ['', ''],
            compare: '',
            value: '',
        },
    ];
});
const __VLS_exposed = { getData, restore, validate };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.formData.action),
    ...{ class: "mb-8" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.formData.action),
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    value: "show",
}));
const __VLS_8 = __VLS_7({
    value: "show",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.$t('workflow.nodes.baseNode.visibilitySetting.showCondition'));
// @ts-ignore
[formData, $t,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    value: "hide",
}));
const __VLS_14 = __VLS_13({
    value: "hide",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
(__VLS_ctx.$t('workflow.nodes.baseNode.visibilitySetting.hideCondition'));
// @ts-ignore
[$t,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.info'));
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.formData.condition),
    size: "small",
    ...{ style: {} },
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.formData.condition),
    size: "small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    label: (__VLS_ctx.$t('workflow.condition.AND')),
    value: "and",
}));
const __VLS_26 = __VLS_25({
    label: (__VLS_ctx.$t('workflow.condition.AND')),
    value: "and",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    label: (__VLS_ctx.$t('workflow.condition.OR')),
    value: "or",
}));
const __VLS_31 = __VLS_30({
    label: (__VLS_ctx.$t('workflow.condition.OR')),
    value: "or",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
// @ts-ignore
[formData, $t, $t, $t,];
var __VLS_21;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.label'));
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({}));
const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
for (const [cond, idx] of __VLS_vFor((__VLS_ctx.formData.conditions))) {
    const __VLS_40 = ConditionRow;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onDelete': {} },
        key: (cond.id),
        cond: (cond),
        index: (idx),
        nodeModel: (__VLS_ctx.nodeModel),
        currentNodeFields: (__VLS_ctx.currentNodeFields),
        currentEditingIndex: (__VLS_ctx.currentEditingIndex),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onDelete': {} },
        key: (cond.id),
        cond: (cond),
        index: (idx),
        nodeModel: (__VLS_ctx.nodeModel),
        currentNodeFields: (__VLS_ctx.currentNodeFields),
        currentEditingIndex: (__VLS_ctx.currentEditingIndex),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        /** @type {typeof __VLS_45.delete} */
        onDelete: (...[$event]) => {
            return __VLS_ctx.removeCondition(idx);
            // @ts-ignore
            [formData, $t, nodeModel, currentNodeFields, currentEditingIndex, removeCondition,];
        },
    };
    var __VLS_43;
    var __VLS_44;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_37;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = {
    /** @type {typeof __VLS_52.click} */
    onClick: (__VLS_ctx.addCondition),
};
const { default: __VLS_54 } = __VLS_50.slots;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_57 = __VLS_56({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t, addCondition,];
var __VLS_50;
var __VLS_51;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeProps: {},
});
export default {};
