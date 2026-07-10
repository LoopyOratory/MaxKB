/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, inject, onMounted, ref } from 'vue';
import { iconComponent } from '../icons/utils';
import { t } from '@/locales';
import { WorkflowMode } from '@/enums/application';
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const workflowMode = inject('workflowMode');
const data = computed({
    set: (value) => {
        emit('update:modelValue', value);
    },
    get: () => {
        return props.modelValue;
    },
});
const options = ref([]);
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
function visibleChange(bool) {
    if (bool) {
        initOptions();
    }
}
const validate = () => {
    const incomingNodeValue = getOptionsValue();
    if (!data.value || data.value.length === 0) {
        return Promise.reject(t('workflow.variable.ReferencingRequired'));
    }
    if (data.value.length < 2) {
        return Promise.reject(t('workflow.variable.ReferencingError'));
    }
    const node_id = data.value[0];
    const node_field = data.value[1];
    const nodeParent = incomingNodeValue.find((item) => item.value === node_id);
    if (!nodeParent) {
        data.value = [];
        return Promise.reject(t('workflow.variable.NoReferencing'));
    }
    if (!nodeParent.children.some((item) => item.value === node_field)) {
        data.value = [];
        return Promise.reject(t('workflow.variable.NoReferencing'));
    }
    return Promise.resolve('');
};
const get_up_node_field_list = (contain_self, use_cache) => {
    const result = props.nodeModel.get_up_node_field_list(contain_self, use_cache);
    if (props.nodeModel.graphModel.get_up_node_field_list) {
        const _u = props.nodeModel.graphModel.get_up_node_field_list(contain_self, use_cache);
        _u.forEach((item) => {
            result.push(item);
        });
    }
    return result.filter((v) => v.children && v.children.length > 0);
};
const getOptionsValue = () => {
    if ([WorkflowMode.ApplicationLoop, WorkflowMode.KnowledgeLoop, WorkflowMode.ToolLoop].includes(workflowMode)) {
        return props.global
            ? get_up_node_field_list(false, true).filter((v) => ['global', 'chat', 'output', 'loop'].includes(v.value) &&
                v.children &&
                v.children.length > 0)
            : get_up_node_field_list(false, true).filter((v) => v.children && v.children.length > 0);
    }
    else {
        return props.global
            ? props.nodeModel
                .get_up_node_field_list(false, true)
                .filter((v) => ['global', 'chat', 'output'].includes(v.value) && v.children && v.children.length > 0)
            : props.nodeModel
                .get_up_node_field_list(false, true)
                .filter((v) => v.children && v.children.length > 0);
    }
};
const initOptions = () => {
    options.value = getOptionsValue();
};
const __VLS_exposed = { validate };
defineExpose(__VLS_exposed);
onMounted(() => {
    initOptions();
});
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
/** @ts-ignore @type { | typeof __VLS_components.elCascader | typeof __VLS_components.ElCascader | typeof __VLS_components['el-cascader'] | typeof __VLS_components.elCascader | typeof __VLS_components.ElCascader | typeof __VLS_components['el-cascader']} */
elCascader;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onWheel': {} },
    ...{ 'onVisibleChange': {} },
    teleported: (false),
    options: (__VLS_ctx.options),
    modelValue: (__VLS_ctx.data),
    separator: " > ",
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onWheel': {} },
    ...{ 'onVisibleChange': {} },
    teleported: (false),
    options: (__VLS_ctx.options),
    modelValue: (__VLS_ctx.data),
    separator: " > ",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.wheel} */
    onWheel: (__VLS_ctx.wheel),
};
const __VLS_7 = {
    /** @type {typeof __VLS_5.visibleChange} */
    onVisibleChange: (__VLS_ctx.visibleChange),
};
var __VLS_8;
const { default: __VLS_9 } = __VLS_3.slots;
{
    const { default: __VLS_10 } = __VLS_3.slots;
    const [{ node, data }] = __VLS_vSlot(__VLS_10);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onWheel: (__VLS_ctx.wheel) },
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    const __VLS_11 = (__VLS_ctx.iconComponent(`${data.type}-icon`));
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ class: "mr-8" },
        size: (18),
        item: (data),
        ...{ style: {} },
    }));
    const __VLS_13 = __VLS_12({
        ...{ class: "mr-8" },
        size: (18),
        item: (data),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (data.label);
    // @ts-ignore
    [options, data, $attrs, wheel, wheel, visibleChange, iconComponent,];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
