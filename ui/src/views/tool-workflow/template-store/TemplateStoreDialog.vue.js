/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import ToolStoreApi from '@/api/tool/store';
import { t } from '@/locales';
import TemplateCard from './TemplateCard.vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import InternalDescDrawer from './InternalDescDrawer.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import useStore from '@/stores';
import { useRoute } from 'vue-router';
const { user } = useStore();
const route = useRoute();
const { params: { id },
/*
folderId Can distinguish resource-management sharedOr workspace
*/
 } = route;
const props = defineProps({
    apiType: {
        type: String,
        default: 'workspace',
    },
    source: {
        type: String,
        default: 'knowledge',
    },
});
const emit = defineEmits(['refresh']);
const dialogVisible = ref(false);
const loading = ref(false);
const searchValue = ref('');
const folderId = ref('');
const categories = ref([]);
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
    const [v1] = await Promise.all([getStoreToolList()]);
    const merged = [...v1].reduce((acc, category) => {
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
async function getStoreToolList() {
    try {
        const res = await ToolStoreApi.getStoreToolWorkflowList({ name: searchValue.value }, loading);
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
    internalDescDrawerRef.value?.open(tool.readMe, tool);
}
const CreateWorkflowToolDialogRef = ref();
function handleOpenAdd(data, isEdit) {
    if (props.source === 'work_flow') {
        MsgConfirm(t('common.tip'), `${t('views.application.tip.confirmUse')} ${data.name} ${t('views.application.tip.overwrite')}?`, {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
        })
            .then(() => {
            handleStoreAdd(data);
        })
            .catch(() => { });
    }
    else {
        CreateWorkflowToolDialogRef.value.open({ id: folderId.value }, data);
    }
}
const addLoading = ref(false);
function handleStoreAdd(tool) {
    try {
        loadSharedApi({ type: 'tool', systemType: props.apiType })
            .putToolWorkflow(id, { work_flow_template: tool })
            .then(() => {
            emit('refresh');
            MsgSuccess(t('common.addSuccess'));
        });
        dialogVisible.value = false;
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
    width: "1000",
    appendToBody: true,
    ...{ class: "tool-store-dialog" },
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "1000",
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
    (__VLS_ctx.$t('workflow.setting.templateCenter'));
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
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ class: "layout-bg" },
    wrapClass: "p-16-24 category-scrollbar",
}));
const __VLS_21 = __VLS_20({
    ...{ class: "layout-bg" },
    wrapClass: "p-16-24 category-scrollbar",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
const { default: __VLS_24 } = __VLS_22.slots;
if (__VLS_ctx.filterList === null) {
    for (const [category] of __VLS_vFor((__VLS_ctx.categories))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (category.id),
        });
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            gutter: (16),
        }));
        const __VLS_27 = __VLS_26({
            gutter: (16),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        const { default: __VLS_30 } = __VLS_28.slots;
        for (const [tool] of __VLS_vFor((category.tools))) {
            let __VLS_31;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
                key: (tool.id),
                span: (8),
                ...{ class: "mb-16" },
            }));
            const __VLS_33 = __VLS_32({
                key: (tool.id),
                span: (8),
                ...{ class: "mb-16" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_32));
            /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
            const { default: __VLS_36 } = __VLS_34.slots;
            const __VLS_37 = TemplateCard || TemplateCard;
            // @ts-ignore
            const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
                ...{ 'onHandleAdd': {} },
                ...{ 'onHandleDetail': {} },
                tool: (tool),
                addLoading: (__VLS_ctx.addLoading),
                getSubTitle: (__VLS_ctx.getSubTitle),
            }));
            const __VLS_39 = __VLS_38({
                ...{ 'onHandleAdd': {} },
                ...{ 'onHandleDetail': {} },
                tool: (tool),
                addLoading: (__VLS_ctx.addLoading),
                getSubTitle: (__VLS_ctx.getSubTitle),
            }, ...__VLS_functionalComponentArgsRest(__VLS_38));
            let __VLS_42;
            const __VLS_43 = {
                /** @type {typeof __VLS_42.handleAdd} */
                onHandleAdd: (...[$event]) => {
                    if (!(__VLS_ctx.filterList === null))
                        throw 0;
                    return __VLS_ctx.handleOpenAdd(tool);
                    // @ts-ignore
                    [filterList, categories, addLoading, getSubTitle, handleOpenAdd,];
                },
            };
            const __VLS_44 = {
                /** @type {typeof __VLS_42.handleDetail} */
                onHandleDetail: (...[$event]) => {
                    if (!(__VLS_ctx.filterList === null))
                        throw 0;
                    return __VLS_ctx.handleDetail(tool);
                    // @ts-ignore
                    [handleDetail,];
                },
            };
            var __VLS_40;
            var __VLS_41;
            // @ts-ignore
            [];
            var __VLS_34;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_28;
        // @ts-ignore
        [];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.filterList.length) {
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
        for (const [tool] of __VLS_vFor((__VLS_ctx.filterList))) {
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
            const __VLS_57 = TemplateCard;
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
                    if (!!(__VLS_ctx.filterList === null))
                        throw 0;
                    if (!(__VLS_ctx.filterList.length))
                        throw 0;
                    return __VLS_ctx.handleOpenAdd(tool);
                    // @ts-ignore
                    [filterList, filterList, addLoading, getSubTitle, handleOpenAdd,];
                },
            };
            const __VLS_64 = {
                /** @type {typeof __VLS_62.handleDetail} */
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
    }
    else {
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
        elEmpty;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            description: (__VLS_ctx.$t('common.noData')),
        }));
        const __VLS_67 = __VLS_66({
            description: (__VLS_ctx.$t('common.noData')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    }
}
// @ts-ignore
[$t,];
var __VLS_22;
// @ts-ignore
[];
var __VLS_3;
const __VLS_70 = InternalDescDrawer;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    ...{ 'onAddTool': {} },
    ref: "internalDescDrawerRef",
}));
const __VLS_72 = __VLS_71({
    ...{ 'onAddTool': {} },
    ref: "internalDescDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
const __VLS_76 = {
    /** @type {typeof __VLS_75.addTool} */
    onAddTool: (__VLS_ctx.handleOpenAdd),
};
var __VLS_77;
var __VLS_73;
var __VLS_74;
// @ts-ignore
var __VLS_78 = __VLS_77;
// @ts-ignore
[handleOpenAdd,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        apiType: {
            type: String,
            default: 'workspace',
        },
        source: {
            type: String,
            default: 'knowledge',
        },
    },
});
export default {};
