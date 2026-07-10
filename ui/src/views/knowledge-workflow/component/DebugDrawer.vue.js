/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, provide, nextTick } from 'vue';
import DataSource from '@/views/knowledge-workflow/component/action/DataSource.vue';
import Result from '@/views/knowledge-workflow/component/action/Result.vue';
import applicationApi from '@/api/application/application';
import KnowledgeBase from '@/views/knowledge-workflow/component/action/KnowledgeBase.vue';
import { WorkflowType } from '@/enums/application';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
import { useRoute, useRouter } from 'vue-router';
provide('upload', (file, loading) => {
    return applicationApi.postUploadFile(file, id, 'KNOWLEDGE', loading);
});
const key = ref(0);
const router = useRouter();
const route = useRoute();
const { params: { id, folderId },
/*
id is knowledge_id
*/
 } = route;
const ak = {
    data_source: DataSource,
    knowledge_base: KnowledgeBase,
    result: Result,
};
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
const loading = ref(false);
const action_id = ref();
const ActionRef = ref();
const form_data = ref({});
const active = ref('data_source');
const drawerVisible = ref(false);
const _workflow = ref(null);
const close = () => {
    drawerVisible.value = false;
    _workflow.value = null;
    active.value = 'data_source';
};
const open = (workflow) => {
    drawerVisible.value = true;
    _workflow.value = workflow;
};
const base_form_list = computed(() => {
    const kBase = _workflow.value?.nodes?.find((n) => n.type === WorkflowType.KnowledgeBase);
    if (kBase) {
        return kBase.properties.user_input_field_list;
    }
    return [];
});
const next = () => {
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
const isShared = computed(() => {
    return folderId === 'share';
});
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][apiType.value];
});
const upload = () => {
    if (permissionPrecise.value.doc_create(id)) {
        ActionRef.value.validate().then(() => {
            form_data.value[active.value] = ActionRef.value.get_data();
            loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
                .workflowAction(id, form_data.value, loading)
                .then((ok) => {
                action_id.value = ok.data.id;
                active.value = 'result';
            });
        });
    }
    else {
        MsgError(t('views.application.tip.noDocPermission'));
    }
};
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
    const newUrl = router.resolve({
        path: `/knowledge/${id}/${folderId}/4/document`,
    }).href;
    window.open(newUrl);
};
const __VLS_exposed = { close, open };
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
    modelValue: (__VLS_ctx.drawerVisible),
    title: (__VLS_ctx.$t('common.debug')),
    size: "800px",
    direction: "rtl",
    destroyOnClose: true,
    beforeClose: (__VLS_ctx.close),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawerVisible),
    title: (__VLS_ctx.$t('common.debug')),
    size: "800px",
    direction: "rtl",
    destroyOnClose: true,
    beforeClose: (__VLS_ctx.close),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.keepAlive | typeof __VLS_components.KeepAlive | typeof __VLS_components['keep-alive'] | typeof __VLS_components.keepAlive | typeof __VLS_components.KeepAlive | typeof __VLS_components['keep-alive']} */
keepAlive;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    key: (__VLS_ctx.key),
    include: (['DataSource', 'KnowledgeBase']),
}));
const __VLS_9 = __VLS_8({
    key: (__VLS_ctx.key),
    include: (['DataSource', 'KnowledgeBase']),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
const __VLS_13 = (__VLS_ctx.ak[__VLS_ctx.active]);
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ref: "ActionRef",
    loading: (__VLS_ctx.loading),
    workflow: (__VLS_ctx._workflow),
    knowledge_id: (__VLS_ctx.id),
    id: (__VLS_ctx.action_id),
}));
const __VLS_15 = __VLS_14({
    ref: "ActionRef",
    loading: (__VLS_ctx.loading),
    workflow: (__VLS_ctx._workflow),
    knowledge_id: (__VLS_ctx.id),
    id: (__VLS_ctx.action_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_18;
var __VLS_16;
// @ts-ignore
[drawerVisible, $t, close, vLoading, loading, loading, key, ak, active, _workflow, id, action_id,];
var __VLS_10;
{
    const { footer: __VLS_20 } = __VLS_3.slots;
    if (__VLS_ctx.active == 'result') {
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            ...{ 'onClick': {} },
        }));
        const __VLS_23 = __VLS_22({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        let __VLS_26;
        const __VLS_27 = {
            /** @type {typeof __VLS_26.click} */
            onClick: (__VLS_ctx.continueImporting),
        };
        const { default: __VLS_28 } = __VLS_24.slots;
        (__VLS_ctx.$t('views.document.buttons.continueImporting'));
        // @ts-ignore
        [$t, active, continueImporting,];
        var __VLS_24;
        var __VLS_25;
    }
    if (__VLS_ctx.base_form_list.length > 0 && __VLS_ctx.active == 'knowledge_base') {
        let __VLS_29;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_31 = __VLS_30({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        let __VLS_34;
        const __VLS_35 = {
            /** @type {typeof __VLS_34.click} */
            onClick: (__VLS_ctx.up),
        };
        const { default: __VLS_36 } = __VLS_32.slots;
        (__VLS_ctx.$t('common.steps.prev'));
        // @ts-ignore
        [$t, loading, active, base_form_list, up,];
        var __VLS_32;
        var __VLS_33;
    }
    if (__VLS_ctx.base_form_list.length > 0 && __VLS_ctx.active == 'data_source') {
        let __VLS_37;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_39 = __VLS_38({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        let __VLS_42;
        const __VLS_43 = {
            /** @type {typeof __VLS_42.click} */
            onClick: (__VLS_ctx.next),
        };
        const { default: __VLS_44 } = __VLS_40.slots;
        (__VLS_ctx.$t('common.steps.next'));
        // @ts-ignore
        [$t, loading, active, base_form_list, next,];
        var __VLS_40;
        var __VLS_41;
    }
    if (__VLS_ctx.base_form_list.length > 0 ? __VLS_ctx.active == 'knowledge_base' : __VLS_ctx.active == 'data_source') {
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_47 = __VLS_46({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        let __VLS_50;
        const __VLS_51 = {
            /** @type {typeof __VLS_50.click} */
            onClick: (__VLS_ctx.upload),
        };
        const { default: __VLS_52 } = __VLS_48.slots;
        (__VLS_ctx.$t('views.document.buttons.import'));
        // @ts-ignore
        [$t, loading, active, active, base_form_list, upload,];
        var __VLS_48;
        var __VLS_49;
    }
    if (__VLS_ctx.active == 'result') {
        let __VLS_53;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_55 = __VLS_54({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        let __VLS_58;
        const __VLS_59 = {
            /** @type {typeof __VLS_58.click} */
            onClick: (__VLS_ctx.goDocument),
        };
        const { default: __VLS_60 } = __VLS_56.slots;
        (__VLS_ctx.$t('views.knowledge.ResultSuccess.buttons.toDocument'));
        // @ts-ignore
        [$t, active, goDocument,];
        var __VLS_56;
        var __VLS_57;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_19 = __VLS_18;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
