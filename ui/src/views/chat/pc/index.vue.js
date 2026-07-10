/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, nextTick, computed, provide } from 'vue';
import { marked } from 'marked';
import { saveAs } from 'file-saver';
import sanitizeHtml from 'sanitize-html';
import chatAPI from '@/api/chat/chat';
import useStore from '@/stores';
import useResize from '@/layout/hooks/useResize';
import { hexToRgba } from '@/utils/theme';
import { useRoute, useRouter } from 'vue-router';
import ResetPassword from '@/layout/layout-header/avatar/ResetPassword.vue';
import { t } from '@/locales';
import ExecutionDetailContent from '@/components/ai-chat/component/knowledge-source-component/ExecutionDetailContent.vue';
import ParagraphSourceContent from '@/components/ai-chat/component/knowledge-source-component/ParagraphSourceContent.vue';
import ParagraphDocumentContent from '@/components/ai-chat/component/knowledge-source-component/ParagraphDocumentContent.vue';
import HistoryPanel from '@/views/chat/component/HistoryPanel.vue';
import { ChatManagement } from '@/api/type/application';
import { cloneDeep } from 'lodash';
import { getFileUrl } from '@/utils/common';
import PdfExport from '@/components/pdf-export/index.vue';
import JSEncrypt from 'jsencrypt';
useResize();
provide('scrollData', loadInfiniteScroll);
provide('chatLogPagination', () => chatLogPagination);
const pdfExportRef = ref();
const { common, chatUser } = useStore();
const router = useRouter();
const openPDFExport = () => {
    pdfExportRef.value?.open(document.getElementById('chatListId'));
};
const route = useRoute();
const isPcCollapse = ref(false);
// watch(
//   () => common.device,
//   () => {
//     if (common.isMobile()) {
//       isPcCollapse.value = false
//     }
//   },
// )
const logout = () => {
    chatUser.logout().then(() => {
        router.push({
            name: 'login',
            query: route.query,
        });
    });
};
const showSelection = ref(false);
const clickShareHandle = () => {
    showSelection.value = true;
};
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
const classObj = computed(() => {
    return {
        hideLeft: isPcCollapse.value,
        openLeft: !isPcCollapse.value,
    };
});
const newObj = {
    id: 'new',
    abstract: t('aiChat.createChat'),
};
const props = defineProps();
const AiChatRef = ref();
const loading = ref(false);
const left_loading = ref(false);
const applicationDetail = computed({
    get: () => {
        return props.application_profile;
    },
    set: (v) => { },
});
const chatLogData = ref([]);
const paginationConfig = ref({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const currentRecordList = ref([]);
const currentChatId = ref('new'); // CurrentHistoryRecordId Defaultis'new'
const currentChatName = ref(t('aiChat.createChat'));
function refreshFieldTitle(chatId, abstract) {
    const find = chatLogData.value.find((item) => item.id == chatId);
    if (find) {
        find.abstract = abstract;
    }
}
function deleteLog(row) {
    chatAPI.deleteChat(row.id).then(() => {
        if (currentChatId.value === row.id) {
            currentChatId.value = 'new';
            currentChatName.value = t('aiChat.createChat');
            paginationConfig.value.current_page = 1;
            paginationConfig.value.total = 0;
            currentRecordList.value = [];
        }
        chatLogData.value = chatLogData.value.filter((item) => item.id !== row.id);
    });
}
function clearChat() {
    chatAPI.clearChat(left_loading).then(() => {
        currentChatId.value = 'new';
        currentChatName.value = t('aiChat.createChat');
        paginationConfig.value.current_page = 1;
        paginationConfig.value.total = 0;
        currentRecordList.value = [];
        chatLogPagination.value.current_page = 1;
        chatLogData.value = [];
        getChatLog();
    });
}
function handleScroll(event) {
    if (currentChatId.value !== 'new' &&
        event.scrollTop === 0 &&
        paginationConfig.value.total > currentRecordList.value.length) {
        const history_height = event.dialogScrollbar.offsetHeight;
        paginationConfig.value.current_page += 1;
        getChatRecord().then(() => {
            event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height);
        });
    }
}
function newChat() {
    showSelection.value = false;
    if (!chatLogData.value.some((v) => v.id === 'new')) {
        paginationConfig.value.current_page = 1;
        paginationConfig.value.total = 0;
        currentRecordList.value = [];
        chatLogData.value.unshift(newObj);
    }
    else {
        paginationConfig.value.current_page = 1;
        paginationConfig.value.total = 0;
        currentRecordList.value = [];
    }
    closeExecutionDetail();
    currentChatId.value = 'new';
    currentChatName.value = t('aiChat.createChat');
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
        if (refresh) {
            currentChatName.value = chatLogData.value?.[0]?.abstract;
        }
        else {
            paginationConfig.value.current_page = 1;
            paginationConfig.value.total = 0;
            currentRecordList.value = [];
            currentChatId.value = 'new';
            currentChatName.value = t('aiChat.createChat');
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
        .pageChatRecord(currentChatId.value, paginationConfig.value.current_page, paginationConfig.value.page_size, loading)
        .then((res) => {
        paginationConfig.value.total = res.data.total;
        const list = res.data.records;
        list.map((v) => {
            v['write_ed'] = true;
            v['record_id'] = v.id;
        });
        currentRecordList.value = [...list, ...currentRecordList.value].sort((a, b) => a.create_time.localeCompare(b.create_time));
        if (paginationConfig.value.current_page === 1) {
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
        paginationConfig.value.current_page = 1;
        paginationConfig.value.total = 0;
        currentRecordList.value = [];
        currentChatId.value = item.id;
        currentChatName.value = item.abstract;
        closeExecutionDetail();
        if (currentChatId.value !== 'new') {
            getChatRecord();
            // SwitchConversationAfter, CancelPauseBrowserPlay
            if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
                window.speechSynthesis.resume();
                nextTick(() => {
                    window.speechSynthesis.cancel();
                });
            }
        }
    }
};
function refresh(id) {
    currentChatId.value = id;
    chatLogPagination.value.current_page = 1;
    chatLogData.value = [];
    getChatLog(true);
}
async function exportMarkdown() {
    const suggestedName = `${currentChatId.value}.md`;
    const markdownContent = currentRecordList.value
        .map((record) => {
        let answerText = '';
        if (Array.isArray(record.answer_text_list)) {
            answerText = record.answer_text_list
                .flat()
                .map((item) => item?.content || '')
                .join('\n\n');
        }
        else {
            answerText = record.answer_text || '';
        }
        return `# ${record.problem_text}\n\n${answerText}\n\n`;
    })
        .join('\n');
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, suggestedName);
}
async function exportHTML() {
    const suggestedName = `${currentChatId.value}.html`;
    const markdownContent = currentRecordList.value
        .map((record) => {
        let answerText = '';
        if (Array.isArray(record.answer_text_list)) {
            answerText = record.answer_text_list
                .flat()
                .map((item) => item?.content || '')
                .join('\n\n');
        }
        else {
            answerText = record.answer_text || '';
        }
        return `# ${record.problem_text}\n\n${answerText}\n\n`;
    })
        .join('\n');
    const rawHtmlContent = await marked(markdownContent);
    const htmlContent = sanitizeHtml(rawHtmlContent, {
        allowedTags: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'p',
            'br',
            'hr',
            'blockquote',
            'pre',
            'code',
            'em',
            'strong',
            'del',
            'ul',
            'ol',
            'li',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'a',
            'img',
        ],
        allowedAttributes: {
            a: ['href', 'name', 'target', 'title'],
            img: ['src', 'alt', 'title'],
            code: ['class'],
            th: ['align'],
            td: ['align'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: {
            img: ['http', 'https'],
        },
        allowProtocolRelative: false,
    });
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, suggestedName);
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
const rightPanelSize = ref(0);
const rightPanelTitle = ref('');
const rightPanelType = ref('');
const rightPanelLoading = ref(false);
const executionDetail = ref([]);
const rightPanelDetail = ref();
async function openExecutionDetail(row) {
    rightPanelSize.value = 400;
    rightPanelTitle.value = t('aiChat.executionDetails.title');
    rightPanelType.value = 'executionDetail';
    if (row.execution_details) {
        executionDetail.value = cloneDeep(row.execution_details);
    }
    else {
        const res = await chatAPI.getChatRecord(row.chat_id, row.record_id, rightPanelLoading);
        executionDetail.value = cloneDeep(res.data.execution_details);
    }
}
async function openKnowledgeSource(row) {
    rightPanelTitle.value = t('aiChat.KnowledgeSource.title');
    rightPanelType.value = 'knowledgeSource';
    rightPanelDetail.value = row;
    rightPanelSize.value = 400;
}
function openParagraphDocument(detail, row) {
    rightPanelTitle.value = row.document_name;
    rightPanelType.value = 'paragraphDocument';
    rightPanelSize.value = 400;
    rightPanelDetail.value = row;
}
function closeExecutionDetail() {
    rightPanelSize.value = 0;
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['execution-detail-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-pc" },
    ...{ class: (__VLS_ctx.classObj) },
    ...{ style: ({
            '--el-color-primary': __VLS_ctx.applicationDetail?.custom_theme?.theme_color,
            '--el-color-primary-light-9': __VLS_ctx.hexToRgba(__VLS_ctx.applicationDetail?.custom_theme?.theme_color || '#3370FF', 0.1),
            '--el-color-primary-light-6': __VLS_ctx.hexToRgba(__VLS_ctx.applicationDetail?.custom_theme?.theme_color || '#3370FF', 0.4),
            '--el-color-primary-light-06': __VLS_ctx.hexToRgba(__VLS_ctx.applicationDetail?.custom_theme?.theme_color || '#3370FF', 0.04),
        }) },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['chat-pc']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex h-full w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-pc__left" },
});
/** @type {__VLS_StyleScopedClasses['chat-pc__left']} */ ;
const __VLS_0 = HistoryPanel || HistoryPanel;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onNewChat': {} },
    ...{ 'onClickLog': {} },
    ...{ 'onDeleteLog': {} },
    ...{ 'onClearChat': {} },
    ...{ 'onRefreshFieldTitle': {} },
    ...{ 'onClickShare': {} },
    applicationDetail: (__VLS_ctx.applicationDetail),
    chatLogData: (__VLS_ctx.chatLogData),
    leftLoading: (__VLS_ctx.left_loading),
    currentChatId: (__VLS_ctx.currentChatId),
    isPcCollapse: (__VLS_ctx.isPcCollapse),
    chatLoading: (__VLS_ctx.AiChatRef?.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onNewChat': {} },
    ...{ 'onClickLog': {} },
    ...{ 'onDeleteLog': {} },
    ...{ 'onClearChat': {} },
    ...{ 'onRefreshFieldTitle': {} },
    ...{ 'onClickShare': {} },
    applicationDetail: (__VLS_ctx.applicationDetail),
    chatLogData: (__VLS_ctx.chatLogData),
    leftLoading: (__VLS_ctx.left_loading),
    currentChatId: (__VLS_ctx.currentChatId),
    isPcCollapse: (__VLS_ctx.isPcCollapse),
    chatLoading: (__VLS_ctx.AiChatRef?.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.newChat} */
    onNewChat: (__VLS_ctx.newChat),
};
const __VLS_7 = {
    /** @type {typeof __VLS_5.clickLog} */
    onClickLog: (__VLS_ctx.clickListHandle),
};
const __VLS_8 = {
    /** @type {typeof __VLS_5.deleteLog} */
    onDeleteLog: (__VLS_ctx.deleteLog),
};
const __VLS_9 = {
    /** @type {typeof __VLS_5.clearChat} */
    onClearChat: (__VLS_ctx.clearChat),
};
const __VLS_10 = {
    /** @type {typeof __VLS_5.refreshFieldTitle} */
    onRefreshFieldTitle: (__VLS_ctx.refreshFieldTitle),
};
const __VLS_11 = {
    /** @type {typeof __VLS_5.clickShare} */
    onClickShare: (__VLS_ctx.clickShareHandle),
};
const { default: __VLS_12 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-info p-16 cursor" },
});
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
if (!__VLS_ctx.chatUser.chat_profile?.authentication ||
    __VLS_ctx.chatUser.chat_profile.authentication_type === 'password') {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        size: (32),
    }));
    const __VLS_15 = __VLS_14({
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/user-icon.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [classObj, applicationDetail, applicationDetail, applicationDetail, applicationDetail, applicationDetail, hexToRgba, hexToRgba, hexToRgba, vLoading, loading, chatLogData, left_loading, currentChatId, isPcCollapse, AiChatRef, newChat, clickListHandle, deleteLog, clearChat, refreshFieldTitle, clickShareHandle, chatUser, chatUser,];
    var __VLS_16;
}
else {
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        trigger: "click",
        type: "primary",
        ...{ class: "w-full" },
    }));
    const __VLS_21 = __VLS_20({
        trigger: "click",
        type: "primary",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_24 } = __VLS_22.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        size: (32),
    }));
    const __VLS_27 = __VLS_26({
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const { default: __VLS_30 } = __VLS_28.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/user-icon.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [];
    var __VLS_28;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8 color-text-primary" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isPcCollapse) }, null, null);
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    (__VLS_ctx.chatUser.chatUserProfile?.nick_name);
    {
        const { dropdown: __VLS_31 } = __VLS_22.slots;
        let __VLS_32;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
            ...{ style: {} },
        }));
        const __VLS_34 = __VLS_33({
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        const { default: __VLS_37 } = __VLS_35.slots;
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
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            size: (40),
        }));
        const __VLS_40 = __VLS_39({
            size: (40),
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        const { default: __VLS_43 } = __VLS_41.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/user-icon.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [isPcCollapse, chatUser,];
        var __VLS_41;
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
        (`${__VLS_ctx.t('common.username')}: ${__VLS_ctx.chatUser.chatUserProfile?.username}`);
        if (__VLS_ctx.chatUser.chatUserProfile?.source === 'LOCAL') {
            let __VLS_44;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
                ...{ 'onClick': {} },
                ...{ class: "border-t" },
                ...{ style: {} },
            }));
            const __VLS_46 = __VLS_45({
                ...{ 'onClick': {} },
                ...{ class: "border-t" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            let __VLS_49;
            const __VLS_50 = {
                /** @type {typeof __VLS_49.click} */
                onClick: (__VLS_ctx.openResetPassword),
            };
            /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
            const { default: __VLS_51 } = __VLS_47.slots;
            let __VLS_52;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
                iconName: "app-key",
                ...{ class: "color-secondary" },
            }));
            const __VLS_54 = __VLS_53({
                iconName: "app-key",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('views.login.resetPassword'));
            // @ts-ignore
            [chatUser, chatUser, chatUser, t, openResetPassword, $t,];
            var __VLS_47;
            var __VLS_48;
        }
        let __VLS_57;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            ...{ 'onClick': {} },
            ...{ class: "border-t" },
            ...{ style: {} },
        }));
        const __VLS_59 = __VLS_58({
            ...{ 'onClick': {} },
            ...{ class: "border-t" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        let __VLS_62;
        const __VLS_63 = {
            /** @type {typeof __VLS_62.click} */
            onClick: (__VLS_ctx.logout),
        };
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        const { default: __VLS_64 } = __VLS_60.slots;
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            iconName: "app-export",
            ...{ class: "color-secondary" },
        }));
        const __VLS_67 = __VLS_66({
            iconName: "app-export",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        (__VLS_ctx.$t('layout.logout'));
        // @ts-ignore
        [$t, logout,];
        var __VLS_60;
        var __VLS_61;
        // @ts-ignore
        [];
        var __VLS_35;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_22;
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
if (!__VLS_ctx.common.isMobile()) {
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        ...{ 'onClick': {} },
        ...{ class: "pc-collapse cursor" },
        circle: true,
    }));
    const __VLS_72 = __VLS_71({
        ...{ 'onClick': {} },
        ...{ class: "pc-collapse cursor" },
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    let __VLS_75;
    const __VLS_76 = {
        /** @type {typeof __VLS_75.click} */
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.common.isMobile()))
                throw 0;
            return __VLS_ctx.isPcCollapse = !__VLS_ctx.isPcCollapse;
            // @ts-ignore
            [isPcCollapse, isPcCollapse, common,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['pc-collapse']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    const { default: __VLS_77 } = __VLS_73.slots;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({}));
    const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const { default: __VLS_83 } = __VLS_81.slots;
    const __VLS_84 = (__VLS_ctx.isPcCollapse ? 'ArrowRightBold' : 'ArrowLeftBold');
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({}));
    const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
    // @ts-ignore
    [isPcCollapse,];
    var __VLS_81;
    // @ts-ignore
    [];
    var __VLS_73;
    var __VLS_74;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-pc__right chat-background" },
    ...{ style: ({
            backgroundImage: `url(${__VLS_ctx.applicationDetail?.chat_background})`,
            '--execution-detail-panel-width': __VLS_ctx.rightPanelSize + 'px',
        }) },
});
/** @type {__VLS_StyleScopedClasses['chat-pc__right']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-background']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24 flex-between" },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "ellipsis-1" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
(__VLS_ctx.currentChatName);
if (__VLS_ctx.currentRecordList.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    if (__VLS_ctx.paginationConfig.total) {
        let __VLS_89;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
            iconName: "app-chat-record",
            ...{ class: "color-secondary mr-8" },
            ...{ style: {} },
        }));
        const __VLS_91 = __VLS_90({
            iconName: "app-chat-record",
            ...{ class: "color-secondary mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    }
    if (__VLS_ctx.paginationConfig.total) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.paginationConfig.total);
        (__VLS_ctx.$t('aiChat.question_count'));
    }
    if (!__VLS_ctx.showSelection && __VLS_ctx.applicationDetail.show_share) {
        let __VLS_94;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.share')),
            placement: "top",
        }));
        const __VLS_96 = __VLS_95({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.share')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        const { default: __VLS_99 } = __VLS_97.slots;
        let __VLS_100;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "ml-12" },
            disabled: (__VLS_ctx.AiChatRef?.loading),
        }));
        const __VLS_102 = __VLS_101({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "ml-12" },
            disabled: (__VLS_ctx.AiChatRef?.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        let __VLS_105;
        const __VLS_106 = {
            /** @type {typeof __VLS_105.click} */
            onClick: (__VLS_ctx.clickShareHandle),
        };
        /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
        const { default: __VLS_107 } = __VLS_103.slots;
        let __VLS_108;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
            iconName: "app-share",
        }));
        const __VLS_110 = __VLS_109({
            iconName: "app-share",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        // @ts-ignore
        [applicationDetail, applicationDetail, AiChatRef, clickShareHandle, $t, $t, rightPanelSize, currentChatName, currentRecordList, paginationConfig, paginationConfig, paginationConfig, showSelection,];
        var __VLS_103;
        var __VLS_104;
        // @ts-ignore
        [];
        var __VLS_97;
    }
    if (!__VLS_ctx.showSelection) {
        let __VLS_113;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
            ...{ class: "ml-8" },
        }));
        const __VLS_115 = __VLS_114({
            ...{ class: "ml-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        const { default: __VLS_118 } = __VLS_116.slots;
        let __VLS_119;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
            text: true,
        }));
        const __VLS_121 = __VLS_120({
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_120));
        const { default: __VLS_124 } = __VLS_122.slots;
        let __VLS_125;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
            iconName: "app-export",
            title: (__VLS_ctx.$t('aiChat.exportRecords')),
        }));
        const __VLS_127 = __VLS_126({
            iconName: "app-export",
            title: (__VLS_ctx.$t('aiChat.exportRecords')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        // @ts-ignore
        [$t, showSelection,];
        var __VLS_122;
        {
            const { dropdown: __VLS_130 } = __VLS_116.slots;
            let __VLS_131;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({}));
            const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
            const { default: __VLS_136 } = __VLS_134.slots;
            let __VLS_137;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
                ...{ 'onClick': {} },
            }));
            const __VLS_139 = __VLS_138({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_138));
            let __VLS_142;
            const __VLS_143 = {
                /** @type {typeof __VLS_142.click} */
                onClick: (__VLS_ctx.exportMarkdown),
            };
            const { default: __VLS_144 } = __VLS_140.slots;
            (__VLS_ctx.$t('common.export'));
            // @ts-ignore
            [$t, exportMarkdown,];
            var __VLS_140;
            var __VLS_141;
            let __VLS_145;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
                ...{ 'onClick': {} },
            }));
            const __VLS_147 = __VLS_146({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_146));
            let __VLS_150;
            const __VLS_151 = {
                /** @type {typeof __VLS_150.click} */
                onClick: (__VLS_ctx.exportHTML),
            };
            const { default: __VLS_152 } = __VLS_148.slots;
            (__VLS_ctx.$t('common.export'));
            // @ts-ignore
            [$t, exportHTML,];
            var __VLS_148;
            var __VLS_149;
            let __VLS_153;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
                ...{ 'onClick': {} },
            }));
            const __VLS_155 = __VLS_154({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_154));
            let __VLS_158;
            const __VLS_159 = {
                /** @type {typeof __VLS_158.click} */
                onClick: (__VLS_ctx.openPDFExport),
            };
            const { default: __VLS_160 } = __VLS_156.slots;
            (__VLS_ctx.$t('common.export'));
            // @ts-ignore
            [$t, openPDFExport,];
            var __VLS_156;
            var __VLS_157;
            // @ts-ignore
            [];
            var __VLS_134;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_116;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "right-height chat-width" },
});
/** @type {__VLS_StyleScopedClasses['right-height']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-width']} */ ;
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.AiChat | typeof __VLS_components.AiChat} */
AiChat;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    ...{ 'onRefresh': {} },
    ...{ 'onOpenChat': {} },
    ...{ 'onScroll': {} },
    ...{ 'onOpenExecutionDetail': {} },
    ...{ 'onOpenParagraph': {} },
    ...{ 'onOpenParagraphDocument': {} },
    ref: "AiChatRef",
    applicationDetails: (__VLS_ctx.applicationDetail),
    available: (__VLS_ctx.applicationAvailable),
    type: "ai-chat",
    appId: (__VLS_ctx.applicationDetail?.id),
    record: (__VLS_ctx.currentRecordList),
    chatId: (__VLS_ctx.currentChatId),
    executionIsRightPanel: true,
    selection: (__VLS_ctx.showSelection),
}));
const __VLS_163 = __VLS_162({
    ...{ 'onRefresh': {} },
    ...{ 'onOpenChat': {} },
    ...{ 'onScroll': {} },
    ...{ 'onOpenExecutionDetail': {} },
    ...{ 'onOpenParagraph': {} },
    ...{ 'onOpenParagraphDocument': {} },
    ref: "AiChatRef",
    applicationDetails: (__VLS_ctx.applicationDetail),
    available: (__VLS_ctx.applicationAvailable),
    type: "ai-chat",
    appId: (__VLS_ctx.applicationDetail?.id),
    record: (__VLS_ctx.currentRecordList),
    chatId: (__VLS_ctx.currentChatId),
    executionIsRightPanel: true,
    selection: (__VLS_ctx.showSelection),
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
let __VLS_166;
const __VLS_167 = {
    /** @type {typeof __VLS_166.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
const __VLS_168 = {
    /** @type {typeof __VLS_166.openChat} */
    onOpenChat: (__VLS_ctx.refresh),
};
const __VLS_169 = {
    /** @type {typeof __VLS_166.scroll} */
    onScroll: (__VLS_ctx.handleScroll),
};
const __VLS_170 = {
    /** @type {typeof __VLS_166.openExecutionDetail} */
    onOpenExecutionDetail: (__VLS_ctx.openExecutionDetail),
};
const __VLS_171 = {
    /** @type {typeof __VLS_166.openParagraph} */
    onOpenParagraph: (__VLS_ctx.openKnowledgeSource),
};
const __VLS_172 = {
    /** @type {typeof __VLS_166.openParagraphDocument} */
    onOpenParagraphDocument: (__VLS_ctx.openParagraphDocument),
};
var __VLS_173;
var __VLS_164;
var __VLS_165;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "execution-detail-panel" },
    resizable: (false),
    collapsible: true,
});
/** @type {__VLS_StyleScopedClasses['execution-detail-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16 flex-between border-b" },
});
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "medium ellipsis" },
    ...{ style: {} },
    title: (__VLS_ctx.rightPanelTitle),
});
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.rightPanelTitle);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (__VLS_ctx.rightPanelType === 'paragraphDocument') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: (__VLS_ctx.getFileUrl(__VLS_ctx.rightPanelDetail?.meta?.source_file_id) ||
            __VLS_ctx.rightPanelDetail?.meta?.source_url),
        target: "_blank",
        ...{ class: "ellipsis-1" },
        title: (__VLS_ctx.rightPanelDetail?.document_name?.trim()),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    let __VLS_175;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
        text: true,
    }));
    const __VLS_177 = __VLS_176({
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    const { default: __VLS_180 } = __VLS_178.slots;
    let __VLS_181;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
        iconName: "app-pdf-export",
        ...{ class: "cursor" },
    }));
    const __VLS_183 = __VLS_182({
        iconName: "app-pdf-export",
        ...{ class: "cursor" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    // @ts-ignore
    [applicationDetail, applicationDetail, currentChatId, currentRecordList, showSelection, applicationAvailable, refresh, refresh, handleScroll, openExecutionDetail, openKnowledgeSource, openParagraphDocument, rightPanelTitle, rightPanelTitle, rightPanelType, getFileUrl, rightPanelDetail, rightPanelDetail, rightPanelDetail,];
    var __VLS_178;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
let __VLS_186;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_188 = __VLS_187({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
let __VLS_191;
const __VLS_192 = {
    /** @type {typeof __VLS_191.click} */
    onClick: (__VLS_ctx.closeExecutionDetail),
};
const { default: __VLS_193 } = __VLS_189.slots;
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    size: "20",
}));
const __VLS_196 = __VLS_195({
    size: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
const { default: __VLS_199 } = __VLS_197.slots;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.Close} */
Close;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({}));
const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
// @ts-ignore
[closeExecutionDetail,];
var __VLS_197;
// @ts-ignore
[];
var __VLS_189;
var __VLS_190;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "execution-detail-content mb-8" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.rightPanelLoading) }, null, null);
/** @type {__VLS_StyleScopedClasses['execution-detail-content']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({}));
const __VLS_207 = __VLS_206({}, ...__VLS_functionalComponentArgsRest(__VLS_206));
const { default: __VLS_210 } = __VLS_208.slots;
if (__VLS_ctx.rightPanelType === 'knowledgeSource') {
    const __VLS_211 = ParagraphSourceContent;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
        detail: (__VLS_ctx.rightPanelDetail),
    }));
    const __VLS_213 = __VLS_212({
        detail: (__VLS_ctx.rightPanelDetail),
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
}
if (__VLS_ctx.rightPanelType === 'executionDetail') {
    const __VLS_216 = ExecutionDetailContent;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
        detail: (__VLS_ctx.executionDetail),
        appType: (__VLS_ctx.applicationDetail?.type),
    }));
    const __VLS_218 = __VLS_217({
        detail: (__VLS_ctx.executionDetail),
        appType: (__VLS_ctx.applicationDetail?.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
}
else {
    const __VLS_221 = ParagraphDocumentContent;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
        detail: (__VLS_ctx.rightPanelDetail),
    }));
    const __VLS_223 = __VLS_222({
        detail: (__VLS_ctx.rightPanelDetail),
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
}
// @ts-ignore
[applicationDetail, vLoading, rightPanelType, rightPanelType, rightPanelDetail, rightPanelDetail, rightPanelLoading, executionDetail,];
var __VLS_208;
const __VLS_226 = ResetPassword || ResetPassword;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
    ...{ 'onConfirm': {} },
    ref: "resetPasswordRef",
    emitConfirm: true,
}));
const __VLS_228 = __VLS_227({
    ...{ 'onConfirm': {} },
    ref: "resetPasswordRef",
    emitConfirm: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
let __VLS_231;
const __VLS_232 = {
    /** @type {typeof __VLS_231.confirm} */
    onConfirm: (__VLS_ctx.handleResetPassword),
};
var __VLS_233;
var __VLS_229;
var __VLS_230;
const __VLS_235 = PdfExport || PdfExport;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
    ref: "pdfExportRef",
}));
const __VLS_237 = __VLS_236({
    ref: "pdfExportRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
var __VLS_240;
var __VLS_238;
// @ts-ignore
var __VLS_174 = __VLS_173, __VLS_234 = __VLS_233, __VLS_241 = __VLS_240;
// @ts-ignore
[handleResetPassword,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
