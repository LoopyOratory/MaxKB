/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useRouter } from 'vue-router';
defineOptions({ name: 'BackButton' });
const router = useRouter();
const props = defineProps({
    to: String
});
const emit = defineEmits(['click']);
/* Parent route */
const back = router.options.history.state.back;
function jump() {
    if (props.to === '-1') {
        if (back) {
            router.push(back);
        }
        else {
            router.go(-1);
        }
    }
    else if (props.to) {
        router.push(props.to);
    }
    else {
        emit('click');
    }
}
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
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    ...{ class: "back-button cursor mr-4" },
    text: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    ...{ class: "back-button cursor mr-4" },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.jump),
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
const { default: __VLS_8 } = __VLS_3.slots;
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    size: (20),
}));
const __VLS_11 = __VLS_10({
    size: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const { default: __VLS_14 } = __VLS_12.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.Back} */
Back;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[jump,];
var __VLS_12;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        to: String
    },
});
export default {};
