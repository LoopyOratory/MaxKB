/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep } from 'lodash';
import { ref, computed, watchEffect } from 'vue';
import EditParagraphDialog from './EditParagraphDialog.vue';
import { MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
const page_size = ref(30);
const current_page = ref(1);
const currentCIndex = ref(0);
const EditParagraphDialogRef = ref();
const emit = defineEmits(['update:modelValue']);
const loading = ref(false);
const localParagraphList = ref([]);
const props = defineProps({
    modelValue: {
        type: (Array),
        default: () => [],
    },
    isConnect: Boolean,
    knowledgeId: String,
});
// InitializeLoadData
watchEffect(() => {
    if (props.modelValue && props.modelValue.length > 0) {
        const end = page_size.value * current_page.value;
        localParagraphList.value = props.modelValue.slice(0, Math.min(end, props.modelValue.length));
    }
});
// ListenPaginationChange, onlyLoadNeedsData
watchEffect(() => {
    const start = 0;
    const end = page_size.value * current_page.value;
    // RegardlessDataAmount, allEnsureGetAllShouldShowData
    localParagraphList.value = props.modelValue.slice(start, Math.min(end, props.modelValue.length));
});
const paragraph_list = computed(() => {
    return localParagraphList.value;
});
const show = ref(null);
function cardEnter(cIndex) {
    show.value = cIndex;
}
function cardLeave() {
    show.value = null;
}
const next = () => {
    if (loading.value)
        return;
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 100);
};
const editHandle = (item, cIndex) => {
    // CalculateActualIndex, considerPagination
    currentCIndex.value = cIndex;
    // currentCIndex.value = cIndex + page_size.value * (current_page.value - 1)
    // console.log('Edit index:', cIndex, page_size.value, current_page.value, currentCIndex.value)
    EditParagraphDialogRef.value.open(item);
};
const updateContent = (data) => {
    const new_value = [...props.modelValue];
    if (props.isConnect &&
        data.title &&
        !data?.problem_list.some((item) => item.content === data.title.trim())) {
        data['problem_list'].push({
            content: data.title.trim(),
        });
    }
    new_value[currentCIndex.value] = cloneDeep(data);
    emit('update:modelValue', new_value);
    // UpdateLocalList
    const localIndex = currentCIndex.value - page_size.value * (current_page.value - 1);
    if (localIndex >= 0 && localIndex < localParagraphList.value.length) {
        localParagraphList.value[localIndex] = cloneDeep(data);
    }
};
const deleteHandle = (item, cIndex) => {
    MsgConfirm(`${t('views.paragraph.delete.confirmTitle')}${item.title || '-'} ?`, t('views.paragraph.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        const new_value = [...props.modelValue];
        new_value.splice(cIndex, 1);
        emit('update:modelValue', new_value);
        // UpdateLocalList
        localParagraphList.value.splice(cIndex, 1);
        // If current page deletion is done, fetch one more from total data and append to end
        if (props.modelValue.length > localParagraphList.value.length * current_page.value) {
            const nextItem = props.modelValue[localParagraphList.value.length * current_page.value];
            if (nextItem) {
                localParagraphList.value.push(nextItem);
            }
        }
    })
        .catch(() => { });
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
InfiniteScroll;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.paragraph_list.length),
    total: (__VLS_ctx.modelValue.length),
    page_size: (__VLS_ctx.page_size),
    current_page: (__VLS_ctx.current_page),
    loading: (__VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.paragraph_list.length),
    total: (__VLS_ctx.modelValue.length),
    page_size: (__VLS_ctx.page_size),
    current_page: (__VLS_ctx.current_page),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.load} */
    onLoad: (...[$event]) => {
        return __VLS_ctx.next();
        // @ts-ignore
        [paragraph_list, modelValue, page_size, current_page, loading, next,];
    },
};
const { default: __VLS_7 } = __VLS_3.slots;
for (const [child, cIndex] of __VLS_vFor((__VLS_ctx.paragraph_list))) {
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onMouseenter': {} },
        ...{ 'onMouseleave': {} },
        key: (cIndex),
        shadow: "never",
        ...{ class: "paragraph-preview-card card-never mb-16" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onMouseenter': {} },
        ...{ 'onMouseleave': {} },
        key: (cIndex),
        shadow: "never",
        ...{ class: "paragraph-preview-card card-never mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.mouseenter} */
        onMouseenter: (...[$event]) => {
            return __VLS_ctx.cardEnter(cIndex);
            // @ts-ignore
            [paragraph_list, cardEnter,];
        },
    };
    const __VLS_15 = {
        /** @type {typeof __VLS_13.mouseleave} */
        onMouseleave: (...[$event]) => {
            return __VLS_ctx.cardLeave();
            // @ts-ignore
            [cardLeave,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['paragraph-preview-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_16 } = __VLS_11.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mk-sticky" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.show === cIndex) }, null, null);
    /** @type {__VLS_StyleScopedClasses['mk-sticky']} */ ;
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
        ...{ class: "paragraph-box-operation mt-8 mr-8" },
        shadow: "always",
        ...{ style: {} },
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        ...{ class: "paragraph-box-operation mt-8 mr-8" },
        shadow: "always",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        /** @type {typeof __VLS_22.click} */
        onClick: () => { },
    };
    /** @type {__VLS_StyleScopedClasses['paragraph-box-operation']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    const { default: __VLS_24 } = __VLS_20.slots;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        /** @type {typeof __VLS_30.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.editHandle(child, cIndex);
            // @ts-ignore
            [show, editHandle,];
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
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_40 = __VLS_39({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    const __VLS_44 = {
        /** @type {typeof __VLS_43.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteHandle(child, cIndex);
            // @ts-ignore
            [deleteHandle,];
        },
    };
    const { default: __VLS_45 } = __VLS_41.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        iconName: "app-delete",
    }));
    const __VLS_48 = __VLS_47({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [];
    var __VLS_41;
    var __VLS_42;
    // @ts-ignore
    [];
    var __VLS_20;
    var __VLS_21;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (child.title || '-');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "lighter mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
    MdPreview;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ref: "editorRef",
        editorId: "preview-only",
        modelValue: (child.content),
        ...{ class: "maxkb-md" },
        ...{ style: {} },
    }));
    const __VLS_53 = __VLS_52({
        ref: "editorRef",
        editorId: "preview-only",
        modelValue: (child.content),
        ...{ class: "maxkb-md" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    var __VLS_56;
    /** @type {__VLS_StyleScopedClasses['maxkb-md']} */ ;
    var __VLS_54;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "lighter mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        type: "info",
    }));
    const __VLS_60 = __VLS_59({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const { default: __VLS_63 } = __VLS_61.slots;
    (child.content.length);
    (__VLS_ctx.$t('views.paragraph.character_count'));
    // @ts-ignore
    [$t,];
    var __VLS_61;
    // @ts-ignore
    [];
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
const __VLS_64 = EditParagraphDialog;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    ...{ 'onUpdateContent': {} },
    ref: "EditParagraphDialogRef",
    isConnect: (__VLS_ctx.isConnect),
    knowledgeId: (__VLS_ctx.knowledgeId),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onUpdateContent': {} },
    ref: "EditParagraphDialogRef",
    isConnect: (__VLS_ctx.isConnect),
    knowledgeId: (__VLS_ctx.knowledgeId),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_69;
const __VLS_70 = {
    /** @type {typeof __VLS_69.updateContent} */
    onUpdateContent: (__VLS_ctx.updateContent),
};
var __VLS_71;
var __VLS_67;
var __VLS_68;
// @ts-ignore
var __VLS_57 = __VLS_56, __VLS_72 = __VLS_71;
// @ts-ignore
[isConnect, knowledgeId, updateContent,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        modelValue: {
            type: (Array),
            default: () => [],
        },
        isConnect: Boolean,
        knowledgeId: String,
    },
});
export default {};
