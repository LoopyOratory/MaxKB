/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api';
import RoleApi from '@/api/system/role';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { hasPermission } from "@/utils/permission";
import { EditionConst, RoleConst } from "@/utils/permission/data.ts";
const props = defineProps();
const loading = ref(false);
const tableData = ref([]);
const needDisable = computed(() => {
    const isEeOrPe = hasPermission([EditionConst.IS_EE, EditionConst.IS_PE], 'OR');
    const isAdminOrExtendAdmin = hasPermission([RoleConst.ADMIN, RoleConst.EXTENDS_ADMIN], 'OR');
    const isWorkspaceManage = hasPermission([
        RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
        RoleConst.EXTENDS_WORKSPACE_MANAGE.getWorkspaceRole,
    ], 'OR');
    if (!isEeOrPe) {
        return false;
    }
    if (isAdminOrExtendAdmin) {
        return false;
    }
    return isWorkspaceManage;
});
const disabled = computed(() => props.currentRole?.internal || needDisable.value);
function transformData(data) {
    const transformedData = [];
    data.forEach((module) => {
        module.children.forEach((feature) => {
            const perChecked = feature.permission.filter((p) => p.enable).map((p) => p.id);
            transformedData.push({
                module: module.name,
                name: feature.name,
                permission: feature.permission,
                enable: feature.enable,
                perChecked,
                indeterminate: perChecked.length > 0 && perChecked.length < feature.permission.length,
            });
        });
    });
    return transformedData;
}
async function getRolePermission() {
    if (!props.currentRole?.id)
        return;
    try {
        tableData.value = [];
        const res = await RoleApi.getRolePermissionList(props.currentRole.id, loading);
        tableData.value = transformData(res.data);
    }
    catch (error) {
        console.error(error);
    }
}
function handleCellChange(value, item, row) {
    item.enable = value;
    if (row.permission.some((p) => p.id.includes('OTHER'))) {
        return;
    }
    const readItem = row.permission.find((p) => /:READ$/.test(p.id));
    // IfChecked is not READ, thenForce READ Also check
    if (value && item.id !== readItem?.id && readItem && !readItem.enable) {
        readItem.enable = true;
    }
    else if (!value && item.id === readItem?.id) {
        // Cancel READ Entire rowOtherPermissionAllCancel
        row.permission.forEach((p) => (p.enable = false));
    }
    const checkedIds = row.permission.filter((p) => p.enable).map((p) => p.id);
    row.perChecked = checkedIds;
    row.enable = checkedIds.length === row.permission.length;
    row.indeterminate =
        checkedIds.length > 0 && checkedIds.length < row.permission.length;
}
function handleRowChange(checked, row) {
    if (checked) {
        row.permission.forEach((p) => (p.enable = true));
    }
    else {
        row.permission.forEach((p) => (p.enable = false));
    }
    row.perChecked = checked ? row.permission.map((p) => p.id) : [];
    row.indeterminate = false;
}
const allChecked = computed(() => {
    return tableData.value.length > 0 && tableData.value.every((item) => item.enable);
});
const allIndeterminate = computed(() => {
    return !allChecked.value && tableData.value.some((item) => item.enable);
});
function handleCheckAll(checked) {
    tableData.value.forEach((item) => {
        item.enable = checked;
        item.perChecked = checked ? item.permission.map((p) => p.id) : [];
        item.indeterminate = false;
        item.permission.forEach((p) => (p.enable = checked));
    });
}
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 0) {
        const sameModuleRows = tableData.value.filter((item) => item.module === row.module);
        const firstRowIndex = tableData.value.findIndex((item) => item.module === row.module);
        if (rowIndex === firstRowIndex) {
            return {
                rowspan: sameModuleRows.length,
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
watch(() => props.currentRole?.id, getRolePermission, { immediate: true });
async function handleSave() {
    try {
        const permissions = tableData.value.flatMap((row) => row.permission.map((p) => ({ id: p.id, enable: p.enable })));
        await loadPermissionApi('role').saveRolePermission(props.currentRole?.id, permissions, loading);
        MsgSuccess(t('common.saveSuccess'));
    }
    catch (error) {
        console.log(error);
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    data: (__VLS_ctx.tableData),
    border: true,
    spanMethod: (__VLS_ctx.objectSpanMethod),
    maxTableHeight: (280),
}));
const __VLS_8 = __VLS_7({
    data: (__VLS_ctx.tableData),
    border: true,
    spanMethod: (__VLS_ctx.objectSpanMethod),
    maxTableHeight: (280),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    prop: "module",
    width: (150),
    label: (__VLS_ctx.$t('views.role.permission.moduleName')),
}));
const __VLS_14 = __VLS_13({
    prop: "module",
    width: (150),
    label: (__VLS_ctx.$t('views.role.permission.moduleName')),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    prop: "name",
    width: (150),
    label: (__VLS_ctx.$t('views.role.permission.operationTarget')),
}));
const __VLS_19 = __VLS_18({
    prop: "name",
    width: (150),
    label: (__VLS_ctx.$t('views.role.permission.operationTarget')),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    prop: "permission",
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
}));
const __VLS_24 = __VLS_23({
    prop: "permission",
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
{
    const { default: __VLS_28 } = __VLS_25.slots;
    const [{ row }] = __VLS_vSlot(__VLS_28);
    for (const [item] of __VLS_vFor((row.permission))) {
        let __VLS_29;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
            ...{ 'onChange': {} },
            key: (item.id),
            modelValue: (item.enable),
            disabled: (__VLS_ctx.disabled),
        }));
        const __VLS_31 = __VLS_30({
            ...{ 'onChange': {} },
            key: (item.id),
            modelValue: (item.enable),
            disabled: (__VLS_ctx.disabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        let __VLS_34;
        const __VLS_35 = {
            /** @type {typeof __VLS_34.change} */
            onChange: ((val) => __VLS_ctx.handleCellChange(val, item, row)),
        };
        const { default: __VLS_36 } = __VLS_32.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ellipsis" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (item.name);
        // @ts-ignore
        [vLoading, loading, tableData, objectSpanMethod, $t, $t, $t, disabled, handleCellChange,];
        var __VLS_32;
        var __VLS_33;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_25;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    width: (40),
}));
const __VLS_39 = __VLS_38({
    width: (40),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
{
    const { header: __VLS_43 } = __VLS_40.slots;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.allChecked),
        indeterminate: (__VLS_ctx.allIndeterminate),
        disabled: (__VLS_ctx.disabled),
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.allChecked),
        indeterminate: (__VLS_ctx.allIndeterminate),
        disabled: (__VLS_ctx.disabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_49;
    const __VLS_50 = {
        /** @type {typeof __VLS_49.change} */
        onChange: (__VLS_ctx.handleCheckAll),
    };
    var __VLS_47;
    var __VLS_48;
    // @ts-ignore
    [disabled, allChecked, allIndeterminate, handleCheckAll,];
}
{
    const { default: __VLS_51 } = __VLS_40.slots;
    const [{ row }] = __VLS_vSlot(__VLS_51);
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onChange': {} },
        modelValue: (row.enable),
        indeterminate: (row.indeterminate),
        disabled: (__VLS_ctx.disabled),
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onChange': {} },
        modelValue: (row.enable),
        indeterminate: (row.indeterminate),
        disabled: (__VLS_ctx.disabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.change} */
        onChange: ((value) => __VLS_ctx.handleRowChange(value, row)),
    };
    var __VLS_55;
    var __VLS_56;
    // @ts-ignore
    [disabled, handleRowChange,];
}
// @ts-ignore
[];
var __VLS_40;
// @ts-ignore
[];
var __VLS_9;
// @ts-ignore
[];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "footer border-t" },
});
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.disabled),
    loading: (__VLS_ctx.loading),
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.disabled),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_64;
const __VLS_65 = {
    /** @type {typeof __VLS_64.click} */
    onClick: (__VLS_ctx.handleSave),
};
const { default: __VLS_66 } = __VLS_62.slots;
(__VLS_ctx.$t('common.save'));
// @ts-ignore
[loading, $t, disabled, handleSave,];
var __VLS_62;
var __VLS_63;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
