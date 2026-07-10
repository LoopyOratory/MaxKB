/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import CreateTagDialog from './CreateTagDialog.vue';
const emit = defineEmits(['addTags']);
const props = defineProps();
const route = useRoute();
const { params: { id, folderId }, // id is knowledgeID
 } = route;
const isShared = computed(() => {
    return folderId === 'share';
});
const optionLoading = ref(false);
const FormRef = ref();
const dialogVisible = ref(false);
const tagList = ref([]);
const keyOptions = ref([]);
const allKeyOptions = ref([]);
const add = () => {
    tagList.value.push({});
};
const deleteTag = (index) => {
    tagList.value.splice(index, 1);
};
function tagKeyChange(tag) {
    tag.value = null;
}
function getValueOptions(tag) {
    let currentKeyOption = null;
    if (tag && tag.key) {
        currentKeyOption = keyOptions.value.find((op) => op.key === tag.key);
    }
    return currentKeyOption ? currentKeyOption.values : [];
}
const submit = () => {
    FormRef.value.validate((valid) => {
        if (!valid)
            return;
        emit('addTags', tagList.value.map((tag) => tag.value), currentDocId.value);
    });
};
function getTags(Key) {
    loadSharedApi({ type: 'knowledge', systemType: props.apiType, isShared: isShared.value })
        .getTags(id, {}, optionLoading)
        .then((res) => {
        keyOptions.value = res.data.slice(0, 100);
        allKeyOptions.value = res.data;
    });
}
function filterMethod(val) {
    keyOptions.value = allKeyOptions.value
        .filter((item) => item.key.indexOf(val) > -1)
        .slice(0, 100);
}
const createTagDialogRef = ref();
function openCreateTagDialog(row) {
    createTagDialogRef.value?.open(row);
}
const currentDocId = ref();
const open = (rowId) => {
    getTags();
    currentDocId.value = rowId;
    dialogVisible.value = true;
    tagList.value = [{}];
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
    title: (__VLS_ctx.$t('views.document.tag.addTag')),
    beforeClose: (__VLS_ctx.close),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.document.tag.addTag')),
    beforeClose: (__VLS_ctx.close),
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
    ref: "FormRef",
    model: ({ tagList: __VLS_ctx.tagList }),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: ({ tagList: __VLS_ctx.tagList }),
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
for (const [tag, index] of __VLS_vFor((__VLS_ctx.tagList))) {
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
        prop: (`tagList.${index}.key`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
    }));
    const __VLS_37 = __VLS_36({
        label: (index === 0 ? __VLS_ctx.$t('views.document.tag.key') : ''),
        prop: (`tagList.${index}.key`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage1'),
            trigger: 'blur',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_40 } = __VLS_38.slots;
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
        ...{ 'onChange': {} },
        modelValue: (tag.key),
        filterable: true,
        filterMethod: (__VLS_ctx.filterMethod),
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage1')),
        loading: (__VLS_ctx.optionLoading),
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onChange': {} },
        modelValue: (tag.key),
        filterable: true,
        filterMethod: (__VLS_ctx.filterMethod),
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage1')),
        loading: (__VLS_ctx.optionLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_46;
    const __VLS_47 = {
        /** @type {typeof __VLS_46.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.tagKeyChange(tag);
            // @ts-ignore
            [dialogVisible, $t, $t, $t, $t, close, tagList, tagList, filterMethod, optionLoading, tagKeyChange,];
        },
    };
    const { default: __VLS_48 } = __VLS_44.slots;
    for (const [op] of __VLS_vFor((__VLS_ctx.keyOptions))) {
        let __VLS_49;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
            key: (op),
            value: (op.key),
            label: (op.key),
        }));
        const __VLS_51 = __VLS_50({
            key: (op),
            value: (op.key),
            label: (op.key),
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        // @ts-ignore
        [keyOptions,];
    }
    {
        const { footer: __VLS_54 } = __VLS_44.slots;
        var __VLS_55 = {};
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full text-left cursor" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        let __VLS_57;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_59 = __VLS_58({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        let __VLS_62;
        const __VLS_63 = {
            /** @type {typeof __VLS_62.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.openCreateTagDialog();
                // @ts-ignore
                [openCreateTagDialog,];
            },
        };
        const { default: __VLS_64 } = __VLS_60.slots;
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }));
        const __VLS_67 = __VLS_66({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.document.tag.create'));
        // @ts-ignore
        [$t,];
        var __VLS_60;
        var __VLS_61;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_44;
    var __VLS_45;
    // @ts-ignore
    [];
    var __VLS_38;
    // @ts-ignore
    [];
    var __VLS_32;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        span: (11),
    }));
    const __VLS_72 = __VLS_71({
        span: (11),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        label: (index === 0 ? __VLS_ctx.$t('views.document.tag.value') : ''),
        prop: (`tagList.${index}.value`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage2'),
            trigger: 'blur',
        }),
    }));
    const __VLS_78 = __VLS_77({
        label: (index === 0 ? __VLS_ctx.$t('views.document.tag.value') : ''),
        prop: (`tagList.${index}.value`),
        rules: ({
            required: true,
            message: __VLS_ctx.$t('views.document.tag.requiredMessage2'),
            trigger: 'blur',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    const { default: __VLS_81 } = __VLS_79.slots;
    let __VLS_82;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
        modelValue: (tag.value),
        filterable: true,
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage2')),
    }));
    const __VLS_84 = __VLS_83({
        modelValue: (tag.value),
        filterable: true,
        placeholder: (__VLS_ctx.$t('views.document.tag.requiredMessage2')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    const { default: __VLS_87 } = __VLS_85.slots;
    for (const [op] of __VLS_vFor((__VLS_ctx.getValueOptions(tag)))) {
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            key: (op),
            value: (op.id),
            label: (op.value),
        }));
        const __VLS_90 = __VLS_89({
            key: (op),
            value: (op.id),
            label: (op.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        // @ts-ignore
        [$t, $t, $t, getValueOptions,];
    }
    {
        const { footer: __VLS_93 } = __VLS_85.slots;
        var __VLS_94 = {};
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full text-left cursor" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_98 = __VLS_97({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        let __VLS_101;
        const __VLS_102 = {
            /** @type {typeof __VLS_101.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.openCreateTagDialog(tag);
                // @ts-ignore
                [openCreateTagDialog,];
            },
        };
        const { default: __VLS_103 } = __VLS_99.slots;
        let __VLS_104;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }));
        const __VLS_106 = __VLS_105({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.document.tag.createValue'));
        // @ts-ignore
        [$t,];
        var __VLS_99;
        var __VLS_100;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_85;
    // @ts-ignore
    [];
    var __VLS_79;
    // @ts-ignore
    [];
    var __VLS_73;
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
        span: (1),
    }));
    const __VLS_111 = __VLS_110({
        span: (1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    const { default: __VLS_114 } = __VLS_112.slots;
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.tagList.length === 1),
        text: true,
        ...{ style: ({ marginTop: index === 0 ? '35px' : '5px' }) },
    }));
    const __VLS_117 = __VLS_116({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.tagList.length === 1),
        text: true,
        ...{ style: ({ marginTop: index === 0 ? '35px' : '5px' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    let __VLS_120;
    const __VLS_121 = {
        /** @type {typeof __VLS_120.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteTag(index);
            // @ts-ignore
            [tagList, deleteTag,];
        },
    };
    const { default: __VLS_122 } = __VLS_118.slots;
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        iconName: "app-delete",
    }));
    const __VLS_125 = __VLS_124({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    // @ts-ignore
    [];
    var __VLS_118;
    var __VLS_119;
    // @ts-ignore
    [];
    var __VLS_112;
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
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_130 = __VLS_129({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_133;
const __VLS_134 = {
    /** @type {typeof __VLS_133.click} */
    onClick: (__VLS_ctx.add),
};
const { default: __VLS_135 } = __VLS_131.slots;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_138 = __VLS_137({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
(__VLS_ctx.$t('common.add'));
// @ts-ignore
[$t, add,];
var __VLS_131;
var __VLS_132;
{
    const { footer: __VLS_141 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_142;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
        ...{ 'onClick': {} },
    }));
    const __VLS_144 = __VLS_143({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    let __VLS_147;
    const __VLS_148 = {
        /** @type {typeof __VLS_147.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_149 } = __VLS_145.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_145;
    var __VLS_146;
    let __VLS_150;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_152 = __VLS_151({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    let __VLS_155;
    const __VLS_156 = {
        /** @type {typeof __VLS_155.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_157 } = __VLS_153.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, submit,];
    var __VLS_153;
    var __VLS_154;
    // @ts-ignore
    [];
}
const __VLS_158 = CreateTagDialog;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    ...{ 'onRefresh': {} },
    ref: "createTagDialogRef",
}));
const __VLS_160 = __VLS_159({
    ...{ 'onRefresh': {} },
    ref: "createTagDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
let __VLS_163;
const __VLS_164 = {
    /** @type {typeof __VLS_163.refresh} */
    onRefresh: (__VLS_ctx.getTags),
};
var __VLS_165;
var __VLS_161;
var __VLS_162;
// @ts-ignore
[getTags,];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_56 = __VLS_55, __VLS_95 = __VLS_94, __VLS_166 = __VLS_165;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
const __VLS_export = {};
export default {};
