/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onBeforeMount, onBeforeUnmount, computed, nextTick, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Workflow from '@/workflow/index.vue';
import DropdownMenu from '@/components/workflow-dropdown-menu/index.vue';
import ExecutionRecord from '@/views/knowledge-workflow/component/execution-record/ExecutionRecordDrawer.vue';
import PublishHistory from '@/views/knowledge-workflow/component/PublishHistory.vue';
import { isAppIcon, resetUrl } from '@/utils/common';
import { MsgSuccess, MsgError, MsgConfirm } from '@/utils/message';
import { datetimeFormat } from '@/utils/time';
import useStore from '@/stores';
import { KnowledgeWorkFlowInstance } from '@/workflow/common/validate';
import { hasPermission } from '@/utils/permission';
import DebugVue from './component/DebugDrawer.vue';
import { t } from '@/locales';
import { ComplexPermission } from '@/utils/permission/type';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import permissionMap from '@/permission';
import { WorkflowMode } from '@/enums/application';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { knowledgeBaseNode } from '@/workflow/common/data';
import TemplateStoreDialog from '@/views/knowledge/template-store/TemplateStoreDialog.vue';
provide('getResourceDetail', () => detail);
provide('workflowMode', WorkflowMode.Knowledge);
provide('loopWorkflowMode', WorkflowMode.KnowledgeLoop);
const { theme } = useStore();
const router = useRouter();
const route = useRoute();
const { params: { id, folderId },
/*
folderId Can distinguish resource-management sharedOr workspace
*/
 } = route;
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
const isDefaultTheme = computed(() => {
    return theme.isDefaultTheme();
});
const DebugRef = ref();
const ListActionRef = ref();
let interval;
const workflowRef = ref();
const loading = ref(false);
const detail = ref(null);
const showPopover = ref(false);
const showDebug = ref(false);
const enlarge = ref(false);
const saveTime = ref('');
const isSave = ref(false);
const showHistory = ref(false);
const disablePublic = ref(false);
const currentVersion = ref({});
const cloneWorkFlow = ref(null);
const apiInputParams = ref([]);
const isPublish = computed(() => detail.value?.is_publish);
function back() {
    if (JSON.stringify(cloneWorkFlow.value) !== JSON.stringify(getGraphData())) {
        MsgConfirm(t('common.tip'), t('workflow.tip.saveMessage'), {
            confirmButtonText: t('workflow.setting.exitSave'),
            cancelButtonText: t('workflow.setting.exit'),
            distinguishCancelAndClose: true,
        })
            .then(() => {
            saveknowledge(true, true);
        })
            .catch((action) => {
            if (action === 'cancel') {
                go();
            }
        });
    }
    else {
        go();
    }
}
const openListAction = () => {
    ListActionRef.value?.open(id);
};
function clickoutsideHistory() {
    if (!disablePublic.value) {
        showHistory.value = false;
        disablePublic.value = false;
    }
}
function refreshVersion(item) {
    if (item) {
        renderGraphData(item);
    }
    showHistory.value = false;
    disablePublic.value = false;
}
function checkVersion(item) {
    disablePublic.value = true;
    currentVersion.value = item;
    renderGraphData(item);
    closeInterval();
}
function renderGraphData(item) {
    item.work_flow['nodes'].map((v) => {
        v['properties']['noRender'] = true;
    });
    detail.value.work_flow = item.work_flow;
    saveTime.value = item?.update_time;
    workflowRef.value?.clearGraphData();
    nextTick(() => {
        workflowRef.value?.render(item.work_flow);
    });
}
function closeHistory() {
    getDetail();
    if (isSave.value) {
        initInterval();
    }
    showHistory.value = false;
    disablePublic.value = false;
}
function openHistory() {
    showHistory.value = true;
}
function changeSave(bool) {
    if (bool) {
        initInterval();
    }
    else {
        closeInterval();
    }
    localStorage.setItem('workflowAutoSave', bool.toString());
}
function clickNodes(item) {
    showPopover.value = false;
}
function onmousedown(item) {
    showPopover.value = false;
}
function clickoutside() {
    showPopover.value = false;
}
const publish = () => {
    workflowRef.value
        ?.validate()
        .then(() => {
        const workflow = getGraphData();
        const workflowInstance = new KnowledgeWorkFlowInstance(workflow, WorkflowMode.Knowledge);
        try {
            workflowInstance.is_valid();
        }
        catch (e) {
            MsgError(e.toString());
            return;
        }
        loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
            .putKnowledgeWorkflow(id, { work_flow: workflow })
            .then(() => {
            return loadSharedApi({
                type: 'knowledge',
                isShared: isShared.value,
                systemType: apiType.value,
            }).publish(id, {}, loading);
        })
            .then((ok) => {
            detail.value.is_publish = true;
            MsgSuccess(t('views.application.tip.publishSuccess'));
        })
            .catch((res) => {
            const node = res.node;
            const err_message = res.errMessage;
            if (typeof err_message == 'string') {
                MsgError(res.node.properties?.stepName +
                    ` ${t('workflow.node').toLowerCase()} ` +
                    err_message.toLowerCase());
            }
            else {
                const keys = Object.keys(err_message);
                MsgError(node.properties?.stepName +
                    ` ${t('workflow.node').toLowerCase()} ` +
                    err_message[keys[0]]?.[0]?.message.toLowerCase());
            }
        });
    })
        .catch((res) => {
        const node = res.node;
        const err_message = res.errMessage;
        if (typeof err_message == 'string') {
            MsgError(res.node.properties?.stepName + ` ${t('workflow.node')}，` + err_message);
        }
        else {
            const keys = Object.keys(err_message);
            MsgError(node.properties?.stepName +
                ` ${t('workflow.node')}，` +
                err_message[keys[0]]?.[0]?.message);
        }
    });
};
const elUploadRef = ref();
const importKnowledgeWorkflow = (file) => {
    const formData = new FormData();
    formData.append('file', file.raw);
    const name = file.name.replace('.kbwf', '');
    elUploadRef.value.clearFiles();
    MsgConfirm(t('common.tip'), `${t('views.application.tip.confirmUse')} ${name} ${t('views.application.tip.overwrite')}?`, {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
    })
        .then(() => {
        loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
            .importKnowledgeWorkflow(id, formData, loading)
            .then(() => {
            getDetail();
        })
            .catch((error) => {
            if (error.code === 400) {
                MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
                    cancelButtonText: t('common.confirm'),
                    confirmButtonText: t('common.professional'),
                }).then(() => {
                    window.open('https://maxkb.cn/pricing.html', '_blank');
                });
            }
        });
    })
        .catch(() => { });
};
function exportKnowledgeWorkflow(name, id) {
    loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
        .exportKnowledgeWorkflow(id, name, loading)
        .catch((error) => {
        if (error.response.status !== 403) {
            error.response.data.text().then((res) => {
                MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
            });
        }
    });
}
const clickShowDebug = () => {
    workflowRef.value
        ?.validate()
        .then(() => {
        const graphData = getGraphData();
        const workflow = new KnowledgeWorkFlowInstance(graphData, WorkflowMode.Knowledge);
        try {
            workflow.is_valid();
            detail.value = {
                ...detail.value,
                type: 'WORK_FLOW',
                ...workflow.get_base_node()?.properties.node_data,
                work_flow: getGraphData(),
            };
            DebugRef.value?.open(graphData);
        }
        catch (e) {
            MsgError(e.toString());
        }
    })
        .catch((res) => {
        const node = res.node;
        const err_message = res.errMessage;
        if (typeof err_message == 'string') {
            MsgError(res.node.properties?.stepName + ` ${t('workflow.node')}，` + err_message);
        }
        else {
            const keys = Object.keys(err_message);
            MsgError(node.properties?.stepName +
                ` ${t('workflow.node')}，` +
                err_message[keys[0]]?.[0]?.message);
        }
    });
};
function getGraphData() {
    return workflowRef.value?.getGraphData();
}
const isShared = computed(() => {
    return folderId === 'share';
});
function getDetail() {
    loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
        .getKnowledgeDetail(id)
        .then((res) => {
        detail.value = res.data;
        detail.value.stt_model_id = res.data.stt_model;
        detail.value.tts_model_id = res.data.tts_model;
        detail.value.tts_type = res.data.tts_type;
        saveTime.value = res.data?.update_time;
        if (!detail.value.work_flow || !('nodes' in detail.value.work_flow)) {
            detail.value.work_flow = { nodes: [knowledgeBaseNode] };
        }
        detail.value.work_flow?.nodes
            ?.filter((v) => v.id === 'knowledge-base-node')
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
        workflowRef.value?.clearGraphData();
        nextTick(() => {
            workflowRef.value?.render(detail.value.work_flow);
            cloneWorkFlow.value = getGraphData();
        });
    });
}
function saveknowledge(bool, back) {
    const obj = {
        work_flow: getGraphData(),
    };
    loading.value = back || false;
    loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
        .putKnowledgeWorkflow(id, obj)
        .then(() => {
        saveTime.value = new Date();
        if (bool) {
            cloneWorkFlow.value = getGraphData();
            MsgSuccess(t('common.saveSuccess'));
            if (back) {
                go();
            }
        }
    })
        .catch(() => {
        loading.value = false;
    });
}
const go = () => {
    if (route.path.includes('resource-management')) {
        return router.push({ path: get_resource_management_route() });
    }
    else if (route.path.includes('shared')) {
        return router.push({ path: get_shared_route() });
    }
    else {
        return router.push({ path: get_route() });
    }
};
const get_shared_route = () => {
    if (hasPermission([RoleConst.ADMIN, PermissionConst.SHARED_KNOWLEDGE_DOCUMENT_READ], 'OR')) {
        return `/knowledge/${id}/shared/4/document`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.SHARED_KNOWLEDGE_PROBLEM_READ], 'OR')) {
        return `/knowledge/${id}/shared/4/problem`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.SHARED_KNOWLEDGE_HIT_TEST_READ], 'OR')) {
        return `/knowledge/${id}/shared/4/hit-test`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.SHARED_KNOWLEDGE_CHAT_USER_READ], 'OR')) {
        return `/knowledge/${id}/shared/4/chat-user`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.SHARED_KNOWLEDGE_EDIT], 'OR')) {
        return `/knowledge/${id}/shared/4/setting`;
    }
    else {
        return `/system/shared/knowledge`;
    }
};
const get_resource_management_route = () => {
    if (hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_DOCUMENT_READ], 'OR')) {
        return `/knowledge/${id}/resource-management/4/document`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_PROBLEM_READ], 'OR')) {
        return `/knowledge/${id}/resource-management/4/problem`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_HIT_TEST], 'OR')) {
        return `/knowledge/${id}/resource-management/4/hit-test`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_CHAT_USER_READ], 'OR')) {
        return `/knowledge/${id}/resource-management/4/chat-user`;
    }
    else if (hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_EDIT], 'OR')) {
        return `/knowledge/${id}/resource-management/4/setting`;
    }
    else {
        return `/system/resource-management/knowledge`;
    }
};
const get_route = () => {
    const checkPermission = (permissionConst) => {
        return hasPermission([
            new ComplexPermission([RoleConst.USER], [PermissionConst.KNOWLEDGE.getKnowledgeWorkspaceResourcePermission(id)], [], 'AND'),
            RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
            permissionConst.getWorkspacePermissionWorkspaceManageRole,
            permissionConst.getKnowledgeWorkspaceResourcePermission(id),
        ], 'OR');
    };
    if (checkPermission(PermissionConst.KNOWLEDGE_DOCUMENT_READ)) {
        return `/knowledge/${id}/${folderId}/4/document`;
    }
    else if (checkPermission(PermissionConst.KNOWLEDGE_PROBLEM_READ)) {
        return `/knowledge/${id}/${folderId}/4/problem`;
    }
    else if (checkPermission(PermissionConst.KNOWLEDGE_HIT_TEST_READ)) {
        return `/knowledge/${id}/${folderId}/4/hit-test`;
    }
    else if (checkPermission(PermissionConst.KNOWLEDGE_CHAT_USER_READ)) {
        return `/knowledge/${id}/${folderId}/4/chat-user`;
    }
    else if (checkPermission(PermissionConst.KNOWLEDGE_EDIT)) {
        return `/knowledge/${id}/${folderId}/4/setting`;
    }
    else {
        return `/knowledge`;
    }
};
const toImportDoc = () => {
    if (isPublish.value) {
        const newUrl = router.resolve({
            path: `/knowledge/import/workflow/${folderId}`,
            query: {
                id: id,
            },
        }).href;
        window.open(newUrl);
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
const templateStoreDialogRef = ref();
function openTemplateStoreDialog() {
    templateStoreDialogRef.value?.open(folderId);
}
/**
 * ScheduledSave
 */
const initInterval = () => {
    interval = setInterval(() => {
        saveknowledge();
    }, 60000);
};
/**
 * CloseScheduled
 */
const closeInterval = () => {
    if (interval) {
        clearInterval(interval);
    }
};
onBeforeMount(() => {
    getDetail();
    const workflowAutoSave = localStorage.getItem('workflowAutoSave');
    isSave.value = workflowAutoSave === 'true' ? true : false;
    // InitializeScheduledTask
    if (isSave.value) {
        initInterval();
    }
});
onBeforeUnmount(() => {
    // ClearScheduledTask
    closeInterval();
    workflowRef.value?.clearGraphData();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "knowledge-workflow" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['knowledge-workflow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header border-b flex-between p-12-24 white-bg" },
});
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12-24']} */ ;
/** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button'] | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button']} */
backButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.back),
};
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "ellipsis" },
    ...{ style: {} },
    title: (__VLS_ctx.detail?.name),
});
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.detail?.name);
if (__VLS_ctx.showHistory && __VLS_ctx.disablePublic) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        type: "info",
        ...{ class: "ml-16 color-secondary" },
    }));
    const __VLS_9 = __VLS_8({
        type: "info",
        ...{ class: "ml-16 color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    (__VLS_ctx.$t('workflow.info.previewVersion'));
    (__VLS_ctx.currentVersion.name || __VLS_ctx.datetimeFormat(__VLS_ctx.currentVersion.update_time));
    // @ts-ignore
    [vLoading, loading, back, detail, detail, showHistory, disablePublic, $t, currentVersion, currentVersion, datetimeFormat,];
    var __VLS_10;
}
else if (__VLS_ctx.saveTime) {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        type: "info",
        ...{ class: "ml-16 color-secondary" },
    }));
    const __VLS_15 = __VLS_14({
        type: "info",
        ...{ class: "ml-16 color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    const { default: __VLS_18 } = __VLS_16.slots;
    (__VLS_ctx.$t('workflow.info.saveTime'));
    (__VLS_ctx.datetimeFormat(__VLS_ctx.saveTime));
    // @ts-ignore
    [$t, datetimeFormat, saveTime, saveTime,];
    var __VLS_16;
}
if (__VLS_ctx.showHistory && __VLS_ctx.disablePublic && !__VLS_ctx.route.path.includes('share/')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        type: "primary",
        ...{ class: "mr-8" },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        type: "primary",
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        /** @type {typeof __VLS_24.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.showHistory && __VLS_ctx.disablePublic && !__VLS_ctx.route.path.includes('share/')))
                throw 0;
            return __VLS_ctx.refreshVersion();
            // @ts-ignore
            [showHistory, disablePublic, route, refreshVersion,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    const { default: __VLS_26 } = __VLS_22.slots;
    (__VLS_ctx.$t('workflow.setting.restoreVersion'));
    // @ts-ignore
    [$t,];
    var __VLS_22;
    var __VLS_23;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        direction: "vertical",
    }));
    const __VLS_29 = __VLS_28({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_37;
    const __VLS_38 = {
        /** @type {typeof __VLS_37.click} */
        onClick: (__VLS_ctx.closeHistory),
    };
    const { default: __VLS_39 } = __VLS_35.slots;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
    const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const { default: __VLS_45 } = __VLS_43.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.Close} */
    Close;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
    const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [closeHistory,];
    var __VLS_43;
    // @ts-ignore
    [];
    var __VLS_35;
    var __VLS_36;
}
else if (!__VLS_ctx.route.path.includes('share/')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.permissionPrecise.create()) {
        let __VLS_51;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
            ...{ 'onClick': {} },
            ...{ class: "ml-8" },
        }));
        const __VLS_53 = __VLS_52({
            ...{ 'onClick': {} },
            ...{ class: "ml-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        let __VLS_56;
        const __VLS_57 = {
            /** @type {typeof __VLS_56.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.showHistory && __VLS_ctx.disablePublic && !__VLS_ctx.route.path.includes('share/')))
                    throw 0;
                if (!(!__VLS_ctx.route.path.includes('share/')))
                    throw 0;
                if (!(__VLS_ctx.permissionPrecise.create()))
                    throw 0;
                return __VLS_ctx.openTemplateStoreDialog();
                // @ts-ignore
                [route, permissionPrecise, openTemplateStoreDialog,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        const { default: __VLS_58 } = __VLS_54.slots;
        let __VLS_59;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
            iconName: "app-template-center",
            ...{ class: "mr-4" },
        }));
        const __VLS_61 = __VLS_60({
            iconName: "app-template-center",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('workflow.setting.templateCenter'));
        // @ts-ignore
        [$t,];
        var __VLS_54;
        var __VLS_55;
    }
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.click} */
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.showHistory && __VLS_ctx.disablePublic && !__VLS_ctx.route.path.includes('share/')))
                throw 0;
            if (!(!__VLS_ctx.route.path.includes('share/')))
                throw 0;
            return __VLS_ctx.showPopover = !__VLS_ctx.showPopover;
            // @ts-ignore
            [showPopover, showPopover,];
        },
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_74 = __VLS_73({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('workflow.setting.addComponent'));
    // @ts-ignore
    [$t,];
    var __VLS_67;
    var __VLS_68;
    if (__VLS_ctx.permissionPrecise.debug(__VLS_ctx.id)) {
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.showDebug),
        }));
        const __VLS_79 = __VLS_78({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.showDebug),
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        let __VLS_82;
        const __VLS_83 = {
            /** @type {typeof __VLS_82.click} */
            onClick: (__VLS_ctx.clickShowDebug),
        };
        const { default: __VLS_84 } = __VLS_80.slots;
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            iconName: "app-debug-outlined",
            ...{ class: "mr-4" },
        }));
        const __VLS_87 = __VLS_86({
            iconName: "app-debug-outlined",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('common.debug'));
        // @ts-ignore
        [$t, permissionPrecise, id, showDebug, clickShowDebug,];
        var __VLS_80;
        var __VLS_81;
    }
    if (__VLS_ctx.permissionPrecise.workflow_edit(__VLS_ctx.id)) {
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
            ...{ 'onClick': {} },
        }));
        const __VLS_92 = __VLS_91({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        let __VLS_95;
        const __VLS_96 = {
            /** @type {typeof __VLS_95.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.showHistory && __VLS_ctx.disablePublic && !__VLS_ctx.route.path.includes('share/')))
                    throw 0;
                if (!(!__VLS_ctx.route.path.includes('share/')))
                    throw 0;
                if (!(__VLS_ctx.permissionPrecise.workflow_edit(__VLS_ctx.id)))
                    throw 0;
                return __VLS_ctx.saveknowledge(true);
                // @ts-ignore
                [permissionPrecise, id, saveknowledge,];
            },
        };
        const { default: __VLS_97 } = __VLS_93.slots;
        let __VLS_98;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
            iconName: "app-save-outlined",
            ...{ class: "mr-4" },
        }));
        const __VLS_100 = __VLS_99({
            iconName: "app-save-outlined",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_99));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('common.save'));
        // @ts-ignore
        [$t,];
        var __VLS_93;
        var __VLS_94;
    }
    if (__VLS_ctx.permissionPrecise.publish(__VLS_ctx.id)) {
        let __VLS_103;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_105 = __VLS_104({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        let __VLS_108;
        const __VLS_109 = {
            /** @type {typeof __VLS_108.click} */
            onClick: (__VLS_ctx.publish),
        };
        const { default: __VLS_110 } = __VLS_106.slots;
        (__VLS_ctx.$t('common.publish'));
        // @ts-ignore
        [$t, permissionPrecise, id, publish,];
        var __VLS_106;
        var __VLS_107;
    }
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        trigger: "click",
    }));
    const __VLS_113 = __VLS_112({
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    const { default: __VLS_116 } = __VLS_114.slots;
    let __VLS_117;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "ml-8 mt-4" },
    }));
    const __VLS_119 = __VLS_118({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "ml-8 mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
    let __VLS_122;
    const __VLS_123 = {
        /** @type {typeof __VLS_122.click} */
        onClick: () => { },
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    const { default: __VLS_124 } = __VLS_120.slots;
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        iconName: "app-more",
        ...{ class: "rotate-90" },
    }));
    const __VLS_127 = __VLS_126({
        iconName: "app-more",
        ...{ class: "rotate-90" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    /** @type {__VLS_StyleScopedClasses['rotate-90']} */ ;
    // @ts-ignore
    [];
    var __VLS_120;
    var __VLS_121;
    {
        const { dropdown: __VLS_130 } = __VLS_114.slots;
        let __VLS_131;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({}));
        const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
        const { default: __VLS_136 } = __VLS_134.slots;
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
            onClick: (__VLS_ctx.toImportDoc),
        };
        const { default: __VLS_144 } = __VLS_140.slots;
        let __VLS_145;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
            iconName: "app-to-import-doc",
            ...{ class: "color-secondary" },
        }));
        const __VLS_147 = __VLS_146({
            iconName: "app-to-import-doc",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.$t('workflow.operation.toImportDoc'));
        // @ts-ignore
        [$t, toImportDoc,];
        var __VLS_140;
        var __VLS_141;
        if (__VLS_ctx.permissionPrecise.workflow_edit(__VLS_ctx.id)) {
            let __VLS_150;
            /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
            elUpload;
            // @ts-ignore
            const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
                ...{ class: "import-button" },
                ref: "elUploadRef",
                accept: ".kbwf",
                fileList: ([]),
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                limit: (1),
                onChange: ((file, fileList) => __VLS_ctx.importKnowledgeWorkflow(file)),
            }));
            const __VLS_152 = __VLS_151({
                ...{ class: "import-button" },
                ref: "elUploadRef",
                accept: ".kbwf",
                fileList: ([]),
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                limit: (1),
                onChange: ((file, fileList) => __VLS_ctx.importKnowledgeWorkflow(file)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_151));
            var __VLS_155;
            /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
            const { default: __VLS_157 } = __VLS_153.slots;
            let __VLS_158;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({}));
            const __VLS_160 = __VLS_159({}, ...__VLS_functionalComponentArgsRest(__VLS_159));
            const { default: __VLS_163 } = __VLS_161.slots;
            let __VLS_164;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
                iconName: "app-import",
                ...{ class: "color-secondary" },
            }));
            const __VLS_166 = __VLS_165({
                iconName: "app-import",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_165));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.operation.importWorkflow'));
            // @ts-ignore
            [$t, permissionPrecise, id, importKnowledgeWorkflow,];
            var __VLS_161;
            // @ts-ignore
            [];
            var __VLS_153;
        }
        if (__VLS_ctx.permissionPrecise.workflow_export(__VLS_ctx.id)) {
            let __VLS_169;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
                ...{ 'onClick': {} },
            }));
            const __VLS_171 = __VLS_170({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_170));
            let __VLS_174;
            const __VLS_175 = {
                /** @type {typeof __VLS_174.click} */
                onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.showHistory && __VLS_ctx.disablePublic && !__VLS_ctx.route.path.includes('share/')))
                        throw 0;
                    if (!(!__VLS_ctx.route.path.includes('share/')))
                        throw 0;
                    if (!(__VLS_ctx.permissionPrecise.workflow_export(__VLS_ctx.id)))
                        throw 0;
                    return __VLS_ctx.exportKnowledgeWorkflow(__VLS_ctx.detail.name, __VLS_ctx.detail.id);
                    // @ts-ignore
                    [detail, detail, permissionPrecise, id, exportKnowledgeWorkflow,];
                },
            };
            const { default: __VLS_176 } = __VLS_172.slots;
            let __VLS_177;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
                iconName: "app-export",
                ...{ class: "color-secondary" },
            }));
            const __VLS_179 = __VLS_178({
                iconName: "app-export",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_178));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.operation.exportWorkflow'));
            // @ts-ignore
            [$t,];
            var __VLS_172;
            var __VLS_173;
        }
        if (__VLS_ctx.permissionPrecise.doc_create(__VLS_ctx.id)) {
            let __VLS_182;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
                ...{ 'onClick': {} },
                divided: true,
            }));
            const __VLS_184 = __VLS_183({
                ...{ 'onClick': {} },
                divided: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_183));
            let __VLS_187;
            const __VLS_188 = {
                /** @type {typeof __VLS_187.click} */
                onClick: (__VLS_ctx.openListAction),
            };
            const { default: __VLS_189 } = __VLS_185.slots;
            let __VLS_190;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
                iconName: "app-execution-record",
                ...{ class: "color-secondary" },
            }));
            const __VLS_192 = __VLS_191({
                iconName: "app-execution-record",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_191));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('common.ExecutionRecord.title'));
            // @ts-ignore
            [$t, permissionPrecise, id, openListAction,];
            var __VLS_185;
            var __VLS_186;
        }
        let __VLS_195;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
            ...{ 'onClick': {} },
        }));
        const __VLS_197 = __VLS_196({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_196));
        let __VLS_200;
        const __VLS_201 = {
            /** @type {typeof __VLS_200.click} */
            onClick: (__VLS_ctx.openHistory),
        };
        const { default: __VLS_202 } = __VLS_198.slots;
        let __VLS_203;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
            iconName: "app-history-outlined",
            ...{ class: "color-secondary" },
        }));
        const __VLS_205 = __VLS_204({
            iconName: "app-history-outlined",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_204));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.$t('workflow.setting.releaseHistory'));
        // @ts-ignore
        [$t, openHistory,];
        var __VLS_198;
        var __VLS_199;
        if (__VLS_ctx.permissionPrecise.workflow_edit(__VLS_ctx.id)) {
            let __VLS_208;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({}));
            const __VLS_210 = __VLS_209({}, ...__VLS_functionalComponentArgsRest(__VLS_209));
            const { default: __VLS_213 } = __VLS_211.slots;
            let __VLS_214;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
                iconName: "app-save-outlined",
                ...{ class: "color-secondary" },
            }));
            const __VLS_216 = __VLS_215({
                iconName: "app-save-outlined",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_215));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.setting.autoSave'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ml-4" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            let __VLS_219;
            /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
            elSwitch;
            // @ts-ignore
            const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
                ...{ 'onChange': {} },
                size: "small",
                modelValue: (__VLS_ctx.isSave),
            }));
            const __VLS_221 = __VLS_220({
                ...{ 'onChange': {} },
                size: "small",
                modelValue: (__VLS_ctx.isSave),
            }, ...__VLS_functionalComponentArgsRest(__VLS_220));
            let __VLS_224;
            const __VLS_225 = {
                /** @type {typeof __VLS_224.change} */
                onChange: (__VLS_ctx.changeSave),
            };
            var __VLS_222;
            var __VLS_223;
            // @ts-ignore
            [$t, permissionPrecise, id, isSave, changeSave,];
            var __VLS_211;
        }
        // @ts-ignore
        [];
        var __VLS_134;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_114;
}
let __VLS_226;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({}));
const __VLS_228 = __VLS_227({}, ...__VLS_functionalComponentArgsRest(__VLS_227));
const { default: __VLS_231 } = __VLS_229.slots;
const __VLS_232 = DropdownMenu;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
    ...{ 'onClickNodes': {} },
    ...{ 'onOnmousedown': {} },
    show: (__VLS_ctx.showPopover),
    id: (__VLS_ctx.id),
    workflowRef: (__VLS_ctx.workflowRef),
}));
const __VLS_234 = __VLS_233({
    ...{ 'onClickNodes': {} },
    ...{ 'onOnmousedown': {} },
    show: (__VLS_ctx.showPopover),
    id: (__VLS_ctx.id),
    workflowRef: (__VLS_ctx.workflowRef),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
let __VLS_237;
const __VLS_238 = {
    /** @type {typeof __VLS_237.clickNodes} */
    onClickNodes: (__VLS_ctx.clickNodes),
};
const __VLS_239 = {
    /** @type {typeof __VLS_237.onmousedown} */
    onOnmousedown: (__VLS_ctx.onmousedown),
};
__VLS_asFunctionalDirective(__VLS_directives.vClickOutside, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.clickoutside) }, null, null);
var __VLS_235;
var __VLS_236;
// @ts-ignore
[showPopover, id, workflowRef, clickNodes, onmousedown, vClickOutside, clickoutside,];
var __VLS_229;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "workflow-main" },
    ref: "workflowMainRef",
});
/** @type {__VLS_StyleScopedClasses['workflow-main']} */ ;
if (__VLS_ctx.detail) {
    const __VLS_240 = Workflow;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
        ref: "workflowRef",
        data: (__VLS_ctx.detail?.work_flow),
    }));
    const __VLS_242 = __VLS_241({
        ref: "workflowRef",
        data: (__VLS_ctx.detail?.work_flow),
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    var __VLS_245;
    var __VLS_243;
}
let __VLS_247;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent1(__VLS_247, new __VLS_247({}));
const __VLS_249 = __VLS_248({}, ...__VLS_functionalComponentArgsRest(__VLS_248));
const { default: __VLS_252 } = __VLS_250.slots;
if (__VLS_ctx.showDebug) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "workflow-debug-container" },
        ...{ class: (__VLS_ctx.enlarge ? 'enlarge' : '') },
    });
    /** @type {__VLS_StyleScopedClasses['workflow-debug-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "workflow-debug-header" },
        ...{ class: (!__VLS_ctx.isDefaultTheme ? 'custom-header' : '') },
    });
    /** @type {__VLS_StyleScopedClasses['workflow-debug-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-12 ml-24 flex" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.isAppIcon(__VLS_ctx.detail?.icon)) {
        let __VLS_253;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }));
        const __VLS_255 = __VLS_254({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_254));
        const { default: __VLS_258 } = __VLS_256.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.resetUrl(__VLS_ctx.detail?.icon)),
            alt: "",
        });
        // @ts-ignore
        [detail, detail, detail, detail, showDebug, enlarge, isDefaultTheme, isAppIcon, resetUrl,];
        var __VLS_256;
    }
    else {
        let __VLS_259;
        /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
        LogoIcon;
        // @ts-ignore
        const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
            height: "32px",
        }));
        const __VLS_261 = __VLS_260({
            height: "32px",
        }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
        title: (__VLS_ctx.detail?.name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (__VLS_ctx.detail?.name || __VLS_ctx.$t('views.knowledge.form.appName.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
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
            if (!(__VLS_ctx.showDebug))
                throw 0;
            return __VLS_ctx.enlarge = !__VLS_ctx.enlarge;
            // @ts-ignore
            [detail, detail, $t, enlarge, enlarge,];
        },
    };
    const { default: __VLS_271 } = __VLS_267.slots;
    let __VLS_272;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
        iconName: (__VLS_ctx.enlarge ? 'app-minify' : 'app-magnify'),
        ...{ class: "color-secondary" },
        ...{ style: {} },
    }));
    const __VLS_274 = __VLS_273({
        iconName: (__VLS_ctx.enlarge ? 'app-minify' : 'app-magnify'),
        ...{ class: "color-secondary" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [enlarge,];
    var __VLS_267;
    var __VLS_268;
    let __VLS_277;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent1(__VLS_277, new __VLS_277({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_279 = __VLS_278({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    let __VLS_282;
    const __VLS_283 = {
        /** @type {typeof __VLS_282.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.showDebug))
                throw 0;
            return __VLS_ctx.showDebug = false;
            // @ts-ignore
            [showDebug,];
        },
    };
    const { default: __VLS_284 } = __VLS_280.slots;
    let __VLS_285;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
        size: (20),
        ...{ class: "color-secondary" },
    }));
    const __VLS_287 = __VLS_286({
        size: (20),
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    const { default: __VLS_290 } = __VLS_288.slots;
    let __VLS_291;
    /** @ts-ignore @type { | typeof __VLS_components.Close} */
    Close;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({}));
    const __VLS_293 = __VLS_292({}, ...__VLS_functionalComponentArgsRest(__VLS_292));
    // @ts-ignore
    [];
    var __VLS_288;
    // @ts-ignore
    [];
    var __VLS_280;
    var __VLS_281;
}
// @ts-ignore
[];
var __VLS_250;
const __VLS_296 = DebugVue || DebugVue;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
    ref: "DebugRef",
}));
const __VLS_298 = __VLS_297({
    ref: "DebugRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
var __VLS_301;
var __VLS_299;
const __VLS_303 = ExecutionRecord || ExecutionRecord;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
    ref: "ListActionRef",
}));
const __VLS_305 = __VLS_304({
    ref: "ListActionRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
var __VLS_308;
var __VLS_306;
if (__VLS_ctx.showHistory) {
    const __VLS_310 = PublishHistory;
    // @ts-ignore
    const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({
        ...{ 'onClick': {} },
        ...{ 'onRefreshVersion': {} },
    }));
    const __VLS_312 = __VLS_311({
        ...{ 'onClick': {} },
        ...{ 'onRefreshVersion': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_311));
    let __VLS_315;
    const __VLS_316 = {
        /** @type {typeof __VLS_315.click} */
        onClick: (__VLS_ctx.checkVersion),
    };
    const __VLS_317 = {
        /** @type {typeof __VLS_315.refreshVersion} */
        onRefreshVersion: (__VLS_ctx.refreshVersion),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vClickOutside, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.clickoutsideHistory) }, null, null);
    var __VLS_313;
    var __VLS_314;
}
const __VLS_318 = TemplateStoreDialog;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent1(__VLS_318, new __VLS_318({
    ...{ 'onRefresh': {} },
    ref: "templateStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
    source: "work_flow",
}));
const __VLS_320 = __VLS_319({
    ...{ 'onRefresh': {} },
    ref: "templateStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
    source: "work_flow",
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
let __VLS_323;
const __VLS_324 = {
    /** @type {typeof __VLS_323.refresh} */
    onRefresh: (__VLS_ctx.getDetail),
};
var __VLS_325;
var __VLS_321;
var __VLS_322;
// @ts-ignore
var __VLS_156 = __VLS_155, __VLS_246 = __VLS_245, __VLS_302 = __VLS_301, __VLS_309 = __VLS_308, __VLS_326 = __VLS_325;
// @ts-ignore
[showHistory, refreshVersion, vClickOutside, checkVersion, clickoutsideHistory, apiType, getDetail,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
