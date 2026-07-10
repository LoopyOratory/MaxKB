/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed } from 'vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import { useRoute, useRouter } from 'vue-router';
import { knowledgeTemplate } from '@/workflow/common/template.ts';
const route = useRoute();
const { params: { id, folderId }, } = route;
const router = useRouter();
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
const workflowDefault = ref(knowledgeTemplate.default);
const loading = ref(false);
function transformHandle() {
    MsgConfirm(t('common.tip'), t('views.knowledge.transform.comfirm'), {
        cancelButtonText: t('common.close'),
        type: 'warning',
    })
        .then(() => {
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .postTransformWorkflow(id, { work_flow: workflowDefault.value }, loading)
            .then(() => {
            MsgSuccess(t('common.submitSuccess'));
            router.push({ path: `/knowledge/${id}/${folderId}/workflow` });
        })
            .catch(() => {
            loading.value = false;
        });
    })
        .catch(() => { });
}
onMounted(() => { });
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
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-center h-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "mb-12" },
});
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
(__VLS_ctx.$t('views.knowledge.transform.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "color-secondary lighter line-height-22" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
(__VLS_ctx.$t('views.knowledge.transform.message1'));
__VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
(__VLS_ctx.$t('views.knowledge.transform.message2'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mt-24 mb-8 color-organe" },
});
/** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['color-organe']} */ ;
(__VLS_ctx.$t('views.knowledge.transform.tip'));
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.click} */
    onClick: (__VLS_ctx.transformHandle),
};
const { default: __VLS_13 } = __VLS_9.slots;
(__VLS_ctx.$t('views.knowledge.transform.button'));
// @ts-ignore
[$t, $t, $t, $t, $t, transformHandle,];
var __VLS_9;
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    ...{ class: "ml-24" },
    src: "@/assets/workflow-demo.png",
    width: "708",
    alt: "",
});
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
