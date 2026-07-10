/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ApplicationResourceApi from '@/api/system-resource-management/application';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import { t } from '@/locales';
import { resetUrl } from '@/utils/common';
import ResourceTriggerDrawer from '@/views/trigger/ResourceTriggerDrawer.vue';
import useStore from '@/stores';
import { datetimeFormat } from '@/utils/time';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import { isWorkFlow } from '@/utils/application.ts';
import UserApi from '@/api/user/user.ts';
import permissionMap from '@/permission';
import { MsgSuccess, MsgConfirm, MsgError } from '@/utils/message';
import { SourceTypeEnum } from '@/enums/common';
const router = useRouter();
const route = useRoute();
const { user, application } = useStore();
const permissionPrecise = computed(() => {
    return permissionMap['application']['systemManage'];
});
const managePermission = () => {
    return (permissionPrecise.value.overview_read() ||
        permissionPrecise.value.access_read() ||
        permissionPrecise.value.edit() ||
        permissionPrecise.value.chat_log_read() ||
        permissionPrecise.value.chat_user_read());
};
const MoreFilledPermission = () => {
    return (permissionPrecise.value.export() ||
        permissionPrecise.value.delete() ||
        permissionPrecise.value.auth() ||
        permissionPrecise.value.trigger_read());
};
const resourceTriggerDrawerRef = ref();
const openTriggerDrawer = (data) => {
    resourceTriggerDrawerRef.value?.open(data);
};
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(item) {
    ResourceAuthorizationDrawerRef.value.open(item.id, undefined, item.workspace_id);
}
const apiInputParams = ref([]);
function toChat(row) {
    row?.work_flow?.nodes
        ?.filter((v) => v.id === 'base-node')
        .map((v) => {
        apiInputParams.value = v.properties.api_input_field_list
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
    });
    const apiParams = mapToUrlParams(apiInputParams.value)
        ? '?' + mapToUrlParams(apiInputParams.value)
        : '';
    ApplicationResourceApi.getAccessToken(row.id, loading).then((res) => {
        window.open(application.location + res?.data?.access_token + apiParams);
    });
}
function mapToUrlParams(map) {
    const params = new URLSearchParams();
    map.forEach((item) => {
        params.append(encodeURIComponent(item.name), encodeURIComponent(item.value));
    });
    return params.toString(); // Return URL QueryString
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
        ApplicationResourceApi.delApplication(row.id, loading).then(() => {
            const index = applicationList.value.findIndex((v) => v.id === row.id);
            applicationList.value.splice(index, 1);
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => {
    });
}
const exportApplication = (application) => {
    ApplicationResourceApi.exportApplication(application.id, application.name, loading).catch((e) => {
        if (e.response.status !== 403) {
            e.response.data.text().then((res) => {
                MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
            });
        }
    });
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
        label: t('views.application.senior'),
        value: 'WORK_FLOW',
    },
    {
        label: t('views.application.simple'),
        value: 'SIMPLE',
    },
]);
const loading = ref(false);
const applicationList = ref([]);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const workspaceOptions = ref([]);
const workspaceVisible = ref(false);
const workspaceArr = ref([]);
const statusVisible = ref(false);
const statusArr = ref([]);
const statusOptions = ref([
    {
        label: t('common.status.published'),
        value: true,
    },
    {
        label: t('common.status.unpublished'),
        value: false,
    },
]);
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
function filterStatusChange(val) {
    if (val === 'clear') {
        statusArr.value = [];
    }
    getList();
    statusVisible.value = false;
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
    search_form.value = { name: '', create_user: '', type: '' };
};
function getList() {
    const params = {};
    if (search_form.value[search_type.value]) {
        params[search_type.value] = search_form.value[search_type.value];
    }
    if (workspaceArr.value.length > 0) {
        params['workspace_ids'] = JSON.stringify(workspaceArr.value);
    }
    if (statusArr.value.length > 0) {
        params['status'] = JSON.stringify(statusArr.value);
    }
    ApplicationResourceApi.getApplication(paginationConfig, params, loading).then((res) => {
        paginationConfig.total = res.data?.total;
        applicationList.value = res.data?.records;
    });
}
function getUserList(query) {
    UserApi.getAllMemberList(query ? { nick_name: query } : '')
        .then((res) => {
        user_options.value = res.data || [];
    })
        .catch(() => {
        user_options.value = [];
    });
}
onMounted(() => {
    getWorkspaceList();
    getList();
    getUserList('');
});
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
(__VLS_ctx.t('views.application.title'));
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
        clearable: true,
        filterable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        clearable: true,
        filterable: true,
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
    data: (__VLS_ctx.applicationList),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (260),
}));
const __VLS_82 = __VLS_81({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.applicationList),
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
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        shape: "square",
        size: (24),
        ...{ style: {} },
    }));
    const __VLS_104 = __VLS_103({
        shape: "square",
        size: (24),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    const { default: __VLS_107 } = __VLS_105.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(row?.icon)),
        alt: "",
    });
    // @ts-ignore
    [$t, getList, getList, applicationList, paginationConfig, resetUrl,];
    var __VLS_105;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.name);
    // @ts-ignore
    [];
    var __VLS_99;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_92;
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    prop: "tool_type",
    label: (__VLS_ctx.$t('common.type')),
    width: "100",
}));
const __VLS_110 = __VLS_109({
    prop: "tool_type",
    label: (__VLS_ctx.$t('common.type')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const { default: __VLS_113 } = __VLS_111.slots;
{
    const { default: __VLS_114 } = __VLS_111.slots;
    const [scope] = __VLS_vSlot(__VLS_114);
    if (__VLS_ctx.isWorkFlow(scope.row.type)) {
        let __VLS_115;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
            size: "small",
            ...{ class: "warning-tag" },
        }));
        const __VLS_117 = __VLS_116({
            size: "small",
            ...{ class: "warning-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_116));
        /** @type {__VLS_StyleScopedClasses['warning-tag']} */ ;
        const { default: __VLS_120 } = __VLS_118.slots;
        (__VLS_ctx.$t('views.application.senior'));
        // @ts-ignore
        [$t, $t, isWorkFlow,];
        var __VLS_118;
    }
    else {
        let __VLS_121;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
            size: "small",
            ...{ class: "blue-tag" },
        }));
        const __VLS_123 = __VLS_122({
            size: "small",
            ...{ class: "blue-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_122));
        /** @type {__VLS_StyleScopedClasses['blue-tag']} */ ;
        const { default: __VLS_126 } = __VLS_124.slots;
        (__VLS_ctx.$t('views.application.simple'));
        // @ts-ignore
        [$t,];
        var __VLS_124;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_111;
let __VLS_127;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    width: "150",
    prop: "is_publish",
    label: (__VLS_ctx.$t('common.status.label')),
    showOverflowTooltip: true,
}));
const __VLS_129 = __VLS_128({
    width: "150",
    prop: "is_publish",
    label: (__VLS_ctx.$t('common.status.label')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
const { default: __VLS_132 } = __VLS_130.slots;
{
    const { header: __VLS_133 } = __VLS_130.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('common.status.label'));
    let __VLS_134;
    /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
    elPopover;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
        width: (100),
        trigger: "click",
        visible: (__VLS_ctx.statusVisible),
        persistent: (false),
    }));
    const __VLS_136 = __VLS_135({
        width: (100),
        trigger: "click",
        visible: (__VLS_ctx.statusVisible),
        persistent: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    const { default: __VLS_139 } = __VLS_137.slots;
    {
        const { reference: __VLS_140 } = __VLS_137.slots;
        let __VLS_141;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
            ...{ 'onClick': {} },
            ...{ style: {} },
            type: (__VLS_ctx.statusArr && __VLS_ctx.statusArr.length > 0 ? 'primary' : ''),
            link: true,
        }));
        const __VLS_143 = __VLS_142({
            ...{ 'onClick': {} },
            ...{ style: {} },
            type: (__VLS_ctx.statusArr && __VLS_ctx.statusArr.length > 0 ? 'primary' : ''),
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        let __VLS_146;
        const __VLS_147 = {
            /** @type {typeof __VLS_146.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.statusVisible = !__VLS_ctx.statusVisible;
                // @ts-ignore
                [$t, $t, statusVisible, statusVisible, statusVisible, statusArr, statusArr,];
            },
        };
        const { default: __VLS_148 } = __VLS_144.slots;
        let __VLS_149;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({}));
        const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
        const { default: __VLS_154 } = __VLS_152.slots;
        let __VLS_155;
        /** @ts-ignore @type { | typeof __VLS_components.Filter} */
        Filter;
        // @ts-ignore
        const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({}));
        const __VLS_157 = __VLS_156({}, ...__VLS_functionalComponentArgsRest(__VLS_156));
        // @ts-ignore
        [];
        var __VLS_152;
        // @ts-ignore
        [];
        var __VLS_144;
        var __VLS_145;
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "filter" },
    });
    /** @type {__VLS_StyleScopedClasses['filter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-item mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_160;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
    elCheckboxGroup;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
        modelValue: (__VLS_ctx.statusArr),
        ...{ style: {} },
    }));
    const __VLS_162 = __VLS_161({
        modelValue: (__VLS_ctx.statusArr),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    const { default: __VLS_165 } = __VLS_163.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.statusOptions))) {
        let __VLS_166;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }));
        const __VLS_168 = __VLS_167({
            key: (item.value),
            label: (item.label),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_167));
        // @ts-ignore
        [statusArr, statusOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_163;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-right" },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    let __VLS_171;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_173 = __VLS_172({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    let __VLS_176;
    const __VLS_177 = {
        /** @type {typeof __VLS_176.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.filterStatusChange('clear');
            // @ts-ignore
            [filterStatusChange,];
        },
    };
    const { default: __VLS_178 } = __VLS_174.slots;
    (__VLS_ctx.$t('common.clear'));
    // @ts-ignore
    [$t,];
    var __VLS_174;
    var __VLS_175;
    let __VLS_179;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
    }));
    const __VLS_181 = __VLS_180({
        ...{ 'onClick': {} },
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    let __VLS_184;
    const __VLS_185 = {
        /** @type {typeof __VLS_184.click} */
        onClick: (__VLS_ctx.filterStatusChange),
    };
    const { default: __VLS_186 } = __VLS_182.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, filterStatusChange,];
    var __VLS_182;
    var __VLS_183;
    // @ts-ignore
    [];
    var __VLS_137;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_187 } = __VLS_130.slots;
    const [scope] = __VLS_vSlot(__VLS_187);
    if (scope.row.is_publish) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_188;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_190 = __VLS_189({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_193 } = __VLS_191.slots;
        let __VLS_194;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({}));
        const __VLS_196 = __VLS_195({}, ...__VLS_functionalComponentArgsRest(__VLS_195));
        // @ts-ignore
        [];
        var __VLS_191;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.published'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_199;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_201 = __VLS_200({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_200));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.unpublished'));
    }
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_130;
if (__VLS_ctx.user.isEE()) {
    let __VLS_204;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }));
    const __VLS_206 = __VLS_205({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    const { default: __VLS_209 } = __VLS_207.slots;
    {
        const { header: __VLS_210 } = __VLS_207.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.workspace.title'));
        let __VLS_211;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }));
        const __VLS_213 = __VLS_212({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_212));
        const { default: __VLS_216 } = __VLS_214.slots;
        {
            const { reference: __VLS_217 } = __VLS_214.slots;
            let __VLS_218;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }));
            const __VLS_220 = __VLS_219({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_219));
            let __VLS_223;
            const __VLS_224 = {
                /** @type {typeof __VLS_223.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.user.isEE()))
                        throw 0;
                    return __VLS_ctx.workspaceVisible = !__VLS_ctx.workspaceVisible;
                    // @ts-ignore
                    [$t, $t, user, workspaceVisible, workspaceVisible, workspaceVisible, workspaceArr, workspaceArr,];
                },
            };
            const { default: __VLS_225 } = __VLS_221.slots;
            let __VLS_226;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({}));
            const __VLS_228 = __VLS_227({}, ...__VLS_functionalComponentArgsRest(__VLS_227));
            const { default: __VLS_231 } = __VLS_229.slots;
            let __VLS_232;
            /** @ts-ignore @type { | typeof __VLS_components.Filter} */
            Filter;
            // @ts-ignore
            const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({}));
            const __VLS_234 = __VLS_233({}, ...__VLS_functionalComponentArgsRest(__VLS_233));
            // @ts-ignore
            [];
            var __VLS_229;
            // @ts-ignore
            [];
            var __VLS_221;
            var __VLS_222;
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
        let __VLS_237;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }));
        const __VLS_239 = __VLS_238({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        if (__VLS_ctx.filterData.length) {
            let __VLS_242;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
                height: "300",
            }));
            const __VLS_244 = __VLS_243({
                height: "300",
            }, ...__VLS_functionalComponentArgsRest(__VLS_243));
            const { default: __VLS_247 } = __VLS_245.slots;
            let __VLS_248;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
            elCheckboxGroup;
            // @ts-ignore
            const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }));
            const __VLS_250 = __VLS_249({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_249));
            const { default: __VLS_253 } = __VLS_251.slots;
            for (const [item] of __VLS_vFor((__VLS_ctx.filterData))) {
                let __VLS_254;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                elCheckbox;
                // @ts-ignore
                const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }));
                const __VLS_256 = __VLS_255({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_255));
                // @ts-ignore
                [$t, workspaceArr, filterText, filterData, filterData,];
            }
            // @ts-ignore
            [];
            var __VLS_251;
            // @ts-ignore
            [];
            var __VLS_245;
        }
        else {
            let __VLS_259;
            /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
            elEmpty;
            // @ts-ignore
            const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
                description: (__VLS_ctx.$t('common.noData')),
            }));
            const __VLS_261 = __VLS_260({
                description: (__VLS_ctx.$t('common.noData')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_260));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        let __VLS_264;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_266 = __VLS_265({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        let __VLS_269;
        const __VLS_270 = {
            /** @type {typeof __VLS_269.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.user.isEE()))
                    throw 0;
                return __VLS_ctx.filterWorkspaceChange('clear');
                // @ts-ignore
                [$t, filterWorkspaceChange,];
            },
        };
        const { default: __VLS_271 } = __VLS_267.slots;
        (__VLS_ctx.$t('common.clear'));
        // @ts-ignore
        [$t,];
        var __VLS_267;
        var __VLS_268;
        let __VLS_272;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }));
        const __VLS_274 = __VLS_273({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
        let __VLS_277;
        const __VLS_278 = {
            /** @type {typeof __VLS_277.click} */
            onClick: (__VLS_ctx.filterWorkspaceChange),
        };
        const { default: __VLS_279 } = __VLS_275.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, filterWorkspaceChange,];
        var __VLS_275;
        var __VLS_276;
        // @ts-ignore
        [];
        var __VLS_214;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_207;
}
let __VLS_280;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}));
const __VLS_282 = __VLS_281({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
let __VLS_285;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
    label: (__VLS_ctx.$t('views.application.publishTime')),
    width: "180",
}));
const __VLS_287 = __VLS_286({
    label: (__VLS_ctx.$t('views.application.publishTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_286));
const { default: __VLS_290 } = __VLS_288.slots;
{
    const { default: __VLS_291 } = __VLS_288.slots;
    const [{ row }] = __VLS_vSlot(__VLS_291);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_288;
let __VLS_292;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}));
const __VLS_294 = __VLS_293({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
const { default: __VLS_297 } = __VLS_295.slots;
{
    const { default: __VLS_298 } = __VLS_295.slots;
    const [{ row }] = __VLS_vSlot(__VLS_298);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_295;
let __VLS_299;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_300 = __VLS_asFunctionalComponent1(__VLS_299, new __VLS_299({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "120",
    fixed: "right",
}));
const __VLS_301 = __VLS_300({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "120",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_300));
const { default: __VLS_304 } = __VLS_302.slots;
{
    const { default: __VLS_305 } = __VLS_302.slots;
    const [{ row }] = __VLS_vSlot(__VLS_305);
    let __VLS_306;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.operation.toChat')),
        placement: "top",
    }));
    const __VLS_308 = __VLS_307({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.operation.toChat')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    const { default: __VLS_311 } = __VLS_309.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    let __VLS_312;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent1(__VLS_312, new __VLS_312({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        title: (__VLS_ctx.$t('views.application.operation.toChat')),
    }));
    const __VLS_314 = __VLS_313({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        title: (__VLS_ctx.$t('views.application.operation.toChat')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    let __VLS_317;
    const __VLS_318 = {
        /** @type {typeof __VLS_317.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.toChat(row);
            // @ts-ignore
            [$t, $t, $t, toChat,];
        },
    };
    const { default: __VLS_319 } = __VLS_315.slots;
    let __VLS_320;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_321 = __VLS_asFunctionalComponent1(__VLS_320, new __VLS_320({
        iconName: "app-create-chat",
    }));
    const __VLS_322 = __VLS_321({
        iconName: "app-create-chat",
    }, ...__VLS_functionalComponentArgsRest(__VLS_321));
    // @ts-ignore
    [];
    var __VLS_315;
    var __VLS_316;
    // @ts-ignore
    [];
    var __VLS_309;
    if (__VLS_ctx.managePermission()) {
        let __VLS_325;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_326 = __VLS_asFunctionalComponent1(__VLS_325, new __VLS_325({
            effect: "dark",
            content: (__VLS_ctx.$t('views.system.resource_management.management')),
            placement: "top",
        }));
        const __VLS_327 = __VLS_326({
            effect: "dark",
            content: (__VLS_ctx.$t('views.system.resource_management.management')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_326));
        const { default: __VLS_330 } = __VLS_328.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_331;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.system.resource_management.management')),
        }));
        const __VLS_333 = __VLS_332({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.system.resource_management.management')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_332));
        let __VLS_336;
        const __VLS_337 = {
            /** @type {typeof __VLS_336.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.managePermission()))
                    throw 0;
                return;
                __VLS_ctx.router.push({
                    path: `/application/resource-management/${row.id}/${row.type}/overview`,
                });
                // @ts-ignore
                [$t, $t, managePermission, router,];
            },
        };
        const { default: __VLS_338 } = __VLS_334.slots;
        let __VLS_339;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
            iconName: "app-admin-operation",
        }));
        const __VLS_341 = __VLS_340({
            iconName: "app-admin-operation",
        }, ...__VLS_functionalComponentArgsRest(__VLS_340));
        // @ts-ignore
        [];
        var __VLS_334;
        var __VLS_335;
        // @ts-ignore
        [];
        var __VLS_328;
    }
    if (__VLS_ctx.MoreFilledPermission()) {
        let __VLS_344;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_345 = __VLS_asFunctionalComponent1(__VLS_344, new __VLS_344({
            trigger: "click",
        }));
        const __VLS_346 = __VLS_345({
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_345));
        const { default: __VLS_349 } = __VLS_347.slots;
        let __VLS_350;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }));
        const __VLS_352 = __VLS_351({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_351));
        let __VLS_355;
        const __VLS_356 = {
            /** @type {typeof __VLS_355.click} */
            onClick: () => { },
        };
        const { default: __VLS_357 } = __VLS_353.slots;
        let __VLS_358;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_359 = __VLS_asFunctionalComponent1(__VLS_358, new __VLS_358({
            iconName: "app-more",
        }));
        const __VLS_360 = __VLS_359({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_359));
        // @ts-ignore
        [MoreFilledPermission,];
        var __VLS_353;
        var __VLS_354;
        {
            const { dropdown: __VLS_363 } = __VLS_347.slots;
            let __VLS_364;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_365 = __VLS_asFunctionalComponent1(__VLS_364, new __VLS_364({}));
            const __VLS_366 = __VLS_365({}, ...__VLS_functionalComponentArgsRest(__VLS_365));
            const { default: __VLS_369 } = __VLS_367.slots;
            if (__VLS_ctx.permissionPrecise.auth()) {
                let __VLS_370;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_371 = __VLS_asFunctionalComponent1(__VLS_370, new __VLS_370({
                    ...{ 'onClick': {} },
                }));
                const __VLS_372 = __VLS_371({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_371));
                let __VLS_375;
                const __VLS_376 = {
                    /** @type {typeof __VLS_375.click} */
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
                const { default: __VLS_377 } = __VLS_373.slots;
                let __VLS_378;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_379 = __VLS_asFunctionalComponent1(__VLS_378, new __VLS_378({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_380 = __VLS_379({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_379));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                // @ts-ignore
                [$t,];
                var __VLS_373;
                var __VLS_374;
            }
            if (__VLS_ctx.permissionPrecise.export()) {
                let __VLS_383;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_384 = __VLS_asFunctionalComponent1(__VLS_383, new __VLS_383({
                    ...{ 'onClick': {} },
                }));
                const __VLS_385 = __VLS_384({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_384));
                let __VLS_388;
                const __VLS_389 = {
                    /** @type {typeof __VLS_388.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.export()))
                            throw 0;
                        return __VLS_ctx.exportApplication(row);
                        // @ts-ignore
                        [permissionPrecise, exportApplication,];
                    },
                };
                const { default: __VLS_390 } = __VLS_386.slots;
                let __VLS_391;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_392 = __VLS_asFunctionalComponent1(__VLS_391, new __VLS_391({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_393 = __VLS_392({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_392));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.export'));
                // @ts-ignore
                [$t,];
                var __VLS_386;
                var __VLS_387;
            }
            if (__VLS_ctx.permissionPrecise.trigger_read()) {
                let __VLS_396;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_397 = __VLS_asFunctionalComponent1(__VLS_396, new __VLS_396({
                    ...{ 'onClick': {} },
                    disabled: (!row.is_publish),
                }));
                const __VLS_398 = __VLS_397({
                    ...{ 'onClick': {} },
                    disabled: (!row.is_publish),
                }, ...__VLS_functionalComponentArgsRest(__VLS_397));
                let __VLS_401;
                const __VLS_402 = {
                    /** @type {typeof __VLS_401.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.trigger_read()))
                            throw 0;
                        return __VLS_ctx.openTriggerDrawer(row);
                        // @ts-ignore
                        [permissionPrecise, openTriggerDrawer,];
                    },
                };
                const { default: __VLS_403 } = __VLS_399.slots;
                let __VLS_404;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_405 = __VLS_asFunctionalComponent1(__VLS_404, new __VLS_404({
                    iconName: "app-trigger",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_406 = __VLS_405({
                    iconName: "app-trigger",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_405));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.trigger.title'));
                // @ts-ignore
                [$t,];
                var __VLS_399;
                var __VLS_400;
            }
            if (__VLS_ctx.permissionPrecise.delete()) {
                let __VLS_409;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_410 = __VLS_asFunctionalComponent1(__VLS_409, new __VLS_409({
                    ...{ 'onClick': {} },
                }));
                const __VLS_411 = __VLS_410({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_410));
                let __VLS_414;
                const __VLS_415 = {
                    /** @type {typeof __VLS_414.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.delete()))
                            throw 0;
                        return __VLS_ctx.deleteApplication(row);
                        // @ts-ignore
                        [permissionPrecise, deleteApplication,];
                    },
                };
                const { default: __VLS_416 } = __VLS_412.slots;
                let __VLS_417;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_418 = __VLS_asFunctionalComponent1(__VLS_417, new __VLS_417({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_419 = __VLS_418({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_418));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_412;
                var __VLS_413;
            }
            // @ts-ignore
            [];
            var __VLS_367;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_347;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_302;
// @ts-ignore
[];
var __VLS_83;
var __VLS_84;
// @ts-ignore
[];
var __VLS_21;
const __VLS_422 = ResourceAuthorizationDrawer;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent1(__VLS_422, new __VLS_422({
    type: (__VLS_ctx.SourceTypeEnum.APPLICATION),
    ref: "ResourceAuthorizationDrawerRef",
}));
const __VLS_424 = __VLS_423({
    type: (__VLS_ctx.SourceTypeEnum.APPLICATION),
    ref: "ResourceAuthorizationDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
var __VLS_427;
var __VLS_425;
const __VLS_429 = ResourceTriggerDrawer || ResourceTriggerDrawer;
// @ts-ignore
const __VLS_430 = __VLS_asFunctionalComponent1(__VLS_429, new __VLS_429({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
}));
const __VLS_431 = __VLS_430({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.APPLICATION),
}, ...__VLS_functionalComponentArgsRest(__VLS_430));
var __VLS_434;
var __VLS_432;
// @ts-ignore
var __VLS_428 = __VLS_427, __VLS_435 = __VLS_434;
// @ts-ignore
[SourceTypeEnum, SourceTypeEnum,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
