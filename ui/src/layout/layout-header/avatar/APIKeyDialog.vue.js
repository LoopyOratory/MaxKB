/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { copyClick } from '@/utils/clipboard';
import systemKeyApi from '@/api/system/api-key';
import { datetimeFormat } from '@/utils/time';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import SettingAPIKeyDialog from '@/views/application-overview/component/SettingAPIKeyDrawer.vue';
import { fromNowDate } from '@/utils/time';
const route = useRoute();
const { params: { id }, } = route;
const props = defineProps({
    userId: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['addData']);
const apiUrl = window.location.origin + `${window.MaxKB.prefix}/api-doc/`;
const SettingAPIKeyDialogRef = ref();
const dialogVisible = ref(false);
const loading = ref(false);
const apiKey = ref(null);
const orderBy = ref('');
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        apiKey.value = null;
    }
});
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getApiKeyList();
}
function settingApiKey(row) {
    SettingAPIKeyDialogRef.value.open(row, 'USER');
}
function deleteApiKey(row) {
    MsgConfirm(`${t('views.applicationOverview.appInfo.APIKeyDialog.msgConfirm1')}: ${row.secret_key}?`, t(t('views.applicationOverview.appInfo.APIKeyDialog.msgConfirm2')), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        systemKeyApi.delAPIKey(row.id, loading).then(() => {
            MsgSuccess(t('common.deleteSuccess'));
            getApiKeyList();
        });
    })
        .catch(() => {
    });
}
function changeState(bool, row) {
    const obj = {
        is_active: bool,
    };
    const str = bool ? t('common.status.enabled') : t('common.status.disabled');
    systemKeyApi.putAPIKey(row.id, obj, loading).then((res) => {
        MsgSuccess(str);
        getApiKeyList();
    });
}
function createApiKey() {
    systemKeyApi.postAPIKey(loading).then((res) => {
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
    systemKeyApi
        .getAPIKey(paginationConfig.current_page, paginationConfig.page_size, param, loading)
        .then((res) => {
        apiKey.value = res.data.records;
        paginationConfig.total = res.data.total;
    });
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
function handleSortChange({ prop, order }) {
    orderBy.value = order === 'ascending' ? prop : `-${prop}`;
    getApiKeyList();
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
    title: (__VLS_ctx.$t('layout.apiKey')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1080",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('layout.apiKey')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1080",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    shadow: "never",
    ...{ class: "layout-bg mb-16" },
}));
const __VLS_9 = __VLS_8({
    shadow: "never",
    ...{ class: "layout-bg mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    type: "info",
    ...{ class: "color-secondary" },
}));
const __VLS_15 = __VLS_14({
    type: "info",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_18 } = __VLS_16.slots;
(__VLS_ctx.$t('layout.apiServiceAddress'));
// @ts-ignore
[$t, $t, dialogVisible,];
var __VLS_16;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ style: {} },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "vertical-middle lighter break-all" },
});
/** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
(__VLS_ctx.apiUrl);
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = {
    /** @type {typeof __VLS_24.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.apiUrl);
        // @ts-ignore
        [apiUrl, apiUrl, copyClick,];
    },
};
const { default: __VLS_26 } = __VLS_22.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    iconName: "app-copy",
}));
const __VLS_29 = __VLS_28({
    iconName: "app-copy",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
// @ts-ignore
[];
var __VLS_22;
var __VLS_23;
// @ts-ignore
[];
var __VLS_10;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-16" },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
const __VLS_38 = {
    /** @type {typeof __VLS_37.click} */
    onClick: (__VLS_ctx.createApiKey),
};
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_39 } = __VLS_35.slots;
(__VLS_ctx.$t('common.create'));
// @ts-ignore
[$t, createApiKey,];
var __VLS_35;
var __VLS_36;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.apiKey),
    loading: (__VLS_ctx.loading),
    ...{ style: {} },
    maxHeight: (420),
    paginationConfig: (__VLS_ctx.paginationConfig),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSortChange': {} },
    data: (__VLS_ctx.apiKey),
    loading: (__VLS_ctx.loading),
    ...{ style: {} },
    maxHeight: (420),
    paginationConfig: (__VLS_ctx.paginationConfig),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_45;
const __VLS_46 = {
    /** @type {typeof __VLS_45.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_47 = {
    /** @type {typeof __VLS_45.changePage} */
    onChangePage: (__VLS_ctx.getApiKeyList),
};
const __VLS_48 = {
    /** @type {typeof __VLS_45.sortChange} */
    onSortChange: (__VLS_ctx.handleSortChange),
};
const { default: __VLS_49 } = __VLS_43.slots;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    prop: "secret_key",
    label: "API Key",
}));
const __VLS_52 = __VLS_51({
    prop: "secret_key",
    label: "API Key",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
{
    const { default: __VLS_56 } = __VLS_53.slots;
    const [{ row }] = __VLS_vSlot(__VLS_56);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "api-key-container" },
    });
    /** @type {__VLS_StyleScopedClasses['api-key-container']} */ ;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        content: (row.secret_key),
        placement: "top",
        effect: "light",
        hideAfter: (0),
    }));
    const __VLS_59 = __VLS_58({
        content: (row.secret_key),
        placement: "top",
        effect: "light",
        hideAfter: (0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const { default: __VLS_62 } = __VLS_60.slots;
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
    var __VLS_60;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        ...{ class: "copy-btn" },
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
        ...{ class: "copy-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = {
        /** @type {typeof __VLS_68.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.copyClick(row.secret_key);
            // @ts-ignore
            [copyClick,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['copy-btn']} */ ;
    const { default: __VLS_70 } = __VLS_66.slots;
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        iconName: "app-copy",
    }));
    const __VLS_73 = __VLS_72({
        iconName: "app-copy",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    // @ts-ignore
    [];
    var __VLS_66;
    var __VLS_67;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_53;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    label: (__VLS_ctx.$t('views.document.enableStatus.label')),
    width: "100",
}));
const __VLS_78 = __VLS_77({
    label: (__VLS_ctx.$t('views.document.enableStatus.label')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const { default: __VLS_81 } = __VLS_79.slots;
{
    const { default: __VLS_82 } = __VLS_79.slots;
    const [{ row }] = __VLS_vSlot(__VLS_82);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_83;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_85 = __VLS_84({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_84));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_88 } = __VLS_86.slots;
        let __VLS_89;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({}));
        const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
        // @ts-ignore
        [$t,];
        var __VLS_86;
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
        let __VLS_94;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_96 = __VLS_95({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
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
var __VLS_79;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    label: (__VLS_ctx.$t('layout.crossSettings')),
    width: "100",
    prop: "allow_cross_domain",
}));
const __VLS_101 = __VLS_100({
    label: (__VLS_ctx.$t('layout.crossSettings')),
    width: "100",
    prop: "allow_cross_domain",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
{
    const { default: __VLS_105 } = __VLS_102.slots;
    const [{ row }] = __VLS_vSlot(__VLS_105);
    if (row.allow_cross_domain) {
        let __VLS_106;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_108 = __VLS_107({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_107));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_111 } = __VLS_109.slots;
        (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.alreadyTurnedOn'));
        // @ts-ignore
        [$t, $t,];
        var __VLS_109;
    }
    else {
        let __VLS_112;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
            size: "small",
            ...{ class: "blue-tag" },
        }));
        const __VLS_114 = __VLS_113({
            size: "small",
            ...{ class: "blue-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        /** @type {__VLS_StyleScopedClasses['blue-tag']} */ ;
        const { default: __VLS_117 } = __VLS_115.slots;
        (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.notEnabled'));
        // @ts-ignore
        [$t,];
        var __VLS_115;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_102;
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    label: (__VLS_ctx.$t('layout.about.expiredTime')),
    width: "265",
}));
const __VLS_120 = __VLS_119({
    label: (__VLS_ctx.$t('layout.about.expiredTime')),
    width: "265",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
{
    const { default: __VLS_124 } = __VLS_121.slots;
    const [{ row }] = __VLS_vSlot(__VLS_124);
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
var __VLS_121;
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    label: (__VLS_ctx.$t('common.createDate')),
    width: "170",
    prop: "create_time",
    sortable: true,
}));
const __VLS_127 = __VLS_126({
    label: (__VLS_ctx.$t('common.createDate')),
    width: "170",
    prop: "create_time",
    sortable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const { default: __VLS_130 } = __VLS_128.slots;
{
    const { default: __VLS_131 } = __VLS_128.slots;
    const [{ row }] = __VLS_vSlot(__VLS_131);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_128;
let __VLS_132;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "130",
}));
const __VLS_134 = __VLS_133({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const { default: __VLS_137 } = __VLS_135.slots;
{
    const { default: __VLS_138 } = __VLS_135.slots;
    const [{ row }] = __VLS_vSlot(__VLS_138);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onClick: () => { } },
    });
    let __VLS_139;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
        ...{ 'onChange': {} },
        size: "small",
        modelValue: (row.is_active),
    }));
    const __VLS_141 = __VLS_140({
        ...{ 'onChange': {} },
        size: "small",
        modelValue: (row.is_active),
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    let __VLS_144;
    const __VLS_145 = {
        /** @type {typeof __VLS_144.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.changeState($event, row);
            // @ts-ignore
            [$t, changeState,];
        },
    };
    var __VLS_142;
    var __VLS_143;
    let __VLS_146;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
        direction: "vertical",
    }));
    const __VLS_148 = __VLS_147({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_151;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
        effect: "dark",
        content: (__VLS_ctx.$t('common.setting')),
        placement: "top",
    }));
    const __VLS_153 = __VLS_152({
        effect: "dark",
        content: (__VLS_ctx.$t('common.setting')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    const { default: __VLS_156 } = __VLS_154.slots;
    let __VLS_157;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_159 = __VLS_158({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    let __VLS_162;
    const __VLS_163 = {
        /** @type {typeof __VLS_162.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.settingApiKey(row);
            // @ts-ignore
            [$t, settingApiKey,];
        },
    };
    const { default: __VLS_164 } = __VLS_160.slots;
    let __VLS_165;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        iconName: "app-edit",
    }));
    const __VLS_167 = __VLS_166({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    // @ts-ignore
    [];
    var __VLS_160;
    var __VLS_161;
    // @ts-ignore
    [];
    var __VLS_154;
    let __VLS_170;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_172 = __VLS_171({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    const { default: __VLS_175 } = __VLS_173.slots;
    let __VLS_176;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_181;
    const __VLS_182 = {
        /** @type {typeof __VLS_181.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteApiKey(row);
            // @ts-ignore
            [$t, deleteApiKey,];
        },
    };
    const { default: __VLS_183 } = __VLS_179.slots;
    let __VLS_184;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
        iconName: "app-delete",
    }));
    const __VLS_186 = __VLS_185({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    // @ts-ignore
    [];
    var __VLS_179;
    var __VLS_180;
    // @ts-ignore
    [];
    var __VLS_173;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_135;
// @ts-ignore
[];
var __VLS_43;
var __VLS_44;
const __VLS_189 = SettingAPIKeyDialog;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
    ...{ 'onRefresh': {} },
    ref: "SettingAPIKeyDialogRef",
}));
const __VLS_191 = __VLS_190({
    ...{ 'onRefresh': {} },
    ref: "SettingAPIKeyDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
let __VLS_194;
const __VLS_195 = {
    /** @type {typeof __VLS_194.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_196;
var __VLS_192;
var __VLS_193;
// @ts-ignore
[refresh,];
var __VLS_3;
// @ts-ignore
var __VLS_197 = __VLS_196;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        userId: {
            type: String,
            default: '',
        },
    },
});
export default {};
