/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { TreeToFlatten } from '@/utils/array';
defineOptions({ name: 'FolderBreadcrumb' });
import useStore from '@/stores';
import { i18n_name } from '@/utils/common.ts';
const { folder, user } = useStore();
const props = defineProps({
    folderList: {
        type: Array,
        default: () => [],
    },
});
const breadcrumbData = computed(() => {
    return folder.currentFolder?.id && getBreadcrumbData();
});
const emit = defineEmits(['click']);
function getBreadcrumbData() {
    const targetId = folder.currentFolder?.id;
    const list = TreeToFlatten(props.folderList);
    if (!folder.currentFolder)
        return []; // If no id, return empty array
    const breadcrumbList = [];
    let currentId = targetId;
    while (currentId) {
        const currentNode = list.find((item) => item.id === currentId);
        if (!currentNode)
            break; // IfNot foundNode, terminateLoop
        breadcrumbList.unshift(currentNode); // AddTo breadcrumb
        currentId = currentNode.parent_id; // Continue searching parent
    }
    return breadcrumbList;
}
function handleClick(item) {
    emit('click', item);
}
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
if (__VLS_ctx.breadcrumbData?.length === 1) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "ellipsis" },
        title: (__VLS_ctx.breadcrumbData[0]?.name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (__VLS_ctx.i18n_name(__VLS_ctx.breadcrumbData[0]?.name));
}
else {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
    elBreadcrumb;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        separatorIcon: "ArrowRight",
        ...{ style: {} },
        ...{ class: "mt-4" },
    }));
    const __VLS_2 = __VLS_1({
        separatorIcon: "ArrowRight",
        ...{ style: {} },
        ...{ class: "mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    const { default: __VLS_6 } = __VLS_3.slots;
    if (__VLS_ctx.breadcrumbData?.length > 3) {
        let __VLS_7;
        /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
        elBreadcrumbItem;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
        const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
        const { default: __VLS_12 } = __VLS_10.slots;
        let __VLS_13;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
            ...{ 'onClick': {} },
            link: true,
            title: (__VLS_ctx.breadcrumbData[0].name),
        }));
        const __VLS_15 = __VLS_14({
            ...{ 'onClick': {} },
            link: true,
            title: (__VLS_ctx.breadcrumbData[0].name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        let __VLS_18;
        const __VLS_19 = {
            /** @type {typeof __VLS_18.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.breadcrumbData?.length === 1))
                    throw 0;
                if (!(__VLS_ctx.breadcrumbData?.length > 3))
                    throw 0;
                return __VLS_ctx.handleClick(__VLS_ctx.breadcrumbData[0]);
                // @ts-ignore
                [breadcrumbData, breadcrumbData, breadcrumbData, breadcrumbData, breadcrumbData, breadcrumbData, i18n_name, handleClick,];
            },
        };
        const { default: __VLS_20 } = __VLS_16.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ellipsis" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (__VLS_ctx.breadcrumbData[0].name);
        // @ts-ignore
        [breadcrumbData,];
        var __VLS_16;
        var __VLS_17;
        // @ts-ignore
        [];
        var __VLS_10;
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
        elBreadcrumbItem;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
        const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
        const { default: __VLS_26 } = __VLS_24.slots;
        let __VLS_27;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_29 = __VLS_28({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_28));
        let __VLS_32;
        const __VLS_33 = {
            /** @type {typeof __VLS_32.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.breadcrumbData?.length === 1))
                    throw 0;
                if (!(__VLS_ctx.breadcrumbData?.length > 3))
                    throw 0;
                return __VLS_ctx.handleClick(__VLS_ctx.breadcrumbData[__VLS_ctx.breadcrumbData.length - 2]);
                // @ts-ignore
                [breadcrumbData, breadcrumbData, handleClick,];
            },
        };
        const { default: __VLS_34 } = __VLS_30.slots;
        let __VLS_35;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({}));
        const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
        const { default: __VLS_40 } = __VLS_38.slots;
        let __VLS_41;
        /** @ts-ignore @type { | typeof __VLS_components.MoreFilled} */
        MoreFilled;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
        const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
        // @ts-ignore
        [];
        var __VLS_38;
        // @ts-ignore
        [];
        var __VLS_30;
        var __VLS_31;
        // @ts-ignore
        [];
        var __VLS_24;
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
        elBreadcrumbItem;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
        const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
        const { default: __VLS_51 } = __VLS_49.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "ml-4 ellipsis" },
            title: (__VLS_ctx.breadcrumbData[__VLS_ctx.breadcrumbData.length - 1].name),
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (__VLS_ctx.breadcrumbData[__VLS_ctx.breadcrumbData.length - 1].name);
        // @ts-ignore
        [breadcrumbData, breadcrumbData, breadcrumbData, breadcrumbData,];
        var __VLS_49;
    }
    else {
        for (const [item, index] of __VLS_vFor((__VLS_ctx.breadcrumbData))) {
            let __VLS_52;
            /** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
            elBreadcrumbItem;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
                key: (index),
            }));
            const __VLS_54 = __VLS_53({
                key: (index),
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            const { default: __VLS_57 } = __VLS_55.slots;
            if (index === __VLS_ctx.breadcrumbData.length - 1) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "ml-4 ellipsis" },
                    ...{ style: {} },
                    title: (item.name),
                });
                /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
                (item.name);
            }
            else {
                let __VLS_58;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
                    ...{ 'onClick': {} },
                    link: true,
                    title: (item.name),
                }));
                const __VLS_60 = __VLS_59({
                    ...{ 'onClick': {} },
                    link: true,
                    title: (item.name),
                }, ...__VLS_functionalComponentArgsRest(__VLS_59));
                let __VLS_63;
                const __VLS_64 = {
                    /** @type {typeof __VLS_63.click} */
                    onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.breadcrumbData?.length === 1))
                            throw 0;
                        if (!!(__VLS_ctx.breadcrumbData?.length > 3))
                            throw 0;
                        if (!!(index === __VLS_ctx.breadcrumbData.length - 1))
                            throw 0;
                        return __VLS_ctx.handleClick(item);
                        // @ts-ignore
                        [breadcrumbData, breadcrumbData, handleClick,];
                    },
                };
                const { default: __VLS_65 } = __VLS_61.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "ellipsis" },
                    ...{ style: {} },
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
                (item.name);
                // @ts-ignore
                [];
                var __VLS_61;
                var __VLS_62;
            }
            // @ts-ignore
            [];
            var __VLS_55;
            // @ts-ignore
            [];
        }
    }
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        folderList: {
            type: Array,
            default: () => [],
        },
    },
});
export default {};
