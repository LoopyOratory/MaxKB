/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, computed } from 'vue';
import KnowledgeListContainer from '@/views/knowledge/component/KnowledgeListContainer.vue';
import { SourceTypeEnum } from '@/enums/common';
import permissionMap from '@/permission';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
const route = useRoute();
const { folder, knowledge } = useStore();
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
    return permissionMap['knowledge'][apiType.value];
});
const loading = ref(false);
const folderList = ref([]);
function getFolder(bool) {
    const params = {};
    folder
        .asyncGetFolder(SourceTypeEnum.KNOWLEDGE, params, apiType.value, loading)
        .then((res) => {
        folderList.value = res.data;
        if (bool) {
            // InitializeRefresh
            folder.setCurrentFolder(res.data?.[0] || {});
        }
    });
}
function folderClickHandle(row) {
    if (row.id === folder.currentFolder?.id) {
        return;
    }
    folder.setCurrentFolder(row);
    knowledge.setKnowledgeList([]);
}
function refreshFolder() {
    getFolder();
}
onMounted(() => {
    getFolder(folder.currentFolder?.id ? false : true);
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
    resizable: true,
    ...{ class: "knowledge-manage" },
}));
const __VLS_2 = __VLS_1({
    showCollapse: true,
    resizable: true,
    ...{ class: "knowledge-manage" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['knowledge-manage']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { left: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "p-12-16 pb-0 mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    (__VLS_ctx.$t('views.knowledge.title'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.FolderVirtualizedTree} */
    FolderVirtualizedTree;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onHandleNodeClick': {} },
        ...{ 'onRefreshTree': {} },
        source: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        shareTitle: (__VLS_ctx.$t('views.shared.shared_knowledge')),
        showShared: (__VLS_ctx.permissionPrecise['is_share']()),
        draggable: (true),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onHandleNodeClick': {} },
        ...{ 'onRefreshTree': {} },
        source: (__VLS_ctx.SourceTypeEnum.KNOWLEDGE),
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        shareTitle: (__VLS_ctx.$t('views.shared.shared_knowledge')),
        showShared: (__VLS_ctx.permissionPrecise['is_share']()),
        draggable: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.handleNodeClick} */
        onHandleNodeClick: (__VLS_ctx.folderClickHandle),
    };
    const __VLS_15 = {
        /** @type {typeof __VLS_13.refreshTree} */
        onRefreshTree: (__VLS_ctx.refreshFolder),
    };
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [$t, $t, SourceTypeEnum, folderList, folder, permissionPrecise, folderClickHandle, refreshFolder,];
}
const __VLS_16 = KnowledgeListContainer || KnowledgeListContainer;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ 'onRefreshFolder': {} },
}));
const __VLS_18 = __VLS_17({
    ...{ 'onRefreshFolder': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_21;
const __VLS_22 = {
    /** @type {typeof __VLS_21.refreshFolder} */
    onRefreshFolder: (__VLS_ctx.refreshFolder),
};
const { default: __VLS_23 } = __VLS_19.slots;
{
    const { header: __VLS_24 } = __VLS_19.slots;
    if (__VLS_ctx.folder.currentFolder?.id === 'share') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
        (__VLS_ctx.$t('views.shared.shared_knowledge'));
    }
    else {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.FolderBreadcrumb} */
        FolderBreadcrumb;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            ...{ 'onClick': {} },
            folderList: (__VLS_ctx.folderList),
        }));
        const __VLS_27 = __VLS_26({
            ...{ 'onClick': {} },
            folderList: (__VLS_ctx.folderList),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        let __VLS_30;
        const __VLS_31 = {
            /** @type {typeof __VLS_30.click} */
            onClick: (__VLS_ctx.folderClickHandle),
        };
        var __VLS_28;
        var __VLS_29;
    }
    // @ts-ignore
    [$t, folderList, folder, folderClickHandle, refreshFolder,];
}
// @ts-ignore
[];
var __VLS_19;
var __VLS_20;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
