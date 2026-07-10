/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LDAP from './component/LDAP.vue';
import CAS from './component/CAS.vue';
import OIDC from './component/OIDC.vue';
import SCAN from './component/SCAN.vue';
import OAuth2 from './component/OAuth2.vue';
import Saml2 from "./component/Saml2.vue";
import Setting from './component/Setting.vue';
import { t } from '@/locales';
import useStore from '@/stores';
const { user } = useStore();
const router = useRouter();
const activeName = ref('SETTING');
const tabList = [
    {
        label: t('views.system.setting'),
        name: "SETTING",
        component: Setting,
    },
    {
        label: t('views.system.authentication.ldap.title'),
        name: 'LDAP',
        component: LDAP,
    },
    {
        label: t('views.system.authentication.cas.title'),
        name: 'CAS',
        component: CAS,
    },
    {
        label: t('views.system.authentication.oidc.title'),
        name: 'OIDC',
        component: OIDC,
    },
    {
        label: t('views.system.authentication.oauth2.title'),
        name: 'OAuth2',
        component: OAuth2,
    },
    {
        label: t('views.system.authentication.saml2.title'),
        name: 'SAML2',
        component: Saml2,
    },
    {
        label: t('views.system.authentication.scanTheQRCode.title'),
        name: 'SCAN',
        component: SCAN,
    },
];
onMounted(() => {
    if (user.isExpire()) {
        router.push({ path: `/application` });
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "authentication-setting p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['authentication-setting']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
elBreadcrumb;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}));
const __VLS_2 = __VLS_1({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.t('views.system.subTitle'));
// @ts-ignore
[t,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "ml-4 color-text-primary" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
(__VLS_ctx.$t('views.system.authentication.title'));
// @ts-ignore
[$t,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "mt-4" },
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.tabList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        label: (item.label),
        name: (item.name),
    }));
    const __VLS_26 = __VLS_25({
        label: (item.label),
        name: (item.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_29 } = __VLS_27.slots;
    const __VLS_30 = (item.component);
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({}));
    const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
    // @ts-ignore
    [activeName, tabList,];
    var __VLS_27;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_21;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
