/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const AiChatRef = ref();
const props = withDefaults(defineProps(), {});
const emit = defineEmits(['update:chatId', 'update:currentAbstract', 'refresh']);
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const loading = ref(false);
const visible = ref(false);
const recordList = ref([]);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
function closeHandle() {
    recordList.value = [];
    paginationConfig.total = 0;
    paginationConfig.current_page = 1;
}
function getChatRecord() {
    return loadSharedApi({ type: 'chatLog', systemType: apiType.value })
        .getChatRecordLog(id, props.chatId, paginationConfig, loading)
        .then((res) => {
        paginationConfig.total = res.data.total;
        const list = res.data.records;
        recordList.value = [...list, ...recordList.value].sort((a, b) => a.create_time.localeCompare(b.create_time));
        if (paginationConfig.current_page === 1) {
            nextTick(() => {
                // Scroll to the bottom
                AiChatRef.value.setScrollBottom();
            });
        }
    });
}
watch(() => props.chatId, () => {
    recordList.value = [];
    paginationConfig.total = 0;
    paginationConfig.current_page = 1;
    if (props.chatId) {
        getChatRecord();
    }
});
watch(visible, (bool) => {
    if (!bool) {
        emit('update:chatId', '');
        emit('update:currentAbstract', '');
        emit('refresh');
    }
});
function handleScroll(event) {
    if (props.chatId !== 'new' &&
        event.scrollTop === 0 &&
        paginationConfig.total > recordList.value.length) {
        const history_height = event.dialogScrollbar.offsetHeight;
        paginationConfig.current_page += 1;
        getChatRecord().then(() => {
            event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height);
        });
    }
}
const open = () => {
    visible.value = true;
};
const __VLS_exposed = {
    open,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {};
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
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    ...{ class: "chat-record-drawer" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    ...{ class: "chat-record-drawer" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.close} */
    onClose: (__VLS_ctx.closeHandle),
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['chat-record-drawer']} */ ;
const { default: __VLS_8 } = __VLS_3.slots;
{
    const { header: __VLS_9 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "single-line" },
    });
    /** @type {__VLS_StyleScopedClasses['single-line']} */ ;
    (__VLS_ctx.currentAbstract);
    // @ts-ignore
    [visible, closeHandle, currentAbstract,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "h-full" },
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.paginationConfig.current_page === 1 && __VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.AiChat | typeof __VLS_components.AiChat} */
AiChat;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    ...{ 'onScroll': {} },
    ref: "AiChatRef",
    applicationDetails: (__VLS_ctx.application),
    type: "log",
    record: (__VLS_ctx.recordList),
}));
const __VLS_12 = __VLS_11({
    ...{ 'onScroll': {} },
    ref: "AiChatRef",
    applicationDetails: (__VLS_ctx.application),
    type: "log",
    record: (__VLS_ctx.recordList),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
let __VLS_15;
const __VLS_16 = {
    /** @type {typeof __VLS_15.scroll} */
    onScroll: (__VLS_ctx.handleScroll),
};
var __VLS_17;
var __VLS_13;
var __VLS_14;
{
    const { footer: __VLS_19 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_25;
    const __VLS_26 = {
        /** @type {typeof __VLS_25.click} */
        onClick: (__VLS_ctx.pre),
    };
    const { default: __VLS_27 } = __VLS_23.slots;
    (__VLS_ctx.$t('common.pages.prev'));
    // @ts-ignore
    [vLoading, paginationConfig, loading, loading, application, recordList, handleScroll, pre_disable, pre, $t,];
    var __VLS_23;
    var __VLS_24;
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_33;
    const __VLS_34 = {
        /** @type {typeof __VLS_33.click} */
        onClick: (__VLS_ctx.next),
    };
    const { default: __VLS_35 } = __VLS_31.slots;
    (__VLS_ctx.$t('common.pages.next'));
    // @ts-ignore
    [loading, $t, next_disable, next,];
    var __VLS_31;
    var __VLS_32;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_18 = __VLS_17;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
