/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import TriggerDrawer from '@/views/trigger/TriggerDrawer.vue';
import permissionMap from '@/permission';
import { getTriggerCycleLabel } from '@/utils/trigger';
const props = defineProps();
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap[props.source.toLowerCase()][apiType.value];
});
const toolId = ref('');
const visible = ref(false);
const loading = ref(false);
const emit = defineEmits(['refresh']);
const createTrigger = (trigger) => {
    if (toolId.value) {
        return loadSharedApi({ type: 'trigger', systemType: apiType.value }).postResourceTrigger(props.source, toolId.value, trigger);
    }
    return Promise.resolve({});
};
const editTrigger = (trigger_id, trigger) => {
    if (toolId.value) {
        return loadSharedApi({
            type: 'trigger',
            systemType: apiType.value,
        }).putResourceTrigger(props.source, toolId.value, trigger_id, trigger);
    }
    return Promise.resolve({});
};
const triggerList = ref([]);
const triggerDrawerRef = ref();
const openCreateTriggerDrawer = () => {
    triggerDrawerRef.value?.open(undefined, props.source, toolId.value);
};
const openEditTriggerDrawer = (trigger) => {
    triggerDrawerRef.value?.open(trigger.id, props.source, toolId.value);
};
function getTriggerList() {
    loadSharedApi({ type: 'trigger', systemType: apiType.value })
        .getResourceTriggerList(props.source, toolId.value, loading)
        .then((res) => {
        triggerList.value = res.data;
    });
}
function refreshTrigger() {
    getTriggerList();
}
function removeTrigger(trigger) {
    loadSharedApi({ type: 'trigger', systemType: apiType.value })
        .deleteResourceTrigger(props.source, toolId.value, trigger.id, loading)
        .then((res) => {
        getTriggerList();
    });
}
const open = (data) => {
    toolId.value = data.id;
    getTriggerList();
    visible.value = true;
};
const __VLS_exposed = {
    open,
};
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: "600",
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: "600",
    destroyOnClose: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.trigger.title'));
    // @ts-ignore
    [visible, $t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-12" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
(__VLS_ctx.$t('views.trigger.title'));
if (__VLS_ctx.permissionPrecise.trigger_create(__VLS_ctx.toolId)) {
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.permissionPrecise.trigger_create(__VLS_ctx.toolId)))
                throw 0;
            return __VLS_ctx.openCreateTriggerDrawer();
            // @ts-ignore
            [$t, permissionPrecise, toolId, openCreateTriggerDrawer,];
        },
    };
    const { default: __VLS_15 } = __VLS_11.slots;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_18 = __VLS_17({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t,];
    var __VLS_11;
    var __VLS_12;
}
if (__VLS_ctx.triggerList.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.triggerList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between border border-r-6 white-bg mb-8" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.TriggerIcon} */
        TriggerIcon;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            type: (item.trigger_type),
            ...{ class: "mr-8" },
            size: (20),
        }));
        const __VLS_23 = __VLS_22({
            type: (item.trigger_type),
            ...{ class: "mr-8" },
            size: (20),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
        autoTooltip;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            content: (item.name),
        }));
        const __VLS_28 = __VLS_27({
            content: (item.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        const { default: __VLS_31 } = __VLS_29.slots;
        (item.name);
        // @ts-ignore
        [triggerList, triggerList, vLoading, loading,];
        var __VLS_29;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        if (item.trigger_type === 'SCHEDULED') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-8 color-secondary lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.getTriggerCycleLabel(item.trigger_setting));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_32;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_34 = __VLS_33({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        let __VLS_37;
        const __VLS_38 = {
            /** @type {typeof __VLS_37.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.triggerList.length > 0))
                    throw 0;
                return __VLS_ctx.openEditTriggerDrawer(item);
                // @ts-ignore
                [getTriggerCycleLabel, openEditTriggerDrawer,];
            },
        };
        const { default: __VLS_39 } = __VLS_35.slots;
        let __VLS_40;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
            iconName: "app-edit",
            ...{ class: "color-secondary" },
        }));
        const __VLS_42 = __VLS_41({
            iconName: "app-edit",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_35;
        var __VLS_36;
        if (__VLS_ctx.permissionPrecise.trigger_delete(__VLS_ctx.toolId)) {
            let __VLS_45;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_47 = __VLS_46({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
            let __VLS_50;
            const __VLS_51 = {
                /** @type {typeof __VLS_50.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.triggerList.length > 0))
                        throw 0;
                    if (!(__VLS_ctx.permissionPrecise.trigger_delete(__VLS_ctx.toolId)))
                        throw 0;
                    return __VLS_ctx.removeTrigger(item);
                    // @ts-ignore
                    [permissionPrecise, toolId, removeTrigger,];
                },
            };
            const { default: __VLS_52 } = __VLS_48.slots;
            let __VLS_53;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({}));
            const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
            const { default: __VLS_58 } = __VLS_56.slots;
            let __VLS_59;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({}));
            const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
            // @ts-ignore
            [];
            var __VLS_56;
            // @ts-ignore
            [];
            var __VLS_48;
            var __VLS_49;
        }
        // @ts-ignore
        [];
    }
}
else {
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_66 = __VLS_65({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
}
const __VLS_69 = TriggerDrawer || TriggerDrawer;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    ...{ 'onRefresh': {} },
    ref: "triggerDrawerRef",
    createTrigger: (__VLS_ctx.createTrigger),
    editTrigger: (__VLS_ctx.editTrigger),
    resourceType: (props.source),
}));
const __VLS_71 = __VLS_70({
    ...{ 'onRefresh': {} },
    ref: "triggerDrawerRef",
    createTrigger: (__VLS_ctx.createTrigger),
    editTrigger: (__VLS_ctx.editTrigger),
    resourceType: (props.source),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
const __VLS_75 = {
    /** @type {typeof __VLS_74.refresh} */
    onRefresh: (__VLS_ctx.refreshTrigger),
};
var __VLS_76;
var __VLS_72;
var __VLS_73;
// @ts-ignore
[$t, createTrigger, editTrigger, refreshTrigger,];
var __VLS_3;
// @ts-ignore
var __VLS_77 = __VLS_76;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
