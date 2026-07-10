/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import CreateApplicationDialog from '@/views/application/component/CreateApplicationDialog.vue';
import CreateFolderDialog from '@/components/folder-virtualized-tree/CreateFolderDialog.vue';
import CopyApplicationDialog from '@/views/application/component/CopyApplicationDialog.vue';
import BatchClearStrategyDialog from '@/views/application/component/BatchClearStrategyDialog.vue';
import MoveToDialog from '@/components/folder-virtualized-tree/MoveToDialog.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import ResourceTriggerDrawer from '@/views/trigger/ResourceTriggerDrawer.vue';
import TemplateStoreDialog from '@/views/application/template-store/TemplateStoreDialog.vue';
import ApplicationApi from '@/api/application/application';
import WorkspaceApi from '@/api/workspace/workspace';
import { MsgSuccess, MsgConfirm, MsgError } from '@/utils/message';
import { i18n_name, resetUrl } from '@/utils/common';
import { isWorkFlow } from '@/utils/application';
import { dateFormat } from '@/utils/time';
import { SourceTypeEnum } from '@/enums/common';
import permissionMap from '@/permission';
import { hasPermission } from '@/utils/permission';
import { ComplexPermission } from '@/utils/permission/type';
import { EditionConst, PermissionConst, RoleConst } from '@/utils/permission/data';
import ResourceMappingDrawer from '@/components/resource_mapping/index.vue';
import useStore from '@/stores';
import { t } from '@/locales';
const router = useRouter();
const apiType = computed(() => {
    return 'workspace';
});
const permissionPrecise = computed(() => {
    return permissionMap['application'][apiType.value];
});
const { folder, application, user } = useStore();
const loading = ref(false);
const search_type = ref('name');
const search_form = ref({
    name: '',
    create_user: '',
    publish_status: undefined,
});
const user_options = ref([]);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 30,
    total: 0,
});
const folderList = ref([]);
const applicationList = ref([]);
const CopyApplicationDialogRef = ref();
const BatchClearStrategyDialogRef = ref();
// BatchActions
const isBatch = ref(false);
const multipleSelection = ref([]);
const checkAll = ref(false);
const isIndeterminate = computed(() => {
    return (multipleSelection.value.length > 0 &&
        multipleSelection.value.length < applicationList.value.length);
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
    multipleSelection.value = bool ? applicationList.value.map((v) => v.id) : [];
    checkAll.value = bool;
};
const handleCheckedChatChange = (value) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === applicationList.value.length;
};
const checkboxChange = (data) => {
    const index = multipleSelection.value.indexOf(data?.id);
    if (index === -1) {
        multipleSelection.value.push(data?.id);
    }
    else {
        multipleSelection.value.splice(index, 1);
    }
    checkAll.value = multipleSelection.value.length === applicationList.value.length;
};
function deleteMulApplication() {
    MsgConfirm(`${t('views.document.delete.confirmTitle1')} ${multipleSelection.value.length} ${t('views.application.delete.confirmTitle2')}`, t('views.paragraph.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        ApplicationApi.delMulApplication(multipleSelection.value, loading).then(() => {
            batchSelectedHandle(false);
            paginationConfig.current_page = 1;
            applicationList.value = [];
            getList();
            MsgSuccess(t('views.document.delete.successMessage'));
        });
    })
        .catch(() => { });
}
function openBatchClearStrategyDialog() {
    BatchClearStrategyDialogRef.value?.open([...multipleSelection.value]);
}
const resourceTriggerDrawerRef = ref();
const openTriggerDrawer = (data) => {
    resourceTriggerDrawerRef.value?.open(data);
};
const resourceMappingDrawerRef = ref();
const openResourceMappingDrawer = (data) => {
    resourceMappingDrawerRef.value?.open('APPLICATION', data);
};
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
function refreshApplicationList(row) {
    if (row) {
        // Not rootDirectoryOnly thenRemove
        if (folder.currentFolder?.parent_id) {
            const index = applicationList.value.findIndex((v) => v.id === row.id);
            applicationList.value.splice(index, 1);
        }
    }
    else {
        batchSelectedHandle(false);
        paginationConfig.current_page = 1;
        applicationList.value = [];
        getList();
    }
}
const goApp = (event, item) => {
    if (isBatch.value) {
        const index = multipleSelection.value.indexOf(item?.id);
        if (index === -1) {
            multipleSelection.value.push(item?.id);
        }
        else {
            multipleSelection.value.splice(index, 1);
        }
        checkAll.value = multipleSelection.value.length === applicationList.value.length;
        return;
    }
    if (event?.ctrlKey) {
        event?.preventDefault();
        event.stopPropagation();
        const newUrl = router.resolve({
            path: get_route(item),
        }).href;
        window.open(newUrl);
    }
    else {
        router.push({ path: get_route(item) });
    }
};
const get_route = (item) => {
    if (hasPermission([
        new ComplexPermission([RoleConst.USER], [PermissionConst.APPLICATION.getApplicationWorkspaceResourcePermission(item.id)], [], 'AND'),
        RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
        PermissionConst.APPLICATION_OVERVIEW_READ.getWorkspacePermissionWorkspaceManageRole,
        PermissionConst.APPLICATION_OVERVIEW_READ.getApplicationWorkspaceResourcePermission(item.id),
    ], 'OR')) {
        return `/application/workspace/${item.id}/${item.type}/overview`;
    }
    else if (hasPermission([
        new ComplexPermission([RoleConst.USER], [PermissionConst.APPLICATION.getApplicationWorkspaceResourcePermission(item.id)], [], 'AND'),
        RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
        PermissionConst.APPLICATION_EDIT.getWorkspacePermissionWorkspaceManageRole,
        PermissionConst.APPLICATION_EDIT.getApplicationWorkspaceResourcePermission(item.id),
    ], 'OR')) {
        if (item.type == 'WORK_FLOW') {
            return `/application/workspace/${item.id}/workflow`;
        }
        else {
            return `/application/workspace/${item.id}/${item.type}/setting`;
        }
    }
    else if (hasPermission([
        new ComplexPermission([RoleConst.USER], [PermissionConst.APPLICATION.getApplicationWorkspaceResourcePermission(item.id)], [EditionConst.IS_EE, EditionConst.IS_PE], 'AND'),
        new ComplexPermission([RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], [PermissionConst.APPLICATION_ACCESS_READ.getWorkspacePermissionWorkspaceManageRole], [EditionConst.IS_EE, EditionConst.IS_PE], 'OR'),
        new ComplexPermission([], [
            PermissionConst.APPLICATION_ACCESS_READ.getApplicationWorkspaceResourcePermission(item.id),
        ], [EditionConst.IS_EE, EditionConst.IS_PE], 'OR'),
    ], 'OR')) {
        return `/application/workspace/${item.id}/${item.type}/access`;
    }
    else if (hasPermission([
        new ComplexPermission([RoleConst.USER], [PermissionConst.APPLICATION.getApplicationWorkspaceResourcePermission(item.id)], [EditionConst.IS_EE, EditionConst.IS_PE], 'AND'),
        new ComplexPermission([RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], [PermissionConst.APPLICATION_CHAT_USER_READ.getWorkspacePermissionWorkspaceManageRole], [EditionConst.IS_EE, EditionConst.IS_PE], 'OR'),
        new ComplexPermission([], [
            PermissionConst.APPLICATION_CHAT_USER_READ.getApplicationWorkspaceResourcePermission(item.id),
        ], [EditionConst.IS_EE, EditionConst.IS_PE], 'OR'),
    ], 'OR')) {
        return `/application/workspace/${item.id}/${item.type}/chat-user`;
    }
    else if (hasPermission([
        new ComplexPermission([RoleConst.USER], [PermissionConst.APPLICATION.getApplicationWorkspaceResourcePermission(item.id)], [], 'AND'),
        PermissionConst.APPLICATION_CHAT_LOG_READ.getWorkspacePermissionWorkspaceManageRole,
        PermissionConst.APPLICATION_CHAT_LOG_READ.getApplicationWorkspaceResourcePermission(item.id),
    ], 'OR')) {
        return `/application//workspace${item.id}/${item.type}/chat-log`;
    }
    else
        return `/application/`;
};
const CreateApplicationDialogRef = ref();
function openCreateDialog(type) {
    CreateApplicationDialogRef.value.open(folder.currentFolder?.id || 'default', type);
}
const search_type_change = () => {
    search_form.value = { name: '', create_user: '' };
};
function toChat(row) {
    const api = row.type == 'WORK_FLOW'
        ? (id) => ApplicationApi.getApplicationDetail(id)
        : (id) => Promise.resolve({ data: row });
    api(row.id).then((ok) => {
        let aips = ok.data?.work_flow?.nodes
            ?.filter((v) => v.id === 'base-node')
            .map((v) => {
            return v.properties.api_input_field_list
                ? v.properties.api_input_field_list.map((v) => {
                    return {
                        name: v.variable,
                        value: v.default_value,
                    };
                })
                : v.properties.input_field_list
                    ? v.properties.input_field_list
                        .filter((v) => v.assignment_method === 'api_input')
                        .map((v) => {
                        return {
                            name: v.variable,
                            value: v.default_value,
                        };
                    })
                    : [];
        })
            .reduce((x, y) => [...x, ...y]);
        aips = aips ? aips : [];
        const apiParams = mapToUrlParams(aips) ? '?' + mapToUrlParams(aips) : '';
        ApplicationApi.getAccessToken(row.id, loading).then((res) => {
            const newUrl = application.location + res?.data?.access_token + apiParams;
            window.open(newUrl);
        });
    });
}
function mapToUrlParams(map) {
    const params = new URLSearchParams();
    map.forEach((item) => {
        params.append(encodeURIComponent(item.name), encodeURIComponent(item.value));
    });
    return params.toString(); // Return URL QueryString
}
function copyApplication(row) {
    ApplicationApi.getApplicationDetail(row.id, loading).then((res) => {
        if (res?.data) {
            CopyApplicationDialogRef.value.open({ ...res.data, model_id: res.data.model }, folder.currentFolder?.id || 'default');
        }
    });
}
function settingApplication(event, row) {
    if (isWorkFlow(row.type)) {
        if (event?.ctrlKey) {
            event?.preventDefault();
            event.stopPropagation();
            const newUrl = router.resolve({
                path: `/application/workspace/${row.id}/workflow`,
            }).href;
            window.open(newUrl);
        }
        else {
            router.push({ path: `/application/workspace/${row.id}/workflow` });
        }
    }
    else {
        router.push({ path: `/application/workspace/${row.id}/${row.type}/setting` });
    }
}
function deleteApplication(row) {
    MsgConfirm(`${t('views.application.delete.confirmTitle')}${row.name} ?`, row.resource_count > 0
        ? t('views.application.delete.resourceCountMessage', row.resource_count)
        : '', {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        ApplicationApi.delApplication(row.id, loading).then(() => {
            const index = applicationList.value.findIndex((v) => v.id === row.id);
            applicationList.value.splice(index, 1);
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => { });
}
const exportApplication = (application) => {
    ApplicationApi.exportApplication(application.id, application.name, loading).catch((e) => {
        if (e.response.status !== 403) {
            e.response.data.text().then((res) => {
                MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
            });
        }
    });
};
const elUploadRef = ref();
const importApplication = (file) => {
    const formData = new FormData();
    formData.append('file', file.raw, file.name);
    elUploadRef.value.clearFiles();
    ApplicationApi.importApplication(folder.currentFolder.id, formData, loading)
        .then(async (res) => {
        if (res?.data) {
            applicationList.value = [];
            user.profile();
        }
    })
        .then(() => {
        getList();
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
};
// FolderRelated
const CreateFolderDialogRef = ref();
function openCreateFolder() {
    CreateFolderDialogRef.value.open(SourceTypeEnum.APPLICATION, folder.currentFolder.id);
}
function getFolder(bool) {
    const params = {};
    folder
        .asyncGetFolder(SourceTypeEnum.APPLICATION, params, apiType.value, loading)
        .then((res) => {
        folderList.value = res.data;
        if (bool) {
            // InitializeRefresh
            folder.setCurrentFolder(res.data?.[0] || {});
        }
        getList();
    });
}
function folderClickHandle(row) {
    if (row.id === folder.currentFolder?.id) {
        return;
    }
    batchSelectedHandle(false);
    folder.setCurrentFolder(row);
    paginationConfig.current_page = 1;
    applicationList.value = [];
    getList();
}
function refreshFolder() {
    paginationConfig.current_page = 1;
    applicationList.value = [];
    getFolder();
}
function searchHandle() {
    paginationConfig.current_page = 1;
    applicationList.value = [];
    getList();
}
const templateStoreDialogRef = ref();
function openTemplateStoreDialog() {
    templateStoreDialogRef.value?.open(folder.currentFolder.id);
}
function getList() {
    const params = {
        folder_id: folder.currentFolder?.id || 'default',
    };
    if (search_form.value[search_type.value]) {
        params[search_type.value] = search_form.value[search_type.value];
    }
    ApplicationApi.getApplication(paginationConfig, params, loading).then((res) => {
        paginationConfig.total = res.data.total;
        applicationList.value = [...applicationList.value, ...res.data.records];
    });
}
function getUserList(query) {
    WorkspaceApi.getAllMemberList(user.getWorkspaceId(), query ? { nick_name: query } : '', loading).then((res) => {
        user_options.value = res.data;
    });
}
onMounted(() => {
    getFolder(folder.currentFolder?.id ? false : true);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.LayoutContainer | typeof __VLS_components.LayoutContainer} */
LayoutContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    showCollapse: true,
    resizable: true,
    ...{ class: "application-manage" },
}));
const __VLS_2 = __VLS_1({
    showCollapse: true,
    resizable: true,
    ...{ class: "application-manage" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['application-manage']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { left: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "p-12-16 pb-0 mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    (__VLS_ctx.$t('views.application.title'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.FolderVirtualizedTree} */
    FolderVirtualizedTree;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onHandleNodeClick': {} },
        ...{ 'onRefreshTree': {} },
        source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        draggable: (true),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onHandleNodeClick': {} },
        ...{ 'onRefreshTree': {} },
        source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        draggable: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.handleNodeClick} */
        onHandleNodeClick: (__VLS_ctx.folderClickHandle),
    };
    const __VLS_15 = {
        /** @type {typeof __VLS_13.refreshTree} */
        onRefreshTree: (__VLS_ctx.refreshFolder),
    };
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [$t, SourceTypeEnum, folderList, folder, folderClickHandle, refreshFolder,];
}
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.ContentContainer | typeof __VLS_components.ContentContainer} */
ContentContainer;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
{
    const { header: __VLS_22 } = __VLS_19.slots;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.FolderBreadcrumb} */
    FolderBreadcrumb;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
        folderList: (__VLS_ctx.folderList),
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
        folderList: (__VLS_ctx.folderList),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    const __VLS_29 = {
        /** @type {typeof __VLS_28.click} */
        onClick: (__VLS_ctx.folderClickHandle),
    };
    var __VLS_26;
    var __VLS_27;
    // @ts-ignore
    [folderList, folderClickHandle,];
}
{
    const { search: __VLS_30 } = __VLS_19.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between complex-search" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    const __VLS_37 = {
        /** @type {typeof __VLS_36.change} */
        onChange: (__VLS_ctx.search_type_change),
    };
    /** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
    const { default: __VLS_38 } = __VLS_34.slots;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }));
    const __VLS_41 = __VLS_40({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        label: (__VLS_ctx.$t('common.name')),
        value: "name",
    }));
    const __VLS_46 = __VLS_45({
        label: (__VLS_ctx.$t('common.name')),
        value: "name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        label: (__VLS_ctx.$t('views.application.publishStatus')),
        value: "publish_status",
    }));
    const __VLS_51 = __VLS_50({
        label: (__VLS_ctx.$t('views.application.publishStatus')),
        value: "publish_status",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    // @ts-ignore
    [$t, $t, $t, search_type, search_type_change,];
    var __VLS_34;
    var __VLS_35;
    if (__VLS_ctx.search_type === 'name') {
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }));
        const __VLS_56 = __VLS_55({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        let __VLS_59;
        const __VLS_60 = {
            /** @type {typeof __VLS_59.change} */
            onChange: (__VLS_ctx.searchHandle),
        };
        var __VLS_57;
        var __VLS_58;
    }
    else if (__VLS_ctx.search_type === 'create_user') {
        let __VLS_61;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_66;
        const __VLS_67 = {
            /** @type {typeof __VLS_66.change} */
            onChange: (__VLS_ctx.searchHandle),
        };
        const { default: __VLS_68 } = __VLS_64.slots;
        for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
            let __VLS_69;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }));
            const __VLS_71 = __VLS_70({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_70));
            // @ts-ignore
            [$t, search_type, search_type, search_form, search_form, searchHandle, searchHandle, getUserList, user_options,];
        }
        // @ts-ignore
        [];
        var __VLS_64;
        var __VLS_65;
    }
    else if (__VLS_ctx.search_type === 'publish_status') {
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.publish_status),
            filterable: true,
            clearable: true,
            ...{ style: {} },
        }));
        const __VLS_76 = __VLS_75({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.publish_status),
            filterable: true,
            clearable: true,
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        let __VLS_79;
        const __VLS_80 = {
            /** @type {typeof __VLS_79.change} */
            onChange: (__VLS_ctx.searchHandle),
        };
        const { default: __VLS_81 } = __VLS_77.slots;
        let __VLS_82;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
            label: (__VLS_ctx.$t('common.status.published')),
            value: "published",
        }));
        const __VLS_84 = __VLS_83({
            label: (__VLS_ctx.$t('common.status.published')),
            value: "published",
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        let __VLS_87;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
            label: (__VLS_ctx.$t('common.status.unpublished')),
            value: "unpublished",
        }));
        const __VLS_89 = __VLS_88({
            label: (__VLS_ctx.$t('common.status.unpublished')),
            value: "unpublished",
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        // @ts-ignore
        [$t, $t, search_type, search_form, searchHandle,];
        var __VLS_77;
        var __VLS_78;
    }
    if (__VLS_ctx.permissionPrecise.batchDelete() ||
        __VLS_ctx.permissionPrecise.batchMove() ||
        __VLS_ctx.permissionPrecise.batchCleanStrategy()) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        if (__VLS_ctx.isBatch === false) {
            let __VLS_92;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
                ...{ 'onClick': {} },
            }));
            const __VLS_94 = __VLS_93({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_93));
            let __VLS_97;
            const __VLS_98 = {
                /** @type {typeof __VLS_97.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.permissionPrecise.batchDelete() ||
                        __VLS_ctx.permissionPrecise.batchMove() ||
                        __VLS_ctx.permissionPrecise.batchCleanStrategy()))
                        throw 0;
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.batchSelectedHandle(true);
                    // @ts-ignore
                    [permissionPrecise, permissionPrecise, permissionPrecise, isBatch, batchSelectedHandle,];
                },
            };
            const { default: __VLS_99 } = __VLS_95.slots;
            let __VLS_100;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }));
            const __VLS_102 = __VLS_101({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.paragraph.setting.batchSelected'));
            // @ts-ignore
            [$t,];
            var __VLS_95;
            var __VLS_96;
        }
        if (__VLS_ctx.isBatch === true) {
            let __VLS_105;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
                ...{ 'onClick': {} },
            }));
            const __VLS_107 = __VLS_106({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_106));
            let __VLS_110;
            const __VLS_111 = {
                /** @type {typeof __VLS_110.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.permissionPrecise.batchDelete() ||
                        __VLS_ctx.permissionPrecise.batchMove() ||
                        __VLS_ctx.permissionPrecise.batchCleanStrategy()))
                        throw 0;
                    if (!(__VLS_ctx.isBatch === true))
                        throw 0;
                    return __VLS_ctx.batchSelectedHandle(false);
                    // @ts-ignore
                    [isBatch, batchSelectedHandle,];
                },
            };
            const { default: __VLS_112 } = __VLS_108.slots;
            let __VLS_113;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }));
            const __VLS_115 = __VLS_114({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
            // @ts-ignore
            [$t,];
            var __VLS_108;
            var __VLS_109;
        }
    }
    if (__VLS_ctx.isBatch === false) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        if (__VLS_ctx.permissionPrecise.create()) {
            let __VLS_118;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
                ...{ 'onClick': {} },
                ...{ class: "ml-8" },
            }));
            const __VLS_120 = __VLS_119({
                ...{ 'onClick': {} },
                ...{ class: "ml-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_119));
            let __VLS_123;
            const __VLS_124 = {
                /** @type {typeof __VLS_123.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    if (!(__VLS_ctx.permissionPrecise.create()))
                        throw 0;
                    return __VLS_ctx.openTemplateStoreDialog();
                    // @ts-ignore
                    [permissionPrecise, isBatch, openTemplateStoreDialog,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_125 } = __VLS_121.slots;
            let __VLS_126;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
                iconName: "app-template-center",
                ...{ class: "mr-4" },
            }));
            const __VLS_128 = __VLS_127({
                iconName: "app-template-center",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_127));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('workflow.setting.templateCenter'));
            // @ts-ignore
            [$t,];
            var __VLS_121;
            var __VLS_122;
        }
        if (__VLS_ctx.permissionPrecise.create()) {
            let __VLS_131;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
            elDropdown;
            // @ts-ignore
            const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
                trigger: "click",
            }));
            const __VLS_133 = __VLS_132({
                trigger: "click",
            }, ...__VLS_functionalComponentArgsRest(__VLS_132));
            const { default: __VLS_136 } = __VLS_134.slots;
            let __VLS_137;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
                type: "primary",
                ...{ class: "ml-8" },
            }));
            const __VLS_139 = __VLS_138({
                type: "primary",
                ...{ class: "ml-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_138));
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_142 } = __VLS_140.slots;
            (__VLS_ctx.$t('common.create'));
            let __VLS_143;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
                ...{ class: "el-icon--right" },
            }));
            const __VLS_145 = __VLS_144({
                ...{ class: "el-icon--right" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_144));
            /** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
            const { default: __VLS_148 } = __VLS_146.slots;
            let __VLS_149;
            /** @ts-ignore @type { | typeof __VLS_components.arrowDown | typeof __VLS_components.ArrowDown | typeof __VLS_components['arrow-down']} */
            arrowDown;
            // @ts-ignore
            const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({}));
            const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
            // @ts-ignore
            [$t, permissionPrecise,];
            var __VLS_146;
            // @ts-ignore
            [];
            var __VLS_140;
            {
                const { dropdown: __VLS_154 } = __VLS_134.slots;
                let __VLS_155;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                elDropdownMenu;
                // @ts-ignore
                const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
                    ...{ class: "create-dropdown" },
                }));
                const __VLS_157 = __VLS_156({
                    ...{ class: "create-dropdown" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_156));
                /** @type {__VLS_StyleScopedClasses['create-dropdown']} */ ;
                const { default: __VLS_160 } = __VLS_158.slots;
                let __VLS_161;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
                    ...{ 'onClick': {} },
                }));
                const __VLS_163 = __VLS_162({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_162));
                let __VLS_166;
                const __VLS_167 = {
                    /** @type {typeof __VLS_166.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isBatch === false))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.create()))
                            throw 0;
                        return __VLS_ctx.openCreateDialog('SIMPLE');
                        // @ts-ignore
                        [openCreateDialog,];
                    },
                };
                const { default: __VLS_168 } = __VLS_164.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                let __VLS_169;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
                    shape: "square",
                    ...{ class: "avatar-blue mt-4" },
                    size: (32),
                }));
                const __VLS_171 = __VLS_170({
                    shape: "square",
                    ...{ class: "avatar-blue mt-4" },
                    size: (32),
                }, ...__VLS_functionalComponentArgsRest(__VLS_170));
                /** @type {__VLS_StyleScopedClasses['avatar-blue']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                const { default: __VLS_174 } = __VLS_172.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/application/icon_simple_application.svg",
                    ...{ style: {} },
                    alt: "",
                });
                // @ts-ignore
                [];
                var __VLS_172;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('views.application.simpleAgent'));
                let __VLS_175;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_177 = __VLS_176({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_176));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                const { default: __VLS_180 } = __VLS_178.slots;
                (__VLS_ctx.$t('views.application.simplePlaceholder'));
                // @ts-ignore
                [$t, $t,];
                var __VLS_178;
                // @ts-ignore
                [];
                var __VLS_164;
                var __VLS_165;
                let __VLS_181;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
                    ...{ 'onClick': {} },
                }));
                const __VLS_183 = __VLS_182({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_182));
                let __VLS_186;
                const __VLS_187 = {
                    /** @type {typeof __VLS_186.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isBatch === false))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.create()))
                            throw 0;
                        return __VLS_ctx.openCreateDialog('WORK_FLOW');
                        // @ts-ignore
                        [openCreateDialog,];
                    },
                };
                const { default: __VLS_188 } = __VLS_184.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                let __VLS_189;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
                    shape: "square",
                    ...{ class: "avatar-orange mt-4" },
                    size: (32),
                }));
                const __VLS_191 = __VLS_190({
                    shape: "square",
                    ...{ class: "avatar-orange mt-4" },
                    size: (32),
                }, ...__VLS_functionalComponentArgsRest(__VLS_190));
                /** @type {__VLS_StyleScopedClasses['avatar-orange']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                const { default: __VLS_194 } = __VLS_192.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/application/icon_workflow_application.svg",
                    ...{ style: {} },
                    alt: "",
                });
                // @ts-ignore
                [];
                var __VLS_192;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('views.application.AdvancedAgent'));
                let __VLS_195;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_197 = __VLS_196({
                    type: "info",
                    size: "small",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_196));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                const { default: __VLS_200 } = __VLS_198.slots;
                (__VLS_ctx.$t('views.application.advancedPlaceholder'));
                // @ts-ignore
                [$t, $t,];
                var __VLS_198;
                // @ts-ignore
                [];
                var __VLS_184;
                var __VLS_185;
                let __VLS_201;
                /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
                elUpload;
                // @ts-ignore
                const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
                    ...{ class: "import-button" },
                    ref: "elUploadRef",
                    fileList: ([]),
                    action: "#",
                    multiple: true,
                    autoUpload: (false),
                    showFileList: (false),
                    limit: (1),
                    onChange: ((file, fileList) => __VLS_ctx.importApplication(file)),
                }));
                const __VLS_203 = __VLS_202({
                    ...{ class: "import-button" },
                    ref: "elUploadRef",
                    fileList: ([]),
                    action: "#",
                    multiple: true,
                    autoUpload: (false),
                    showFileList: (false),
                    limit: (1),
                    onChange: ((file, fileList) => __VLS_ctx.importApplication(file)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_202));
                var __VLS_206;
                /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
                const { default: __VLS_208 } = __VLS_204.slots;
                let __VLS_209;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({}));
                const __VLS_211 = __VLS_210({}, ...__VLS_functionalComponentArgsRest(__VLS_210));
                const { default: __VLS_214 } = __VLS_212.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center w-full" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                let __VLS_215;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }));
                const __VLS_217 = __VLS_216({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_216));
                const { default: __VLS_220 } = __VLS_218.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/icon_import.svg",
                    alt: "",
                });
                // @ts-ignore
                [importApplication,];
                var __VLS_218;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('views.application.importApplication'));
                // @ts-ignore
                [$t,];
                var __VLS_212;
                // @ts-ignore
                [];
                var __VLS_204;
                let __VLS_221;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
                    ...{ 'onClick': {} },
                    divided: true,
                }));
                const __VLS_223 = __VLS_222({
                    ...{ 'onClick': {} },
                    divided: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_222));
                let __VLS_226;
                const __VLS_227 = {
                    /** @type {typeof __VLS_226.click} */
                    onClick: (__VLS_ctx.openCreateFolder),
                };
                const { default: __VLS_228 } = __VLS_224.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                let __VLS_229;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_230 = __VLS_asFunctionalComponent1(__VLS_229, new __VLS_229({
                    iconName: "app-folder",
                    ...{ style: {} },
                }));
                const __VLS_231 = __VLS_230({
                    iconName: "app-folder",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_230));
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
                [$t, openCreateFolder,];
                var __VLS_224;
                var __VLS_225;
                // @ts-ignore
                [];
                var __VLS_158;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_134;
        }
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, modifiers: { fullscreen: true, lock: true, }, value: (__VLS_ctx.paginationConfig.current_page === 1 && __VLS_ctx.loading) }, null, null);
let __VLS_234;
/** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
InfiniteScroll;
// @ts-ignore
const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.applicationList.length),
    total: (__VLS_ctx.paginationConfig.total),
    page_size: (__VLS_ctx.paginationConfig.page_size),
    current_page: (__VLS_ctx.paginationConfig.current_page),
    loading: (__VLS_ctx.loading),
}));
const __VLS_236 = __VLS_235({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.applicationList.length),
    total: (__VLS_ctx.paginationConfig.total),
    page_size: (__VLS_ctx.paginationConfig.page_size),
    current_page: (__VLS_ctx.paginationConfig.current_page),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_235));
let __VLS_239;
const __VLS_240 = {
    /** @type {typeof __VLS_239.load} */
    onLoad: (__VLS_ctx.getList),
};
const { default: __VLS_241 } = __VLS_237.slots;
let __VLS_242;
/** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
elCheckboxGroup;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.multipleSelection),
}));
const __VLS_244 = __VLS_243({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.multipleSelection),
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
let __VLS_247;
const __VLS_248 = {
    /** @type {typeof __VLS_247.change} */
    onChange: (__VLS_ctx.handleCheckedChatChange),
};
const { default: __VLS_249 } = __VLS_245.slots;
if (__VLS_ctx.applicationList.length > 0) {
    let __VLS_250;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
        gutter: (15),
        ...{ class: "w-full" },
    }));
    const __VLS_252 = __VLS_251({
        gutter: (15),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_255 } = __VLS_253.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_256;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            ...{ class: "mb-16" },
        }));
        const __VLS_258 = __VLS_257({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            ...{ class: "mb-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        const { default: __VLS_261 } = __VLS_259.slots;
        let __VLS_262;
        /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
        CardBox;
        // @ts-ignore
        const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
            ...{ 'onContextmenu': {} },
            ...{ 'onMousedown': {} },
            title: (item.name),
            description: (item.desc),
            ...{ class: "cursor" },
            disabled: (__VLS_ctx.isBatch),
            ...{ class: ({
                    'border-active': __VLS_ctx.multipleSelection.includes(item.id),
                }) },
        }));
        const __VLS_264 = __VLS_263({
            ...{ 'onContextmenu': {} },
            ...{ 'onMousedown': {} },
            title: (item.name),
            description: (item.desc),
            ...{ class: "cursor" },
            disabled: (__VLS_ctx.isBatch),
            ...{ class: ({
                    'border-active': __VLS_ctx.multipleSelection.includes(item.id),
                }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_263));
        let __VLS_267;
        const __VLS_268 = {
            /** @type {typeof __VLS_267.contextmenu} */
            onContextmenu: () => { },
        };
        const __VLS_269 = {
            /** @type {typeof __VLS_267.mousedown} */
            onMousedown: (...[$event]) => {
                if (!(__VLS_ctx.applicationList.length > 0))
                    throw 0;
                return __VLS_ctx.goApp($event, item);
                // @ts-ignore
                [isBatch, vLoading, paginationConfig, paginationConfig, paginationConfig, paginationConfig, loading, loading, applicationList, applicationList, applicationList, getList, multipleSelection, multipleSelection, handleCheckedChatChange, goApp,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-active']} */ ;
        const { default: __VLS_270 } = __VLS_265.slots;
        {
            const { icon: __VLS_271 } = __VLS_265.slots;
            let __VLS_272;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
                shape: "square",
                size: (32),
                ...{ style: {} },
            }));
            const __VLS_274 = __VLS_273({
                shape: "square",
                size: (32),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_273));
            const { default: __VLS_277 } = __VLS_275.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(item?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                alt: "",
            });
            // @ts-ignore
            [resetUrl, resetUrl,];
            var __VLS_275;
            // @ts-ignore
            [];
        }
        {
            const { subTitle: __VLS_278 } = __VLS_265.slots;
            let __VLS_279;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({
                ...{ class: "color-secondary lighter flex align-center" },
                size: "small",
            }));
            const __VLS_281 = __VLS_280({
                ...{ class: "color-secondary lighter flex align-center" },
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_280));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            const { default: __VLS_284 } = __VLS_282.slots;
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
            var __VLS_282;
            // @ts-ignore
            [];
        }
        {
            const { tag: __VLS_285 } = __VLS_265.slots;
            if (__VLS_ctx.isBatch) {
                let __VLS_286;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                elCheckbox;
                // @ts-ignore
                const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
                    ...{ 'onChange': {} },
                    value: (item.id),
                }));
                const __VLS_288 = __VLS_287({
                    ...{ 'onChange': {} },
                    value: (item.id),
                }, ...__VLS_functionalComponentArgsRest(__VLS_287));
                let __VLS_291;
                const __VLS_292 = {
                    /** @type {typeof __VLS_291.change} */
                    onChange: (...[$event]) => {
                        if (!(__VLS_ctx.applicationList.length > 0))
                            throw 0;
                        if (!(__VLS_ctx.isBatch))
                            throw 0;
                        return __VLS_ctx.checkboxChange(item);
                        // @ts-ignore
                        [isBatch, checkboxChange,];
                    },
                };
                var __VLS_289;
                var __VLS_290;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                if (__VLS_ctx.isWorkFlow(item.type)) {
                    let __VLS_293;
                    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
                    elTag;
                    // @ts-ignore
                    const __VLS_294 = __VLS_asFunctionalComponent1(__VLS_293, new __VLS_293({
                        size: "small",
                        ...{ class: "warning-tag" },
                    }));
                    const __VLS_295 = __VLS_294({
                        size: "small",
                        ...{ class: "warning-tag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_294));
                    /** @type {__VLS_StyleScopedClasses['warning-tag']} */ ;
                    const { default: __VLS_298 } = __VLS_296.slots;
                    (__VLS_ctx.$t('views.application.senior'));
                    // @ts-ignore
                    [$t, isWorkFlow,];
                    var __VLS_296;
                }
                else {
                    let __VLS_299;
                    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
                    elTag;
                    // @ts-ignore
                    const __VLS_300 = __VLS_asFunctionalComponent1(__VLS_299, new __VLS_299({
                        size: "small",
                        ...{ class: "blue-tag" },
                    }));
                    const __VLS_301 = __VLS_300({
                        size: "small",
                        ...{ class: "blue-tag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_300));
                    /** @type {__VLS_StyleScopedClasses['blue-tag']} */ ;
                    const { default: __VLS_304 } = __VLS_302.slots;
                    (__VLS_ctx.$t('views.application.simple'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_302;
                }
            }
            // @ts-ignore
            [];
        }
        {
            const { footer: __VLS_305 } = __VLS_265.slots;
            if (item.is_publish) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                let __VLS_306;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
                    ...{ class: "color-success mr-8" },
                    ...{ style: {} },
                }));
                const __VLS_308 = __VLS_307({
                    ...{ class: "color-success mr-8" },
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_307));
                /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_311 } = __VLS_309.slots;
                let __VLS_312;
                /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
                SuccessFilled;
                // @ts-ignore
                const __VLS_313 = __VLS_asFunctionalComponent1(__VLS_312, new __VLS_312({}));
                const __VLS_314 = __VLS_313({}, ...__VLS_functionalComponentArgsRest(__VLS_313));
                // @ts-ignore
                [];
                var __VLS_309;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.status.published'));
                let __VLS_317;
                /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
                elDivider;
                // @ts-ignore
                const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({
                    direction: "vertical",
                }));
                const __VLS_319 = __VLS_318({
                    direction: "vertical",
                }, ...__VLS_functionalComponentArgsRest(__VLS_318));
                let __VLS_322;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_323 = __VLS_asFunctionalComponent1(__VLS_322, new __VLS_322({
                    iconName: "app-clock",
                    ...{ class: "color-secondary mr-8" },
                }));
                const __VLS_324 = __VLS_323({
                    iconName: "app-clock",
                    ...{ class: "color-secondary mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_323));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.dateFormat(item.update_time));
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                let __VLS_327;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
                    iconName: "app-disabled",
                    ...{ class: "color-secondary mr-8" },
                }));
                const __VLS_329 = __VLS_328({
                    iconName: "app-disabled",
                    ...{ class: "color-secondary mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_328));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.status.unpublished'));
            }
            // @ts-ignore
            [$t, $t, dateFormat,];
        }
        {
            const { mouseEnter: __VLS_332 } = __VLS_265.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: () => { } },
                ...{ onMousedown: () => { } },
            });
            let __VLS_333;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
                effect: "dark",
                content: (__VLS_ctx.$t('views.application.operation.toChat')),
                placement: "top",
            }));
            const __VLS_335 = __VLS_334({
                effect: "dark",
                content: (__VLS_ctx.$t('views.application.operation.toChat')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_334));
            const { default: __VLS_338 } = __VLS_336.slots;
            let __VLS_339;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_341 = __VLS_340({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_340));
            let __VLS_344;
            const __VLS_345 = {
                /** @type {typeof __VLS_344.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.applicationList.length > 0))
                        throw 0;
                    return __VLS_ctx.toChat(item);
                    // @ts-ignore
                    [$t, toChat,];
                },
            };
            const { default: __VLS_346 } = __VLS_342.slots;
            let __VLS_347;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_348 = __VLS_asFunctionalComponent1(__VLS_347, new __VLS_347({
                iconName: "app-create-chat",
                ...{ class: "color-secondary" },
            }));
            const __VLS_349 = __VLS_348({
                iconName: "app-create-chat",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_348));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [];
            var __VLS_342;
            var __VLS_343;
            // @ts-ignore
            [];
            var __VLS_336;
            let __VLS_352;
            /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
            elDivider;
            // @ts-ignore
            const __VLS_353 = __VLS_asFunctionalComponent1(__VLS_352, new __VLS_352({
                direction: "vertical",
            }));
            const __VLS_354 = __VLS_353({
                direction: "vertical",
            }, ...__VLS_functionalComponentArgsRest(__VLS_353));
            let __VLS_357;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
            elDropdown;
            // @ts-ignore
            const __VLS_358 = __VLS_asFunctionalComponent1(__VLS_357, new __VLS_357({
                trigger: "click",
            }));
            const __VLS_359 = __VLS_358({
                trigger: "click",
            }, ...__VLS_functionalComponentArgsRest(__VLS_358));
            const { default: __VLS_362 } = __VLS_360.slots;
            let __VLS_363;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_364 = __VLS_asFunctionalComponent1(__VLS_363, new __VLS_363({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_365 = __VLS_364({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_364));
            let __VLS_368;
            const __VLS_369 = {
                /** @type {typeof __VLS_368.click} */
                onClick: () => { },
            };
            const { default: __VLS_370 } = __VLS_366.slots;
            let __VLS_371;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_372 = __VLS_asFunctionalComponent1(__VLS_371, new __VLS_371({
                iconName: "app-more",
                ...{ class: "color-secondary" },
            }));
            const __VLS_373 = __VLS_372({
                iconName: "app-more",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_372));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [];
            var __VLS_366;
            var __VLS_367;
            {
                const { dropdown: __VLS_376 } = __VLS_360.slots;
                let __VLS_377;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                elDropdownMenu;
                // @ts-ignore
                const __VLS_378 = __VLS_asFunctionalComponent1(__VLS_377, new __VLS_377({}));
                const __VLS_379 = __VLS_378({}, ...__VLS_functionalComponentArgsRest(__VLS_378));
                const { default: __VLS_382 } = __VLS_380.slots;
                if (__VLS_ctx.permissionPrecise.edit(item.id)) {
                    let __VLS_383;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_384 = __VLS_asFunctionalComponent1(__VLS_383, new __VLS_383({
                        ...{ 'onMousedown': {} },
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_385 = __VLS_384({
                        ...{ 'onMousedown': {} },
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_384));
                    let __VLS_388;
                    const __VLS_389 = {
                        /** @type {typeof __VLS_388.mousedown} */
                        onMousedown: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.edit(item.id)))
                                throw 0;
                            return __VLS_ctx.settingApplication($event, item);
                            // @ts-ignore
                            [permissionPrecise, settingApplication,];
                        },
                    };
                    const __VLS_390 = {
                        /** @type {typeof __VLS_388.click} */
                        onClick: () => { },
                    };
                    const { default: __VLS_391 } = __VLS_386.slots;
                    let __VLS_392;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_393 = __VLS_asFunctionalComponent1(__VLS_392, new __VLS_392({
                        iconName: "app-setting",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_394 = __VLS_393({
                        iconName: "app-setting",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.setting'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_386;
                    var __VLS_387;
                }
                if (__VLS_ctx.permissionPrecise.auth(item.id)) {
                    let __VLS_397;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_398 = __VLS_asFunctionalComponent1(__VLS_397, new __VLS_397({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_399 = __VLS_398({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_398));
                    let __VLS_402;
                    const __VLS_403 = {
                        /** @type {typeof __VLS_402.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.auth(item.id)))
                                throw 0;
                            return __VLS_ctx.openAuthorization(item);
                            // @ts-ignore
                            [permissionPrecise, openAuthorization,];
                        },
                    };
                    const { default: __VLS_404 } = __VLS_400.slots;
                    let __VLS_405;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
                        iconName: "app-resource-authorization",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_407 = __VLS_406({
                        iconName: "app-resource-authorization",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_406));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_400;
                    var __VLS_401;
                }
                if (__VLS_ctx.permissionPrecise.relate_map(item.id)) {
                    let __VLS_410;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_411 = __VLS_asFunctionalComponent1(__VLS_410, new __VLS_410({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_412 = __VLS_411({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_411));
                    let __VLS_415;
                    const __VLS_416 = {
                        /** @type {typeof __VLS_415.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.relate_map(item.id)))
                                throw 0;
                            return __VLS_ctx.openResourceMappingDrawer(item);
                            // @ts-ignore
                            [permissionPrecise, openResourceMappingDrawer,];
                        },
                    };
                    const { default: __VLS_417 } = __VLS_413.slots;
                    let __VLS_418;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_419 = __VLS_asFunctionalComponent1(__VLS_418, new __VLS_418({
                        iconName: "app-resource-mapping",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_420 = __VLS_419({
                        iconName: "app-resource-mapping",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_419));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.system.resourceMapping.title'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_413;
                    var __VLS_414;
                }
                if (__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.trigger_read(item.id)) {
                    let __VLS_423;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_424 = __VLS_asFunctionalComponent1(__VLS_423, new __VLS_423({
                        ...{ 'onClick': {} },
                        disabled: (!item.is_publish),
                    }));
                    const __VLS_425 = __VLS_424({
                        ...{ 'onClick': {} },
                        disabled: (!item.is_publish),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_424));
                    let __VLS_428;
                    const __VLS_429 = {
                        /** @type {typeof __VLS_428.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.trigger_read(item.id)))
                                throw 0;
                            return __VLS_ctx.openTriggerDrawer(item);
                            // @ts-ignore
                            [permissionPrecise, apiType, openTriggerDrawer,];
                        },
                    };
                    const { default: __VLS_430 } = __VLS_426.slots;
                    let __VLS_431;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_432 = __VLS_asFunctionalComponent1(__VLS_431, new __VLS_431({
                        iconName: "app-trigger",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_433 = __VLS_432({
                        iconName: "app-trigger",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_432));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.trigger.title'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_426;
                    var __VLS_427;
                }
                if (__VLS_ctx.permissionPrecise.edit(item.id) && __VLS_ctx.apiType === 'workspace') {
                    let __VLS_436;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_437 = __VLS_asFunctionalComponent1(__VLS_436, new __VLS_436({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_438 = __VLS_437({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
                    let __VLS_441;
                    const __VLS_442 = {
                        /** @type {typeof __VLS_441.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.edit(item.id) && __VLS_ctx.apiType === 'workspace'))
                                throw 0;
                            return __VLS_ctx.openMoveToDialog(item);
                            // @ts-ignore
                            [permissionPrecise, apiType, openMoveToDialog,];
                        },
                    };
                    const { default: __VLS_443 } = __VLS_439.slots;
                    let __VLS_444;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_445 = __VLS_asFunctionalComponent1(__VLS_444, new __VLS_444({
                        iconName: "app-migrate",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_446 = __VLS_445({
                        iconName: "app-migrate",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.moveTo'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_439;
                    var __VLS_440;
                }
                if (__VLS_ctx.permissionPrecise.copy(item.id)) {
                    let __VLS_449;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_450 = __VLS_asFunctionalComponent1(__VLS_449, new __VLS_449({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_451 = __VLS_450({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_450));
                    let __VLS_454;
                    const __VLS_455 = {
                        /** @type {typeof __VLS_454.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.copy(item.id)))
                                throw 0;
                            return __VLS_ctx.copyApplication(item);
                            // @ts-ignore
                            [permissionPrecise, copyApplication,];
                        },
                    };
                    const { default: __VLS_456 } = __VLS_452.slots;
                    let __VLS_457;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_458 = __VLS_asFunctionalComponent1(__VLS_457, new __VLS_457({
                        iconName: "app-copy",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_459 = __VLS_458({
                        iconName: "app-copy",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_458));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.copy'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_452;
                    var __VLS_453;
                }
                if (__VLS_ctx.permissionPrecise.export(item.id)) {
                    let __VLS_462;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_463 = __VLS_asFunctionalComponent1(__VLS_462, new __VLS_462({
                        ...{ 'onClick': {} },
                        divided: true,
                    }));
                    const __VLS_464 = __VLS_463({
                        ...{ 'onClick': {} },
                        divided: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_463));
                    let __VLS_467;
                    const __VLS_468 = {
                        /** @type {typeof __VLS_467.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.export(item.id)))
                                throw 0;
                            return __VLS_ctx.exportApplication(item);
                            // @ts-ignore
                            [permissionPrecise, exportApplication,];
                        },
                    };
                    const { default: __VLS_469 } = __VLS_465.slots;
                    let __VLS_470;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_471 = __VLS_asFunctionalComponent1(__VLS_470, new __VLS_470({
                        iconName: "app-export",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_472 = __VLS_471({
                        iconName: "app-export",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_471));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.export'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_465;
                    var __VLS_466;
                }
                if (__VLS_ctx.permissionPrecise.delete(item.id)) {
                    let __VLS_475;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_476 = __VLS_asFunctionalComponent1(__VLS_475, new __VLS_475({
                        ...{ 'onClick': {} },
                        divided: true,
                    }));
                    const __VLS_477 = __VLS_476({
                        ...{ 'onClick': {} },
                        divided: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_476));
                    let __VLS_480;
                    const __VLS_481 = {
                        /** @type {typeof __VLS_480.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.applicationList.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.delete(item.id)))
                                throw 0;
                            return __VLS_ctx.deleteApplication(item);
                            // @ts-ignore
                            [permissionPrecise, deleteApplication,];
                        },
                    };
                    const { default: __VLS_482 } = __VLS_478.slots;
                    let __VLS_483;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_484 = __VLS_asFunctionalComponent1(__VLS_483, new __VLS_483({
                        iconName: "app-delete",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_485 = __VLS_484({
                        iconName: "app-delete",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_484));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.delete'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_478;
                    var __VLS_479;
                }
                // @ts-ignore
                [];
                var __VLS_380;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_360;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_265;
        var __VLS_266;
        // @ts-ignore
        [];
        var __VLS_259;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_253;
}
else {
    let __VLS_488;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_489 = __VLS_asFunctionalComponent1(__VLS_488, new __VLS_488({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_490 = __VLS_489({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_489));
}
// @ts-ignore
[$t,];
var __VLS_245;
var __VLS_246;
// @ts-ignore
[];
var __VLS_237;
var __VLS_238;
if (__VLS_ctx.isBatch) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mul-operation border-t w-full flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['mul-operation']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_493;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_494 = __VLS_asFunctionalComponent1(__VLS_493, new __VLS_493({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }));
    const __VLS_495 = __VLS_494({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_494));
    let __VLS_498;
    const __VLS_499 = {
        /** @type {typeof __VLS_498.change} */
        onChange: (__VLS_ctx.handleCheckAllChange),
    };
    const { default: __VLS_500 } = __VLS_496.slots;
    (__VLS_ctx.$t('common.allCheck'));
    // @ts-ignore
    [$t, isBatch, checkAll, isIndeterminate, handleCheckAllChange,];
    var __VLS_496;
    var __VLS_497;
    if (__VLS_ctx.permissionPrecise.batchMove()) {
        let __VLS_501;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_502 = __VLS_asFunctionalComponent1(__VLS_501, new __VLS_501({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_503 = __VLS_502({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_502));
        let __VLS_506;
        const __VLS_507 = {
            /** @type {typeof __VLS_506.click} */
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
        const { default: __VLS_508 } = __VLS_504.slots;
        (__VLS_ctx.$t('common.moveTo'));
        // @ts-ignore
        [$t,];
        var __VLS_504;
        var __VLS_505;
    }
    if (__VLS_ctx.permissionPrecise.batchCleanStrategy()) {
        let __VLS_509;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_510 = __VLS_asFunctionalComponent1(__VLS_509, new __VLS_509({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_511 = __VLS_510({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_510));
        let __VLS_514;
        const __VLS_515 = {
            /** @type {typeof __VLS_514.click} */
            onClick: (__VLS_ctx.openBatchClearStrategyDialog),
        };
        const { default: __VLS_516 } = __VLS_512.slots;
        (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy'));
        // @ts-ignore
        [$t, permissionPrecise, multipleSelection, openBatchClearStrategyDialog,];
        var __VLS_512;
        var __VLS_513;
    }
    if (__VLS_ctx.permissionPrecise.batchDelete()) {
        let __VLS_517;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_518 = __VLS_asFunctionalComponent1(__VLS_517, new __VLS_517({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_519 = __VLS_518({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_518));
        let __VLS_522;
        const __VLS_523 = {
            /** @type {typeof __VLS_522.click} */
            onClick: (__VLS_ctx.deleteMulApplication),
        };
        const { default: __VLS_524 } = __VLS_520.slots;
        (__VLS_ctx.$t('common.delete'));
        // @ts-ignore
        [$t, permissionPrecise, multipleSelection, deleteMulApplication,];
        var __VLS_520;
        var __VLS_521;
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
    let __VLS_525;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_526 = __VLS_asFunctionalComponent1(__VLS_525, new __VLS_525({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_527 = __VLS_526({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_526));
    let __VLS_530;
    const __VLS_531 = {
        /** @type {typeof __VLS_530.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isBatch))
                throw 0;
            return __VLS_ctx.batchSelectedHandle(false);
            // @ts-ignore
            [$t, $t, batchSelectedHandle, paginationConfig, multipleSelection,];
        },
    };
    const { default: __VLS_532 } = __VLS_528.slots;
    (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
    // @ts-ignore
    [$t,];
    var __VLS_528;
    var __VLS_529;
}
// @ts-ignore
[];
var __VLS_19;
const __VLS_533 = ResourceMappingDrawer;
// @ts-ignore
const __VLS_534 = __VLS_asFunctionalComponent1(__VLS_533, new __VLS_533({
    ref: "resourceMappingDrawerRef",
}));
const __VLS_535 = __VLS_534({
    ref: "resourceMappingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_534));
var __VLS_538;
var __VLS_536;
const __VLS_540 = CreateApplicationDialog;
// @ts-ignore
const __VLS_541 = __VLS_asFunctionalComponent1(__VLS_540, new __VLS_540({
    ref: "CreateApplicationDialogRef",
}));
const __VLS_542 = __VLS_541({
    ref: "CreateApplicationDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_541));
var __VLS_545;
var __VLS_543;
const __VLS_547 = CopyApplicationDialog;
// @ts-ignore
const __VLS_548 = __VLS_asFunctionalComponent1(__VLS_547, new __VLS_547({
    ref: "CopyApplicationDialogRef",
}));
const __VLS_549 = __VLS_548({
    ref: "CopyApplicationDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_548));
var __VLS_552;
var __VLS_550;
const __VLS_554 = BatchClearStrategyDialog;
// @ts-ignore
const __VLS_555 = __VLS_asFunctionalComponent1(__VLS_554, new __VLS_554({
    ...{ 'onRefresh': {} },
    ref: "BatchClearStrategyDialogRef",
}));
const __VLS_556 = __VLS_555({
    ...{ 'onRefresh': {} },
    ref: "BatchClearStrategyDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_555));
let __VLS_559;
const __VLS_560 = {
    /** @type {typeof __VLS_559.refresh} */
    onRefresh: (...[$event]) => {
        return __VLS_ctx.refreshApplicationList();
        // @ts-ignore
        [refreshApplicationList,];
    },
};
var __VLS_561;
var __VLS_557;
var __VLS_558;
const __VLS_563 = CreateFolderDialog;
// @ts-ignore
const __VLS_564 = __VLS_asFunctionalComponent1(__VLS_563, new __VLS_563({
    ...{ 'onRefresh': {} },
    ref: "CreateFolderDialogRef",
}));
const __VLS_565 = __VLS_564({
    ...{ 'onRefresh': {} },
    ref: "CreateFolderDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_564));
let __VLS_568;
const __VLS_569 = {
    /** @type {typeof __VLS_568.refresh} */
    onRefresh: (__VLS_ctx.refreshFolder),
};
var __VLS_570;
var __VLS_566;
var __VLS_567;
if (__VLS_ctx.apiType === 'workspace') {
    const __VLS_572 = MoveToDialog;
    // @ts-ignore
    const __VLS_573 = __VLS_asFunctionalComponent1(__VLS_572, new __VLS_572({
        ...{ 'onRefresh': {} },
        ref: "MoveToDialogRef",
        source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
    }));
    const __VLS_574 = __VLS_573({
        ...{ 'onRefresh': {} },
        ref: "MoveToDialogRef",
        source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
    }, ...__VLS_functionalComponentArgsRest(__VLS_573));
    let __VLS_577;
    const __VLS_578 = {
        /** @type {typeof __VLS_577.refresh} */
        onRefresh: (__VLS_ctx.refreshApplicationList),
    };
    var __VLS_579;
    var __VLS_575;
    var __VLS_576;
}
const __VLS_581 = ResourceAuthorizationDrawer;
// @ts-ignore
const __VLS_582 = __VLS_asFunctionalComponent1(__VLS_581, new __VLS_581({
    type: (__VLS_ctx.SourceTypeEnum.APPLICATION),
    ref: "ResourceAuthorizationDrawerRef",
}));
const __VLS_583 = __VLS_582({
    type: (__VLS_ctx.SourceTypeEnum.APPLICATION),
    ref: "ResourceAuthorizationDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_582));
var __VLS_586;
var __VLS_584;
const __VLS_588 = TemplateStoreDialog;
// @ts-ignore
const __VLS_589 = __VLS_asFunctionalComponent1(__VLS_588, new __VLS_588({
    ...{ 'onRefresh': {} },
    ref: "templateStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_590 = __VLS_589({
    ...{ 'onRefresh': {} },
    ref: "templateStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_589));
let __VLS_593;
const __VLS_594 = {
    /** @type {typeof __VLS_593.refresh} */
    onRefresh: (__VLS_ctx.getList),
};
var __VLS_595;
var __VLS_591;
var __VLS_592;
const __VLS_597 = ResourceTriggerDrawer || ResourceTriggerDrawer;
// @ts-ignore
const __VLS_598 = __VLS_asFunctionalComponent1(__VLS_597, new __VLS_597({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
}));
const __VLS_599 = __VLS_598({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
}, ...__VLS_functionalComponentArgsRest(__VLS_598));
var __VLS_602;
var __VLS_600;
// @ts-ignore
[SourceTypeEnum, SourceTypeEnum, SourceTypeEnum, refreshFolder, getList, apiType, apiType, refreshApplicationList,];
var __VLS_3;
// @ts-ignore
var __VLS_207 = __VLS_206, __VLS_539 = __VLS_538, __VLS_546 = __VLS_545, __VLS_553 = __VLS_552, __VLS_562 = __VLS_561, __VLS_571 = __VLS_570, __VLS_580 = __VLS_579, __VLS_587 = __VLS_586, __VLS_596 = __VLS_595, __VLS_603 = __VLS_602;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
