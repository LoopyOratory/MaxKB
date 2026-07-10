/// <reference types="../../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { set, cloneDeep } from 'lodash';
import Sortable from 'sortablejs';
import { MsgError } from '@/utils/message';
import InputFieldFormDialog from './OutputFieldFormDialog.vue';
import { t } from '@/locales';
import OutputTitleDialog from '@/workflow/nodes/tool-base-node/component/output/OutputTitleDialog.vue';
const props = defineProps();
const tableRef = ref();
const inputFieldFormDialogRef = ref();
const outputTitleDialogRef = ref();
const inputFieldList = ref([]);
const outputFieldConfig = ref({ title: t('aiChat.userOutput', 'Output parameters') });
function openAddDialog(data, index) {
    if (index !== undefined) {
        currentIndex.value = index;
    }
    inputFieldFormDialogRef.value?.open(data);
}
function openChangeTitleDialog() {
    outputTitleDialogRef.value?.open(outputFieldConfig.value);
}
function deleteField(index) {
    inputFieldList.value = inputFieldList.value.filter((item, i) => i !== index);
    set(props.nodeModel.properties, 'user_output_field_list', inputFieldList.value);
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
    set(props.nodeModel.properties, 'user_output_field_list', cloneDeep(inputFieldList.value));
    inputFieldFormDialogRef.value?.close();
    props.nodeModel.graphModel.getNodeModelById('tool-start-node').clear_next_node_field(true);
    currentIndex.value = null;
}
function refreshFieldTitle(data) {
    outputFieldConfig.value = data;
    outputTitleDialogRef.value?.close();
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
    if (props.nodeModel.properties.user_output_config) {
        outputFieldConfig.value = cloneDeep(props.nodeModel.properties.user_output_config);
    }
    if (props.nodeModel.properties.user_output_field_list) {
        inputFieldList.value = cloneDeep(props.nodeModel.properties.user_output_field_list);
    }
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
    title: (__VLS_ctx.outputFieldConfig.title),
});
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.outputFieldConfig.title);
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
[outputFieldConfig, outputFieldConfig, openChangeTitleDialog,];
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
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
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
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    prop: "label",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
}));
const __VLS_41 = __VLS_40({
    prop: "label",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}));
const __VLS_46 = __VLS_45({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
{
    const { default: __VLS_50 } = __VLS_47.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_50);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }));
    const __VLS_53 = __VLS_52({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_56 } = __VLS_54.slots;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddDialog(row, $index);
            // @ts-ignore
            [openAddDialog, $t, $t, $t, $t, inputFieldList,];
        },
    };
    const { default: __VLS_64 } = __VLS_60.slots;
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        iconName: "app-edit",
    }));
    const __VLS_67 = __VLS_66({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    // @ts-ignore
    [];
    var __VLS_60;
    var __VLS_61;
    // @ts-ignore
    [];
    var __VLS_54;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_72 = __VLS_71({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_81;
    const __VLS_82 = {
        /** @type {typeof __VLS_81.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteField($index);
            // @ts-ignore
            [$t, deleteField,];
        },
    };
    const { default: __VLS_83 } = __VLS_79.slots;
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        iconName: "app-delete",
    }));
    const __VLS_86 = __VLS_85({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    // @ts-ignore
    [];
    var __VLS_79;
    var __VLS_80;
    // @ts-ignore
    [];
    var __VLS_73;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_47;
// @ts-ignore
[];
var __VLS_29;
const __VLS_89 = InputFieldFormDialog;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    ...{ 'onRefresh': {} },
    ref: "inputFieldFormDialogRef",
}));
const __VLS_91 = __VLS_90({
    ...{ 'onRefresh': {} },
    ref: "inputFieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
const __VLS_95 = {
    /** @type {typeof __VLS_94.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_96;
var __VLS_92;
var __VLS_93;
const __VLS_98 = OutputTitleDialog;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    ...{ 'onRefresh': {} },
    ref: "outputTitleDialogRef",
}));
const __VLS_100 = __VLS_99({
    ...{ 'onRefresh': {} },
    ref: "outputTitleDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
let __VLS_103;
const __VLS_104 = {
    /** @type {typeof __VLS_103.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldTitle),
};
var __VLS_105;
var __VLS_101;
var __VLS_102;
// @ts-ignore
var __VLS_32 = __VLS_31, __VLS_97 = __VLS_96, __VLS_106 = __VLS_105;
// @ts-ignore
[refreshFieldList, refreshFieldTitle,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
