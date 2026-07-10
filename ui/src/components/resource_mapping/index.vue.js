/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { isAppIcon, resetUrl } from '@/utils/common';
import useStore from '@/stores';
import { t } from '@/locales';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import permissionMap from '@/permission';
import { MsgError } from '@/utils/message';
const route = useRoute();
const router = useRouter();
const { model, user } = useStore();
const searchType = ref('resource_name');
const query = ref({
    resource_name: '',
    user_name: '',
    source_type: '',
});
const loading = ref(false);
const tableData = ref();
const visible = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
// Depend
const dependencyTableData = ref();
const dependencyPaginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else {
        return 'workspace';
    }
});
const showWorkspace = computed(() => (user.isPE() || user.isEE()) && route.path.includes('shared'));
const currentTab = ref('dependency'); // 'dependency' Represents“What I depend on”， 'dependent' Represents“Depends on my”
const dependencyTableRef = ref();
const tabList = [
    {
        value: 'dependency',
        label: t('views.system.resourceMapping.dependency'),
    },
    {
        value: 'dependent',
        label: t('views.system.resourceMapping.dependent'),
    },
];
const handleTabChange = () => {
    query.value = { resource_name: '', user_name: '', source_type: '' };
    searchType.value = 'resource_name';
    workspaceArr.value = [];
    filterText.value = '';
    if (currentTab.value === 'dependency') {
        dependencyPaginationConfig.current_page = 1;
        getProvider();
        pageMappingResource();
    }
    else {
        paginationConfig.current_page = 1;
        pageResourceMapping();
    }
};
const currentSourceName = computed(() => {
    if (currentSourceType.value === 'TOOL') {
        return t('views.tool.title');
    }
    else if (currentSourceType.value === 'MODEL') {
        return t('views.model.title');
    }
    else if (currentSourceType.value === 'APPLICATION') {
        return t('views.application.title');
    }
    else {
        return t('views.knowledge.title');
    }
});
const pageResourceMapping = () => {
    const workspaceId = user.getWorkspaceId() || 'default';
    const params = {};
    if (query.value[searchType.value]) {
        params[searchType.value] = query.value[searchType.value];
    }
    if (workspaceArr.value.length > 0) {
        params.workspace_ids = JSON.stringify(workspaceArr.value);
    }
    loadSharedApi({ type: 'resourceMapping', systemType: apiType.value })
        .getResourceMapping(workspaceId, currentSourceType.value, currentSourceId.value, paginationConfig, params, loading)
        .then((res) => {
        tableData.value = res.data.records || [];
        paginationConfig.total = res.data.total || 0;
    });
};
// Depend
const pageMappingResource = () => {
    const workspaceId = user.getWorkspaceId() || 'default';
    const params = {};
    if (query.value[searchType.value]) {
        const backendKey = searchType.value === 'source_type' ? 'target_type' : searchType.value;
        params[backendKey] = query.value[searchType.value];
    }
    if (workspaceArr.value.length > 0) {
        params.workspace_ids = JSON.stringify(workspaceArr.value);
    }
    loadSharedApi({ type: 'resourceMapping', systemType: apiType.value })
        .getMappingResource(workspaceId, currentSourceType.value, currentSourceId.value, dependencyPaginationConfig, params, loading)
        .then((res) => {
        dependencyTableData.value = res.data.records || [];
        dependencyPaginationConfig.total = res.data.total || 0;
    });
};
function handleSizeChange() {
    paginationConfig.current_page = 1;
    pageResourceMapping();
}
function handleDependencySizeChange() {
    dependencyPaginationConfig.current_page = 1;
    pageMappingResource();
}
const currentSourceType = ref();
const currentSourceId = ref();
const currentSource = ref();
const open = (source, data) => {
    visible.value = true;
    currentSourceType.value = source;
    currentSourceId.value = data.id;
    currentSource.value = data;
    // Based onResource typeSettingsDefault tab
    if (currentSourceType.value === 'MODEL') {
        currentTab.value = 'dependent';
    }
    else if (currentSourceType.value === 'TOOL' && data.tool_type !== 'WORKFLOW') {
        currentTab.value = 'dependent';
    }
    else {
        currentTab.value = 'dependency';
    }
    if (currentTab.value === 'dependency') {
        pageMappingResource();
    }
    else {
        pageResourceMapping();
    }
    if (currentSourceType.value === 'MODEL' || currentTab.value === 'dependency') {
        getProvider();
    }
    getWorkspaceList();
};
const close = () => {
    visible.value = false;
    currentTab.value = 'dependency';
    searchType.value = 'resource_name';
    query.value = { resource_name: '', user_name: '', source_type: '' };
    workspaceArr.value = [];
    filterText.value = '';
    paginationConfig.current_page = 1;
};
const getProviderIcon = computed(() => {
    return (row) => {
        return provider_list.value.find((p) => p.provider === row.provider)?.icon;
    };
});
const getRowProviderIcon = computed(() => {
    return (row) => {
        return provider_list.value.find((p) => p.provider === row.icon)?.icon;
    };
});
const provider_list = ref([]);
function getProvider() {
    if (provider_list.value.length > 0)
        return;
    model.asyncGetProvider().then((res) => {
        provider_list.value = res?.data;
    });
}
const workspaceOptions = ref([]);
const workspaceVisible = ref(false);
const workspaceArr = ref([]);
const filterText = ref('');
const filterData = ref([]);
function filterWorkspaceChange(val) {
    if (val === 'clear') {
        workspaceArr.value = [];
    }
    filterText.value = '';
    if (currentTab.value === 'dependency') {
        dependencyPaginationConfig.current_page = 1;
        pageMappingResource();
    }
    else {
        paginationConfig.current_page = 1;
        pageResourceMapping();
    }
    workspaceVisible.value = false;
}
async function getWorkspaceList() {
    if (user.isEE() && showWorkspace.value) {
        const res = await loadPermissionApi('workspace').getSystemWorkspaceList(loading);
        workspaceOptions.value = res.data.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }
}
const hasResourceWorkspacePermission = (row) => {
    return permissionMap[row.source_type.toLowerCase()]['workspace'].jump_read(row.source_id);
};
const hasResourceSystemManagePermission = (row) => {
    return permissionMap[row.source_type.toLowerCase()]['systemManage'].jump_read();
};
const hasResourceSharedPermission = () => {
    return permissionMap['knowledge']['systemShare'].jump_read();
};
function hasJumpPermission(from, row) {
    if (row.source_type === 'KNOWLEDGE') {
        if (from === 'shared') {
            if (row.workspace_id === 'None') {
                return hasResourceSharedPermission();
            }
            else {
                return hasResourceSystemManagePermission(row);
            }
        }
        else if (from === 'resource-management') {
            return hasResourceSystemManagePermission(row);
        }
        else if (from === 'workspace') {
            return hasResourceWorkspacePermission(row);
        }
    }
    if (row.source_type === 'APPLICATION') {
        if (['shared', 'resource-management'].includes(from)) {
            return hasResourceSystemManagePermission(row);
        }
        else if (from === 'workspace') {
            return hasResourceWorkspacePermission(row);
        }
    }
    return false;
}
function toSetting(row) {
    let from = '';
    if (route.path.includes('resource-management')) {
        from = 'resource-management';
    }
    else if (route.path.includes('shared')) {
        from = 'shared';
    }
    else {
        from = 'workspace';
    }
    if (row.source_type === 'KNOWLEDGE') {
        if (!hasJumpPermission(from, row)) {
            MsgError(t('common.noTargetPermission'));
            return;
        }
        const knowledge_from = from === 'workspace'
            ? row.folder_id
            : from === 'shared'
                ? row.workspace_id === 'None'
                    ? 'shared'
                    : 'resource-management'
                : from;
        const newUrl = router.resolve({
            path: `/knowledge/${row.source_id}/${knowledge_from}/${row.type}/document`,
        }).href;
        window.open(newUrl);
    }
    else if (row.source_type === 'APPLICATION') {
        if (!hasJumpPermission(from, row)) {
            MsgError(t('common.noTargetPermission'));
            return;
        }
        if (row.type === 'WORK_FLOW') {
            const newUrl = router.resolve({
                path: `/application/${from === 'shared' ? 'resource-management' : from}/${row.source_id}/workflow`,
            }).href;
            window.open(newUrl);
        }
        else {
            const newUrl = router.resolve({
                path: `/application/${from === 'shared' ? 'resource-management' : from}/${row.source_id}/SIMPLE/setting`,
            }).href;
            window.open(newUrl);
        }
    }
}
watch([() => workspaceOptions.value, () => filterText.value], () => {
    if (!filterText.value.length) {
        filterData.value = workspaceOptions.value;
    }
    filterData.value = workspaceOptions.value.filter((v) => v.label.toLowerCase().includes(filterText.value.toLowerCase()));
}, { immediate: true });
const __VLS_exposed = {
    open,
    close,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.$t('views.system.resourceMapping.title')),
    size: "60%",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.$t('views.system.resourceMapping.title')),
    size: "60%",
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "lighter mb-12" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
(__VLS_ctx.currentSourceName);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
if (__VLS_ctx.currentSourceType === 'KNOWLEDGE') {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
    KnowledgeIcon;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ class: "mr-12" },
        size: (24),
        type: (__VLS_ctx.currentSource.type),
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: "mr-12" },
        size: (24),
        type: (__VLS_ctx.currentSource.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
}
else if (__VLS_ctx.currentSourceType === 'APPLICATION') {
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-12" },
    }));
    const __VLS_14 = __VLS_13({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(__VLS_ctx.currentSource?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
        alt: "",
    });
    // @ts-ignore
    [visible, $t, currentSourceName, currentSourceType, currentSourceType, currentSource, currentSource, resetUrl, resetUrl,];
    var __VLS_15;
}
else if (__VLS_ctx.currentSourceType === 'TOOL' && __VLS_ctx.isAppIcon(__VLS_ctx.currentSource?.icon)) {
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-12" },
    }));
    const __VLS_20 = __VLS_19({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    const { default: __VLS_23 } = __VLS_21.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(__VLS_ctx.currentSource?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
        alt: "",
    });
    // @ts-ignore
    [currentSourceType, currentSource, currentSource, resetUrl, resetUrl, isAppIcon,];
    var __VLS_21;
}
else if (__VLS_ctx.currentSourceType === 'TOOL') {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
    ToolIcon;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        ...{ class: "mr-12" },
        size: (24),
        type: (__VLS_ctx.currentSource.tool_type),
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "mr-12" },
        size: (24),
        type: (__VLS_ctx.currentSource.tool_type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
}
else if (__VLS_ctx.currentSourceType === 'MODEL') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
        innerHTML: (__VLS_ctx.getProviderIcon(__VLS_ctx.currentSource)),
        ...{ class: "mr-12" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
}
(__VLS_ctx.currentSource.name);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "lighter mb-12" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
(__VLS_ctx.$t('views.system.resourceMapping.sub_title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}));
const __VLS_31 = __VLS_30({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_34 } = __VLS_32.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    label: (__VLS_ctx.$t('common.name')),
    value: "resource_name",
}));
const __VLS_37 = __VLS_36({
    label: (__VLS_ctx.$t('common.name')),
    value: "resource_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    label: (__VLS_ctx.$t('common.creator')),
    value: "user_name",
}));
const __VLS_42 = __VLS_41({
    label: (__VLS_ctx.$t('common.creator')),
    value: "user_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    label: (__VLS_ctx.$t('common.type')),
    value: "source_type",
}));
const __VLS_47 = __VLS_46({
    label: (__VLS_ctx.$t('common.type')),
    value: "source_type",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
// @ts-ignore
[$t, $t, $t, $t, currentSourceType, currentSourceType, currentSource, currentSource, currentSource, getProviderIcon, searchType,];
var __VLS_32;
if (__VLS_ctx.searchType === 'resource_name') {
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onKeyup': {} },
        modelValue: (__VLS_ctx.query.resource_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onKeyup': {} },
        modelValue: (__VLS_ctx.query.resource_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        /** @type {typeof __VLS_55.keyup} */
        onKeyup: (...[$event]) => {
            if (!(__VLS_ctx.searchType === 'resource_name'))
                throw 0;
            return __VLS_ctx.currentTab === 'dependency' ? __VLS_ctx.pageMappingResource() : __VLS_ctx.pageResourceMapping();
            // @ts-ignore
            [$t, searchType, query, currentTab, pageMappingResource, pageResourceMapping,];
        },
    };
    var __VLS_53;
    var __VLS_54;
}
if (__VLS_ctx.searchType === 'user_name') {
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onKeyup': {} },
        modelValue: (__VLS_ctx.query.user_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onKeyup': {} },
        modelValue: (__VLS_ctx.query.user_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.keyup} */
        onKeyup: (...[$event]) => {
            if (!(__VLS_ctx.searchType === 'user_name'))
                throw 0;
            return __VLS_ctx.currentTab === 'dependency' ? __VLS_ctx.pageMappingResource() : __VLS_ctx.pageResourceMapping();
            // @ts-ignore
            [$t, searchType, query, currentTab, pageMappingResource, pageResourceMapping,];
        },
    };
    var __VLS_60;
    var __VLS_61;
}
else if (__VLS_ctx.searchType === 'source_type') {
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.source_type),
        filterable: true,
        clearable: true,
        multiple: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.search')),
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.query.source_type),
        filterable: true,
        clearable: true,
        multiple: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.search')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.change} */
        onChange: (...[$event]) => {
            if (!!(__VLS_ctx.searchType === 'user_name'))
                throw 0;
            if (!(__VLS_ctx.searchType === 'source_type'))
                throw 0;
            return __VLS_ctx.currentTab === 'dependency' ? __VLS_ctx.pageMappingResource() : __VLS_ctx.pageResourceMapping();
            // @ts-ignore
            [$t, searchType, query, currentTab, pageMappingResource, pageResourceMapping,];
        },
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        label: (__VLS_ctx.$t('views.application.title')),
        value: "APPLICATION",
    }));
    const __VLS_74 = __VLS_73({
        label: (__VLS_ctx.$t('views.application.title')),
        value: "APPLICATION",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        label: (__VLS_ctx.$t('views.knowledge.title')),
        value: "KNOWLEDGE",
    }));
    const __VLS_79 = __VLS_78({
        label: (__VLS_ctx.$t('views.knowledge.title')),
        value: "KNOWLEDGE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_82;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
        label: (__VLS_ctx.$t('views.tool.title')),
        value: "TOOL",
    }));
    const __VLS_84 = __VLS_83({
        label: (__VLS_ctx.$t('views.tool.title')),
        value: "TOOL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        label: (__VLS_ctx.$t('views.model.title')),
        value: "MODEL",
    }));
    const __VLS_89 = __VLS_88({
        label: (__VLS_ctx.$t('views.model.title')),
        value: "MODEL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    // @ts-ignore
    [$t, $t, $t, $t,];
    var __VLS_67;
    var __VLS_68;
}
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.currentTab),
    ...{ class: "app-radio-button-group" },
}));
const __VLS_94 = __VLS_93({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.currentTab),
    ...{ class: "app-radio-button-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_97;
const __VLS_98 = {
    /** @type {typeof __VLS_97.change} */
    onChange: (__VLS_ctx.handleTabChange),
};
/** @type {__VLS_StyleScopedClasses['app-radio-button-group']} */ ;
const { default: __VLS_99 } = __VLS_95.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.tabList))) {
    let __VLS_100;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_102 = __VLS_101({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    // @ts-ignore
    [currentTab, handleTabChange, tabList,];
}
// @ts-ignore
[];
var __VLS_95;
var __VLS_96;
if (__VLS_ctx.currentTab === 'dependency') {
    let __VLS_105;
    /** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
    appTable;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
        ...{ 'onSizeChange': {} },
        ...{ 'onChangePage': {} },
        ref: "dependencyTableRef",
        ...{ class: "mt-16" },
        data: (__VLS_ctx.dependencyTableData),
        paginationConfig: (__VLS_ctx.dependencyPaginationConfig),
        maxTableHeight: (200),
        rowKey: ((row) => row.id),
    }));
    const __VLS_107 = __VLS_106({
        ...{ 'onSizeChange': {} },
        ...{ 'onChangePage': {} },
        ref: "dependencyTableRef",
        ...{ class: "mt-16" },
        data: (__VLS_ctx.dependencyTableData),
        paginationConfig: (__VLS_ctx.dependencyPaginationConfig),
        maxTableHeight: (200),
        rowKey: ((row) => row.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    let __VLS_110;
    const __VLS_111 = {
        /** @type {typeof __VLS_110.sizeChange} */
        onSizeChange: (__VLS_ctx.handleDependencySizeChange),
    };
    const __VLS_112 = {
        /** @type {typeof __VLS_110.changePage} */
        onChangePage: (__VLS_ctx.pageMappingResource),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    var __VLS_113;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_115 } = __VLS_108.slots;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        prop: "name",
        label: (__VLS_ctx.$t('common.name')),
        minWidth: "130",
        showOverflowTooltip: true,
    }));
    const __VLS_118 = __VLS_117({
        prop: "name",
        label: (__VLS_ctx.$t('common.name')),
        minWidth: "130",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    const { default: __VLS_121 } = __VLS_119.slots;
    {
        const { default: __VLS_122 } = __VLS_119.slots;
        const [{ row }] = __VLS_vSlot(__VLS_122);
        let __VLS_123;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_125 = __VLS_124({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        let __VLS_128;
        const __VLS_129 = {
            /** @type {typeof __VLS_128.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentTab === 'dependency'))
                    throw 0;
                return __VLS_ctx.toSetting({ ...row, source_type: row.target_type, source_id: row.target_id });
                // @ts-ignore
                [$t, currentTab, pageMappingResource, dependencyTableData, dependencyPaginationConfig, handleDependencySizeChange, vLoading, loading, toSetting,];
            },
        };
        const { default: __VLS_130 } = __VLS_126.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (row.target_type === 'KNOWLEDGE') {
            let __VLS_131;
            /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
            KnowledgeIcon;
            // @ts-ignore
            const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.icon),
            }));
            const __VLS_133 = __VLS_132({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.icon),
            }, ...__VLS_functionalComponentArgsRest(__VLS_132));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        }
        else if (row.target_type === 'APPLICATION' && __VLS_ctx.isAppIcon(row?.icon)) {
            let __VLS_136;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_138 = __VLS_137({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_137));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_141 } = __VLS_139.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(row?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                alt: "",
            });
            // @ts-ignore
            [resetUrl, resetUrl, isAppIcon,];
            var __VLS_139;
        }
        else if (row.target_type === 'TOOL' && __VLS_ctx.isAppIcon(row?.icon)) {
            let __VLS_142;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_144 = __VLS_143({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_143));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_147 } = __VLS_145.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(row.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                alt: "",
            });
            // @ts-ignore
            [resetUrl, resetUrl, isAppIcon,];
            var __VLS_145;
        }
        else if (row.target_type === 'TOOL') {
            let __VLS_148;
            /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
            ToolIcon;
            // @ts-ignore
            const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.type),
            }));
            const __VLS_150 = __VLS_149({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.type),
            }, ...__VLS_functionalComponentArgsRest(__VLS_149));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        }
        else if (row.target_type === 'MODEL') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ style: {} },
                innerHTML: (__VLS_ctx.getRowProviderIcon(row)),
                ...{ class: "mr-8 flex align-center justify-center" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.name);
        // @ts-ignore
        [getRowProviderIcon,];
        var __VLS_126;
        var __VLS_127;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_119;
    let __VLS_153;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
        prop: "desc",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.desc')),
    }));
    const __VLS_155 = __VLS_154({
        prop: "desc",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.desc')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    let __VLS_158;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
        prop: "target_type",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.type')),
    }));
    const __VLS_160 = __VLS_159({
        prop: "target_type",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.type')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    const { default: __VLS_163 } = __VLS_161.slots;
    {
        const { default: __VLS_164 } = __VLS_161.slots;
        const [{ row }] = __VLS_vSlot(__VLS_164);
        (row.target_type === 'APPLICATION'
            ? __VLS_ctx.$t('views.application.title')
            : row.target_type === 'TOOL'
                ? __VLS_ctx.$t('views.tool.title')
                : row.target_type === 'MODEL'
                    ? __VLS_ctx.$t('views.model.title')
                    : __VLS_ctx.$t('views.knowledge.title'));
        // @ts-ignore
        [$t, $t, $t, $t, $t, $t,];
    }
    // @ts-ignore
    [];
    var __VLS_161;
    if (__VLS_ctx.showWorkspace) {
        let __VLS_165;
        /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
        elTableColumn;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
            prop: "workspace_name",
            minWidth: "120",
            showOverflowTooltip: true,
            label: (__VLS_ctx.$t('views.workspace.title')),
        }));
        const __VLS_167 = __VLS_166({
            prop: "workspace_name",
            minWidth: "120",
            showOverflowTooltip: true,
            label: (__VLS_ctx.$t('views.workspace.title')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        const { default: __VLS_170 } = __VLS_168.slots;
        {
            const { header: __VLS_171 } = __VLS_168.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.$t('views.workspace.title'));
            let __VLS_172;
            /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
            elPopover;
            // @ts-ignore
            const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
                width: (200),
                trigger: "click",
                visible: (__VLS_ctx.workspaceVisible),
                persistent: (false),
            }));
            const __VLS_174 = __VLS_173({
                width: (200),
                trigger: "click",
                visible: (__VLS_ctx.workspaceVisible),
                persistent: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_173));
            const { default: __VLS_177 } = __VLS_175.slots;
            {
                const { reference: __VLS_178 } = __VLS_175.slots;
                let __VLS_179;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
                    ...{ 'onClick': {} },
                    ...{ style: {} },
                    type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                    link: true,
                }));
                const __VLS_181 = __VLS_180({
                    ...{ 'onClick': {} },
                    ...{ style: {} },
                    type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                    link: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_180));
                let __VLS_184;
                const __VLS_185 = {
                    /** @type {typeof __VLS_184.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.currentTab === 'dependency'))
                            throw 0;
                        if (!(__VLS_ctx.showWorkspace))
                            throw 0;
                        return __VLS_ctx.workspaceVisible = !__VLS_ctx.workspaceVisible;
                        // @ts-ignore
                        [$t, $t, showWorkspace, workspaceVisible, workspaceVisible, workspaceVisible, workspaceArr, workspaceArr,];
                    },
                };
                const { default: __VLS_186 } = __VLS_182.slots;
                let __VLS_187;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({}));
                const __VLS_189 = __VLS_188({}, ...__VLS_functionalComponentArgsRest(__VLS_188));
                const { default: __VLS_192 } = __VLS_190.slots;
                let __VLS_193;
                /** @ts-ignore @type { | typeof __VLS_components.Filter} */
                Filter;
                // @ts-ignore
                const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({}));
                const __VLS_195 = __VLS_194({}, ...__VLS_functionalComponentArgsRest(__VLS_194));
                // @ts-ignore
                [];
                var __VLS_190;
                // @ts-ignore
                [];
                var __VLS_182;
                var __VLS_183;
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
            let __VLS_198;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
                modelValue: (__VLS_ctx.filterText),
                placeholder: (__VLS_ctx.$t('common.search')),
                prefixIcon: "Search",
                clearable: true,
            }));
            const __VLS_200 = __VLS_199({
                modelValue: (__VLS_ctx.filterText),
                placeholder: (__VLS_ctx.$t('common.search')),
                prefixIcon: "Search",
                clearable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_199));
            if (__VLS_ctx.filterData.length) {
                let __VLS_203;
                /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
                elScrollbar;
                // @ts-ignore
                const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
                    height: "300",
                }));
                const __VLS_205 = __VLS_204({
                    height: "300",
                }, ...__VLS_functionalComponentArgsRest(__VLS_204));
                const { default: __VLS_208 } = __VLS_206.slots;
                let __VLS_209;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
                elCheckboxGroup;
                // @ts-ignore
                const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
                    modelValue: (__VLS_ctx.workspaceArr),
                    ...{ style: {} },
                }));
                const __VLS_211 = __VLS_210({
                    modelValue: (__VLS_ctx.workspaceArr),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_210));
                const { default: __VLS_214 } = __VLS_212.slots;
                for (const [item] of __VLS_vFor((__VLS_ctx.filterData))) {
                    let __VLS_215;
                    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                    elCheckbox;
                    // @ts-ignore
                    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
                        key: (item.value),
                        label: (item.label),
                        value: (item.value),
                    }));
                    const __VLS_217 = __VLS_216({
                        key: (item.value),
                        label: (item.label),
                        value: (item.value),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
                    // @ts-ignore
                    [$t, workspaceArr, filterText, filterData, filterData,];
                }
                // @ts-ignore
                [];
                var __VLS_212;
                // @ts-ignore
                [];
                var __VLS_206;
            }
            else {
                let __VLS_220;
                /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
                elEmpty;
                // @ts-ignore
                const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
                    description: (__VLS_ctx.$t('common.noData')),
                }));
                const __VLS_222 = __VLS_221({
                    description: (__VLS_ctx.$t('common.noData')),
                }, ...__VLS_functionalComponentArgsRest(__VLS_221));
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-right" },
            });
            /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
            let __VLS_225;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
                ...{ 'onClick': {} },
                size: "small",
            }));
            const __VLS_227 = __VLS_226({
                ...{ 'onClick': {} },
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_226));
            let __VLS_230;
            const __VLS_231 = {
                /** @type {typeof __VLS_230.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTab === 'dependency'))
                        throw 0;
                    if (!(__VLS_ctx.showWorkspace))
                        throw 0;
                    return __VLS_ctx.filterWorkspaceChange('clear');
                    // @ts-ignore
                    [$t, filterWorkspaceChange,];
                },
            };
            const { default: __VLS_232 } = __VLS_228.slots;
            (__VLS_ctx.$t('common.clear'));
            // @ts-ignore
            [$t,];
            var __VLS_228;
            var __VLS_229;
            let __VLS_233;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
            }));
            const __VLS_235 = __VLS_234({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_234));
            let __VLS_238;
            const __VLS_239 = {
                /** @type {typeof __VLS_238.click} */
                onClick: (__VLS_ctx.filterWorkspaceChange),
            };
            const { default: __VLS_240 } = __VLS_236.slots;
            (__VLS_ctx.$t('common.confirm'));
            // @ts-ignore
            [$t, filterWorkspaceChange,];
            var __VLS_236;
            var __VLS_237;
            // @ts-ignore
            [];
            var __VLS_175;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_168;
    }
    let __VLS_241;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent1(__VLS_241, new __VLS_241({
        prop: "username",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.creator')),
    }));
    const __VLS_243 = __VLS_242({
        prop: "username",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.creator')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    // @ts-ignore
    [$t,];
    var __VLS_108;
    var __VLS_109;
}
if (__VLS_ctx.currentTab === 'dependent') {
    let __VLS_246;
    /** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
    appTable;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent1(__VLS_246, new __VLS_246({
        ...{ 'onSizeChange': {} },
        ...{ 'onChangePage': {} },
        ref: "multipleTableRef",
        ...{ class: "mt-16" },
        data: (__VLS_ctx.tableData),
        paginationConfig: (__VLS_ctx.paginationConfig),
        maxTableHeight: (200),
        rowKey: ((row) => row.id),
    }));
    const __VLS_248 = __VLS_247({
        ...{ 'onSizeChange': {} },
        ...{ 'onChangePage': {} },
        ref: "multipleTableRef",
        ...{ class: "mt-16" },
        data: (__VLS_ctx.tableData),
        paginationConfig: (__VLS_ctx.paginationConfig),
        maxTableHeight: (200),
        rowKey: ((row) => row.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    let __VLS_251;
    const __VLS_252 = {
        /** @type {typeof __VLS_251.sizeChange} */
        onSizeChange: (__VLS_ctx.handleSizeChange),
    };
    const __VLS_253 = {
        /** @type {typeof __VLS_251.changePage} */
        onChangePage: (__VLS_ctx.pageResourceMapping),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    var __VLS_254;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_256 } = __VLS_249.slots;
    let __VLS_257;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
        prop: "name",
        label: (__VLS_ctx.$t('common.name')),
        minWidth: "130",
        showOverflowTooltip: true,
    }));
    const __VLS_259 = __VLS_258({
        prop: "name",
        label: (__VLS_ctx.$t('common.name')),
        minWidth: "130",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    const { default: __VLS_262 } = __VLS_260.slots;
    {
        const { default: __VLS_263 } = __VLS_260.slots;
        const [{ row }] = __VLS_vSlot(__VLS_263);
        let __VLS_264;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_266 = __VLS_265({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        let __VLS_269;
        const __VLS_270 = {
            /** @type {typeof __VLS_269.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentTab === 'dependent'))
                    throw 0;
                return __VLS_ctx.toSetting(row);
                // @ts-ignore
                [$t, currentTab, pageResourceMapping, vLoading, loading, toSetting, tableData, paginationConfig, handleSizeChange,];
            },
        };
        const { default: __VLS_271 } = __VLS_267.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (row.source_type === 'KNOWLEDGE') {
            let __VLS_272;
            /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
            KnowledgeIcon;
            // @ts-ignore
            const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.icon),
            }));
            const __VLS_274 = __VLS_273({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.icon),
            }, ...__VLS_functionalComponentArgsRest(__VLS_273));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        }
        else if (row.source_type === 'APPLICATION' && __VLS_ctx.isAppIcon(row?.icon)) {
            let __VLS_277;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_278 = __VLS_asFunctionalComponent1(__VLS_277, new __VLS_277({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_279 = __VLS_278({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_278));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_282 } = __VLS_280.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(row?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                alt: "",
            });
            // @ts-ignore
            [resetUrl, resetUrl, isAppIcon,];
            var __VLS_280;
        }
        else if (row.source_type === 'TOOL' && __VLS_ctx.isAppIcon(row?.icon)) {
            let __VLS_283;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_285 = __VLS_284({
                shape: "square",
                size: (22),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_284));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_288 } = __VLS_286.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(row?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                alt: "",
            });
            // @ts-ignore
            [resetUrl, resetUrl, isAppIcon,];
            var __VLS_286;
        }
        else if (row.source_type === 'TOOL') {
            let __VLS_289;
            /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
            ToolIcon;
            // @ts-ignore
            const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.type),
            }));
            const __VLS_291 = __VLS_290({
                ...{ class: "mr-8" },
                size: (22),
                type: (row.type),
            }, ...__VLS_functionalComponentArgsRest(__VLS_290));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        }
        else if (row.source_type === 'MODEL') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ style: {} },
                innerHTML: (__VLS_ctx.getRowProviderIcon(row)),
                ...{ class: "mr-8 flex align-center justify-center" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.name);
        // @ts-ignore
        [getRowProviderIcon,];
        var __VLS_267;
        var __VLS_268;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_260;
    let __VLS_294;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
        prop: "desc",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.desc')),
    }));
    const __VLS_296 = __VLS_295({
        prop: "desc",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.desc')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_295));
    let __VLS_299;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_300 = __VLS_asFunctionalComponent1(__VLS_299, new __VLS_299({
        prop: "source_type",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.type')),
    }));
    const __VLS_301 = __VLS_300({
        prop: "source_type",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.type')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_300));
    const { default: __VLS_304 } = __VLS_302.slots;
    {
        const { default: __VLS_305 } = __VLS_302.slots;
        const [{ row }] = __VLS_vSlot(__VLS_305);
        (row.source_type === 'APPLICATION'
            ? __VLS_ctx.$t('views.application.title')
            : row.source_type === 'TOOL'
                ? __VLS_ctx.$t('views.tool.title')
                : __VLS_ctx.$t('views.knowledge.title'));
        // @ts-ignore
        [$t, $t, $t, $t, $t,];
    }
    // @ts-ignore
    [];
    var __VLS_302;
    if (__VLS_ctx.showWorkspace) {
        let __VLS_306;
        /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
        elTableColumn;
        // @ts-ignore
        const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
            prop: "workspace_name",
            minWidth: "120",
            showOverflowTooltip: true,
            label: (__VLS_ctx.$t('views.workspace.title')),
        }));
        const __VLS_308 = __VLS_307({
            prop: "workspace_name",
            minWidth: "120",
            showOverflowTooltip: true,
            label: (__VLS_ctx.$t('views.workspace.title')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_307));
        const { default: __VLS_311 } = __VLS_309.slots;
        {
            const { header: __VLS_312 } = __VLS_309.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.$t('views.workspace.title'));
            let __VLS_313;
            /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
            elPopover;
            // @ts-ignore
            const __VLS_314 = __VLS_asFunctionalComponent1(__VLS_313, new __VLS_313({
                width: (200),
                trigger: "click",
                visible: (__VLS_ctx.workspaceVisible),
                persistent: (false),
            }));
            const __VLS_315 = __VLS_314({
                width: (200),
                trigger: "click",
                visible: (__VLS_ctx.workspaceVisible),
                persistent: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_314));
            const { default: __VLS_318 } = __VLS_316.slots;
            {
                const { reference: __VLS_319 } = __VLS_316.slots;
                let __VLS_320;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_321 = __VLS_asFunctionalComponent1(__VLS_320, new __VLS_320({
                    ...{ 'onClick': {} },
                    ...{ style: {} },
                    type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                    link: true,
                }));
                const __VLS_322 = __VLS_321({
                    ...{ 'onClick': {} },
                    ...{ style: {} },
                    type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                    link: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_321));
                let __VLS_325;
                const __VLS_326 = {
                    /** @type {typeof __VLS_325.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.currentTab === 'dependent'))
                            throw 0;
                        if (!(__VLS_ctx.showWorkspace))
                            throw 0;
                        return __VLS_ctx.workspaceVisible = !__VLS_ctx.workspaceVisible;
                        // @ts-ignore
                        [$t, $t, showWorkspace, workspaceVisible, workspaceVisible, workspaceVisible, workspaceArr, workspaceArr,];
                    },
                };
                const { default: __VLS_327 } = __VLS_323.slots;
                let __VLS_328;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_329 = __VLS_asFunctionalComponent1(__VLS_328, new __VLS_328({}));
                const __VLS_330 = __VLS_329({}, ...__VLS_functionalComponentArgsRest(__VLS_329));
                const { default: __VLS_333 } = __VLS_331.slots;
                let __VLS_334;
                /** @ts-ignore @type { | typeof __VLS_components.Filter} */
                Filter;
                // @ts-ignore
                const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({}));
                const __VLS_336 = __VLS_335({}, ...__VLS_functionalComponentArgsRest(__VLS_335));
                // @ts-ignore
                [];
                var __VLS_331;
                // @ts-ignore
                [];
                var __VLS_323;
                var __VLS_324;
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
            let __VLS_339;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
                modelValue: (__VLS_ctx.filterText),
                placeholder: (__VLS_ctx.$t('common.search')),
                prefixIcon: "Search",
                clearable: true,
            }));
            const __VLS_341 = __VLS_340({
                modelValue: (__VLS_ctx.filterText),
                placeholder: (__VLS_ctx.$t('common.search')),
                prefixIcon: "Search",
                clearable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_340));
            if (__VLS_ctx.filterData.length) {
                let __VLS_344;
                /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
                elScrollbar;
                // @ts-ignore
                const __VLS_345 = __VLS_asFunctionalComponent1(__VLS_344, new __VLS_344({
                    height: "300",
                }));
                const __VLS_346 = __VLS_345({
                    height: "300",
                }, ...__VLS_functionalComponentArgsRest(__VLS_345));
                const { default: __VLS_349 } = __VLS_347.slots;
                let __VLS_350;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
                elCheckboxGroup;
                // @ts-ignore
                const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
                    modelValue: (__VLS_ctx.workspaceArr),
                    ...{ style: {} },
                }));
                const __VLS_352 = __VLS_351({
                    modelValue: (__VLS_ctx.workspaceArr),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_351));
                const { default: __VLS_355 } = __VLS_353.slots;
                for (const [item] of __VLS_vFor((__VLS_ctx.filterData))) {
                    let __VLS_356;
                    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                    elCheckbox;
                    // @ts-ignore
                    const __VLS_357 = __VLS_asFunctionalComponent1(__VLS_356, new __VLS_356({
                        key: (item.value),
                        label: (item.label),
                        value: (item.value),
                    }));
                    const __VLS_358 = __VLS_357({
                        key: (item.value),
                        label: (item.label),
                        value: (item.value),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
                    // @ts-ignore
                    [$t, workspaceArr, filterText, filterData, filterData,];
                }
                // @ts-ignore
                [];
                var __VLS_353;
                // @ts-ignore
                [];
                var __VLS_347;
            }
            else {
                let __VLS_361;
                /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
                elEmpty;
                // @ts-ignore
                const __VLS_362 = __VLS_asFunctionalComponent1(__VLS_361, new __VLS_361({
                    description: (__VLS_ctx.$t('common.noData')),
                }));
                const __VLS_363 = __VLS_362({
                    description: (__VLS_ctx.$t('common.noData')),
                }, ...__VLS_functionalComponentArgsRest(__VLS_362));
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-right" },
            });
            /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
            let __VLS_366;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_367 = __VLS_asFunctionalComponent1(__VLS_366, new __VLS_366({
                ...{ 'onClick': {} },
                size: "small",
            }));
            const __VLS_368 = __VLS_367({
                ...{ 'onClick': {} },
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_367));
            let __VLS_371;
            const __VLS_372 = {
                /** @type {typeof __VLS_371.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTab === 'dependent'))
                        throw 0;
                    if (!(__VLS_ctx.showWorkspace))
                        throw 0;
                    return __VLS_ctx.filterWorkspaceChange('clear');
                    // @ts-ignore
                    [$t, filterWorkspaceChange,];
                },
            };
            const { default: __VLS_373 } = __VLS_369.slots;
            (__VLS_ctx.$t('common.clear'));
            // @ts-ignore
            [$t,];
            var __VLS_369;
            var __VLS_370;
            let __VLS_374;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_375 = __VLS_asFunctionalComponent1(__VLS_374, new __VLS_374({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
            }));
            const __VLS_376 = __VLS_375({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_375));
            let __VLS_379;
            const __VLS_380 = {
                /** @type {typeof __VLS_379.click} */
                onClick: (__VLS_ctx.filterWorkspaceChange),
            };
            const { default: __VLS_381 } = __VLS_377.slots;
            (__VLS_ctx.$t('common.confirm'));
            // @ts-ignore
            [$t, filterWorkspaceChange,];
            var __VLS_377;
            var __VLS_378;
            // @ts-ignore
            [];
            var __VLS_316;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_309;
    }
    let __VLS_382;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_383 = __VLS_asFunctionalComponent1(__VLS_382, new __VLS_382({
        prop: "username",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.creator')),
    }));
    const __VLS_384 = __VLS_383({
        prop: "username",
        minWidth: "120",
        showOverflowTooltip: true,
        label: (__VLS_ctx.$t('common.creator')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_383));
    // @ts-ignore
    [$t,];
    var __VLS_249;
    var __VLS_250;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_114 = __VLS_113, __VLS_255 = __VLS_254;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
