/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed } from 'vue';
import { onBeforeRouteLeave, useRouter, useRoute } from 'vue-router';
import { resetUrl } from '@/utils/common';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
import permissionMap from '@/permission';
const { common, folder, user } = useStore();
const route = useRoute();
const router = useRouter();
const { meta: { activeMenu }, params: { id, folderId }, query: { isShared }, } = route;
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
const folderType = computed(() => {
    if (route.path.includes('application')) {
        return 'application';
    }
    if (route.path.includes('knowledge')) {
        return 'knowledge';
    }
    else {
        return 'application';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap[folderType.value]['workspace'];
});
const shareDisabled = computed(() => {
    return folderId === 'share' || isShared === 'true';
});
onBeforeRouteLeave((to, from) => {
    common.saveBreadcrumb(null);
});
const loading = ref(false);
const current = ref(null);
const isApplication = computed(() => {
    return activeMenu.includes('application');
});
const isKnowledge = computed(() => {
    return activeMenu.includes('knowledge');
});
const toBackPath = computed(() => {
    if (route.path.includes('shared')) {
        return '/system/shared' + activeMenu;
    }
    else if (route.path.includes('resource-management')) {
        return '/system/resource-management' + activeMenu;
    }
    else {
        return activeMenu;
    }
});
function getKnowledgeDetail() {
    loading.value = true;
    loadSharedApi({ type: 'knowledge', isShared: shareDisabled.value, systemType: apiType.value })
        .getKnowledgeDetail(id)
        .then((res) => {
        current.value = res.data;
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
function getApplicationDetail() {
    loading.value = true;
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getApplicationDetail(id)
        .then((res) => {
        current.value = res.data;
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
function toBack() {
    if (isKnowledge.value) {
        folder.setCurrentFolder({
            id: permissionPrecise.value.folderRead(folderId) ? folderId : user.getWorkspaceId(),
        });
    }
    else if (isApplication.value) {
        folder.setCurrentFolder({
            id: permissionPrecise.value.folderRead(current.value.folder)
                ? current.value.folder
                : user.getWorkspaceId(),
        });
    }
    router.push({ path: toBackPath.value });
}
onMounted(() => {
    if (isKnowledge.value) {
        getKnowledgeDetail();
    }
    else if (isApplication.value) {
        getApplicationDetail();
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
    ...{ class: "breadcrumb ml-4 mt-4 mb-12 flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['breadcrumb']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button'] | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button']} */
backButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.toBack),
};
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (__VLS_ctx.isApplication) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-8" },
    }));
    const __VLS_9 = __VLS_8({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.resetUrl(__VLS_ctx.current?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
        alt: "",
    });
    // @ts-ignore
    [toBack, isApplication, resetUrl, resetUrl, current,];
    var __VLS_10;
}
else if (__VLS_ctx.isKnowledge) {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
    KnowledgeIcon;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        type: (__VLS_ctx.current?.type),
        ...{ class: "mr-8" },
        size: (24),
    }));
    const __VLS_15 = __VLS_14({
        type: (__VLS_ctx.current?.type),
        ...{ class: "mr-8" },
        size: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ellipsis" },
    title: (__VLS_ctx.current?.name),
});
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.current?.name);
// @ts-ignore
[current, current, current, isKnowledge,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
