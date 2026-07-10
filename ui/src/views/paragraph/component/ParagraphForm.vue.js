/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onUnmounted, watch } from 'vue';
import imageApi from '@/api/image';
import { t } from '@/locales';
const props = defineProps({
    data: {
        type: Object,
        default: () => { }
    },
    isEdit: Boolean,
    knowledgeId: String
});
const toolbars = [
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    '=',
    'pageFullscreen',
    'preview',
    'htmlPreview'
];
const footers = ['markdownTotal', 0, '=', 1, 'scrollSwitch'];
const editorRef = ref();
const form = ref({
    title: '',
    content: ''
});
const rules = reactive({
    content: [
        { required: true, message: t('views.paragraph.form.content.requiredMessage1'), trigger: 'blur' },
        { max: 100000, message: t('views.paragraph.form.content.requiredMessage2'), trigger: 'blur' }
    ]
});
const paragraphFormRef = ref();
watch(() => props.data, (value) => {
    if (value && JSON.stringify(value) !== '{}') {
        form.value.title = value.title;
        form.value.content = value.content;
    }
}, {
    immediate: true
});
watch(() => props.isEdit, (value) => {
    if (!value) {
        paragraphFormRef.value?.clearValidate();
    }
}, {
    immediate: true
});
/*
  FormValidate
*/
function validate() {
    if (!paragraphFormRef.value)
        return;
    return paragraphFormRef.value.validate((valid) => {
        return valid;
    });
}
const onUploadImg = async (files, callback) => {
    const res = await Promise.all(files.map((file) => {
        return new Promise((rev, rej) => {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('source_id', props.knowledgeId);
            fd.append('source_type', 'KNOWLEDGE');
            imageApi
                .postImage(fd)
                .then((res) => {
                rev(res);
            })
                .catch((error) => rej(error));
        });
    }));
    callback(res.map((item) => item.data));
};
onUnmounted(() => {
    form.value = {
        title: '',
        content: ''
    };
});
const __VLS_exposed = {
    validate,
    form
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
    ref: "paragraphFormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    ref: "paragraphFormRef",
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.submit} */
    onSubmit: () => { },
};
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    label: (__VLS_ctx.$t('views.paragraph.form.paragraphTitle.label')),
}));
const __VLS_12 = __VLS_11({
    label: (__VLS_ctx.$t('views.paragraph.form.paragraphTitle.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
if (__VLS_ctx.isEdit) {
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        modelValue: (__VLS_ctx.form.title),
        placeholder: (__VLS_ctx.$t('views.paragraph.form.paragraphTitle.placeholder')),
        maxlength: "256",
        showWordLimit: true,
    }));
    const __VLS_18 = __VLS_17({
        modelValue: (__VLS_ctx.form.title),
        placeholder: (__VLS_ctx.$t('views.paragraph.form.paragraphTitle.placeholder')),
        maxlength: "256",
        showWordLimit: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.form.title || '-');
}
// @ts-ignore
[form, form, form, rules, $t, $t, isEdit,];
var __VLS_13;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.$t('views.paragraph.form.content.label')),
    prop: "content",
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.$t('views.paragraph.form.content.label')),
    prop: "content",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
if (__VLS_ctx.isEdit) {
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.MdEditor | typeof __VLS_components.MdEditor} */
    MdEditor;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        ...{ 'onOnUploadImg': {} },
        modelValue: (__VLS_ctx.form.content),
        placeholder: (__VLS_ctx.$t('views.paragraph.form.content.placeholder')),
        maxLength: (100000),
        preview: (false),
        toolbars: (__VLS_ctx.toolbars),
        ...{ style: {} },
        footers: (__VLS_ctx.footers),
    }));
    const __VLS_29 = __VLS_28({
        ...{ 'onOnUploadImg': {} },
        modelValue: (__VLS_ctx.form.content),
        placeholder: (__VLS_ctx.$t('views.paragraph.form.content.placeholder')),
        maxLength: (100000),
        preview: (false),
        toolbars: (__VLS_ctx.toolbars),
        ...{ style: {} },
        footers: (__VLS_ctx.footers),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    let __VLS_32;
    const __VLS_33 = {
        /** @type {typeof __VLS_32.onUploadImg} */
        onOnUploadImg: (__VLS_ctx.onUploadImg),
    };
    const { default: __VLS_34 } = __VLS_30.slots;
    {
        const { defFooters: __VLS_35 } = __VLS_30.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ style: {} },
        });
        // @ts-ignore
        [form, $t, $t, isEdit, toolbars, footers, onUploadImg,];
    }
    // @ts-ignore
    [];
    var __VLS_30;
    var __VLS_31;
}
else {
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
    MdPreview;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        ref: "editorRef",
        editorId: "preview-only",
        modelValue: (__VLS_ctx.form.content),
        ...{ class: "maxkb-md" },
    }));
    const __VLS_38 = __VLS_37({
        ref: "editorRef",
        editorId: "preview-only",
        modelValue: (__VLS_ctx.form.content),
        ...{ class: "maxkb-md" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    var __VLS_41;
    /** @type {__VLS_StyleScopedClasses['maxkb-md']} */ ;
    var __VLS_39;
}
// @ts-ignore
[form,];
var __VLS_24;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_42 = __VLS_41;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        isEdit: Boolean,
        knowledgeId: String
    },
});
export default {};
