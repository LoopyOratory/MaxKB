/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
const route = useRoute();
const { params: { id }, // id is knowledgeID
 } = route;
const { user } = useStore();
const props = defineProps({
    workspaceId: {
        type: String,
    },
});
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
const emit = defineEmits(['refresh']);
const loading = ref(false);
const dialogVisible = ref(false);
const knowledgeList = ref([]);
const documentList = ref([]);
const form = ref({
    selectKnowledge: '',
});
const defaultProps = {
    children: 'children',
    label: 'name',
    isLeaf: (data) => data.resource_type ? data.resource_type !== 'folder' : data.workspace_id === 'None',
    disabled: (data, node) => {
        return data.id === id || (data.resource_type === 'folder' && node?.isLeaf);
    },
};
const loadTree = async (node, resolve) => {
    if (node.isLeaf)
        return resolve([]);
    const folder_id = node.level === 0 ? user.getWorkspaceId() : node.data.id;
    const obj = apiType.value === 'systemManage'
        ? {
            workspace_id: props.workspaceId,
            folder_id: node.level === 0 ? props.workspaceId : node.data.id,
        }
        : {
            folder_id: folder_id,
        };
    await loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .getKnowledgeList(obj, loading)
        .then((res) => {
        resolve(res.data);
    });
};
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value.selectKnowledge = '';
        knowledgeList.value = [];
        documentList.value = [];
    }
});
const open = (list) => {
    documentList.value = list;
    dialogVisible.value = true;
};
const submitHandle = () => {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .putMigrateMulDocument(id, form.value.selectKnowledge, documentList.value, loading)
        .then(() => {
        emit('refresh');
        dialogVisible.value = false;
    });
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
    title: (`${__VLS_ctx.$t('views.document.migrateDocument')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600",
    ...{ class: "select-knowledge-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (`${__VLS_ctx.$t('views.document.migrateDocument')}`),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600",
    ...{ class: "select-knowledge-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['select-knowledge-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    label: (__VLS_ctx.$t('views.chatLog.selectKnowledge')),
    required: true,
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.chatLog.selectKnowledge')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select'] | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select']} */
elTreeSelect;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.selectKnowledge),
    props: (__VLS_ctx.defaultProps),
    nodeKey: "id",
    lazy: true,
    load: (__VLS_ctx.loadTree),
    placeholder: (__VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder')),
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.selectKnowledge),
    props: (__VLS_ctx.defaultProps),
    nodeKey: "id",
    lazy: true,
    load: (__VLS_ctx.loadTree),
    placeholder: (__VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
{
    const { default: __VLS_27 } = __VLS_24.slots;
    const [{ data }] = __VLS_vSlot(__VLS_27);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    if (data.resource_type !== 'folder') {
        let __VLS_28;
        /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
        KnowledgeIcon;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
            ...{ class: "mr-12" },
            size: (20),
            type: (data.type),
        }));
        const __VLS_30 = __VLS_29({
            ...{ class: "mr-12" },
            size: (20),
            type: (data.type),
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    }
    else {
        let __VLS_33;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
            ...{ class: "mr-12" },
            shape: "square",
            size: (20),
            ...{ style: {} },
        }));
        const __VLS_35 = __VLS_34({
            ...{ class: "mr-12" },
            shape: "square",
            size: (20),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
        const { default: __VLS_38 } = __VLS_36.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/knowledge/icon_file-folder_colorful.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [$t, $t, $t, dialogVisible, form, form, defaultProps, loadTree,];
        var __VLS_36;
    }
    (data.name);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_24;
// @ts-ignore
[];
var __VLS_18;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_39 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        /** @type {typeof __VLS_45.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_47 } = __VLS_43.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_43;
    var __VLS_44;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.form.selectKnowledge || __VLS_ctx.loading),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.form.selectKnowledge || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_55 } = __VLS_51.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, form, loading, submitHandle,];
    var __VLS_51;
    var __VLS_52;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        workspaceId: {
            type: String,
        },
    },
});
export default {};
