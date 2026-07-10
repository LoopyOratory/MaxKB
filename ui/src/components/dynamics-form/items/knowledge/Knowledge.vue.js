/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { relatedObject } from '@/utils/array';
import SelectHeader from '@/components/dynamics-form/items/common/SelectHeader.vue';
const props = withDefaults(defineProps(), { modelValue: () => [] });
defineOptions({ inheritAttrs: false });
const emit = defineEmits(['update:modelValue', 'change']);
const model_value = computed({
    get: () => props.modelValue.filter((id) => availableList.value.some((item) => item.id === id)) ||
        [],
    set: (value) => {
        emit('update:modelValue', value);
        emit('change', props.formField);
    },
});
// Available
const availableList = computed(() => {
    return props.formField.attrs?.knowledge_list || [];
});
const selectedIds = computed({
    get: () => model_value.value || [],
    set: (ids) => {
        model_value.value = ids;
    },
});
const __VLS_defaults = { modelValue: () => [] };
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
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.selectedIds),
    multiple: true,
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder')),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.selectedIds),
    multiple: true,
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.$attrs.popperHeader) {
    {
        const { header: __VLS_6 } = __VLS_3.slots;
        const __VLS_7 = SelectHeader;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
            header: (__VLS_ctx.$attrs.popperHeader),
        }));
        const __VLS_9 = __VLS_8({
            header: (__VLS_ctx.$attrs.popperHeader),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        // @ts-ignore
        [selectedIds, $t, $attrs, $attrs, $attrs,];
    }
}
for (const [item] of __VLS_vFor((__VLS_ctx.availableList))) {
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_14 = __VLS_13({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const { default: __VLS_17 } = __VLS_15.slots;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        size: (8),
    }));
    const __VLS_20 = __VLS_19({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const { default: __VLS_23 } = __VLS_21.slots;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
    KnowledgeIcon;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        type: (item.type),
        size: (20),
        ...{ style: {} },
    }));
    const __VLS_26 = __VLS_25({
        type: (item.type),
        size: (20),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (item.name);
    // @ts-ignore
    [availableList,];
    var __VLS_21;
    // @ts-ignore
    [];
    var __VLS_15;
    // @ts-ignore
    [];
}
{
    const { label: __VLS_29 } = __VLS_3.slots;
    const [{ label, value }] = __VLS_vSlot(__VLS_29);
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        size: (8),
    }));
    const __VLS_32 = __VLS_31({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
    KnowledgeIcon;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        type: (__VLS_ctx.relatedObject(__VLS_ctx.availableList, value, 'id')?.type),
        size: (14),
        ...{ style: {} },
    }));
    const __VLS_38 = __VLS_37({
        type: (__VLS_ctx.relatedObject(__VLS_ctx.availableList, value, 'id')?.type),
        size: (14),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (label);
    // @ts-ignore
    [availableList, relatedObject,];
    var __VLS_33;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
