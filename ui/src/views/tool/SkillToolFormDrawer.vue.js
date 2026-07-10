/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, reactive, ref, watch } from 'vue';
import EditAvatarDialog from '@/views/tool/component/EditAvatarDialog.vue';
import UserFieldFormDialog from '@/views/tool/component/UserFieldFormDialog.vue';
import { input_type_list } from '@/components/dynamics-form/constructor/data';
import { MsgConfirm, MsgError, MsgSuccess } from '@/utils/message';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
import { filesize, getImgUrl, isAppIcon } from '@/utils/common';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const props = defineProps({
    title: String,
});
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
const UserFieldFormDialogRef = ref();
const uploadRef = ref();
const permissionPrecise = computed(() => {
    return permissionMap['tool'][apiType.value];
});
const emit = defineEmits(['refresh']);
const EditAvatarDialogRef = ref();
const FormRef = ref();
const isEdit = ref(false);
const loading = ref(false);
const visible = ref(false);
const showEditor = ref(false);
const currentIndex = ref(null);
const showEditIcon = ref(false);
const file_size_limit = ref(100);
const form = ref({
    name: '',
    desc: '',
    code: '',
    icon: '',
    input_field_list: [],
    init_field_list: [],
    tool_type: 'SKILL',
    fileList: [],
});
watch(visible, (bool) => {
    if (!bool) {
        isEdit.value = false;
        showEditor.value = false;
        currentIndex.value = null;
        form.value = {
            name: '',
            desc: '',
            code: '',
            icon: '',
            input_field_list: [],
            init_field_list: [],
            tool_type: 'SKILL',
            fileList: [],
        };
        FormRef.value?.clearValidate();
    }
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.tool.form.skillName.requiredMessage'),
            trigger: 'blur',
        },
    ],
    fileList: [
        { required: true, message: t('views.document.upload.requiredMessage'), trigger: 'change' },
    ],
});
function close() {
    if (!areAllValuesNonEmpty(form.value)) {
        visible.value = false;
    }
    else {
        MsgConfirm(t('common.tip'), t('views.tool.tip.saveMessage'), {
            confirmButtonText: t('common.confirm'),
        })
            .then(() => {
            visible.value = false;
        })
            .catch(() => { });
    }
}
function areAllValuesNonEmpty(obj) {
    return Object.values(obj).some((value) => {
        return Array.isArray(value)
            ? value.length !== 0
            : value !== null && value !== undefined && value !== '';
    });
}
function refreshTool(data) {
    form.value.icon = data;
}
function openEditAvatar() {
    EditAvatarDialogRef.value.open(form.value);
}
function openAddInitDialog(data, index) {
    if (typeof index !== 'undefined') {
        currentIndex.value = index;
    }
    UserFieldFormDialogRef.value.open(data);
}
function refreshInitFieldList(data) {
    if (currentIndex.value !== null) {
        form.value.init_field_list?.splice(currentIndex.value, 1, data);
    }
    else {
        form.value.init_field_list?.push(data);
    }
    currentIndex.value = null;
    UserFieldFormDialogRef.value.close();
}
function deleteInitField(index) {
    form.value.init_field_list?.splice(index, 1);
}
const fileHandleChange = (file, fileList) => {
    // Confirm position by file unique identifier and remove current file
    // Note: cannotUse splice(-1, 1) Blind delete tailElement，FolderUploadwill mistakenly delete normalFilewhile letting over-limit ones throughFile
    const removeCurrentFile = () => {
        const index = fileList.findIndex((item) => item.uid === file.uid);
        if (index !== -1) {
            fileList.splice(index, 1);
        }
    };
    //1、DetermineFileSizeWhetherValid, FileLimitCannot be greater than100M
    const isLimit = file?.size / 1024 / 1024 < file_size_limit.value;
    if (!isLimit) {
        MsgError(t('views.document.tip.fileLimitSizeTip1') + file_size_limit.value + 'MB');
        removeCurrentFile(); //RemoveCurrentExceedSizeFile
        return false;
    }
    if (file?.size === 0) {
        MsgError(t('views.document.upload.errorMessage3'));
        removeCurrentFile();
        return false;
    }
    if (fileList.length > 1) {
        form.value.fileList = fileList.slice(-1); // CaptureLastOneFile
    }
    const fd = new FormData();
    fd.append('file', file.raw);
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .uploadSkillFile(fd, loading)
        .then((res) => {
        form.value.code = res.data;
        loading.value = false;
    });
};
const downloadZip = () => {
    if (!form.value.code) {
        MsgError(t('views.tool.skill.noFileTip'));
        return;
    }
    const fileName = form.value.fileList && form.value.fileList[0]
        ? form.value.fileList[0].name
        : `${form.value.name}.zip`;
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .downloadSkillFile(form.value.id)
        .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
    });
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            loading.value = true;
            if (isEdit.value) {
                loadSharedApi({ type: 'tool', systemType: apiType.value })
                    .putTool(form.value?.id, form.value)
                    .then((res) => {
                    MsgSuccess(t('common.editSuccess'));
                    emit('refresh', res.data);
                    return user.profile().then(() => {
                        visible.value = false;
                        uploadRef.value?.clearFiles();
                    });
                })
                    .finally(() => {
                    loading.value = false;
                });
            }
            else {
                const obj = {
                    folder_id: folder.currentFolder?.id || user.getWorkspaceId() || 'default',
                    ...form.value,
                };
                loadSharedApi({ type: 'tool', systemType: apiType.value })
                    .postTool(obj)
                    .then((res) => {
                    MsgSuccess(t('common.createSuccess'));
                    emit('refresh');
                    return user.profile().then(() => {
                        visible.value = false;
                        uploadRef.value?.clearFiles();
                    });
                })
                    .finally(() => {
                    loading.value = false;
                });
            }
        }
    });
};
const open = (data) => {
    if (data) {
        isEdit.value = data?.id ? true : false;
        form.value = cloneDeep(data);
    }
    visible.value = true;
    setTimeout(() => {
        showEditor.value = true;
    }, 100);
};
const __VLS_exposed = {
    open,
};
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    beforeClose: (__VLS_ctx.close),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    beforeClose: (__VLS_ctx.close),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.title);
    // @ts-ignore
    [visible, close, title,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.model.modelForm.title.baseInfo'));
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_10 = __VLS_9({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
const __VLS_14 = {
    /** @type {typeof __VLS_13.submit} */
    onSubmit: () => { },
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_15;
const { default: __VLS_17 } = __VLS_11.slots;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
}));
const __VLS_20 = __VLS_19({
    label: (__VLS_ctx.$t('common.name')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
if (__VLS_ctx.form.id) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseenter: (...[$event]) => {
                if (!(__VLS_ctx.form.id))
                    throw 0;
                return __VLS_ctx.showEditIcon = true;
                // @ts-ignore
                [$t, $t, form, form, rules, vLoading, loading, showEditIcon,];
            } },
        ...{ onMouseleave: (...[$event]) => {
                if (!(__VLS_ctx.form.id))
                    throw 0;
                return __VLS_ctx.showEditIcon = false;
                // @ts-ignore
                [showEditIcon,];
            } },
        ...{ class: "edit-avatar mr-12" },
    });
    /** @type {__VLS_StyleScopedClasses['edit-avatar']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    if (__VLS_ctx.isAppIcon(__VLS_ctx.form.icon)) {
        let __VLS_24;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            id: (__VLS_ctx.form.id),
            shape: "square",
            size: (32),
            ...{ style: {} },
        }));
        const __VLS_26 = __VLS_25({
            id: (__VLS_ctx.form.id),
            shape: "square",
            size: (32),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        const { default: __VLS_29 } = __VLS_27.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (String(__VLS_ctx.form.icon)),
            alt: "",
        });
        // @ts-ignore
        [form, form, form, isAppIcon,];
        var __VLS_27;
    }
    else {
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            shape: "square",
            size: (32),
        }));
        const __VLS_32 = __VLS_31({
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        const { default: __VLS_35 } = __VLS_33.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/tool/icon_skill.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_33;
    }
    if (__VLS_ctx.showEditIcon) {
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
            ...{ 'onClick': {} },
            id: (__VLS_ctx.form.id),
            shape: "square",
            ...{ class: "edit-mask" },
            size: (32),
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onClick': {} },
            id: (__VLS_ctx.form.id),
            shape: "square",
            ...{ class: "edit-mask" },
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_41;
        const __VLS_42 = {
            /** @type {typeof __VLS_41.click} */
            onClick: (__VLS_ctx.openEditAvatar),
        };
        /** @type {__VLS_StyleScopedClasses['edit-mask']} */ ;
        const { default: __VLS_43 } = __VLS_39.slots;
        let __VLS_44;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
            iconName: "app-edit",
        }));
        const __VLS_46 = __VLS_45({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        // @ts-ignore
        [form, showEditIcon, openEditAvatar,];
        var __VLS_39;
        var __VLS_40;
    }
}
else {
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        shape: "square",
        size: (32),
        ...{ class: "mr-12" },
    }));
    const __VLS_51 = __VLS_50({
        shape: "square",
        size: (32),
        ...{ class: "mr-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    const { default: __VLS_54 } = __VLS_52.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/tool/icon_skill.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [];
    var __VLS_52;
}
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.skillName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_57 = __VLS_56({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.skillName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_60;
const __VLS_61 = {
    /** @type {typeof __VLS_60.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.name = __VLS_ctx.form.name?.trim();
        // @ts-ignore
        [$t, form, form, form,];
    },
};
var __VLS_58;
var __VLS_59;
// @ts-ignore
[];
var __VLS_21;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: (__VLS_ctx.$t('common.desc')),
}));
const __VLS_64 = __VLS_63({
    label: (__VLS_ctx.$t('common.desc')),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}));
const __VLS_70 = __VLS_69({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_73;
const __VLS_74 = {
    /** @type {typeof __VLS_73.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.desc = __VLS_ctx.form.desc?.trim();
        // @ts-ignore
        [$t, $t, form, form, form,];
    },
};
var __VLS_71;
var __VLS_72;
// @ts-ignore
[];
var __VLS_65;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('common.param.initParam'));
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    type: "info",
    ...{ class: "color-secondary lighter" },
}));
const __VLS_77 = __VLS_76({
    type: "info",
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_80 } = __VLS_78.slots;
(__VLS_ctx.$t('views.tool.skill.initParamPlaceholder'));
// @ts-ignore
[$t, $t,];
var __VLS_78;
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_83 = __VLS_82({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_86;
const __VLS_87 = {
    /** @type {typeof __VLS_86.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddInitDialog();
        // @ts-ignore
        [openAddInitDialog,];
    },
};
const { default: __VLS_88 } = __VLS_84.slots;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_91 = __VLS_90({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t,];
var __VLS_84;
var __VLS_85;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    ref: "initFieldTableRef",
    data: (__VLS_ctx.form.init_field_list),
    ...{ class: "mb-16" },
}));
const __VLS_96 = __VLS_95({
    ref: "initFieldTableRef",
    data: (__VLS_ctx.form.init_field_list),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
var __VLS_99;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_101 } = __VLS_97.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
}));
const __VLS_104 = __VLS_103({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
const { default: __VLS_107 } = __VLS_105.slots;
{
    const { default: __VLS_108 } = __VLS_105.slots;
    const [{ row }] = __VLS_vSlot(__VLS_108);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        title: (row.field),
        ...{ class: "ellipsis-1" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (row.field);
    // @ts-ignore
    [$t, form,];
}
// @ts-ignore
[];
var __VLS_105;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
}));
const __VLS_111 = __VLS_110({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
const { default: __VLS_114 } = __VLS_112.slots;
{
    const { default: __VLS_115 } = __VLS_112.slots;
    const [{ row }] = __VLS_vSlot(__VLS_115);
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }));
    const __VLS_118 = __VLS_117({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
    const { default: __VLS_121 } = __VLS_119.slots;
    (__VLS_ctx.input_type_list.find((item) => item.value === row.input_type)?.label);
    // @ts-ignore
    [$t, input_type_list,];
    var __VLS_119;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_112;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    label: (__VLS_ctx.$t('common.required')),
}));
const __VLS_124 = __VLS_123({
    label: (__VLS_ctx.$t('common.required')),
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const { default: __VLS_127 } = __VLS_125.slots;
{
    const { default: __VLS_128 } = __VLS_125.slots;
    const [{ row }] = __VLS_vSlot(__VLS_128);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_129;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }));
    const __VLS_131 = __VLS_130({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_125;
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}));
const __VLS_136 = __VLS_135({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const { default: __VLS_139 } = __VLS_137.slots;
{
    const { default: __VLS_140 } = __VLS_137.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_140);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }));
    const __VLS_143 = __VLS_142({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    const { default: __VLS_146 } = __VLS_144.slots;
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_149 = __VLS_148({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    let __VLS_152;
    const __VLS_153 = {
        /** @type {typeof __VLS_152.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddInitDialog(row, $index);
            // @ts-ignore
            [$t, $t, openAddInitDialog,];
        },
    };
    const { default: __VLS_154 } = __VLS_150.slots;
    let __VLS_155;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
        iconName: "app-edit",
    }));
    const __VLS_157 = __VLS_156({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    // @ts-ignore
    [];
    var __VLS_150;
    var __VLS_151;
    // @ts-ignore
    [];
    var __VLS_144;
    let __VLS_160;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_162 = __VLS_161({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    const { default: __VLS_165 } = __VLS_163.slots;
    let __VLS_166;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_168 = __VLS_167({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    let __VLS_171;
    const __VLS_172 = {
        /** @type {typeof __VLS_171.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteInitField($index);
            // @ts-ignore
            [$t, deleteInitField,];
        },
    };
    const { default: __VLS_173 } = __VLS_169.slots;
    let __VLS_174;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
        iconName: "app-delete",
    }));
    const __VLS_176 = __VLS_175({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    // @ts-ignore
    [];
    var __VLS_169;
    var __VLS_170;
    // @ts-ignore
    [];
    var __VLS_163;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_137;
// @ts-ignore
[];
var __VLS_97;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.tool.skill.skillFile'));
let __VLS_179;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    prop: "fileList",
}));
const __VLS_181 = __VLS_180({
    prop: "fileList",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
const { default: __VLS_184 } = __VLS_182.slots;
if (__VLS_ctx.form.fileList?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.form.fileList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_185;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
            shadow: "never",
            ...{ style: {} },
        }));
        const __VLS_187 = __VLS_186({
            shadow: "never",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_186));
        const { default: __VLS_190 } = __VLS_188.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(item && item?.name)),
            alt: "",
            width: "40",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "ellipsis-1" },
            title: (item && item?.name),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        (item && item?.name);
        let __VLS_191;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
            type: "info",
            size: "small",
        }));
        const __VLS_193 = __VLS_192({
            type: "info",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_192));
        const { default: __VLS_196 } = __VLS_194.slots;
        (__VLS_ctx.filesize(item && item?.size) || '0K');
        // @ts-ignore
        [$t, form, form, getImgUrl, filesize,];
        var __VLS_194;
        // @ts-ignore
        [];
        var __VLS_188;
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.isEdit ? __VLS_ctx.permissionPrecise.edit(__VLS_ctx.form?.id) : __VLS_ctx.permissionPrecise.create()) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        let __VLS_197;
        /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
        elUpload;
        // @ts-ignore
        const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
            fileList: (__VLS_ctx.form.fileList),
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            accept: ".zip",
            onChange: (__VLS_ctx.fileHandleChange),
        }));
        const __VLS_199 = __VLS_198({
            fileList: (__VLS_ctx.form.fileList),
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            accept: ".zip",
            onChange: (__VLS_ctx.fileHandleChange),
        }, ...__VLS_functionalComponentArgsRest(__VLS_198));
        const { default: __VLS_202 } = __VLS_200.slots;
        let __VLS_203;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
            link: true,
            type: "primary",
        }));
        const __VLS_205 = __VLS_204({
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_204));
        const { default: __VLS_208 } = __VLS_206.slots;
        (__VLS_ctx.$t('views.tool.skill.reUpload'));
        // @ts-ignore
        [$t, form, form, isEdit, permissionPrecise, permissionPrecise, fileHandleChange,];
        var __VLS_206;
        // @ts-ignore
        [];
        var __VLS_200;
        let __VLS_209;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_211 = __VLS_210({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        let __VLS_214;
        const __VLS_215 = {
            /** @type {typeof __VLS_214.click} */
            onClick: (__VLS_ctx.downloadZip),
        };
        const { default: __VLS_216 } = __VLS_212.slots;
        // @ts-ignore
        [downloadZip,];
        var __VLS_212;
        var __VLS_213;
    }
}
else {
    let __VLS_217;
    /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
    elUpload;
    // @ts-ignore
    const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
        ...{ class: "w-full mb-4" },
        drag: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".zip",
        onChange: (__VLS_ctx.fileHandleChange),
    }));
    const __VLS_219 = __VLS_218({
        ...{ class: "w-full mb-4" },
        drag: true,
        fileList: (__VLS_ctx.form.fileList),
        action: "#",
        autoUpload: (false),
        showFileList: (false),
        accept: ".zip",
        onChange: (__VLS_ctx.fileHandleChange),
    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    const { default: __VLS_222 } = __VLS_220.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/upload-icon.svg",
        alt: "",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "el-upload__text" },
    });
    /** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.upload.uploadMessage'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.em, __VLS_intrinsics.em)({
        ...{ class: "hover" },
    });
    /** @type {__VLS_StyleScopedClasses['hover']} */ ;
    (__VLS_ctx.$t('views.document.upload.selectFile'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "upload__decoration" },
    });
    /** @type {__VLS_StyleScopedClasses['upload__decoration']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('views.document.upload.formats'));
    (__VLS_ctx.$t('views.document.upload.fileLimitSizeTip'));
    (__VLS_ctx.file_size_limit);
    // @ts-ignore
    [$t, $t, $t, $t, form, fileHandleChange, file_size_limit,];
    var __VLS_220;
}
// @ts-ignore
[];
var __VLS_182;
// @ts-ignore
[];
var __VLS_11;
var __VLS_12;
{
    const { footer: __VLS_223 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_224;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_226 = __VLS_225({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    let __VLS_229;
    const __VLS_230 = {
        /** @type {typeof __VLS_229.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.visible = false;
            // @ts-ignore
            [visible, loading,];
        },
    };
    const { default: __VLS_231 } = __VLS_227.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_227;
    var __VLS_228;
    if (__VLS_ctx.isEdit ? __VLS_ctx.permissionPrecise.edit(__VLS_ctx.form?.id) : __VLS_ctx.permissionPrecise.create()) {
        let __VLS_232;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_234 = __VLS_233({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        let __VLS_237;
        const __VLS_238 = {
            /** @type {typeof __VLS_237.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isEdit ? __VLS_ctx.permissionPrecise.edit(__VLS_ctx.form?.id) : __VLS_ctx.permissionPrecise.create()))
                    throw 0;
                return __VLS_ctx.submit(__VLS_ctx.FormRef);
                // @ts-ignore
                [form, loading, isEdit, permissionPrecise, permissionPrecise, submit, FormRef,];
            },
        };
        const { default: __VLS_239 } = __VLS_235.slots;
        (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.create'));
        // @ts-ignore
        [$t, $t, isEdit,];
        var __VLS_235;
        var __VLS_236;
    }
    // @ts-ignore
    [];
}
const __VLS_240 = EditAvatarDialog;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
    iconType: "SKILL",
}));
const __VLS_242 = __VLS_241({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
    iconType: "SKILL",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
let __VLS_245;
const __VLS_246 = {
    /** @type {typeof __VLS_245.refresh} */
    onRefresh: (__VLS_ctx.refreshTool),
};
var __VLS_247;
var __VLS_243;
var __VLS_244;
const __VLS_249 = UserFieldFormDialog;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
    ...{ 'onRefresh': {} },
    ref: "UserFieldFormDialogRef",
}));
const __VLS_251 = __VLS_250({
    ...{ 'onRefresh': {} },
    ref: "UserFieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
let __VLS_254;
const __VLS_255 = {
    /** @type {typeof __VLS_254.refresh} */
    onRefresh: (__VLS_ctx.refreshInitFieldList),
};
var __VLS_256;
var __VLS_252;
var __VLS_253;
// @ts-ignore
[refreshTool, refreshInitFieldList,];
var __VLS_3;
// @ts-ignore
var __VLS_16 = __VLS_15, __VLS_100 = __VLS_99, __VLS_248 = __VLS_247, __VLS_257 = __VLS_256;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        title: String,
    },
});
export default {};
