/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useRouter } from 'vue-router';
import { useScriptTag } from '@vueuse/core';
import { ref, watch } from 'vue';
import useStore from '@/stores';
import { MsgError } from '@/utils/message';
const props = defineProps();
const router = useRouter();
const { login } = useStore();
const { load } = useScriptTag('https://g.alicdn.com/dingding/h5-dingtalk-login/0.21.0/ddlogin.js');
const isConfigReady = ref(false);
const initActive = async () => {
    try {
        await load(true);
        if (!isConfigReady.value) {
            return;
        }
        const data = {
            appKey: props.config.app_key,
            appSecret: props.config.app_secret,
            corp_id: props.config.corp_id
        };
        const redirectUri = encodeURIComponent(window.location.origin);
        window.DTFrameLogin({
            id: 'ding-talk-qr',
            width: 280,
            height: 280
        }, {
            redirect_uri: redirectUri,
            client_id: data.appKey,
            scope: 'openid corpid',
            response_type: 'code',
            state: 'fit2cloud-ding-qr',
            prompt: 'consent',
            corpId: data.corp_id
        }, (loginResult) => {
            const authCode = loginResult.authCode;
            login.dingCallback(authCode).then(() => {
                router.push({ name: 'home' });
            });
        }, (errorMsg) => {
            MsgError(errorMsg);
        });
    }
    catch (error) {
    }
};
watch(() => props.config, (newConfig) => {
    if (newConfig.app_key && newConfig.corp_id) {
        isConfigReady.value = true;
        initActive();
    }
}, { immediate: true });
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/logo/logo_dingtalk.svg",
    alt: "",
    width: "24px",
    ...{ class: "mr-4" },
});
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.$t('views.system.authentication.scanTheQRCode.dingtalkQrCode'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ding-talk-qrName" },
});
/** @type {__VLS_StyleScopedClasses['ding-talk-qrName']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "ding-talk-qr",
});
// @ts-ignore
[$t,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
