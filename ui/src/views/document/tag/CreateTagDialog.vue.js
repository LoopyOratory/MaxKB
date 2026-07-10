/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import { cloneDeep } from 'lodash';
const route = useRoute();
const { params: { id }, // id is knowledgeID
 } = route;
const emit = defineEmits(['refresh']);
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
const FormRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const currentTagKey = ref(null);
const tags = ref([]);
const add = () => {
    if (currentTagKey.value) {
        tags.value.push({ key: currentTagKey.value });
    }
    else {
        tags.value.push({});
    }
};
const deleteTag = (index) => {
    tags.value.splice(index, 1);
};
const submit = () => {
    FormRef.value.validate((valid) => {
        if (!valid)
            return;
        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
            .postTags(id, tags.value, loading)
            .then((res) => {
            close();
            emit('refresh', currentTagKey.value);
        });
    });
};
const open = (row) => {
    const currentRow = cloneDeep(row);
    dialogVisible.value = true;
    currentTagKey.value = currentRow ? currentRow.key : null;
    tags.value = currentRow ? [{ ...{ key: currentRow.key } }] : [{}];
};
const close = () => {
    dialogVisible.value = false;
};
const __VLS_exposed = { open, close };
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
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.currentTagKey ? __VLS_ctx.$t('views.document.tag.addValue') : __VLS_ctx.$t('views.document.tag.create')),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.currentTagKey ? __VLS_ctx.$t('views.document.tag.addValue') : __VLS_ctx.$t('views.document.tag.create')),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: ({ tags: __VLS_ctx.tags }),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: ({ tags: __VLS_ctx.tags }),
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
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    gutter: (8),
    ...{ style: {} },
    ...{ class: "tag-list-max-list" },
}));
const __VLS_25 = __VLS_24({
    gutter: (8),
    ...{ style: {} },
    ...{ class: "tag-list-max-list" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
/** @type {__VLS_StyleScopedClasses['tag-list-max-list']} */ ;
const { default: __VLS_28 } = __VLS_26.slots;
for (const [tag, index] of __VLS_vFor((__VLS_ctx.tags))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (tag),
    });
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        span: (12),
    }));
    const __VLS_31 = __VLS_30({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    const { default: __VLS_34 } = __VLS_32.slots;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        label: (index === 0 ? __VLS_ctx.$t('views.document.tag.key') : ''),
        prop: (`tags.${index}.key`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
    }));
    const __VLS_37 = __VLS_36({
        label: (index === 0 ? __VLS_ctx.$t('views.document.tag.key') : ''),
        prop: (`tags.${index}.key`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_40 } = __VLS_38.slots;
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        modelValue: (tag.key),
        disabled: (__VLS_ctx.currentTagKey ? true : false),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage1')),
    }));
    const __VLS_43 = __VLS_42({
        modelValue: (tag.key),
        disabled: (__VLS_ctx.currentTagKey ? true : false),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage1')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    // @ts-ignore
    [dialogVisible, currentTagKey, currentTagKey, $t, $t, $t, $t, $t, close, tags, tags,];
    var __VLS_38;
    // @ts-ignore
    [];
    var __VLS_32;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        span: (11),
    }));
    const __VLS_48 = __VLS_47({
        span: (11),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    const { default: __VLS_51 } = __VLS_49.slots;
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        label: (index === 0 ? __VLS_ctx.$t('views.document.tag.value') : ''),
        prop: (`tags.${index}.value`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage2'),
            trigger: 'blur',
        }),
        ...{ class: "w-full" },
    }));
    const __VLS_54 = __VLS_53({
        label: (index === 0 ? __VLS_ctx.$t('views.document.tag.value') : ''),
        prop: (`tags.${index}.value`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage2'),
            trigger: 'blur',
        }),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_57 } = __VLS_55.slots;
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        modelValue: (tag.value),
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage2')),
    }));
    const __VLS_60 = __VLS_59({
        modelValue: (tag.value),
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage2')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    // @ts-ignore
    [$t, $t, $t,];
    var __VLS_55;
    // @ts-ignore
    [];
    var __VLS_49;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        span: (1),
    }));
    const __VLS_65 = __VLS_64({
        span: (1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_68 } = __VLS_66.slots;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.tags.length === 1),
        link: true,
        type: "info",
        ...{ style: ({ marginTop: index === 0 ? '35px' : '5px' }) },
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.tags.length === 1),
        link: true,
        type: "info",
        ...{ style: ({ marginTop: index === 0 ? '35px' : '5px' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_74;
    const __VLS_75 = {
        /** @type {typeof __VLS_74.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteTag(index);
            // @ts-ignore
            [tags, deleteTag,];
        },
    };
    const { default: __VLS_76 } = __VLS_72.slots;
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        iconName: "app-delete",
    }));
    const __VLS_79 = __VLS_78({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    // @ts-ignore
    [];
    var __VLS_72;
    var __VLS_73;
    // @ts-ignore
    [];
    var __VLS_66;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_26;
// @ts-ignore
[];
var __VLS_20;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_84 = __VLS_83({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
const __VLS_88 = {
    /** @type {typeof __VLS_87.click} */
    onClick: (__VLS_ctx.add),
};
const { default: __VLS_89 } = __VLS_85.slots;
let __VLS_90;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_92 = __VLS_91({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t, add,];
var __VLS_85;
var __VLS_86;
{
    const { footer: __VLS_95 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_101;
    const __VLS_102 = {
        /** @type {typeof __VLS_101.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_103 } = __VLS_99.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_99;
    var __VLS_100;
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_109;
    const __VLS_110 = {
        /** @type {typeof __VLS_109.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_111 } = __VLS_107.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, submit,];
    var __VLS_107;
    var __VLS_108;
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
});
export default {};
