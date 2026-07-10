/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import useStore from '@/stores';
import HistoryPanel from '@/views/chat/component/HistoryPanel.vue';
import ResetPassword from '@/layout/layout-header/avatar/ResetPassword.vue';
import chatAPI from '@/api/chat/chat';
import { useRoute, useRouter } from 'vue-router';
import JSEncrypt from 'jsencrypt';
const router = useRouter();
const route = useRoute();
const show = defineModel('show');
const props = defineProps();
const emit = defineEmits([
    'newChat',
    'clickLog',
    'deleteLog',
    'refreshFieldTitle',
    'clearChat',
    'clickShare',
]);
const { chatUser } = useStore();
const clickShareHandle = () => {
    emit('clickShare');
};
const clearChat = () => {
    emit('clearChat');
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
function refreshFieldTitle(chatId, abstract) {
    emit('refreshFieldTitle', chatId, abstract);
}
const resetPasswordRef = ref();
const openResetPassword = () => {
    resetPasswordRef.value?.open();
};
const handleResetPassword = (param) => {
    const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
    const js = new JSEncryptCtor();
    js.setPublicKey(chatUser?.chat_profile?.rsaKey);
    const jsonData = JSON.stringify(param);
    const encryptedBase64 = js.encrypt(jsonData);
    chatAPI.resetCurrentPassword({ encryptedData: encryptedBase64 }).then(() => {
        router.push({ name: 'login' });
    });
};
const logout = () => {
    chatUser.logout().then(() => {
        router.push({
            name: 'login',
            params: { accessToken: chatUser.accessToken },
            query: route.query,
        });
    });
};
let __VLS_modelEmit;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.show),
    withHeader: (false),
    ...{ class: "chat-history-drawer" },
    direction: "ltr",
    size: (280),
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.show),
    withHeader: (false),
    ...{ class: "chat-history-drawer" },
    direction: "ltr",
    size: (280),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['chat-history-drawer']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    ...{ class: "collapse cursor" },
    circle: true,
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    ...{ class: "collapse cursor" },
    circle: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.show = !__VLS_ctx.show;
        // @ts-ignore
        [show, show, show,];
    },
};
/** @type {__VLS_StyleScopedClasses['collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_13 } = __VLS_9.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
const __VLS_20 = (!__VLS_ctx.show ? 'ArrowRightBold' : 'ArrowLeftBold');
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
// @ts-ignore
[show,];
var __VLS_17;
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
const __VLS_25 = HistoryPanel || HistoryPanel;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onNewChat': {} },
    ...{ 'onClickLog': {} },
    ...{ 'onDeleteLog': {} },
    ...{ 'onRefreshFieldTitle': {} },
    ...{ 'onClearChat': {} },
    ...{ 'onClickShare': {} },
    applicationDetail: (__VLS_ctx.applicationDetail),
    chatLogData: (__VLS_ctx.chatLogData),
    leftLoading: (__VLS_ctx.leftLoading),
    currentChatId: (__VLS_ctx.currentChatId),
}));
const __VLS_27 = __VLS_26({
    ...{ 'onNewChat': {} },
    ...{ 'onClickLog': {} },
    ...{ 'onDeleteLog': {} },
    ...{ 'onRefreshFieldTitle': {} },
    ...{ 'onClearChat': {} },
    ...{ 'onClickShare': {} },
    applicationDetail: (__VLS_ctx.applicationDetail),
    chatLogData: (__VLS_ctx.chatLogData),
    leftLoading: (__VLS_ctx.leftLoading),
    currentChatId: (__VLS_ctx.currentChatId),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    /** @type {typeof __VLS_30.newChat} */
    onNewChat: (__VLS_ctx.newChat),
};
const __VLS_32 = {
    /** @type {typeof __VLS_30.clickLog} */
    onClickLog: (__VLS_ctx.handleClickList),
};
const __VLS_33 = {
    /** @type {typeof __VLS_30.deleteLog} */
    onDeleteLog: (__VLS_ctx.deleteChatLog),
};
const __VLS_34 = {
    /** @type {typeof __VLS_30.refreshFieldTitle} */
    onRefreshFieldTitle: (__VLS_ctx.refreshFieldTitle),
};
const __VLS_35 = {
    /** @type {typeof __VLS_30.clearChat} */
    onClearChat: (__VLS_ctx.clearChat),
};
const __VLS_36 = {
    /** @type {typeof __VLS_30.clickShare} */
    onClickShare: (__VLS_ctx.clickShareHandle),
};
const { default: __VLS_37 } = __VLS_28.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-info p-16 cursor" },
});
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
if (!__VLS_ctx.chatUser.chat_profile?.authentication ||
    __VLS_ctx.chatUser.chat_profile.authentication_type === 'password') {
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        size: (32),
    }));
    const __VLS_40 = __VLS_39({
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    const { default: __VLS_43 } = __VLS_41.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/user-icon.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [applicationDetail, chatLogData, leftLoading, currentChatId, newChat, handleClickList, deleteChatLog, refreshFieldTitle, clearChat, clickShareHandle, chatUser, chatUser,];
    var __VLS_41;
}
else {
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        trigger: "click",
        type: "primary",
        ...{ class: "w-full" },
    }));
    const __VLS_46 = __VLS_45({
        trigger: "click",
        type: "primary",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_49 } = __VLS_47.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        size: (32),
    }));
    const __VLS_52 = __VLS_51({
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_55 } = __VLS_53.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/user-icon.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [];
    var __VLS_53;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8 color-text-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    (__VLS_ctx.chatUser.chatUserProfile?.nick_name);
    {
        const { dropdown: __VLS_56 } = __VLS_47.slots;
        let __VLS_57;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            ...{ style: {} },
        }));
        const __VLS_59 = __VLS_58({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        const { default: __VLS_62 } = __VLS_60.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center p-8" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mr-8 flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
            size: (40),
        }));
        const __VLS_65 = __VLS_64({
            size: (40),
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
        const { default: __VLS_68 } = __VLS_66.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/user-icon.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [chatUser,];
        var __VLS_66;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
            ...{ class: "medium mb-4" },
        });
        /** @type {__VLS_StyleScopedClasses['medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        (__VLS_ctx.chatUser.chatUserProfile?.nick_name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "color-secondary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (`${__VLS_ctx.$t('common.username')}: ${__VLS_ctx.chatUser.chatUserProfile?.username}`);
        if (__VLS_ctx.chatUser.chatUserProfile?.source === 'LOCAL') {
            let __VLS_69;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
                ...{ 'onClick': {} },
                ...{ class: "border-t" },
                ...{ style: {} },
            }));
            const __VLS_71 = __VLS_70({
                ...{ 'onClick': {} },
                ...{ class: "border-t" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_70));
            let __VLS_74;
            const __VLS_75 = {
                /** @type {typeof __VLS_74.click} */
                onClick: (__VLS_ctx.openResetPassword),
            };
            /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
            const { default: __VLS_76 } = __VLS_72.slots;
            let __VLS_77;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
                iconName: "app-key",
                ...{ class: "color-secondary" },
            }));
            const __VLS_79 = __VLS_78({
                iconName: "app-key",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_78));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('views.login.resetPassword'));
            // @ts-ignore
            [chatUser, chatUser, chatUser, $t, $t, openResetPassword,];
            var __VLS_72;
            var __VLS_73;
        }
        let __VLS_82;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
            ...{ 'onClick': {} },
            ...{ class: "border-t" },
            ...{ style: {} },
        }));
        const __VLS_84 = __VLS_83({
            ...{ 'onClick': {} },
            ...{ class: "border-t" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        let __VLS_87;
        const __VLS_88 = {
            /** @type {typeof __VLS_87.click} */
            onClick: (__VLS_ctx.logout),
        };
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        const { default: __VLS_89 } = __VLS_85.slots;
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
            iconName: "app-export",
            ...{ class: "color-secondary" },
        }));
        const __VLS_92 = __VLS_91({
            iconName: "app-export",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.$t('layout.logout'));
        // @ts-ignore
        [$t, logout,];
        var __VLS_85;
        var __VLS_86;
        // @ts-ignore
        [];
        var __VLS_60;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_47;
}
// @ts-ignore
[];
var __VLS_28;
var __VLS_29;
// @ts-ignore
[];
var __VLS_3;
const __VLS_95 = ResetPassword || ResetPassword;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
    ...{ 'onConfirm': {} },
    ref: "resetPasswordRef",
    emitConfirm: true,
}));
const __VLS_97 = __VLS_96({
    ...{ 'onConfirm': {} },
    ref: "resetPasswordRef",
    emitConfirm: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
let __VLS_100;
const __VLS_101 = {
    /** @type {typeof __VLS_100.confirm} */
    onConfirm: (__VLS_ctx.handleResetPassword),
};
var __VLS_102;
var __VLS_98;
var __VLS_99;
// @ts-ignore
var __VLS_103 = __VLS_102;
// @ts-ignore
[handleResetPassword,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
