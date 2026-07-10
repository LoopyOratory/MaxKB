/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive, computed } from 'vue';
defineOptions({ name: 'CommonList' });
const props = withDefaults(defineProps(), {
    data: () => [],
    defaultActive: '',
    valueKey: 'id',
});
const current = ref(0);
watch(() => props.defaultActive, (val) => {
    current.value = val;
}, { immediate: true });
const emit = defineEmits(['click', 'mouseenter', 'mouseleave']);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 50,
    total: 0,
});
// Frontend pagination scroll load: data is full data, only render first current_page * page_size items, append on scroll to bottom
const renderList = computed(() => props.data.slice(0, paginationConfig.current_page * paginationConfig.page_size));
// Data sourceOn changeResetTo the first page, avoidSwitchDataStill stays at a very largePage number
watch(() => props.data, () => {
    paginationConfig.current_page = 1;
});
function mouseenter(row) {
    emit('mouseenter', row);
}
function mouseleave() {
    emit('mouseleave');
}
function clickHandle(row, index) {
    current.value = row[props.valueKey];
    emit('click', row);
}
function clearCurrent() {
    current.value = 0;
}
const __VLS_exposed = {
    clearCurrent,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    data: () => [],
    defaultActive: '',
    valueKey: 'id',
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
    ...{ class: "common-list" },
});
/** @type {__VLS_StyleScopedClasses['common-list']} */ ;
if (__VLS_ctx.data.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
    InfiniteScroll;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        size: (__VLS_ctx.renderList.length),
        total: (__VLS_ctx.data.length),
        page_size: (__VLS_ctx.paginationConfig.page_size),
        current_page: (__VLS_ctx.paginationConfig.current_page),
    }));
    const __VLS_2 = __VLS_1({
        size: (__VLS_ctx.renderList.length),
        total: (__VLS_ctx.data.length),
        page_size: (__VLS_ctx.paginationConfig.page_size),
        current_page: (__VLS_ctx.paginationConfig.current_page),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.renderList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (item[props.valueKey] ?? index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.data.length > 0))
                        throw 0;
                    return __VLS_ctx.clickHandle(item, index);
                    // @ts-ignore
                    [data, data, renderList, renderList, paginationConfig, paginationConfig, clickHandle,];
                } },
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.data.length > 0))
                        throw 0;
                    return __VLS_ctx.mouseenter(item);
                    // @ts-ignore
                    [mouseenter,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.data.length > 0))
                        throw 0;
                    return __VLS_ctx.mouseleave();
                    // @ts-ignore
                    [mouseleave,];
                } },
            ...{ class: (__VLS_ctx.current === item[props.valueKey] ? 'active color-primary-1' : '') },
            ...{ class: "cursor" },
        });
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        var __VLS_6 = {
            row: (item),
            index: (index),
        };
        // @ts-ignore
        [current,];
    }
    // @ts-ignore
    [];
    var __VLS_3;
}
else {
    var __VLS_8 = {};
    let __VLS_10;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_12 = __VLS_11({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
}
// @ts-ignore
var __VLS_7 = __VLS_6, __VLS_9 = __VLS_8;
// @ts-ignore
[$t,];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
