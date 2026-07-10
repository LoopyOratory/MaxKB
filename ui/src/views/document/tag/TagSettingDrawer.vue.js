/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import AddTagDialog from '@/views/document/tag/MulAddTagDialog.vue';
const emit = defineEmits(['refresh']);
const route = useRoute();
const { params: { id, folderId }, // id is knowledgeID
 } = route;
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const isShared = computed(() => {
    return folderId === 'share';
});
const document_id = ref('');
const loading = ref(false);
const debugVisible = ref(false);
const filterText = ref('');
const tags = ref([]);
// Transform original data into table data
const tableData = computed(() => {
    const result = [];
    tags.value.forEach((tag) => {
        if (tag.values && tag.values.length > 0) {
            tag.values.forEach((value, index) => {
                result.push({
                    id: value.id,
                    key: tag.key,
                    value: value.value,
                    keyIndex: index, // Used forDetermineIsFirst row
                });
            });
        }
    });
    return result;
});
// MergeCellMethod
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 0 || columnIndex === 1) {
        // Key column (due to added select column, index becomes 1)
        if (row.keyIndex === 0) {
            // CalculateCurrentkeyHas multipleFewValue
            const sameKeyCount = tableData.value.filter((item) => item.key === row.key).length;
            return {
                rowspan: sameKeyCount,
                colspan: 1,
            };
        }
        else {
            return {
                rowspan: 0,
                colspan: 0,
            };
        }
    }
};
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
};
function batchDelete() {
    const tagsToDelete = multipleSelection.value.reduce((acc, item) => {
        // FindCurrentSelectItemkeyCorrespondingAllvalue id
        const sameKeyItems = tableData.value.filter((data) => data.key === item.key);
        const sameKeyIds = sameKeyItems.map((data) => data.id);
        return [...acc, ...sameKeyIds];
    }, []);
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .delMulDocumentTag(id, document_id.value, tagsToDelete, loading)
        .then(() => {
        getList();
        emit('refresh');
    });
}
function delTagValue(row) {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .delMulDocumentTag(id, document_id.value, [row.id], loading)
        .then(() => {
        getList();
        emit('refresh');
    });
}
function getList() {
    const params = {
        ...(filterText.value && { name: filterText.value }),
    };
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .getDocumentTags(id, document_id.value, params, loading)
        .then((res) => {
        tags.value = res.data;
    });
}
const addTagDialogRef = ref();
function openAddTagDialog() {
    addTagDialogRef.value?.open();
}
function addTags(tags) {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .postDocumentTags(id, document_id.value, tags, loading)
        .then(() => {
        addTagDialogRef.value?.close();
        getList();
        emit('refresh');
    });
}
const open = (doc) => {
    filterText.value = '';
    debugVisible.value = true;
    document_id.value = doc.id;
    getList();
};
const __VLS_exposed = {
    open,
};
defineExpose(__VLS_exposed);
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
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.document.tag.setting'));
    // @ts-ignore
    [debugVisible, $t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddTagDialog();
        // @ts-ignore
        [openAddTagDialog,];
    },
};
const { default: __VLS_14 } = __VLS_10.slots;
(__VLS_ctx.$t('views.document.tag.addTag'));
// @ts-ignore
[$t,];
var __VLS_10;
var __VLS_11;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}));
const __VLS_17 = __VLS_16({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
const __VLS_21 = {
    /** @type {typeof __VLS_20.click} */
    onClick: (__VLS_ctx.batchDelete),
};
const { default: __VLS_22 } = __VLS_18.slots;
(__VLS_ctx.$t('common.delete'));
// @ts-ignore
[$t, multipleSelection, batchDelete,];
var __VLS_18;
var __VLS_19;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
    placeholder: (__VLS_ctx.$t('common.search')),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterText),
    prefixIcon: "Search",
    ...{ class: "w-240" },
    clearable: true,
    placeholder: (__VLS_ctx.$t('common.search')),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.change} */
    onChange: (__VLS_ctx.getList),
};
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
var __VLS_26;
var __VLS_27;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    spanMethod: (__VLS_ctx.spanMethod),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    spanMethod: (__VLS_ctx.spanMethod),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_37 } = __VLS_33.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    type: "selection",
    width: "55",
}));
const __VLS_40 = __VLS_39({
    type: "selection",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    label: (__VLS_ctx.$t('views.document.tag.key')),
}));
const __VLS_45 = __VLS_44({
    label: (__VLS_ctx.$t('views.document.tag.key')),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
{
    const { default: __VLS_49 } = __VLS_46.slots;
    const [{ row }] = __VLS_vSlot(__VLS_49);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    (row.key);
    // @ts-ignore
    [$t, $t, filterText, getList, tableData, spanMethod, handleSelectionChange, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_46;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    label: (__VLS_ctx.$t('views.document.tag.value')),
    className: "border-l",
}));
const __VLS_52 = __VLS_51({
    label: (__VLS_ctx.$t('views.document.tag.value')),
    className: "border-l",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
{
    const { default: __VLS_56 } = __VLS_53.slots;
    const [{ row }] = __VLS_vSlot(__VLS_56);
    (row.value);
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_53;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "100",
    fixed: "right",
}));
const __VLS_59 = __VLS_58({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "100",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const { default: __VLS_62 } = __VLS_60.slots;
{
    const { default: __VLS_63 } = __VLS_60.slots;
    const [{ row }] = __VLS_vSlot(__VLS_63);
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
    }));
    const __VLS_66 = __VLS_65({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_72 = __VLS_71({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    let __VLS_75;
    const __VLS_76 = {
        /** @type {typeof __VLS_75.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.delTagValue(row);
            // @ts-ignore
            [$t, $t, delTagValue,];
        },
    };
    const { default: __VLS_77 } = __VLS_73.slots;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        iconName: "app-delete",
    }));
    const __VLS_80 = __VLS_79({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    // @ts-ignore
    [];
    var __VLS_73;
    var __VLS_74;
    // @ts-ignore
    [];
    var __VLS_67;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_60;
// @ts-ignore
[];
var __VLS_33;
var __VLS_34;
// @ts-ignore
[];
var __VLS_3;
const __VLS_83 = AddTagDialog;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    ...{ 'onAddTags': {} },
    ref: "addTagDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_85 = __VLS_84({
    ...{ 'onAddTags': {} },
    ref: "addTagDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
const __VLS_89 = {
    /** @type {typeof __VLS_88.addTags} */
    onAddTags: (__VLS_ctx.addTags),
};
var __VLS_90;
var __VLS_86;
var __VLS_87;
// @ts-ignore
var __VLS_91 = __VLS_90;
// @ts-ignore
[apiType, addTags,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
