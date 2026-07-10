/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { getThemeImg } from '@/utils/theme';
import useStore from '@/stores';
import { useLocalStorage } from '@vueuse/core';
import { langList, localeConfigKey, getBrowserLang } from '@/locales/index';
const __VLS_props = defineProps({
    lang: {
        type: Boolean,
        default: true,
    },
});
const { user, theme } = useStore();
const changeLang = (lang) => {
    useLocalStorage(localeConfigKey, getBrowserLang()).value = lang;
    window.location.reload();
};
const currentLanguage = computed(() => {
    return langList.value?.filter((v) => v.value === user.getLanguage())?.[0]?.label;
});
const fileURL = computed(() => {
    if (theme.themeInfo?.loginImage) {
        if (typeof theme.themeInfo?.loginImage === 'string') {
            return theme.themeInfo?.loginImage;
        }
        else {
            return URL.createObjectURL(theme.themeInfo?.loginImage);
        }
    }
    else {
        return '';
    }
});
const loginImage = computed(() => {
    if (theme.themeInfo?.loginImage) {
        return `${fileURL.value}`;
    }
    else {
        const imgName = getThemeImg(theme.themeInfo?.theme);
        const imgPath = `${window.MaxKB.prefix}/theme/${imgName}.jpg`;
        const imageUrl = new URL(imgPath, import.meta.url).href;
        return imageUrl;
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
    ...{ class: "login-warp flex-center" },
});
/** @type {__VLS_StyleScopedClasses['login-warp']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-container w-full h-full" },
});
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "container w-full h-full" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "container w-full h-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    xs: (0),
    sm: (0),
    md: (10),
    lg: (10),
    xl: (10),
    ...{ class: "left-container" },
}));
const __VLS_8 = __VLS_7({
    xs: (0),
    sm: (0),
    md: (10),
    lg: (10),
    xl: (10),
    ...{ class: "left-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['left-container']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-image" },
    ...{ style: ({ backgroundImage: `url(${__VLS_ctx.loginImage})` }) },
});
/** @type {__VLS_StyleScopedClasses['login-image']} */ ;
// @ts-ignore
[loginImage,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    xs: (24),
    sm: (24),
    md: (14),
    lg: (14),
    xl: (14),
    ...{ class: "right-container flex-center" },
}));
const __VLS_14 = __VLS_13({
    xs: (24),
    sm: (24),
    md: (14),
    lg: (14),
    xl: (14),
    ...{ class: "right-container flex-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {__VLS_StyleScopedClasses['right-container']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
const { default: __VLS_17 } = __VLS_15.slots;
if (__VLS_ctx.lang) {
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        trigger: "click",
        type: "primary",
        ...{ class: "lang" },
    }));
    const __VLS_20 = __VLS_19({
        trigger: "click",
        type: "primary",
        ...{ class: "lang" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['lang']} */ ;
    const { default: __VLS_23 } = __VLS_21.slots;
    {
        const { dropdown: __VLS_24 } = __VLS_21.slots;
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            ...{ class: "w-180" },
        }));
        const __VLS_27 = __VLS_26({
            ...{ class: "w-180" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        /** @type {__VLS_StyleScopedClasses['w-180']} */ ;
        const { default: __VLS_30 } = __VLS_28.slots;
        for (const [lang, index] of __VLS_vFor((__VLS_ctx.langList))) {
            let __VLS_31;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
                ...{ 'onClick': {} },
                key: (index),
                value: (lang.value),
                ...{ class: "flex-between" },
            }));
            const __VLS_33 = __VLS_32({
                ...{ 'onClick': {} },
                key: (index),
                value: (lang.value),
                ...{ class: "flex-between" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_32));
            let __VLS_36;
            const __VLS_37 = {
                /** @type {typeof __VLS_36.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.lang))
                        throw 0;
                    return __VLS_ctx.changeLang(lang.value);
                    // @ts-ignore
                    [lang, langList, changeLang,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            const { default: __VLS_38 } = __VLS_34.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: (lang.value === __VLS_ctx.user.getLanguage() ? 'primary' : '') },
            });
            (lang.label);
            if (lang.value === __VLS_ctx.user.getLanguage()) {
                let __VLS_39;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
                    ...{ class: (lang.value === __VLS_ctx.user.getLanguage() ? 'primary' : '') },
                }));
                const __VLS_41 = __VLS_40({
                    ...{ class: (lang.value === __VLS_ctx.user.getLanguage() ? 'primary' : '') },
                }, ...__VLS_functionalComponentArgsRest(__VLS_40));
                const { default: __VLS_44 } = __VLS_42.slots;
                let __VLS_45;
                /** @ts-ignore @type { | typeof __VLS_components.Check} */
                Check;
                // @ts-ignore
                const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({}));
                const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
                // @ts-ignore
                [user, user, user,];
                var __VLS_42;
            }
            // @ts-ignore
            [];
            var __VLS_34;
            var __VLS_35;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_28;
        // @ts-ignore
        [];
    }
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({}));
    const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_55 } = __VLS_53.slots;
    (__VLS_ctx.currentLanguage);
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        ...{ class: "el-icon--right" },
    }));
    const __VLS_58 = __VLS_57({
        ...{ class: "el-icon--right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    /** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
    const { default: __VLS_61 } = __VLS_59.slots;
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.arrowDown | typeof __VLS_components.ArrowDown | typeof __VLS_components['arrow-down']} */
    arrowDown;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({}));
    const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
    // @ts-ignore
    [currentLanguage,];
    var __VLS_59;
    // @ts-ignore
    [];
    var __VLS_53;
    // @ts-ignore
    [];
    var __VLS_21;
}
var __VLS_67 = {};
// @ts-ignore
[];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_68 = __VLS_67;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    props: {
        lang: {
            type: Boolean,
            default: true,
        },
    },
});
const __VLS_export = {};
export default {};
