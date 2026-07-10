/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { set, cloneDeep } from 'lodash';
import Sortable from 'sortablejs';
import UserFieldFormDialog from './UserFieldFormDialog.vue';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
import UserInputTitleDialog from '@/workflow/nodes/base-node/component/UserInputTitleDialog.vue';
import { input_type_list } from '@/components/dynamics-form/constructor/data';
const props = defineProps();
const tableRef = ref();
const UserFieldFormDialogRef = ref();
const UserInputTitleDialogRef = ref();
const inputFieldList = ref([]);
const inputFieldConfig = ref({ title: t('workflow.nodes.KnowledgeBaseNode.DocumentSetting') });
function openAddDialog(data, index) {
    UserFieldFormDialogRef.value.open(data, index);
}
function openChangeTitleDialog() {
    UserInputTitleDialogRef.value.open(inputFieldConfig.value);
}
function deleteField(index) {
    inputFieldList.value.splice(index, 1);
    props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
    const fields = inputFieldList.value.map((item) => ({
        label: item.label.label,
        value: item.field,
    }));
    set(props.nodeModel.properties, 'user_input_field_list', cloneDeep(inputFieldList.value));
    set(props.nodeModel.properties.config, 'fields', fields);
    onDragHandle();
}
function refreshFieldList(data, index) {
    for (let i = 0; i < inputFieldList.value.length; i++) {
        if (inputFieldList.value[i].field === data.field && index !== i) {
            MsgError(t('workflow.tip.paramErrorMessage') + data.field);
            return;
        }
    }
    if (index !== null) {
        inputFieldList.value.splice(index, 1, data);
    }
    else {
        inputFieldList.value.push(data);
    }
    UserFieldFormDialogRef.value.close();
    set(props.nodeModel.properties, 'user_input_field_list', cloneDeep(inputFieldList.value));
    onDragHandle();
}
function refreshFieldTitle(data) {
    inputFieldConfig.value = { ...inputFieldConfig.value, title: data.menu_title };
    UserInputTitleDialogRef.value.close();
}
const getDefaultValue = (row) => {
    if (row.input_type === 'PasswordInput') {
        return '******';
    }
    if (row.default_value) {
        const default_value = row.option_list
            ?.filter((v) => row.default_value.indexOf(v.value) > -1)
            .map((v) => v.label)
            .join(',');
        if (default_value) {
            return default_value;
        }
        return row.default_value;
    }
    if (row.default_value !== undefined) {
        return row.default_value;
    }
};
function onDragHandle() {
    if (!tableRef.value)
        return;
    // Get table tbody DOM element
    const wrapper = tableRef.value.$el;
    const tbody = wrapper.querySelector('.el-table__body-wrapper tbody');
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
        },
    });
}
onMounted(() => {
    inputFieldList.value = [];
    if (props.nodeModel.properties.user_input_field_list) {
        inputFieldList.value = cloneDeep(props.nodeModel.properties.user_input_field_list);
    }
    if (props.nodeModel.properties.user_input_config) {
        inputFieldConfig.value = props.nodeModel.properties.user_input_config;
    }
    set(props.nodeModel.properties, 'user_input_config', inputFieldConfig);
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
    ...{ class: "break-all ellipsis lighter" },
    ...{ style: {} },
    title: (__VLS_ctx.inputFieldConfig.title),
});
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.inputFieldConfig.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.openChangeTitleDialog),
};
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    iconName: "app-setting",
}));
const __VLS_10 = __VLS_9({
    iconName: "app-setting",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
// @ts-ignore
[inputFieldConfig, inputFieldConfig, openChangeTitleDialog,];
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = {
    /** @type {typeof __VLS_18.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddDialog();
        // @ts-ignore
        [openAddDialog,];
    },
};
const { default: __VLS_20 } = __VLS_16.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_23 = __VLS_22({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t,];
var __VLS_16;
var __VLS_17;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    data: (props.nodeModel.properties.user_input_field_list),
    ...{ class: "mb-16" },
    ref: "tableRef",
    rowKey: "field",
}));
const __VLS_28 = __VLS_27({
    data: (props.nodeModel.properties.user_input_field_list),
    ...{ class: "mb-16" },
    ref: "tableRef",
    rowKey: "field",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
var __VLS_31;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_33 } = __VLS_29.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    width: "95",
}));
const __VLS_36 = __VLS_35({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    width: "95",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
{
    const { default: __VLS_40 } = __VLS_37.slots;
    const [{ row }] = __VLS_vSlot(__VLS_40);
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
var __VLS_37;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    prop: "label",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
}));
const __VLS_43 = __VLS_42({
    prop: "label",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
{
    const { default: __VLS_47 } = __VLS_44.slots;
    const [{ row }] = __VLS_vSlot(__VLS_47);
    if (row.label && row.label.input_type === 'TooltipLabel') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.label.label),
            ...{ class: "ellipsis-1" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.label.label);
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            title: (row.label),
            ...{ class: "ellipsis-1" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (row.label);
    }
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_44;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
    width: "95",
}));
const __VLS_50 = __VLS_49({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
    width: "95",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_53 } = __VLS_51.slots;
{
    const { default: __VLS_54 } = __VLS_51.slots;
    const [{ row }] = __VLS_vSlot(__VLS_54);
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }));
    const __VLS_57 = __VLS_56({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
    const { default: __VLS_60 } = __VLS_58.slots;
    (__VLS_ctx.input_type_list.find((item) => item.value === row.input_type)?.label);
    // @ts-ignore
    [$t, input_type_list,];
    var __VLS_58;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_51;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
}));
const __VLS_63 = __VLS_62({
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
{
    const { default: __VLS_67 } = __VLS_64.slots;
    const [{ row }] = __VLS_vSlot(__VLS_67);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        title: (row.default_value),
        ...{ class: "ellipsis-1" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (__VLS_ctx.getDefaultValue(row));
    // @ts-ignore
    [$t, getDefaultValue,];
}
// @ts-ignore
[];
var __VLS_64;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    label: (__VLS_ctx.$t('common.required')),
}));
const __VLS_70 = __VLS_69({
    label: (__VLS_ctx.$t('common.required')),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const { default: __VLS_73 } = __VLS_71.slots;
{
    const { default: __VLS_74 } = __VLS_71.slots;
    const [{ row }] = __VLS_vSlot(__VLS_74);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }));
    const __VLS_77 = __VLS_76({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_71;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}));
const __VLS_82 = __VLS_81({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
{
    const { default: __VLS_86 } = __VLS_83.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_86);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }));
    const __VLS_89 = __VLS_88({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    const { default: __VLS_92 } = __VLS_90.slots;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    const __VLS_99 = {
        /** @type {typeof __VLS_98.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddDialog(row, $index);
            // @ts-ignore
            [openAddDialog, $t, $t,];
        },
    };
    const { default: __VLS_100 } = __VLS_96.slots;
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        iconName: "app-edit",
    }));
    const __VLS_103 = __VLS_102({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    // @ts-ignore
    [];
    var __VLS_96;
    var __VLS_97;
    // @ts-ignore
    [];
    var __VLS_90;
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_108 = __VLS_107({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    const { default: __VLS_111 } = __VLS_109.slots;
    let __VLS_112;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_117;
    const __VLS_118 = {
        /** @type {typeof __VLS_117.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteField($index);
            // @ts-ignore
            [$t, deleteField,];
        },
    };
    const { default: __VLS_119 } = __VLS_115.slots;
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        iconName: "app-delete",
    }));
    const __VLS_122 = __VLS_121({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    // @ts-ignore
    [];
    var __VLS_115;
    var __VLS_116;
    // @ts-ignore
    [];
    var __VLS_109;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_83;
// @ts-ignore
[];
var __VLS_29;
const __VLS_125 = UserFieldFormDialog;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    ...{ 'onRefresh': {} },
    ref: "UserFieldFormDialogRef",
}));
const __VLS_127 = __VLS_126({
    ...{ 'onRefresh': {} },
    ref: "UserFieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
let __VLS_130;
const __VLS_131 = {
    /** @type {typeof __VLS_130.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_132;
var __VLS_128;
var __VLS_129;
const __VLS_134 = UserInputTitleDialog;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    ...{ 'onRefresh': {} },
    ref: "UserInputTitleDialogRef",
}));
const __VLS_136 = __VLS_135({
    ...{ 'onRefresh': {} },
    ref: "UserInputTitleDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
let __VLS_139;
const __VLS_140 = {
    /** @type {typeof __VLS_139.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldTitle),
};
var __VLS_141;
var __VLS_137;
var __VLS_138;
// @ts-ignore
var __VLS_32 = __VLS_31, __VLS_133 = __VLS_132, __VLS_142 = __VLS_141;
// @ts-ignore
[refreshFieldList, refreshFieldTitle,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
