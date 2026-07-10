/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import ImportDocumentDialog from './component/ImportDocumentDialog.vue';
import SelectKnowledgeDialog from './component/SelectKnowledgeDialog.vue';
import { numberFormat } from '@/utils/common';
import { datetimeFormat } from '@/utils/time';
import { hitHandlingMethod } from '@/enums/document';
import { MsgSuccess, MsgConfirm, MsgError, MsgAlert } from '@/utils/message';
import useStore from '@/stores';
import StatusValue from '@/views/document/component/Status.vue';
import GenerateRelatedDialog from '@/components/generate-related-dialog/index.vue';
import EmbeddingContentDialog from '@/views/document/component/EmbeddingContentDialog.vue';
import { TaskType, State } from '@/utils/status';
import { t } from '@/locales';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import TagDrawer from './tag/TagDrawer.vue';
import TagSettingDrawer from './tag/TagSettingDrawer.vue';
import AddTagDialog from '@/views/document/tag/MulAddTagDialog.vue';
import ExecutionRecord from '@/views/knowledge-workflow/component/execution-record/ExecutionRecordDrawer.vue';
import UserApi from '@/api/user/user.ts';
const route = useRoute();
const router = useRouter();
const { params: { id, folderId, type }, // id is knowledgeID
 } = route;
const { common, user } = useStore();
const storeKey = 'documents';
onBeforeRouteUpdate(() => {
    common.savePage(storeKey, null);
    common.saveCondition(storeKey, null);
});
onBeforeRouteLeave((to) => {
    if (to.name !== 'ParagraphIndex') {
        common.savePage(storeKey, null);
        common.saveCondition(storeKey, null);
    }
    else {
        common.saveCondition(storeKey, {
            search_type: search_type.value,
            search_form: search_form.value,
            filterMethod: filterMethod.value,
        });
    }
});
const isShared = computed(() => {
    return folderId === 'share';
});
const isSystemShare = computed(() => {
    return apiType.value === 'systemShare';
});
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('share/')) {
        return 'workspaceShare';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][apiType.value];
});
const MoreFilledPermission0 = (id) => {
    return (permissionPrecise.value.doc_migrate(id) ||
        (knowledgeDetail?.value.type === 1 && permissionPrecise.value.doc_sync(id)) ||
        (knowledgeDetail?.value.type === 2 && permissionPrecise.value.doc_sync(id)) ||
        permissionPrecise.value.doc_delete(id) ||
        permissionPrecise.value.doc_tag(id));
};
const MoreFilledPermission1 = (id) => {
    return (permissionPrecise.value.doc_generate(id) ||
        permissionPrecise.value.doc_migrate(id) ||
        permissionPrecise.value.doc_export(id) ||
        permissionPrecise.value.doc_download(id) ||
        permissionPrecise.value.doc_delete(id) ||
        permissionPrecise.value.doc_tag(id) ||
        permissionPrecise.value.doc_replace(id));
};
const MoreFilledPermission2 = (id) => {
    return (permissionPrecise.value.sync(id) ||
        permissionPrecise.value.doc_generate(id) ||
        permissionPrecise.value.doc_migrate(id) ||
        permissionPrecise.value.doc_export(id) ||
        permissionPrecise.value.doc_delete(id));
};
const getTaskState = (status, taskType) => {
    const statusList = status.split('').reverse();
    return taskType - 1 > statusList.length + 1 ? 'n' : statusList[taskType - 1];
};
const search_type = ref('name');
const search_form = ref({
    name: '',
    tag: '',
});
const beforePagination = computed(() => common.paginationConfig[storeKey]);
const beforeSearch = computed(() => common.search[storeKey]);
const embeddingContentDialogRef = ref();
const ListActionRef = ref();
const loading = ref(false);
let interval;
const filterMethod = ref({});
const orderBy = ref('');
const documentData = ref([]);
const currentMouseId = ref(null);
const knowledgeDetail = ref({});
const paginationConfig = ref({
    current_page: 1,
    page_size: 10,
    total: 0,
});
const ImportDocumentDialogRef = ref();
const multipleTableRef = ref();
const multipleSelection = ref([]);
const title = ref('');
const selectKnowledgeDialogRef = ref();
const openListAction = () => {
    ListActionRef.value?.open(id);
};
const toImportWorkflow = () => {
    if (knowledgeDetail.value.is_publish) {
        router.push({
            path: `/knowledge/import/workflow/${folderId}`,
            query: {
                id: id,
            },
        });
    }
    else {
        MsgConfirm(t('common.tip'), t('views.document.tip.toImportDocConfirm'), {
            cancelButtonText: t('common.close'),
            showConfirmButton: false,
            type: 'warning',
        })
            .then(() => { })
            .catch(() => { });
    }
};
const exportDocument = (document) => {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .exportDocument(document.name, document.knowledge_id, document.id, loading)
        .then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
};
const exportDocumentZip = (document) => {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .exportDocumentZip(document.name, document.knowledge_id, document.id, loading)
        .then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
};
function cancelTaskHandle(val) {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    const obj = {
        id_list: arr,
        type: val,
    };
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putBatchCancelTask(id, obj, loading)
        .then(() => {
        MsgSuccess(t('views.document.tip.cancelSuccess'));
        multipleTableRef.value?.clearSelection();
    });
}
function clearSelection() {
    multipleTableRef.value?.clearSelection();
}
function openknowledgeDialog(row) {
    const arr = [];
    if (row) {
        arr.push(row.id);
    }
    else {
        multipleSelection.value.map((v) => {
            if (v) {
                arr.push(v.id);
            }
        });
    }
    selectKnowledgeDialogRef.value.open(arr);
}
function dropdownHandle(obj) {
    filterMethod.value[obj.attr] = obj.command;
    if (obj.attr == 'status') {
        filterMethod.value['task_type'] = obj.task_type;
    }
    getList();
}
function beforeCommand(attr, val, task_type) {
    return {
        attr: attr,
        command: val,
        task_type,
    };
}
const cancelTask = (row, task_type) => {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putCancelTask(id, row.id, { type: task_type })
        .then(() => {
        MsgSuccess(t('views.document.tip.sendMessage'));
    });
};
function importDoc() {
    title.value = t('views.document.importDocument');
    ImportDocumentDialogRef.value.open();
}
function settingDoc(row) {
    title.value = t('common.setting');
    ImportDocumentDialogRef.value.open(row);
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
};
function openBatchEditDocument() {
    title.value = t('common.setting');
    const arr = multipleSelection.value.map((v) => v.id);
    ImportDocumentDialogRef.value.open(null, arr);
}
/**
 * InitializePoll
 */
const initInterval = () => {
    interval = setInterval(() => {
        getList(true);
    }, 6000);
};
/**
 * ClosePoll
 */
const closeInterval = () => {
    if (interval) {
        clearInterval(interval);
    }
};
function syncDocument(row) {
    if (+row.type === 1) {
        syncWebDocument(row);
    }
    else {
        syncLarkDocument(row);
    }
}
function syncLarkDocument(row) {
    MsgConfirm(t('views.document.sync.confirmTitle'), t('views.document.sync.confirmMessage1'), {
        confirmButtonText: t('views.document.sync.label'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'document', systemType: apiType.value })
            .putLarkDocumentSync(id, row.id)
            .then(() => {
            getList();
        });
    })
        .catch(() => { });
}
function syncWebDocument(row) {
    if (row.meta?.source_url) {
        MsgConfirm(t('views.document.sync.confirmTitle'), t('views.document.sync.confirmMessage1'), {
            confirmButtonText: t('views.document.sync.label'),
            confirmButtonClass: 'danger',
        })
            .then(() => {
            loadSharedApi({ type: 'document', systemType: apiType.value })
                .putDocumentSync(row.knowledge_id, row.id)
                .then(() => {
                getList();
            });
        })
            .catch(() => { });
    }
    else {
        MsgConfirm(t('common.tip'), t('views.document.sync.confirmMessage2'), {
            confirmButtonText: t('common.confirm'),
            type: 'warning',
        })
            .then(() => { })
            .catch(() => { });
    }
}
function refreshDocument(row) {
    const embeddingDocument = (stateList) => {
        return loadSharedApi({ type: 'document', systemType: apiType.value })
            .putDocumentRefresh(row.knowledge_id, row.id, stateList)
            .then(() => {
            getList();
        });
    };
    embeddingContentDialogRef.value?.open(embeddingDocument);
}
function tokenizeDocument(row) {
    const stateList = ['0', '1', '2', '3', '4', '5', 'n'];
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putDocumentTokenize(row.knowledge_id, row.id, stateList)
        .then(() => {
        getList();
    });
}
function rowClickHandle(row, column) {
    console.log(column);
    if (column && (column.type === 'selection' || column.property === 'tag')) {
        return;
    }
    router.push({
        path: `/paragraph/${id}/${row.id}`,
        query: { from: apiType.value, isShared: isShared.value ? 'true' : 'false' },
    });
}
/*
  QuickCreationBlankDocument
*/
function creatQuickHandle(val) {
    loading.value = true;
    const obj = [{ name: val }];
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putMulDocument(id, obj)
        .then(() => {
        getList();
        MsgSuccess(t('common.createSuccess'));
    })
        .catch(() => {
        loading.value = false;
    });
}
function syncMulDocument() {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    MsgConfirm(t('views.document.sync.confirmTitle'), t('views.document.sync.confirmMessage1'), {
        confirmButtonText: t('views.document.sync.label'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'document', systemType: apiType.value })
            .putMulSyncDocument(id, arr, loading)
            .then(() => {
            MsgSuccess(t('views.document.sync.successMessage'));
            getList();
        });
    })
        .catch(() => { });
}
function syncLarkMulDocument() {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putMulLarkSyncDocument(id, arr, loading)
        .then(() => {
        MsgSuccess(t('views.document.sync.successMessage'));
        getList();
    });
}
function exportMulDocument() {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .exportMulDocument(knowledgeDetail.value.name, id, arr, loading)
        .then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
}
function exportMulDocumentZip() {
    const arr = [];
    multipleSelection.value.map((v) => {
        if (v) {
            arr.push(v.id);
        }
    });
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .exportMulDocumentZip(knowledgeDetail.value.name, id, arr, loading)
        .then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
}
function deleteMulDocument() {
    MsgConfirm(`${t('views.document.delete.confirmTitle1')} ${multipleSelection.value.length} ${t('views.document.delete.confirmTitle2')}`, t('views.document.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        const arr = [];
        multipleSelection.value.map((v) => {
            if (v) {
                arr.push(v.id);
            }
        });
        loadSharedApi({ type: 'document', systemType: apiType.value })
            .delMulDocument(id, arr, loading)
            .then(() => {
            MsgSuccess(t('views.document.delete.successMessage'));
            multipleTableRef.value?.clearSelection();
            getList();
        });
    })
        .catch(() => { });
}
function batchRefresh() {
    const arr = multipleSelection.value.map((v) => v.id);
    const embeddingBatchDocument = (stateList) => {
        loadSharedApi({ type: 'document', systemType: apiType.value })
            .putBatchRefresh(id, arr, stateList, loading)
            .then(() => {
            MsgSuccess(t('views.document.tip.vectorizationSuccess'));
            multipleTableRef.value?.clearSelection();
        });
    };
    embeddingContentDialogRef.value?.open(embeddingBatchDocument);
}
function batchTokenize() {
    const arr = multipleSelection.value.map((v) => v.id);
    const stateList = ['0', '1', '2', '3', '4', '5', 'n'];
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putBatchTokenize(id, arr, stateList, loading)
        .then(() => {
        multipleTableRef.value?.clearSelection();
    });
}
function downloadDocument(row) {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .getDownloadSourceFile(id, row.id, row.name)
        .then(() => {
        getList();
    });
}
const elUploadRef = ref();
function replaceDocument(file, row) {
    const formData = new FormData();
    formData.append('file', file.raw, file.name);
    elUploadRef.value.clearFiles();
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .postReplaceSourceFile(id, row.id, formData, loading)
        .then(() => {
        MsgSuccess(t('views.document.tip.replaceSuccess'));
        getList();
    })
        .catch((e) => { });
}
function deleteDocument(row) {
    MsgConfirm(`${t('views.document.delete.confirmTitle3')} ${row.name} ?`, `${t('views.document.delete.confirmMessage1')} ${row.paragraph_count} ${t('views.document.delete.confirmMessage2')}`, {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'document', systemType: apiType.value })
            .delDocument(id, row.id, loading)
            .then(() => {
            MsgSuccess(t('common.deleteSuccess'));
            getList();
        });
    })
        .catch(() => { });
}
/*
  UpdateNameorState
*/
function updateData(documentId, data, msg) {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putDocument(id, documentId, data, loading)
        .then((res) => {
        const index = documentData.value.findIndex((v) => v.id === documentId);
        documentData.value.splice(index, 1, res.data);
        MsgSuccess(msg);
        return true;
    })
        .catch(() => {
        return false;
    });
}
async function changeState(row) {
    const obj = {
        is_active: !row.is_active,
    };
    const str = !row.is_active ? t('common.status.enableSuccess') : t('common.status.disableSuccess');
    await updateData(row.id, obj, str);
}
function editName(val, id) {
    if (val) {
        const obj = {
            name: val,
        };
        updateData(id, obj, t('common.modifySuccess'));
    }
    else {
        MsgError(t('views.document.tip.nameMessage'));
    }
}
function cellMouseEnter(row, column) {
    if (column && column.property === 'name') {
        currentMouseId.value = row.id;
    }
}
function cellMouseLeave() {
    currentMouseId.value = null;
}
function handleSizeChange() {
    paginationConfig.value.current_page = 1;
    getList();
}
function handleSortChange({ prop, order }) {
    orderBy.value = order === 'ascending' ? prop : `-${prop}`;
    getList();
}
function getList(bool) {
    const param = {
        ...filterMethod.value,
        order_by: orderBy.value,
        folder_id: folderId,
    };
    if (search_form.value[search_type.value]) {
        param[search_type.value] = search_form.value[search_type.value];
    }
    loadSharedApi({ type: 'document', isShared: isShared.value, systemType: apiType.value })
        .getDocumentPage(id, paginationConfig.value, param, bool ? undefined : loading)
        .then((res) => {
        documentData.value = res.data.records;
        paginationConfig.value.total = res.data.total;
    });
}
const search_type_change = () => {
    search_form.value = { name: '', tag: '' };
};
function getDetail() {
    loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
        .getKnowledgeDetail(id, loading)
        .then((res) => {
        knowledgeDetail.value = res.data;
    });
}
function refreshMigrate() {
    multipleTableRef.value?.clearSelection();
    getList();
}
function refresh() {
    paginationConfig.value.current_page = 1;
    getList();
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
                arr.push(v.id);
            }
        });
    }
    GenerateRelatedDialogRef.value.open(arr, 'document');
}
function cellClickHandle(row, column, cell, event) {
    if (column.property === 'tag' && permissionPrecise.value.doc_tag(id)) {
        event.stopPropagation();
        openTagSettingDrawer(row);
    }
}
const tagFilterValue = ref([]);
const tagFilterDirty = ref(false);
const tagFilterOptions = ref([]);
const tagFilterLoaded = ref(false);
const tagFilterLoading = ref(false);
function buildTagCascaderOptions(tags) {
    const options = tags.map((group) => ({
        label: group.key,
        value: group.key,
        children: (group.values || []).map((item) => ({
            label: item.value,
            value: item.id, // LeafNode tag.id
        })),
    }));
    options.push({
        label: t('views.document.tag.noTag'),
        value: 'NO_TAG',
        children: [],
    });
    return options;
}
async function ensureTagFilterOptions(needRefresh = false) {
    // Non-refresh && already loaded && not dirty data
    if (!needRefresh && tagFilterLoaded.value && !tagFilterDirty.value)
        return;
    try {
        tagFilterLoading.value = true;
        const params = {};
        const res = await loadSharedApi({
            type: 'knowledge',
            systemType: apiType.value,
            isShared: isShared.value,
        }).getTags(id, params, tagFilterLoading);
        tagFilterOptions.value = buildTagCascaderOptions(res?.data || []);
        tagFilterLoaded.value = true;
        tagFilterDirty.value = false;
    }
    finally {
        tagFilterLoading.value = false;
    }
}
async function handleTagVisibleChange(visible) {
    if (!visible)
        return;
    await ensureTagFilterOptions();
}
function onTagChanged() {
    tagFilterDirty.value = true;
}
const tagDrawerRef = ref();
function openTagDrawer() {
    tagDrawerRef.value.open();
}
const tagSettingDrawerRef = ref();
function openTagSettingDrawer(doc) {
    tagSettingDrawerRef.value.open(doc);
}
const addTagDialogRef = ref();
function openAddTagDialog(rowId) {
    addTagDialogRef.value?.open(rowId);
}
function addTags(tags, rowId) {
    const arr = multipleSelection.value.length
        ? multipleSelection.value.map((v) => v.id)
        : [rowId];
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .postMulDocumentTags(id, { tag_ids: tags, document_ids: arr }, loading)
        .then(() => {
        addTagDialogRef.value?.close();
        getList();
        clearSelection();
    });
}
const user_options = ref([]);
function searchHandle() {
    paginationConfig.value.current_page = 1;
    getList();
}
function getUserList(query) {
    let workspaceId = user.getWorkspaceId();
    if (isSystemShare.value) {
        workspaceId = '';
    }
    const actualWorkspaceId = workspaceId || (query ? { nick_name: query } : '');
    const actualQuery = workspaceId ? (query ? { nick_name: query } : '') : undefined;
    if (apiType.value === 'systemManage') {
        UserApi.getAllMemberList(query ? { nick_name: query } : '')
            .then((res) => {
            user_options.value = res.data || [];
        })
            .catch(() => {
            user_options.value = [];
        });
    }
    else {
        loadSharedApi({ type: 'workspace', isShared: isShared.value, systemType: apiType.value })
            .getAllMemberList(actualWorkspaceId, actualQuery, loading)
            .then((res) => {
            user_options.value = res.data;
        });
    }
}
onMounted(() => {
    getDetail();
    if (beforePagination.value) {
        paginationConfig.value = beforePagination.value;
    }
    if (beforeSearch.value) {
        filterMethod.value = beforeSearch.value['filterMethod'];
        search_type.value = beforeSearch.value['search_type'];
        search_form.value = beforeSearch.value['search_form'];
    }
    getList();
    // InitializeScheduledTask
    initInterval();
    if (route.query.imported === 'true') {
        MsgAlert(t('common.tip'), t('common.knowledgeImportTip')).then(() => {
            router.replace({ query: {} });
        });
    }
});
onBeforeUnmount(() => {
    // ClearScheduledTask
    closeInterval();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "document p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['document']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('common.fileUpload.document'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (!__VLS_ctx.isShared) {
    if (__VLS_ctx.knowledgeDetail?.type === 0 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)) {
        let __VLS_6;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_8 = __VLS_7({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        let __VLS_11;
        const __VLS_12 = {
            /** @type {typeof __VLS_11.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isShared))
                    throw 0;
                if (!(__VLS_ctx.knowledgeDetail?.type === 0 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)))
                    throw 0;
                return;
                __VLS_ctx.router.push({
                    path: `/knowledge/document/upload/${__VLS_ctx.folderId}/${__VLS_ctx.type}`,
                    query: { id: __VLS_ctx.id },
                });
                // @ts-ignore
                [$t, isShared, knowledgeDetail, permissionPrecise, id, id, router, folderId, type,];
            },
        };
        const { default: __VLS_13 } = __VLS_9.slots;
        (__VLS_ctx.$t('views.document.uploadDocument'));
        // @ts-ignore
        [$t,];
        var __VLS_9;
        var __VLS_10;
    }
    if (__VLS_ctx.knowledgeDetail?.type === 1 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)) {
        let __VLS_14;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_16 = __VLS_15({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
        let __VLS_19;
        const __VLS_20 = {
            /** @type {typeof __VLS_19.click} */
            onClick: (__VLS_ctx.importDoc),
        };
        const { default: __VLS_21 } = __VLS_17.slots;
        (__VLS_ctx.$t('views.document.importDocument'));
        // @ts-ignore
        [$t, knowledgeDetail, permissionPrecise, id, importDoc,];
        var __VLS_17;
        var __VLS_18;
    }
    if (__VLS_ctx.knowledgeDetail?.type === 2 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)) {
        let __VLS_22;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_24 = __VLS_23({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_23));
        let __VLS_27;
        const __VLS_28 = {
            /** @type {typeof __VLS_27.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isShared))
                    throw 0;
                if (!(__VLS_ctx.knowledgeDetail?.type === 2 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)))
                    throw 0;
                return;
                __VLS_ctx.router.push({
                    path: `/knowledge/import/lark/${__VLS_ctx.folderId}`,
                    query: {
                        id: __VLS_ctx.id,
                        folder_token: __VLS_ctx.knowledgeDetail?.meta.folder_token,
                    },
                });
                // @ts-ignore
                [knowledgeDetail, knowledgeDetail, permissionPrecise, id, id, router, folderId,];
            },
        };
        const { default: __VLS_29 } = __VLS_25.slots;
        (__VLS_ctx.$t('views.document.importDocument'));
        // @ts-ignore
        [$t,];
        var __VLS_25;
        var __VLS_26;
    }
    if (__VLS_ctx.knowledgeDetail?.type === 4 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)) {
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_32 = __VLS_31({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        let __VLS_35;
        const __VLS_36 = {
            /** @type {typeof __VLS_35.click} */
            onClick: (__VLS_ctx.toImportWorkflow),
        };
        const { default: __VLS_37 } = __VLS_33.slots;
        (__VLS_ctx.$t('views.document.importDocument'));
        // @ts-ignore
        [$t, knowledgeDetail, permissionPrecise, id, toImportWorkflow,];
        var __VLS_33;
        var __VLS_34;
    }
    if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_40 = __VLS_39({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        let __VLS_43;
        const __VLS_44 = {
            /** @type {typeof __VLS_43.click} */
            onClick: (__VLS_ctx.batchRefresh),
        };
        const { default: __VLS_45 } = __VLS_41.slots;
        (__VLS_ctx.$t('views.knowledge.setting.vectorization'));
        // @ts-ignore
        [$t, permissionPrecise, id, multipleSelection, batchRefresh,];
        var __VLS_41;
        var __VLS_42;
    }
    if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_48 = __VLS_47({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        let __VLS_51;
        const __VLS_52 = {
            /** @type {typeof __VLS_51.click} */
            onClick: (__VLS_ctx.batchTokenize),
        };
        const { default: __VLS_53 } = __VLS_49.slots;
        (__VLS_ctx.$t('views.knowledge.customSegmentation.wordIndexing'));
        // @ts-ignore
        [$t, permissionPrecise, id, multipleSelection, batchTokenize,];
        var __VLS_49;
        var __VLS_50;
    }
    if (__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)) {
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_56 = __VLS_55({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        let __VLS_59;
        const __VLS_60 = {
            /** @type {typeof __VLS_59.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isShared))
                    throw 0;
                if (!(__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.openGenerateDialog();
                // @ts-ignore
                [permissionPrecise, id, multipleSelection, openGenerateDialog,];
            },
        };
        const { default: __VLS_61 } = __VLS_57.slots;
        (__VLS_ctx.$t('views.document.generateQuestion.title'));
        // @ts-ignore
        [$t,];
        var __VLS_57;
        var __VLS_58;
    }
    if (__VLS_ctx.MoreFilledPermission0(__VLS_ctx.id)) {
        let __VLS_62;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({}));
        const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
        const { default: __VLS_67 } = __VLS_65.slots;
        let __VLS_68;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
            ...{ class: "ml-12 mr-12" },
        }));
        const __VLS_70 = __VLS_69({
            ...{ class: "ml-12 mr-12" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
        const { default: __VLS_73 } = __VLS_71.slots;
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            iconName: "app-more",
        }));
        const __VLS_76 = __VLS_75({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        // @ts-ignore
        [id, MoreFilledPermission0,];
        var __VLS_71;
        {
            const { dropdown: __VLS_79 } = __VLS_65.slots;
            let __VLS_80;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({}));
            const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
            const { default: __VLS_85 } = __VLS_83.slots;
            if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
                let __VLS_86;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_88 = __VLS_87({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_87));
                let __VLS_91;
                const __VLS_92 = {
                    /** @type {typeof __VLS_91.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.isShared))
                            throw 0;
                        if (!(__VLS_ctx.MoreFilledPermission0(__VLS_ctx.id)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                            throw 0;
                        return __VLS_ctx.openBatchEditDocument();
                        // @ts-ignore
                        [permissionPrecise, id, multipleSelection, openBatchEditDocument,];
                    },
                };
                const { default: __VLS_93 } = __VLS_89.slots;
                (__VLS_ctx.$t('common.setting'));
                // @ts-ignore
                [$t,];
                var __VLS_89;
                var __VLS_90;
            }
            if (__VLS_ctx.permissionPrecise.doc_migrate(__VLS_ctx.id)) {
                let __VLS_94;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_96 = __VLS_95({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_95));
                let __VLS_99;
                const __VLS_100 = {
                    /** @type {typeof __VLS_99.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.isShared))
                            throw 0;
                        if (!(__VLS_ctx.MoreFilledPermission0(__VLS_ctx.id)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.doc_migrate(__VLS_ctx.id)))
                            throw 0;
                        return __VLS_ctx.openknowledgeDialog();
                        // @ts-ignore
                        [permissionPrecise, id, multipleSelection, openknowledgeDialog,];
                    },
                };
                const { default: __VLS_101 } = __VLS_97.slots;
                (__VLS_ctx.$t('views.document.setting.migration'));
                // @ts-ignore
                [$t,];
                var __VLS_97;
                var __VLS_98;
            }
            if (__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)) {
                let __VLS_102;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_104 = __VLS_103({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_103));
                let __VLS_107;
                const __VLS_108 = {
                    /** @type {typeof __VLS_107.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.isShared))
                            throw 0;
                        if (!(__VLS_ctx.MoreFilledPermission0(__VLS_ctx.id)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)))
                            throw 0;
                        return __VLS_ctx.openAddTagDialog();
                        // @ts-ignore
                        [permissionPrecise, id, multipleSelection, openAddTagDialog,];
                    },
                };
                const { default: __VLS_109 } = __VLS_105.slots;
                (__VLS_ctx.$t('views.document.tag.addTag'));
                // @ts-ignore
                [$t,];
                var __VLS_105;
                var __VLS_106;
            }
            if (__VLS_ctx.knowledgeDetail?.type === 1 && __VLS_ctx.permissionPrecise.doc_sync(__VLS_ctx.id)) {
                let __VLS_110;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_112 = __VLS_111({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_111));
                let __VLS_115;
                const __VLS_116 = {
                    /** @type {typeof __VLS_115.click} */
                    onClick: (__VLS_ctx.syncMulDocument),
                };
                const { default: __VLS_117 } = __VLS_113.slots;
                (__VLS_ctx.$t('views.document.syncDocument'));
                // @ts-ignore
                [$t, knowledgeDetail, permissionPrecise, id, multipleSelection, syncMulDocument,];
                var __VLS_113;
                var __VLS_114;
            }
            if (__VLS_ctx.knowledgeDetail?.type === 2 && __VLS_ctx.permissionPrecise.doc_sync(__VLS_ctx.id)) {
                let __VLS_118;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_120 = __VLS_119({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_119));
                let __VLS_123;
                const __VLS_124 = {
                    /** @type {typeof __VLS_123.click} */
                    onClick: (__VLS_ctx.syncLarkMulDocument),
                };
                const { default: __VLS_125 } = __VLS_121.slots;
                (__VLS_ctx.$t('views.document.syncDocument'));
                // @ts-ignore
                [$t, knowledgeDetail, permissionPrecise, id, multipleSelection, syncLarkMulDocument,];
                var __VLS_121;
                var __VLS_122;
            }
            if (__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)) {
                let __VLS_126;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_128 = __VLS_127({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_127));
                let __VLS_131;
                const __VLS_132 = {
                    /** @type {typeof __VLS_131.click} */
                    onClick: (__VLS_ctx.exportMulDocument),
                };
                const { default: __VLS_133 } = __VLS_129.slots;
                (__VLS_ctx.$t('common.export'));
                // @ts-ignore
                [$t, permissionPrecise, id, multipleSelection, exportMulDocument,];
                var __VLS_129;
                var __VLS_130;
            }
            if (__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)) {
                let __VLS_134;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_136 = __VLS_135({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_135));
                let __VLS_139;
                const __VLS_140 = {
                    /** @type {typeof __VLS_139.click} */
                    onClick: (__VLS_ctx.exportMulDocumentZip),
                };
                const { default: __VLS_141 } = __VLS_137.slots;
                (__VLS_ctx.$t('common.export'));
                // @ts-ignore
                [$t, permissionPrecise, id, multipleSelection, exportMulDocumentZip,];
                var __VLS_137;
                var __VLS_138;
            }
            if (__VLS_ctx.permissionPrecise.doc_delete(__VLS_ctx.id)) {
                let __VLS_142;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }));
                const __VLS_144 = __VLS_143({
                    ...{ 'onClick': {} },
                    divided: true,
                    disabled: (__VLS_ctx.multipleSelection.length === 0),
                }, ...__VLS_functionalComponentArgsRest(__VLS_143));
                let __VLS_147;
                const __VLS_148 = {
                    /** @type {typeof __VLS_147.click} */
                    onClick: (__VLS_ctx.deleteMulDocument),
                };
                const { default: __VLS_149 } = __VLS_145.slots;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t, permissionPrecise, id, multipleSelection, deleteMulDocument,];
                var __VLS_145;
                var __VLS_146;
            }
            // @ts-ignore
            [];
            var __VLS_83;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_65;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}));
const __VLS_152 = __VLS_151({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
let __VLS_155;
const __VLS_156 = {
    /** @type {typeof __VLS_155.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_157 } = __VLS_153.slots;
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}));
const __VLS_160 = __VLS_159({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}));
const __VLS_165 = __VLS_164({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
// @ts-ignore
[$t, $t, search_type, search_type_change,];
var __VLS_153;
var __VLS_154;
if (__VLS_ctx.search_type === 'name') {
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_173;
    const __VLS_174 = {
        /** @type {typeof __VLS_173.change} */
        onChange: (__VLS_ctx.refresh),
    };
    var __VLS_171;
    var __VLS_172;
}
else if (__VLS_ctx.search_type === 'create_user') {
    let __VLS_175;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }));
    const __VLS_177 = __VLS_176({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    let __VLS_180;
    const __VLS_181 = {
        /** @type {typeof __VLS_180.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    const { default: __VLS_182 } = __VLS_178.slots;
    for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
        let __VLS_183;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }));
        const __VLS_185 = __VLS_184({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_184));
        // @ts-ignore
        [$t, search_type, search_type, search_form, search_form, refresh, getUserList, searchHandle, user_options,];
    }
    // @ts-ignore
    [];
    var __VLS_178;
    var __VLS_179;
}
if (__VLS_ctx.knowledgeDetail?.type === 4 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)) {
    let __VLS_188;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
        effect: "dark",
        content: (__VLS_ctx.$t('common.ExecutionRecord.title')),
        placement: "top",
    }));
    const __VLS_190 = __VLS_189({
        effect: "dark",
        content: (__VLS_ctx.$t('common.ExecutionRecord.title')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    const { default: __VLS_193 } = __VLS_191.slots;
    let __VLS_194;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
        ...{ 'onClick': {} },
        ...{ class: "ml-12" },
    }));
    const __VLS_196 = __VLS_195({
        ...{ 'onClick': {} },
        ...{ class: "ml-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_195));
    let __VLS_199;
    const __VLS_200 = {
        /** @type {typeof __VLS_199.click} */
        onClick: (__VLS_ctx.openListAction),
    };
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    const { default: __VLS_201 } = __VLS_197.slots;
    let __VLS_202;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
        iconName: "app-execution-record",
        ...{ class: "color-secondary" },
    }));
    const __VLS_204 = __VLS_203({
        iconName: "app-execution-record",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_203));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [$t, knowledgeDetail, permissionPrecise, id, openListAction,];
    var __VLS_197;
    var __VLS_198;
    // @ts-ignore
    [];
    var __VLS_191;
}
if (__VLS_ctx.permissionPrecise.tag_read(__VLS_ctx.id)) {
    let __VLS_207;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
        ...{ 'onClick': {} },
        ...{ class: "ml-12" },
    }));
    const __VLS_209 = __VLS_208({
        ...{ 'onClick': {} },
        ...{ class: "ml-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    let __VLS_212;
    const __VLS_213 = {
        /** @type {typeof __VLS_212.click} */
        onClick: (__VLS_ctx.openTagDrawer),
    };
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    const { default: __VLS_214 } = __VLS_210.slots;
    (__VLS_ctx.$t('views.document.tag.label'));
    // @ts-ignore
    [$t, permissionPrecise, id, openTagDrawer,];
    var __VLS_210;
    var __VLS_211;
}
let __VLS_215;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ...{ 'onCreatQuick': {} },
    ...{ 'onRowClick': {} },
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    ...{ 'onCellClick': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16 document-table" },
    data: (__VLS_ctx.documentData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    quickCreate: (__VLS_ctx.knowledgeDetail?.type === 0 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id) && !__VLS_ctx.isShared),
    rowKey: ((row) => row.id),
    storeKey: (__VLS_ctx.storeKey),
    border: true,
}));
const __VLS_217 = __VLS_216({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onCellMouseEnter': {} },
    ...{ 'onCellMouseLeave': {} },
    ...{ 'onCreatQuick': {} },
    ...{ 'onRowClick': {} },
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    ...{ 'onCellClick': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16 document-table" },
    data: (__VLS_ctx.documentData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    quickCreate: (__VLS_ctx.knowledgeDetail?.type === 0 && __VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id) && !__VLS_ctx.isShared),
    rowKey: ((row) => row.id),
    storeKey: (__VLS_ctx.storeKey),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
let __VLS_220;
const __VLS_221 = {
    /** @type {typeof __VLS_220.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_222 = {
    /** @type {typeof __VLS_220.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_223 = {
    /** @type {typeof __VLS_220.cellMouseEnter} */
    onCellMouseEnter: (__VLS_ctx.cellMouseEnter),
};
const __VLS_224 = {
    /** @type {typeof __VLS_220.cellMouseLeave} */
    onCellMouseLeave: (__VLS_ctx.cellMouseLeave),
};
const __VLS_225 = {
    /** @type {typeof __VLS_220.creatQuick} */
    onCreatQuick: (__VLS_ctx.creatQuickHandle),
};
const __VLS_226 = {
    /** @type {typeof __VLS_220.rowClick} */
    onRowClick: (__VLS_ctx.rowClickHandle),
};
const __VLS_227 = {
    /** @type {typeof __VLS_220.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
const __VLS_228 = {
    /** @type {typeof __VLS_220.sortChange} */
    onSortChange: (__VLS_ctx.handleSortChange),
};
const __VLS_229 = {
    /** @type {typeof __VLS_220.cellClick} */
    onCellClick: (__VLS_ctx.cellClickHandle),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_230;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['document-table']} */ ;
const { default: __VLS_232 } = __VLS_218.slots;
if (!__VLS_ctx.isShared) {
    let __VLS_233;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
        type: "selection",
        width: "55",
        reserveSelection: (true),
    }));
    const __VLS_235 = __VLS_234({
        type: "selection",
        width: "55",
        reserveSelection: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
}
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    prop: "name",
    label: (__VLS_ctx.$t('views.document.table.name')),
    minWidth: "280",
}));
const __VLS_240 = __VLS_239({
    prop: "name",
    label: (__VLS_ctx.$t('views.document.table.name')),
    minWidth: "280",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
const { default: __VLS_243 } = __VLS_241.slots;
{
    const { default: __VLS_244 } = __VLS_241.slots;
    const [{ row }] = __VLS_vSlot(__VLS_244);
    if (!__VLS_ctx.isShared) {
        let __VLS_245;
        /** @ts-ignore @type { | typeof __VLS_components.ReadWrite} */
        ReadWrite;
        // @ts-ignore
        const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
            ...{ 'onChange': {} },
            data: (row.name),
            showEditIcon: (row.id === __VLS_ctx.currentMouseId),
        }));
        const __VLS_247 = __VLS_246({
            ...{ 'onChange': {} },
            data: (row.name),
            showEditIcon: (row.id === __VLS_ctx.currentMouseId),
        }, ...__VLS_functionalComponentArgsRest(__VLS_246));
        let __VLS_250;
        const __VLS_251 = {
            /** @type {typeof __VLS_250.change} */
            onChange: (...[$event]) => {
                if (!(!__VLS_ctx.isShared))
                    throw 0;
                return __VLS_ctx.editName($event, row.id);
                // @ts-ignore
                [$t, isShared, isShared, isShared, knowledgeDetail, permissionPrecise, id, documentData, paginationConfig, storeKey, handleSizeChange, getList, cellMouseEnter, cellMouseLeave, creatQuickHandle, rowClickHandle, handleSelectionChange, handleSortChange, cellClickHandle, vLoading, loading, currentMouseId, editName,];
            },
        };
        var __VLS_248;
        var __VLS_249;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.name);
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_241;
let __VLS_252;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent1(__VLS_252, new __VLS_252({
    prop: "status",
    label: (__VLS_ctx.$t('views.document.fileStatus.label')),
    width: "120",
}));
const __VLS_254 = __VLS_253({
    prop: "status",
    label: (__VLS_ctx.$t('views.document.fileStatus.label')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
const { default: __VLS_257 } = __VLS_255.slots;
{
    const { header: __VLS_258 } = __VLS_255.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.document.fileStatus.label'));
    let __VLS_259;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
        ...{ 'onCommand': {} },
        trigger: "click",
    }));
    const __VLS_261 = __VLS_260({
        ...{ 'onCommand': {} },
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    let __VLS_264;
    const __VLS_265 = {
        /** @type {typeof __VLS_264.command} */
        onCommand: (__VLS_ctx.dropdownHandle),
    };
    const { default: __VLS_266 } = __VLS_262.slots;
    let __VLS_267;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['status'] ? 'primary' : ''),
    }));
    const __VLS_269 = __VLS_268({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['status'] ? 'primary' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_268));
    const { default: __VLS_272 } = __VLS_270.slots;
    let __VLS_273;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_274 = __VLS_asFunctionalComponent1(__VLS_273, new __VLS_273({}));
    const __VLS_275 = __VLS_274({}, ...__VLS_functionalComponentArgsRest(__VLS_274));
    const { default: __VLS_278 } = __VLS_276.slots;
    let __VLS_279;
    /** @ts-ignore @type { | typeof __VLS_components.Filter} */
    Filter;
    // @ts-ignore
    const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({}));
    const __VLS_281 = __VLS_280({}, ...__VLS_functionalComponentArgsRest(__VLS_280));
    // @ts-ignore
    [$t, $t, dropdownHandle, filterMethod,];
    var __VLS_276;
    // @ts-ignore
    [];
    var __VLS_270;
    {
        const { dropdown: __VLS_284 } = __VLS_262.slots;
        let __VLS_285;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
            ...{ style: {} },
        }));
        const __VLS_287 = __VLS_286({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_286));
        const { default: __VLS_290 } = __VLS_288.slots;
        let __VLS_291;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
            ...{ class: (__VLS_ctx.filterMethod['status'] ? '' : 'is-active') },
            command: (__VLS_ctx.beforeCommand('status', '')),
            ...{ class: "justify-center" },
        }));
        const __VLS_293 = __VLS_292({
            ...{ class: (__VLS_ctx.filterMethod['status'] ? '' : 'is-active') },
            command: (__VLS_ctx.beforeCommand('status', '')),
            ...{ class: "justify-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_292));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_296 } = __VLS_294.slots;
        (__VLS_ctx.$t('common.status.all'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_294;
        let __VLS_297;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_298 = __VLS_asFunctionalComponent1(__VLS_297, new __VLS_297({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.SUCCESS ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.SUCCESS)),
        }));
        const __VLS_299 = __VLS_298({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.SUCCESS ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.SUCCESS)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_298));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_302 } = __VLS_300.slots;
        (__VLS_ctx.$t('common.status.success'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand, State, State,];
        var __VLS_300;
        let __VLS_303;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.FAILURE ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.FAILURE)),
        }));
        const __VLS_305 = __VLS_304({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.FAILURE ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.FAILURE)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_304));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_308 } = __VLS_306.slots;
        (__VLS_ctx.$t('common.status.fail'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand, State, State,];
        var __VLS_306;
        let __VLS_309;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_310 = __VLS_asFunctionalComponent1(__VLS_309, new __VLS_309({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.STARTED &&
                    __VLS_ctx.filterMethod['task_type'] == __VLS_ctx.TaskType.EMBEDDING
                    ? 'is-active'
                    : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.STARTED, __VLS_ctx.TaskType.EMBEDDING)),
        }));
        const __VLS_311 = __VLS_310({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.STARTED &&
                    __VLS_ctx.filterMethod['task_type'] == __VLS_ctx.TaskType.EMBEDDING
                    ? 'is-active'
                    : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.STARTED, __VLS_ctx.TaskType.EMBEDDING)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_310));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_314 } = __VLS_312.slots;
        (__VLS_ctx.$t('views.document.fileStatus.EMBEDDING'));
        // @ts-ignore
        [$t, filterMethod, filterMethod, beforeCommand, State, State, TaskType, TaskType,];
        var __VLS_312;
        let __VLS_315;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_316 = __VLS_asFunctionalComponent1(__VLS_315, new __VLS_315({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.STARTED &&
                    __VLS_ctx.filterMethod['task_type'] == __VLS_ctx.TaskType.TOKENIZE
                    ? 'is-active'
                    : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.STARTED, __VLS_ctx.TaskType.TOKENIZE)),
        }));
        const __VLS_317 = __VLS_316({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.STARTED &&
                    __VLS_ctx.filterMethod['task_type'] == __VLS_ctx.TaskType.TOKENIZE
                    ? 'is-active'
                    : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.STARTED, __VLS_ctx.TaskType.TOKENIZE)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_316));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_320 } = __VLS_318.slots;
        (__VLS_ctx.$t('views.document.fileStatus.TOKENIZE'));
        // @ts-ignore
        [$t, filterMethod, filterMethod, beforeCommand, State, State, TaskType, TaskType,];
        var __VLS_318;
        let __VLS_321;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.PENDING ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.PENDING)),
        }));
        const __VLS_323 = __VLS_322({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.PENDING ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.PENDING)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_322));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_326 } = __VLS_324.slots;
        (__VLS_ctx.$t('views.document.fileStatus.PENDING'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand, State, State,];
        var __VLS_324;
        let __VLS_327;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.STARTED &&
                    __VLS_ctx.filterMethod['task_type'] === __VLS_ctx.TaskType.GENERATE_PROBLEM
                    ? 'is-active'
                    : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.STARTED, __VLS_ctx.TaskType.GENERATE_PROBLEM)),
        }));
        const __VLS_329 = __VLS_328({
            ...{ class: (__VLS_ctx.filterMethod['status'] === __VLS_ctx.State.STARTED &&
                    __VLS_ctx.filterMethod['task_type'] === __VLS_ctx.TaskType.GENERATE_PROBLEM
                    ? 'is-active'
                    : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('status', __VLS_ctx.State.STARTED, __VLS_ctx.TaskType.GENERATE_PROBLEM)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_328));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_332 } = __VLS_330.slots;
        (__VLS_ctx.$t('views.document.fileStatus.GENERATE'));
        // @ts-ignore
        [$t, filterMethod, filterMethod, beforeCommand, State, State, TaskType, TaskType,];
        var __VLS_330;
        // @ts-ignore
        [];
        var __VLS_288;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_262;
    var __VLS_263;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_333 } = __VLS_255.slots;
    const [{ row }] = __VLS_vSlot(__VLS_333);
    const __VLS_334 = StatusValue || StatusValue;
    // @ts-ignore
    const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
        status: (row.status),
        statusMeta: (row.status_meta),
    }));
    const __VLS_336 = __VLS_335({
        status: (row.status),
        statusMeta: (row.status_meta),
    }, ...__VLS_functionalComponentArgsRest(__VLS_335));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_255;
let __VLS_339;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
    prop: "char_length",
    label: (__VLS_ctx.$t('views.document.table.char_length')),
    align: "right",
    minWidth: "120",
    sortable: true,
}));
const __VLS_341 = __VLS_340({
    prop: "char_length",
    label: (__VLS_ctx.$t('views.document.table.char_length')),
    align: "right",
    minWidth: "120",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_340));
const { default: __VLS_344 } = __VLS_342.slots;
{
    const { default: __VLS_345 } = __VLS_342.slots;
    const [{ row }] = __VLS_vSlot(__VLS_345);
    (__VLS_ctx.numberFormat(row.char_length));
    // @ts-ignore
    [$t, numberFormat,];
}
// @ts-ignore
[];
var __VLS_342;
let __VLS_346;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent1(__VLS_346, new __VLS_346({
    prop: "paragraph_count",
    label: (__VLS_ctx.$t('views.document.table.paragraph')),
    align: "right",
    minWidth: "120",
    sortable: true,
}));
const __VLS_348 = __VLS_347({
    prop: "paragraph_count",
    label: (__VLS_ctx.$t('views.document.table.paragraph')),
    align: "right",
    minWidth: "120",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
let __VLS_351;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_352 = __VLS_asFunctionalComponent1(__VLS_351, new __VLS_351({
    width: "110",
}));
const __VLS_353 = __VLS_352({
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_352));
const { default: __VLS_356 } = __VLS_354.slots;
{
    const { header: __VLS_357 } = __VLS_354.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.document.enableStatus.label'));
    let __VLS_358;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_359 = __VLS_asFunctionalComponent1(__VLS_358, new __VLS_358({
        ...{ 'onCommand': {} },
        trigger: "click",
    }));
    const __VLS_360 = __VLS_359({
        ...{ 'onCommand': {} },
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_359));
    let __VLS_363;
    const __VLS_364 = {
        /** @type {typeof __VLS_363.command} */
        onCommand: (__VLS_ctx.dropdownHandle),
    };
    const { default: __VLS_365 } = __VLS_361.slots;
    let __VLS_366;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_367 = __VLS_asFunctionalComponent1(__VLS_366, new __VLS_366({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['is_active'] ? 'primary' : ''),
    }));
    const __VLS_368 = __VLS_367({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['is_active'] ? 'primary' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_367));
    const { default: __VLS_371 } = __VLS_369.slots;
    let __VLS_372;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent1(__VLS_372, new __VLS_372({}));
    const __VLS_374 = __VLS_373({}, ...__VLS_functionalComponentArgsRest(__VLS_373));
    const { default: __VLS_377 } = __VLS_375.slots;
    let __VLS_378;
    /** @ts-ignore @type { | typeof __VLS_components.Filter} */
    Filter;
    // @ts-ignore
    const __VLS_379 = __VLS_asFunctionalComponent1(__VLS_378, new __VLS_378({}));
    const __VLS_380 = __VLS_379({}, ...__VLS_functionalComponentArgsRest(__VLS_379));
    // @ts-ignore
    [$t, $t, dropdownHandle, filterMethod,];
    var __VLS_375;
    // @ts-ignore
    [];
    var __VLS_369;
    {
        const { dropdown: __VLS_383 } = __VLS_361.slots;
        let __VLS_384;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_385 = __VLS_asFunctionalComponent1(__VLS_384, new __VLS_384({
            ...{ style: {} },
        }));
        const __VLS_386 = __VLS_385({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_385));
        const { default: __VLS_389 } = __VLS_387.slots;
        let __VLS_390;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_391 = __VLS_asFunctionalComponent1(__VLS_390, new __VLS_390({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === '' ? 'is-active' : '') },
            command: (__VLS_ctx.beforeCommand('is_active', '')),
            ...{ class: "justify-center" },
        }));
        const __VLS_392 = __VLS_391({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === '' ? 'is-active' : '') },
            command: (__VLS_ctx.beforeCommand('is_active', '')),
            ...{ class: "justify-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_391));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_395 } = __VLS_393.slots;
        (__VLS_ctx.$t('common.status.all'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_393;
        let __VLS_396;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_397 = __VLS_asFunctionalComponent1(__VLS_396, new __VLS_396({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === true ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', true)),
        }));
        const __VLS_398 = __VLS_397({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === true ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', true)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_397));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_401 } = __VLS_399.slots;
        (__VLS_ctx.$t('common.status.enabled'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_399;
        let __VLS_402;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_403 = __VLS_asFunctionalComponent1(__VLS_402, new __VLS_402({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === false ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', false)),
        }));
        const __VLS_404 = __VLS_403({
            ...{ class: (__VLS_ctx.filterMethod['is_active'] === false ? 'is-active' : '') },
            ...{ class: "justify-center" },
            command: (__VLS_ctx.beforeCommand('is_active', false)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_403));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_407 } = __VLS_405.slots;
        (__VLS_ctx.$t('common.status.disabled'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_405;
        // @ts-ignore
        [];
        var __VLS_387;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_361;
    var __VLS_362;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_408 } = __VLS_354.slots;
    const [{ row }] = __VLS_vSlot(__VLS_408);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_409;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_410 = __VLS_asFunctionalComponent1(__VLS_409, new __VLS_409({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_411 = __VLS_410({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_410));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_414 } = __VLS_412.slots;
        let __VLS_415;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_416 = __VLS_asFunctionalComponent1(__VLS_415, new __VLS_415({}));
        const __VLS_417 = __VLS_416({}, ...__VLS_functionalComponentArgsRest(__VLS_416));
        // @ts-ignore
        [];
        var __VLS_412;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.enabled'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_420;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_421 = __VLS_asFunctionalComponent1(__VLS_420, new __VLS_420({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_422 = __VLS_421({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_421));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.disabled'));
    }
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_354;
let __VLS_425;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_426 = __VLS_asFunctionalComponent1(__VLS_425, new __VLS_425({
    width: "150",
    prop: "tag",
}));
const __VLS_427 = __VLS_426({
    width: "150",
    prop: "tag",
}, ...__VLS_functionalComponentArgsRest(__VLS_426));
const { default: __VLS_430 } = __VLS_428.slots;
{
    const { header: __VLS_431 } = __VLS_428.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('dynamicsForm.tag.label'));
    let __VLS_432;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent1(__VLS_432, new __VLS_432({
        ...{ 'onVisibleChange': {} },
        trigger: "click",
    }));
    const __VLS_434 = __VLS_433({
        ...{ 'onVisibleChange': {} },
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    let __VLS_437;
    const __VLS_438 = {
        /** @type {typeof __VLS_437.visibleChange} */
        onVisibleChange: (__VLS_ctx.handleTagVisibleChange),
    };
    const { default: __VLS_439 } = __VLS_435.slots;
    let __VLS_440;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_441 = __VLS_asFunctionalComponent1(__VLS_440, new __VLS_440({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['tags']?.length > 0 ? 'primary' : ''),
    }));
    const __VLS_442 = __VLS_441({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['tags']?.length > 0 ? 'primary' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
    const { default: __VLS_445 } = __VLS_443.slots;
    let __VLS_446;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_447 = __VLS_asFunctionalComponent1(__VLS_446, new __VLS_446({}));
    const __VLS_448 = __VLS_447({}, ...__VLS_functionalComponentArgsRest(__VLS_447));
    const { default: __VLS_451 } = __VLS_449.slots;
    let __VLS_452;
    /** @ts-ignore @type { | typeof __VLS_components.Filter} */
    Filter;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent1(__VLS_452, new __VLS_452({}));
    const __VLS_454 = __VLS_453({}, ...__VLS_functionalComponentArgsRest(__VLS_453));
    // @ts-ignore
    [$t, filterMethod, handleTagVisibleChange,];
    var __VLS_449;
    // @ts-ignore
    [];
    var __VLS_443;
    {
        const { dropdown: __VLS_457 } = __VLS_435.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        let __VLS_458;
        /** @ts-ignore @type { | typeof __VLS_components.elCascaderPanel | typeof __VLS_components.ElCascaderPanel | typeof __VLS_components['el-cascader-panel']} */
        elCascaderPanel;
        // @ts-ignore
        const __VLS_459 = __VLS_asFunctionalComponent1(__VLS_458, new __VLS_458({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.tagFilterValue),
            options: (__VLS_ctx.tagFilterOptions),
            props: ({
                multiple: true,
                checkStrictly: true,
                emitPath: false,
                showPrefix: false,
            }),
        }));
        const __VLS_460 = __VLS_459({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.tagFilterValue),
            options: (__VLS_ctx.tagFilterOptions),
            props: ({
                multiple: true,
                checkStrictly: true,
                emitPath: false,
                showPrefix: false,
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_459));
        let __VLS_463;
        const __VLS_464 = {
            /** @type {typeof __VLS_463.change} */
            onChange: ((val) => __VLS_ctx.dropdownHandle({ attr: 'tags', command: val })),
        };
        var __VLS_461;
        var __VLS_462;
        // @ts-ignore
        [dropdownHandle, tagFilterValue, tagFilterOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_435;
    var __VLS_436;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_465 } = __VLS_428.slots;
    const [{ row }] = __VLS_vSlot(__VLS_465);
    let __VLS_466;
    /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
    elPopover;
    // @ts-ignore
    const __VLS_467 = __VLS_asFunctionalComponent1(__VLS_466, new __VLS_466({
        trigger: "hover",
        placement: "bottom-start",
        disabled: (!row.tag_count),
        popperStyle: ({ width: 'auto', maxWidth: '300px' }),
    }));
    const __VLS_468 = __VLS_467({
        trigger: "hover",
        placement: "bottom-start",
        disabled: (!row.tag_count),
        popperStyle: ({ width: 'auto', maxWidth: '300px' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_467));
    const { default: __VLS_471 } = __VLS_469.slots;
    for (const [tag] of __VLS_vFor((row.tags))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (tag.id),
            ...{ class: "flex align-center lighter color-text-primary mt-4 mb-4" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-secondary ellipsis-1" },
            ...{ style: {} },
            title: (tag.key),
        });
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (tag.key);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4 ellipsis-1" },
            title: (tag.value),
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (tag.value);
        // @ts-ignore
        [];
    }
    {
        const { reference: __VLS_472 } = __VLS_469.slots;
        if (row.tag_count) {
            let __VLS_473;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_474 = __VLS_asFunctionalComponent1(__VLS_473, new __VLS_473({
                type: "info",
                effect: "plain",
                ...{ class: "never mr-4" },
            }));
            const __VLS_475 = __VLS_474({
                type: "info",
                effect: "plain",
                ...{ class: "never mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_474));
            /** @type {__VLS_StyleScopedClasses['never']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            const { default: __VLS_478 } = __VLS_476.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center color-text-primary" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
            let __VLS_479;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_480 = __VLS_asFunctionalComponent1(__VLS_479, new __VLS_479({
                iconName: "app-tag",
            }));
            const __VLS_481 = __VLS_480({
                iconName: "app-tag",
            }, ...__VLS_functionalComponentArgsRest(__VLS_480));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-4" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            (row.tag_count);
            // @ts-ignore
            [];
            var __VLS_476;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_469;
    let __VLS_484;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_485 = __VLS_asFunctionalComponent1(__VLS_484, new __VLS_484({
        ...{ 'onClick': {} },
        ...{ class: "button-new-tag" },
        size: "small",
        disabled: (!__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)),
    }));
    const __VLS_486 = __VLS_485({
        ...{ 'onClick': {} },
        ...{ class: "button-new-tag" },
        size: "small",
        disabled: (!__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    let __VLS_489;
    const __VLS_490 = {
        /** @type {typeof __VLS_489.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddTagDialog(row.id);
            // @ts-ignore
            [permissionPrecise, id, openAddTagDialog,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['button-new-tag']} */ ;
    const { default: __VLS_491 } = __VLS_487.slots;
    let __VLS_492;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_493 = __VLS_asFunctionalComponent1(__VLS_492, new __VLS_492({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_494 = __VLS_493({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_493));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.document.tag.key'));
    // @ts-ignore
    [$t,];
    var __VLS_487;
    var __VLS_488;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_428;
let __VLS_497;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_498 = __VLS_asFunctionalComponent1(__VLS_497, new __VLS_497({
    width: "165",
}));
const __VLS_499 = __VLS_498({
    width: "165",
}, ...__VLS_functionalComponentArgsRest(__VLS_498));
const { default: __VLS_502 } = __VLS_500.slots;
{
    const { header: __VLS_503 } = __VLS_500.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.document.form.hit_handling_method.label'));
    let __VLS_504;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_505 = __VLS_asFunctionalComponent1(__VLS_504, new __VLS_504({
        ...{ 'onCommand': {} },
        trigger: "click",
    }));
    const __VLS_506 = __VLS_505({
        ...{ 'onCommand': {} },
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_505));
    let __VLS_509;
    const __VLS_510 = {
        /** @type {typeof __VLS_509.command} */
        onCommand: (__VLS_ctx.dropdownHandle),
    };
    const { default: __VLS_511 } = __VLS_507.slots;
    let __VLS_512;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_513 = __VLS_asFunctionalComponent1(__VLS_512, new __VLS_512({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['hit_handling_method'] ? 'primary' : ''),
    }));
    const __VLS_514 = __VLS_513({
        ...{ style: {} },
        link: true,
        type: (__VLS_ctx.filterMethod['hit_handling_method'] ? 'primary' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_513));
    const { default: __VLS_517 } = __VLS_515.slots;
    let __VLS_518;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_519 = __VLS_asFunctionalComponent1(__VLS_518, new __VLS_518({}));
    const __VLS_520 = __VLS_519({}, ...__VLS_functionalComponentArgsRest(__VLS_519));
    const { default: __VLS_523 } = __VLS_521.slots;
    let __VLS_524;
    /** @ts-ignore @type { | typeof __VLS_components.Filter} */
    Filter;
    // @ts-ignore
    const __VLS_525 = __VLS_asFunctionalComponent1(__VLS_524, new __VLS_524({}));
    const __VLS_526 = __VLS_525({}, ...__VLS_functionalComponentArgsRest(__VLS_525));
    // @ts-ignore
    [$t, dropdownHandle, filterMethod,];
    var __VLS_521;
    // @ts-ignore
    [];
    var __VLS_515;
    {
        const { dropdown: __VLS_529 } = __VLS_507.slots;
        let __VLS_530;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_531 = __VLS_asFunctionalComponent1(__VLS_530, new __VLS_530({
            ...{ style: {} },
        }));
        const __VLS_532 = __VLS_531({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_531));
        const { default: __VLS_535 } = __VLS_533.slots;
        let __VLS_536;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_537 = __VLS_asFunctionalComponent1(__VLS_536, new __VLS_536({
            ...{ class: (__VLS_ctx.filterMethod['hit_handling_method'] ? '' : 'is-active') },
            command: (__VLS_ctx.beforeCommand('hit_handling_method', '')),
            ...{ class: "justify-center" },
        }));
        const __VLS_538 = __VLS_537({
            ...{ class: (__VLS_ctx.filterMethod['hit_handling_method'] ? '' : 'is-active') },
            command: (__VLS_ctx.beforeCommand('hit_handling_method', '')),
            ...{ class: "justify-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_537));
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        const { default: __VLS_541 } = __VLS_539.slots;
        (__VLS_ctx.$t('common.status.all'));
        // @ts-ignore
        [$t, filterMethod, beforeCommand,];
        var __VLS_539;
        for (const [value, key] of __VLS_vFor((__VLS_ctx.hitHandlingMethod))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (key),
            });
            let __VLS_542;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_543 = __VLS_asFunctionalComponent1(__VLS_542, new __VLS_542({
                ...{ class: (__VLS_ctx.filterMethod['hit_handling_method'] === key ? 'is-active' : '') },
                ...{ class: "justify-center" },
                command: (__VLS_ctx.beforeCommand('hit_handling_method', key)),
            }));
            const __VLS_544 = __VLS_543({
                ...{ class: (__VLS_ctx.filterMethod['hit_handling_method'] === key ? 'is-active' : '') },
                ...{ class: "justify-center" },
                command: (__VLS_ctx.beforeCommand('hit_handling_method', key)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_543));
            /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
            const { default: __VLS_547 } = __VLS_545.slots;
            (__VLS_ctx.$t(value));
            // @ts-ignore
            [$t, filterMethod, beforeCommand, hitHandlingMethod,];
            var __VLS_545;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_533;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_507;
    var __VLS_508;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_548 } = __VLS_500.slots;
    const [{ row }] = __VLS_vSlot(__VLS_548);
    (__VLS_ctx.$t(__VLS_ctx.hitHandlingMethod[row.hit_handling_method]));
    // @ts-ignore
    [$t, hitHandlingMethod, hitHandlingMethod,];
}
// @ts-ignore
[];
var __VLS_500;
let __VLS_549;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_550 = __VLS_asFunctionalComponent1(__VLS_549, new __VLS_549({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}));
const __VLS_551 = __VLS_550({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_550));
let __VLS_554;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_555 = __VLS_asFunctionalComponent1(__VLS_554, new __VLS_554({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "175",
    sortable: true,
}));
const __VLS_556 = __VLS_555({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "175",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_555));
const { default: __VLS_559 } = __VLS_557.slots;
{
    const { default: __VLS_560 } = __VLS_557.slots;
    const [{ row }] = __VLS_vSlot(__VLS_560);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_557;
let __VLS_561;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_562 = __VLS_asFunctionalComponent1(__VLS_561, new __VLS_561({
    prop: "update_time",
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "175",
    sortable: true,
}));
const __VLS_563 = __VLS_562({
    prop: "update_time",
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "175",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_562));
const { default: __VLS_566 } = __VLS_564.slots;
{
    const { default: __VLS_567 } = __VLS_564.slots;
    const [{ row }] = __VLS_vSlot(__VLS_567);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_564;
if (!__VLS_ctx.isShared) {
    let __VLS_568;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_569 = __VLS_asFunctionalComponent1(__VLS_568, new __VLS_568({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "160",
        fixed: "right",
    }));
    const __VLS_570 = __VLS_569({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "160",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_569));
    const { default: __VLS_573 } = __VLS_571.slots;
    {
        const { default: __VLS_574 } = __VLS_571.slots;
        const [{ row }] = __VLS_vSlot(__VLS_574);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ onClick: () => { } },
        });
        if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
            let __VLS_575;
            /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
            elSwitch;
            // @ts-ignore
            const __VLS_576 = __VLS_asFunctionalComponent1(__VLS_575, new __VLS_575({
                loading: (__VLS_ctx.loading),
                size: "small",
                modelValue: (row.is_active),
                beforeChange: (() => __VLS_ctx.changeState(row)),
            }));
            const __VLS_577 = __VLS_576({
                loading: (__VLS_ctx.loading),
                size: "small",
                modelValue: (row.is_active),
                beforeChange: (() => __VLS_ctx.changeState(row)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_576));
        }
        let __VLS_580;
        /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
        elDivider;
        // @ts-ignore
        const __VLS_581 = __VLS_asFunctionalComponent1(__VLS_580, new __VLS_580({
            direction: "vertical",
        }));
        const __VLS_582 = __VLS_581({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_581));
        if (__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4) {
            if ([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.EMBEDDING))) {
                let __VLS_585;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_586 = __VLS_asFunctionalComponent1(__VLS_585, new __VLS_585({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelVectorization')),
                    placement: "top",
                }));
                const __VLS_587 = __VLS_586({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelVectorization')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_586));
                const { default: __VLS_590 } = __VLS_588.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "mr-4" },
                });
                /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
                    let __VLS_591;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_592 = __VLS_asFunctionalComponent1(__VLS_591, new __VLS_591({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }));
                    const __VLS_593 = __VLS_592({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_592));
                    let __VLS_596;
                    const __VLS_597 = {
                        /** @type {typeof __VLS_596.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                throw 0;
                            if (!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.EMBEDDING))))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.cancelTask(row, __VLS_ctx.TaskType.EMBEDDING);
                            // @ts-ignore
                            [$t, $t, isShared, knowledgeDetail, knowledgeDetail, permissionPrecise, permissionPrecise, id, id, loading, State, State, TaskType, TaskType, changeState, getTaskState, cancelTask,];
                        },
                    };
                    const { default: __VLS_598 } = __VLS_594.slots;
                    let __VLS_599;
                    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                    elIcon;
                    // @ts-ignore
                    const __VLS_600 = __VLS_asFunctionalComponent1(__VLS_599, new __VLS_599({}));
                    const __VLS_601 = __VLS_600({}, ...__VLS_functionalComponentArgsRest(__VLS_600));
                    const { default: __VLS_604 } = __VLS_602.slots;
                    let __VLS_605;
                    /** @ts-ignore @type { | typeof __VLS_components.Close} */
                    Close;
                    // @ts-ignore
                    const __VLS_606 = __VLS_asFunctionalComponent1(__VLS_605, new __VLS_605({}));
                    const __VLS_607 = __VLS_606({}, ...__VLS_functionalComponentArgsRest(__VLS_606));
                    // @ts-ignore
                    [];
                    var __VLS_602;
                    // @ts-ignore
                    [];
                    var __VLS_594;
                    var __VLS_595;
                }
                // @ts-ignore
                [];
                var __VLS_588;
            }
            else {
                let __VLS_610;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_611 = __VLS_asFunctionalComponent1(__VLS_610, new __VLS_610({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
                    placement: "top",
                }));
                const __VLS_612 = __VLS_611({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_611));
                const { default: __VLS_615 } = __VLS_613.slots;
                if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "mr-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                    let __VLS_616;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_617 = __VLS_asFunctionalComponent1(__VLS_616, new __VLS_616({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }));
                    const __VLS_618 = __VLS_617({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_617));
                    let __VLS_621;
                    const __VLS_622 = {
                        /** @type {typeof __VLS_621.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                throw 0;
                            if (!!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.EMBEDDING))))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.refreshDocument(row);
                            // @ts-ignore
                            [$t, permissionPrecise, id, refreshDocument,];
                        },
                    };
                    const { default: __VLS_623 } = __VLS_619.slots;
                    let __VLS_624;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_625 = __VLS_asFunctionalComponent1(__VLS_624, new __VLS_624({
                        iconName: "app-document-refresh",
                        ...{ style: {} },
                    }));
                    const __VLS_626 = __VLS_625({
                        iconName: "app-document-refresh",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_625));
                    // @ts-ignore
                    [];
                    var __VLS_619;
                    var __VLS_620;
                }
                // @ts-ignore
                [];
                var __VLS_613;
            }
            if ([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.TOKENIZE))) {
                let __VLS_629;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_630 = __VLS_asFunctionalComponent1(__VLS_629, new __VLS_629({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelTokenize')),
                    placement: "top",
                }));
                const __VLS_631 = __VLS_630({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelTokenize')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_630));
                const { default: __VLS_634 } = __VLS_632.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "mr-4" },
                });
                /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
                    let __VLS_635;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_636 = __VLS_asFunctionalComponent1(__VLS_635, new __VLS_635({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }));
                    const __VLS_637 = __VLS_636({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_636));
                    let __VLS_640;
                    const __VLS_641 = {
                        /** @type {typeof __VLS_640.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                throw 0;
                            if (!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.TOKENIZE))))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.cancelTask(row, __VLS_ctx.TaskType.TOKENIZE);
                            // @ts-ignore
                            [$t, permissionPrecise, id, State, State, TaskType, TaskType, getTaskState, cancelTask,];
                        },
                    };
                    const { default: __VLS_642 } = __VLS_638.slots;
                    let __VLS_643;
                    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                    elIcon;
                    // @ts-ignore
                    const __VLS_644 = __VLS_asFunctionalComponent1(__VLS_643, new __VLS_643({}));
                    const __VLS_645 = __VLS_644({}, ...__VLS_functionalComponentArgsRest(__VLS_644));
                    const { default: __VLS_648 } = __VLS_646.slots;
                    let __VLS_649;
                    /** @ts-ignore @type { | typeof __VLS_components.Close} */
                    Close;
                    // @ts-ignore
                    const __VLS_650 = __VLS_asFunctionalComponent1(__VLS_649, new __VLS_649({}));
                    const __VLS_651 = __VLS_650({}, ...__VLS_functionalComponentArgsRest(__VLS_650));
                    // @ts-ignore
                    [];
                    var __VLS_646;
                    // @ts-ignore
                    [];
                    var __VLS_638;
                    var __VLS_639;
                }
                // @ts-ignore
                [];
                var __VLS_632;
            }
            else {
                let __VLS_654;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_655 = __VLS_asFunctionalComponent1(__VLS_654, new __VLS_654({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.customSegmentation.wordIndexing')),
                    placement: "top",
                }));
                const __VLS_656 = __VLS_655({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.customSegmentation.wordIndexing')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_655));
                const { default: __VLS_659 } = __VLS_657.slots;
                if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "mr-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                    let __VLS_660;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_661 = __VLS_asFunctionalComponent1(__VLS_660, new __VLS_660({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }));
                    const __VLS_662 = __VLS_661({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_661));
                    let __VLS_665;
                    const __VLS_666 = {
                        /** @type {typeof __VLS_665.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                throw 0;
                            if (!!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.TOKENIZE))))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.tokenizeDocument(row);
                            // @ts-ignore
                            [$t, permissionPrecise, id, tokenizeDocument,];
                        },
                    };
                    const { default: __VLS_667 } = __VLS_663.slots;
                    let __VLS_668;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_669 = __VLS_asFunctionalComponent1(__VLS_668, new __VLS_668({
                        iconName: "app-document-wordIndexing",
                        ...{ style: {} },
                    }));
                    const __VLS_670 = __VLS_669({
                        iconName: "app-document-wordIndexing",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_669));
                    // @ts-ignore
                    [];
                    var __VLS_663;
                    var __VLS_664;
                }
                // @ts-ignore
                [];
                var __VLS_657;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ onClick: () => { } },
            });
            if (__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)) {
                let __VLS_673;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
                elDropdown;
                // @ts-ignore
                const __VLS_674 = __VLS_asFunctionalComponent1(__VLS_673, new __VLS_673({
                    trigger: "click",
                }));
                const __VLS_675 = __VLS_674({
                    trigger: "click",
                }, ...__VLS_functionalComponentArgsRest(__VLS_674));
                const { default: __VLS_678 } = __VLS_676.slots;
                let __VLS_679;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_680 = __VLS_asFunctionalComponent1(__VLS_679, new __VLS_679({
                    text: true,
                    type: "primary",
                }));
                const __VLS_681 = __VLS_680({
                    text: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_680));
                const { default: __VLS_684 } = __VLS_682.slots;
                let __VLS_685;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_686 = __VLS_asFunctionalComponent1(__VLS_685, new __VLS_685({
                    iconName: "app-more",
                }));
                const __VLS_687 = __VLS_686({
                    iconName: "app-more",
                }, ...__VLS_functionalComponentArgsRest(__VLS_686));
                // @ts-ignore
                [id, MoreFilledPermission1,];
                var __VLS_682;
                {
                    const { dropdown: __VLS_690 } = __VLS_676.slots;
                    let __VLS_691;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                    elDropdownMenu;
                    // @ts-ignore
                    const __VLS_692 = __VLS_asFunctionalComponent1(__VLS_691, new __VLS_691({}));
                    const __VLS_693 = __VLS_692({}, ...__VLS_functionalComponentArgsRest(__VLS_692));
                    const { default: __VLS_696 } = __VLS_694.slots;
                    if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
                        let __VLS_697;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_698 = __VLS_asFunctionalComponent1(__VLS_697, new __VLS_697({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_699 = __VLS_698({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_698));
                        let __VLS_702;
                        const __VLS_703 = {
                            /** @type {typeof __VLS_702.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.settingDoc(row);
                                // @ts-ignore
                                [permissionPrecise, id, settingDoc,];
                            },
                        };
                        const { default: __VLS_704 } = __VLS_700.slots;
                        let __VLS_705;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_706 = __VLS_asFunctionalComponent1(__VLS_705, new __VLS_705({
                            iconName: "app-setting",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_707 = __VLS_706({
                            iconName: "app-setting",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_706));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.setting'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_700;
                        var __VLS_701;
                    }
                    if ([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.GENERATE_PROBLEM)) && __VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)) {
                        let __VLS_710;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_711 = __VLS_asFunctionalComponent1(__VLS_710, new __VLS_710({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_712 = __VLS_711({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_711));
                        let __VLS_715;
                        const __VLS_716 = {
                            /** @type {typeof __VLS_715.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.GENERATE_PROBLEM)) && __VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.cancelTask(row, __VLS_ctx.TaskType.GENERATE_PROBLEM);
                                // @ts-ignore
                                [permissionPrecise, id, State, State, TaskType, TaskType, getTaskState, cancelTask,];
                            },
                        };
                        const { default: __VLS_717 } = __VLS_713.slots;
                        let __VLS_718;
                        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                        elIcon;
                        // @ts-ignore
                        const __VLS_719 = __VLS_asFunctionalComponent1(__VLS_718, new __VLS_718({
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_720 = __VLS_719({
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_719));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        const { default: __VLS_723 } = __VLS_721.slots;
                        let __VLS_724;
                        /** @ts-ignore @type { | typeof __VLS_components.Close} */
                        Close;
                        // @ts-ignore
                        const __VLS_725 = __VLS_asFunctionalComponent1(__VLS_724, new __VLS_724({}));
                        const __VLS_726 = __VLS_725({}, ...__VLS_functionalComponentArgsRest(__VLS_725));
                        // @ts-ignore
                        [];
                        var __VLS_721;
                        (__VLS_ctx.$t('views.document.setting.cancelGenerateQuestion'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_713;
                        var __VLS_714;
                    }
                    else if (__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)) {
                        let __VLS_729;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_730 = __VLS_asFunctionalComponent1(__VLS_729, new __VLS_729({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_731 = __VLS_730({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_730));
                        let __VLS_734;
                        const __VLS_735 = {
                            /** @type {typeof __VLS_734.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.GENERATE_PROBLEM)) && __VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.openGenerateDialog(row);
                                // @ts-ignore
                                [permissionPrecise, id, openGenerateDialog,];
                            },
                        };
                        const { default: __VLS_736 } = __VLS_732.slots;
                        let __VLS_737;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_738 = __VLS_asFunctionalComponent1(__VLS_737, new __VLS_737({
                            iconName: "app-generate-question",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_739 = __VLS_738({
                            iconName: "app-generate-question",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_738));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.generateQuestion.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_732;
                        var __VLS_733;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)) {
                        let __VLS_742;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_743 = __VLS_asFunctionalComponent1(__VLS_742, new __VLS_742({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_744 = __VLS_743({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_743));
                        let __VLS_747;
                        const __VLS_748 = {
                            /** @type {typeof __VLS_747.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.openTagSettingDrawer(row);
                                // @ts-ignore
                                [permissionPrecise, id, openTagSettingDrawer,];
                            },
                        };
                        const { default: __VLS_749 } = __VLS_745.slots;
                        let __VLS_750;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_751 = __VLS_asFunctionalComponent1(__VLS_750, new __VLS_750({
                            iconName: "app-tag",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_752 = __VLS_751({
                            iconName: "app-tag",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_751));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.tag.setting'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_745;
                        var __VLS_746;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_migrate(__VLS_ctx.id)) {
                        let __VLS_755;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_756 = __VLS_asFunctionalComponent1(__VLS_755, new __VLS_755({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_757 = __VLS_756({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_756));
                        let __VLS_760;
                        const __VLS_761 = {
                            /** @type {typeof __VLS_760.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_migrate(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.openknowledgeDialog(row);
                                // @ts-ignore
                                [permissionPrecise, id, openknowledgeDialog,];
                            },
                        };
                        const { default: __VLS_762 } = __VLS_758.slots;
                        let __VLS_763;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_764 = __VLS_asFunctionalComponent1(__VLS_763, new __VLS_763({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_765 = __VLS_764({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_764));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.setting.migration'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_758;
                        var __VLS_759;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)) {
                        let __VLS_768;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_769 = __VLS_asFunctionalComponent1(__VLS_768, new __VLS_768({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_770 = __VLS_769({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_769));
                        let __VLS_773;
                        const __VLS_774 = {
                            /** @type {typeof __VLS_773.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.exportDocument(row);
                                // @ts-ignore
                                [permissionPrecise, id, exportDocument,];
                            },
                        };
                        const { default: __VLS_775 } = __VLS_771.slots;
                        let __VLS_776;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_777 = __VLS_asFunctionalComponent1(__VLS_776, new __VLS_776({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_778 = __VLS_777({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_777));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.export'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_771;
                        var __VLS_772;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)) {
                        let __VLS_781;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_782 = __VLS_asFunctionalComponent1(__VLS_781, new __VLS_781({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_783 = __VLS_782({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_782));
                        let __VLS_786;
                        const __VLS_787 = {
                            /** @type {typeof __VLS_786.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.exportDocumentZip(row);
                                // @ts-ignore
                                [permissionPrecise, id, exportDocumentZip,];
                            },
                        };
                        const { default: __VLS_788 } = __VLS_784.slots;
                        let __VLS_789;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_790 = __VLS_asFunctionalComponent1(__VLS_789, new __VLS_789({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_791 = __VLS_790({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_790));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.export'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_784;
                        var __VLS_785;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_download(__VLS_ctx.id)) {
                        let __VLS_794;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_795 = __VLS_asFunctionalComponent1(__VLS_794, new __VLS_794({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_796 = __VLS_795({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_795));
                        let __VLS_799;
                        const __VLS_800 = {
                            /** @type {typeof __VLS_799.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_download(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.downloadDocument(row);
                                // @ts-ignore
                                [permissionPrecise, id, downloadDocument,];
                            },
                        };
                        const { default: __VLS_801 } = __VLS_797.slots;
                        let __VLS_802;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_803 = __VLS_asFunctionalComponent1(__VLS_802, new __VLS_802({
                            iconName: "app-download",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_804 = __VLS_803({
                            iconName: "app-download",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_803));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.setting.download'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_797;
                        var __VLS_798;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_replace(__VLS_ctx.id)) {
                        let __VLS_807;
                        /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
                        elUpload;
                        // @ts-ignore
                        const __VLS_808 = __VLS_asFunctionalComponent1(__VLS_807, new __VLS_807({
                            ref: "elUploadRef",
                            fileList: ([]),
                            action: "#",
                            autoUpload: (false),
                            showFileList: (false),
                            onChange: ((file, fileList) => __VLS_ctx.replaceDocument(file, row)),
                        }));
                        const __VLS_809 = __VLS_808({
                            ref: "elUploadRef",
                            fileList: ([]),
                            action: "#",
                            autoUpload: (false),
                            showFileList: (false),
                            onChange: ((file, fileList) => __VLS_ctx.replaceDocument(file, row)),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_808));
                        var __VLS_812;
                        const { default: __VLS_814 } = __VLS_810.slots;
                        let __VLS_815;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_816 = __VLS_asFunctionalComponent1(__VLS_815, new __VLS_815({}));
                        const __VLS_817 = __VLS_816({}, ...__VLS_functionalComponentArgsRest(__VLS_816));
                        const { default: __VLS_820 } = __VLS_818.slots;
                        let __VLS_821;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_822 = __VLS_asFunctionalComponent1(__VLS_821, new __VLS_821({
                            iconName: "app-upload",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_823 = __VLS_822({
                            iconName: "app-upload",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_822));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.setting.replace'));
                        // @ts-ignore
                        [$t, permissionPrecise, id, replaceDocument,];
                        var __VLS_818;
                        // @ts-ignore
                        [];
                        var __VLS_810;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_delete(__VLS_ctx.id)) {
                        let __VLS_826;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_827 = __VLS_asFunctionalComponent1(__VLS_826, new __VLS_826({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_828 = __VLS_827({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_827));
                        let __VLS_831;
                        const __VLS_832 = {
                            /** @type {typeof __VLS_831.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 0 || __VLS_ctx.knowledgeDetail?.type === 4))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission1(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_delete(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.deleteDocument(row);
                                // @ts-ignore
                                [permissionPrecise, id, deleteDocument,];
                            },
                        };
                        const { default: __VLS_833 } = __VLS_829.slots;
                        let __VLS_834;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_835 = __VLS_asFunctionalComponent1(__VLS_834, new __VLS_834({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_836 = __VLS_835({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_835));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.delete'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_829;
                        var __VLS_830;
                    }
                    // @ts-ignore
                    [];
                    var __VLS_694;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_676;
            }
        }
        if (__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2) {
            if ([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.EMBEDDING)) && __VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
                let __VLS_839;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_840 = __VLS_asFunctionalComponent1(__VLS_839, new __VLS_839({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelVectorization')),
                    placement: "top",
                }));
                const __VLS_841 = __VLS_840({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelVectorization')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_840));
                const { default: __VLS_844 } = __VLS_842.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "mr-4" },
                });
                /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                let __VLS_845;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_846 = __VLS_asFunctionalComponent1(__VLS_845, new __VLS_845({
                    ...{ 'onClick': {} },
                    type: "primary",
                    text: true,
                }));
                const __VLS_847 = __VLS_846({
                    ...{ 'onClick': {} },
                    type: "primary",
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_846));
                let __VLS_850;
                const __VLS_851 = {
                    /** @type {typeof __VLS_850.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.isShared))
                            throw 0;
                        if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                            throw 0;
                        if (!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.EMBEDDING)) && __VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                            throw 0;
                        return __VLS_ctx.cancelTask(row, __VLS_ctx.TaskType.EMBEDDING);
                        // @ts-ignore
                        [$t, knowledgeDetail, knowledgeDetail, permissionPrecise, id, State, State, TaskType, TaskType, getTaskState, cancelTask,];
                    },
                };
                const { default: __VLS_852 } = __VLS_848.slots;
                let __VLS_853;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_854 = __VLS_asFunctionalComponent1(__VLS_853, new __VLS_853({}));
                const __VLS_855 = __VLS_854({}, ...__VLS_functionalComponentArgsRest(__VLS_854));
                const { default: __VLS_858 } = __VLS_856.slots;
                let __VLS_859;
                /** @ts-ignore @type { | typeof __VLS_components.Close} */
                Close;
                // @ts-ignore
                const __VLS_860 = __VLS_asFunctionalComponent1(__VLS_859, new __VLS_859({}));
                const __VLS_861 = __VLS_860({}, ...__VLS_functionalComponentArgsRest(__VLS_860));
                // @ts-ignore
                [];
                var __VLS_856;
                // @ts-ignore
                [];
                var __VLS_848;
                var __VLS_849;
                // @ts-ignore
                [];
                var __VLS_842;
            }
            else {
                let __VLS_864;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_865 = __VLS_asFunctionalComponent1(__VLS_864, new __VLS_864({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
                    placement: "top",
                }));
                const __VLS_866 = __VLS_865({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_865));
                const { default: __VLS_869 } = __VLS_867.slots;
                if (__VLS_ctx.permissionPrecise.vector(__VLS_ctx.id)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "mr-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                    let __VLS_870;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_871 = __VLS_asFunctionalComponent1(__VLS_870, new __VLS_870({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }));
                    const __VLS_872 = __VLS_871({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_871));
                    let __VLS_875;
                    const __VLS_876 = {
                        /** @type {typeof __VLS_875.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                throw 0;
                            if (!!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.EMBEDDING)) && __VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.vector(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.refreshDocument(row);
                            // @ts-ignore
                            [$t, permissionPrecise, id, refreshDocument,];
                        },
                    };
                    const { default: __VLS_877 } = __VLS_873.slots;
                    let __VLS_878;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_879 = __VLS_asFunctionalComponent1(__VLS_878, new __VLS_878({
                        iconName: "app-document-refresh",
                        ...{ style: {} },
                    }));
                    const __VLS_880 = __VLS_879({
                        iconName: "app-document-refresh",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_879));
                    // @ts-ignore
                    [];
                    var __VLS_873;
                    var __VLS_874;
                }
                // @ts-ignore
                [];
                var __VLS_867;
            }
            if ([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.TOKENIZE))) {
                let __VLS_883;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_884 = __VLS_asFunctionalComponent1(__VLS_883, new __VLS_883({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelTokenize')),
                    placement: "top",
                }));
                const __VLS_885 = __VLS_884({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.document.setting.cancelTokenize')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_884));
                const { default: __VLS_888 } = __VLS_886.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "mr-4" },
                });
                /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
                    let __VLS_889;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_890 = __VLS_asFunctionalComponent1(__VLS_889, new __VLS_889({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }));
                    const __VLS_891 = __VLS_890({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_890));
                    let __VLS_894;
                    const __VLS_895 = {
                        /** @type {typeof __VLS_894.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                throw 0;
                            if (!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.TOKENIZE))))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.cancelTask(row, __VLS_ctx.TaskType.TOKENIZE);
                            // @ts-ignore
                            [$t, permissionPrecise, id, State, State, TaskType, TaskType, getTaskState, cancelTask,];
                        },
                    };
                    const { default: __VLS_896 } = __VLS_892.slots;
                    let __VLS_897;
                    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                    elIcon;
                    // @ts-ignore
                    const __VLS_898 = __VLS_asFunctionalComponent1(__VLS_897, new __VLS_897({}));
                    const __VLS_899 = __VLS_898({}, ...__VLS_functionalComponentArgsRest(__VLS_898));
                    const { default: __VLS_902 } = __VLS_900.slots;
                    let __VLS_903;
                    /** @ts-ignore @type { | typeof __VLS_components.Close} */
                    Close;
                    // @ts-ignore
                    const __VLS_904 = __VLS_asFunctionalComponent1(__VLS_903, new __VLS_903({}));
                    const __VLS_905 = __VLS_904({}, ...__VLS_functionalComponentArgsRest(__VLS_904));
                    // @ts-ignore
                    [];
                    var __VLS_900;
                    // @ts-ignore
                    [];
                    var __VLS_892;
                    var __VLS_893;
                }
                // @ts-ignore
                [];
                var __VLS_886;
            }
            else {
                let __VLS_908;
                /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                elTooltip;
                // @ts-ignore
                const __VLS_909 = __VLS_asFunctionalComponent1(__VLS_908, new __VLS_908({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.customSegmentation.wordIndexing')),
                    placement: "top",
                }));
                const __VLS_910 = __VLS_909({
                    effect: "dark",
                    content: (__VLS_ctx.$t('views.knowledge.customSegmentation.wordIndexing')),
                    placement: "top",
                }, ...__VLS_functionalComponentArgsRest(__VLS_909));
                const { default: __VLS_913 } = __VLS_911.slots;
                if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "mr-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                    let __VLS_914;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_915 = __VLS_asFunctionalComponent1(__VLS_914, new __VLS_914({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }));
                    const __VLS_916 = __VLS_915({
                        ...{ 'onClick': {} },
                        type: "primary",
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_915));
                    let __VLS_919;
                    const __VLS_920 = {
                        /** @type {typeof __VLS_919.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                throw 0;
                            if (!!([__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.TOKENIZE))))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.tokenizeDocument(row);
                            // @ts-ignore
                            [$t, permissionPrecise, id, tokenizeDocument,];
                        },
                    };
                    const { default: __VLS_921 } = __VLS_917.slots;
                    let __VLS_922;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_923 = __VLS_asFunctionalComponent1(__VLS_922, new __VLS_922({
                        iconName: "app-document-wordIndexing",
                        ...{ style: {} },
                    }));
                    const __VLS_924 = __VLS_923({
                        iconName: "app-document-wordIndexing",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_923));
                    // @ts-ignore
                    [];
                    var __VLS_917;
                    var __VLS_918;
                }
                // @ts-ignore
                [];
                var __VLS_911;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ onClick: () => { } },
            });
            if (__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)) {
                let __VLS_927;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
                elDropdown;
                // @ts-ignore
                const __VLS_928 = __VLS_asFunctionalComponent1(__VLS_927, new __VLS_927({
                    trigger: "click",
                }));
                const __VLS_929 = __VLS_928({
                    trigger: "click",
                }, ...__VLS_functionalComponentArgsRest(__VLS_928));
                const { default: __VLS_932 } = __VLS_930.slots;
                let __VLS_933;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_934 = __VLS_asFunctionalComponent1(__VLS_933, new __VLS_933({
                    text: true,
                    type: "primary",
                }));
                const __VLS_935 = __VLS_934({
                    text: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_934));
                const { default: __VLS_938 } = __VLS_936.slots;
                let __VLS_939;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_940 = __VLS_asFunctionalComponent1(__VLS_939, new __VLS_939({
                    iconName: "app-more",
                }));
                const __VLS_941 = __VLS_940({
                    iconName: "app-more",
                }, ...__VLS_functionalComponentArgsRest(__VLS_940));
                // @ts-ignore
                [id, MoreFilledPermission2,];
                var __VLS_936;
                {
                    const { dropdown: __VLS_944 } = __VLS_930.slots;
                    let __VLS_945;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                    elDropdownMenu;
                    // @ts-ignore
                    const __VLS_946 = __VLS_asFunctionalComponent1(__VLS_945, new __VLS_945({}));
                    const __VLS_947 = __VLS_946({}, ...__VLS_functionalComponentArgsRest(__VLS_946));
                    const { default: __VLS_950 } = __VLS_948.slots;
                    if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
                        let __VLS_951;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_952 = __VLS_asFunctionalComponent1(__VLS_951, new __VLS_951({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_953 = __VLS_952({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_952));
                        let __VLS_956;
                        const __VLS_957 = {
                            /** @type {typeof __VLS_956.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.settingDoc(row);
                                // @ts-ignore
                                [permissionPrecise, id, settingDoc,];
                            },
                        };
                        const { default: __VLS_958 } = __VLS_954.slots;
                        let __VLS_959;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_960 = __VLS_asFunctionalComponent1(__VLS_959, new __VLS_959({
                            iconName: "app-setting",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_961 = __VLS_960({
                            iconName: "app-setting",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_960));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.setting'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_954;
                        var __VLS_955;
                    }
                    if (__VLS_ctx.permissionPrecise.sync(__VLS_ctx.id)) {
                        let __VLS_964;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_965 = __VLS_asFunctionalComponent1(__VLS_964, new __VLS_964({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_966 = __VLS_965({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_965));
                        let __VLS_969;
                        const __VLS_970 = {
                            /** @type {typeof __VLS_969.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.sync(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.syncDocument(row);
                                // @ts-ignore
                                [permissionPrecise, id, syncDocument,];
                            },
                        };
                        const { default: __VLS_971 } = __VLS_967.slots;
                        let __VLS_972;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_973 = __VLS_asFunctionalComponent1(__VLS_972, new __VLS_972({
                            iconName: "app-sync",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_974 = __VLS_973({
                            iconName: "app-sync",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_973));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.knowledge.setting.sync'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_967;
                        var __VLS_968;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)) {
                        let __VLS_977;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_978 = __VLS_asFunctionalComponent1(__VLS_977, new __VLS_977({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_979 = __VLS_978({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_978));
                        let __VLS_982;
                        const __VLS_983 = {
                            /** @type {typeof __VLS_982.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_tag(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.openTagSettingDrawer(row);
                                // @ts-ignore
                                [permissionPrecise, id, openTagSettingDrawer,];
                            },
                        };
                        const { default: __VLS_984 } = __VLS_980.slots;
                        let __VLS_985;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_986 = __VLS_asFunctionalComponent1(__VLS_985, new __VLS_985({
                            iconName: "app-tag",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_987 = __VLS_986({
                            iconName: "app-tag",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_986));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.tag.setting'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_980;
                        var __VLS_981;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id) &&
                        [__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.GENERATE_PROBLEM))) {
                        let __VLS_990;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_991 = __VLS_asFunctionalComponent1(__VLS_990, new __VLS_990({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_992 = __VLS_991({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_991));
                        let __VLS_995;
                        const __VLS_996 = {
                            /** @type {typeof __VLS_995.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id) &&
                                    [__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.GENERATE_PROBLEM))))
                                    throw 0;
                                return __VLS_ctx.cancelTask(row, __VLS_ctx.TaskType.GENERATE_PROBLEM);
                                // @ts-ignore
                                [permissionPrecise, id, State, State, TaskType, TaskType, getTaskState, cancelTask,];
                            },
                        };
                        const { default: __VLS_997 } = __VLS_993.slots;
                        let __VLS_998;
                        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                        elIcon;
                        // @ts-ignore
                        const __VLS_999 = __VLS_asFunctionalComponent1(__VLS_998, new __VLS_998({
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_1000 = __VLS_999({
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_999));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        const { default: __VLS_1003 } = __VLS_1001.slots;
                        let __VLS_1004;
                        /** @ts-ignore @type { | typeof __VLS_components.Close} */
                        Close;
                        // @ts-ignore
                        const __VLS_1005 = __VLS_asFunctionalComponent1(__VLS_1004, new __VLS_1004({}));
                        const __VLS_1006 = __VLS_1005({}, ...__VLS_functionalComponentArgsRest(__VLS_1005));
                        // @ts-ignore
                        [];
                        var __VLS_1001;
                        (__VLS_ctx.$t('views.document.setting.cancelGenerateQuestion'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_993;
                        var __VLS_994;
                    }
                    else if (__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)) {
                        let __VLS_1009;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_1010 = __VLS_asFunctionalComponent1(__VLS_1009, new __VLS_1009({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_1011 = __VLS_1010({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1010));
                        let __VLS_1014;
                        const __VLS_1015 = {
                            /** @type {typeof __VLS_1014.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!!(__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id) &&
                                    [__VLS_ctx.State.STARTED, __VLS_ctx.State.PENDING].includes(__VLS_ctx.getTaskState(row.status, __VLS_ctx.TaskType.GENERATE_PROBLEM))))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.openGenerateDialog(row);
                                // @ts-ignore
                                [permissionPrecise, id, openGenerateDialog,];
                            },
                        };
                        const { default: __VLS_1016 } = __VLS_1012.slots;
                        let __VLS_1017;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_1018 = __VLS_asFunctionalComponent1(__VLS_1017, new __VLS_1017({
                            iconName: "app-generate-question",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_1019 = __VLS_1018({
                            iconName: "app-generate-question",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1018));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.generateQuestion.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_1012;
                        var __VLS_1013;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_migrate(__VLS_ctx.id)) {
                        let __VLS_1022;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_1023 = __VLS_asFunctionalComponent1(__VLS_1022, new __VLS_1022({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_1024 = __VLS_1023({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1023));
                        let __VLS_1027;
                        const __VLS_1028 = {
                            /** @type {typeof __VLS_1027.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_migrate(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.openknowledgeDialog(row);
                                // @ts-ignore
                                [permissionPrecise, id, openknowledgeDialog,];
                            },
                        };
                        const { default: __VLS_1029 } = __VLS_1025.slots;
                        let __VLS_1030;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_1031 = __VLS_asFunctionalComponent1(__VLS_1030, new __VLS_1030({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_1032 = __VLS_1031({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1031));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.setting.migration'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_1025;
                        var __VLS_1026;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)) {
                        let __VLS_1035;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_1036 = __VLS_asFunctionalComponent1(__VLS_1035, new __VLS_1035({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_1037 = __VLS_1036({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1036));
                        let __VLS_1040;
                        const __VLS_1041 = {
                            /** @type {typeof __VLS_1040.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.exportDocument(row);
                                // @ts-ignore
                                [permissionPrecise, id, exportDocument,];
                            },
                        };
                        const { default: __VLS_1042 } = __VLS_1038.slots;
                        let __VLS_1043;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_1044 = __VLS_asFunctionalComponent1(__VLS_1043, new __VLS_1043({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_1045 = __VLS_1044({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1044));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.export'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_1038;
                        var __VLS_1039;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)) {
                        let __VLS_1048;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_1049 = __VLS_asFunctionalComponent1(__VLS_1048, new __VLS_1048({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_1050 = __VLS_1049({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1049));
                        let __VLS_1053;
                        const __VLS_1054 = {
                            /** @type {typeof __VLS_1053.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_export(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.exportDocumentZip(row);
                                // @ts-ignore
                                [permissionPrecise, id, exportDocumentZip,];
                            },
                        };
                        const { default: __VLS_1055 } = __VLS_1051.slots;
                        let __VLS_1056;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_1057 = __VLS_asFunctionalComponent1(__VLS_1056, new __VLS_1056({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_1058 = __VLS_1057({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1057));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.export'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_1051;
                        var __VLS_1052;
                    }
                    if (__VLS_ctx.permissionPrecise.doc_delete(__VLS_ctx.id)) {
                        let __VLS_1061;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_1062 = __VLS_asFunctionalComponent1(__VLS_1061, new __VLS_1061({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_1063 = __VLS_1062({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1062));
                        let __VLS_1066;
                        const __VLS_1067 = {
                            /** @type {typeof __VLS_1066.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.knowledgeDetail?.type === 1 || __VLS_ctx.knowledgeDetail?.type === 2))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFilledPermission2(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_delete(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.deleteDocument(row);
                                // @ts-ignore
                                [permissionPrecise, id, deleteDocument,];
                            },
                        };
                        const { default: __VLS_1068 } = __VLS_1064.slots;
                        let __VLS_1069;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_1070 = __VLS_asFunctionalComponent1(__VLS_1069, new __VLS_1069({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_1071 = __VLS_1070({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_1070));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.delete'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_1064;
                        var __VLS_1065;
                    }
                    // @ts-ignore
                    [];
                    var __VLS_948;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_930;
            }
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_571;
}
// @ts-ignore
[];
var __VLS_218;
var __VLS_219;
// @ts-ignore
[];
var __VLS_3;
if (__VLS_ctx.multipleSelection.length !== 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mul-operation w-full flex" },
    });
    /** @type {__VLS_StyleScopedClasses['mul-operation']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)) {
        let __VLS_1074;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_1075 = __VLS_asFunctionalComponent1(__VLS_1074, new __VLS_1074({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_1076 = __VLS_1075({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1075));
        let __VLS_1079;
        const __VLS_1080 = {
            /** @type {typeof __VLS_1079.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.multipleSelection.length !== 0))
                    throw 0;
                if (!(__VLS_ctx.permissionPrecise.doc_vector(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.cancelTaskHandle(1);
                // @ts-ignore
                [permissionPrecise, id, multipleSelection, multipleSelection, cancelTaskHandle,];
            },
        };
        const { default: __VLS_1081 } = __VLS_1077.slots;
        (__VLS_ctx.$t('views.document.setting.cancelVectorization'));
        // @ts-ignore
        [$t,];
        var __VLS_1077;
        var __VLS_1078;
    }
    if (__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)) {
        let __VLS_1082;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_1083 = __VLS_asFunctionalComponent1(__VLS_1082, new __VLS_1082({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_1084 = __VLS_1083({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1083));
        let __VLS_1087;
        const __VLS_1088 = {
            /** @type {typeof __VLS_1087.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.multipleSelection.length !== 0))
                    throw 0;
                if (!(__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.cancelTaskHandle(2);
                // @ts-ignore
                [permissionPrecise, id, multipleSelection, cancelTaskHandle,];
            },
        };
        const { default: __VLS_1089 } = __VLS_1085.slots;
        (__VLS_ctx.$t('views.document.setting.cancelGenerate'));
        // @ts-ignore
        [$t,];
        var __VLS_1085;
        var __VLS_1086;
    }
    let __VLS_1090;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_1091 = __VLS_asFunctionalComponent1(__VLS_1090, new __VLS_1090({
        type: "info",
        ...{ class: "secondary ml-24" },
    }));
    const __VLS_1092 = __VLS_1091({
        type: "info",
        ...{ class: "secondary ml-24" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1091));
    /** @type {__VLS_StyleScopedClasses['secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
    const { default: __VLS_1095 } = __VLS_1093.slots;
    (__VLS_ctx.$t('common.selected'));
    (__VLS_ctx.multipleSelection.length);
    (__VLS_ctx.$t('views.document.items'));
    // @ts-ignore
    [$t, $t, multipleSelection,];
    var __VLS_1093;
    let __VLS_1096;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_1097 = __VLS_asFunctionalComponent1(__VLS_1096, new __VLS_1096({
        ...{ 'onClick': {} },
        ...{ class: "ml-16" },
        type: "primary",
        link: true,
    }));
    const __VLS_1098 = __VLS_1097({
        ...{ 'onClick': {} },
        ...{ class: "ml-16" },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_1097));
    let __VLS_1101;
    const __VLS_1102 = {
        /** @type {typeof __VLS_1101.click} */
        onClick: (__VLS_ctx.clearSelection),
    };
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    const { default: __VLS_1103 } = __VLS_1099.slots;
    (__VLS_ctx.$t('common.clear'));
    // @ts-ignore
    [$t, clearSelection,];
    var __VLS_1099;
    var __VLS_1100;
}
const __VLS_1104 = EmbeddingContentDialog || EmbeddingContentDialog;
// @ts-ignore
const __VLS_1105 = __VLS_asFunctionalComponent1(__VLS_1104, new __VLS_1104({
    ref: "embeddingContentDialogRef",
}));
const __VLS_1106 = __VLS_1105({
    ref: "embeddingContentDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_1105));
var __VLS_1109;
var __VLS_1107;
const __VLS_1111 = ImportDocumentDialog;
// @ts-ignore
const __VLS_1112 = __VLS_asFunctionalComponent1(__VLS_1111, new __VLS_1111({
    ...{ 'onRefresh': {} },
    ref: "ImportDocumentDialogRef",
    title: (__VLS_ctx.title),
}));
const __VLS_1113 = __VLS_1112({
    ...{ 'onRefresh': {} },
    ref: "ImportDocumentDialogRef",
    title: (__VLS_ctx.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_1112));
let __VLS_1116;
const __VLS_1117 = {
    /** @type {typeof __VLS_1116.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_1118;
var __VLS_1114;
var __VLS_1115;
const __VLS_1120 = SelectKnowledgeDialog;
// @ts-ignore
const __VLS_1121 = __VLS_asFunctionalComponent1(__VLS_1120, new __VLS_1120({
    ...{ 'onRefresh': {} },
    ref: "selectKnowledgeDialogRef",
    workspaceId: (__VLS_ctx.knowledgeDetail?.workspace_id),
}));
const __VLS_1122 = __VLS_1121({
    ...{ 'onRefresh': {} },
    ref: "selectKnowledgeDialogRef",
    workspaceId: (__VLS_ctx.knowledgeDetail?.workspace_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_1121));
let __VLS_1125;
const __VLS_1126 = {
    /** @type {typeof __VLS_1125.refresh} */
    onRefresh: (__VLS_ctx.refreshMigrate),
};
var __VLS_1127;
var __VLS_1123;
var __VLS_1124;
const __VLS_1129 = GenerateRelatedDialog;
// @ts-ignore
const __VLS_1130 = __VLS_asFunctionalComponent1(__VLS_1129, new __VLS_1129({
    ...{ 'onRefresh': {} },
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_1131 = __VLS_1130({
    ...{ 'onRefresh': {} },
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_1130));
let __VLS_1134;
const __VLS_1135 = {
    /** @type {typeof __VLS_1134.refresh} */
    onRefresh: (__VLS_ctx.getList),
};
var __VLS_1136;
var __VLS_1132;
var __VLS_1133;
const __VLS_1138 = TagDrawer;
// @ts-ignore
const __VLS_1139 = __VLS_asFunctionalComponent1(__VLS_1138, new __VLS_1138({
    ...{ 'onTagChanged': {} },
    ref: "tagDrawerRef",
}));
const __VLS_1140 = __VLS_1139({
    ...{ 'onTagChanged': {} },
    ref: "tagDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_1139));
let __VLS_1143;
const __VLS_1144 = {
    /** @type {typeof __VLS_1143.tagChanged} */
    onTagChanged: (__VLS_ctx.onTagChanged),
};
var __VLS_1145;
var __VLS_1141;
var __VLS_1142;
const __VLS_1147 = TagSettingDrawer;
// @ts-ignore
const __VLS_1148 = __VLS_asFunctionalComponent1(__VLS_1147, new __VLS_1147({
    ...{ 'onRefresh': {} },
    ref: "tagSettingDrawerRef",
}));
const __VLS_1149 = __VLS_1148({
    ...{ 'onRefresh': {} },
    ref: "tagSettingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_1148));
let __VLS_1152;
const __VLS_1153 = {
    /** @type {typeof __VLS_1152.refresh} */
    onRefresh: (() => {
        __VLS_ctx.onTagChanged();
        __VLS_ctx.getList();
    }),
};
var __VLS_1154;
var __VLS_1150;
var __VLS_1151;
const __VLS_1156 = AddTagDialog;
// @ts-ignore
const __VLS_1157 = __VLS_asFunctionalComponent1(__VLS_1156, new __VLS_1156({
    ...{ 'onAddTags': {} },
    ref: "addTagDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_1158 = __VLS_1157({
    ...{ 'onAddTags': {} },
    ref: "addTagDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_1157));
let __VLS_1161;
const __VLS_1162 = {
    /** @type {typeof __VLS_1161.addTags} */
    onAddTags: (__VLS_ctx.addTags),
};
var __VLS_1163;
var __VLS_1159;
var __VLS_1160;
const __VLS_1165 = ExecutionRecord || ExecutionRecord;
// @ts-ignore
const __VLS_1166 = __VLS_asFunctionalComponent1(__VLS_1165, new __VLS_1165({
    ref: "ListActionRef",
}));
const __VLS_1167 = __VLS_1166({
    ref: "ListActionRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_1166));
var __VLS_1170;
var __VLS_1168;
// @ts-ignore
var __VLS_231 = __VLS_230, __VLS_813 = __VLS_812, __VLS_1110 = __VLS_1109, __VLS_1119 = __VLS_1118, __VLS_1128 = __VLS_1127, __VLS_1137 = __VLS_1136, __VLS_1146 = __VLS_1145, __VLS_1155 = __VLS_1154, __VLS_1164 = __VLS_1163, __VLS_1171 = __VLS_1170;
// @ts-ignore
[knowledgeDetail, refresh, getList, getList, title, refreshMigrate, apiType, apiType, onTagChanged, onTagChanged, addTags,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
