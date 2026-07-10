/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import LoginLayout from "@/layout/login-layout/LoginLayout.vue";
import LoginContainer from "@/layout/login-layout/LoginContainer.vue";
const props = defineProps({
    data: {
        type: Object,
        default: null
    }
});
const fileURL = computed(() => {
    if (props.data.icon) {
        if (typeof props.data.icon === 'string') {
            return props.data.icon;
        }
        else {
            return URL.createObjectURL(props.data.icon);
        }
    }
    else {
        return '';
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-preview mr-16 white-bg" },
});
/** @type {__VLS_StyleScopedClasses['login-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
/** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header" },
});
/** @type {__VLS_StyleScopedClasses['header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tag flex-between" },
});
/** @type {__VLS_StyleScopedClasses['tag']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (props.data.icon) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.fileURL),
        alt: "",
        height: "20px",
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/logo/logo.svg",
        height: "24px",
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ellipsis" },
});
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.data.title);
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.Close} */
Close;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
// @ts-ignore
[fileURL, data,];
var __VLS_3;
const __VLS_11 = LoginLayout || LoginLayout;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ style: {} },
    lang: (false),
}));
const __VLS_13 = __VLS_12({
    ...{ style: {} },
    lang: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_16 } = __VLS_14.slots;
const __VLS_17 = LoginContainer || LoginContainer;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    subTitle: (__VLS_ctx.data.slogan),
    ...{ class: "login-container" },
}));
const __VLS_19 = __VLS_18({
    subTitle: (__VLS_ctx.data.slogan),
    ...{ class: "login-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
const { default: __VLS_22 } = __VLS_20.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mask" },
});
/** @type {__VLS_StyleScopedClasses['mask']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-24" },
});
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
(__VLS_ctx.$t('views.login.title'));
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    ...{ class: "login-form" },
}));
const __VLS_25 = __VLS_24({
    ...{ class: "login-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
/** @type {__VLS_StyleScopedClasses['login-form']} */ ;
const { default: __VLS_28 } = __VLS_26.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-24" },
});
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    size: "large",
    ...{ class: "input-item" },
    placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
}));
const __VLS_37 = __VLS_36({
    size: "large",
    ...{ class: "input-item" },
    placeholder: (__VLS_ctx.$t('views.login.loginForm.username.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
/** @type {__VLS_StyleScopedClasses['input-item']} */ ;
// @ts-ignore
[data, $t, $t,];
var __VLS_32;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-24" },
});
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    type: "password",
    size: "large",
    ...{ class: "input-item" },
    placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
    showPassword: true,
}));
const __VLS_48 = __VLS_47({
    type: "password",
    size: "large",
    ...{ class: "input-item" },
    placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
/** @type {__VLS_StyleScopedClasses['input-item']} */ ;
// @ts-ignore
[$t,];
var __VLS_43;
// @ts-ignore
[];
var __VLS_26;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    size: "large",
    type: "primary",
    ...{ class: "w-full" },
}));
const __VLS_53 = __VLS_52({
    size: "large",
    type: "primary",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_56 } = __VLS_54.slots;
(__VLS_ctx.$t('views.login.buttons.login'));
// @ts-ignore
[$t,];
var __VLS_54;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate-container flex-between mt-12" },
});
/** @type {__VLS_StyleScopedClasses['operate-container']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    ...{ class: "forgot-password" },
    link: true,
    type: "primary",
}));
const __VLS_59 = __VLS_58({
    ...{ class: "forgot-password" },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
/** @type {__VLS_StyleScopedClasses['forgot-password']} */ ;
const { default: __VLS_62 } = __VLS_60.slots;
(__VLS_ctx.$t('views.login.forgotPassword'));
// @ts-ignore
[$t,];
var __VLS_60;
// @ts-ignore
[];
var __VLS_20;
// @ts-ignore
[];
var __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        data: {
            type: Object,
            default: null
        }
    },
});
export default {};
