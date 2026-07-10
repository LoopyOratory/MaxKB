/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, reactive, ref, watch } from 'vue';
import EditAvatarDialog from '@/views/tool/component/EditAvatarDialog.vue';
import { MsgConfirm, MsgError, MsgSuccess } from '@/utils/message';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
import { isAppIcon } from '@/utils/common';
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
const permissionPrecise = computed(() => {
    return permissionMap['tool'][apiType.value];
});
const emit = defineEmits(['refresh']);
const EditAvatarDialogRef = ref();
const mcpServerJson = `{
  "math": {
    "url": "your_server",
    "transport": "sse"
  }
}`;
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
    tool_type: 'MCP',
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
            tool_type: 'MCP',
        };
        FormRef.value?.clearValidate();
    }
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.tool.form.mcpName.requiredMessage'),
            trigger: 'blur',
        },
    ],
    code: [
        {
            required: true,
            message: t('views.tool.mcp.requiredMessage'),
            trigger: 'blur',
        },
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
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            try {
                const parsed = JSON.parse(form.value.code);
                if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                    throw new Error('Code must be a valid JSON object');
                }
            }
            catch (e) {
                MsgError(t('workflow.nodes.mcpNode.mcpServerTip'));
                return;
            }
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
function testConnection() {
    if (!form.value.code) {
        return;
    }
    loading.value = true;
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .postToolTestConnection({ code: form.value.code }, loading)
        .then(() => {
        MsgSuccess(t('views.system.testSuccess'));
    })
        .finally(() => {
        loading.value = false;
    });
}
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
    hideRequiredAsterisk: true,
}));
const __VLS_10 = __VLS_9({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    hideRequiredAsterisk: true,
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
{
    const { label: __VLS_24 } = __VLS_21.slots;
    (__VLS_ctx.$t('common.name'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t, $t, form, rules, vLoading, loading,];
}
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
                [form, showEditIcon,];
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
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            id: (__VLS_ctx.form.id),
            shape: "square",
            size: (32),
            ...{ style: {} },
        }));
        const __VLS_27 = __VLS_26({
            id: (__VLS_ctx.form.id),
            shape: "square",
            size: (32),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        const { default: __VLS_30 } = __VLS_28.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (String(__VLS_ctx.form.icon)),
            alt: "",
        });
        // @ts-ignore
        [form, form, form, isAppIcon,];
        var __VLS_28;
    }
    else {
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            shape: "square",
            size: (32),
        }));
        const __VLS_33 = __VLS_32({
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        const { default: __VLS_36 } = __VLS_34.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/tool/icon_mcp.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_34;
    }
    if (__VLS_ctx.showEditIcon) {
        let __VLS_37;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-Avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            ...{ 'onClick': {} },
            id: (__VLS_ctx.form.id),
            shape: "square",
            ...{ class: "edit-mask" },
            size: (32),
        }));
        const __VLS_39 = __VLS_38({
            ...{ 'onClick': {} },
            id: (__VLS_ctx.form.id),
            shape: "square",
            ...{ class: "edit-mask" },
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        let __VLS_42;
        const __VLS_43 = {
            /** @type {typeof __VLS_42.click} */
            onClick: (__VLS_ctx.openEditAvatar),
        };
        /** @type {__VLS_StyleScopedClasses['edit-mask']} */ ;
        const { default: __VLS_44 } = __VLS_40.slots;
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            iconName: "app-edit",
        }));
        const __VLS_47 = __VLS_46({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        // @ts-ignore
        [form, showEditIcon, openEditAvatar,];
        var __VLS_40;
        var __VLS_41;
    }
}
else {
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        shape: "square",
        size: (32),
        ...{ class: "mr-12" },
    }));
    const __VLS_52 = __VLS_51({
        shape: "square",
        size: (32),
        ...{ class: "mr-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    const { default: __VLS_55 } = __VLS_53.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/tool/icon_mcp.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [];
    var __VLS_53;
}
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.mcpName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_58 = __VLS_57({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.mcpName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_61;
const __VLS_62 = {
    /** @type {typeof __VLS_61.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.name = __VLS_ctx.form.name?.trim();
        // @ts-ignore
        [$t, form, form, form,];
    },
};
var __VLS_59;
var __VLS_60;
// @ts-ignore
[];
var __VLS_21;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    label: (__VLS_ctx.$t('common.desc')),
}));
const __VLS_65 = __VLS_64({
    label: (__VLS_ctx.$t('common.desc')),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const { default: __VLS_68 } = __VLS_66.slots;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}));
const __VLS_71 = __VLS_70({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "128",
    showWordLimit: true,
    autosize: ({ minRows: 3 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
const __VLS_75 = {
    /** @type {typeof __VLS_74.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.desc = __VLS_ctx.form.desc?.trim();
        // @ts-ignore
        [$t, $t, form, form, form,];
    },
};
var __VLS_72;
var __VLS_73;
// @ts-ignore
[];
var __VLS_66;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.tool.mcp.title'));
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    prop: "code",
}));
const __VLS_78 = __VLS_77({
    prop: "code",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const { default: __VLS_81 } = __VLS_79.slots;
{
    const { label: __VLS_82 } = __VLS_79.slots;
    (__VLS_ctx.$t('views.tool.mcp.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        type: "info",
        ...{ class: "color-secondary" },
    }));
    const __VLS_85 = __VLS_84({
        type: "info",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    const { default: __VLS_88 } = __VLS_86.slots;
    (__VLS_ctx.$t('views.tool.mcp.tip'));
    // @ts-ignore
    [$t, $t, $t,];
    var __VLS_86;
    // @ts-ignore
    [];
}
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    modelValue: (__VLS_ctx.form.code),
    placeholder: (__VLS_ctx.mcpServerJson),
    type: "textarea",
    autosize: ({ minRows: 5 }),
}));
const __VLS_91 = __VLS_90({
    modelValue: (__VLS_ctx.form.code),
    placeholder: (__VLS_ctx.mcpServerJson),
    type: "textarea",
    autosize: ({ minRows: 5 }),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
// @ts-ignore
[form, mcpServerJson,];
var __VLS_79;
// @ts-ignore
[];
var __VLS_11;
var __VLS_12;
{
    const { footer: __VLS_94 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_95;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_97 = __VLS_96({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    let __VLS_100;
    const __VLS_101 = {
        /** @type {typeof __VLS_100.click} */
        onClick: (__VLS_ctx.testConnection),
    };
    const { default: __VLS_102 } = __VLS_98.slots;
    (__VLS_ctx.$t('views.system.test'));
    // @ts-ignore
    [$t, loading, testConnection,];
    var __VLS_98;
    var __VLS_99;
    let __VLS_103;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_105 = __VLS_104({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    let __VLS_108;
    const __VLS_109 = {
        /** @type {typeof __VLS_108.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.visible = false;
            // @ts-ignore
            [visible, loading,];
        },
    };
    const { default: __VLS_110 } = __VLS_106.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_106;
    var __VLS_107;
    if (__VLS_ctx.isEdit ? __VLS_ctx.permissionPrecise.edit(__VLS_ctx.form?.id) : __VLS_ctx.permissionPrecise.create()) {
        let __VLS_111;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_113 = __VLS_112({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        let __VLS_116;
        const __VLS_117 = {
            /** @type {typeof __VLS_116.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isEdit ? __VLS_ctx.permissionPrecise.edit(__VLS_ctx.form?.id) : __VLS_ctx.permissionPrecise.create()))
                    throw 0;
                return __VLS_ctx.submit(__VLS_ctx.FormRef);
                // @ts-ignore
                [form, loading, isEdit, permissionPrecise, permissionPrecise, submit, FormRef,];
            },
        };
        const { default: __VLS_118 } = __VLS_114.slots;
        (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.create'));
        // @ts-ignore
        [$t, $t, isEdit,];
        var __VLS_114;
        var __VLS_115;
    }
    // @ts-ignore
    [];
}
const __VLS_119 = EditAvatarDialog;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
    iconType: "MCP",
}));
const __VLS_121 = __VLS_120({
    ...{ 'onRefresh': {} },
    ref: "EditAvatarDialogRef",
    iconType: "MCP",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
const __VLS_125 = {
    /** @type {typeof __VLS_124.refresh} */
    onRefresh: (__VLS_ctx.refreshTool),
};
var __VLS_126;
var __VLS_122;
var __VLS_123;
// @ts-ignore
[refreshTool,];
var __VLS_3;
// @ts-ignore
var __VLS_16 = __VLS_15, __VLS_127 = __VLS_126;
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
