/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
const auth_components = import.meta.glob('@/views/chat/auth/component/*.vue', {
    eager: true,
});
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps(), {
    auth_type: 'password',
    style: {},
});
const is_auth = computed({
    get: () => {
        return props.modelValue;
    },
    set: (v) => {
        emit('update:modelValue', v);
    },
});
const __VLS_defaults = {
    auth_type: 'password',
    style: {},
};
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
const __VLS_0 = (__VLS_ctx.auth_components[`/src/views/chat/auth/component/${__VLS_ctx.auth_type}.vue`].default);
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.is_auth),
    applicationProfile: (__VLS_ctx.application_profile),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.is_auth),
    applicationProfile: (__VLS_ctx.application_profile),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
var __VLS_3;
// @ts-ignore
[auth_components, auth_type, is_auth, application_profile,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
