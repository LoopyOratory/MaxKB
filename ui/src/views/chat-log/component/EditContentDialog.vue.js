/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import SelectKnowledgeDocument from '@/components/select-knowledge-document/index.vue';
import imageApi from '@/api/image';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { Permission } from '@/utils/permission/type';
import { hasPermission } from '@/utils/permission';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const postKnowledgeHandler = (knowledgeList) => {
    return knowledgeList.filter((item) => {
        if (apiType.value === 'workspace') {
            return hasPermission([
                RoleConst.WORKSPACE_MANAGE.getWorkspaceRole(),
                new Permission('KNOWLEDGE_DOCUMENT:READ+EDIT').getWorkspacePermissionWorkspaceManageRole,
                new Permission('KNOWLEDGE_DOCUMENT:READ+EDIT').getWorkspaceResourcePermission('KNOWLEDGE', item.id),
            ], 'OR');
        }
        else if (apiType.value === 'systemManage') {
            return hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_DOCUMENT_EDIT], 'OR');
        }
    });
};
const emit = defineEmits(['refresh']);
const formRef = ref();
const toolbars = [
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    '=',
    'pageFullscreen',
    'preview',
    'htmlPreview',
];
const footers = ['markdownTotal', 0, '=', 1, 'scrollSwitch'];
const SelectKnowledgeDocumentRef = ref();
const dialogVisible = ref(false);
const loading = ref(false);
const detail = ref({});
const form = ref({
    chat_id: '',
    record_id: '',
    problem_text: '',
    title: '',
    content: '',
});
const rules = reactive({
    content: [
        { required: true, message: t('views.chatLog.form.content.placeholder'), trigger: 'blur' },
    ],
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            chat_id: '',
            record_id: '',
            problem_text: '',
            title: '',
            content: '',
        };
        formRef.value?.clearValidate();
        SelectKnowledgeDocumentRef.value?.clearValidate();
    }
});
const onUploadImg = async (files, callback) => {
    const res = await Promise.all(files.map((file) => {
        return new Promise((rev, rej) => {
            const fd = new FormData();
            fd.append('file', file);
            imageApi
                .postImage(fd)
                .then((res) => {
                rev(res);
            })
                .catch((error) => rej(error));
        });
    }));
    callback(res.map((item) => item.data));
};
function changeKnowledge(knowledge_id) {
    localStorage.setItem(id + 'chat_knowledge_id', knowledge_id);
}
function changeDocument(document_id) {
    localStorage.setItem(id + 'chat_document_id', document_id);
}
const open = (data) => {
    getDetail();
    form.value.chat_id = data.chat_id;
    form.value.record_id = data.id;
    form.value.problem_text = data.problem_text ? data.problem_text.substring(0, 256) : '';
    form.value.content = data.answer_text;
    formRef.value?.clearValidate();
    dialogVisible.value = true;
};
const submitForm = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate(async (valid) => {
        if (valid) {
            if (await SelectKnowledgeDocumentRef.value?.validate()) {
                const obj = {
                    title: form.value.title,
                    content: form.value.content,
                    problem_text: form.value.problem_text,
                };
                loadSharedApi({ type: 'chatLog', systemType: apiType.value })
                    .putChatRecordLog(id, form.value.chat_id, form.value.record_id, SelectKnowledgeDocumentRef.value.form.knowledge_id, SelectKnowledgeDocumentRef.value.form.document_id, obj, loading)
                    .then((res) => {
                    emit('refresh', res.data);
                    dialogVisible.value = false;
                });
            }
        }
    });
};
function getDetail(isLoading = false) {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getApplicationDetail(id, isLoading ? loading : undefined)
        .then((res) => {
        detail.value = res.data;
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
    title: (__VLS_ctx.$t('views.chatLog.editContent')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.chatLog.editContent')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.$t('views.paragraph.relatedProblem.title')),
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('views.paragraph.relatedProblem.title')),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.form.problem_text),
    placeholder: (__VLS_ctx.$t('views.paragraph.relatedProblem.title')),
    maxlength: "256",
    showWordLimit: true,
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.form.problem_text),
    placeholder: (__VLS_ctx.$t('views.paragraph.relatedProblem.title')),
    maxlength: "256",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[$t, $t, $t, dialogVisible, form, form, rules,];
var __VLS_20;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('common.content')),
    prop: "content",
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('common.content')),
    prop: "content",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.MdEditor | typeof __VLS_components.MdEditor} */
MdEditor;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    ...{ 'onOnUploadImg': {} },
    modelValue: (__VLS_ctx.form.content),
    placeholder: (__VLS_ctx.$t('views.chatLog.form.content.placeholder')),
    maxLength: (100000),
    preview: (false),
    toolbars: (__VLS_ctx.toolbars),
    ...{ style: {} },
    footers: (__VLS_ctx.footers),
}));
const __VLS_36 = __VLS_35({
    ...{ 'onOnUploadImg': {} },
    modelValue: (__VLS_ctx.form.content),
    placeholder: (__VLS_ctx.$t('views.chatLog.form.content.placeholder')),
    maxLength: (100000),
    preview: (false),
    toolbars: (__VLS_ctx.toolbars),
    ...{ style: {} },
    footers: (__VLS_ctx.footers),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_39;
const __VLS_40 = {
    /** @type {typeof __VLS_39.onUploadImg} */
    onOnUploadImg: (__VLS_ctx.onUploadImg),
};
const { default: __VLS_41 } = __VLS_37.slots;
{
    const { defFooters: __VLS_42 } = __VLS_37.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
    });
    // @ts-ignore
    [$t, $t, form, toolbars, footers, onUploadImg,];
}
// @ts-ignore
[];
var __VLS_37;
var __VLS_38;
// @ts-ignore
[];
var __VLS_31;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    label: (__VLS_ctx.$t('common.title')),
}));
const __VLS_45 = __VLS_44({
    label: (__VLS_ctx.$t('common.title')),
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    showWordLimit: true,
    modelValue: (__VLS_ctx.form.title),
    placeholder: (__VLS_ctx.$t('views.chatLog.form.title.placeholder')),
    maxlength: "256",
}));
const __VLS_51 = __VLS_50({
    showWordLimit: true,
    modelValue: (__VLS_ctx.form.title),
    placeholder: (__VLS_ctx.$t('views.chatLog.form.title.placeholder')),
    maxlength: "256",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
// @ts-ignore
[$t, $t, form,];
var __VLS_46;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
if (__VLS_ctx.detail.workspace_id) {
    const __VLS_54 = SelectKnowledgeDocument;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        ...{ 'onChangeKnowledge': {} },
        ...{ 'onChangeDocument': {} },
        ref: "SelectKnowledgeDocumentRef",
        postKnowledgeHandler: (__VLS_ctx.postKnowledgeHandler),
        apiType: (__VLS_ctx.apiType),
        isApplication: (true),
        workspaceId: (__VLS_ctx.detail.workspace_id),
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onChangeKnowledge': {} },
        ...{ 'onChangeDocument': {} },
        ref: "SelectKnowledgeDocumentRef",
        postKnowledgeHandler: (__VLS_ctx.postKnowledgeHandler),
        apiType: (__VLS_ctx.apiType),
        isApplication: (true),
        workspaceId: (__VLS_ctx.detail.workspace_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    let __VLS_59;
    const __VLS_60 = {
        /** @type {typeof __VLS_59.changeKnowledge} */
        onChangeKnowledge: (__VLS_ctx.changeKnowledge),
    };
    const __VLS_61 = {
        /** @type {typeof __VLS_59.changeDocument} */
        onChangeDocument: (__VLS_ctx.changeDocument),
    };
    var __VLS_62;
    var __VLS_57;
    var __VLS_58;
}
{
    const { footer: __VLS_64 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        ...{ 'onClick': {} },
    }));
    const __VLS_67 = __VLS_66({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    let __VLS_70;
    const __VLS_71 = {
        /** @type {typeof __VLS_70.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, detail, detail, postKnowledgeHandler, apiType, changeKnowledge, changeDocument,];
        },
    };
    const { default: __VLS_72 } = __VLS_68.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_68;
    var __VLS_69;
    let __VLS_73;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_75 = __VLS_74({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    let __VLS_78;
    const __VLS_79 = {
        /** @type {typeof __VLS_78.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submitForm(__VLS_ctx.formRef);
            // @ts-ignore
            [loading, submitForm, formRef,];
        },
    };
    const { default: __VLS_80 } = __VLS_76.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_76;
    var __VLS_77;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_63 = __VLS_62;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
