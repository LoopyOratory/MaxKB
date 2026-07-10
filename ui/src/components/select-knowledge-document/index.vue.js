/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onUnmounted, reactive, watch } from 'vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import useStore from '@/stores';
import { t } from '@/locales';
const props = withDefaults(defineProps(), {
    postKnowledgeHandler: (k_l) => k_l,
    data: () => null
});
const { user } = useStore();
const emit = defineEmits(['changeKnowledge', 'changeDocument']);
const formRef = ref();
const form = ref({
    knowledge_id: '',
    document_id: '',
});
const treeKey = ref(0);
const rules = reactive({
    knowledge_id: [
        { required: true, message: t('views.chatLog.selectKnowledgePlaceholder'), trigger: 'change' },
    ],
    document_id: [
        { required: true, message: t('views.chatLog.documentPlaceholder'), trigger: 'change' },
    ],
});
const defaultProps = {
    children: 'children',
    label: 'name',
    isLeaf: (data) => data.resource_type ? data.resource_type !== 'folder' : data.workspace_id === 'None',
    disabled: (data, node) => {
        return data.resource_type === 'folder' && node?.isLeaf;
    },
};
const loadTree = async (node, resolve) => {
    if (node.isLeaf)
        return resolve([]);
    const folder_id = node.level === 0
        ? (props.workspaceId || user.getWorkspaceId())
        : node.data.id;
    const obj = props.apiType === 'systemManage'
        ? {
            workspace_id: props.workspaceId,
            folder_id: folder_id,
        }
        : {
            folder_id: folder_id,
        };
    await loadSharedApi({ type: 'knowledge', systemType: props.apiType })
        .getKnowledgeList(obj, optionLoading)
        .then((ok) => ok.data)
        .then(props.postKnowledgeHandler)
        .then((res) => {
        resolve(res);
    });
};
const documentList = ref([]);
const optionLoading = ref(false);
function changeKnowledge(id) {
    form.value.document_id = '';
    getDocument(id);
    emit('changeKnowledge', id);
}
function changeDocument(document_id) {
    emit('changeKnowledge', document_id);
}
function getDocument(id) {
    loadSharedApi({ type: 'document', systemType: props.apiType })
        .getDocumentList(id, optionLoading)
        .then((res) => {
        documentList.value = res.data;
        if (props.isApplication) {
            if (localStorage.getItem(id + 'chat_document_id')) {
                form.value.document_id = localStorage.getItem(id + 'chat_document_id');
            }
            if (!documentList.value.find((v) => v.id === form.value.document_id)) {
                form.value.document_id = '';
            }
        }
    });
}
watch(() => props.data, (value) => {
    if (value && JSON.stringify(value) !== '{}') {
        form.value.knowledge_id = value.knowledge_id;
        form.value.document_id = value.document_id;
    }
}, {
    immediate: true,
});
watch(() => props.workspaceId, (value) => {
    treeKey.value++;
}, {
    immediate: true,
});
/*
  FormValidate
*/
function validate() {
    if (!formRef.value)
        return;
    return formRef.value.validate((valid) => {
        return valid;
    });
}
function clearValidate() {
    form.value = {
        knowledge_id: '',
        document_id: '',
    };
    formRef.value?.clearValidate();
}
onUnmounted(() => {
    clearValidate();
});
const __VLS_exposed = {
    validate,
    form,
    clearValidate,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    postKnowledgeHandler: (k_l) => k_l,
    data: () => null
};
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
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.submit} */
    onSubmit: () => { },
};
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    label: (__VLS_ctx.$t('views.chatLog.selectKnowledge')),
    prop: "knowledge_id",
}));
const __VLS_12 = __VLS_11({
    label: (__VLS_ctx.$t('views.chatLog.selectKnowledge')),
    prop: "knowledge_id",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select'] | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select']} */
elTreeSelect;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ 'onChange': {} },
    key: (__VLS_ctx.treeKey),
    modelValue: (__VLS_ctx.form.knowledge_id),
    props: (__VLS_ctx.defaultProps),
    nodeKey: "id",
    lazy: true,
    load: (__VLS_ctx.loadTree),
    placeholder: (__VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder')),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onChange': {} },
    key: (__VLS_ctx.treeKey),
    modelValue: (__VLS_ctx.form.knowledge_id),
    props: (__VLS_ctx.defaultProps),
    nodeKey: "id",
    lazy: true,
    load: (__VLS_ctx.loadTree),
    placeholder: (__VLS_ctx.$t('views.chatLog.selectKnowledgePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_21;
const __VLS_22 = {
    /** @type {typeof __VLS_21.change} */
    onChange: (__VLS_ctx.changeKnowledge),
};
const { default: __VLS_23 } = __VLS_19.slots;
{
    const { default: __VLS_24 } = __VLS_19.slots;
    const [{ data }] = __VLS_vSlot(__VLS_24);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    if (data.resource_type !== 'folder') {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
        KnowledgeIcon;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            ...{ class: "mr-12" },
            size: (20),
            type: (data.type),
        }));
        const __VLS_27 = __VLS_26({
            ...{ class: "mr-12" },
            size: (20),
            type: (data.type),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    }
    else {
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            ...{ class: "mr-12" },
            shape: "square",
            size: (20),
            ...{ style: {} },
        }));
        const __VLS_32 = __VLS_31({
            ...{ class: "mr-12" },
            shape: "square",
            size: (20),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
        const { default: __VLS_35 } = __VLS_33.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/knowledge/icon_file-folder_colorful.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [form, form, rules, $t, $t, treeKey, defaultProps, loadTree, changeKnowledge,];
        var __VLS_33;
    }
    (data.name);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_19;
var __VLS_20;
// @ts-ignore
[];
var __VLS_13;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    label: (__VLS_ctx.$t('views.chatLog.saveToDocument')),
    prop: "document_id",
}));
const __VLS_38 = __VLS_37({
    label: (__VLS_ctx.$t('views.chatLog.saveToDocument')),
    prop: "document_id",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    ...{ 'onChangeDocument': {} },
    modelValue: (__VLS_ctx.form.document_id),
    filterable: true,
    placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
    loading: (__VLS_ctx.optionLoading),
}));
const __VLS_44 = __VLS_43({
    ...{ 'onChangeDocument': {} },
    modelValue: (__VLS_ctx.form.document_id),
    filterable: true,
    placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
    loading: (__VLS_ctx.optionLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_47;
const __VLS_48 = {
    /** @type {typeof __VLS_47.changeDocument} */
    onChangeDocument: (__VLS_ctx.changeDocument),
};
const { default: __VLS_49 } = __VLS_45.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.documentList))) {
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_52 = __VLS_51({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_55 } = __VLS_53.slots;
    (item.name);
    // @ts-ignore
    [form, $t, $t, optionLoading, changeDocument, documentList,];
    var __VLS_53;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_45;
var __VLS_46;
// @ts-ignore
[];
var __VLS_39;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
