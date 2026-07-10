/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import UserHeader from '@/layout/layout-header/UserHeader.vue';
import SystemHeader from '@/layout/layout-header/SystemHeader.vue';
import AppMain from '@/layout/app-main/index.vue';
import useStore from '@/stores';
import { useRoute } from 'vue-router';
const route = useRoute();
const { theme, user } = useStore();
const isDefaultTheme = computed(() => {
    return theme.isDefaultTheme();
});
const { params: { folderId }, // idisknowledgeID
query: { from }, } = route;
const isShared = computed(() => {
    return ((folderId === 'shared' ||
        from === 'systemShare' ||
        from === 'systemManage' ||
        route.path.includes('resource-management')) &&
        route.fullPath != '/home');
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-layout" },
});
/** @type {__VLS_StyleScopedClasses['app-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-header" },
    ...{ class: (!__VLS_ctx.isDefaultTheme ? 'custom-header' : '') },
});
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
if (__VLS_ctx.user.isExpire()) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
    elAlert;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        title: (__VLS_ctx.$t('layout.isExpire')),
        type: "warning",
        ...{ class: "border-b" },
        showIcon: true,
        closable: (false),
    }));
    const __VLS_2 = __VLS_1({
        title: (__VLS_ctx.$t('layout.isExpire')),
        type: "warning",
        ...{ class: "border-b" },
        showIcon: true,
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
}
if (__VLS_ctx.isShared) {
    const __VLS_5 = SystemHeader || SystemHeader;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
else {
    const __VLS_10 = UserHeader;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}));
    const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-main" },
    ...{ class: (__VLS_ctx.user.isExpire() ? 'isExpire' : '') },
});
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
const __VLS_15 = AppMain;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[isDefaultTheme, user, user, $t, isShared,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
