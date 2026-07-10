/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ParagraphDialog from './component/ParagraphDialog.vue';
import ParagraphCard from './component/ParagraphCard.vue';
import SelectDocumentDialog from './component/SelectDocumentDialog.vue';
import GenerateRelatedDialog from '@/components/generate-related-dialog/index.vue';
import { VueDraggable } from 'vue-draggable-plus';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
import { t } from '@/locales';
import { cloneDeep } from 'lodash';
const route = useRoute();
const { params: { id, documentId }, query: { from, isShared }, } = route;
const apiType = computed(() => {
    return from;
});
const shareDisabled = computed(() => {
    return isShared === 'true';
});
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][apiType.value];
});
const SelectDocumentDialogRef = ref();
const ParagraphDialogRef = ref();
const loading = ref(false);
const changeStateloading = ref(false);
const documentDetail = ref({});
const knowledgeDetail = ref({});
const paragraphDetail = ref([]);
const title = ref('');
const search = ref('');
const searchType = ref('title');
const searchTypeChange = () => {
    search.value = '';
};
const dialogVisible = ref(false);
watch(() => ParagraphDialogRef.value?.dialogVisible, (val) => {
    dialogVisible.value = val;
});
function setPosition(val, index) {
    if (val === 'top') {
        return 1;
    }
    else if (val === 'bottom') {
        return paragraphDetail.value[paragraphDetail.value.length - 1]?.position ?? paginationConfig.total;
    }
    else if (val === 'up') {
        return paragraphDetail.value[index - 1]?.position ?? paragraphDetail.value[index].position;
    }
    else if (val === 'down') {
        return paragraphDetail.value[index + 1]?.position ?? paragraphDetail.value[index].position;
    }
}
function setTargetIndex(val, index) {
    if (val === 'top')
        return 0;
    if (val === 'bottom')
        return paragraphDetail.value.length - 1;
    if (val === 'up')
        return index - 1;
    if (val === 'down')
        return index + 1;
    return index;
}
function dialogVisibleChange(val) {
    dialogVisible.value = val;
}
const handleClick = (e, ele) => {
    e.preventDefault();
    document.querySelector(`${ele}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
// BatchActions
const isBatch = ref(false);
const multipleSelection = ref([]);
const checkAll = ref(false);
const isIndeterminate = computed(() => {
    return (multipleSelection.value.length > 0 &&
        multipleSelection.value.length < paragraphDetail.value.length);
});
const handleCheckAllChange = (val) => {
    let bool;
    if (isIndeterminate.value) {
        bool = true;
    }
    else {
        bool = val;
    }
    multipleSelection.value = bool ? paragraphDetail.value.map((v) => v.id) : [];
    checkAll.value = bool;
};
function toggleSelect(id) {
    const index = multipleSelection.value.indexOf(id);
    if (index === -1) {
        multipleSelection.value.push(id);
    }
    else {
        multipleSelection.value.splice(index, 1);
    }
}
const paginationConfig = reactive({
    current_page: 1,
    page_size: 30,
    total: 0,
});
function deleteParagraph(id) {
    const index = paragraphDetail.value.findIndex((v) => v.id === id);
    paragraphDetail.value.splice(index, 1);
}
function changeState(id) {
    const index = paragraphDetail.value.findIndex((v) => v.id === id);
    paragraphDetail.value[index].is_active = !paragraphDetail.value[index].is_active;
}
function refreshMigrateParagraph(data) {
    if (data) {
        multipleSelection.value = [data.id];
    }
    paragraphDetail.value = paragraphDetail.value.filter((v) => !multipleSelection.value.includes(v.id));
    multipleSelection.value = [];
    MsgSuccess(t('views.document.tip.migrationSuccess'));
}
function openSelectDocumentDialog(row) {
    if (row) {
        multipleSelection.value = [row.id];
    }
    SelectDocumentDialogRef.value.open(multipleSelection.value);
}
function deleteMulParagraph() {
    MsgConfirm(`${t('views.document.delete.confirmTitle1')} ${multipleSelection.value.length} ${t('views.document.delete.confirmTitle2')}`, t('views.paragraph.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'paragraph', systemType: apiType.value })
            .putMulParagraph(id, documentId, multipleSelection.value, changeStateloading)
            .then(() => {
            paragraphDetail.value = paragraphDetail.value.filter((v) => !multipleSelection.value.includes(v.id));
            multipleSelection.value = [];
            MsgSuccess(t('views.document.delete.successMessage'));
        });
    })
        .catch(() => { });
}
function batchSelectedHandle(bool) {
    isBatch.value = bool;
    checkAll.value = false;
    multipleSelection.value = [];
}
function searchHandle() {
    paginationConfig.current_page = 1;
    paragraphDetail.value = [];
    getParagraphList();
}
function addParagraph() {
    title.value = t('views.paragraph.addParagraph');
    ParagraphDialogRef.value.open();
}
function getDetail() {
    loadSharedApi({ type: 'document', isShared: shareDisabled.value, systemType: apiType.value })
        .getDocumentDetail(id, documentId, loading)
        .then((res) => {
        documentDetail.value = res.data;
    });
    loadSharedApi({ type: 'knowledge', isShared: shareDisabled.value, systemType: apiType.value })
        .getKnowledgeDetail(id, loading)
        .then((res) => {
        knowledgeDetail.value = res.data;
    });
}
function getParagraphList() {
    loadSharedApi({ type: 'paragraph', isShared: shareDisabled.value, systemType: apiType.value })
        .getParagraphPage(id, documentId, paginationConfig, search.value && { [searchType.value]: search.value }, loading)
        .then((res) => {
        paragraphDetail.value = [...paragraphDetail.value, ...res.data.records];
        paginationConfig.total = res.data.total;
    });
}
function refresh(data) {
    if (data) {
        const index = paragraphDetail.value.findIndex((v) => v.id === data.id);
        paragraphDetail.value.splice(index, 1, data);
    }
    else {
        paginationConfig.current_page = 1;
        paragraphDetail.value = [];
        getParagraphList();
    }
}
const GenerateRelatedDialogRef = ref();
function openGenerateDialog(row) {
    const arr = [];
    if (row) {
        arr.push(row.id);
    }
    else {
        multipleSelection.value.map((v) => {
            if (v) {
                arr.push(v);
            }
        });
    }
    GenerateRelatedDialogRef.value.open(arr, 'paragraph');
}
function onEnd(event, params, index) {
    console.log('onEnd', event, params, index);
    if (event && event.newIndex === event.oldIndex) {
        // NoneMove
        return;
    }
    const p = cloneDeep(params);
    const obj = p ?? {
        paragraph_id: paragraphDetail.value[event.newIndex].id, // CurrentDraggedParagraphID
        // When dragging downTake firstOneElementposition, when dragging upward, take the latterOneElementposition
        new_position: event.newIndex > event.oldIndex
            ? paragraphDetail.value[event.newIndex - 1]?.position ?? paragraphDetail.value.length
            : paragraphDetail.value[event.newIndex + 1]?.position ?? paragraphDetail.value.length,
    };
    // console.log(paragraphDetail.value[event.newIndex], obj)
    loadSharedApi({ type: 'paragraph', systemType: apiType.value }).putAdjustPosition(id, documentId, obj, loading);
    if (params) {
        const movedItem = paragraphDetail.value.splice(index, 1)[0];
        paragraphDetail.value.splice(params.target_index, 0, movedItem);
    }
}
onMounted(() => {
    getDetail();
    getParagraphList();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['handle-img']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "paragraph p-12-24" },
});
/** @type {__VLS_StyleScopedClasses['paragraph']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button'] | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button']} */
backButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "-1",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    to: "-1",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ style: {} },
});
(__VLS_ctx.documentDetail?.name);
if (__VLS_ctx.documentDetail?.type === '1') {
    let __VLS_5;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        type: "info",
    }));
    const __VLS_7 = __VLS_6({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_10 } = __VLS_8.slots;
    (__VLS_ctx.$t('views.document.form.source_url.label'));
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        href: (__VLS_ctx.documentDetail?.meta?.source_url),
        target: "_blank",
    }));
    const __VLS_13 = __VLS_12({
        href: (__VLS_ctx.documentDetail?.meta?.source_url),
        target: "_blank",
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    const { default: __VLS_16 } = __VLS_14.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "break-all" },
    });
    /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
    (__VLS_ctx.documentDetail?.meta?.source_url);
    // @ts-ignore
    [documentDetail, documentDetail, documentDetail, documentDetail, $t,];
    var __VLS_14;
    // @ts-ignore
    [];
    var __VLS_8;
}
if (!__VLS_ctx.shareDisabled && __VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "header-button" },
    });
    /** @type {__VLS_StyleScopedClasses['header-button']} */ ;
    if (__VLS_ctx.isBatch === false) {
        let __VLS_17;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
            ...{ 'onClick': {} },
        }));
        const __VLS_19 = __VLS_18({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        let __VLS_22;
        const __VLS_23 = {
            /** @type {typeof __VLS_22.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.shareDisabled && __VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                    throw 0;
                if (!(__VLS_ctx.isBatch === false))
                    throw 0;
                return __VLS_ctx.batchSelectedHandle(true);
                // @ts-ignore
                [shareDisabled, permissionPrecise, id, isBatch, batchSelectedHandle,];
            },
        };
        const { default: __VLS_24 } = __VLS_20.slots;
        (__VLS_ctx.$t('views.paragraph.setting.batchSelected'));
        // @ts-ignore
        [$t,];
        var __VLS_20;
        var __VLS_21;
    }
    if (__VLS_ctx.isBatch === true) {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            ...{ 'onClick': {} },
        }));
        const __VLS_27 = __VLS_26({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        let __VLS_30;
        const __VLS_31 = {
            /** @type {typeof __VLS_30.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.shareDisabled && __VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                    throw 0;
                if (!(__VLS_ctx.isBatch === true))
                    throw 0;
                return __VLS_ctx.batchSelectedHandle(false);
                // @ts-ignore
                [isBatch, batchSelectedHandle,];
            },
        };
        const { default: __VLS_32 } = __VLS_28.slots;
        (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
        // @ts-ignore
        [$t,];
        var __VLS_28;
        var __VLS_29;
    }
    if (__VLS_ctx.isBatch === false) {
        let __VLS_33;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.loading),
        }));
        const __VLS_35 = __VLS_34({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        let __VLS_38;
        const __VLS_39 = {
            /** @type {typeof __VLS_38.click} */
            onClick: (__VLS_ctx.addParagraph),
        };
        const { default: __VLS_40 } = __VLS_36.slots;
        (__VLS_ctx.$t('views.paragraph.addParagraph'));
        // @ts-ignore
        [$t, isBatch, loading, addParagraph,];
        var __VLS_36;
        var __VLS_37;
    }
}
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ style: {} },
    ...{ class: "paragraph__main mt-16" },
}));
const __VLS_43 = __VLS_42({
    ...{ style: {} },
    ...{ class: "paragraph__main mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: ((__VLS_ctx.paginationConfig.current_page === 1 && __VLS_ctx.loading) || __VLS_ctx.changeStateloading) }, null, null);
/** @type {__VLS_StyleScopedClasses['paragraph__main']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_46 } = __VLS_44.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between p-12-16 border-b" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.paginationConfig.total);
(__VLS_ctx.$t('views.paragraph.paragraph_count'));
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ class: "input-with-select" },
    ...{ style: {} },
    clearable: true,
}));
const __VLS_49 = __VLS_48({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.search),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ class: "input-with-select" },
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = {
    /** @type {typeof __VLS_52.change} */
    onChange: (__VLS_ctx.searchHandle),
};
/** @type {__VLS_StyleScopedClasses['input-with-select']} */ ;
const { default: __VLS_54 } = __VLS_50.slots;
{
    const { prepend: __VLS_55 } = __VLS_50.slots;
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchType),
        placeholder: "Select",
        ...{ style: {} },
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchType),
        placeholder: "Select",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_61;
    const __VLS_62 = {
        /** @type {typeof __VLS_61.change} */
        onChange: (__VLS_ctx.searchTypeChange),
    };
    const { default: __VLS_63 } = __VLS_59.slots;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        label: (__VLS_ctx.$t('common.title')),
        value: "title",
    }));
    const __VLS_66 = __VLS_65({
        label: (__VLS_ctx.$t('common.title')),
        value: "title",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        label: (__VLS_ctx.$t('common.content')),
        value: "content",
    }));
    const __VLS_71 = __VLS_70({
        label: (__VLS_ctx.$t('common.content')),
        value: "content",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    // @ts-ignore
    [$t, $t, $t, $t, loading, vLoading, paginationConfig, paginationConfig, changeStateloading, search, searchHandle, searchType, searchTypeChange,];
    var __VLS_59;
    var __VLS_60;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_50;
var __VLS_51;
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.LayoutContainer | typeof __VLS_components.LayoutContainer} */
LayoutContainer;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    showCollapse: true,
}));
const __VLS_76 = __VLS_75({
    showCollapse: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const { default: __VLS_79 } = __VLS_77.slots;
{
    const { left: __VLS_80 } = __VLS_77.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "paragraph-sidebar p-16" },
    });
    /** @type {__VLS_StyleScopedClasses['paragraph-sidebar']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-16']} */ ;
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
        ...{ class: "paragraph-scrollbar" },
    }));
    const __VLS_83 = __VLS_82({
        ...{ class: "paragraph-scrollbar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    /** @type {__VLS_StyleScopedClasses['paragraph-scrollbar']} */ ;
    const { default: __VLS_86 } = __VLS_84.slots;
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.elAnchor | typeof __VLS_components.ElAnchor | typeof __VLS_components['el-anchor'] | typeof __VLS_components.elAnchor | typeof __VLS_components.ElAnchor | typeof __VLS_components['el-anchor']} */
    elAnchor;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        ...{ 'onClick': {} },
        direction: "vertical",
        type: "default",
        offset: (130),
        container: ".paragraph-scrollbar",
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
        direction: "vertical",
        type: "default",
        offset: (130),
        container: ".paragraph-scrollbar",
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_92;
    const __VLS_93 = {
        /** @type {typeof __VLS_92.click} */
        onClick: (__VLS_ctx.handleClick),
    };
    const { default: __VLS_94 } = __VLS_90.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.paragraphDetail))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (item.id),
        });
        if (item.title) {
            let __VLS_95;
            /** @ts-ignore @type { | typeof __VLS_components.elAnchorLink | typeof __VLS_components.ElAnchorLink | typeof __VLS_components['el-anchor-link'] | typeof __VLS_components.elAnchorLink | typeof __VLS_components.ElAnchorLink | typeof __VLS_components['el-anchor-link']} */
            elAnchorLink;
            // @ts-ignore
            const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
                href: (`#m${item.id}`),
                title: (item.title),
            }));
            const __VLS_97 = __VLS_96({
                href: (`#m${item.id}`),
                title: (item.title),
            }, ...__VLS_functionalComponentArgsRest(__VLS_96));
            const { default: __VLS_100 } = __VLS_98.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                title: (item.title),
            });
            (item.title);
            // @ts-ignore
            [handleClick, paragraphDetail,];
            var __VLS_98;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_90;
    var __VLS_91;
    // @ts-ignore
    [];
    var __VLS_84;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
if (__VLS_ctx.paragraphDetail.length == 0) {
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_103 = __VLS_102({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        ...{ class: "paragraph-scrollbar" },
    }));
    const __VLS_108 = __VLS_107({
        ...{ class: "paragraph-scrollbar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    /** @type {__VLS_StyleScopedClasses['paragraph-scrollbar']} */ ;
    const { default: __VLS_111 } = __VLS_109.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "paragraph-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['paragraph-detail']} */ ;
    let __VLS_112;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
    elCheckboxGroup;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        modelValue: (__VLS_ctx.multipleSelection),
    }));
    const __VLS_114 = __VLS_113({
        modelValue: (__VLS_ctx.multipleSelection),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const { default: __VLS_117 } = __VLS_115.slots;
    let __VLS_118;
    /** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
    InfiniteScroll;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.paragraphDetail.length),
        total: (__VLS_ctx.paginationConfig.total),
        page_size: (__VLS_ctx.paginationConfig.page_size),
        current_page: (__VLS_ctx.paginationConfig.current_page),
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_120 = __VLS_119({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.paragraphDetail.length),
        total: (__VLS_ctx.paginationConfig.total),
        page_size: (__VLS_ctx.paginationConfig.page_size),
        current_page: (__VLS_ctx.paginationConfig.current_page),
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    let __VLS_123;
    const __VLS_124 = {
        /** @type {typeof __VLS_123.load} */
        onLoad: (__VLS_ctx.getParagraphList),
    };
    const { default: __VLS_125 } = __VLS_121.slots;
    let __VLS_126;
    /** @ts-ignore @type { | typeof __VLS_components.VueDraggable | typeof __VLS_components.VueDraggable} */
    VueDraggable;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
        ...{ 'onEnd': {} },
        ref: "el",
        modelValue: (__VLS_ctx.paragraphDetail),
        disabled: (__VLS_ctx.isBatch === true ||
            __VLS_ctx.shareDisabled ||
            __VLS_ctx.dialogVisible ||
            !__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)),
        handle: ".handle",
        animation: (150),
        ghostClass: "ghost",
    }));
    const __VLS_128 = __VLS_127({
        ...{ 'onEnd': {} },
        ref: "el",
        modelValue: (__VLS_ctx.paragraphDetail),
        disabled: (__VLS_ctx.isBatch === true ||
            __VLS_ctx.shareDisabled ||
            __VLS_ctx.dialogVisible ||
            !__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)),
        handle: ".handle",
        animation: (150),
        ghostClass: "ghost",
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    let __VLS_131;
    const __VLS_132 = {
        /** @type {typeof __VLS_131.end} */
        onEnd: (__VLS_ctx.onEnd),
    };
    var __VLS_133;
    const { default: __VLS_135 } = __VLS_129.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.paragraphDetail))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (item.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            id: (`m${item.id}`),
            ...{ class: "flex mb-16" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        if (__VLS_ctx.isBatch === true) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "paragraph-card flex w-full" },
            });
            /** @type {__VLS_StyleScopedClasses['paragraph-card']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            let __VLS_136;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
            elCheckbox;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
                value: (item.id),
            }));
            const __VLS_138 = __VLS_137({
                value: (item.id),
            }, ...__VLS_functionalComponentArgsRest(__VLS_137));
            const __VLS_141 = ParagraphCard;
            // @ts-ignore
            const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
                ...{ 'onClickCard': {} },
                data: (item),
                ...{ class: "mb-8 w-full" },
                ...{ class: ({
                        'is-selected': __VLS_ctx.multipleSelection.includes(item.id),
                    }) },
                disabled: (true),
            }));
            const __VLS_143 = __VLS_142({
                ...{ 'onClickCard': {} },
                data: (item),
                ...{ class: "mb-8 w-full" },
                ...{ class: ({
                        'is-selected': __VLS_ctx.multipleSelection.includes(item.id),
                    }) },
                disabled: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_142));
            let __VLS_146;
            const __VLS_147 = {
                /** @type {typeof __VLS_146.clickCard} */
                onClickCard: (...[$event]) => {
                    if (!!(__VLS_ctx.paragraphDetail.length == 0))
                        throw 0;
                    if (!(__VLS_ctx.isBatch === true))
                        throw 0;
                    return __VLS_ctx.toggleSelect(item.id);
                    // @ts-ignore
                    [$t, shareDisabled, permissionPrecise, id, isBatch, isBatch, loading, paginationConfig, paginationConfig, paginationConfig, paragraphDetail, paragraphDetail, paragraphDetail, paragraphDetail, multipleSelection, multipleSelection, getParagraphList, dialogVisible, onEnd, toggleSelect,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['is-selected']} */ ;
            var __VLS_144;
            var __VLS_145;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "handle paragraph-card flex w-full" },
                id: (item.id),
            });
            /** @type {__VLS_StyleScopedClasses['handle']} */ ;
            /** @type {__VLS_StyleScopedClasses['paragraph-card']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/sort.svg",
                alt: "",
                height: "15",
                ...{ class: "handle-img mr-8 mt-24 cursor" },
            });
            /** @type {__VLS_StyleScopedClasses['handle-img']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            const __VLS_148 = ParagraphCard;
            // @ts-ignore
            const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
                ...{ 'onChangeState': {} },
                ...{ 'onDeleteParagraph': {} },
                ...{ 'onMove': {} },
                ...{ 'onRefresh': {} },
                ...{ 'onRefreshMigrateParagraph': {} },
                ...{ 'onDialogVisibleChange': {} },
                data: (item),
                showMoveUp: (index !== 0),
                showMoveDown: (index < __VLS_ctx.paragraphDetail.length - 1),
                ...{ class: "mb-8 w-full" },
                disabled: (__VLS_ctx.shareDisabled),
            }));
            const __VLS_150 = __VLS_149({
                ...{ 'onChangeState': {} },
                ...{ 'onDeleteParagraph': {} },
                ...{ 'onMove': {} },
                ...{ 'onRefresh': {} },
                ...{ 'onRefreshMigrateParagraph': {} },
                ...{ 'onDialogVisibleChange': {} },
                data: (item),
                showMoveUp: (index !== 0),
                showMoveDown: (index < __VLS_ctx.paragraphDetail.length - 1),
                ...{ class: "mb-8 w-full" },
                disabled: (__VLS_ctx.shareDisabled),
            }, ...__VLS_functionalComponentArgsRest(__VLS_149));
            let __VLS_153;
            const __VLS_154 = {
                /** @type {typeof __VLS_153.changeState} */
                onChangeState: (__VLS_ctx.changeState),
            };
            const __VLS_155 = {
                /** @type {typeof __VLS_153.deleteParagraph} */
                onDeleteParagraph: (__VLS_ctx.deleteParagraph),
            };
            const __VLS_156 = {
                /** @type {typeof __VLS_153.move} */
                onMove: ((val) => __VLS_ctx.onEnd(null, {
                    paragraph_id: item.id,
                    new_position: __VLS_ctx.setPosition(val, index),
                    target_index: __VLS_ctx.setTargetIndex(val, index),
                }, index)),
            };
            const __VLS_157 = {
                /** @type {typeof __VLS_153.refresh} */
                onRefresh: (__VLS_ctx.refresh),
            };
            const __VLS_158 = {
                /** @type {typeof __VLS_153.refreshMigrateParagraph} */
                onRefreshMigrateParagraph: (__VLS_ctx.refreshMigrateParagraph),
            };
            const __VLS_159 = {
                /** @type {typeof __VLS_153.dialogVisibleChange} */
                onDialogVisibleChange: (__VLS_ctx.dialogVisibleChange),
            };
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            var __VLS_151;
            var __VLS_152;
        }
        // @ts-ignore
        [shareDisabled, paragraphDetail, onEnd, changeState, deleteParagraph, setPosition, setTargetIndex, refresh, refreshMigrateParagraph, dialogVisibleChange,];
    }
    // @ts-ignore
    [];
    var __VLS_129;
    var __VLS_130;
    // @ts-ignore
    [];
    var __VLS_121;
    var __VLS_122;
    // @ts-ignore
    [];
    var __VLS_115;
    // @ts-ignore
    [];
    var __VLS_109;
}
if (__VLS_ctx.isBatch === true) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mul-operation border-t w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['mul-operation']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_160;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_165;
    const __VLS_166 = {
        /** @type {typeof __VLS_165.change} */
        onChange: (__VLS_ctx.handleCheckAllChange),
    };
    const { default: __VLS_167 } = __VLS_163.slots;
    (__VLS_ctx.$t('common.allCheck'));
    // @ts-ignore
    [$t, isBatch, checkAll, isIndeterminate, handleCheckAllChange,];
    var __VLS_163;
    var __VLS_164;
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        ...{ class: "ml-16" },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        ...{ class: "ml-16" },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_173;
    const __VLS_174 = {
        /** @type {typeof __VLS_173.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isBatch === true))
                throw 0;
            return __VLS_ctx.openGenerateDialog();
            // @ts-ignore
            [multipleSelection, openGenerateDialog,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    const { default: __VLS_175 } = __VLS_171.slots;
    (__VLS_ctx.$t('views.document.generateQuestion.title'));
    // @ts-ignore
    [$t,];
    var __VLS_171;
    var __VLS_172;
    let __VLS_176;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_181;
    const __VLS_182 = {
        /** @type {typeof __VLS_181.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isBatch === true))
                throw 0;
            return __VLS_ctx.openSelectDocumentDialog();
            // @ts-ignore
            [multipleSelection, openSelectDocumentDialog,];
        },
    };
    const { default: __VLS_183 } = __VLS_179.slots;
    (__VLS_ctx.$t('views.document.setting.migration'));
    // @ts-ignore
    [$t,];
    var __VLS_179;
    var __VLS_180;
    let __VLS_184;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_189;
    const __VLS_190 = {
        /** @type {typeof __VLS_189.click} */
        onClick: (__VLS_ctx.deleteMulParagraph),
    };
    const { default: __VLS_191 } = __VLS_187.slots;
    (__VLS_ctx.$t('common.delete'));
    // @ts-ignore
    [$t, multipleSelection, deleteMulParagraph,];
    var __VLS_187;
    var __VLS_188;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-secondary ml-24 mr-16" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    (__VLS_ctx.$t('common.selected'));
    (__VLS_ctx.multipleSelection.length);
    (__VLS_ctx.paginationConfig.total);
    (__VLS_ctx.$t('views.document.items'));
    let __VLS_192;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_194 = __VLS_193({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    let __VLS_197;
    const __VLS_198 = {
        /** @type {typeof __VLS_197.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isBatch === true))
                throw 0;
            return __VLS_ctx.batchSelectedHandle(false);
            // @ts-ignore
            [$t, $t, batchSelectedHandle, paginationConfig, multipleSelection,];
        },
    };
    const { default: __VLS_199 } = __VLS_195.slots;
    (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
    // @ts-ignore
    [$t,];
    var __VLS_195;
    var __VLS_196;
}
// @ts-ignore
[];
var __VLS_77;
// @ts-ignore
[];
var __VLS_44;
const __VLS_200 = ParagraphDialog;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.title),
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_202 = __VLS_201({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.title),
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_205;
const __VLS_206 = {
    /** @type {typeof __VLS_205.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_207;
var __VLS_203;
var __VLS_204;
const __VLS_209 = SelectDocumentDialog;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    ...{ 'onRefresh': {} },
    ref: "SelectDocumentDialogRef",
    apiType: (__VLS_ctx.apiType),
    workspaceId: (__VLS_ctx.knowledgeDetail.workspace_id),
}));
const __VLS_211 = __VLS_210({
    ...{ 'onRefresh': {} },
    ref: "SelectDocumentDialogRef",
    apiType: (__VLS_ctx.apiType),
    workspaceId: (__VLS_ctx.knowledgeDetail.workspace_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
let __VLS_214;
const __VLS_215 = {
    /** @type {typeof __VLS_214.refresh} */
    onRefresh: (__VLS_ctx.refreshMigrateParagraph),
};
var __VLS_216;
var __VLS_212;
var __VLS_213;
const __VLS_218 = GenerateRelatedDialog;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
    ...{ 'onRefresh': {} },
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_220 = __VLS_219({
    ...{ 'onRefresh': {} },
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_219));
let __VLS_223;
const __VLS_224 = {
    /** @type {typeof __VLS_223.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_225;
var __VLS_221;
var __VLS_222;
// @ts-ignore
var __VLS_134 = __VLS_133, __VLS_208 = __VLS_207, __VLS_217 = __VLS_216, __VLS_226 = __VLS_225;
// @ts-ignore
[refresh, refresh, refreshMigrateParagraph, title, apiType, apiType, apiType, knowledgeDetail,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
