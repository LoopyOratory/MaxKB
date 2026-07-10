/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, computed } from 'vue';
import ModelCard from '@/views/model/component/ModelCard.vue';
import ProviderComponent from '@/views/model/component/Provider.vue';
import { splitArray } from '@/utils/array';
import { modelTypeList, allObj } from '@/views/model/component/data';
import CreateModelDialog from '@/views/model/component/CreateModelDialog.vue';
import SelectProviderDialog from '@/views/model/component/SelectProviderDialog.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
import { useRoute } from 'vue-router';
import permissionMap from '@/permission';
const route = useRoute();
const { model, user } = useStore();
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
const permissionPrecise = computed(() => {
    return permissionMap['model'][apiType.value];
});
const isSystemShare = computed(() => {
    return apiType.value === 'systemShare';
});
const commonList1 = ref();
const commonList2 = ref();
const loading = ref(false);
const active_provider = ref();
const search_type = ref('name');
const model_search_form = ref({
    name: '',
    create_user: '',
    model_type: '',
});
const user_options = ref([]);
const list_model_loading = ref(false);
const provider_list = ref([]);
const model_list = ref([]);
const isShared = computed(() => {
    return active_provider.value && active_provider.value.provider === 'share';
});
const updateModelById = (model_id, model) => {
    model_list.value
        .filter((m) => m.id == model_id)
        .forEach((m) => {
        m.status = model.status;
    });
};
const model_split_list = computed(() => {
    return splitArray(model_list.value, 2);
});
const createModelRef = ref();
const selectProviderRef = ref();
const clickListHandle = (item) => {
    active_provider.value = item;
    list_model();
    if (active_provider.value.provider === '') {
        commonList1.value?.clearCurrent();
        commonList2.value?.clearCurrent();
    }
};
const openCreateModel = (provider, model_type) => {
    if (provider && provider.provider) {
        createModelRef.value?.open(provider, model_type);
    }
    else {
        selectProviderRef.value?.open();
    }
};
function getUserList(query) {
    let workspaceId = user.getWorkspaceId();
    if (isSystemShare.value) {
        workspaceId = '';
    }
    const actualWorkspaceId = workspaceId || (query ? { nick_name: query } : '');
    const actualQuery = workspaceId ? (query ? { nick_name: query } : '') : undefined;
    loadSharedApi({ type: 'workspace', isShared: isShared.value, systemType: apiType.value })
        .getAllMemberList(actualWorkspaceId, actualQuery, loading)
        .then((res) => {
        user_options.value = res.data;
    });
}
const list_model = () => {
    const params = active_provider.value?.provider && active_provider.value?.provider !== 'share' ? { provider: active_provider.value.provider } : {};
    loadSharedApi({ type: 'model', isShared: isShared.value, systemType: apiType.value })
        .getModelList({ ...model_search_form.value, ...params }, list_model_loading)
        .then((ok) => {
        model_list.value = ok.data;
    });
};
const search_type_change = () => {
    model_search_form.value = { name: '', create_user: '', model_type: '' };
};
onMounted(() => {
    model.asyncGetProvider(loading).then((ok) => {
        active_provider.value = allObj;
        provider_list.value = [allObj, ...ok.data];
        list_model();
    });
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.LayoutContainer | typeof __VLS_components.LayoutContainer} */
LayoutContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    showCollapse: true,
    ...{ class: "model-manage" },
}));
const __VLS_2 = __VLS_1({
    showCollapse: true,
    ...{ class: "model-manage" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['model-manage']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { left: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "p-12-16 pb-0 mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    (__VLS_ctx.$t('views.model.provider'));
    const __VLS_8 = ProviderComponent;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        data: (__VLS_ctx.provider_list),
        loading: (__VLS_ctx.loading),
        showShared: (__VLS_ctx.permissionPrecise['is_share']()),
        active: (__VLS_ctx.active_provider),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        data: (__VLS_ctx.provider_list),
        loading: (__VLS_ctx.loading),
        showShared: (__VLS_ctx.permissionPrecise['is_share']()),
        active: (__VLS_ctx.active_provider),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (__VLS_ctx.clickListHandle),
    };
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [$t, provider_list, loading, permissionPrecise, active_provider, clickListHandle,];
}
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.ContentContainer | typeof __VLS_components.ContentContainer} */
ContentContainer;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    header: (__VLS_ctx.active_provider?.name),
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    header: (__VLS_ctx.active_provider?.name),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.list_model_loading) }, null, null);
const { default: __VLS_20 } = __VLS_18.slots;
{
    const { search: __VLS_21 } = __VLS_18.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "complex-search" },
    });
    /** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_27;
    const __VLS_28 = {
        /** @type {typeof __VLS_27.change} */
        onChange: (__VLS_ctx.search_type_change),
    };
    /** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
    const { default: __VLS_29 } = __VLS_25.slots;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }));
    const __VLS_32 = __VLS_31({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
        value: "model_type",
    }));
    const __VLS_37 = __VLS_36({
        label: (__VLS_ctx.$t('views.model.modelForm.model_type.label')),
        value: "model_type",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        label: (__VLS_ctx.$t('views.model.modelForm.modeName.label')),
        value: "name",
    }));
    const __VLS_42 = __VLS_41({
        label: (__VLS_ctx.$t('views.model.modelForm.modeName.label')),
        value: "name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [$t, $t, $t, active_provider, vLoading, list_model_loading, search_type, search_type_change,];
    var __VLS_25;
    var __VLS_26;
    if (__VLS_ctx.search_type === 'name') {
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.model_search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }));
        const __VLS_47 = __VLS_46({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.model_search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        let __VLS_50;
        const __VLS_51 = {
            /** @type {typeof __VLS_50.change} */
            onChange: (__VLS_ctx.list_model),
        };
        var __VLS_48;
        var __VLS_49;
    }
    else if (__VLS_ctx.search_type === 'create_user') {
        let __VLS_52;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.model_search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.model_search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_57;
        const __VLS_58 = {
            /** @type {typeof __VLS_57.change} */
            onChange: (__VLS_ctx.list_model),
        };
        const { default: __VLS_59 } = __VLS_55.slots;
        for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
            let __VLS_60;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }));
            const __VLS_62 = __VLS_61({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            // @ts-ignore
            [$t, search_type, search_type, model_search_form, model_search_form, list_model, list_model, getUserList, user_options,];
        }
        // @ts-ignore
        [];
        var __VLS_55;
        var __VLS_56;
    }
    else if (__VLS_ctx.search_type === 'model_type') {
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.model_search_form.model_type),
            clearable: true,
            ...{ style: {} },
        }));
        const __VLS_67 = __VLS_66({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.model_search_form.model_type),
            clearable: true,
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        let __VLS_70;
        const __VLS_71 = {
            /** @type {typeof __VLS_70.change} */
            onChange: (__VLS_ctx.list_model),
        };
        const { default: __VLS_72 } = __VLS_68.slots;
        for (const [item] of __VLS_vFor((__VLS_ctx.modelTypeList))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (item.value),
            });
            let __VLS_73;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
                label: (item.text),
                value: (item.value),
            }));
            const __VLS_75 = __VLS_74({
                label: (item.text),
                value: (item.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_74));
            // @ts-ignore
            [search_type, model_search_form, list_model, modelTypeList,];
        }
        // @ts-ignore
        [];
        var __VLS_68;
        var __VLS_69;
    }
    if (!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()) {
        let __VLS_78;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            type: "primary",
        }));
        const __VLS_80 = __VLS_79({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_79));
        let __VLS_83;
        const __VLS_84 = {
            /** @type {typeof __VLS_83.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()))
                    throw 0;
                return __VLS_ctx.openCreateModel(__VLS_ctx.active_provider);
                // @ts-ignore
                [permissionPrecise, active_provider, isShared, openCreateModel,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
        const { default: __VLS_85 } = __VLS_81.slots;
        (__VLS_ctx.$t('views.model.addModel'));
        // @ts-ignore
        [$t,];
        var __VLS_81;
        var __VLS_82;
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "model-list-height" },
});
/** @type {__VLS_StyleScopedClasses['model-list-height']} */ ;
if (__VLS_ctx.model_split_list.length > 0) {
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        gutter: (15),
        ...{ class: "w-full" },
    }));
    const __VLS_88 = __VLS_87({
        gutter: (15),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_91 } = __VLS_89.slots;
    for (const [row, index] of __VLS_vFor((__VLS_ctx.model_split_list))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        for (const [model, i] of __VLS_vFor((row))) {
            let __VLS_92;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
                xs: (24),
                sm: (12),
                md: (__VLS_ctx.isSystemShare ? 24 : 12),
                lg: (__VLS_ctx.isSystemShare ? 12 : 8),
                xl: (__VLS_ctx.isSystemShare ? 12 : 8),
                ...{ class: "mb-16" },
                key: (i),
            }));
            const __VLS_94 = __VLS_93({
                xs: (24),
                sm: (12),
                md: (__VLS_ctx.isSystemShare ? 24 : 12),
                lg: (__VLS_ctx.isSystemShare ? 12 : 8),
                xl: (__VLS_ctx.isSystemShare ? 12 : 8),
                ...{ class: "mb-16" },
                key: (i),
            }, ...__VLS_functionalComponentArgsRest(__VLS_93));
            /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
            const { default: __VLS_97 } = __VLS_95.slots;
            const __VLS_98 = ModelCard || ModelCard;
            // @ts-ignore
            const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
                ...{ 'onChange': {} },
                updateModelById: (__VLS_ctx.updateModelById),
                model: (model),
                provider_list: (__VLS_ctx.provider_list),
                isShared: (__VLS_ctx.isShared),
                isSystemShare: (__VLS_ctx.isSystemShare),
                apiType: (__VLS_ctx.apiType),
            }));
            const __VLS_100 = __VLS_99({
                ...{ 'onChange': {} },
                updateModelById: (__VLS_ctx.updateModelById),
                model: (model),
                provider_list: (__VLS_ctx.provider_list),
                isShared: (__VLS_ctx.isShared),
                isSystemShare: (__VLS_ctx.isSystemShare),
                apiType: (__VLS_ctx.apiType),
            }, ...__VLS_functionalComponentArgsRest(__VLS_99));
            let __VLS_103;
            const __VLS_104 = {
                /** @type {typeof __VLS_103.change} */
                onChange: (__VLS_ctx.list_model),
            };
            var __VLS_101;
            var __VLS_102;
            // @ts-ignore
            [provider_list, list_model, isShared, model_split_list, model_split_list, isSystemShare, isSystemShare, isSystemShare, isSystemShare, updateModelById, apiType,];
            var __VLS_95;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_89;
}
else {
    let __VLS_105;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_107 = __VLS_106({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
}
// @ts-ignore
[$t,];
var __VLS_18;
if (!__VLS_ctx.isShared) {
    const __VLS_110 = CreateModelDialog || CreateModelDialog;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        ...{ 'onSubmit': {} },
        ...{ 'onChange': {} },
        ref: "createModelRef",
    }));
    const __VLS_112 = __VLS_111({
        ...{ 'onSubmit': {} },
        ...{ 'onChange': {} },
        ref: "createModelRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    let __VLS_115;
    const __VLS_116 = {
        /** @type {typeof __VLS_115.submit} */
        onSubmit: (__VLS_ctx.list_model),
    };
    const __VLS_117 = {
        /** @type {typeof __VLS_115.change} */
        onChange: (...[$event]) => {
            if (!(!__VLS_ctx.isShared))
                throw 0;
            return __VLS_ctx.openCreateModel($event);
            // @ts-ignore
            [list_model, isShared, openCreateModel,];
        },
    };
    var __VLS_118;
    var __VLS_113;
    var __VLS_114;
}
if (!__VLS_ctx.isShared) {
    const __VLS_120 = SelectProviderDialog || SelectProviderDialog;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        ...{ 'onChange': {} },
        ref: "selectProviderRef",
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onChange': {} },
        ref: "selectProviderRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_125;
    const __VLS_126 = {
        /** @type {typeof __VLS_125.change} */
        onChange: ((provider, modelType) => __VLS_ctx.openCreateModel(provider, modelType)),
    };
    var __VLS_127;
    var __VLS_123;
    var __VLS_124;
}
// @ts-ignore
[isShared, openCreateModel,];
var __VLS_3;
// @ts-ignore
var __VLS_119 = __VLS_118, __VLS_128 = __VLS_127;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
