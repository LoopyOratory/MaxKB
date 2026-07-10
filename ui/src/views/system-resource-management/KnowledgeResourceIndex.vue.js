/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import KnowledgeResourceApi from '@/api/system-resource-management/knowledge';
import UserApi from '@/api/user/user';
import SyncWebDialog from '@/views/knowledge/component/SyncWebDialog.vue';
import GenerateRelatedDialog from '@/components/generate-related-dialog/index.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import { datetimeFormat } from '@/utils/time';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import permissionMap from '@/permission';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { SourceTypeEnum } from '@/enums/common';
import { t } from '@/locales';
import useStore from '@/stores';
import { hasPermission } from '@/utils/permission';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import ResourceMappingDrawer from '@/components/resource_mapping/index.vue';
const router = useRouter();
const { user } = useStore();
const permissionPrecise = computed(() => {
    return permissionMap['knowledge']['systemManage'];
});
const ManagePermission = () => {
    return (permissionPrecise.value.doc_read() ||
        permissionPrecise.value.problem_read() ||
        permissionPrecise.value.edit() ||
        permissionPrecise.value.knowledge_chat_user_read() ||
        permissionPrecise.value.hit_test() ||
        hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_WORKFLOW_READ], 'OR'));
};
const MoreFilledPermission = () => {
    return ['sync', 'generate', 'edit', 'export', 'delete', 'auth', 'relate_map'].some((key) => permissionPrecise.value[key]());
};
const search_type = ref('name');
const search_form = ref({
    name: '',
    create_user: '',
    type: '',
});
const user_options = ref([]);
const type_options = ref([
    {
        label: t('views.knowledge.knowledgeType.generalKnowledge'),
        value: '0',
    },
    {
        label: t('views.knowledge.knowledgeType.webKnowledge'),
        value: '1',
    },
    {
        label: t('views.knowledge.knowledgeType.larkKnowledge'),
        value: '2',
    },
    {
        label: t('views.knowledge.knowledgeType.workflowKnowledge'),
        value: '4',
    },
]);
const loading = ref(false);
const knowledgeList = ref([]);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(item) {
    ResourceAuthorizationDrawerRef.value.open(item.id, undefined, item.workspace_id);
}
const exportKnowledge = (item) => {
    KnowledgeResourceApi.exportKnowledge(item.name, item.id, loading).then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
};
const exportZipKnowledge = (item) => {
    KnowledgeResourceApi.exportZipKnowledge(item.name, item.id, loading).then(() => {
        MsgSuccess(t('common.exportSuccess'));
    });
};
const exportKnowledgeBundle = (item) => {
    KnowledgeResourceApi.exportKnowledgeBundle(item.name, item.id, loading).then(() => {
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
        KnowledgeResourceApi.delKnowledge(row.id, loading).then(() => {
            getList();
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => {
    });
}
const GenerateRelatedDialogRef = ref();
function openGenerateDialog(row) {
    if (GenerateRelatedDialogRef.value) {
        GenerateRelatedDialogRef.value.open([], 'knowledge', row);
    }
}
const SyncWebDialogRef = ref();
function syncKnowledge(row) {
    SyncWebDialogRef.value.open(row.id);
}
function reEmbeddingKnowledge(row) {
    KnowledgeResourceApi.putReEmbeddingKnowledge(row.id).then(() => {
        MsgSuccess(t('common.submitSuccess'));
    });
}
const workspaceOptions = ref([]);
const workspaceVisible = ref(false);
const workspaceArr = ref([]);
const filterText = ref('');
const filterData = ref([]);
watch([() => workspaceOptions.value, () => filterText.value], () => {
    if (!filterText.value.length) {
        filterData.value = workspaceOptions.value;
    }
    filterData.value = workspaceOptions.value.filter((v) => v.label.toLowerCase().includes(filterText.value.toLowerCase()));
}, { immediate: true });
function filterWorkspaceChange(val) {
    if (val === 'clear') {
        workspaceArr.value = [];
    }
    filterText.value = '';
    getList();
    workspaceVisible.value = false;
}
async function getWorkspaceList() {
    if (user.isEE()) {
        const res = await loadPermissionApi('workspace').getSystemWorkspaceList(loading);
        workspaceOptions.value = res.data.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }
}
const search_type_change = () => {
    search_form.value = { name: '', create_user: '' };
};
function getList() {
    const params = {};
    if (search_form.value[search_type.value]) {
        params[search_type.value] = search_form.value[search_type.value];
    }
    if (workspaceArr.value.length > 0) {
        params.workspace_ids = JSON.stringify(workspaceArr.value);
    }
    KnowledgeResourceApi.getKnowledgeListPage(paginationConfig, params, loading).then((res) => {
        paginationConfig.total = res.data?.total;
        knowledgeList.value = res.data?.records;
    });
}
const resourceMappingDrawerRef = ref();
const openResourceMappingDrawer = (knowledge) => {
    resourceMappingDrawerRef.value?.open('KNOWLEDGE', knowledge);
};
onMounted(() => {
    getWorkspaceList();
    getList();
    getUserList('');
});
function getUserList(query) {
    UserApi.getAllMemberList(query ? { nick_name: query } : '')
        .then((res) => {
        user_options.value = res.data || [];
    })
        .catch(() => {
        user_options.value = [];
    });
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
elBreadcrumb;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    separatorIcon: "ArrowRight",
}));
const __VLS_2 = __VLS_1({
    separatorIcon: "ArrowRight",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.t('views.system.resource_management.label'));
// @ts-ignore
[t,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "ml-4 color-text-primary" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
(__VLS_ctx.t('views.knowledge.title'));
// @ts-ignore
[t,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ class: "mt-16" },
    ...{ style: {} },
}));
const __VLS_20 = __VLS_19({
    ...{ class: "mt-16" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "complex-search" },
});
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
const __VLS_30 = {
    /** @type {typeof __VLS_29.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_31 } = __VLS_27.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}));
const __VLS_34 = __VLS_33({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}));
const __VLS_39 = __VLS_38({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    label: (__VLS_ctx.$t('common.type')),
    value: "type",
}));
const __VLS_44 = __VLS_43({
    label: (__VLS_ctx.$t('common.type')),
    value: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
// @ts-ignore
[search_type, search_type_change, $t, $t, $t,];
var __VLS_27;
var __VLS_28;
if (__VLS_ctx.search_type === 'name') {
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    let __VLS_52;
    const __VLS_53 = {
        /** @type {typeof __VLS_52.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_50;
    var __VLS_51;
}
else if (__VLS_ctx.search_type === 'create_user') {
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    let __VLS_59;
    const __VLS_60 = {
        /** @type {typeof __VLS_59.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_61 } = __VLS_57.slots;
    for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
        let __VLS_62;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }));
        const __VLS_64 = __VLS_63({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        // @ts-ignore
        [search_type, search_type, $t, search_form, search_form, getList, getList, getUserList, user_options,];
    }
    // @ts-ignore
    [];
    var __VLS_57;
    var __VLS_58;
}
else if (__VLS_ctx.search_type === 'type') {
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.type),
        clearable: true,
        filterable: true,
        ...{ style: {} },
    }));
    const __VLS_69 = __VLS_68({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.type),
        clearable: true,
        filterable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    let __VLS_72;
    const __VLS_73 = {
        /** @type {typeof __VLS_72.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_74 } = __VLS_70.slots;
    for (const [u] of __VLS_vFor((__VLS_ctx.type_options))) {
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            key: (u.id),
            value: (u.value),
            label: (u.label),
        }));
        const __VLS_77 = __VLS_76({
            key: (u.id),
            value: (u.value),
            label: (u.label),
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        // @ts-ignore
        [search_type, search_form, getList, type_options,];
    }
    // @ts-ignore
    [];
    var __VLS_70;
    var __VLS_71;
}
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.knowledgeList),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (260),
}));
const __VLS_82 = __VLS_81({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.knowledgeList),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (260),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_85;
const __VLS_86 = {
    /** @type {typeof __VLS_85.sizeChange} */
    onSizeChange: (__VLS_ctx.getList),
};
const __VLS_87 = {
    /** @type {typeof __VLS_85.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const { default: __VLS_88 } = __VLS_83.slots;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    width: "220",
    label: (__VLS_ctx.$t('common.name')),
    showOverflowTooltip: true,
}));
const __VLS_91 = __VLS_90({
    width: "220",
    label: (__VLS_ctx.$t('common.name')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const { default: __VLS_94 } = __VLS_92.slots;
{
    const { default: __VLS_95 } = __VLS_92.slots;
    const [{ row }] = __VLS_vSlot(__VLS_95);
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        size: (8),
    }));
    const __VLS_98 = __VLS_97({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    const { default: __VLS_101 } = __VLS_99.slots;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
    KnowledgeIcon;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        type: (row.type),
        size: (24),
    }));
    const __VLS_104 = __VLS_103({
        type: (row.type),
        size: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.name);
    // @ts-ignore
    [$t, getList, getList, knowledgeList, paginationConfig,];
    var __VLS_99;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_92;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    prop: "tool_type",
    label: (__VLS_ctx.$t('common.type')),
    width: "110",
}));
const __VLS_109 = __VLS_108({
    prop: "tool_type",
    label: (__VLS_ctx.$t('common.type')),
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
const { default: __VLS_112 } = __VLS_110.slots;
{
    const { default: __VLS_113 } = __VLS_110.slots;
    const [{ row }] = __VLS_vSlot(__VLS_113);
    if (row.type === 1) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.knowledge.knowledgeType.webKnowledge'));
    }
    else if (row.type === 2) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.knowledge.knowledgeType.larkKnowledge'));
    }
    else if (row.type === 4) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.knowledge.knowledgeType.workflowKnowledge'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.knowledge.knowledgeType.generalKnowledge'));
    }
    // @ts-ignore
    [$t, $t, $t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_110;
if (__VLS_ctx.user.isEE()) {
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }));
    const __VLS_116 = __VLS_115({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    const { default: __VLS_119 } = __VLS_117.slots;
    {
        const { header: __VLS_120 } = __VLS_117.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.workspace.title'));
        let __VLS_121;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }));
        const __VLS_123 = __VLS_122({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        const { default: __VLS_126 } = __VLS_124.slots;
        {
            const { reference: __VLS_127 } = __VLS_124.slots;
            let __VLS_128;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }));
            const __VLS_130 = __VLS_129({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_129));
            let __VLS_133;
            const __VLS_134 = {
                /** @type {typeof __VLS_133.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.user.isEE()))
                        throw 0;
                    return __VLS_ctx.workspaceVisible = !__VLS_ctx.workspaceVisible;
                    // @ts-ignore
                    [$t, $t, user, workspaceVisible, workspaceVisible, workspaceVisible, workspaceArr, workspaceArr,];
                },
            };
            const { default: __VLS_135 } = __VLS_131.slots;
            let __VLS_136;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({}));
            const __VLS_138 = __VLS_137({}, ...__VLS_functionalComponentArgsRest(__VLS_137));
            const { default: __VLS_141 } = __VLS_139.slots;
            let __VLS_142;
            /** @ts-ignore @type { | typeof __VLS_components.Filter} */
            Filter;
            // @ts-ignore
            const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({}));
            const __VLS_144 = __VLS_143({}, ...__VLS_functionalComponentArgsRest(__VLS_143));
            // @ts-ignore
            [];
            var __VLS_139;
            // @ts-ignore
            [];
            var __VLS_131;
            var __VLS_132;
            // @ts-ignore
            [];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "filter" },
        });
        /** @type {__VLS_StyleScopedClasses['filter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "form-item mb-16 ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
        });
        let __VLS_147;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }));
        const __VLS_149 = __VLS_148({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_148));
        if (__VLS_ctx.filterData.length) {
            let __VLS_152;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
                height: "300",
            }));
            const __VLS_154 = __VLS_153({
                height: "300",
            }, ...__VLS_functionalComponentArgsRest(__VLS_153));
            const { default: __VLS_157 } = __VLS_155.slots;
            let __VLS_158;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
            elCheckboxGroup;
            // @ts-ignore
            const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }));
            const __VLS_160 = __VLS_159({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_159));
            const { default: __VLS_163 } = __VLS_161.slots;
            for (const [item] of __VLS_vFor((__VLS_ctx.filterData))) {
                let __VLS_164;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                elCheckbox;
                // @ts-ignore
                const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }));
                const __VLS_166 = __VLS_165({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_165));
                // @ts-ignore
                [$t, workspaceArr, filterText, filterData, filterData,];
            }
            // @ts-ignore
            [];
            var __VLS_161;
            // @ts-ignore
            [];
            var __VLS_155;
        }
        else {
            let __VLS_169;
            /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
            elEmpty;
            // @ts-ignore
            const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
                description: (__VLS_ctx.$t('common.noData')),
            }));
            const __VLS_171 = __VLS_170({
                description: (__VLS_ctx.$t('common.noData')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        let __VLS_174;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_176 = __VLS_175({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_175));
        let __VLS_179;
        const __VLS_180 = {
            /** @type {typeof __VLS_179.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.user.isEE()))
                    throw 0;
                return __VLS_ctx.filterWorkspaceChange('clear');
                // @ts-ignore
                [$t, filterWorkspaceChange,];
            },
        };
        const { default: __VLS_181 } = __VLS_177.slots;
        (__VLS_ctx.$t('common.clear'));
        // @ts-ignore
        [$t,];
        var __VLS_177;
        var __VLS_178;
        let __VLS_182;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }));
        const __VLS_184 = __VLS_183({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_183));
        let __VLS_187;
        const __VLS_188 = {
            /** @type {typeof __VLS_187.click} */
            onClick: (__VLS_ctx.filterWorkspaceChange),
        };
        const { default: __VLS_189 } = __VLS_185.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, filterWorkspaceChange,];
        var __VLS_185;
        var __VLS_186;
        // @ts-ignore
        [];
        var __VLS_124;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_117;
}
let __VLS_190;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}));
const __VLS_192 = __VLS_191({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
let __VLS_195;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "180",
}));
const __VLS_197 = __VLS_196({
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
const { default: __VLS_200 } = __VLS_198.slots;
{
    const { default: __VLS_201 } = __VLS_198.slots;
    const [{ row }] = __VLS_vSlot(__VLS_201);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_198;
let __VLS_202;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}));
const __VLS_204 = __VLS_203({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
const { default: __VLS_207 } = __VLS_205.slots;
{
    const { default: __VLS_208 } = __VLS_205.slots;
    const [{ row }] = __VLS_vSlot(__VLS_208);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_205;
let __VLS_209;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "120",
    fixed: "right",
}));
const __VLS_211 = __VLS_210({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "120",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
const { default: __VLS_214 } = __VLS_212.slots;
{
    const { default: __VLS_215 } = __VLS_212.slots;
    const [{ row }] = __VLS_vSlot(__VLS_215);
    let __VLS_216;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
        effect: "dark",
        content: (__VLS_ctx.$t('views.system.resource_management.management')),
        placement: "top",
    }));
    const __VLS_218 = __VLS_217({
        effect: "dark",
        content: (__VLS_ctx.$t('views.system.resource_management.management')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    const { default: __VLS_221 } = __VLS_219.slots;
    if (__VLS_ctx.ManagePermission()) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_222;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.system.resource_management.management')),
        }));
        const __VLS_224 = __VLS_223({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.system.resource_management.management')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_223));
        let __VLS_227;
        const __VLS_228 = {
            /** @type {typeof __VLS_227.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.ManagePermission()))
                    throw 0;
                return;
                __VLS_ctx.router.push({
                    path: `/knowledge/${row.id}/resource-management/${row.type}/document`,
                });
                // @ts-ignore
                [$t, $t, $t, ManagePermission, router,];
            },
        };
        const { default: __VLS_229 } = __VLS_225.slots;
        let __VLS_230;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
            iconName: "app-admin-operation",
        }));
        const __VLS_232 = __VLS_231({
            iconName: "app-admin-operation",
        }, ...__VLS_functionalComponentArgsRest(__VLS_231));
        // @ts-ignore
        [];
        var __VLS_225;
        var __VLS_226;
    }
    // @ts-ignore
    [];
    var __VLS_219;
    let __VLS_235;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
        effect: "dark",
        content: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
        placement: "top",
    }));
    const __VLS_237 = __VLS_236({
        effect: "dark",
        content: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_236));
    const { default: __VLS_240 } = __VLS_238.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    if (__VLS_ctx.permissionPrecise.vector()) {
        let __VLS_241;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_242 = __VLS_asFunctionalComponent1(__VLS_241, new __VLS_241({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
        }));
        const __VLS_243 = __VLS_242({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.knowledge.setting.vectorization')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_242));
        let __VLS_246;
        const __VLS_247 = {
            /** @type {typeof __VLS_246.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.vector()))
                    throw 0;
                return __VLS_ctx.reEmbeddingKnowledge(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, reEmbeddingKnowledge,];
            },
        };
        const { default: __VLS_248 } = __VLS_244.slots;
        let __VLS_249;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
            iconName: "app-vectorization",
        }));
        const __VLS_251 = __VLS_250({
            iconName: "app-vectorization",
        }, ...__VLS_functionalComponentArgsRest(__VLS_250));
        // @ts-ignore
        [];
        var __VLS_244;
        var __VLS_245;
    }
    // @ts-ignore
    [];
    var __VLS_238;
    if (__VLS_ctx.MoreFilledPermission()) {
        let __VLS_254;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
            trigger: "click",
        }));
        const __VLS_256 = __VLS_255({
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_255));
        const { default: __VLS_259 } = __VLS_257.slots;
        let __VLS_260;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }));
        const __VLS_262 = __VLS_261({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        let __VLS_265;
        const __VLS_266 = {
            /** @type {typeof __VLS_265.click} */
            onClick: () => { },
        };
        const { default: __VLS_267 } = __VLS_263.slots;
        let __VLS_268;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
            iconName: "app-more",
        }));
        const __VLS_270 = __VLS_269({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        // @ts-ignore
        [MoreFilledPermission,];
        var __VLS_263;
        var __VLS_264;
        {
            const { dropdown: __VLS_273 } = __VLS_257.slots;
            let __VLS_274;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({}));
            const __VLS_276 = __VLS_275({}, ...__VLS_functionalComponentArgsRest(__VLS_275));
            const { default: __VLS_279 } = __VLS_277.slots;
            if (row.type === 1 && __VLS_ctx.permissionPrecise.sync()) {
                let __VLS_280;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
                    ...{ 'onClick': {} },
                }));
                const __VLS_282 = __VLS_281({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_281));
                let __VLS_285;
                const __VLS_286 = {
                    /** @type {typeof __VLS_285.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(row.type === 1 && __VLS_ctx.permissionPrecise.sync()))
                            throw 0;
                        return __VLS_ctx.syncKnowledge(row);
                        // @ts-ignore
                        [permissionPrecise, syncKnowledge,];
                    },
                };
                const { default: __VLS_287 } = __VLS_283.slots;
                let __VLS_288;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
                    iconName: "app-sync",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_290 = __VLS_289({
                    iconName: "app-sync",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_289));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.knowledge.setting.sync'));
                // @ts-ignore
                [$t,];
                var __VLS_283;
                var __VLS_284;
            }
            if (__VLS_ctx.permissionPrecise.generate()) {
                let __VLS_293;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_294 = __VLS_asFunctionalComponent1(__VLS_293, new __VLS_293({
                    ...{ 'onClick': {} },
                }));
                const __VLS_295 = __VLS_294({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_294));
                let __VLS_298;
                const __VLS_299 = {
                    /** @type {typeof __VLS_298.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.generate()))
                            throw 0;
                        return __VLS_ctx.openGenerateDialog(row);
                        // @ts-ignore
                        [permissionPrecise, openGenerateDialog,];
                    },
                };
                const { default: __VLS_300 } = __VLS_296.slots;
                let __VLS_301;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
                    iconName: "app-generate-question",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_303 = __VLS_302({
                    iconName: "app-generate-question",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_302));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.document.generateQuestion.title'));
                // @ts-ignore
                [$t,];
                var __VLS_296;
                var __VLS_297;
            }
            if (__VLS_ctx.permissionPrecise.edit()) {
                let __VLS_306;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
                    ...{ 'onClick': {} },
                }));
                const __VLS_308 = __VLS_307({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_307));
                let __VLS_311;
                const __VLS_312 = {
                    /** @type {typeof __VLS_311.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.edit()))
                            throw 0;
                        return;
                        __VLS_ctx.router.push({
                            path: `/knowledge/${row.id}/resource-management/${row.type}/setting`,
                        });
                        // @ts-ignore
                        [router, permissionPrecise,];
                    },
                };
                const { default: __VLS_313 } = __VLS_309.slots;
                let __VLS_314;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_315 = __VLS_asFunctionalComponent1(__VLS_314, new __VLS_314({
                    iconName: "app-setting",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_316 = __VLS_315({
                    iconName: "app-setting",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_315));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.setting'));
                // @ts-ignore
                [$t,];
                var __VLS_309;
                var __VLS_310;
            }
            if (__VLS_ctx.permissionPrecise.auth()) {
                let __VLS_319;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_320 = __VLS_asFunctionalComponent1(__VLS_319, new __VLS_319({
                    ...{ 'onClick': {} },
                }));
                const __VLS_321 = __VLS_320({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_320));
                let __VLS_324;
                const __VLS_325 = {
                    /** @type {typeof __VLS_324.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.auth()))
                            throw 0;
                        return __VLS_ctx.openAuthorization(row);
                        // @ts-ignore
                        [permissionPrecise, openAuthorization,];
                    },
                };
                const { default: __VLS_326 } = __VLS_322.slots;
                let __VLS_327;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_329 = __VLS_328({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_328));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                // @ts-ignore
                [$t,];
                var __VLS_322;
                var __VLS_323;
            }
            if (__VLS_ctx.permissionPrecise.relate_map()) {
                let __VLS_332;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_333 = __VLS_asFunctionalComponent1(__VLS_332, new __VLS_332({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_334 = __VLS_333({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_333));
                let __VLS_337;
                const __VLS_338 = {
                    /** @type {typeof __VLS_337.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.relate_map()))
                            throw 0;
                        return __VLS_ctx.openResourceMappingDrawer(row);
                        // @ts-ignore
                        [permissionPrecise, openResourceMappingDrawer,];
                    },
                };
                const { default: __VLS_339 } = __VLS_335.slots;
                let __VLS_340;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_341 = __VLS_asFunctionalComponent1(__VLS_340, new __VLS_340({
                    iconName: "app-resource-mapping",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_342 = __VLS_341({
                    iconName: "app-resource-mapping",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_341));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceMapping.title'));
                // @ts-ignore
                [$t,];
                var __VLS_335;
                var __VLS_336;
            }
            if (__VLS_ctx.permissionPrecise.export()) {
                let __VLS_345;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_346 = __VLS_asFunctionalComponent1(__VLS_345, new __VLS_345({
                    ...{ 'onClick': {} },
                    divided: true,
                }));
                const __VLS_347 = __VLS_346({
                    ...{ 'onClick': {} },
                    divided: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_346));
                let __VLS_350;
                const __VLS_351 = {
                    /** @type {typeof __VLS_350.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.export()))
                            throw 0;
                        return __VLS_ctx.exportKnowledge(row);
                        // @ts-ignore
                        [permissionPrecise, exportKnowledge,];
                    },
                };
                const { default: __VLS_352 } = __VLS_348.slots;
                let __VLS_353;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_354 = __VLS_asFunctionalComponent1(__VLS_353, new __VLS_353({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_355 = __VLS_354({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_354));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.document.setting.exportDocument'));
                // @ts-ignore
                [$t,];
                var __VLS_348;
                var __VLS_349;
            }
            if (__VLS_ctx.permissionPrecise.export()) {
                let __VLS_358;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_359 = __VLS_asFunctionalComponent1(__VLS_358, new __VLS_358({
                    ...{ 'onClick': {} },
                }));
                const __VLS_360 = __VLS_359({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_359));
                let __VLS_363;
                const __VLS_364 = {
                    /** @type {typeof __VLS_363.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.export()))
                            throw 0;
                        return __VLS_ctx.exportZipKnowledge(row);
                        // @ts-ignore
                        [permissionPrecise, exportZipKnowledge,];
                    },
                };
                const { default: __VLS_365 } = __VLS_361.slots;
                let __VLS_366;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_367 = __VLS_asFunctionalComponent1(__VLS_366, new __VLS_366({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_368 = __VLS_367({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_367));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.document.setting.exportDocument'));
                // @ts-ignore
                [$t,];
                var __VLS_361;
                var __VLS_362;
            }
            if (__VLS_ctx.permissionPrecise.export()) {
                let __VLS_371;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_372 = __VLS_asFunctionalComponent1(__VLS_371, new __VLS_371({
                    ...{ 'onClick': {} },
                }));
                const __VLS_373 = __VLS_372({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_372));
                let __VLS_376;
                const __VLS_377 = {
                    /** @type {typeof __VLS_376.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.export()))
                            throw 0;
                        return __VLS_ctx.exportKnowledgeBundle(row);
                        // @ts-ignore
                        [permissionPrecise, exportKnowledgeBundle,];
                    },
                };
                const { default: __VLS_378 } = __VLS_374.slots;
                let __VLS_379;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_380 = __VLS_asFunctionalComponent1(__VLS_379, new __VLS_379({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_381 = __VLS_380({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_380));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.document.setting.exportKnowledge'));
                // @ts-ignore
                [$t,];
                var __VLS_374;
                var __VLS_375;
            }
            if (__VLS_ctx.permissionPrecise.delete()) {
                let __VLS_384;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_385 = __VLS_asFunctionalComponent1(__VLS_384, new __VLS_384({
                    ...{ 'onClick': {} },
                    divided: true,
                    type: "danger",
                }));
                const __VLS_386 = __VLS_385({
                    ...{ 'onClick': {} },
                    divided: true,
                    type: "danger",
                }, ...__VLS_functionalComponentArgsRest(__VLS_385));
                let __VLS_389;
                const __VLS_390 = {
                    /** @type {typeof __VLS_389.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.delete()))
                            throw 0;
                        return __VLS_ctx.deleteKnowledge(row);
                        // @ts-ignore
                        [permissionPrecise, deleteKnowledge,];
                    },
                };
                const { default: __VLS_391 } = __VLS_387.slots;
                let __VLS_392;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_393 = __VLS_asFunctionalComponent1(__VLS_392, new __VLS_392({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_394 = __VLS_393({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_393));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_387;
                var __VLS_388;
            }
            // @ts-ignore
            [];
            var __VLS_277;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_257;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_212;
// @ts-ignore
[];
var __VLS_83;
var __VLS_84;
// @ts-ignore
[];
var __VLS_21;
const __VLS_397 = SyncWebDialog;
// @ts-ignore
const __VLS_398 = __VLS_asFunctionalComponent1(__VLS_397, new __VLS_397({
    ref: "SyncWebDialogRef",
}));
const __VLS_399 = __VLS_398({
    ref: "SyncWebDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_398));
var __VLS_402;
var __VLS_400;
const __VLS_404 = GenerateRelatedDialog;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent1(__VLS_404, new __VLS_404({
    ref: "GenerateRelatedDialogRef",
    apiType: "systemManage",
}));
const __VLS_406 = __VLS_405({
    ref: "GenerateRelatedDialogRef",
    apiType: "systemManage",
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
var __VLS_409;
var __VLS_407;
const __VLS_411 = ResourceAuthorizationDrawer;
// @ts-ignore
const __VLS_412 = __VLS_asFunctionalComponent1(__VLS_411, new __VLS_411({
    type: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
    ref: "ResourceAuthorizationDrawerRef",
}));
const __VLS_413 = __VLS_412({
    type: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
    ref: "ResourceAuthorizationDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_412));
var __VLS_416;
var __VLS_414;
const __VLS_418 = ResourceMappingDrawer || ResourceMappingDrawer;
// @ts-ignore
const __VLS_419 = __VLS_asFunctionalComponent1(__VLS_418, new __VLS_418({
    ref: "resourceMappingDrawerRef",
}));
const __VLS_420 = __VLS_419({
    ref: "resourceMappingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_419));
var __VLS_423;
var __VLS_421;
// @ts-ignore
var __VLS_403 = __VLS_402, __VLS_410 = __VLS_409, __VLS_417 = __VLS_416, __VLS_424 = __VLS_423;
// @ts-ignore
[SourceTypeEnum,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
