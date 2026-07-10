/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import folderApi from '@/api/workspace/folder';
import { MsgError, MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import useStore from '@/stores';
import { SourceTypeEnum } from '@/enums/common';
import KnowledgeApi from '@/api/knowledge/knowledge';
import ApplicationApi from '@/api/application/application';
import ToolApi from '@/api/tool/tool';
const { folder } = useStore();
const emit = defineEmits(['refresh']);
const props = defineProps({
    source: {
        type: String,
        default: '',
    },
});
const treeRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const folderList = ref([]);
const detail = ref(null); // Save interaction required info: batch action uses id_list
const selectForderId = ref('');
const currentNodeKey = ref('');
const isBatch = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        detail.value = null;
        selectForderId.value = '';
        folderList.value = [];
        currentNodeKey.value = '';
        treeRef.value?.clearCurrentKey();
    }
});
const isFolder = ref(false);
const open = (data, is_folder) => {
    detail.value = data;
    isBatch.value = data?.id_list;
    isFolder.value = is_folder;
    getFolder();
    dialogVisible.value = true;
};
function getFolder() {
    const params = {};
    folder.asyncGetFolder(props.source, params, 'workspace', loading).then((res) => {
        folderList.value = res.data;
        if (folderList.value?.length > 0) {
            currentNodeKey.value = folderList.value[0]?.id;
        }
        else {
            currentNodeKey.value = '';
        }
    });
}
function folderClickHandle(item) {
    selectForderId.value = item.id;
}
const submitHandle = async () => {
    if (selectForderId.value) {
        const obj = {
            ...detail.value,
            folder_id: selectForderId.value,
        };
        if (isFolder.value) {
            const folder_obj = {
                ...detail.value,
                parent_id: selectForderId.value,
            };
            folderApi
                .putFolder(detail.value.id, detail.value.folder_type, folder_obj, loading)
                .then(() => {
                MsgSuccess(t('common.saveSuccess'));
                emit('refresh');
                dialogVisible.value = false;
            });
        }
        else if (props.source === SourceTypeEnum.KNOWLEDGE) {
            if (isBatch.value) {
                KnowledgeApi.putMulMoveKnowledge(obj, loading).then(() => {
                    MsgSuccess(t('common.saveSuccess'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            else {
                if (detail.value.type === 2) {
                    KnowledgeApi.putLarkKnowledge(detail.value.id, obj, loading).then(() => {
                        MsgSuccess(t('common.saveSuccess'));
                        emit('refresh', detail.value);
                        dialogVisible.value = false;
                    });
                }
                else {
                    KnowledgeApi.putKnowledge(detail.value.id, obj, loading).then(() => {
                        MsgSuccess(t('common.saveSuccess'));
                        emit('refresh', detail.value);
                        dialogVisible.value = false;
                    });
                }
            }
        }
        else if (props.source === SourceTypeEnum.TOOL) {
            if (isBatch.value) {
                ToolApi.putMulMoveTool(obj, loading).then(() => {
                    MsgSuccess(t('common.saveSuccess'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            else {
                ToolApi.putTool(detail.value.id, obj, loading).then(() => {
                    MsgSuccess(t('common.saveSuccess'));
                    emit('refresh', detail.value);
                    dialogVisible.value = false;
                });
            }
        }
        else if (props.source === SourceTypeEnum.APPLICATION) {
            if (isBatch.value) {
                ApplicationApi.putMulMoveApplication(obj, loading).then(() => {
                    MsgSuccess(t('common.saveSuccess'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            else {
                ApplicationApi.moveApplication(detail.value.id, obj.folder_id, loading).then((res) => {
                    MsgSuccess(t('common.saveSuccess'));
                    emit('refresh', detail.value);
                    dialogVisible.value = false;
                });
            }
        }
    }
    else {
        MsgError(t('components.folder.requiredMessage'));
    }
};
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
    title: (__VLS_ctx.$t('common.moveTo')),
    modelValue: (__VLS_ctx.dialogVisible),
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('common.moveTo')),
    modelValue: (__VLS_ctx.dialogVisible),
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.folderTree | typeof __VLS_components.FolderTree | typeof __VLS_components['folder-tree']} */
folderTree;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onHandleNodeClick': {} },
    ref: "treeRef",
    source: (__VLS_ctx.source),
    data: (__VLS_ctx.folderList),
    defaultExpandedKeys: ([__VLS_ctx.currentNodeKey]),
    canOperation: (false),
    ...{ class: "move-to-dialog-tree" },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onHandleNodeClick': {} },
    ref: "treeRef",
    source: (__VLS_ctx.source),
    data: (__VLS_ctx.folderList),
    defaultExpandedKeys: ([__VLS_ctx.currentNodeKey]),
    canOperation: (false),
    ...{ class: "move-to-dialog-tree" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.handleNodeClick} */
    onHandleNodeClick: (__VLS_ctx.folderClickHandle),
};
var __VLS_14;
/** @type {__VLS_StyleScopedClasses['move-to-dialog-tree']} */ ;
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_16 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        /** @type {typeof __VLS_22.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [$t, dialogVisible, dialogVisible, source, folderList, currentNodeKey, folderClickHandle, loading,];
        },
    };
    const { default: __VLS_24 } = __VLS_20.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_20;
    var __VLS_21;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.selectForderId || __VLS_ctx.selectForderId === __VLS_ctx.folder?.currentFolder?.id),
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
        disabled: (!__VLS_ctx.selectForderId || __VLS_ctx.selectForderId === __VLS_ctx.folder?.currentFolder?.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        /** @type {typeof __VLS_30.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_32 } = __VLS_28.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, loading, selectForderId, selectForderId, folder, submitHandle,];
    var __VLS_28;
    var __VLS_29;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        source: {
            type: String,
            default: '',
        },
    },
});
export default {};
