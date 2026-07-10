/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { MsgSuccess } from '@/utils/message';
import { hitHandlingMethod } from '@/enums/document';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { t } from '@/locales';
const route = useRoute();
const { params: { id, type }, } = route;
const props = defineProps({
    title: String,
});
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
const emit = defineEmits(['refresh']);
const webFormRef = ref();
const loading = ref(false);
const isImport = ref(false);
const form = ref({
    source_url: '',
    selector: '',
    hit_handling_method: 'optimization',
    directly_return_similarity: 0.9,
    allow_download: true,
});
// DocumentSettings
const documentId = ref('');
const documentType = ref(''); //DocumentType：1: webDocument；0:NormalDocument
// BatchSettings
const documentList = ref([]);
const rules = reactive({
    source_url: [
        {
            required: true,
            message: t('views.document.form.source_url.requiredMessage'),
            trigger: 'blur',
        },
    ],
    directly_return_similarity: [
        {
            required: true,
            message: t('views.document.form.similarity.requiredMessage'),
            trigger: 'blur',
        },
    ],
});
const dialogVisible = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            source_url: '',
            selector: '',
            hit_handling_method: 'optimization',
            directly_return_similarity: 0.9,
            allow_download: true,
        };
        isImport.value = false;
        documentType.value = '';
        documentId.value = '';
        documentList.value = [];
    }
});
const open = (row, list) => {
    if (row) {
        documentType.value = row.type;
        documentId.value = row.id;
        form.value = {
            hit_handling_method: row.hit_handling_method,
            directly_return_similarity: row.directly_return_similarity,
            ...row.meta,
            meta: row.meta,
        };
        isImport.value = false;
    }
    else if (list) {
        // BatchSettings
        documentList.value = list;
    }
    else {
        // Import OnlywebDocumentType
        documentType.value = 1;
        isImport.value = true;
    }
    dialogVisible.value = true;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            if (isImport.value) {
                const obj = {
                    source_url_list: form.value.source_url.split('\n'),
                    selector: form.value.selector,
                    allow_download: form.value.allow_download,
                };
                loadSharedApi({ type: 'document', systemType: apiType.value })
                    .postWebDocument(id, obj, loading)
                    .then(() => {
                    MsgSuccess(t('views.document.tip.importMessage'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            else {
                if (documentId.value) {
                    const obj = {
                        hit_handling_method: form.value.hit_handling_method,
                        directly_return_similarity: form.value.directly_return_similarity,
                        // FeishuDocumentNeedsPassmetaInfo, notCan be by pageformOverride
                        meta: {
                            ...form.value.meta,
                            ...{
                                source_url: form.value.source_url,
                                selector: form.value.selector,
                                allow_download: form.value.allow_download,
                            },
                        },
                    };
                    loadSharedApi({ type: 'document', systemType: apiType.value })
                        .putDocument(id, documentId.value, obj, loading)
                        .then(() => {
                        MsgSuccess(t('common.settingSuccess'));
                        emit('refresh');
                        dialogVisible.value = false;
                    });
                }
                else if (documentList.value.length > 0) {
                    // BatchSettings
                    const obj = {
                        hit_handling_method: form.value.hit_handling_method,
                        directly_return_similarity: form.value.directly_return_similarity,
                        id_list: documentList.value,
                        allow_download: form.value.allow_download,
                    };
                    loadSharedApi({ type: 'document', systemType: apiType.value })
                        .putBatchEditHitHandling(id, obj, loading)
                        .then(() => {
                        MsgSuccess(t('common.settingSuccess'));
                        emit('refresh');
                        dialogVisible.value = false;
                    });
                }
            }
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
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    width: "550",
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    width: "550",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelPosition: "top",
    ref: "webFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "webFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
if (__VLS_ctx.isImport) {
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        label: (__VLS_ctx.$t('views.document.form.source_url.label')),
        prop: "source_url",
    }));
    const __VLS_17 = __VLS_16({
        label: (__VLS_ctx.$t('views.document.form.source_url.label')),
        prop: "source_url",
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    const { default: __VLS_20 } = __VLS_18.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        modelValue: (__VLS_ctx.form.source_url),
        placeholder: (__VLS_ctx.$t('views.document.form.source_url.placeholder')),
        rows: (10),
        type: "textarea",
    }));
    const __VLS_23 = __VLS_22({
        modelValue: (__VLS_ctx.form.source_url),
        placeholder: (__VLS_ctx.$t('views.document.form.source_url.placeholder')),
        rows: (10),
        type: "textarea",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    // @ts-ignore
    [title, dialogVisible, rules, form, form, isImport, $t, $t,];
    var __VLS_18;
}
else if (!__VLS_ctx.isImport && __VLS_ctx.documentType === 1) {
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        label: (__VLS_ctx.$t('views.document.form.source_url.label')),
        prop: "source_url",
    }));
    const __VLS_28 = __VLS_27({
        label: (__VLS_ctx.$t('views.document.form.source_url.label')),
        prop: "source_url",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    const { default: __VLS_31 } = __VLS_29.slots;
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        modelValue: (__VLS_ctx.form.source_url),
        placeholder: (__VLS_ctx.$t('views.document.form.source_url.requiredMessage')),
    }));
    const __VLS_34 = __VLS_33({
        modelValue: (__VLS_ctx.form.source_url),
        placeholder: (__VLS_ctx.$t('views.document.form.source_url.requiredMessage')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    // @ts-ignore
    [form, isImport, $t, $t, documentType,];
    var __VLS_29;
}
if (__VLS_ctx.documentType === 1) {
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        label: (__VLS_ctx.$t('views.document.form.selector.label')),
    }));
    const __VLS_39 = __VLS_38({
        label: (__VLS_ctx.$t('views.document.form.selector.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    const { default: __VLS_42 } = __VLS_40.slots;
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        modelValue: (__VLS_ctx.form.selector),
        placeholder: (__VLS_ctx.$t('views.document.form.selector.placeholder')),
    }));
    const __VLS_45 = __VLS_44({
        modelValue: (__VLS_ctx.form.selector),
        placeholder: (__VLS_ctx.$t('views.document.form.selector.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    // @ts-ignore
    [form, $t, $t, documentType,];
    var __VLS_40;
}
if (!__VLS_ctx.isImport) {
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({}));
    const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const { default: __VLS_53 } = __VLS_51.slots;
    {
        const { label: __VLS_54 } = __VLS_51.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.document.form.hit_handling_method.label'));
        let __VLS_55;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.form.hit_handling_method.tooltip')),
            placement: "right",
        }));
        const __VLS_57 = __VLS_56({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.form.hit_handling_method.tooltip')),
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_56));
        const { default: __VLS_60 } = __VLS_58.slots;
        let __VLS_61;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_63 = __VLS_62({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [isImport, $t, $t,];
        var __VLS_58;
        // @ts-ignore
        [];
    }
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        modelValue: (__VLS_ctx.form.hit_handling_method),
        ...{ class: "radio-block mt-4" },
    }));
    const __VLS_68 = __VLS_67({
        modelValue: (__VLS_ctx.form.hit_handling_method),
        ...{ class: "radio-block mt-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    /** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    const { default: __VLS_71 } = __VLS_69.slots;
    for (const [value, key] of __VLS_vFor((__VLS_ctx.hitHandlingMethod))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (key),
        });
        let __VLS_72;
        /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
        elRadio;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
            value: (key),
        }));
        const __VLS_74 = __VLS_73({
            value: (key),
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        const { default: __VLS_77 } = __VLS_75.slots;
        (__VLS_ctx.$t(value));
        // @ts-ignore
        [form, $t, hitHandlingMethod,];
        var __VLS_75;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_69;
    // @ts-ignore
    [];
    var __VLS_51;
}
if (!__VLS_ctx.isImport && __VLS_ctx.form.hit_handling_method === 'directly_return') {
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        prop: "directly_return_similarity",
    }));
    const __VLS_80 = __VLS_79({
        prop: "directly_return_similarity",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const { default: __VLS_83 } = __VLS_81.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "lighter w-full" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.document.form.similarity.label'));
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        modelValue: (__VLS_ctx.form.directly_return_similarity),
        min: (0),
        max: (1),
        precision: (3),
        step: (0.1),
        valueOnClear: (0),
        controlsPosition: "right",
        size: "small",
        ...{ class: "ml-4 mr-4" },
    }));
    const __VLS_86 = __VLS_85({
        modelValue: (__VLS_ctx.form.directly_return_similarity),
        min: (0),
        max: (1),
        precision: (3),
        step: (0.1),
        valueOnClear: (0),
        controlsPosition: "right",
        size: "small",
        ...{ class: "ml-4 mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.document.form.similarity.placeholder'));
    // @ts-ignore
    [form, form, isImport, $t, $t,];
    var __VLS_81;
}
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    prop: "allow_download",
}));
const __VLS_91 = __VLS_90({
    prop: "allow_download",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const { default: __VLS_94 } = __VLS_92.slots;
let __VLS_95;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
    modelValue: (__VLS_ctx.form.allow_download),
}));
const __VLS_97 = __VLS_96({
    modelValue: (__VLS_ctx.form.allow_download),
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const { default: __VLS_100 } = __VLS_98.slots;
(__VLS_ctx.type === '1'
    ? __VLS_ctx.$t('views.document.form.allow_preview')
    : __VLS_ctx.$t('views.document.form.allow_download'));
// @ts-ignore
[form, $t, $t, type,];
var __VLS_98;
// @ts-ignore
[];
var __VLS_92;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_101 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = {
        /** @type {typeof __VLS_107.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_109 } = __VLS_105.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_105;
    var __VLS_106;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_112 = __VLS_111({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    let __VLS_115;
    const __VLS_116 = {
        /** @type {typeof __VLS_115.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.webFormRef);
            // @ts-ignore
            [loading, submit, webFormRef,];
        },
    };
    const { default: __VLS_117 } = __VLS_113.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t,];
    var __VLS_113;
    var __VLS_114;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        title: String,
    },
});
export default {};
