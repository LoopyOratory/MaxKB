/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { triggerCycleOptions } from '@/utils/trigger.ts';
import { t } from '@/locales';
import { cloneDeep } from 'lodash';
import { isValidCron } from 'cron-validator';
const emit = defineEmits(['refresh']);
const dialogVisible = ref(false);
const paramFormRef = ref();
const loading = ref(false);
const form = ref({
    trigger_type: 'ROUND',
    trigger_setting: {
        rounds: 10,
    },
});
const lastPresetSetting = ref(null);
const cronError = ref('');
const changeTriggerType = (type) => {
    form.value.trigger_type = type;
};
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
const handleChangeScheduled = (v) => {
    scheduled.value = v;
};
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
const open = (trigger_type, trigger_setting) => {
    dialogVisible.value = true;
    if (trigger_setting && trigger_setting.rounds) {
        form.value.trigger_setting = trigger_setting;
    }
    else {
        form.value.trigger_setting = { rounds: 10 };
    }
    form.value.trigger_type = trigger_type ?? 'ROUND';
};
const submit = () => {
    paramFormRef.value.validate((valid) => {
        if (valid) {
            emit('refresh', form.value);
            dialogVisible.value = false;
        }
    });
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    alignCenter: true,
    title: (__VLS_ctx.$t('views.application.longTermMemory.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    title: (__VLS_ctx.$t('views.application.longTermMemory.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.$t('views.application.longTermMemory.triggerType')),
    prop: "trigger_type",
    rules: ({
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('views.application.longTermMemory.triggerType')),
    prop: "trigger_type",
    rules: ({
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "mb-16 w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'ROUND' ? 'border-active' : '') },
}));
const __VLS_25 = __VLS_24({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "mb-16 w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'ROUND' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.changeTriggerType('ROUND');
        // @ts-ignore
        [$t, $t, $t, dialogVisible, form, form, changeTriggerType,];
    },
};
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_30 } = __VLS_26.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center line-height-22" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    shape: "square",
    ...{ class: "avatar-orange" },
    size: (32),
}));
const __VLS_33 = __VLS_32({
    shape: "square",
    ...{ class: "avatar-orange" },
    size: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
/** @type {__VLS_StyleScopedClasses['avatar-orange']} */ ;
const { default: __VLS_36 } = __VLS_34.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/trigger/icon_event.svg",
    ...{ style: {} },
    alt: "",
});
// @ts-ignore
[];
var __VLS_34;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-12" },
});
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({});
(__VLS_ctx.$t('views.application.longTermMemory.roundTrigger'));
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    type: "info",
    ...{ class: "color-secondary font-small" },
}));
const __VLS_39 = __VLS_38({
    type: "info",
    ...{ class: "color-secondary font-small" },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-small']} */ ;
const { default: __VLS_42 } = __VLS_40.slots;
(__VLS_ctx.$t('views.application.longTermMemory.roundTriggerTip'));
// @ts-ignore
[$t, $t,];
var __VLS_40;
if (__VLS_ctx.form.trigger_type === 'ROUND') {
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        shadow: "never",
        ...{ class: "card-never mt-16" },
    }));
    const __VLS_45 = __VLS_44({
        shadow: "never",
        ...{ class: "card-never mt-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_48 } = __VLS_46.slots;
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        label: (__VLS_ctx.$t('views.application.longTermMemory.triggerInterval')),
        required: true,
    }));
    const __VLS_51 = __VLS_50({
        label: (__VLS_ctx.$t('views.application.longTermMemory.triggerInterval')),
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const { default: __VLS_54 } = __VLS_52.slots;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        modelValue: (__VLS_ctx.form.trigger_setting.rounds),
        valueOnClear: (0),
        min: (5),
        max: (100),
    }));
    const __VLS_57 = __VLS_56({
        modelValue: (__VLS_ctx.form.trigger_setting.rounds),
        valueOnClear: (0),
        min: (5),
        max: (100),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    // @ts-ignore
    [$t, form, form,];
    var __VLS_52;
    // @ts-ignore
    [];
    var __VLS_46;
}
// @ts-ignore
[];
var __VLS_26;
var __VLS_27;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'SCHEDULED' ? 'border-active' : '') },
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    shadow: "never",
    ...{ class: "w-full cursor" },
    ...{ class: (__VLS_ctx.form.trigger_type === 'SCHEDULED' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_65;
const __VLS_66 = {
    /** @type {typeof __VLS_65.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.changeTriggerType('SCHEDULED');
        // @ts-ignore
        [form, changeTriggerType,];
    },
};
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_67 } = __VLS_63.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center line-height-22" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['line-height-22']} */ ;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    shape: "square",
    size: (32),
}));
const __VLS_70 = __VLS_69({
    shape: "square",
    size: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const { default: __VLS_73 } = __VLS_71.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/trigger/icon_scheduled.svg",
    ...{ style: {} },
    alt: "",
});
// @ts-ignore
[];
var __VLS_71;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-12" },
});
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({});
(__VLS_ctx.$t('views.application.longTermMemory.scheduledTrigger'));
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    type: "info",
    ...{ class: "color-secondary font-small" },
}));
const __VLS_76 = __VLS_75({
    type: "info",
    ...{ class: "color-secondary font-small" },
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['font-small']} */ ;
const { default: __VLS_79 } = __VLS_77.slots;
(__VLS_ctx.$t('views.application.longTermMemory.scheduledTriggerTip'));
// @ts-ignore
[$t, $t,];
var __VLS_77;
if (__VLS_ctx.form.trigger_type === 'SCHEDULED') {
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        shadow: "never",
        ...{ class: "card-never mt-16 w-full" },
    }));
    const __VLS_82 = __VLS_81({
        shadow: "never",
        ...{ class: "card-never mt-16 w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_85 } = __VLS_83.slots;
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
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        content: (__VLS_ctx.form.trigger_setting.schedule_type === 'cron'
            ? __VLS_ctx.$t('views.trigger.triggerCycle.switchCycle')
            : __VLS_ctx.$t('views.trigger.triggerCycle.switchCron')),
        placement: "top",
        effect: "light",
    }));
    const __VLS_88 = __VLS_87({
        content: (__VLS_ctx.form.trigger_setting.schedule_type === 'cron'
            ? __VLS_ctx.$t('views.trigger.triggerCycle.switchCycle')
            : __VLS_ctx.$t('views.trigger.triggerCycle.switchCron')),
        placement: "top",
        effect: "light",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const { default: __VLS_91 } = __VLS_89.slots;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_97;
    const __VLS_98 = {
        /** @type {typeof __VLS_97.click} */
        onClick: (__VLS_ctx.switchScheduleType),
    };
    const { default: __VLS_99 } = __VLS_95.slots;
    let __VLS_100;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({}));
    const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
    const { default: __VLS_105 } = __VLS_103.slots;
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.Switch} */
    Switch;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({}));
    const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
    // @ts-ignore
    [$t, $t, $t, $t, form, form, form, switchScheduleType,];
    var __VLS_103;
    // @ts-ignore
    [];
    var __VLS_95;
    var __VLS_96;
    // @ts-ignore
    [];
    var __VLS_89;
    if (__VLS_ctx.form.trigger_setting.schedule_type !== 'cron') {
        let __VLS_111;
        /** @ts-ignore @type { | typeof __VLS_components.elCascader | typeof __VLS_components.ElCascader | typeof __VLS_components['el-cascader']} */
        elCascader;
        // @ts-ignore
        const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.scheduled),
            options: (__VLS_ctx.triggerCycleOptions),
            ...{ style: {} },
        }));
        const __VLS_113 = __VLS_112({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.scheduled),
            options: (__VLS_ctx.triggerCycleOptions),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        let __VLS_116;
        const __VLS_117 = {
            /** @type {typeof __VLS_116.change} */
            onChange: (__VLS_ctx.handleChangeScheduled),
        };
        var __VLS_114;
        var __VLS_115;
    }
    else {
        let __VLS_118;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
            ...{ 'onBlur': {} },
            ...{ 'onInput': {} },
            modelValue: (__VLS_ctx.form.trigger_setting.cron_expression),
            placeholder: (__VLS_ctx.t('views.trigger.triggerCycle.placeholder')),
            clearable: true,
        }));
        const __VLS_120 = __VLS_119({
            ...{ 'onBlur': {} },
            ...{ 'onInput': {} },
            modelValue: (__VLS_ctx.form.trigger_setting.cron_expression),
            placeholder: (__VLS_ctx.t('views.trigger.triggerCycle.placeholder')),
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_119));
        let __VLS_123;
        const __VLS_124 = {
            /** @type {typeof __VLS_123.blur} */
            onBlur: (__VLS_ctx.validateCron),
        };
        const __VLS_125 = {
            /** @type {typeof __VLS_123.input} */
            onInput: (__VLS_ctx.validateCron),
        };
        var __VLS_121;
        var __VLS_122;
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
    var __VLS_83;
}
// @ts-ignore
[];
var __VLS_63;
var __VLS_64;
// @ts-ignore
[];
var __VLS_20;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_126 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_127;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
        ...{ 'onClick': {} },
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_132;
    const __VLS_133 = {
        /** @type {typeof __VLS_132.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_134 } = __VLS_130.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_130;
    var __VLS_131;
    let __VLS_135;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_137 = __VLS_136({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    let __VLS_140;
    const __VLS_141 = {
        /** @type {typeof __VLS_140.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit();
            // @ts-ignore
            [loading, submit,];
        },
    };
    const { default: __VLS_142 } = __VLS_138.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_138;
    var __VLS_139;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
