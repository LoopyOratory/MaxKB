/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
const props = defineProps();
const route = useRoute();
const { params: { id, documentId }, // idisknowledgeId
 } = route;
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][props.apiType];
});
const inputRef = ref();
const loading = ref(false);
const isAddProblem = ref(false);
const problemValue = ref('');
const problemList = ref([]);
const problemOptions = ref([]);
const optionLoading = ref(false);
watch(() => props.paragraphId, (value) => {
    if (value) {
        getProblemList();
    }
}, {
    immediate: true,
});
function delProblemHandle(item, index) {
    if (item.id) {
        const obj = {
            paragraph_id: props.paragraphId || '',
            problem_id: item.id,
        };
        loadSharedApi({ type: 'paragraph', systemType: props.apiType })
            .putDisassociationProblem(props.knowledgeId || id, documentId || props.docId, obj, loading)
            .then((res) => {
            getProblemList();
        });
    }
    else {
        problemList.value.splice(index, 1);
    }
}
function getProblemList() {
    loading.value = true;
    loadSharedApi({ type: 'paragraph', systemType: props.apiType })
        .getParagraphProblem(props.knowledgeId || id, documentId || props.docId, props.paragraphId || '')
        .then((res) => {
        problemList.value = res.data;
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
function addProblem() {
    isAddProblem.value = true;
    nextTick(() => {
        inputRef.value?.focus();
    });
}
function addProblemHandle(val) {
    if (props.paragraphId) {
        const obj = {
            paragraph_id: props.paragraphId,
            problem_id: val,
        };
        const api = problemOptions.value.some((option) => option.id === val)
            ? loadSharedApi({ type: 'paragraph', systemType: props.apiType }).putAssociationProblem(props.knowledgeId || id, documentId || props.docId, obj, loading)
            : loadSharedApi({ type: 'paragraph', systemType: props.apiType }).postParagraphProblem(props.knowledgeId || id, documentId || props.docId, props.paragraphId, {
                content: val,
            }, loading);
        api.then(() => {
            getProblemList();
            problemValue.value = '';
            isAddProblem.value = false;
        });
    }
    else {
        const problem = problemOptions.value.find((option) => option.id === val);
        const content = problem ? problem.content : val;
        if (!problemList.value.some((item) => item.content === content)) {
            problemList.value.push({ content: content });
        }
        problemValue.value = '';
        isAddProblem.value = false;
    }
}
const remoteMethod = (query) => {
    getProblemOption(query);
};
function getProblemOption(filterText) {
    return loadSharedApi({ type: 'problem', systemType: props.apiType })
        .getProblemsPage(props.knowledgeId || id, { current_page: 1, page_size: 100 }, filterText && { content: filterText }, optionLoading)
        .then((res) => {
        problemOptions.value = res.data.records;
    });
}
onMounted(() => {
    getProblemOption();
});
onUnmounted(() => {
    problemList.value = [];
    problemValue.value = '';
    isAddProblem.value = false;
});
const __VLS_exposed = {
    problemList,
};
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    direction: "vertical",
    ...{ class: "mr-4" },
}));
const __VLS_2 = __VLS_1({
    direction: "vertical",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
if (__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id)) {
    let __VLS_5;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_7 = __VLS_6({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_10;
    const __VLS_11 = {
        /** @type {typeof __VLS_10.click} */
        onClick: (__VLS_ctx.addProblem),
    };
    const { default: __VLS_12 } = __VLS_8.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        iconName: "app-add-outlined",
    }));
    const __VLS_15 = __VLS_14({
        iconName: "app-add-outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    // @ts-ignore
    [$t, permissionPrecise, id, addProblem,];
    var __VLS_8;
    var __VLS_9;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    height: "500px",
}));
const __VLS_20 = __VLS_19({
    height: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
if (__VLS_ctx.isAddProblem) {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        ...{ 'onChange': {} },
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.problemValue),
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        reserveKeyword: (false),
        placeholder: (__VLS_ctx.$t('views.paragraph.relatedProblem.placeholder')),
        remote: true,
        remoteMethod: (__VLS_ctx.remoteMethod),
        loading: (__VLS_ctx.optionLoading),
        ...{ class: "mb-16" },
        popperClass: "select-popper",
        popperAppendToBody: (false),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onChange': {} },
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.problemValue),
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        reserveKeyword: (false),
        placeholder: (__VLS_ctx.$t('views.paragraph.relatedProblem.placeholder')),
        remote: true,
        remoteMethod: (__VLS_ctx.remoteMethod),
        loading: (__VLS_ctx.optionLoading),
        ...{ class: "mb-16" },
        popperClass: "select-popper",
        popperAppendToBody: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_29;
    const __VLS_30 = {
        /** @type {typeof __VLS_29.change} */
        onChange: (__VLS_ctx.addProblemHandle),
    };
    const __VLS_31 = {
        /** @type {typeof __VLS_29.blur} */
        onBlur: (...[$event]) => {
            if (!(__VLS_ctx.isAddProblem))
                throw 0;
            return __VLS_ctx.isAddProblem = false;
            // @ts-ignore
            [$t, vLoading, loading, isAddProblem, isAddProblem, problemValue, remoteMethod, optionLoading, addProblemHandle,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_32 } = __VLS_27.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.problemOptions))) {
        let __VLS_33;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
            key: (item.id),
            label: (item.content),
            value: (item.id),
        }));
        const __VLS_35 = __VLS_34({
            key: (item.id),
            label: (item.content),
            value: (item.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        const { default: __VLS_38 } = __VLS_36.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ellipsis" },
            title: (item.content),
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (item.content);
        // @ts-ignore
        [problemOptions,];
        var __VLS_36;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_27;
    var __VLS_28;
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.problemList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.TagEllipsis | typeof __VLS_components.TagEllipsis} */
    TagEllipsis;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ 'onClose': {} },
        ...{ class: "question-tag" },
        type: "info",
        effect: "plain",
        ...(__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id) ? { closable: true } : {}),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClose': {} },
        ...{ class: "question-tag" },
        type: "info",
        effect: "plain",
        ...(__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id) ? { closable: true } : {}),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    const __VLS_45 = {
        /** @type {typeof __VLS_44.close} */
        onClose: (...[$event]) => {
            return __VLS_ctx.delProblemHandle(item, index);
            // @ts-ignore
            [permissionPrecise, id, problemList, delProblemHandle,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['question-tag']} */ ;
    const { default: __VLS_46 } = __VLS_42.slots;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
    autoTooltip;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        content: (item.content),
    }));
    const __VLS_49 = __VLS_48({
        content: (item.content),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const { default: __VLS_52 } = __VLS_50.slots;
    (item.content);
    // @ts-ignore
    [];
    var __VLS_50;
    // @ts-ignore
    [];
    var __VLS_42;
    var __VLS_43;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_21;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeProps: {},
});
export default {};
