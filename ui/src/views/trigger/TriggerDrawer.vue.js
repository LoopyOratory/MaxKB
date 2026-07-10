/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { v4 as uuidv4 } from 'uuid';
import { ref, computed, onMounted, reactive } from 'vue';
import { copyClick } from '@/utils/clipboard';
import ApplicationDialog from '@/views/application/component/ApplicationDialog.vue';
import ToolDialog from '@/views/application/component/ToolDialog.vue';
import triggerAPI from '@/api/trigger/trigger';
import systemManageTriggerAPI from '@/api/system-resource-management/trigger';
import ToolParameter from '@/views/trigger/component/ToolParameter.vue';
import ApplicationParameter from '@/views/trigger/component/ApplicationParameter.vue';
import { resetUrl } from '@/utils/common.ts';
import { triggerCycleOptions } from '@/utils/trigger.ts';
import { t } from '@/locales';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash';
import { isValidCron } from 'cron-validator';
import { hasPermission } from '@/utils/permission';
import permissionMap from '@/permission';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const emit = defineEmits(['refresh']);
const props = withDefaults(defineProps(), {
    createTrigger: triggerAPI.postTrigger,
    editTrigger: triggerAPI.putTrigger,
    resourceType: '',
});
const collapseData = reactive({
    tool: true,
    agent: true,
});
const showTast = ref('');
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap[current_source_type.value?.toLocaleLowerCase()][apiType.value];
});
const editPermission = computed(() => {
    if (current_source_id.value && current_source_type.value) {
        return permissionPrecise.value.trigger_edit(current_source_id.value);
    }
    else {
        return hasPermission([
            RoleConst.WORKSPACE_MANAGE.getWorkspaceRole,
            PermissionConst.TRIGGER_EDIT.getWorkspacePermissionWorkspaceManageRole,
        ], 'OR');
    }
});
const triggerFormRef = ref();
const getDefaultValue = () => {
    return {
        id: uuidv4(),
        name: '',
        desc: '',
        trigger_task: [],
        trigger_type: 'SCHEDULED',
        trigger_setting: {
            token: uuidv4().replace(/-/g, ''),
            body: [],
        },
    };
};
const form = ref(getDefaultValue());
const is_edit = ref(false);
const event_url = computed(() => {
    return `${window.origin}${window.MaxKB.prefix}/api/trigger/v1/webhook/${form.value.id}`;
});
const lastPresetSetting = ref(null);
const cronError = ref('');
const validateCron = () => {
    const cron = form.value.trigger_setting.cron_expression?.trim();
    if (!cron) {
        cronError.value = '';
        return;
    }
    const fields = cron.split(/\s+/);
    if (fields.length !== 5 || !isValidCron(cron)) {
        cronError.value = t('views.application.longTermMemory.cronExpressionInvalid');
    }
    else {
        cronError.value = '';
    }
};
function switchScheduleType() {
    const currentType = form.value.trigger_setting.schedule_type || 'daily';
    const isCron = currentType === 'cron';
    if (!isCron) {
        lastPresetSetting.value = cloneDeep({
            schedule_type: form.value.trigger_setting.schedule_type,
            interval_unit: form.value.trigger_setting.interval_unit,
            interval_value: form.value.trigger_setting.interval_value,
            days: form.value.trigger_setting.days,
            time: form.value.trigger_setting.time,
        });
        form.value.trigger_setting.schedule_type = 'cron';
        form.value.trigger_setting.interval_unit = undefined;
        form.value.trigger_setting.interval_value = undefined;
        form.value.trigger_setting.days = undefined;
        form.value.trigger_setting.time = undefined;
        return;
    }
    cronError.value = '';
    const backup = lastPresetSetting.value;
    form.value.trigger_setting.schedule_type = backup?.schedule_type || 'daily';
    form.value.trigger_setting.interval_unit = backup?.interval_unit;
    form.value.trigger_setting.interval_value = backup?.interval_value;
    form.value.trigger_setting.days = backup?.days;
    form.value.trigger_setting.time = backup?.time;
}
const addParameter = () => {
    form.value.trigger_setting.body.push({ field: '', type: '' });
};
const delParameter = (index) => {
    form.value.trigger_setting.body.splice(index, 1);
};
const handleChangeScheduled = (v) => {
    scheduled.value = v;
};
const changeTriggerType = (type) => {
    form.value.trigger_type = type;
};
const applicationDetailsDict = ref({});
const toolDetailsDict = ref({});
const applicationRefresh = (application_selected) => {
    const application_list = application_selected.application_ids;
    const existApplicationIds = Object.keys(applicationDetailsDict);
    application_list
        .filter((id) => !existApplicationIds.includes(id))
        .map((id) => {
        return loadSharedApi({ type: 'application', systemType: apiType.value })
            .getApplicationDetail(id)
            .then((ok) => {
            applicationDetailsDict.value[ok.data.id] = ok.data;
        });
    });
    const task_source_id_list = form.value.trigger_task
        .filter((task) => task.source_type === 'APPLICATION')
        .map((task) => task.source_id);
    application_list
        .filter((id) => !task_source_id_list.includes(id))
        .forEach((id) => {
        form.value.trigger_task.push({
            source_type: 'APPLICATION',
            source_id: id,
            is_active: false,
            parameter: {},
        });
    });
    showTast.value = 'agent0';
};
const applicationTask = computed(() => {
    return form.value.trigger_task.filter((task) => task.source_type === 'APPLICATION');
});
const toolTask = computed(() => {
    return form.value.trigger_task.filter((task) => task.source_type === 'TOOL');
});
const deleteTask = (task) => {
    form.value.trigger_task = form.value.trigger_task.filter((t) => !(t.source_type === task.source_type && t.source_id === task.source_id));
};
const applicationParameterRef = ref();
const toolParameterRef = ref();
const toolRefresh = (tool_selected) => {
    const tool_ids = tool_selected.tool_ids;
    const existToolIds = Object.keys(toolDetailsDict);
    tool_ids
        .filter((id) => !existToolIds.includes(id))
        .map((id) => {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .getToolById(id)
            .then((ok) => {
            toolDetailsDict.value[ok.data.id] = ok.data;
        });
    });
    const task_source_id_list = form.value.trigger_task
        .filter((task) => task.source_type === 'TOOL')
        .map((task) => task.source_id);
    tool_ids
        .filter((id) => !task_source_id_list.includes(id))
        .forEach((id) => {
        form.value.trigger_task.push({
            source_type: 'TOOL',
            source_id: id,
            is_active: false,
            parameter: {},
        });
    });
    showTast.value = 'tool0';
};
const applicationDialogRef = ref();
const toolDialogRef = ref();
const openApplicationDialog = () => {
    const application_id_list = form.value.trigger_task
        .filter((task) => task.source_type === 'APPLICATION')
        .map((task) => task.source_id);
    applicationDialogRef.value?.open(application_id_list);
};
const openToolDialog = () => {
    const tool_id_list = form.value.trigger_task
        .filter((task) => task.source_type === 'TOOL')
        .map((task) => task.source_id);
    toolDialogRef.value?.open(tool_id_list);
};
const drawer = ref(false);
const scheduled = computed({
    get: () => {
        const schedule_type = form.value.trigger_setting.schedule_type;
        if (schedule_type) {
            if (schedule_type === 'interval') {
                const interval_value = form.value.trigger_setting.interval_value;
                const interval_unit = form.value.trigger_setting.interval_unit;
                return [schedule_type, interval_unit, interval_value].filter((item) => item !== undefined);
            }
            else {
                const days = form.value.trigger_setting.days
                    ? form.value.trigger_setting.days[0]
                    : undefined;
                const time = form.value.trigger_setting.time
                    ? form.value.trigger_setting.time[0]
                    : undefined;
                if (schedule_type == 'daily') {
                    return [schedule_type, time].filter((item) => item !== undefined);
                }
                return [schedule_type, days, time].filter((item) => item !== undefined);
            }
        }
        return [];
    },
    set: (value) => {
        const schedule_type = value[0];
        form.value.trigger_setting.schedule_type = schedule_type;
        if (schedule_type == 'interval') {
            form.value.trigger_setting.interval_unit = value[1];
            form.value.trigger_setting.interval_value = value[2];
        }
        else {
            if (schedule_type == 'daily') {
                form.value.trigger_setting.time = [value[1]];
            }
            else {
                form.value.trigger_setting.days = [value[1]];
                form.value.trigger_setting.time = [value[2]];
            }
        }
    },
});
const init = (trigger_id) => {
    if (current_source_id.value && current_source_type.value) {
        let api;
        if (apiType.value === 'workspace') {
            api = triggerAPI.getResourceTriggerDetail(current_source_type.value, current_source_id.value, trigger_id);
        }
        else {
            api = systemManageTriggerAPI.getResourceTriggerDetail(current_source_type.value, current_source_id.value, trigger_id);
        }
        api.then((ok) => {
            form.value = { ...ok.data, trigger_task: [ok.data.trigger_task] };
            applicationDetailsDict.value = { [ok.data.application_task.id]: ok.data.application_task };
            toolDetailsDict.value = { [ok.data.tool_task.id]: ok.data.tool_task };
        });
    }
    else {
        triggerAPI.getTriggerDetail(trigger_id).then((ok) => {
            form.value = ok.data;
            applicationDetailsDict.value = (ok.data.application_task_list || [])
                .map((item) => ({ [item.id]: item }))
                .reduce((x, y) => ({ ...x, ...y }), {});
            toolDetailsDict.value = (ok.data.tool_task_list || [])
                .map((item) => ({ [item.id]: item }))
                .reduce((x, y) => ({ ...x, ...y }), {});
        });
    }
};
function refreshToken() {
    form.value.trigger_setting.token = uuidv4().replace(/-/g, '');
}
const current_trigger_id = ref();
const current_source_id = ref();
const current_source_type = ref();
const open = (trigger_id, source_type, source_id) => {
    is_edit.value = trigger_id ? true : false;
    current_trigger_id.value = trigger_id;
    drawer.value = true;
    if (source_type && source_id) {
        current_source_type.value = source_type;
        current_source_id.value = source_id;
        if (source_type == 'APPLICATION') {
            applicationRefresh({ application_ids: [source_id] });
        }
        if (source_type == 'TOOL') {
            toolRefresh({ tool_ids: [source_id] });
        }
    }
    if (trigger_id) {
        init(trigger_id);
    }
};
const close = () => {
    cronError.value = '';
    current_source_id.value = undefined;
    current_source_type.value = undefined;
    drawer.value = false;
    form.value = getDefaultValue();
};
const submit = () => {
    if (form.value.trigger_type === 'SCHEDULED' &&
        form.value.trigger_setting.schedule_type === 'cron') {
        validateCron();
        if (cronError.value)
            return;
    }
    Promise.all([
        ...(toolParameterRef.value ? toolParameterRef.value.map((item) => item.validate()) : []),
        ...(applicationParameterRef.value
            ? applicationParameterRef.value.map((item) => item.validate())
            : []),
        triggerFormRef.value?.validate(),
    ]).then((ok) => {
        if (is_edit.value) {
            if (current_trigger_id.value) {
                props.editTrigger(current_trigger_id.value, form.value).then((ok) => {
                    close();
                    emit('refresh');
                });
            }
        }
        else {
            props.createTrigger(form.value).then((ok) => {
                close();
                emit('refresh');
            });
        }
    });
};
onMounted(() => { });
const __VLS_exposed = { open, close };
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    createTrigger: triggerAPI.postTrigger,
    editTrigger: triggerAPI.putTrigger,
    resourceType: '',
};
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
    modelValue: (__VLS_ctx.drawer),
    title: (__VLS_ctx.is_edit ? __VLS_ctx.$t('views.trigger.editTrigger') : __VLS_ctx.$t('views.trigger.createTrigger')),
    size: "600",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawer),
    title: (__VLS_ctx.is_edit ? __VLS_ctx.$t('views.trigger.editTrigger') : __VLS_ctx.$t('views.trigger.createTrigger')),
    size: "600",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    model: (__VLS_ctx.form),
    labelWidth: "auto",
    ref: "triggerFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "mb-24" },
}));
const __VLS_9 = __VLS_8({
    model: (__VLS_ctx.form),
    labelWidth: "auto",
    ref: "triggerFormRef",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "mb-24" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    label: (__VLS_ctx.$t('views.trigger.from.triggerName.label')),
    prop: "name",
    rules: ({
        message: __VLS_ctx.$t('views.trigger.from.triggerName.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.trigger.from.triggerName.label')),
    prop: "name",
    rules: ({
        message: __VLS_ctx.$t('views.trigger.from.triggerName.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.trigger.from.triggerName.placeholder')),
    showWordLimit: true,
}));
const __VLS_23 = __VLS_22({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.trigger.from.triggerName.placeholder')),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    /** @type {typeof __VLS_26.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.name = __VLS_ctx.form.name?.trim();
        // @ts-ignore
        [drawer, is_edit, $t, $t, $t, $t, $t, close, form, form, form, form,];
    },
};
var __VLS_24;
var __VLS_25;
// @ts-ignore
[];
var __VLS_18;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, $t, form,];
var __VLS_31;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    label: (__VLS_ctx.$t('common.type')),
    prop: "trigger_type",
    rules: ({
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_41 = __VLS_40({
    label: (__VLS_ctx.$t('common.type')),
    prop: "trigger_type",
    rules: ({
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "mb-16 w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'SCHEDULED' ? 'border-active' : '') },
}));
const __VLS_47 = __VLS_46({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "mb-16 w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'SCHEDULED' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_50;
const __VLS_51 = {
    /** @type {typeof __VLS_50.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.changeTriggerType('SCHEDULED');
        // @ts-ignore
        [$t, $t, form, changeTriggerType,];
    },
};
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_52 } = __VLS_48.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center line-height-22" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    shape: "square",
    size: (32),
}));
const __VLS_55 = __VLS_54({
    shape: "square",
    size: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_58 } = __VLS_56.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/trigger/icon_scheduled.svg",
    ...{ style: {} },
    alt: "",
});
// @ts-ignore
[];
var __VLS_56;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-12" },
});
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({});
(__VLS_ctx.$t('views.trigger.type.scheduled'));
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    type: "info",
    ...{ class: "color-secondary font-small" },
}));
const __VLS_61 = __VLS_60({
    type: "info",
    ...{ class: "color-secondary font-small" },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-small']} */ ;
const { default: __VLS_64 } = __VLS_62.slots;
(__VLS_ctx.$t('views.trigger.type.scheduledDesc'));
// @ts-ignore
[$t, $t,];
var __VLS_62;
if (__VLS_ctx.form.trigger_type === 'SCHEDULED') {
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        shadow: "never",
        ...{ class: "card-never mt-16 w-full" },
    }));
    const __VLS_67 = __VLS_66({
        shadow: "never",
        ...{ class: "card-never mt-16 w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_70 } = __VLS_68.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ style: {} },
    });
    (__VLS_ctx.form.trigger_setting.schedule_type === 'cron'
        ? __VLS_ctx.$t('views.trigger.triggerCycle.cronExpression')
        : __VLS_ctx.$t('views.trigger.triggerCycle.title'));
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        content: (__VLS_ctx.form.trigger_setting.schedule_type === 'cron'
            ? __VLS_ctx.$t('views.trigger.triggerCycle.switchCycle')
            : __VLS_ctx.$t('views.trigger.triggerCycle.switchCron')),
        placement: "top",
        effect: "light",
    }));
    const __VLS_73 = __VLS_72({
        content: (__VLS_ctx.form.trigger_setting.schedule_type === 'cron'
            ? __VLS_ctx.$t('views.trigger.triggerCycle.switchCycle')
            : __VLS_ctx.$t('views.trigger.triggerCycle.switchCron')),
        placement: "top",
        effect: "light",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    const { default: __VLS_76 } = __VLS_74.slots;
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_79 = __VLS_78({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_82;
    const __VLS_83 = {
        /** @type {typeof __VLS_82.click} */
        onClick: (__VLS_ctx.switchScheduleType),
    };
    const { default: __VLS_84 } = __VLS_80.slots;
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({}));
    const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
    const { default: __VLS_90 } = __VLS_88.slots;
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.Switch} */
    Switch;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({}));
    const __VLS_93 = __VLS_92({}, ...__VLS_functionalComponentArgsRest(__VLS_92));
    // @ts-ignore
    [$t, $t, $t, $t, form, form, form, switchScheduleType,];
    var __VLS_88;
    // @ts-ignore
    [];
    var __VLS_80;
    var __VLS_81;
    // @ts-ignore
    [];
    var __VLS_74;
    if (__VLS_ctx.form.trigger_setting.schedule_type !== 'cron') {
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.elCascader | typeof __VLS_components.ElCascader | typeof __VLS_components['el-cascader']} */
        elCascader;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.scheduled),
            options: (__VLS_ctx.triggerCycleOptions),
            ...{ style: {} },
        }));
        const __VLS_98 = __VLS_97({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.scheduled),
            options: (__VLS_ctx.triggerCycleOptions),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        let __VLS_101;
        const __VLS_102 = {
            /** @type {typeof __VLS_101.change} */
            onChange: (__VLS_ctx.handleChangeScheduled),
        };
        var __VLS_99;
        var __VLS_100;
    }
    else {
        let __VLS_103;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
            ...{ 'onBlur': {} },
            ...{ 'onInput': {} },
            modelValue: (__VLS_ctx.form.trigger_setting.cron_expression),
            placeholder: (__VLS_ctx.t('views.trigger.triggerCycle.placeholder')),
            clearable: true,
        }));
        const __VLS_105 = __VLS_104({
            ...{ 'onBlur': {} },
            ...{ 'onInput': {} },
            modelValue: (__VLS_ctx.form.trigger_setting.cron_expression),
            placeholder: (__VLS_ctx.t('views.trigger.triggerCycle.placeholder')),
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        let __VLS_108;
        const __VLS_109 = {
            /** @type {typeof __VLS_108.blur} */
            onBlur: (__VLS_ctx.validateCron),
        };
        const __VLS_110 = {
            /** @type {typeof __VLS_108.input} */
            onInput: (__VLS_ctx.validateCron),
        };
        var __VLS_106;
        var __VLS_107;
    }
    if (__VLS_ctx.cronError) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "el-form-item__error" },
        });
        /** @type {__VLS_StyleScopedClasses['el-form-item__error']} */ ;
        (__VLS_ctx.cronError);
    }
    // @ts-ignore
    [form, form, scheduled, triggerCycleOptions, handleChangeScheduled, t, validateCron, validateCron, cronError, cronError,];
    var __VLS_68;
}
// @ts-ignore
[];
var __VLS_48;
var __VLS_49;
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'EVENT' ? 'border-active' : '') },
}));
const __VLS_113 = __VLS_112({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'EVENT' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_116;
const __VLS_117 = {
    /** @type {typeof __VLS_116.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.changeTriggerType('EVENT');
        // @ts-ignore
        [form, changeTriggerType,];
    },
};
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_118 } = __VLS_114.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center line-height-22" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    shape: "square",
    ...{ class: "avatar-orange" },
    size: (32),
}));
const __VLS_121 = __VLS_120({
    shape: "square",
    ...{ class: "avatar-orange" },
    size: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
/** @type {__VLS_StyleScopedClasses['avatar-orange']} */ ;
const { default: __VLS_124 } = __VLS_122.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/trigger/icon_event.svg",
    ...{ style: {} },
    alt: "",
});
// @ts-ignore
[];
var __VLS_122;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-12" },
});
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({});
(__VLS_ctx.$t('views.trigger.type.event'));
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    type: "info",
    ...{ class: "color-secondary font-small" },
}));
const __VLS_127 = __VLS_126({
    type: "info",
    ...{ class: "color-secondary font-small" },
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-small']} */ ;
const { default: __VLS_130 } = __VLS_128.slots;
(__VLS_ctx.$t('views.trigger.type.eventDesc'));
// @ts-ignore
[$t, $t,];
var __VLS_128;
if (__VLS_ctx.form.trigger_type === 'EVENT') {
    let __VLS_131;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
        shadow: "never",
        ...{ class: "card-never mt-16" },
    }));
    const __VLS_133 = __VLS_132({
        shadow: "never",
        ...{ class: "card-never mt-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_136 } = __VLS_134.slots;
    let __VLS_137;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
        label: (__VLS_ctx.$t('views.trigger.from.event_url.label')),
    }));
    const __VLS_139 = __VLS_138({
        label: (__VLS_ctx.$t('views.trigger.from.event_url.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    const { default: __VLS_142 } = __VLS_140.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "complex-input flex-between align-center w-full" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['complex-input']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_143;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
        ...{ class: "complex-input__left" },
        modelValue: (__VLS_ctx.event_url),
        readonly: true,
    }));
    const __VLS_145 = __VLS_144({
        ...{ class: "complex-input__left" },
        modelValue: (__VLS_ctx.event_url),
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    /** @type {__VLS_StyleScopedClasses['complex-input__left']} */ ;
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        content: (__VLS_ctx.$t('common.copy')),
        placement: "top",
    }));
    const __VLS_150 = __VLS_149({
        content: (__VLS_ctx.$t('common.copy')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const { default: __VLS_153 } = __VLS_151.slots;
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "mr-4" },
    }));
    const __VLS_156 = __VLS_155({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    let __VLS_159;
    const __VLS_160 = {
        /** @type {typeof __VLS_159.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form.trigger_type === 'EVENT'))
                throw 0;
            return __VLS_ctx.copyClick(__VLS_ctx.event_url);
            // @ts-ignore
            [$t, $t, form, event_url, event_url, copyClick,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_161 } = __VLS_157.slots;
    let __VLS_162;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
        iconName: "app-copy",
        ...{ class: "color-secondary" },
    }));
    const __VLS_164 = __VLS_163({
        iconName: "app-copy",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_157;
    var __VLS_158;
    // @ts-ignore
    [];
    var __VLS_151;
    // @ts-ignore
    [];
    var __VLS_140;
    let __VLS_167;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
        label: "Bearer Token",
    }));
    const __VLS_169 = __VLS_168({
        label: "Bearer Token",
    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
    const { default: __VLS_172 } = __VLS_170.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "complex-input flex-between w-full" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['complex-input']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_173;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
        ...{ class: "complex-input__left" },
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        modelValue: (__VLS_ctx.form.trigger_setting.token),
        readonly: true,
        ...{ style: {} },
    }));
    const __VLS_175 = __VLS_174({
        ...{ class: "complex-input__left" },
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        modelValue: (__VLS_ctx.form.trigger_setting.token),
        readonly: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    /** @type {__VLS_StyleScopedClasses['complex-input__left']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_178;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
        content: (__VLS_ctx.$t('common.copy')),
        placement: "top",
    }));
    const __VLS_180 = __VLS_179({
        content: (__VLS_ctx.$t('common.copy')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    const { default: __VLS_183 } = __VLS_181.slots;
    let __VLS_184;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_189;
    const __VLS_190 = {
        /** @type {typeof __VLS_189.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form.trigger_type === 'EVENT'))
                throw 0;
            return __VLS_ctx.copyClick(__VLS_ctx.form.trigger_setting.token);
            // @ts-ignore
            [$t, $t, form, form, copyClick,];
        },
    };
    const { default: __VLS_191 } = __VLS_187.slots;
    let __VLS_192;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
        iconName: "app-copy",
        ...{ class: "color-secondary" },
    }));
    const __VLS_194 = __VLS_193({
        iconName: "app-copy",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_187;
    var __VLS_188;
    // @ts-ignore
    [];
    var __VLS_181;
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        content: (__VLS_ctx.$t('common.refresh')),
        placement: "top",
    }));
    const __VLS_199 = __VLS_198({
        content: (__VLS_ctx.$t('common.refresh')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    const { default: __VLS_202 } = __VLS_200.slots;
    let __VLS_203;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
        ...{ 'onClick': {} },
        text: true,
        ...{ style: {} },
    }));
    const __VLS_205 = __VLS_204({
        ...{ 'onClick': {} },
        text: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    let __VLS_208;
    const __VLS_209 = {
        /** @type {typeof __VLS_208.click} */
        onClick: (__VLS_ctx.refreshToken),
    };
    const { default: __VLS_210 } = __VLS_206.slots;
    let __VLS_211;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
        iconName: "app-refresh",
        ...{ class: "color-secondary" },
    }));
    const __VLS_213 = __VLS_212({
        iconName: "app-refresh",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [$t, refreshToken,];
    var __VLS_206;
    var __VLS_207;
    // @ts-ignore
    [];
    var __VLS_200;
    // @ts-ignore
    [];
    var __VLS_170;
    let __VLS_216;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({}));
    const __VLS_218 = __VLS_217({}, ...__VLS_functionalComponentArgsRest(__VLS_217));
    const { default: __VLS_221 } = __VLS_219.slots;
    {
        const { label: __VLS_222 } = __VLS_219.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        (__VLS_ctx.$t('views.trigger.requestParameter'));
        let __VLS_223;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_225 = __VLS_224({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_224));
        let __VLS_228;
        const __VLS_229 = {
            /** @type {typeof __VLS_228.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.trigger_type === 'EVENT'))
                    throw 0;
                return __VLS_ctx.addParameter();
                // @ts-ignore
                [$t, addParameter,];
            },
        };
        const { default: __VLS_230 } = __VLS_226.slots;
        let __VLS_231;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }));
        const __VLS_233 = __VLS_232({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_232));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        // @ts-ignore
        [];
        var __VLS_226;
        var __VLS_227;
        // @ts-ignore
        [];
    }
    let __VLS_236;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
        ...{ class: "w-full border-none" },
        shadow: "never",
        ...{ style: {} },
    }));
    const __VLS_238 = __VLS_237({
        ...{ class: "w-full border-none" },
        shadow: "never",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-none']} */ ;
    const { default: __VLS_241 } = __VLS_239.slots;
    let __VLS_242;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
        ...{ style: {} },
        gutter: (10),
    }));
    const __VLS_244 = __VLS_243({
        ...{ style: {} },
        gutter: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_243));
    const { default: __VLS_247 } = __VLS_245.slots;
    let __VLS_248;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
        span: (7),
    }));
    const __VLS_250 = __VLS_249({
        span: (7),
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    const { default: __VLS_253 } = __VLS_251.slots;
    (__VLS_ctx.$t('views.tool.form.paramName.label'));
    // @ts-ignore
    [$t,];
    var __VLS_251;
    let __VLS_254;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
        span: (7),
    }));
    const __VLS_256 = __VLS_255({
        span: (7),
    }, ...__VLS_functionalComponentArgsRest(__VLS_255));
    const { default: __VLS_259 } = __VLS_257.slots;
    (__VLS_ctx.$t('common.type'));
    // @ts-ignore
    [$t,];
    var __VLS_257;
    let __VLS_260;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
        span: (7),
    }));
    const __VLS_262 = __VLS_261({
        span: (7),
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    const { default: __VLS_265 } = __VLS_263.slots;
    (__VLS_ctx.$t('common.desc'));
    // @ts-ignore
    [$t,];
    var __VLS_263;
    let __VLS_266;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
        span: (3),
    }));
    const __VLS_268 = __VLS_267({
        span: (3),
    }, ...__VLS_functionalComponentArgsRest(__VLS_267));
    const { default: __VLS_271 } = __VLS_269.slots;
    (__VLS_ctx.$t('common.required'));
    // @ts-ignore
    [$t,];
    var __VLS_269;
    // @ts-ignore
    [];
    var __VLS_245;
    for (const [option, $index] of __VLS_vFor((__VLS_ctx.form.trigger_setting.body))) {
        let __VLS_272;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
            ...{ style: {} },
            key: ($index),
            gutter: (8),
        }));
        const __VLS_274 = __VLS_273({
            ...{ style: {} },
            key: ($index),
            gutter: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
        const { default: __VLS_277 } = __VLS_275.slots;
        let __VLS_278;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
            span: (7),
            ...{ class: "mb-8" },
        }));
        const __VLS_280 = __VLS_279({
            span: (7),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_279));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_283 } = __VLS_281.slots;
        let __VLS_284;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].field),
            placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        }));
        const __VLS_286 = __VLS_285({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].field),
            placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_285));
        // @ts-ignore
        [$t, form, form,];
        var __VLS_281;
        let __VLS_289;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
            span: (7),
        }));
        const __VLS_291 = __VLS_290({
            span: (7),
        }, ...__VLS_functionalComponentArgsRest(__VLS_290));
        const { default: __VLS_294 } = __VLS_292.slots;
        let __VLS_295;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_296 = __VLS_asFunctionalComponent1(__VLS_295, new __VLS_295({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].type),
            placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
        }));
        const __VLS_297 = __VLS_296({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].type),
            placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_296));
        const { default: __VLS_300 } = __VLS_298.slots;
        let __VLS_301;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
            label: "string",
            value: "string",
        }));
        const __VLS_303 = __VLS_302({
            label: "string",
            value: "string",
        }, ...__VLS_functionalComponentArgsRest(__VLS_302));
        let __VLS_306;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
            label: "int",
            value: "int",
        }));
        const __VLS_308 = __VLS_307({
            label: "int",
            value: "int",
        }, ...__VLS_functionalComponentArgsRest(__VLS_307));
        let __VLS_311;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({
            label: "dict",
            value: "dict",
        }));
        const __VLS_313 = __VLS_312({
            label: "dict",
            value: "dict",
        }, ...__VLS_functionalComponentArgsRest(__VLS_312));
        let __VLS_316;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
            label: "array",
            value: "array",
        }));
        const __VLS_318 = __VLS_317({
            label: "array",
            value: "array",
        }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        let __VLS_321;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
            label: "float",
            value: "float",
        }));
        const __VLS_323 = __VLS_322({
            label: "float",
            value: "float",
        }, ...__VLS_functionalComponentArgsRest(__VLS_322));
        let __VLS_326;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
            label: "boolean",
            value: "boolean",
        }));
        const __VLS_328 = __VLS_327({
            label: "boolean",
            value: "boolean",
        }, ...__VLS_functionalComponentArgsRest(__VLS_327));
        // @ts-ignore
        [$t, form,];
        var __VLS_298;
        // @ts-ignore
        [];
        var __VLS_292;
        let __VLS_331;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
            span: (7),
        }));
        const __VLS_333 = __VLS_332({
            span: (7),
        }, ...__VLS_functionalComponentArgsRest(__VLS_332));
        const { default: __VLS_336 } = __VLS_334.slots;
        let __VLS_337;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_338 = __VLS_asFunctionalComponent1(__VLS_337, new __VLS_337({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].desc),
            placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        }));
        const __VLS_339 = __VLS_338({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].desc),
            placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_338));
        // @ts-ignore
        [$t, form,];
        var __VLS_334;
        let __VLS_342;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_343 = __VLS_asFunctionalComponent1(__VLS_342, new __VLS_342({
            span: (2),
        }));
        const __VLS_344 = __VLS_343({
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_343));
        const { default: __VLS_347 } = __VLS_345.slots;
        let __VLS_348;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_349 = __VLS_asFunctionalComponent1(__VLS_348, new __VLS_348({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].required),
            size: "small",
        }));
        const __VLS_350 = __VLS_349({
            modelValue: (__VLS_ctx.form.trigger_setting.body[$index].required),
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_349));
        // @ts-ignore
        [form,];
        var __VLS_345;
        let __VLS_353;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_354 = __VLS_asFunctionalComponent1(__VLS_353, new __VLS_353({
            span: (1),
        }));
        const __VLS_355 = __VLS_354({
            span: (1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_354));
        const { default: __VLS_358 } = __VLS_356.slots;
        let __VLS_359;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_360 = __VLS_asFunctionalComponent1(__VLS_359, new __VLS_359({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "ml-8" },
        }));
        const __VLS_361 = __VLS_360({
            ...{ 'onClick': {} },
            text: true,
            ...{ class: "ml-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_360));
        let __VLS_364;
        const __VLS_365 = {
            /** @type {typeof __VLS_364.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.trigger_type === 'EVENT'))
                    throw 0;
                return __VLS_ctx.delParameter($index);
                // @ts-ignore
                [delParameter,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        const { default: __VLS_366 } = __VLS_362.slots;
        let __VLS_367;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_368 = __VLS_asFunctionalComponent1(__VLS_367, new __VLS_367({
            iconName: "app-delete",
            ...{ class: "color-secondary" },
        }));
        const __VLS_369 = __VLS_368({
            iconName: "app-delete",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_368));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_362;
        var __VLS_363;
        // @ts-ignore
        [];
        var __VLS_356;
        // @ts-ignore
        [];
        var __VLS_275;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_239;
    // @ts-ignore
    [];
    var __VLS_219;
    // @ts-ignore
    [];
    var __VLS_134;
}
// @ts-ignore
[];
var __VLS_114;
var __VLS_115;
// @ts-ignore
[];
var __VLS_42;
let __VLS_372;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_373 = __VLS_asFunctionalComponent1(__VLS_372, new __VLS_372({
    label: (__VLS_ctx.$t('views.trigger.taskExecution')),
    prop: "trigger_task",
    rules: ({
        type: 'array',
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'change',
        required: true,
    }),
}));
const __VLS_374 = __VLS_373({
    label: (__VLS_ctx.$t('views.trigger.taskExecution')),
    prop: "trigger_task",
    rules: ({
        type: 'array',
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'change',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_373));
const { default: __VLS_377 } = __VLS_375.slots;
if (['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)) {
    if (__VLS_ctx.resourceType === 'APPLICATION') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationTask))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "border border-r-6 white-bg mb-8" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.applicationDetailsDict[item.source_id]?.icon) {
                let __VLS_378;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_379 = __VLS_asFunctionalComponent1(__VLS_378, new __VLS_378({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_380 = __VLS_379({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_379));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_383 } = __VLS_381.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(__VLS_ctx.applicationDetailsDict[item.source_id]?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [$t, $t, resourceType, resourceType, applicationTask, applicationDetailsDict, applicationDetailsDict, resetUrl,];
                var __VLS_381;
            }
            else {
                let __VLS_384;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_385 = __VLS_asFunctionalComponent1(__VLS_384, new __VLS_384({
                    ...{ class: "mr-8" },
                    size: (20),
                }));
                const __VLS_386 = __VLS_385({
                    ...{ class: "mr-8" },
                    size: (20),
                }, ...__VLS_functionalComponentArgsRest(__VLS_385));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis-1" },
                title: (__VLS_ctx.applicationDetailsDict[item.source_id]?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (__VLS_ctx.applicationDetailsDict[item.source_id]?.name);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_389;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_390 = __VLS_asFunctionalComponent1(__VLS_389, new __VLS_389({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_391 = __VLS_390({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_390));
            let __VLS_394;
            const __VLS_395 = {
                /** @type {typeof __VLS_394.click} */
                onClick: (...[$event]) => {
                    if (!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                        throw 0;
                    if (!(__VLS_ctx.resourceType === 'APPLICATION'))
                        throw 0;
                    return __VLS_ctx.showTast = __VLS_ctx.showTast === 'agent' + index ? '' : 'agent' + index;
                    // @ts-ignore
                    [applicationDetailsDict, applicationDetailsDict, showTast, showTast,];
                },
            };
            const { default: __VLS_396 } = __VLS_392.slots;
            let __VLS_397;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_398 = __VLS_asFunctionalComponent1(__VLS_397, new __VLS_397({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'agent' + index ? 'rotate-180' : '') },
            }));
            const __VLS_399 = __VLS_398({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'agent' + index ? 'rotate-180' : '') },
            }, ...__VLS_functionalComponentArgsRest(__VLS_398));
            /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
            const { default: __VLS_402 } = __VLS_400.slots;
            let __VLS_403;
            /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
            ArrowDown;
            // @ts-ignore
            const __VLS_404 = __VLS_asFunctionalComponent1(__VLS_403, new __VLS_403({}));
            const __VLS_405 = __VLS_404({}, ...__VLS_functionalComponentArgsRest(__VLS_404));
            // @ts-ignore
            [showTast,];
            var __VLS_400;
            // @ts-ignore
            [];
            var __VLS_392;
            var __VLS_393;
            if (__VLS_ctx.showTast === 'agent' + index && __VLS_ctx.applicationDetailsDict[item.source_id]) {
                const __VLS_408 = ApplicationParameter || ApplicationParameter;
                // @ts-ignore
                const __VLS_409 = __VLS_asFunctionalComponent1(__VLS_408, new __VLS_408({
                    ...{ class: "mt-8 mb-8" },
                    ref: "applicationParameterRef",
                    application: (__VLS_ctx.applicationDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }));
                const __VLS_410 = __VLS_409({
                    ...{ class: "mt-8 mb-8" },
                    ref: "applicationParameterRef",
                    application: (__VLS_ctx.applicationDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }, ...__VLS_functionalComponentArgsRest(__VLS_409));
                var __VLS_413;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                var __VLS_411;
            }
            // @ts-ignore
            [form, applicationDetailsDict, applicationDetailsDict, showTast,];
        }
    }
    if (__VLS_ctx.resourceType === 'TOOL') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.toolTask))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "border border-r-6 white-bg mb-4" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.toolDetailsDict[item.source_id]?.icon) {
                let __VLS_415;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_416 = __VLS_asFunctionalComponent1(__VLS_415, new __VLS_415({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_417 = __VLS_416({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_416));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_420 } = __VLS_418.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(__VLS_ctx.toolDetailsDict[item.source_id]?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [resourceType, resetUrl, toolTask, toolDetailsDict, toolDetailsDict,];
                var __VLS_418;
            }
            else {
                let __VLS_421;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_422 = __VLS_asFunctionalComponent1(__VLS_421, new __VLS_421({
                    ...{ class: "mr-8" },
                    size: (20),
                }));
                const __VLS_423 = __VLS_422({
                    ...{ class: "mr-8" },
                    size: (20),
                }, ...__VLS_functionalComponentArgsRest(__VLS_422));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis-1" },
                title: (__VLS_ctx.toolDetailsDict[item.source_id]?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (__VLS_ctx.toolDetailsDict[item.source_id]?.name);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_426;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_427 = __VLS_asFunctionalComponent1(__VLS_426, new __VLS_426({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_428 = __VLS_427({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_427));
            let __VLS_431;
            const __VLS_432 = {
                /** @type {typeof __VLS_431.click} */
                onClick: (...[$event]) => {
                    if (!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                        throw 0;
                    if (!(__VLS_ctx.resourceType === 'TOOL'))
                        throw 0;
                    return __VLS_ctx.showTast = __VLS_ctx.showTast === 'tool' + index ? '' : 'tool' + index;
                    // @ts-ignore
                    [showTast, showTast, toolDetailsDict, toolDetailsDict,];
                },
            };
            const { default: __VLS_433 } = __VLS_429.slots;
            let __VLS_434;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_435 = __VLS_asFunctionalComponent1(__VLS_434, new __VLS_434({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'tool' + index ? 'rotate-180' : '') },
            }));
            const __VLS_436 = __VLS_435({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'tool' + index ? 'rotate-180' : '') },
            }, ...__VLS_functionalComponentArgsRest(__VLS_435));
            /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
            const { default: __VLS_439 } = __VLS_437.slots;
            let __VLS_440;
            /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
            ArrowDown;
            // @ts-ignore
            const __VLS_441 = __VLS_asFunctionalComponent1(__VLS_440, new __VLS_440({}));
            const __VLS_442 = __VLS_441({}, ...__VLS_functionalComponentArgsRest(__VLS_441));
            // @ts-ignore
            [showTast,];
            var __VLS_437;
            // @ts-ignore
            [];
            var __VLS_429;
            var __VLS_430;
            if (__VLS_ctx.showTast === 'tool' + index && __VLS_ctx.toolDetailsDict[item.source_id]) {
                const __VLS_445 = ToolParameter || ToolParameter;
                // @ts-ignore
                const __VLS_446 = __VLS_asFunctionalComponent1(__VLS_445, new __VLS_445({
                    ...{ class: "mt-8 mb-8" },
                    ref: "toolParameterRef",
                    tool: (__VLS_ctx.toolDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }));
                const __VLS_447 = __VLS_446({
                    ...{ class: "mt-8 mb-8" },
                    ref: "toolParameterRef",
                    tool: (__VLS_ctx.toolDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }, ...__VLS_functionalComponentArgsRest(__VLS_446));
                var __VLS_450;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                var __VLS_448;
            }
            // @ts-ignore
            [form, showTast, toolDetailsDict, toolDetailsDict,];
        }
    }
}
else {
    let __VLS_452;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent1(__VLS_452, new __VLS_452({
        shadow: "never",
        ...{ class: "card-never w-full" },
        ...{ style: {} },
    }));
    const __VLS_454 = __VLS_453({
        shadow: "never",
        ...{ class: "card-never w-full" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_457 } = __VLS_455.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                    throw 0;
                return __VLS_ctx.collapseData.agent = !__VLS_ctx.collapseData.agent;
                // @ts-ignore
                [collapseData, collapseData,];
            } },
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center lighter cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    let __VLS_458;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_459 = __VLS_asFunctionalComponent1(__VLS_458, new __VLS_458({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.agent ? 'rotate-90' : '') },
    }));
    const __VLS_460 = __VLS_459({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.agent ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_459));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_463 } = __VLS_461.slots;
    let __VLS_464;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_465 = __VLS_asFunctionalComponent1(__VLS_464, new __VLS_464({}));
    const __VLS_466 = __VLS_465({}, ...__VLS_functionalComponentArgsRest(__VLS_465));
    // @ts-ignore
    [collapseData,];
    var __VLS_461;
    (__VLS_ctx.$t('views.application.title'));
    if (__VLS_ctx.applicationTask?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.applicationTask?.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_469;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_470 = __VLS_asFunctionalComponent1(__VLS_469, new __VLS_469({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_471 = __VLS_470({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_470));
    let __VLS_474;
    const __VLS_475 = {
        /** @type {typeof __VLS_474.click} */
        onClick: (...[$event]) => {
            if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                throw 0;
            return __VLS_ctx.openApplicationDialog();
            // @ts-ignore
            [$t, applicationTask, applicationTask, openApplicationDialog,];
        },
    };
    const { default: __VLS_476 } = __VLS_472.slots;
    let __VLS_477;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_478 = __VLS_asFunctionalComponent1(__VLS_477, new __VLS_477({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_479 = __VLS_478({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_478));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [];
    var __VLS_472;
    var __VLS_473;
    if (__VLS_ctx.collapseData.agent) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationTask))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "border border-r-6 white-bg mb-4" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.applicationDetailsDict[item.source_id]?.icon) {
                let __VLS_482;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_483 = __VLS_asFunctionalComponent1(__VLS_482, new __VLS_482({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_484 = __VLS_483({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_483));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_487 } = __VLS_485.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(__VLS_ctx.applicationDetailsDict[item.source_id]?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [applicationTask, applicationDetailsDict, applicationDetailsDict, resetUrl, collapseData,];
                var __VLS_485;
            }
            else {
                let __VLS_488;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_489 = __VLS_asFunctionalComponent1(__VLS_488, new __VLS_488({
                    ...{ class: "mr-8" },
                    size: (20),
                }));
                const __VLS_490 = __VLS_489({
                    ...{ class: "mr-8" },
                    size: (20),
                }, ...__VLS_functionalComponentArgsRest(__VLS_489));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis-1" },
                title: (__VLS_ctx.applicationDetailsDict[item.source_id]?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (__VLS_ctx.applicationDetailsDict[item.source_id]?.name);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_493;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_494 = __VLS_asFunctionalComponent1(__VLS_493, new __VLS_493({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_495 = __VLS_494({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_494));
            let __VLS_498;
            const __VLS_499 = {
                /** @type {typeof __VLS_498.click} */
                onClick: (...[$event]) => {
                    if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                        throw 0;
                    if (!(__VLS_ctx.collapseData.agent))
                        throw 0;
                    return __VLS_ctx.showTast = __VLS_ctx.showTast === 'agent' + index ? '' : 'agent' + index;
                    // @ts-ignore
                    [applicationDetailsDict, applicationDetailsDict, showTast, showTast,];
                },
            };
            const { default: __VLS_500 } = __VLS_496.slots;
            let __VLS_501;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_502 = __VLS_asFunctionalComponent1(__VLS_501, new __VLS_501({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'agent' + index ? 'rotate-180' : '') },
            }));
            const __VLS_503 = __VLS_502({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'agent' + index ? 'rotate-180' : '') },
            }, ...__VLS_functionalComponentArgsRest(__VLS_502));
            /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
            const { default: __VLS_506 } = __VLS_504.slots;
            let __VLS_507;
            /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
            ArrowDown;
            // @ts-ignore
            const __VLS_508 = __VLS_asFunctionalComponent1(__VLS_507, new __VLS_507({}));
            const __VLS_509 = __VLS_508({}, ...__VLS_functionalComponentArgsRest(__VLS_508));
            // @ts-ignore
            [showTast,];
            var __VLS_504;
            // @ts-ignore
            [];
            var __VLS_496;
            var __VLS_497;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_512;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_513 = __VLS_asFunctionalComponent1(__VLS_512, new __VLS_512({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_514 = __VLS_513({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_513));
            let __VLS_517;
            const __VLS_518 = {
                /** @type {typeof __VLS_517.click} */
                onClick: (...[$event]) => {
                    if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                        throw 0;
                    if (!(__VLS_ctx.collapseData.agent))
                        throw 0;
                    return __VLS_ctx.deleteTask(item);
                    // @ts-ignore
                    [deleteTask,];
                },
            };
            const { default: __VLS_519 } = __VLS_515.slots;
            let __VLS_520;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_521 = __VLS_asFunctionalComponent1(__VLS_520, new __VLS_520({}));
            const __VLS_522 = __VLS_521({}, ...__VLS_functionalComponentArgsRest(__VLS_521));
            const { default: __VLS_525 } = __VLS_523.slots;
            let __VLS_526;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_527 = __VLS_asFunctionalComponent1(__VLS_526, new __VLS_526({}));
            const __VLS_528 = __VLS_527({}, ...__VLS_functionalComponentArgsRest(__VLS_527));
            // @ts-ignore
            [];
            var __VLS_523;
            // @ts-ignore
            [];
            var __VLS_515;
            var __VLS_516;
            if (__VLS_ctx.showTast === 'agent' + index && __VLS_ctx.applicationDetailsDict[item.source_id]) {
                const __VLS_531 = ApplicationParameter || ApplicationParameter;
                // @ts-ignore
                const __VLS_532 = __VLS_asFunctionalComponent1(__VLS_531, new __VLS_531({
                    ...{ class: "mt-8 mb-8" },
                    ref: "applicationParameterRef",
                    application: (__VLS_ctx.applicationDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }));
                const __VLS_533 = __VLS_532({
                    ...{ class: "mt-8 mb-8" },
                    ref: "applicationParameterRef",
                    application: (__VLS_ctx.applicationDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }, ...__VLS_functionalComponentArgsRest(__VLS_532));
                var __VLS_536;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                var __VLS_534;
            }
            // @ts-ignore
            [form, applicationDetailsDict, applicationDetailsDict, showTast,];
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                    throw 0;
                return __VLS_ctx.collapseData.tool = !__VLS_ctx.collapseData.tool;
                // @ts-ignore
                [collapseData, collapseData,];
            } },
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center lighter cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    let __VLS_538;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_539 = __VLS_asFunctionalComponent1(__VLS_538, new __VLS_538({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.tool ? 'rotate-90' : '') },
    }));
    const __VLS_540 = __VLS_539({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.tool ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_539));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_543 } = __VLS_541.slots;
    let __VLS_544;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_545 = __VLS_asFunctionalComponent1(__VLS_544, new __VLS_544({}));
    const __VLS_546 = __VLS_545({}, ...__VLS_functionalComponentArgsRest(__VLS_545));
    // @ts-ignore
    [collapseData,];
    var __VLS_541;
    (__VLS_ctx.$t('views.tool.title'));
    if (__VLS_ctx.toolTask?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.toolTask?.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_549;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_550 = __VLS_asFunctionalComponent1(__VLS_549, new __VLS_549({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_551 = __VLS_550({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_550));
    let __VLS_554;
    const __VLS_555 = {
        /** @type {typeof __VLS_554.click} */
        onClick: (...[$event]) => {
            if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                throw 0;
            return __VLS_ctx.openToolDialog();
            // @ts-ignore
            [$t, toolTask, toolTask, openToolDialog,];
        },
    };
    const { default: __VLS_556 } = __VLS_552.slots;
    let __VLS_557;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_558 = __VLS_asFunctionalComponent1(__VLS_557, new __VLS_557({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_559 = __VLS_558({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_558));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [];
    var __VLS_552;
    var __VLS_553;
    if (__VLS_ctx.collapseData.tool) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.toolTask))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "border border-r-6 white-bg mb-4" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.toolDetailsDict[item.source_id]?.icon) {
                let __VLS_562;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_563 = __VLS_asFunctionalComponent1(__VLS_562, new __VLS_562({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_564 = __VLS_563({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_563));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_567 } = __VLS_565.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(__VLS_ctx.toolDetailsDict[item.source_id]?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [resetUrl, toolTask, toolDetailsDict, toolDetailsDict, collapseData,];
                var __VLS_565;
            }
            else {
                let __VLS_568;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_569 = __VLS_asFunctionalComponent1(__VLS_568, new __VLS_568({
                    ...{ class: "mr-8" },
                    size: (20),
                }));
                const __VLS_570 = __VLS_569({
                    ...{ class: "mr-8" },
                    size: (20),
                }, ...__VLS_functionalComponentArgsRest(__VLS_569));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis-1" },
                title: (__VLS_ctx.toolDetailsDict[item.source_id]?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (__VLS_ctx.toolDetailsDict[item.source_id]?.name);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_573;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_574 = __VLS_asFunctionalComponent1(__VLS_573, new __VLS_573({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_575 = __VLS_574({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_574));
            let __VLS_578;
            const __VLS_579 = {
                /** @type {typeof __VLS_578.click} */
                onClick: (...[$event]) => {
                    if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                        throw 0;
                    if (!(__VLS_ctx.collapseData.tool))
                        throw 0;
                    return __VLS_ctx.showTast = __VLS_ctx.showTast === 'tool' + index ? '' : 'tool' + index;
                    // @ts-ignore
                    [showTast, showTast, toolDetailsDict, toolDetailsDict,];
                },
            };
            const { default: __VLS_580 } = __VLS_576.slots;
            let __VLS_581;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_582 = __VLS_asFunctionalComponent1(__VLS_581, new __VLS_581({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'tool' + index ? 'rotate-180' : '') },
            }));
            const __VLS_583 = __VLS_582({
                ...{ class: "arrow-icon" },
                ...{ class: (__VLS_ctx.showTast === 'tool' + index ? 'rotate-180' : '') },
            }, ...__VLS_functionalComponentArgsRest(__VLS_582));
            /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
            const { default: __VLS_586 } = __VLS_584.slots;
            let __VLS_587;
            /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
            ArrowDown;
            // @ts-ignore
            const __VLS_588 = __VLS_asFunctionalComponent1(__VLS_587, new __VLS_587({}));
            const __VLS_589 = __VLS_588({}, ...__VLS_functionalComponentArgsRest(__VLS_588));
            // @ts-ignore
            [showTast,];
            var __VLS_584;
            // @ts-ignore
            [];
            var __VLS_576;
            var __VLS_577;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            let __VLS_592;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_593 = __VLS_asFunctionalComponent1(__VLS_592, new __VLS_592({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_594 = __VLS_593({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_593));
            let __VLS_597;
            const __VLS_598 = {
                /** @type {typeof __VLS_597.click} */
                onClick: (...[$event]) => {
                    if (!!(['APPLICATION', 'TOOL'].includes(__VLS_ctx.resourceType)))
                        throw 0;
                    if (!(__VLS_ctx.collapseData.tool))
                        throw 0;
                    return __VLS_ctx.deleteTask(item);
                    // @ts-ignore
                    [deleteTask,];
                },
            };
            const { default: __VLS_599 } = __VLS_595.slots;
            let __VLS_600;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_601 = __VLS_asFunctionalComponent1(__VLS_600, new __VLS_600({}));
            const __VLS_602 = __VLS_601({}, ...__VLS_functionalComponentArgsRest(__VLS_601));
            const { default: __VLS_605 } = __VLS_603.slots;
            let __VLS_606;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_607 = __VLS_asFunctionalComponent1(__VLS_606, new __VLS_606({}));
            const __VLS_608 = __VLS_607({}, ...__VLS_functionalComponentArgsRest(__VLS_607));
            // @ts-ignore
            [];
            var __VLS_603;
            // @ts-ignore
            [];
            var __VLS_595;
            var __VLS_596;
            if (__VLS_ctx.showTast === 'tool' + index && __VLS_ctx.toolDetailsDict[item.source_id]) {
                const __VLS_611 = ToolParameter || ToolParameter;
                // @ts-ignore
                const __VLS_612 = __VLS_asFunctionalComponent1(__VLS_611, new __VLS_611({
                    ...{ class: "mt-8 mb-8" },
                    ref: "toolParameterRef",
                    tool: (__VLS_ctx.toolDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }));
                const __VLS_613 = __VLS_612({
                    ...{ class: "mt-8 mb-8" },
                    ref: "toolParameterRef",
                    tool: (__VLS_ctx.toolDetailsDict[item.source_id]),
                    trigger: (__VLS_ctx.form),
                    modelValue: (item.parameter),
                }, ...__VLS_functionalComponentArgsRest(__VLS_612));
                var __VLS_616;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                var __VLS_614;
            }
            // @ts-ignore
            [form, showTast, toolDetailsDict, toolDetailsDict,];
        }
    }
    // @ts-ignore
    [];
    var __VLS_455;
}
// @ts-ignore
[];
var __VLS_375;
// @ts-ignore
[];
var __VLS_10;
const __VLS_618 = ApplicationDialog || ApplicationDialog;
// @ts-ignore
const __VLS_619 = __VLS_asFunctionalComponent1(__VLS_618, new __VLS_618({
    ...{ 'onRefresh': {} },
    ref: "applicationDialogRef",
}));
const __VLS_620 = __VLS_619({
    ...{ 'onRefresh': {} },
    ref: "applicationDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_619));
let __VLS_623;
const __VLS_624 = {
    /** @type {typeof __VLS_623.refresh} */
    onRefresh: (__VLS_ctx.applicationRefresh),
};
var __VLS_625;
var __VLS_621;
var __VLS_622;
const __VLS_627 = ToolDialog || ToolDialog;
// @ts-ignore
const __VLS_628 = __VLS_asFunctionalComponent1(__VLS_627, new __VLS_627({
    ...{ 'onRefresh': {} },
    ref: "toolDialogRef",
    tool_type: "CUSTOM,WORKFLOW",
}));
const __VLS_629 = __VLS_628({
    ...{ 'onRefresh': {} },
    ref: "toolDialogRef",
    tool_type: "CUSTOM,WORKFLOW",
}, ...__VLS_functionalComponentArgsRest(__VLS_628));
let __VLS_632;
const __VLS_633 = {
    /** @type {typeof __VLS_632.refresh} */
    onRefresh: (__VLS_ctx.toolRefresh),
};
var __VLS_634;
var __VLS_630;
var __VLS_631;
{
    const { footer: __VLS_636 } = __VLS_3.slots;
    let __VLS_637;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_638 = __VLS_asFunctionalComponent1(__VLS_637, new __VLS_637({
        ...{ 'onClick': {} },
    }));
    const __VLS_639 = __VLS_638({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_638));
    let __VLS_642;
    const __VLS_643 = {
        /** @type {typeof __VLS_642.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_644 } = __VLS_640.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close, applicationRefresh, toolRefresh,];
    var __VLS_640;
    var __VLS_641;
    if (!__VLS_ctx.is_edit || __VLS_ctx.editPermission) {
        let __VLS_645;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_646 = __VLS_asFunctionalComponent1(__VLS_645, new __VLS_645({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_647 = __VLS_646({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_646));
        let __VLS_650;
        const __VLS_651 = {
            /** @type {typeof __VLS_650.click} */
            onClick: (__VLS_ctx.submit),
        };
        const { default: __VLS_652 } = __VLS_648.slots;
        (__VLS_ctx.is_edit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.create'));
        // @ts-ignore
        [is_edit, is_edit, $t, $t, editPermission, submit,];
        var __VLS_648;
        var __VLS_649;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12, __VLS_414 = __VLS_413, __VLS_451 = __VLS_450, __VLS_537 = __VLS_536, __VLS_617 = __VLS_616, __VLS_626 = __VLS_625, __VLS_635 = __VLS_634;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
