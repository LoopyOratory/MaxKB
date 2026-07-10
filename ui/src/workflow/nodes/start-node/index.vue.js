/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { copyClick } from '@/utils/clipboard';
import { ref, onMounted, watch } from 'vue';
import { t } from '@/locales';
import { useI18n } from 'vue-i18n';
const props = defineProps();
const { locale } = useI18n({ useScope: 'global' });
const showicon = ref(false);
const getGlobalFields = () => [
    { label: t('workflow.nodes.startNode.currentTime'), value: 'time' },
    { label: t('views.application.form.historyRecord.label'), value: 'history_context' },
    { label: t('aiChat.chatId'), value: 'chat_id' },
    { label: t('aiChat.chatUserId'), value: 'chat_user_id' },
    { label: t('aiChat.chatUserType'), value: 'chat_user_type' },
    { label: t('aiChat.chatUserGroup'), value: 'chat_user_group' },
    { label: t('views.chatUser.title'), value: 'chat_user' },
];
const refreshStartQuestionField = () => {
    const questionFields = [{ label: t('workflow.nodes.startNode.question'), value: 'question' }];
    set(props.nodeModel.properties.config, 'fields', questionFields);
    set(props.nodeModel.properties, 'fields', questionFields);
};
const getRefreshFieldList = () => {
    const user_input_fields = props.nodeModel.graphModel.nodes
        .filter((v) => v.id === 'base-node')
        .map((v) => cloneDeep(v.properties.user_input_field_list))
        .reduce((x, y) => [...x, ...y], [])
        .map((i) => {
        if (i.label && i.label.input_type === 'TooltipLabel') {
            return { label: i.label.label, value: i.field || i.variable };
        }
        return { label: i.label || i.name, value: i.field || i.variable };
    });
    const api_input_fields = props.nodeModel.graphModel.nodes
        .filter((v) => v.id === 'base-node')
        .map((v) => cloneDeep(v.properties.api_input_field_list))
        .reduce((x, y) => [...x, ...y], [])
        .map((i) => ({ label: i.name || i.variable, value: i.variable }));
    return [...user_input_fields, ...api_input_fields];
};
const refreshFieldList = () => {
    const refreshFieldList = getRefreshFieldList();
    set(props.nodeModel.properties.config, 'globalFields', [...getGlobalFields(), ...refreshFieldList]);
};
const refreshChatFieldList = () => {
    const chatFieldList = props.nodeModel.graphModel.nodes
        .filter((v) => v.id === 'base-node')
        .map((v) => cloneDeep(v.properties.chat_input_field_list || []))
        .reduce((x, y) => [...x, ...y], [])
        .map((i) => ({ label: i.label, value: i.field }));
    set(props.nodeModel.properties.config, 'chatFields', chatFieldList);
};
props.nodeModel.graphModel.eventCenter.on('refreshFieldList', refreshFieldList);
props.nodeModel.graphModel.eventCenter.on('chatFieldList', refreshChatFieldList);
const refreshFileUploadConfig = () => {
    let fields = cloneDeep(props.nodeModel.properties.config.fields);
    const form_data = props.nodeModel.graphModel.nodes
        .filter((v) => v.id === 'base-node')
        .filter((v) => v.properties.node_data.file_upload_enable)
        .map((v) => cloneDeep(v.properties.node_data.file_upload_setting))
        .filter((v) => v);
    fields = fields.filter((item) => item.value !== 'image' &&
        item.value !== 'document' &&
        item.value !== 'audio' &&
        item.value !== 'video' &&
        item.value !== 'other');
    if (form_data.length === 0) {
        set(props.nodeModel.properties.config, 'fields', fields);
        return;
    }
    const fileUploadFields = [];
    if (form_data[0].document) {
        fileUploadFields.push({ label: t('common.fileUpload.document'), value: 'document' });
    }
    if (form_data[0].image) {
        fileUploadFields.push({ label: t('common.fileUpload.image'), value: 'image' });
    }
    if (form_data[0].audio) {
        fileUploadFields.push({ label: t('common.fileUpload.audio'), value: 'audio' });
    }
    if (form_data[0].video) {
        fileUploadFields.push({ label: t('common.fileUpload.video'), value: 'video' });
    }
    if (form_data[0].other) {
        fileUploadFields.push({ label: t('common.fileUpload.other'), value: 'other' });
    }
    set(props.nodeModel.properties.config, 'fields', [...fields, ...fileUploadFields]);
};
props.nodeModel.graphModel.eventCenter.on('refreshFileUploadConfig', refreshFileUploadConfig);
const refreshLongTermConfig = () => {
    let fields = cloneDeep(props.nodeModel.properties.config.fields);
    const form_data = props.nodeModel.graphModel.nodes
        .filter((v) => v.id === 'base-node')
        .filter((v) => v.properties.node_data.long_term_enable)
        .filter((v) => v);
    fields = fields.filter((item) => {
        return item.value !== 'memory';
    });
    if (form_data.length === 0) {
        set(props.nodeModel.properties.config, 'fields', fields);
        return;
    }
    if (form_data[0]) {
        set(props.nodeModel.properties.config, 'fields', [...fields, { label: t('views.application.longTermMemory.title'), value: 'memory' }]);
    }
};
props.nodeModel.graphModel.eventCenter.on('refreshLongTermConfig', refreshLongTermConfig);
onMounted(() => {
    refreshStartQuestionField();
    refreshChatFieldList();
    refreshFieldList();
    refreshFileUploadConfig();
    refreshLongTermConfig();
});
watch(locale, () => {
    refreshStartQuestionField();
    refreshChatFieldList();
    refreshFieldList();
    refreshFileUploadConfig();
    refreshLongTermConfig();
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = NodeContainer || NodeContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_2 = __VLS_1({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('workflow.variable.global'));
for (const [item, index] of __VLS_vFor((__VLS_ctx.nodeModel.properties.config.globalFields))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseenter: (...[$event]) => {
                return __VLS_ctx.showicon = true;
                // @ts-ignore
                [nodeModel, nodeModel, $t, showicon,];
            } },
        ...{ onMouseleave: (...[$event]) => {
                return __VLS_ctx.showicon = false;
                // @ts-ignore
                [showicon,];
            } },
        key: (index),
        ...{ class: "flex-between border-r-6 p-8-12 mb-8 layout-bg lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "break-all" },
    });
    /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
    (item.label);
    ('{' + item.value + '}');
    if (__VLS_ctx.showicon === true) {
        let __VLS_7;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
            effect: "dark",
            content: (__VLS_ctx.$t('workflow.setting.copyParam')),
            placement: "top",
        }));
        const __VLS_9 = __VLS_8({
            effect: "dark",
            content: (__VLS_ctx.$t('workflow.setting.copyParam')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        const { default: __VLS_12 } = __VLS_10.slots;
        let __VLS_13;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
            ...{ 'onClick': {} },
            link: true,
            ...{ style: {} },
        }));
        const __VLS_15 = __VLS_14({
            ...{ 'onClick': {} },
            link: true,
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        let __VLS_18;
        const __VLS_19 = {
            /** @type {typeof __VLS_18.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showicon === true))
                    throw 0;
                return __VLS_ctx.copyClick(`{{global.${item.value}}}`);
                // @ts-ignore
                [$t, showicon, copyClick,];
            },
        };
        const { default: __VLS_20 } = __VLS_16.slots;
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            iconName: "app-copy",
        }));
        const __VLS_23 = __VLS_22({
            iconName: "app-copy",
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        // @ts-ignore
        [];
        var __VLS_16;
        var __VLS_17;
        // @ts-ignore
        [];
        var __VLS_10;
    }
    // @ts-ignore
    [];
}
if (__VLS_ctx.nodeModel.properties.config.chatFields?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "title-decoration-1 mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('workflow.variable.chat'));
    for (const [item, index] of __VLS_vFor((__VLS_ctx.nodeModel.properties.config.chatFields || []))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.nodeModel.properties.config.chatFields?.length))
                        throw 0;
                    return __VLS_ctx.showicon = true;
                    // @ts-ignore
                    [nodeModel, nodeModel, $t, showicon,];
                } },
            ...{ onMouseleave: (...[$event]) => {
                    if (!(__VLS_ctx.nodeModel.properties.config.chatFields?.length))
                        throw 0;
                    return __VLS_ctx.showicon = false;
                    // @ts-ignore
                    [showicon,];
                } },
            key: (index),
            ...{ class: "flex-between border-r-6 p-8-12 mb-8 layout-bg lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "break-all" },
        });
        /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
        (item.label);
        ('{' + item.value + '}');
        if (__VLS_ctx.showicon === true) {
            let __VLS_26;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }));
            const __VLS_28 = __VLS_27({
                effect: "dark",
                content: (__VLS_ctx.$t('workflow.setting.copyParam')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_27));
            const { default: __VLS_31 } = __VLS_29.slots;
            let __VLS_32;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }));
            const __VLS_34 = __VLS_33({
                ...{ 'onClick': {} },
                link: true,
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            let __VLS_37;
            const __VLS_38 = {
                /** @type {typeof __VLS_37.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.nodeModel.properties.config.chatFields?.length))
                        throw 0;
                    if (!(__VLS_ctx.showicon === true))
                        throw 0;
                    return __VLS_ctx.copyClick(`{{chat.${item.value}}}`);
                    // @ts-ignore
                    [$t, showicon, copyClick,];
                },
            };
            const { default: __VLS_39 } = __VLS_35.slots;
            let __VLS_40;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
                iconName: "app-copy",
            }));
            const __VLS_42 = __VLS_41({
                iconName: "app-copy",
            }, ...__VLS_functionalComponentArgsRest(__VLS_41));
            // @ts-ignore
            [];
            var __VLS_35;
            var __VLS_36;
            // @ts-ignore
            [];
            var __VLS_29;
        }
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
