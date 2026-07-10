/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { ref, computed, onMounted, inject } from 'vue';
import { copyClick } from '@/utils/clipboard';
import { set } from 'lodash';
import UserInputFieldTable from './component/UserInputFieldTable.vue';
const showicon = ref(null);
const getResourceDetail = inject('getResourceDetail');
const props = defineProps();
const UserInputFieldTableFef = ref();
const default_fields = [
    {
        label: 'Knowledge Base',
        value: 'knowledge',
        globeLabel: `{{global.knowledge}}`,
        globeValue: `{{context['global'].knowledge}}`,
    },
];
const nodeFields = computed(() => {
    if (props.nodeModel.properties.user_input_field_list) {
        const fields = props.nodeModel.properties.user_input_field_list.map((item) => ({
            label: typeof item.label == 'string' ? item.label : item.label.label,
            value: item.field,
            globeLabel: `{{global.${item.field}}}`,
            globeValue: `{{context['global'].${item.field}}}`,
        }));
        set(props.nodeModel.properties.config, 'globalFields', [...fields, ...default_fields]);
        return [...fields, ...default_fields];
    }
    set(props.nodeModel.properties.config, 'globalFields', [default_fields]);
    return [];
});
const resource = getResourceDetail();
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
(__VLS_ctx.$t('workflow.nodeSetting'));
const __VLS_7 = UserInputFieldTable;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ref: "UserInputFieldTableFef",
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_9 = __VLS_8({
    ref: "UserInputFieldTableFef",
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-8 mt-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
(__VLS_ctx.$t('common.param.outputParam'));
if (__VLS_ctx.nodeFields.length > 0) {
    for (const [item, index] of __VLS_vFor((__VLS_ctx.nodeFields))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.nodeFields.length > 0))
                        throw 0;
                    return __VLS_ctx.showicon = index;
                    // @ts-ignore
                    [nodeModel, nodeModel, $t, $t, nodeFields, nodeFields, showicon,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.nodeFields.length > 0))
                        throw 0;
                    return __VLS_ctx.showicon = null;
                    // @ts-ignore
                    [showicon,];
                } },
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
        if (__VLS_ctx.showicon === index) {
            let __VLS_14;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }));
            const __VLS_16 = __VLS_15({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_15));
            const { default: __VLS_19 } = __VLS_17.slots;
            let __VLS_20;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }));
            const __VLS_22 = __VLS_21({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_21));
            let __VLS_25;
            const __VLS_26 = {
                /** @type {typeof __VLS_25.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.nodeFields.length > 0))
                        throw 0;
                    if (!(__VLS_ctx.showicon === index))
                        throw 0;
                    return __VLS_ctx.copyClick(item.globeLabel);
                    // @ts-ignore
                    [$t, showicon, copyClick,];
                },
            };
            const { default: __VLS_27 } = __VLS_23.slots;
            let __VLS_28;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
                iconName: "app-copy",
            }));
            const __VLS_30 = __VLS_29({
                iconName: "app-copy",
            }, ...__VLS_functionalComponentArgsRest(__VLS_29));
            // @ts-ignore
            [];
            var __VLS_23;
            var __VLS_24;
            // @ts-ignore
            [];
            var __VLS_17;
        }
        // @ts-ignore
        [];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "border-r-6 p-8-12 mb-8 layout-bg lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('common.noData'));
}
// @ts-ignore
[$t,];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
