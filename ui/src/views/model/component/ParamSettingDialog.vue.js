/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AddParamDrawer from './AddParamDrawer.vue';
import { MsgError, MsgSuccess } from '@/utils/message';
import { input_type_list } from '@/components/dynamics-form/constructor/data';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const loading = ref(false);
const dialogVisible = ref(false);
const modelParamsForm = ref([]);
const AddParamRef = ref();
const currentModel = ref(null);
const open = (model) => {
    currentModel.value = model;
    dialogVisible.value = true;
    loading.value = true;
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getModelParamsForm(model.id, loading)
        .then((ok) => {
        loading.value = false;
        modelParamsForm.value = ok.data;
    })
        .catch(() => {
        loading.value = false;
    });
};
const close = () => {
    dialogVisible.value = false;
};
function openAddDrawer(data, index) {
    AddParamRef.value?.open(data, index);
}
function deleteParam(index) {
    modelParamsForm.value.splice(index, 1);
}
function refresh(data, index) {
    for (let i = 0; i < modelParamsForm.value.length; i++) {
        const field = modelParamsForm.value[i].field;
        let label = modelParamsForm.value[i].label;
        if (label && label.input_type === 'TooltipLabel') {
            label = label.label;
        }
        let label2 = data.label;
        if (label2 && label2.input_type === 'TooltipLabel') {
            label2 = label2.label;
        }
        if (field === data.field && index !== i) {
            MsgError(t('views.model.tip.errorMessage') + data.field);
            return;
        }
        if (label === label2 && index !== i) {
            MsgError(t('views.model.tip.errorMessage') + label);
            return;
        }
    }
    if (index !== null) {
        modelParamsForm.value.splice(index, 1, data);
    }
    else {
        modelParamsForm.value.push(data);
    }
}
function submit() {
    if (!currentModel.value) {
        return;
    }
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .updateModelParamsForm(currentModel.value.id, modelParamsForm.value, loading)
        .then((ok) => {
        MsgSuccess(t('views.model.tip.saveSuccessMessage'));
        close();
        // emit('submit')
    });
}
const __VLS_exposed = { open, close };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
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
    title: (__VLS_ctx.$t('views.model.modelForm.title.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "800px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.model.modelForm.title.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "800px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-12" },
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddDrawer();
        // @ts-ignore
        [$t, dialogVisible, close, openAddDrawer,];
    },
};
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
const { default: __VLS_13 } = __VLS_9.slots;
(__VLS_ctx.$t('common.param.addParam'));
// @ts-ignore
[$t,];
var __VLS_9;
var __VLS_10;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    data: (__VLS_ctx.modelParamsForm),
    ...{ class: "mb-16" },
}));
const __VLS_16 = __VLS_15({
    data: (__VLS_ctx.modelParamsForm),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    prop: "label",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    showOverflowTooltip: true,
}));
const __VLS_22 = __VLS_21({
    prop: "label",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
{
    const { default: __VLS_26 } = __VLS_23.slots;
    const [{ row }] = __VLS_vSlot(__VLS_26);
    if (row.label && row.label.input_type === 'TooltipLabel') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.label.label);
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.label);
    }
    // @ts-ignore
    [$t, modelParamsForm,];
}
// @ts-ignore
[];
var __VLS_23;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    showOverflowTooltip: true,
}));
const __VLS_29 = __VLS_28({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
    width: "110px",
}));
const __VLS_34 = __VLS_33({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
    width: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
{
    const { default: __VLS_38 } = __VLS_35.slots;
    const [{ row }] = __VLS_vSlot(__VLS_38);
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }));
    const __VLS_41 = __VLS_40({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
    const { default: __VLS_44 } = __VLS_42.slots;
    (__VLS_ctx.input_type_list.find((item) => item.value === row.input_type)?.label);
    // @ts-ignore
    [$t, $t, input_type_list,];
    var __VLS_42;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_35;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    showOverflowTooltip: true,
}));
const __VLS_47 = __VLS_46({
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    label: (__VLS_ctx.$t('common.required')),
}));
const __VLS_52 = __VLS_51({
    label: (__VLS_ctx.$t('common.required')),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
{
    const { default: __VLS_56 } = __VLS_53.slots;
    const [{ row }] = __VLS_vSlot(__VLS_56);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }));
    const __VLS_59 = __VLS_58({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_53;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}));
const __VLS_64 = __VLS_63({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
{
    const { default: __VLS_68 } = __VLS_65.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_68);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }));
    const __VLS_71 = __VLS_70({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    const { default: __VLS_74 } = __VLS_72.slots;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_77 = __VLS_76({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    let __VLS_80;
    const __VLS_81 = {
        /** @type {typeof __VLS_80.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddDrawer(row, $index);
            // @ts-ignore
            [$t, $t, openAddDrawer,];
        },
    };
    const { default: __VLS_82 } = __VLS_78.slots;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        iconName: "app-edit",
    }));
    const __VLS_85 = __VLS_84({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    // @ts-ignore
    [];
    var __VLS_78;
    var __VLS_79;
    // @ts-ignore
    [];
    var __VLS_72;
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_90 = __VLS_89({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const { default: __VLS_93 } = __VLS_91.slots;
    let __VLS_94;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_96 = __VLS_95({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    let __VLS_99;
    const __VLS_100 = {
        /** @type {typeof __VLS_99.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteParam($index);
            // @ts-ignore
            [$t, deleteParam,];
        },
    };
    const { default: __VLS_101 } = __VLS_97.slots;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        iconName: "app-delete",
    }));
    const __VLS_104 = __VLS_103({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    // @ts-ignore
    [];
    var __VLS_97;
    var __VLS_98;
    // @ts-ignore
    [];
    var __VLS_91;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_65;
// @ts-ignore
[];
var __VLS_17;
{
    const { footer: __VLS_107 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_113;
    const __VLS_114 = {
        /** @type {typeof __VLS_113.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_115 } = __VLS_111.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_111;
    var __VLS_112;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_121;
    const __VLS_122 = {
        /** @type {typeof __VLS_121.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_123 } = __VLS_119.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_119;
    var __VLS_120;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
const __VLS_124 = AddParamDrawer;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    ...{ 'onRefresh': {} },
    ref: "AddParamRef",
}));
const __VLS_126 = __VLS_125({
    ...{ 'onRefresh': {} },
    ref: "AddParamRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_129;
const __VLS_130 = {
    /** @type {typeof __VLS_129.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_131;
var __VLS_127;
var __VLS_128;
// @ts-ignore
var __VLS_132 = __VLS_131;
// @ts-ignore
[refresh,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
