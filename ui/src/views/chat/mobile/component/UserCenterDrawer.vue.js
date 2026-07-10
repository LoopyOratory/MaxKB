/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import useStore from '@/stores';
import { MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import { useRouter } from 'vue-router';
import ResetPasswordDrawer from './ResetPasswordDrawer.vue';
const router = useRouter();
const { chatUser } = useStore();
const show = defineModel('show', {
    required: true,
});
const resetPasswordDrawerShow = ref(false);
function resetPassword() {
    resetPasswordDrawerShow.value = true;
}
function logout() {
    MsgConfirm(t('layout.logout'), t('aiChat.logoutContent'), {
        confirmButtonText: t('layout.logout'),
        confirmButtonClass: 'danger',
    }).then(() => {
        chatUser.logout().then(() => {
            router.push({ name: 'login' });
        });
    });
}
let __VLS_modelEmit;
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.show),
    withHeader: (false),
    ...{ class: "user-center-drawer" },
    size: "100%",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.show),
    withHeader: (false),
    ...{ class: "user-center-drawer" },
    size: "100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['user-center-drawer']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-center navigation mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
/** @type {__VLS_StyleScopedClasses['navigation']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    size: "16",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    size: "16",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.show = false;
        // @ts-ignore
        [show, show,];
    },
};
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.ArrowLeftBold} */
ArrowLeftBold;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "medium" },
});
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
(__VLS_ctx.$t('aiChat.mine'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-item info p-16" },
});
/** @type {__VLS_StyleScopedClasses['card-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    size: (64),
}));
const __VLS_22 = __VLS_21({
    size: (64),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/user-icon.svg",
    ...{ style: {} },
    alt: "",
});
// @ts-ignore
[$t,];
var __VLS_23;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mt-12 mb-4" },
});
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
(__VLS_ctx.chatUser.chatUserProfile?.nick_name);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "color-secondary lighter" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(`${__VLS_ctx.$t('common.username')}: ${__VLS_ctx.chatUser.chatUserProfile?.username}`);
if (__VLS_ctx.chatUser.chatUserProfile?.source === 'LOCAL') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.resetPassword) },
        ...{ class: "card-item reset-password flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['card-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['reset-password']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        iconName: "app-key",
        ...{ class: "mr-12" },
    }));
    const __VLS_28 = __VLS_27({
        iconName: "app-key",
        ...{ class: "mr-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('views.login.resetPassword'));
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        size: "16",
    }));
    const __VLS_33 = __VLS_32({
        size: "16",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const { default: __VLS_36 } = __VLS_34.slots;
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.ArrowRight} */
    ArrowRight;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({}));
    const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
    // @ts-ignore
    [$t, $t, chatUser, chatUser, chatUser, resetPassword,];
    var __VLS_34;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.logout) },
    ...{ class: "card-item logout" },
});
/** @type {__VLS_StyleScopedClasses['card-item']} */ ;
/** @type {__VLS_StyleScopedClasses['logout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('layout.logout'));
const __VLS_42 = ResetPasswordDrawer;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    show: (__VLS_ctx.resetPasswordDrawerShow),
}));
const __VLS_44 = __VLS_43({
    show: (__VLS_ctx.resetPasswordDrawerShow),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
// @ts-ignore
[$t, logout, resetPasswordDrawerShow,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
