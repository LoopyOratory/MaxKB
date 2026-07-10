/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useScriptTag } from '@vueuse/core';
import { onMounted } from 'vue';
const { load } = useScriptTag('https://lf-package-cn.feishucdn.com/obj/feishu-static/lark/passport/qrcode/LarkSSOSDKWebQRCode-1.0.3.js');
const props = defineProps();
const initActive = async () => {
    const scriptLoaded = await load(true);
    if (!scriptLoaded) {
        console.error('FeishuQR code SDK LoadFailure');
        return;
    }
    const data = {
        agentId: props.config.app_key,
        appSecret: props.config.app_secret
    };
    const redirectUrl = encodeURIComponent(`${window.location.origin}${window.MaxKB.prefix}/api/lark`);
    const url = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${data.agentId}&redirect_uri=${redirectUrl}&response_type=code&state=fit2cloud-lark-qr`;
    const QRLoginObj = window.QRLogin({
        id: 'lark-qr',
        goto: url,
        width: '266',
        height: '266',
        style: 'width:280px;height:280px;border:1px solid #e8e8e8;margin:0 auto;border-radius:8px;'
    });
    window.addEventListener('message', async (event) => {
        if (QRLoginObj.matchOrigin(event.origin) && QRLoginObj.matchData(event.data)) {
            const loginTmpCode = event.data.tmp_code;
            window.location.href = `${url}&tmp_code=${loginTmpCode}`;
        }
    });
};
onMounted(() => {
    initActive();
});
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
    src: "@/assets/logo/logo_lark.svg ",
    alt: "",
    width: "24px",
    ...{ class: "mr-4" },
});
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.$t('views.system.authentication.scanTheQRCode.larkQrCode'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "lark-qr",
    ...{ class: "lark-qrName" },
});
/** @type {__VLS_StyleScopedClasses['lark-qrName']} */ ;
// @ts-ignore
[$t,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
