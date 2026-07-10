/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { set, cloneDeep } from 'lodash';
import Sortable from 'sortablejs';
import ApiFieldFormDialog from './ApiFieldFormDialog.vue';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
const props = defineProps();
const tableRef = ref();
const currentIndex = ref(null);
const ApiFieldFormDialogRef = ref();
const inputFieldList = ref([]);
function openAddDialog(data, index) {
    if (typeof index !== 'undefined') {
        currentIndex.value = index;
    }
    ApiFieldFormDialogRef.value.open(data);
}
function deleteField(index) {
    inputFieldList.value.splice(index, 1);
    props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
    onDragHandle();
}
function refreshFieldList(data) {
    for (let i = 0; i < inputFieldList.value.length; i++) {
        if (inputFieldList.value[i].variable === data.variable && currentIndex.value !== i) {
            MsgError(t('workflow.tip.paramErrorMessage') + data.variable);
            return;
        }
    }
    // Check for duplicates in the other list
    const arr = props.nodeModel.properties.user_input_field_list;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].field === data.variable) {
            MsgError(t('workflow.tip.paramErrorMessage') + data.variable);
            return;
        }
    }
    if (currentIndex.value !== null) {
        inputFieldList.value.splice(currentIndex.value, 1, data);
    }
    else {
        inputFieldList.value.push(data);
    }
    currentIndex.value = null;
    ApiFieldFormDialogRef.value.close();
    props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
    onDragHandle();
}
// Table sort drag
function onDragHandle() {
    if (!tableRef.value)
        return;
    // Get table tbody DOM element
    const wrapper = tableRef.value.$el;
    const tbody = wrapper.querySelector('.api-input-field-table .el-table__body-wrapper tbody');
    if (!tbody)
        return;
    // Initialize Sortable
    Sortable.create(tbody, {
        animation: 150,
        ghostClass: 'ghost-row',
        onEnd: (evt) => {
            if (evt.oldIndex === undefined || evt.newIndex === undefined)
                return;
            // Update data order
            const items = cloneDeep([...inputFieldList.value]);
            const [movedItem] = items.splice(evt.oldIndex, 1);
            items.splice(evt.newIndex, 0, movedItem);
            inputFieldList.value = items;
            props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
        },
    });
}
onMounted(() => {
    if (!props.nodeModel.properties.api_input_field_list) {
        if (props.nodeModel.properties.input_field_list) {
            props.nodeModel.properties.input_field_list
                .filter((item) => {
                return item.assignment_method === 'api_input';
            })
                .forEach((item) => {
                inputFieldList.value.push(item);
            });
        }
    }
    else {
        inputFieldList.value.push(...props.nodeModel.properties.api_input_field_list);
    }
    set(props.nodeModel.properties, 'api_input_field_list', inputFieldList);
    onDragHandle();
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
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.model.modelForm.title.apiParamPassing'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddDialog();
        // @ts-ignore
        [$t, openAddDialog,];
    },
};
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_10 = __VLS_9({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t,];
var __VLS_3;
var __VLS_4;
if (props.nodeModel.properties.api_input_field_list?.length > 0) {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        data: (props.nodeModel.properties.api_input_field_list),
        ...{ class: "mb-16 api-input-field-table" },
        ref: "tableRef",
        rowKey: "variable",
    }));
    const __VLS_15 = __VLS_14({
        data: (props.nodeModel.properties.api_input_field_list),
        ...{ class: "mb-16 api-input-field-table" },
        ref: "tableRef",
        rowKey: "variable",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    var __VLS_18;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['api-input-field-table']} */ ;
    const { default: __VLS_20 } = __VLS_16.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        prop: "variable",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    }));
    const __VLS_23 = __VLS_22({
        prop: "variable",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const { default: __VLS_26 } = __VLS_24.slots;
    {
        const { default: __VLS_27 } = __VLS_24.slots;
        const [{ row }] = __VLS_vSlot(__VLS_27);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ellipsis-1" },
            title: (row.variable),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.variable);
        // @ts-ignore
        [$t,];
    }
    // @ts-ignore
    [];
    var __VLS_24;
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        prop: "desc",
        label: (__VLS_ctx.$t('common.desc')),
    }));
    const __VLS_30 = __VLS_29({
        prop: "desc",
        label: (__VLS_ctx.$t('common.desc')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const { default: __VLS_33 } = __VLS_31.slots;
    {
        const { default: __VLS_34 } = __VLS_31.slots;
        const [{ row }] = __VLS_vSlot(__VLS_34);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ellipsis-1" },
            title: (row.desc),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.desc);
        // @ts-ignore
        [$t,];
    }
    // @ts-ignore
    [];
    var __VLS_31;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        prop: "default_value",
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    }));
    const __VLS_37 = __VLS_36({
        prop: "default_value",
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_40 } = __VLS_38.slots;
    {
        const { default: __VLS_41 } = __VLS_38.slots;
        const [{ row }] = __VLS_vSlot(__VLS_41);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ellipsis-1" },
            title: (row.default_value),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.default_value);
        // @ts-ignore
        [$t,];
    }
    // @ts-ignore
    [];
    var __VLS_38;
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        label: (__VLS_ctx.$t('common.required')),
    }));
    const __VLS_44 = __VLS_43({
        label: (__VLS_ctx.$t('common.required')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    const { default: __VLS_47 } = __VLS_45.slots;
    {
        const { default: __VLS_48 } = __VLS_45.slots;
        const [{ row }] = __VLS_vSlot(__VLS_48);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
        });
        let __VLS_49;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
            disabled: true,
            size: "small",
            modelValue: (row.is_required),
        }));
        const __VLS_51 = __VLS_50({
            disabled: true,
            size: "small",
            modelValue: (row.is_required),
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        // @ts-ignore
        [$t,];
    }
    // @ts-ignore
    [];
    var __VLS_45;
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "90",
    }));
    const __VLS_56 = __VLS_55({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    const { default: __VLS_59 } = __VLS_57.slots;
    {
        const { default: __VLS_60 } = __VLS_57.slots;
        const [{ row, $index }] = __VLS_vSlot(__VLS_60);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_61;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }));
        const __VLS_63 = __VLS_62({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        const { default: __VLS_66 } = __VLS_64.slots;
        let __VLS_67;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_69 = __VLS_68({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        let __VLS_72;
        const __VLS_73 = {
            /** @type {typeof __VLS_72.click} */
            onClick: (...[$event]) => {
                if (!(props.nodeModel.properties.api_input_field_list?.length > 0))
                    throw 0;
                return __VLS_ctx.openAddDialog(row, $index);
                // @ts-ignore
                [$t, $t, openAddDialog,];
            },
        };
        const { default: __VLS_74 } = __VLS_70.slots;
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            iconName: "app-edit",
        }));
        const __VLS_77 = __VLS_76({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        // @ts-ignore
        [];
        var __VLS_70;
        var __VLS_71;
        // @ts-ignore
        [];
        var __VLS_64;
        let __VLS_80;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }));
        const __VLS_82 = __VLS_81({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        const { default: __VLS_85 } = __VLS_83.slots;
        let __VLS_86;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_88 = __VLS_87({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_87));
        let __VLS_91;
        const __VLS_92 = {
            /** @type {typeof __VLS_91.click} */
            onClick: (...[$event]) => {
                if (!(props.nodeModel.properties.api_input_field_list?.length > 0))
                    throw 0;
                return __VLS_ctx.deleteField($index);
                // @ts-ignore
                [$t, deleteField,];
            },
        };
        const { default: __VLS_93 } = __VLS_89.slots;
        let __VLS_94;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
            iconName: "app-delete",
        }));
        const __VLS_96 = __VLS_95({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        // @ts-ignore
        [];
        var __VLS_89;
        var __VLS_90;
        // @ts-ignore
        [];
        var __VLS_83;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_57;
    // @ts-ignore
    [];
    var __VLS_16;
}
const __VLS_99 = ApiFieldFormDialog;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ 'onRefresh': {} },
    ref: "ApiFieldFormDialogRef",
}));
const __VLS_101 = __VLS_100({
    ...{ 'onRefresh': {} },
    ref: "ApiFieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
const __VLS_105 = {
    /** @type {typeof __VLS_104.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_106;
var __VLS_102;
var __VLS_103;
// @ts-ignore
var __VLS_19 = __VLS_18, __VLS_107 = __VLS_106;
// @ts-ignore
[refreshFieldList,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
