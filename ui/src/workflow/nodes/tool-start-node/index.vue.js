/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { copyClick } from '@/utils/clipboard';
import { ref, onMounted } from 'vue';
const showicon = ref(false);
const props = defineProps();
const getRefreshFieldList = () => {
    const user_input_fields = props.nodeModel.graphModel.nodes
        .filter((v) => v.id === 'tool-base-node')
        .map((v) => cloneDeep(v.properties.user_input_field_list))
        .reduce((x, y) => [...x, ...y], [])
        .map((i) => {
        return { label: i.label || i.name, value: i.field };
    });
    return [...user_input_fields];
};
const refreshFieldList = () => {
    const refreshFieldList = getRefreshFieldList();
    set(props.nodeModel.properties.config, 'globalFields', refreshFieldList);
};
props.nodeModel.graphModel.eventCenter.on('refreshFieldList', refreshFieldList);
onMounted(() => { });
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
(__VLS_ctx.$t('workflow.variable.global'));
for (const [item, index] of __VLS_vFor((__VLS_ctx.nodeModel.properties.config.globalFields))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseenter: (...[$event]) => {
                return __VLS_ctx.showicon = true;
                // @ts-ignore
                [nodeModel, nodeModel, $t, showicon,];
            } },
        ...{ onMouseleave: (...[$event]) => {
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
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        effect: "dark",
        content: (__VLS_ctx.$t('workflow.setting.copyParam')),
        placement: "top",
    }));
    const __VLS_9 = __VLS_8({
        effect: "dark",
        content: (__VLS_ctx.$t('workflow.setting.copyParam')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        ...{ 'onClick': {} },
        link: true,
        ...{ style: {} },
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
        link: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_18;
    const __VLS_19 = {
        /** @type {typeof __VLS_18.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.copyClick(`{{global.${item.value}}}`);
            // @ts-ignore
            [$t, copyClick,];
        },
    };
    const { default: __VLS_20 } = __VLS_16.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        iconName: "app-copy",
    }));
    const __VLS_23 = __VLS_22({
        iconName: "app-copy",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    // @ts-ignore
    [];
    var __VLS_16;
    var __VLS_17;
    // @ts-ignore
    [];
    var __VLS_10;
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
