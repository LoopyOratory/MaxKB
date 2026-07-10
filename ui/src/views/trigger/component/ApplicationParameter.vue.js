/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, watch } from 'vue';
import { t } from '@/locales';
const applicationParameterFormRef = ref();
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const showSource = computed(() => {
    return props.trigger.trigger_type === 'EVENT' && props.trigger.trigger_setting.body.length > 0;
});
watch(() => showSource.value, () => {
    if (!showSource.value) {
        const parameter = { ...props.modelValue };
        base_field_list.value.forEach((f) => {
            if (!parameter[f.field]) {
                parameter[f.field] = { source: 'custom', value: f.default_value };
            }
            else {
                parameter[f.field] = { ...parameter[f.field], source: 'custom' };
            }
        });
        api_input_field_list.value.forEach((f) => {
            if (!parameter.api_input_field_list) {
                parameter['api_input_field_list'] = {};
            }
            if (!parameter['api_input_field_list'][f.field]) {
                parameter['api_input_field_list'][f.field] = {
                    source: 'custom',
                    value: f.default_value ? f.default_value : '',
                };
            }
            else {
                parameter['api_input_field_list'][f.field] = {
                    ...parameter['api_input_field_list'][f.field],
                    source: 'custom',
                };
            }
        });
        user_input_field_list.value.forEach((f) => {
            if (!parameter['user_input_field_list']) {
                parameter['user_input_field_list'] = {};
            }
            if (!parameter['user_input_field_list'][f.field]) {
                parameter['user_input_field_list'][f.field] = {
                    source: 'custom',
                    value: f.default_value ? f.default_value : '',
                };
            }
            else {
                parameter['user_input_field_list'][f.field] = {
                    ...parameter['user_input_field_list'][f.field],
                    source: 'custom',
                };
            }
        });
        emit('update:modelValue', { ...parameter });
    }
});
const options = computed(() => {
    if (props.trigger.trigger_type === 'EVENT') {
        const body = props.trigger.trigger_setting.body;
        if (body) {
            return [
                {
                    label: 'body',
                    value: 'body',
                    children: body.map((item) => ({ label: item.field, value: item.field })),
                },
            ];
        }
        return [];
    }
    else {
    }
    return [];
});
const base_node = computed(() => {
    return (props.application?.work_flow?.nodes || []).find((n) => n.type === 'base-node');
});
const api_input_field_list = computed(() => {
    const result = [];
    if (base_node.value && base_node.value.properties.api_input_field_list) {
        base_node.value.properties.api_input_field_list.forEach((item) => {
            result.push({
                field: item.variable,
                required: item.is_required,
                label: { value: item.variable },
            });
        });
    }
    return result;
});
const user_input_field_list = computed(() => {
    const result = [];
    if (base_node.value && base_node.value.properties.user_input_field_list) {
        base_node.value.properties.user_input_field_list.forEach((item) => {
            result.push({
                field: item.field,
                required: item.required,
                label: typeof item.label == 'string'
                    ? { value: item.label }
                    : { ...item.label, value: item.label.label },
            });
        });
    }
    return result;
});
const base_field_list = computed(() => {
    const result = [
        { field: 'question', required: true, default_value: '', label: { value: 'Question' } },
    ];
    if (base_node.value) {
        if (base_node.value.properties.node_data.file_upload_enable) {
            if (base_node.value.properties.node_data.file_upload_setting.document) {
                result.push({
                    field: 'document_list',
                    required: true,
                    default_value: '[]',
                    label: { value: t('common.fileUpload.document') },
                });
            }
            if (base_node.value.properties.node_data.file_upload_setting.image) {
                result.push({
                    field: 'image_list',
                    required: true,
                    default_value: '[]',
                    label: { value: t('common.fileUpload.image') },
                });
            }
            if (base_node.value.properties.node_data.file_upload_setting.audio) {
                result.push({
                    field: 'audio_list',
                    required: true,
                    default_value: '[]',
                    label: { value: t('common.fileUpload.audio') },
                });
            }
            if (base_node.value.properties.node_data.file_upload_setting.video) {
                result.push({
                    field: 'video_list',
                    required: true,
                    default_value: '[]',
                    label: { value: t('common.fileUpload.video') },
                });
            }
            if (base_node.value.properties.node_data.file_upload_setting.other) {
                result.push({
                    field: 'other_list',
                    required: true,
                    default_value: '[]',
                    label: { value: t('common.fileUpload.other') },
                });
            }
        }
    }
    return result;
});
const init_parameters = () => {
    const parameter = { ...props.modelValue };
    base_field_list.value.forEach((f) => {
        if (!parameter[f.field]) {
            parameter[f.field] = { source: 'custom', value: f.default_value };
        }
    });
    api_input_field_list.value.forEach((f) => {
        if (!parameter.api_input_field_list) {
            parameter['api_input_field_list'] = {};
        }
        if (!parameter['api_input_field_list'][f.field]) {
            parameter['api_input_field_list'][f.field] = {
                source: 'custom',
                value: f.default_value ? f.default_value : '',
            };
        }
    });
    user_input_field_list.value.forEach((f) => {
        if (!parameter['user_input_field_list']) {
            parameter['user_input_field_list'] = {};
        }
        if (!parameter['user_input_field_list'][f.field]) {
            parameter['user_input_field_list'][f.field] = {
                source: 'custom',
                value: f.default_value ? f.default_value : '',
            };
        }
    });
    emit('update:modelValue', { ...parameter });
};
init_parameters();
const validate = () => {
    return applicationParameterFormRef.value?.validate();
};
const __VLS_exposed = { validate };
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
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.modelValue),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    hideRequiredAsterisk: true,
    ref: "applicationParameterFormRef",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.modelValue),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    hideRequiredAsterisk: true,
    ref: "applicationParameterFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.submit} */
    onSubmit: () => { },
};
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
for (const [f, index] of __VLS_vFor((__VLS_ctx.base_field_list))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (f.field),
    });
    if (__VLS_ctx.modelValue[f.field]) {
        let __VLS_10;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
            label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
            prop: (`${f.field}.value`),
            rules: ({
                message: __VLS_ctx.$t('common.inputPlaceholder'),
                trigger: 'blur',
                required: f.required,
            }),
        }));
        const __VLS_12 = __VLS_11({
            label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
            prop: (`${f.field}.value`),
            rules: ({
                message: __VLS_ctx.$t('common.inputPlaceholder'),
                trigger: 'blur',
                required: f.required,
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        const { default: __VLS_15 } = __VLS_13.slots;
        {
            const { label: __VLS_16 } = __VLS_13.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            (f.label.value);
            if (f.required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            if (__VLS_ctx.modelValue[f.field] &&
                __VLS_ctx.trigger.trigger_type === 'EVENT' &&
                __VLS_ctx.trigger.trigger_setting.body.length) {
                let __VLS_17;
                /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
                elSelect;
                // @ts-ignore
                const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
                    teleported: (false),
                    modelValue: (__VLS_ctx.modelValue[f.field].source),
                    size: "small",
                    ...{ style: {} },
                }));
                const __VLS_19 = __VLS_18({
                    teleported: (false),
                    modelValue: (__VLS_ctx.modelValue[f.field].source),
                    size: "small",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_18));
                const { default: __VLS_22 } = __VLS_20.slots;
                let __VLS_23;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
                    label: (__VLS_ctx.$t('aiChat.quote')),
                    value: "reference",
                }));
                const __VLS_25 = __VLS_24({
                    label: (__VLS_ctx.$t('aiChat.quote')),
                    value: "reference",
                }, ...__VLS_functionalComponentArgsRest(__VLS_24));
                let __VLS_28;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
                    label: (__VLS_ctx.$t('common.custom')),
                    value: "custom",
                }));
                const __VLS_30 = __VLS_29({
                    label: (__VLS_ctx.$t('common.custom')),
                    value: "custom",
                }, ...__VLS_functionalComponentArgsRest(__VLS_29));
                // @ts-ignore
                [modelValue, modelValue, modelValue, modelValue, base_field_list, $t, $t, $t, $t, trigger, trigger,];
                var __VLS_20;
            }
            // @ts-ignore
            [];
        }
        if (__VLS_ctx.modelValue[f.field].source === 'reference') {
            let __VLS_33;
            /** @ts-ignore @type { | typeof __VLS_components.elCascader | typeof __VLS_components.ElCascader | typeof __VLS_components['el-cascader']} */
            elCascader;
            // @ts-ignore
            const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
                modelValue: (__VLS_ctx.modelValue[f.field].value),
                options: (__VLS_ctx.options),
                placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
                props: (props),
                ...{ style: {} },
            }));
            const __VLS_35 = __VLS_34({
                modelValue: (__VLS_ctx.modelValue[f.field].value),
                options: (__VLS_ctx.options),
                placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
                props: (props),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        }
        else {
            let __VLS_38;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
                modelValue: (__VLS_ctx.modelValue[f.field].value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
            }));
            const __VLS_40 = __VLS_39({
                modelValue: (__VLS_ctx.modelValue[f.field].value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        }
        // @ts-ignore
        [modelValue, modelValue, modelValue, $t, $t, options,];
        var __VLS_13;
    }
    // @ts-ignore
    [];
}
for (const [f, index] of __VLS_vFor((__VLS_ctx.user_input_field_list))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (f.field),
    });
    if (__VLS_ctx.modelValue['user_input_field_list'] && __VLS_ctx.modelValue['user_input_field_list'][f.field]) {
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
            label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
            prop: (`user_input_field_list.${f.field}.value`),
            rules: ({
                message: __VLS_ctx.$t('common.inputPlaceholder'),
                trigger: 'blur',
                required: f.required,
            }),
        }));
        const __VLS_45 = __VLS_44({
            label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
            prop: (`user_input_field_list.${f.field}.value`),
            rules: ({
                message: __VLS_ctx.$t('common.inputPlaceholder'),
                trigger: 'blur',
                required: f.required,
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        const { default: __VLS_48 } = __VLS_46.slots;
        {
            const { label: __VLS_49 } = __VLS_46.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            (f.label.value);
            if (f.required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            if (__VLS_ctx.modelValue['user_input_field_list'][f.field] &&
                __VLS_ctx.trigger.trigger_type === 'EVENT' &&
                __VLS_ctx.trigger.trigger_setting.body.length) {
                let __VLS_50;
                /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
                elSelect;
                // @ts-ignore
                const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
                    teleported: (false),
                    modelValue: (__VLS_ctx.modelValue['user_input_field_list'][f.field].source),
                    size: "small",
                    ...{ style: {} },
                }));
                const __VLS_52 = __VLS_51({
                    teleported: (false),
                    modelValue: (__VLS_ctx.modelValue['user_input_field_list'][f.field].source),
                    size: "small",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_51));
                const { default: __VLS_55 } = __VLS_53.slots;
                let __VLS_56;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
                    label: (__VLS_ctx.$t('aiChat.quote')),
                    value: "reference",
                }));
                const __VLS_58 = __VLS_57({
                    label: (__VLS_ctx.$t('aiChat.quote')),
                    value: "reference",
                }, ...__VLS_functionalComponentArgsRest(__VLS_57));
                let __VLS_61;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
                    label: (__VLS_ctx.$t('common.custom')),
                    value: "custom",
                }));
                const __VLS_63 = __VLS_62({
                    label: (__VLS_ctx.$t('common.custom')),
                    value: "custom",
                }, ...__VLS_functionalComponentArgsRest(__VLS_62));
                // @ts-ignore
                [modelValue, modelValue, modelValue, modelValue, $t, $t, $t, $t, trigger, trigger, user_input_field_list,];
                var __VLS_53;
            }
            // @ts-ignore
            [];
        }
        if (__VLS_ctx.modelValue['user_input_field_list'][f.field].source === 'reference') {
            let __VLS_66;
            /** @ts-ignore @type { | typeof __VLS_components.elCascader | typeof __VLS_components.ElCascader | typeof __VLS_components['el-cascader']} */
            elCascader;
            // @ts-ignore
            const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
                modelValue: (__VLS_ctx.modelValue['user_input_field_list'][f.field].value),
                options: (__VLS_ctx.options),
                placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
                props: (props),
                ...{ style: {} },
            }));
            const __VLS_68 = __VLS_67({
                modelValue: (__VLS_ctx.modelValue['user_input_field_list'][f.field].value),
                options: (__VLS_ctx.options),
                placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
                props: (props),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        }
        else {
            let __VLS_71;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
                modelValue: (__VLS_ctx.modelValue['user_input_field_list'][f.field].value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
            }));
            const __VLS_73 = __VLS_72({
                modelValue: (__VLS_ctx.modelValue['user_input_field_list'][f.field].value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        }
        // @ts-ignore
        [modelValue, modelValue, modelValue, $t, $t, options,];
        var __VLS_46;
    }
    // @ts-ignore
    [];
}
for (const [f, index] of __VLS_vFor((__VLS_ctx.api_input_field_list))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (f.field),
    });
    if (__VLS_ctx.modelValue['api_input_field_list'] && __VLS_ctx.modelValue['api_input_field_list'][f.field]) {
        let __VLS_76;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
            label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
            prop: (`api_input_field_list.${f.field}.value`),
            rules: ({
                message: __VLS_ctx.$t('common.inputPlaceholder'),
                trigger: 'blur',
                required: f.required,
            }),
        }));
        const __VLS_78 = __VLS_77({
            label: (__VLS_ctx.$t('workflow.nodes.startNode.question')),
            prop: (`api_input_field_list.${f.field}.value`),
            rules: ({
                message: __VLS_ctx.$t('common.inputPlaceholder'),
                trigger: 'blur',
                required: f.required,
            }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        const { default: __VLS_81 } = __VLS_79.slots;
        {
            const { label: __VLS_82 } = __VLS_79.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            (f.label.value);
            if (f.required) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-danger" },
                });
                /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
            }
            if (__VLS_ctx.modelValue['api_input_field_list'][f.field] && __VLS_ctx.showSource) {
                let __VLS_83;
                /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
                elSelect;
                // @ts-ignore
                const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                    teleported: (false),
                    modelValue: (__VLS_ctx.modelValue['api_input_field_list'][f.field].source),
                    size: "small",
                    ...{ style: {} },
                }));
                const __VLS_85 = __VLS_84({
                    teleported: (false),
                    modelValue: (__VLS_ctx.modelValue['api_input_field_list'][f.field].source),
                    size: "small",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_84));
                const { default: __VLS_88 } = __VLS_86.slots;
                let __VLS_89;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
                    label: (__VLS_ctx.$t('aiChat.quote')),
                    value: "reference",
                }));
                const __VLS_91 = __VLS_90({
                    label: (__VLS_ctx.$t('aiChat.quote')),
                    value: "reference",
                }, ...__VLS_functionalComponentArgsRest(__VLS_90));
                let __VLS_94;
                /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                elOption;
                // @ts-ignore
                const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
                    label: (__VLS_ctx.$t('common.custom')),
                    value: "custom",
                }));
                const __VLS_96 = __VLS_95({
                    label: (__VLS_ctx.$t('common.custom')),
                    value: "custom",
                }, ...__VLS_functionalComponentArgsRest(__VLS_95));
                // @ts-ignore
                [modelValue, modelValue, modelValue, modelValue, $t, $t, $t, $t, api_input_field_list, showSource,];
                var __VLS_86;
            }
            // @ts-ignore
            [];
        }
        if (__VLS_ctx.modelValue['api_input_field_list'][f.field].source === 'reference') {
            let __VLS_99;
            /** @ts-ignore @type { | typeof __VLS_components.elCascader | typeof __VLS_components.ElCascader | typeof __VLS_components['el-cascader']} */
            elCascader;
            // @ts-ignore
            const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
                modelValue: (__VLS_ctx.modelValue['api_input_field_list'][f.field].value),
                options: (__VLS_ctx.options),
                placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
                props: (props),
                ...{ style: {} },
            }));
            const __VLS_101 = __VLS_100({
                modelValue: (__VLS_ctx.modelValue['api_input_field_list'][f.field].value),
                options: (__VLS_ctx.options),
                placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
                props: (props),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        }
        else {
            let __VLS_104;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
                modelValue: (__VLS_ctx.modelValue['api_input_field_list'][f.field].value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
            }));
            const __VLS_106 = __VLS_105({
                modelValue: (__VLS_ctx.modelValue['api_input_field_list'][f.field].value),
                placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        }
        // @ts-ignore
        [modelValue, modelValue, modelValue, $t, $t, options,];
        var __VLS_79;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
