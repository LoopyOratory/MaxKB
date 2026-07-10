/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, inject } from 'vue';
import { isAppIcon } from '@/utils/common';
import EditTitleDialog from './EditTitleDialog.vue';
const scrollData = inject('scrollData');
// Sub-Component
const chatLogPagination = inject('chatLogPagination');
const _chatLogPagination = chatLogPagination();
const props = defineProps();
const emit = defineEmits([
    'newChat',
    'clickLog',
    'deleteLog',
    'refreshFieldTitle',
    'clearChat',
    'clickShare',
]);
const showHistory = computed(() => {
    return props.applicationDetail?.show_history != null || undefined
        ? props.applicationDetail?.show_history
        : true;
});
// UpdatePage numberMethod
const updateCurrentPage = (page) => {
    if (chatLogPagination) {
        chatLogPagination.current_page = page;
    }
};
const EditTitleDialogRef = ref();
const mouseId = ref('');
function mouseenter(row) {
    mouseId.value = row.id;
}
const shareHandle = () => {
    emit('clickShare');
};
const newChat = () => {
    emit('newChat');
};
const handleClickList = (item) => {
    emit('clickLog', item);
};
const deleteChatLog = (row) => {
    emit('deleteLog', row);
};
const clearChat = () => {
    emit('clearChat');
};
function editLogTitle(row) {
    EditTitleDialogRef.value.open(row, props.applicationDetail.id);
}
function refreshFieldTitle(chatId, abstract) {
    emit('refreshFieldTitle', chatId, abstract);
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
/** @type {__VLS_StyleScopedClasses['el-menu--collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['el-sub-menu__title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "history-component h-full" },
});
/** @type {__VLS_StyleScopedClasses['history-component']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components['el-menu'] | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components['el-menu']} */
elMenu;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    defaultActive: (__VLS_ctx.currentChatId),
    collapse: (__VLS_ctx.isPcCollapse),
    collapseTransition: (false),
    popperClass: "chat-pc-popper",
    ...{ class: "h-full" },
}));
const __VLS_2 = __VLS_1({
    defaultActive: (__VLS_ctx.currentChatId),
    collapse: (__VLS_ctx.isPcCollapse),
    collapseTransition: (false),
    popperClass: "chat-pc-popper",
    ...{ class: "h-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex mr-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
if (__VLS_ctx.isAppIcon(__VLS_ctx.applicationDetail?.icon)) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }));
    const __VLS_8 = __VLS_7({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.applicationDetail?.icon),
        alt: "",
    });
    // @ts-ignore
    [currentChatId, isPcCollapse, isAppIcon, applicationDetail, applicationDetail,];
    var __VLS_9;
}
else {
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
    LogoIcon;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        height: "32px",
    }));
    const __VLS_14 = __VLS_13({
        height: "32px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ style: ({ color: __VLS_ctx.applicationDetail?.custom_theme?.header_font_color }) },
    ...{ class: "ellipsis" },
    ...{ style: {} },
    title: (__VLS_ctx.applicationDetail?.name),
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isPcCollapse) }, null, null);
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.applicationDetail?.name);
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    plain: true,
    ...{ class: "add-button primary medium w-full" },
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    type: "primary",
    plain: true,
    ...{ class: "add-button primary medium w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
const __VLS_23 = {
    /** @type {typeof __VLS_22.click} */
    onClick: (__VLS_ctx.newChat),
};
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isPcCollapse) }, null, null);
/** @type {__VLS_StyleScopedClasses['add-button']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_24 } = __VLS_20.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    iconName: "app-create-chat",
}));
const __VLS_27 = __VLS_26({
    iconName: "app-create-chat",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.$t('aiChat.createChat'));
// @ts-ignore
[isPcCollapse, isPcCollapse, applicationDetail, applicationDetail, applicationDetail, newChat, $t,];
var __VLS_20;
var __VLS_21;
if (__VLS_ctx.showHistory) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between p-8 pb-0 color-secondary mt-8" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isPcCollapse) }, null, null);
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('aiChat.history'));
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.clearChat')),
        placement: "right",
    }));
    const __VLS_32 = __VLS_31({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.clearChat')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const { default: __VLS_35 } = __VLS_33.slots;
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_41;
    const __VLS_42 = {
        /** @type {typeof __VLS_41.click} */
        onClick: (__VLS_ctx.clearChat),
    };
    const { default: __VLS_43 } = __VLS_39.slots;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        iconName: "app-delete",
    }));
    const __VLS_46 = __VLS_45({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    // @ts-ignore
    [isPcCollapse, $t, $t, showHistory, clearChat,];
    var __VLS_39;
    var __VLS_40;
    // @ts-ignore
    [];
    var __VLS_33;
}
if (__VLS_ctx.showHistory) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "left-height" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isPcCollapse) }, null, null);
    /** @type {__VLS_StyleScopedClasses['left-height']} */ ;
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const { default: __VLS_54 } = __VLS_52.slots;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
    InfiniteScroll;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.chatLogData.length),
        total: (__VLS_ctx._chatLogPagination?.total || 0),
        page_size: (__VLS_ctx._chatLogPagination?.page_size || 20),
        current_page: (__VLS_ctx._chatLogPagination.current_page),
        loading: (__VLS_ctx.leftLoading),
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.chatLogData.length),
        total: (__VLS_ctx._chatLogPagination?.total || 0),
        page_size: (__VLS_ctx._chatLogPagination?.page_size || 20),
        current_page: (__VLS_ctx._chatLogPagination.current_page),
        loading: (__VLS_ctx.leftLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_60;
    const __VLS_61 = {
        /** @type {typeof __VLS_60.load} */
        onLoad: (__VLS_ctx.scrollData),
    };
    const { default: __VLS_62 } = __VLS_58.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-16 pt-0" },
    });
    /** @type {__VLS_StyleScopedClasses['p-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
    commonList;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        ...{ 'onMouseenter': {} },
        ...{ 'onMouseleave': {} },
        data: (__VLS_ctx.chatLogData),
        ...{ class: "mt-8" },
        defaultActive: (__VLS_ctx.currentChatId),
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        ...{ 'onMouseenter': {} },
        ...{ 'onMouseleave': {} },
        data: (__VLS_ctx.chatLogData),
        ...{ class: "mt-8" },
        defaultActive: (__VLS_ctx.currentChatId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = {
        /** @type {typeof __VLS_68.click} */
        onClick: (__VLS_ctx.handleClickList),
    };
    const __VLS_70 = {
        /** @type {typeof __VLS_68.mouseenter} */
        onMouseenter: (__VLS_ctx.mouseenter),
    };
    const __VLS_71 = {
        /** @type {typeof __VLS_68.mouseleave} */
        onMouseleave: (...[$event]) => {
            if (!(__VLS_ctx.showHistory))
                throw 0;
            return __VLS_ctx.mouseId = '';
            // @ts-ignore
            [currentChatId, isPcCollapse, showHistory, chatLogData, chatLogData, _chatLogPagination, _chatLogPagination, _chatLogPagination, leftLoading, scrollData, handleClickList, mouseenter, mouseId,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.leftLoading) }, null, null);
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    const { default: __VLS_72 } = __VLS_66.slots;
    {
        const { default: __VLS_73 } = __VLS_66.slots;
        const [{ row }] = __VLS_vSlot(__VLS_73);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.abstract),
            ...{ class: "ellipsis" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (row.abstract);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.mouseId === row.id && row.id !== 'new') }, null, null);
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            trigger: "click",
            teleported: (false),
        }));
        const __VLS_76 = __VLS_75({
            trigger: "click",
            teleported: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        const { default: __VLS_79 } = __VLS_77.slots;
        let __VLS_80;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
            text: true,
        }));
        const __VLS_82 = __VLS_81({
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        const { default: __VLS_85 } = __VLS_83.slots;
        let __VLS_86;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
            iconName: "app-more",
        }));
        const __VLS_88 = __VLS_87({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_87));
        // @ts-ignore
        [leftLoading, mouseId, vLoading,];
        var __VLS_83;
        {
            const { dropdown: __VLS_91 } = __VLS_77.slots;
            let __VLS_92;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({}));
            const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
            const { default: __VLS_97 } = __VLS_95.slots;
            if (__VLS_ctx.applicationDetail?.show_share) {
                let __VLS_98;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.currentChatId !== row.id || __VLS_ctx.chat_loading),
                }));
                const __VLS_100 = __VLS_99({
                    ...{ 'onClick': {} },
                    disabled: (__VLS_ctx.currentChatId !== row.id || __VLS_ctx.chat_loading),
                }, ...__VLS_functionalComponentArgsRest(__VLS_99));
                let __VLS_103;
                const __VLS_104 = {
                    /** @type {typeof __VLS_103.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showHistory))
                            throw 0;
                        if (!(__VLS_ctx.applicationDetail?.show_share))
                            throw 0;
                        return __VLS_ctx.shareHandle();
                        // @ts-ignore
                        [currentChatId, applicationDetail, chat_loading, shareHandle,];
                    },
                };
                const { default: __VLS_105 } = __VLS_101.slots;
                let __VLS_106;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
                    iconName: "app-share",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_108 = __VLS_107({
                    iconName: "app-share",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_107));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('aiChat.share'));
                // @ts-ignore
                [$t,];
                var __VLS_101;
                var __VLS_102;
            }
            let __VLS_111;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
                ...{ 'onClick': {} },
            }));
            const __VLS_113 = __VLS_112({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_112));
            let __VLS_116;
            const __VLS_117 = {
                /** @type {typeof __VLS_116.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showHistory))
                        throw 0;
                    return __VLS_ctx.editLogTitle(row);
                    // @ts-ignore
                    [editLogTitle,];
                },
            };
            const { default: __VLS_118 } = __VLS_114.slots;
            let __VLS_119;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
                iconName: "app-edit",
                ...{ class: "color-secondary" },
            }));
            const __VLS_121 = __VLS_120({
                iconName: "app-edit",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_120));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('common.edit'));
            // @ts-ignore
            [$t,];
            var __VLS_114;
            var __VLS_115;
            let __VLS_124;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
                ...{ 'onClick': {} },
            }));
            const __VLS_126 = __VLS_125({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_125));
            let __VLS_129;
            const __VLS_130 = {
                /** @type {typeof __VLS_129.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showHistory))
                        throw 0;
                    return __VLS_ctx.deleteChatLog(row);
                    // @ts-ignore
                    [deleteChatLog,];
                },
            };
            const { default: __VLS_131 } = __VLS_127.slots;
            let __VLS_132;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
                iconName: "app-delete",
                ...{ class: "color-secondary" },
            }));
            const __VLS_134 = __VLS_133({
                iconName: "app-delete",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('common.delete'));
            // @ts-ignore
            [$t,];
            var __VLS_127;
            var __VLS_128;
            // @ts-ignore
            [];
            var __VLS_95;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_77;
        // @ts-ignore
        [];
    }
    {
        const { empty: __VLS_137 } = __VLS_66.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center" },
        });
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        let __VLS_138;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
            type: "info",
        }));
        const __VLS_140 = __VLS_139({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
        const { default: __VLS_143 } = __VLS_141.slots;
        (__VLS_ctx.$t('aiChat.noHistory'));
        // @ts-ignore
        [$t,];
        var __VLS_141;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_66;
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_58;
    var __VLS_59;
    // @ts-ignore
    [];
    var __VLS_52;
}
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item'] | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item']} */
elMenuItem;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    ...{ 'onClick': {} },
    index: "1",
}));
const __VLS_146 = __VLS_145({
    ...{ 'onClick': {} },
    index: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
let __VLS_149;
const __VLS_150 = {
    /** @type {typeof __VLS_149.click} */
    onClick: (__VLS_ctx.newChat),
};
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.isPcCollapse) }, null, null);
const { default: __VLS_151 } = __VLS_147.slots;
let __VLS_152;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
    iconName: "app-create-chat",
}));
const __VLS_154 = __VLS_153({
    iconName: "app-create-chat",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
{
    const { title: __VLS_157 } = __VLS_147.slots;
    (__VLS_ctx.$t('aiChat.createChat'));
    // @ts-ignore
    [isPcCollapse, newChat, $t,];
}
// @ts-ignore
[];
var __VLS_147;
var __VLS_148;
if (__VLS_ctx.showHistory) {
    let __VLS_158;
    /** @ts-ignore @type { | typeof __VLS_components.elSubMenu | typeof __VLS_components.ElSubMenu | typeof __VLS_components['el-sub-menu'] | typeof __VLS_components.elSubMenu | typeof __VLS_components.ElSubMenu | typeof __VLS_components['el-sub-menu']} */
    elSubMenu;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
        index: "2",
        teleported: (false),
    }));
    const __VLS_160 = __VLS_159({
        index: "2",
        teleported: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.isPcCollapse) }, null, null);
    const { default: __VLS_163 } = __VLS_161.slots;
    {
        const { title: __VLS_164 } = __VLS_161.slots;
        let __VLS_165;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
            iconName: "app-history-outlined",
        }));
        const __VLS_167 = __VLS_166({
            iconName: "app-history-outlined",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        // @ts-ignore
        [isPcCollapse, showHistory,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between p-8 ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('aiChat.history'));
    let __VLS_170;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.clearChat')),
        placement: "right",
    }));
    const __VLS_172 = __VLS_171({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.clearChat')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    const { default: __VLS_175 } = __VLS_173.slots;
    let __VLS_176;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_181;
    const __VLS_182 = {
        /** @type {typeof __VLS_181.click} */
        onClick: (__VLS_ctx.clearChat),
    };
    const { default: __VLS_183 } = __VLS_179.slots;
    let __VLS_184;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
        iconName: "app-delete",
        ...{ class: "color-secondary" },
        ...{ style: {} },
    }));
    const __VLS_186 = __VLS_185({
        iconName: "app-delete",
        ...{ class: "color-secondary" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [$t, $t, clearChat,];
    var __VLS_179;
    var __VLS_180;
    // @ts-ignore
    [];
    var __VLS_173;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "left-height" },
    });
    /** @type {__VLS_StyleScopedClasses['left-height']} */ ;
    let __VLS_189;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({}));
    const __VLS_191 = __VLS_190({}, ...__VLS_functionalComponentArgsRest(__VLS_190));
    const { default: __VLS_194 } = __VLS_192.slots;
    let __VLS_195;
    /** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
    InfiniteScroll;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.chatLogData.length),
        total: (__VLS_ctx._chatLogPagination?.total || 0),
        page_size: (__VLS_ctx._chatLogPagination?.page_size || 20),
        current_page: (__VLS_ctx._chatLogPagination.current_page),
        loading: (__VLS_ctx.leftLoading),
    }));
    const __VLS_197 = __VLS_196({
        ...{ 'onLoad': {} },
        size: (__VLS_ctx.chatLogData.length),
        total: (__VLS_ctx._chatLogPagination?.total || 0),
        page_size: (__VLS_ctx._chatLogPagination?.page_size || 20),
        current_page: (__VLS_ctx._chatLogPagination.current_page),
        loading: (__VLS_ctx.leftLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    let __VLS_200;
    const __VLS_201 = {
        /** @type {typeof __VLS_200.load} */
        onLoad: (__VLS_ctx.scrollData),
    };
    const { default: __VLS_202 } = __VLS_198.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.leftLoading) }, null, null);
    for (const [row] of __VLS_vFor((__VLS_ctx.chatLogData))) {
        let __VLS_203;
        /** @ts-ignore @type { | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item'] | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item']} */
        elMenuItem;
        // @ts-ignore
        const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
            ...{ 'onClick': {} },
            ...{ 'onMouseenter': {} },
            ...{ 'onMouseleave': {} },
            index: (row.id),
            key: (row.id),
        }));
        const __VLS_205 = __VLS_204({
            ...{ 'onClick': {} },
            ...{ 'onMouseenter': {} },
            ...{ 'onMouseleave': {} },
            index: (row.id),
            key: (row.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_204));
        let __VLS_208;
        const __VLS_209 = {
            /** @type {typeof __VLS_208.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showHistory))
                    throw 0;
                return __VLS_ctx.handleClickList(row);
                // @ts-ignore
                [chatLogData, chatLogData, _chatLogPagination, _chatLogPagination, _chatLogPagination, leftLoading, leftLoading, scrollData, handleClickList, vLoading,];
            },
        };
        const __VLS_210 = {
            /** @type {typeof __VLS_208.mouseenter} */
            onMouseenter: (...[$event]) => {
                if (!(__VLS_ctx.showHistory))
                    throw 0;
                return __VLS_ctx.mouseenter(row);
                // @ts-ignore
                [mouseenter,];
            },
        };
        const __VLS_211 = {
            /** @type {typeof __VLS_208.mouseleave} */
            onMouseleave: (...[$event]) => {
                if (!(__VLS_ctx.showHistory))
                    throw 0;
                return __VLS_ctx.mouseId = '';
                // @ts-ignore
                [mouseId,];
            },
        };
        const { default: __VLS_212 } = __VLS_206.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between w-full lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.abstract),
            ...{ class: "ellipsis" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (row.abstract);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
            ...{ class: "flex" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.mouseId === row.id && row.id !== 'new') }, null, null);
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        let __VLS_213;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
            trigger: "click",
            teleported: (false),
        }));
        const __VLS_215 = __VLS_214({
            trigger: "click",
            teleported: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        const { default: __VLS_218 } = __VLS_216.slots;
        let __VLS_219;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
            text: true,
            ...{ class: "lighter" },
            ...{ style: {} },
        }));
        const __VLS_221 = __VLS_220({
            text: true,
            ...{ class: "lighter" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_220));
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        const { default: __VLS_224 } = __VLS_222.slots;
        let __VLS_225;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
            iconName: "app-more",
            ...{ style: {} },
        }));
        const __VLS_227 = __VLS_226({
            iconName: "app-more",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        // @ts-ignore
        [mouseId,];
        var __VLS_222;
        {
            const { dropdown: __VLS_230 } = __VLS_216.slots;
            let __VLS_231;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({}));
            const __VLS_233 = __VLS_232({}, ...__VLS_functionalComponentArgsRest(__VLS_232));
            const { default: __VLS_236 } = __VLS_234.slots;
            let __VLS_237;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
                ...{ 'onClick': {} },
            }));
            const __VLS_239 = __VLS_238({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_238));
            let __VLS_242;
            const __VLS_243 = {
                /** @type {typeof __VLS_242.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showHistory))
                        throw 0;
                    return __VLS_ctx.editLogTitle(row);
                    // @ts-ignore
                    [editLogTitle,];
                },
            };
            const { default: __VLS_244 } = __VLS_240.slots;
            let __VLS_245;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
                iconName: "app-edit",
                ...{ style: {} },
                ...{ class: "mr-4" },
            }));
            const __VLS_247 = __VLS_246({
                iconName: "app-edit",
                ...{ style: {} },
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_246));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('common.edit'));
            // @ts-ignore
            [$t,];
            var __VLS_240;
            var __VLS_241;
            let __VLS_250;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
                ...{ 'onClick': {} },
            }));
            const __VLS_252 = __VLS_251({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_251));
            let __VLS_255;
            const __VLS_256 = {
                /** @type {typeof __VLS_255.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showHistory))
                        throw 0;
                    return __VLS_ctx.deleteChatLog(row);
                    // @ts-ignore
                    [deleteChatLog,];
                },
            };
            const { default: __VLS_257 } = __VLS_253.slots;
            let __VLS_258;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
                iconName: "app-delete",
                ...{ style: {} },
                ...{ class: "mr-4" },
            }));
            const __VLS_260 = __VLS_259({
                iconName: "app-delete",
                ...{ style: {} },
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_259));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('common.delete'));
            // @ts-ignore
            [$t,];
            var __VLS_253;
            var __VLS_254;
            // @ts-ignore
            [];
            var __VLS_234;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_216;
        // @ts-ignore
        [];
        var __VLS_206;
        var __VLS_207;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_198;
    var __VLS_199;
    // @ts-ignore
    [];
    var __VLS_192;
    if (!__VLS_ctx.chatLogData?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center" },
        });
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        let __VLS_263;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
            type: "info",
        }));
        const __VLS_265 = __VLS_264({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_264));
        const { default: __VLS_268 } = __VLS_266.slots;
        (__VLS_ctx.$t('aiChat.noHistory'));
        // @ts-ignore
        [$t, chatLogData,];
        var __VLS_266;
    }
    // @ts-ignore
    [];
    var __VLS_161;
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_269 = {};
const __VLS_271 = EditTitleDialog;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
    ...{ 'onRefresh': {} },
    ref: "EditTitleDialogRef",
}));
const __VLS_273 = __VLS_272({
    ...{ 'onRefresh': {} },
    ref: "EditTitleDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
let __VLS_276;
const __VLS_277 = {
    /** @type {typeof __VLS_276.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldTitle),
};
var __VLS_278;
var __VLS_274;
var __VLS_275;
// @ts-ignore
var __VLS_270 = __VLS_269, __VLS_279 = __VLS_278;
// @ts-ignore
[refreshFieldTitle,];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
const __VLS_export = {};
export default {};
