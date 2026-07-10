/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed } from 'vue';
import useStore from '@/stores';
import { useRouter } from 'vue-router';
import { t } from '@/locales';
import ResetPassword from './ResetPassword.vue';
import AboutDialog from './AboutDialog.vue';
// import UserPwdDialog from '@/views/user-manage/component/UserPwdDialog.vue'
import APIKeyDialog from './APIKeyDialog.vue';
import { ComplexPermission } from '@/utils/permission/type';
import { langList } from '@/locales/index';
import { hasPermission } from '@/utils/permission';
import { PermissionConst, RoleConst, EditionConst } from '@/utils/permission/data';
import { i18n_name } from '@/utils/common';
const { user, login } = useStore();
const router = useRouter();
const AboutDialogRef = ref();
const APIKeyDialogRef = ref();
const resetPasswordRef = ref();
// const { changeLocale } = useLocale()
const changeLang = (lang) => {
    user.postUserLanguage(lang);
    // changeLocale(lang)
};
const openAbout = () => {
    AboutDialogRef.value?.open();
};
function openAPIKeyDialog() {
    APIKeyDialogRef.value.open();
}
const openResetPassword = () => {
    resetPasswordRef.value?.open();
};
const m = {
    SystemAdmin: 'layout.about.inner_admin',
    WorkspaceAdmin: 'layout.about.inner_wsm',
    NormalUser: 'layout.about.inner_user',
};
const role_list = computed(() => {
    if (!user.userInfo) {
        return [];
    }
    return user.userInfo?.role_name?.map((name) => {
        const inner = m[name];
        if (inner) {
            return t(inner);
        }
        return name;
    });
});
const logout = () => {
    login.logout().then(() => {
        if (user?.userInfo?.source && ['CAS', 'OIDC', 'OAuth2'].includes(user.userInfo.source)) {
            router.push({ name: 'login', query: { login_mode: 'manual' } });
        }
        else {
            router.push({ name: 'login' });
        }
    });
};
onMounted(() => {
    if (user.userInfo?.is_edit_password) {
        resetPasswordRef.value?.open();
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    trigger: "click",
    placement: "bottom-end",
}));
const __VLS_2 = __VLS_1({
    trigger: "click",
    placement: "bottom-end",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-center cursor" },
});
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    size: (30),
}));
const __VLS_8 = __VLS_7({
    size: (30),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/user-icon.svg",
    ...{ style: {} },
    alt: "",
});
var __VLS_9;
{
    const { dropdown: __VLS_12 } = __VLS_3.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        ...{ class: "avatar-dropdown" },
    }));
    const __VLS_15 = __VLS_14({
        ...{ class: "avatar-dropdown" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {__VLS_StyleScopedClasses['avatar-dropdown']} */ ;
    const { default: __VLS_18 } = __VLS_16.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "userInfo flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['userInfo']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-12 flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        size: (30),
    }));
    const __VLS_21 = __VLS_20({
        size: (30),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/user-icon.svg",
        ...{ style: {} },
        alt: "",
    });
    var __VLS_22;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "bold mb-4" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    (__VLS_ctx.i18n_name(__VLS_ctx.user.userInfo?.nick_name));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-secondary lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.user.userInfo?.username);
    if (__VLS_ctx.user.userInfo?.role_name && __VLS_ctx.user.userInfo.role_name.length > 0) {
        if (__VLS_ctx.hasPermission([__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.EditionConst.IS_PE], 'OR')) {
            let __VLS_25;
            /** @ts-ignore @type { | typeof __VLS_components.TagGroup} */
            TagGroup;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
                size: "small",
                tags: (__VLS_ctx.role_list),
            }));
            const __VLS_27 = __VLS_26({
                size: "small",
                tags: (__VLS_ctx.role_list),
            }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        }
    }
    if (__VLS_ctx.hasPermission([
        __VLS_ctx.RoleConst.EXTENDS_ADMIN,
        __VLS_ctx.RoleConst.EXTENDS_WORKSPACE_MANAGE,
        __VLS_ctx.RoleConst.ADMIN,
        __VLS_ctx.RoleConst.WORKSPACE_MANAGE,
    ], 'OR')) {
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            ...{ 'onClick': {} },
            ...{ class: "border-t" },
        }));
        const __VLS_32 = __VLS_31({
            ...{ 'onClick': {} },
            ...{ class: "border-t" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        let __VLS_35;
        const __VLS_36 = {
            /** @type {typeof __VLS_35.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.hasPermission([
                    __VLS_ctx.RoleConst.EXTENDS_ADMIN,
                    __VLS_ctx.RoleConst.EXTENDS_WORKSPACE_MANAGE,
                    __VLS_ctx.RoleConst.ADMIN,
                    __VLS_ctx.RoleConst.WORKSPACE_MANAGE,
                ], 'OR')))
                    throw 0;
                return __VLS_ctx.router.push({ path: `/system/user` });
                // @ts-ignore
                [i18n_name, user, user, user, user, hasPermission, hasPermission, EditionConst, EditionConst, role_list, RoleConst, RoleConst, RoleConst, RoleConst, router,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        const { default: __VLS_37 } = __VLS_33.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        (__VLS_ctx.$t('views.system.title'));
        // @ts-ignore
        [$t,];
        var __VLS_33;
        var __VLS_34;
    }
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE, __VLS_ctx.RoleConst.USER], [__VLS_ctx.PermissionConst.CHANGE_PASSWORD], [], 'OR'), 'OR')) {
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            ...{ 'onClick': {} },
        }));
        const __VLS_40 = __VLS_39({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        let __VLS_43;
        const __VLS_44 = {
            /** @type {typeof __VLS_43.click} */
            onClick: (__VLS_ctx.openResetPassword),
        };
        const { default: __VLS_45 } = __VLS_41.slots;
        (__VLS_ctx.$t('views.login.resetPassword'));
        // @ts-ignore
        [hasPermission, RoleConst, RoleConst, RoleConst, $t, ComplexPermission, PermissionConst, openResetPassword,];
        var __VLS_41;
        var __VLS_42;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE, __VLS_ctx.RoleConst.USER], [__VLS_ctx.PermissionConst.SYSTEM_API_KEY_EDIT], [__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.EditionConst.IS_PE], 'OR'), 'OR')) {
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            ...{ 'onClick': {} },
            ...{ class: "p-8" },
        }));
        const __VLS_48 = __VLS_47({
            ...{ 'onClick': {} },
            ...{ class: "p-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        let __VLS_51;
        const __VLS_52 = {
            /** @type {typeof __VLS_51.click} */
            onClick: (__VLS_ctx.openAPIKeyDialog),
        };
        /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
        const { default: __VLS_53 } = __VLS_49.slots;
        (__VLS_ctx.$t('layout.apiKey'));
        // @ts-ignore
        [hasPermission, EditionConst, EditionConst, RoleConst, RoleConst, RoleConst, RoleConst, $t, ComplexPermission, PermissionConst, openAPIKeyDialog,];
        var __VLS_49;
        var __VLS_50;
    }
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE, __VLS_ctx.RoleConst.USER], [__VLS_ctx.PermissionConst.SWITCH_LANGUAGE], [], 'OR'), 'OR')) {
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            ...{ 'onClick': {} },
            ...{ style: {} },
        }));
        const __VLS_56 = __VLS_55({
            ...{ 'onClick': {} },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        let __VLS_59;
        const __VLS_60 = {
            /** @type {typeof __VLS_59.click} */
            onClick: () => { },
        };
        const { default: __VLS_61 } = __VLS_57.slots;
        let __VLS_62;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
            ...{ class: "w-full" },
            trigger: "hover",
            placement: "left-start",
        }));
        const __VLS_64 = __VLS_63({
            ...{ class: "w-full" },
            trigger: "hover",
            placement: "left-start",
        }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        const { default: __VLS_67 } = __VLS_65.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between w-full" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('layout.language'));
        let __VLS_68;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({}));
        const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
        const { default: __VLS_73 } = __VLS_71.slots;
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.ArrowRight} */
        ArrowRight;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({}));
        const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
        // @ts-ignore
        [hasPermission, RoleConst, RoleConst, RoleConst, $t, ComplexPermission, PermissionConst,];
        var __VLS_71;
        {
            const { dropdown: __VLS_79 } = __VLS_65.slots;
            let __VLS_80;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
                ...{ class: "w-180" },
            }));
            const __VLS_82 = __VLS_81({
                ...{ class: "w-180" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            /** @type {__VLS_StyleScopedClasses['w-180']} */ ;
            const { default: __VLS_85 } = __VLS_83.slots;
            for (const [lang, index] of __VLS_vFor((__VLS_ctx.langList))) {
                let __VLS_86;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                    ...{ 'onClick': {} },
                    key: (index),
                    value: (lang.value),
                    ...{ class: "flex-between" },
                }));
                const __VLS_88 = __VLS_87({
                    ...{ 'onClick': {} },
                    key: (index),
                    value: (lang.value),
                    ...{ class: "flex-between" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_87));
                let __VLS_91;
                const __VLS_92 = {
                    /** @type {typeof __VLS_91.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE, __VLS_ctx.RoleConst.USER], [__VLS_ctx.PermissionConst.SWITCH_LANGUAGE], [], 'OR'), 'OR')))
                            throw 0;
                        return __VLS_ctx.changeLang(lang.value);
                        // @ts-ignore
                        [langList, changeLang,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
                const { default: __VLS_93 } = __VLS_89.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: (lang.value === __VLS_ctx.user.userInfo?.language ? 'primary' : '') },
                });
                (lang.label);
                if (lang.value === __VLS_ctx.user.userInfo?.language) {
                    let __VLS_94;
                    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                    elIcon;
                    // @ts-ignore
                    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
                        ...{ class: (lang.value === __VLS_ctx.user.userInfo?.language ? 'primary' : '') },
                    }));
                    const __VLS_96 = __VLS_95({
                        ...{ class: (lang.value === __VLS_ctx.user.userInfo?.language ? 'primary' : '') },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
                    const { default: __VLS_99 } = __VLS_97.slots;
                    let __VLS_100;
                    /** @ts-ignore @type { | typeof __VLS_components.Check} */
                    Check;
                    // @ts-ignore
                    const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({}));
                    const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
                    // @ts-ignore
                    [user, user, user,];
                    var __VLS_97;
                }
                // @ts-ignore
                [];
                var __VLS_89;
                var __VLS_90;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_83;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_65;
        // @ts-ignore
        [];
        var __VLS_57;
        var __VLS_58;
    }
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.USER, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.ABOUT_READ], [], 'OR'), 'OR')) {
        let __VLS_105;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
            ...{ 'onClick': {} },
        }));
        const __VLS_107 = __VLS_106({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        let __VLS_110;
        const __VLS_111 = {
            /** @type {typeof __VLS_110.click} */
            onClick: (__VLS_ctx.openAbout),
        };
        const { default: __VLS_112 } = __VLS_108.slots;
        (__VLS_ctx.$t('layout.about.title'));
        // @ts-ignore
        [hasPermission, RoleConst, RoleConst, RoleConst, $t, ComplexPermission, PermissionConst, openAbout,];
        var __VLS_108;
        var __VLS_109;
    }
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        ...{ 'onClick': {} },
        ...{ class: "border-t" },
    }));
    const __VLS_115 = __VLS_114({
        ...{ 'onClick': {} },
        ...{ class: "border-t" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    let __VLS_118;
    const __VLS_119 = {
        /** @type {typeof __VLS_118.click} */
        onClick: (__VLS_ctx.logout),
    };
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    const { default: __VLS_120 } = __VLS_116.slots;
    (__VLS_ctx.$t('layout.logout'));
    // @ts-ignore
    [$t, logout,];
    var __VLS_116;
    var __VLS_117;
    // @ts-ignore
    [];
    var __VLS_16;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
const __VLS_121 = APIKeyDialog;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    userId: (__VLS_ctx.user.userInfo?.id),
    ref: "APIKeyDialogRef",
}));
const __VLS_123 = __VLS_122({
    userId: (__VLS_ctx.user.userInfo?.id),
    ref: "APIKeyDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
var __VLS_126;
var __VLS_124;
const __VLS_128 = ResetPassword || ResetPassword;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    ref: "resetPasswordRef",
}));
const __VLS_130 = __VLS_129({
    ref: "resetPasswordRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
var __VLS_133;
var __VLS_131;
const __VLS_135 = AboutDialog || AboutDialog;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    ref: "AboutDialogRef",
}));
const __VLS_137 = __VLS_136({
    ref: "AboutDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
var __VLS_140;
var __VLS_138;
// @ts-ignore
var __VLS_127 = __VLS_126, __VLS_134 = __VLS_133, __VLS_141 = __VLS_140;
// @ts-ignore
[user,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
