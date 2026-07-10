/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { isAppIcon } from '@/utils/common';
import { MsgSuccess, MsgError } from '@/utils/message';
import { langList, t } from '@/locales';
import { cloneDeep } from 'lodash';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const emit = defineEmits(['refresh']);
const defaultSetting = {
    show_source: false,
    show_exec: false,
    language: '',
    show_history: true,
    draggable: true,
    show_guide: true,
    show_share: true,
    icon: '',
    icon_url: '',
    chat_background: '',
    chat_background_url: '',
    avatar: '',
    avatar_url: '',
    float_icon: '',
    float_icon_url: '',
    user_avatar: '',
    user_avatar_url: '',
    disclaimer: false,
    disclaimer_value: t('views.applicationOverview.SettingDisplayDialog.disclaimerValue'),
    custom_theme: {
        theme_color: '',
        header_font_color: '#1f2329',
    },
    float_location: {
        y: { type: 'bottom', value: 30 },
        x: { type: 'right', value: 0 },
    },
    show_avatar: true,
    show_user_avatar: false,
};
const displayFormRef = ref();
const xpackForm = ref({
    show_source: false,
    show_exec: false,
    language: '',
    icon: '',
    icon_url: '',
    show_history: true,
    draggable: false,
    show_guide: false,
    show_share: true,
    chat_background: '',
    chat_background_url: '',
    avatar: '',
    avatar_url: '',
    float_icon: '',
    float_icon_url: '',
    user_avatar: '',
    user_avatar_url: '',
    disclaimer: false,
    disclaimer_value: t('views.applicationOverview.SettingDisplayDialog.disclaimerValue'),
    custom_theme: {
        theme_color: '',
        header_font_color: '#1f2329',
    },
    float_location: {
        y: { type: 'bottom', value: 30 },
        x: { type: 'right', value: 0 },
    },
    show_avatar: true,
    show_user_avatar: false,
});
const imgUrl = ref({
    avatar: '',
    float_icon: '',
    user_avatar: '',
    icon: '',
    chat_background: '',
});
const dialogVisible = ref(false);
const loading = ref(false);
const detail = ref(null);
const customStyle = computed(() => {
    return {
        background: xpackForm.value.custom_theme?.theme_color,
        color: xpackForm.value.custom_theme?.header_font_color,
    };
});
function resetForm() {
    xpackForm.value = cloneDeep(defaultSetting);
    imgUrl.value = {
        avatar: '',
        float_icon: '',
        user_avatar: '',
        icon: '',
        chat_background: '',
    };
}
const onChange = (file, fileList, attr) => {
    //1、DetermineFileSizeWhetherValid, FileLimitCannot be greater than 10 MB
    const isLimit = file?.size / 1024 / 1024 < 10;
    if (!isLimit) {
        MsgError(t('common.EditAvatarDialog.fileSizeExceeded'));
        return false;
    }
    else {
        xpackForm.value[attr] = file.raw;
        imgUrl.value[attr] = URL.createObjectURL(file.raw);
        xpackForm.value[`${attr}_url`] = '';
    }
};
const open = (data, content) => {
    detail.value = content;
    xpackForm.value.show_source = data.show_source;
    xpackForm.value.show_exec = data.show_exec;
    xpackForm.value.show_history = data.show_history;
    xpackForm.value.language = data.language;
    xpackForm.value.draggable = data.draggable;
    xpackForm.value.show_guide = data.show_guide;
    xpackForm.value.show_share = data.show_share;
    imgUrl.value.avatar = data.avatar;
    imgUrl.value.icon = data.icon;
    imgUrl.value.chat_background = data.chat_background;
    imgUrl.value.float_icon = data.float_icon;
    imgUrl.value.user_avatar = data.user_avatar;
    xpackForm.value.disclaimer = data.disclaimer;
    xpackForm.value.disclaimer_value = data.disclaimer_value;
    if (xpackForm.value.disclaimer_value ===
        t('views.applicationOverview.SettingDisplayDialog.disclaimerValue')) {
        xpackForm.value.disclaimer_value = t('views.applicationOverview.SettingDisplayDialog.disclaimerValue');
    }
    xpackForm.value.avatar_url = data.avatar;
    xpackForm.value.chat_background_url = data.chat_background;
    xpackForm.value.icon_url = data.icon;
    xpackForm.value.user_avatar_url = data.user_avatar;
    xpackForm.value.float_icon_url = data.float_icon;
    xpackForm.value.show_avatar = data.show_avatar;
    xpackForm.value.show_user_avatar = data.show_user_avatar;
    xpackForm.value.custom_theme = {
        theme_color: data.custom_theme?.theme_color || '',
        header_font_color: data.custom_theme?.header_font_color || '#1f2329',
    };
    xpackForm.value.float_location = data.float_location;
    dialogVisible.value = true;
};
const changeValue = (value) => {
    xpackForm.value.disclaimer_value = value;
};
const changeDisclaimer = (value) => {
    xpackForm.value.disclaimer = value;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            const fd = new FormData();
            Object.keys(xpackForm.value).map((item) => {
                if (['custom_theme', 'float_location'].includes(item)) {
                    fd.append(item, JSON.stringify(xpackForm.value[item]));
                }
                else {
                    fd.append(item, xpackForm.value[item]);
                }
            });
            loadSharedApi({ type: 'application', systemType: apiType.value })
                .putXpackAccessToken(id, fd, loading)
                .then(() => {
                emit('refresh');
                MsgSuccess(t('common.settingSuccess'));
                dialogVisible.value = false;
            });
        }
    });
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
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.displaySetting')),
    width: "900",
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    alignCenter: true,
    ...{ class: "display-setting-dialog" },
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.displaySetting')),
    width: "900",
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    alignCenter: true,
    ...{ class: "display-setting-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['display-setting-dialog']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    const [{ titleId, titleClass }] = __VLS_vSlot(__VLS_7);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        id: (titleId),
        ...{ class: (titleClass) },
    });
    (__VLS_ctx.$t('views.applicationOverview.appInfo.displaySetting'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (__VLS_ctx.resetForm),
    };
    const { default: __VLS_15 } = __VLS_11.slots;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        ...{ class: "mr-4" },
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_21 } = __VLS_19.slots;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.Refresh} */
    Refresh;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    // @ts-ignore
    [$t, $t, dialogVisible, resetForm,];
    var __VLS_19;
    (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.restoreDefault'));
    // @ts-ignore
    [$t,];
    var __VLS_11;
    var __VLS_12;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        direction: "vertical",
    }));
    const __VLS_29 = __VLS_28({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-preview border border-r-6 mr-16" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['setting-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-preview-container" },
    ...{ style: ({ backgroundImage: `url(${__VLS_ctx.imgUrl?.chat_background})` }) },
});
/** @type {__VLS_StyleScopedClasses['setting-preview-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "setting-preview-header" },
    ...{ style: (__VLS_ctx.customStyle) },
});
/** @type {__VLS_StyleScopedClasses['setting-preview-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mr-12 ml-24 flex" },
});
/** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
if (__VLS_ctx.isAppIcon(__VLS_ctx.imgUrl?.icon)) {
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }));
    const __VLS_34 = __VLS_33({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const { default: __VLS_37 } = __VLS_35.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.imgUrl?.icon),
        alt: "",
    });
    // @ts-ignore
    [imgUrl, imgUrl, imgUrl, customStyle, isAppIcon,];
    var __VLS_35;
}
else {
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
    LogoIcon;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        height: "32px",
    }));
    const __VLS_40 = __VLS_39({
        height: "32px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "ellipsis" },
});
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.detail?.name || __VLS_ctx.$t('common.name'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mr-16" },
});
/** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    link: true,
}));
const __VLS_45 = __VLS_44({
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    iconName: ('app-magnify'),
    ...{ style: ({
            color: __VLS_ctx.xpackForm.custom_theme?.header_font_color,
        }) },
    ...{ style: {} },
}));
const __VLS_51 = __VLS_50({
    iconName: ('app-magnify'),
    ...{ style: ({
            color: __VLS_ctx.xpackForm.custom_theme?.header_font_color,
        }) },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
// @ts-ignore
[$t, detail, xpackForm,];
var __VLS_46;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    link: true,
}));
const __VLS_56 = __VLS_55({
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    size: (20),
    ...{ class: "color-secondary" },
    ...{ style: ({
            color: __VLS_ctx.xpackForm.custom_theme?.header_font_color,
        }) },
}));
const __VLS_62 = __VLS_61({
    size: (20),
    ...{ class: "color-secondary" },
    ...{ style: ({
            color: __VLS_ctx.xpackForm.custom_theme?.header_font_color,
        }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
const { default: __VLS_65 } = __VLS_63.slots;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.Close} */
Close;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
// @ts-ignore
[xpackForm,];
var __VLS_63;
// @ts-ignore
[];
var __VLS_57;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
if (__VLS_ctx.xpackForm.show_avatar) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "avatar" },
    });
    /** @type {__VLS_StyleScopedClasses['avatar']} */ ;
    if (__VLS_ctx.imgUrl.avatar) {
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            src: (__VLS_ctx.imgUrl.avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }));
        const __VLS_73 = __VLS_72({
            src: (__VLS_ctx.imgUrl.avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    }
    else {
        let __VLS_76;
        /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
        LogoIcon;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
            height: "28px",
            ...{ style: {} },
        }));
        const __VLS_78 = __VLS_77({
            height: "28px",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/application/display-bg2.png",
    alt: "",
    width: (__VLS_ctx.xpackForm.show_avatar
        ? __VLS_ctx.xpackForm.show_user_avatar
            ? '232px'
            : '270px'
        : __VLS_ctx.xpackForm.show_user_avatar
            ? '260px'
            : '300px'),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex mt-4" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/application/display-bg3.png",
    alt: "",
    width: (__VLS_ctx.xpackForm.show_user_avatar
        ? __VLS_ctx.xpackForm.show_avatar
            ? '227px'
            : '255px'
        : __VLS_ctx.xpackForm.show_avatar
            ? '265px'
            : '292px'),
    ...{ style: {} },
});
if (__VLS_ctx.xpackForm.show_user_avatar) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "avatar ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['avatar']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    if (__VLS_ctx.imgUrl.user_avatar) {
        let __VLS_81;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
            src: (__VLS_ctx.imgUrl.user_avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }));
        const __VLS_83 = __VLS_82({
            src: (__VLS_ctx.imgUrl.user_avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    }
    else {
        let __VLS_86;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
            size: (28),
        }));
        const __VLS_88 = __VLS_87({
            size: (28),
        }, ...__VLS_functionalComponentArgsRest(__VLS_87));
        const { default: __VLS_91 } = __VLS_89.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/user-icon.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [imgUrl, imgUrl, imgUrl, imgUrl, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm,];
        var __VLS_89;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
    ...{ class: "p-16 text-center w-full" },
});
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/application/display-bg1.png",
    alt: "",
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
if (__VLS_ctx.xpackForm.disclaimer) {
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        type: "info",
        ...{ class: "mt-8 font-small" },
    }));
    const __VLS_94 = __VLS_93({
        type: "info",
        ...{ class: "mt-8 font-small" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    const { default: __VLS_97 } = __VLS_95.slots;
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip'] | typeof __VLS_components.autoTooltip | typeof __VLS_components.AutoTooltip | typeof __VLS_components['auto-tooltip']} */
    autoTooltip;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        content: (__VLS_ctx.xpackForm.disclaimer_value),
    }));
    const __VLS_100 = __VLS_99({
        content: (__VLS_ctx.xpackForm.disclaimer_value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const { default: __VLS_103 } = __VLS_101.slots;
    (__VLS_ctx.xpackForm.disclaimer_value);
    // @ts-ignore
    [xpackForm, xpackForm, xpackForm,];
    var __VLS_101;
    // @ts-ignore
    [];
    var __VLS_95;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "float_icon" },
});
/** @type {__VLS_StyleScopedClasses['float_icon']} */ ;
if (__VLS_ctx.imgUrl.float_icon) {
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
    elImage;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        src: (__VLS_ctx.imgUrl.float_icon),
        alt: "",
        fit: "cover",
        ...{ style: {} },
    }));
    const __VLS_106 = __VLS_105({
        src: (__VLS_ctx.imgUrl.float_icon),
        alt: "",
        fit: "cover",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "/MaxKB.gif",
        height: "50px",
        ...{ style: {} },
    });
}
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({}));
const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
const { default: __VLS_114 } = __VLS_112.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8" },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    ref: "displayFormRef",
    model: (__VLS_ctx.xpackForm),
}));
const __VLS_117 = __VLS_116({
    ref: "displayFormRef",
    model: (__VLS_ctx.xpackForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
var __VLS_120;
const { default: __VLS_122 } = __VLS_118.slots;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    ...{ class: "w-full mb-8" },
}));
const __VLS_125 = __VLS_124({
    ...{ class: "w-full mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_128 } = __VLS_126.slots;
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    span: (12),
}));
const __VLS_131 = __VLS_130({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
const { default: __VLS_134 } = __VLS_132.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-8" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.customThemeColor'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elColorPicker | typeof __VLS_components.ElColorPicker | typeof __VLS_components['el-color-picker']} */
elColorPicker;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    modelValue: (__VLS_ctx.xpackForm.custom_theme.theme_color),
}));
const __VLS_137 = __VLS_136({
    modelValue: (__VLS_ctx.xpackForm.custom_theme.theme_color),
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
(!__VLS_ctx.xpackForm.custom_theme.theme_color
    ? __VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.default')
    : '');
// @ts-ignore
[$t, $t, imgUrl, imgUrl, xpackForm, xpackForm, xpackForm,];
var __VLS_132;
let __VLS_140;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    span: (12),
}));
const __VLS_142 = __VLS_141({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const { default: __VLS_145 } = __VLS_143.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-8" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.headerTitleFontColor'));
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elColorPicker | typeof __VLS_components.ElColorPicker | typeof __VLS_components['el-color-picker']} */
elColorPicker;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    modelValue: (__VLS_ctx.xpackForm.custom_theme.header_font_color),
}));
const __VLS_148 = __VLS_147({
    modelValue: (__VLS_ctx.xpackForm.custom_theme.header_font_color),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
// @ts-ignore
[$t, xpackForm,];
var __VLS_143;
// @ts-ignore
[];
var __VLS_126;
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    ...{ class: "w-full mb-8" },
}));
const __VLS_153 = __VLS_152({
    ...{ class: "w-full mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_156 } = __VLS_154.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-8" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('layout.language'));
let __VLS_157;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    modelValue: (__VLS_ctx.xpackForm.language),
    clearable: true,
}));
const __VLS_159 = __VLS_158({
    modelValue: (__VLS_ctx.xpackForm.language),
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
const { default: __VLS_162 } = __VLS_160.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.langList))) {
    let __VLS_163;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_165 = __VLS_164({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    // @ts-ignore
    [$t, xpackForm, langList,];
}
// @ts-ignore
[];
var __VLS_160;
// @ts-ignore
[];
var __VLS_154;
let __VLS_168;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_170 = __VLS_169({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_173 } = __VLS_171.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.application.title') + ' LOGO');
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_174;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'icon')),
}));
const __VLS_176 = __VLS_175({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'icon')),
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
var __VLS_179;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
const { default: __VLS_181 } = __VLS_177.slots;
let __VLS_182;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
    size: "small",
}));
const __VLS_184 = __VLS_183({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
const { default: __VLS_187 } = __VLS_185.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.replace'));
// @ts-ignore
[$t, $t, onChange,];
var __VLS_185;
// @ts-ignore
[];
var __VLS_177;
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    type: "info",
    size: "small",
}));
const __VLS_190 = __VLS_189({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const { default: __VLS_193 } = __VLS_191.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.imageMessage'));
// @ts-ignore
[$t,];
var __VLS_191;
// @ts-ignore
[];
var __VLS_171;
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_196 = __VLS_195({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_199 } = __VLS_197.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.chatBackground'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'chat_background')),
}));
const __VLS_202 = __VLS_201({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'chat_background')),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_205;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
const { default: __VLS_207 } = __VLS_203.slots;
let __VLS_208;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
    size: "small",
}));
const __VLS_210 = __VLS_209({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const { default: __VLS_213 } = __VLS_211.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.replace'));
// @ts-ignore
[$t, $t, onChange,];
var __VLS_211;
// @ts-ignore
[];
var __VLS_203;
let __VLS_214;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    type: "info",
    size: "small",
}));
const __VLS_216 = __VLS_215({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
const { default: __VLS_219 } = __VLS_217.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.chatBackgroundMessage'));
// @ts-ignore
[$t,];
var __VLS_217;
// @ts-ignore
[];
var __VLS_197;
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_222 = __VLS_221({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_225 } = __VLS_223.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.AIAvatar'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_226;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
    modelValue: (__VLS_ctx.xpackForm.show_avatar),
}));
const __VLS_228 = __VLS_227({
    modelValue: (__VLS_ctx.xpackForm.show_avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
const { default: __VLS_231 } = __VLS_229.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.display'));
// @ts-ignore
[$t, $t, xpackForm,];
var __VLS_229;
let __VLS_232;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'avatar')),
}));
const __VLS_234 = __VLS_233({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'avatar')),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
var __VLS_237;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
const { default: __VLS_239 } = __VLS_235.slots;
let __VLS_240;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
    size: "small",
}));
const __VLS_242 = __VLS_241({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
const { default: __VLS_245 } = __VLS_243.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.replace'));
// @ts-ignore
[$t, onChange,];
var __VLS_243;
// @ts-ignore
[];
var __VLS_235;
let __VLS_246;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent1(__VLS_246, new __VLS_246({
    type: "info",
    size: "small",
}));
const __VLS_248 = __VLS_247({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
const { default: __VLS_251 } = __VLS_249.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.imageMessage'));
// @ts-ignore
[$t,];
var __VLS_249;
// @ts-ignore
[];
var __VLS_223;
let __VLS_252;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent1(__VLS_252, new __VLS_252({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_254 = __VLS_253({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_257 } = __VLS_255.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.askUserAvatar'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_258;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
    modelValue: (__VLS_ctx.xpackForm.show_user_avatar),
}));
const __VLS_260 = __VLS_259({
    modelValue: (__VLS_ctx.xpackForm.show_user_avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
const { default: __VLS_263 } = __VLS_261.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.display'));
// @ts-ignore
[$t, $t, xpackForm,];
var __VLS_261;
let __VLS_264;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'user_avatar')),
}));
const __VLS_266 = __VLS_265({
    ...{ class: "ml-8" },
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'user_avatar')),
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
var __VLS_269;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
const { default: __VLS_271 } = __VLS_267.slots;
let __VLS_272;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    size: "small",
}));
const __VLS_274 = __VLS_273({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
const { default: __VLS_277 } = __VLS_275.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.replace'));
// @ts-ignore
[$t, onChange,];
var __VLS_275;
// @ts-ignore
[];
var __VLS_267;
let __VLS_278;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
    type: "info",
    size: "small",
}));
const __VLS_280 = __VLS_279({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
const { default: __VLS_283 } = __VLS_281.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.imageMessage'));
// @ts-ignore
[$t,];
var __VLS_281;
// @ts-ignore
[];
var __VLS_255;
let __VLS_284;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_286 = __VLS_285({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_289 } = __VLS_287.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.floatIcon'));
let __VLS_290;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent1(__VLS_290, new __VLS_290({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'float_icon')),
}));
const __VLS_292 = __VLS_291({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'float_icon')),
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
var __VLS_295;
const { default: __VLS_297 } = __VLS_293.slots;
let __VLS_298;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
    size: "small",
}));
const __VLS_300 = __VLS_299({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_299));
const { default: __VLS_303 } = __VLS_301.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.replace'));
// @ts-ignore
[$t, $t, onChange,];
var __VLS_301;
// @ts-ignore
[];
var __VLS_293;
let __VLS_304;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
    type: "info",
    size: "small",
}));
const __VLS_306 = __VLS_305({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
const { default: __VLS_309 } = __VLS_307.slots;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.imageMessage'));
// @ts-ignore
[$t,];
var __VLS_307;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border-t mt-8" },
});
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconDefaultPosition'));
let __VLS_310;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({
    modelValue: (__VLS_ctx.xpackForm.draggable),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.draggablePosition')),
}));
const __VLS_312 = __VLS_311({
    modelValue: (__VLS_ctx.xpackForm.draggable),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.draggablePosition')),
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
let __VLS_315;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_316 = __VLS_asFunctionalComponent1(__VLS_315, new __VLS_315({
    gutter: (8),
    ...{ class: "w-full mb-8" },
}));
const __VLS_317 = __VLS_316({
    gutter: (8),
    ...{ class: "w-full mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_316));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_320 } = __VLS_318.slots;
let __VLS_321;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
    span: (12),
}));
const __VLS_323 = __VLS_322({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_322));
const { default: __VLS_326 } = __VLS_324.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_327;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
    modelValue: (__VLS_ctx.xpackForm.float_location.x.type),
    ...{ style: {} },
}));
const __VLS_329 = __VLS_328({
    modelValue: (__VLS_ctx.xpackForm.float_location.x.type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_328));
const { default: __VLS_332 } = __VLS_330.slots;
let __VLS_333;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.left')),
    value: "left",
}));
const __VLS_335 = __VLS_334({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.left')),
    value: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_334));
let __VLS_338;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_339 = __VLS_asFunctionalComponent1(__VLS_338, new __VLS_338({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.right')),
    value: "right",
}));
const __VLS_340 = __VLS_339({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.right')),
    value: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_339));
// @ts-ignore
[$t, $t, $t, $t, xpackForm, xpackForm,];
var __VLS_330;
let __VLS_343;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({
    modelValue: (__VLS_ctx.xpackForm.float_location.x.value),
    min: (0),
    step: (1),
    precision: (0),
    valueOnClear: (0),
    stepStrictly: true,
    controlsPosition: "right",
}));
const __VLS_345 = __VLS_344({
    modelValue: (__VLS_ctx.xpackForm.float_location.x.value),
    min: (0),
    step: (1),
    precision: (0),
    valueOnClear: (0),
    stepStrictly: true,
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_344));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
// @ts-ignore
[xpackForm,];
var __VLS_324;
let __VLS_348;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent1(__VLS_348, new __VLS_348({
    span: (12),
}));
const __VLS_350 = __VLS_349({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
const { default: __VLS_353 } = __VLS_351.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_354;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent1(__VLS_354, new __VLS_354({
    modelValue: (__VLS_ctx.xpackForm.float_location.y.type),
    ...{ style: {} },
}));
const __VLS_356 = __VLS_355({
    modelValue: (__VLS_ctx.xpackForm.float_location.y.type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_355));
const { default: __VLS_359 } = __VLS_357.slots;
let __VLS_360;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent1(__VLS_360, new __VLS_360({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.top')),
    value: "top",
}));
const __VLS_362 = __VLS_361({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.top')),
    value: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
let __VLS_365;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_366 = __VLS_asFunctionalComponent1(__VLS_365, new __VLS_365({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.bottom')),
    value: "bottom",
}));
const __VLS_367 = __VLS_366({
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.iconPosition.bottom')),
    value: "bottom",
}, ...__VLS_functionalComponentArgsRest(__VLS_366));
// @ts-ignore
[$t, $t, xpackForm,];
var __VLS_357;
let __VLS_370;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_371 = __VLS_asFunctionalComponent1(__VLS_370, new __VLS_370({
    modelValue: (__VLS_ctx.xpackForm.float_location.y.value),
    min: (0),
    step: (1),
    precision: (0),
    valueOnClear: (0),
    stepStrictly: true,
    controlsPosition: "right",
}));
const __VLS_372 = __VLS_371({
    modelValue: (__VLS_ctx.xpackForm.float_location.y.value),
    min: (0),
    step: (1),
    precision: (0),
    valueOnClear: (0),
    stepStrictly: true,
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_371));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
// @ts-ignore
[xpackForm,];
var __VLS_351;
// @ts-ignore
[];
var __VLS_318;
// @ts-ignore
[];
var __VLS_287;
let __VLS_375;
/** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
elSpace;
// @ts-ignore
const __VLS_376 = __VLS_asFunctionalComponent1(__VLS_375, new __VLS_375({
    direction: "vertical",
    alignment: "start",
    size: (2),
}));
const __VLS_377 = __VLS_376({
    direction: "vertical",
    alignment: "start",
    size: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_376));
const { default: __VLS_380 } = __VLS_378.slots;
let __VLS_381;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_382 = __VLS_asFunctionalComponent1(__VLS_381, new __VLS_381({
    modelValue: (__VLS_ctx.xpackForm.show_source),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showSourceLabel')),
}));
const __VLS_383 = __VLS_382({
    modelValue: (__VLS_ctx.xpackForm.show_source),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showSourceLabel')),
}, ...__VLS_functionalComponentArgsRest(__VLS_382));
let __VLS_386;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_387 = __VLS_asFunctionalComponent1(__VLS_386, new __VLS_386({
    modelValue: (__VLS_ctx.xpackForm.show_exec),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showExecutionDetail')),
}));
const __VLS_388 = __VLS_387({
    modelValue: (__VLS_ctx.xpackForm.show_exec),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showExecutionDetail')),
}, ...__VLS_functionalComponentArgsRest(__VLS_387));
let __VLS_391;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_392 = __VLS_asFunctionalComponent1(__VLS_391, new __VLS_391({
    modelValue: (__VLS_ctx.xpackForm.show_history),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showHistory')),
}));
const __VLS_393 = __VLS_392({
    modelValue: (__VLS_ctx.xpackForm.show_history),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showHistory')),
}, ...__VLS_functionalComponentArgsRest(__VLS_392));
let __VLS_396;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent1(__VLS_396, new __VLS_396({
    modelValue: (__VLS_ctx.xpackForm.show_guide),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.displayGuide')),
}));
const __VLS_398 = __VLS_397({
    modelValue: (__VLS_ctx.xpackForm.show_guide),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.displayGuide')),
}, ...__VLS_functionalComponentArgsRest(__VLS_397));
let __VLS_401;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_402 = __VLS_asFunctionalComponent1(__VLS_401, new __VLS_401({
    modelValue: (__VLS_ctx.xpackForm.show_share),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.share')),
}));
const __VLS_403 = __VLS_402({
    modelValue: (__VLS_ctx.xpackForm.show_share),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.share')),
}, ...__VLS_functionalComponentArgsRest(__VLS_402));
let __VLS_406;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_407 = __VLS_asFunctionalComponent1(__VLS_406, new __VLS_406({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.xpackForm.disclaimer),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.disclaimer')),
}));
const __VLS_408 = __VLS_407({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.xpackForm.disclaimer),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.disclaimer')),
}, ...__VLS_functionalComponentArgsRest(__VLS_407));
let __VLS_411;
const __VLS_412 = {
    /** @type {typeof __VLS_411.change} */
    onChange: (__VLS_ctx.changeDisclaimer),
};
var __VLS_409;
var __VLS_410;
if (__VLS_ctx.xpackForm.disclaimer) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    let __VLS_413;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_414 = __VLS_asFunctionalComponent1(__VLS_413, new __VLS_413({
        content: (__VLS_ctx.xpackForm.disclaimer_value),
        placement: "top",
    }));
    const __VLS_415 = __VLS_414({
        content: (__VLS_ctx.xpackForm.disclaimer_value),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_414));
    const { default: __VLS_418 } = __VLS_416.slots;
    let __VLS_419;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_420 = __VLS_asFunctionalComponent1(__VLS_419, new __VLS_419({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.xpackForm.disclaimer_value),
        ...{ style: {} },
        maxlength: (128),
    }));
    const __VLS_421 = __VLS_420({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.xpackForm.disclaimer_value),
        ...{ style: {} },
        maxlength: (128),
    }, ...__VLS_functionalComponentArgsRest(__VLS_420));
    let __VLS_424;
    const __VLS_425 = {
        /** @type {typeof __VLS_424.change} */
        onChange: (__VLS_ctx.changeValue),
    };
    var __VLS_422;
    var __VLS_423;
    // @ts-ignore
    [$t, $t, $t, $t, $t, $t, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, xpackForm, changeDisclaimer, changeValue,];
    var __VLS_416;
}
// @ts-ignore
[];
var __VLS_378;
// @ts-ignore
[];
var __VLS_118;
// @ts-ignore
[];
var __VLS_112;
{
    const { footer: __VLS_426 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_427;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_428 = __VLS_asFunctionalComponent1(__VLS_427, new __VLS_427({
        ...{ 'onClick': {} },
    }));
    const __VLS_429 = __VLS_428({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_428));
    let __VLS_432;
    const __VLS_433 = {
        /** @type {typeof __VLS_432.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_434 } = __VLS_430.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_430;
    var __VLS_431;
    let __VLS_435;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_436 = __VLS_asFunctionalComponent1(__VLS_435, new __VLS_435({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_437 = __VLS_436({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_436));
    let __VLS_440;
    const __VLS_441 = {
        /** @type {typeof __VLS_440.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.displayFormRef);
            // @ts-ignore
            [loading, submit, displayFormRef,];
        },
    };
    const { default: __VLS_442 } = __VLS_438.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_438;
    var __VLS_439;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_121 = __VLS_120, __VLS_180 = __VLS_179, __VLS_206 = __VLS_205, __VLS_238 = __VLS_237, __VLS_270 = __VLS_269, __VLS_296 = __VLS_295;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
