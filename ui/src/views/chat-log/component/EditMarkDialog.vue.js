/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { t } from '@/locales';
import { MsgSuccess } from '@/utils/message';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
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
const emit = defineEmits(['refresh']);
const formRef = ref();
const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({});
const isEdit = ref(false);
const detail = ref({});
const rules = reactive({
    content: [
        { required: true, message: t('views.chatLog.form.content.placeholder'), trigger: 'blur' },
    ],
});
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {};
        isEdit.value = false;
    }
});
function deleteMark() {
    loadSharedApi({ type: 'chatLog', systemType: apiType.value })
        .delMarkChatRecord(id, detail.value.chat_id, detail.value.id, form.value.knowledge, form.value.document, form.value.id, loading)
        .then(() => {
        emit('refresh');
        MsgSuccess(t('common.deleteSuccess'));
        dialogVisible.value = false;
    });
}
function getMark(data) {
    loadSharedApi({ type: 'chatLog', systemType: apiType.value })
        .getMarkChatRecord(id, data.chat_id, data.id, loading)
        .then((res) => {
        if (res.data.length > 0) {
            form.value = res.data[0];
        }
    });
}
const open = (data) => {
    detail.value = data;
    getMark(data);
    dialogVisible.value = true;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            loadSharedApi({ type: 'paragraph', systemType: apiType.value })
                .putParagraph(form.value.knowledge, form.value.document, form.value.id, {
                content: form.value.content,
            }, loading)
                .then(() => {
                dialogVisible.value = false;
            });
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
    title: (__VLS_ctx.$t('views.chatLog.editMark')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600",
    ...{ class: "edit-mark-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.chatLog.editMark')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600",
    ...{ class: "edit-mark-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['edit-mark-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    const [{ titleId, titleClass }] = __VLS_vSlot(__VLS_7);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        id: (titleId),
        ...{ class: (titleClass) },
    });
    (__VLS_ctx.$t('views.chatLog.editMark'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-right" },
    });
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    if (!__VLS_ctx.isEdit) {
        let __VLS_8;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_13;
        const __VLS_14 = {
            /** @type {typeof __VLS_13.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.isEdit))
                    throw 0;
                return __VLS_ctx.isEdit = true;
                // @ts-ignore
                [$t, $t, dialogVisible, isEdit, isEdit,];
            },
        };
        const { default: __VLS_15 } = __VLS_11.slots;
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            iconName: "app-edit",
        }));
        const __VLS_18 = __VLS_17({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        // @ts-ignore
        [];
        var __VLS_11;
        var __VLS_12;
    }
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
        text: true,
        ...{ style: {} },
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
        text: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_26;
    const __VLS_27 = {
        /** @type {typeof __VLS_26.click} */
        onClick: (__VLS_ctx.deleteMark),
    };
    const { default: __VLS_28 } = __VLS_24.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        iconName: "app-delete",
    }));
    const __VLS_31 = __VLS_30({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    // @ts-ignore
    [deleteMark,];
    var __VLS_24;
    var __VLS_25;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        direction: "vertical",
    }));
    const __VLS_36 = __VLS_35({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    // @ts-ignore
    [];
}
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.isEdit) {
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        ...{ 'onSubmit': {} },
        ref: "formRef",
        model: (__VLS_ctx.form),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        rules: (__VLS_ctx.rules),
    }));
    const __VLS_47 = __VLS_46({
        ...{ 'onSubmit': {} },
        ref: "formRef",
        model: (__VLS_ctx.form),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        rules: (__VLS_ctx.rules),
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    let __VLS_50;
    const __VLS_51 = {
        /** @type {typeof __VLS_50.submit} */
        onSubmit: () => { },
    };
    var __VLS_52;
    const { default: __VLS_54 } = __VLS_48.slots;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        prop: "content",
    }));
    const __VLS_57 = __VLS_56({
        prop: "content",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    const { default: __VLS_60 } = __VLS_58.slots;
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        modelValue: (__VLS_ctx.form.content),
        placeholder: (__VLS_ctx.$t('views.chatLog.form.content.placeholder')),
        maxlength: (100000),
        showWordLimit: true,
        rows: (15),
        type: "textarea",
    }));
    const __VLS_63 = __VLS_62({
        modelValue: (__VLS_ctx.form.content),
        placeholder: (__VLS_ctx.$t('views.chatLog.form.content.placeholder')),
        maxlength: (100000),
        showWordLimit: true,
        rows: (15),
        type: "textarea",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    // @ts-ignore
    [$t, isEdit, vLoading, loading, form, form, rules,];
    var __VLS_58;
    // @ts-ignore
    [];
    var __VLS_48;
    var __VLS_49;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "pre-wrap" },
    });
    /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
    (__VLS_ctx.form?.content);
}
// @ts-ignore
[form,];
var __VLS_42;
{
    const { footer: __VLS_66 } = __VLS_3.slots;
    if (__VLS_ctx.isEdit) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "dialog-footer" },
        });
        /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
        let __VLS_67;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
            ...{ 'onClick': {} },
        }));
        const __VLS_69 = __VLS_68({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        let __VLS_72;
        const __VLS_73 = {
            /** @type {typeof __VLS_72.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isEdit))
                    throw 0;
                return __VLS_ctx.isEdit = false;
                // @ts-ignore
                [isEdit, isEdit,];
            },
        };
        const { default: __VLS_74 } = __VLS_70.slots;
        (__VLS_ctx.$t('common.cancel'));
        // @ts-ignore
        [$t,];
        var __VLS_70;
        var __VLS_71;
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onClick': {} },
            type: "primary",
            loading: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_80;
        const __VLS_81 = {
            /** @type {typeof __VLS_80.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isEdit))
                    throw 0;
                return __VLS_ctx.submit(__VLS_ctx.formRef);
                // @ts-ignore
                [loading, submit, formRef,];
            },
        };
        const { default: __VLS_82 } = __VLS_78.slots;
        (__VLS_ctx.$t('common.save'));
        // @ts-ignore
        [$t,];
        var __VLS_78;
        var __VLS_79;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_53 = __VLS_52;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
