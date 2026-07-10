/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseForm from '@/views/knowledge/component/BaseForm.vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const { params: { id, folderId }, } = route;
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
const isShared = computed(() => {
    return folderId === 'share';
});
const webFormRef = ref();
const BaseFormRef = ref();
const loading = ref(false);
const detail = ref({});
const cloneModelId = ref('');
const form = ref({
    source_url: '',
    selector: '',
    app_id: '',
    app_secret: '',
    folder_token: '',
    file_count_limit: 50,
    file_size_limit: 100,
});
const rules = reactive({
    source_url: [
        {
            required: true,
            message: t('views.knowledge.form.source_url.requiredMessage'),
            trigger: 'blur',
        },
    ],
    app_id: [
        {
            required: true,
            message: t('views.application.applicationAccess.larkSetting.appIdPlaceholder'),
            trigger: 'blur',
        },
    ],
    app_secret: [
        {
            required: true,
            message: t('views.application.applicationAccess.larkSetting.appSecretPlaceholder'),
            trigger: 'blur',
        },
    ],
    folder_token: [
        {
            required: true,
            message: t('views.application.applicationAccess.larkSetting.folderTokenPlaceholder'),
            trigger: 'blur',
        },
    ],
});
async function submit() {
    if (await BaseFormRef.value?.validate()) {
        await webFormRef.value.validate((valid) => {
            if (valid) {
                const obj = detail.value.type === 1 || detail.value.type === 2
                    ? {
                        meta: form.value,
                        file_count_limit: form.value.file_count_limit,
                        file_size_limit: form.value.file_size_limit,
                        ...BaseFormRef.value.form,
                    }
                    : {
                        file_count_limit: form.value.file_count_limit,
                        file_size_limit: form.value.file_size_limit,
                        ...BaseFormRef.value.form,
                    };
                if (cloneModelId.value !== BaseFormRef.value.form.embedding_model_id) {
                    MsgConfirm(t('common.tip'), t('views.knowledge.tip.updateModeMessage'), {
                        confirmButtonText: t('views.knowledge.setting.vectorization'),
                    })
                        .then(() => {
                        if (detail.value.type === 2) {
                            loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                                .putLarkKnowledge(id, obj, loading)
                                .then(() => {
                                loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                                    .putReEmbeddingKnowledge(id)
                                    .then(() => {
                                    MsgSuccess(t('common.saveSuccess'));
                                });
                            });
                        }
                        else {
                            loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                                .putKnowledge(id, obj, loading)
                                .then(() => {
                                loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                                    .putReEmbeddingKnowledge(id)
                                    .then(() => {
                                    MsgSuccess(t('common.saveSuccess'));
                                });
                            });
                        }
                    })
                        .catch(() => { });
                }
                else {
                    if (detail.value.type === 2) {
                        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                            .putLarkKnowledge(id, obj, loading)
                            .then(() => {
                            MsgSuccess(t('common.saveSuccess'));
                        });
                    }
                    else {
                        loadSharedApi({ type: 'knowledge', systemType: apiType.value })
                            .putKnowledge(id, obj, loading)
                            .then(() => {
                            MsgSuccess(t('common.saveSuccess'));
                        });
                    }
                }
            }
        });
    }
}
function getDetail() {
    loadSharedApi({ type: 'knowledge', isShared: isShared.value, systemType: apiType.value })
        .getKnowledgeDetail(id, loading)
        .then((res) => {
        detail.value = res.data;
        cloneModelId.value = res.data?.embedding_model_id;
        if (detail.value?.type === 0) {
            form.value.file_count_limit = res.data.file_count_limit;
            form.value.file_size_limit = res.data.file_size_limit;
        }
        if (detail.value?.type === 1 || detail.value?.type === 2) {
            form.value = res.data.meta;
        }
    });
}
onMounted(() => {
    getDetail();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('common.setting'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "knowledge-setting main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['knowledge-setting']} */ ;
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('common.info'));
const __VLS_12 = BaseForm;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ref: "BaseFormRef",
    data: (__VLS_ctx.detail),
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_14 = __VLS_13({
    ref: "BaseFormRef",
    data: (__VLS_ctx.detail),
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_17;
var __VLS_15;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ref: "webFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_21 = __VLS_20({
    ref: "webFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_24;
const { default: __VLS_26 } = __VLS_22.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    label: (__VLS_ctx.$t('views.knowledge.knowledgeType.label')),
    required: true,
}));
const __VLS_29 = __VLS_28({
    label: (__VLS_ctx.$t('views.knowledge.knowledgeType.label')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
if (__VLS_ctx.detail?.type === 0) {
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }));
    const __VLS_35 = __VLS_34({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    const { default: __VLS_38 } = __VLS_36.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ class: "mr-8 avatar-blue" },
        shape: "square",
        size: (32),
    }));
    const __VLS_41 = __VLS_40({
        ...{ class: "mr-8 avatar-blue" },
        shape: "square",
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['avatar-blue']} */ ;
    const { default: __VLS_44 } = __VLS_42.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/icon_document.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [$t, $t, $t, vLoading, loading, detail, detail, apiType, rules, form,];
    var __VLS_42;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.$t('views.knowledge.knowledgeType.generalKnowledge'));
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        type: "info",
    }));
    const __VLS_47 = __VLS_46({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const { default: __VLS_50 } = __VLS_48.slots;
    (__VLS_ctx.$t('views.knowledge.knowledgeType.generalInfo'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_48;
    // @ts-ignore
    [];
    var __VLS_36;
}
if (__VLS_ctx.detail?.type === 1) {
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }));
    const __VLS_53 = __VLS_52({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    const { default: __VLS_56 } = __VLS_54.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ class: "mr-8 avatar-purple" },
        shape: "square",
        size: (32),
    }));
    const __VLS_59 = __VLS_58({
        ...{ class: "mr-8 avatar-purple" },
        shape: "square",
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
    const { default: __VLS_62 } = __VLS_60.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/icon_web.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [detail,];
    var __VLS_60;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.$t('views.knowledge.knowledgeType.webKnowledge'));
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        type: "info",
    }));
    const __VLS_65 = __VLS_64({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_68 } = __VLS_66.slots;
    (__VLS_ctx.$t('views.knowledge.knowledgeType.webInfo'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_66;
    // @ts-ignore
    [];
    var __VLS_54;
}
if (__VLS_ctx.detail?.type === 2) {
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }));
    const __VLS_71 = __VLS_70({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    const { default: __VLS_74 } = __VLS_72.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        ...{ class: "mr-8" },
        shape: "square",
        size: (32),
        ...{ style: {} },
    }));
    const __VLS_77 = __VLS_76({
        ...{ class: "mr-8" },
        shape: "square",
        size: (32),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    const { default: __VLS_80 } = __VLS_78.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/logo_lark.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [detail,];
    var __VLS_78;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({}));
    const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
    const { default: __VLS_86 } = __VLS_84.slots;
    (__VLS_ctx.$t('views.knowledge.knowledgeType.larkKnowledge'));
    // @ts-ignore
    [$t,];
    var __VLS_84;
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        type: "info",
    }));
    const __VLS_89 = __VLS_88({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    const { default: __VLS_92 } = __VLS_90.slots;
    (__VLS_ctx.$t('views.knowledge.knowledgeType.larkInfo'));
    // @ts-ignore
    [$t,];
    var __VLS_90;
    // @ts-ignore
    [];
    var __VLS_72;
}
if (__VLS_ctx.detail?.type === 4) {
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }));
    const __VLS_95 = __VLS_94({
        shadow: "never",
        ...{ class: "mb-8 w-full layout-bg" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    const { default: __VLS_98 } = __VLS_96.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_99;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        ...{ class: "mr-8 avatar-purple" },
        shape: "square",
        size: (32),
    }));
    const __VLS_101 = __VLS_100({
        ...{ class: "mr-8 avatar-purple" },
        shape: "square",
        size: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
    const { default: __VLS_104 } = __VLS_102.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/workflow/logo_workflow.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [detail,];
    var __VLS_102;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    let __VLS_105;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
    const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
    const { default: __VLS_110 } = __VLS_108.slots;
    (__VLS_ctx.$t('views.knowledge.knowledgeType.workflowKnowledge'));
    // @ts-ignore
    [$t,];
    var __VLS_108;
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        type: "info",
    }));
    const __VLS_113 = __VLS_112({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    const { default: __VLS_116 } = __VLS_114.slots;
    (__VLS_ctx.$t('views.knowledge.knowledgeType.workflowInfo'));
    // @ts-ignore
    [$t,];
    var __VLS_114;
    // @ts-ignore
    [];
    var __VLS_96;
}
// @ts-ignore
[];
var __VLS_30;
if (__VLS_ctx.detail?.type === 1) {
    let __VLS_117;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
        label: (__VLS_ctx.$t('views.knowledge.form.source_url.label')),
        prop: "source_url",
    }));
    const __VLS_119 = __VLS_118({
        label: (__VLS_ctx.$t('views.knowledge.form.source_url.label')),
        prop: "source_url",
    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
    const { default: __VLS_122 } = __VLS_120.slots;
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.form.source_url),
        placeholder: (__VLS_ctx.$t('views.knowledge.form.source_url.placeholder')),
    }));
    const __VLS_125 = __VLS_124({
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.form.source_url),
        placeholder: (__VLS_ctx.$t('views.knowledge.form.source_url.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    let __VLS_128;
    const __VLS_129 = {
        /** @type {typeof __VLS_128.blur} */
        onBlur: (...[$event]) => {
            if (!(__VLS_ctx.detail?.type === 1))
                throw 0;
            return __VLS_ctx.form.source_url = __VLS_ctx.form.source_url.trim();
            // @ts-ignore
            [$t, $t, detail, form, form, form,];
        },
    };
    var __VLS_126;
    var __VLS_127;
    // @ts-ignore
    [];
    var __VLS_120;
}
if (__VLS_ctx.detail?.type === 1) {
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        label: (__VLS_ctx.$t('views.knowledge.form.selector.label')),
    }));
    const __VLS_132 = __VLS_131({
        label: (__VLS_ctx.$t('views.knowledge.form.selector.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    const { default: __VLS_135 } = __VLS_133.slots;
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.form.selector),
        placeholder: (__VLS_ctx.$t('views.knowledge.form.selector.placeholder')),
    }));
    const __VLS_138 = __VLS_137({
        ...{ 'onBlur': {} },
        modelValue: (__VLS_ctx.form.selector),
        placeholder: (__VLS_ctx.$t('views.knowledge.form.selector.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_141;
    const __VLS_142 = {
        /** @type {typeof __VLS_141.blur} */
        onBlur: (...[$event]) => {
            if (!(__VLS_ctx.detail?.type === 1))
                throw 0;
            return __VLS_ctx.form.selector = __VLS_ctx.form.selector.trim();
            // @ts-ignore
            [$t, $t, detail, form, form, form,];
        },
    };
    var __VLS_139;
    var __VLS_140;
    // @ts-ignore
    [];
    var __VLS_133;
}
if (__VLS_ctx.detail?.type === 2) {
    let __VLS_143;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
        label: "App ID",
        prop: "app_id",
    }));
    const __VLS_145 = __VLS_144({
        label: "App ID",
        prop: "app_id",
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    const { default: __VLS_148 } = __VLS_146.slots;
    let __VLS_149;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
        modelValue: (__VLS_ctx.form.app_id),
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appIdPlaceholder')),
    }));
    const __VLS_151 = __VLS_150({
        modelValue: (__VLS_ctx.form.app_id),
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appIdPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    // @ts-ignore
    [$t, detail, form,];
    var __VLS_146;
}
if (__VLS_ctx.detail?.type === 2) {
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        label: "App Secret",
        prop: "app_id",
    }));
    const __VLS_156 = __VLS_155({
        label: "App Secret",
        prop: "app_id",
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    const { default: __VLS_159 } = __VLS_157.slots;
    let __VLS_160;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
        modelValue: (__VLS_ctx.form.app_secret),
        type: "password",
        showPassword: true,
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appSecretPlaceholder')),
    }));
    const __VLS_162 = __VLS_161({
        modelValue: (__VLS_ctx.form.app_secret),
        type: "password",
        showPassword: true,
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.appSecretPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    // @ts-ignore
    [$t, detail, form,];
    var __VLS_157;
}
if (__VLS_ctx.detail?.type === 2) {
    let __VLS_165;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        label: "Folder Token",
        prop: "folder_token",
    }));
    const __VLS_167 = __VLS_166({
        label: "Folder Token",
        prop: "folder_token",
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    const { default: __VLS_170 } = __VLS_168.slots;
    let __VLS_171;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        modelValue: (__VLS_ctx.form.folder_token),
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.folderTokenPlaceholder')),
    }));
    const __VLS_173 = __VLS_172({
        modelValue: (__VLS_ctx.form.folder_token),
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.folderTokenPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    // @ts-ignore
    [$t, detail, form,];
    var __VLS_168;
}
if (__VLS_ctx.detail?.type === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    (__VLS_ctx.$t('common.otherSetting'));
    let __VLS_176;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
        label: (__VLS_ctx.$t('views.knowledge.form.file_count_limit.label')),
    }));
    const __VLS_178 = __VLS_177({
        label: (__VLS_ctx.$t('views.knowledge.form.file_count_limit.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    const { default: __VLS_181 } = __VLS_179.slots;
    let __VLS_182;
    /** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
    elSlider;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
        modelValue: (__VLS_ctx.form.file_count_limit),
        showInput: true,
        showInputControls: (false),
        min: (1),
        max: (1000),
        ...{ class: "custom-slider" },
    }));
    const __VLS_184 = __VLS_183({
        modelValue: (__VLS_ctx.form.file_count_limit),
        showInput: true,
        showInputControls: (false),
        min: (1),
        max: (1000),
        ...{ class: "custom-slider" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    /** @type {__VLS_StyleScopedClasses['custom-slider']} */ ;
    // @ts-ignore
    [$t, $t, detail, form,];
    var __VLS_179;
    let __VLS_187;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({}));
    const __VLS_189 = __VLS_188({}, ...__VLS_functionalComponentArgsRest(__VLS_188));
    const { default: __VLS_192 } = __VLS_190.slots;
    {
        const { label: __VLS_193 } = __VLS_190.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.knowledge.form.file_size_limit.label'));
        let __VLS_194;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
            effect: "dark",
            content: (__VLS_ctx.$t('views.knowledge.form.file_size_limit.placeholder')),
            placement: "right",
        }));
        const __VLS_196 = __VLS_195({
            effect: "dark",
            content: (__VLS_ctx.$t('views.knowledge.form.file_size_limit.placeholder')),
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_195));
        const { default: __VLS_199 } = __VLS_197.slots;
        let __VLS_200;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_202 = __VLS_201({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [$t, $t,];
        var __VLS_197;
        // @ts-ignore
        [];
    }
    let __VLS_205;
    /** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
    elSlider;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
        modelValue: (__VLS_ctx.form.file_size_limit),
        showInput: true,
        showInputControls: (false),
        min: (1),
        max: (1000),
        ...{ class: "custom-slider" },
    }));
    const __VLS_207 = __VLS_206({
        modelValue: (__VLS_ctx.form.file_size_limit),
        showInput: true,
        showInputControls: (false),
        min: (1),
        max: (1000),
        ...{ class: "custom-slider" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    /** @type {__VLS_StyleScopedClasses['custom-slider']} */ ;
    // @ts-ignore
    [form,];
    var __VLS_190;
}
// @ts-ignore
[];
var __VLS_22;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-right" },
});
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
if (!__VLS_ctx.route.path.includes('share/') && __VLS_ctx.permissionPrecise.edit(__VLS_ctx.id)) {
    let __VLS_210;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_212 = __VLS_211({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_211));
    let __VLS_215;
    const __VLS_216 = {
        /** @type {typeof __VLS_215.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_217 } = __VLS_213.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, route, permissionPrecise, id, submit,];
    var __VLS_213;
    var __VLS_214;
}
// @ts-ignore
[];
var __VLS_9;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_18 = __VLS_17, __VLS_25 = __VLS_24;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
