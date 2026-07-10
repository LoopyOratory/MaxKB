/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MsgSuccess, MsgWarning } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const router = useRouter();
const route = useRoute();
const { params: { folderId }, query: { id, folder_token }, // id is knowledgeID, hasid isUploadDocument folder_tokenisFeishuFoldertoken
 } = route;
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
const loading = ref(false);
const disabled = ref(false);
const allCheck = ref(false);
const treeRef = ref(null);
const form = ref({
    fileType: 'txt',
    fileList: [],
});
const rules = reactive({
    fileList: [
        { required: true, message: t('views.document.upload.requiredMessage'), trigger: 'change' },
    ],
});
const props = {
    label: 'name',
    children: 'zones',
    isLeaf: (data) => data.type !== 'folder',
    disabled: (data) => data.is_exist,
};
const loadNode = (node, resolve) => {
    const token = node.level === 0 ? folder_token : node.data.token; // Root node uses folder_token, other nodes use node.data.token
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .getLarkDocumentList(id, token, {}, loading)
        .then((res) => {
        const nodes = res.data.files;
        resolve(nodes);
        nodes.forEach((childNode) => {
            if (childNode.is_exist) {
                treeRef.value?.setChecked(childNode.token, true, false);
            }
        });
    })
        .catch((err) => {
        console.error('Failed to load tree nodes:', err);
    });
};
const handleAllCheckChange = (checked) => {
    if (checked) {
        // Get all loaded nodes
        const nodes = Object.values(treeRef.value?.store.nodesMap || {});
        nodes.forEach((node) => {
            // Only select non-disabled file nodes
            if (!node.disabled) {
                treeRef.value?.setChecked(node.data, true, false);
            }
        });
    }
    else {
        treeRef.value?.setCheckedKeys([]);
    }
};
function submit() {
    loading.value = true;
    disabled.value = true;
    // Selected in Nodetoken
    const checkedNodes = treeRef.value?.getCheckedNodes() || [];
    const filteredNodes = checkedNodes.filter((node) => !node.is_exist);
    const newList = filteredNodes.map((node) => {
        return {
            name: node.name,
            token: node.token,
            type: node.type,
        };
    });
    if (newList.length === 0) {
        disabled.value = false;
        MsgWarning(t('views.document.feishu.errorMessage1'));
        loading.value = false;
        return;
    }
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .importLarkDocument(id, newList, loading)
        .then(() => {
        MsgSuccess(t('views.document.tip.importMessage'));
        disabled.value = false;
        back();
    })
        .catch((err) => {
        console.error('Failed to load tree nodes:', err);
    })
        .finally(() => {
        disabled.value = false;
    });
    loading.value = false;
}
function back() {
    router.go(-1);
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document p-12-24" },
});
/** @type {__VLS_StyleScopedClasses['upload-document']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button'] | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button']} */
backButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: "-1",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    to: "-1",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ style: {} },
});
(__VLS_ctx.$t('views.document.importDocument'));
let __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    ...{ style: {} },
}));
const __VLS_7 = __VLS_6({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_10 } = __VLS_8.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__main flex" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['upload-document__main']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__component main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['upload-document__component']} */ ;
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-component p-24" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['upload-component']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.document.feishu.selectDocument'));
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_13 = __VLS_12({
    ref: "FormRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
var __VLS_16;
const { default: __VLS_18 } = __VLS_14.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-16 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.form.fileType),
    ...{ class: "app-radio-button-group" },
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.form.fileType),
    ...{ class: "app-radio-button-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
/** @type {__VLS_StyleScopedClasses['app-radio-button-group']} */ ;
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    value: "txt",
}));
const __VLS_27 = __VLS_26({
    value: "txt",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
(__VLS_ctx.$t('views.document.fileType.txt.label'));
// @ts-ignore
[$t, $t, $t, vLoading, loading, form, form, rules,];
var __VLS_28;
// @ts-ignore
[];
var __VLS_22;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "update-info flex p-8-12 border-r-6 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['update-info']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-4" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    iconName: "app-warning-colorful",
    ...{ style: {} },
}));
const __VLS_33 = __VLS_32({
    iconName: "app-warning-colorful",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-16 lighter" },
});
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.feishu.tip1'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.$t('views.document.feishu.tip2'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-never border-r-6 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.allCheck),
    label: (__VLS_ctx.$t('common.allCheck')),
    size: "large",
    ...{ class: "ml-24" },
}));
const __VLS_38 = __VLS_37({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.allCheck),
    label: (__VLS_ctx.$t('common.allCheck')),
    size: "large",
    ...{ class: "ml-24" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_41;
const __VLS_42 = {
    /** @type {typeof __VLS_41.change} */
    onChange: (__VLS_ctx.handleAllCheckChange),
};
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
var __VLS_39;
var __VLS_40;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree'] | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree']} */
elTree;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    props: (__VLS_ctx.props),
    load: (__VLS_ctx.loadNode),
    lazy: true,
    showCheckbox: true,
    nodeKey: "token",
    ref: "treeRef",
}));
const __VLS_51 = __VLS_50({
    props: (__VLS_ctx.props),
    load: (__VLS_ctx.loadNode),
    lazy: true,
    showCheckbox: true,
    nodeKey: "token",
    ref: "treeRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
var __VLS_54;
const { default: __VLS_56 } = __VLS_52.slots;
{
    const { default: __VLS_57 } = __VLS_52.slots;
    const [{ node, data }] = __VLS_vSlot(__VLS_57);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    if (data.type === 'folder') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/file-icon.svg",
            alt: "",
            height: "20",
        });
    }
    else if (data.type === 'docx' || data.name.endsWith('.docx')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/docx-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.type === 'sheet' || data.name.endsWith('.xlsx')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/xlsx-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.name.endsWith('xls')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/xls-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.name.endsWith('csv')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/csv-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.name.endsWith('.pdf')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/pdf-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.name.endsWith('.html')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/html-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.name.endsWith('.txt')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/txt-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.name.endsWith('.zip')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/zip-icon.svg",
            alt: "",
            height: "22",
        });
    }
    else if (data.name.endsWith('.md')) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/fileType/md-icon.svg",
            alt: "",
            height: "22",
        });
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (node.label);
    // @ts-ignore
    [$t, $t, $t, allCheck, handleAllCheckChange, props, loadNode,];
}
// @ts-ignore
[];
var __VLS_52;
// @ts-ignore
[];
var __VLS_46;
// @ts-ignore
[];
var __VLS_14;
// @ts-ignore
[];
var __VLS_8;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__footer text-right border-t" },
});
/** @type {__VLS_StyleScopedClasses['upload-document__footer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    ...{ 'onClick': {} },
}));
const __VLS_60 = __VLS_59({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_63;
const __VLS_64 = {
    /** @type {typeof __VLS_63.click} */
    onClick: (__VLS_ctx.back),
};
const { default: __VLS_65 } = __VLS_61.slots;
(__VLS_ctx.$t('common.cancel'));
// @ts-ignore
[$t, back,];
var __VLS_61;
var __VLS_62;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.disabled),
}));
const __VLS_68 = __VLS_67({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.disabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
let __VLS_71;
const __VLS_72 = {
    /** @type {typeof __VLS_71.click} */
    onClick: (__VLS_ctx.submit),
};
const { default: __VLS_73 } = __VLS_69.slots;
(__VLS_ctx.$t('views.document.buttons.import'));
// @ts-ignore
[$t, disabled, submit,];
var __VLS_69;
var __VLS_70;
// @ts-ignore
var __VLS_17 = __VLS_16, __VLS_55 = __VLS_54;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
