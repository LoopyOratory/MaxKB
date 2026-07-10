/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import LoopFieldTable from '@/workflow/nodes/loop-start-node/component/LoopFieldTable.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { copyClick } from '@/utils/clipboard';
const props = defineProps();
const loop_input_fields = computed(() => {
    return (props.nodeModel.properties.loop_input_field_list
        ? props.nodeModel.properties.loop_input_field_list
        : []).map((i) => {
        if (i.label && i.label.input_type === 'TooltipLabel') {
            return { label: i.label.label, value: i.field || i.variable };
        }
        return { label: i.label || i.name, value: i.field || i.variable };
    });
});
watch(loop_input_fields, () => {
    props.nodeModel.graphModel.refresh_loop_fields(cloneDeep(loop_input_fields.value));
});
const showicon = ref(false);
onMounted(() => {
    props.nodeModel.graphModel.refresh_loop_fields(cloneDeep(loop_input_fields.value));
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
const __VLS_0 = NodeContainer || NodeContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_2 = __VLS_1({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('workflow.nodeSetting'));
const __VLS_7 = LoopFieldTable || LoopFieldTable;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_9 = __VLS_8({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
if (__VLS_ctx.loop_input_fields?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "title-decoration-1 mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('workflow.variable.loop'));
    for (const [item, index] of __VLS_vFor((__VLS_ctx.loop_input_fields || []))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.loop_input_fields?.length))
                        throw 0;
                    return __VLS_ctx.showicon = true;
                    // @ts-ignore
                    [nodeModel, nodeModel, $t, $t, loop_input_fields, loop_input_fields, showicon,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.loop_input_fields?.length))
                        throw 0;
                    return __VLS_ctx.showicon = false;
                    // @ts-ignore
                    [showicon,];
                } },
            key: (index),
            ...{ class: "flex-between border-r-6 p-8-12 mb-8 layout-bg lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "break-all" },
        });
        /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
        (item.label);
        ('{' + item.value + '}');
        if (__VLS_ctx.showicon === true) {
            let __VLS_12;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }));
            const __VLS_14 = __VLS_13({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            const { default: __VLS_17 } = __VLS_15.slots;
            let __VLS_18;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }));
            const __VLS_20 = __VLS_19({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_19));
            let __VLS_23;
            const __VLS_24 = {
                /** @type {typeof __VLS_23.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loop_input_fields?.length))
                        throw 0;
                    if (!(__VLS_ctx.showicon === true))
                        throw 0;
                    return __VLS_ctx.copyClick(`{{loop.${item.value}}}`);
                    // @ts-ignore
                    [$t, showicon, copyClick,];
                },
            };
            const { default: __VLS_25 } = __VLS_21.slots;
            let __VLS_26;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
                iconName: "app-copy",
            }));
            const __VLS_28 = __VLS_27({
                iconName: "app-copy",
            }, ...__VLS_functionalComponentArgsRest(__VLS_27));
            // @ts-ignore
            [];
            var __VLS_21;
            var __VLS_22;
            // @ts-ignore
            [];
            var __VLS_15;
        }
        // @ts-ignore
        [];
    }
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
