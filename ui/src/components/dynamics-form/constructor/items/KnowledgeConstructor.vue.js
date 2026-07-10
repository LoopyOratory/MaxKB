/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, reactive, ref } from 'vue';
import AddKnowledgeDialog from '@/views/application/component/AddKnowledgeDialog.vue';
import Knowledge from '../../items/knowledge/Knowledge.vue';
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const collapseData = reactive({
    optional_knowledge: true,
});
const knowledgeLoading = ref(false);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue || { knowledge_list: [], default_value: [] };
    },
});
const formField = computed(() => {
    return { attrs: { knowledge_list: formValue.value.knowledge_list } };
});
const getData = () => {
    const knowledgeItemList = (formValue.value.knowledge_list || []).map((k) => {
        return {
            id: k.id,
            name: k.name,
            type: k.type,
            embedding_model_id: k.embedding_model_id,
        };
    });
    return {
        input_type: 'Knowledge',
        default_value: formValue.value.default_value || [],
        attrs: {
            knowledge_list: knowledgeItemList,
        },
    };
};
const rander = (form_data) => {
    formValue.value.default_value = form_data.default_value || [];
    formValue.value.knowledge_list = form_data.attrs?.knowledge_list || [];
};
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
const AddKnowledgeDialogRef = ref();
function openAddKnowledgeDialog() {
    const ids = formValue.value.knowledge_list?.map((k) => k.id) || [];
    AddKnowledgeDialogRef.value?.open(ids);
}
function addKnowledge(data) {
    formValue.value.knowledge_list = data;
    if (formValue.value.default_value) {
        const currentIds = data.map((k) => k.id);
        formValue.value.default_value = formValue.value.default_value.filter((id) => currentIds.includes(id));
    }
}
function removeKnowledge(id) {
    formValue.value.knowledge_list = formValue.value.knowledge_list.filter((k) => k.id !== id);
    if (formValue.value.default_value) {
        formValue.value.default_value = formValue.value.default_value.filter((k_id) => k_id !== id);
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
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    prop: "knowledge_list",
    rules: ([
        {
            message: __VLS_ctx.$t('dynamicsForm.KnowledgeConstructor.optionalKnowledgePlaceholder'),
            type: 'array',
            min: 1,
        },
    ]),
}));
const __VLS_2 = __VLS_1({
    prop: "knowledge_list",
    rules: ([
        {
            message: __VLS_ctx.$t('dynamicsForm.KnowledgeConstructor.optionalKnowledgePlaceholder'),
            type: 'array',
            min: 1,
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { label: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                return __VLS_ctx.collapseData.optional_knowledge = !__VLS_ctx.collapseData.optional_knowledge;
                // @ts-ignore
                [$t, collapseData, collapseData,];
            } },
        ...{ class: "flex-between mb-12 cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.optional_knowledge ? 'rotate-90' : '') },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.optional_knowledge ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    // @ts-ignore
    [collapseData,];
    var __VLS_10;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('dynamicsForm.KnowledgeConstructor.optionalKnowledge'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    if (__VLS_ctx.formValue.knowledge_list?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.formValue.knowledge_list.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_23;
    const __VLS_24 = {
        /** @type {typeof __VLS_23.click} */
        onClick: (__VLS_ctx.openAddKnowledgeDialog),
    };
    const { default: __VLS_25 } = __VLS_21.slots;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        iconName: "app-add-outlined",
    }));
    const __VLS_28 = __VLS_27({
        iconName: "app-add-outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    // @ts-ignore
    [$t, formValue, formValue, openAddKnowledgeDialog,];
    var __VLS_21;
    var __VLS_22;
    // @ts-ignore
    [];
}
if (__VLS_ctx.collapseData.optional_knowledge) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (__VLS_ctx.formValue.knowledge_list?.length > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        for (const [item, index] of __VLS_vFor((__VLS_ctx.formValue.knowledge_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between border border-r-6 white-bg mb-8" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_31;
            /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
            KnowledgeIcon;
            // @ts-ignore
            const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
                type: (item.type),
                ...{ class: "mr-8" },
                size: (20),
                ...{ style: {} },
            }));
            const __VLS_33 = __VLS_32({
                type: (item.type),
                ...{ class: "mr-8" },
                size: (20),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_32));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis cursor" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            (item.name);
            let __VLS_36;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_38 = __VLS_37({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            let __VLS_41;
            const __VLS_42 = {
                /** @type {typeof __VLS_41.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.collapseData.optional_knowledge))
                        throw 0;
                    if (!(__VLS_ctx.formValue.knowledge_list?.length > 0))
                        throw 0;
                    return __VLS_ctx.removeKnowledge(item.id);
                    // @ts-ignore
                    [collapseData, formValue, formValue, removeKnowledge,];
                },
            };
            const { default: __VLS_43 } = __VLS_39.slots;
            let __VLS_44;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({}));
            const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
            const { default: __VLS_49 } = __VLS_47.slots;
            let __VLS_50;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({}));
            const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
            // @ts-ignore
            [];
            var __VLS_47;
            // @ts-ignore
            [];
            var __VLS_39;
            var __VLS_40;
            // @ts-ignore
            [];
        }
    }
    else {
        let __VLS_55;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
            type: "info",
        }));
        const __VLS_57 = __VLS_56({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_56));
        const { default: __VLS_60 } = __VLS_58.slots;
        (__VLS_ctx.$t('dynamicsForm.KnowledgeConstructor.optionalKnowledgePlaceholder'));
        // @ts-ignore
        [$t,];
        var __VLS_58;
    }
}
// @ts-ignore
[];
var __VLS_3;
if (__VLS_ctx.formValue.knowledge_list && __VLS_ctx.formValue.knowledge_list.length > 0) {
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        label: (__VLS_ctx.$t('dynamicsForm.KnowledgeConstructor.defaultKnowledge')),
        prop: "default_value",
        required: (__VLS_ctx.formValue.required),
        rules: (__VLS_ctx.formValue.required
            ? [{ message: __VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder'), type: 'array', min: 1 }]
            : []),
    }));
    const __VLS_63 = __VLS_62({
        label: (__VLS_ctx.$t('dynamicsForm.KnowledgeConstructor.defaultKnowledge')),
        prop: "default_value",
        required: (__VLS_ctx.formValue.required),
        rules: (__VLS_ctx.formValue.required
            ? [{ message: __VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder'), type: 'array', min: 1 }]
            : []),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    const { default: __VLS_66 } = __VLS_64.slots;
    if (__VLS_ctx.formValue.knowledge_list?.length > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        const __VLS_67 = Knowledge;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
            modelValue: (__VLS_ctx.formValue.default_value),
            formField: (__VLS_ctx.formField),
        }));
        const __VLS_69 = __VLS_68({
            modelValue: (__VLS_ctx.formValue.default_value),
            formField: (__VLS_ctx.formField),
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    }
    // @ts-ignore
    [$t, $t, formValue, formValue, formValue, formValue, formValue, formValue, formField,];
    var __VLS_64;
}
const __VLS_72 = AddKnowledgeDialog;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    ...{ 'onAddData': {} },
    ref: "AddKnowledgeDialogRef",
    data: (__VLS_ctx.formValue.knowledge_list),
    loading: (__VLS_ctx.knowledgeLoading),
}));
const __VLS_74 = __VLS_73({
    ...{ 'onAddData': {} },
    ref: "AddKnowledgeDialogRef",
    data: (__VLS_ctx.formValue.knowledge_list),
    loading: (__VLS_ctx.knowledgeLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_77;
const __VLS_78 = {
    /** @type {typeof __VLS_77.addData} */
    onAddData: (__VLS_ctx.addKnowledge),
};
var __VLS_79;
var __VLS_75;
var __VLS_76;
// @ts-ignore
var __VLS_80 = __VLS_79;
// @ts-ignore
[formValue, knowledgeLoading, addKnowledge,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
