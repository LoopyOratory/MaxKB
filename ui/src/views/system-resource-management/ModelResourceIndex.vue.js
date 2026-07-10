/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, watch, computed } from 'vue';
import EditModel from '@/views/model/component/EditModel.vue';
import ParamSettingDialog from '@/views/model/component/ParamSettingDialog.vue';
import ModelResourceApi from '@/api/system-resource-management/model';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import { SourceTypeEnum } from '@/enums/common';
import { modelTypeList } from '@/views/model/component/data';
import { modelType } from '@/enums/model';
import { t } from '@/locales';
import useStore from '@/stores';
import { datetimeFormat } from '@/utils/time';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import UserApi from '@/api/user/user.ts';
import permissionMap from '@/permission';
import { MsgConfirm, MsgSuccess } from '@/utils/message';
import ResourceMappingDrawer from '@/components/resource_mapping/index.vue';
const { user, model } = useStore();
const search_type = ref('name');
const model_search_form = ref({
    name: '',
    create_user: '',
    model_type: '',
});
const loading = ref(false);
const modelList = ref([]);
const user_options = ref([]);
const provider_list = ref([]);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const MoreFilledPermission = () => {
    return (permissionPrecise.value.delete() ||
        permissionPrecise.value.modify() ||
        permissionPrecise.value.relate_map());
};
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(item) {
    ResourceAuthorizationDrawerRef.value.open(item.id, undefined, item.workspace_id);
}
const deleteModel = (row) => {
    MsgConfirm(`${t('views.model.delete.confirmTitle')}${row.name} ?`, row.resource_count > 0
        ? t('views.model.delete.resourceCountMessage', { count: row.resource_count })
        : '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        ModelResourceApi.deleteModel(row.id).then(() => {
            getList();
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => { });
};
const paramSettingRef = ref();
const openParamSetting = (row) => {
    paramSettingRef.value?.open(row);
};
const editModelRef = ref();
const openEditModel = (row) => {
    const provider = provider_list.value.find((p) => p.provider === row.provider);
    if (provider) {
        editModelRef.value?.open(provider, row);
    }
};
const permissionPrecise = computed(() => {
    return permissionMap['model']['systemManage'];
});
const workspaceOptions = ref([]);
const workspaceVisible = ref(false);
const workspaceArr = ref([]);
const getRowProvider = computed(() => {
    return (row) => {
        return provider_list.value.find((p) => p.provider === row.provider);
    };
});
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
    model_search_form.value = { name: '', create_user: '', model_type: '' };
};
function getRequestParams() {
    const obj = {
        name: model_search_form.value.name,
        create_user: model_search_form.value.create_user,
        model_type: model_search_form.value.model_type,
    };
    if (workspaceArr.value.length > 0) {
        obj['workspace_ids'] = JSON.stringify(workspaceArr.value);
    }
    return obj;
}
function getList() {
    ModelResourceApi.getModelListPage(paginationConfig, getRequestParams(), loading).then((res) => {
        paginationConfig.total = res.data?.total;
        modelList.value = res.data?.records;
    });
}
function getProvider() {
    model.asyncGetProvider(loading).then((res) => {
        provider_list.value = res?.data;
        getList();
    });
}
const resourceMappingDrawerRef = ref();
const openResourceMappingDrawer = (model) => {
    resourceMappingDrawerRef.value?.open('MODEL', model);
};
onMounted(() => {
    getWorkspaceList();
    getProvider();
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
(__VLS_ctx.t('views.model.title'));
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
    label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
    value: "model_type",
}));
const __VLS_39 = __VLS_38({
    label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
    value: "model_type",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    label: (__VLS_ctx.$t('views.model.modelForm.modeName.label')),
    value: "name",
}));
const __VLS_44 = __VLS_43({
    label: (__VLS_ctx.$t('views.model.modelForm.modeName.label')),
    value: "name",
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
        modelValue: (__VLS_ctx.model_search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.model_search_form.name),
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
        modelValue: (__VLS_ctx.model_search_form.create_user),
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.model_search_form.create_user),
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
        [search_type, search_type, $t, model_search_form, model_search_form, getList, getList, getUserList, user_options,];
    }
    // @ts-ignore
    [];
    var __VLS_57;
    var __VLS_58;
}
else if (__VLS_ctx.search_type === 'model_type') {
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.model_search_form.model_type),
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_69 = __VLS_68({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.model_search_form.model_type),
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    let __VLS_72;
    const __VLS_73 = {
        /** @type {typeof __VLS_72.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_74 } = __VLS_70.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.modelTypeList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (item.value),
        });
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            label: (item.text),
            value: (item.value),
        }));
        const __VLS_77 = __VLS_76({
            label: (item.text),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        // @ts-ignore
        [search_type, model_search_form, getList, modelTypeList,];
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
    data: (__VLS_ctx.modelList),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (260),
}));
const __VLS_82 = __VLS_81({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.modelList),
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
        innerHTML: (__VLS_ctx.getRowProvider(row)?.icon),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.name);
    // @ts-ignore
    [$t, getList, getList, modelList, paginationConfig, getRowProvider,];
    var __VLS_99;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_92;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    prop: "provider",
    label: (__VLS_ctx.$t('views.model.provider')),
    showOverflowTooltip: true,
    width: "160",
}));
const __VLS_104 = __VLS_103({
    prop: "provider",
    label: (__VLS_ctx.$t('views.model.provider')),
    showOverflowTooltip: true,
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const { default: __VLS_107 } = __VLS_105.slots;
{
    const { default: __VLS_108 } = __VLS_105.slots;
    const [{ row }] = __VLS_vSlot(__VLS_108);
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
        size: (8),
    }));
    const __VLS_111 = __VLS_110({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    const { default: __VLS_114 } = __VLS_112.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
        innerHTML: (__VLS_ctx.getRowProvider(row)?.icon),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.getRowProvider(row)?.name);
    // @ts-ignore
    [$t, getRowProvider, getRowProvider,];
    var __VLS_112;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_105;
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    width: "120",
    label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
}));
const __VLS_117 = __VLS_116({
    width: "120",
    label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
const { default: __VLS_120 } = __VLS_118.slots;
{
    const { default: __VLS_121 } = __VLS_118.slots;
    const [{ row }] = __VLS_vSlot(__VLS_121);
    (__VLS_ctx.$t(__VLS_ctx.modelType[row.model_type]));
    // @ts-ignore
    [$t, $t, modelType, modelType,];
}
// @ts-ignore
[];
var __VLS_118;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    width: "220",
    label: (__VLS_ctx.$t('views.model.modelForm.base_model.label')),
    showOverflowTooltip: true,
}));
const __VLS_124 = __VLS_123({
    width: "220",
    label: (__VLS_ctx.$t('views.model.modelForm.base_model.label')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const { default: __VLS_127 } = __VLS_125.slots;
{
    const { default: __VLS_128 } = __VLS_125.slots;
    const [{ row }] = __VLS_vSlot(__VLS_128);
    (row.model_name);
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_125;
if (__VLS_ctx.user.isEE()) {
    let __VLS_129;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }));
    const __VLS_131 = __VLS_130({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    const { default: __VLS_134 } = __VLS_132.slots;
    {
        const { header: __VLS_135 } = __VLS_132.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.workspace.title'));
        let __VLS_136;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }));
        const __VLS_138 = __VLS_137({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        const { default: __VLS_141 } = __VLS_139.slots;
        {
            const { reference: __VLS_142 } = __VLS_139.slots;
            let __VLS_143;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }));
            const __VLS_145 = __VLS_144({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_144));
            let __VLS_148;
            const __VLS_149 = {
                /** @type {typeof __VLS_148.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.user.isEE()))
                        throw 0;
                    return __VLS_ctx.workspaceVisible = !__VLS_ctx.workspaceVisible;
                    // @ts-ignore
                    [$t, $t, user, workspaceVisible, workspaceVisible, workspaceVisible, workspaceArr, workspaceArr,];
                },
            };
            const { default: __VLS_150 } = __VLS_146.slots;
            let __VLS_151;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({}));
            const __VLS_153 = __VLS_152({}, ...__VLS_functionalComponentArgsRest(__VLS_152));
            const { default: __VLS_156 } = __VLS_154.slots;
            let __VLS_157;
            /** @ts-ignore @type { | typeof __VLS_components.Filter} */
            Filter;
            // @ts-ignore
            const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({}));
            const __VLS_159 = __VLS_158({}, ...__VLS_functionalComponentArgsRest(__VLS_158));
            // @ts-ignore
            [];
            var __VLS_154;
            // @ts-ignore
            [];
            var __VLS_146;
            var __VLS_147;
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
        let __VLS_162;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }));
        const __VLS_164 = __VLS_163({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_163));
        if (__VLS_ctx.filterData.length) {
            let __VLS_167;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
                height: "300",
            }));
            const __VLS_169 = __VLS_168({
                height: "300",
            }, ...__VLS_functionalComponentArgsRest(__VLS_168));
            const { default: __VLS_172 } = __VLS_170.slots;
            let __VLS_173;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
            elCheckboxGroup;
            // @ts-ignore
            const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }));
            const __VLS_175 = __VLS_174({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_174));
            const { default: __VLS_178 } = __VLS_176.slots;
            for (const [item] of __VLS_vFor((__VLS_ctx.filterData))) {
                let __VLS_179;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                elCheckbox;
                // @ts-ignore
                const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }));
                const __VLS_181 = __VLS_180({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_180));
                // @ts-ignore
                [$t, workspaceArr, filterText, filterData, filterData,];
            }
            // @ts-ignore
            [];
            var __VLS_176;
            // @ts-ignore
            [];
            var __VLS_170;
        }
        else {
            let __VLS_184;
            /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
            elEmpty;
            // @ts-ignore
            const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
                description: (__VLS_ctx.$t('common.noData')),
            }));
            const __VLS_186 = __VLS_185({
                description: (__VLS_ctx.$t('common.noData')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        let __VLS_189;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_191 = __VLS_190({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_190));
        let __VLS_194;
        const __VLS_195 = {
            /** @type {typeof __VLS_194.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.user.isEE()))
                    throw 0;
                return __VLS_ctx.filterWorkspaceChange('clear');
                // @ts-ignore
                [$t, filterWorkspaceChange,];
            },
        };
        const { default: __VLS_196 } = __VLS_192.slots;
        (__VLS_ctx.$t('common.clear'));
        // @ts-ignore
        [$t,];
        var __VLS_192;
        var __VLS_193;
        let __VLS_197;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }));
        const __VLS_199 = __VLS_198({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_198));
        let __VLS_202;
        const __VLS_203 = {
            /** @type {typeof __VLS_202.click} */
            onClick: (__VLS_ctx.filterWorkspaceChange),
        };
        const { default: __VLS_204 } = __VLS_200.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, filterWorkspaceChange,];
        var __VLS_200;
        var __VLS_201;
        // @ts-ignore
        [];
        var __VLS_139;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_132;
}
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}));
const __VLS_207 = __VLS_206({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
let __VLS_210;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "180",
}));
const __VLS_212 = __VLS_211({
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
const { default: __VLS_215 } = __VLS_213.slots;
{
    const { default: __VLS_216 } = __VLS_213.slots;
    const [{ row }] = __VLS_vSlot(__VLS_216);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_213;
let __VLS_217;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}));
const __VLS_219 = __VLS_218({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
const { default: __VLS_222 } = __VLS_220.slots;
{
    const { default: __VLS_223 } = __VLS_220.slots;
    const [{ row }] = __VLS_vSlot(__VLS_223);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_220;
let __VLS_224;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "120",
    fixed: "right",
}));
const __VLS_226 = __VLS_225({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "120",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
const { default: __VLS_229 } = __VLS_227.slots;
{
    const { default: __VLS_230 } = __VLS_227.slots;
    const [{ row }] = __VLS_vSlot(__VLS_230);
    if (__VLS_ctx.permissionPrecise.modify()) {
        let __VLS_231;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }));
        const __VLS_233 = __VLS_232({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_232));
        const { default: __VLS_236 } = __VLS_234.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_237;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.modify')),
        }));
        const __VLS_239 = __VLS_238({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.modify')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        let __VLS_242;
        const __VLS_243 = {
            /** @type {typeof __VLS_242.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.modify()))
                    throw 0;
                return __VLS_ctx.openEditModel(row);
                // @ts-ignore
                [$t, $t, $t, permissionPrecise, openEditModel,];
            },
        };
        const { default: __VLS_244 } = __VLS_240.slots;
        let __VLS_245;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
            iconName: "app-edit",
        }));
        const __VLS_247 = __VLS_246({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_246));
        // @ts-ignore
        [];
        var __VLS_240;
        var __VLS_241;
        // @ts-ignore
        [];
        var __VLS_234;
    }
    if (__VLS_ctx.permissionPrecise.auth()) {
        let __VLS_250;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
            effect: "dark",
            content: (__VLS_ctx.$t('views.system.resourceAuthorization.title')),
            placement: "top",
        }));
        const __VLS_252 = __VLS_251({
            effect: "dark",
            content: (__VLS_ctx.$t('views.system.resourceAuthorization.title')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_251));
        const { default: __VLS_255 } = __VLS_253.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_256;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.system.resourceAuthorization.title')),
        }));
        const __VLS_258 = __VLS_257({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.system.resourceAuthorization.title')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        let __VLS_261;
        const __VLS_262 = {
            /** @type {typeof __VLS_261.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.auth()))
                    throw 0;
                return __VLS_ctx.openAuthorization(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, openAuthorization,];
            },
        };
        const { default: __VLS_263 } = __VLS_259.slots;
        let __VLS_264;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
            iconName: "app-resource-authorization",
        }));
        const __VLS_266 = __VLS_265({
            iconName: "app-resource-authorization",
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        // @ts-ignore
        [];
        var __VLS_259;
        var __VLS_260;
        // @ts-ignore
        [];
        var __VLS_253;
    }
    if (__VLS_ctx.MoreFilledPermission()) {
        let __VLS_269;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_270 = __VLS_asFunctionalComponent1(__VLS_269, new __VLS_269({
            trigger: "click",
        }));
        const __VLS_271 = __VLS_270({
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_270));
        const { default: __VLS_274 } = __VLS_272.slots;
        let __VLS_275;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }));
        const __VLS_277 = __VLS_276({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_276));
        let __VLS_280;
        const __VLS_281 = {
            /** @type {typeof __VLS_280.click} */
            onClick: () => { },
        };
        const { default: __VLS_282 } = __VLS_278.slots;
        let __VLS_283;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
            iconName: "app-more",
        }));
        const __VLS_285 = __VLS_284({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_284));
        // @ts-ignore
        [MoreFilledPermission,];
        var __VLS_278;
        var __VLS_279;
        {
            const { dropdown: __VLS_288 } = __VLS_272.slots;
            let __VLS_289;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({}));
            const __VLS_291 = __VLS_290({}, ...__VLS_functionalComponentArgsRest(__VLS_290));
            const { default: __VLS_294 } = __VLS_292.slots;
            if (['TTS', 'LLM', 'IMAGE', 'TTI', 'STT', 'EMBEDDING'].includes(row.model_type) &&
                __VLS_ctx.permissionPrecise.paramSetting()) {
                let __VLS_295;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_296 = __VLS_asFunctionalComponent1(__VLS_295, new __VLS_295({
                    ...{ 'onClick': {} },
                }));
                const __VLS_297 = __VLS_296({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_296));
                let __VLS_300;
                const __VLS_301 = {
                    /** @type {typeof __VLS_300.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(['TTS', 'LLM', 'IMAGE', 'TTI', 'STT', 'EMBEDDING'].includes(row.model_type) &&
                            __VLS_ctx.permissionPrecise.paramSetting()))
                            throw 0;
                        return __VLS_ctx.openParamSetting(row);
                        // @ts-ignore
                        [permissionPrecise, openParamSetting,];
                    },
                };
                const { default: __VLS_302 } = __VLS_298.slots;
                let __VLS_303;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
                    iconName: "app-setting",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_305 = __VLS_304({
                    iconName: "app-setting",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_304));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.model.modelForm.title.paramSetting'));
                // @ts-ignore
                [$t,];
                var __VLS_298;
                var __VLS_299;
            }
            if (__VLS_ctx.permissionPrecise.relate_map()) {
                let __VLS_308;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_310 = __VLS_309({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_309));
                let __VLS_313;
                const __VLS_314 = {
                    /** @type {typeof __VLS_313.click} */
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
                const { default: __VLS_315 } = __VLS_311.slots;
                let __VLS_316;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
                    iconName: "app-resource-mapping",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_318 = __VLS_317({
                    iconName: "app-resource-mapping",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_317));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceMapping.title'));
                // @ts-ignore
                [$t,];
                var __VLS_311;
                var __VLS_312;
            }
            if (__VLS_ctx.permissionPrecise.delete()) {
                let __VLS_321;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
                    ...{ 'onClick': {} },
                }));
                const __VLS_323 = __VLS_322({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_322));
                let __VLS_326;
                const __VLS_327 = {
                    /** @type {typeof __VLS_326.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission()))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.delete()))
                            throw 0;
                        return __VLS_ctx.deleteModel(row);
                        // @ts-ignore
                        [permissionPrecise, deleteModel,];
                    },
                };
                const { default: __VLS_328 } = __VLS_324.slots;
                let __VLS_329;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_330 = __VLS_asFunctionalComponent1(__VLS_329, new __VLS_329({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_331 = __VLS_330({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_330));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_324;
                var __VLS_325;
            }
            // @ts-ignore
            [];
            var __VLS_292;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_272;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_227;
// @ts-ignore
[];
var __VLS_83;
var __VLS_84;
// @ts-ignore
[];
var __VLS_21;
const __VLS_334 = EditModel || EditModel;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
    ...{ 'onSubmit': {} },
    ref: "editModelRef",
}));
const __VLS_336 = __VLS_335({
    ...{ 'onSubmit': {} },
    ref: "editModelRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
let __VLS_339;
const __VLS_340 = {
    /** @type {typeof __VLS_339.submit} */
    onSubmit: (__VLS_ctx.getList),
};
var __VLS_341;
var __VLS_337;
var __VLS_338;
const __VLS_343 = ParamSettingDialog;
// @ts-ignore
const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({
    ref: "paramSettingRef",
}));
const __VLS_345 = __VLS_344({
    ref: "paramSettingRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_344));
var __VLS_348;
var __VLS_346;
const __VLS_350 = ResourceAuthorizationDrawer;
// @ts-ignore
const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
    type: (__VLS_ctx.SourceTypeEnum.MODEL),
    ref: "ResourceAuthorizationDrawerRef",
}));
const __VLS_352 = __VLS_351({
    type: (__VLS_ctx.SourceTypeEnum.MODEL),
    ref: "ResourceAuthorizationDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_351));
var __VLS_355;
var __VLS_353;
const __VLS_357 = ResourceMappingDrawer || ResourceMappingDrawer;
// @ts-ignore
const __VLS_358 = __VLS_asFunctionalComponent1(__VLS_357, new __VLS_357({
    ref: "resourceMappingDrawerRef",
}));
const __VLS_359 = __VLS_358({
    ref: "resourceMappingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_358));
var __VLS_362;
var __VLS_360;
// @ts-ignore
var __VLS_342 = __VLS_341, __VLS_349 = __VLS_348, __VLS_356 = __VLS_355, __VLS_363 = __VLS_362;
// @ts-ignore
[getList, SourceTypeEnum,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
