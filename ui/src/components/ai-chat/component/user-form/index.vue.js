/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed, onMounted } from 'vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { useRoute } from 'vue-router';
import { MsgWarning } from '@/utils/message';
import { t } from '@/locales';
const route = useRoute();
const { params: { accessToken }, } = route;
const props = defineProps();
// Used forRefreshDynamicForm
const dynamicsFormRefresh = ref(0);
const inputFieldList = ref([]);
const apiInputFieldList = ref([]);
const inputFieldConfig = ref({ title: t('aiChat.userInput') });
const firstMounted = ref(false);
const dynamicsFormRef = ref();
const dynamicsFormRef2 = ref();
const emit = defineEmits(['update:api_form_data', 'update:form_data', 'confirm', 'cancel']);
const api_form_data_context = computed({
    get: () => {
        return props.api_form_data;
    },
    set: (data) => {
        emit('update:api_form_data', data);
    },
});
const form_data_context = computed({
    get: () => {
        return props.form_data;
    },
    set: (data) => {
        emit('update:form_data', data);
    },
});
watch([() => props.application, () => props.excludeFields], () => {
    handleInputFieldList();
});
function handleInputFieldList() {
    dynamicsFormRefresh.value++;
    const default_value = {};
    props.application?.work_flow?.nodes
        ?.filter((v) => v.id === 'base-node')
        .map((v) => {
        inputFieldList.value = v.properties.user_input_field_list
            ? v.properties.user_input_field_list.map((v) => {
                switch (v.type) {
                    case 'input':
                        return {
                            field: v.variable,
                            input_type: 'TextInput',
                            label: v.name,
                            default_value: default_value[v.variable],
                            required: v.is_required,
                        };
                    case 'select':
                        return {
                            field: v.variable,
                            input_type: 'SingleSelect',
                            label: v.name,
                            default_value: default_value[v.variable],
                            required: v.is_required,
                            option_list: v.optionList.map((o) => {
                                return { key: o, value: o };
                            }),
                        };
                    case 'date':
                        return {
                            field: v.variable,
                            input_type: 'DatePicker',
                            label: v.name,
                            default_value: default_value[v.variable],
                            required: v.is_required,
                            attrs: {
                                format: 'YYYY-MM-DD HH:mm:ss',
                                'value-format': 'YYYY-MM-DD HH:mm:ss',
                                type: 'datetime',
                            },
                        };
                    default:
                        return v;
                }
            })
            : v.properties.input_field_list
                ? v.properties.input_field_list
                    .filter((v) => v.assignment_method === 'user_input')
                    .map((v) => {
                    switch (v.type) {
                        case 'input':
                            return {
                                field: v.variable,
                                input_type: 'TextInput',
                                label: v.name,
                                default_value: default_value[v.variable],
                                required: v.is_required,
                            };
                        case 'select':
                            return {
                                field: v.variable,
                                input_type: 'SingleSelect',
                                label: v.name,
                                default_value: default_value[v.variable],
                                required: v.is_required,
                                option_list: v.optionList.map((o) => {
                                    return { key: o, value: o };
                                }),
                            };
                        case 'date':
                            return {
                                field: v.variable,
                                input_type: 'DatePicker',
                                label: v.name,
                                default_value: default_value[v.variable],
                                required: v.is_required,
                                attrs: {
                                    format: 'YYYY-MM-DD HH:mm:ss',
                                    'value-format': 'YYYY-MM-DD HH:mm:ss',
                                    type: 'datetime',
                                },
                            };
                        default:
                            break;
                    }
                })
                : [];
        if (props.excludeFields?.length) {
            inputFieldList.value = inputFieldList.value.filter((f) => !props.excludeFields.includes(f.field));
        }
        apiInputFieldList.value = v.properties.api_input_field_list
            ? v.properties.api_input_field_list.map((v) => {
                switch (v.type) {
                    case 'input':
                        return {
                            field: v.variable,
                            input_type: 'TextInput',
                            label: v.variable,
                            default_value: v.default_value || default_value[v.variable],
                            required: v.is_required,
                        };
                    case 'select':
                        return {
                            field: v.variable,
                            input_type: 'SingleSelect',
                            label: v.variable,
                            default_value: v.default_value || default_value[v.variable],
                            required: v.is_required,
                            option_list: v.optionList.map((o) => {
                                return { key: o, value: o };
                            }),
                        };
                    case 'date':
                        return {
                            field: v.variable,
                            input_type: 'DatePicker',
                            label: v.variable,
                            default_value: v.default_value || default_value[v.variable],
                            required: v.is_required,
                            attrs: {
                                format: 'YYYY-MM-DD HH:mm:ss',
                                'value-format': 'YYYY-MM-DD HH:mm:ss',
                                type: 'datetime',
                            },
                        };
                    default:
                        break;
                }
            })
            : v.properties.input_field_list
                ? v.properties.input_field_list
                    .filter((v) => v.assignment_method === 'api_input')
                    .map((v) => {
                    switch (v.type) {
                        case 'input':
                            return {
                                field: v.variable,
                                input_type: 'TextInput',
                                label: v.name,
                                default_value: default_value[v.variable],
                                required: v.is_required,
                            };
                        case 'select':
                            return {
                                field: v.variable,
                                input_type: 'SingleSelect',
                                label: v.name,
                                default_value: default_value[v.variable],
                                required: v.is_required,
                                option_list: v.optionList.map((o) => {
                                    return { key: o, value: o };
                                }),
                            };
                        case 'date':
                            return {
                                field: v.variable,
                                input_type: 'DatePicker',
                                label: v.name,
                                default_value: default_value[v.variable],
                                required: v.is_required,
                                attrs: {
                                    format: 'YYYY-MM-DD HH:mm:ss',
                                    'value-format': 'YYYY-MM-DD HH:mm:ss',
                                    type: 'datetime',
                                },
                            };
                        default:
                            break;
                    }
                })
                : [];
        //
        inputFieldConfig.value = v.properties.user_input_config?.title
            ? v.properties.user_input_config
            : { title: t('aiChat.userInput') };
    });
}
const getRouteQueryValue = (field) => {
    let _value = route.query[field];
    if (_value != null) {
        if (_value instanceof Array) {
            _value = _value
                .map((item) => {
                if (item != null) {
                    return decodeQuery(item);
                }
                return null;
            })
                .filter((item) => item != null);
        }
        else {
            _value = decodeQuery(_value);
        }
        return _value;
    }
    return null;
};
const validate = () => {
    const promise_list = [];
    if (dynamicsFormRef.value) {
        promise_list.push(dynamicsFormRef.value?.validate());
    }
    if (dynamicsFormRef2.value) {
        promise_list.push(dynamicsFormRef2.value?.validate());
    }
    promise_list.push(validate_query());
    return Promise.all(promise_list);
};
const validate_query = () => {
    // BrowserqueryParametersFoundInterfaceParameter
    const msg = [];
    for (const f of apiInputFieldList.value) {
        if (f.required && !api_form_data_context.value[f.field]) {
            msg.push(f.field);
        }
    }
    if (msg.length > 0) {
        MsgWarning(`${t('aiChat.tip.inputParamMessage1')} ${msg.join('、')}${t('aiChat.tip.inputParamMessage2')}`);
        return Promise.reject(false);
    }
    return Promise.resolve(false);
};
const initRouteQueryValue = () => {
    for (const f of apiInputFieldList.value) {
        if (!api_form_data_context.value[f.field]) {
            const _value = getRouteQueryValue(f.field);
            if (_value != null) {
                api_form_data_context.value[f.field] = _value;
            }
        }
    }
    if (!api_form_data_context.value['asker']) {
        const asker = getRouteQueryValue('asker');
        if (asker) {
            api_form_data_context.value['asker'] = getRouteQueryValue('asker');
        }
    }
};
const decodeQuery = (query) => {
    try {
        return decodeURIComponent(query);
    }
    catch (e) {
        return query;
    }
};
const confirmHandle = () => {
    validate().then((ok) => {
        localStorage.setItem(`${accessToken}userForm`, JSON.stringify(form_data_context.value));
        emit('confirm');
    });
};
const cancelHandle = () => {
    emit('cancel');
};
const render = (data) => {
    if (dynamicsFormRef.value) {
        dynamicsFormRef.value?.render(inputFieldList.value, data);
    }
};
const renderDebugAiChat = (data) => {
    if (dynamicsFormRef2.value) {
        dynamicsFormRef2.value?.render(apiInputFieldList.value, data);
    }
};
const __VLS_exposed = { validate, render, renderDebugAiChat };
defineExpose(__VLS_exposed);
onMounted(() => {
    firstMounted.value = true;
    handleInputFieldList();
    initRouteQueryValue();
});
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
/** @type {__VLS_StyleScopedClasses['user-form-container']} */ ;
if ((__VLS_ctx.inputFieldList.length > 0 || (__VLS_ctx.type === 'debug-ai-chat' && __VLS_ctx.apiInputFieldList.length > 0)) &&
    __VLS_ctx.type !== 'log') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "user-form-container mb-16 w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['user-form-container']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        shadow: "always",
        ...{ class: "border-r-8" },
        ...{ style: {} },
    }));
    const __VLS_2 = __VLS_1({
        shadow: "always",
        ...{ class: "border-r-8" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center cursor w-full" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "break-all ellipsis-1 mr-16" },
        title: (props.title || __VLS_ctx.$t('common.moreSettings')),
    });
    /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    (props.title || __VLS_ctx.$t('common.moreSettings'));
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        maxHeight: (__VLS_ctx.first ? '' : 450),
    }));
    const __VLS_8 = __VLS_7({
        maxHeight: (__VLS_ctx.first ? '' : 450),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-16" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const __VLS_12 = DynamicsForm;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        key: (__VLS_ctx.dynamicsFormRefresh),
        modelValue: (__VLS_ctx.form_data_context),
        model: (__VLS_ctx.form_data_context),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        render_data: (__VLS_ctx.inputFieldList),
        ref: "dynamicsFormRef",
    }));
    const __VLS_14 = __VLS_13({
        key: (__VLS_ctx.dynamicsFormRefresh),
        modelValue: (__VLS_ctx.form_data_context),
        model: (__VLS_ctx.form_data_context),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        render_data: (__VLS_ctx.inputFieldList),
        ref: "dynamicsFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    var __VLS_17;
    var __VLS_15;
    if (__VLS_ctx.type === 'debug-ai-chat') {
        const __VLS_19 = DynamicsForm;
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
            modelValue: (__VLS_ctx.api_form_data_context),
            model: (__VLS_ctx.api_form_data_context),
            labelPosition: "top",
            requireAsteriskPosition: "right",
            render_data: (__VLS_ctx.apiInputFieldList),
            ref: "dynamicsFormRef2",
        }));
        const __VLS_21 = __VLS_20({
            modelValue: (__VLS_ctx.api_form_data_context),
            model: (__VLS_ctx.api_form_data_context),
            labelPosition: "top",
            requireAsteriskPosition: "right",
            render_data: (__VLS_ctx.apiInputFieldList),
            ref: "dynamicsFormRef2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        var __VLS_24;
        var __VLS_22;
    }
    // @ts-ignore
    [inputFieldList, inputFieldList, type, type, type, apiInputFieldList, apiInputFieldList, $t, $t, first, dynamicsFormRefresh, form_data_context, form_data_context, api_form_data_context, api_form_data_context,];
    var __VLS_9;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-left ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    if (__VLS_ctx.first) {
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "w-full" },
        }));
        const __VLS_28 = __VLS_27({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        let __VLS_31;
        const __VLS_32 = {
            /** @type {typeof __VLS_31.click} */
            onClick: (__VLS_ctx.confirmHandle),
        };
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        const { default: __VLS_33 } = __VLS_29.slots;
        let __VLS_34;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
            iconName: "app-chat",
            ...{ class: "mr-4" },
        }));
        const __VLS_36 = __VLS_35({
            iconName: "app-chat",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('aiChat.operation.startChat'));
        // @ts-ignore
        [$t, first, confirmHandle,];
        var __VLS_29;
        var __VLS_30;
    }
    if (!__VLS_ctx.first) {
        let __VLS_39;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_41 = __VLS_40({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        let __VLS_44;
        const __VLS_45 = {
            /** @type {typeof __VLS_44.click} */
            onClick: (__VLS_ctx.confirmHandle),
        };
        const { default: __VLS_46 } = __VLS_42.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, first, confirmHandle,];
        var __VLS_42;
        var __VLS_43;
    }
    if (!__VLS_ctx.first) {
        let __VLS_47;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
            ...{ 'onClick': {} },
        }));
        const __VLS_49 = __VLS_48({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_48));
        let __VLS_52;
        const __VLS_53 = {
            /** @type {typeof __VLS_52.click} */
            onClick: (__VLS_ctx.cancelHandle),
        };
        const { default: __VLS_54 } = __VLS_50.slots;
        (__VLS_ctx.$t('common.cancel'));
        // @ts-ignore
        [$t, first, cancelHandle,];
        var __VLS_50;
        var __VLS_51;
    }
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
var __VLS_18 = __VLS_17, __VLS_25 = __VLS_24;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
