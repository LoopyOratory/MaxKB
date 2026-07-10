/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, nextTick, computed, watch, reactive, onMounted, onBeforeUnmount, provide, } from 'vue';
import { useRoute } from 'vue-router';
import applicationApi from '@/api/application/application';
import chatAPI from '@/api/chat/chat';
import SystemResourceManagementApplicationAPI from '@/api/system-resource-management/application.ts';
import syetrmResourceManagementChatLogApi from '@/api/system-resource-management/chat-log';
import chatLogApi from '@/api/application/chat-log';
import { ChatManagement } from '@/api/type/application';
import { randomId } from '@/utils/common';
import useStore from '@/stores';
import { debounce } from 'lodash';
import { useElementSize } from '@vueuse/core';
import AnswerContent from '@/components/ai-chat/component/answer-content/index.vue';
import QuestionContent from '@/components/ai-chat/component/question-content/index.vue';
import TransitionContent from '@/components/ai-chat/component/transition-content/index.vue';
import ChatInputOperate from '@/components/ai-chat/component/chat-input-operate/index.vue';
import PrologueContent from '@/components/ai-chat/component/prologue-content/index.vue';
import UserForm from '@/components/ai-chat/component/user-form/index.vue';
import Control from '@/components/ai-chat/component/control/index.vue';
import { t } from '@/locales';
import bus from '@/bus';
import { throttle } from 'lodash-es';
import { copyClick } from '@/utils/clipboard';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { getWrite } from '@/utils/chat';
import InlineParams from '@/components/ai-chat/component/inline-params/index.vue';
provide('upload', (file, loading) => {
    return props.type === 'debug-ai-chat'
        ? applicationApi.postUploadFile(file, 'TEMPORARY_120_MINUTE', 'TEMPORARY_120_MINUTE', loading)
        : chatAPI.postUploadFile(file, chartOpenId.value, 'CHAT', loading);
});
provide('getSelectModelList', (params) => {
    if (route.path.includes('resource-management')) {
        return loadSharedApi({ type: 'model', systemType: 'systemManage' }).getSelectModelList(params);
    }
    else {
        return loadSharedApi({ type: 'model', systemType: 'workspace' }).getSelectModelList(params);
    }
});
provide('chatUserProfile', () => {
    if (props.type === 'ai-chat') {
        if (chatUser.chat_profile?.authentication_type === 'login') {
            return chatUser.getChatUserProfile();
        }
    }
    return Promise.resolve(null);
});
const transcribing = ref(false);
defineOptions({ name: 'AiChat' });
const route = useRoute();
const { params: { accessToken, id }, query: { mode }, } = route;
const props = withDefaults(defineProps(), {
    applicationDetails: () => ({}),
    available: true,
    type: 'ai-chat',
});
const emit = defineEmits([
    'refresh',
    'openChat',
    'scroll',
    'openExecutionDetail',
    'openParagraph',
    'openParagraphDocument',
    'update:selection',
]);
const { application, common, chatUser } = useStore();
const aiChatRef = ref();
const { width: rootWidth } = useElementSize(aiChatRef);
const isMobile = computed(() => {
    return common.isMobile() || mode === 'embed' || mode === 'mobile';
});
const isNarrow = computed(() => rootWidth.value > 0 && rootWidth.value < 768);
const maxExposed = computed(() => (isNarrow.value ? 1 : 3));
const inlineExposedFields = computed(() => (props.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
    ?.user_input_field_list_setting?.exposed_fields || []).slice(0, maxExposed.value));
const triggerEl = computed(() => {
    const btn = inlineParamsRef.value?.triggerBtnRef;
    return btn?.$el ?? btn;
});
const scrollDiv = ref();
const dialogScrollbar = ref();
const loading = ref(false);
const inputValue = ref('');
const chartOpenId = ref('');
const chatList = ref([]);
// Whether the currently viewed conversation has in-flight messages (still streaming)。
// Use it to drive "Stop Answer" button, input disable, send intercept, replacing component-level global loading,
// So other background conversations streaming won't lock the current conversation's input bar。
const currentChatGenerating = computed(() => chatList.value.some((c) => c && c.write_ed === false && c.is_stop !== true));
const form_data = ref({});
const api_form_data = ref({});
const userFormRef = ref();
// User input
const firsUserInput = ref(false);
const showUserInput = ref(false);
// Initial form data (for recovery)
const initialFormData = ref({});
const initialApiFormData = ref({});
const inlineParamsRef = ref();
const isUserInput = computed(() => props.applicationDetails?.work_flow?.nodes?.filter((v) => v.id === 'base-node')[0]
    ?.properties.user_input_field_list.length > 0);
const userInputTitle = computed(() => props.applicationDetails.work_flow?.nodes?.filter((v) => v.id === 'base-node')[0]
    ?.properties?.user_input_config?.title);
const isAPIInput = computed(() => props.type === 'debug-ai-chat' &&
    props.applicationDetails.work_flow?.nodes?.filter((v) => v.id === 'base-node')[0]
        .properties.api_input_field_list.length > 0);
const showUserInputContent = computed(() => {
    return ((((isUserInput.value || isAPIInput.value) && firsUserInput.value) || showUserInput.value) &&
        props.type !== 'log');
});
watch(() => props.chatId, (val) => {
    if (val && val !== 'new') {
        chartOpenId.value = val;
        firsUserInput.value = false;
    }
    else {
        chartOpenId.value = '';
    }
}, { deep: true, immediate: true });
watch(() => props.applicationDetails, () => {
    chartOpenId.value = '';
}, { deep: true });
watch(() => props.record, (value) => {
    chatList.value = value ? value : [];
}, {
    immediate: true,
});
// Select conversation share
const checkAll = ref(false);
const multipleSelectionChat = ref([]);
const shareLoading = ref(false);
watch(() => props.selection, (value) => {
    if (value) {
        if (value && multipleSelectionChat.value.length === 0) {
            multipleSelectionChat.value = chatList.value.map((v) => v.record_id);
            checkAll.value = true;
        }
    }
    else {
        checkAll.value = false;
        multipleSelectionChat.value = [];
    }
}, {
    immediate: true,
});
function shareChatHandle() {
    const validIds = new Set(chatList.value.map((v) => v.record_id));
    const selectedIds = multipleSelectionChat.value.filter((id) => validIds.has(id));
    const obj = {
        chat_record_ids: selectedIds,
        is_current_all: checkAll.value,
    };
    chatAPI.postShareChat(id || props.appId, chartOpenId.value, obj, shareLoading).then((res) => {
        if (res.data?.link) {
            copyClick(window.location.origin + '/chat/share/' + res.data.link);
        }
    });
}
const handleCheckAllChange = (val) => {
    multipleSelectionChat.value = val ? chatList.value.map((v) => v.record_id) : [];
    checkAll.value = val;
};
const handleCheckedChatChange = (value) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === chatList.value.length;
};
function toggleSelect(id) {
    if (props.selection) {
        const index = multipleSelectionChat.value.indexOf(id);
        if (index === -1) {
            multipleSelectionChat.value.push(id);
        }
        else {
            multipleSelectionChat.value.splice(index, 1);
        }
        checkAll.value = multipleSelectionChat.value.length === chatList.value.length;
    }
}
const handleOpenDialog = () => {
    showUserInput.value = true;
    initialFormData.value = JSON.parse(JSON.stringify(form_data.value));
    initialApiFormData.value = JSON.parse(JSON.stringify(api_form_data.value));
};
function cancelCheckHandle() {
    checkAll.value = false;
    multipleSelectionChat.value = [];
    emit('update:selection', false);
}
const toggleUserInput = () => {
    showUserInput.value = !showUserInput.value;
    if (showUserInput.value) {
        // Save current data as initial data (for potential recovery)
        initialFormData.value = JSON.parse(JSON.stringify(form_data.value));
        initialApiFormData.value = JSON.parse(JSON.stringify(api_form_data.value));
    }
};
function UserFormConfirm() {
    firsUserInput.value = false;
    showUserInput.value = false;
}
function UserFormCancel() {
    // Restore initial data
    form_data.value = JSON.parse(JSON.stringify(initialFormData.value));
    api_form_data.value = JSON.parse(JSON.stringify(initialApiFormData.value));
    userFormRef.value?.render(form_data.value);
    showUserInput.value = false;
}
const validate = () => {
    return inlineParamsRef.value?.validate() || Promise.resolve(true);
};
function sendMessage(val, other_params_data, chat) {
    if (isUserInput.value) {
        if (userFormRef.value) {
            return userFormRef.value
                ?.validate()
                .then((ok) => {
                const userFormData = accessToken
                    ? JSON.parse(localStorage.getItem(`${accessToken}userForm`) || '{}')
                    : {};
                const newData = Object.keys(form_data.value).reduce((result, key) => {
                    result[key] = Object.prototype.hasOwnProperty.call(userFormData, key)
                        ? userFormData[key]
                        : form_data.value[key];
                    return result;
                }, {});
                if (accessToken) {
                    localStorage.setItem(`${accessToken}userForm`, JSON.stringify(newData));
                }
                showUserInput.value = false;
                if (!currentChatGenerating.value && props.applicationDetails?.name) {
                    handleDebounceClick(val, other_params_data, chat);
                    return true;
                }
                throw 'err: no send';
            })
                .catch((e) => {
                if (isAPIInput.value && props.type !== 'debug-ai-chat') {
                    showUserInput.value = false;
                }
                else {
                    showUserInput.value = true;
                }
                return false;
            });
        }
        else {
            return Promise.reject(false);
        }
    }
    else {
        showUserInput.value = false;
        if (!currentChatGenerating.value && props.applicationDetails?.name) {
            handleDebounceClick(val, other_params_data, chat);
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    }
}
const handleDebounceClick = debounce((val, other_params_data, chat) => {
    chatMessage(chat, val, false, other_params_data);
}, 200);
/**
 * Open conversation id
 */
const openChatId = () => {
    const obj = props.applicationDetails;
    return getOpenChatAPI()(obj.id)
        .then((res) => {
        chartOpenId.value = res.data;
        return res.data;
    })
        .catch((res) => {
        return Promise.reject(res);
    });
};
const getChatMessageAPI = () => {
    if (props.type === 'debug-ai-chat') {
        return applicationApi.chat;
    }
    else {
        return chatAPI.chat;
    }
};
const getOpenChatAPI = () => {
    if (props.type === 'debug-ai-chat') {
        if (route.path.includes('resource-management')) {
            return SystemResourceManagementApplicationAPI.open;
        }
        else {
            return applicationApi.open;
        }
    }
    else {
        return (a, loading) => {
            return chatAPI.open(loading);
        };
    }
};
const getChatRecordDetailsAPI = (row) => {
    if (row.record_id) {
        if (props.type === 'debug-ai-chat') {
            if (route.path.includes('resource-management')) {
                return syetrmResourceManagementChatLogApi.getChatRecordDetails(id || props.appId, row.chat_id, row.record_id, loading);
            }
            else {
                return chatLogApi.getChatRecordDetails(id || props.appId, row.chat_id, row.record_id, loading);
            }
        }
        else {
            return chatAPI.getChatRecord(row.chat_id, row.record_id, loading);
        }
    }
    return Promise.reject('404');
};
/**
 * Get conversation details
 * @param row
 */
function getSourceDetail(row) {
    return getChatRecordDetailsAPI(row).then((res) => {
        const exclude_keys = ['answer_text', 'id', 'answer_text_list'];
        Object.keys(res.data).forEach((key) => {
            if (!exclude_keys.includes(key)) {
                row[key] = res.data[key];
            }
        });
    });
}
/**
 * Conversation
 */
function getChartOpenId(chat, problem, re_chat, other_params_data) {
    return openChatId().then(() => {
        chatMessage(chat, problem, re_chat, other_params_data);
    });
}
const errorWrite = (chat, message) => {
    ChatManagement.addChatRecord(chat, 50, loading);
    ChatManagement.write(chat.id);
    ChatManagement.append(chat.id, message || t('aiChat.tip.error500Message'));
    ChatManagement.updateStatus(chat.id, 500);
    ChatManagement.close(chat.id);
};
// Stop"CurrentCurrently viewingSession"In-flightMessage。
// Only affects chatList (current conversation); won't impact other running conversations in the background。
const stopGenerating = () => {
    chatList.value.forEach((c) => {
        if (c && c.write_ed === false && c.is_stop !== true) {
            ChatManagement.stop(c.id);
        }
    });
};
// Save uploaded file list
function chatMessage(chat, problem, re_chat, other_params_data) {
    loading.value = true;
    if (!chat) {
        chat = reactive({
            id: randomId(),
            problem_text: problem ? problem : inputValue.value.trim(),
            answer_text: '',
            answer_text_list: [[]],
            currentNodeName: '',
            buffer: [],
            reasoning_content: '',
            reasoning_content_buffer: [],
            write_ed: false,
            is_stop: false,
            record_id: '',
            chat_id: '',
            vote_status: '-1',
            status: undefined,
            upload_meta: {
                image_list: other_params_data && other_params_data.image_list ? other_params_data.image_list : [],
                document_list: other_params_data && other_params_data.document_list
                    ? other_params_data.document_list
                    : [],
                audio_list: other_params_data && other_params_data.audio_list ? other_params_data.audio_list : [],
                video_list: other_params_data && other_params_data.video_list ? other_params_data.video_list : [],
                other_list: other_params_data && other_params_data.other_list ? other_params_data.other_list : [],
            },
        });
        chatList.value.push(chat);
        ChatManagement.addChatRecord(chat, 50, loading);
        ChatManagement.write(chat.id);
        inputValue.value = '';
        nextTick(() => {
            // Scroll to the bottom
            scrollDiv.value.setScrollTop(getMaxHeight());
        });
    }
    if (chat.run_time) {
        ChatManagement.addChatRecord(chat, 50, loading);
        ChatManagement.write(chat.id);
    }
    if (!chartOpenId.value) {
        getChartOpenId(chat, problem, re_chat, other_params_data).catch(() => {
            errorWrite(chat);
        });
    }
    else {
        const obj = {
            message: chat.problem_text,
            stream: true,
            re_chat: re_chat || false,
            ...other_params_data,
            form_data: {
                ...form_data.value,
                ...api_form_data.value,
            },
        };
        if (other_params_data && other_params_data.form_data) {
            obj.form_data = { ...obj.form_data, ...other_params_data.form_data };
        }
        // Conversation
        getChatMessageAPI()(chartOpenId.value, obj)
            .then((response) => {
            if (response.status === 460) {
                return Promise.reject(t('aiChat.tip.errorIdentifyMessage'));
            }
            else if (response.status === 461) {
                return Promise.reject(t('aiChat.tip.errorLimitMessage'));
            }
            else {
                // New conversation: backend has already executed set_chat to create Chat row (before streaming),
                // Notify parent to add new conversation to history list, so you can switch away during a long streaming answer and come back to continue
                if (props.chatId === 'new') {
                    emit('openChat', chartOpenId.value);
                }
                nextTick(() => {
                    // Scroll to the bottom
                    scrollDiv.value.setScrollTop(getMaxHeight());
                });
                const reader = response.body.getReader();
                // Process stream data
                const write = getWrite(chat, reader, response.headers.get('Content-Type') !== 'application/json');
                return write();
            }
        })
            .then(() => {
            if (props.chatId === 'new') {
                emit('refresh', chartOpenId.value);
            }
            getSourceDetail(chat);
            // if (props.type === 'debug-ai-chat') {
            //   getSourceDetail(chat)
            // } else {
            //   if (
            //     props.applicationDetails &&
            //     (props.applicationDetails.show_exec || props.applicationDetails.show_source)
            //   ) {
            //     getSourceDetail(chat)
            //   }
            // }
        })
            .finally(() => {
            ChatManagement.close(chat.id);
        })
            .catch((e) => {
            errorWrite(chat, e + '');
        });
    }
}
/**
 * Scrollbar distance from top
 */
const scrollTop = ref(0);
const scorll = ref(true);
const isBottom = ref(false);
const getMaxHeight = () => {
    return dialogScrollbar.value.scrollHeight;
};
/**
 * Scroll to the top
 * @param $event
 */
const handleScrollTop = ($event) => {
    scrollTop.value = $event.scrollTop;
    if (dialogScrollbar.value.scrollHeight - (scrollTop.value + scrollDiv.value.wrapRef.offsetHeight) <=
        40) {
        scorll.value = true;
    }
    else {
        scorll.value = false;
    }
    isBottom.value =
        scrollTop.value + scrollDiv.value.wrapRef.offsetHeight < dialogScrollbar.value.scrollHeight;
    emit('scroll', { ...$event, dialogScrollbar: dialogScrollbar.value, scrollDiv: scrollDiv.value });
};
/**
 * Handle scroll following
 */
const handleScroll = () => {
    if (props.type !== 'log' && scrollDiv.value) {
        // Scrollbar needed when inner height exceeds outer height
        if (scrollDiv.value.wrapRef.offsetHeight < dialogScrollbar.value.scrollHeight) {
            // Only auto-scroll to bottom when user is near the bottom
            const isNearBottom = dialogScrollbar.value.scrollHeight -
                (scrollTop.value + scrollDiv.value.wrapRef.offsetHeight) <=
                40;
            if (scorll.value || isNearBottom) {
                // Scroll to bottom
                scrollDiv.value.setScrollTop(dialogScrollbar.value.scrollHeight);
            }
        }
    }
};
function parseTransform(transformStr) {
    const result = { scale: 1, translateX: 0, translateY: 0, translateZ: 0 };
    if (!transformStr || transformStr === 'none')
        return result;
    // Use regex to match scale and translate3d values
    const scaleMatch = transformStr.match(/scale\(([^)]+)\)/);
    const translateMatch = transformStr.match(/translate3d\(([^)]+)\)/);
    if (scaleMatch) {
        // Scale may be one value or two values (scaleX, scaleY)
        const scaleValues = scaleMatch[1].split(',').map((v) => parseFloat(v.trim()));
        result.scale = scaleValues[0];
    }
    if (translateMatch) {
        const translateValues = translateMatch[1].split(',').map((v) => parseFloat(v.trim()));
        [result.translateX, result.translateY, result.translateZ] = translateValues;
    }
    return result;
}
onMounted(() => {
    if (isUserInput.value && localStorage.getItem(`${accessToken}userForm`)) {
        const userFormData = JSON.parse(localStorage.getItem(`${accessToken}userForm`) || '{}');
        form_data.value = userFormData;
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    const handleZoom = throttle((event, target) => {
        // 2. Parse current transform state
        const currentTransform = target.style.transform;
        const transformValues = parseTransform(currentTransform);
        const { scale, translateX, translateY } = transformValues;
        // Ensure scale is numeric type
        const currentScale = Array.isArray(scale) ? scale[0] : scale;
        // 3. Calculate zoom direction and new zoom ratio
        const zoomIntensity = 0.05; // Zoom step per scroll wheel event
        const zoomFactor = event.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
        const newScale = Math.max(0.1, currentScale * zoomFactor); // Set minimum zoom limit
        // 4. Calculate new translate value
        const newTranslateX = (translateX * currentScale) / newScale;
        const newTranslateY = (translateY * currentScale) / newScale;
        // 5. Apply new transform
        target.style.transform = `scale(${newScale}) translate3d(${newTranslateX}px, ${newTranslateY}px, 0px)`;
    }, 50); // Execute at most once per 50ms
    document.body.addEventListener('wheel', (event) => {
        // 1. Locate target element
        if (event.target) {
            const target = event.target;
            // Assume opened images have a specific class name
            if (target.classList && target.classList.contains('medium-zoom-overlay')) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (target.classList && target.classList.contains('medium-zoom-image--opened')) {
                event.preventDefault();
                event.stopPropagation();
                handleZoom(event, target);
            }
        }
    }, { passive: false });
    window.sendMessage = sendMessage;
    bus.on('on:transcribing', (status) => {
        transcribing.value = status;
        nextTick(() => {
            if (scorll.value) {
                scrollDiv.value.setScrollTop(getMaxHeight());
            }
        });
    });
    bus.on('click:share', (id) => {
        multipleSelectionChat.value.push(id);
        checkAll.value = multipleSelectionChat.value.length === chatList.value.length;
        emit('update:selection', true);
    });
    bus.on('chat:stop', stopGenerating);
});
onBeforeUnmount(() => {
    window.sendMessage = null;
    window.chatUserProfile = null;
    bus.off('chat:stop', stopGenerating);
});
function setScrollBottom() {
    // Scroll to the bottom
    scrollDiv.value.setScrollTop(getMaxHeight());
}
watch(chatList, () => {
    nextTick(() => {
        handleScroll(); // Ensure scroll after DOM update
    });
}, { deep: true, immediate: true });
const __VLS_exposed = {
    setScrollBottom,
    loading,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    applicationDetails: () => ({}),
    available: true,
    type: 'ai-chat',
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "aiChatRef",
    ...{ class: "ai-chat" },
    ...{ class: (__VLS_ctx.type) },
    ...{ style: ({
            height: __VLS_ctx.firsUserInput ? '100%' : undefined,
        }) },
});
/** @type {__VLS_StyleScopedClasses['ai-chat']} */ ;
if (__VLS_ctx.showUserInputContent && __VLS_ctx.firsUserInput) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "firstUserInput" },
    });
    /** @type {__VLS_StyleScopedClasses['firstUserInput']} */ ;
    const __VLS_0 = UserForm;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
        api_form_data: (__VLS_ctx.api_form_data),
        form_data: (__VLS_ctx.form_data),
        excludeFields: (__VLS_ctx.inlineExposedFields),
        title: (__VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
            __VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
                ?.user_input_config?.title),
        application: (__VLS_ctx.applicationDetails),
        type: (__VLS_ctx.type),
        first: (__VLS_ctx.firsUserInput),
        ref: "userFormRef",
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
        api_form_data: (__VLS_ctx.api_form_data),
        form_data: (__VLS_ctx.form_data),
        excludeFields: (__VLS_ctx.inlineExposedFields),
        title: (__VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
            __VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
                ?.user_input_config?.title),
        application: (__VLS_ctx.applicationDetails),
        type: (__VLS_ctx.type),
        first: (__VLS_ctx.firsUserInput),
        ref: "userFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = {
        /** @type {typeof __VLS_5.confirm} */
        onConfirm: (__VLS_ctx.UserFormConfirm),
    };
    const __VLS_7 = {
        /** @type {typeof __VLS_5.cancel} */
        onCancel: (__VLS_ctx.UserFormCancel),
    };
    var __VLS_8;
    var __VLS_3;
    var __VLS_4;
}
if (!__VLS_ctx.firsUserInput && __VLS_ctx.isNarrow) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "popperUserInput" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showUserInputContent) }, null, null);
    /** @type {__VLS_StyleScopedClasses['popperUserInput']} */ ;
    const __VLS_10 = UserForm;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
        api_form_data: (__VLS_ctx.api_form_data),
        form_data: (__VLS_ctx.form_data),
        excludeFields: (__VLS_ctx.inlineExposedFields),
        title: (__VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
            __VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
                ?.user_input_config?.title),
        application: (__VLS_ctx.applicationDetails),
        type: (__VLS_ctx.type),
        first: (__VLS_ctx.firsUserInput),
        ref: "userFormRef",
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
        api_form_data: (__VLS_ctx.api_form_data),
        form_data: (__VLS_ctx.form_data),
        excludeFields: (__VLS_ctx.inlineExposedFields),
        title: (__VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
            __VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
                ?.user_input_config?.title),
        application: (__VLS_ctx.applicationDetails),
        type: (__VLS_ctx.type),
        first: (__VLS_ctx.firsUserInput),
        ref: "userFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_15;
    const __VLS_16 = {
        /** @type {typeof __VLS_15.confirm} */
        onConfirm: (__VLS_ctx.UserFormConfirm),
    };
    const __VLS_17 = {
        /** @type {typeof __VLS_15.cancel} */
        onCancel: (__VLS_ctx.UserFormCancel),
    };
    var __VLS_18;
    var __VLS_13;
    var __VLS_14;
}
if (!__VLS_ctx.firsUserInput && !__VLS_ctx.isNarrow) {
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
    elPopover;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        ...{ 'onUpdate:visible': {} },
        visible: (__VLS_ctx.showUserInput),
        virtualRef: (__VLS_ctx.triggerEl),
        virtualTriggering: true,
        trigger: "manual",
        placement: "top-start",
        width: (400),
        showArrow: (false),
        popperClass: "bare-popper",
        popperOptions: ({
            modifiers: [{ name: 'offset', options: { offset: [-24, -8] } }],
        }),
        popperStyle: ({
            background: 'transparent',
            border: 'none',
            padding: '0',
            boxShadow: 'none',
        }),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onUpdate:visible': {} },
        visible: (__VLS_ctx.showUserInput),
        virtualRef: (__VLS_ctx.triggerEl),
        virtualTriggering: true,
        trigger: "manual",
        placement: "top-start",
        width: (400),
        showArrow: (false),
        popperClass: "bare-popper",
        popperOptions: ({
            modifiers: [{ name: 'offset', options: { offset: [-24, -8] } }],
        }),
        popperStyle: ({
            background: 'transparent',
            border: 'none',
            padding: '0',
            boxShadow: 'none',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_25;
    const __VLS_26 = {
        /** @type {typeof __VLS_25.'update:visible'} */
        'onUpdate:visible': ((v) => {
            if (v)
                __VLS_ctx.showUserInput = true;
        }),
    };
    const { default: __VLS_27 } = __VLS_23.slots;
    const __VLS_28 = UserForm;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
        api_form_data: (__VLS_ctx.api_form_data),
        form_data: (__VLS_ctx.form_data),
        excludeFields: (__VLS_ctx.inlineExposedFields),
        title: (__VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
            __VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
                ?.user_input_config?.title),
        application: (__VLS_ctx.applicationDetails),
        type: (__VLS_ctx.type),
        first: (__VLS_ctx.firsUserInput),
        ref: "userFormRef",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onConfirm': {} },
        ...{ 'onCancel': {} },
        api_form_data: (__VLS_ctx.api_form_data),
        form_data: (__VLS_ctx.form_data),
        excludeFields: (__VLS_ctx.inlineExposedFields),
        title: (__VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
            __VLS_ctx.applicationDetails?.work_flow?.nodes?.find((v) => v.id === 'base-node')?.properties
                ?.user_input_config?.title),
        application: (__VLS_ctx.applicationDetails),
        type: (__VLS_ctx.type),
        first: (__VLS_ctx.firsUserInput),
        ref: "userFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_33;
    const __VLS_34 = {
        /** @type {typeof __VLS_33.confirm} */
        onConfirm: (__VLS_ctx.UserFormConfirm),
    };
    const __VLS_35 = {
        /** @type {typeof __VLS_33.cancel} */
        onCancel: (__VLS_ctx.UserFormCancel),
    };
    var __VLS_36;
    var __VLS_31;
    var __VLS_32;
    // @ts-ignore
    [type, type, type, type, firsUserInput, firsUserInput, firsUserInput, firsUserInput, firsUserInput, firsUserInput, firsUserInput, showUserInputContent, showUserInputContent, api_form_data, api_form_data, api_form_data, form_data, form_data, form_data, inlineExposedFields, inlineExposedFields, inlineExposedFields, applicationDetails, applicationDetails, applicationDetails, applicationDetails, applicationDetails, applicationDetails, applicationDetails, applicationDetails, applicationDetails, UserFormConfirm, UserFormConfirm, UserFormConfirm, UserFormCancel, UserFormCancel, UserFormCancel, isNarrow, isNarrow, showUserInput, showUserInput, triggerEl,];
    var __VLS_23;
    var __VLS_24;
}
if (!(__VLS_ctx.isUserInput || __VLS_ctx.isAPIInput) || !__VLS_ctx.firsUserInput || __VLS_ctx.type === 'log') {
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        ...{ 'onScroll': {} },
        ref: "scrollDiv",
    }));
    const __VLS_40 = __VLS_39({
        ...{ 'onScroll': {} },
        ref: "scrollDiv",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    const __VLS_44 = {
        /** @type {typeof __VLS_43.scroll} */
        onScroll: (__VLS_ctx.handleScrollTop),
    };
    var __VLS_45;
    const { default: __VLS_47 } = __VLS_41.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ref: "dialogScrollbar",
        ...{ class: "ai-chat__content p-16" },
        id: "chatListId",
        ...{ style: ({ marginBottom: __VLS_ctx.selection ? '65px' : '' }) },
    });
    /** @type {__VLS_StyleScopedClasses['ai-chat__content']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-16']} */ ;
    if (!__VLS_ctx.selection) {
        const __VLS_48 = PrologueContent || PrologueContent;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            type: (__VLS_ctx.type),
            application: (__VLS_ctx.applicationDetails),
            available: (__VLS_ctx.available),
            sendMessage: (__VLS_ctx.sendMessage),
        }));
        const __VLS_50 = __VLS_49({
            type: (__VLS_ctx.type),
            application: (__VLS_ctx.applicationDetails),
            available: (__VLS_ctx.available),
            sendMessage: (__VLS_ctx.sendMessage),
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    }
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
    elCheckboxGroup;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.multipleSelectionChat),
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.multipleSelectionChat),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_58;
    const __VLS_59 = {
        /** @type {typeof __VLS_58.change} */
        onChange: (__VLS_ctx.handleCheckedChatChange),
    };
    const { default: __VLS_60 } = __VLS_56.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.chatList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        if (__VLS_ctx.selection) {
            let __VLS_61;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
            elCheckbox;
            // @ts-ignore
            const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
                value: (item.record_id),
            }));
            const __VLS_63 = __VLS_62({
                value: (item.record_id),
            }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(!(__VLS_ctx.isUserInput || __VLS_ctx.isAPIInput) || !__VLS_ctx.firsUserInput || __VLS_ctx.type === 'log'))
                        throw 0;
                    return __VLS_ctx.toggleSelect(item.record_id);
                    // @ts-ignore
                    [type, type, firsUserInput, applicationDetails, isUserInput, isAPIInput, handleScrollTop, selection, selection, selection, available, sendMessage, multipleSelectionChat, handleCheckedChatChange, chatList, toggleSelect,];
                } },
            ...{ class: "w-full border-r-8" },
            ...{ class: ([
                    __VLS_ctx.selection ? 'p-12 mt-8 mb-8 cursor' : 'mt-24',
                    __VLS_ctx.multipleSelectionChat.includes(item.record_id) ? 'is-selected' : '',
                ]) },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
        const __VLS_66 = QuestionContent || QuestionContent;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
            chatManagement: (__VLS_ctx.ChatManagement),
            type: (__VLS_ctx.type),
            application: (__VLS_ctx.applicationDetails),
            sendMessage: (__VLS_ctx.sendMessage),
            chatRecord: (item),
            isLast: (index >= __VLS_ctx.chatList.length - 1),
            selection: (__VLS_ctx.selection),
        }));
        const __VLS_68 = __VLS_67({
            chatManagement: (__VLS_ctx.ChatManagement),
            type: (__VLS_ctx.type),
            application: (__VLS_ctx.applicationDetails),
            sendMessage: (__VLS_ctx.sendMessage),
            chatRecord: (item),
            isLast: (index >= __VLS_ctx.chatList.length - 1),
            selection: (__VLS_ctx.selection),
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        if (__VLS_ctx.selection) {
            let __VLS_71;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
            elCheckbox;
            // @ts-ignore
            const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
                value: (item.record_id),
            }));
            const __VLS_73 = __VLS_72({
                value: (item.record_id),
            }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(!(__VLS_ctx.isUserInput || __VLS_ctx.isAPIInput) || !__VLS_ctx.firsUserInput || __VLS_ctx.type === 'log'))
                        throw 0;
                    return __VLS_ctx.toggleSelect(item.record_id);
                    // @ts-ignore
                    [type, applicationDetails, selection, selection, selection, sendMessage, multipleSelectionChat, chatList, toggleSelect, ChatManagement,];
                } },
            ...{ class: "w-full border-r-8" },
            ...{ class: ([
                    __VLS_ctx.selection ? 'p-12 cursor' : '',
                    __VLS_ctx.multipleSelectionChat.includes(item.record_id) ? 'is-selected' : '',
                ]) },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
        const __VLS_76 = AnswerContent || AnswerContent;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
            ...{ 'onOpenExecutionDetail': {} },
            ...{ 'onOpenParagraph': {} },
            ...{ 'onOpenParagraphDocument': {} },
            application: (__VLS_ctx.applicationDetails),
            loading: (__VLS_ctx.currentChatGenerating),
            chatRecord: (__VLS_ctx.chatList[index]),
            type: (__VLS_ctx.type),
            sendMessage: (__VLS_ctx.sendMessage),
            chatManagement: (__VLS_ctx.ChatManagement),
            executionIsRightPanel: (props.executionIsRightPanel),
            selection: (__VLS_ctx.selection),
        }));
        const __VLS_78 = __VLS_77({
            ...{ 'onOpenExecutionDetail': {} },
            ...{ 'onOpenParagraph': {} },
            ...{ 'onOpenParagraphDocument': {} },
            application: (__VLS_ctx.applicationDetails),
            loading: (__VLS_ctx.currentChatGenerating),
            chatRecord: (__VLS_ctx.chatList[index]),
            type: (__VLS_ctx.type),
            sendMessage: (__VLS_ctx.sendMessage),
            chatManagement: (__VLS_ctx.ChatManagement),
            executionIsRightPanel: (props.executionIsRightPanel),
            selection: (__VLS_ctx.selection),
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        let __VLS_81;
        const __VLS_82 = {
            /** @type {typeof __VLS_81.openExecutionDetail} */
            onOpenExecutionDetail: (...[$event]) => {
                if (!(!(__VLS_ctx.isUserInput || __VLS_ctx.isAPIInput) || !__VLS_ctx.firsUserInput || __VLS_ctx.type === 'log'))
                    throw 0;
                return __VLS_ctx.emit('openExecutionDetail', __VLS_ctx.chatList[index]);
                // @ts-ignore
                [type, applicationDetails, selection, selection, sendMessage, multipleSelectionChat, chatList, chatList, ChatManagement, currentChatGenerating, emit,];
            },
        };
        const __VLS_83 = {
            /** @type {typeof __VLS_81.openParagraph} */
            onOpenParagraph: (...[$event]) => {
                if (!(!(__VLS_ctx.isUserInput || __VLS_ctx.isAPIInput) || !__VLS_ctx.firsUserInput || __VLS_ctx.type === 'log'))
                    throw 0;
                return __VLS_ctx.emit('openParagraph', __VLS_ctx.chatList[index]);
                // @ts-ignore
                [chatList, emit,];
            },
        };
        const __VLS_84 = {
            /** @type {typeof __VLS_81.openParagraphDocument} */
            onOpenParagraphDocument: ((val) => __VLS_ctx.emit('openParagraphDocument', __VLS_ctx.chatList[index], val)),
        };
        var __VLS_79;
        var __VLS_80;
        // @ts-ignore
        [chatList, emit,];
    }
    // @ts-ignore
    [];
    var __VLS_56;
    var __VLS_57;
    if (__VLS_ctx.transcribing) {
        const __VLS_85 = TransitionContent || TransitionContent;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            text: (__VLS_ctx.t('aiChat.inputPlaceholder.recorderLoading')),
            type: (__VLS_ctx.type),
            application: (__VLS_ctx.applicationDetails),
        }));
        const __VLS_87 = __VLS_86({
            text: (__VLS_ctx.t('aiChat.inputPlaceholder.recorderLoading')),
            type: (__VLS_ctx.type),
            application: (__VLS_ctx.applicationDetails),
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    }
    // @ts-ignore
    [type, applicationDetails, transcribing, t,];
    var __VLS_41;
    var __VLS_42;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    if (__VLS_ctx.isBottom) {
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
            ...{ 'onClick': {} },
            circle: true,
            ...{ class: "back-bottom-button" },
        }));
        const __VLS_92 = __VLS_91({
            ...{ 'onClick': {} },
            circle: true,
            ...{ class: "back-bottom-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        let __VLS_95;
        const __VLS_96 = {
            /** @type {typeof __VLS_95.click} */
            onClick: (__VLS_ctx.setScrollBottom),
        };
        /** @type {__VLS_StyleScopedClasses['back-bottom-button']} */ ;
        const { default: __VLS_97 } = __VLS_93.slots;
        let __VLS_98;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({}));
        const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
        const { default: __VLS_103 } = __VLS_101.slots;
        let __VLS_104;
        /** @ts-ignore @type { | typeof __VLS_components.ArrowDownBold} */
        ArrowDownBold;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({}));
        const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
        // @ts-ignore
        [isBottom, setScrollBottom,];
        var __VLS_101;
        // @ts-ignore
        [];
        var __VLS_93;
        var __VLS_94;
    }
    if (__VLS_ctx.selection === true) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mul-operation border-t w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['mul-operation']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between chat-width" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['chat-width']} */ ;
        let __VLS_109;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.checkAll),
        }));
        const __VLS_111 = __VLS_110({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.checkAll),
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        let __VLS_114;
        const __VLS_115 = {
            /** @type {typeof __VLS_114.change} */
            onChange: (__VLS_ctx.handleCheckAllChange),
        };
        const { default: __VLS_116 } = __VLS_112.slots;
        (__VLS_ctx.$t('common.allCheck'));
        // @ts-ignore
        [selection, checkAll, handleCheckAllChange, $t,];
        var __VLS_112;
        var __VLS_113;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        let __VLS_117;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            ...{ 'onClick': {} },
        }));
        const __VLS_119 = __VLS_118({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        let __VLS_122;
        const __VLS_123 = {
            /** @type {typeof __VLS_122.click} */
            onClick: (__VLS_ctx.cancelCheckHandle),
        };
        const { default: __VLS_124 } = __VLS_120.slots;
        (__VLS_ctx.$t('common.cancel'));
        // @ts-ignore
        [$t, cancelCheckHandle,];
        var __VLS_120;
        var __VLS_121;
        let __VLS_125;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.shareLoading || __VLS_ctx.multipleSelectionChat.length === 0),
        }));
        const __VLS_127 = __VLS_126({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.shareLoading || __VLS_ctx.multipleSelectionChat.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        let __VLS_130;
        const __VLS_131 = {
            /** @type {typeof __VLS_130.click} */
            onClick: (__VLS_ctx.shareChatHandle),
        };
        const { default: __VLS_132 } = __VLS_128.slots;
        (__VLS_ctx.$t('aiChat.copyLinkText'));
        // @ts-ignore
        [multipleSelectionChat, $t, shareLoading, shareChatHandle,];
        var __VLS_128;
        var __VLS_129;
    }
    else if (__VLS_ctx.type !== 'log' && __VLS_ctx.type !== 'share') {
        const __VLS_133 = ChatInputOperate || ChatInputOperate;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
            appId: (__VLS_ctx.appId),
            applicationDetails: (__VLS_ctx.applicationDetails),
            isMobile: (__VLS_ctx.isMobile),
            type: (__VLS_ctx.type),
            sendMessage: (__VLS_ctx.sendMessage),
            openChatId: (__VLS_ctx.openChatId),
            validate: (__VLS_ctx.validate),
            chatManagement: (__VLS_ctx.ChatManagement),
            chatId: (__VLS_ctx.chartOpenId),
            loading: (__VLS_ctx.currentChatGenerating),
            showUserInput: (__VLS_ctx.showUserInput),
        }));
        const __VLS_135 = __VLS_134({
            appId: (__VLS_ctx.appId),
            applicationDetails: (__VLS_ctx.applicationDetails),
            isMobile: (__VLS_ctx.isMobile),
            type: (__VLS_ctx.type),
            sendMessage: (__VLS_ctx.sendMessage),
            openChatId: (__VLS_ctx.openChatId),
            validate: (__VLS_ctx.validate),
            chatManagement: (__VLS_ctx.ChatManagement),
            chatId: (__VLS_ctx.chartOpenId),
            loading: (__VLS_ctx.currentChatGenerating),
            showUserInput: (__VLS_ctx.showUserInput),
        }, ...__VLS_functionalComponentArgsRest(__VLS_134));
        const { default: __VLS_138 } = __VLS_136.slots;
        {
            const { inlineParams: __VLS_139 } = __VLS_136.slots;
            const __VLS_140 = InlineParams || InlineParams;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
                ...{ 'onOpenDialog': {} },
                ref: "inlineParamsRef",
                application: (__VLS_ctx.applicationDetails),
                maxExposed: (__VLS_ctx.maxExposed),
                formData: (__VLS_ctx.form_data),
                apiInput: (__VLS_ctx.isAPIInput),
            }));
            const __VLS_142 = __VLS_141({
                ...{ 'onOpenDialog': {} },
                ref: "inlineParamsRef",
                application: (__VLS_ctx.applicationDetails),
                maxExposed: (__VLS_ctx.maxExposed),
                formData: (__VLS_ctx.form_data),
                apiInput: (__VLS_ctx.isAPIInput),
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            let __VLS_145;
            const __VLS_146 = {
                /** @type {typeof __VLS_145.openDialog} */
                onOpenDialog: (__VLS_ctx.handleOpenDialog),
            };
            var __VLS_147;
            var __VLS_143;
            var __VLS_144;
            // @ts-ignore
            [type, type, type, form_data, applicationDetails, applicationDetails, showUserInput, isAPIInput, sendMessage, ChatManagement, currentChatGenerating, appId, isMobile, openChatId, validate, chartOpenId, maxExposed, handleOpenDialog,];
        }
        // @ts-ignore
        [];
        var __VLS_136;
    }
    const __VLS_149 = Control || Control;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({}));
    const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
}
// @ts-ignore
var __VLS_9 = __VLS_8, __VLS_19 = __VLS_18, __VLS_37 = __VLS_36, __VLS_46 = __VLS_45, __VLS_148 = __VLS_147;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
