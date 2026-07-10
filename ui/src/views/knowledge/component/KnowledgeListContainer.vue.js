/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, shallowRef, nextTick, computed, watch } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { cloneDeep } from 'lodash';
import CreateKnowledgeDialog from '@/views/knowledge/create-component/CreateKnowledgeDialog.vue';
import CreateWebKnowledgeDialog from '@/views/knowledge/create-component/CreateWebKnowledgeDialog.vue';
import CreateLarkKnowledgeDialog from '@/views/knowledge/create-component/CreateLarkKnowledgeDialog.vue';
import CreateWorkflowKnowledgeDialog from '@/views/knowledge/create-component/CreateWorkflowKnowledgeDialog.vue';
import SyncWebDialog from '@/views/knowledge/component/SyncWebDialog.vue';
import CreateFolderDialog from '@/components/folder-virtualized-tree/CreateFolderDialog.vue';
import MoveToDialog from '@/components/folder-virtualized-tree/MoveToDialog.vue';
import GenerateRelatedDialog from '@/components/generate-related-dialog/index.vue';
import AuthorizedWorkspace from '@/views/system-shared/AuthorizedWorkspaceDialog.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import TemplateStoreDialog from '@/views/knowledge/template-store/TemplateStoreDialog.vue';
import ResourceMappingDrawer from '@/components/resource_mapping/index.vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { numberFormat, i18n_name } from '@/utils/common';
import { dateFormat } from '@/utils/time';
import { SourceTypeEnum } from '@/enums/common';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
import useStore from '@/stores';
import { t } from '@/locales';
import ExportKnowledgeDialog from '@/views/knowledge/component/ExportKnowledgeDialog.vue';
const resourceMappingDrawerRef = ref();
const openResourceMappingDrawer = (knowledge) => {
    resourceMappingDrawerRef.value?.open('KNOWLEDGE', knowledge);
};
const router = useRouter();
const route = useRoute();
const { folder, user, knowledge } = useStore();
onBeforeRouteLeave((to, from) => {
    knowledge.setKnowledgeList([]);
});
const emit = defineEmits(['refreshFolder']);
const apiType = computed(() => {
    // WorkspaceNormalUserSharedIsshare。SystemSharedIsshared
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
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][apiType.value];
});
const isShared = computed(() => {
    return folder.currentFolder.id === 'share';
});
const isSystemShare = computed(() => {
    return apiType.value === 'systemShare';
});
const MoreFilledPermission = (item) => {
    return ((item.type === 1 && permissionPrecise.value.sync(item.id)) ||
        permissionPrecise.value.vector(item.id) ||
        permissionPrecise.value.generate(item.id) ||
        (permissionPrecise.value.edit(item.id) && apiType.value) === 'workspace' ||
        permissionPrecise.value.export(item.id) ||
        permissionPrecise.value.auth(item.id) ||
        permissionPrecise.value.delete(item.id) ||
        permissionPrecise.value.relate_map(item.id) ||
        isSystemShare.value);
};
const loading = ref(false);
const search_type = ref('name');
const search_form = ref({
    name: '',
    create_user: '',
});
const user_options = ref([]);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 30,
    total: 0,
});
// BatchActions
const isBatch = ref(false);
const multipleSelection = ref([]);
const checkAll = ref(false);
const isIndeterminate = computed(() => {
    return (multipleSelection.value.length > 0 &&
        multipleSelection.value.length < knowledge.knowledgeList.length);
});
function batchSelectedHandle(bool) {
    isBatch.value = bool;
    multipleSelection.value = [];
    checkAll.value = false;
}
const handleCheckAllChange = (val) => {
    let bool;
    if (isIndeterminate.value) {
        bool = true;
    }
    else {
        bool = val;
    }
    multipleSelection.value = bool ? knowledge.knowledgeList.map((v) => v.id) : [];
    checkAll.value = bool;
};
const handleCheckedChatChange = (value) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === knowledge.knowledgeList.length;
};
const checkboxChange = (data) => {
    const index = multipleSelection.value.indexOf(data?.id);
    if (index === -1) {
        multipleSelection.value.push(data?.id);
    }
    else {
        multipleSelection.value.splice(index, 1);
    }
    checkAll.value = multipleSelection.value.length === knowledge.knowledgeList.length;
};
function deleteMulKnowledge() {
    MsgConfirm(`${t('views.document.delete.confirmTitle1')} ${multipleSelection.value.length} ${t('views.knowledge.delete.confirmTitle2')}`, t('views.paragraph.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .delMulKnowledge(multipleSelection.value, loading)
            .then(() => {
            batchSelectedHandle(false);
            paginationConfig.current_page = 1;
            knowledge.setKnowledgeList([]);
            getList();
            MsgSuccess(t('views.document.delete.successMessage'));
        });
    })
        .catch(() => { });
}
function toDocument(item) {
    if (isBatch.value) {
        const index = multipleSelection.value.indexOf(item?.id);
        if (index === -1) {
            multipleSelection.value.push(item?.id);
        }
        else {
            multipleSelection.value.splice(index, 1);
        }
        checkAll.value = multipleSelection.value.length === knowledge.knowledgeList.length;
        return;
    }
    router.push({
        path: `/knowledge/${item.id}/${folder.currentFolder.id ? (folder.currentFolder.id !== 'share' ? item.folder_id : 'share') : 'shared'}/${item.type}/document`,
    });
}
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(item) {
    ResourceAuthorizationDrawerRef.value.open(item.id);
}
const MoveToDialogRef = ref();
function openMoveToDialog(data) {
    let obj;
    if (isBatch.value) {
        obj = {
            id_list: multipleSelection.value,
        };
    }
    else {
        // Only 2 parameters are sufficient
        obj = {
            id: data.id,
            folder_id: data.folder,
        };
    }
    MoveToDialogRef.value?.open(obj);
}
function refreshKnowledgeList(row) {
    if (row) {
        // Not rootDirectoryOnly thenRemove
        if (folder.currentFolder?.parent_id) {
            const list = cloneDeep(knowledge.knowledgeList);
            const index = list.findIndex((v) => v.id === row.id);
            list.splice(index, 1);
            knowledge.setKnowledgeList(list);
        }
    }
    else {
        batchSelectedHandle(false);
        paginationConfig.current_page = 1;
        knowledge.setKnowledgeList([]);
        getList();
    }
}
const CreateKnowledgeDialogRef = ref();
const currentCreateDialog = shallowRef(null);
function openCreateDialog(data) {
    currentCreateDialog.value = data;
    nextTick(() => {
        CreateKnowledgeDialogRef.value.open(folder.currentFolder);
    });
}
function reEmbeddingKnowledge(row) {
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .putReEmbeddingKnowledge(row.id)
        .then(() => {
        MsgSuccess(t('common.submitSuccess'));
    });
}
const SyncWebDialogRef = ref();
function syncKnowledge(row) {
    SyncWebDialogRef.value.open(row.id);
}
const search_type_change = () => {
    search_form.value = { name: '', create_user: '' };
};
const exportKnowledgeDialogRef = ref();
const exportKnowledgeBundle = (item) => {
    const exportKnowledge = (with_source_file) => {
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .exportKnowledgeBundle(item.name, item.id, with_source_file, loading)
            .then(() => {
            MsgSuccess(t('common.exportSuccess'));
        });
    };
    exportKnowledgeDialogRef.value?.open(exportKnowledge);
};
const importKnowledgeUploadRef = ref();
function importKnowledgeBundle(file) {
    const formData = new FormData();
    formData.append('file', file.raw);
    formData.append('folder_id', folder.currentFolder.id || user.getWorkspaceId());
    importKnowledgeUploadRef.value.clearFiles();
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .importKnowledgeBundle(formData, loading)
        .then(async (res) => {
        if (res?.data) {
            const knowledgeId = res.data.knowledge_id;
            const knowledgeType = res.data.type;
            const folderId = folder.currentFolder.id;
            await user.profile();
            router.push({
                path: `/knowledge/${knowledgeId}/${folderId || 'shared'}/${knowledgeType}/document`,
                query: { imported: 'true' },
            });
        }
    })
        .catch((e) => {
        if (e.code === 400) {
            MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
                cancelButtonText: t('common.confirm'),
                confirmButtonText: t('common.professional'),
            }).then(() => {
                window.open('https://maxkb.cn/pricing.html', '_blank');
            });
        }
    });
}
const GenerateRelatedDialogRef = ref();
function openGenerateDialog(row) {
    if (GenerateRelatedDialogRef.value) {
        GenerateRelatedDialogRef.value.open([], 'knowledge', row);
    }
}
const exportKnowledge = (item) => {
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .exportKnowledge(item.name, item.id, loading)
        .then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
};
const exportZipKnowledge = (item) => {
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .exportZipKnowledge(item.name, item.id, loading)
        .then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
};
function deleteKnowledge(row) {
    MsgConfirm(`${t('views.knowledge.delete.confirmTitle')}${row.name} ?`, row.resource_count > 0
        ? t('views.knowledge.delete.resourceCountMessage', row.resource_count)
        : '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .delKnowledge(row.id, loading)
            .then(() => {
            const list = cloneDeep(knowledge.knowledgeList);
            const index = list.findIndex((v) => v.id === row.id);
            list.splice(index, 1);
            knowledge.setKnowledgeList(list);
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => { });
}
const AuthorizedWorkspaceDialogRef = ref();
function openAuthorizedWorkspaceDialog(row) {
    if (AuthorizedWorkspaceDialogRef.value) {
        AuthorizedWorkspaceDialogRef.value.open(row);
    }
}
// FolderRelated
const CreateFolderDialogRef = ref();
function openCreateFolder() {
    CreateFolderDialogRef.value.open(SourceTypeEnum.KNOWLEDGE, folder.currentFolder.id);
}
watch(() => folder.currentFolder, (newValue) => {
    if (newValue && newValue.id && !isSystemShare.value) {
        batchSelectedHandle(false);
        paginationConfig.current_page = 1;
        knowledge.setKnowledgeList([]);
        getList();
    }
}, { deep: true, immediate: true });
function getList() {
    const params = {
        folder_id: folder.currentFolder?.id || user.getWorkspaceId(),
        scope: apiType.value === 'systemShare' ? 'SHARED' : 'WORKSPACE',
    };
    if (search_form.value[search_type.value]) {
        params[search_type.value] = search_form.value[search_type.value];
    }
    loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
        .getKnowledgeListPage(paginationConfig, params, loading)
        .then((res) => {
        paginationConfig.total = res.data?.total;
        knowledge.setKnowledgeList([...knowledge.knowledgeList, ...res.data.records]);
    });
}
function searchHandle() {
    paginationConfig.current_page = 1;
    knowledge.setKnowledgeList([]);
    getList();
}
function refreshFolder() {
    emit('refreshFolder');
}
const templateStoreDialogRef = ref();
function openTemplateStoreDialog() {
    templateStoreDialogRef.value?.open(folder.currentFolder.id);
}
function getUserList(query) {
    let workspaceId = user.getWorkspaceId();
    if (isSystemShare.value) {
        workspaceId = '';
    }
    const actualWorkspaceId = workspaceId || (query ? { nick_name: query } : '');
    const actualQuery = workspaceId ? (query ? { nick_name: query } : '') : undefined;
    loadSharedApi({ type: 'workspace', isShared: isShared.value, systemType: apiType.value })
        .getAllMemberList(actualWorkspaceId, actualQuery, loading)
        .then((res) => {
        user_options.value = res.data;
    });
}
onMounted(() => {
    if (apiType.value !== 'workspace') {
        folder.setCurrentFolder({
            id: '',
        });
        getList();
    }
});
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
/** @ts-ignore @type { | typeof __VLS_components.ContentContainer | typeof __VLS_components.ContentContainer} */
ContentContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    var __VLS_7 = {};
}
{
    const { search: __VLS_9 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "complex-search" },
    });
    /** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
    let __VLS_10;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_15;
    const __VLS_16 = {
        /** @type {typeof __VLS_15.change} */
        onChange: (__VLS_ctx.search_type_change),
    };
    /** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
    const { default: __VLS_17 } = __VLS_13.slots;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }));
    const __VLS_20 = __VLS_19({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        label: (__VLS_ctx.$t('common.name')),
        value: "name",
    }));
    const __VLS_25 = __VLS_24({
        label: (__VLS_ctx.$t('common.name')),
        value: "name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    // @ts-ignore
    [search_type, search_type_change, $t, $t,];
    var __VLS_13;
    var __VLS_14;
    if (__VLS_ctx.search_type === 'name') {
        let __VLS_28;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }));
        const __VLS_30 = __VLS_29({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        let __VLS_33;
        const __VLS_34 = {
            /** @type {typeof __VLS_33.change} */
            onChange: (__VLS_ctx.searchHandle),
        };
        var __VLS_31;
        var __VLS_32;
    }
    else if (__VLS_ctx.search_type === 'create_user') {
        let __VLS_35;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }));
        const __VLS_37 = __VLS_36({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        let __VLS_40;
        const __VLS_41 = {
            /** @type {typeof __VLS_40.change} */
            onChange: (__VLS_ctx.searchHandle),
        };
        const { default: __VLS_42 } = __VLS_38.slots;
        for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
            let __VLS_43;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }));
            const __VLS_45 = __VLS_44({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_44));
            // @ts-ignore
            [search_type, search_type, $t, search_form, search_form, searchHandle, searchHandle, getUserList, user_options,];
        }
        // @ts-ignore
        [];
        var __VLS_38;
        var __VLS_39;
    }
    if (!__VLS_ctx.isShared && (__VLS_ctx.permissionPrecise.batchMove() || __VLS_ctx.permissionPrecise.batchDelete())) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        if (__VLS_ctx.isBatch === false) {
            let __VLS_48;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
                ...{ 'onClick': {} },
            }));
            const __VLS_50 = __VLS_49({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            let __VLS_53;
            const __VLS_54 = {
                /** @type {typeof __VLS_53.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.isShared && (__VLS_ctx.permissionPrecise.batchMove() || __VLS_ctx.permissionPrecise.batchDelete())))
                        throw 0;
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.batchSelectedHandle(true);
                    // @ts-ignore
                    [isShared, permissionPrecise, permissionPrecise, isBatch, batchSelectedHandle,];
                },
            };
            const { default: __VLS_55 } = __VLS_51.slots;
            let __VLS_56;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }));
            const __VLS_58 = __VLS_57({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.paragraph.setting.batchSelected'));
            // @ts-ignore
            [$t,];
            var __VLS_51;
            var __VLS_52;
        }
        if (__VLS_ctx.isBatch === true) {
            let __VLS_61;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
                ...{ 'onClick': {} },
            }));
            const __VLS_63 = __VLS_62({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
            let __VLS_66;
            const __VLS_67 = {
                /** @type {typeof __VLS_66.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.isShared && (__VLS_ctx.permissionPrecise.batchMove() || __VLS_ctx.permissionPrecise.batchDelete())))
                        throw 0;
                    if (!(__VLS_ctx.isBatch === true))
                        throw 0;
                    return __VLS_ctx.batchSelectedHandle(false);
                    // @ts-ignore
                    [isBatch, batchSelectedHandle,];
                },
            };
            const { default: __VLS_68 } = __VLS_64.slots;
            let __VLS_69;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }));
            const __VLS_71 = __VLS_70({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_70));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
            // @ts-ignore
            [$t,];
            var __VLS_64;
            var __VLS_65;
        }
    }
    if (__VLS_ctx.isBatch === false) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        if (!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()) {
            let __VLS_74;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
                ...{ 'onClick': {} },
                ...{ class: "ml-8" },
            }));
            const __VLS_76 = __VLS_75({
                ...{ 'onClick': {} },
                ...{ class: "ml-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_75));
            let __VLS_79;
            const __VLS_80 = {
                /** @type {typeof __VLS_79.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    if (!(!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()))
                        throw 0;
                    return __VLS_ctx.openTemplateStoreDialog();
                    // @ts-ignore
                    [isShared, permissionPrecise, isBatch, openTemplateStoreDialog,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_81 } = __VLS_77.slots;
            let __VLS_82;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
                iconName: "app-template-center",
                ...{ class: "mr-4" },
            }));
            const __VLS_84 = __VLS_83({
                iconName: "app-template-center",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_83));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('workflow.setting.templateCenter'));
            // @ts-ignore
            [$t,];
            var __VLS_77;
            var __VLS_78;
        }
        if (!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()) {
            let __VLS_87;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
            elDropdown;
            // @ts-ignore
            const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
                trigger: "click",
            }));
            const __VLS_89 = __VLS_88({
                trigger: "click",
            }, ...__VLS_functionalComponentArgsRest(__VLS_88));
            const { default: __VLS_92 } = __VLS_90.slots;
            let __VLS_93;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
                type: "primary",
                ...{ class: "ml-8" },
            }));
            const __VLS_95 = __VLS_94({
                type: "primary",
                ...{ class: "ml-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_94));
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_98 } = __VLS_96.slots;
            (__VLS_ctx.$t('common.create'));
            let __VLS_99;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
                ...{ class: "el-icon--right" },
            }));
            const __VLS_101 = __VLS_100({
                ...{ class: "el-icon--right" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_100));
            /** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
            const { default: __VLS_104 } = __VLS_102.slots;
            let __VLS_105;
            /** @ts-ignore @type { | typeof __VLS_components.arrowDown | typeof __VLS_components.ArrowDown | typeof __VLS_components['arrow-down']} */
            arrowDown;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
            const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
            // @ts-ignore
            [$t, isShared, permissionPrecise,];
            var __VLS_102;
            // @ts-ignore
            [];
            var __VLS_96;
            {
                const { dropdown: __VLS_110 } = __VLS_90.slots;
                let __VLS_111;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                elDropdownMenu;
                // @ts-ignore
                const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
                    ...{ class: "create-dropdown" },
                }));
                const __VLS_113 = __VLS_112({
                    ...{ class: "create-dropdown" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_112));
                /** @type {__VLS_StyleScopedClasses['create-dropdown']} */ ;
                const { default: __VLS_116 } = __VLS_114.slots;
                let __VLS_117;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
                    ...{ 'onClick': {} },
                }));
                const __VLS_119 = __VLS_118({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_118));
                let __VLS_122;
                const __VLS_123 = {
                    /** @type {typeof __VLS_122.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isBatch === false))
                            throw 0;
                        if (!(!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()))
                            throw 0;
                        return __VLS_ctx.openCreateDialog(CreateKnowledgeDialog);
                        // @ts-ignore
                        [openCreateDialog,];
                    },
                };
                const { default: __VLS_124 } = __VLS_120.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                let __VLS_125;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
                    ...{ class: "avatar-blue mt-4" },
                    shape: "square",
                    size: (32),
                }));
                const __VLS_127 = __VLS_126({
                    ...{ class: "avatar-blue mt-4" },
                    shape: "square",
                    size: (32),
                }, ...__VLS_functionalComponentArgsRest(__VLS_126));
                /** @type {__VLS_StyleScopedClasses['avatar-blue']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                const { default: __VLS_130 } = __VLS_128.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/knowledge/icon_document.svg",
                    ...{ style: {} },
                    alt: "",
                });
                // @ts-ignore
                [];
                var __VLS_128;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('views.knowledge.knowledgeType.generalKnowledge'));
                let __VLS_131;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_133 = __VLS_132({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_132));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                const { default: __VLS_136 } = __VLS_134.slots;
                (__VLS_ctx.$t('views.knowledge.knowledgeType.generalInfo'));
                // @ts-ignore
                [$t, $t,];
                var __VLS_134;
                // @ts-ignore
                [];
                var __VLS_120;
                var __VLS_121;
                let __VLS_137;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
                    ...{ 'onClick': {} },
                }));
                const __VLS_139 = __VLS_138({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_138));
                let __VLS_142;
                const __VLS_143 = {
                    /** @type {typeof __VLS_142.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isBatch === false))
                            throw 0;
                        if (!(!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()))
                            throw 0;
                        return __VLS_ctx.openCreateDialog(CreateWebKnowledgeDialog);
                        // @ts-ignore
                        [openCreateDialog,];
                    },
                };
                const { default: __VLS_144 } = __VLS_140.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                let __VLS_145;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
                    ...{ class: "avatar-purple mt-4" },
                    shape: "square",
                    size: (32),
                }));
                const __VLS_147 = __VLS_146({
                    ...{ class: "avatar-purple mt-4" },
                    shape: "square",
                    size: (32),
                }, ...__VLS_functionalComponentArgsRest(__VLS_146));
                /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                const { default: __VLS_150 } = __VLS_148.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/knowledge/icon_web.svg",
                    ...{ style: {} },
                    alt: "",
                });
                // @ts-ignore
                [];
                var __VLS_148;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('views.knowledge.knowledgeType.webKnowledge'));
                let __VLS_151;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_153 = __VLS_152({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_152));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                const { default: __VLS_156 } = __VLS_154.slots;
                (__VLS_ctx.$t('views.knowledge.knowledgeType.webInfo'));
                // @ts-ignore
                [$t, $t,];
                var __VLS_154;
                // @ts-ignore
                [];
                var __VLS_140;
                var __VLS_141;
                if (__VLS_ctx.user.isPE() || __VLS_ctx.user.isEE()) {
                    let __VLS_157;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_159 = __VLS_158({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
                    let __VLS_162;
                    const __VLS_163 = {
                        /** @type {typeof __VLS_162.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.isBatch === false))
                                throw 0;
                            if (!(!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()))
                                throw 0;
                            if (!(__VLS_ctx.user.isPE() || __VLS_ctx.user.isEE()))
                                throw 0;
                            return __VLS_ctx.openCreateDialog(CreateLarkKnowledgeDialog);
                            // @ts-ignore
                            [openCreateDialog, user, user,];
                        },
                    };
                    const { default: __VLS_164 } = __VLS_160.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                    let __VLS_165;
                    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                    elAvatar;
                    // @ts-ignore
                    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
                        ...{ class: "avatar-purple mt-4" },
                        shape: "square",
                        size: (32),
                        ...{ style: {} },
                    }));
                    const __VLS_167 = __VLS_166({
                        ...{ class: "avatar-purple mt-4" },
                        shape: "square",
                        size: (32),
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
                    /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
                    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                    const { default: __VLS_170 } = __VLS_168.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: "@/assets/knowledge/logo_lark.svg",
                        alt: "",
                    });
                    // @ts-ignore
                    [];
                    var __VLS_168;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "pre-wrap ml-8" },
                    });
                    /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "lighter" },
                    });
                    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                    (__VLS_ctx.$t('views.knowledge.knowledgeType.larkKnowledge'));
                    let __VLS_171;
                    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                    elText;
                    // @ts-ignore
                    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
                        type: "info",
                        size: "small",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_173 = __VLS_172({
                        type: "info",
                        size: "small",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    const { default: __VLS_176 } = __VLS_174.slots;
                    (__VLS_ctx.$t('views.knowledge.knowledgeType.larkInfo'));
                    // @ts-ignore
                    [$t, $t,];
                    var __VLS_174;
                    // @ts-ignore
                    [];
                    var __VLS_160;
                    var __VLS_161;
                }
                let __VLS_177;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
                    ...{ 'onClick': {} },
                }));
                const __VLS_179 = __VLS_178({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_178));
                let __VLS_182;
                const __VLS_183 = {
                    /** @type {typeof __VLS_182.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isBatch === false))
                            throw 0;
                        if (!(!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()))
                            throw 0;
                        return __VLS_ctx.openCreateDialog(CreateWorkflowKnowledgeDialog);
                        // @ts-ignore
                        [openCreateDialog,];
                    },
                };
                const { default: __VLS_184 } = __VLS_180.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                let __VLS_185;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
                    ...{ class: "avatar-purple mt-4" },
                    shape: "square",
                    size: (32),
                }));
                const __VLS_187 = __VLS_186({
                    ...{ class: "avatar-purple mt-4" },
                    shape: "square",
                    size: (32),
                }, ...__VLS_functionalComponentArgsRest(__VLS_186));
                /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                const { default: __VLS_190 } = __VLS_188.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/workflow/logo_workflow.svg",
                    ...{ style: {} },
                    alt: "",
                });
                // @ts-ignore
                [];
                var __VLS_188;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('views.knowledge.knowledgeType.workflowKnowledge'));
                let __VLS_191;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_193 = __VLS_192({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_192));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                const { default: __VLS_196 } = __VLS_194.slots;
                (__VLS_ctx.$t('views.knowledge.knowledgeType.workflowInfo'));
                // @ts-ignore
                [$t, $t,];
                var __VLS_194;
                // @ts-ignore
                [];
                var __VLS_180;
                var __VLS_181;
                let __VLS_197;
                /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
                elUpload;
                // @ts-ignore
                const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
                    ref: "importKnowledgeUploadRef",
                    fileList: ([]),
                    action: "#",
                    multiple: true,
                    autoUpload: (false),
                    showFileList: (false),
                    limit: (1),
                    accept: ".zip",
                    onChange: ((file) => __VLS_ctx.importKnowledgeBundle(file)),
                    ...{ class: "import-button" },
                }));
                const __VLS_199 = __VLS_198({
                    ref: "importKnowledgeUploadRef",
                    fileList: ([]),
                    action: "#",
                    multiple: true,
                    autoUpload: (false),
                    showFileList: (false),
                    limit: (1),
                    accept: ".zip",
                    onChange: ((file) => __VLS_ctx.importKnowledgeBundle(file)),
                    ...{ class: "import-button" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_198));
                var __VLS_202;
                /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
                const { default: __VLS_204 } = __VLS_200.slots;
                let __VLS_205;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({}));
                const __VLS_207 = __VLS_206({}, ...__VLS_functionalComponentArgsRest(__VLS_206));
                const { default: __VLS_210 } = __VLS_208.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center w-full" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                let __VLS_211;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }));
                const __VLS_213 = __VLS_212({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_212));
                const { default: __VLS_216 } = __VLS_214.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/icon_import.svg",
                    alt: "",
                });
                // @ts-ignore
                [importKnowledgeBundle,];
                var __VLS_214;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('common.importCreate'));
                // @ts-ignore
                [$t,];
                var __VLS_208;
                // @ts-ignore
                [];
                var __VLS_200;
                if (__VLS_ctx.apiType === 'workspace') {
                    let __VLS_217;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
                        ...{ 'onClick': {} },
                        divided: true,
                    }));
                    const __VLS_219 = __VLS_218({
                        ...{ 'onClick': {} },
                        divided: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
                    let __VLS_222;
                    const __VLS_223 = {
                        /** @type {typeof __VLS_222.click} */
                        onClick: (__VLS_ctx.openCreateFolder),
                    };
                    const { default: __VLS_224 } = __VLS_220.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex align-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                    let __VLS_225;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
                        iconName: "app-folder",
                        ...{ style: {} },
                    }));
                    const __VLS_227 = __VLS_226({
                        iconName: "app-folder",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "pre-wrap ml-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "lighter" },
                    });
                    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                    (__VLS_ctx.$t('components.folder.addFolder'));
                    // @ts-ignore
                    [$t, apiType, openCreateFolder,];
                    var __VLS_220;
                    var __VLS_221;
                }
                // @ts-ignore
                [];
                var __VLS_114;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_90;
        }
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, modifiers: { fullscreen: true, lock: true, }, value: (__VLS_ctx.paginationConfig.current_page === 1 && __VLS_ctx.loading) }, null, null);
let __VLS_230;
/** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
InfiniteScroll;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.knowledge.knowledgeList.length),
    total: (__VLS_ctx.paginationConfig.total),
    page_size: (__VLS_ctx.paginationConfig.page_size),
    current_page: (__VLS_ctx.paginationConfig.current_page),
    loading: (__VLS_ctx.loading),
}));
const __VLS_232 = __VLS_231({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.knowledge.knowledgeList.length),
    total: (__VLS_ctx.paginationConfig.total),
    page_size: (__VLS_ctx.paginationConfig.page_size),
    current_page: (__VLS_ctx.paginationConfig.current_page),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
let __VLS_235;
const __VLS_236 = {
    /** @type {typeof __VLS_235.load} */
    onLoad: (__VLS_ctx.getList),
};
const { default: __VLS_237 } = __VLS_233.slots;
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
elCheckboxGroup;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.multipleSelection),
}));
const __VLS_240 = __VLS_239({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.multipleSelection),
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
let __VLS_243;
const __VLS_244 = {
    /** @type {typeof __VLS_243.change} */
    onChange: (__VLS_ctx.handleCheckedChatChange),
};
const { default: __VLS_245 } = __VLS_241.slots;
if (__VLS_ctx.knowledge.knowledgeList.length > 0) {
    let __VLS_246;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent1(__VLS_246, new __VLS_246({
        gutter: (15),
        ...{ class: "w-full" },
    }));
    const __VLS_248 = __VLS_247({
        gutter: (15),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_251 } = __VLS_249.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.knowledge.knowledgeList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_252;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_253 = __VLS_asFunctionalComponent1(__VLS_252, new __VLS_252({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            ...{ class: "mb-16" },
        }));
        const __VLS_254 = __VLS_253({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            ...{ class: "mb-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_253));
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        const { default: __VLS_257 } = __VLS_255.slots;
        let __VLS_258;
        /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
        CardBox;
        // @ts-ignore
        const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
            ...{ 'onClick': {} },
            title: (item.name),
            description: (item.desc),
            ...{ class: "cursor" },
            disabled: (__VLS_ctx.isBatch),
            ...{ class: ({
                    'border-active': __VLS_ctx.multipleSelection.includes(item.id),
                }) },
        }));
        const __VLS_260 = __VLS_259({
            ...{ 'onClick': {} },
            title: (item.name),
            description: (item.desc),
            ...{ class: "cursor" },
            disabled: (__VLS_ctx.isBatch),
            ...{ class: ({
                    'border-active': __VLS_ctx.multipleSelection.includes(item.id),
                }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_259));
        let __VLS_263;
        const __VLS_264 = {
            /** @type {typeof __VLS_263.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                    throw 0;
                return __VLS_ctx.toDocument(item);
                // @ts-ignore
                [isBatch, vLoading, paginationConfig, paginationConfig, paginationConfig, paginationConfig, loading, loading, knowledge, knowledge, knowledge, getList, multipleSelection, multipleSelection, handleCheckedChatChange, toDocument,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-active']} */ ;
        const { default: __VLS_265 } = __VLS_261.slots;
        {
            const { icon: __VLS_266 } = __VLS_261.slots;
            let __VLS_267;
            /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
            KnowledgeIcon;
            // @ts-ignore
            const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
                type: (item.type),
            }));
            const __VLS_269 = __VLS_268({
                type: (item.type),
            }, ...__VLS_functionalComponentArgsRest(__VLS_268));
            // @ts-ignore
            [];
        }
        {
            const { subTitle: __VLS_272 } = __VLS_261.slots;
            let __VLS_273;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_274 = __VLS_asFunctionalComponent1(__VLS_273, new __VLS_273({
                ...{ class: "color-secondary lighter flex align-center" },
                size: "small",
            }));
            const __VLS_275 = __VLS_274({
                ...{ class: "color-secondary lighter flex align-center" },
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_274));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            const { default: __VLS_278 } = __VLS_276.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                title: (__VLS_ctx.i18n_name(item.nick_name)),
                ...{ class: "ellipsis" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (__VLS_ctx.i18n_name(item.nick_name));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-4 mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('common.createdIn'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.dateFormat(item.create_time));
            // @ts-ignore
            [$t, i18n_name, i18n_name, dateFormat,];
            var __VLS_276;
            // @ts-ignore
            [];
        }
        {
            const { tag: __VLS_279 } = __VLS_261.slots;
            if (__VLS_ctx.isBatch) {
                let __VLS_280;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                elCheckbox;
                // @ts-ignore
                const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
                    ...{ 'onChange': {} },
                    value: (item.id),
                }));
                const __VLS_282 = __VLS_281({
                    ...{ 'onChange': {} },
                    value: (item.id),
                }, ...__VLS_functionalComponentArgsRest(__VLS_281));
                let __VLS_285;
                const __VLS_286 = {
                    /** @type {typeof __VLS_285.change} */
                    onChange: (...[$event]) => {
                        if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                            throw 0;
                        if (!(__VLS_ctx.isBatch))
                            throw 0;
                        return __VLS_ctx.checkboxChange(item);
                        // @ts-ignore
                        [isBatch, checkboxChange,];
                    },
                };
                var __VLS_283;
                var __VLS_284;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                if (__VLS_ctx.isShared || __VLS_ctx.isSystemShare) {
                    let __VLS_287;
                    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
                    elTag;
                    // @ts-ignore
                    const __VLS_288 = __VLS_asFunctionalComponent1(__VLS_287, new __VLS_287({
                        size: "small",
                        type: "info",
                        ...{ class: "info-tag" },
                    }));
                    const __VLS_289 = __VLS_288({
                        size: "small",
                        type: "info",
                        ...{ class: "info-tag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_288));
                    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
                    const { default: __VLS_292 } = __VLS_290.slots;
                    (__VLS_ctx.$t('views.shared.title'));
                    // @ts-ignore
                    [$t, isShared, isSystemShare,];
                    var __VLS_290;
                }
            }
            // @ts-ignore
            [];
        }
        {
            const { footer: __VLS_293 } = __VLS_261.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "footer-content flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['footer-content']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "bold mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['bold']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (item?.document_count || 0);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('views.knowledge.document_count'));
            let __VLS_294;
            /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
            elDivider;
            // @ts-ignore
            const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
                direction: "vertical",
            }));
            const __VLS_296 = __VLS_295({
                direction: "vertical",
            }, ...__VLS_functionalComponentArgsRest(__VLS_295));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "bold mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['bold']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.numberFormat(item?.char_length) || 0);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('common.character'));
            // @ts-ignore
            [$t, $t, numberFormat,];
        }
        {
            const { mouseEnter: __VLS_299 } = __VLS_261.slots;
            if (!__VLS_ctx.isShared) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ onClick: () => { } },
                });
                let __VLS_300;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
                elDropdown;
                // @ts-ignore
                const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
                    trigger: "click",
                }));
                const __VLS_302 = __VLS_301({
                    trigger: "click",
                }, ...__VLS_functionalComponentArgsRest(__VLS_301));
                const { default: __VLS_305 } = __VLS_303.slots;
                if (__VLS_ctx.MoreFilledPermission(item)) {
                    let __VLS_306;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
                        ...{ 'onClick': {} },
                        text: true,
                    }));
                    const __VLS_308 = __VLS_307({
                        ...{ 'onClick': {} },
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
                    let __VLS_311;
                    const __VLS_312 = {
                        /** @type {typeof __VLS_311.click} */
                        onClick: () => { },
                    };
                    const { default: __VLS_313 } = __VLS_309.slots;
                    let __VLS_314;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_315 = __VLS_asFunctionalComponent1(__VLS_314, new __VLS_314({
                        iconName: "app-more",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_316 = __VLS_315({
                        iconName: "app-more",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_315));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    // @ts-ignore
                    [isShared, MoreFilledPermission,];
                    var __VLS_309;
                    var __VLS_310;
                }
                {
                    const { dropdown: __VLS_319 } = __VLS_303.slots;
                    let __VLS_320;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                    elDropdownMenu;
                    // @ts-ignore
                    const __VLS_321 = __VLS_asFunctionalComponent1(__VLS_320, new __VLS_320({}));
                    const __VLS_322 = __VLS_321({}, ...__VLS_functionalComponentArgsRest(__VLS_321));
                    const { default: __VLS_325 } = __VLS_323.slots;
                    if (item.type === 1 && __VLS_ctx.permissionPrecise.sync(item.id)) {
                        let __VLS_326;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_328 = __VLS_327({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_327));
                        let __VLS_331;
                        const __VLS_332 = {
                            /** @type {typeof __VLS_331.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(item.type === 1 && __VLS_ctx.permissionPrecise.sync(item.id)))
                                    throw 0;
                                return __VLS_ctx.syncKnowledge(item);
                                // @ts-ignore
                                [permissionPrecise, syncKnowledge,];
                            },
                        };
                        const { default: __VLS_333 } = __VLS_329.slots;
                        let __VLS_334;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
                            iconName: "app-sync",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_336 = __VLS_335({
                            iconName: "app-sync",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_335));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.knowledge.setting.sync'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_329;
                        var __VLS_330;
                    }
                    if (__VLS_ctx.permissionPrecise.vector(item.id)) {
                        let __VLS_339;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_341 = __VLS_340({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_340));
                        let __VLS_344;
                        const __VLS_345 = {
                            /** @type {typeof __VLS_344.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.vector(item.id)))
                                    throw 0;
                                return __VLS_ctx.reEmbeddingKnowledge(item);
                                // @ts-ignore
                                [permissionPrecise, reEmbeddingKnowledge,];
                            },
                        };
                        const { default: __VLS_346 } = __VLS_342.slots;
                        let __VLS_347;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_348 = __VLS_asFunctionalComponent1(__VLS_347, new __VLS_347({
                            iconName: "app-vectorization",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_349 = __VLS_348({
                            iconName: "app-vectorization",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_348));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.knowledge.setting.vectorization'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_342;
                        var __VLS_343;
                    }
                    if (__VLS_ctx.permissionPrecise.generate(item.id)) {
                        let __VLS_352;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_353 = __VLS_asFunctionalComponent1(__VLS_352, new __VLS_352({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_354 = __VLS_353({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_353));
                        let __VLS_357;
                        const __VLS_358 = {
                            /** @type {typeof __VLS_357.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.generate(item.id)))
                                    throw 0;
                                return __VLS_ctx.openGenerateDialog(item);
                                // @ts-ignore
                                [permissionPrecise, openGenerateDialog,];
                            },
                        };
                        const { default: __VLS_359 } = __VLS_355.slots;
                        let __VLS_360;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_361 = __VLS_asFunctionalComponent1(__VLS_360, new __VLS_360({
                            iconName: "app-generate-question",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_362 = __VLS_361({
                            iconName: "app-generate-question",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_361));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.generateQuestion.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_355;
                        var __VLS_356;
                    }
                    if (__VLS_ctx.isSystemShare) {
                        let __VLS_365;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_366 = __VLS_asFunctionalComponent1(__VLS_365, new __VLS_365({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_367 = __VLS_366({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_366));
                        let __VLS_370;
                        const __VLS_371 = {
                            /** @type {typeof __VLS_370.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.isSystemShare))
                                    throw 0;
                                return __VLS_ctx.openAuthorizedWorkspaceDialog(item);
                                // @ts-ignore
                                [isSystemShare, openAuthorizedWorkspaceDialog,];
                            },
                        };
                        const { default: __VLS_372 } = __VLS_368.slots;
                        let __VLS_373;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_374 = __VLS_asFunctionalComponent1(__VLS_373, new __VLS_373({
                            iconName: "app-lock",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_375 = __VLS_374({
                            iconName: "app-lock",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_374));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.shared.authorized_workspace'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_368;
                        var __VLS_369;
                    }
                    if (__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.auth(item.id)) {
                        let __VLS_378;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_379 = __VLS_asFunctionalComponent1(__VLS_378, new __VLS_378({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_380 = __VLS_379({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_379));
                        let __VLS_383;
                        const __VLS_384 = {
                            /** @type {typeof __VLS_383.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.auth(item.id)))
                                    throw 0;
                                return __VLS_ctx.openAuthorization(item);
                                // @ts-ignore
                                [permissionPrecise, apiType, openAuthorization,];
                            },
                        };
                        const { default: __VLS_385 } = __VLS_381.slots;
                        let __VLS_386;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_387 = __VLS_asFunctionalComponent1(__VLS_386, new __VLS_386({
                            iconName: "app-resource-authorization",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_388 = __VLS_387({
                            iconName: "app-resource-authorization",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_387));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_381;
                        var __VLS_382;
                    }
                    if (__VLS_ctx.permissionPrecise.relate_map(item.id)) {
                        let __VLS_391;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_392 = __VLS_asFunctionalComponent1(__VLS_391, new __VLS_391({
                            ...{ 'onClick': {} },
                            text: true,
                        }));
                        const __VLS_393 = __VLS_392({
                            ...{ 'onClick': {} },
                            text: true,
                        }, ...__VLS_functionalComponentArgsRest(__VLS_392));
                        let __VLS_396;
                        const __VLS_397 = {
                            /** @type {typeof __VLS_396.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.relate_map(item.id)))
                                    throw 0;
                                return __VLS_ctx.openResourceMappingDrawer(item);
                                // @ts-ignore
                                [permissionPrecise, openResourceMappingDrawer,];
                            },
                        };
                        const { default: __VLS_398 } = __VLS_394.slots;
                        let __VLS_399;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_400 = __VLS_asFunctionalComponent1(__VLS_399, new __VLS_399({
                            iconName: "app-resource-mapping",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_401 = __VLS_400({
                            iconName: "app-resource-mapping",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_400));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.system.resourceMapping.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_394;
                        var __VLS_395;
                    }
                    if (__VLS_ctx.permissionPrecise.edit(item.id) && __VLS_ctx.apiType === 'workspace') {
                        let __VLS_404;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_405 = __VLS_asFunctionalComponent1(__VLS_404, new __VLS_404({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_406 = __VLS_405({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_405));
                        let __VLS_409;
                        const __VLS_410 = {
                            /** @type {typeof __VLS_409.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.edit(item.id) && __VLS_ctx.apiType === 'workspace'))
                                    throw 0;
                                return __VLS_ctx.openMoveToDialog(item);
                                // @ts-ignore
                                [permissionPrecise, apiType, openMoveToDialog,];
                            },
                        };
                        const { default: __VLS_411 } = __VLS_407.slots;
                        let __VLS_412;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_413 = __VLS_asFunctionalComponent1(__VLS_412, new __VLS_412({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_414 = __VLS_413({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_413));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.moveTo'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_407;
                        var __VLS_408;
                    }
                    if (__VLS_ctx.permissionPrecise.edit(item.id)) {
                        let __VLS_417;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_418 = __VLS_asFunctionalComponent1(__VLS_417, new __VLS_417({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_419 = __VLS_418({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_418));
                        let __VLS_422;
                        const __VLS_423 = {
                            /** @type {typeof __VLS_422.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                return;
                                __VLS_ctx.router.push({
                                    path: `/knowledge/${item.id}/${__VLS_ctx.folder.currentFolder.id || 'shared'}/${item.type}/setting`,
                                });
                                // @ts-ignore
                                [permissionPrecise, router, folder,];
                            },
                        };
                        const { default: __VLS_424 } = __VLS_420.slots;
                        let __VLS_425;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_426 = __VLS_asFunctionalComponent1(__VLS_425, new __VLS_425({
                            iconName: "app-setting",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_427 = __VLS_426({
                            iconName: "app-setting",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_426));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.setting'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_420;
                        var __VLS_421;
                    }
                    if (__VLS_ctx.permissionPrecise.export(item.id)) {
                        let __VLS_430;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_431 = __VLS_asFunctionalComponent1(__VLS_430, new __VLS_430({
                            ...{ 'onClick': {} },
                            divided: true,
                        }));
                        const __VLS_432 = __VLS_431({
                            ...{ 'onClick': {} },
                            divided: true,
                        }, ...__VLS_functionalComponentArgsRest(__VLS_431));
                        let __VLS_435;
                        const __VLS_436 = {
                            /** @type {typeof __VLS_435.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.export(item.id)))
                                    throw 0;
                                return __VLS_ctx.exportKnowledge(item);
                                // @ts-ignore
                                [permissionPrecise, exportKnowledge,];
                            },
                        };
                        const { default: __VLS_437 } = __VLS_433.slots;
                        let __VLS_438;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_439 = __VLS_asFunctionalComponent1(__VLS_438, new __VLS_438({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_440 = __VLS_439({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_439));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.setting.exportDocument'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_433;
                        var __VLS_434;
                    }
                    if (__VLS_ctx.permissionPrecise.export(item.id)) {
                        let __VLS_443;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_444 = __VLS_asFunctionalComponent1(__VLS_443, new __VLS_443({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_445 = __VLS_444({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_444));
                        let __VLS_448;
                        const __VLS_449 = {
                            /** @type {typeof __VLS_448.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.export(item.id)))
                                    throw 0;
                                return __VLS_ctx.exportZipKnowledge(item);
                                // @ts-ignore
                                [permissionPrecise, exportZipKnowledge,];
                            },
                        };
                        const { default: __VLS_450 } = __VLS_446.slots;
                        let __VLS_451;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_452 = __VLS_asFunctionalComponent1(__VLS_451, new __VLS_451({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_453 = __VLS_452({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_452));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.setting.exportDocument'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_446;
                        var __VLS_447;
                    }
                    if (__VLS_ctx.permissionPrecise.export(item.id)) {
                        let __VLS_456;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_457 = __VLS_asFunctionalComponent1(__VLS_456, new __VLS_456({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_458 = __VLS_457({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_457));
                        let __VLS_461;
                        const __VLS_462 = {
                            /** @type {typeof __VLS_461.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.export(item.id)))
                                    throw 0;
                                return __VLS_ctx.exportKnowledgeBundle(item);
                                // @ts-ignore
                                [permissionPrecise, exportKnowledgeBundle,];
                            },
                        };
                        const { default: __VLS_463 } = __VLS_459.slots;
                        let __VLS_464;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_465 = __VLS_asFunctionalComponent1(__VLS_464, new __VLS_464({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_466 = __VLS_465({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_465));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.document.setting.exportKnowledge'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_459;
                        var __VLS_460;
                    }
                    if (__VLS_ctx.permissionPrecise.delete(item.id)) {
                        let __VLS_469;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_470 = __VLS_asFunctionalComponent1(__VLS_469, new __VLS_469({
                            ...{ 'onClick': {} },
                            divided: true,
                            type: "danger",
                        }));
                        const __VLS_471 = __VLS_470({
                            ...{ 'onClick': {} },
                            divided: true,
                            type: "danger",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_470));
                        let __VLS_474;
                        const __VLS_475 = {
                            /** @type {typeof __VLS_474.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.knowledge.knowledgeList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.delete(item.id)))
                                    throw 0;
                                return __VLS_ctx.deleteKnowledge(item);
                                // @ts-ignore
                                [permissionPrecise, deleteKnowledge,];
                            },
                        };
                        const { default: __VLS_476 } = __VLS_472.slots;
                        let __VLS_477;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_478 = __VLS_asFunctionalComponent1(__VLS_477, new __VLS_477({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_479 = __VLS_478({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_478));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.delete'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_472;
                        var __VLS_473;
                    }
                    // @ts-ignore
                    [];
                    var __VLS_323;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_303;
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_261;
        var __VLS_262;
        // @ts-ignore
        [];
        var __VLS_255;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_249;
}
else {
    let __VLS_482;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_483 = __VLS_asFunctionalComponent1(__VLS_482, new __VLS_482({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_484 = __VLS_483({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_483));
}
// @ts-ignore
[$t,];
var __VLS_241;
var __VLS_242;
// @ts-ignore
[];
var __VLS_233;
var __VLS_234;
if (__VLS_ctx.isBatch) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mul-operation border-t w-full flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['mul-operation']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_487;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_488 = __VLS_asFunctionalComponent1(__VLS_487, new __VLS_487({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }));
    const __VLS_489 = __VLS_488({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_488));
    let __VLS_492;
    const __VLS_493 = {
        /** @type {typeof __VLS_492.change} */
        onChange: (__VLS_ctx.handleCheckAllChange),
    };
    const { default: __VLS_494 } = __VLS_490.slots;
    (__VLS_ctx.$t('common.allCheck'));
    // @ts-ignore
    [$t, isBatch, checkAll, isIndeterminate, handleCheckAllChange,];
    var __VLS_490;
    var __VLS_491;
    if (__VLS_ctx.permissionPrecise.batchMove()) {
        let __VLS_495;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_496 = __VLS_asFunctionalComponent1(__VLS_495, new __VLS_495({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_497 = __VLS_496({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_496));
        let __VLS_500;
        const __VLS_501 = {
            /** @type {typeof __VLS_500.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isBatch))
                    throw 0;
                if (!(__VLS_ctx.permissionPrecise.batchMove()))
                    throw 0;
                return __VLS_ctx.openMoveToDialog();
                // @ts-ignore
                [permissionPrecise, multipleSelection, openMoveToDialog,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
        const { default: __VLS_502 } = __VLS_498.slots;
        (__VLS_ctx.$t('common.moveTo'));
        // @ts-ignore
        [$t,];
        var __VLS_498;
        var __VLS_499;
    }
    if (__VLS_ctx.permissionPrecise.batchDelete()) {
        let __VLS_503;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_504 = __VLS_asFunctionalComponent1(__VLS_503, new __VLS_503({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_505 = __VLS_504({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_504));
        let __VLS_508;
        const __VLS_509 = {
            /** @type {typeof __VLS_508.click} */
            onClick: (__VLS_ctx.deleteMulKnowledge),
        };
        const { default: __VLS_510 } = __VLS_506.slots;
        (__VLS_ctx.$t('common.delete'));
        // @ts-ignore
        [$t, permissionPrecise, multipleSelection, deleteMulKnowledge,];
        var __VLS_506;
        var __VLS_507;
    }
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
    let __VLS_511;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_512 = __VLS_asFunctionalComponent1(__VLS_511, new __VLS_511({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_513 = __VLS_512({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_512));
    let __VLS_516;
    const __VLS_517 = {
        /** @type {typeof __VLS_516.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isBatch))
                throw 0;
            return __VLS_ctx.batchSelectedHandle(false);
            // @ts-ignore
            [$t, $t, batchSelectedHandle, paginationConfig, multipleSelection,];
        },
    };
    const { default: __VLS_518 } = __VLS_514.slots;
    (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
    // @ts-ignore
    [$t,];
    var __VLS_514;
    var __VLS_515;
}
// @ts-ignore
[];
var __VLS_3;
if (!__VLS_ctx.isShared) {
    const __VLS_519 = (__VLS_ctx.currentCreateDialog);
    // @ts-ignore
    const __VLS_520 = __VLS_asFunctionalComponent1(__VLS_519, new __VLS_519({
        ref: "CreateKnowledgeDialogRef",
    }));
    const __VLS_521 = __VLS_520({
        ref: "CreateKnowledgeDialogRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_520));
    var __VLS_524;
    var __VLS_522;
}
if (!__VLS_ctx.isShared) {
    const __VLS_526 = CreateFolderDialog;
    // @ts-ignore
    const __VLS_527 = __VLS_asFunctionalComponent1(__VLS_526, new __VLS_526({
        ...{ 'onRefresh': {} },
        ref: "CreateFolderDialogRef",
    }));
    const __VLS_528 = __VLS_527({
        ...{ 'onRefresh': {} },
        ref: "CreateFolderDialogRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_527));
    let __VLS_531;
    const __VLS_532 = {
        /** @type {typeof __VLS_531.refresh} */
        onRefresh: (__VLS_ctx.refreshFolder),
    };
    var __VLS_533;
    var __VLS_529;
    var __VLS_530;
}
const __VLS_535 = GenerateRelatedDialog;
// @ts-ignore
const __VLS_536 = __VLS_asFunctionalComponent1(__VLS_535, new __VLS_535({
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_537 = __VLS_536({
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_536));
var __VLS_540;
var __VLS_538;
if (!__VLS_ctx.isShared) {
    const __VLS_542 = SyncWebDialog;
    // @ts-ignore
    const __VLS_543 = __VLS_asFunctionalComponent1(__VLS_542, new __VLS_542({
        ref: "SyncWebDialogRef",
    }));
    const __VLS_544 = __VLS_543({
        ref: "SyncWebDialogRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_543));
    var __VLS_547;
    var __VLS_545;
}
if (__VLS_ctx.isSystemShare) {
    const __VLS_549 = AuthorizedWorkspace || AuthorizedWorkspace;
    // @ts-ignore
    const __VLS_550 = __VLS_asFunctionalComponent1(__VLS_549, new __VLS_549({
        ref: "AuthorizedWorkspaceDialogRef",
    }));
    const __VLS_551 = __VLS_550({
        ref: "AuthorizedWorkspaceDialogRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_550));
    var __VLS_554;
    var __VLS_552;
}
if (__VLS_ctx.apiType === 'workspace') {
    const __VLS_556 = MoveToDialog;
    // @ts-ignore
    const __VLS_557 = __VLS_asFunctionalComponent1(__VLS_556, new __VLS_556({
        ...{ 'onRefresh': {} },
        ref: "MoveToDialogRef",
        source: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
    }));
    const __VLS_558 = __VLS_557({
        ...{ 'onRefresh': {} },
        ref: "MoveToDialogRef",
        source: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
    }, ...__VLS_functionalComponentArgsRest(__VLS_557));
    let __VLS_561;
    const __VLS_562 = {
        /** @type {typeof __VLS_561.refresh} */
        onRefresh: (__VLS_ctx.refreshKnowledgeList),
    };
    var __VLS_563;
    var __VLS_559;
    var __VLS_560;
}
if (__VLS_ctx.apiType === 'workspace') {
    const __VLS_565 = ResourceAuthorizationDrawer;
    // @ts-ignore
    const __VLS_566 = __VLS_asFunctionalComponent1(__VLS_565, new __VLS_565({
        type: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
        ref: "ResourceAuthorizationDrawerRef",
    }));
    const __VLS_567 = __VLS_566({
        type: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
        ref: "ResourceAuthorizationDrawerRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_566));
    var __VLS_570;
    var __VLS_568;
}
const __VLS_572 = TemplateStoreDialog;
// @ts-ignore
const __VLS_573 = __VLS_asFunctionalComponent1(__VLS_572, new __VLS_572({
    ...{ 'onRefresh': {} },
    ref: "templateStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_574 = __VLS_573({
    ...{ 'onRefresh': {} },
    ref: "templateStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_573));
let __VLS_577;
const __VLS_578 = {
    /** @type {typeof __VLS_577.refresh} */
    onRefresh: (__VLS_ctx.getList),
};
var __VLS_579;
var __VLS_575;
var __VLS_576;
const __VLS_581 = ResourceMappingDrawer || ResourceMappingDrawer;
// @ts-ignore
const __VLS_582 = __VLS_asFunctionalComponent1(__VLS_581, new __VLS_581({
    ref: "resourceMappingDrawerRef",
}));
const __VLS_583 = __VLS_582({
    ref: "resourceMappingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_582));
var __VLS_586;
var __VLS_584;
const __VLS_588 = ExportKnowledgeDialog;
// @ts-ignore
const __VLS_589 = __VLS_asFunctionalComponent1(__VLS_588, new __VLS_588({
    ref: "exportKnowledgeDialogRef",
}));
const __VLS_590 = __VLS_589({
    ref: "exportKnowledgeDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_589));
var __VLS_593;
var __VLS_591;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_203 = __VLS_202, __VLS_525 = __VLS_524, __VLS_534 = __VLS_533, __VLS_541 = __VLS_540, __VLS_548 = __VLS_547, __VLS_555 = __VLS_554, __VLS_564 = __VLS_563, __VLS_571 = __VLS_570, __VLS_580 = __VLS_579, __VLS_587 = __VLS_586, __VLS_594 = __VLS_593;
// @ts-ignore
[isShared, isShared, isShared, apiType, apiType, apiType, apiType, getList, isSystemShare, currentCreateDialog, refreshFolder, SourceTypeEnum, SourceTypeEnum, refreshKnowledgeList,];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
});
const __VLS_export = {};
export default {};
