/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { set, cloneDeep } from 'lodash';
import VariableFieldDialog from './VariableFieldDialog.vue';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
const props = defineProps();
const tableRef = ref();
const VariableFieldDialogRef = ref();
const inputFieldList = ref([]);
function openAddDialog(data, index) {
    VariableFieldDialogRef.value.open(data, index);
}
function deleteField(index) {
    inputFieldList.value.splice(index, 1);
    const fields = [
        {
            label: t('common.result'),
            value: 'result',
        },
        ...inputFieldList.value.map((item) => ({ label: item.label, value: item.field })),
    ];
    set(props.nodeModel.properties.config, 'fields', fields);
    props.nodeModel.clear_next_node_field(false);
}
function refreshFieldList(data, index) {
    for (let i = 0; i < inputFieldList.value.length; i++) {
        if (inputFieldList.value[i].field === data.field && index !== i) {
            MsgError(t('workflow.tip.paramErrorMessage') + data.field);
            return;
        }
    }
    if ([undefined, null].includes(index)) {
        inputFieldList.value.push(data);
    }
    else {
        inputFieldList.value.splice(index, 1, data);
    }
    VariableFieldDialogRef.value.close();
    const fields = [
        {
            label: t('common.result'),
            value: 'result',
        },
        ...inputFieldList.value.map((item) => ({ label: item.label, value: item.field })),
    ];
    set(props.nodeModel.properties.config, 'fields', fields);
    props.nodeModel.clear_next_node_field(false);
}
onMounted(() => {
    if (props.nodeModel.properties.node_data.variable_list) {
        inputFieldList.value = cloneDeep(props.nodeModel.properties.node_data.variable_list);
    }
    set(props.nodeModel.properties.node_data, 'variable_list', inputFieldList);
    const fields = [
        {
            label: t('common.result'),
            value: 'result',
        },
        ...inputFieldList.value.map((item) => ({ label: item.label, value: item.field })),
    ];
    set(props.nodeModel.properties.config, 'fields', fields);
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
    ...{ class: "flex-between w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "break-all lighter" },
});
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('workflow.nodes.variableSplittingNode.splitVariables'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-danger" },
});
/** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
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
}));
const __VLS_10 = __VLS_9({
    iconName: "app-add-outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
if (props.nodeModel.properties.node_data.variable_list?.length > 0) {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        data: (props.nodeModel.properties.node_data.variable_list),
        ref: "tableRef",
        rowKey: "field",
        ...{ class: "border-l border-r" },
    }));
    const __VLS_15 = __VLS_14({
        data: (props.nodeModel.properties.node_data.variable_list),
        ref: "tableRef",
        rowKey: "field",
        ...{ class: "border-l border-r" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    var __VLS_18;
    /** @type {__VLS_StyleScopedClasses['border-l']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r']} */ ;
    const { default: __VLS_20 } = __VLS_16.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        prop: "field",
        label: (__VLS_ctx.$t('common.variable')),
        width: "95",
    }));
    const __VLS_23 = __VLS_22({
        prop: "field",
        label: (__VLS_ctx.$t('common.variable')),
        width: "95",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const { default: __VLS_26 } = __VLS_24.slots;
    {
        const { default: __VLS_27 } = __VLS_24.slots;
        const [{ row }] = __VLS_vSlot(__VLS_27);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.field),
            ...{ class: "ellipsis-1" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.field);
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
        prop: "label",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    }));
    const __VLS_30 = __VLS_29({
        prop: "label",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const { default: __VLS_33 } = __VLS_31.slots;
    {
        const { default: __VLS_34 } = __VLS_31.slots;
        const [{ row }] = __VLS_vSlot(__VLS_34);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.label),
            ...{ class: "ellipsis-1" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.label);
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
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "90",
    }));
    const __VLS_37 = __VLS_36({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_40 } = __VLS_38.slots;
    {
        const { default: __VLS_41 } = __VLS_38.slots;
        const [{ row, $index }] = __VLS_vSlot(__VLS_41);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_42;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }));
        const __VLS_44 = __VLS_43({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        const { default: __VLS_47 } = __VLS_45.slots;
        let __VLS_48;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_50 = __VLS_49({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        let __VLS_53;
        const __VLS_54 = {
            /** @type {typeof __VLS_53.click} */
            onClick: (...[$event]) => {
                if (!(props.nodeModel.properties.node_data.variable_list?.length > 0))
                    throw 0;
                return __VLS_ctx.openAddDialog(row, $index);
                // @ts-ignore
                [$t, $t, openAddDialog,];
            },
        };
        const { default: __VLS_55 } = __VLS_51.slots;
        let __VLS_56;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
            iconName: "app-edit",
        }));
        const __VLS_58 = __VLS_57({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        // @ts-ignore
        [];
        var __VLS_51;
        var __VLS_52;
        // @ts-ignore
        [];
        var __VLS_45;
        let __VLS_61;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }));
        const __VLS_63 = __VLS_62({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
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
                if (!(props.nodeModel.properties.node_data.variable_list?.length > 0))
                    throw 0;
                return __VLS_ctx.deleteField($index);
                // @ts-ignore
                [$t, deleteField,];
            },
        };
        const { default: __VLS_74 } = __VLS_70.slots;
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            iconName: "app-delete",
        }));
        const __VLS_77 = __VLS_76({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        // @ts-ignore
        [];
        var __VLS_70;
        var __VLS_71;
        // @ts-ignore
        [];
        var __VLS_64;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_38;
    // @ts-ignore
    [];
    var __VLS_16;
}
const __VLS_80 = VariableFieldDialog || VariableFieldDialog;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    ...{ 'onRefresh': {} },
    ref: "VariableFieldDialogRef",
}));
const __VLS_82 = __VLS_81({
    ...{ 'onRefresh': {} },
    ref: "VariableFieldDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_85;
const __VLS_86 = {
    /** @type {typeof __VLS_85.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_87;
var __VLS_83;
var __VLS_84;
// @ts-ignore
var __VLS_19 = __VLS_18, __VLS_88 = __VLS_87;
// @ts-ignore
[refreshFieldList,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
