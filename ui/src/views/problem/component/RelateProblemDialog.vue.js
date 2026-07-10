/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
const route = useRoute();
const { params: { id }, // knowledgeId
 } = route;
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const emit = defineEmits(['refresh']);
const dialogVisible = ref(false);
const loading = ref(false);
const documentList = ref([]);
const cloneDocumentList = ref([]);
const paragraphList = ref([]);
const currentProblemId = ref('');
const currentMulProblemId = ref([]);
// Echo
const associationParagraph = ref([]);
const currentDocument = ref('');
const search = ref('');
const searchType = ref('title');
const filterDoc = ref('');
// Batch
const isMul = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 50,
    total: 0,
});
function mulAssociation() {
    const data = {
        problem_id_list: currentMulProblemId.value,
        paragraph_list: associationParagraph.value.map((item) => ({
            paragraph_id: item.id,
            document_id: item.document_id,
        })),
    };
    loadSharedApi({ type: 'problem', systemType: apiType.value })
        .putMulAssociationProblem(id, data, loading)
        .then(() => {
        MsgSuccess(t('views.problem.tip.relatedSuccess'));
        dialogVisible.value = false;
    });
}
function associationClick(item) {
    if (isMul.value) {
        if (isAssociation(item.id)) {
            associationParagraph.value.splice(associationParagraph.value.indexOf(item.id), 1);
        }
        else {
            associationParagraph.value.push(item);
        }
    }
    else {
        const obj = {
            paragraph_id: item.id,
            problem_id: currentProblemId.value,
        };
        if (isAssociation(item.id)) {
            loadSharedApi({ type: 'paragraph', systemType: apiType.value })
                .putDisassociationProblem(id, item.document_id, obj, loading)
                .then(() => {
                getRecord(currentProblemId.value);
            });
        }
        else {
            loadSharedApi({ type: 'paragraph', systemType: apiType.value })
                .putAssociationProblem(id, item.document_id, obj, loading)
                .then(() => {
                getRecord(currentProblemId.value);
            });
        }
    }
}
function searchHandle() {
    paginationConfig.current_page = 1;
    paragraphList.value = [];
    if (currentDocument.value) {
        getParagraphList(currentDocument.value);
    }
}
function clickDocumentHandle(item) {
    paginationConfig.current_page = 1;
    paragraphList.value = [];
    currentDocument.value = item.id;
    getParagraphList(item.id);
}
function getDocument() {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .getDocumentList(id, loading)
        .then((res) => {
        cloneDocumentList.value = res.data;
        documentList.value = res.data;
        currentDocument.value =
            cloneDocumentList.value?.length > 0 ? cloneDocumentList.value[0].id : '';
        if (currentDocument.value) {
            getParagraphList(currentDocument.value);
        }
    });
}
function getParagraphList(documentId) {
    loadSharedApi({ type: 'paragraph', systemType: apiType.value })
        .getParagraphPage(id, (documentId || currentDocument.value), paginationConfig, search.value && { [searchType.value]: search.value }, loading)
        .then((res) => {
        paragraphList.value = [...paragraphList.value, ...res.data.records];
        paginationConfig.total = res.data.total;
    });
}
// Associated segment
function getRecord(problemId) {
    loadSharedApi({ type: 'problem', systemType: apiType.value })
        .getDetailProblems(id, problemId, loading)
        .then((res) => {
        associationParagraph.value = res.data;
    });
}
function associationCount(documentId) {
    return associationParagraph.value.filter((item) => item.document_id === documentId).length;
}
function isAssociation(paragraphId) {
    return associationParagraph.value.some((option) => option.id === paragraphId);
}
watch(dialogVisible, (bool) => {
    if (!bool) {
        documentList.value = [];
        cloneDocumentList.value = [];
        paragraphList.value = [];
        associationParagraph.value = [];
        isMul.value = false;
        currentDocument.value = '';
        search.value = '';
        searchType.value = 'title';
        emit('refresh');
    }
});
watch(filterDoc, (val) => {
    paragraphList.value = [];
    documentList.value = val
        ? cloneDocumentList.value.filter((item) => item.name.includes(val))
        : cloneDocumentList.value;
    currentDocument.value = documentList.value?.length > 0 ? documentList.value[0].id : '';
});
const open = (problemId) => {
    getDocument();
    if (problemId.length == 1) {
        currentProblemId.value = problemId[0];
        getRecord(problemId);
    }
    else if (problemId.length > 1) {
        currentMulProblemId.value = problemId;
        isMul.value = true;
    }
    dialogVisible.value = true;
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
    title: (__VLS_ctx.$t('views.problem.relateParagraph.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "80%",
    ...{ class: "paragraph-dialog" },
    destroyOnClose: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.problem.relateParagraph.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "80%",
    ...{ class: "paragraph-dialog" },
    destroyOnClose: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
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
    span: (6),
}));
const __VLS_15 = __VLS_14({
    span: (6),
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
    ...{ class: "bold title align-center p-24 pb-0" },
});
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
(__VLS_ctx.$t('views.problem.relateParagraph.selectDocument'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.filterDoc),
    placeholder: (__VLS_ctx.$t('views.problem.relateParagraph.placeholder')),
    prefixIcon: "Search",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.filterDoc),
    placeholder: (__VLS_ctx.$t('views.problem.relateParagraph.placeholder')),
    prefixIcon: "Search",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.documentList),
    ...{ class: "mt-8" },
    defaultActive: (__VLS_ctx.currentDocument),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.documentList),
    ...{ class: "mt-8" },
    defaultActive: (__VLS_ctx.currentDocument),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.click} */
    onClick: (__VLS_ctx.clickDocumentHandle),
};
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
const { default: __VLS_37 } = __VLS_33.slots;
{
    const { default: __VLS_38 } = __VLS_33.slots;
    const [{ row }] = __VLS_vSlot(__VLS_38);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "flex lighter align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
    autoTooltip;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        content: (row.name),
    }));
    const __VLS_41 = __VLS_40({
        content: (row.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    const { default: __VLS_44 } = __VLS_42.slots;
    (row.name);
    // @ts-ignore
    [$t, $t, $t, dialogVisible, vLoading, loading, filterDoc, documentList, currentDocument, clickDocumentHandle,];
    var __VLS_42;
    if (__VLS_ctx.associationCount(row.id)) {
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge']} */
        elBadge;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            value: (__VLS_ctx.associationCount(row.id)),
            type: "primary",
            ...{ class: "paragraph-badge ml-4" },
        }));
        const __VLS_47 = __VLS_46({
            value: (__VLS_ctx.associationCount(row.id)),
            type: "primary",
            ...{ class: "paragraph-badge ml-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        /** @type {__VLS_StyleScopedClasses['paragraph-badge']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    }
    // @ts-ignore
    [associationCount, associationCount,];
}
// @ts-ignore
[];
var __VLS_33;
var __VLS_34;
// @ts-ignore
[];
var __VLS_22;
// @ts-ignore
[];
var __VLS_16;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    span: (18),
    ...{ class: "border-l" },
}));
const __VLS_52 = __VLS_51({
    span: (18),
    ...{ class: "border-l" },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
/** @type {__VLS_StyleScopedClasses['border-l']} */ ;
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    height: "500",
    wrapClass: "paragraph-scrollbar",
}));
const __VLS_58 = __VLS_57({
    height: "500",
    wrapClass: "paragraph-scrollbar",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bold title align-center" },
});
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
(__VLS_ctx.$t('components.selectParagraph.title'));
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({}));
const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
(__VLS_ctx.$t('views.problem.relateParagraph.selectedParagraph'));
(__VLS_ctx.associationCount(__VLS_ctx.currentDocument));
(__VLS_ctx.$t('views.problem.relateParagraph.count'));
// @ts-ignore
[$t, $t, $t, currentDocument, associationCount,];
var __VLS_65;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ class: "input-with-select" },
    ...{ style: {} },
}));
const __VLS_70 = __VLS_69({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ class: "input-with-select" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_73;
const __VLS_74 = {
    /** @type {typeof __VLS_73.change} */
    onChange: (__VLS_ctx.searchHandle),
};
/** @type {__VLS_StyleScopedClasses['input-with-select']} */ ;
const { default: __VLS_75 } = __VLS_71.slots;
{
    const { prepend: __VLS_76 } = __VLS_71.slots;
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        modelValue: (__VLS_ctx.searchType),
        placeholder: "Select",
        ...{ style: {} },
    }));
    const __VLS_79 = __VLS_78({
        modelValue: (__VLS_ctx.searchType),
        placeholder: "Select",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    const { default: __VLS_82 } = __VLS_80.slots;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        label: (__VLS_ctx.$t('common.title')),
        value: "title",
    }));
    const __VLS_85 = __VLS_84({
        label: (__VLS_ctx.$t('common.title')),
        value: "title",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        label: (__VLS_ctx.$t('common.content')),
        value: "content",
    }));
    const __VLS_90 = __VLS_89({
        label: (__VLS_ctx.$t('common.content')),
        value: "content",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    // @ts-ignore
    [$t, $t, $t, search, searchHandle, searchType,];
    var __VLS_80;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_71;
var __VLS_72;
if (__VLS_ctx.paragraphList.length == 0) {
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_95 = __VLS_94({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
}
else {
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
    InfiniteScroll;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.paragraphList.length),
        total: (__VLS_ctx.paginationConfig.total),
        page_size: (__VLS_ctx.paginationConfig.page_size),
        current_page: (__VLS_ctx.paginationConfig.current_page),
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_100 = __VLS_99({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.paragraphList.length),
        total: (__VLS_ctx.paginationConfig.total),
        page_size: (__VLS_ctx.paginationConfig.page_size),
        current_page: (__VLS_ctx.paginationConfig.current_page),
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_103;
    const __VLS_104 = {
        /** @type {typeof __VLS_103.load} */
        onLoad: (__VLS_ctx.getParagraphList),
    };
    const { default: __VLS_105 } = __VLS_101.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.paragraphList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_106;
        /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
        CardBox;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
            ...{ 'onClick': {} },
            shadow: "hover",
            title: (item.title || '-'),
            description: (item.content),
            ...{ class: "paragraph-card cursor mb-16" },
            ...{ class: (__VLS_ctx.isAssociation(item.id) ? 'selected' : '') },
            showIcon: (false),
        }));
        const __VLS_108 = __VLS_107({
            ...{ 'onClick': {} },
            shadow: "hover",
            title: (item.title || '-'),
            description: (item.content),
            ...{ class: "paragraph-card cursor mb-16" },
            ...{ class: (__VLS_ctx.isAssociation(item.id) ? 'selected' : '') },
            showIcon: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_107));
        let __VLS_111;
        const __VLS_112 = {
            /** @type {typeof __VLS_111.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.paragraphList.length == 0))
                    throw 0;
                return __VLS_ctx.associationClick(item);
                // @ts-ignore
                [$t, loading, paragraphList, paragraphList, paragraphList, paginationConfig, paginationConfig, paginationConfig, getParagraphList, isAssociation, associationClick,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['paragraph-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        var __VLS_109;
        var __VLS_110;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_101;
    var __VLS_102;
}
// @ts-ignore
[];
var __VLS_59;
// @ts-ignore
[];
var __VLS_53;
// @ts-ignore
[];
var __VLS_10;
if (__VLS_ctx.isMul) {
    {
        const { footer: __VLS_113 } = __VLS_3.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "dialog-footer" },
        });
        /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
        let __VLS_114;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
            ...{ 'onClick': {} },
        }));
        const __VLS_116 = __VLS_115({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        let __VLS_119;
        const __VLS_120 = {
            /** @type {typeof __VLS_119.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isMul))
                    throw 0;
                return __VLS_ctx.dialogVisible = false;
                // @ts-ignore
                [dialogVisible, isMul,];
            },
        };
        const { default: __VLS_121 } = __VLS_117.slots;
        (__VLS_ctx.$t('common.cancel'));
        // @ts-ignore
        [$t,];
        var __VLS_117;
        var __VLS_118;
        let __VLS_122;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_124 = __VLS_123({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_123));
        let __VLS_127;
        const __VLS_128 = {
            /** @type {typeof __VLS_127.click} */
            onClick: (__VLS_ctx.mulAssociation),
        };
        const { default: __VLS_129 } = __VLS_125.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, mulAssociation,];
        var __VLS_125;
        var __VLS_126;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
