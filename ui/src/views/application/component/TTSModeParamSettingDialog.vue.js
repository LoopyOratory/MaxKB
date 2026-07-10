/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { useRoute } from 'vue-router';
import { MsgError } from '@/utils/message';
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
const tts_model_id = ref('');
const model_form_field = ref([]);
const emit = defineEmits(['refresh']);
const dynamicsFormRef = ref();
const form_data = ref({});
const dialogVisible = ref(false);
const loading = ref(false);
const playLoading = ref(false);
const open = (model_id, application_id, model_setting_data) => {
    form_data.value = {};
    tts_model_id.value = model_id;
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getModelParamsForm(model_id, loading)
        .then((ok) => {
        model_form_field.value = ok.data;
        const resp = ok.data
            .map((item) => ({
            [item.field]: item.show_default_value !== false ? item.default_value : undefined,
        }))
            .reduce((x, y) => ({ ...x, ...y }), {});
        // DeletionNotExistingField
        if (model_setting_data) {
            Object.keys(model_setting_data).forEach((key) => {
                if (!(key in resp)) {
                    delete model_setting_data[key];
                }
            });
        }
        model_setting_data = { ...resp, ...model_setting_data };
        // RenderDynamicForm
        dynamicsFormRef.value?.render(model_form_field.value, model_setting_data);
    });
    dialogVisible.value = true;
};
const reset_default = (model_id, application_id) => {
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getModelParamsForm(model_id, loading)
        .then((ok) => {
        model_form_field.value = ok.data;
        const model_setting_data = ok.data
            .map((item) => ({
            [item.field]: item.show_default_value !== false ? item.default_value : undefined,
        }))
            .reduce((x, y) => ({ ...x, ...y }), {});
        emit('refresh', model_setting_data);
    });
};
const submit = async () => {
    dynamicsFormRef.value?.validate().then(() => {
        emit('refresh', form_data.value);
        dialogVisible.value = false;
    });
};
const audioPlayer = ref(null);
const testPlay = () => {
    const data = {
        ...form_data.value,
        tts_model_id: tts_model_id.value,
    };
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .playDemoText(id, data, playLoading)
        .then(async (res) => {
        if (res.type === 'application/json') {
            const text = await res.text();
            MsgError(text);
            return;
        }
        // Creation Blob Object
        const blob = new Blob([res], { type: 'audio/mp3' });
        // CreationObject URL
        const url = URL.createObjectURL(blob);
        // Check audioPlayer WhetherAlreadyReference DOM Element
        if (audioPlayer.value instanceof HTMLAudioElement) {
            audioPlayer.value.src = url;
            audioPlayer.value.play(); // AutomaticPlayAudio
        }
        else {
            console.error('audioPlayer.value is not an instance of HTMLAudioElement');
        }
    })
        .catch((err) => {
        console.log('err: ', err);
    });
};
const __VLS_exposed = { open, reset_default };
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
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    title: (__VLS_ctx.$t('common.paramSetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    render_data: (__VLS_ctx.model_form_field),
    ref: "dynamicsFormRef",
}));
const __VLS_8 = __VLS_7({
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    render_data: (__VLS_ctx.model_form_field),
    ref: "dynamicsFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
var __VLS_11;
var __VLS_9;
{
    const { footer: __VLS_13 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.playLoading),
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        loading: (__VLS_ctx.playLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_19;
    const __VLS_20 = {
        /** @type {typeof __VLS_19.click} */
        onClick: (__VLS_ctx.testPlay),
    };
    const { default: __VLS_21 } = __VLS_17.slots;
    let __VLS_22;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        iconName: "app-video-play",
        ...{ class: "mr-4" },
    }));
    const __VLS_24 = __VLS_23({
        iconName: "app-video-play",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.voicePlay.listeningTest'));
    // @ts-ignore
    [$t, $t, dialogVisible, form_data, form_data, model_form_field, playLoading, testPlay,];
    var __VLS_17;
    var __VLS_18;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        ...{ 'onClick': {} },
    }));
    const __VLS_29 = __VLS_28({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    let __VLS_32;
    const __VLS_33 = {
        /** @type {typeof __VLS_32.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_34 } = __VLS_30.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_30;
    var __VLS_31;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_37 = __VLS_36({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    let __VLS_40;
    const __VLS_41 = {
        /** @type {typeof __VLS_40.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_42 } = __VLS_38.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_38;
    var __VLS_39;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.audio, __VLS_intrinsics.audio)({
    ref: "audioPlayer",
    controls: true,
    hidden: "hidden",
});
// @ts-ignore
var __VLS_12 = __VLS_11;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
