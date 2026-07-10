/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import LDAP from './component/LDAP.vue';
import CAS from './component/CAS.vue';
import OIDC from './component/OIDC.vue';
import SCAN from './component/SCAN.vue';
import OAuth2 from './component/OAuth2.vue';
import { t } from '@/locales';
const activeName = ref('LDAP');
const tabList = [
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
        label: t('views.system.authentication.scanTheQRCode.title'),
        name: 'SCAN',
        component: SCAN,
    },
];
onMounted(() => {
    // if (user.isExpire()) {
    //   router.push({ path: `/application` })
    // }
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
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.system.authentication.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "mt-4" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeName),
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.tabList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        label: (item.label),
        name: (item.name),
    }));
    const __VLS_8 = __VLS_7({
        label: (item.label),
        name: (item.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    const __VLS_12 = (item.component);
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    // @ts-ignore
    [$t, activeName, tabList,];
    var __VLS_9;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
