/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import ToolStoreApi from '@/api/tool/store';
import { t } from '@/locales';
import ToolCard from './ToolCard.vue';
import { MsgSuccess } from '@/utils/message';
import InternalDescDrawer from './InternalDescDrawer.vue';
import AddInternalToolDialog from './AddInternalToolDialog.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import useStore from '@/stores';
const { user } = useStore();
const props = defineProps({
    apiType: {
        type: String,
        default: 'workspace',
    },
});
const emit = defineEmits(['refresh']);
const dialogVisible = ref(false);
const loading = ref(false);
const searchValue = ref('');
const folderId = ref('');
const defaultCategories = ref([
    {
        id: 'web_search',
        title: t('views.tool.toolStore.webSearch'),
        tools: [],
    },
    {
        id: 'database_search',
        title: t('views.tool.toolStore.databaseQuery'),
        tools: [],
    },
]);
const categories = ref([...defaultCategories.value]);
const filterList = ref(null);
function getSubTitle(tool) {
    return categories.value.find((i) => i.id === tool.label)?.title ?? '';
}
function open(id) {
    folderId.value = id;
    filterList.value = null;
    dialogVisible.value = true;
    getList();
}
async function getList() {
    filterList.value = null;
    const [v1, v2] = await Promise.all([getInternalToolList(), getStoreToolList()]);
    const merged = [...v1, ...v2].reduce((acc, category) => {
        const existing = acc.find((item) => item.id === category.id);
        if (existing) {
            existing.tools = [...existing.tools, ...category.tools];
        }
        else {
            acc.push({ ...category });
        }
        return acc;
    }, []);
    categories.value = merged.filter((item) => item.tools.length > 0);
}
async function getInternalToolList() {
    try {
        const categories = defaultCategories.value;
        const res = await ToolStoreApi.getInternalToolList({ name: searchValue.value }, loading);
        if (searchValue.value.length) {
            filterList.value = [...res.data, ...(filterList.value || [])];
        }
        else {
            filterList.value = null;
            categories.forEach((category) => {
                // if (category.id === 'recommend') {
                //   category.tools = res.data
                // } else {
                category.tools = res.data.filter((tool) => tool.label === category.id);
                // }
            });
        }
        return categories;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
async function getStoreToolList() {
    try {
        const res = await ToolStoreApi.getStoreToolList({ name: searchValue.value }, loading);
        const tags = res.data.additionalProperties.tags;
        const storeTools = res.data.apps;
        let categories = [];
        //
        storeTools.forEach((tool) => {
            tool.desc = tool.description;
        });
        if (searchValue.value.length) {
            filterList.value = [...res.data.apps, ...(filterList.value || [])];
        }
        else {
            filterList.value = null;
            categories = tags.map((tag) => ({
                id: tag.key,
                title: tag.name, // Internationalization
                tools: storeTools.filter((tool) => tool.label === tag.key),
            }));
        }
        return categories;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
const handleClick = (e) => {
    e.preventDefault();
};
const internalDescDrawerRef = ref();
async function handleDetail(tool) {
    console.log(tool);
    if (tool.tool_type === 'INTERNAL') {
        const index = tool.icon.replace('icon.png', 'detail.md');
        const response = await fetch(index);
        const content = await response.text();
        internalDescDrawerRef.value?.open(content, tool);
    }
    else {
        internalDescDrawerRef.value?.open(tool.readMe, tool);
    }
}
const addInternalToolDialogRef = ref();
function handleOpenAdd(data, isEdit) {
    addInternalToolDialogRef.value?.open(data, isEdit);
}
const addLoading = ref(false);
async function handleAdd(tool) {
    if (tool.tool_type === 'INTERNAL') {
        await handleInternalAdd(tool);
    }
    else if (tool.label === 'workflow_template') {
        await handleTemplateAdd(tool);
    }
    else {
        await handleStoreAdd(tool);
    }
}
async function handleInternalAdd(tool) {
    try {
        await loadSharedApi({ type: 'tool', systemType: props.apiType })
            .addInternalTool(tool.id, { name: tool.name, folder_id: folderId.value }, addLoading)
            .then(() => {
            return user.profile();
        });
        emit('refresh');
        MsgSuccess(t('common.addSuccess'));
        dialogVisible.value = false;
    }
    catch (error) {
        console.error(error);
    }
}
async function handleStoreAdd(tool) {
    try {
        const obj = {
            name: tool.name,
            folder_id: folderId.value,
            download_url: tool.downloadUrl,
            download_callback_url: tool.downloadCallbackUrl,
            icon: tool.icon,
            versions: tool.versions,
            label: tool.label,
        };
        await loadSharedApi({ type: 'tool', systemType: props.apiType })
            .addStoreTool(tool.id, obj, addLoading)
            .then(() => {
            return user.profile();
        });
        emit('refresh');
        MsgSuccess(t('common.addSuccess'));
        dialogVisible.value = false;
    }
    catch (error) {
        console.error(error);
    }
}
async function handleTemplateAdd(tool) {
    try {
        const obj = {
            name: tool.name,
            folder_id: folderId.value,
            code: '{}',
            work_flow_template: tool,
        };
        await loadSharedApi({ type: 'tool', systemType: props.apiType })
            .postTool(obj)
            .then((res) => {
            MsgSuccess(t('common.addSuccess'));
            emit('refresh');
            return user.profile().then(() => {
                dialogVisible.value = false;
            });
        })
            .finally(() => {
            loading.value = false;
        });
    }
    catch (error) {
        console.error(error);
    }
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
    width: "1200",
    appendToBody: true,
    ...{ class: "tool-store-dialog" },
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1200",
    appendToBody: true,
    ...{ class: "tool-store-dialog" },
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['tool-store-dialog']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { header: __VLS_6 } = __VLS_3.slots;
    const [{ titleId }] = __VLS_vSlot(__VLS_6);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-header flex-between mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-header']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        id: (titleId),
        ...{ class: "medium w-240 mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-240']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.tool.toolStore.title'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchValue),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        ...{ class: "w-240 mr-8" },
        clearable: true,
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchValue),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        ...{ class: "w-240 mr-8" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_12;
    const __VLS_13 = {
        /** @type {typeof __VLS_12.change} */
        onChange: (__VLS_ctx.getList),
    };
    /** @type {__VLS_StyleScopedClasses['w-240']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    var __VLS_10;
    var __VLS_11;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        direction: "vertical",
    }));
    const __VLS_16 = __VLS_15({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    // @ts-ignore
    [dialogVisible, $t, $t, searchValue, getList,];
}
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.LayoutContainer | typeof __VLS_components.LayoutContainer} */
LayoutContainer;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    minLeftWidth: (204),
}));
const __VLS_21 = __VLS_20({
    minLeftWidth: (204),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_24 } = __VLS_22.slots;
{
    const { left: __VLS_25 } = __VLS_22.slots;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elAnchor | typeof __VLS_components.ElAnchor | typeof __VLS_components['el-anchor'] | typeof __VLS_components.elAnchor | typeof __VLS_components.ElAnchor | typeof __VLS_components['el-anchor']} */
    elAnchor;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        direction: "vertical",
        offset: (130),
        type: "default",
        container: ".category-scrollbar",
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        direction: "vertical",
        offset: (130),
        type: "default",
        container: ".category-scrollbar",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_31;
    const __VLS_32 = {
        /** @type {typeof __VLS_31.click} */
        onClick: (__VLS_ctx.handleClick),
    };
    const { default: __VLS_33 } = __VLS_29.slots;
    for (const [category] of __VLS_vFor((__VLS_ctx.categories))) {
        let __VLS_34;
        /** @ts-ignore @type { | typeof __VLS_components.elAnchorLink | typeof __VLS_components.ElAnchorLink | typeof __VLS_components['el-anchor-link']} */
        elAnchorLink;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
            key: (category.id),
            href: (`#category-${category.id}`),
            title: (category.title),
        }));
        const __VLS_36 = __VLS_35({
            key: (category.id),
            href: (`#category-${category.id}`),
            title: (category.title),
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        // @ts-ignore
        [vLoading, loading, handleClick, categories,];
    }
    // @ts-ignore
    [];
    var __VLS_29;
    var __VLS_30;
    // @ts-ignore
    [];
}
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    ...{ class: "layout-bg" },
    wrapClass: "p-16-24 category-scrollbar",
}));
const __VLS_41 = __VLS_40({
    ...{ class: "layout-bg" },
    wrapClass: "p-16-24 category-scrollbar",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
const { default: __VLS_44 } = __VLS_42.slots;
if (__VLS_ctx.filterList === null) {
    for (const [category] of __VLS_vFor((__VLS_ctx.categories))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (category.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
            ...{ class: "title-decoration-1 mb-16 mt-8 color-text-primary" },
            id: (`category-${category.id}`),
        });
        /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (category.title);
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            gutter: (16),
        }));
        const __VLS_47 = __VLS_46({
            gutter: (16),
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        const { default: __VLS_50 } = __VLS_48.slots;
        for (const [tool] of __VLS_vFor((category.tools))) {
            let __VLS_51;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
                key: (tool.id),
                span: (8),
                ...{ class: "mb-16" },
            }));
            const __VLS_53 = __VLS_52({
                key: (tool.id),
                span: (8),
                ...{ class: "mb-16" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_52));
            /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
            const { default: __VLS_56 } = __VLS_54.slots;
            const __VLS_57 = ToolCard || ToolCard;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
                ...{ 'onHandleAdd': {} },
                ...{ 'onHandleDetail': {} },
                tool: (tool),
                addLoading: (__VLS_ctx.addLoading),
                getSubTitle: (__VLS_ctx.getSubTitle),
            }));
            const __VLS_59 = __VLS_58({
                ...{ 'onHandleAdd': {} },
                ...{ 'onHandleDetail': {} },
                tool: (tool),
                addLoading: (__VLS_ctx.addLoading),
                getSubTitle: (__VLS_ctx.getSubTitle),
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
            let __VLS_62;
            const __VLS_63 = {
                /** @type {typeof __VLS_62.handleAdd} */
                onHandleAdd: (...[$event]) => {
                    if (!(__VLS_ctx.filterList === null))
                        throw 0;
                    return __VLS_ctx.handleOpenAdd(tool);
                    // @ts-ignore
                    [categories, filterList, addLoading, getSubTitle, handleOpenAdd,];
                },
            };
            const __VLS_64 = {
                /** @type {typeof __VLS_62.handleDetail} */
                onHandleDetail: (...[$event]) => {
                    if (!(__VLS_ctx.filterList === null))
                        throw 0;
                    return __VLS_ctx.handleDetail(tool);
                    // @ts-ignore
                    [handleDetail,];
                },
            };
            var __VLS_60;
            var __VLS_61;
            // @ts-ignore
            [];
            var __VLS_54;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_48;
        // @ts-ignore
        [];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "color-text-primary medium mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    (__VLS_ctx.searchValue);
    (__VLS_ctx.t('views.tool.toolStore.searchResult', { count: __VLS_ctx.filterList.length }));
    if (__VLS_ctx.filterList.length) {
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            gutter: (16),
        }));
        const __VLS_67 = __VLS_66({
            gutter: (16),
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        const { default: __VLS_70 } = __VLS_68.slots;
        for (const [tool] of __VLS_vFor((__VLS_ctx.filterList))) {
            let __VLS_71;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
                key: (tool.id),
                span: (8),
                ...{ class: "mb-16" },
            }));
            const __VLS_73 = __VLS_72({
                key: (tool.id),
                span: (8),
                ...{ class: "mb-16" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_72));
            /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
            const { default: __VLS_76 } = __VLS_74.slots;
            const __VLS_77 = ToolCard;
            // @ts-ignore
            const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
                ...{ 'onHandleAdd': {} },
                ...{ 'onHandleDetail': {} },
                tool: (tool),
                addLoading: (__VLS_ctx.addLoading),
                getSubTitle: (__VLS_ctx.getSubTitle),
            }));
            const __VLS_79 = __VLS_78({
                ...{ 'onHandleAdd': {} },
                ...{ 'onHandleDetail': {} },
                tool: (tool),
                addLoading: (__VLS_ctx.addLoading),
                getSubTitle: (__VLS_ctx.getSubTitle),
            }, ...__VLS_functionalComponentArgsRest(__VLS_78));
            let __VLS_82;
            const __VLS_83 = {
                /** @type {typeof __VLS_82.handleAdd} */
                onHandleAdd: (...[$event]) => {
                    if (!!(__VLS_ctx.filterList === null))
                        throw 0;
                    if (!(__VLS_ctx.filterList.length))
                        throw 0;
                    return __VLS_ctx.handleOpenAdd(tool);
                    // @ts-ignore
                    [searchValue, filterList, filterList, filterList, addLoading, getSubTitle, handleOpenAdd, t,];
                },
            };
            const __VLS_84 = {
                /** @type {typeof __VLS_82.handleDetail} */
                onHandleDetail: (...[$event]) => {
                    if (!!(__VLS_ctx.filterList === null))
                        throw 0;
                    if (!(__VLS_ctx.filterList.length))
                        throw 0;
                    return __VLS_ctx.handleDetail(tool);
                    // @ts-ignore
                    [handleDetail,];
                },
            };
            var __VLS_80;
            var __VLS_81;
            // @ts-ignore
            [];
            var __VLS_74;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_68;
    }
    else {
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
        elEmpty;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            description: (__VLS_ctx.$t('common.noData')),
        }));
        const __VLS_87 = __VLS_86({
            description: (__VLS_ctx.$t('common.noData')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    }
}
// @ts-ignore
[$t,];
var __VLS_42;
// @ts-ignore
[];
var __VLS_22;
// @ts-ignore
[];
var __VLS_3;
const __VLS_90 = InternalDescDrawer;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    ...{ 'onAddTool': {} },
    ref: "internalDescDrawerRef",
}));
const __VLS_92 = __VLS_91({
    ...{ 'onAddTool': {} },
    ref: "internalDescDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
let __VLS_95;
const __VLS_96 = {
    /** @type {typeof __VLS_95.addTool} */
    onAddTool: (__VLS_ctx.handleOpenAdd),
};
var __VLS_97;
var __VLS_93;
var __VLS_94;
const __VLS_99 = AddInternalToolDialog;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ 'onRefresh': {} },
    ref: "addInternalToolDialogRef",
}));
const __VLS_101 = __VLS_100({
    ...{ 'onRefresh': {} },
    ref: "addInternalToolDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
const __VLS_105 = {
    /** @type {typeof __VLS_104.refresh} */
    onRefresh: (__VLS_ctx.handleAdd),
};
var __VLS_106;
var __VLS_102;
var __VLS_103;
// @ts-ignore
var __VLS_98 = __VLS_97, __VLS_107 = __VLS_106;
// @ts-ignore
[handleOpenAdd, handleAdd,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        apiType: {
            type: String,
            default: 'workspace',
        },
    },
});
export default {};
