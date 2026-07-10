/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import ParagraphCard from '@/components/ai-chat/component/knowledge-source-component/ParagraphCard.vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { iconComponent } from '@/workflow/icons/utils';
import { WorkflowType } from '@/enums/application';
import { getImgUrl } from '@/utils/common';
import { arraySort } from '@/utils/array';
import ExecutionDetailCard from '@/components/execution-detail-card/index.vue';
import MdRenderer from '@/components/markdown/MdRenderer.vue';
import { t } from '@/locales';
const props = defineProps({
    data: {
        type: Object,
        default: null,
    },
    type: {
        type: String,
        default: 'application',
    },
});
const isKnowLedge = computed(() => props.type === 'knowledge');
const currentLoopNode = ref(0);
const currentParagraph = ref(0);
const currentWriteContent = ref(0);
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
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "mb-8 execution-detail-card" },
    shadow: "never",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "mb-8 execution-detail-card" },
    shadow: "never",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['execution-detail-card']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.data['show'] = !__VLS_ctx.data['show'];
            // @ts-ignore
            [data, data,];
        } },
    ...{ class: "flex-between cursor" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.data['show'] ? 'rotate-90' : '') },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.data['show'] ? 'rotate-90' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
CaretRight;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
// @ts-ignore
[data,];
var __VLS_10;
const __VLS_18 = (__VLS_ctx.iconComponent(`${__VLS_ctx.data.type}-icon`));
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ class: "mr-8" },
    size: (24),
    item: (__VLS_ctx.data.info),
}));
const __VLS_20 = __VLS_19({
    ...{ class: "mr-8" },
    size: (24),
    item: (__VLS_ctx.data.info),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.data.name);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.Question ||
    __VLS_ctx.data.type === __VLS_ctx.WorkflowType.AiChat ||
    __VLS_ctx.data.type === __VLS_ctx.WorkflowType.ImageUnderstandNode ||
    __VLS_ctx.data.type === __VLS_ctx.WorkflowType.ImageGenerateNode ||
    __VLS_ctx.data.type === __VLS_ctx.WorkflowType.Application ||
    __VLS_ctx.data.type == __VLS_ctx.WorkflowType.IntentNode ||
    __VLS_ctx.data.type === __VLS_ctx.WorkflowType.VideoUnderstandNode) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-16 color-secondary" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    (__VLS_ctx.data?.message_tokens + __VLS_ctx.data?.answer_tokens);
}
if (__VLS_ctx.data.status != 202) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-16 color-secondary" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    (__VLS_ctx.data?.run_time?.toFixed(2) || 0.0);
}
if (__VLS_ctx.data.status === 200) {
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ class: "color-success" },
        size: (16),
    }));
    const __VLS_25 = __VLS_24({
        ...{ class: "color-success" },
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
    const { default: __VLS_28 } = __VLS_26.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.CircleCheck} */
    CircleCheck;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
    const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
    // @ts-ignore
    [data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, iconComponent, WorkflowType, WorkflowType, WorkflowType, WorkflowType, WorkflowType, WorkflowType, WorkflowType,];
    var __VLS_26;
}
else if (__VLS_ctx.data.status === 202) {
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ class: "is-loading" },
        size: (16),
    }));
    const __VLS_36 = __VLS_35({
        ...{ class: "is-loading" },
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    const { default: __VLS_39 } = __VLS_37.slots;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
    const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [data,];
    var __VLS_37;
}
else {
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        ...{ class: "color-danger" },
        size: (16),
    }));
    const __VLS_47 = __VLS_46({
        ...{ class: "color-danger" },
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    const { default: __VLS_50 } = __VLS_48.slots;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.CircleClose} */
    CircleClose;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({}));
    const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
    // @ts-ignore
    [];
    var __VLS_48;
}
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const { default: __VLS_61 } = __VLS_59.slots;
if (__VLS_ctx.data['show']) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    if (__VLS_ctx.data.status === 200 || __VLS_ctx.data.type == __VLS_ctx.WorkflowType.LoopNode) {
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.Start || __VLS_ctx.data.type === __VLS_ctx.WorkflowType.Application) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('aiChat.paragraphSource.question'));
            (__VLS_ctx.data.question || '-');
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.global_fields))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (f.label);
                (f.value);
                // @ts-ignore
                [data, data, data, data, data, data, data, WorkflowType, WorkflowType, WorkflowType, $t, $t,];
            }
            if (__VLS_ctx.data.document_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "mb-8 color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.fileUpload.document'));
                let __VLS_62;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
                    wrap: true,
                }));
                const __VLS_64 = __VLS_63({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_63));
                const { default: __VLS_67 } = __VLS_65.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.document_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    let __VLS_68;
                    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
                    elCard;
                    // @ts-ignore
                    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
                        shadow: "never",
                        ...{ style: {} },
                        ...{ class: "file cursor" },
                    }));
                    const __VLS_70 = __VLS_69({
                        shadow: "never",
                        ...{ style: {} },
                        ...{ class: "file cursor" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
                    /** @type {__VLS_StyleScopedClasses['file']} */ ;
                    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                    const { default: __VLS_73 } = __VLS_71.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex align-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: (__VLS_ctx.getImgUrl(f && f?.name)),
                        alt: "",
                        width: "24",
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "ml-4 ellipsis" },
                        title: (f && f?.name),
                    });
                    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
                    (f && f?.name);
                    // @ts-ignore
                    [data, data, $t, getImgUrl,];
                    var __VLS_71;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_65;
            }
            if (__VLS_ctx.data.image_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "mb-8 color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.fileUpload.image'));
                let __VLS_74;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
                    wrap: true,
                }));
                const __VLS_76 = __VLS_75({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_75));
                const { default: __VLS_79 } = __VLS_77.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.image_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    let __VLS_80;
                    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                    elImage;
                    // @ts-ignore
                    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                        src: (f.url),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.image_list.map((img) => img.url)),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }));
                    const __VLS_82 = __VLS_81({
                        src: (f.url),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.image_list.map((img) => img.url)),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, data, $t,];
                }
                // @ts-ignore
                [];
                var __VLS_77;
            }
            if (__VLS_ctx.data.audio_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "mb-8 color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('aiChat.executionDetails.audioFile'));
                let __VLS_85;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
                    wrap: true,
                }));
                const __VLS_87 = __VLS_86({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_86));
                const { default: __VLS_90 } = __VLS_88.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.audio_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.audio)({
                        src: (f.url),
                        controls: true,
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                    });
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, $t,];
                }
                // @ts-ignore
                [];
                var __VLS_88;
            }
            if (__VLS_ctx.data.video_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "mb-8 color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.fileUpload.video'));
                let __VLS_91;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
                    wrap: true,
                }));
                const __VLS_93 = __VLS_92({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_92));
                const { default: __VLS_96 } = __VLS_94.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.video_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                        src: (f.url),
                        ...{ style: {} },
                        controls: true,
                        autoplay: true,
                        ...{ class: "border-r-6" },
                    });
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, $t,];
                }
                // @ts-ignore
                [];
                var __VLS_94;
            }
            if (__VLS_ctx.data.other_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "mb-8 color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.fileUpload.other'));
                let __VLS_97;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
                    wrap: true,
                }));
                const __VLS_99 = __VLS_98({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_98));
                const { default: __VLS_102 } = __VLS_100.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.other_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    let __VLS_103;
                    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
                    elCard;
                    // @ts-ignore
                    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
                        shadow: "never",
                        ...{ style: {} },
                        ...{ class: "file cursor" },
                    }));
                    const __VLS_105 = __VLS_104({
                        shadow: "never",
                        ...{ style: {} },
                        ...{ class: "file cursor" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
                    /** @type {__VLS_StyleScopedClasses['file']} */ ;
                    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                    const { default: __VLS_108 } = __VLS_106.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex align-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: (__VLS_ctx.getImgUrl(f && f?.name)),
                        alt: "",
                        width: "24",
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "ml-4 ellipsis" },
                        title: (f && f?.name),
                    });
                    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
                    (f && f?.name);
                    // @ts-ignore
                    [data, data, $t, getImgUrl,];
                    var __VLS_106;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_100;
            }
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.SearchKnowledge) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.searchContent'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.data.question || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.searchResult'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.paragraph_list?.length > 0) {
                for (const [paragraph, paragraphIndex] of __VLS_vFor((__VLS_ctx.arraySort(__VLS_ctx.data.paragraph_list, 'similarity', true)))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (paragraphIndex),
                    });
                    const __VLS_109 = ParagraphCard;
                    // @ts-ignore
                    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
                        data: (paragraph),
                        content: (paragraph.content),
                        index: (paragraphIndex),
                    }));
                    const __VLS_111 = __VLS_110({
                        data: (paragraph),
                        content: (paragraph.content),
                        index: (paragraphIndex),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
                    // @ts-ignore
                    [data, data, data, data, WorkflowType, $t, $t, arraySort,];
                }
            }
            else {
            }
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.Condition) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.conditionResult'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.data.branch_name || '-');
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.AiChat) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('views.application.form.roleSettings.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.data.system || '-');
            if (!__VLS_ctx.isKnowLedge) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6 mt-8" },
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (__VLS_ctx.$t('aiChat.history'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                if (__VLS_ctx.data.history_message?.length > 0) {
                    for (const [history, historyIndex] of __VLS_vFor((__VLS_ctx.data.history_message))) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                            ...{ class: "mt-4 mb-4" },
                            key: (historyIndex),
                        });
                        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-secondary mr-4" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                        (history.role);
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                        (history.content);
                        // @ts-ignore
                        [data, data, data, data, data, data, WorkflowType, WorkflowType, $t, $t, $t, isKnowLedge,];
                    }
                }
                else {
                }
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.isKnowLedge
                ? __VLS_ctx.$t('views.application.form.prompt.label')
                : __VLS_ctx.$t('aiChat.executionDetails.currentChat'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            if (Array.isArray(__VLS_ctx.data.question)) {
                for (const [item, qIndex] of __VLS_vFor((__VLS_ctx.data.question))) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        key: (qIndex),
                    });
                    if (item.type === 'image_url') {
                        let __VLS_114;
                        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                        elImage;
                        // @ts-ignore
                        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
                            src: (item.image_url?.url || item.image_url),
                            alt: "",
                            fit: "cover",
                            ...{ style: {} },
                            ...{ class: "border-r-6 mb-8" },
                            zoomRate: (1.2),
                            maxScale: (7),
                            minScale: (0.2),
                        }));
                        const __VLS_116 = __VLS_115({
                            src: (item.image_url?.url || item.image_url),
                            alt: "",
                            fit: "cover",
                            ...{ style: {} },
                            ...{ class: "border-r-6 mb-8" },
                            zoomRate: (1.2),
                            maxScale: (7),
                            minScale: (0.2),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_115));
                        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                    }
                    else if (item.type === 'video_url') {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                            src: (item.video_url?.url || item.video_url),
                            ...{ style: {} },
                            ...{ class: "border-r-6 mb-8" },
                            autoplay: true,
                            controls: true,
                        });
                        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                    }
                    else if (item.type === 'text') {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                            ...{ class: "mb-8" },
                        });
                        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                        (item.text);
                    }
                    else {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                            ...{ class: "mb-8" },
                        });
                        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                        (item);
                    }
                    // @ts-ignore
                    [data, data, $t, $t, isKnowLedge,];
                }
            }
            else {
                (__VLS_ctx.data.question || '-');
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.think'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.reasoning_content || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.answer'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.answer) {
                const __VLS_119 = MdRenderer || MdRenderer;
                // @ts-ignore
                const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
                    source: (__VLS_ctx.data.answer),
                    noImgZoomIn: true,
                }));
                const __VLS_121 = __VLS_120({
                    source: (__VLS_ctx.data.answer),
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_120));
            }
            else {
            }
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.Question ||
            __VLS_ctx.data.type == __VLS_ctx.WorkflowType.Application ||
            __VLS_ctx.data.type == __VLS_ctx.WorkflowType.IntentNode) {
            if (__VLS_ctx.data.type !== __VLS_ctx.WorkflowType.Application) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (__VLS_ctx.$t('views.application.form.roleSettings.label'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.data.system || '-');
            }
            if (__VLS_ctx.data.type !== __VLS_ctx.WorkflowType.Application) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6 mt-8" },
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (__VLS_ctx.$t('aiChat.history'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                if (__VLS_ctx.data.history_message?.length > 0) {
                    for (const [history, historyIndex] of __VLS_vFor((__VLS_ctx.data.history_message))) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                            ...{ class: "mt-4 mb-4" },
                            key: (historyIndex),
                        });
                        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-secondary mr-4" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                        (history.role);
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                        (history.content);
                        // @ts-ignore
                        [data, data, data, data, data, data, data, data, data, data, data, data, WorkflowType, WorkflowType, WorkflowType, WorkflowType, WorkflowType, $t, $t, $t, $t,];
                    }
                }
                else {
                }
            }
            if (__VLS_ctx.data.type !== __VLS_ctx.WorkflowType.Application) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6 mt-8" },
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (__VLS_ctx.$t('aiChat.executionDetails.currentChat'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                (__VLS_ctx.data.question || '-');
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.Application
                ? __VLS_ctx.$t('common.param.outputParam')
                : __VLS_ctx.$t('aiChat.executionDetails.answer'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.answer) {
                let __VLS_124;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_126 = __VLS_125({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_125));
                var __VLS_129;
                var __VLS_127;
            }
            else {
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.Reply) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.replyContent'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            let __VLS_131;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
                height: "150",
            }));
            const __VLS_133 = __VLS_132({
                height: "150",
            }, ...__VLS_functionalComponentArgsRest(__VLS_132));
            const { default: __VLS_136 } = __VLS_134.slots;
            if (__VLS_ctx.data.answer) {
                let __VLS_137;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_139 = __VLS_138({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_138));
                var __VLS_142;
                var __VLS_140;
            }
            else {
            }
            // @ts-ignore
            [data, data, data, data, data, data, data, data, WorkflowType, WorkflowType, WorkflowType, $t, $t, $t, $t,];
            var __VLS_134;
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.DocumentExtractNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12 flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            let __VLS_144;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
                effect: "dark",
                content: (__VLS_ctx.$t('aiChat.executionDetails.paramOutputTooltip')),
                placement: "right",
            }));
            const __VLS_146 = __VLS_145({
                effect: "dark",
                content: (__VLS_ctx.$t('aiChat.executionDetails.paramOutputTooltip')),
                placement: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_145));
            const { default: __VLS_149 } = __VLS_147.slots;
            let __VLS_150;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
                iconName: "app-warning",
                ...{ class: "app-warning-icon" },
            }));
            const __VLS_152 = __VLS_151({
                iconName: "app-warning",
                ...{ class: "app-warning-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_151));
            /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
            // @ts-ignore
            [data, WorkflowType, $t, $t,];
            var __VLS_147;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            let __VLS_155;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
                height: "200",
            }));
            const __VLS_157 = __VLS_156({
                height: "200",
            }, ...__VLS_functionalComponentArgsRest(__VLS_156));
            const { default: __VLS_160 } = __VLS_158.slots;
            for (const [file_content, index] of __VLS_vFor((__VLS_ctx.data.content))) {
                let __VLS_161;
                /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
                elCard;
                // @ts-ignore
                const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
                    shadow: "never",
                    ...{ style: {} },
                    key: (index),
                    ...{ class: "mb-8" },
                }));
                const __VLS_163 = __VLS_162({
                    shadow: "never",
                    ...{ style: {} },
                    key: (index),
                    ...{ class: "mb-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_162));
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                const { default: __VLS_166 } = __VLS_164.slots;
                if (file_content) {
                    let __VLS_167;
                    /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                    MdPreview;
                    // @ts-ignore
                    const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
                        ref: "editorRef",
                        editorId: "preview-only",
                        modelValue: (file_content),
                        ...{ style: {} },
                        noImgZoomIn: true,
                    }));
                    const __VLS_169 = __VLS_168({
                        ref: "editorRef",
                        editorId: "preview-only",
                        modelValue: (file_content),
                        ...{ style: {} },
                        noImgZoomIn: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
                    var __VLS_172;
                    var __VLS_170;
                }
                else {
                }
                // @ts-ignore
                [data,];
                var __VLS_164;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_158;
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.SpeechToTextNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            if (__VLS_ctx.data.audio_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "mb-8 color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('aiChat.executionDetails.audioFile'));
                let __VLS_174;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
                    wrap: true,
                }));
                const __VLS_176 = __VLS_175({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_175));
                const { default: __VLS_179 } = __VLS_177.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.audio_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.audio)({
                        src: (f.url),
                        controls: true,
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                    });
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, data, WorkflowType, $t, $t,];
                }
                // @ts-ignore
                [];
                var __VLS_177;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [file_content, index] of __VLS_vFor((__VLS_ctx.data.content))) {
                let __VLS_180;
                /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
                elCard;
                // @ts-ignore
                const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
                    shadow: "never",
                    ...{ style: {} },
                    key: (index),
                    ...{ class: "mb-8" },
                }));
                const __VLS_182 = __VLS_181({
                    shadow: "never",
                    ...{ style: {} },
                    key: (index),
                    ...{ class: "mb-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_181));
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                const { default: __VLS_185 } = __VLS_183.slots;
                if (file_content) {
                    let __VLS_186;
                    /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                    MdPreview;
                    // @ts-ignore
                    const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
                        ref: "editorRef",
                        editorId: "preview-only",
                        modelValue: (file_content),
                        ...{ style: {} },
                        noImgZoomIn: true,
                    }));
                    const __VLS_188 = __VLS_187({
                        ref: "editorRef",
                        editorId: "preview-only",
                        modelValue: (file_content),
                        ...{ style: {} },
                        noImgZoomIn: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
                    var __VLS_191;
                    var __VLS_189;
                }
                else {
                }
                // @ts-ignore
                [data, $t,];
                var __VLS_183;
                // @ts-ignore
                [];
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.TextToSpeechNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "mb-8 color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.textContent'));
            if (__VLS_ctx.data.content) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                let __VLS_193;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.content),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_195 = __VLS_194({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.content),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_194));
                var __VLS_198;
                var __VLS_196;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "mb-8 color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.audioFile'));
            if (__VLS_ctx.data.answer) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalDirective(__VLS_directives.vHtml, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.data.answer) }, null, null);
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.ToolLib || __VLS_ctx.data.type === __VLS_ctx.WorkflowType.ToolLibCustom) {
            if (__VLS_ctx.data.index != 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6 mt-8" },
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (__VLS_ctx.$t('aiChat.executionDetails.input'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter break-all" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
                (__VLS_ctx.data.params || '-');
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.output'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter break-all" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
            (__VLS_ctx.data.result || '-');
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.RerankerNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.searchContent'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.data.question || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.rerankerContent'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.document_list?.length > 0) {
                for (const [paragraph, paragraphIndex] of __VLS_vFor((__VLS_ctx.data.document_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (paragraphIndex),
                    });
                    const __VLS_200 = ParagraphCard;
                    // @ts-ignore
                    const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
                        data: (paragraph.metadata),
                        content: (paragraph.page_content),
                        index: (paragraphIndex),
                    }));
                    const __VLS_202 = __VLS_201({
                        data: (paragraph.metadata),
                        content: (paragraph.page_content),
                        index: (paragraphIndex),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
                    // @ts-ignore
                    [data, data, data, data, data, data, data, data, data, data, data, data, data, data, WorkflowType, WorkflowType, WorkflowType, WorkflowType, $t, $t, $t, $t, $t, $t, $t, $t,];
                }
            }
            else {
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.rerankerResult'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.result_list?.length > 0) {
                for (const [paragraph, paragraphIndex] of __VLS_vFor((__VLS_ctx.data.result_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (paragraphIndex),
                    });
                    const __VLS_205 = ParagraphCard;
                    // @ts-ignore
                    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
                        data: (paragraph.metadata),
                        content: (paragraph.page_content),
                        index: (paragraphIndex),
                        score: (paragraph.metadata?.relevance_score),
                    }));
                    const __VLS_207 = __VLS_206({
                        data: (paragraph.metadata),
                        content: (paragraph.page_content),
                        index: (paragraphIndex),
                        score: (paragraph.metadata?.relevance_score),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
                    // @ts-ignore
                    [data, data, $t,];
                }
            }
            else {
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.FormNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ style: {} },
            });
            (__VLS_ctx.data.is_submit ? '' : `(${__VLS_ctx.$t('aiChat.executionDetails.noSubmit')})`);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            const __VLS_210 = DynamicsForm || DynamicsForm;
            // @ts-ignore
            const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
                disabled: (true),
                labelPosition: "top",
                requireAsteriskPosition: "right",
                ref: "dynamicsFormRef",
                render_data: (__VLS_ctx.data.form_field_list),
                labelSuffix: ":",
                modelValue: (__VLS_ctx.data.form_data),
                model: (__VLS_ctx.data.form_data),
            }));
            const __VLS_212 = __VLS_211({
                disabled: (true),
                labelPosition: "top",
                requireAsteriskPosition: "right",
                ref: "dynamicsFormRef",
                render_data: (__VLS_ctx.data.form_field_list),
                labelSuffix: ":",
                modelValue: (__VLS_ctx.data.form_data),
                model: (__VLS_ctx.data.form_data),
            }, ...__VLS_functionalComponentArgsRest(__VLS_211));
            var __VLS_215;
            var __VLS_213;
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.ImageUnderstandNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('views.application.form.roleSettings.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.data.system || '-');
            if (!__VLS_ctx.isKnowLedge) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6 mt-8" },
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (__VLS_ctx.$t('aiChat.history'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                if (__VLS_ctx.data.history_message?.length > 0) {
                    for (const [history, historyIndex] of __VLS_vFor((__VLS_ctx.data.history_message))) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                            ...{ class: "mt-4 mb-4" },
                            key: (historyIndex),
                        });
                        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-secondary mr-4" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                        (history.role);
                        if (Array.isArray(history.content)) {
                            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                            for (const [h, i] of __VLS_vFor((history.content))) {
                                __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                                    key: (i),
                                });
                                if (h.type === 'image_url') {
                                    let __VLS_217;
                                    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                                    elImage;
                                    // @ts-ignore
                                    const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
                                        src: (h.image_url.url),
                                        alt: "",
                                        fit: "cover",
                                        ...{ style: {} },
                                        ...{ class: "border-r-6 mr-8" },
                                        zoomRate: (1.2),
                                        maxScale: (7),
                                        minScale: (0.2),
                                    }));
                                    const __VLS_219 = __VLS_218({
                                        src: (h.image_url.url),
                                        alt: "",
                                        fit: "cover",
                                        ...{ style: {} },
                                        ...{ class: "border-r-6 mr-8" },
                                        zoomRate: (1.2),
                                        maxScale: (7),
                                        minScale: (0.2),
                                    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
                                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                                }
                                else {
                                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                                    (h.text);
                                    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                                }
                                // @ts-ignore
                                [data, data, data, data, data, data, data, data, data, WorkflowType, WorkflowType, $t, $t, $t, $t, isKnowLedge,];
                            }
                        }
                        else {
                            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                            (history.content);
                        }
                        // @ts-ignore
                        [];
                    }
                }
                else {
                }
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.isKnowLedge
                ? __VLS_ctx.$t('views.application.form.prompt.label')
                : __VLS_ctx.$t('aiChat.executionDetails.currentChat'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            if (__VLS_ctx.data.image_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                let __VLS_222;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
                    wrap: true,
                }));
                const __VLS_224 = __VLS_223({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_223));
                const { default: __VLS_227 } = __VLS_225.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.image_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    let __VLS_228;
                    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                    elImage;
                    // @ts-ignore
                    const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
                        src: (f.url || (f.file_id ? `./oss/file/${f.file_id}` : '')),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.image_list.map((img) => img.url || (img.file_id ? `./oss/file/${img.file_id}` : ''))),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }));
                    const __VLS_230 = __VLS_229({
                        src: (f.url || (f.file_id ? `./oss/file/${f.file_id}` : '')),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.image_list.map((img) => img.url || (img.file_id ? `./oss/file/${img.file_id}` : ''))),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, data, $t, $t, isKnowLedge,];
                }
                // @ts-ignore
                [];
                var __VLS_225;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            (__VLS_ctx.data.question || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.think'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.reasoning_content) {
                let __VLS_233;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.reasoning_content),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_235 = __VLS_234({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.reasoning_content),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_234));
                var __VLS_238;
                var __VLS_236;
            }
            else {
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.answer'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.answer) {
                let __VLS_240;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_242 = __VLS_241({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_241));
                var __VLS_245;
                var __VLS_243;
            }
            else {
            }
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.VideoUnderstandNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('views.application.form.roleSettings.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.data.system || '-');
            if (!__VLS_ctx.isKnowLedge) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6 mt-8" },
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (__VLS_ctx.$t('aiChat.history'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                if (__VLS_ctx.data.history_message?.length > 0) {
                    for (const [history, historyIndex] of __VLS_vFor((__VLS_ctx.data.history_message))) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                            ...{ class: "mt-4 mb-4" },
                            key: (historyIndex),
                        });
                        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-secondary mr-4" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                        (history.role);
                        if (Array.isArray(history.content)) {
                            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                            for (const [h, i] of __VLS_vFor((history.content))) {
                                __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                                    key: (i),
                                });
                                if (h.type === 'video_url') {
                                    __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                                        src: (h.video_url.url),
                                        ...{ style: {} },
                                        ...{ class: "border-r-6 mr-8" },
                                    });
                                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                                }
                                else {
                                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                                    (h.text);
                                    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                                }
                                // @ts-ignore
                                [data, data, data, data, data, data, data, data, data, WorkflowType, $t, $t, $t, $t, isKnowLedge,];
                            }
                        }
                        else {
                            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                            (history.content);
                        }
                        // @ts-ignore
                        [];
                    }
                }
                else {
                }
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.isKnowLedge
                ? __VLS_ctx.$t('views.application.form.prompt.label')
                : __VLS_ctx.$t('aiChat.executionDetails.currentChat'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            if (__VLS_ctx.data.video_list?.length > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                let __VLS_247;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_248 = __VLS_asFunctionalComponent1(__VLS_247, new __VLS_247({
                    wrap: true,
                }));
                const __VLS_249 = __VLS_248({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_248));
                const { default: __VLS_252 } = __VLS_250.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.video_list))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                        src: (f.url),
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        autoplay: true,
                        controls: true,
                    });
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, $t, $t, isKnowLedge,];
                }
                // @ts-ignore
                [];
                var __VLS_250;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            (__VLS_ctx.data.question || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.think'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.reasoning_content) {
                let __VLS_253;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.reasoning_content),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_255 = __VLS_254({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.reasoning_content),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_254));
                var __VLS_258;
                var __VLS_256;
            }
            else {
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.answer'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.answer) {
                let __VLS_260;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_262 = __VLS_261({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_261));
                var __VLS_265;
                var __VLS_263;
            }
            else {
            }
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.ImageGenerateNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.currentChat'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.question || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.imageGenerateNode.negative_prompt.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.negative_prompt || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.answer'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.answer) {
                let __VLS_267;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_269 = __VLS_268({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_268));
                var __VLS_272;
                var __VLS_270;
            }
            else {
            }
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.TextToVideoGenerateNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.currentChat'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.question || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.imageGenerateNode.negative_prompt.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.negative_prompt || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.answer'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.answer) {
                let __VLS_274;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_276 = __VLS_275({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_275));
                var __VLS_279;
                var __VLS_277;
            }
            else {
            }
        }
        if (__VLS_ctx.data.type == __VLS_ctx.WorkflowType.ImageToVideoGenerateNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.currentChat'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.question || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.imageGenerateNode.negative_prompt.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.negative_prompt || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.imageToVideoGenerate.first_frame.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            if (typeof __VLS_ctx.data.first_frame_url === 'string') {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                let __VLS_281;
                /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                elImage;
                // @ts-ignore
                const __VLS_282 = __VLS_asFunctionalComponent1(__VLS_281, new __VLS_281({
                    src: (__VLS_ctx.data.first_frame_url),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                }));
                const __VLS_283 = __VLS_282({
                    src: (__VLS_ctx.data.first_frame_url),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                }, ...__VLS_functionalComponentArgsRest(__VLS_282));
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            else if (Array.isArray(__VLS_ctx.data.first_frame_url)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                let __VLS_286;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
                    wrap: true,
                }));
                const __VLS_288 = __VLS_287({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_287));
                const { default: __VLS_291 } = __VLS_289.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.first_frame_url))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    let __VLS_292;
                    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                    elImage;
                    // @ts-ignore
                    const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
                        src: (f.url),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.first_frame_url.map((img) => img.url)),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }));
                    const __VLS_294 = __VLS_293({
                        src: (f.url),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.first_frame_url.map((img) => img.url)),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, WorkflowType, WorkflowType, WorkflowType, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t,];
                }
                // @ts-ignore
                [];
                var __VLS_289;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.imageToVideoGenerate.last_frame.label'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            if (typeof __VLS_ctx.data.last_frame_url === 'string') {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                let __VLS_297;
                /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                elImage;
                // @ts-ignore
                const __VLS_298 = __VLS_asFunctionalComponent1(__VLS_297, new __VLS_297({
                    src: (__VLS_ctx.data.last_frame_url),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                }));
                const __VLS_299 = __VLS_298({
                    src: (__VLS_ctx.data.last_frame_url),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                }, ...__VLS_functionalComponentArgsRest(__VLS_298));
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            else if (Array.isArray(__VLS_ctx.data.last_frame_url)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                let __VLS_302;
                /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
                elSpace;
                // @ts-ignore
                const __VLS_303 = __VLS_asFunctionalComponent1(__VLS_302, new __VLS_302({
                    wrap: true,
                }));
                const __VLS_304 = __VLS_303({
                    wrap: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_303));
                const { default: __VLS_307 } = __VLS_305.slots;
                for (const [f, i] of __VLS_vFor((__VLS_ctx.data.last_frame_url))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (i),
                    });
                    let __VLS_308;
                    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                    elImage;
                    // @ts-ignore
                    const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
                        src: (f.url),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.last_frame_url.map((img) => img.url)),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }));
                    const __VLS_310 = __VLS_309({
                        src: (f.url),
                        alt: "",
                        fit: "cover",
                        ...{ style: {} },
                        ...{ class: "border-r-6" },
                        previewSrcList: (__VLS_ctx.data.last_frame_url.map((img) => img.url)),
                        initialIndex: (i),
                        zoomRate: (1.2),
                        maxScale: (7),
                        minScale: (0.2),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
                    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                    // @ts-ignore
                    [data, data, data, data, data, $t,];
                }
                // @ts-ignore
                [];
                var __VLS_305;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.answer'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.answer) {
                let __VLS_313;
                /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                MdPreview;
                // @ts-ignore
                const __VLS_314 = __VLS_asFunctionalComponent1(__VLS_313, new __VLS_313({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }));
                const __VLS_315 = __VLS_314({
                    ref: "editorRef",
                    editorId: "preview-only",
                    modelValue: (__VLS_ctx.data.answer),
                    ...{ style: {} },
                    noImgZoomIn: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_314));
                var __VLS_318;
                var __VLS_316;
            }
            else {
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.VariableAssignNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.result_list))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (f.name);
                (f.input_type);
                (f.input_value);
                // @ts-ignore
                [data, data, data, data, WorkflowType, $t, $t,];
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.result_list))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (f.name);
                (f.output_type);
                (f.output_value);
                // @ts-ignore
                [data, $t,];
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.VariableSplittingNode ||
            __VLS_ctx.data.type == __VLS_ctx.WorkflowType.ParameterExtractionNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.request || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.result))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (i);
                (f);
                // @ts-ignore
                [data, data, data, data, WorkflowType, WorkflowType, $t, $t,];
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.VariableAggregationNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.variableAggregationNode.Strategy'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            (__VLS_ctx.data.strategy === 'first_non_null'
                ? __VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder')
                : __VLS_ctx.data.strategy === 'variable_to_dict'
                    ? __VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder2')
                    : __VLS_ctx.t('workflow.nodes.variableAggregationNode.placeholder1'));
            for (const [group, groupI] of __VLS_vFor((__VLS_ctx.data.group_list))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "card-never border-r-6 mt-8" },
                    key: (groupI),
                });
                /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                    ...{ class: "p-8-12" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                (group.label + ' ' + __VLS_ctx.$t('common.param.inputParam'));
                let __VLS_320;
                /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
                elScrollbar;
                // @ts-ignore
                const __VLS_321 = __VLS_asFunctionalComponent1(__VLS_320, new __VLS_320({
                    height: "200",
                }));
                const __VLS_322 = __VLS_321({
                    height: "200",
                }, ...__VLS_functionalComponentArgsRest(__VLS_321));
                const { default: __VLS_325 } = __VLS_323.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "p-8-12 border-t-dashed lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                for (const [f, i] of __VLS_vFor((group.variable_list))) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        key: (i),
                        ...{ class: "mb-8" },
                    });
                    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "color-secondary" },
                    });
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (`${f.node_name}.${f.field}`);
                    (f.value);
                    // @ts-ignore
                    [data, data, data, data, WorkflowType, $t, $t, t, t, t,];
                }
                // @ts-ignore
                [];
                var __VLS_323;
                // @ts-ignore
                [];
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            let __VLS_326;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
                height: "200",
            }));
            const __VLS_328 = __VLS_327({
                height: "200",
            }, ...__VLS_functionalComponentArgsRest(__VLS_327));
            const { default: __VLS_331 } = __VLS_329.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.result))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (i);
                (f);
                // @ts-ignore
                [data, $t,];
            }
            // @ts-ignore
            [];
            var __VLS_329;
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.McpNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('views.tool.title'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('views.tool.title'));
            (__VLS_ctx.data.mcp_tool);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.mcpNode.toolParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [value, name] of __VLS_vFor((__VLS_ctx.data.tool_params))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (name),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (name);
                (value);
                // @ts-ignore
                [data, data, data, WorkflowType, $t, $t, $t,];
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter break-all" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.result))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (f);
                // @ts-ignore
                [data, $t,];
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.LoopNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopNode.loopSetting'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.label'));
            (__VLS_ctx.data.loop_type || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopNode.loopArray.label'));
            (__VLS_ctx.data.loop_type === 'NUMBER'
                ? __VLS_ctx.data.number
                : Object.keys(__VLS_ctx.data.loop_node_data) || '-');
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopNode.loopDetail'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.LoopNode) {
                let __VLS_332;
                /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
                elRadioGroup;
                // @ts-ignore
                const __VLS_333 = __VLS_asFunctionalComponent1(__VLS_332, new __VLS_332({
                    modelValue: (__VLS_ctx.currentLoopNode),
                    ...{ class: "app-radio-button-group mb-8" },
                }));
                const __VLS_334 = __VLS_333({
                    modelValue: (__VLS_ctx.currentLoopNode),
                    ...{ class: "app-radio-button-group mb-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_333));
                /** @type {__VLS_StyleScopedClasses['app-radio-button-group']} */ ;
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                const { default: __VLS_337 } = __VLS_335.slots;
                for (const [loop, loopIndex] of __VLS_vFor((__VLS_ctx.data.loop_node_data))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (loopIndex),
                    });
                    let __VLS_338;
                    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
                    elRadioButton;
                    // @ts-ignore
                    const __VLS_339 = __VLS_asFunctionalComponent1(__VLS_338, new __VLS_338({
                        label: (loopIndex),
                        value: (loopIndex),
                    }));
                    const __VLS_340 = __VLS_339({
                        label: (loopIndex),
                        value: (loopIndex),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_339));
                    // @ts-ignore
                    [data, data, data, data, data, data, data, WorkflowType, WorkflowType, $t, $t, $t, $t, currentLoopNode,];
                }
                // @ts-ignore
                [];
                var __VLS_335;
                for (const [cLoop, cIndex] of __VLS_vFor((Object.values(__VLS_ctx.data.loop_node_data?.[__VLS_ctx.currentLoopNode] || []).sort((x, y) => (x.index || 0) - (y.index || 0))))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (cIndex),
                    });
                    const __VLS_343 = ExecutionDetailCard || ExecutionDetailCard;
                    // @ts-ignore
                    const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({
                        data: (cLoop),
                        type: (__VLS_ctx.type),
                    }));
                    const __VLS_345 = __VLS_344({
                        data: (cLoop),
                        type: (__VLS_ctx.type),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_344));
                    // @ts-ignore
                    [data, currentLoopNode, type,];
                }
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.LoopStartNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopStartNode.loopItem'));
            (__VLS_ctx.data.current_item);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopStartNode.loopIndex'));
            (__VLS_ctx.data.current_index);
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.LoopContinueNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopContinueNode.isContinue'));
            (__VLS_ctx.data.is_continue);
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.LoopBreakNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.nodes.loopBreakNode.isBreak'));
            (__VLS_ctx.data.is_break);
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.SearchDocument) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12 flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.data.knowledge_items?.map((v) => v.name).join(','));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.data.document_items?.map((v) => v.name).join(','));
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.DataSourceLocalNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            (__VLS_ctx.data.file_list || '-');
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.DocumentSplitNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.paragraphRules'));
            (__VLS_ctx.data.split_strategy);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('workflow.nodes.documentSplitNode.chunk_length.label'));
            (__VLS_ctx.data.chunk_size);
            (__VLS_ctx.data.size);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-8" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('common.inputContent'));
            (__VLS_ctx.data.document_list?.map((v) => v.name).join(','));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            (__VLS_ctx.$t('aiChat.executionDetails.documentSplitTip'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            let __VLS_348;
            /** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
            elTabs;
            // @ts-ignore
            const __VLS_349 = __VLS_asFunctionalComponent1(__VLS_348, new __VLS_348({
                modelValue: (__VLS_ctx.currentParagraph),
                ...{ class: "paragraph-tabs" },
            }));
            const __VLS_350 = __VLS_349({
                modelValue: (__VLS_ctx.currentParagraph),
                ...{ class: "paragraph-tabs" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_349));
            /** @type {__VLS_StyleScopedClasses['paragraph-tabs']} */ ;
            const { default: __VLS_353 } = __VLS_351.slots;
            for (const [item, index] of __VLS_vFor((__VLS_ctx.data.paragraph_list))) {
                __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                    key: (index),
                });
                let __VLS_354;
                /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
                elTabPane;
                // @ts-ignore
                const __VLS_355 = __VLS_asFunctionalComponent1(__VLS_354, new __VLS_354({
                    label: (item.name),
                    name: (index),
                }));
                const __VLS_356 = __VLS_355({
                    label: (item.name),
                    name: (index),
                }, ...__VLS_functionalComponentArgsRest(__VLS_355));
                const { default: __VLS_359 } = __VLS_357.slots;
                {
                    const { label: __VLS_360 } = __VLS_357.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "ml-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                    (item?.name);
                    // @ts-ignore
                    [data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, WorkflowType, WorkflowType, WorkflowType, WorkflowType, WorkflowType, WorkflowType, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, $t, currentParagraph,];
                }
                for (const [paragraph, pId] of __VLS_vFor((item?.paragraphs))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (pId),
                    });
                    const __VLS_361 = ParagraphCard || ParagraphCard;
                    // @ts-ignore
                    const __VLS_362 = __VLS_asFunctionalComponent1(__VLS_361, new __VLS_361({
                        data: (paragraph),
                        content: (paragraph.content),
                        index: (pId),
                    }));
                    const __VLS_363 = __VLS_362({
                        data: (paragraph),
                        content: (paragraph.content),
                        index: (pId),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_362));
                    const { default: __VLS_366 } = __VLS_364.slots;
                    {
                        const { footer: __VLS_367 } = __VLS_364.slots;
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-secondary" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.character'));
                        (paragraph.content.length);
                        // @ts-ignore
                        [$t,];
                    }
                    // @ts-ignore
                    [];
                    var __VLS_364;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_357;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_351;
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.KnowledgeWriteNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.writeContent'));
            (__VLS_ctx.$t('aiChat.executionDetails.documentSplitTip'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            let __VLS_368;
            /** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
            elTabs;
            // @ts-ignore
            const __VLS_369 = __VLS_asFunctionalComponent1(__VLS_368, new __VLS_368({
                modelValue: (__VLS_ctx.currentWriteContent),
                ...{ class: "paragraph-tabs" },
            }));
            const __VLS_370 = __VLS_369({
                modelValue: (__VLS_ctx.currentWriteContent),
                ...{ class: "paragraph-tabs" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_369));
            /** @type {__VLS_StyleScopedClasses['paragraph-tabs']} */ ;
            const { default: __VLS_373 } = __VLS_371.slots;
            for (const [item, index] of __VLS_vFor((__VLS_ctx.data.write_content))) {
                __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                    key: (index),
                });
                let __VLS_374;
                /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
                elTabPane;
                // @ts-ignore
                const __VLS_375 = __VLS_asFunctionalComponent1(__VLS_374, new __VLS_374({
                    label: (item.name),
                    name: (index),
                }));
                const __VLS_376 = __VLS_375({
                    label: (item.name),
                    name: (index),
                }, ...__VLS_functionalComponentArgsRest(__VLS_375));
                const { default: __VLS_379 } = __VLS_377.slots;
                {
                    const { label: __VLS_380 } = __VLS_377.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "ml-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                    (item?.name);
                    // @ts-ignore
                    [data, data, WorkflowType, $t, $t, currentWriteContent,];
                }
                for (const [paragraph, pId] of __VLS_vFor((item?.paragraphs))) {
                    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                        key: (pId),
                    });
                    const __VLS_381 = ParagraphCard || ParagraphCard;
                    // @ts-ignore
                    const __VLS_382 = __VLS_asFunctionalComponent1(__VLS_381, new __VLS_381({
                        data: (paragraph),
                        content: (paragraph.content),
                        index: (pId),
                    }));
                    const __VLS_383 = __VLS_382({
                        data: (paragraph),
                        content: (paragraph.content),
                        index: (pId),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_382));
                    const { default: __VLS_386 } = __VLS_384.slots;
                    {
                        const { footer: __VLS_387 } = __VLS_384.slots;
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-secondary" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.character'));
                        (paragraph.content.length);
                        // @ts-ignore
                        [$t,];
                    }
                    // @ts-ignore
                    [];
                    var __VLS_384;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_377;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_371;
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.DataSourceWebNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "mb-8 color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('views.document.form.selector.label'));
            (__VLS_ctx.data.input_params.selector);
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "mb-8 color-secondary" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('views.document.form.source_url.label'));
            (__VLS_ctx.data.input_params.source_url);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            let __VLS_388;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_389 = __VLS_asFunctionalComponent1(__VLS_388, new __VLS_388({
                height: "200",
            }));
            const __VLS_390 = __VLS_389({
                height: "200",
            }, ...__VLS_functionalComponentArgsRest(__VLS_389));
            const { default: __VLS_393 } = __VLS_391.slots;
            for (const [file_content, index] of __VLS_vFor((__VLS_ctx.data.output_params))) {
                let __VLS_394;
                /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
                elCard;
                // @ts-ignore
                const __VLS_395 = __VLS_asFunctionalComponent1(__VLS_394, new __VLS_394({
                    shadow: "never",
                    ...{ style: {} },
                    key: (index),
                    ...{ class: "mb-8" },
                }));
                const __VLS_396 = __VLS_395({
                    shadow: "never",
                    ...{ style: {} },
                    key: (index),
                    ...{ class: "mb-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_395));
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                const { default: __VLS_399 } = __VLS_397.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
                (file_content.name);
                if (file_content) {
                    let __VLS_400;
                    /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
                    MdPreview;
                    // @ts-ignore
                    const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
                        ref: "editorRef",
                        editorId: "preview-only",
                        modelValue: (file_content.content),
                        ...{ style: {} },
                        noImgZoomIn: true,
                    }));
                    const __VLS_402 = __VLS_401({
                        ref: "editorRef",
                        editorId: "preview-only",
                        modelValue: (file_content.content),
                        ...{ style: {} },
                        noImgZoomIn: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_401));
                    var __VLS_405;
                    var __VLS_403;
                }
                else {
                }
                // @ts-ignore
                [data, data, data, data, WorkflowType, $t, $t, $t, $t,];
                var __VLS_397;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_391;
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.ToolStartNode) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.global_fields))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (f.label);
                (f.value);
                // @ts-ignore
                [data, data, WorkflowType, $t,];
            }
        }
        if (__VLS_ctx.data.type === __VLS_ctx.WorkflowType.ToolWorkflowLib) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.inputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter pre-wrap" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.input))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (i);
                (f);
                // @ts-ignore
                [data, data, WorkflowType, $t,];
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('common.param.outputParam'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [f, i] of __VLS_vFor((__VLS_ctx.data.output))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (i),
                    ...{ class: "mb-8" },
                });
                /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (i);
                (f);
                // @ts-ignore
                [data, $t,];
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "card-never border-r-6 mt-8" },
            });
            /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
                ...{ class: "p-8-12" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            (__VLS_ctx.$t('aiChat.executionDetails.title'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "p-8-12 border-t-dashed lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            for (const [cLoop, cIndex] of __VLS_vFor((__VLS_ctx.data.details))) {
                __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                    key: (cIndex),
                });
                const __VLS_407 = ExecutionDetailCard || ExecutionDetailCard;
                // @ts-ignore
                const __VLS_408 = __VLS_asFunctionalComponent1(__VLS_407, new __VLS_407({
                    data: (cLoop),
                    type: (__VLS_ctx.type),
                }));
                const __VLS_409 = __VLS_408({
                    data: (cLoop),
                    type: (__VLS_ctx.type),
                }, ...__VLS_functionalComponentArgsRest(__VLS_408));
                // @ts-ignore
                [data, $t, type,];
            }
        }
        var __VLS_412 = {};
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-never border-r-6" },
        });
        /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        (__VLS_ctx.$t('aiChat.executionDetails.errMessage'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12 border-t-dashed lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.data.err_message || '-');
    }
}
// @ts-ignore
[data, $t,];
var __VLS_59;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_130 = __VLS_129, __VLS_143 = __VLS_142, __VLS_173 = __VLS_172, __VLS_192 = __VLS_191, __VLS_199 = __VLS_198, __VLS_216 = __VLS_215, __VLS_239 = __VLS_238, __VLS_246 = __VLS_245, __VLS_259 = __VLS_258, __VLS_266 = __VLS_265, __VLS_273 = __VLS_272, __VLS_280 = __VLS_279, __VLS_319 = __VLS_318, __VLS_406 = __VLS_405, __VLS_413 = __VLS_412;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    props: {
        data: {
            type: Object,
            default: null,
        },
        type: {
            type: String,
            default: 'application',
        },
    },
});
const __VLS_export = {};
export default {};
