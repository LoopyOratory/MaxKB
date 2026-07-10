/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, nextTick, watch, computed, onMounted, useAttrs } from 'vue';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
defineOptions({ name: 'AppTable' });
import useStore from '@/stores';
const { common } = useStore();
const attrs = useAttrs();
const props = defineProps({
    paginationConfig: {
        type: Object,
        default: () => { },
    },
    quickCreate: {
        type: Boolean,
        default: false,
    },
    quickCreateName: {
        type: String,
        default: () => t('components.quickCreateName'),
    },
    quickCreatePlaceholder: {
        type: String,
        default: () => t('components.quickCreatePlaceholder'),
    },
    quickCreateMaxlength: {
        type: Number,
        default: () => 0,
    },
    storeKey: String,
    maxTableHeight: {
        type: Number,
        default: 300,
    },
});
const emit = defineEmits(['changePage', 'sizeChange', 'creatQuick']);
const paginationConfig = computed(() => props.paginationConfig);
const pageSizes = [10, 20, 50, 100];
const quickInputRef = ref();
const appTableRef = ref();
const loading = ref(false);
const showInput = ref(false);
const inputValue = ref('');
const tableHeight = ref('');
watch(showInput, (bool) => {
    if (!bool) {
        inputValue.value = '';
    }
});
function submitHandle() {
    if (inputValue.value) {
        loading.value = true;
        emit('creatQuick', inputValue.value);
        setTimeout(() => {
            showInput.value = false;
            loading.value = false;
        }, 200);
    }
    else {
        MsgError(`${props.quickCreateName} ${t('dynamicsForm.tip.requiredMessage')}`);
    }
}
function quickCreateHandle() {
    showInput.value = true;
    nextTick(() => {
        quickInputRef.value?.focus();
    });
}
function handleSizeChange() {
    emit('sizeChange');
    if (props.storeKey) {
        common.savePage(props.storeKey, props.paginationConfig);
    }
}
function handleCurrentChange() {
    emit('changePage');
    if (props.storeKey) {
        common.savePage(props.storeKey, props.paginationConfig);
    }
}
function clearSelection() {
    appTableRef.value?.clearSelection();
}
/* ----------------- Column widthDragPersistence ----------------- */
const COLUMN_WIDTH_PREFIX = 'app-table-column-width:';
function widthStorageKey() {
    return `${COLUMN_WIDTH_PREFIX}${props.storeKey}`;
}
function loadWidthMap() {
    try {
        return JSON.parse(localStorage.getItem(widthStorageKey()) || '{}');
    }
    catch {
        return {};
    }
}
function saveWidthMap(map) {
    try {
        localStorage.setItem(widthStorageKey(), JSON.stringify(map));
    }
    catch {
        /* ignore quota / serialization errors */
    }
}
/**
 * Stable column identifier: prefer using prop / column-key, then fall back toRenderOrder index.
 */
function getColumnKey(column, index) {
    return column?.property || column?.columnKey || `__col_${index}__`;
}
/**
 * DragEndAfter, RecordLatest of this columnWidth
 */
function handleHeaderDragend(newWidth, _oldWidth, column) {
    if (!props.storeKey || !column || !newWidth) {
        return;
    }
    const cols = appTableRef.value?.columns || [];
    const index = cols.findIndex((c) => c.id === column.id);
    const key = getColumnKey(column, index);
    const map = loadWidthMap();
    map[key] = Math.round(newWidth);
    saveWidthMap(map);
}
/**
 * After table render, apply cached column widths back
 */
function restoreColumnWidths() {
    if (!props.storeKey) {
        return;
    }
    const map = loadWidthMap();
    if (!map || !Object.keys(map).length) {
        return;
    }
    const table = appTableRef.value;
    const cols = table?.columns || [];
    let changed = false;
    cols.forEach((column, index) => {
        const w = map[getColumnKey(column, index)];
        if (typeof w === 'number' && w > 0 && column.realWidth !== w) {
            column.width = w;
            column.realWidth = w;
            changed = true;
        }
    });
    if (changed) {
        table?.doLayout?.();
    }
}
function toggleRowSelection(row, selected, ignoreSelectable = true) {
    appTableRef.value?.toggleRowSelection(row, selected, ignoreSelectable);
}
function getSelectionRows() {
    return appTableRef.value?.getSelectionRows();
}
const __VLS_exposed = {
    clearSelection,
    toggleRowSelection,
    getSelectionRows,
};
defineExpose(__VLS_exposed);
onMounted(() => {
    tableHeight.value = window.innerHeight - props.maxTableHeight;
    window.onresize = () => {
        return (() => {
            tableHeight.value = window.innerHeight - props.maxTableHeight;
        })();
    };
    // FirstRenderAfterRestoreCacheColumn width
    nextTick(restoreColumnWidths);
});
// DataChange (pagination / Filter / PollRefresh) will rebuild columns,Re-ApplicationCacheColumn width
watch(() => attrs.data, () => {
    nextTick(restoreColumnWidths);
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-table" },
    ...{ class: (__VLS_ctx.quickCreate ? 'table-quick-append' : '') },
});
/** @type {__VLS_StyleScopedClasses['app-table']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onHeaderDragend': {} },
    maxHeight: (__VLS_ctx.tableHeight),
    ref: "appTableRef",
    tooltipOptions: ({
        popperClass: 'max-w-350',
    }),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onHeaderDragend': {} },
    maxHeight: (__VLS_ctx.tableHeight),
    ref: "appTableRef",
    tooltipOptions: ({
        popperClass: 'max-w-350',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.headerDragend} */
    onHeaderDragend: (__VLS_ctx.handleHeaderDragend),
};
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
if (__VLS_ctx.quickCreate) {
    {
        const { append: __VLS_10 } = __VLS_3.slots;
        if (__VLS_ctx.showInput) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            let __VLS_11;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
                ...{ 'onKeydown': {} },
                ref: "quickInputRef",
                modelValue: (__VLS_ctx.inputValue),
                placeholder: (`${__VLS_ctx.$t('common.inputPlaceholder')} ${__VLS_ctx.quickCreateName}`),
                ...{ class: "w-500 mr-12" },
                autofocus: true,
                maxlength: (__VLS_ctx.quickCreateMaxlength || '-'),
                showWordLimit: (__VLS_ctx.quickCreateMaxlength ? true : false),
                clearable: true,
            }));
            const __VLS_13 = __VLS_12({
                ...{ 'onKeydown': {} },
                ref: "quickInputRef",
                modelValue: (__VLS_ctx.inputValue),
                placeholder: (`${__VLS_ctx.$t('common.inputPlaceholder')} ${__VLS_ctx.quickCreateName}`),
                ...{ class: "w-500 mr-12" },
                autofocus: true,
                maxlength: (__VLS_ctx.quickCreateMaxlength || '-'),
                showWordLimit: (__VLS_ctx.quickCreateMaxlength ? true : false),
                clearable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_12));
            let __VLS_16;
            const __VLS_17 = {
                /** @type {typeof __VLS_16.keydown} */
                onKeydown: (__VLS_ctx.submitHandle),
            };
            var __VLS_18;
            /** @type {__VLS_StyleScopedClasses['w-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
            var __VLS_14;
            var __VLS_15;
            let __VLS_20;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
                ...{ 'onClick': {} },
                type: "primary",
                disabled: (__VLS_ctx.loading),
            }));
            const __VLS_22 = __VLS_21({
                ...{ 'onClick': {} },
                type: "primary",
                disabled: (__VLS_ctx.loading),
            }, ...__VLS_functionalComponentArgsRest(__VLS_21));
            let __VLS_25;
            const __VLS_26 = {
                /** @type {typeof __VLS_25.click} */
                onClick: (__VLS_ctx.submitHandle),
            };
            const { default: __VLS_27 } = __VLS_23.slots;
            (__VLS_ctx.$t('common.create'));
            // @ts-ignore
            [quickCreate, quickCreate, tableHeight, $attrs, handleHeaderDragend, showInput, inputValue, $t, $t, quickCreateName, quickCreateMaxlength, quickCreateMaxlength, submitHandle, submitHandle, loading,];
            var __VLS_23;
            var __VLS_24;
            let __VLS_28;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
                ...{ 'onClick': {} },
                disabled: (__VLS_ctx.loading),
            }));
            const __VLS_30 = __VLS_29({
                ...{ 'onClick': {} },
                disabled: (__VLS_ctx.loading),
            }, ...__VLS_functionalComponentArgsRest(__VLS_29));
            let __VLS_33;
            const __VLS_34 = {
                /** @type {typeof __VLS_33.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.quickCreate))
                        throw 0;
                    if (!(__VLS_ctx.showInput))
                        throw 0;
                    return __VLS_ctx.showInput = false;
                    // @ts-ignore
                    [showInput, loading,];
                },
            };
            const { default: __VLS_35 } = __VLS_31.slots;
            (__VLS_ctx.$t('common.cancel'));
            // @ts-ignore
            [$t,];
            var __VLS_31;
            var __VLS_32;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (__VLS_ctx.quickCreateHandle) },
                ...{ class: "w-full" },
            });
            /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
            let __VLS_36;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
                type: "primary",
                link: true,
                ...{ class: "quich-button" },
            }));
            const __VLS_38 = __VLS_37({
                type: "primary",
                link: true,
                ...{ class: "quich-button" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            /** @type {__VLS_StyleScopedClasses['quich-button']} */ ;
            const { default: __VLS_41 } = __VLS_39.slots;
            let __VLS_42;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
                iconName: "app-add-outlined",
            }));
            const __VLS_44 = __VLS_43({
                iconName: "app-add-outlined",
            }, ...__VLS_functionalComponentArgsRest(__VLS_43));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-4" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            (__VLS_ctx.quickCreatePlaceholder);
            // @ts-ignore
            [quickCreateHandle, quickCreatePlaceholder,];
            var __VLS_39;
        }
        // @ts-ignore
        [];
    }
}
var __VLS_47 = {};
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
if (__VLS_ctx.$slots.pagination || __VLS_ctx.paginationConfig) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "app-table__pagination mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['app-table__pagination']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    var __VLS_49 = {};
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
    elPagination;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.paginationConfig.current_page),
        pageSize: (__VLS_ctx.paginationConfig.page_size),
        pageSizes: (__VLS_ctx.paginationConfig.page_sizes || __VLS_ctx.pageSizes),
        total: (__VLS_ctx.paginationConfig.total),
        layout: "total, prev, pager, next, sizes",
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onSizeChange': {} },
        ...{ 'onCurrentChange': {} },
        currentPage: (__VLS_ctx.paginationConfig.current_page),
        pageSize: (__VLS_ctx.paginationConfig.page_size),
        pageSizes: (__VLS_ctx.paginationConfig.page_sizes || __VLS_ctx.pageSizes),
        total: (__VLS_ctx.paginationConfig.total),
        layout: "total, prev, pager, next, sizes",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.sizeChange} */
        onSizeChange: (__VLS_ctx.handleSizeChange),
    };
    const __VLS_58 = {
        /** @type {typeof __VLS_56.currentChange} */
        onCurrentChange: (__VLS_ctx.handleCurrentChange),
    };
    var __VLS_54;
    var __VLS_55;
}
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_19 = __VLS_18, __VLS_48 = __VLS_47, __VLS_50 = __VLS_49;
// @ts-ignore
[$slots, paginationConfig, paginationConfig, paginationConfig, paginationConfig, paginationConfig, pageSizes, handleSizeChange, handleCurrentChange,];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        paginationConfig: {
            type: Object,
            default: () => { },
        },
        quickCreate: {
            type: Boolean,
            default: false,
        },
        quickCreateName: {
            type: String,
            default: () => t('components.quickCreateName'),
        },
        quickCreatePlaceholder: {
            type: String,
            default: () => t('components.quickCreatePlaceholder'),
        },
        quickCreateMaxlength: {
            type: Number,
            default: () => 0,
        },
        storeKey: String,
        maxTableHeight: {
            type: Number,
            default: 300,
        },
    },
});
const __VLS_export = {};
export default {};
