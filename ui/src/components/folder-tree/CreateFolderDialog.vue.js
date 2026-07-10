/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive } from 'vue';
import folderApi from '@/api/workspace/folder';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import useStore from '@/stores';
const { user, tool, knowledge, folder } = useStore();
const emit = defineEmits(['refresh']);
const props = defineProps({
    title: {
        type: String,
        default: t('components.folder.addFolder'),
    },
});
const FolderFormRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const sourceType = ref('');
const isEdit = ref(false);
const editId = ref('');
const folderForm = ref({
    name: '',
    desc: '',
    parent_id: '',
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('components.folder.folderNamePlaceholder'),
            trigger: 'blur',
        },
    ],
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        sourceType.value = '';
        folderForm.value = {
            name: '',
            desc: '',
            parent_id: '',
        };
        isEdit.value = false;
        FolderFormRef.value.resetFields();
    }
});
const open = (source, id, data) => {
    sourceType.value = source;
    if (data) {
        //  EditCurrentid
        editId.value = data.id;
        folderForm.value.name = data.name;
        folderForm.value.desc = data.desc;
        folderForm.value.parent_id = data.parent_id;
        isEdit.value = true;
    }
    else {
        //  forCurrentidAddSub-id
        folderForm.value.parent_id = id;
    }
    dialogVisible.value = true;
};
const submitHandle = async () => {
    await FolderFormRef.value.validate((valid) => {
        if (valid) {
            if (isEdit.value) {
                folderApi
                    .putFolder(editId.value, sourceType.value, folderForm.value, loading)
                    .then((res) => {
                    MsgSuccess(t('common.editSuccess'));
                    emit('refresh');
                    dialogVisible.value = false;
                });
            }
            else {
                folderApi.postFolder(sourceType.value, folderForm.value, loading).then((res) => {
                    return user.profile().then(() => {
                        MsgSuccess(t('common.createSuccess'));
                        folder.setCurrentFolder(res.data);
                        folder.asyncGetFolder(sourceType.value, {}, 'workspace', loading);
                        clearData();
                        emit('refresh');
                        dialogVisible.value = false;
                    });
                });
            }
        }
    });
};
function clearData() {
    tool.setToolList([]);
    knowledge.setKnowledgeList([]);
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
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "720",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "720",
    appendToBody: true,
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
    ref: "FolderFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.folderForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "FolderFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.folderForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
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
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.folderForm.name),
    placeholder: (__VLS_ctx.$t('components.folder.folderNamePlaceholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_25 = __VLS_24({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.folderForm.name),
    placeholder: (__VLS_ctx.$t('components.folder.folderNamePlaceholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.folderForm.name = __VLS_ctx.folderForm.name.trim();
        // @ts-ignore
        [title, dialogVisible, rules, folderForm, folderForm, folderForm, folderForm, $t, $t,];
    },
};
var __VLS_26;
var __VLS_27;
// @ts-ignore
[];
var __VLS_20;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}));
const __VLS_32 = __VLS_31({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.folderForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.folderForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_41;
const __VLS_42 = {
    /** @type {typeof __VLS_41.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.folderForm.desc = __VLS_ctx.folderForm.desc.trim();
        // @ts-ignore
        [folderForm, folderForm, folderForm, $t, $t,];
    },
};
var __VLS_39;
var __VLS_40;
// @ts-ignore
[];
var __VLS_33;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_43 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_49;
    const __VLS_50 = {
        /** @type {typeof __VLS_49.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, loading,];
        },
    };
    const { default: __VLS_51 } = __VLS_47.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_47;
    var __VLS_48;
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_59 } = __VLS_55.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.confirm') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t, $t, loading, loading, submitHandle, isEdit,];
    var __VLS_55;
    var __VLS_56;
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
        title: {
            type: String,
            default: t('components.folder.addFolder'),
        },
    },
});
export default {};
