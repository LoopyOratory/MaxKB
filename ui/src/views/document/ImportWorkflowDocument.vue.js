/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, provide, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DataSource from '@/views/knowledge-workflow/component/action/DataSource.vue';
import Result from '@/views/knowledge-workflow/component/action/Result.vue';
import applicationApi from '@/api/application/application';
import KnowledgeBase from '@/views/knowledge-workflow/component/action/KnowledgeBase.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { WorkflowType } from '@/enums/application';
import { ComplexPermission } from '@/utils/permission/type';
import { hasPermission } from '@/utils/permission';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
provide('upload', (file, onProgress, loading) => {
    return applicationApi.postUploadFileProgress(file, 'TEMPORARY_120_MINUTE', 'TEMPORARY_120_MINUTE', onProgress, loading);
});
const router = useRouter();
const route = useRoute();
const key = ref(0);
const { params: { folderId }, query: { id },
/*
id is knowledgeID
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
    else {
        return 'workspace';
    }
});
const ak = {
    data_source: DataSource,
    knowledge_base: KnowledgeBase,
    result: Result,
};
const loading = ref(false);
const ActionRef = ref();
const action_id = ref();
const form_data = ref({});
const active = ref('data_source');
const _workflow = ref(null);
const actionUploading = computed(() => active.value === 'data_source' && ActionRef.value?.uploadingCount > 0);
const base_form_list = computed(() => {
    const kBase = _workflow.value?.nodes?.find((n) => n.type === WorkflowType.KnowledgeBase);
    if (kBase) {
        return kBase.properties.user_input_field_list;
    }
    return [];
});
const next = () => {
    if (actionUploading.value)
        return;
    ActionRef.value.validate().then(() => {
        form_data.value[active.value] = ActionRef.value.get_data();
        active.value = 'knowledge_base';
    });
};
const up = () => {
    ActionRef.value.validate().then(() => {
        active.value = 'data_source';
    });
};
const upload = () => {
    if (actionUploading.value)
        return;
    ActionRef.value.validate().then(() => {
        form_data.value[active.value] = ActionRef.value.get_data();
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .workflowUpload(id, form_data.value, loading)
            .then((ok) => {
            action_id.value = ok.data.id;
            active.value = 'result';
        });
    });
};
function getDetail() {
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .getKnowledgeDetail(id, loading)
        .then((res) => {
        _workflow.value = res.data.work_flow;
    });
}
const continueImporting = () => {
    active.value = 'data_source';
    key.value++;
    action_id.value = undefined;
    const c_workflow = _workflow.value;
    _workflow.value = null;
    form_data.value = {};
    nextTick(() => {
        _workflow.value = c_workflow;
    });
};
const goDocument = () => {
    router.push({ path: `/knowledge/${id}/${folderId}/4/document` });
};
const back = () => {
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
onMounted(() => {
    getDetail();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document p-12-24" },
});
/** @type {__VLS_StyleScopedClasses['upload-document']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button'] | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button']} */
backButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.back),
};
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ style: {} },
});
(__VLS_ctx.$t('views.document.importDocument'));
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__main flex" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['upload-document__main']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__component main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['upload-document__component']} */ ;
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-component p-24" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['upload-component']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.keepAlive | typeof __VLS_components.KeepAlive | typeof __VLS_components['keep-alive'] | typeof __VLS_components.keepAlive | typeof __VLS_components.KeepAlive | typeof __VLS_components['keep-alive']} */
keepAlive;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    key: (__VLS_ctx.key),
    include: (['data_source', 'knowledge_base']),
}));
const __VLS_21 = __VLS_20({
    key: (__VLS_ctx.key),
    include: (['data_source', 'knowledge_base']),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
const __VLS_25 = (__VLS_ctx.ak[__VLS_ctx.active]);
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ref: "ActionRef",
    loading: (__VLS_ctx.loading),
    workflow: (__VLS_ctx._workflow),
    knowledge_id: (__VLS_ctx.id),
    id: (__VLS_ctx.action_id),
}));
const __VLS_27 = __VLS_26({
    ref: "ActionRef",
    loading: (__VLS_ctx.loading),
    workflow: (__VLS_ctx._workflow),
    knowledge_id: (__VLS_ctx.id),
    id: (__VLS_ctx.action_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
var __VLS_30;
var __VLS_28;
// @ts-ignore
[back, $t, vLoading, loading, loading, key, ak, active, _workflow, id, action_id,];
var __VLS_22;
// @ts-ignore
[];
var __VLS_16;
// @ts-ignore
[];
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__footer text-right border-t" },
});
/** @type {__VLS_StyleScopedClasses['upload-document__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
if (__VLS_ctx.active == 'result') {
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_37;
    const __VLS_38 = {
        /** @type {typeof __VLS_37.click} */
        onClick: (__VLS_ctx.continueImporting),
    };
    const { default: __VLS_39 } = __VLS_35.slots;
    (__VLS_ctx.$t('views.document.buttons.continueImporting'));
    // @ts-ignore
    [$t, active, continueImporting,];
    var __VLS_35;
    var __VLS_36;
}
if (__VLS_ctx.base_form_list.length > 0 && __VLS_ctx.active == 'knowledge_base') {
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        /** @type {typeof __VLS_45.click} */
        onClick: (__VLS_ctx.up),
    };
    const { default: __VLS_47 } = __VLS_43.slots;
    (__VLS_ctx.$t('common.steps.prev'));
    // @ts-ignore
    [$t, loading, active, base_form_list, up,];
    var __VLS_43;
    var __VLS_44;
}
if (__VLS_ctx.base_form_list.length > 0 && __VLS_ctx.active == 'data_source') {
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.loading || __VLS_ctx.actionUploading),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.loading || __VLS_ctx.actionUploading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.click} */
        onClick: (__VLS_ctx.next),
    };
    const { default: __VLS_55 } = __VLS_51.slots;
    (__VLS_ctx.$t('common.steps.next'));
    // @ts-ignore
    [$t, loading, active, base_form_list, actionUploading, next,];
    var __VLS_51;
    var __VLS_52;
}
if (__VLS_ctx.base_form_list.length > 0 ? __VLS_ctx.active == 'knowledge_base' : __VLS_ctx.active == 'data_source') {
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading || __VLS_ctx.actionUploading),
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading || __VLS_ctx.actionUploading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_61;
    const __VLS_62 = {
        /** @type {typeof __VLS_61.click} */
        onClick: (__VLS_ctx.upload),
    };
    const { default: __VLS_63 } = __VLS_59.slots;
    (__VLS_ctx.$t('views.document.buttons.import'));
    // @ts-ignore
    [$t, loading, active, active, base_form_list, actionUploading, upload,];
    var __VLS_59;
    var __VLS_60;
}
if (__VLS_ctx.active == 'result') {
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.click} */
        onClick: (__VLS_ctx.goDocument),
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    (__VLS_ctx.$t('views.knowledge.ResultSuccess.buttons.toDocument'));
    // @ts-ignore
    [$t, active, goDocument,];
    var __VLS_67;
    var __VLS_68;
}
// @ts-ignore
var __VLS_31 = __VLS_30;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
