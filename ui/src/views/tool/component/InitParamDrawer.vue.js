/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import DynamicsForm from '@/components/dynamics-form/index.vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { cloneDeep } from 'lodash';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const emit = defineEmits(['refresh']);
const route = useRoute();
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const dynamicsFormRef = ref();
const loading = ref(false);
const debugVisible = ref(false);
const form = ref({
    init_params: {},
});
watch(debugVisible, (bool) => {
    if (!bool) {
        form.value = {
            init_params: {},
            is_active: false,
        };
    }
});
const submit = async () => {
    dynamicsFormRef.value.validate().then(() => {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .putTool(form.value?.id, form.value, loading)
            .then((res) => {
            MsgSuccess(t('common.editSuccess'));
            emit('refresh');
            debugVisible.value = false;
        });
    });
};
const open = (data, is_active) => {
    if (data) {
        form.value = cloneDeep(data);
        form.value.is_active = is_active;
    }
    const init_params = form.value.init_field_list
        .map((item) => {
        if (item.show_default_value === false) {
            return { [item.field]: undefined };
        }
        return { [item.field]: item.default_value };
    })
        .reduce((x, y) => ({ ...x, ...y }), {});
    form.value.init_params = { ...init_params, ...form.value.init_params };
    debugVisible.value = true;
};
const __VLS_exposed = {
    open,
};
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.debugVisible),
    size: "60%",
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('common.param.initParam'));
    // @ts-ignore
    [debugVisible, $t,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.form.init_field_list?.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_8 = DynamicsForm || DynamicsForm;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        modelValue: (__VLS_ctx.form.init_params),
        model: (__VLS_ctx.form.init_params),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        render_data: (__VLS_ctx.form.init_field_list),
        ref: "dynamicsFormRef",
    }));
    const __VLS_10 = __VLS_9({
        modelValue: (__VLS_ctx.form.init_params),
        model: (__VLS_ctx.form.init_params),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        render_data: (__VLS_ctx.form.init_field_list),
        ref: "dynamicsFormRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_13;
    var __VLS_11;
}
{
    const { footer: __VLS_15 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_21;
    const __VLS_22 = {
        /** @type {typeof __VLS_21.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit();
            // @ts-ignore
            [form, form, form, form, loading, submit,];
        },
    };
    const { default: __VLS_23 } = __VLS_19.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_19;
    var __VLS_20;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
