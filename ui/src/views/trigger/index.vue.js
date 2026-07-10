/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import useStore from '@/stores';
import triggerAPI from '@/api/trigger/trigger';
import { TriggerType } from '@/enums/trigger';
import { t } from '@/locales';
import TriggerTaskRecordDrawer from './execution-record/TriggerTaskRecordDrawer.vue';
import { datetimeFormat } from '@/utils/time';
import WorkspaceApi from '@/api/workspace/workspace';
import { resetUrl } from '@/utils/common';
import TriggerDrawer from '@/views/trigger/TriggerDrawer.vue';
import { hasPermission } from '@/utils/permission';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
const { user } = useStore();
const triggerTaskRecordDrawerRef = ref();
const triggerDrawerRef = ref();
const openCreateTriggerDrawer = () => {
    triggerDrawerRef.value?.open();
};
const openEditTriggerDrawer = (trigger) => {
    triggerDrawerRef.value?.open(trigger.id);
};
const openExecutionRecordDrawer = (trigger) => {
    triggerTaskRecordDrawerRef.value?.open(trigger.id);
};
const loading = ref(false);
const paginationConfig = ref({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const user_options = ref([]);
const search_type = ref('name');
const search_form = ref({
    name: '',
    type: '',
    task: '',
    is_active: '',
    create_user: '',
});
const search_type_change = () => {
    search_form.value = {
        name: '',
        type: '',
        task: '',
        is_active: '',
        create_user: '',
    };
};
function searchHandle() {
    paginationConfig.value.current_page = 1;
    triggerData.value = [];
    getList();
}
function deleteTrigger(row) {
    MsgConfirm(`${t('views.trigger.delete.confirmTitle')} ${row.name} ?`, ``, {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    }).then(() => {
        triggerAPI.deleteTrigger(row.id, loading).then(() => {
            MsgSuccess(t('common.deleteSuccess'));
            getList();
        });
    });
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
};
function batchChangeState(is_active) {
    const idList = [];
    multipleSelection.value.map((v) => {
        if (v) {
            idList.push(v.id);
        }
    });
    triggerAPI.activateMulTrigger({ id_list: idList, is_active: is_active }, loading).then(() => {
        const msg = is_active
            ? t('common.status.enableSuccess')
            : t('common.status.disableSuccess');
        MsgSuccess(msg);
        multipleTableRef.value?.clearSelection();
        getList();
    });
}
function batchDelete() {
    MsgConfirm(`${t('views.document.delete.confirmTitle1')} ${multipleSelection.value.length} ${t('views.trigger.delete.confirmTitle2')}`, '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    }).then(() => {
        const arr = [];
        multipleSelection.value.map((v) => {
            if (v) {
                arr.push(v.id);
            }
        });
        triggerAPI.delMulTrigger(arr, loading).then(() => {
            MsgSuccess(t('views.document.delete.successMessage'));
            multipleTableRef.value?.clearSelection();
            getList();
        });
    });
}
const triggerPermissionMap = {
    edit: () => hasPermission([
        RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
        PermissionConst.TRIGGER_EDIT.getWorkspacePermissionWorkspaceManageRole,
    ], 'OR'),
    create: () => hasPermission([
        RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
        PermissionConst.TRIGGER_CREATE.getWorkspacePermissionWorkspaceManageRole,
    ], 'OR'),
    delete: () => hasPermission([
        RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
        PermissionConst.TRIGGER_DELETE.getWorkspacePermissionWorkspaceManageRole,
    ], 'OR'),
    record: () => hasPermission([
        RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
        PermissionConst.TRIGGER_RECORD.getWorkspacePermissionWorkspaceManageRole,
    ], 'OR'),
};
async function changeState(row) {
    const obj = {
        is_active: !row.is_active,
    };
    const str = !row.is_active ? t('common.status.enableSuccess') : t('common.status.disableSuccess');
    await updateData(row.id, obj, str);
}
/**
 * UpdateState/Data
 */
function updateData(triggerId, data, msg) {
    triggerAPI
        .putTrigger(triggerId, data, loading)
        .then((res) => {
        const trigger = triggerData.value.find((v) => v.id === triggerId);
        if (trigger) {
            trigger.is_active = res.data.is_active;
        }
        MsgSuccess(msg);
        return true;
    })
        .catch(() => {
        return false;
    });
}
const multipleSelection = ref([]);
const multipleTableRef = ref();
const triggerData = ref([]);
function handleSizeChange() {
    paginationConfig.value.current_page = 1;
    getList();
}
function getList(bool) {
    const param = {};
    if (search_form.value[search_type.value]) {
        param[search_type.value] = search_form.value[search_type.value];
    }
    triggerAPI
        .pageTrigger(paginationConfig.value, param, bool ? undefined : loading)
        .then((res) => {
        triggerData.value = res.data.records;
        paginationConfig.value.total = res.data.total;
    });
}
onMounted(() => {
    getList();
    WorkspaceApi.getAllMemberList(user.getWorkspaceId(), loading).then((res) => {
        user_options.value = res.data;
    });
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "trigger-manage p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['trigger-manage']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "ml-24 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.trigger.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.triggerPermissionMap.create()) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_11;
    const __VLS_12 = {
        /** @type {typeof __VLS_11.click} */
        onClick: (__VLS_ctx.openCreateTriggerDrawer),
    };
    const { default: __VLS_13 } = __VLS_9.slots;
    (__VLS_ctx.$t('common.create'));
    // @ts-ignore
    [$t, $t, triggerPermissionMap, openCreateTriggerDrawer,];
    var __VLS_9;
    var __VLS_10;
}
if (__VLS_ctx.triggerPermissionMap.edit()) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_19;
    const __VLS_20 = {
        /** @type {typeof __VLS_19.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.triggerPermissionMap.edit()))
                throw 0;
            return __VLS_ctx.batchChangeState(true);
            // @ts-ignore
            [triggerPermissionMap, multipleSelection, batchChangeState,];
        },
    };
    const { default: __VLS_21 } = __VLS_17.slots;
    (__VLS_ctx.$t('common.status.enable'));
    // @ts-ignore
    [$t,];
    var __VLS_17;
    var __VLS_18;
}
if (__VLS_ctx.triggerPermissionMap.edit()) {
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_27;
    const __VLS_28 = {
        /** @type {typeof __VLS_27.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.triggerPermissionMap.edit()))
                throw 0;
            return __VLS_ctx.batchChangeState(false);
            // @ts-ignore
            [triggerPermissionMap, multipleSelection, batchChangeState,];
        },
    };
    const { default: __VLS_29 } = __VLS_25.slots;
    (__VLS_ctx.$t('common.status.disable'));
    // @ts-ignore
    [$t,];
    var __VLS_25;
    var __VLS_26;
}
if (__VLS_ctx.triggerPermissionMap.delete()) {
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.click} */
        onClick: (__VLS_ctx.batchDelete),
    };
    const { default: __VLS_37 } = __VLS_33.slots;
    (__VLS_ctx.$t('common.delete'));
    // @ts-ignore
    [$t, triggerPermissionMap, multipleSelection, batchDelete,];
    var __VLS_33;
    var __VLS_34;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    /** @type {typeof __VLS_43.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_45 } = __VLS_41.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}));
const __VLS_48 = __VLS_47({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: (__VLS_ctx.$t('common.type')),
    value: "type",
}));
const __VLS_53 = __VLS_52({
    label: (__VLS_ctx.$t('common.type')),
    value: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    label: (__VLS_ctx.$t('views.trigger.task')),
    value: "task",
}));
const __VLS_58 = __VLS_57({
    label: (__VLS_ctx.$t('views.trigger.task')),
    value: "task",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "is_active",
}));
const __VLS_63 = __VLS_62({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "is_active",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}));
const __VLS_68 = __VLS_67({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
// @ts-ignore
[$t, $t, $t, $t, $t, search_type, search_type_change,];
var __VLS_41;
var __VLS_42;
if (__VLS_ctx.search_type === 'name') {
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_73 = __VLS_72({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_76;
    const __VLS_77 = {
        /** @type {typeof __VLS_76.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    var __VLS_74;
    var __VLS_75;
}
else if (__VLS_ctx.search_type === 'type') {
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.type),
        filterable: true,
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_80 = __VLS_79({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.type),
        filterable: true,
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    let __VLS_83;
    const __VLS_84 = {
        /** @type {typeof __VLS_83.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    const { default: __VLS_85 } = __VLS_81.slots;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        label: (__VLS_ctx.$t('views.trigger.type.scheduled')),
        value: "SCHEDULED",
    }));
    const __VLS_88 = __VLS_87({
        label: (__VLS_ctx.$t('views.trigger.type.scheduled')),
        value: "SCHEDULED",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        label: (__VLS_ctx.$t('views.trigger.type.event')),
        value: "EVENT",
    }));
    const __VLS_93 = __VLS_92({
        label: (__VLS_ctx.$t('views.trigger.type.event')),
        value: "EVENT",
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    // @ts-ignore
    [$t, $t, $t, search_type, search_type, search_form, search_form, searchHandle, searchHandle,];
    var __VLS_81;
    var __VLS_82;
}
else if (__VLS_ctx.search_type === 'is_active') {
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.is_active),
        filterable: true,
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.is_active),
        filterable: true,
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_101;
    const __VLS_102 = {
        /** @type {typeof __VLS_101.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    const { default: __VLS_103 } = __VLS_99.slots;
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        label: (__VLS_ctx.$t('common.status.enabled')),
        value: "true",
    }));
    const __VLS_106 = __VLS_105({
        label: (__VLS_ctx.$t('common.status.enabled')),
        value: "true",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
        label: (__VLS_ctx.$t('common.status.disabled')),
        value: "false",
    }));
    const __VLS_111 = __VLS_110({
        label: (__VLS_ctx.$t('common.status.disabled')),
        value: "false",
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    // @ts-ignore
    [$t, $t, search_type, search_form, searchHandle,];
    var __VLS_99;
    var __VLS_100;
}
else if (__VLS_ctx.search_type === 'create_user') {
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_116 = __VLS_115({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    let __VLS_119;
    const __VLS_120 = {
        /** @type {typeof __VLS_119.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    const { default: __VLS_121 } = __VLS_117.slots;
    for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
        let __VLS_122;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }));
        const __VLS_124 = __VLS_123({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_123));
        // @ts-ignore
        [search_type, search_form, searchHandle, user_options,];
    }
    // @ts-ignore
    [];
    var __VLS_117;
    var __VLS_118;
}
if (__VLS_ctx.search_type === 'task') {
    let __VLS_127;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.task),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.task),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_132;
    const __VLS_133 = {
        /** @type {typeof __VLS_132.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    var __VLS_130;
    var __VLS_131;
}
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.triggerData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    rowKey: ((row) => row.id),
    maxTableHeight: (300),
}));
const __VLS_136 = __VLS_135({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.triggerData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    rowKey: ((row) => row.id),
    maxTableHeight: (300),
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
let __VLS_139;
const __VLS_140 = {
    /** @type {typeof __VLS_139.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_141 = {
    /** @type {typeof __VLS_139.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_142 = {
    /** @type {typeof __VLS_139.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_143;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_145 } = __VLS_137.slots;
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}));
const __VLS_148 = __VLS_147({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    prop: "name",
    label: (__VLS_ctx.multipleSelection.length === 0 ? __VLS_ctx.$t('common.name') : `${__VLS_ctx.$t('common.selected')} ${__VLS_ctx.multipleSelection.length} ${__VLS_ctx.$t('views.document.items')}`),
    showOverflowTooltip: true,
    width: "220",
}));
const __VLS_153 = __VLS_152({
    prop: "name",
    label: (__VLS_ctx.multipleSelection.length === 0 ? __VLS_ctx.$t('common.name') : `${__VLS_ctx.$t('common.selected')} ${__VLS_ctx.multipleSelection.length} ${__VLS_ctx.$t('views.document.items')}`),
    showOverflowTooltip: true,
    width: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
const { default: __VLS_156 } = __VLS_154.slots;
{
    const { default: __VLS_157 } = __VLS_154.slots;
    const [{ row }] = __VLS_vSlot(__VLS_157);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_158;
    /** @ts-ignore @type { | typeof __VLS_components.TriggerIcon} */
    TriggerIcon;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
        type: (row.trigger_type),
        ...{ class: "mr-8" },
        size: (24),
    }));
    const __VLS_160 = __VLS_159({
        type: (row.trigger_type),
        ...{ class: "mr-8" },
        size: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.name);
    // @ts-ignore
    [$t, $t, $t, $t, multipleSelection, multipleSelection, search_type, search_form, searchHandle, triggerData, paginationConfig, handleSizeChange, getList, handleSelectionChange, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_154;
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    prop: "trigger_type",
    label: (__VLS_ctx.$t('common.type')),
    width: "120",
}));
const __VLS_165 = __VLS_164({
    prop: "trigger_type",
    label: (__VLS_ctx.$t('common.type')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
const { default: __VLS_168 } = __VLS_166.slots;
{
    const { default: __VLS_169 } = __VLS_166.slots;
    const [{ row }] = __VLS_vSlot(__VLS_169);
    (__VLS_ctx.$t(__VLS_ctx.TriggerType[row.trigger_type]));
    // @ts-ignore
    [$t, $t, TriggerType, TriggerType,];
}
// @ts-ignore
[];
var __VLS_166;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    prop: "is_active",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "120",
}));
const __VLS_172 = __VLS_171({
    prop: "is_active",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
const { default: __VLS_175 } = __VLS_173.slots;
{
    const { default: __VLS_176 } = __VLS_173.slots;
    const [{ row }] = __VLS_vSlot(__VLS_176);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_177;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_179 = __VLS_178({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_178));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_182 } = __VLS_180.slots;
        let __VLS_183;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({}));
        const __VLS_185 = __VLS_184({}, ...__VLS_functionalComponentArgsRest(__VLS_184));
        // @ts-ignore
        [$t,];
        var __VLS_180;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.enabled'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_188;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_190 = __VLS_189({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.disabled'));
    }
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_173;
let __VLS_193;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    prop: "desc",
    label: (__VLS_ctx.$t('common.desc')),
    showOverflowTooltip: true,
    minWidth: "170",
}));
const __VLS_195 = __VLS_194({
    prop: "desc",
    label: (__VLS_ctx.$t('common.desc')),
    showOverflowTooltip: true,
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    prop: "next_run_time",
    label: (__VLS_ctx.$t('views.trigger.nextTime')),
    width: "175",
}));
const __VLS_200 = __VLS_199({
    prop: "next_run_time",
    label: (__VLS_ctx.$t('views.trigger.nextTime')),
    width: "175",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const { default: __VLS_203 } = __VLS_201.slots;
{
    const { default: __VLS_204 } = __VLS_201.slots;
    const [{ row }] = __VLS_vSlot(__VLS_204);
    (__VLS_ctx.datetimeFormat(row.next_run_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_201;
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
    prop: "trigger_task",
    label: (__VLS_ctx.$t('views.trigger.task')),
    width: "150",
}));
const __VLS_207 = __VLS_206({
    prop: "trigger_task",
    label: (__VLS_ctx.$t('views.trigger.task')),
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
const { default: __VLS_210 } = __VLS_208.slots;
{
    const { default: __VLS_211 } = __VLS_208.slots;
    const [{ row }] = __VLS_vSlot(__VLS_211);
    let __VLS_212;
    /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
    elPopover;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
        placement: "top-start",
        popperStyle: ({ width: 'auto', maxWidth: '300px' }),
        persistent: (false),
    }));
    const __VLS_214 = __VLS_213({
        placement: "top-start",
        popperStyle: ({ width: 'auto', maxWidth: '300px' }),
        persistent: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    const { default: __VLS_217 } = __VLS_215.slots;
    {
        const { reference: __VLS_218 } = __VLS_215.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        if (row.trigger_task.filter((item) => item.type === 'APPLICATION').length) {
            let __VLS_219;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
                size: "small",
                ...{ class: "info-tag mr-8 cursor" },
            }));
            const __VLS_221 = __VLS_220({
                size: "small",
                ...{ class: "info-tag mr-8 cursor" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_220));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            const { default: __VLS_224 } = __VLS_222.slots;
            (__VLS_ctx.$t('views.application.title'));
            (row.trigger_task.filter((item) => item.type === 'APPLICATION').length);
            // @ts-ignore
            [$t, $t,];
            var __VLS_222;
        }
        if (row.trigger_task.filter((item) => item.type === 'TOOL').length) {
            let __VLS_225;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
                size: "small",
                ...{ class: "info-tag cursor" },
            }));
            const __VLS_227 = __VLS_226({
                size: "small",
                ...{ class: "info-tag cursor" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_226));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            const { default: __VLS_230 } = __VLS_228.slots;
            (__VLS_ctx.$t('views.tool.title'));
            (row.trigger_task.filter((item) => item.type === 'TOOL').length);
            // @ts-ignore
            [$t,];
            var __VLS_228;
        }
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (row.trigger_task.filter((item) => item.type === 'APPLICATION').length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "color-input-placeholder" },
        });
        /** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
        (__VLS_ctx.$t('views.application.title'));
        (row.trigger_task.filter((item) => item.type === 'APPLICATION').length);
        for (const [item] of __VLS_vFor((row.trigger_task.filter((item) => item.type === 'APPLICATION')))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                key: (item.id),
                ...{ class: "flex align-center mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            let __VLS_231;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_233 = __VLS_232({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_232));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_236 } = __VLS_234.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(item?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                alt: "",
            });
            // @ts-ignore
            [$t, resetUrl, resetUrl,];
            var __VLS_234;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis-1" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (item.name);
            // @ts-ignore
            [];
        }
    }
    if (row.trigger_task.filter((item) => item.type === 'APPLICATION')
        .length &&
        row.trigger_task.filter((item) => item.type === 'TOOL').length) {
        let __VLS_237;
        /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
        elDivider;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
            ...{ class: "mt-8 mb-8" },
        }));
        const __VLS_239 = __VLS_238({
            ...{ class: "mt-8 mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    }
    if (row.trigger_task.filter((item) => item.type === 'TOOL').length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "color-input-placeholder" },
        });
        /** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
        (__VLS_ctx.$t('views.tool.title'));
        (row.trigger_task.filter((item) => item.type === 'TOOL').length);
        for (const [item] of __VLS_vFor((row.trigger_task.filter((item) => item.type === 'TOOL')))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                key: (item.id),
                ...{ class: "flex align-center mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            if (item?.icon) {
                let __VLS_242;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_244 = __VLS_243({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_243));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_247 } = __VLS_245.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(item?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [$t, resetUrl,];
                var __VLS_245;
            }
            else {
                let __VLS_248;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
                    size: (20),
                    type: (item?.tool_type),
                    ...{ class: "mr-8" },
                }));
                const __VLS_250 = __VLS_249({
                    size: (20),
                    type: (item?.tool_type),
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_249));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis-1" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (item.name);
            // @ts-ignore
            [];
        }
    }
    // @ts-ignore
    [];
    var __VLS_215;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_208;
let __VLS_253;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
    prop: "create_user",
    label: (__VLS_ctx.$t('common.creator')),
    width: "130",
}));
const __VLS_255 = __VLS_254({
    prop: "create_user",
    label: (__VLS_ctx.$t('common.creator')),
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
let __VLS_258;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "175",
    sortable: true,
}));
const __VLS_260 = __VLS_259({
    prop: "create_time",
    label: (__VLS_ctx.$t('common.createTime')),
    width: "175",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
const { default: __VLS_263 } = __VLS_261.slots;
{
    const { default: __VLS_264 } = __VLS_261.slots;
    const [{ row }] = __VLS_vSlot(__VLS_264);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_261;
let __VLS_265;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
    align: "left",
    width: "160",
    fixed: "right",
    label: (__VLS_ctx.$t('common.operation')),
}));
const __VLS_267 = __VLS_266({
    align: "left",
    width: "160",
    fixed: "right",
    label: (__VLS_ctx.$t('common.operation')),
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
const { default: __VLS_270 } = __VLS_268.slots;
{
    const { default: __VLS_271 } = __VLS_268.slots;
    const [{ row }] = __VLS_vSlot(__VLS_271);
    if (__VLS_ctx.triggerPermissionMap.edit()) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ onClick: () => { } },
        });
        let __VLS_272;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
            beforeChange: (() => __VLS_ctx.changeState(row)),
            loading: (__VLS_ctx.loading),
            size: "small",
            modelValue: (row.is_active),
        }));
        const __VLS_274 = __VLS_273({
            beforeChange: (() => __VLS_ctx.changeState(row)),
            loading: (__VLS_ctx.loading),
            size: "small",
            modelValue: (row.is_active),
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    }
    let __VLS_277;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent1(__VLS_277, new __VLS_277({
        direction: "vertical",
    }));
    const __VLS_279 = __VLS_278({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    let __VLS_282;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_283 = __VLS_asFunctionalComponent1(__VLS_282, new __VLS_282({
        effect: "dark",
        content: (__VLS_ctx.$t('common.edit')),
        placement: "top",
    }));
    const __VLS_284 = __VLS_283({
        effect: "dark",
        content: (__VLS_ctx.$t('common.edit')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_283));
    const { default: __VLS_287 } = __VLS_285.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_288;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_290 = __VLS_289({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    let __VLS_293;
    const __VLS_294 = {
        /** @type {typeof __VLS_293.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openEditTriggerDrawer(row);
            // @ts-ignore
            [$t, $t, triggerPermissionMap, loading, changeState, openEditTriggerDrawer,];
        },
    };
    const { default: __VLS_295 } = __VLS_291.slots;
    let __VLS_296;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
        iconName: "app-edit",
    }));
    const __VLS_298 = __VLS_297({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    // @ts-ignore
    [];
    var __VLS_291;
    var __VLS_292;
    // @ts-ignore
    [];
    var __VLS_285;
    if (__VLS_ctx.triggerPermissionMap.record()) {
        let __VLS_301;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
            effect: "dark",
            content: (__VLS_ctx.$t('common.ExecutionRecord.title')),
            placement: "top",
        }));
        const __VLS_303 = __VLS_302({
            effect: "dark",
            content: (__VLS_ctx.$t('common.ExecutionRecord.title')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_302));
        const { default: __VLS_306 } = __VLS_304.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_307;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_308 = __VLS_asFunctionalComponent1(__VLS_307, new __VLS_307({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_309 = __VLS_308({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_308));
        let __VLS_312;
        const __VLS_313 = {
            /** @type {typeof __VLS_312.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.triggerPermissionMap.record()))
                    throw 0;
                return __VLS_ctx.openExecutionRecordDrawer(row);
                // @ts-ignore
                [$t, triggerPermissionMap, openExecutionRecordDrawer,];
            },
        };
        const { default: __VLS_314 } = __VLS_310.slots;
        let __VLS_315;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_316 = __VLS_asFunctionalComponent1(__VLS_315, new __VLS_315({
            iconName: "app-schedule-report",
        }));
        const __VLS_317 = __VLS_316({
            iconName: "app-schedule-report",
        }, ...__VLS_functionalComponentArgsRest(__VLS_316));
        // @ts-ignore
        [];
        var __VLS_310;
        var __VLS_311;
        // @ts-ignore
        [];
        var __VLS_304;
    }
    if (__VLS_ctx.triggerPermissionMap.delete()) {
        let __VLS_320;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_321 = __VLS_asFunctionalComponent1(__VLS_320, new __VLS_320({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }));
        const __VLS_322 = __VLS_321({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_321));
        const { default: __VLS_325 } = __VLS_323.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        let __VLS_326;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_328 = __VLS_327({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_327));
        let __VLS_331;
        const __VLS_332 = {
            /** @type {typeof __VLS_331.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.triggerPermissionMap.delete()))
                    throw 0;
                return __VLS_ctx.deleteTrigger(row);
                // @ts-ignore
                [$t, triggerPermissionMap, deleteTrigger,];
            },
        };
        const { default: __VLS_333 } = __VLS_329.slots;
        let __VLS_334;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
            iconName: "app-delete",
        }));
        const __VLS_336 = __VLS_335({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_335));
        // @ts-ignore
        [];
        var __VLS_329;
        var __VLS_330;
        // @ts-ignore
        [];
        var __VLS_323;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_268;
// @ts-ignore
[];
var __VLS_137;
var __VLS_138;
// @ts-ignore
[];
var __VLS_3;
const __VLS_339 = TriggerDrawer || TriggerDrawer;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
    ...{ 'onRefresh': {} },
    ref: "triggerDrawerRef",
}));
const __VLS_341 = __VLS_340({
    ...{ 'onRefresh': {} },
    ref: "triggerDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_340));
let __VLS_344;
const __VLS_345 = {
    /** @type {typeof __VLS_344.refresh} */
    onRefresh: (...[$event]) => {
        return __VLS_ctx.getList();
        // @ts-ignore
        [getList,];
    },
};
var __VLS_346;
var __VLS_342;
var __VLS_343;
const __VLS_348 = TriggerTaskRecordDrawer || TriggerTaskRecordDrawer;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent1(__VLS_348, new __VLS_348({
    ref: "triggerTaskRecordDrawerRef",
}));
const __VLS_350 = __VLS_349({
    ref: "triggerTaskRecordDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
var __VLS_353;
var __VLS_351;
// @ts-ignore
var __VLS_144 = __VLS_143, __VLS_347 = __VLS_346, __VLS_354 = __VLS_353;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
