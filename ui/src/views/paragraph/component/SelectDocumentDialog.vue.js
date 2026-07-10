/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import SelectKnowledgeDocument from '@/components/select-knowledge-document/index.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const props = defineProps();
const route = useRoute();
const { params: { id, documentId }, // id is knowledgeID
query: { from, isShared }, } = route;
const shareDisabled = computed(() => {
    return isShared === 'true';
});
const emit = defineEmits(['refresh']);
const SelectKnowledgeDocumentRef = ref();
const knowledgeDetail = ref({});
const dialogVisible = ref(false);
const loading = ref(false);
const paragraphList = ref([]);
watch(dialogVisible, (bool) => {
    if (!bool) {
        paragraphList.value = [];
        SelectKnowledgeDocumentRef.value?.clearValidate();
    }
});
const open = (list) => {
    getDetail();
    paragraphList.value = list;
    dialogVisible.value = true;
};
const submitForm = async () => {
    if (await SelectKnowledgeDocumentRef.value?.validate()) {
        const obj = {
            id_list: paragraphList.value,
        };
        loadSharedApi({ type: 'paragraph', systemType: props.apiType })
            .putMigrateMulParagraph(id, documentId, SelectKnowledgeDocumentRef.value.form.knowledge_id, SelectKnowledgeDocumentRef.value.form.document_id, obj, loading)
            .then(() => {
            emit('refresh');
            dialogVisible.value = false;
        });
    }
};
function getDetail() {
    loadSharedApi({ type: 'knowledge', systemType: props.apiType, isShared: shareDisabled.value })
        .getKnowledgeDetail(id, loading)
        .then((res) => {
        knowledgeDetail.value = res.data;
    });
}
function changeKnowledge(dataset_id) {
    localStorage.setItem(id + 'chat_dataset_id', dataset_id);
}
function changeDocument(document_id) {
    localStorage.setItem(id + 'chat_document_id', document_id);
}
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
    ...{ 'onClick': {} },
    title: (`${__VLS_ctx.$t('views.chatLog.selectKnowledge')}/${__VLS_ctx.$t('common.fileUpload.document')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "500",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    title: (`${__VLS_ctx.$t('views.chatLog.selectKnowledge')}/${__VLS_ctx.$t('common.fileUpload.document')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "500",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: () => { },
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
const __VLS_9 = SelectKnowledgeDocument;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    ...{ 'onChangeKnowledge': {} },
    ...{ 'onChangeDocument': {} },
    ref: "SelectKnowledgeDocumentRef",
    apiType: (__VLS_ctx.apiType),
    isApplication: (true),
    workspaceId: (__VLS_ctx.knowledgeDetail.workspace_id),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onChangeKnowledge': {} },
    ...{ 'onChangeDocument': {} },
    ref: "SelectKnowledgeDocumentRef",
    apiType: (__VLS_ctx.apiType),
    isApplication: (true),
    workspaceId: (__VLS_ctx.knowledgeDetail.workspace_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_14;
const __VLS_15 = {
    /** @type {typeof __VLS_14.changeKnowledge} */
    onChangeKnowledge: (__VLS_ctx.changeKnowledge),
};
const __VLS_16 = {
    /** @type {typeof __VLS_14.changeDocument} */
    onChangeDocument: (__VLS_ctx.changeDocument),
};
var __VLS_17;
var __VLS_12;
var __VLS_13;
{
    const { footer: __VLS_19 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_25;
    const __VLS_26 = {
        /** @type {typeof __VLS_25.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [$t, $t, dialogVisible, dialogVisible, apiType, knowledgeDetail, changeKnowledge, changeDocument,];
        },
    };
    const { default: __VLS_27 } = __VLS_23.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_23;
    var __VLS_24;
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_33;
    const __VLS_34 = {
        /** @type {typeof __VLS_33.click} */
        onClick: (__VLS_ctx.submitForm),
    };
    const { default: __VLS_35 } = __VLS_31.slots;
    (__VLS_ctx.$t('views.document.setting.migration'));
    // @ts-ignore
    [$t, loading, submitForm,];
    var __VLS_31;
    var __VLS_32;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_18 = __VLS_17;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
