/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted, shallowRef, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import EmbedDialog from './component/EmbedDialog.vue';
import APIKeyDialog from './component/APIKeyDialog.vue';
import LimitDialog from './component/LimitDialog.vue';
import XPackLimitDrawer from './xpack-component/XPackLimitDrawer.vue';
import DisplaySettingDialog from './component/DisplaySettingDialog.vue';
import XPackDisplaySettingDialog from './xpack-component/XPackDisplaySettingDialog.vue';
import StatisticsCharts from './component/StatisticsCharts.vue';
import { nowDate, beforeDay } from '@/utils/time';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { copyClick } from '@/utils/clipboard';
import { resetUrl } from '@/utils/common';
import { mapToUrlParams } from '@/utils/application';
import { t } from '@/locales';
import { EditionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
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
const permissionPrecise = computed(() => {
    return permissionMap['application'][apiType.value];
});
const apiUrl = window.location.origin + `${window.MaxKB.chatPrefix}/api-doc/`;
const baseUrl = window.location.origin + `${window.MaxKB.chatPrefix}/api/`;
const APIKeyDialogRef = ref();
const EmbedDialogRef = ref();
const accessToken = ref({});
const detail = ref(null);
const loading = ref(false);
const urlParams = computed(() => mapToUrlParams(apiInputParams.value) ? '?' + mapToUrlParams(apiInputParams.value) : '');
const shareUrl = computed(() => `${window.location.origin}${window.MaxKB.chatPrefix}/` +
    accessToken.value?.access_token +
    urlParams.value);
const dayOptions = [
    {
        value: 7,
        label: t('home.pastDayOptions.past7Days'),
    },
    {
        value: 30,
        label: t('home.pastDayOptions.past30Days'),
    },
    {
        value: 90,
        label: t('home.pastDayOptions.past90Days'),
    },
    {
        value: 183,
        label: t('home.pastDayOptions.past183Days'),
    },
    {
        value: 'other',
        label: t('common.custom'),
    },
];
const history_day = ref(7);
// Date component time
const daterangeValue = ref('');
// SubmitDateTime
const daterange = ref({
    start_time: '',
    end_time: '',
});
const statisticsLoading = ref(false);
const statisticsData = ref([]);
const tokenUsage = ref([]);
const topQuestions = ref([]);
const apiInputParams = ref([]);
function toUrl(url) {
    window.open(url, '_blank');
}
// ShowSettings
const DisplaySettingDialogRef = ref();
const currentDisplaySettingDialog = shallowRef(null);
function openDisplaySettingDialog() {
    // EnterpriseAnd Professional
    if (hasPermission([EditionConst.IS_EE, EditionConst.IS_PE], 'OR')) {
        currentDisplaySettingDialog.value = XPackDisplaySettingDialog;
    }
    else {
        // Community edition
        currentDisplaySettingDialog.value = DisplaySettingDialog;
    }
    nextTick(() => {
        if (currentDisplaySettingDialog.value == XPackDisplaySettingDialog) {
            loadSharedApi({ type: 'application', systemType: apiType.value })
                .getApplicationSetting(id)
                .then((ok) => {
                DisplaySettingDialogRef.value?.open(ok.data, detail.value);
            });
        }
        else {
            DisplaySettingDialogRef.value?.open(accessToken.value, detail.value);
        }
    });
}
// AccessLimit
const LimitDialogRef = ref();
const currentLimitDialog = shallowRef(null);
function openLimitDialog() {
    // EnterpriseAnd Professional
    if (hasPermission([EditionConst.IS_EE, EditionConst.IS_PE], 'OR')) {
        currentLimitDialog.value = XPackLimitDrawer;
    }
    else {
        // Community edition
        currentLimitDialog.value = LimitDialog;
    }
    nextTick(() => {
        LimitDialogRef.value.open(accessToken.value);
    });
}
function changeDayHandle(val) {
    if (val !== 'other') {
        daterange.value.start_time = beforeDay(val);
        daterange.value.end_time = nowDate;
        getAppStatistics();
    }
}
function changeDayRangeHandle(val) {
    daterange.value.start_time = val[0];
    daterange.value.end_time = val[1];
    getAppStatistics();
}
function getAppStatistics() {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getStatistics(id, daterange.value, statisticsLoading)
        .then((res) => {
        statisticsData.value = res.data;
    });
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getTokenUsage(id, daterange.value, statisticsLoading)
        .then((res) => {
        // [{'token_usage': 200, 'username': 'Zhang San'}, ...]
        tokenUsage.value = res.data;
    });
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .topQuestions(id, daterange.value, statisticsLoading)
        .then((res) => {
        // [{'chat_record_count': 200, 'username': 'Zhang San'}, ...]
        topQuestions.value = res.data;
    });
}
function refreshAccessToken() {
    MsgConfirm(t('views.applicationOverview.appInfo.refreshToken.msgConfirm1'), t('views.applicationOverview.appInfo.refreshToken.msgConfirm2'), {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
    })
        .then(() => {
        const obj = {
            access_token_reset: true,
        };
        const str = t('views.applicationOverview.appInfo.refreshToken.refreshSuccess');
        updateAccessToken(obj, str);
    })
        .catch(() => { });
}
async function changeState(bool) {
    const obj = {
        is_active: !bool,
    };
    const str = obj.is_active ? t('common.status.enableSuccess') : t('common.status.disableSuccess');
    await updateAccessToken(obj, str)
        .then(() => {
        return true;
    })
        .catch(() => {
        return false;
    });
}
async function updateAccessToken(obj, str) {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .putAccessToken(id, obj, loading)
        .then((res) => {
        accessToken.value = res?.data;
        MsgSuccess(str);
    });
}
function openAPIKeyDialog() {
    APIKeyDialogRef.value.open();
}
function openDialog() {
    EmbedDialogRef.value.open(accessToken.value?.access_token);
}
function getAccessToken() {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getAccessToken(id, loading)
        .then((res) => {
        accessToken.value = res?.data;
    });
}
function getDetail() {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getApplicationDetail(id, loading)
        .then((res) => {
        detail.value = res.data;
        detail.value.work_flow?.nodes
            ?.filter((v) => v.id === 'base-node')
            .map((v) => {
            apiInputParams.value = v.properties.api_input_field_list
                ? v.properties.api_input_field_list.map((v) => {
                    return {
                        name: v.variable,
                        value: v.default_value,
                    };
                })
                : v.properties.input_field_list
                    ? v.properties.input_field_list
                        .filter((v) => v.assignment_method === 'api_input')
                        .map((v) => {
                        return {
                            name: v.variable,
                            value: v.default_value,
                        };
                    })
                    : [];
        });
    });
}
function refresh() {
    getAccessToken();
}
onMounted(() => {
    getDetail();
    getAccessToken();
    changeDayHandle(history_day.value);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16" },
});
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16 ml-8" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
(__VLS_ctx.$t('views.applicationOverview.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-calc-height p-8 pt-0" },
});
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ style: {} },
}));
const __VLS_8 = __VLS_7({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('common.info'));
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    shadow: "never",
    ...{ class: "overview-card" },
}));
const __VLS_14 = __VLS_13({
    shadow: "never",
    ...{ class: "overview-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['overview-card']} */ ;
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "edit-avatar mr-12" },
});
/** @type {__VLS_StyleScopedClasses['edit-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    shape: "square",
    size: (32),
    ...{ style: {} },
}));
const __VLS_20 = __VLS_19({
    shape: "square",
    size: (32),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: (__VLS_ctx.resetUrl(__VLS_ctx.detail?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
    alt: "",
});
// @ts-ignore
[$t, $t, vLoading, loading, resetUrl, resetUrl, detail,];
var __VLS_21;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.detail?.name || '-');
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    gutter: (12),
}));
const __VLS_26 = __VLS_25({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    span: (12),
    ...{ class: "mt-16" },
}));
const __VLS_32 = __VLS_31({
    span: (12),
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_35 } = __VLS_33.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    type: "info",
}));
const __VLS_38 = __VLS_37({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
(__VLS_ctx.$t('views.applicationOverview.appInfo.publicAccessLink'));
// @ts-ignore
[$t, detail,];
var __VLS_39;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.accessToken.is_active),
    ...{ class: "ml-8" },
    size: "small",
    inlinePrompt: true,
    activeText: (__VLS_ctx.$t('views.applicationOverview.appInfo.openText')),
    inactiveText: (__VLS_ctx.$t('views.applicationOverview.appInfo.closeText')),
    beforeChange: (() => __VLS_ctx.changeState(__VLS_ctx.accessToken.is_active)),
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.accessToken.is_active),
    ...{ class: "ml-8" },
    size: "small",
    inlinePrompt: true,
    activeText: (__VLS_ctx.$t('views.applicationOverview.appInfo.openText')),
    inactiveText: (__VLS_ctx.$t('views.applicationOverview.appInfo.closeText')),
    beforeChange: (() => __VLS_ctx.changeState(__VLS_ctx.accessToken.is_active)),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-4 mb-16 url-height flex align-center" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['url-height']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "vertical-middle lighter break-all ellipsis-1" },
});
/** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
(__VLS_ctx.shareUrl);
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    effect: "dark",
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}));
const __VLS_49 = __VLS_48({
    effect: "dark",
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}));
const __VLS_55 = __VLS_54({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_58;
const __VLS_59 = {
    /** @type {typeof __VLS_58.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.shareUrl);
        // @ts-ignore
        [$t, $t, $t, accessToken, accessToken, changeState, shareUrl, shareUrl, copyClick,];
    },
};
const { default: __VLS_60 } = __VLS_56.slots;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    iconName: "app-copy",
}));
const __VLS_63 = __VLS_62({
    iconName: "app-copy",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
// @ts-ignore
[];
var __VLS_56;
var __VLS_57;
// @ts-ignore
[];
var __VLS_50;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    effect: "dark",
    content: (__VLS_ctx.$t('common.refresh')),
    placement: "top",
}));
const __VLS_68 = __VLS_67({
    effect: "dark",
    content: (__VLS_ctx.$t('common.refresh')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
const { default: __VLS_71 } = __VLS_69.slots;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
    ...{ style: {} },
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_77;
const __VLS_78 = {
    /** @type {typeof __VLS_77.click} */
    onClick: (__VLS_ctx.refreshAccessToken),
};
const { default: __VLS_79 } = __VLS_75.slots;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    iconName: "app-refresh",
}));
const __VLS_82 = __VLS_81({
    iconName: "app-refresh",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
// @ts-ignore
[$t, refreshAccessToken,];
var __VLS_75;
var __VLS_76;
// @ts-ignore
[];
var __VLS_69;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.accessToken?.is_active) {
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        disabled: (!__VLS_ctx.accessToken?.is_active),
        tag: "a",
        href: (__VLS_ctx.shareUrl),
        target: "_blank",
    }));
    const __VLS_87 = __VLS_86({
        disabled: (!__VLS_ctx.accessToken?.is_active),
        tag: "a",
        href: (__VLS_ctx.shareUrl),
        target: "_blank",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    const { default: __VLS_90 } = __VLS_88.slots;
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        iconName: "app-create-chat",
        ...{ class: "mr-4" },
    }));
    const __VLS_93 = __VLS_92({
        iconName: "app-create-chat",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.operation.toChat'));
    // @ts-ignore
    [$t, accessToken, accessToken, shareUrl,];
    var __VLS_88;
}
else {
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        disabled: (!__VLS_ctx.accessToken?.is_active),
    }));
    const __VLS_98 = __VLS_97({
        disabled: (!__VLS_ctx.accessToken?.is_active),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    const { default: __VLS_101 } = __VLS_99.slots;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        iconName: "app-create-chat",
        ...{ class: "mr-4" },
    }));
    const __VLS_104 = __VLS_103({
        iconName: "app-create-chat",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.operation.toChat'));
    // @ts-ignore
    [$t, accessToken,];
    var __VLS_99;
}
if (__VLS_ctx.permissionPrecise.overview_embed(__VLS_ctx.id)) {
    let __VLS_107;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.accessToken?.is_active),
    }));
    const __VLS_109 = __VLS_108({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.accessToken?.is_active),
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    let __VLS_112;
    const __VLS_113 = {
        /** @type {typeof __VLS_112.click} */
        onClick: (__VLS_ctx.openDialog),
    };
    const { default: __VLS_114 } = __VLS_110.slots;
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        iconName: "app-export",
        ...{ class: "mr-4" },
    }));
    const __VLS_117 = __VLS_116({
        iconName: "app-export",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.applicationOverview.appInfo.embedInWebsite'));
    // @ts-ignore
    [$t, accessToken, permissionPrecise, id, openDialog,];
    var __VLS_110;
    var __VLS_111;
}
if (__VLS_ctx.permissionPrecise.overview_access(__VLS_ctx.id)) {
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        ...{ 'onClick': {} },
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_125;
    const __VLS_126 = {
        /** @type {typeof __VLS_125.click} */
        onClick: (__VLS_ctx.openLimitDialog),
    };
    const { default: __VLS_127 } = __VLS_123.slots;
    let __VLS_128;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
        iconName: "app-lock",
        ...{ class: "mr-4" },
    }));
    const __VLS_130 = __VLS_129({
        iconName: "app-lock",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.applicationOverview.appInfo.accessControl'));
    // @ts-ignore
    [$t, permissionPrecise, id, openLimitDialog,];
    var __VLS_123;
    var __VLS_124;
}
if (__VLS_ctx.permissionPrecise.overview_display(__VLS_ctx.id)) {
    let __VLS_133;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
        ...{ 'onClick': {} },
    }));
    const __VLS_135 = __VLS_134({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    let __VLS_138;
    const __VLS_139 = {
        /** @type {typeof __VLS_138.click} */
        onClick: (__VLS_ctx.openDisplaySettingDialog),
    };
    const { default: __VLS_140 } = __VLS_136.slots;
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        iconName: "app-setting",
        ...{ class: "mr-4" },
    }));
    const __VLS_143 = __VLS_142({
        iconName: "app-setting",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.applicationOverview.appInfo.displaySetting'));
    // @ts-ignore
    [$t, permissionPrecise, id, openDisplaySettingDialog,];
    var __VLS_136;
    var __VLS_137;
}
// @ts-ignore
[];
var __VLS_33;
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    span: (12),
    ...{ class: "mt-16" },
}));
const __VLS_148 = __VLS_147({
    span: (12),
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_151 } = __VLS_149.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_152;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
    type: "info",
}));
const __VLS_154 = __VLS_153({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
const { default: __VLS_157 } = __VLS_155.slots;
(__VLS_ctx.$t('views.applicationOverview.appInfo.apiAccessCredentials'));
// @ts-ignore
[$t,];
var __VLS_155;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-4 mb-16 url-height" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['url-height']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({}));
const __VLS_160 = __VLS_159({}, ...__VLS_functionalComponentArgsRest(__VLS_159));
const { default: __VLS_163 } = __VLS_161.slots;
(__VLS_ctx.$t('common.fileUpload.document'));
// @ts-ignore
[$t,];
var __VLS_161;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
    ...{ class: "vertical-middle lighter break-all" },
}));
const __VLS_166 = __VLS_165({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
    ...{ class: "vertical-middle lighter break-all" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
const __VLS_170 = {
    /** @type {typeof __VLS_169.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.toUrl(__VLS_ctx.apiUrl);
        // @ts-ignore
        [toUrl, apiUrl,];
    },
};
/** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
const { default: __VLS_171 } = __VLS_167.slots;
(__VLS_ctx.apiUrl);
// @ts-ignore
[apiUrl,];
var __VLS_167;
var __VLS_168;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_172;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
    ...{ style: {} },
}));
const __VLS_174 = __VLS_173({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const { default: __VLS_177 } = __VLS_175.slots;
// @ts-ignore
[];
var __VLS_175;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "vertical-middle lighter break-all ellipsis-1" },
});
/** @type {__VLS_StyleScopedClasses['vertical-middle']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
(__VLS_ctx.baseUrl + __VLS_ctx.id);
let __VLS_178;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
    effect: "dark",
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}));
const __VLS_180 = __VLS_179({
    effect: "dark",
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
const { default: __VLS_183 } = __VLS_181.slots;
let __VLS_184;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}));
const __VLS_186 = __VLS_185({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
let __VLS_189;
const __VLS_190 = {
    /** @type {typeof __VLS_189.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.baseUrl + __VLS_ctx.id);
        // @ts-ignore
        [$t, copyClick, id, id, baseUrl, baseUrl,];
    },
};
const { default: __VLS_191 } = __VLS_187.slots;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    iconName: "app-copy",
}));
const __VLS_194 = __VLS_193({
    iconName: "app-copy",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
// @ts-ignore
[];
var __VLS_187;
var __VLS_188;
// @ts-ignore
[];
var __VLS_181;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.permissionPrecise.overview_api_key(__VLS_ctx.id)) {
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        ...{ 'onClick': {} },
    }));
    const __VLS_199 = __VLS_198({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    let __VLS_202;
    const __VLS_203 = {
        /** @type {typeof __VLS_202.click} */
        onClick: (__VLS_ctx.openAPIKeyDialog),
    };
    const { default: __VLS_204 } = __VLS_200.slots;
    let __VLS_205;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
        ...{ class: "mr-4" },
    }));
    const __VLS_207 = __VLS_206({
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_210 } = __VLS_208.slots;
    let __VLS_211;
    /** @ts-ignore @type { | typeof __VLS_components.Key} */
    Key;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({}));
    const __VLS_213 = __VLS_212({}, ...__VLS_functionalComponentArgsRest(__VLS_212));
    // @ts-ignore
    [permissionPrecise, id, openAPIKeyDialog,];
    var __VLS_208;
    (__VLS_ctx.$t('views.applicationOverview.appInfo.apiKey'));
    // @ts-ignore
    [$t,];
    var __VLS_200;
    var __VLS_201;
}
// @ts-ignore
[];
var __VLS_149;
// @ts-ignore
[];
var __VLS_27;
// @ts-ignore
[];
var __VLS_15;
// @ts-ignore
[];
var __VLS_9;
let __VLS_216;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
    ...{ style: {} },
    ...{ class: "mt-16" },
}));
const __VLS_218 = __VLS_217({
    ...{ style: {} },
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_221 } = __VLS_219.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('home.monitoringStatistics'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_222;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "mr-12 w-180" },
}));
const __VLS_224 = __VLS_223({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.history_day),
    ...{ class: "mr-12 w-180" },
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
let __VLS_227;
const __VLS_228 = {
    /** @type {typeof __VLS_227.change} */
    onChange: (__VLS_ctx.changeDayHandle),
};
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-180']} */ ;
const { default: __VLS_229 } = __VLS_225.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.dayOptions))) {
    let __VLS_230;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_232 = __VLS_231({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    // @ts-ignore
    [$t, history_day, changeDayHandle, dayOptions,];
}
// @ts-ignore
[];
var __VLS_225;
var __VLS_226;
if (__VLS_ctx.history_day === 'other') {
    let __VLS_235;
    /** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
    elDatePicker;
    // @ts-ignore
    const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_237 = __VLS_236({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.daterangeValue),
        type: "daterange",
        startPlaceholder: (__VLS_ctx.$t('home.startDatePlaceholder')),
        endPlaceholder: (__VLS_ctx.$t('home.endDatePlaceholder')),
        format: "YYYY-MM-DD",
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_236));
    let __VLS_240;
    const __VLS_241 = {
        /** @type {typeof __VLS_240.change} */
        onChange: (__VLS_ctx.changeDayRangeHandle),
    };
    var __VLS_238;
    var __VLS_239;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.statisticsLoading) }, null, null);
const __VLS_242 = StatisticsCharts;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
    data: (__VLS_ctx.statisticsData),
    tokenUsage: (__VLS_ctx.tokenUsage),
    topQuestions: (__VLS_ctx.topQuestions),
}));
const __VLS_244 = __VLS_243({
    data: (__VLS_ctx.statisticsData),
    tokenUsage: (__VLS_ctx.tokenUsage),
    topQuestions: (__VLS_ctx.topQuestions),
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
// @ts-ignore
[$t, $t, vLoading, history_day, daterangeValue, changeDayRangeHandle, statisticsLoading, statisticsData, tokenUsage, topQuestions,];
var __VLS_219;
__VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
// @ts-ignore
[];
var __VLS_3;
const __VLS_247 = EmbedDialog;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent1(__VLS_247, new __VLS_247({
    ref: "EmbedDialogRef",
    data: (__VLS_ctx.detail),
    apiInputParams: (__VLS_ctx.mapToUrlParams(__VLS_ctx.apiInputParams)),
}));
const __VLS_249 = __VLS_248({
    ref: "EmbedDialogRef",
    data: (__VLS_ctx.detail),
    apiInputParams: (__VLS_ctx.mapToUrlParams(__VLS_ctx.apiInputParams)),
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
var __VLS_252;
var __VLS_250;
const __VLS_254 = APIKeyDialog;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
    ref: "APIKeyDialogRef",
}));
const __VLS_256 = __VLS_255({
    ref: "APIKeyDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
var __VLS_259;
var __VLS_257;
const __VLS_261 = (__VLS_ctx.currentLimitDialog);
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
    ...{ 'onRefresh': {} },
    ref: "LimitDialogRef",
}));
const __VLS_263 = __VLS_262({
    ...{ 'onRefresh': {} },
    ref: "LimitDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
let __VLS_266;
const __VLS_267 = {
    /** @type {typeof __VLS_266.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_268;
var __VLS_264;
var __VLS_265;
const __VLS_270 = (__VLS_ctx.currentDisplaySettingDialog);
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    ...{ 'onRefresh': {} },
    ref: "DisplaySettingDialogRef",
}));
const __VLS_272 = __VLS_271({
    ...{ 'onRefresh': {} },
    ref: "DisplaySettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
let __VLS_275;
const __VLS_276 = {
    /** @type {typeof __VLS_275.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_277;
var __VLS_273;
var __VLS_274;
// @ts-ignore
var __VLS_253 = __VLS_252, __VLS_260 = __VLS_259, __VLS_269 = __VLS_268, __VLS_278 = __VLS_277;
// @ts-ignore
[detail, mapToUrlParams, apiInputParams, currentLimitDialog, refresh, refresh, currentDisplaySettingDialog,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
