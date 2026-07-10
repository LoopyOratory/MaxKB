/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, onMounted } from 'vue';
import { relatedObject } from '@/utils/array';
import CreateModelDialog from '@/views/model/component/CreateModelDialog.vue';
import SelectProviderDialog from '@/views/model/component/SelectProviderDialog.vue';
import { flatMap } from 'lodash';
import { t } from '@/locales';
import useStore from '@/stores';
import permissionMap from '@/permission';
defineOptions({ name: 'ModelSelect' });
const props = defineProps();
const permissionPrecise = computed(() => {
    return permissionMap['model']['workspace'];
});
const emit = defineEmits(['update:modelValue', 'change', 'submitModel']);
const modelValue = computed({
    set: (item) => {
        emit('change', item);
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    },
});
const { model } = useStore();
const createModelRef = ref();
const selectProviderRef = ref();
const providerOptions = ref([]);
const loading = ref(false);
function getProvider() {
    loading.value = true;
    model
        .asyncGetProvider()
        .then((res) => {
        providerOptions.value = res?.data;
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
const openCreateModel = (provider, model_type) => {
    if (provider && provider.provider) {
        createModelRef.value?.open(provider, model_type);
    }
    else {
        selectProviderRef.value?.open(model_type);
    }
};
const getModelProvider = computed(() => {
    return (id) => {
        const item = flatMap(props.options)?.find((item) => item.id === id);
        return item?.provider || '';
    };
});
function submitModel() {
    emit('submitModel');
}
onMounted(() => {
    getProvider();
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.modelValue),
    popperClass: "select-model",
    clearable: (true),
    filterable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.modelValue),
    popperClass: "select-model",
    clearable: (true),
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
const { default: __VLS_5 } = __VLS_3.slots;
for (const [value, label] of __VLS_vFor((__VLS_ctx.options))) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
    elOptionGroup;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        key: (value),
        label: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, label, 'provider')?.name),
    }));
    const __VLS_8 = __VLS_7({
        key: (value),
        label: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, label, 'provider')?.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    for (const [item] of __VLS_vFor((value.filter((v) => v.status === 'SUCCESS')))) {
        let __VLS_12;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            key: (item.id),
            label: (item.name),
            value: (item.id),
            ...{ class: "flex-between" },
        }));
        const __VLS_14 = __VLS_13({
            key: (item.id),
            label: (item.name),
            value: (item.id),
            ...{ class: "flex-between" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        const { default: __VLS_17 } = __VLS_15.slots;
        let __VLS_18;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            size: (8),
        }));
        const __VLS_20 = __VLS_19({
            size: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        const { default: __VLS_23 } = __VLS_21.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            innerHTML: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, label, 'provider')?.icon),
            ...{ class: "select-model-icon" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['select-model-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (item.name);
        if (item.type === 'share') {
            let __VLS_24;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
                type: "info",
                ...{ class: "info-tag" },
            }));
            const __VLS_26 = __VLS_25({
                type: "info",
                ...{ class: "info-tag" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            const { default: __VLS_29 } = __VLS_27.slots;
            (__VLS_ctx.t('views.shared.title'));
            // @ts-ignore
            [modelValue, $attrs, options, relatedObject, relatedObject, providerOptions, providerOptions, t,];
            var __VLS_27;
        }
        // @ts-ignore
        [];
        var __VLS_21;
        if (item.id === __VLS_ctx.modelValue) {
            let __VLS_30;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
                ...{ class: "check-icon" },
            }));
            const __VLS_32 = __VLS_31({
                ...{ class: "check-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            /** @type {__VLS_StyleScopedClasses['check-icon']} */ ;
            const { default: __VLS_35 } = __VLS_33.slots;
            let __VLS_36;
            /** @ts-ignore @type { | typeof __VLS_components.Check} */
            Check;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({}));
            const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
            // @ts-ignore
            [modelValue,];
            var __VLS_33;
        }
        // @ts-ignore
        [];
        var __VLS_15;
        // @ts-ignore
        [];
    }
    for (const [item] of __VLS_vFor((value.filter((v) => v.status !== 'SUCCESS')))) {
        let __VLS_41;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
            key: (item.id),
            label: (item.name),
            value: (item.id),
            ...{ class: "flex-between" },
            disabled: true,
        }));
        const __VLS_43 = __VLS_42({
            key: (item.id),
            label: (item.name),
            value: (item.id),
            ...{ class: "flex-between" },
            disabled: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        const { default: __VLS_46 } = __VLS_44.slots;
        let __VLS_47;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
            size: (8),
        }));
        const __VLS_49 = __VLS_48({
            size: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_48));
        const { default: __VLS_52 } = __VLS_50.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            innerHTML: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, label, 'provider')?.icon),
            ...{ class: "select-model-icon" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['select-model-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (item.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        (__VLS_ctx.$t('common.unavailable'));
        // @ts-ignore
        [relatedObject, providerOptions, $t,];
        var __VLS_50;
        if (item.id === __VLS_ctx.modelValue) {
            let __VLS_53;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
                ...{ class: "check-icon" },
            }));
            const __VLS_55 = __VLS_54({
                ...{ class: "check-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_54));
            /** @type {__VLS_StyleScopedClasses['check-icon']} */ ;
            const { default: __VLS_58 } = __VLS_56.slots;
            let __VLS_59;
            /** @ts-ignore @type { | typeof __VLS_components.Check} */
            Check;
            // @ts-ignore
            const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({}));
            const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
            // @ts-ignore
            [modelValue,];
            var __VLS_56;
        }
        // @ts-ignore
        [];
        var __VLS_44;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_9;
    // @ts-ignore
    [];
}
{
    const { label: __VLS_64 } = __VLS_3.slots;
    const [{ label, value }] = __VLS_vSlot(__VLS_64);
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        size: (8),
    }));
    const __VLS_67 = __VLS_66({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    const { default: __VLS_70 } = __VLS_68.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "select-model-icon" },
        innerHTML: (__VLS_ctx.relatedObject(__VLS_ctx.providerOptions, __VLS_ctx.getModelProvider(value), 'provider')?.icon),
    });
    /** @type {__VLS_StyleScopedClasses['select-model-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (label);
    // @ts-ignore
    [relatedObject, providerOptions, getModelProvider,];
    var __VLS_68;
    // @ts-ignore
    [];
}
if (__VLS_ctx.showFooter) {
    {
        const { footer: __VLS_71 } = __VLS_3.slots;
        var __VLS_72 = {};
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showFooter))
                        throw 0;
                    return __VLS_ctx.openCreateModel(undefined, props.modelType);
                    // @ts-ignore
                    [showFooter, openCreateModel,];
                } },
            ...{ class: "w-full text-left cursor" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        if (__VLS_ctx.permissionPrecise.create()) {
            let __VLS_74;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
                type: "primary",
                link: true,
            }));
            const __VLS_76 = __VLS_75({
                type: "primary",
                link: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_75));
            const { default: __VLS_79 } = __VLS_77.slots;
            let __VLS_80;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                iconName: "app-add-outlined",
                ...{ class: "mr-4" },
            }));
            const __VLS_82 = __VLS_81({
                iconName: "app-add-outlined",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.application.operation.addModel'));
            // @ts-ignore
            [$t, permissionPrecise,];
            var __VLS_77;
        }
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
var __VLS_3;
if (__VLS_ctx.showFooter) {
    const __VLS_85 = CreateModelDialog || CreateModelDialog;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ 'onSubmit': {} },
        ...{ 'onChange': {} },
        ref: "createModelRef",
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onSubmit': {} },
        ...{ 'onChange': {} },
        ref: "createModelRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_90;
    const __VLS_91 = {
        /** @type {typeof __VLS_90.submit} */
        onSubmit: (__VLS_ctx.submitModel),
    };
    const __VLS_92 = {
        /** @type {typeof __VLS_90.change} */
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.showFooter))
                throw 0;
            return __VLS_ctx.openCreateModel($event);
            // @ts-ignore
            [showFooter, openCreateModel, submitModel,];
        },
    };
    var __VLS_93;
    var __VLS_88;
    var __VLS_89;
}
if (__VLS_ctx.showFooter) {
    const __VLS_95 = SelectProviderDialog;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        ...{ 'onChange': {} },
        ref: "selectProviderRef",
    }));
    const __VLS_97 = __VLS_96({
        ...{ 'onChange': {} },
        ref: "selectProviderRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    let __VLS_100;
    const __VLS_101 = {
        /** @type {typeof __VLS_100.change} */
        onChange: ((provider, modelType) => __VLS_ctx.openCreateModel(provider, modelType)),
    };
    var __VLS_102;
    var __VLS_98;
    var __VLS_99;
}
// @ts-ignore
var __VLS_73 = __VLS_72, __VLS_94 = __VLS_93, __VLS_103 = __VLS_102;
// @ts-ignore
[showFooter, openCreateModel,];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
const __VLS_export = {};
export default {};
