/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, useAttrs, nextTick, inject } from 'vue';
import { get, post, put, del } from '@/request/index';
import { cloneDeep } from 'lodash';
import { formItemContextKey } from 'element-plus';
const get_extra = inject('get_extra');
const elFormItem = inject(formItemContextKey, void 0);
const request = {
    get,
    post,
    put,
    del,
};
const allCheck = ref(false);
const handleAllCheckChange = (checked) => {
    if (checked) {
        const nodes = Object.values(treeRef.value?.store.nodesMap || {});
        nodes.forEach((node) => {
            if (!node.disabled) {
                treeRef.value?.setChecked(node.data, true, false);
            }
        });
    }
    else {
        treeRef.value?.setCheckedKeys([]);
    }
};
const textField = computed(() => {
    return props.formField.text_field ? props.formField.text_field : 'label';
});
const valueField = computed(() => {
    return props.formField.value_field ? props.formField.value_field : 'value';
});
const childrenField = computed(() => {
    return props.formField.childrenField ? props.formField.childrenField : 'children';
});
const option_list = computed(() => {
    return props.formField.option_list ? props.formField.option_list : [];
});
const propsData = computed(() => {
    return {
        label: textField,
        children: childrenField,
        isLeaf: (data) => data.leaf,
        disabled: (data) => data.disabled,
    };
});
const attrs = useAttrs();
const treeRef = ref(null);
const request_call = new Function('request', 'extra', 'return  request.post(extra.url,extra.body,{},extra.loading).then(extra.then);');
function renderTemplate(template, data) {
    return template.replace(/\$\{(\w+)\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}
const loadNode = (node, resolve) => {
    request_call(request, {
        url: renderTemplate('/workspace/${current_workspace_id}/knowledge/${current_knowledge_id}/datasource/tool/${current_tool_id}/' +
            attrs.fetch_list_function, { ...props.otherParams, ...(get_extra ? get_extra() : {}) }),
        body: { current_node: node.level == 0 ? undefined : node.data },
        then: (res) => {
            resolve(res.data);
            res.data.forEach((childNode) => {
                if (childNode.is_exist) {
                    treeRef.value?.setChecked(childNode.token, true, false);
                }
            });
        },
        loading: loading,
    });
};
const props = withDefaults(defineProps(), {
    modelValue: () => [],
});
const emit = defineEmits(['update:modelValue', 'change']);
const model_value = computed({
    get: () => {
        if (!props.modelValue) {
            emit('update:modelValue', []);
        }
        return props.modelValue;
    },
    set: (v) => {
        emit('update:modelValue', v);
    },
});
const change = () => {
    model_value.value = cloneDeep(treeRef.value?.getCheckedNodes() || []);
    nextTick(() => {
        if (elFormItem?.validate) {
            elFormItem.validate('change');
        }
    });
};
const loading = ref(false);
const __VLS_defaults = {
    modelValue: () => [],
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-never border-r-6 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.allCheck),
    label: (__VLS_ctx.$t('common.allCheck')),
    size: "large",
    ...{ class: "ml-24" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.allCheck),
    label: (__VLS_ctx.$t('common.allCheck')),
    size: "large",
    ...{ class: "ml-24" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.change} */
    onChange: (__VLS_ctx.handleAllCheckChange),
};
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree'] | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree']} */
elTree;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onCheckChange': {} },
    data: (__VLS_ctx.option_list),
    ...{ style: {} },
    props: (__VLS_ctx.propsData),
    load: (__VLS_ctx.loadNode),
    lazy: (__VLS_ctx.attrs.lazy),
    showCheckbox: true,
    nodeKey: (__VLS_ctx.valueField),
    ref: "treeRef",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onCheckChange': {} },
    data: (__VLS_ctx.option_list),
    ...{ style: {} },
    props: (__VLS_ctx.propsData),
    load: (__VLS_ctx.loadNode),
    lazy: (__VLS_ctx.attrs.lazy),
    showCheckbox: true,
    nodeKey: (__VLS_ctx.valueField),
    ref: "treeRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = {
    /** @type {typeof __VLS_18.checkChange} */
    onCheckChange: (__VLS_ctx.change),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_20;
const { default: __VLS_22 } = __VLS_16.slots;
{
    const { default: __VLS_23 } = __VLS_16.slots;
    const [{ node, data }] = __VLS_vSlot(__VLS_23);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    if (data.icon) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (data.icon),
            alt: "",
            height: "20",
        });
    }
    else if (data.type === 'folder') {
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
    [vLoading, vLoading, loading, loading, allCheck, $t, handleAllCheckChange, option_list, propsData, loadNode, attrs, valueField, change,];
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
var __VLS_21 = __VLS_20;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
