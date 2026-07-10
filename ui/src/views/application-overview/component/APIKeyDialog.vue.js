/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { copyClick } from '@/utils/clipboard';
import SettingAPIKeyDialog from './SettingAPIKeyDrawer.vue';
import { datetimeFormat, fromNowDate } from '@/utils/time';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const orderBy = ref('');
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getApiKeyList();
}
const emit = defineEmits(['addData']);
const SettingAPIKeyDialogRef = ref();
const dialogVisible = ref(false);
const loading = ref(false);
const apiKey = ref(null);
watch(dialogVisible, (bool) => {
    if (!bool) {
        apiKey.value = null;
    }
});
function settingApiKey(row) {
    SettingAPIKeyDialogRef.value.open(row, 'APPLICATION');
}
function deleteApiKey(row) {
    MsgConfirm(`${t('views.applicationOverview.appInfo.APIKeyDialog.msgConfirm1')}: ${row.secret_key}?`, t('views.applicationOverview.appInfo.APIKeyDialog.msgConfirm2'), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'applicationKey', systemType: apiType.value })
            .delAPIKey(id, row.id, loading)
            .then(() => {
            MsgSuccess(t('common.deleteSuccess'));
            getApiKeyList();
        });
    })
        .catch(() => {
    });
}
async function changeState(bool, row) {
    const obj = {
        is_active: bool,
    };
    const str = obj.is_active ? t('common.status.enabled') : t('common.status.disabled');
    await loadSharedApi({ type: 'applicationKey', systemType: apiType.value })
        .putAPIKey(id, row.id, obj, loading)
        .then(() => {
        MsgSuccess(str);
        getApiKeyList();
        return true;
    })
        .catch(() => {
        return false;
    });
}
function createApiKey() {
    loadSharedApi({ type: 'applicationKey', systemType: apiType.value })
        .postAPIKey(id, loading)
        .then(() => {
        MsgSuccess(t('common.createSuccess'));
        getApiKeyList();
    });
}
const open = () => {
    getApiKeyList();
    dialogVisible.value = true;
};
function getApiKeyList() {
    const param = {
        order_by: orderBy.value,
    };
    loadSharedApi({ type: 'applicationKey', systemType: apiType.value })
        .getAPIKey(id, paginationConfig.current_page, paginationConfig.page_size, param, loading)
        .then((res) => {
        apiKey.value = res.data.records;
        paginationConfig.total = res.data.total;
    });
}
function handleSortChange({ prop, order }) {
    orderBy.value = order === 'ascending' ? prop : `-${prop}`;
    getApiKeyList();
}
function getExpiryClass(expireTime) {
    const status = fromNowDate(expireTime);
    if (status === t('layout.time.expired')) {
        return 'color-danger'; // Red
    }
    else {
        return 'color-warning'; // Orange
    }
}
function refresh() {
    getApiKeyList();
}
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
    title: "API Key",
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    title: "API Key",
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-16" },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (__VLS_ctx.createApiKey),
};
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
(__VLS_ctx.$t('common.create'));
// @ts-ignore
[dialogVisible, createApiKey, $t,];
var __VLS_10;
var __VLS_11;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.apiKey),
    loading: (__VLS_ctx.loading),
    ...{ style: {} },
    ...{ class: "mb-16" },
    maxHeight: (500),
    paginationConfig: (__VLS_ctx.paginationConfig),
}));
const __VLS_17 = __VLS_16({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.apiKey),
    loading: (__VLS_ctx.loading),
    ...{ style: {} },
    ...{ class: "mb-16" },
    maxHeight: (500),
    paginationConfig: (__VLS_ctx.paginationConfig),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
const __VLS_21 = {
    /** @type {typeof __VLS_20.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_22 = {
    /** @type {typeof __VLS_20.changePage} */
    onChangePage: (__VLS_ctx.getApiKeyList),
};
const __VLS_23 = {
    /** @type {typeof __VLS_20.sortChange} */
    onSortChange: (__VLS_ctx.handleSortChange),
};
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_24 } = __VLS_18.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    prop: "secret_key",
    label: "API Key",
}));
const __VLS_27 = __VLS_26({
    prop: "secret_key",
    label: "API Key",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
{
    const { default: __VLS_31 } = __VLS_28.slots;
    const [{ row }] = __VLS_vSlot(__VLS_31);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "api-key-container" },
    });
    /** @type {__VLS_StyleScopedClasses['api-key-container']} */ ;
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        content: (row.secret_key),
        placement: "top",
        effect: "light",
        hideAfter: (0),
    }));
    const __VLS_34 = __VLS_33({
        content: (row.secret_key),
        placement: "top",
        effect: "light",
        hideAfter: (0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const { default: __VLS_37 } = __VLS_35.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "api-key-text vertical-middle lighter break-all" },
    });
    /** @type {__VLS_StyleScopedClasses['api-key-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
    (row.secret_key);
    // @ts-ignore
    [apiKey, loading, paginationConfig, handleSizeChange, getApiKeyList, handleSortChange,];
    var __VLS_35;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        ...{ class: "copy-btn" },
    }));
    const __VLS_40 = __VLS_39({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        ...{ class: "copy-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    const __VLS_44 = {
        /** @type {typeof __VLS_43.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.copyClick(row.secret_key);
            // @ts-ignore
            [copyClick,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['copy-btn']} */ ;
    const { default: __VLS_45 } = __VLS_41.slots;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        iconName: "app-copy",
    }));
    const __VLS_48 = __VLS_47({
        iconName: "app-copy",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    // @ts-ignore
    [];
    var __VLS_41;
    var __VLS_42;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_28;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    label: (__VLS_ctx.$t('views.document.enableStatus.label')),
    width: "100",
}));
const __VLS_53 = __VLS_52({
    label: (__VLS_ctx.$t('views.document.enableStatus.label')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
{
    const { default: __VLS_57 } = __VLS_54.slots;
    const [{ row }] = __VLS_vSlot(__VLS_57);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_58;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_60 = __VLS_59({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_63 } = __VLS_61.slots;
        let __VLS_64;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
        const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
        // @ts-ignore
        [$t,];
        var __VLS_61;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.enabled'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_69;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_71 = __VLS_70({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.disabled'));
    }
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_54;
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    label: (__VLS_ctx.$t('layout.crossSettings')),
    width: "100",
    prop: "allow_cross_domain",
}));
const __VLS_76 = __VLS_75({
    label: (__VLS_ctx.$t('layout.crossSettings')),
    width: "100",
    prop: "allow_cross_domain",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
const { default: __VLS_79 } = __VLS_77.slots;
{
    const { default: __VLS_80 } = __VLS_77.slots;
    const [{ row }] = __VLS_vSlot(__VLS_80);
    if (row.allow_cross_domain) {
        let __VLS_81;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_83 = __VLS_82({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_86 } = __VLS_84.slots;
        (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.alreadyTurnedOn'));
        // @ts-ignore
        [$t, $t,];
        var __VLS_84;
    }
    else {
        let __VLS_87;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
            size: "small",
            ...{ class: "blue-tag" },
        }));
        const __VLS_89 = __VLS_88({
            size: "small",
            ...{ class: "blue-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        /** @type {__VLS_StyleScopedClasses['blue-tag']} */ ;
        const { default: __VLS_92 } = __VLS_90.slots;
        (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.notEnabled'));
        // @ts-ignore
        [$t,];
        var __VLS_90;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_77;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    label: (__VLS_ctx.$t('layout.about.expiredTime')),
    width: "265",
}));
const __VLS_95 = __VLS_94({
    label: (__VLS_ctx.$t('layout.about.expiredTime')),
    width: "265",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const { default: __VLS_98 } = __VLS_96.slots;
{
    const { default: __VLS_99 } = __VLS_96.slots;
    const [{ row }] = __VLS_vSlot(__VLS_99);
    if (row.is_permanent) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "permanent-status" },
        });
        /** @type {__VLS_StyleScopedClasses['permanent-status']} */ ;
        (__VLS_ctx.t('layout.time.neverExpires'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "expiry-info" },
        });
        /** @type {__VLS_StyleScopedClasses['expiry-info']} */ ;
        if (__VLS_ctx.fromNowDate(row.expire_time)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: (__VLS_ctx.getExpiryClass(row.expire_time)) },
                ...{ class: "relative-time" },
            });
            /** @type {__VLS_StyleScopedClasses['relative-time']} */ ;
            (__VLS_ctx.fromNowDate(row.expire_time));
        }
        (__VLS_ctx.datetimeFormat(row.expire_time));
    }
    // @ts-ignore
    [$t, t, fromNowDate, fromNowDate, getExpiryClass, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_96;
let __VLS_100;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    label: (__VLS_ctx.$t('common.createDate')),
    width: "170",
    prop: "create_time",
    sortable: true,
}));
const __VLS_102 = __VLS_101({
    label: (__VLS_ctx.$t('common.createDate')),
    width: "170",
    prop: "create_time",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const { default: __VLS_105 } = __VLS_103.slots;
{
    const { default: __VLS_106 } = __VLS_103.slots;
    const [{ row }] = __VLS_vSlot(__VLS_106);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_103;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "130",
}));
const __VLS_109 = __VLS_108({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
const { default: __VLS_112 } = __VLS_110.slots;
{
    const { default: __VLS_113 } = __VLS_110.slots;
    const [{ row }] = __VLS_vSlot(__VLS_113);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onClick: () => { } },
    });
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        ...{ 'onChange': {} },
        size: "small",
        modelValue: (row.is_active),
    }));
    const __VLS_116 = __VLS_115({
        ...{ 'onChange': {} },
        size: "small",
        modelValue: (row.is_active),
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    let __VLS_119;
    const __VLS_120 = {
        /** @type {typeof __VLS_119.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.changeState($event, row);
            // @ts-ignore
            [$t, changeState,];
        },
    };
    var __VLS_117;
    var __VLS_118;
    let __VLS_121;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
        direction: "vertical",
    }));
    const __VLS_123 = __VLS_122({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_126;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
        effect: "dark",
        content: (__VLS_ctx.$t('common.setting')),
        placement: "top",
    }));
    const __VLS_128 = __VLS_127({
        effect: "dark",
        content: (__VLS_ctx.$t('common.setting')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const { default: __VLS_131 } = __VLS_129.slots;
    let __VLS_132;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_137;
    const __VLS_138 = {
        /** @type {typeof __VLS_137.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.settingApiKey(row);
            // @ts-ignore
            [$t, settingApiKey,];
        },
    };
    const { default: __VLS_139 } = __VLS_135.slots;
    let __VLS_140;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
        iconName: "app-edit",
    }));
    const __VLS_142 = __VLS_141({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    // @ts-ignore
    [];
    var __VLS_135;
    var __VLS_136;
    // @ts-ignore
    [];
    var __VLS_129;
    let __VLS_145;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_147 = __VLS_146({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    const { default: __VLS_150 } = __VLS_148.slots;
    let __VLS_151;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_153 = __VLS_152({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    let __VLS_156;
    const __VLS_157 = {
        /** @type {typeof __VLS_156.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteApiKey(row);
            // @ts-ignore
            [$t, deleteApiKey,];
        },
    };
    const { default: __VLS_158 } = __VLS_154.slots;
    let __VLS_159;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
        iconName: "app-delete",
    }));
    const __VLS_161 = __VLS_160({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    // @ts-ignore
    [];
    var __VLS_154;
    var __VLS_155;
    // @ts-ignore
    [];
    var __VLS_148;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_110;
// @ts-ignore
[];
var __VLS_18;
var __VLS_19;
const __VLS_164 = SettingAPIKeyDialog;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    ...{ 'onRefresh': {} },
    ref: "SettingAPIKeyDialogRef",
}));
const __VLS_166 = __VLS_165({
    ...{ 'onRefresh': {} },
    ref: "SettingAPIKeyDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
const __VLS_170 = {
    /** @type {typeof __VLS_169.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_171;
var __VLS_167;
var __VLS_168;
// @ts-ignore
[refresh,];
var __VLS_3;
// @ts-ignore
var __VLS_172 = __VLS_171;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
