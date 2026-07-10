/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { uniqueArray } from '@/utils/array';
import { numberFormat, i18n_name } from '@/utils/common';
import { dateFormat } from '@/utils/time';
const route = useRoute();
const props = defineProps({
    data: {
        type: (Array),
        default: () => [],
    },
    loading: Boolean,
});
const emit = defineEmits(['addData']);
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
const currentEmbedding = ref('');
const searchValue = ref('');
const searchData = ref([]);
const knowledgeList = ref([]);
const apiLoading = ref(false);
const filterData = computed(() => {
    return currentEmbedding.value
        ? searchData.value.filter((v) => v.embedding_model_id === currentEmbedding.value)
        : searchData.value;
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        checkList.value = [];
        currentEmbedding.value = '';
        searchValue.value = '';
        searchData.value = [];
        knowledgeList.value = [];
    }
});
watch(searchValue, (val) => {
    if (val) {
        searchData.value = knowledgeList.value.filter((v) => v.name.includes(val) && v.folder_id === currentFolder.value?.id);
    }
    else {
        searchData.value = knowledgeList.value.filter((v) => v.folder_id === currentFolder.value?.id);
    }
});
function changeHandle() {
    if (checkList.value.length > 0) {
        currentEmbedding.value = knowledgeList.value?.find((v) => v.id === checkList.value[0])?.embedding_model_id;
    }
    else if (checkList.value.length === 0) {
        currentEmbedding.value = '';
    }
}
function clearCheck() {
    checkList.value = [];
    currentEmbedding.value = '';
}
const open = (checked) => {
    checkList.value = checked;
    getFolder();
    if (checkList.value.length > 0) {
        currentEmbedding.value = props.data.filter((v) => v.id === checkList.value[0])[0].embedding_model_id;
    }
    dialogVisible.value = true;
};
const submitHandle = () => {
    emit('addData', knowledgeList.value.filter((item) => checkList.value.includes(item.id)));
    dialogVisible.value = false;
};
const refresh = () => {
    searchValue.value = '';
    knowledgeList.value = [];
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
    folder.asyncGetFolder('KNOWLEDGE', params, apiType.value, folderLoading).then((res) => {
        folderList.value = res.data;
        currentFolder.value = res.data?.[0] || {};
        getList();
    });
}
function getList() {
    const folder_id = currentFolder.value?.id || user.getWorkspaceId();
    loadSharedApi({
        type: 'knowledge',
        isShared: folder_id === 'share',
        systemType: apiType.value,
    })
        .getKnowledgeList({ folder_id }, apiLoading)
        .then((res) => {
        knowledgeList.value = uniqueArray([...knowledgeList.value, ...res.data], 'id');
        searchData.value = res.data;
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
    title: (__VLS_ctx.$t('views.application.dialog.addKnowledge')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    appendToBody: true,
    ...{ class: "addKnowledge-dialog" },
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.application.dialog.addKnowledge')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
    appendToBody: true,
    ...{ class: "addKnowledge-dialog" },
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['addKnowledge-dialog']} */ ;
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
    (__VLS_ctx.$t('views.application.dialog.addKnowledge'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        type: "info",
    }));
    const __VLS_10 = __VLS_9({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const { default: __VLS_13 } = __VLS_11.slots;
    (__VLS_ctx.$t('views.application.dialog.addKnowledgePlaceholder'));
    // @ts-ignore
    [$t, $t, $t, dialogVisible,];
    var __VLS_11;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ 'onClick': {} },
        link: true,
        ...{ class: "mr-24" },
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        link: true,
        ...{ class: "mr-24" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_19;
    const __VLS_20 = {
        /** @type {typeof __VLS_19.click} */
        onClick: (__VLS_ctx.refresh),
    };
    /** @type {__VLS_StyleScopedClasses['mr-24']} */ ;
    const { default: __VLS_21 } = __VLS_17.slots;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        size: (18),
    }));
    const __VLS_24 = __VLS_23({
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    const { default: __VLS_27 } = __VLS_25.slots;
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.Refresh} */
    Refresh;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    // @ts-ignore
    [refresh,];
    var __VLS_25;
    // @ts-ignore
    [];
    var __VLS_17;
    var __VLS_18;
    // @ts-ignore
    [];
}
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.LayoutContainer | typeof __VLS_components.LayoutContainer} */
LayoutContainer;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    ...{ class: "application-manage" },
}));
const __VLS_35 = __VLS_34({
    ...{ class: "application-manage" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
/** @type {__VLS_StyleScopedClasses['application-manage']} */ ;
const { default: __VLS_38 } = __VLS_36.slots;
{
    const { left: __VLS_39 } = __VLS_36.slots;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.FolderVirtualizedTree} */
    FolderVirtualizedTree;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onHandleNodeClick': {} },
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.currentFolder?.id),
        canOperation: (false),
        showShared: true,
        shareTitle: (__VLS_ctx.$t('views.shared.shared_knowledge')),
        treeStyle: ({ height: 'calc(100vh - 240px)' }),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onHandleNodeClick': {} },
        data: (__VLS_ctx.folderList),
        currentNodeKey: (__VLS_ctx.currentFolder?.id),
        canOperation: (false),
        showShared: true,
        shareTitle: (__VLS_ctx.$t('views.shared.shared_knowledge')),
        treeStyle: ({ height: 'calc(100vh - 240px)' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        /** @type {typeof __VLS_45.handleNodeClick} */
        onHandleNodeClick: (__VLS_ctx.folderClickHandle),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.folderLoading) }, null, null);
    var __VLS_43;
    var __VLS_44;
    // @ts-ignore
    [$t, folderList, currentFolder, folderClickHandle, vLoading, folderLoading,];
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
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    modelValue: (__VLS_ctx.searchValue),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    ...{ class: "w-240 mr-8" },
    clearable: true,
}));
const __VLS_49 = __VLS_48({
    modelValue: (__VLS_ctx.searchValue),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    ...{ class: "w-240 mr-8" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({}));
const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const { default: __VLS_57 } = __VLS_55.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24 pt-0" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
if (__VLS_ctx.filterData.length) {
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        gutter: (12),
    }));
    const __VLS_60 = __VLS_59({
        gutter: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading || __VLS_ctx.apiLoading) }, null, null);
    const { default: __VLS_63 } = __VLS_61.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.filterData.filter((v) => v.resource_type !== 'folder')))) {
        let __VLS_64;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
            span: (12),
            key: (index),
            ...{ class: "mb-16" },
        }));
        const __VLS_66 = __VLS_65({
            span: (12),
            key: (index),
            ...{ class: "mb-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        const { default: __VLS_69 } = __VLS_67.slots;
        let __VLS_70;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
            placement: "bottom-start",
            width: (400),
            popperStyle: "--el-popover-border-radius:8px;--el-popover-padding:16px 16px 0",
            persistent: (false),
            showAfter: (500),
        }));
        const __VLS_72 = __VLS_71({
            placement: "bottom-start",
            width: (400),
            popperStyle: "--el-popover-border-radius:8px;--el-popover-padding:16px 16px 0",
            persistent: (false),
            showAfter: (500),
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        const { default: __VLS_75 } = __VLS_73.slots;
        {
            const { reference: __VLS_76 } = __VLS_73.slots;
            let __VLS_77;
            /** @ts-ignore @type { | typeof __VLS_components.CardCheckbox | typeof __VLS_components.CardCheckbox} */
            CardCheckbox;
            // @ts-ignore
            const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
                ...{ 'onChange': {} },
                valueField: "id",
                data: (item),
                modelValue: (__VLS_ctx.checkList),
            }));
            const __VLS_79 = __VLS_78({
                ...{ 'onChange': {} },
                valueField: "id",
                data: (item),
                modelValue: (__VLS_ctx.checkList),
            }, ...__VLS_functionalComponentArgsRest(__VLS_78));
            let __VLS_82;
            const __VLS_83 = {
                /** @type {typeof __VLS_82.change} */
                onChange: (__VLS_ctx.changeHandle),
            };
            const { default: __VLS_84 } = __VLS_80.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis cursor ml-12" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
            (item.name);
            // @ts-ignore
            [$t, currentFolder, vLoading, searchValue, filterData, filterData, loading, apiLoading, checkList, changeHandle,];
            var __VLS_80;
            var __VLS_81;
            // @ts-ignore
            [];
        }
        {
            const { default: __VLS_85 } = __VLS_73.slots;
            let __VLS_86;
            /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
            CardBox;
            // @ts-ignore
            const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                title: (item.name),
                description: (item.desc),
                ...{ class: "cursor border-none popover-card-box" },
                shadow: "never",
                ...{ style: {} },
            }));
            const __VLS_88 = __VLS_87({
                title: (item.name),
                description: (item.desc),
                ...{ class: "cursor border-none popover-card-box" },
                shadow: "never",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_87));
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-none']} */ ;
            /** @type {__VLS_StyleScopedClasses['popover-card-box']} */ ;
            const { default: __VLS_91 } = __VLS_89.slots;
            {
                const { icon: __VLS_92 } = __VLS_89.slots;
                let __VLS_93;
                /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
                KnowledgeIcon;
                // @ts-ignore
                const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
                    type: (item.type),
                }));
                const __VLS_95 = __VLS_94({
                    type: (item.type),
                }, ...__VLS_functionalComponentArgsRest(__VLS_94));
                // @ts-ignore
                [];
            }
            {
                const { subTitle: __VLS_98 } = __VLS_89.slots;
                let __VLS_99;
                /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
                elText;
                // @ts-ignore
                const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
                    ...{ class: "color-secondary lighter flex align-center" },
                    size: "small",
                }));
                const __VLS_101 = __VLS_100({
                    ...{ class: "color-secondary lighter flex align-center" },
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_100));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                const { default: __VLS_104 } = __VLS_102.slots;
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
                var __VLS_102;
                // @ts-ignore
                [];
            }
            {
                const { footer: __VLS_105 } = __VLS_89.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "footer-content flex-between" },
                });
                /** @type {__VLS_StyleScopedClasses['footer-content']} */ ;
                /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "bold mr-4" },
                });
                /** @type {__VLS_StyleScopedClasses['bold']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                (item?.document_count || 0);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.knowledge.document_count'));
                let __VLS_106;
                /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
                elDivider;
                // @ts-ignore
                const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
                    direction: "vertical",
                }));
                const __VLS_108 = __VLS_107({
                    direction: "vertical",
                }, ...__VLS_functionalComponentArgsRest(__VLS_107));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "bold mr-4" },
                });
                /** @type {__VLS_StyleScopedClasses['bold']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                (__VLS_ctx.numberFormat(item?.char_length) || 0);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.character'));
                // @ts-ignore
                [$t, $t, numberFormat,];
            }
            // @ts-ignore
            [];
            var __VLS_89;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_73;
        // @ts-ignore
        [];
        var __VLS_67;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_61;
}
else {
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_113 = __VLS_112({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
}
// @ts-ignore
[$t,];
var __VLS_55;
// @ts-ignore
[];
var __VLS_36;
{
    const { footer: __VLS_116 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.checkList.length > 0) {
        let __VLS_117;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_119 = __VLS_118({
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_122 } = __VLS_120.slots;
        (__VLS_ctx.$t('common.selected'));
        (__VLS_ctx.checkList.length);
        // @ts-ignore
        [$t, checkList, checkList,];
        var __VLS_120;
    }
    if (__VLS_ctx.checkList.length > 0) {
        let __VLS_123;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_125 = __VLS_124({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        let __VLS_128;
        const __VLS_129 = {
            /** @type {typeof __VLS_128.click} */
            onClick: (__VLS_ctx.clearCheck),
        };
        const { default: __VLS_130 } = __VLS_126.slots;
        (__VLS_ctx.$t('common.clear'));
        // @ts-ignore
        [$t, checkList, clearCheck,];
        var __VLS_126;
        var __VLS_127;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_131;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
        ...{ 'onClick': {} },
    }));
    const __VLS_133 = __VLS_132({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    let __VLS_136;
    const __VLS_137 = {
        /** @type {typeof __VLS_136.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_138 } = __VLS_134.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_134;
    var __VLS_135;
    let __VLS_139;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_141 = __VLS_140({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    let __VLS_144;
    const __VLS_145 = {
        /** @type {typeof __VLS_144.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_146 } = __VLS_142.slots;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t, submitHandle,];
    var __VLS_142;
    var __VLS_143;
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
    props: {
        data: {
            type: (Array),
            default: () => [],
        },
        loading: Boolean,
    },
});
export default {};
