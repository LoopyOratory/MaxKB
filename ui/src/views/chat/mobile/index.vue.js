/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, reactive, nextTick, computed, provide } from 'vue';
import { isAppIcon } from '@/utils/common';
import { hexToRgba } from '@/utils/theme';
import useStore from '@/stores';
import { t } from '@/locales';
import ChatHistoryDrawer from './component/ChatHistoryDrawer.vue';
import chatAPI from '@/api/chat/chat';
import { ChatManagement } from '@/api/type/application';
provide('scrollData', loadInfiniteScroll);
provide('chatLogPagination', () => chatLogPagination);
const { common } = useStore();
const AiChatRef = ref();
const loading = ref(false);
const left_loading = ref(false);
const chatLogData = ref([]);
const show = ref(false);
const props = defineProps();
const applicationDetail = computed({
    get: () => {
        return props.application_profile;
    },
    set: (v) => { },
});
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const currentRecordList = ref([]);
const currentChatId = ref('new'); // CurrentHistoryRecordId Defaultis'new'
const customStyle = computed(() => {
    return {
        background: applicationDetail.value?.custom_theme?.theme_color,
        color: applicationDetail.value?.custom_theme?.header_font_color,
    };
});
const showSelection = ref(false);
const clickShareHandle = () => {
    showSelection.value = true;
    show.value = false;
};
function clearChat() {
    chatAPI.clearChat(left_loading).then(() => {
        currentChatId.value = 'new';
        paginationConfig.current_page = 1;
        paginationConfig.total = 0;
        currentRecordList.value = [];
        chatLogPagination.value.current_page = 1;
        chatLogData.value = [];
        getChatLog();
    });
}
function deleteLog(row) {
    chatAPI.deleteChat(row.id).then(() => {
        if (currentChatId.value === row.id) {
            currentChatId.value = 'new';
            paginationConfig.current_page = 1;
            paginationConfig.total = 0;
            currentRecordList.value = [];
        }
        chatLogData.value = chatLogData.value.filter((item) => item.id !== row.id);
    });
}
function handleScroll(event) {
    if (currentChatId.value !== 'new' &&
        event.scrollTop === 0 &&
        paginationConfig.total > currentRecordList.value.length) {
        const history_height = event.dialogScrollbar.offsetHeight;
        paginationConfig.current_page += 1;
        getChatRecord().then(() => {
            event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height);
        });
    }
}
const newObj = {
    id: 'new',
    abstract: t('aiChat.createChat'),
};
function newChat() {
    paginationConfig.current_page = 1;
    currentRecordList.value = [];
    if (!chatLogData.value.some((v) => v.id === 'new')) {
        chatLogData.value.unshift(newObj);
    }
    currentChatId.value = 'new';
    show.value = false;
}
const chatLogPagination = ref({
    total: 0,
    page_size: 20,
    current_page: 1,
});
function getChatLog(refresh) {
    chatAPI
        .pageChat(chatLogPagination.value.current_page, chatLogPagination.value.page_size, left_loading)
        .then((res) => {
        chatLogPagination.value.total = res.data.total;
        chatLogData.value = [...chatLogData.value, ...res.data.records];
        if (!refresh) {
            paginationConfig.current_page = 1;
            paginationConfig.total = 0;
            currentRecordList.value = [];
            currentChatId.value = 'new';
        }
    });
}
function loadInfiniteScroll() {
    getChatLog(true);
}
/**
 * Switch backSessionWhen, MemoryBelongs to thisSession, still in backgroundStreaming output in-flightMessageReconnectList,
 * So streams not interrupted during switch-away, Switch backCan continue real-timeShow。
 * - and DB record record_id same, override with live object (otherwise will show empty answer from database)
 * - DB Still inNone(Not yetDatabase), AppendTo end
 */
function attachActiveStreams() {
    const activeChats = ChatManagement.getActiveByChatId(currentChatId.value);
    if (!activeChats.length) {
        return;
    }
    const activeMap = new Map(activeChats.map((chat) => [chat.record_id, chat]));
    const existIds = new Set(currentRecordList.value.map((v) => v.record_id));
    const merged = currentRecordList.value.map((v) => activeMap.has(v.record_id) ? activeMap.get(v.record_id) : v);
    const appendList = activeChats.filter((chat) => !existIds.has(chat.record_id));
    currentRecordList.value = [...merged, ...appendList];
}
function getChatRecord() {
    return chatAPI
        .pageChatRecord(currentChatId.value, paginationConfig.current_page, paginationConfig.page_size, loading)
        .then((res) => {
        paginationConfig.total = res.data.total;
        const list = res.data.records;
        list.map((v) => {
            v['write_ed'] = true;
            v['record_id'] = v.id;
        });
        currentRecordList.value = [...list, ...currentRecordList.value].sort((a, b) => a.create_time.localeCompare(b.create_time));
        if (paginationConfig.current_page === 1) {
            attachActiveStreams();
            nextTick(() => {
                // Scroll to the bottom
                AiChatRef.value.setScrollBottom();
            });
        }
    });
}
const clickListHandle = (item) => {
    if (item.id !== currentChatId.value) {
        showSelection.value = false;
        paginationConfig.current_page = 1;
        currentRecordList.value = [];
        currentChatId.value = item.id;
        if (currentChatId.value !== 'new') {
            getChatRecord();
        }
        show.value = false;
    }
};
function refreshFieldTitle(chatId, abstract) {
    const find = chatLogData.value.find((item) => item.id == chatId);
    if (find) {
        find.abstract = abstract;
    }
}
function refresh(id) {
    currentChatId.value = id;
    chatLogPagination.value.current_page = 1;
    chatLogData.value = [];
    getChatLog(true);
}
/**
 *InitializeHistoryConversationRecord
 */
const init = () => {
    getChatLog();
};
onMounted(() => {
    init();
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-mobile layout-bg chat-background" },
    ...{ style: ({
            '--el-color-primary': __VLS_ctx.applicationDetail?.custom_theme?.theme_color,
            '--el-color-primary-light-9': __VLS_ctx.hexToRgba(__VLS_ctx.applicationDetail?.custom_theme?.theme_color || '#3370FF', 0.1),
            '--el-color-primary-light-6': __VLS_ctx.hexToRgba(__VLS_ctx.applicationDetail?.custom_theme?.theme_color || '#3370FF', 0.4),
            '--el-color-primary-light-06': __VLS_ctx.hexToRgba(__VLS_ctx.applicationDetail?.custom_theme?.theme_color || '#3370FF', 0.04),
            backgroundImage: `url(${__VLS_ctx.applicationDetail?.chat_background})`,
        }) },
});
/** @type {__VLS_StyleScopedClasses['chat-mobile']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-background']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-mobile__header" },
    ...{ style: (__VLS_ctx.customStyle) },
});
/** @type {__VLS_StyleScopedClasses['chat-mobile__header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    iconName: "app-mobile-open-history",
    ...{ style: {} },
    ...{ class: "ml-16 cursor" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    iconName: "app-mobile-open-history",
    ...{ style: {} },
    ...{ class: "ml-16 cursor" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.show = true;
        // @ts-ignore
        [applicationDetail, applicationDetail, applicationDetail, applicationDetail, applicationDetail, hexToRgba, hexToRgba, hexToRgba, customStyle, show,];
    },
};
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mr-12 ml-16 flex" },
});
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
if (__VLS_ctx.isAppIcon(__VLS_ctx.applicationDetail?.icon)) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }));
    const __VLS_9 = __VLS_8({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.applicationDetail?.icon),
        alt: "",
    });
    // @ts-ignore
    [applicationDetail, applicationDetail, isAppIcon,];
    var __VLS_10;
}
else {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
    LogoIcon;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        height: "32px",
    }));
    const __VLS_15 = __VLS_14({
        height: "32px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "ellipsis" },
    ...{ style: {} },
    title: (__VLS_ctx.applicationDetail?.name),
});
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.applicationDetail?.name);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (!__VLS_ctx.showSelection) {
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: (__VLS_ctx.currentChatId === 'new' ? 'mr-16' : '') },
        ...{ style: ({ color: __VLS_ctx.applicationDetail?.custom_theme?.header_font_color }) },
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: (__VLS_ctx.currentChatId === 'new' ? 'mr-16' : '') },
        ...{ style: ({ color: __VLS_ctx.applicationDetail?.custom_theme?.header_font_color }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_23;
    const __VLS_24 = {
        /** @type {typeof __VLS_23.click} */
        onClick: (__VLS_ctx.newChat),
    };
    const { default: __VLS_25 } = __VLS_21.slots;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        iconName: "app-create-chat",
        ...{ style: {} },
    }));
    const __VLS_28 = __VLS_27({
        iconName: "app-create-chat",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    // @ts-ignore
    [applicationDetail, applicationDetail, applicationDetail, showSelection, currentChatId, newChat,];
    var __VLS_21;
    var __VLS_22;
}
if (!__VLS_ctx.showSelection && __VLS_ctx.currentChatId !== 'new' && __VLS_ctx.applicationDetail.show_share) {
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.share')),
        placement: "top",
    }));
    const __VLS_33 = __VLS_32({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.share')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const { default: __VLS_36 } = __VLS_34.slots;
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        ...{ class: "mr-16" },
        text: true,
        disabled: (__VLS_ctx.AiChatRef?.loading),
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        ...{ class: "mr-16" },
        text: true,
        disabled: (__VLS_ctx.AiChatRef?.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_42;
    const __VLS_43 = {
        /** @type {typeof __VLS_42.click} */
        onClick: (__VLS_ctx.clickShareHandle),
    };
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    const { default: __VLS_44 } = __VLS_40.slots;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        iconName: "app-share",
    }));
    const __VLS_47 = __VLS_46({
        iconName: "app-share",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    // @ts-ignore
    [applicationDetail, showSelection, currentChatId, $t, AiChatRef, clickShareHandle,];
    var __VLS_40;
    var __VLS_41;
    // @ts-ignore
    [];
    var __VLS_34;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-mobile__main" },
});
/** @type {__VLS_StyleScopedClasses['chat-mobile__main']} */ ;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.AiChat | typeof __VLS_components.AiChat} */
AiChat;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    ...{ 'onRefresh': {} },
    ...{ 'onOpenChat': {} },
    ...{ 'onScroll': {} },
    ref: "AiChatRef",
    applicationDetails: (__VLS_ctx.applicationDetail),
    available: (__VLS_ctx.applicationAvailable),
    appId: (__VLS_ctx.applicationDetail?.id),
    record: (__VLS_ctx.currentRecordList),
    chatId: (__VLS_ctx.currentChatId),
    type: "ai-chat",
    selection: (__VLS_ctx.showSelection),
}));
const __VLS_52 = __VLS_51({
    ...{ 'onRefresh': {} },
    ...{ 'onOpenChat': {} },
    ...{ 'onScroll': {} },
    ref: "AiChatRef",
    applicationDetails: (__VLS_ctx.applicationDetail),
    available: (__VLS_ctx.applicationAvailable),
    appId: (__VLS_ctx.applicationDetail?.id),
    record: (__VLS_ctx.currentRecordList),
    chatId: (__VLS_ctx.currentChatId),
    type: "ai-chat",
    selection: (__VLS_ctx.showSelection),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_55;
const __VLS_56 = {
    /** @type {typeof __VLS_55.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
const __VLS_57 = {
    /** @type {typeof __VLS_55.openChat} */
    onOpenChat: (__VLS_ctx.refresh),
};
const __VLS_58 = {
    /** @type {typeof __VLS_55.scroll} */
    onScroll: (__VLS_ctx.handleScroll),
};
var __VLS_59;
var __VLS_53;
var __VLS_54;
const __VLS_61 = ChatHistoryDrawer;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    ...{ 'onNewChat': {} },
    ...{ 'onClickLog': {} },
    ...{ 'onDeleteLog': {} },
    ...{ 'onRefreshFieldTitle': {} },
    ...{ 'onClearChat': {} },
    ...{ 'onClickShare': {} },
    show: (__VLS_ctx.show),
    applicationDetail: (__VLS_ctx.applicationDetail),
    chatLogData: (__VLS_ctx.chatLogData),
    leftLoading: (__VLS_ctx.left_loading),
    currentChatId: (__VLS_ctx.currentChatId),
}));
const __VLS_63 = __VLS_62({
    ...{ 'onNewChat': {} },
    ...{ 'onClickLog': {} },
    ...{ 'onDeleteLog': {} },
    ...{ 'onRefreshFieldTitle': {} },
    ...{ 'onClearChat': {} },
    ...{ 'onClickShare': {} },
    show: (__VLS_ctx.show),
    applicationDetail: (__VLS_ctx.applicationDetail),
    chatLogData: (__VLS_ctx.chatLogData),
    leftLoading: (__VLS_ctx.left_loading),
    currentChatId: (__VLS_ctx.currentChatId),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_66;
const __VLS_67 = {
    /** @type {typeof __VLS_66.newChat} */
    onNewChat: (__VLS_ctx.newChat),
};
const __VLS_68 = {
    /** @type {typeof __VLS_66.clickLog} */
    onClickLog: (__VLS_ctx.clickListHandle),
};
const __VLS_69 = {
    /** @type {typeof __VLS_66.deleteLog} */
    onDeleteLog: (__VLS_ctx.deleteLog),
};
const __VLS_70 = {
    /** @type {typeof __VLS_66.refreshFieldTitle} */
    onRefreshFieldTitle: (__VLS_ctx.refreshFieldTitle),
};
const __VLS_71 = {
    /** @type {typeof __VLS_66.clearChat} */
    onClearChat: (__VLS_ctx.clearChat),
};
const __VLS_72 = {
    /** @type {typeof __VLS_66.clickShare} */
    onClickShare: (__VLS_ctx.clickShareHandle),
};
var __VLS_64;
var __VLS_65;
// @ts-ignore
var __VLS_60 = __VLS_59;
// @ts-ignore
[applicationDetail, applicationDetail, applicationDetail, show, showSelection, currentChatId, currentChatId, newChat, clickShareHandle, applicationAvailable, currentRecordList, refresh, refresh, handleScroll, chatLogData, left_loading, clickListHandle, deleteLog, refreshFieldTitle, clearChat,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
