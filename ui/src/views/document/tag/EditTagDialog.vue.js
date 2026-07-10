/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
const route = useRoute();
const { params: { id }, // id is knowledgeID
 } = route;
const emit = defineEmits(['refresh']);
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
const isEditKey = ref(false);
const form = ref({
    id: '',
    key: '',
    value: '',
});
const loading = ref(false);
const dialogVisible = ref(false);
const submit = () => {
    FormRef.value.validate((valid) => {
        if (valid) {
            loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                .putTag(id, form.value.id, form.value, loading)
                .then((res) => {
                close();
                emit('refresh');
            });
        }
    });
};
const open = (row, isKey) => {
    dialogVisible.value = true;
    form.value.id = row.id;
    form.value.key = row.key;
    form.value.value = row.value;
    isEditKey.value = isKey;
};
const close = () => {
    dialogVisible.value = false;
};
const __VLS_exposed = { open, close };
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
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEditKey ? __VLS_ctx.$t('views.document.tag.edit') : __VLS_ctx.$t('views.document.tag.editValue')),
    beforeClose: (__VLS_ctx.close),
    width: (__VLS_ctx.isEditKey ? '500px' : '50%'),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEditKey ? __VLS_ctx.$t('views.document.tag.edit') : __VLS_ctx.$t('views.document.tag.editValue')),
    beforeClose: (__VLS_ctx.close),
    width: (__VLS_ctx.isEditKey ? '500px' : '50%'),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
if (__VLS_ctx.isEditKey) {
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        label: (__VLS_ctx.$t('views.document.tag.key')),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
        prop: "key",
    }));
    const __VLS_19 = __VLS_18({
        label: (__VLS_ctx.$t('views.document.tag.key')),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
        prop: "key",
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    const { default: __VLS_22 } = __VLS_20.slots;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        modelValue: (__VLS_ctx.form.key),
    }));
    const __VLS_25 = __VLS_24({
        modelValue: (__VLS_ctx.form.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    // @ts-ignore
    [dialogVisible, isEditKey, isEditKey, isEditKey, $t, $t, $t, $t, close, form, form,];
    var __VLS_20;
}
else {
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        gutter: (8),
        align: "bottom",
    }));
    const __VLS_30 = __VLS_29({
        gutter: (8),
        align: "bottom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    const { default: __VLS_33 } = __VLS_31.slots;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        span: (12),
    }));
    const __VLS_36 = __VLS_35({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    const { default: __VLS_39 } = __VLS_37.slots;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        label: (__VLS_ctx.$t('views.document.tag.key')),
        prop: "key",
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
    }));
    const __VLS_42 = __VLS_41({
        label: (__VLS_ctx.$t('views.document.tag.key')),
        prop: "key",
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const { default: __VLS_45 } = __VLS_43.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        modelValue: (__VLS_ctx.form.key),
        disabled: (true),
    }));
    const __VLS_48 = __VLS_47({
        modelValue: (__VLS_ctx.form.key),
        disabled: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [$t, $t, form,];
    var __VLS_43;
    // @ts-ignore
    [];
    var __VLS_37;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        span: (12),
    }));
    const __VLS_53 = __VLS_52({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_56 } = __VLS_54.slots;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        label: (__VLS_ctx.$t('views.document.tag.value')),
        prop: "value",
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage2'),
            trigger: 'blur',
        }),
    }));
    const __VLS_59 = __VLS_58({
        label: (__VLS_ctx.$t('views.document.tag.value')),
        prop: "value",
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage2'),
            trigger: 'blur',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const { default: __VLS_62 } = __VLS_60.slots;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        modelValue: (__VLS_ctx.form.value),
    }));
    const __VLS_65 = __VLS_64({
        modelValue: (__VLS_ctx.form.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    // @ts-ignore
    [$t, $t, form,];
    var __VLS_60;
    // @ts-ignore
    [];
    var __VLS_54;
    // @ts-ignore
    [];
    var __VLS_31;
}
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_68 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        ...{ 'onClick': {} },
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_74;
    const __VLS_75 = {
        /** @type {typeof __VLS_74.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_76 } = __VLS_72.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_72;
    var __VLS_73;
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_79 = __VLS_78({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_82;
    const __VLS_83 = {
        /** @type {typeof __VLS_82.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_84 } = __VLS_80.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, submit,];
    var __VLS_80;
    var __VLS_81;
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
