/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { t } from '@/locales';
import chatAPI from '@/api/chat/chat';
const route = useRoute();
const { params: { link }, } = route;
const currentChatName = ref(t('aiChat.createChat'));
const currentRecordList = ref([]);
function getShareChat() {
    chatAPI.getShareLink(link).then((res) => {
        if (res.data) {
            currentChatName.value = res.data.abstract;
            currentRecordList.value = res.data.chat_record_list;
        }
    });
}
onBeforeMount(() => {
    getShareChat();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-share" },
});
/** @type {__VLS_StyleScopedClasses['chat-share']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-width" },
});
/** @type {__VLS_StyleScopedClasses['chat-width']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-share__main" },
});
/** @type {__VLS_StyleScopedClasses['chat-share__main']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.AiChat | typeof __VLS_components.AiChat} */
AiChat;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ref: "AiChatRef",
    record: (__VLS_ctx.currentRecordList),
    type: "share",
}));
const __VLS_2 = __VLS_1({
    ref: "AiChatRef",
    record: (__VLS_ctx.currentRecordList),
    type: "share",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[currentChatName, currentRecordList,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
