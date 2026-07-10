/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { watch, ref } from 'vue';
import { isAppIcon, resetUrl } from '@/utils/common';
const props = defineProps();
const emit = defineEmits();
const filterText = ref('');
const filterList = ref([]);
function filter(list, filterText) {
    if (!filterText.length) {
        return list;
    }
    return list.filter((v) => v.name.toLowerCase().includes(filterText.toLowerCase()));
}
watch([() => filterText.value, () => props.list], () => {
    filterList.value = filter(props.list, filterText.value);
});
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
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.filterText),
    modelModifiers: { trim: true, },
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.filterText),
    modelModifiers: { trim: true, },
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "list flex-wrap" },
});
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
if (__VLS_ctx.filterList.length) {
    for (const [item] of __VLS_vFor((__VLS_ctx.filterList))) {
        let __VLS_5;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            key: (item.id),
            placement: "right",
            width: (280),
            showAfter: (500),
            persistent: (false),
        }));
        const __VLS_7 = __VLS_6({
            key: (item.id),
            placement: "right",
            width: (280),
            showAfter: (500),
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        const { default: __VLS_10 } = __VLS_8.slots;
        {
            const { reference: __VLS_11 } = __VLS_8.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.filterList.length))
                            throw 0;
                        return __VLS_ctx.emit('clickNodes', item);
                        // @ts-ignore
                        [filterText, $t, filterList, filterList, emit,];
                    } },
                ...{ onMousedown: (...[$event]) => {
                        if (!(__VLS_ctx.filterList.length))
                            throw 0;
                        return __VLS_ctx.emit('onmousedown', item);
                        // @ts-ignore
                        [emit,];
                    } },
                ...{ class: "list-item flex align-center border border-r-6 p-8-12 cursor" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['list-item']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            if (__VLS_ctx.isAppIcon(item?.icon)) {
                let __VLS_12;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                }));
                const __VLS_14 = __VLS_13({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_13));
                const { default: __VLS_17 } = __VLS_15.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(item?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                    alt: "",
                });
                // @ts-ignore
                [isAppIcon, resetUrl, resetUrl,];
                var __VLS_15;
            }
            else {
                let __VLS_18;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
                    size: (20),
                    type: (item?.tool_type),
                    ...{ style: {} },
                }));
                const __VLS_20 = __VLS_19({
                    size: (20),
                    type: (item?.tool_type),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_19));
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-8 ellipsis" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (item.name);
            // @ts-ignore
            [];
        }
        {
            const { default: __VLS_23 } = __VLS_8.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.isAppIcon(item?.icon)) {
                let __VLS_24;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                }));
                const __VLS_26 = __VLS_25({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_25));
                const { default: __VLS_29 } = __VLS_27.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(item?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                    alt: "",
                });
                // @ts-ignore
                [isAppIcon, resetUrl, resetUrl,];
                var __VLS_27;
            }
            else {
                let __VLS_30;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
                    size: (20),
                    type: (item?.tool_type),
                    ...{ style: {} },
                }));
                const __VLS_32 = __VLS_31({
                    size: (20),
                    type: (item?.tool_type),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "font-medium ml-8 break-all" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
            (item.name);
            let __VLS_35;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
                type: "info",
                size: "small",
                ...{ class: "mt-4" },
            }));
            const __VLS_37 = __VLS_36({
                type: "info",
                size: "small",
                ...{ class: "mt-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_36));
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            const { default: __VLS_40 } = __VLS_38.slots;
            (item.desc);
            // @ts-ignore
            [];
            var __VLS_38;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_8;
        // @ts-ignore
        [];
    }
}
else {
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_43 = __VLS_42({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
}
// @ts-ignore
[$t,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
