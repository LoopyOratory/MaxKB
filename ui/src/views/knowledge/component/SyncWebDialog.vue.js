/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { MsgSuccess } from '@/utils/message';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { t } from '@/locales';
const route = useRoute();
const { query: { from }, } = route;
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management') || from === 'systemManage') {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const emit = defineEmits(['refresh']);
const loading = ref(false);
const method = ref('replace');
const knowledgeId = ref('');
const dialogVisible = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        method.value = 'replace';
    }
});
const open = (id) => {
    knowledgeId.value = id;
    dialogVisible.value = true;
};
const submit = () => {
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .putSyncWebKnowledge(knowledgeId.value, method.value, loading)
        .then((res) => {
        emit('refresh', res.data);
        MsgSuccess(t('views.knowledge.tip.syncSuccess'));
        dialogVisible.value = false;
    });
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
    title: (__VLS_ctx.$t('views.knowledge.syncWeb.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.knowledge.syncWeb.title')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-8" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.knowledge.syncWeb.syncMethod'));
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.method),
    ...{ class: "card__radio" },
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.method),
    ...{ class: "card__radio" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['card__radio']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.method === 'replace' ? 'border-active' : '') },
}));
const __VLS_15 = __VLS_14({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.method === 'replace' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    value: "replace",
    size: "large",
}));
const __VLS_21 = __VLS_20({
    value: "replace",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.knowledge.syncWeb.replace'));
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    type: "info",
}));
const __VLS_27 = __VLS_26({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
(__VLS_ctx.$t('views.knowledge.syncWeb.replaceText'));
// @ts-ignore
[$t, $t, $t, $t, dialogVisible, method, method,];
var __VLS_28;
// @ts-ignore
[];
var __VLS_22;
// @ts-ignore
[];
var __VLS_16;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.method === 'complete' ? 'border-active' : '') },
}));
const __VLS_33 = __VLS_32({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.method === 'complete' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_36 } = __VLS_34.slots;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    value: "complete",
    size: "large",
}));
const __VLS_39 = __VLS_38({
    value: "complete",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.knowledge.syncWeb.complete'));
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    type: "info",
}));
const __VLS_45 = __VLS_44({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
(__VLS_ctx.$t('views.knowledge.syncWeb.completeText'));
// @ts-ignore
[$t, $t, method,];
var __VLS_46;
// @ts-ignore
[];
var __VLS_40;
// @ts-ignore
[];
var __VLS_34;
// @ts-ignore
[];
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-danger" },
});
/** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
(__VLS_ctx.$t('views.knowledge.syncWeb.tip'));
{
    const { footer: __VLS_49 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onClick': {} },
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        /** @type {typeof __VLS_55.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [$t, dialogVisible,];
        },
    };
    const { default: __VLS_57 } = __VLS_53.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_53;
    var __VLS_54;
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_60 = __VLS_59({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    let __VLS_63;
    const __VLS_64 = {
        /** @type {typeof __VLS_63.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_65 } = __VLS_61.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_61;
    var __VLS_62;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
