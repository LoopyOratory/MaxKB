/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, nextTick } from 'vue';
import { cloneDeep } from 'lodash';
import ParagraphForm from '@/views/paragraph/component/ParagraphForm.vue';
const props = defineProps({
    isConnect: Boolean,
    knowledgeId: String,
});
const emit = defineEmits(['updateContent']);
const dialogVisible = ref(false);
const detail = ref({});
const paragraphFormRef = ref();
const inputRef = ref();
const isAddProblem = ref(false);
const problemValue = ref('');
watch(dialogVisible, (bool) => {
    if (!bool) {
        detail.value = {};
    }
});
const open = (data) => {
    detail.value = cloneDeep(data);
    dialogVisible.value = true;
};
function delProblemHandle(item, index) {
    detail.value.problem_list.splice(index, 1);
}
function addProblemHandle() {
    if (problemValue.value.trim()) {
        if (!detail.value?.problem_list.some((item) => item.content === problemValue.value.trim())) {
            detail.value?.problem_list?.push({
                content: problemValue.value.trim(),
            });
        }
        problemValue.value = '';
        isAddProblem.value = false;
    }
}
function addProblem() {
    isAddProblem.value = true;
    nextTick(() => {
        inputRef.value?.focus();
    });
}
const submitHandle = async () => {
    if (await paragraphFormRef.value?.validate()) {
        emit('updateContent', {
            problem_list: detail.value.problem_list,
            ...paragraphFormRef.value?.form,
        });
        dialogVisible.value = false;
    }
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.$t('views.paragraph.editParagraph')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "80%",
    destroyOnClose: true,
    ...{ class: "paragraph-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.paragraph.editParagraph')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "80%",
    destroyOnClose: true,
    ...{ class: "paragraph-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['paragraph-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.isConnect) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        span: (18),
        ...{ class: "p-24" },
    }));
    const __VLS_15 = __VLS_14({
        span: (18),
        ...{ class: "p-24" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    const { default: __VLS_18 } = __VLS_16.slots;
    const __VLS_19 = ParagraphForm;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ref: "paragraphFormRef",
        data: (__VLS_ctx.detail),
        isEdit: (true),
        knowledgeId: (__VLS_ctx.knowledgeId),
    }));
    const __VLS_21 = __VLS_20({
        ref: "paragraphFormRef",
        data: (__VLS_ctx.detail),
        isEdit: (true),
        knowledgeId: (__VLS_ctx.knowledgeId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    var __VLS_24;
    var __VLS_22;
    // @ts-ignore
    [$t, dialogVisible, isConnect, detail, knowledgeId,];
    var __VLS_16;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        span: (6),
        ...{ class: "border-l" },
        ...{ style: {} },
    }));
    const __VLS_28 = __VLS_27({
        span: (6),
        ...{ class: "border-l" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    /** @type {__VLS_StyleScopedClasses['border-l']} */ ;
    const { default: __VLS_31 } = __VLS_29.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "bold title p-24" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.paragraph.relatedProblem.title'));
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        direction: "vertical",
        ...{ class: "mr-4" },
    }));
    const __VLS_34 = __VLS_33({
        direction: "vertical",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_42;
    const __VLS_43 = {
        /** @type {typeof __VLS_42.click} */
        onClick: (__VLS_ctx.addProblem),
    };
    const { default: __VLS_44 } = __VLS_40.slots;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        iconName: "app-add-outlined",
    }));
    const __VLS_47 = __VLS_46({
        iconName: "app-add-outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    // @ts-ignore
    [$t, addProblem,];
    var __VLS_40;
    var __VLS_41;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        height: "500px",
    }));
    const __VLS_52 = __VLS_51({
        height: "500px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_55 } = __VLS_53.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-24" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    if (__VLS_ctx.isAddProblem) {
        let __VLS_56;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
            ...{ 'onChange': {} },
            ...{ 'onBlur': {} },
            modelValue: (__VLS_ctx.problemValue),
            placeholder: (__VLS_ctx.$t('views.paragraph.relatedProblem.placeholder')),
            ref: "inputRef",
            ...{ class: "mb-8" },
        }));
        const __VLS_58 = __VLS_57({
            ...{ 'onChange': {} },
            ...{ 'onBlur': {} },
            modelValue: (__VLS_ctx.problemValue),
            placeholder: (__VLS_ctx.$t('views.paragraph.relatedProblem.placeholder')),
            ref: "inputRef",
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        let __VLS_61;
        const __VLS_62 = {
            /** @type {typeof __VLS_61.change} */
            onChange: (__VLS_ctx.addProblemHandle),
        };
        const __VLS_63 = {
            /** @type {typeof __VLS_61.blur} */
            onBlur: (...[$event]) => {
                if (!(__VLS_ctx.isConnect))
                    throw 0;
                if (!(__VLS_ctx.isAddProblem))
                    throw 0;
                return __VLS_ctx.isAddProblem = false;
                // @ts-ignore
                [$t, isAddProblem, isAddProblem, problemValue, addProblemHandle,];
            },
        };
        var __VLS_64;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        var __VLS_59;
        var __VLS_60;
    }
    for (const [item, index] of __VLS_vFor((__VLS_ctx.detail.problem_list))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_66;
        /** @ts-ignore @type { | typeof __VLS_components.TagEllipsis | typeof __VLS_components.TagEllipsis} */
        TagEllipsis;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
            ...{ 'onClose': {} },
            ...{ class: "question-tag" },
            type: "info",
            effect: "plain",
            closable: true,
        }));
        const __VLS_68 = __VLS_67({
            ...{ 'onClose': {} },
            ...{ class: "question-tag" },
            type: "info",
            effect: "plain",
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        let __VLS_71;
        const __VLS_72 = {
            /** @type {typeof __VLS_71.close} */
            onClose: (...[$event]) => {
                if (!(__VLS_ctx.isConnect))
                    throw 0;
                return __VLS_ctx.delProblemHandle(item, index);
                // @ts-ignore
                [detail, delProblemHandle,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['question-tag']} */ ;
        const { default: __VLS_73 } = __VLS_69.slots;
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
        autoTooltip;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            content: (item.content),
        }));
        const __VLS_76 = __VLS_75({
            content: (item.content),
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        const { default: __VLS_79 } = __VLS_77.slots;
        (item.content);
        // @ts-ignore
        [];
        var __VLS_77;
        // @ts-ignore
        [];
        var __VLS_69;
        var __VLS_70;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_53;
    // @ts-ignore
    [];
    var __VLS_29;
    // @ts-ignore
    [];
    var __VLS_10;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-24" },
    });
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    const __VLS_80 = ParagraphForm;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ref: "paragraphFormRef",
        data: (__VLS_ctx.detail),
        isEdit: (true),
        knowledgeId: (__VLS_ctx.knowledgeId),
    }));
    const __VLS_82 = __VLS_81({
        ref: "paragraphFormRef",
        data: (__VLS_ctx.detail),
        isEdit: (true),
        knowledgeId: (__VLS_ctx.knowledgeId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    var __VLS_85;
    var __VLS_83;
}
{
    const { footer: __VLS_87 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_93;
    const __VLS_94 = {
        /** @type {typeof __VLS_93.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, detail, knowledgeId,];
        },
    };
    const { default: __VLS_95 } = __VLS_91.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_91;
    var __VLS_92;
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_101;
    const __VLS_102 = {
        /** @type {typeof __VLS_101.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_103 } = __VLS_99.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, submitHandle,];
    var __VLS_99;
    var __VLS_100;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_25 = __VLS_24, __VLS_65 = __VLS_64, __VLS_86 = __VLS_85;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        isConnect: Boolean,
        knowledgeId: String,
    },
});
export default {};
