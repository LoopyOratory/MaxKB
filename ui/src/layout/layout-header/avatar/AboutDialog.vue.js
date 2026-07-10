/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
import licenseApi from '@/api/system/license';
import { fromNowDate } from '@/utils/time';
import useStore from '@/stores';
import { t } from '@/locales';
import { hasPermission } from '@/utils/permission';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
const { user, theme } = useStore();
const isDefaultTheme = computed(() => {
    return theme.isDefaultTheme();
});
const aboutDialogVisible = ref(false);
const loading = ref(false);
const licenseInfo = ref(null);
const isUpdate = ref(false);
watch(aboutDialogVisible, (bool) => {
    if (!bool) {
        if (isUpdate.value) {
            window.location.reload();
        }
        isUpdate.value = false;
    }
});
const open = () => {
    if (user.showXpack()) {
        getLicenseInfo();
    }
    aboutDialogVisible.value = true;
};
const onChange = (file) => {
    const fd = new FormData();
    fd.append('license_file', file.raw);
    licenseApi.putLicense(fd, loading).then((res) => {
        getLicenseInfo();
        isUpdate.value = true;
    });
};
const editionText = computed(() => {
    if (!user)
        return '-';
    if (user.getEditionName() === 'PE') {
        return t('layout.about.edition.professional');
    }
    else if (user.getEditionName() === 'EE') {
        return t('layout.about.edition.enterprise');
    }
    else {
        return t('layout.about.edition.community');
    }
});
function getLicenseInfo() {
    licenseApi.getLicense(loading).then((res) => {
        licenseInfo.value = res.data?.license;
    });
}
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
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
    modelValue: (__VLS_ctx.aboutDialogVisible),
    ...{ class: "about-dialog border-r-6" },
    ...{ class: (!__VLS_ctx.isDefaultTheme ? 'dialog-custom-header' : '') },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.aboutDialogVisible),
    ...{ class: "about-dialog border-r-6" },
    ...{ class: (!__VLS_ctx.isDefaultTheme ? 'dialog-custom-header' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['about-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    const [{ titleId, titleClass }] = __VLS_vSlot(__VLS_7);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "logo flex-center" },
        id: (titleId),
        ...{ class: (titleClass) },
    });
    /** @type {__VLS_StyleScopedClasses['logo']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.LogoFull} */
    LogoFull;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        height: "59px",
    }));
    const __VLS_10 = __VLS_9({
        height: "59px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    // @ts-ignore
    [aboutDialogVisible, isDefaultTheme,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "about-ui" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['about-ui']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label" },
});
/** @type {__VLS_StyleScopedClasses['label']} */ ;
(__VLS_ctx.$t('layout.about.authorize'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.licenseInfo?.corporation || '-');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label" },
});
/** @type {__VLS_StyleScopedClasses['label']} */ ;
(__VLS_ctx.$t('layout.about.expiredTime'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.licenseInfo?.expired || '-');
if (__VLS_ctx.licenseInfo?.expired && __VLS_ctx.fromNowDate(__VLS_ctx.licenseInfo?.expired)) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    (__VLS_ctx.fromNowDate(__VLS_ctx.licenseInfo?.expired));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label" },
});
/** @type {__VLS_StyleScopedClasses['label']} */ ;
(__VLS_ctx.$t('layout.about.edition.label'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.editionText);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label" },
});
/** @type {__VLS_StyleScopedClasses['label']} */ ;
(__VLS_ctx.$t('layout.about.version'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.user.version);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label" },
});
/** @type {__VLS_StyleScopedClasses['label']} */ ;
(__VLS_ctx.$t('layout.about.serialNo'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.licenseInfo?.serialNo || '-');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "label" },
});
/** @type {__VLS_StyleScopedClasses['label']} */ ;
(__VLS_ctx.$t('layout.about.remark'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.licenseInfo?.remark || '-');
if (__VLS_ctx.user.showXpack()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-16 flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    if (__VLS_ctx.hasPermission([
        __VLS_ctx.RoleConst.ADMIN,
        __VLS_ctx.PermissionConst.ABOUT_UPDATE
    ], 'OR')) {
        let __VLS_13;
        /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
        elUpload;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
            ref: "uploadRef",
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            onChange: (__VLS_ctx.onChange),
        }));
        const __VLS_15 = __VLS_14({
            ref: "uploadRef",
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            onChange: (__VLS_ctx.onChange),
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        var __VLS_18;
        const { default: __VLS_20 } = __VLS_16.slots;
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            ...{ class: "border-primary mr-16" },
        }));
        const __VLS_23 = __VLS_22({
            ...{ class: "border-primary mr-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        /** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
        const { default: __VLS_26 } = __VLS_24.slots;
        (__VLS_ctx.$t('layout.about.update'));
        // @ts-ignore
        [vLoading, loading, $t, $t, $t, $t, $t, $t, $t, licenseInfo, licenseInfo, licenseInfo, licenseInfo, licenseInfo, licenseInfo, licenseInfo, fromNowDate, fromNowDate, editionText, user, user, hasPermission, RoleConst, PermissionConst, onChange,];
        var __VLS_24;
        // @ts-ignore
        [];
        var __VLS_16;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border-t text-center mt-16 p-16 pb-0" },
});
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    type: "info",
}));
const __VLS_29 = __VLS_28({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
(__VLS_ctx.$t('layout.copyright'));
// @ts-ignore
[$t,];
var __VLS_30;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_19 = __VLS_18;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
