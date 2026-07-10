/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import DynamicsForm from '@/components/dynamics-form/index.vue';
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
const FormRef = ref();
const dynamicsFormRef = ref();
const loading = ref(false);
const debugVisible = ref(false);
const showResult = ref(false);
const isSuccess = ref(false);
const result = ref('');
const form = ref({
    debug_field_list: [],
    code: '',
    input_field_list: [],
    init_field_list: [],
    init_params: {},
});
watch(debugVisible, (bool) => {
    if (!bool) {
        showResult.value = false;
        isSuccess.value = false;
        result.value = '';
        form.value = {
            debug_field_list: [],
            code: '',
            input_field_list: [],
            init_field_list: [],
            init_params: {},
        };
    }
});
const submit = async (formEl) => {
    const validate = formEl ? formEl.validate() : Promise.resolve();
    Promise.all([dynamicsFormRef.value?.validate(), validate]).then(() => {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .postToolDebug(form.value, loading)
            .then((res) => {
            if (res.code === 500) {
                showResult.value = true;
                isSuccess.value = false;
                result.value = res.message;
            }
            else {
                showResult.value = true;
                isSuccess.value = true;
                result.value = res.data;
            }
        });
    });
};
const open = (data) => {
    if (data.input_field_list.length > 0) {
        data.input_field_list.forEach((item) => {
            form.value.debug_field_list.push({
                value: '',
                ...item,
            });
        });
    }
    form.value.code = data.code;
    form.value.input_field_list = data.input_field_list;
    form.value.init_field_list = data.init_field_list;
    debugVisible.value = true;
};
const __VLS_exposed = {
    open,
};
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
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
    modal: (false),
    showClose: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
    modal: (false),
    showClose: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        ...{ class: "cursor mr-4" },
        link: true,
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        ...{ class: "cursor mr-4" },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.debugVisible = false;
            // @ts-ignore
            [debugVisible, debugVisible,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_15 } = __VLS_11.slots;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        size: (20),
    }));
    const __VLS_18 = __VLS_17({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    const { default: __VLS_21 } = __VLS_19.slots;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.Back} */
    Back;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    // @ts-ignore
    [];
    var __VLS_19;
    // @ts-ignore
    [];
    var __VLS_11;
    var __VLS_12;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('common.debug'));
    // @ts-ignore
    [$t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.form.init_field_list.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    (__VLS_ctx.$t('common.param.initParam'));
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        shadow: "never",
        ...{ class: "card-never" },
        ...{ style: {} },
    }));
    const __VLS_29 = __VLS_28({
        shadow: "never",
        ...{ class: "card-never" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    const { default: __VLS_32 } = __VLS_30.slots;
    const __VLS_33 = DynamicsForm || DynamicsForm;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        modelValue: (__VLS_ctx.form.init_params),
        model: (__VLS_ctx.form.init_params),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        render_data: (__VLS_ctx.form.init_field_list),
        ref: "dynamicsFormRef",
    }));
    const __VLS_35 = __VLS_34({
        modelValue: (__VLS_ctx.form.init_params),
        model: (__VLS_ctx.form.init_params),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        render_data: (__VLS_ctx.form.init_field_list),
        ref: "dynamicsFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    var __VLS_38;
    var __VLS_36;
    // @ts-ignore
    [$t, form, form, form, form,];
    var __VLS_30;
}
if (__VLS_ctx.form.debug_field_list.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    (__VLS_ctx.$t('common.param.inputParam'));
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        shadow: "never",
        ...{ class: "card-never" },
        ...{ style: {} },
    }));
    const __VLS_42 = __VLS_41({
        shadow: "never",
        ...{ class: "card-never" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    const { default: __VLS_45 } = __VLS_43.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        ...{ 'onSubmit': {} },
        ref: "FormRef",
        model: (__VLS_ctx.form),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        hideRequiredAsterisk: true,
    }));
    const __VLS_48 = __VLS_47({
        ...{ 'onSubmit': {} },
        ref: "FormRef",
        model: (__VLS_ctx.form),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        hideRequiredAsterisk: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    let __VLS_51;
    const __VLS_52 = {
        /** @type {typeof __VLS_51.submit} */
        onSubmit: () => { },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    var __VLS_53;
    const { default: __VLS_55 } = __VLS_49.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.form.debug_field_list))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_56;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
            label: (item.name),
            prop: ('debug_field_list.' + index + '.value'),
            rules: ({
                required: item.is_required,
                message: __VLS_ctx.$t('views.tool.form.param.inputPlaceholder'),
                trigger: 'blur',
            }),
        }));
        const __VLS_58 = __VLS_57({
            label: (item.name),
            prop: ('debug_field_list.' + index + '.value'),
            rules: ({
                required: item.is_required,
                message: __VLS_ctx.$t('views.tool.form.param.inputPlaceholder'),
                trigger: 'blur',
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        const { default: __VLS_61 } = __VLS_59.slots;
        {
            const { label: __VLS_62 } = __VLS_59.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (item.name);
            if (item.is_required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            let __VLS_63;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-4" },
            }));
            const __VLS_65 = __VLS_64({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_64));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            const { default: __VLS_68 } = __VLS_66.slots;
            (item.type);
            // @ts-ignore
            [$t, $t, form, form, form, vLoading, loading,];
            var __VLS_66;
            // @ts-ignore
            [];
        }
        let __VLS_69;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
            modelValue: (item.value),
            placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
        }));
        const __VLS_71 = __VLS_70({
            modelValue: (item.value),
            placeholder: (__VLS_ctx.$t('views.tool.form.param.inputPlaceholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        // @ts-ignore
        [$t,];
        var __VLS_59;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_49;
    var __VLS_50;
    // @ts-ignore
    [];
    var __VLS_43;
}
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}));
const __VLS_76 = __VLS_75({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
let __VLS_79;
const __VLS_80 = {
    /** @type {typeof __VLS_79.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.submit(__VLS_ctx.FormRef);
        // @ts-ignore
        [loading, submit, FormRef,];
    },
};
const { default: __VLS_81 } = __VLS_77.slots;
(__VLS_ctx.$t('views.tool.form.debug.run'));
// @ts-ignore
[$t,];
var __VLS_77;
var __VLS_78;
if (__VLS_ctx.showResult) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16 mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    (__VLS_ctx.$t('views.tool.form.debug.runResult'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    if (__VLS_ctx.isSuccess) {
        let __VLS_82;
        /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
        elAlert;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
            title: (__VLS_ctx.$t('views.tool.form.debug.runSuccess')),
            type: "success",
            showIcon: true,
            closable: (false),
        }));
        const __VLS_84 = __VLS_83({
            title: (__VLS_ctx.$t('views.tool.form.debug.runSuccess')),
            type: "success",
            showIcon: true,
            closable: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    }
    else {
        let __VLS_87;
        /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
        elAlert;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
            title: (__VLS_ctx.$t('views.tool.form.debug.runFailed')),
            type: "error",
            showIcon: true,
            closable: (false),
        }));
        const __VLS_89 = __VLS_88({
            title: (__VLS_ctx.$t('views.tool.form.debug.runFailed')),
            type: "error",
            showIcon: true,
            closable: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "lighter mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('views.tool.form.debug.output'));
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        ...{ class: (__VLS_ctx.isSuccess ? '' : 'color-danger') },
        ...{ class: "pre-wrap" },
        shadow: "never",
    }));
    const __VLS_94 = __VLS_93({
        ...{ class: (__VLS_ctx.isSuccess ? '' : 'color-danger') },
        ...{ class: "pre-wrap" },
        shadow: "never",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
    const { default: __VLS_97 } = __VLS_95.slots;
    (String(__VLS_ctx.result) == '0' ? 0 : __VLS_ctx.result || '-');
    // @ts-ignore
    [$t, $t, $t, $t, showResult, isSuccess, isSuccess, result, result,];
    var __VLS_95;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_39 = __VLS_38, __VLS_54 = __VLS_53;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
