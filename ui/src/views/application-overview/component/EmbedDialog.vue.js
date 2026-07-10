/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, watch } from 'vue';
import { copyClick } from '@/utils/clipboard';
import useStore from '@/stores';
const { application } = useStore();
const props = defineProps({
    data: Object,
    apiInputParams: String,
});
const emit = defineEmits(['addData']);
const dialogVisible = ref(false);
const source1 = ref('');
const source2 = ref('');
const source3 = ref('');
const urlParams1 = computed(() => (props.apiInputParams ? '?' + props.apiInputParams : ''));
const urlParams2 = computed(() => (props.apiInputParams ? '&' + props.apiInputParams : ''));
const urlParams3 = computed(() => props.apiInputParams ? '?mode=mobile&' + props.apiInputParams : '?mode=mobile');
watch(dialogVisible, (bool) => {
    if (!bool) {
        source1.value = '';
        source2.value = '';
        source3.value = '';
    }
});
const open = (val) => {
    source1.value = `<iframe
src="${application.location + val + urlParams1.value}"
style="width: 100%; height: 100%;"
frameborder="0"
allow="microphone">
</iframe>
`;
    source2.value = `<script
async
defer
src="${application.location}api/embed?protocol=${window.location.protocol.replace(':', '')}&host=${window.location.host}&token=${val}${urlParams2.value}">
<\/script>
`;
    source3.value = `<iframe
src="${application.location + val + urlParams3.value}"
style="width: 100%; height: 100%;"
frameborder="0"
allow="microphone">
</iframe>
`;
    dialogVisible.value = true;
};
const __VLS_exposed = { open };
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
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.embedInWebsite')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "900",
    ...{ class: "embed-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.embedInWebsite')),
    modelValue: (__VLS_ctx.dialogVisible),
    width: "900",
    ...{ class: "embed-dialog" },
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['embed-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    gutter: (12),
}));
const __VLS_9 = __VLS_8({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    span: (8),
}));
const __VLS_15 = __VLS_14({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border" },
});
/** @type {__VLS_StyleScopedClasses['border']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "title p-16 bold" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.EmbedDialog.fullscreenModeTitle'));
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/application/window1.png",
    alt: "",
    ...{ class: "ml-8" },
    height: "150",
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "code layout-bg border-t p-8" },
});
/** @type {__VLS_StyleScopedClasses['code']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between p-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "bold" },
});
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.EmbedDialog.copyInstructions'));
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = {
    /** @type {typeof __VLS_24.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.source1);
        // @ts-ignore
        [$t, $t, $t, dialogVisible, copyClick, source1,];
    },
};
const { default: __VLS_26 } = __VLS_22.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    iconName: "app-copy",
}));
const __VLS_29 = __VLS_28({
    iconName: "app-copy",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
// @ts-ignore
[];
var __VLS_22;
var __VLS_23;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    height: "180",
    always: true,
}));
const __VLS_34 = __VLS_33({
    height: "180",
    always: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pre-wrap p-8 pt-0" },
});
/** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
(__VLS_ctx.source1);
// @ts-ignore
[source1,];
var __VLS_35;
// @ts-ignore
[];
var __VLS_16;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    span: (8),
}));
const __VLS_40 = __VLS_39({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_43 } = __VLS_41.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border" },
});
/** @type {__VLS_StyleScopedClasses['border']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "title p-16 bold" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.EmbedDialog.mobileModeTitle'));
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/application/window3.png",
    alt: "",
    ...{ class: "ml-8" },
    height: "150",
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "code layout-bg border-t p-8" },
});
/** @type {__VLS_StyleScopedClasses['code']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between p-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "bold" },
});
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.EmbedDialog.copyInstructions'));
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    /** @type {typeof __VLS_49.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.source3);
        // @ts-ignore
        [$t, $t, copyClick, source3,];
    },
};
const { default: __VLS_51 } = __VLS_47.slots;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    iconName: "app-copy",
}));
const __VLS_54 = __VLS_53({
    iconName: "app-copy",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
// @ts-ignore
[];
var __VLS_47;
var __VLS_48;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    height: "180",
    always: true,
}));
const __VLS_59 = __VLS_58({
    height: "180",
    always: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const { default: __VLS_62 } = __VLS_60.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pre-wrap p-8 pt-0" },
});
/** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
(__VLS_ctx.source3);
// @ts-ignore
[source3,];
var __VLS_60;
// @ts-ignore
[];
var __VLS_41;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    span: (8),
}));
const __VLS_65 = __VLS_64({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const { default: __VLS_68 } = __VLS_66.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border" },
});
/** @type {__VLS_StyleScopedClasses['border']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "title p-16 bold" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.EmbedDialog.floatingModeTitle'));
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/application/window2.png",
    alt: "",
    ...{ class: "ml-8" },
    height: "150",
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "code layout-bg border-t p-8" },
});
/** @type {__VLS_StyleScopedClasses['code']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between p-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "bold" },
});
/** @type {__VLS_StyleScopedClasses['bold']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.EmbedDialog.copyInstructions'));
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_71 = __VLS_70({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
const __VLS_75 = {
    /** @type {typeof __VLS_74.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.source2);
        // @ts-ignore
        [$t, $t, copyClick, source2,];
    },
};
const { default: __VLS_76 } = __VLS_72.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    iconName: "app-copy",
}));
const __VLS_79 = __VLS_78({
    iconName: "app-copy",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
// @ts-ignore
[];
var __VLS_72;
var __VLS_73;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    height: "180",
    always: true,
}));
const __VLS_84 = __VLS_83({
    height: "180",
    always: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
const { default: __VLS_87 } = __VLS_85.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pre-wrap p-8 pt-0" },
});
/** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
(__VLS_ctx.source2);
// @ts-ignore
[source2,];
var __VLS_85;
// @ts-ignore
[];
var __VLS_66;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    props: {
        data: Object,
        apiInputParams: String,
    },
});
export default {};
