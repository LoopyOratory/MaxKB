/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EditAvatarDialog from '@/views/tool/component/EditAvatarDialog.vue';
import { isAppIcon } from '@/utils/common';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import useStore from '@/stores';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { cloneDeep } from 'lodash';
const router = useRouter();
const { user, folder } = useStore();
const emit = defineEmits(['refresh']);
const props = defineProps({
    title: {
        type: String,
        default: t('common.edit'),
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
const FolderFormRef = ref();
const route = useRoute();
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref('');
const default_workflow = {};
const showEditIcon = ref(false);
const workflowForm = ref({
    name: '',
    desc: '',
    tool_type: 'WORKFLOW',
    work_flow: {},
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.tool.form.workflowName.requiredMessage'),
            trigger: 'blur',
        },
    ],
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        workflowForm.value = {
            name: '',
            desc: '',
            tool_type: 'WORKFLOW',
            work_flow: {},
        };
        isEdit.value = false;
        FolderFormRef.value.resetFields();
    }
});
const details = ref();
const open = (data) => {
    if (data) {
        //  EditCurrentid
        isEdit.value = !!data?.id;
        editId.value = data?.id;
        details.value = data;
        workflowForm.value = cloneDeep(data);
    }
    dialogVisible.value = true;
};
const EditAvatarDialogRef = ref();
function openEditAvatar() {
    EditAvatarDialogRef.value.open(details.value);
}
function refreshTool(data) {
    workflowForm.value.icon = data;
}
const submitHandle = async () => {
    await FolderFormRef.value.validate((valid) => {
        if (valid) {
            if (isEdit.value) {
                loadSharedApi({ type: 'tool', systemType: apiType.value })
                    .putTool(editId.value, workflowForm.value)
                    .then((res) => {
                    MsgSuccess(t('common.editSuccess'));
                    emit('refresh', res.data);
                    return user.profile().then(() => {
                        dialogVisible.value = false;
                    });
                })
                    .finally(() => {
                    loading.value = false;
                });
            }
            else {
                loadSharedApi({ type: 'tool', systemType: apiType.value })
                    .postTool({
                    ...workflowForm.value,
                    folder_id: folder.currentFolder?.id || user.getWorkspaceId() || 'default',
                    code: 'None',
                })
                    .then((res) => {
                    MsgSuccess(t('common.createSuccess'));
                    return user.profile().then(() => {
                        const folderId = res.data.scope === 'SHARED' ? 'shared' : res.data.folder_id;
                        router.push({
                            name: 'ToolWorkflow',
                            params: { id: res.data.id, folderId: folderId },
                        });
                        dialogVisible.value = false;
                    });
                })
                    .finally(() => {
                    loading.value = false;
                });
            }
        }
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
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "550",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.title),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "550",
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
    model: (__VLS_ctx.workflowForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "FolderFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.workflowForm),
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
    label: (__VLS_ctx.$t('views.tool.form.workflowName.label')),
    prop: "name",
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('views.tool.form.workflowName.label')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
if (__VLS_ctx.isEdit) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseenter: (...[$event]) => {
                if (!(__VLS_ctx.isEdit))
                    throw 0;
                return __VLS_ctx.showEditIcon = true;
                // @ts-ignore
                [title, dialogVisible, rules, workflowForm, $t, isEdit, showEditIcon,];
            } },
        ...{ onMouseleave: (...[$event]) => {
                if (!(__VLS_ctx.isEdit))
                    throw 0;
                return __VLS_ctx.showEditIcon = false;
                // @ts-ignore
                [showEditIcon,];
            } },
        ...{ class: "edit-avatar mr-12" },
    });
    /** @type {__VLS_StyleScopedClasses['edit-avatar']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    if (__VLS_ctx.isAppIcon(__VLS_ctx.workflowForm.icon)) {
        let __VLS_23;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            id: (__VLS_ctx.editId),
            shape: "square",
            size: (32),
            ...{ style: {} },
        }));
        const __VLS_25 = __VLS_24({
            id: (__VLS_ctx.editId),
            shape: "square",
            size: (32),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        const { default: __VLS_28 } = __VLS_26.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (String(__VLS_ctx.workflowForm.icon)),
            alt: "",
        });
        // @ts-ignore
        [workflowForm, workflowForm, isAppIcon, editId,];
        var __VLS_26;
    }
    else {
        let __VLS_29;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
            ...{ class: "avatar-green" },
            shape: "square",
            size: (32),
        }));
        const __VLS_31 = __VLS_30({
            ...{ class: "avatar-green" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
        const { default: __VLS_34 } = __VLS_32.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/workflow/logo_workflow.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_32;
    }
    if (__VLS_ctx.showEditIcon) {
        let __VLS_35;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
            ...{ 'onClick': {} },
            id: (__VLS_ctx.editId),
            shape: "square",
            ...{ class: "edit-mask" },
            size: (32),
        }));
        const __VLS_37 = __VLS_36({
            ...{ 'onClick': {} },
            id: (__VLS_ctx.editId),
            shape: "square",
            ...{ class: "edit-mask" },
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        let __VLS_40;
        const __VLS_41 = {
            /** @type {typeof __VLS_40.click} */
            onClick: (__VLS_ctx.openEditAvatar),
        };
        /** @type {__VLS_StyleScopedClasses['edit-mask']} */ ;
        const { default: __VLS_42 } = __VLS_38.slots;
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
            iconName: "app-edit",
        }));
        const __VLS_45 = __VLS_44({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        // @ts-ignore
        [showEditIcon, editId, openEditAvatar,];
        var __VLS_38;
        var __VLS_39;
    }
}
else {
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ class: "avatar-green mr-12" },
        shape: "square",
        size: (32),
    }));
    const __VLS_50 = __VLS_49({
        ...{ class: "avatar-green mr-12" },
        shape: "square",
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    const { default: __VLS_53 } = __VLS_51.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/workflow/logo_workflow.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [];
    var __VLS_51;
}
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.workflowForm.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.workflowName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_56 = __VLS_55({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.workflowForm.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.workflowName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_59;
const __VLS_60 = {
    /** @type {typeof __VLS_59.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.workflowForm.name = __VLS_ctx.workflowForm.name.trim();
        // @ts-ignore
        [workflowForm, workflowForm, workflowForm, $t,];
    },
};
var __VLS_57;
var __VLS_58;
// @ts-ignore
[];
var __VLS_20;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}));
const __VLS_63 = __VLS_62({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.workflowForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}));
const __VLS_69 = __VLS_68({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.workflowForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
let __VLS_72;
const __VLS_73 = {
    /** @type {typeof __VLS_72.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.workflowForm.desc = __VLS_ctx.workflowForm.desc.trim();
        // @ts-ignore
        [workflowForm, workflowForm, workflowForm, $t, $t,];
    },
};
var __VLS_70;
var __VLS_71;
// @ts-ignore
[];
var __VLS_64;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_74 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_77 = __VLS_76({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    let __VLS_80;
    const __VLS_81 = {
        /** @type {typeof __VLS_80.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible, loading,];
        },
    };
    const { default: __VLS_82 } = __VLS_78.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_78;
    var __VLS_79;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_88;
    const __VLS_89 = {
        /** @type {typeof __VLS_88.click} */
        onClick: (__VLS_ctx.submitHandle),
    };
    const { default: __VLS_90 } = __VLS_86.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.confirm') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t, $t, isEdit, loading, loading, submitHandle,];
    var __VLS_86;
    var __VLS_87;
    // @ts-ignore
    [];
}
const __VLS_91 = EditAvatarDialog;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
    iconType: "WORKFLOW",
}));
const __VLS_93 = __VLS_92({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
    iconType: "WORKFLOW",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
let __VLS_96;
const __VLS_97 = {
    /** @type {typeof __VLS_96.refresh} */
    onRefresh: (__VLS_ctx.refreshTool),
};
var __VLS_98;
var __VLS_94;
var __VLS_95;
// @ts-ignore
[refreshTool,];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_99 = __VLS_98;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        title: {
            type: String,
            default: t('common.edit'),
        },
    },
});
export default {};
