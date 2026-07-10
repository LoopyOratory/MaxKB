/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseForm from '@/views/knowledge/component/BaseForm.vue';
import { MsgSuccess } from '@/utils/message';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { knowledgeTemplate } from '@/workflow/common/template';
import { t } from '@/locales';
import useStore from '@/stores';
const emit = defineEmits(['refresh']);
const { user } = useStore();
const router = useRouter();
const route = useRoute();
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
const BaseFormRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const currentFolder = ref(null);
const workflowDefault = ref(knowledgeTemplate.default);
const workflowTemplate = ref();
watch(dialogVisible, (bool) => {
    if (!bool) {
        currentFolder.value = null;
    }
});
const open = (folder, workflow) => {
    currentFolder.value = folder;
    if (workflow) {
        workflowTemplate.value = workflow;
    }
    dialogVisible.value = true;
};
const submitHandle = async () => {
    if (await BaseFormRef.value?.validate()) {
        const obj = {
            folder_id: currentFolder.value?.id,
            work_flow: workflowDefault.value,
            work_flow_template: workflowTemplate.value,
            ...BaseFormRef.value.form,
        };
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .createWorkflowKnowledge(obj, loading)
            .then(async (res) => {
            await user.profile().then(() => {
                MsgSuccess(t('common.createSuccess'));
                router.push({
                    path: `/knowledge/${res.data.id}/${currentFolder.value.id || 'shared'}/workflow`,
                });
                emit('refresh');
            });
        });
    }
    else {
        return false;
    }
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.$t('views.knowledge.knowledgeType.createWorkflowKnowledge')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "720",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.knowledge.knowledgeType.createWorkflowKnowledge')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "720",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.dialogVisible) {
    const __VLS_7 = BaseForm;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ref: "BaseFormRef",
        apiType: (__VLS_ctx.apiType),
    }));
    const __VLS_9 = __VLS_8({
        ref: "BaseFormRef",
        apiType: (__VLS_ctx.apiType),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    var __VLS_12;
    var __VLS_10;
}
{
    const { footer: __VLS_14 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_17 = __VLS_16({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_20;
    const __VLS_21 = {
        /** @type {typeof __VLS_20.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [$t, dialogVisible, dialogVisible, dialogVisible, apiType, loading,];
        },
    };
    const { default: __VLS_22 } = __VLS_18.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_18;
    var __VLS_19;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    const __VLS_29 = {
        /** @type {typeof __VLS_28.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_30 } = __VLS_26.slots;
    (__VLS_ctx.$t('common.create'));
    // @ts-ignore
    [$t, loading, submitHandle,];
    var __VLS_26;
    var __VLS_27;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
