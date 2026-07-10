/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import JsonInput from '@/components/dynamics-form/items/JsonInput.vue';
import ResultDrawer from './ResultDrawer.vue';
const index = ref(0);
const route = useRoute();
const { params: { folderId },
/*
folderId Can distinguish resource-management sharedOr workspace
*/
 } = route;
const isShared = computed(() => {
    return folderId === 'share';
});
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('share/')) {
        return 'workspaceShare';
    }
    else {
        return 'workspace';
    }
});
const toolDetail = ref(null);
const userInputFieldList = computed(() => {
    return (toolDetail.value?.work_flow?.nodes?.find((node) => node.id === 'tool-base-node')
        ?.properties?.user_input_field_list || []);
});
const closeResult = () => {
    index.value++;
};
function getDetail(toolId) {
    loadSharedApi({ type: 'tool', isShared: isShared.value, systemType: apiType.value })
        .getToolById(toolId)
        .then((res) => {
        toolDetail.value = res.data;
    });
}
const formRef = ref();
const userInputForm = ref({});
const ToolResultDrawerRef = ref();
const run = () => {
    if (userInputFieldList.value.length === 0) {
        ToolResultDrawerRef.value?.open(toolDetail.value.id, userInputForm.value);
    }
    else {
        formRef.value?.validate((valid) => {
            if (!valid)
                return;
            ToolResultDrawerRef.value?.open(toolDetail.value.id, userInputForm.value);
        });
    }
};
const drawer = ref(false);
const open = (toolId) => {
    getDetail(toolId);
    drawer.value = true;
};
const close = () => {
    drawer.value = false;
    toolDetail.value = null;
    userInputForm.value = {};
};
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.drawer),
    title: (__VLS_ctx.$t('common.debug')),
    direction: "rtl",
    beforeClose: (__VLS_ctx.close),
    destroyOnClose: (true),
    size: "800px",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawer),
    title: (__VLS_ctx.$t('common.debug')),
    direction: "rtl",
    beforeClose: (__VLS_ctx.close),
    destroyOnClose: (true),
    size: "800px",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.userInputFieldList.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    (__VLS_ctx.$t('common.param.inputParam'));
}
if (__VLS_ctx.userInputFieldList.length > 0) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ 'onSubmit': {} },
        ref: "formRef",
        model: (__VLS_ctx.userInputForm),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        hideRequiredAsterisk: true,
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onSubmit': {} },
        ref: "formRef",
        model: (__VLS_ctx.userInputForm),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        hideRequiredAsterisk: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_12;
    const __VLS_13 = {
        /** @type {typeof __VLS_12.submit} */
        onSubmit: () => { },
    };
    var __VLS_14;
    const { default: __VLS_16 } = __VLS_10.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.userInputFieldList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_17;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
            label: (item.label),
            prop: (item.field),
            rules: ({
                required: item.is_required,
                message: __VLS_ctx.$t('views.tool.form.param.inputPlaceholder'),
                trigger: 'blur',
            }),
        }));
        const __VLS_19 = __VLS_18({
            label: (item.label),
            prop: (item.field),
            rules: ({
                required: item.is_required,
                message: __VLS_ctx.$t('views.tool.form.param.inputPlaceholder'),
                trigger: 'blur',
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        const { default: __VLS_22 } = __VLS_20.slots;
        {
            const { label: __VLS_23 } = __VLS_20.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (item.label);
            if (item.is_required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            let __VLS_24;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
                type: "info",
                ...{ class: "info-tag ml-4" },
            }));
            const __VLS_26 = __VLS_25({
                type: "info",
                ...{ class: "info-tag ml-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            const { default: __VLS_29 } = __VLS_27.slots;
            (item.type);
            // @ts-ignore
            [drawer, $t, $t, $t, close, userInputFieldList, userInputFieldList, userInputFieldList, userInputForm,];
            var __VLS_27;
            // @ts-ignore
            [];
        }
        if (['string'].includes(item.type)) {
            let __VLS_30;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
                placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
            }));
            const __VLS_32 = __VLS_31({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
                placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        }
        if (['array', 'dict'].includes(item.type)) {
            const __VLS_35 = JsonInput;
            // @ts-ignore
            const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
            }));
            const __VLS_37 = __VLS_36({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
            }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        }
        if (['int', 'float'].includes(item.type)) {
            let __VLS_40;
            /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
            elInputNumber;
            // @ts-ignore
            const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
            }));
            const __VLS_42 = __VLS_41({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
            }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        }
        if (['boolean'].includes(item.type)) {
            let __VLS_45;
            /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
            elSwitch;
            // @ts-ignore
            const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
                activeValue: (true),
                inactiveValue: (false),
            }));
            const __VLS_47 = __VLS_46({
                modelValue: (__VLS_ctx.userInputForm[item.field]),
                activeValue: (true),
                inactiveValue: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        }
        // @ts-ignore
        [$t, userInputForm, userInputForm, userInputForm, userInputForm,];
        var __VLS_20;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_10;
    var __VLS_11;
}
{
    const { footer: __VLS_50 } = __VLS_3.slots;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_58 } = __VLS_54.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_54;
    var __VLS_55;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (__VLS_ctx.run),
    };
    const { default: __VLS_66 } = __VLS_62.slots;
    (__VLS_ctx.$t('views.tool.form.debug.run'));
    // @ts-ignore
    [$t, run,];
    var __VLS_62;
    var __VLS_63;
    // @ts-ignore
    [];
}
const __VLS_67 = ResultDrawer;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    ...{ 'onClose': {} },
    key: (__VLS_ctx.index),
    ref: "ToolResultDrawerRef",
}));
const __VLS_69 = __VLS_68({
    ...{ 'onClose': {} },
    key: (__VLS_ctx.index),
    ref: "ToolResultDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
let __VLS_72;
const __VLS_73 = {
    /** @type {typeof __VLS_72.close} */
    onClose: (__VLS_ctx.closeResult),
};
var __VLS_74;
var __VLS_70;
var __VLS_71;
// @ts-ignore
[index, closeResult,];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_75 = __VLS_74;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
