/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { i18n_name, resetUrl } from '@/utils/common';
import { isWorkFlow } from '@/utils/application';
import { dateFormat } from '@/utils/time';
const route = useRoute();
const emit = defineEmits(['refresh']);
const { folder, user } = useStore();
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
const dialogVisible = ref(false);
const checkList = ref([]);
const searchValue = ref('');
const searchData = ref([]);
const applicationList = ref([]);
const apiLoading = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        checkList.value = [];
        searchValue.value = '';
        searchData.value = [];
        applicationList.value = [];
    }
});
watch(searchValue, (val) => {
    if (val) {
        searchData.value = applicationList.value.filter((v) => v.name.includes(val));
    }
    else {
        searchData.value = applicationList.value;
    }
});
function changeHandle() { }
function clearCheck() {
    checkList.value = [];
}
const open = (checked) => {
    checkList.value = checked || [];
    getFolder();
    dialogVisible.value = true;
};
const submitHandle = () => {
    emit('refresh', {
        application_ids: checkList.value,
    });
    dialogVisible.value = false;
};
const refresh = () => {
    searchValue.value = '';
    applicationList.value = [];
    getList();
};
const folderList = ref([]);
const currentFolder = ref({});
const folderLoading = ref(false);
// File
function folderClickHandle(row) {
    if (row.id === currentFolder.value?.id) {
        return;
    }
    currentFolder.value = row;
    getList();
}
function getFolder() {
    const params = {};
    folder.asyncGetFolder('APPLICATION', params, apiType.value, folderLoading).then((res) => {
        folderList.value = res.data;
        currentFolder.value = res.data?.[0] || {};
        getList();
    });
}
function getList() {
    const folder_id = currentFolder.value?.id || user.getWorkspaceId();
    loadSharedApi({
        type: 'application',
        isShared: folder_id === 'share',
        systemType: 'workspace',
    })
        .getAllApplication({
        folder_id: folder_id,
    })
        .then((res) => {
        applicationList.value = res.data;
        applicationList.value = applicationList.value?.filter((item) => item.is_publish && item.id !== route.params.id);
        searchData.value = res.data;
        searchData.value = searchData.value?.filter((item) => item.is_publish && item.id !== route.params.id);
    });
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
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    appendToBody: true,
    ...{ class: "addTool-dialog" },
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    appendToBody: true,
    ...{ class: "addTool-dialog" },
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['addTool-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    const [{ titleId, titleClass }] = __VLS_vSlot(__VLS_7);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        id: (titleId),
        ...{ class: (titleClass) },
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.application.title'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        link: true,
        ...{ class: "mr-24" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        link: true,
        ...{ class: "mr-24" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (__VLS_ctx.refresh),
    };
    /** @type {__VLS_StyleScopedClasses['mr-24']} */ ;
    const { default: __VLS_15 } = __VLS_11.slots;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        size: (18),
        ...{ class: "color-secondary" },
    }));
    const __VLS_18 = __VLS_17({
        size: (18),
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    const { default: __VLS_21 } = __VLS_19.slots;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.Refresh} */
    Refresh;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    // @ts-ignore
    [dialogVisible, $t, refresh,];
    var __VLS_19;
    // @ts-ignore
    [];
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [];
}
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.LayoutContainer | typeof __VLS_components.LayoutContainer} */
LayoutContainer;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    ...{ class: "application-manage" },
}));
const __VLS_29 = __VLS_28({
    ...{ class: "application-manage" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
/** @type {__VLS_StyleScopedClasses['application-manage']} */ ;
const { default: __VLS_32 } = __VLS_30.slots;
{
    const { left: __VLS_33 } = __VLS_30.slots;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.FolderVirtualizedTree} */
    FolderVirtualizedTree;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onHandleNodeClick': {} },
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.currentFolder?.id),
        canOperation: (false),
        treeStyle: ({ height: 'calc(100vh - 240px)' }),
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onHandleNodeClick': {} },
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.currentFolder?.id),
        canOperation: (false),
        treeStyle: ({ height: 'calc(100vh - 240px)' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = {
        /** @type {typeof __VLS_39.handleNodeClick} */
        onHandleNodeClick: (__VLS_ctx.folderClickHandle),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.folderLoading) }, null, null);
    var __VLS_37;
    var __VLS_38;
    // @ts-ignore
    [folderList, currentFolder, folderClickHandle, vLoading, folderLoading,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-bg" },
});
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between p-16 ml-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.currentFolder?.name);
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    modelValue: (__VLS_ctx.searchValue),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    ...{ class: "w-240 mr-8" },
    clearable: true,
}));
const __VLS_43 = __VLS_42({
    modelValue: (__VLS_ctx.searchValue),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    ...{ class: "w-240 mr-8" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
const { default: __VLS_51 } = __VLS_49.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24 pt-0" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
if (__VLS_ctx.searchData.length) {
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        gutter: (12),
    }));
    const __VLS_54 = __VLS_53({
        gutter: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.apiLoading) }, null, null);
    const { default: __VLS_57 } = __VLS_55.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.searchData))) {
        let __VLS_58;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
            span: (12),
            key: (index),
            ...{ class: "mb-16" },
        }));
        const __VLS_60 = __VLS_59({
            span: (12),
            key: (index),
            ...{ class: "mb-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        const { default: __VLS_63 } = __VLS_61.slots;
        let __VLS_64;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
            placement: "bottom-start",
            width: (400),
            popperStyle: "--el-popover-border-radius:8px;--el-popover-padding:16px 16px 0",
            persistent: (false),
            showAfter: (500),
        }));
        const __VLS_66 = __VLS_65({
            placement: "bottom-start",
            width: (400),
            popperStyle: "--el-popover-border-radius:8px;--el-popover-padding:16px 16px 0",
            persistent: (false),
            showAfter: (500),
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        const { default: __VLS_69 } = __VLS_67.slots;
        {
            const { reference: __VLS_70 } = __VLS_67.slots;
            let __VLS_71;
            /** @ts-ignore @type { | typeof __VLS_components.CardCheckbox | typeof __VLS_components.CardCheckbox} */
            CardCheckbox;
            // @ts-ignore
            const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
                ...{ 'onChange': {} },
                valueField: "id",
                data: (item),
                modelValue: (__VLS_ctx.checkList),
            }));
            const __VLS_73 = __VLS_72({
                ...{ 'onChange': {} },
                valueField: "id",
                data: (item),
                modelValue: (__VLS_ctx.checkList),
            }, ...__VLS_functionalComponentArgsRest(__VLS_72));
            let __VLS_76;
            const __VLS_77 = {
                /** @type {typeof __VLS_76.change} */
                onChange: (__VLS_ctx.changeHandle),
            };
            const { default: __VLS_78 } = __VLS_74.slots;
            {
                const { icon: __VLS_79 } = __VLS_74.slots;
                if (item?.icon) {
                    let __VLS_80;
                    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                    elAvatar;
                    // @ts-ignore
                    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                        shape: "square",
                        size: (32),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }));
                    const __VLS_82 = __VLS_81({
                        shape: "square",
                        size: (32),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    const { default: __VLS_85 } = __VLS_83.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: (__VLS_ctx.resetUrl(item?.icon)),
                        alt: "",
                    });
                    // @ts-ignore
                    [$t, currentFolder, vLoading, searchValue, searchData, searchData, apiLoading, checkList, changeHandle, resetUrl,];
                    var __VLS_83;
                }
                else {
                    let __VLS_86;
                    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                    ToolIcon;
                    // @ts-ignore
                    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                        size: (32),
                        type: (item?.tool_type),
                    }));
                    const __VLS_88 = __VLS_87({
                        size: (32),
                        type: (item?.tool_type),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
                }
                // @ts-ignore
                [];
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis cursor ml-12" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
            (item.name);
            // @ts-ignore
            [];
            var __VLS_74;
            var __VLS_75;
            // @ts-ignore
            [];
        }
        {
            const { default: __VLS_91 } = __VLS_67.slots;
            let __VLS_92;
            /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
            CardBox;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
                title: (item.name),
                description: (item.desc),
                ...{ class: "cursor border-none popover-card-box" },
                shadow: "never",
                ...{ style: {} },
            }));
            const __VLS_94 = __VLS_93({
                title: (item.name),
                description: (item.desc),
                ...{ class: "cursor border-none popover-card-box" },
                shadow: "never",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_93));
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-none']} */ ;
            /** @type {__VLS_StyleScopedClasses['popover-card-box']} */ ;
            const { default: __VLS_97 } = __VLS_95.slots;
            {
                const { icon: __VLS_98 } = __VLS_95.slots;
                let __VLS_99;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }));
                const __VLS_101 = __VLS_100({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_100));
                const { default: __VLS_104 } = __VLS_102.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(item?.icon, __VLS_ctx.resetUrl('./favicon.ico'))),
                    alt: "",
                });
                // @ts-ignore
                [resetUrl, resetUrl,];
                var __VLS_102;
                // @ts-ignore
                [];
            }
            {
                const { subTitle: __VLS_105 } = __VLS_95.slots;
                let __VLS_106;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
                    ...{ class: "color-secondary lighter flex align-center" },
                    size: "small",
                }));
                const __VLS_108 = __VLS_107({
                    ...{ class: "color-secondary lighter flex align-center" },
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_107));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                const { default: __VLS_111 } = __VLS_109.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    title: (__VLS_ctx.i18n_name(item.nick_name)),
                    ...{ class: "ellipsis" },
                    ...{ style: {} },
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
                (__VLS_ctx.i18n_name(item.nick_name));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "ml-4 mr-4" },
                });
                /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                (__VLS_ctx.$t('common.createdIn'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.dateFormat(item.create_time));
                // @ts-ignore
                [$t, i18n_name, i18n_name, dateFormat,];
                var __VLS_109;
                // @ts-ignore
                [];
            }
            {
                const { tag: __VLS_112 } = __VLS_95.slots;
                if (__VLS_ctx.isWorkFlow(item.type)) {
                    let __VLS_113;
                    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
                    elTag;
                    // @ts-ignore
                    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
                        size: "small",
                        ...{ class: "warning-tag" },
                    }));
                    const __VLS_115 = __VLS_114({
                        size: "small",
                        ...{ class: "warning-tag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
                    /** @type {__VLS_StyleScopedClasses['warning-tag']} */ ;
                    const { default: __VLS_118 } = __VLS_116.slots;
                    (__VLS_ctx.$t('views.application.senior'));
                    // @ts-ignore
                    [$t, isWorkFlow,];
                    var __VLS_116;
                }
                else {
                    let __VLS_119;
                    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
                    elTag;
                    // @ts-ignore
                    const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
                        size: "small",
                        ...{ class: "blue-tag" },
                    }));
                    const __VLS_121 = __VLS_120({
                        size: "small",
                        ...{ class: "blue-tag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
                    /** @type {__VLS_StyleScopedClasses['blue-tag']} */ ;
                    const { default: __VLS_124 } = __VLS_122.slots;
                    (__VLS_ctx.$t('views.application.simple'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_122;
                }
                // @ts-ignore
                [];
            }
            {
                const { footer: __VLS_125 } = __VLS_95.slots;
                if (item.is_publish) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex align-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                    let __VLS_126;
                    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                    elIcon;
                    // @ts-ignore
                    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
                        ...{ class: "color-success mr-8" },
                        ...{ style: {} },
                    }));
                    const __VLS_128 = __VLS_127({
                        ...{ class: "color-success mr-8" },
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
                    /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    const { default: __VLS_131 } = __VLS_129.slots;
                    let __VLS_132;
                    /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
                    SuccessFilled;
                    // @ts-ignore
                    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({}));
                    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
                    // @ts-ignore
                    [];
                    var __VLS_129;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "color-secondary" },
                    });
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.status.published'));
                    let __VLS_137;
                    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
                    elDivider;
                    // @ts-ignore
                    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
                        direction: "vertical",
                    }));
                    const __VLS_139 = __VLS_138({
                        direction: "vertical",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
                    let __VLS_142;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
                        iconName: "app-clock",
                        ...{ class: "color-secondary mr-8" },
                    }));
                    const __VLS_144 = __VLS_143({
                        iconName: "app-clock",
                        ...{ class: "color-secondary mr-8" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "color-secondary" },
                    });
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.dateFormat(item.update_time));
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex align-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                    let __VLS_147;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
                        iconName: "app-disabled",
                        ...{ class: "color-secondary mr-8" },
                    }));
                    const __VLS_149 = __VLS_148({
                        iconName: "app-disabled",
                        ...{ class: "color-secondary mr-8" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "color-secondary" },
                    });
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.status.unpublished'));
                }
                // @ts-ignore
                [$t, $t, dateFormat,];
            }
            // @ts-ignore
            [];
            var __VLS_95;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_67;
        // @ts-ignore
        [];
        var __VLS_61;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_55;
}
else {
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_154 = __VLS_153({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
}
// @ts-ignore
[$t,];
var __VLS_49;
// @ts-ignore
[];
var __VLS_30;
{
    const { footer: __VLS_157 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.checkList.length > 0) {
        let __VLS_158;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
            type: "info",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_160 = __VLS_159({
            type: "info",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_159));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_163 } = __VLS_161.slots;
        (__VLS_ctx.$t('common.selected'));
        (__VLS_ctx.checkList.length);
        // @ts-ignore
        [$t, checkList, checkList,];
        var __VLS_161;
    }
    if (__VLS_ctx.checkList.length > 0) {
        let __VLS_164;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_166 = __VLS_165({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        let __VLS_169;
        const __VLS_170 = {
            /** @type {typeof __VLS_169.click} */
            onClick: (__VLS_ctx.clearCheck),
        };
        const { default: __VLS_171 } = __VLS_167.slots;
        (__VLS_ctx.$t('common.clear'));
        // @ts-ignore
        [$t, checkList, clearCheck,];
        var __VLS_167;
        var __VLS_168;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        ...{ 'onClick': {} },
    }));
    const __VLS_174 = __VLS_173({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    let __VLS_177;
    const __VLS_178 = {
        /** @type {typeof __VLS_177.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_179 } = __VLS_175.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_175;
    var __VLS_176;
    let __VLS_180;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_182 = __VLS_181({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    let __VLS_185;
    const __VLS_186 = {
        /** @type {typeof __VLS_185.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_187 } = __VLS_183.slots;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t, submitHandle,];
    var __VLS_183;
    var __VLS_184;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
