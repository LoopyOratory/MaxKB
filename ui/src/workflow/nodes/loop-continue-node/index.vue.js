/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { computed, ref, onMounted } from 'vue';
import { set, cloneDeep } from 'lodash';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { compareList } from '@/workflow/common/data';
const props = defineProps();
const form = {
    condition_list: [],
    condition: 'and',
};
const wheel = (e) => {
    if (e.ctrlKey === true) {
        e.preventDefault();
        return true;
    }
    else {
        e.stopPropagation();
        return true;
    }
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            return props.nodeModel.properties.node_data;
        }
        else {
            set(props.nodeModel.properties, 'node_data', form);
        }
        return props.nodeModel.properties.node_data;
    },
    set: (value) => {
        set(props.nodeModel.properties, 'node_data', value);
    },
});
const addCondition = () => {
    const condition_list = cloneDeep(form_data.value?.condition_list || []);
    condition_list.push({
        field: [],
        compare: '',
        value: '',
    });
    set(props.nodeModel.properties.node_data, 'condition_list', condition_list);
};
const deleteCondition = (index) => {
    const condition_list = cloneDeep(form_data.value?.condition_list || []);
    condition_list.splice(index, 1);
    set(props.nodeModel.properties.node_data, 'condition_list', condition_list);
};
const ContinueFromRef = ref();
const validate = () => {
    const v_list = [ContinueFromRef.value?.validate()];
    return Promise.all(v_list).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
onMounted(() => {
    set(props.nodeModel, 'validate', validate);
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = NodeContainer || NodeContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_2 = __VLS_1({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "ContinueFromRef",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "ContinueFromRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = {
    /** @type {typeof __VLS_18.submit} */
    onSubmit: () => { },
};
var __VLS_20;
const { default: __VLS_22 } = __VLS_16.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "handle flex-between lighter mb-8" },
});
/** @type {__VLS_StyleScopedClasses['handle']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
if (__VLS_ctx.form_data.condition_list.length > 1) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "info" },
    });
    /** @type {__VLS_StyleScopedClasses['info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.info'));
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.condition),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_25 = __VLS_24({
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.condition),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    const { default: __VLS_28 } = __VLS_26.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        label: (__VLS_ctx.$t('workflow.condition.AND')),
        value: "and",
    }));
    const __VLS_31 = __VLS_30({
        label: (__VLS_ctx.$t('workflow.condition.AND')),
        value: "and",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        label: (__VLS_ctx.$t('workflow.condition.OR')),
        value: "or",
    }));
    const __VLS_36 = __VLS_35({
        label: (__VLS_ctx.$t('workflow.condition.OR')),
        value: "or",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    // @ts-ignore
    [nodeModel, form_data, form_data, form_data, $t, $t, $t,];
    var __VLS_26;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.label'));
}
for (const [condition, index] of __VLS_vFor((__VLS_ctx.form_data.condition_list))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        gutter: (8),
    }));
    const __VLS_41 = __VLS_40({
        gutter: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    const { default: __VLS_44 } = __VLS_42.slots;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        span: (11),
    }));
    const __VLS_47 = __VLS_46({
        span: (11),
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const { default: __VLS_50 } = __VLS_48.slots;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        prop: ('condition_list.' + index + '.field'),
        rules: ({
            type: 'array',
            required: true,
            message: __VLS_ctx.$t('workflow.variable.placeholder'),
            trigger: 'change',
        }),
    }));
    const __VLS_53 = __VLS_52({
        prop: ('condition_list.' + index + '.field'),
        rules: ({
            type: 'array',
            required: true,
            message: __VLS_ctx.$t('workflow.variable.placeholder'),
            trigger: 'change',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_56 } = __VLS_54.slots;
    const __VLS_57 = NodeCascader;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (condition.field),
    }));
    const __VLS_59 = __VLS_58({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (condition.field),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    var __VLS_62;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_60;
    // @ts-ignore
    [nodeModel, form_data, $t, $t, $t,];
    var __VLS_54;
    // @ts-ignore
    [];
    var __VLS_48;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        span: (6),
    }));
    const __VLS_66 = __VLS_65({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        prop: ('condition_list.' + index + '.compare'),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage'),
            trigger: 'change',
        }),
    }));
    const __VLS_72 = __VLS_71({
        prop: ('condition_list.' + index + '.compare'),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage'),
            trigger: 'change',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        ...{ 'onWheel': {} },
        teleported: (false),
        modelValue: (condition.compare),
        placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage')),
        clearable: true,
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onWheel': {} },
        teleported: (false),
        modelValue: (condition.compare),
        placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.conditions.requiredMessage')),
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_81;
    const __VLS_82 = {
        /** @type {typeof __VLS_81.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const { default: __VLS_83 } = __VLS_79.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.compareList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_84;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
            label: (item.label),
            value: (item.value),
        }));
        const __VLS_86 = __VLS_85({
            label: (item.label),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        // @ts-ignore
        [$t, $t, wheel, compareList,];
    }
    // @ts-ignore
    [];
    var __VLS_79;
    var __VLS_80;
    // @ts-ignore
    [];
    var __VLS_73;
    // @ts-ignore
    [];
    var __VLS_67;
    let __VLS_89;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
        span: (6),
    }));
    const __VLS_91 = __VLS_90({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    const { default: __VLS_94 } = __VLS_92.slots;
    if (!['is_null', 'is_not_null', 'is_true', 'is_not_true'].includes(condition.compare)) {
        let __VLS_95;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
            prop: ('condition_list.' + index + '.value'),
            rules: ({
                required: true,
                message: __VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage'),
                trigger: 'blur',
            }),
        }));
        const __VLS_97 = __VLS_96({
            prop: ('condition_list.' + index + '.value'),
            rules: ({
                required: true,
                message: __VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage'),
                trigger: 'blur',
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_96));
        const { default: __VLS_100 } = __VLS_98.slots;
        let __VLS_101;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
            modelValue: (condition.value),
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }));
        const __VLS_103 = __VLS_102({
            modelValue: (condition.value),
            placeholder: (__VLS_ctx.$t('workflow.nodes.conditionNode.valueMessage')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        // @ts-ignore
        [$t, $t,];
        var __VLS_98;
    }
    // @ts-ignore
    [];
    var __VLS_92;
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        span: (1),
    }));
    const __VLS_108 = __VLS_107({
        span: (1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    const { default: __VLS_111 } = __VLS_109.slots;
    let __VLS_112;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        ...{ class: "mt-4" },
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        ...{ class: "mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_117;
    const __VLS_118 = {
        /** @type {typeof __VLS_117.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteCondition(index);
            // @ts-ignore
            [deleteCondition,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    const { default: __VLS_119 } = __VLS_115.slots;
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        iconName: "app-delete",
    }));
    const __VLS_122 = __VLS_121({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    // @ts-ignore
    [];
    var __VLS_115;
    var __VLS_116;
    // @ts-ignore
    [];
    var __VLS_109;
    // @ts-ignore
    [];
    var __VLS_42;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_127 = __VLS_126({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
let __VLS_130;
const __VLS_131 = {
    /** @type {typeof __VLS_130.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.addCondition();
        // @ts-ignore
        [addCondition,];
    },
};
const { default: __VLS_132 } = __VLS_128.slots;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_135 = __VLS_134({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('workflow.nodes.conditionNode.addCondition'));
// @ts-ignore
[$t,];
var __VLS_128;
var __VLS_129;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_63 = __VLS_62;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
