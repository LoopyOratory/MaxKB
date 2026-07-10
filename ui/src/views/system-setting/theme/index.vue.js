/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { cloneDeep } from 'lodash';
import LoginPreview from './LoginPreview.vue';
import { themeList, defaultSetting, defaultPlatformSetting } from '@/utils/theme';
import ThemeApi from '@/api/system-settings/theme';
import { MsgSuccess, MsgError } from '@/utils/message';
import useStore from '@/stores';
import { t } from '@/locales';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { ComplexPermission } from '@/utils/permission/type';
const { theme } = useStore();
const router = useRouter();
onBeforeRouteLeave((to, from) => {
    theme.setTheme(cloneTheme.value);
});
const themeInfo = computed(() => theme.themeInfo);
const isDefaultTheme = computed(() => {
    return theme.isDefaultTheme();
});
const themeFormRef = ref();
const loading = ref(false);
const cloneTheme = ref(null);
const themeForm = ref({
    theme: '',
    icon: '',
    loginLogo: '',
    loginImage: '',
    title: 'MaxKB',
    slogan: t('theme.defaultSlogan'),
    ...defaultPlatformSetting,
});
const themeRadio = ref('');
const customColor = ref('');
const rules = reactive({
    title: [{ required: true, message: t('theme.websiteNamePlaceholder'), trigger: 'blur' }],
    slogan: [{ required: true, message: t('theme.websiteSloganPlaceholder'), trigger: 'blur' }],
});
const onChange = (file, fileList, attr) => {
    const isLimit = file?.size / 1024 / 1024 < 10;
    if (!isLimit) {
        MsgError(t('theme.fileMessageError'));
        return false;
    }
    else {
        themeForm.value[attr] = file.raw;
    }
    theme.setTheme(themeForm.value);
};
function changeThemeHandle(val) {
    if (val !== 'custom') {
        themeForm.value.theme = val;
        theme.setTheme(themeForm.value);
    }
}
function customColorHandle(val) {
    themeForm.value.theme = val;
    theme.setTheme(themeForm.value);
}
function resetTheme() {
    theme.setTheme(cloneTheme.value);
    themeForm.value = cloneDeep(themeInfo.value);
}
function resetForm(val) {
    themeForm.value =
        val === 'login'
            ? {
                ...themeForm.value,
                theme: themeForm.value.theme,
                ...defaultSetting,
            }
            : {
                ...themeForm.value,
                theme: themeForm.value.theme,
                ...defaultPlatformSetting,
            };
    theme.setTheme(themeForm.value);
}
const updateTheme = async (formEl, test) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            const fd = new FormData();
            Object.keys(themeForm.value).map((item) => {
                fd.append(item, themeForm.value[item]);
            });
            ThemeApi.postThemeInfo(fd, loading).then((res) => {
                theme.theme();
                cloneTheme.value = cloneDeep(themeForm.value);
                MsgSuccess(t('theme.saveSuccess'));
            });
        }
    });
};
onMounted(() => {
    // if (user.isExpire()) {
    //   router.push({path: `/application`})
    // }
    if (themeInfo.value) {
        themeRadio.value = themeList.some((v) => v.value === themeInfo.value.theme)
            ? themeInfo.value.theme
            : 'custom';
        customColor.value = themeInfo.value.theme;
        themeForm.value = cloneDeep(themeInfo.value);
        cloneTheme.value = cloneDeep(themeInfo.value);
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-setting p-16-24" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['theme-setting']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
elBreadcrumb;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}));
const __VLS_2 = __VLS_1({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.t('views.system.subTitle'));
// @ts-ignore
[vLoading, loading, t,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "ml-4 color-text-primary" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
(__VLS_ctx.$t('theme.title'));
// @ts-ignore
[$t,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('theme.platformDisplayTheme'));
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.themeRadio),
    ...{ class: "app-radio-button-group" },
}));
const __VLS_32 = __VLS_31({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.themeRadio),
    ...{ class: "app-radio-button-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.change} */
    onChange: (__VLS_ctx.changeThemeHandle),
};
/** @type {__VLS_StyleScopedClasses['app-radio-button-group']} */ ;
const { default: __VLS_37 } = __VLS_33.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.themeList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_40 = __VLS_39({
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    // @ts-ignore
    [$t, themeRadio, changeThemeHandle, themeList,];
}
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    label: (__VLS_ctx.$t('common.custom')),
    value: "custom",
}));
const __VLS_45 = __VLS_44({
    label: (__VLS_ctx.$t('common.custom')),
    value: "custom",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
// @ts-ignore
[$t,];
var __VLS_33;
var __VLS_34;
if (__VLS_ctx.themeRadio === 'custom') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "mt-16 mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('theme.customTheme'));
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elColorPicker | typeof __VLS_components.ElColorPicker | typeof __VLS_components['el-color-picker']} */
    elColorPicker;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.customColor),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.customColor),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.change} */
        onChange: (__VLS_ctx.customColorHandle),
    };
    var __VLS_51;
    var __VLS_52;
}
// @ts-ignore
[$t, themeRadio, customColor, customColorHandle,];
var __VLS_27;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    ...{ style: {} },
    ...{ class: "mt-16" },
}));
const __VLS_57 = __VLS_56({
    ...{ style: {} },
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_60 } = __VLS_58.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('theme.platformLoginSettings'));
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    shadow: "never",
    ...{ class: "layout-bg" },
}));
const __VLS_63 = __VLS_62({
    shadow: "never",
    ...{ class: "layout-bg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
const { default: __VLS_66 } = __VLS_64.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('theme.pagePreview'));
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_69 = __VLS_68({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
let __VLS_72;
const __VLS_73 = {
    /** @type {typeof __VLS_72.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.resetForm('login');
        // @ts-ignore
        [$t, $t, resetForm,];
    },
};
const { default: __VLS_74 } = __VLS_70.slots;
(__VLS_ctx.$t('theme.restoreDefaults'));
// @ts-ignore
[$t,];
var __VLS_70;
var __VLS_71;
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({}));
const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const { default: __VLS_80 } = __VLS_78.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-preview" },
});
/** @type {__VLS_StyleScopedClasses['theme-preview']} */ ;
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    gutter: (8),
}));
const __VLS_83 = __VLS_82({
    gutter: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
const { default: __VLS_86 } = __VLS_84.slots;
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    span: (16),
}));
const __VLS_89 = __VLS_88({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_92 } = __VLS_90.slots;
const __VLS_93 = LoginPreview;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    data: (__VLS_ctx.themeForm),
}));
const __VLS_95 = __VLS_94({
    data: (__VLS_ctx.themeForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
// @ts-ignore
[themeForm,];
var __VLS_90;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    span: (8),
}));
const __VLS_100 = __VLS_99({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
const { default: __VLS_103 } = __VLS_101.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-form" },
});
/** @type {__VLS_StyleScopedClasses['theme-form']} */ ;
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_106 = __VLS_105({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_109 } = __VLS_107.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('theme.websiteLogo'));
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'icon')),
}));
const __VLS_112 = __VLS_111({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'icon')),
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
var __VLS_115;
const { default: __VLS_117 } = __VLS_113.slots;
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    size: "small",
}));
const __VLS_120 = __VLS_119({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
(__VLS_ctx.$t('theme.replacePicture'));
// @ts-ignore
[$t, $t, onChange,];
var __VLS_121;
// @ts-ignore
[];
var __VLS_113;
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    type: "info",
    size: "small",
}));
const __VLS_126 = __VLS_125({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const { default: __VLS_129 } = __VLS_127.slots;
(__VLS_ctx.$t('theme.websiteLogoTip'));
// @ts-ignore
[$t,];
var __VLS_127;
// @ts-ignore
[];
var __VLS_107;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_132 = __VLS_131({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_135 } = __VLS_133.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('theme.loginLogo'));
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'loginLogo')),
}));
const __VLS_138 = __VLS_137({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'loginLogo')),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
var __VLS_141;
const { default: __VLS_143 } = __VLS_139.slots;
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    size: "small",
}));
const __VLS_146 = __VLS_145({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
const { default: __VLS_149 } = __VLS_147.slots;
(__VLS_ctx.$t('theme.replacePicture'));
// @ts-ignore
[$t, $t, onChange,];
var __VLS_147;
// @ts-ignore
[];
var __VLS_139;
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
    type: "info",
    size: "small",
}));
const __VLS_152 = __VLS_151({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
const { default: __VLS_155 } = __VLS_153.slots;
(__VLS_ctx.$t('theme.loginLogoTip'));
// @ts-ignore
[$t,];
var __VLS_153;
// @ts-ignore
[];
var __VLS_133;
let __VLS_156;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
    shadow: "never",
    ...{ class: "mb-8" },
}));
const __VLS_158 = __VLS_157({
    shadow: "never",
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_161 } = __VLS_159.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('theme.loginBackground'));
let __VLS_162;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'loginImage')),
}));
const __VLS_164 = __VLS_163({
    ref: "uploadRef",
    action: "#",
    autoUpload: (false),
    showFileList: (false),
    accept: "image/jpeg, image/png, image/gif",
    onChange: ((file, fileList) => __VLS_ctx.onChange(file, fileList, 'loginImage')),
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
var __VLS_167;
const { default: __VLS_169 } = __VLS_165.slots;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    size: "small",
}));
const __VLS_172 = __VLS_171({
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
const { default: __VLS_175 } = __VLS_173.slots;
(__VLS_ctx.$t('theme.replacePicture'));
// @ts-ignore
[$t, $t, onChange,];
var __VLS_173;
// @ts-ignore
[];
var __VLS_165;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    type: "info",
    size: "small",
}));
const __VLS_178 = __VLS_177({
    type: "info",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const { default: __VLS_181 } = __VLS_179.slots;
(__VLS_ctx.$t('theme.loginBackgroundTip'));
// @ts-ignore
[$t,];
var __VLS_179;
// @ts-ignore
[];
var __VLS_159;
let __VLS_182;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
    ...{ 'onSubmit': {} },
    ref: "themeFormRef",
    model: (__VLS_ctx.themeForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}));
const __VLS_184 = __VLS_183({
    ...{ 'onSubmit': {} },
    ref: "themeFormRef",
    model: (__VLS_ctx.themeForm),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    rules: (__VLS_ctx.rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
let __VLS_187;
const __VLS_188 = {
    /** @type {typeof __VLS_187.submit} */
    onSubmit: () => { },
};
var __VLS_189;
const { default: __VLS_191 } = __VLS_185.slots;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    label: (__VLS_ctx.$t('theme.websiteName')),
    prop: "title",
}));
const __VLS_194 = __VLS_193({
    label: (__VLS_ctx.$t('theme.websiteName')),
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const { default: __VLS_197 } = __VLS_195.slots;
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    modelValue: (__VLS_ctx.themeForm.title),
    placeholder: (__VLS_ctx.$t('theme.websiteNamePlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}));
const __VLS_200 = __VLS_199({
    modelValue: (__VLS_ctx.themeForm.title),
    placeholder: (__VLS_ctx.$t('theme.websiteNamePlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
let __VLS_203;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
    type: "info",
}));
const __VLS_205 = __VLS_204({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
const { default: __VLS_208 } = __VLS_206.slots;
(__VLS_ctx.$t('theme.websiteNameTip'));
// @ts-ignore
[$t, $t, $t, themeForm, themeForm, rules,];
var __VLS_206;
// @ts-ignore
[];
var __VLS_195;
let __VLS_209;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    label: (__VLS_ctx.$t('theme.websiteSlogan')),
    prop: "slogan",
}));
const __VLS_211 = __VLS_210({
    label: (__VLS_ctx.$t('theme.websiteSlogan')),
    prop: "slogan",
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
const { default: __VLS_214 } = __VLS_212.slots;
let __VLS_215;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
    modelValue: (__VLS_ctx.themeForm.slogan),
    placeholder: (__VLS_ctx.$t('theme.websiteSloganPlaceholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_217 = __VLS_216({
    modelValue: (__VLS_ctx.themeForm.slogan),
    placeholder: (__VLS_ctx.$t('theme.websiteSloganPlaceholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    type: "info",
}));
const __VLS_222 = __VLS_221({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const { default: __VLS_225 } = __VLS_223.slots;
(__VLS_ctx.$t('theme.websiteSloganTip'));
// @ts-ignore
[$t, $t, $t, themeForm,];
var __VLS_223;
// @ts-ignore
[];
var __VLS_212;
// @ts-ignore
[];
var __VLS_185;
var __VLS_186;
// @ts-ignore
[];
var __VLS_101;
// @ts-ignore
[];
var __VLS_84;
// @ts-ignore
[];
var __VLS_78;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-16" },
});
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
let __VLS_226;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
    type: "info",
}));
const __VLS_228 = __VLS_227({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
const { default: __VLS_231 } = __VLS_229.slots;
(__VLS_ctx.$t('theme.logoDefaultTip'));
// @ts-ignore
[$t,];
var __VLS_229;
// @ts-ignore
[];
var __VLS_64;
// @ts-ignore
[];
var __VLS_58;
let __VLS_232;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
    ...{ style: {} },
    ...{ class: "mt-16" },
}));
const __VLS_234 = __VLS_233({
    ...{ style: {} },
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_237 } = __VLS_235.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('theme.platformSetting'));
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    shadow: "never",
    ...{ class: "layout-bg" },
}));
const __VLS_240 = __VLS_239({
    shadow: "never",
    ...{ class: "layout-bg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
const { default: __VLS_243 } = __VLS_241.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('theme.pagePreview'));
let __VLS_244;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_246 = __VLS_245({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
let __VLS_249;
const __VLS_250 = {
    /** @type {typeof __VLS_249.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.resetForm('platform');
        // @ts-ignore
        [$t, $t, resetForm,];
    },
};
const { default: __VLS_251 } = __VLS_247.slots;
(__VLS_ctx.$t('theme.restoreDefaults'));
// @ts-ignore
[$t,];
var __VLS_247;
var __VLS_248;
let __VLS_252;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent1(__VLS_252, new __VLS_252({}));
const __VLS_254 = __VLS_253({}, ...__VLS_functionalComponentArgsRest(__VLS_253));
const { default: __VLS_257 } = __VLS_255.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-preview" },
});
/** @type {__VLS_StyleScopedClasses['theme-preview']} */ ;
let __VLS_258;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
    gutter: (8),
}));
const __VLS_260 = __VLS_259({
    gutter: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
const { default: __VLS_263 } = __VLS_261.slots;
let __VLS_264;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
    span: (16),
}));
const __VLS_266 = __VLS_265({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
const { default: __VLS_269 } = __VLS_267.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-platform mr-16" },
});
/** @type {__VLS_StyleScopedClasses['theme-platform']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-platform-header border-b flex-between" },
    ...{ class: (!__VLS_ctx.isDefaultTheme ? 'custom-header' : '') },
});
/** @type {__VLS_StyleScopedClasses['theme-platform-header']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-center h-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-title-container cursor" },
});
/** @type {__VLS_StyleScopedClasses['app-title-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo flex-center" },
});
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
let __VLS_270;
/** @ts-ignore @type { | typeof __VLS_components.LogoFull} */
LogoFull;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    height: "25px",
}));
const __VLS_272 = __VLS_271({
    height: "25px",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-center" },
});
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
if (__VLS_ctx.themeForm.showProject) {
    let __VLS_275;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({
        iconName: "app-github",
        ...{ class: "cursor color-secondary mr-8 ml-8" },
        ...{ style: {} },
    }));
    const __VLS_277 = __VLS_276({
        iconName: "app-github",
        ...{ class: "cursor color-secondary mr-8 ml-8" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_276));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
}
if (__VLS_ctx.themeForm.showUserManual) {
    let __VLS_280;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
        iconName: "app-user-manual",
        ...{ class: "cursor color-secondary mr-8 ml-8" },
        ...{ style: {} },
    }));
    const __VLS_282 = __VLS_281({
        iconName: "app-user-manual",
        ...{ class: "cursor color-secondary mr-8 ml-8" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
}
if (__VLS_ctx.themeForm.showForum) {
    let __VLS_285;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
        iconName: "app-problems",
        ...{ class: "cursor color-secondary ml-8" },
        ...{ style: {} },
    }));
    const __VLS_287 = __VLS_286({
        iconName: "app-problems",
        ...{ class: "cursor color-secondary ml-8" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
}
// @ts-ignore
[themeForm, themeForm, themeForm, isDefaultTheme,];
var __VLS_267;
let __VLS_290;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent1(__VLS_290, new __VLS_290({
    span: (8),
}));
const __VLS_292 = __VLS_291({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
const { default: __VLS_295 } = __VLS_293.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-form" },
});
/** @type {__VLS_StyleScopedClasses['theme-form']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_296;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
    modelValue: (__VLS_ctx.themeForm.showUserManual),
    label: (__VLS_ctx.$t('theme.showUserManual')),
}));
const __VLS_298 = __VLS_297({
    modelValue: (__VLS_ctx.themeForm.showUserManual),
    label: (__VLS_ctx.$t('theme.showUserManual')),
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-24" },
});
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
let __VLS_301;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
    modelValue: (__VLS_ctx.themeForm.userManualUrl),
    placeholder: (__VLS_ctx.$t('theme.urlPlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}));
const __VLS_303 = __VLS_302({
    modelValue: (__VLS_ctx.themeForm.userManualUrl),
    placeholder: (__VLS_ctx.$t('theme.urlPlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}, ...__VLS_functionalComponentArgsRest(__VLS_302));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-4" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
let __VLS_306;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
    modelValue: (__VLS_ctx.themeForm.showForum),
    label: (__VLS_ctx.$t('theme.showForum')),
}));
const __VLS_308 = __VLS_307({
    modelValue: (__VLS_ctx.themeForm.showForum),
    label: (__VLS_ctx.$t('theme.showForum')),
}, ...__VLS_functionalComponentArgsRest(__VLS_307));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-24" },
});
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
let __VLS_311;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({
    modelValue: (__VLS_ctx.themeForm.forumUrl),
    placeholder: (__VLS_ctx.$t('theme.urlPlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}));
const __VLS_313 = __VLS_312({
    modelValue: (__VLS_ctx.themeForm.forumUrl),
    placeholder: (__VLS_ctx.$t('theme.urlPlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-4" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
let __VLS_316;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
    modelValue: (__VLS_ctx.themeForm.showProject),
    label: (__VLS_ctx.$t('theme.showProject')),
}));
const __VLS_318 = __VLS_317({
    modelValue: (__VLS_ctx.themeForm.showProject),
    label: (__VLS_ctx.$t('theme.showProject')),
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-24" },
});
/** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
let __VLS_321;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
    modelValue: (__VLS_ctx.themeForm.projectUrl),
    placeholder: (__VLS_ctx.$t('theme.urlPlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}));
const __VLS_323 = __VLS_322({
    modelValue: (__VLS_ctx.themeForm.projectUrl),
    placeholder: (__VLS_ctx.$t('theme.urlPlaceholder')),
    showWordLimit: true,
    maxlength: "128",
}, ...__VLS_functionalComponentArgsRest(__VLS_322));
// @ts-ignore
[$t, $t, $t, $t, $t, $t, themeForm, themeForm, themeForm, themeForm, themeForm, themeForm,];
var __VLS_293;
// @ts-ignore
[];
var __VLS_261;
// @ts-ignore
[];
var __VLS_255;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-16" },
});
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
let __VLS_326;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
    type: "info",
}));
const __VLS_328 = __VLS_327({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
const { default: __VLS_331 } = __VLS_329.slots;
(__VLS_ctx.$t('theme.defaultTip'));
// @ts-ignore
[$t,];
var __VLS_329;
// @ts-ignore
[];
var __VLS_241;
// @ts-ignore
[];
var __VLS_235;
// @ts-ignore
[];
var __VLS_21;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "theme-setting__operate w-full p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['theme-setting__operate']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
let __VLS_332;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent1(__VLS_332, new __VLS_332({
    ...{ 'onClick': {} },
}));
const __VLS_334 = __VLS_333({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
let __VLS_337;
const __VLS_338 = {
    /** @type {typeof __VLS_337.click} */
    onClick: (__VLS_ctx.resetTheme),
};
const { default: __VLS_339 } = __VLS_335.slots;
(__VLS_ctx.$t('theme.abandonUpdate'));
// @ts-ignore
[$t, resetTheme,];
var __VLS_335;
var __VLS_336;
let __VLS_340;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent1(__VLS_340, new __VLS_340({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_342 = __VLS_341({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
let __VLS_345;
const __VLS_346 = {
    /** @type {typeof __VLS_345.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.updateTheme(__VLS_ctx.themeFormRef);
        // @ts-ignore
        [updateTheme, themeFormRef,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.APPEARANCE_SETTINGS_EDIT], [], 'OR')) }, null, null);
const { default: __VLS_347 } = __VLS_343.slots;
(__VLS_ctx.$t('theme.saveAndApply'));
// @ts-ignore
[$t, vHasPermission, ComplexPermission, RoleConst, PermissionConst,];
var __VLS_343;
var __VLS_344;
// @ts-ignore
var __VLS_116 = __VLS_115, __VLS_142 = __VLS_141, __VLS_168 = __VLS_167, __VLS_190 = __VLS_189;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
