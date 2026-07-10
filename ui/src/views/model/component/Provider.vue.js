/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { watch, ref } from 'vue';
import { allObj } from '@/views/model/component/data';
import { EditionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { t } from '@/locales';
const props = defineProps();
const emit = defineEmits(['click']);
const online_provider_list = ref([]);
const local_provider_list = ref([]);
watch(() => props.data, (list) => {
    const local_provider = [
        'model_ollama_provider',
        'model_local_provider',
        'model_xinference_provider',
        'model_vllm_provider',
        'model_docker_ai_provider'
    ];
    list
        .filter((v) => v.provider)
        ?.forEach((item) => {
        if (local_provider.indexOf(item.provider) > -1) {
            local_provider_list.value.push(item);
        }
        else {
            online_provider_list.value.push(item);
        }
    });
    online_provider_list.value.sort((a, b) => a.provider.localeCompare(b.provider));
    local_provider_list.value.sort((a, b) => a.provider.localeCompare(b.provider));
}, { immediate: true });
const clickListHandle = (item) => {
    emit('click', item);
};
const handleSharedNodeClick = () => {
    emit('click', { provider: 'share', name: t('views.shared.shared_model') });
};
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
    ...{ class: "provider-list" },
});
/** @type {__VLS_StyleScopedClasses['provider-list']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
if (__VLS_ctx.showShared && __VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "border-b mb-4" },
    });
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.handleSharedNodeClick) },
        ...{ class: "shared-button flex cursor" },
        ...{ class: (__VLS_ctx.active?.provider === 'share' && 'active') },
    });
    /** @type {__VLS_StyleScopedClasses['shared-button']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        iconName: "app-shared-active",
        ...{ style: {} },
        ...{ class: "color-primary" },
    }));
    const __VLS_8 = __VLS_7({
        iconName: "app-shared-active",
        ...{ style: {} },
        ...{ class: "color-primary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    (__VLS_ctx.$t('views.shared.shared_model'));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.clickListHandle(__VLS_ctx.allObj);
            // @ts-ignore
            [showShared, hasPermission, EditionConst, handleSharedNodeClick, active, $t, clickListHandle, allObj,];
        } },
    ...{ class: "all-mode flex cursor" },
    ...{ class: (!__VLS_ctx.active?.provider ? 'all-mode-active color-primary-1' : '') },
});
/** @type {__VLS_StyleScopedClasses['all-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ class: "mr-8 color-primary" },
    ...{ style: {} },
    iconName: ('app-all-menu-active'),
}));
const __VLS_13 = __VLS_12({
    ...{ class: "mr-8 color-primary" },
    ...{ style: {} },
    iconName: ('app-all-menu-active'),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('views.model.modelType.allModel'));
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elCollapse | typeof __VLS_components.ElCollapse | typeof __VLS_components['el-collapse'] | typeof __VLS_components.elCollapse | typeof __VLS_components.ElCollapse | typeof __VLS_components['el-collapse']} */
elCollapse;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ class: "model-collapse" },
    expandIconPosition: "left",
}));
const __VLS_18 = __VLS_17({
    ...{ class: "model-collapse" },
    expandIconPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {__VLS_StyleScopedClasses['model-collapse']} */ ;
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseItem | typeof __VLS_components.ElCollapseItem | typeof __VLS_components['el-collapse-item'] | typeof __VLS_components.elCollapseItem | typeof __VLS_components.ElCollapseItem | typeof __VLS_components['el-collapse-item']} */
elCollapseItem;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    title: (__VLS_ctx.$t('views.model.modelType.publicModel')),
    name: "1",
    icon: "CaretRight",
}));
const __VLS_24 = __VLS_23({
    title: (__VLS_ctx.$t('views.model.modelType.publicModel')),
    name: "1",
    icon: "CaretRight",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
const { default: __VLS_27 } = __VLS_25.slots;
{
    const { title: __VLS_28 } = __VLS_25.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        iconName: "app-folder",
        ...{ style: {} },
    }));
    const __VLS_31 = __VLS_30({
        iconName: "app-folder",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    (__VLS_ctx.$t('views.model.modelType.publicModel'));
    // @ts-ignore
    [active, $t, $t, $t,];
}
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.online_provider_list),
    valueKey: "provider",
    defaultActive: "",
    ref: "commonList1",
}));
const __VLS_36 = __VLS_35({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.online_provider_list),
    valueKey: "provider",
    defaultActive: "",
    ref: "commonList1",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_39;
const __VLS_40 = {
    /** @type {typeof __VLS_39.click} */
    onClick: (__VLS_ctx.clickListHandle),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_41;
const { default: __VLS_43 } = __VLS_37.slots;
{
    const { default: __VLS_44 } = __VLS_37.slots;
    const [{ row }] = __VLS_vSlot(__VLS_44);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        innerHTML: (row.icon),
        alt: "",
        ...{ style: {} },
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1" },
        title: (row.name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (row.name);
    // @ts-ignore
    [clickListHandle, online_provider_list, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_37;
var __VLS_38;
// @ts-ignore
[];
var __VLS_25;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseItem | typeof __VLS_components.ElCollapseItem | typeof __VLS_components['el-collapse-item'] | typeof __VLS_components.elCollapseItem | typeof __VLS_components.ElCollapseItem | typeof __VLS_components['el-collapse-item']} */
elCollapseItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    title: (__VLS_ctx.$t('views.model.modelType.privateModel')),
    name: "2",
    icon: "CaretRight",
}));
const __VLS_47 = __VLS_46({
    title: (__VLS_ctx.$t('views.model.modelType.privateModel')),
    name: "2",
    icon: "CaretRight",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
{
    const { title: __VLS_51 } = __VLS_48.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        iconName: "app-folder",
        ...{ style: {} },
    }));
    const __VLS_54 = __VLS_53({
        iconName: "app-folder",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    (__VLS_ctx.$t('views.model.modelType.privateModel'));
    // @ts-ignore
    [$t, $t,];
}
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.local_provider_list),
    valueKey: "provider",
    defaultActive: "",
    ref: "commonList2",
}));
const __VLS_59 = __VLS_58({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.local_provider_list),
    valueKey: "provider",
    defaultActive: "",
    ref: "commonList2",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_62;
const __VLS_63 = {
    /** @type {typeof __VLS_62.click} */
    onClick: (__VLS_ctx.clickListHandle),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_64;
const { default: __VLS_66 } = __VLS_60.slots;
{
    const { default: __VLS_67 } = __VLS_60.slots;
    const [{ row }] = __VLS_vSlot(__VLS_67);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        innerHTML: (row.icon),
        alt: "",
        ...{ style: {} },
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1" },
        title: (row.name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (row.name);
    // @ts-ignore
    [clickListHandle, vLoading, loading, local_provider_list,];
}
// @ts-ignore
[];
var __VLS_60;
var __VLS_61;
// @ts-ignore
[];
var __VLS_48;
// @ts-ignore
[];
var __VLS_19;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_42 = __VLS_41, __VLS_65 = __VLS_64;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
