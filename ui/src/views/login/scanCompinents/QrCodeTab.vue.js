/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, defineAsyncComponent } from 'vue';
import useStore from '@/stores';
const { login } = useStore();
const props = defineProps();
const activeKey = ref('');
const allConfigs = ref([]);
const config = ref({ app_key: '', app_secret: '' });
async function getPlatformInfo() {
    try {
        return await login.getQrSource();
    }
    catch (error) {
        return [];
    }
}
onMounted(async () => {
    if (props.tabs.length > 0) {
        activeKey.value = props.tabs[0].key;
    }
    allConfigs.value = await getPlatformInfo();
    updateConfig(activeKey.value);
    console.log(props.defaultTab);
    if (props.defaultTab) {
        selectTab(props.defaultTab);
    }
});
const updateConfig = (key) => {
    const selectedConfig = allConfigs.value.find((item) => item.auth_type === key);
    if (selectedConfig && selectedConfig.config) {
        config.value = selectedConfig.config;
    }
};
const selectTab = (key) => {
    activeKey.value = key;
    updateConfig(key);
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
elTabs;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeKey),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeKey),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.tabChange} */
    onTabChange: (__VLS_ctx.selectTab),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.tabs))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (item.key),
    });
    let __VLS_9;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        label: (item.value),
        name: (item.key),
    }));
    const __VLS_11 = __VLS_10({
        label: (item.value),
        name: (item.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    const { default: __VLS_14 } = __VLS_12.slots;
    if (item.key === __VLS_ctx.activeKey) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-center mt-16" },
        });
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
        const __VLS_15 = (__VLS_ctx.defineAsyncComponent(() => import(`./${item.key}QrCode.vue`)));
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
            config: (__VLS_ctx.config),
        }));
        const __VLS_17 = __VLS_16({
            config: (__VLS_ctx.config),
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    }
    // @ts-ignore
    [activeKey, activeKey, selectTab, tabs, defineAsyncComponent, config,];
    var __VLS_12;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
