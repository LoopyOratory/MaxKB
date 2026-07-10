/// <reference types="../../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { set, cloneDeep } from 'lodash';
import Sortable from 'sortablejs';
import { MsgError } from '@/utils/message';
import InputFieldFormDialog from './InputFieldFormDialog.vue';
import { t } from '@/locales';
import InputTitleDialog from '@/workflow/nodes/tool-base-node/component/input/InputTitleDialog.vue';
const props = defineProps();
const tableRef = ref();
const inputFieldFormDialogRef = ref();
const inputTitleDialogRef = ref();
const inputFieldList = ref([]);
const inputFieldConfig = ref({ title: t('aiChat.userInput') });
function openAddDialog(data, index) {
    if (index !== undefined) {
        currentIndex.value = index;
    }
    inputFieldFormDialogRef.value?.open(data);
}
function openChangeTitleDialog() {
    inputTitleDialogRef.value?.open(inputFieldConfig.value);
}
function deleteField(index) {
    inputFieldList.value.splice(index, 1);
    set(props.nodeModel.properties, 'user_input_field_list', cloneDeep(inputFieldList.value));
    props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
    onDragHandle();
}
const currentIndex = ref(null);
function refreshFieldList(data) {
    if (currentIndex.value !== null) {
        if (inputFieldList.value
            .filter((item, index) => index != currentIndex.value)
            .some((field) => field.field == data.field)) {
            MsgError(t('workflow.tip.paramErrorMessage') + data.field);
            return;
        }
        inputFieldList.value?.splice(currentIndex.value, 1, data);
    }
    else {
        if (inputFieldList.value.some((field) => field.field == data.field)) {
            MsgError(t('workflow.tip.paramErrorMessage') + data.field);
            return;
        }
        inputFieldList.value?.push(data);
    }
    set(props.nodeModel.properties, 'user_input_field_list', cloneDeep(inputFieldList.value));
    props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
    props.nodeModel.graphModel.getNodeModelById('tool-start-node').clear_next_node_field(true);
    inputFieldFormDialogRef.value?.close();
    currentIndex.value = null;
}
function refreshFieldTitle(data) {
    inputFieldConfig.value = data;
    inputTitleDialogRef.value?.close();
}
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
            props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
        },
    });
}
onMounted(() => {
    if (props.nodeModel.properties.user_input_config) {
        inputFieldConfig.value = cloneDeep(props.nodeModel.properties.user_input_config);
    }
    if (props.nodeModel.properties.user_input_field_list) {
        inputFieldList.value = cloneDeep(props.nodeModel.properties.user_input_field_list);
    }
    props.nodeModel.graphModel.eventCenter.emit('refreshFieldList');
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
    ref: "inputFieldTableRef",
    data: (__VLS_ctx.inputFieldList),
    ...{ class: "mb-16" },
}));
const __VLS_28 = __VLS_27({
    ref: "inputFieldTableRef",
    data: (__VLS_ctx.inputFieldList),
    ...{ class: "mb-16" },
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
    label: (__VLS_ctx.$t('views.tool.form.paramName.label')),
}));
const __VLS_36 = __VLS_35({
    prop: "field",
    label: (__VLS_ctx.$t('views.tool.form.paramName.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
{
    const { default: __VLS_40 } = __VLS_37.slots;
    const [{ row }] = __VLS_vSlot(__VLS_40);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1" },
        title: (row.field),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (row.field);
    // @ts-ignore
    [$t, inputFieldList,];
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1" },
        title: (row.label),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (row.label);
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
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
}));
const __VLS_50 = __VLS_49({
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
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
        type: "info",
        ...{ class: "info-tag" },
    }));
    const __VLS_57 = __VLS_56({
        type: "info",
        ...{ class: "info-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
    const { default: __VLS_60 } = __VLS_58.slots;
    (row.type);
    // @ts-ignore
    [$t,];
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
    label: (__VLS_ctx.$t('common.required')),
}));
const __VLS_63 = __VLS_62({
    label: (__VLS_ctx.$t('common.required')),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
{
    const { default: __VLS_67 } = __VLS_64.slots;
    const [{ row }] = __VLS_vSlot(__VLS_67);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        disabled: true,
        size: "small",
        modelValue: (row.is_required),
    }));
    const __VLS_70 = __VLS_69({
        disabled: true,
        size: "small",
        modelValue: (row.is_required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_64;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}));
const __VLS_75 = __VLS_74({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
{
    const { default: __VLS_79 } = __VLS_76.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_79);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }));
    const __VLS_82 = __VLS_81({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
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
            return __VLS_ctx.openAddDialog(row, $index);
            // @ts-ignore
            [openAddDialog, $t, $t,];
        },
    };
    const { default: __VLS_93 } = __VLS_89.slots;
    let __VLS_94;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        iconName: "app-edit",
    }));
    const __VLS_96 = __VLS_95({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    // @ts-ignore
    [];
    var __VLS_89;
    var __VLS_90;
    // @ts-ignore
    [];
    var __VLS_83;
    let __VLS_99;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_101 = __VLS_100({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    const { default: __VLS_104 } = __VLS_102.slots;
    let __VLS_105;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_107 = __VLS_106({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    let __VLS_110;
    const __VLS_111 = {
        /** @type {typeof __VLS_110.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteField($index);
            // @ts-ignore
            [$t, deleteField,];
        },
    };
    const { default: __VLS_112 } = __VLS_108.slots;
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        iconName: "app-delete",
    }));
    const __VLS_115 = __VLS_114({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    // @ts-ignore
    [];
    var __VLS_108;
    var __VLS_109;
    // @ts-ignore
    [];
    var __VLS_102;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_76;
// @ts-ignore
[];
var __VLS_29;
const __VLS_118 = InputFieldFormDialog;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    ...{ 'onRefresh': {} },
    ref: "inputFieldFormDialogRef",
}));
const __VLS_120 = __VLS_119({
    ...{ 'onRefresh': {} },
    ref: "inputFieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_123;
const __VLS_124 = {
    /** @type {typeof __VLS_123.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_125;
var __VLS_121;
var __VLS_122;
const __VLS_127 = InputTitleDialog;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    ...{ 'onRefresh': {} },
    ref: "inputTitleDialogRef",
}));
const __VLS_129 = __VLS_128({
    ...{ 'onRefresh': {} },
    ref: "inputTitleDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
let __VLS_132;
const __VLS_133 = {
    /** @type {typeof __VLS_132.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldTitle),
};
var __VLS_134;
var __VLS_130;
var __VLS_131;
// @ts-ignore
var __VLS_32 = __VLS_31, __VLS_126 = __VLS_125, __VLS_135 = __VLS_134;
// @ts-ignore
[refreshFieldList, refreshFieldTitle,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
