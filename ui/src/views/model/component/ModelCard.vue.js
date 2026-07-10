/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import EditModel from '@/views/model/component/EditModel.vue';
import DownloadLoading from '@/components/loading/DownloadLoading.vue';
import { MsgConfirm, MsgSuccess } from '@/utils/message';
import { modelType } from '@/enums/model';
import ParamSettingDialog from './ParamSettingDialog.vue';
import AuthorizedWorkspace from '@/views/system-shared/AuthorizedWorkspaceDialog.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import ResourceMappingDrawer from '@/components/resource_mapping/index.vue';
import { SourceTypeEnum } from '@/enums/common';
import { t } from '@/locales';
import { i18n_name } from '@/utils/common';
import { dateFormat } from '@/utils/time';
import permissionMap from '@/permission';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const resourceMappingDrawerRef = ref();
const route = useRoute();
const props = defineProps();
const openResourceMappingDrawer = (model) => {
    resourceMappingDrawerRef.value?.open('MODEL', model);
};
const isSystemShare = computed(() => {
    return props.apiType === 'systemShare';
});
const permissionPrecise = computed(() => {
    return permissionMap['model'][props.apiType];
});
const MoreFilledPermission = (id) => {
    return (permissionPrecise.value.modify(id) ||
        permissionPrecise.value.delete(id) ||
        permissionPrecise.value.auth(id) ||
        permissionPrecise.value.relate_map(id) ||
        isSystemShare.value);
};
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(item) {
    ResourceAuthorizationDrawerRef.value.open(item.id);
}
const downModel = ref();
const currentModel = computed(() => {
    if (downModel.value) {
        return downModel.value;
    }
    else {
        return props.model;
    }
});
const errMessage = computed(() => {
    if (currentModel.value.meta && currentModel.value.meta.message) {
        if (currentModel.value.meta.message === 'pull model manifest: file does not exist') {
            return `${currentModel.value.model_name} ${t('views.model.tip.noModel')}`;
        }
        return currentModel.value.meta.message;
    }
    return '';
});
const emit = defineEmits(['change', 'update:model']);
const editModelRef = ref();
let interval;
const deleteModel = () => {
    MsgConfirm(`${t('views.model.delete.confirmTitle')}${props.model.name} ?`, props.model.resource_count > 0
        ? t('views.model.delete.resourceCountMessage', { count: props.model.resource_count })
        : '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'model', systemType: props.apiType })
            .deleteModel(props.model.id)
            .then(() => {
            emit('change');
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => { });
};
const cancelDownload = () => {
    loadSharedApi({ type: 'model', systemType: props.apiType })
        .pauseDownload(props.model.id)
        .then(() => {
        downModel.value = undefined;
        emit('change');
    });
};
const openEditModel = () => {
    const provider = props.provider_list.find((p) => p.provider === props.model.provider);
    if (provider) {
        editModelRef.value?.open(provider, props.model);
    }
};
const icon = computed(() => {
    return props.provider_list.find((p) => p.provider === props.model.provider)?.icon;
});
/**
 * InitializePoll
 */
const initInterval = () => {
    interval = setInterval(() => {
        if (currentModel.value.status === 'DOWNLOAD') {
            loadSharedApi({ type: 'model', systemType: props.apiType })
                .getModelMetaById(props.model.id)
                .then((ok) => {
                downModel.value = ok.data;
            });
        }
        else {
            if (downModel.value) {
                props.updateModelById(props.model.id, downModel.value);
                downModel.value = undefined;
            }
        }
    }, 6000);
};
/**
 * ClosePoll
 */
const closeInterval = () => {
    if (interval) {
        clearInterval(interval);
    }
};
const paramSettingRef = ref();
const openParamSetting = () => {
    paramSettingRef.value?.open(props.model);
};
const AuthorizedWorkspaceDialogRef = ref();
function openAuthorizedWorkspaceDialog(row) {
    if (AuthorizedWorkspaceDialogRef.value) {
        AuthorizedWorkspaceDialogRef.value.open(row, 'Model');
    }
}
onMounted(() => {
    initInterval();
});
onBeforeUnmount(() => {
    // ClearScheduledTask
    closeInterval();
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.cardBox | typeof __VLS_components.CardBox | typeof __VLS_components['card-box'] | typeof __VLS_components.cardBox | typeof __VLS_components.CardBox | typeof __VLS_components['card-box']} */
cardBox;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (__VLS_ctx.model.name),
    shadow: "hover",
    ...{ class: "model-card" },
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.model.name),
    shadow: "hover",
    ...{ class: "model-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['model-card']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { icon: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
        innerHTML: (__VLS_ctx.icon),
    });
    // @ts-ignore
    [model, icon,];
}
{
    const { title: __VLS_8 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1" },
        title: (__VLS_ctx.model.name),
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (__VLS_ctx.model.name);
    if (__VLS_ctx.currentModel.status === 'ERROR') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        let __VLS_9;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
            effect: "dark",
            content: (__VLS_ctx.errMessage),
            placement: "top",
        }));
        const __VLS_11 = __VLS_10({
            effect: "dark",
            content: (__VLS_ctx.errMessage),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        const { default: __VLS_14 } = __VLS_12.slots;
        let __VLS_15;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }));
        const __VLS_17 = __VLS_16({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_20 } = __VLS_18.slots;
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.WarningFilled} */
        WarningFilled;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
        const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
        // @ts-ignore
        [model, model, currentModel, errMessage,];
        var __VLS_18;
        // @ts-ignore
        [];
        var __VLS_12;
    }
    if (__VLS_ctx.currentModel.status === 'PAUSE_DOWNLOAD') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            effect: "dark",
            content: (`${__VLS_ctx.$t('views.model.modelForm.base_model.label')}: ${props.model.model_name} ${__VLS_ctx.$t('views.model.tip.downloadError')}`),
            placement: "top",
        }));
        const __VLS_28 = __VLS_27({
            effect: "dark",
            content: (`${__VLS_ctx.$t('views.model.modelForm.base_model.label')}: ${props.model.model_name} ${__VLS_ctx.$t('views.model.tip.downloadError')}`),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        const { default: __VLS_31 } = __VLS_29.slots;
        let __VLS_32;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }));
        const __VLS_34 = __VLS_33({
            ...{ class: "color-danger ml-4" },
            size: "18",
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_37 } = __VLS_35.slots;
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.WarningFilled} */
        WarningFilled;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({}));
        const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
        // @ts-ignore
        [currentModel, $t, $t,];
        var __VLS_35;
        // @ts-ignore
        [];
        var __VLS_29;
    }
    // @ts-ignore
    [];
}
{
    const { subTitle: __VLS_43 } = __VLS_3.slots;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        ...{ class: "color-secondary lighter flex align-center" },
        size: "small",
    }));
    const __VLS_46 = __VLS_45({
        ...{ class: "color-secondary lighter flex align-center" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    const { default: __VLS_49 } = __VLS_47.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        title: (__VLS_ctx.i18n_name(__VLS_ctx.model.nick_name)),
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (__VLS_ctx.i18n_name(__VLS_ctx.model.nick_name));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4 mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.createdIn'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.dateFormat(__VLS_ctx.model.create_time));
    // @ts-ignore
    [model, model, model, $t, i18n_name, i18n_name, dateFormat,];
    var __VLS_47;
    // @ts-ignore
    [];
}
{
    const { tag: __VLS_50 } = __VLS_3.slots;
    if (__VLS_ctx.isShared || __VLS_ctx.isSystemShare) {
        let __VLS_51;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_53 = __VLS_52({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_56 } = __VLS_54.slots;
        (__VLS_ctx.t('views.shared.title'));
        // @ts-ignore
        [isShared, isSystemShare, t,];
        var __VLS_54;
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
    ...{ class: "flex mb-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    type: "info",
    ...{ class: "color-secondary" },
}));
const __VLS_59 = __VLS_58({
    type: "info",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_62 } = __VLS_60.slots;
(__VLS_ctx.$t('views.model.modelForm.model_type.label'));
// @ts-ignore
[$t,];
var __VLS_60;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ellipsis ml-16" },
});
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
(__VLS_ctx.$t(__VLS_ctx.modelType[__VLS_ctx.model.model_type]));
__VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    type: "info",
    ...{ class: "color-secondary" },
}));
const __VLS_65 = __VLS_64({
    type: "info",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_68 } = __VLS_66.slots;
(__VLS_ctx.$t('views.model.modelForm.base_model.label'));
// @ts-ignore
[model, $t, $t, modelType, modelType,];
var __VLS_66;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ellipsis-1 ml-16" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
(__VLS_ctx.model.model_name);
if (__VLS_ctx.currentModel.status === 'DOWNLOAD') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "progress-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['progress-mask']} */ ;
    const __VLS_69 = DownloadLoading;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        ...{ class: "percentage" },
    }));
    const __VLS_71 = __VLS_70({
        ...{ class: "percentage" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    /** @type {__VLS_StyleScopedClasses['percentage']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "percentage-label flex-center" },
    });
    /** @type {__VLS_StyleScopedClasses['percentage-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
    (__VLS_ctx.$t('views.model.download.downloading'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dotting" },
    });
    /** @type {__VLS_StyleScopedClasses['dotting']} */ ;
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        ...{ class: "ml-16" },
    }));
    const __VLS_76 = __VLS_75({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        ...{ class: "ml-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    let __VLS_79;
    const __VLS_80 = {
        /** @type {typeof __VLS_79.click} */
        onClick: (__VLS_ctx.cancelDownload),
    };
    /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
    const { default: __VLS_81 } = __VLS_77.slots;
    (__VLS_ctx.$t('views.model.download.cancelDownload'));
    // @ts-ignore
    [model, currentModel, $t, $t, cancelDownload,];
    var __VLS_77;
    var __VLS_78;
}
if (__VLS_ctx.MoreFilledPermission(__VLS_ctx.model.id)) {
    {
        const { mouseEnter: __VLS_82 } = __VLS_3.slots;
        if (!__VLS_ctx.isShared) {
            let __VLS_83;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
            elDropdown;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                trigger: "click",
            }));
            const __VLS_85 = __VLS_84({
                trigger: "click",
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            const { default: __VLS_88 } = __VLS_86.slots;
            let __VLS_89;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_91 = __VLS_90({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
            let __VLS_94;
            const __VLS_95 = {
                /** @type {typeof __VLS_94.click} */
                onClick: () => { },
            };
            const { default: __VLS_96 } = __VLS_92.slots;
            let __VLS_97;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
                iconName: "app-more",
                ...{ class: "color-secondary" },
            }));
            const __VLS_99 = __VLS_98({
                iconName: "app-more",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_98));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [model, isShared, MoreFilledPermission,];
            var __VLS_92;
            var __VLS_93;
            {
                const { dropdown: __VLS_102 } = __VLS_86.slots;
                let __VLS_103;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                elDropdownMenu;
                // @ts-ignore
                const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({}));
                const __VLS_105 = __VLS_104({}, ...__VLS_functionalComponentArgsRest(__VLS_104));
                const { default: __VLS_108 } = __VLS_106.slots;
                if (__VLS_ctx.permissionPrecise.modify(__VLS_ctx.model.id)) {
                    let __VLS_109;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
                        ...{ 'onClick': {} },
                        text: true,
                    }));
                    const __VLS_111 = __VLS_110({
                        ...{ 'onClick': {} },
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
                    let __VLS_114;
                    const __VLS_115 = {
                        /** @type {typeof __VLS_114.click} */
                        onClick: (__VLS_ctx.openEditModel),
                    };
                    const { default: __VLS_116 } = __VLS_112.slots;
                    let __VLS_117;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
                        iconName: "app-edit",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_119 = __VLS_118({
                        iconName: "app-edit",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.edit'));
                    // @ts-ignore
                    [model, $t, permissionPrecise, openEditModel,];
                    var __VLS_112;
                    var __VLS_113;
                }
                if (__VLS_ctx.isSystemShare) {
                    let __VLS_122;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_124 = __VLS_123({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
                    let __VLS_127;
                    const __VLS_128 = {
                        /** @type {typeof __VLS_127.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.MoreFilledPermission(__VLS_ctx.model.id)))
                                throw 0;
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.isSystemShare))
                                throw 0;
                            return __VLS_ctx.openAuthorizedWorkspaceDialog(__VLS_ctx.model);
                            // @ts-ignore
                            [model, isSystemShare, openAuthorizedWorkspaceDialog,];
                        },
                    };
                    const { default: __VLS_129 } = __VLS_125.slots;
                    let __VLS_130;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
                        iconName: "app-lock",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_132 = __VLS_131({
                        iconName: "app-lock",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.shared.authorized_workspace'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_125;
                    var __VLS_126;
                }
                if ((__VLS_ctx.currentModel.model_type === 'TTS' ||
                    __VLS_ctx.currentModel.model_type === 'STT' ||
                    __VLS_ctx.currentModel.model_type === 'LLM' ||
                    __VLS_ctx.currentModel.model_type === 'IMAGE' ||
                    __VLS_ctx.currentModel.model_type === 'TTI' ||
                    __VLS_ctx.currentModel.model_type === 'ITV' ||
                    __VLS_ctx.currentModel.model_type === 'EMBEDDING' ||
                    __VLS_ctx.currentModel.model_type === 'TTV') &&
                    __VLS_ctx.permissionPrecise.paramSetting(__VLS_ctx.model.id)) {
                    let __VLS_135;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_137 = __VLS_136({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
                    let __VLS_140;
                    const __VLS_141 = {
                        /** @type {typeof __VLS_140.click} */
                        onClick: (__VLS_ctx.openParamSetting),
                    };
                    const { default: __VLS_142 } = __VLS_138.slots;
                    let __VLS_143;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
                        iconName: "app-setting",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_145 = __VLS_144({
                        iconName: "app-setting",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.model.modelForm.title.paramSetting'));
                    // @ts-ignore
                    [model, currentModel, currentModel, currentModel, currentModel, currentModel, currentModel, currentModel, currentModel, $t, permissionPrecise, openParamSetting,];
                    var __VLS_138;
                    var __VLS_139;
                }
                if (__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.auth(__VLS_ctx.model.id)) {
                    let __VLS_148;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_150 = __VLS_149({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
                    let __VLS_153;
                    const __VLS_154 = {
                        /** @type {typeof __VLS_153.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.MoreFilledPermission(__VLS_ctx.model.id)))
                                throw 0;
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.auth(__VLS_ctx.model.id)))
                                throw 0;
                            return __VLS_ctx.openAuthorization(__VLS_ctx.model);
                            // @ts-ignore
                            [model, model, permissionPrecise, apiType, openAuthorization,];
                        },
                    };
                    const { default: __VLS_155 } = __VLS_151.slots;
                    let __VLS_156;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
                        iconName: "app-resource-authorization",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_158 = __VLS_157({
                        iconName: "app-resource-authorization",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_151;
                    var __VLS_152;
                }
                if (__VLS_ctx.permissionPrecise.relate_map(__VLS_ctx.model.id)) {
                    let __VLS_161;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
                        ...{ 'onClick': {} },
                        text: true,
                    }));
                    const __VLS_163 = __VLS_162({
                        ...{ 'onClick': {} },
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
                    let __VLS_166;
                    const __VLS_167 = {
                        /** @type {typeof __VLS_166.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.MoreFilledPermission(__VLS_ctx.model.id)))
                                throw 0;
                            if (!(!__VLS_ctx.isShared))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.relate_map(__VLS_ctx.model.id)))
                                throw 0;
                            return __VLS_ctx.openResourceMappingDrawer(__VLS_ctx.model);
                            // @ts-ignore
                            [model, model, permissionPrecise, openResourceMappingDrawer,];
                        },
                    };
                    const { default: __VLS_168 } = __VLS_164.slots;
                    let __VLS_169;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
                        iconName: "app-resource-mapping",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_171 = __VLS_170({
                        iconName: "app-resource-mapping",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.system.resourceMapping.title'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_164;
                    var __VLS_165;
                }
                if (__VLS_ctx.permissionPrecise.delete(__VLS_ctx.model.id)) {
                    let __VLS_174;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
                        ...{ 'onClick': {} },
                        divided: true,
                        text: true,
                    }));
                    const __VLS_176 = __VLS_175({
                        ...{ 'onClick': {} },
                        divided: true,
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
                    let __VLS_179;
                    const __VLS_180 = {
                        /** @type {typeof __VLS_179.click} */
                        onClick: (__VLS_ctx.deleteModel),
                    };
                    const { default: __VLS_181 } = __VLS_177.slots;
                    let __VLS_182;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
                        iconName: "app-delete",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_184 = __VLS_183({
                        iconName: "app-delete",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.delete'));
                    // @ts-ignore
                    [model, $t, permissionPrecise, deleteModel,];
                    var __VLS_177;
                    var __VLS_178;
                }
                // @ts-ignore
                [];
                var __VLS_106;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_86;
        }
        // @ts-ignore
        [];
    }
}
const __VLS_187 = EditModel || EditModel;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
    ...{ 'onSubmit': {} },
    ref: "editModelRef",
}));
const __VLS_189 = __VLS_188({
    ...{ 'onSubmit': {} },
    ref: "editModelRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
let __VLS_192;
const __VLS_193 = {
    /** @type {typeof __VLS_192.submit} */
    onSubmit: (...[$event]) => {
        return __VLS_ctx.emit('change');
        // @ts-ignore
        [emit,];
    },
};
var __VLS_194;
var __VLS_190;
var __VLS_191;
const __VLS_196 = ParamSettingDialog;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
    ref: "paramSettingRef",
}));
const __VLS_198 = __VLS_197({
    ref: "paramSettingRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
var __VLS_201;
var __VLS_199;
if (__VLS_ctx.isSystemShare) {
    const __VLS_203 = AuthorizedWorkspace || AuthorizedWorkspace;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
        ref: "AuthorizedWorkspaceDialogRef",
    }));
    const __VLS_205 = __VLS_204({
        ref: "AuthorizedWorkspaceDialogRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    var __VLS_208;
    var __VLS_206;
}
if (__VLS_ctx.apiType === 'workspace') {
    const __VLS_210 = ResourceAuthorizationDrawer;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
        type: (__VLS_ctx.SourceTypeEnum.MODEL),
        ref: "ResourceAuthorizationDrawerRef",
    }));
    const __VLS_212 = __VLS_211({
        type: (__VLS_ctx.SourceTypeEnum.MODEL),
        ref: "ResourceAuthorizationDrawerRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_211));
    var __VLS_215;
    var __VLS_213;
}
const __VLS_217 = ResourceMappingDrawer || ResourceMappingDrawer;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
    ref: "resourceMappingDrawerRef",
}));
const __VLS_219 = __VLS_218({
    ref: "resourceMappingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
var __VLS_222;
var __VLS_220;
// @ts-ignore
[isSystemShare, apiType, SourceTypeEnum,];
var __VLS_3;
// @ts-ignore
var __VLS_195 = __VLS_194, __VLS_202 = __VLS_201, __VLS_209 = __VLS_208, __VLS_216 = __VLS_215, __VLS_223 = __VLS_222;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
