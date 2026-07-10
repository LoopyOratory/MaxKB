/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import useStore from '@/stores';
import UserCenterDrawer from './UserCenterDrawer.vue';
import HistoryPanel from '@/views/chat/component/HistoryPanel.vue';
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
const userCenterDrawerShow = ref(false);
function toUserCenter() {
    if (!chatUser.chat_profile?.authentication ||
        chatUser.chat_profile.authentication_type === 'password')
        return;
    userCenterDrawerShow.value = true;
}
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
const __VLS_6 = HistoryPanel || HistoryPanel;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
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
const __VLS_8 = __VLS_7({
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
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.newChat} */
    onNewChat: (__VLS_ctx.newChat),
};
const __VLS_13 = {
    /** @type {typeof __VLS_11.clickLog} */
    onClickLog: (__VLS_ctx.handleClickList),
};
const __VLS_14 = {
    /** @type {typeof __VLS_11.deleteLog} */
    onDeleteLog: (__VLS_ctx.deleteChatLog),
};
const __VLS_15 = {
    /** @type {typeof __VLS_11.refreshFieldTitle} */
    onRefreshFieldTitle: (__VLS_ctx.refreshFieldTitle),
};
const __VLS_16 = {
    /** @type {typeof __VLS_11.clearChat} */
    onClearChat: (__VLS_ctx.clearChat),
};
const __VLS_17 = {
    /** @type {typeof __VLS_11.clickShare} */
    onClickShare: (__VLS_ctx.clickShareHandle),
};
const { default: __VLS_18 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.toUserCenter) },
    ...{ class: "flex align-center user-info p-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    size: (32),
    ...{ class: (`${!__VLS_ctx.chatUser.chat_profile?.authentication || __VLS_ctx.chatUser.chat_profile.authentication_type === 'password' ? 'cursor-default' : ''}`) },
}));
const __VLS_21 = __VLS_20({
    size: (32),
    ...{ class: (`${!__VLS_ctx.chatUser.chat_profile?.authentication || __VLS_ctx.chatUser.chat_profile.authentication_type === 'password' ? 'cursor-default' : ''}`) },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/user-icon.svg",
    ...{ style: {} },
    alt: "",
});
// @ts-ignore
[show, applicationDetail, chatLogData, leftLoading, currentChatId, newChat, handleClickList, deleteChatLog, refreshFieldTitle, clearChat, clickShareHandle, toUserCenter, chatUser, chatUser,];
var __VLS_22;
if (__VLS_ctx.chatUser.chat_profile?.authentication) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8 color-text-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    (__VLS_ctx.chatUser.chatUserProfile?.nick_name);
}
// @ts-ignore
[chatUser, chatUser,];
var __VLS_9;
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
const __VLS_25 = UserCenterDrawer;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    show: (__VLS_ctx.userCenterDrawerShow),
}));
const __VLS_27 = __VLS_26({
    show: (__VLS_ctx.userCenterDrawerShow),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
// @ts-ignore
[userCenterDrawerShow,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
