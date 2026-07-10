/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, computed } from 'vue';
import ToolListContainer from '@/views/tool/component/ToolListContainer.vue';
import { SourceTypeEnum } from '@/enums/common';
import permissionMap from '@/permission';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
const route = useRoute();
const { folder, tool } = useStore();
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
    return permissionMap['tool'][apiType.value];
});
const loading = ref(false);
const toolType = ref('');
const folderList = ref([]);
function getFolder(bool) {
    const params = {};
    folder.asyncGetFolder(SourceTypeEnum.TOOL, params, apiType.value, loading).then((res) => {
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
    tool.setToolList([]);
}
function radioChange() {
    tool.setToolType(toolType.value);
}
function refreshFolder() {
    getFolder();
}
onMounted(() => {
    getFolder(folder.currentFolder?.id ? false : true);
    radioChange();
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
    ...{ class: "tool-manage" },
}));
const __VLS_2 = __VLS_1({
    showCollapse: true,
    resizable: true,
    ...{ class: "tool-manage" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['tool-manage']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { left: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "p-12-16 pb-0 mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    (__VLS_ctx.$t('views.tool.title'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.FolderVirtualizedTree} */
    FolderVirtualizedTree;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onHandleNodeClick': {} },
        ...{ 'onRefreshTree': {} },
        source: (__VLS_ctx.SourceTypeEnum.TOOL),
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        shareTitle: (__VLS_ctx.$t('views.shared.shared_tool')),
        showShared: (__VLS_ctx.permissionPrecise['is_share']()),
        draggable: (true),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onHandleNodeClick': {} },
        ...{ 'onRefreshTree': {} },
        source: (__VLS_ctx.SourceTypeEnum.TOOL),
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.folder.currentFolder?.id),
        shareTitle: (__VLS_ctx.$t('views.shared.shared_tool')),
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
const __VLS_16 = ToolListContainer || ToolListContainer;
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
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        wrap: true,
    }));
    const __VLS_27 = __VLS_26({
        wrap: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const { default: __VLS_30 } = __VLS_28.slots;
    if (__VLS_ctx.folder.currentFolder?.id === 'share') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
        (__VLS_ctx.$t('views.shared.shared_tool'));
    }
    else {
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.FolderBreadcrumb} */
        FolderBreadcrumb;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            ...{ 'onClick': {} },
            folderList: (__VLS_ctx.folderList),
        }));
        const __VLS_33 = __VLS_32({
            ...{ 'onClick': {} },
            folderList: (__VLS_ctx.folderList),
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        let __VLS_36;
        const __VLS_37 = {
            /** @type {typeof __VLS_36.click} */
            onClick: (__VLS_ctx.folderClickHandle),
        };
        var __VLS_34;
        var __VLS_35;
    }
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        direction: "vertical",
    }));
    const __VLS_40 = __VLS_39({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.toolType),
        ...{ style: {} },
        emptyValues: ([null, undefined]),
        valueOnClear: (null),
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.toolType),
        ...{ style: {} },
        emptyValues: ([null, undefined]),
        valueOnClear: (null),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.change} */
        onChange: (__VLS_ctx.radioChange),
    };
    const { default: __VLS_50 } = __VLS_46.slots;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        label: (__VLS_ctx.$t('common.status.all')),
        value: "",
    }));
    const __VLS_53 = __VLS_52({
        label: (__VLS_ctx.$t('common.status.all')),
        value: "",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        label: (__VLS_ctx.$t('views.tool.title')),
        value: "CUSTOM",
    }));
    const __VLS_58 = __VLS_57({
        label: (__VLS_ctx.$t('views.tool.title')),
        value: "CUSTOM",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        label: "Skills",
        value: "SKILL",
    }));
    const __VLS_63 = __VLS_62({
        label: "Skills",
        value: "SKILL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        label: (__VLS_ctx.$t('workflow.workflow')),
        value: "WORKFLOW",
    }));
    const __VLS_68 = __VLS_67({
        label: (__VLS_ctx.$t('workflow.workflow')),
        value: "WORKFLOW",
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        label: "MCP",
        value: "MCP",
    }));
    const __VLS_73 = __VLS_72({
        label: "MCP",
        value: "MCP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        label: (__VLS_ctx.$t('views.tool.dataSource.title')),
        value: "DATA_SOURCE",
    }));
    const __VLS_78 = __VLS_77({
        label: (__VLS_ctx.$t('views.tool.dataSource.title')),
        value: "DATA_SOURCE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    // @ts-ignore
    [$t, $t, $t, $t, $t, folderList, folder, folderClickHandle, refreshFolder, toolType, radioChange,];
    var __VLS_46;
    var __VLS_47;
    // @ts-ignore
    [];
    var __VLS_28;
    // @ts-ignore
    [];
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
