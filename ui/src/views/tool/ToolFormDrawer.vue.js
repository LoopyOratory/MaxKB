/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch, computed } from 'vue';
import FieldFormDialog from '@/views/tool/component/FieldFormDialog.vue';
import ToolDebugDrawer from './ToolDebugDrawer.vue';
import UserFieldFormDialog from '@/views/tool/component/UserFieldFormDialog.vue';
import EditAvatarDialog from '@/views/tool/component/EditAvatarDialog.vue';
import { input_type_list } from '@/components/dynamics-form/constructor/data';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
import { isAppIcon } from '@/utils/common';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import GenerateCodeDialog from '@/views/tool/component/GenerateCodeDialog.vue';
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
const permissionPrecise = computed(() => {
    return permissionMap['tool'][apiType.value];
});
const emit = defineEmits(['refresh']);
const FieldFormDialogRef = ref();
const ToolDebugDrawerRef = ref();
const UserFieldFormDialogRef = ref();
const EditAvatarDialogRef = ref();
const initFieldTableRef = ref();
const inputFieldTableRef = ref();
const GenerateCodeDialogRef = ref();
const FormRef = ref();
const isEdit = ref(false);
const loading = ref(false);
const visible = ref(false);
const showEditor = ref(false);
const currentIndex = ref(null);
const showEditIcon = ref(false);
const form = ref({
    name: '',
    desc: '',
    code: '',
    icon: '',
    input_field_list: [],
    init_field_list: [],
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
        };
        FormRef.value?.clearValidate();
    }
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.tool.form.toolName.requiredMessage'),
            trigger: 'blur',
        },
    ],
});
function submitCodemirrorEditor(val) {
    form.value.code = val;
}
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
function openDebug() {
    ToolDebugDrawerRef.value.open(form.value);
}
function deleteField(index) {
    form.value.input_field_list?.splice(index, 1);
}
function openAddDialog(data, index) {
    if (typeof index !== 'undefined') {
        currentIndex.value = index;
    }
    FieldFormDialogRef.value.open(data);
}
function refreshFieldList(data) {
    if (currentIndex.value !== null) {
        form.value.input_field_list?.splice(currentIndex.value, 1, data);
    }
    else {
        form.value.input_field_list?.push(data);
    }
    currentIndex.value = null;
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
function refreshTool(data) {
    form.value.icon = data;
}
function deleteInitField(index) {
    form.value.init_field_list?.splice(index, 1);
}
function openEditAvatar() {
    EditAvatarDialogRef.value.open(form.value);
}
function openGenerateCodeDialog() {
    GenerateCodeDialogRef.value?.open(form.value.init_field_list, form.value.input_field_list);
}
function replaceCode(code) {
    const match = code.replace('```python', '').replace('```', '');
    form.value.code = match;
    MsgSuccess(t('views.document.tip.replaceSuccess'));
}
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
            ...{ class: "avatar-green" },
            shape: "square",
            size: (32),
        }));
        const __VLS_32 = __VLS_31({
            ...{ class: "avatar-green" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
        const { default: __VLS_35 } = __VLS_33.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/tool/icon_tool.svg",
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
        ...{ class: "avatar-green mr-12" },
        shape: "square",
        size: (32),
    }));
    const __VLS_51 = __VLS_50({
        ...{ class: "avatar-green mr-12" },
        shape: "square",
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    const { default: __VLS_54 } = __VLS_52.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/tool/icon_tool.svg",
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
    placeholder: (__VLS_ctx.$t('views.tool.form.toolName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_57 = __VLS_56({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.toolName.placeholder')),
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
// @ts-ignore
[];
var __VLS_11;
var __VLS_12;
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
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_77 = __VLS_76({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
let __VLS_80;
const __VLS_81 = {
    /** @type {typeof __VLS_80.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddInitDialog();
        // @ts-ignore
        [$t, openAddInitDialog,];
    },
};
const { default: __VLS_82 } = __VLS_78.slots;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_85 = __VLS_84({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t,];
var __VLS_78;
var __VLS_79;
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    ref: "initFieldTableRef",
    data: (__VLS_ctx.form.init_field_list),
    ...{ class: "mb-16" },
}));
const __VLS_90 = __VLS_89({
    ref: "initFieldTableRef",
    data: (__VLS_ctx.form.init_field_list),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
var __VLS_93;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_95 } = __VLS_91.slots;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
}));
const __VLS_98 = __VLS_97({
    prop: "field",
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
{
    const { default: __VLS_102 } = __VLS_99.slots;
    const [{ row }] = __VLS_vSlot(__VLS_102);
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
var __VLS_99;
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
}));
const __VLS_105 = __VLS_104({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const { default: __VLS_108 } = __VLS_106.slots;
{
    const { default: __VLS_109 } = __VLS_106.slots;
    const [{ row }] = __VLS_vSlot(__VLS_109);
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }));
    const __VLS_112 = __VLS_111({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
    const { default: __VLS_115 } = __VLS_113.slots;
    (__VLS_ctx.input_type_list.find((item) => item.value === row.input_type)?.label);
    // @ts-ignore
    [$t, input_type_list,];
    var __VLS_113;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_106;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    label: (__VLS_ctx.$t('common.required')),
}));
const __VLS_118 = __VLS_117({
    label: (__VLS_ctx.$t('common.required')),
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
{
    const { default: __VLS_122 } = __VLS_119.slots;
    const [{ row }] = __VLS_vSlot(__VLS_122);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }));
    const __VLS_125 = __VLS_124({
        disabled: true,
        size: "small",
        modelValue: (row.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_119;
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}));
const __VLS_130 = __VLS_129({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const { default: __VLS_133 } = __VLS_131.slots;
{
    const { default: __VLS_134 } = __VLS_131.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_134);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_135;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }));
    const __VLS_137 = __VLS_136({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    const { default: __VLS_140 } = __VLS_138.slots;
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_143 = __VLS_142({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    let __VLS_146;
    const __VLS_147 = {
        /** @type {typeof __VLS_146.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddInitDialog(row, $index);
            // @ts-ignore
            [$t, $t, openAddInitDialog,];
        },
    };
    const { default: __VLS_148 } = __VLS_144.slots;
    let __VLS_149;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
        iconName: "app-edit",
    }));
    const __VLS_151 = __VLS_150({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    // @ts-ignore
    [];
    var __VLS_144;
    var __VLS_145;
    // @ts-ignore
    [];
    var __VLS_138;
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_156 = __VLS_155({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    const { default: __VLS_159 } = __VLS_157.slots;
    let __VLS_160;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_165;
    const __VLS_166 = {
        /** @type {typeof __VLS_165.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteInitField($index);
            // @ts-ignore
            [$t, deleteInitField,];
        },
    };
    const { default: __VLS_167 } = __VLS_163.slots;
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        iconName: "app-delete",
    }));
    const __VLS_170 = __VLS_169({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    // @ts-ignore
    [];
    var __VLS_163;
    var __VLS_164;
    // @ts-ignore
    [];
    var __VLS_157;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_131;
// @ts-ignore
[];
var __VLS_91;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('common.param.inputParam'));
let __VLS_173;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
    type: "info",
    ...{ class: "color-secondary lighter" },
}));
const __VLS_175 = __VLS_174({
    type: "info",
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_178 } = __VLS_176.slots;
(__VLS_ctx.$t('views.tool.form.param.paramInfo1'));
// @ts-ignore
[$t, $t,];
var __VLS_176;
let __VLS_179;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_181 = __VLS_180({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
let __VLS_184;
const __VLS_185 = {
    /** @type {typeof __VLS_184.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.openAddDialog();
        // @ts-ignore
        [openAddDialog,];
    },
};
const { default: __VLS_186 } = __VLS_182.slots;
let __VLS_187;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_189 = __VLS_188({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t,];
var __VLS_182;
var __VLS_183;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    ref: "inputFieldTableRef",
    data: (__VLS_ctx.form.input_field_list),
    ...{ class: "mb-16" },
}));
const __VLS_194 = __VLS_193({
    ref: "inputFieldTableRef",
    data: (__VLS_ctx.form.input_field_list),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
var __VLS_197;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_199 } = __VLS_195.slots;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    prop: "name",
    label: (__VLS_ctx.$t('views.tool.form.paramName.label')),
}));
const __VLS_202 = __VLS_201({
    prop: "name",
    label: (__VLS_ctx.$t('views.tool.form.paramName.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
}));
const __VLS_207 = __VLS_206({
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
const { default: __VLS_210 } = __VLS_208.slots;
{
    const { default: __VLS_211 } = __VLS_208.slots;
    const [{ row }] = __VLS_vSlot(__VLS_211);
    let __VLS_212;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }));
    const __VLS_214 = __VLS_213({
        size: "small",
        type: "info",
        ...{ class: "info-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
    const { default: __VLS_217 } = __VLS_215.slots;
    (row.type);
    // @ts-ignore
    [$t, $t, form,];
    var __VLS_215;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_208;
let __VLS_218;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
    label: (__VLS_ctx.$t('common.required')),
}));
const __VLS_220 = __VLS_219({
    label: (__VLS_ctx.$t('common.required')),
}, ...__VLS_functionalComponentArgsRest(__VLS_219));
const { default: __VLS_223 } = __VLS_221.slots;
{
    const { default: __VLS_224 } = __VLS_221.slots;
    const [{ row }] = __VLS_vSlot(__VLS_224);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_225;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
        size: "small",
        modelValue: (row.is_required),
    }));
    const __VLS_227 = __VLS_226({
        size: "small",
        modelValue: (row.is_required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_221;
let __VLS_230;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
    prop: "source",
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}));
const __VLS_232 = __VLS_231({
    prop: "source",
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
const { default: __VLS_235 } = __VLS_233.slots;
{
    const { default: __VLS_236 } = __VLS_233.slots;
    const [{ row }] = __VLS_vSlot(__VLS_236);
    (row.source === 'custom' ? __VLS_ctx.$t('common.custom') : __VLS_ctx.$t('views.tool.form.source.reference'));
    // @ts-ignore
    [$t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_233;
let __VLS_237;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}));
const __VLS_239 = __VLS_238({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
const { default: __VLS_242 } = __VLS_240.slots;
{
    const { default: __VLS_243 } = __VLS_240.slots;
    const [{ row, $index }] = __VLS_vSlot(__VLS_243);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    let __VLS_244;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }));
    const __VLS_246 = __VLS_245({
        effect: "dark",
        content: (__VLS_ctx.$t('common.modify')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    const { default: __VLS_249 } = __VLS_247.slots;
    let __VLS_250;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_252 = __VLS_251({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    let __VLS_255;
    const __VLS_256 = {
        /** @type {typeof __VLS_255.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openAddDialog(row, $index);
            // @ts-ignore
            [$t, $t, openAddDialog,];
        },
    };
    const { default: __VLS_257 } = __VLS_253.slots;
    let __VLS_258;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
        iconName: "app-edit",
    }));
    const __VLS_260 = __VLS_259({
        iconName: "app-edit",
    }, ...__VLS_functionalComponentArgsRest(__VLS_259));
    // @ts-ignore
    [];
    var __VLS_253;
    var __VLS_254;
    // @ts-ignore
    [];
    var __VLS_247;
    let __VLS_263;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }));
    const __VLS_265 = __VLS_264({
        effect: "dark",
        content: (__VLS_ctx.$t('common.delete')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_264));
    const { default: __VLS_268 } = __VLS_266.slots;
    let __VLS_269;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_270 = __VLS_asFunctionalComponent1(__VLS_269, new __VLS_269({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_271 = __VLS_270({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_270));
    let __VLS_274;
    const __VLS_275 = {
        /** @type {typeof __VLS_274.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteField($index);
            // @ts-ignore
            [$t, deleteField,];
        },
    };
    const { default: __VLS_276 } = __VLS_272.slots;
    let __VLS_277;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent1(__VLS_277, new __VLS_277({
        iconName: "app-delete",
    }));
    const __VLS_279 = __VLS_278({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    // @ts-ignore
    [];
    var __VLS_272;
    var __VLS_273;
    // @ts-ignore
    [];
    var __VLS_266;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_240;
// @ts-ignore
[];
var __VLS_195;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
(__VLS_ctx.$t('views.tool.form.param.code'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-danger" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
let __VLS_282;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_283 = __VLS_asFunctionalComponent1(__VLS_282, new __VLS_282({
    type: "info",
    ...{ class: "color-secondary" },
}));
const __VLS_284 = __VLS_283({
    type: "info",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_283));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_287 } = __VLS_285.slots;
(__VLS_ctx.$t('views.tool.form.param.paramInfo2'));
// @ts-ignore
[$t, $t,];
var __VLS_285;
let __VLS_288;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_290 = __VLS_289({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
let __VLS_293;
const __VLS_294 = {
    /** @type {typeof __VLS_293.click} */
    onClick: (__VLS_ctx.openGenerateCodeDialog),
};
const { default: __VLS_295 } = __VLS_291.slots;
let __VLS_296;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
    iconName: "app-generate-star",
    ...{ class: "mr-4" },
}));
const __VLS_298 = __VLS_297({
    iconName: "app-generate-star",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('views.application.generateDialog.label'));
// @ts-ignore
[$t, openGenerateCodeDialog,];
var __VLS_291;
var __VLS_292;
if (__VLS_ctx.showEditor) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_301;
    /** @ts-ignore @type { | typeof __VLS_components.CodemirrorEditor | typeof __VLS_components.CodemirrorEditor} */
    CodemirrorEditor;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
        ...{ 'onSubmitDialog': {} },
        title: (__VLS_ctx.$t('views.tool.form.param.code')),
        modelValue: (__VLS_ctx.form.code),
        replaceCode: (__VLS_ctx.replaceCode),
    }));
    const __VLS_303 = __VLS_302({
        ...{ 'onSubmitDialog': {} },
        title: (__VLS_ctx.$t('views.tool.form.param.code')),
        modelValue: (__VLS_ctx.form.code),
        replaceCode: (__VLS_ctx.replaceCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    let __VLS_306;
    const __VLS_307 = {
        /** @type {typeof __VLS_306.submitDialog} */
        onSubmitDialog: (__VLS_ctx.submitCodemirrorEditor),
    };
    const { default: __VLS_308 } = __VLS_304.slots;
    {
        const { 'header-extra': __VLS_309 } = __VLS_304.slots;
        let __VLS_310;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_312 = __VLS_311({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_311));
        let __VLS_315;
        const __VLS_316 = {
            /** @type {typeof __VLS_315.click} */
            onClick: (__VLS_ctx.openGenerateCodeDialog),
        };
        const { default: __VLS_317 } = __VLS_313.slots;
        let __VLS_318;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_319 = __VLS_asFunctionalComponent1(__VLS_318, new __VLS_318({
            iconName: "app-generate-star",
            ...{ class: "mr-4" },
        }));
        const __VLS_320 = __VLS_319({
            iconName: "app-generate-star",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_319));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.application.generateDialog.label'));
        // @ts-ignore
        [$t, $t, form, openGenerateCodeDialog, showEditor, replaceCode, submitCodemirrorEditor,];
        var __VLS_313;
        var __VLS_314;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_304;
    var __VLS_305;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16 mt-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
(__VLS_ctx.$t('common.param.outputParam'));
let __VLS_323;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_324 = __VLS_asFunctionalComponent1(__VLS_323, new __VLS_323({
    type: "info",
    ...{ class: "color-secondary lighter" },
}));
const __VLS_325 = __VLS_324({
    type: "info",
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_324));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_328 } = __VLS_326.slots;
(__VLS_ctx.$t('views.tool.form.param.paramInfo1'));
// @ts-ignore
[$t, $t,];
var __VLS_326;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between border-r-6 p-8-12 mb-8 layout-bg lighter" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('common.result'));
{
    const { footer: __VLS_329 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_330;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_331 = __VLS_asFunctionalComponent1(__VLS_330, new __VLS_330({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_332 = __VLS_331({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_331));
    let __VLS_335;
    const __VLS_336 = {
        /** @type {typeof __VLS_335.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.visible = false;
            // @ts-ignore
            [visible, $t, loading,];
        },
    };
    const { default: __VLS_337 } = __VLS_333.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_333;
    var __VLS_334;
    if (__VLS_ctx.permissionPrecise.debug()) {
        let __VLS_338;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_339 = __VLS_asFunctionalComponent1(__VLS_338, new __VLS_338({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_340 = __VLS_339({
            ...{ 'onClick': {} },
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_339));
        let __VLS_343;
        const __VLS_344 = {
            /** @type {typeof __VLS_343.click} */
            onClick: (__VLS_ctx.openDebug),
        };
        const { default: __VLS_345 } = __VLS_341.slots;
        (__VLS_ctx.$t('common.debug'));
        // @ts-ignore
        [$t, loading, permissionPrecise, openDebug,];
        var __VLS_341;
        var __VLS_342;
    }
    if (__VLS_ctx.isEdit ? __VLS_ctx.permissionPrecise.edit(__VLS_ctx.form?.id) : __VLS_ctx.permissionPrecise.create()) {
        let __VLS_346;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_347 = __VLS_asFunctionalComponent1(__VLS_346, new __VLS_346({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_348 = __VLS_347({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_347));
        let __VLS_351;
        const __VLS_352 = {
            /** @type {typeof __VLS_351.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isEdit ? __VLS_ctx.permissionPrecise.edit(__VLS_ctx.form?.id) : __VLS_ctx.permissionPrecise.create()))
                    throw 0;
                return __VLS_ctx.submit(__VLS_ctx.FormRef);
                // @ts-ignore
                [form, loading, permissionPrecise, permissionPrecise, isEdit, submit, FormRef,];
            },
        };
        const { default: __VLS_353 } = __VLS_349.slots;
        (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.create'));
        // @ts-ignore
        [$t, $t, isEdit,];
        var __VLS_349;
        var __VLS_350;
    }
    // @ts-ignore
    [];
}
const __VLS_354 = ToolDebugDrawer;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent1(__VLS_354, new __VLS_354({
    ref: "ToolDebugDrawerRef",
}));
const __VLS_356 = __VLS_355({
    ref: "ToolDebugDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_355));
var __VLS_359;
var __VLS_357;
const __VLS_361 = FieldFormDialog;
// @ts-ignore
const __VLS_362 = __VLS_asFunctionalComponent1(__VLS_361, new __VLS_361({
    ...{ 'onRefresh': {} },
    ref: "FieldFormDialogRef",
}));
const __VLS_363 = __VLS_362({
    ...{ 'onRefresh': {} },
    ref: "FieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_362));
let __VLS_366;
const __VLS_367 = {
    /** @type {typeof __VLS_366.refresh} */
    onRefresh: (__VLS_ctx.refreshFieldList),
};
var __VLS_368;
var __VLS_364;
var __VLS_365;
const __VLS_370 = UserFieldFormDialog;
// @ts-ignore
const __VLS_371 = __VLS_asFunctionalComponent1(__VLS_370, new __VLS_370({
    ...{ 'onRefresh': {} },
    ref: "UserFieldFormDialogRef",
}));
const __VLS_372 = __VLS_371({
    ...{ 'onRefresh': {} },
    ref: "UserFieldFormDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_371));
let __VLS_375;
const __VLS_376 = {
    /** @type {typeof __VLS_375.refresh} */
    onRefresh: (__VLS_ctx.refreshInitFieldList),
};
var __VLS_377;
var __VLS_373;
var __VLS_374;
const __VLS_379 = EditAvatarDialog;
// @ts-ignore
const __VLS_380 = __VLS_asFunctionalComponent1(__VLS_379, new __VLS_379({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
}));
const __VLS_381 = __VLS_380({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_380));
let __VLS_384;
const __VLS_385 = {
    /** @type {typeof __VLS_384.refresh} */
    onRefresh: (__VLS_ctx.refreshTool),
};
var __VLS_386;
var __VLS_382;
var __VLS_383;
const __VLS_388 = GenerateCodeDialog;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent1(__VLS_388, new __VLS_388({
    ...{ 'onReplace': {} },
    ref: "GenerateCodeDialogRef",
    toolData: (__VLS_ctx.form),
}));
const __VLS_390 = __VLS_389({
    ...{ 'onReplace': {} },
    ref: "GenerateCodeDialogRef",
    toolData: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
let __VLS_393;
const __VLS_394 = {
    /** @type {typeof __VLS_393.replace} */
    onReplace: (__VLS_ctx.replaceCode),
};
var __VLS_395;
var __VLS_391;
var __VLS_392;
// @ts-ignore
[form, replaceCode, refreshFieldList, refreshInitFieldList, refreshTool,];
var __VLS_3;
// @ts-ignore
var __VLS_16 = __VLS_15, __VLS_94 = __VLS_93, __VLS_198 = __VLS_197, __VLS_360 = __VLS_359, __VLS_369 = __VLS_368, __VLS_378 = __VLS_377, __VLS_387 = __VLS_386, __VLS_396 = __VLS_395;
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
