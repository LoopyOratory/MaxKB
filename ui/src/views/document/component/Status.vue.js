/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { TaskType, State } from '@/utils/status';
import StatusTable from '@/views/document/component/StatusTable.vue';
import { t } from '@/locales';
const props = defineProps();
const visible = ref(false);
const checkList = [
    State.REVOKE,
    State.STARTED,
    State.PENDING,
    State.FAILURE,
    State.REVOKED,
    State.SUCCESS,
];
const aggStatus = computed(() => {
    let obj = { key: 0, value: '' };
    for (const i in checkList) {
        const state = checkList[i];
        const index = props.status.indexOf(state);
        if (index > -1) {
            obj = { key: props.status.length - index, value: state };
            break;
        }
    }
    return obj;
});
const startedMap = {
    [TaskType.EMBEDDING]: t('views.document.fileStatus.EMBEDDING'),
    [TaskType.GENERATE_PROBLEM]: t('views.document.fileStatus.GENERATE'),
    [TaskType.SYNC]: t('views.document.fileStatus.SYNC'),
    [TaskType.TOKENIZE]: t('views.document.fileStatus.TOKENIZE'),
};
const taskTypeMap = {
    [TaskType.EMBEDDING]: t('views.knowledge.setting.vectorization'),
    [TaskType.GENERATE_PROBLEM]: t('views.document.generateQuestion.title'),
    [TaskType.SYNC]: t('views.knowledge.setting.sync'),
    [TaskType.TOKENIZE]: t('views.knowledge.setting.tokenize'),
};
const stateMap = {
    [State.PENDING]: (type) => t('views.document.fileStatus.PENDING'),
    [State.STARTED]: (type) => startedMap[type],
    [State.REVOKE]: (type) => t('common.status.REVOKE'),
    [State.REVOKED]: (type) => t('common.status.success'),
    [State.FAILURE]: (type) => t('common.status.fail'),
    [State.SUCCESS]: (type) => t('common.status.success'),
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
elPopover;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    visible: (__VLS_ctx.visible),
    placement: "top",
    trigger: "hover",
    popperStyle: ({ width: 'auto' }),
    persistent: (false),
}));
const __VLS_2 = __VLS_1({
    visible: (__VLS_ctx.visible),
    placement: "top",
    trigger: "hover",
    popperStyle: ({ width: 'auto' }),
    persistent: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { default: __VLS_7 } = __VLS_3.slots;
    if (__VLS_ctx.visible) {
        const __VLS_8 = StatusTable || StatusTable;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            status: (__VLS_ctx.status),
            statusMeta: (__VLS_ctx.statusMeta),
            taskTypeMap: (__VLS_ctx.taskTypeMap),
            stateMap: (__VLS_ctx.stateMap),
        }));
        const __VLS_10 = __VLS_9({
            status: (__VLS_ctx.status),
            statusMeta: (__VLS_ctx.statusMeta),
            taskTypeMap: (__VLS_ctx.taskTypeMap),
            stateMap: (__VLS_ctx.stateMap),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    }
    // @ts-ignore
    [visible, visible, status, statusMeta, taskTypeMap, stateMap,];
}
{
    const { reference: __VLS_13 } = __VLS_3.slots;
    if (__VLS_ctx.aggStatus?.value === __VLS_ctx.State.SUCCESS || __VLS_ctx.aggStatus?.value === __VLS_ctx.State.REVOKED) {
        let __VLS_14;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_16 = __VLS_15({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_19 } = __VLS_17.slots;
        let __VLS_20;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            ...{ class: "color-success" },
        }));
        const __VLS_22 = __VLS_21({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_25 } = __VLS_23.slots;
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({}));
        const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
        // @ts-ignore
        [aggStatus, aggStatus, State, State,];
        var __VLS_23;
        (__VLS_ctx.stateMap[__VLS_ctx.aggStatus.value](__VLS_ctx.aggStatus.key));
        // @ts-ignore
        [stateMap, aggStatus, aggStatus,];
        var __VLS_17;
    }
    else if (__VLS_ctx.aggStatus?.value === __VLS_ctx.State.FAILURE) {
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_33 = __VLS_32({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_36 } = __VLS_34.slots;
        let __VLS_37;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            ...{ class: "color-danger" },
        }));
        const __VLS_39 = __VLS_38({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_42 } = __VLS_40.slots;
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
        const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
        // @ts-ignore
        [aggStatus, State,];
        var __VLS_40;
        (__VLS_ctx.stateMap[__VLS_ctx.aggStatus.value](__VLS_ctx.aggStatus.key));
        // @ts-ignore
        [stateMap, aggStatus, aggStatus,];
        var __VLS_34;
    }
    else if (__VLS_ctx.aggStatus?.value === __VLS_ctx.State.STARTED) {
        let __VLS_48;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_50 = __VLS_49({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_53 } = __VLS_51.slots;
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_56 = __VLS_55({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_59 } = __VLS_57.slots;
        let __VLS_60;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({}));
        const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
        // @ts-ignore
        [aggStatus, State,];
        var __VLS_57;
        (__VLS_ctx.stateMap[__VLS_ctx.aggStatus.value](__VLS_ctx.aggStatus.key));
        // @ts-ignore
        [stateMap, aggStatus, aggStatus,];
        var __VLS_51;
    }
    else if (__VLS_ctx.aggStatus?.value === __VLS_ctx.State.PENDING) {
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_67 = __VLS_66({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_70 } = __VLS_68.slots;
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_73 = __VLS_72({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_76 } = __VLS_74.slots;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({}));
        const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
        // @ts-ignore
        [aggStatus, State,];
        var __VLS_74;
        (__VLS_ctx.stateMap[__VLS_ctx.aggStatus.value](__VLS_ctx.aggStatus.key));
        // @ts-ignore
        [stateMap, aggStatus, aggStatus,];
        var __VLS_68;
    }
    else if (__VLS_ctx.aggStatus?.value === __VLS_ctx.State.REVOKE) {
        let __VLS_82;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_84 = __VLS_83({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_87 } = __VLS_85.slots;
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_90 = __VLS_89({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_93 } = __VLS_91.slots;
        let __VLS_94;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({}));
        const __VLS_96 = __VLS_95({}, ...__VLS_functionalComponentArgsRest(__VLS_95));
        // @ts-ignore
        [aggStatus, State,];
        var __VLS_91;
        (__VLS_ctx.stateMap[__VLS_ctx.aggStatus.value](__VLS_ctx.aggStatus.key));
        // @ts-ignore
        [stateMap, aggStatus, aggStatus,];
        var __VLS_85;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
