/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onBeforeUpdate } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const cachedViews = ref([]);
onBeforeUpdate(() => {
    const { name, meta } = route;
    if (name && !cachedViews.value.includes(name)) {
        cachedViews.value.push(name);
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
/** @ts-ignore @type { | typeof __VLS_components.routerView | typeof __VLS_components.RouterView | typeof __VLS_components['router-view'] | typeof __VLS_components.routerView | typeof __VLS_components.RouterView | typeof __VLS_components['router-view']} */
routerView;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
{
    const { default: __VLS_6 } = __VLS_3.slots;
    const [{ Component }] = __VLS_vSlot(__VLS_6);
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
    transition;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        appear: true,
        name: "fade-transform",
        mode: "out-in",
    }));
    const __VLS_9 = __VLS_8({
        appear: true,
        name: "fade-transform",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.keepAlive | typeof __VLS_components.KeepAlive | typeof __VLS_components['keep-alive'] | typeof __VLS_components.keepAlive | typeof __VLS_components.KeepAlive | typeof __VLS_components['keep-alive']} */
    keepAlive;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        include: (__VLS_ctx.cachedViews),
    }));
    const __VLS_15 = __VLS_14({
        include: (__VLS_ctx.cachedViews),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    const __VLS_19 = (Component);
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        key: (__VLS_ctx.route.path),
    }));
    const __VLS_21 = __VLS_20({
        key: (__VLS_ctx.route.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    // @ts-ignore
    [cachedViews, route,];
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
    __VLS_3.slots['' /* empty slot name completion */];
}
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
