/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { MsgSuccess } from '@/utils/message';
import bus from '@/bus';
import { ref, nextTick, onMounted } from 'vue';
import { t } from '@/locales';
const isOpen = ref(false);
const eventVal = ref({});
function getSelection() {
    const selection = window.getSelection();
    if (selection) {
        if (selection.rangeCount === 0)
            return undefined;
        const range = selection.getRangeAt(0);
        const fragment = range.cloneContents(); // Clone selectionContent
        const div = document.createElement('div');
        div.appendChild(fragment);
        if (div.textContent) {
            return div.textContent.trim();
        }
    }
    return undefined;
}
/**
 * OpenConsole
 * @param event
 */
const openControl = (event) => {
    const c = getSelection();
    if (c) {
        if (!isOpen.value) {
            nextTick(() => {
                eventVal.value = event;
                isOpen.value = true;
            });
        }
        else {
            clearSelectedText();
            isOpen.value = false;
        }
        event.preventDefault();
    }
    else {
        isOpen.value = false;
    }
};
const menus = ref([
    {
        label: t('common.copy'),
        icon: 'app-copy',
        click: () => {
            const selectionText = getSelection();
            if (selectionText) {
                clearSelectedText();
                if (typeof navigator.clipboard === 'undefined' ||
                    typeof navigator.clipboard.writeText === 'undefined') {
                    const input = document.createElement('input');
                    input.setAttribute('value', selectionText);
                    document.body.appendChild(input);
                    input.select();
                    try {
                        if (document.execCommand('copy')) {
                            MsgSuccess(t('common.copySuccess'));
                        }
                    }
                    finally {
                        document.body.removeChild(input);
                    }
                }
                else {
                    navigator.clipboard.writeText(selectionText).then(() => {
                        MsgSuccess(t('common.copySuccess'));
                    });
                }
            }
        },
    },
    {
        label: t('aiChat.quote'),
        icon: 'app-quote',
        click: () => {
            bus.emit('chat-input', getSelection());
            clearSelectedText();
        },
    },
]);
/**
 * ClearSelectText
 */
const clearSelectedText = () => {
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    }
};
onMounted(() => {
    bus.on('open-control', openControl);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.vue3Menus | typeof __VLS_components.Vue3Menus | typeof __VLS_components['vue3-menus'] | typeof __VLS_components.vue3Menus | typeof __VLS_components.Vue3Menus | typeof __VLS_components['vue3-menus']} */
vue3Menus;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    open: (__VLS_ctx.isOpen),
    event: (__VLS_ctx.eventVal),
    zIndex: (9999),
    menus: (__VLS_ctx.menus),
    hasIcon: true,
}));
const __VLS_2 = __VLS_1({
    open: (__VLS_ctx.isOpen),
    event: (__VLS_ctx.eventVal),
    zIndex: (9999),
    menus: (__VLS_ctx.menus),
    hasIcon: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { icon: __VLS_6 } = __VLS_3.slots;
    const [{ menu }] = __VLS_vSlot(__VLS_6);
    if (menu.icon) {
        let __VLS_7;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
            iconName: (menu.icon),
        }));
        const __VLS_9 = __VLS_8({
            iconName: (menu.icon),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    }
    // @ts-ignore
    [isOpen, eventVal, menus,];
}
{
    const { label: __VLS_12 } = __VLS_3.slots;
    const [{ menu }] = __VLS_vSlot(__VLS_12);
    (menu.label);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
