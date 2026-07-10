/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { set, cloneDeep } from 'lodash';
import ParametersFieldDialog from './ParametersFieldDialog.vue';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
const props = defineProps();
const tableRef = ref();
const ParametersFieldDialogRef = ref();
const inputFieldList = ref([]);
function openAddDialog(data, index) {
    ParametersFieldDialogRef.value.open(data, index);
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
    ParametersFieldDialogRef.value.close();
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
(__VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.label'));
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
    ...{ class: "mr-4" },
}));
const __VLS_10 = __VLS_9({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
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
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        width: "90",
    }));
    const __VLS_23 = __VLS_22({
        prop: "field",
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        width: "90",
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
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
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
        prop: "label",
        label: (__VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.parameterType')),
    }));
    const __VLS_37 = __VLS_36({
        prop: "label",
        label: (__VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.parameterType')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_40 } = __VLS_38.slots;
    {
        const { default: __VLS_41 } = __VLS_38.slots;
        const [{ row }] = __VLS_vSlot(__VLS_41);
        let __VLS_42;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_44 = __VLS_43({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_47 } = __VLS_45.slots;
        (row.parameter_type);
        // @ts-ignore
        [$t,];
        var __VLS_45;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_38;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "80",
    }));
    const __VLS_50 = __VLS_49({
        label: (__VLS_ctx.$t('common.operation')),
        align: "left",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const { default: __VLS_53 } = __VLS_51.slots;
    {
        const { default: __VLS_54 } = __VLS_51.slots;
        const [{ row, $index }] = __VLS_vSlot(__VLS_54);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_55;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }));
        const __VLS_57 = __VLS_56({
            effect: "dark",
            content: (__VLS_ctx.$t('common.modify')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_56));
        const { default: __VLS_60 } = __VLS_58.slots;
        let __VLS_61;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_66;
        const __VLS_67 = {
            /** @type {typeof __VLS_66.click} */
            onClick: (...[$event]) => {
                if (!(props.nodeModel.properties.node_data.variable_list?.length > 0))
                    throw 0;
                return __VLS_ctx.openAddDialog(row, $index);
                // @ts-ignore
                [$t, $t, openAddDialog,];
            },
        };
        const { default: __VLS_68 } = __VLS_64.slots;
        let __VLS_69;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
            iconName: "app-edit",
        }));
        const __VLS_71 = __VLS_70({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        // @ts-ignore
        [];
        var __VLS_64;
        var __VLS_65;
        // @ts-ignore
        [];
        var __VLS_58;
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }));
        const __VLS_76 = __VLS_75({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        const { default: __VLS_79 } = __VLS_77.slots;
        let __VLS_80;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_82 = __VLS_81({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        let __VLS_85;
        const __VLS_86 = {
            /** @type {typeof __VLS_85.click} */
            onClick: (...[$event]) => {
                if (!(props.nodeModel.properties.node_data.variable_list?.length > 0))
                    throw 0;
                return __VLS_ctx.deleteField($index);
                // @ts-ignore
                [$t, deleteField,];
            },
        };
        const { default: __VLS_87 } = __VLS_83.slots;
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            iconName: "app-delete",
        }));
        const __VLS_90 = __VLS_89({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        // @ts-ignore
        [];
        var __VLS_83;
        var __VLS_84;
        // @ts-ignore
        [];
        var __VLS_77;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_51;
    // @ts-ignore
    [];
    var __VLS_16;
}
const __VLS_93 = ParametersFieldDialog || ParametersFieldDialog;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    ...{ 'onRefresh': {} },
    ref: "ParametersFieldDialogRef",
}));
const __VLS_95 = __VLS_94({
    ...{ 'onRefresh': {} },
    ref: "ParametersFieldDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_98;
const __VLS_99 = {
    /** @type {typeof __VLS_98.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_100;
var __VLS_96;
var __VLS_97;
// @ts-ignore
var __VLS_19 = __VLS_18, __VLS_101 = __VLS_100;
// @ts-ignore
[refreshFieldList,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
