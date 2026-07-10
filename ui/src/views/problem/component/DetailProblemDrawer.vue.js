/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import ParagraphDialog from '@/views/paragraph/component/ParagraphDialog.vue';
import RelateProblemDialog from './RelateProblemDialog.vue';
import { MsgSuccess, MsgError } from '@/utils/message';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
import { t } from '@/locales';
const props = withDefaults(defineProps(), {});
const emit = defineEmits(['update:currentId', 'update:currentContent', 'refresh']);
const route = useRoute();
const { params: { id }, } = route;
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
    return permissionMap['knowledge'][apiType.value];
});
const RelateProblemDialogRef = ref();
const ParagraphDialogRef = ref();
const loading = ref(false);
const visible = ref(false);
const paragraphList = ref([]);
function disassociation(item) {
    const obj = {
        paragraph_id: item.id,
        problem_id: props.currentId,
    };
    loadSharedApi({ type: 'paragraph', systemType: apiType.value })
        .putDisassociationProblem(item.knowledge_id, item.document_id, obj, loading)
        .then(() => {
        getRecord();
    });
}
function relateProblem() {
    RelateProblemDialogRef.value.open([props.currentId]);
}
function editParagraph(row) {
    ParagraphDialogRef.value.open(row, 'edit');
}
function editName(val) {
    if (val) {
        const obj = {
            content: val,
        };
        loadSharedApi({ type: 'problem', systemType: apiType.value })
            .putProblems(id, props.currentId, obj, loading)
            .then(() => {
            emit('update:currentContent', val);
            MsgSuccess(t('common.modifySuccess'));
        });
    }
    else {
        MsgError(t('views.problem.tip.errorMessage'));
    }
}
function closeHandle() {
    paragraphList.value = [];
}
function getRecord() {
    if (props.currentId && visible.value) {
        loadSharedApi({ type: 'problem', systemType: apiType.value })
            .getDetailProblems(id, props.currentId, loading)
            .then((res) => {
            paragraphList.value = res.data;
        });
    }
}
function refresh() {
    getRecord();
}
watch(() => props.currentId, () => {
    paragraphList.value = [];
    getRecord();
});
watch(visible, (bool) => {
    if (!bool) {
        emit('update:currentId', '');
        emit('update:currentContent', '');
        emit('refresh');
    }
});
const open = () => {
    getRecord();
    visible.value = true;
};
const __VLS_exposed = {
    open,
};
defineExpose(__VLS_exposed);
const __VLS_defaults = {};
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
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    size: "60%",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    size: "60%",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.close} */
    onClose: (__VLS_ctx.closeHandle),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
{
    const { header: __VLS_9 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.problem.detailProblem'));
    // @ts-ignore
    [visible, closeHandle, $t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
}));
const __VLS_18 = __VLS_17({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_21;
const __VLS_22 = {
    /** @type {typeof __VLS_21.submit} */
    onSubmit: () => { },
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_23 } = __VLS_19.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    label: (__VLS_ctx.$t('views.problem.title')),
}));
const __VLS_26 = __VLS_25({
    label: (__VLS_ctx.$t('views.problem.title')),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.ReadWrite} */
ReadWrite;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onChange': {} },
    data: (__VLS_ctx.currentContent),
    showEditIcon: (__VLS_ctx.permissionPrecise.problem_edit(__VLS_ctx.id)),
    maxlength: (256),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onChange': {} },
    data: (__VLS_ctx.currentContent),
    showEditIcon: (__VLS_ctx.permissionPrecise.problem_edit(__VLS_ctx.id)),
    maxlength: (256),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.change} */
    onChange: (__VLS_ctx.editName),
};
var __VLS_33;
var __VLS_34;
// @ts-ignore
[$t, vLoading, loading, currentContent, permissionPrecise, id, editName,];
var __VLS_27;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    label: (__VLS_ctx.$t('views.problem.relateParagraph.title')),
}));
const __VLS_39 = __VLS_38({
    label: (__VLS_ctx.$t('views.problem.relateParagraph.title')),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.paragraphList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
    CardBox;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onClick': {} },
        title: (item.title || '-'),
        ...{ class: "cursor mb-8 w-full" },
        showIcon: (false),
        ...{ style: {} },
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClick': {} },
        title: (item.title || '-'),
        ...{ class: "cursor mb-8 w-full" },
        showIcon: (false),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id) && __VLS_ctx.editParagraph(item);
            // @ts-ignore
            [$t, permissionPrecise, id, paragraphList, editParagraph,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_50 } = __VLS_46.slots;
    {
        const { tag: __VLS_51 } = __VLS_46.slots;
        let __VLS_52;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
            effect: "dark",
            content: (__VLS_ctx.$t('views.problem.setting.cancelRelated')),
            placement: "top",
        }));
        const __VLS_54 = __VLS_53({
            effect: "dark",
            content: (__VLS_ctx.$t('views.problem.setting.cancelRelated')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        const { default: __VLS_57 } = __VLS_55.slots;
        if (__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id)) {
            let __VLS_58;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }));
            const __VLS_60 = __VLS_59({
                ...{ 'onClick': {} },
                type: "primary",
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_59));
            let __VLS_63;
            const __VLS_64 = {
                /** @type {typeof __VLS_63.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.permissionPrecise.problem_relate(__VLS_ctx.id)))
                        throw 0;
                    return __VLS_ctx.disassociation(item);
                    // @ts-ignore
                    [$t, permissionPrecise, id, disassociation,];
                },
            };
            const { default: __VLS_65 } = __VLS_61.slots;
            let __VLS_66;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
                iconName: "app-quxiaoguanlian",
            }));
            const __VLS_68 = __VLS_67({
                iconName: "app-quxiaoguanlian",
            }, ...__VLS_functionalComponentArgsRest(__VLS_67));
            // @ts-ignore
            [];
            var __VLS_61;
            var __VLS_62;
        }
        // @ts-ignore
        [];
        var __VLS_55;
        // @ts-ignore
        [];
    }
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        height: "110",
    }));
    const __VLS_73 = __VLS_72({
        height: "110",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    const { default: __VLS_76 } = __VLS_74.slots;
    (item.content);
    // @ts-ignore
    [];
    var __VLS_74;
    {
        const { footer: __VLS_77 } = __VLS_46.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "footer-content flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['footer-content']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        let __VLS_78;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({}));
        const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
        const { default: __VLS_83 } = __VLS_81.slots;
        let __VLS_84;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({}));
        const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
        const { default: __VLS_89 } = __VLS_87.slots;
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.Document} */
        Document;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({}));
        const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
        // @ts-ignore
        [];
        var __VLS_87;
        (item?.document_name);
        // @ts-ignore
        [];
        var __VLS_81;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_46;
    var __VLS_47;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_40;
// @ts-ignore
[];
var __VLS_19;
var __VLS_20;
// @ts-ignore
[];
var __VLS_13;
const __VLS_95 = ParagraphDialog;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.$t('views.paragraph.editParagraph')),
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_97 = __VLS_96({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.$t('views.paragraph.editParagraph')),
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
let __VLS_100;
const __VLS_101 = {
    /** @type {typeof __VLS_100.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_102;
var __VLS_98;
var __VLS_99;
const __VLS_104 = RelateProblemDialog;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    ...{ 'onRefresh': {} },
    ref: "RelateProblemDialogRef",
}));
const __VLS_106 = __VLS_105({
    ...{ 'onRefresh': {} },
    ref: "RelateProblemDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_109;
const __VLS_110 = {
    /** @type {typeof __VLS_109.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_111;
var __VLS_107;
var __VLS_108;
{
    const { footer: __VLS_113 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
        let __VLS_114;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
            ...{ 'onClick': {} },
        }));
        const __VLS_116 = __VLS_115({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        let __VLS_119;
        const __VLS_120 = {
            /** @type {typeof __VLS_119.click} */
            onClick: (__VLS_ctx.relateProblem),
        };
        const { default: __VLS_121 } = __VLS_117.slots;
        (__VLS_ctx.$t('views.problem.relateParagraph.title'));
        // @ts-ignore
        [$t, $t, permissionPrecise, id, apiType, refresh, refresh, relateProblem,];
        var __VLS_117;
        var __VLS_118;
    }
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.pre_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_127;
    const __VLS_128 = {
        /** @type {typeof __VLS_127.click} */
        onClick: (__VLS_ctx.pre),
    };
    const { default: __VLS_129 } = __VLS_125.slots;
    (__VLS_ctx.$t('common.pages.prev'));
    // @ts-ignore
    [$t, loading, pre_disable, pre,];
    var __VLS_125;
    var __VLS_126;
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }));
    const __VLS_132 = __VLS_131({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.next_disable || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    let __VLS_135;
    const __VLS_136 = {
        /** @type {typeof __VLS_135.click} */
        onClick: (__VLS_ctx.next),
    };
    const { default: __VLS_137 } = __VLS_133.slots;
    (__VLS_ctx.$t('common.pages.next'));
    // @ts-ignore
    [$t, loading, next_disable, next,];
    var __VLS_133;
    var __VLS_134;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_103 = __VLS_102, __VLS_112 = __VLS_111;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
