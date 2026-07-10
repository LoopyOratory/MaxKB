/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import { default as vElTableInfiniteScroll } from 'el-table-infinite-scroll';
defineOptions({ name: 'AppTableInfiniteScroll' });
const props = defineProps({
    paginationConfig: {
        type: Object,
        required: true,
        default: () => ({
            current_page: 1,
            page_size: 50,
            total: 0,
        }),
    }, // option: { current_page , page_size, total  }
    maxTableHeight: {
        type: Number,
        default: 300,
    },
});
const emit = defineEmits(['changePage']);
const appTableRef = ref();
const tableHeight = ref('');
const disabled = ref(false);
const load = () => {
    if (disabled.value)
        return;
    // props.paginationConfig.current_page++;
    if (props.paginationConfig.current_page * props.paginationConfig.page_size <=
        props.paginationConfig.total) {
        emit('changePage');
    }
    if (props.paginationConfig.current_page * props.paginationConfig.page_size ===
        props.paginationConfig.total) {
        disabled.value = true;
    }
};
const __VLS_exposed = {};
defineExpose(__VLS_exposed);
onMounted(() => {
    tableHeight.value = window.innerHeight - props.maxTableHeight;
    window.onresize = () => {
        return (() => {
            tableHeight.value = window.innerHeight - props.maxTableHeight;
        })();
    };
});
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
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    maxHeight: (__VLS_ctx.tableHeight),
    ref: "appTableRef",
    height: (__VLS_ctx.tableHeight + 'px'),
    infiniteScrollDisabled: (__VLS_ctx.disabled),
}));
const __VLS_2 = __VLS_1({
    maxHeight: (__VLS_ctx.tableHeight),
    ref: "appTableRef",
    height: (__VLS_ctx.tableHeight + 'px'),
    infiniteScrollDisabled: (__VLS_ctx.disabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
__VLS_asFunctionalDirective(__VLS_directives.vElTableInfiniteScroll, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.load) }, null, null);
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
var __VLS_8 = {};
// @ts-ignore
[tableHeight, tableHeight, disabled, $attrs, vElTableInfiniteScroll, load,];
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5, __VLS_9 = __VLS_8;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        paginationConfig: {
            type: Object,
            required: true,
            default: () => ({
                current_page: 1,
                page_size: 50,
                total: 0,
            }),
        }, // option: { current_page , page_size, total  }
        maxTableHeight: {
            type: Number,
            default: 300,
        },
    },
});
const __VLS_export = {};
export default {};
