/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { nextTick, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import useStore from '@/stores';
import { cloneDeep } from 'lodash';
import ParagraphDialog from '@/views/paragraph/component/ParagraphDialog.vue';
import { arraySort } from '@/utils/array';
import emptyImg from '@/assets/hit-test-empty.png';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const { params: { id }, } = route;
const { user } = useStore();
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
const quickInputRef = ref();
const ParagraphDialogRef = ref();
const loading = ref(false);
const paragraphDetail = ref([]);
const title = ref('');
const inputValue = ref('');
const formInline = ref({
    similarity: 0.6,
    top_number: 5,
    search_mode: 'embedding',
});
// First load
const first = ref(true);
const cloneForm = ref({});
const popoverVisible = ref(false);
const questionTitle = ref('');
const isDisabledChart = computed(() => !inputValue.value);
function changeHandle(val) {
    if (val === 'keywords') {
        cloneForm.value.similarity = 0;
    }
    else {
        cloneForm.value.similarity = 0.6;
    }
}
function settingChange(val) {
    if (val === 'open') {
        popoverVisible.value = true;
        cloneForm.value = cloneDeep(formInline.value);
    }
    else if (val === 'close') {
        popoverVisible.value = false;
        formInline.value = cloneDeep(cloneForm.value);
    }
}
function editParagraph(row) {
    title.value = t('views.paragraph.paragraphDetail');
    ParagraphDialogRef.value.open(row);
}
function sendChatHandle(event) {
    if (!event?.ctrlKey && !event?.shiftKey && !event?.altKey && !event?.metaKey) {
        // If no modifier key is pressed, block the default event
        event.preventDefault();
        if (!isDisabledChart.value && !loading.value) {
            getHitTestList();
        }
    }
    else {
        // If ctrl/shift/cmd/opt + enter is pressed simultaneously, insert a newline
        insertNewlineAtCursor(event);
    }
}
const insertNewlineAtCursor = (event) => {
    const textarea = quickInputRef.value.$el.querySelector('.el-textarea__inner');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    // Block default behavior (avoid extra newlines)
    event.preventDefault();
    // At cursor, insert newline
    inputValue.value = inputValue.value.slice(0, startPos) + '\n' + inputValue.value.slice(endPos);
    nextTick(() => {
        textarea.setSelectionRange(startPos + 1, startPos + 1); // Position cursor after newline
    });
};
function getHitTestList() {
    const obj = {
        query_text: inputValue.value,
        ...formInline.value,
    };
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .putKnowledgeHitTest(id, obj, loading)
        .then((res) => {
        paragraphDetail.value = res.data && arraySort(res.data, 'comprehensive_score', true);
        questionTitle.value = inputValue.value;
        inputValue.value = '';
        first.value = false;
    });
}
function refresh(data) {
    if (data) {
        const obj = paragraphDetail.value.filter((v) => v.id === data.id)[0];
        obj.content = data.content;
        obj.title = data.title;
    }
    else {
        paragraphDetail.value = [];
        getHitTestList();
    }
}
onMounted(() => { });
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-textarea__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['hit-test']} */ ;
/** @type {__VLS_StyleScopedClasses['description']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hit-test p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['hit-test']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.$t('views.application.hitTest.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    type: "info",
    ...{ class: "ml-4" },
}));
const __VLS_2 = __VLS_1({
    type: "info",
    ...{ class: "ml-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
(__VLS_ctx.$t('views.application.hitTest.text'));
// @ts-ignore
[$t, $t,];
var __VLS_3;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ style: {} },
    ...{ class: "hit-test__main p-16 mt-16 mb-16" },
}));
const __VLS_8 = __VLS_7({
    ...{ style: {} },
    ...{ class: "hit-test__main p-16 mt-16 mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['hit-test__main']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "question-title" },
    ...{ style: ({ visibility: __VLS_ctx.questionTitle ? 'visible' : 'hidden' }) },
});
/** @type {__VLS_StyleScopedClasses['question-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "avatar" },
});
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/user-icon.svg",
    ...{ style: {} },
    alt: "",
});
// @ts-ignore
[vLoading, loading, questionTitle,];
var __VLS_15;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content ml-12" },
});
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "text break-all ellipsis-1" },
    ...{ style: {} },
    title: (__VLS_ctx.questionTitle),
});
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
(__VLS_ctx.questionTitle);
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: ({ height: __VLS_ctx.user.isExpire() ? 'calc(100vh - 340px)' : 'calc(100vh - 300px)' }) },
});
if (__VLS_ctx.first) {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        image: (__VLS_ctx.emptyImg),
        description: (__VLS_ctx.$t('views.application.hitTest.emptyMessage1')),
        ...{ style: {} },
        imageSize: (125),
    }));
    const __VLS_26 = __VLS_25({
        image: (__VLS_ctx.emptyImg),
        description: (__VLS_ctx.$t('views.application.hitTest.emptyMessage1')),
        ...{ style: {} },
        imageSize: (125),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
}
else if (__VLS_ctx.paragraphDetail.length == 0) {
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        description: (__VLS_ctx.$t('views.application.hitTest.emptyMessage2')),
        ...{ style: {} },
        imageSize: (125),
    }));
    const __VLS_31 = __VLS_30({
        description: (__VLS_ctx.$t('views.application.hitTest.emptyMessage2')),
        ...{ style: {} },
        imageSize: (125),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
}
else {
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({}));
    const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
    const { default: __VLS_39 } = __VLS_37.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.paragraphDetail))) {
        let __VLS_40;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            key: (index),
            ...{ class: "p-8" },
        }));
        const __VLS_42 = __VLS_41({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            key: (index),
            ...{ class: "p-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
        const { default: __VLS_45 } = __VLS_43.slots;
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
        CardBox;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            ...{ 'onClick': {} },
            shadow: "hover",
            title: (item.title || '-'),
            description: (item.content),
            ...{ class: "document-card layout-bg layout-bg cursor" },
            ...{ class: (item.is_active ? '' : 'disabled') },
        }));
        const __VLS_48 = __VLS_47({
            ...{ 'onClick': {} },
            shadow: "hover",
            title: (item.title || '-'),
            description: (item.content),
            ...{ class: "document-card layout-bg layout-bg cursor" },
            ...{ class: (item.is_active ? '' : 'disabled') },
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        let __VLS_51;
        const __VLS_52 = {
            /** @type {typeof __VLS_51.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.first))
                    throw 0;
                if (!!(__VLS_ctx.paragraphDetail.length == 0))
                    throw 0;
                return __VLS_ctx.editParagraph(item);
                // @ts-ignore
                [$t, $t, questionTitle, questionTitle, user, first, emptyImg, paragraphDetail, paragraphDetail, editParagraph,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['document-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        const { default: __VLS_53 } = __VLS_49.slots;
        {
            const { icon: __VLS_54 } = __VLS_49.slots;
            let __VLS_55;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
                ...{ class: "avatar-light" },
                size: (22),
            }));
            const __VLS_57 = __VLS_56({
                ...{ class: "avatar-light" },
                size: (22),
            }, ...__VLS_functionalComponentArgsRest(__VLS_56));
            /** @type {__VLS_StyleScopedClasses['avatar-light']} */ ;
            const { default: __VLS_60 } = __VLS_58.slots;
            (index + 1 + '');
            // @ts-ignore
            [];
            var __VLS_58;
            // @ts-ignore
            [];
        }
        {
            const { tag: __VLS_61 } = __VLS_49.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "primary" },
            });
            /** @type {__VLS_StyleScopedClasses['primary']} */ ;
            (item.similarity?.toFixed(3));
            // @ts-ignore
            [];
        }
        {
            const { footer: __VLS_62 } = __VLS_49.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "footer-content flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['footer-content']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            let __VLS_63;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({}));
            const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
            const { default: __VLS_68 } = __VLS_66.slots;
            let __VLS_69;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({}));
            const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
            const { default: __VLS_74 } = __VLS_72.slots;
            let __VLS_75;
            /** @ts-ignore @type { | typeof __VLS_components.Document} */
            Document;
            // @ts-ignore
            const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({}));
            const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
            // @ts-ignore
            [];
            var __VLS_72;
            (item?.document_name);
            // @ts-ignore
            [];
            var __VLS_66;
            if (item.trample_num || item.star_num) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                if (item.star_num) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                    let __VLS_80;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                        iconName: "app-like-color",
                    }));
                    const __VLS_82 = __VLS_81({
                        iconName: "app-like-color",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
                    (item.star_num);
                }
                if (item.trample_num) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "ml-4" },
                    });
                    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                    let __VLS_85;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
                        iconName: "app-oppose-color",
                    }));
                    const __VLS_87 = __VLS_86({
                        iconName: "app-oppose-color",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
                    (item.trample_num);
                }
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_49;
        var __VLS_50;
        // @ts-ignore
        [];
        var __VLS_43;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_37;
}
// @ts-ignore
[];
var __VLS_21;
// @ts-ignore
[];
var __VLS_9;
const __VLS_90 = ParagraphDialog;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.title),
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_92 = __VLS_91({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.title),
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
let __VLS_95;
const __VLS_96 = {
    /** @type {typeof __VLS_95.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_97;
var __VLS_93;
var __VLS_94;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "hit-test__operate" },
});
/** @type {__VLS_StyleScopedClasses['hit-test__operate']} */ ;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
elPopover;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    visible: (__VLS_ctx.popoverVisible),
    placement: "right-end",
    width: (500),
    trigger: "click",
    persistent: (false),
}));
const __VLS_101 = __VLS_100({
    visible: (__VLS_ctx.popoverVisible),
    placement: "right-end",
    width: (500),
    trigger: "click",
    persistent: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
{
    const { reference: __VLS_105 } = __VLS_102.slots;
    if (!__VLS_ctx.route.path.includes('share/')) {
        let __VLS_106;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
            ...{ 'onClick': {} },
            ...{ class: "mb-8" },
        }));
        const __VLS_108 = __VLS_107({
            ...{ 'onClick': {} },
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_107));
        let __VLS_111;
        const __VLS_112 = {
            /** @type {typeof __VLS_111.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.route.path.includes('share/')))
                    throw 0;
                return __VLS_ctx.settingChange('open');
                // @ts-ignore
                [title, apiType, refresh, popoverVisible, route, settingChange,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_113 } = __VLS_109.slots;
        let __VLS_114;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
            iconName: "app-setting",
        }));
        const __VLS_116 = __VLS_115({
            iconName: "app-setting",
        }, ...__VLS_functionalComponentArgsRest(__VLS_115));
        (__VLS_ctx.$t('common.paramSetting'));
        // @ts-ignore
        [$t,];
        var __VLS_109;
        var __VLS_110;
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.application.dialog.selectSearchMode'));
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.cloneForm.search_mode),
    ...{ class: "card__radio" },
}));
const __VLS_121 = __VLS_120({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.cloneForm.search_mode),
    ...{ class: "card__radio" },
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
const __VLS_125 = {
    /** @type {typeof __VLS_124.change} */
    onChange: (__VLS_ctx.changeHandle),
};
/** @type {__VLS_StyleScopedClasses['card__radio']} */ ;
const { default: __VLS_126 } = __VLS_122.slots;
let __VLS_127;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.cloneForm.search_mode === 'embedding' ? 'border-active' : '') },
}));
const __VLS_129 = __VLS_128({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.cloneForm.search_mode === 'embedding' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_132 } = __VLS_130.slots;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    value: "embedding",
    size: "large",
}));
const __VLS_135 = __VLS_134({
    value: "embedding",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.application.dialog.vectorSearch'));
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    type: "info",
}));
const __VLS_141 = __VLS_140({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
const { default: __VLS_144 } = __VLS_142.slots;
(__VLS_ctx.$t('views.application.dialog.vectorSearchTooltip'));
// @ts-ignore
[$t, $t, $t, cloneForm, cloneForm, changeHandle,];
var __VLS_142;
// @ts-ignore
[];
var __VLS_136;
// @ts-ignore
[];
var __VLS_130;
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.cloneForm.search_mode === 'keywords' ? 'border-active' : '') },
}));
const __VLS_147 = __VLS_146({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.cloneForm.search_mode === 'keywords' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_150 } = __VLS_148.slots;
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    value: "keywords",
    size: "large",
}));
const __VLS_153 = __VLS_152({
    value: "keywords",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
const { default: __VLS_156 } = __VLS_154.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.application.dialog.fullTextSearch'));
let __VLS_157;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    type: "info",
}));
const __VLS_159 = __VLS_158({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
const { default: __VLS_162 } = __VLS_160.slots;
(__VLS_ctx.$t('views.application.dialog.fullTextSearchTooltip'));
// @ts-ignore
[$t, $t, cloneForm,];
var __VLS_160;
// @ts-ignore
[];
var __VLS_154;
// @ts-ignore
[];
var __VLS_148;
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.cloneForm.search_mode === 'blend' ? 'border-active' : '') },
}));
const __VLS_165 = __VLS_164({
    shadow: "never",
    ...{ class: "mb-16" },
    ...{ class: (__VLS_ctx.cloneForm.search_mode === 'blend' ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_168 } = __VLS_166.slots;
let __VLS_169;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
    value: "blend",
    size: "large",
}));
const __VLS_171 = __VLS_170({
    value: "blend",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
const { default: __VLS_174 } = __VLS_172.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.$t('views.application.dialog.hybridSearch'));
let __VLS_175;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    type: "info",
}));
const __VLS_177 = __VLS_176({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
const { default: __VLS_180 } = __VLS_178.slots;
(__VLS_ctx.$t('views.application.dialog.hybridSearchTooltip'));
// @ts-ignore
[$t, $t, cloneForm,];
var __VLS_178;
// @ts-ignore
[];
var __VLS_172;
// @ts-ignore
[];
var __VLS_166;
// @ts-ignore
[];
var __VLS_122;
var __VLS_123;
let __VLS_181;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
    gutter: (20),
}));
const __VLS_183 = __VLS_182({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
const { default: __VLS_186 } = __VLS_184.slots;
let __VLS_187;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
    span: (12),
}));
const __VLS_189 = __VLS_188({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
const { default: __VLS_192 } = __VLS_190.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.application.dialog.similarityThreshold'));
let __VLS_193;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    modelValue: (__VLS_ctx.cloneForm.similarity),
    min: (0),
    max: (__VLS_ctx.cloneForm.search_mode === 'blend' ? 2 : 1),
    precision: (3),
    step: (0.1),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
}));
const __VLS_195 = __VLS_194({
    modelValue: (__VLS_ctx.cloneForm.similarity),
    min: (0),
    max: (__VLS_ctx.cloneForm.search_mode === 'blend' ? 2 : 1),
    precision: (3),
    step: (0.1),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, cloneForm, cloneForm,];
var __VLS_190;
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    span: (12),
}));
const __VLS_200 = __VLS_199({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const { default: __VLS_203 } = __VLS_201.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.application.dialog.topReferences'));
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.cloneForm.top_number),
    min: (1),
    max: (10000),
    controlsPosition: "right",
    ...{ class: "w-full" },
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.cloneForm.top_number),
    min: (1),
    max: (10000),
    controlsPosition: "right",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, cloneForm,];
var __VLS_201;
// @ts-ignore
[];
var __VLS_184;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-right" },
});
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
let __VLS_209;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    ...{ 'onClick': {} },
}));
const __VLS_211 = __VLS_210({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
let __VLS_214;
const __VLS_215 = {
    /** @type {typeof __VLS_214.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.popoverVisible = false;
        // @ts-ignore
        [popoverVisible,];
    },
};
const { default: __VLS_216 } = __VLS_212.slots;
(__VLS_ctx.$t('common.cancel'));
// @ts-ignore
[$t,];
var __VLS_212;
var __VLS_213;
let __VLS_217;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_219 = __VLS_218({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
let __VLS_222;
const __VLS_223 = {
    /** @type {typeof __VLS_222.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.settingChange('close');
        // @ts-ignore
        [settingChange,];
    },
};
const { default: __VLS_224 } = __VLS_220.slots;
(__VLS_ctx.$t('common.confirm'));
// @ts-ignore
[$t,];
var __VLS_220;
var __VLS_221;
// @ts-ignore
[];
var __VLS_102;
if (!__VLS_ctx.route.path.includes('share/')) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "operate-textarea flex" },
    });
    /** @type {__VLS_StyleScopedClasses['operate-textarea']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_225;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
        ...{ 'onKeydown': {} },
        ref: "quickInputRef",
        modelValue: (__VLS_ctx.inputValue),
        type: "textarea",
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        autosize: ({ minRows: 1, maxRows: 1 }),
    }));
    const __VLS_227 = __VLS_226({
        ...{ 'onKeydown': {} },
        ref: "quickInputRef",
        modelValue: (__VLS_ctx.inputValue),
        type: "textarea",
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        autosize: ({ minRows: 1, maxRows: 1 }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    let __VLS_230;
    const __VLS_231 = {
        /** @type {typeof __VLS_230.keydown} */
        onKeydown: (...[$event]) => {
            if (!(!__VLS_ctx.route.path.includes('share/')))
                throw 0;
            return __VLS_ctx.sendChatHandle($event);
            // @ts-ignore
            [$t, route, inputValue, sendChatHandle,];
        },
    };
    var __VLS_232;
    var __VLS_228;
    var __VLS_229;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "operate" },
    });
    /** @type {__VLS_StyleScopedClasses['operate']} */ ;
    let __VLS_234;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "sent-button" },
        disabled: (__VLS_ctx.isDisabledChart || __VLS_ctx.loading),
    }));
    const __VLS_236 = __VLS_235({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "sent-button" },
        disabled: (__VLS_ctx.isDisabledChart || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    let __VLS_239;
    const __VLS_240 = {
        /** @type {typeof __VLS_239.click} */
        onClick: (__VLS_ctx.sendChatHandle),
    };
    /** @type {__VLS_StyleScopedClasses['sent-button']} */ ;
    const { default: __VLS_241 } = __VLS_237.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/chat/icon_send.svg",
        alt: "",
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.isDisabledChart || __VLS_ctx.loading) }, null, null);
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/chat/icon_send_colorful.svg",
        alt: "",
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isDisabledChart && !__VLS_ctx.loading) }, null, null);
    // @ts-ignore
    [loading, loading, loading, sendChatHandle, isDisabledChart, isDisabledChart, isDisabledChart,];
    var __VLS_237;
    var __VLS_238;
}
// @ts-ignore
var __VLS_98 = __VLS_97, __VLS_233 = __VLS_232;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
