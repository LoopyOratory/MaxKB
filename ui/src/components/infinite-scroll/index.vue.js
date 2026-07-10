/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
defineOptions({ name: 'InfiniteScroll' });
const props = defineProps({
    /**
     * ObjectCount
     */
    size: {
        type: Number,
        default: 0,
    },
    /**
     * Total
     */
    total: {
        type: Number,
        default: 0,
    },
    /**
     * Total
     */
    page_size: {
        type: Number,
        default: 0,
    },
    current_page: {
        type: Number,
        default: 0,
    },
    loading: Boolean,
});
const emit = defineEmits(['update:current_page', 'load']);
const current = ref(props.current_page);
watch(() => props.current_page, (val) => {
    if (val === 1) {
        current.value = 1;
    }
});
const noMore = computed(() => props.size > 0 && props.size === props.total && props.total > props.page_size && !props.loading);
const disabledScroll = computed(() => props.size > 0 && (props.loading || noMore.value));
function loadData() {
    if (props.total > props.page_size) {
        current.value += 1;
        emit('update:current_page', current.value);
        emit('load');
    }
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
/** @type {__VLS_StyleScopedClasses['text-with-lines']} */ ;
/** @type {__VLS_StyleScopedClasses['text-with-lines']} */ ;
/** @type {__VLS_StyleScopedClasses['text-with-lines']} */ ;
/** @type {__VLS_StyleScopedClasses['text-with-lines']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    'infinite-scroll-disabled': (__VLS_ctx.disabledScroll),
});
__VLS_asFunctionalDirective(__VLS_directives.vInfiniteScroll, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loadData) }, null, null);
var __VLS_0 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
    ...{ class: "text-center lighter color-secondary" },
});
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
if (__VLS_ctx.size > 0 && __VLS_ctx.loading) {
    let __VLS_2;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent1(__VLS_2, new __VLS_2({
        ...{ class: "text-with-lines" },
        type: "info",
    }));
    const __VLS_4 = __VLS_3({
        ...{ class: "text-with-lines" },
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    /** @type {__VLS_StyleScopedClasses['text-with-lines']} */ ;
    const { default: __VLS_7 } = __VLS_5.slots;
    (__VLS_ctx.$t('components.loading'));
    // @ts-ignore
    [disabledScroll, vInfiniteScroll, loadData, size, loading, $t,];
    var __VLS_5;
}
if (__VLS_ctx.noMore) {
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ class: "text-with-lines" },
        type: "info",
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "text-with-lines" },
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    /** @type {__VLS_StyleScopedClasses['text-with-lines']} */ ;
    const { default: __VLS_13 } = __VLS_11.slots;
    (__VLS_ctx.$t('components.noMore'));
    // @ts-ignore
    [$t, noMore,];
    var __VLS_11;
}
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
    props: {
        /**
         * ObjectCount
         */
        size: {
            type: Number,
            default: 0,
        },
        /**
         * Total
         */
        total: {
            type: Number,
            default: 0,
        },
        /**
         * Total
         */
        page_size: {
            type: Number,
            default: 0,
        },
        current_page: {
            type: Number,
            default: 0,
        },
        loading: Boolean,
    },
});
const __VLS_export = {};
export default {};
