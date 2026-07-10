/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { cloneDeep } from 'lodash';
import DynamicsFormConstructor from '@/components/dynamics-form/constructor/index.vue';
const drawer = ref(false);
const direction = ref('rtl');
const isEdit = ref(false);
const DynamicsFormConstructorRef = ref();
const currentItem = ref(null);
const currentIndex = ref(null);
const emit = defineEmits(['refresh']);
const open = (row, index) => {
    if (row) {
        currentItem.value = cloneDeep(row);
        currentIndex.value = index;
        isEdit.value = true;
    }
    drawer.value = true;
};
function cancelClick() {
    drawer.value = false;
    isEdit.value = false;
    currentItem.value = null;
    currentIndex.value = null;
}
function confirmClick() {
    const formEl = DynamicsFormConstructorRef.value;
    formEl?.validate().then((valid) => {
        if (valid) {
            emit('refresh', formEl?.getData(), currentIndex.value);
            drawer.value = false;
            isEdit.value = false;
            currentItem.value = null;
            currentIndex.value = null;
        }
    });
}
const __VLS_exposed = { open };
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
    modelValue: (__VLS_ctx.drawer),
    direction: (__VLS_ctx.direction),
    size: "600",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    beforeClose: (__VLS_ctx.cancelClick),
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawer),
    direction: (__VLS_ctx.direction),
    size: "600",
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    beforeClose: (__VLS_ctx.cancelClick),
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.param.editParam') : __VLS_ctx.$t('common.param.addParam'));
    // @ts-ignore
    [drawer, direction, cancelClick, isEdit, $t, $t,];
}
{
    const { default: __VLS_8 } = __VLS_3.slots;
    const __VLS_9 = DynamicsFormConstructor || DynamicsFormConstructor;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        modelValue: (__VLS_ctx.currentItem),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        ref: "DynamicsFormConstructorRef",
    }));
    const __VLS_11 = __VLS_10({
        modelValue: (__VLS_ctx.currentItem),
        labelPosition: "top",
        requireAsteriskPosition: "right",
        ref: "DynamicsFormConstructorRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    var __VLS_14;
    var __VLS_12;
    // @ts-ignore
    [currentItem,];
}
{
    const { footer: __VLS_16 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        /** @type {typeof __VLS_22.click} */
        onClick: (__VLS_ctx.cancelClick),
    };
    const { default: __VLS_24 } = __VLS_20.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [cancelClick, $t,];
    var __VLS_20;
    var __VLS_21;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_30;
    const __VLS_31 = {
        /** @type {typeof __VLS_30.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.confirmClick();
            // @ts-ignore
            [confirmClick,];
        },
    };
    const { default: __VLS_32 } = __VLS_28.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [isEdit, $t, $t,];
    var __VLS_28;
    var __VLS_29;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
