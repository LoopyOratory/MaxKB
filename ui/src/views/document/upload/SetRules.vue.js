/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted, reactive, watch } from 'vue';
import ParagraphPreview from '@/views/knowledge/component/ParagraphPreview.vue';
import { useRoute } from 'vue-router';
import { cutFilename } from '@/utils/common';
import useStore from '@/stores';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const { knowledge } = useStore();
const documentsFiles = computed(() => knowledge.documentsFiles);
const splitPatternList = ref([]);
const route = useRoute();
const { query: { id }, // id is knowledgeID
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
const radio = ref('1');
const loading = ref(false);
const paragraphList = ref([]);
const patternLoading = ref(false);
const checkedConnect = ref(false);
const firstChecked = ref(true);
const form = reactive({
    patterns: [],
    limit: 500,
    with_filter: true,
});
function changeHandle(val) {
    if (val && firstChecked.value) {
        paragraphList.value = paragraphList.value.map((item) => ({
            ...item,
            content: item.content.map((v) => ({
                ...v,
                problem_list: v.title.trim()
                    ? [
                        {
                            content: v.title.trim(),
                        },
                    ]
                    : [],
            })),
        }));
        firstChecked.value = false;
    }
}
function splitDocument() {
    loading.value = true;
    const fd = new FormData();
    documentsFiles.value.forEach((item) => {
        if (item?.raw) {
            fd.append('file', item?.raw);
        }
    });
    if (radio.value === '2') {
        Object.keys(form).forEach((key) => {
            if (key == 'patterns') {
                form.patterns.forEach((item) => fd.append('patterns', item));
            }
            else {
                fd.append(key, form[key]);
            }
        });
    }
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .postSplitDocument(id, fd)
        .then((res) => {
        const list = res.data;
        list.map((item) => {
            if (item.name.length > 128) {
                item.name = cutFilename(item.name, 128);
            }
            if (checkedConnect.value) {
                item.content.map((v) => {
                    v['problem_list'] = v.title.trim()
                        ? [
                            {
                                content: v.title.trim(),
                            },
                        ]
                        : [];
                });
            }
        });
        paragraphList.value = list;
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
const initSplitPatternList = () => {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .listSplitPattern(id, patternLoading)
        .then((ok) => {
        splitPatternList.value = ok.data;
    });
};
watch(radio, () => {
    if (radio.value === '2') {
        initSplitPatternList();
    }
});
onMounted(() => {
    splitDocument();
});
const __VLS_exposed = {
    paragraphList,
    checkedConnect,
    loading,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "set-rules" },
});
/** @type {__VLS_StyleScopedClasses['set-rules']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    span: (10),
    ...{ class: "p-24" },
}));
const __VLS_8 = __VLS_7({
    span: (10),
    ...{ class: "p-24" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.document.setRules.title.setting'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "set-rules__right" },
});
/** @type {__VLS_StyleScopedClasses['set-rules__right']} */ ;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: () => { } },
    ...{ class: "left-height" },
});
/** @type {__VLS_StyleScopedClasses['left-height']} */ ;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.radio),
    ...{ class: "card__radio" },
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.radio),
    ...{ class: "card__radio" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['card__radio']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.radio === '1' ? 'border-active' : '') },
}));
const __VLS_26 = __VLS_25({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.radio === '1' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_29 } = __VLS_27.slots;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    value: "1",
    size: "large",
}));
const __VLS_32 = __VLS_31({
    value: "1",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.document.setRules.intelligent.label'));
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    type: "info",
}));
const __VLS_38 = __VLS_37({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
(__VLS_ctx.$t('views.document.setRules.intelligent.text'));
// @ts-ignore
[$t, $t, $t, radio, radio,];
var __VLS_39;
// @ts-ignore
[];
var __VLS_33;
// @ts-ignore
[];
var __VLS_27;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.radio === '2' ? 'border-active' : '') },
}));
const __VLS_44 = __VLS_43({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.radio === '2' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_47 } = __VLS_45.slots;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    value: "2",
    size: "large",
}));
const __VLS_50 = __VLS_49({
    value: "2",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_53 } = __VLS_51.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.document.setRules.advanced.label'));
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    type: "info",
}));
const __VLS_56 = __VLS_55({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
(__VLS_ctx.$t('views.document.setRules.advanced.text'));
// @ts-ignore
[$t, $t, radio,];
var __VLS_57;
// @ts-ignore
[];
var __VLS_51;
if (__VLS_ctx.radio === '2') {
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        shadow: "never",
        ...{ class: "card-never mt-16" },
        ...{ style: {} },
    }));
    const __VLS_62 = __VLS_61({
        shadow: "never",
        ...{ class: "card-never mt-16" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    const { default: __VLS_65 } = __VLS_63.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "set-rules__form" },
    });
    /** @type {__VLS_StyleScopedClasses['set-rules__form']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-item mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "title flex align-center mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
    });
    (__VLS_ctx.$t('views.document.setRules.patterns.label'));
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        effect: "dark",
        content: (__VLS_ctx.$t('views.document.setRules.patterns.tooltip')),
        placement: "right",
    }));
    const __VLS_68 = __VLS_67({
        effect: "dark",
        content: (__VLS_ctx.$t('views.document.setRules.patterns.tooltip')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    const { default: __VLS_71 } = __VLS_69.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_74 = __VLS_73({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, $t, radio,];
    var __VLS_69;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        modelValue: (__VLS_ctx.form.patterns),
        multiple: true,
        reserveKeyword: (false),
        allowCreate: true,
        defaultFirstOption: true,
        filterable: true,
        placeholder: (__VLS_ctx.$t('views.document.setRules.patterns.placeholder')),
    }));
    const __VLS_79 = __VLS_78({
        modelValue: (__VLS_ctx.form.patterns),
        multiple: true,
        reserveKeyword: (false),
        allowCreate: true,
        defaultFirstOption: true,
        filterable: true,
        placeholder: (__VLS_ctx.$t('views.document.setRules.patterns.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    const { default: __VLS_82 } = __VLS_80.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.splitPatternList))) {
        let __VLS_83;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
            key: (index),
            label: (item.key),
            value: (item.value),
        }));
        const __VLS_85 = __VLS_84({
            key: (index),
            label: (item.key),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_84));
        // @ts-ignore
        [$t, form, splitPatternList,];
    }
    // @ts-ignore
    [];
    var __VLS_80;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-item mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "title mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('views.document.setRules.limit.label'));
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
    elSlider;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.form.limit),
        showInput: true,
        showInputControls: (false),
        min: (50),
        max: (100000),
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.form.limit),
        showInput: true,
        showInputControls: (false),
        min: (50),
        max: (100000),
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-item mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "title mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('views.document.setRules.with_filter.label'));
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        size: "small",
        modelValue: (__VLS_ctx.form.with_filter),
    }));
    const __VLS_95 = __VLS_94({
        size: "small",
        modelValue: (__VLS_ctx.form.with_filter),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        type: "info",
    }));
    const __VLS_100 = __VLS_99({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const { default: __VLS_103 } = __VLS_101.slots;
    (__VLS_ctx.$t('views.document.setRules.with_filter.text'));
    // @ts-ignore
    [$t, $t, $t, form, form,];
    var __VLS_101;
    // @ts-ignore
    [];
    var __VLS_63;
}
// @ts-ignore
[];
var __VLS_45;
// @ts-ignore
[];
var __VLS_21;
// @ts-ignore
[];
var __VLS_15;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.checkedConnect),
    ...{ style: {} },
}));
const __VLS_106 = __VLS_105({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.checkedConnect),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_109;
const __VLS_110 = {
    /** @type {typeof __VLS_109.change} */
    onChange: (__VLS_ctx.changeHandle),
};
const { default: __VLS_111 } = __VLS_107.slots;
(__VLS_ctx.$t('views.document.setRules.checkedConnect.label'));
// @ts-ignore
[$t, checkedConnect, changeHandle,];
var __VLS_107;
var __VLS_108;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-right mt-8" },
});
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    ...{ 'onClick': {} },
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = {
    /** @type {typeof __VLS_117.click} */
    onClick: (__VLS_ctx.splitDocument),
};
const { default: __VLS_119 } = __VLS_115.slots;
(__VLS_ctx.$t('views.document.buttons.preview'));
// @ts-ignore
[$t, splitDocument,];
var __VLS_115;
var __VLS_116;
// @ts-ignore
[];
var __VLS_9;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    span: (14),
    ...{ class: "p-24 border-l" },
}));
const __VLS_122 = __VLS_121({
    span: (14),
    ...{ class: "p-24 border-l" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l']} */ ;
const { default: __VLS_125 } = __VLS_123.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.document.setRules.title.preview'));
const __VLS_126 = ParagraphPreview;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    data: (__VLS_ctx.paragraphList),
    isConnect: (__VLS_ctx.checkedConnect),
    knowledgeId: (__VLS_ctx.id),
}));
const __VLS_128 = __VLS_127({
    data: (__VLS_ctx.paragraphList),
    isConnect: (__VLS_ctx.checkedConnect),
    knowledgeId: (__VLS_ctx.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
// @ts-ignore
[$t, checkedConnect, vLoading, loading, paragraphList, id,];
var __VLS_123;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
