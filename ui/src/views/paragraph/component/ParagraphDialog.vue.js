/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep, debounce } from 'lodash';
import ParagraphForm from '@/views/paragraph/component/ParagraphForm.vue';
import ProblemComponent from '@/views/paragraph/component/ProblemComponent.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
const props = defineProps();
const route = useRoute();
const { params: { id, documentId }, } = route;
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][props.apiType];
});
const emit = defineEmits(['refresh']);
const ProblemRef = ref();
const paragraphFormRef = ref();
const dialogVisible = ref(false);
const loading = ref(false);
const paragraphId = ref('');
const detail = ref({});
const isEdit = ref(false);
const document_id = ref('');
const dataset_id = ref('');
const cloneData = ref(null);
const position = ref(null);
watch(dialogVisible, (bool) => {
    if (!bool) {
        paragraphId.value = '';
        detail.value = {};
        isEdit.value = false;
        document_id.value = '';
        dataset_id.value = '';
        cloneData.value = null;
    }
});
const cancelEdit = () => {
    isEdit.value = false;
    detail.value = cloneDeep(cloneData.value);
};
const open = (data, str) => {
    if (data && str === 'add') {
        isEdit.value = true;
        position.value = data.position;
    }
    else if (data) {
        detail.value.title = data.title;
        detail.value.content = data.content;
        cloneData.value = cloneDeep(detail.value);
        paragraphId.value = data.id;
        document_id.value = data.document_id;
        dataset_id.value = data.dataset_id || id;
        if (str === 'edit') {
            isEdit.value = true;
        }
        else {
            isEdit.value = false;
        }
    }
    else {
        isEdit.value = true;
    }
    dialogVisible.value = true;
};
const submitHandle = async () => {
    if (await paragraphFormRef.value?.validate()) {
        loading.value = true;
        if (paragraphId.value) {
            loadSharedApi({ type: 'paragraph', systemType: props.apiType })
                .putParagraph(dataset_id.value, documentId || document_id.value, paragraphId.value, paragraphFormRef.value?.form, loading)
                .then((res) => {
                isEdit.value = false;
                emit('refresh', res.data);
            });
        }
        else {
            const obj = ProblemRef.value.problemList.length > 0
                ? {
                    position: String(position.value) ? position.value : null,
                    problem_list: ProblemRef.value.problemList,
                    ...paragraphFormRef.value?.form,
                }
                : {
                    position: String(position.value) ? position.value : null,
                    ...paragraphFormRef.value?.form,
                };
            loadSharedApi({ type: 'paragraph', systemType: props.apiType })
                .postParagraph(id, documentId, obj, loading)
                .then(() => {
                dialogVisible.value = false;
                emit('refresh');
            });
        }
    }
};
const handleDebounceClick = debounce(() => {
    submitHandle();
}, 200);
const __VLS_exposed = { open, dialogVisible };
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
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "80%",
    ...{ class: "paragraph-dialog" },
    destroyOnClose: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "80%",
    ...{ class: "paragraph-dialog" },
    destroyOnClose: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['paragraph-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    span: (18),
}));
const __VLS_15 = __VLS_14({
    span: (18),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    height: "500",
    wrapClass: "paragraph-scrollbar",
}));
const __VLS_21 = __VLS_20({
    height: "500",
    wrapClass: "paragraph-scrollbar",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
if (__VLS_ctx.paragraphId && !__VLS_ctx.isEdit) {
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        /** @type {typeof __VLS_30.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.paragraphId && !__VLS_ctx.isEdit))
                throw 0;
            return __VLS_ctx.isEdit = true;
            // @ts-ignore
            [title, dialogVisible, vLoading, loading, paragraphId, isEdit, isEdit,];
        },
    };
    const { default: __VLS_32 } = __VLS_28.slots;
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        iconName: "app-edit",
    }));
    const __VLS_35 = __VLS_34({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    // @ts-ignore
    [];
    var __VLS_28;
    var __VLS_29;
}
const __VLS_38 = ParagraphForm;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ref: "paragraphFormRef",
    data: (__VLS_ctx.detail),
    isEdit: (__VLS_ctx.isEdit),
    knowledgeId: (__VLS_ctx.id),
}));
const __VLS_40 = __VLS_39({
    ref: "paragraphFormRef",
    data: (__VLS_ctx.detail),
    isEdit: (__VLS_ctx.isEdit),
    knowledgeId: (__VLS_ctx.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
var __VLS_43;
var __VLS_41;
// @ts-ignore
[isEdit, detail, id,];
var __VLS_22;
if (__VLS_ctx.paragraphId && __VLS_ctx.isEdit) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-right p-24 pt-0" },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        ...{ 'onClick': {} },
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_50;
    const __VLS_51 = {
        /** @type {typeof __VLS_50.click} */
        onClick: (__VLS_ctx.cancelEdit),
    };
    const { default: __VLS_52 } = __VLS_48.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [paragraphId, isEdit, cancelEdit, $t,];
    var __VLS_48;
    var __VLS_49;
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_58;
    const __VLS_59 = {
        /** @type {typeof __VLS_58.click} */
        onClick: (__VLS_ctx.handleDebounceClick),
    };
    const { default: __VLS_60 } = __VLS_56.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [loading, $t, handleDebounceClick,];
    var __VLS_56;
    var __VLS_57;
}
// @ts-ignore
[];
var __VLS_16;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    span: (6),
    ...{ class: "border-l" },
    ...{ style: {} },
}));
const __VLS_63 = __VLS_62({
    span: (6),
    ...{ class: "border-l" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
/** @type {__VLS_StyleScopedClasses['border-l']} */ ;
const { default: __VLS_66 } = __VLS_64.slots;
if (__VLS_ctx.permissionPrecise.problem_read(__VLS_ctx.id)) {
    const __VLS_67 = ProblemComponent;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        paragraphId: (__VLS_ctx.paragraphId),
        docId: (__VLS_ctx.document_id),
        knowledgeId: (__VLS_ctx.id),
        apiType: (__VLS_ctx.apiType),
        ref: "ProblemRef",
    }));
    const __VLS_69 = __VLS_68({
        paragraphId: (__VLS_ctx.paragraphId),
        docId: (__VLS_ctx.document_id),
        knowledgeId: (__VLS_ctx.id),
        apiType: (__VLS_ctx.apiType),
        ref: "ProblemRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    var __VLS_72;
    var __VLS_70;
}
// @ts-ignore
[paragraphId, id, id, permissionPrecise, document_id, apiType,];
var __VLS_64;
// @ts-ignore
[];
var __VLS_10;
if (!__VLS_ctx.paragraphId) {
    {
        const { footer: __VLS_74 } = __VLS_3.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "dialog-footer" },
        });
        /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            ...{ 'onClick': {} },
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_80;
        const __VLS_81 = {
            /** @type {typeof __VLS_80.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.paragraphId))
                    throw 0;
                return __VLS_ctx.dialogVisible = false;
                // @ts-ignore
                [dialogVisible, paragraphId,];
            },
        };
        const { default: __VLS_82 } = __VLS_78.slots;
        (__VLS_ctx.$t('common.cancel'));
        // @ts-ignore
        [$t,];
        var __VLS_78;
        var __VLS_79;
        let __VLS_83;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.loading),
            type: "primary",
        }));
        const __VLS_85 = __VLS_84({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.loading),
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_84));
        let __VLS_88;
        const __VLS_89 = {
            /** @type {typeof __VLS_88.click} */
            onClick: (__VLS_ctx.handleDebounceClick),
        };
        const { default: __VLS_90 } = __VLS_86.slots;
        (__VLS_ctx.$t('common.submit'));
        // @ts-ignore
        [loading, $t, handleDebounceClick,];
        var __VLS_86;
        var __VLS_87;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_44 = __VLS_43, __VLS_73 = __VLS_72;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
