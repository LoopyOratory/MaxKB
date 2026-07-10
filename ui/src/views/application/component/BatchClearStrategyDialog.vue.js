/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import ApplicationApi from '@/api/application/application';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
const emit = defineEmits(['refresh']);
const loading = ref(false);
const dialogVisible = ref(false);
const days = ref(180);
const fileDays = ref(180);
const selectedIds = ref([]);
function open(idList) {
    selectedIds.value = [...idList];
    days.value = 180;
    fileDays.value = 180;
    dialogVisible.value = true;
}
function submitHandle() {
    if (fileDays.value > days.value) {
        fileDays.value = days.value;
    }
    ApplicationApi.putMulCleanTime({
        id_list: selectedIds.value,
        clean_time: days.value,
        file_clean_time: fileDays.value,
    }, loading).then(() => {
        MsgSuccess(t('common.saveSuccess'));
        dialogVisible.value = false;
        emit('refresh');
    });
}
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
    title: (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "520px",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.chatLog.buttons.clearStrategy')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "520px",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
elAlert;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    title: (__VLS_ctx.$t('views.application.batchClearStrategyTip')),
    type: "info",
    closable: (false),
    ...{ class: "mb-16" },
}));
const __VLS_9 = __VLS_8({
    title: (__VLS_ctx.$t('views.application.batchClearStrategyTip')),
    type: "info",
    closable: (false),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "clean-strategy-row mb-16" },
});
/** @type {__VLS_StyleScopedClasses['clean-strategy-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('common.delete'));
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.days),
    controlsPosition: "right",
    min: (1),
    max: (100000),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ class: "clean-strategy-number" },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.days),
    controlsPosition: "right",
    min: (1),
    max: (100000),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ class: "clean-strategy-number" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {__VLS_StyleScopedClasses['clean-strategy-number']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('views.chatLog.daysText'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "clean-strategy-row" },
});
/** @type {__VLS_StyleScopedClasses['clean-strategy-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('common.delete'));
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    modelValue: (__VLS_ctx.fileDays),
    controlsPosition: "right",
    min: (1),
    max: (__VLS_ctx.days),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ class: "clean-strategy-number" },
}));
const __VLS_19 = __VLS_18({
    modelValue: (__VLS_ctx.fileDays),
    controlsPosition: "right",
    min: (1),
    max: (__VLS_ctx.days),
    valueOnClear: (0),
    stepStrictly: true,
    ...{ class: "clean-strategy-number" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {__VLS_StyleScopedClasses['clean-strategy-number']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('views.chatLog.fileDaysText'));
{
    const { footer: __VLS_22 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    const __VLS_29 = {
        /** @type {typeof __VLS_28.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [$t, $t, $t, $t, $t, $t, dialogVisible, dialogVisible, days, days, fileDays, loading,];
        },
    };
    const { default: __VLS_30 } = __VLS_26.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_26;
    var __VLS_27;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    const __VLS_37 = {
        /** @type {typeof __VLS_36.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_38 } = __VLS_34.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, loading, submitHandle,];
    var __VLS_34;
    var __VLS_35;
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
