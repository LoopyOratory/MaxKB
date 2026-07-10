/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { Status, TaskType, State } from '@/utils/status';
import { mergeWith } from 'lodash';
const props = defineProps();
const parseAgg = (agg) => {
    const status = new Status(agg.status);
    return Object.keys(TaskType)
        .map((key) => {
        const value = TaskType[key];
        return { [value]: { [status.task_status[value]]: agg.count } };
    })
        .reduce((x, y) => ({ ...x, ...y }), {});
};
const customizer = (objValue, srcValue) => {
    if (objValue == undefined && srcValue) {
        return srcValue;
    }
    if (srcValue == undefined && objValue) {
        return objValue;
    }
    // IfArray, we willElementPerformAggregation
    if (typeof objValue === 'object' && typeof srcValue === 'object') {
        // IfobjectTypeObject, wePerformRecursive
        return mergeWith(objValue, srcValue, customizer);
    }
    else {
        // Otherwise, simply accumulate the value
        return objValue + srcValue;
    }
};
const aggs = computed(() => {
    return (props.statusMeta.aggs ? props.statusMeta.aggs : [])
        .map((agg) => {
        return parseAgg(agg);
    })
        .reduce((x, y) => {
        return mergeWith(x, y, customizer);
    }, {});
});
const statusTable = computed(() => {
    return Object.keys(TaskType)
        .map((key) => {
        const value = TaskType[key];
        const parseStatus = new Status(props.status);
        return {
            type: value,
            state: parseStatus.task_status[value],
            aggs: aggs.value[value],
            time: props.statusMeta.state_time[value],
        };
    })
        .filter((item) => item.state !== State.IGNORED);
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
for (const [status] of __VLS_vFor((__VLS_ctx.statusTable))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (status.type),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.taskTypeMap[status.type]);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    if (status.state === __VLS_ctx.State.SUCCESS || status.state === __VLS_ctx.State.REVOKED) {
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_2 = __VLS_1({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_5 } = __VLS_3.slots;
        let __VLS_6;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            ...{ class: "color-success" },
        }));
        const __VLS_8 = __VLS_7({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_11 } = __VLS_9.slots;
        let __VLS_12;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
        const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
        // @ts-ignore
        [statusTable, taskTypeMap, State, State,];
        var __VLS_9;
        (__VLS_ctx.stateMap[status.state](status.type));
        // @ts-ignore
        [stateMap,];
        var __VLS_3;
    }
    else if (status.state === __VLS_ctx.State.FAILURE) {
        let __VLS_17;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_19 = __VLS_18({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_22 } = __VLS_20.slots;
        let __VLS_23;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            ...{ class: "color-danger" },
        }));
        const __VLS_25 = __VLS_24({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_28 } = __VLS_26.slots;
        let __VLS_29;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
        const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
        // @ts-ignore
        [State,];
        var __VLS_26;
        (__VLS_ctx.stateMap[status.state](status.type));
        // @ts-ignore
        [stateMap,];
        var __VLS_20;
    }
    else if (status.state === __VLS_ctx.State.STARTED) {
        let __VLS_34;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_36 = __VLS_35({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_39 } = __VLS_37.slots;
        let __VLS_40;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_42 = __VLS_41({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_45 } = __VLS_43.slots;
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
        const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
        // @ts-ignore
        [State,];
        var __VLS_43;
        (__VLS_ctx.stateMap[status.state](status.type));
        // @ts-ignore
        [stateMap,];
        var __VLS_37;
    }
    else if (status.state === __VLS_ctx.State.PENDING) {
        let __VLS_51;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_53 = __VLS_52({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_56 } = __VLS_54.slots;
        let __VLS_57;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_59 = __VLS_58({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_62 } = __VLS_60.slots;
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({}));
        const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
        // @ts-ignore
        [State,];
        var __VLS_60;
        (__VLS_ctx.stateMap[status.state](status.type));
        // @ts-ignore
        [stateMap,];
        var __VLS_54;
    }
    else if (status.state === __VLS_ctx.State.REVOKE) {
        let __VLS_68;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
            ...{ class: "color-text-primary" },
        }));
        const __VLS_70 = __VLS_69({
            ...{ class: "color-text-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        const { default: __VLS_73 } = __VLS_71.slots;
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            ...{ class: "is-loading color-primary" },
        }));
        const __VLS_76 = __VLS_75({
            ...{ class: "is-loading color-primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        const { default: __VLS_79 } = __VLS_77.slots;
        let __VLS_80;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({}));
        const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
        // @ts-ignore
        [State,];
        var __VLS_77;
        (__VLS_ctx.stateMap[status.state](status.type));
        // @ts-ignore
        [stateMap,];
        var __VLS_71;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8 lighter" },
        ...{ style: ({ color: [__VLS_ctx.State.FAILURE, __VLS_ctx.State.REVOKED].includes(status.state) ? '#F54A45' : '' }) },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('views.document.fileStatus.finish'));
    (Object.keys(status.aggs ? status.aggs : {})
        .filter((k) => k == __VLS_ctx.State.SUCCESS)
        .map((k) => status.aggs[k])
        .reduce((x, y) => x + y, 0));
    (Object.values(status.aggs ? status.aggs : {}).reduce((x, y) => x + y, 0));
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        type: "info",
        ...{ class: "ml-12" },
    }));
    const __VLS_87 = __VLS_86({
        type: "info",
        ...{ class: "ml-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    const { default: __VLS_90 } = __VLS_88.slots;
    (status.time
        ? status.time[status.state == __VLS_ctx.State.REVOKED ? __VLS_ctx.State.REVOKED : __VLS_ctx.State.PENDING]?.substring(0, 19)
        : undefined);
    // @ts-ignore
    [State, State, State, State, State, State, $t,];
    var __VLS_88;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
