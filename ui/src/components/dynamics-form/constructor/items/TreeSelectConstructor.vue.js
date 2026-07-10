/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, reactive } from 'vue';
import { t } from '@/locales/';
import { ElMessage, ElMessageBox } from 'element-plus';
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    },
});
const getData = () => {
    return {
        input_type: 'TreeSelect',
        attrs: { multiple: formValue.value.multiple, data: formValue.value.treeData, filterable: true },
        default_value: formValue.value.default_value,
        show_default_value: formValue.value.show_default_value,
    };
};
const rander = (form_data) => {
    const attrs = form_data.attrs || {};
    formValue.value.multiple = attrs.multiple;
    formValue.value.treeData = attrs.data || [];
    formValue.value.default_value = form_data.default_value;
    formValue.value.show_default_value = form_data.show_default_value;
};
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onMounted(() => {
    formValue.value.treeData = [];
    formValue.value.default_value = '';
    if (formValue.value.show_default_value === undefined) {
        formValue.value.show_default_value = true;
    }
});
const treeProps = {
    children: 'children',
    label: 'label',
};
const addDialog = reactive({
    visible: false,
    mode: 'root',
    parentNode: null,
    formList: [],
});
const editDialog = reactive({
    visible: false,
    targetNode: null,
    form: {
        label: '',
        value: '',
    },
});
function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function createEmptyRow() {
    return {
        key: createId(),
        label: '',
        value: '',
    };
}
/* -------------------- Add -------------------- */
function openAddRootDialog() {
    addDialog.visible = true;
    addDialog.mode = 'root';
    addDialog.parentNode = null;
    addDialog.formList = [createEmptyRow()];
}
function openAddChildDialog(node) {
    addDialog.visible = true;
    addDialog.mode = 'child';
    addDialog.parentNode = node;
    addDialog.formList = [createEmptyRow()];
}
function appendAddRow() {
    addDialog.formList.push(createEmptyRow());
}
function removeAddRow(index) {
    if (addDialog.formList.length === 1)
        return;
    addDialog.formList.splice(index, 1);
}
function closeAddDialog() {
    addDialog.visible = false;
    addDialog.mode = 'root';
    addDialog.parentNode = null;
    addDialog.formList = [];
}
function submitAdd() {
    const validList = addDialog.formList
        .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim(),
    }))
        .filter((item) => item.label && item.value);
    if (!validList.length) {
        ElMessage.warning(t('dynamicsForm.TreeSelect.addDialog.require'));
        return;
    }
    const newNodes = validList.map((item) => ({
        id: createId(),
        label: item.label,
        value: item.value,
    }));
    if (addDialog.mode === 'root') {
        formValue.value.treeData.push(...newNodes);
    }
    else {
        const parent = addDialog.parentNode;
        if (!parent) {
            ElMessage.error(t('dynamicsForm.TreeSelect.addDialog.nodeNotFound'));
            return;
        }
        if (!parent.children) {
            parent.children = [];
        }
        parent.children.push(...newNodes);
    }
    ElMessage.success(t('common.saveSuccess'));
    closeAddDialog();
}
/* -------------------- Edit -------------------- */
function openEditDialog(node) {
    editDialog.visible = true;
    editDialog.targetNode = node;
    editDialog.form.label = node.label;
    editDialog.form.value = node.value;
}
function closeEditDialog() {
    editDialog.visible = false;
    editDialog.targetNode = null;
    editDialog.form.label = '';
    editDialog.form.value = '';
}
function submitEdit() {
    const label = editDialog.form.label.trim();
    const value = editDialog.form.value.trim();
    if (!label || !value) {
        ElMessage.warning(t('dynamicsForm.TreeSelect.addDialog.tagRequire'));
        return;
    }
    if (!editDialog.targetNode) {
        ElMessage.error(t('dynamicsForm.TreeSelect.addDialog.nodeNotFound'));
        return;
    }
    editDialog.targetNode.label = label;
    editDialog.targetNode.value = value;
    ElMessage.success(t('common.saveSuccess'));
    closeEditDialog();
}
/* -------------------- Deletion -------------------- */
function handleDelete(node) {
    ElMessageBox.confirm(`${t('common.deleteConfirm')}「${node.label}」`, t('common.tip'), {
        type: 'warning',
    })
        .then(() => {
        const removed = removeNodeById(formValue.value.treeData, node.id);
        if (removed) {
            ElMessage.success(t('common.deleteSuccess'));
        }
        else {
            ElMessage.error(t('common.deleteError'));
        }
    })
        .catch(() => { });
}
function removeNodeById(list, targetId) {
    const index = list.findIndex((item) => item.id === targetId);
    if (index !== -1) {
        list.splice(index, 1);
        return true;
    }
    for (const item of list) {
        if (item.children?.length) {
            const removed = removeNodeById(item.children, targetId);
            if (removed) {
                if (item.children.length === 0) {
                    delete item.children;
                }
                return true;
            }
        }
    }
    return false;
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    prop: "treeData",
    rules: ([
        {
            message: __VLS_ctx.$t('dynamicsForm.TreeSelect.selectRequired'),
            blur: 'change',
            type: 'array',
            min: 1,
        },
    ]),
}));
const __VLS_2 = __VLS_1({
    prop: "treeData",
    rules: ([
        {
            message: __VLS_ctx.$t('dynamicsForm.TreeSelect.selectRequired'),
            blur: 'change',
            type: 'array',
            min: 1,
        },
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { label: __VLS_6 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('dynamicsForm.TreeSelect.select'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        modelValue: (__VLS_ctx.formValue.multiple),
        label: (__VLS_ctx.$t('dynamicsForm.TreeSelect.allowMultipleSelections')),
        size: "large",
        ...{ class: "pr-8" },
    }));
    const __VLS_9 = __VLS_8({
        modelValue: (__VLS_ctx.formValue.multiple),
        label: (__VLS_ctx.$t('dynamicsForm.TreeSelect.allowMultipleSelections')),
        size: "large",
        ...{ class: "pr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['pr-8']} */ ;
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_17;
    const __VLS_18 = {
        /** @type {typeof __VLS_17.click} */
        onClick: (__VLS_ctx.openAddRootDialog),
    };
    const { default: __VLS_19 } = __VLS_15.slots;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_22 = __VLS_21({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [$t, $t, $t, formValue, openAddRootDialog,];
    var __VLS_15;
    var __VLS_16;
    // @ts-ignore
    [];
}
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    shadow: "never",
    ...{ class: "border-r-6 w-full" },
    ...{ style: {} },
}));
const __VLS_27 = __VLS_26({
    shadow: "never",
    ...{ class: "border-r-6 w-full" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree'] | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree']} */
elTree;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    data: (__VLS_ctx.formValue.treeData),
    nodeKey: "id",
    defaultExpandAll: true,
    expandOnClickNode: (false),
    props: (__VLS_ctx.treeProps),
    ...{ class: "option-tree" },
}));
const __VLS_33 = __VLS_32({
    data: (__VLS_ctx.formValue.treeData),
    nodeKey: "id",
    defaultExpandAll: true,
    expandOnClickNode: (false),
    props: (__VLS_ctx.treeProps),
    ...{ class: "option-tree" },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
/** @type {__VLS_StyleScopedClasses['option-tree']} */ ;
const { default: __VLS_36 } = __VLS_34.slots;
{
    const { default: __VLS_37 } = __VLS_34.slots;
    const [{ data, node }] = __VLS_vSlot(__VLS_37);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ellipsis" },
        title: (`${data.label}-${data.value}`),
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (data.label);
    (data.value);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (node.level < 5) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_40 = __VLS_39({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        let __VLS_43;
        const __VLS_44 = {
            /** @type {typeof __VLS_43.click} */
            onClick: (...[$event]) => {
                if (!(node.level < 5))
                    throw 0;
                return __VLS_ctx.openAddChildDialog(data);
                // @ts-ignore
                [formValue, treeProps, openAddChildDialog,];
            },
        };
        const { default: __VLS_45 } = __VLS_41.slots;
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            iconName: "app-add-outlined",
            ...{ class: "color-secondary" },
        }));
        const __VLS_48 = __VLS_47({
            iconName: "app-add-outlined",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_41;
        var __VLS_42;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openEditDialog(data);
            // @ts-ignore
            [openEditDialog,];
        },
    };
    const { default: __VLS_58 } = __VLS_54.slots;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        iconName: "app-edit",
        ...{ class: "color-secondary" },
    }));
    const __VLS_61 = __VLS_60({
        iconName: "app-edit",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_54;
    var __VLS_55;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.handleDelete(data);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        iconName: "app-delete",
        ...{ class: "color-secondary" },
    }));
    const __VLS_74 = __VLS_73({
        iconName: "app-delete",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_67;
    var __VLS_68;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_34;
// @ts-ignore
[];
var __VLS_28;
// @ts-ignore
[];
var __VLS_3;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    ...{ class: "defaultValueItem" },
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    rules: (__VLS_ctx.formValue.required
        ? [
            {
                required: true,
                message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
            },
        ]
        : []),
}));
const __VLS_79 = __VLS_78({
    ...{ class: "defaultValueItem" },
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    rules: (__VLS_ctx.formValue.required
        ? [
            {
                required: true,
                message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
            },
        ]
        : []),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
/** @type {__VLS_StyleScopedClasses['defaultValueItem']} */ ;
const { default: __VLS_82 } = __VLS_80.slots;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select']} */
elTreeSelect;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    modelValue: (__VLS_ctx.formValue.default_value),
    data: (__VLS_ctx.formValue.treeData),
    multiple: (__VLS_ctx.formValue.multiple),
    renderAfterExpand: (false),
    ...{ style: {} },
}));
const __VLS_85 = __VLS_84({
    modelValue: (__VLS_ctx.formValue.default_value),
    data: (__VLS_ctx.formValue.treeData),
    multiple: (__VLS_ctx.formValue.multiple),
    renderAfterExpand: (false),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
// @ts-ignore
[$t, $t, $t, formValue, formValue, formValue, formValue, formValue,];
var __VLS_80;
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.addDialog.visible),
    title: (__VLS_ctx.addDialog.mode === 'root'
        ? __VLS_ctx.$t('dynamicsForm.TreeSelect.addDialog.addFirstOption')
        : __VLS_ctx.$t('dynamicsForm.TreeSelect.addDialog.addSubOptions')),
    width: "520px",
    destroyOnClose: true,
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_90 = __VLS_89({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.addDialog.visible),
    title: (__VLS_ctx.addDialog.mode === 'root'
        ? __VLS_ctx.$t('dynamicsForm.TreeSelect.addDialog.addFirstOption')
        : __VLS_ctx.$t('dynamicsForm.TreeSelect.addDialog.addSubOptions')),
    width: "520px",
    destroyOnClose: true,
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_93;
const __VLS_94 = {
    /** @type {typeof __VLS_93.submit} */
    onSubmit: () => { },
};
const { default: __VLS_95 } = __VLS_91.slots;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    gutter: (8),
    ...{ style: {} },
    ...{ class: "tag-list-max-list" },
}));
const __VLS_104 = __VLS_103({
    gutter: (8),
    ...{ style: {} },
    ...{ class: "tag-list-max-list" },
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
/** @type {__VLS_StyleScopedClasses['tag-list-max-list']} */ ;
const { default: __VLS_107 } = __VLS_105.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.addDialog.formList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        span: (12),
    }));
    const __VLS_110 = __VLS_109({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const { default: __VLS_113 } = __VLS_111.slots;
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({}));
    const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
    const { default: __VLS_119 } = __VLS_117.slots;
    {
        const { label: __VLS_120 } = __VLS_117.slots;
        (index === 0 ? __VLS_ctx.$t('dynamicsForm.tag.label') : '');
        if (index === 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-danger" },
            });
            /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        }
        // @ts-ignore
        [$t, $t, $t, addDialog, addDialog, addDialog,];
    }
    let __VLS_121;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
        modelValue: (item.label),
        modelModifiers: { trim: true, },
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('dynamicsForm.tag.placeholder')),
        maxlength: "50",
    }));
    const __VLS_123 = __VLS_122({
        modelValue: (item.label),
        modelModifiers: { trim: true, },
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('dynamicsForm.tag.placeholder')),
        maxlength: "50",
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    // @ts-ignore
    [$t,];
    var __VLS_117;
    // @ts-ignore
    [];
    var __VLS_111;
    let __VLS_126;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
        span: (11),
    }));
    const __VLS_128 = __VLS_127({
        span: (11),
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const { default: __VLS_131 } = __VLS_129.slots;
    let __VLS_132;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
        ...{ class: "w-full" },
    }));
    const __VLS_134 = __VLS_133({
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_137 } = __VLS_135.slots;
    {
        const { label: __VLS_138 } = __VLS_135.slots;
        (index === 0 ? __VLS_ctx.$t('dynamicsForm.Select.label') : '');
        if (index === 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-danger" },
            });
            /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        }
        // @ts-ignore
        [$t,];
    }
    let __VLS_139;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
        modelValue: (item.value),
        modelModifiers: { trim: true, },
        placeholder: (__VLS_ctx.$t('dynamicsForm.Select.placeholder')),
        maxlength: "100",
    }));
    const __VLS_141 = __VLS_140({
        modelValue: (item.value),
        modelModifiers: { trim: true, },
        placeholder: (__VLS_ctx.$t('dynamicsForm.Select.placeholder')),
        maxlength: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    // @ts-ignore
    [$t,];
    var __VLS_135;
    // @ts-ignore
    [];
    var __VLS_129;
    let __VLS_144;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
        span: (1),
    }));
    const __VLS_146 = __VLS_145({
        span: (1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    const { default: __VLS_149 } = __VLS_147.slots;
    let __VLS_150;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.addDialog.formList.length === 1),
        link: true,
        ...{ style: ({ marginTop: index === 0 ? '35px' : '12px' }) },
    }));
    const __VLS_152 = __VLS_151({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.addDialog.formList.length === 1),
        link: true,
        ...{ style: ({ marginTop: index === 0 ? '35px' : '12px' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    let __VLS_155;
    const __VLS_156 = {
        /** @type {typeof __VLS_155.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.removeAddRow(index);
            // @ts-ignore
            [addDialog, removeAddRow,];
        },
    };
    const { default: __VLS_157 } = __VLS_153.slots;
    let __VLS_158;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
        iconName: "app-delete",
    }));
    const __VLS_160 = __VLS_159({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    // @ts-ignore
    [];
    var __VLS_153;
    var __VLS_154;
    // @ts-ignore
    [];
    var __VLS_147;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_105;
// @ts-ignore
[];
var __VLS_99;
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_165 = __VLS_164({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
let __VLS_168;
const __VLS_169 = {
    /** @type {typeof __VLS_168.click} */
    onClick: (__VLS_ctx.appendAddRow),
};
const { default: __VLS_170 } = __VLS_166.slots;
let __VLS_171;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_173 = __VLS_172({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t, appendAddRow,];
var __VLS_166;
var __VLS_167;
{
    const { footer: __VLS_176 } = __VLS_91.slots;
    let __VLS_177;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
        ...{ 'onClick': {} },
    }));
    const __VLS_179 = __VLS_178({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    let __VLS_182;
    const __VLS_183 = {
        /** @type {typeof __VLS_182.click} */
        onClick: (__VLS_ctx.closeAddDialog),
    };
    const { default: __VLS_184 } = __VLS_180.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, closeAddDialog,];
    var __VLS_180;
    var __VLS_181;
    let __VLS_185;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_187 = __VLS_186({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    let __VLS_190;
    const __VLS_191 = {
        /** @type {typeof __VLS_190.click} */
        onClick: (__VLS_ctx.submitAdd),
    };
    const { default: __VLS_192 } = __VLS_188.slots;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t, submitAdd,];
    var __VLS_188;
    var __VLS_189;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_91;
var __VLS_92;
let __VLS_193;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.editDialog.visible),
    title: (__VLS_ctx.$t('common.edit')),
    width: "520px",
    destroyOnClose: true,
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_195 = __VLS_194({
    ...{ 'onSubmit': {} },
    modelValue: (__VLS_ctx.editDialog.visible),
    title: (__VLS_ctx.$t('common.edit')),
    width: "520px",
    destroyOnClose: true,
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
let __VLS_198;
const __VLS_199 = {
    /** @type {typeof __VLS_198.submit} */
    onSubmit: () => { },
};
const { default: __VLS_200 } = __VLS_196.slots;
let __VLS_201;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    gutter: (8),
}));
const __VLS_203 = __VLS_202({
    gutter: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
const { default: __VLS_206 } = __VLS_204.slots;
let __VLS_207;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
    span: (12),
}));
const __VLS_209 = __VLS_208({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
const { default: __VLS_212 } = __VLS_210.slots;
let __VLS_213;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({}));
const __VLS_215 = __VLS_214({}, ...__VLS_functionalComponentArgsRest(__VLS_214));
const { default: __VLS_218 } = __VLS_216.slots;
{
    const { label: __VLS_219 } = __VLS_216.slots;
    (__VLS_ctx.$t('dynamicsForm.tag.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t, editDialog,];
}
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.editDialog.form.label),
    modelModifiers: { trim: true, },
    placeholder: (__VLS_ctx.$t('dynamicsForm.tag.placeholder')),
    maxlength: "50",
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.editDialog.form.label),
    modelModifiers: { trim: true, },
    placeholder: (__VLS_ctx.$t('dynamicsForm.tag.placeholder')),
    maxlength: "50",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
// @ts-ignore
[$t, editDialog,];
var __VLS_216;
// @ts-ignore
[];
var __VLS_210;
let __VLS_225;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
    span: (12),
}));
const __VLS_227 = __VLS_226({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
const { default: __VLS_230 } = __VLS_228.slots;
let __VLS_231;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
    ...{ class: "w-full" },
}));
const __VLS_233 = __VLS_232({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_236 } = __VLS_234.slots;
{
    const { label: __VLS_237 } = __VLS_234.slots;
    (__VLS_ctx.$t('dynamicsForm.Select.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t,];
}
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    modelValue: (__VLS_ctx.editDialog.form.value),
    modelModifiers: { trim: true, },
    placeholder: (__VLS_ctx.$t('dynamicsForm.Select.placeholder')),
    maxlength: "100",
}));
const __VLS_240 = __VLS_239({
    modelValue: (__VLS_ctx.editDialog.form.value),
    modelModifiers: { trim: true, },
    placeholder: (__VLS_ctx.$t('dynamicsForm.Select.placeholder')),
    maxlength: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
// @ts-ignore
[$t, editDialog,];
var __VLS_234;
// @ts-ignore
[];
var __VLS_228;
// @ts-ignore
[];
var __VLS_204;
{
    const { footer: __VLS_243 } = __VLS_196.slots;
    let __VLS_244;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
        ...{ 'onClick': {} },
    }));
    const __VLS_246 = __VLS_245({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    let __VLS_249;
    const __VLS_250 = {
        /** @type {typeof __VLS_249.click} */
        onClick: (__VLS_ctx.closeEditDialog),
    };
    const { default: __VLS_251 } = __VLS_247.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, closeEditDialog,];
    var __VLS_247;
    var __VLS_248;
    let __VLS_252;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent1(__VLS_252, new __VLS_252({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_257;
    const __VLS_258 = {
        /** @type {typeof __VLS_257.click} */
        onClick: (__VLS_ctx.submitEdit),
    };
    const { default: __VLS_259 } = __VLS_255.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, submitEdit,];
    var __VLS_255;
    var __VLS_256;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_196;
var __VLS_197;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
