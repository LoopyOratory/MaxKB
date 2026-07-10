/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import GenerateRelatedDialog from '@/components/generate-related-dialog/index.vue';
import ParagraphDialog from '@/views/paragraph/component/ParagraphDialog.vue';
import SelectDocumentDialog from '@/views/paragraph/component/SelectDocumentDialog.vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
import { t } from '@/locales';
const props = defineProps();
const route = useRoute();
const { params: { id, documentId }, query: { from, isShared }, } = route;
const shareDisabled = computed(() => {
    return isShared === 'true';
});
const apiType = computed(() => {
    return from;
});
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][apiType.value];
});
const MoreFieldPermission = (id) => {
    return permissionPrecise.value.doc_generate(id) || permissionPrecise.value.doc_edit(id);
};
const emit = defineEmits([
    'dialogVisibleChange',
    'clickCard',
    'changeState',
    'deleteParagraph',
    'refresh',
    'refreshMigrateParagraph',
    'move',
]);
const loading = ref(false);
const changeStateloading = ref(false);
const show = ref(false);
// cardAboveExistsdropdownMenu
const subHovered = ref(false);
function cardEnter() {
    show.value = true;
    subHovered.value = false;
}
function cardLeave() {
    show.value = subHovered.value;
}
async function changeState(row) {
    const obj = {
        is_active: !row.is_active,
    };
    await loadSharedApi({ type: 'paragraph', systemType: apiType.value })
        .putParagraph(id, documentId, row.id, obj, changeStateloading)
        .then(() => {
        emit('changeState', row.id);
        return true;
    })
        .catch(() => {
        return false;
    });
}
const GenerateRelatedDialogRef = ref();
function openGenerateDialog(row) {
    if (GenerateRelatedDialogRef.value) {
        GenerateRelatedDialogRef.value.open([row.id], 'paragraph', row.id);
    }
}
function deleteParagraph(row) {
    MsgConfirm(`${t('views.paragraph.delete.confirmTitle')} ${row.title || '-'} ?`, t('views.paragraph.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'paragraph', systemType: apiType.value })
            .delParagraph(id, documentId, row.id, loading)
            .then(() => {
            emit('deleteParagraph', row.id);
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => { });
}
const ParagraphDialogRef = ref();
const title = ref('');
function editParagraph(row) {
    if (!props.disabled) {
        title.value = t('views.paragraph.editParagraph');
        ParagraphDialogRef.value.open(row, 'edit');
    }
}
const cardClick = permissionPrecise.value.doc_edit(id);
function handleClickCard(row) {
    if (!cardClick || dialogVisible.value) {
        return;
    }
    if (!props.disabled) {
        title.value = t('views.paragraph.paragraphDetail');
        ParagraphDialogRef.value.open(row);
    }
    else {
        emit('clickCard');
    }
}
function addParagraph(row) {
    title.value = t('views.paragraph.addParagraph');
    ParagraphDialogRef.value.open(row, 'add');
}
const SelectDocumentDialogRef = ref();
function openSelectDocumentDialog(row) {
    SelectDocumentDialogRef.value.open([row.id]);
}
function refresh(data) {
    emit('refresh', data);
}
function refreshMigrateParagraph() {
    emit('refreshMigrateParagraph', props.data);
}
const dialogVisible = computed(() => ParagraphDialogRef.value?.dialogVisible ||
    SelectDocumentDialogRef.value?.dialogVisible ||
    GenerateRelatedDialogRef.value?.dialogVisible);
watch(dialogVisible, (val) => {
    emit('dialogVisibleChange', val);
});
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
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "paragraph-box cursor" },
    ...{ class: (__VLS_ctx.data.is_active ? '' : 'disabled') },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "paragraph-box cursor" },
    ...{ class: (__VLS_ctx.data.is_active ? '' : 'disabled') },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.mouseenter} */
    onMouseenter: (...[$event]) => {
        return __VLS_ctx.cardEnter();
        // @ts-ignore
        [data, cardEnter,];
    },
};
const __VLS_7 = {
    /** @type {typeof __VLS_5.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.cardLeave();
        // @ts-ignore
        [cardLeave,];
    },
};
const __VLS_8 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.handleClickCard(__VLS_ctx.data);
        // @ts-ignore
        [data, handleClickCard,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_9;
/** @type {__VLS_StyleScopedClasses['paragraph-box']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_10 } = __VLS_3.slots;
if (!__VLS_ctx.disabled) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mk-sticky" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.show) }, null, null);
    /** @type {__VLS_StyleScopedClasses['mk-sticky']} */ ;
    if (__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)) {
        let __VLS_11;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
            ...{ 'onClick': {} },
            ...{ class: "paragraph-box-operation mt-8 mr-8" },
            shadow: "always",
            ...{ style: {} },
        }));
        const __VLS_13 = __VLS_12({
            ...{ 'onClick': {} },
            ...{ class: "paragraph-box-operation mt-8 mr-8" },
            shadow: "always",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        let __VLS_16;
        const __VLS_17 = {
            /** @type {typeof __VLS_16.click} */
            onClick: () => { },
        };
        /** @type {__VLS_StyleScopedClasses['paragraph-box-operation']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_18 } = __VLS_14.slots;
        if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
            let __VLS_19;
            /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
            elSwitch;
            // @ts-ignore
            const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
                loading: (__VLS_ctx.changeStateloading),
                modelValue: (__VLS_ctx.data.is_active),
                beforeChange: (() => __VLS_ctx.changeState(__VLS_ctx.data)),
                size: "small",
            }));
            const __VLS_21 = __VLS_20({
                loading: (__VLS_ctx.changeStateloading),
                modelValue: (__VLS_ctx.data.is_active),
                beforeChange: (() => __VLS_ctx.changeState(__VLS_ctx.data)),
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        }
        let __VLS_24;
        /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
        elDivider;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            direction: "vertical",
        }));
        const __VLS_26 = __VLS_25({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
            let __VLS_29;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
                effect: "dark",
                content: (__VLS_ctx.$t('views.paragraph.editParagraph')),
                placement: "top",
            }));
            const __VLS_31 = __VLS_30({
                effect: "dark",
                content: (__VLS_ctx.$t('views.paragraph.editParagraph')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_30));
            const { default: __VLS_34 } = __VLS_32.slots;
            let __VLS_35;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_37 = __VLS_36({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_36));
            let __VLS_40;
            const __VLS_41 = {
                /** @type {typeof __VLS_40.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.disabled))
                        throw 0;
                    if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                        throw 0;
                    if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                        throw 0;
                    return __VLS_ctx.editParagraph(__VLS_ctx.data);
                    // @ts-ignore
                    [data, data, data, vLoading, loading, disabled, show, MoreFieldPermission, id, id, id, permissionPrecise, permissionPrecise, changeStateloading, changeState, $t, editParagraph,];
                },
            };
            const { default: __VLS_42 } = __VLS_38.slots;
            let __VLS_43;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
                iconName: "app-edit",
                size: (16),
                ...{ class: "color-secondary" },
            }));
            const __VLS_45 = __VLS_44({
                iconName: "app-edit",
                size: (16),
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_44));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [];
            var __VLS_38;
            var __VLS_39;
            // @ts-ignore
            [];
            var __VLS_32;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
            let __VLS_48;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
                effect: "dark",
                content: (__VLS_ctx.$t('views.paragraph.prevAddParagraph')),
                placement: "top",
            }));
            const __VLS_50 = __VLS_49({
                effect: "dark",
                content: (__VLS_ctx.$t('views.paragraph.prevAddParagraph')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            const { default: __VLS_53 } = __VLS_51.slots;
            if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
                let __VLS_54;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_56 = __VLS_55({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_55));
                let __VLS_59;
                const __VLS_60 = {
                    /** @type {typeof __VLS_59.click} */
                    onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.disabled))
                            throw 0;
                        if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                            throw 0;
                        return __VLS_ctx.addParagraph(__VLS_ctx.data);
                        // @ts-ignore
                        [data, id, id, permissionPrecise, permissionPrecise, $t, addParagraph,];
                    },
                };
                const { default: __VLS_61 } = __VLS_57.slots;
                let __VLS_62;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
                    iconName: "app-add-circle-outlined",
                    ...{ class: "color-secondary" },
                    size: (16),
                }));
                const __VLS_64 = __VLS_63({
                    iconName: "app-add-circle-outlined",
                    ...{ class: "color-secondary" },
                    size: (16),
                }, ...__VLS_functionalComponentArgsRest(__VLS_63));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                // @ts-ignore
                [];
                var __VLS_57;
                var __VLS_58;
            }
            // @ts-ignore
            [];
            var __VLS_51;
        }
        if (__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)) {
            let __VLS_67;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
            elDropdown;
            // @ts-ignore
            const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
                trigger: "click",
                teleported: (false),
            }));
            const __VLS_69 = __VLS_68({
                trigger: "click",
                teleported: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_68));
            const { default: __VLS_72 } = __VLS_70.slots;
            let __VLS_73;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
                text: true,
            }));
            const __VLS_75 = __VLS_74({
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_74));
            const { default: __VLS_78 } = __VLS_76.slots;
            let __VLS_79;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
                iconName: "app-more",
                ...{ class: "color-secondary" },
            }));
            const __VLS_81 = __VLS_80({
                iconName: "app-more",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_80));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [MoreFieldPermission, id,];
            var __VLS_76;
            {
                const { dropdown: __VLS_84 } = __VLS_70.slots;
                let __VLS_85;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                elDropdownMenu;
                // @ts-ignore
                const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
                    ...{ style: {} },
                }));
                const __VLS_87 = __VLS_86({
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_86));
                const { default: __VLS_90 } = __VLS_88.slots;
                if (__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)) {
                    let __VLS_91;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_93 = __VLS_92({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
                    let __VLS_96;
                    const __VLS_97 = {
                        /** @type {typeof __VLS_96.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.disabled))
                                throw 0;
                            if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                throw 0;
                            if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_generate(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.openGenerateDialog(__VLS_ctx.data);
                            // @ts-ignore
                            [data, id, permissionPrecise, openGenerateDialog,];
                        },
                    };
                    const { default: __VLS_98 } = __VLS_94.slots;
                    let __VLS_99;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
                        iconName: "app-generate-question",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_101 = __VLS_100({
                        iconName: "app-generate-question",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.document.generateQuestion.title'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_94;
                    var __VLS_95;
                }
                if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
                    let __VLS_104;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_106 = __VLS_105({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
                    let __VLS_109;
                    const __VLS_110 = {
                        /** @type {typeof __VLS_109.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.disabled))
                                throw 0;
                            if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                throw 0;
                            if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.openSelectDocumentDialog(__VLS_ctx.data);
                            // @ts-ignore
                            [data, id, permissionPrecise, openSelectDocumentDialog,];
                        },
                    };
                    const { default: __VLS_111 } = __VLS_107.slots;
                    let __VLS_112;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
                        iconName: "app-migrate",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_114 = __VLS_113({
                        iconName: "app-migrate",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.document.setting.migration'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_107;
                    var __VLS_108;
                }
                if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
                    let __VLS_117;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({}));
                    const __VLS_119 = __VLS_118({}, ...__VLS_functionalComponentArgsRest(__VLS_118));
                    const { default: __VLS_122 } = __VLS_120.slots;
                    let __VLS_123;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
                    elDropdown;
                    // @ts-ignore
                    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
                        ...{ class: "w-full" },
                        trigger: "hover",
                        showArrow: (false),
                        placement: "right-start",
                        popperClass: "move-position-popper",
                    }));
                    const __VLS_125 = __VLS_124({
                        ...{ class: "w-full" },
                        trigger: "hover",
                        showArrow: (false),
                        placement: "right-start",
                        popperClass: "move-position-popper",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
                    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                    const { default: __VLS_128 } = __VLS_126.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "w-full flex-between" },
                        ...{ style: {} },
                    });
                    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex align-center" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                    let __VLS_129;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
                        iconName: "app-drag-outlined",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_131 = __VLS_130({
                        iconName: "app-drag-outlined",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('views.document.movePosition.title'));
                    let __VLS_134;
                    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                    elIcon;
                    // @ts-ignore
                    const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
                        ...{ class: "color-input-placeholder" },
                        size: (16),
                        ...{ style: {} },
                    }));
                    const __VLS_136 = __VLS_135({
                        ...{ class: "color-input-placeholder" },
                        size: (16),
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
                    /** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
                    const { default: __VLS_139 } = __VLS_137.slots;
                    let __VLS_140;
                    /** @ts-ignore @type { | typeof __VLS_components.ArrowRight} */
                    ArrowRight;
                    // @ts-ignore
                    const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({}));
                    const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
                    // @ts-ignore
                    [id, permissionPrecise, $t,];
                    var __VLS_137;
                    {
                        const { dropdown: __VLS_145 } = __VLS_126.slots;
                        let __VLS_146;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                        elDropdownMenu;
                        // @ts-ignore
                        const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({}));
                        const __VLS_148 = __VLS_147({}, ...__VLS_functionalComponentArgsRest(__VLS_147));
                        const { default: __VLS_151 } = __VLS_149.slots;
                        let __VLS_152;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveUp),
                        }));
                        const __VLS_154 = __VLS_153({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveUp),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
                        let __VLS_157;
                        const __VLS_158 = {
                            /** @type {typeof __VLS_157.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.disabled))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.emit('move', 'top');
                                // @ts-ignore
                                [emit,];
                            },
                        };
                        const { default: __VLS_159 } = __VLS_155.slots;
                        (__VLS_ctx.$t('views.document.movePosition.moveTop'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_155;
                        var __VLS_156;
                        let __VLS_160;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveUp),
                        }));
                        const __VLS_162 = __VLS_161({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveUp),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
                        let __VLS_165;
                        const __VLS_166 = {
                            /** @type {typeof __VLS_165.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.disabled))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.emit('move', 'up');
                                // @ts-ignore
                                [emit,];
                            },
                        };
                        const { default: __VLS_167 } = __VLS_163.slots;
                        (__VLS_ctx.$t('views.document.movePosition.moveUp'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_163;
                        var __VLS_164;
                        let __VLS_168;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveDown),
                        }));
                        const __VLS_170 = __VLS_169({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveDown),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
                        let __VLS_173;
                        const __VLS_174 = {
                            /** @type {typeof __VLS_173.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.disabled))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.emit('move', 'down');
                                // @ts-ignore
                                [emit,];
                            },
                        };
                        const { default: __VLS_175 } = __VLS_171.slots;
                        (__VLS_ctx.$t('views.document.movePosition.moveDown'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_171;
                        var __VLS_172;
                        let __VLS_176;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveDown),
                        }));
                        const __VLS_178 = __VLS_177({
                            ...{ 'onClick': {} },
                            disabled: (!props.showMoveDown),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
                        let __VLS_181;
                        const __VLS_182 = {
                            /** @type {typeof __VLS_181.click} */
                            onClick: (...[$event]) => {
                                if (!(!__VLS_ctx.disabled))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                    throw 0;
                                return __VLS_ctx.emit('move', 'bottom');
                                // @ts-ignore
                                [emit,];
                            },
                        };
                        const { default: __VLS_183 } = __VLS_179.slots;
                        (__VLS_ctx.$t('views.document.movePosition.moveBottom'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_179;
                        var __VLS_180;
                        // @ts-ignore
                        [];
                        var __VLS_149;
                        // @ts-ignore
                        [];
                    }
                    // @ts-ignore
                    [];
                    var __VLS_126;
                    // @ts-ignore
                    [];
                    var __VLS_120;
                }
                if (__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)) {
                    let __VLS_184;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                    elDropdownItem;
                    // @ts-ignore
                    const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
                        ...{ 'onClick': {} },
                    }));
                    const __VLS_186 = __VLS_185({
                        ...{ 'onClick': {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
                    let __VLS_189;
                    const __VLS_190 = {
                        /** @type {typeof __VLS_189.click} */
                        onClick: (...[$event]) => {
                            if (!(!__VLS_ctx.disabled))
                                throw 0;
                            if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                throw 0;
                            if (!(__VLS_ctx.MoreFieldPermission(__VLS_ctx.id)))
                                throw 0;
                            if (!(__VLS_ctx.permissionPrecise.doc_edit(__VLS_ctx.id)))
                                throw 0;
                            return __VLS_ctx.deleteParagraph(__VLS_ctx.data);
                            // @ts-ignore
                            [data, id, permissionPrecise, deleteParagraph,];
                        },
                    };
                    const { default: __VLS_191 } = __VLS_187.slots;
                    let __VLS_192;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
                        iconName: "app-delete",
                        ...{ class: "color-secondary" },
                    }));
                    const __VLS_194 = __VLS_193({
                        iconName: "app-delete",
                        ...{ class: "color-secondary" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
                    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                    (__VLS_ctx.$t('common.delete'));
                    // @ts-ignore
                    [$t,];
                    var __VLS_187;
                    var __VLS_188;
                }
                // @ts-ignore
                [];
                var __VLS_88;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_70;
        }
        // @ts-ignore
        [];
        var __VLS_14;
        var __VLS_15;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.data.title || '-');
let __VLS_197;
/** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
MdPreview;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
    ...{ 'onClickPreview': {} },
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.data.content),
    ...{ class: "maxkb-md" },
    ...{ style: {} },
}));
const __VLS_199 = __VLS_198({
    ...{ 'onClickPreview': {} },
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.data.content),
    ...{ class: "maxkb-md" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
let __VLS_202;
const __VLS_203 = {
    /** @type {typeof __VLS_202.clickPreview} */
    onClickPreview: (...[$event]) => {
        return __VLS_ctx.handleClickCard(__VLS_ctx.data);
        // @ts-ignore
        [data, data, data, handleClickCard,];
    },
};
var __VLS_204;
/** @type {__VLS_StyleScopedClasses['maxkb-md']} */ ;
var __VLS_200;
var __VLS_201;
const __VLS_206 = ParagraphDialog;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.title),
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_208 = __VLS_207({
    ...{ 'onRefresh': {} },
    ref: "ParagraphDialogRef",
    title: (__VLS_ctx.title),
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
let __VLS_211;
const __VLS_212 = {
    /** @type {typeof __VLS_211.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_213;
var __VLS_209;
var __VLS_210;
const __VLS_215 = SelectDocumentDialog;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
    ...{ 'onRefresh': {} },
    ref: "SelectDocumentDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_217 = __VLS_216({
    ...{ 'onRefresh': {} },
    ref: "SelectDocumentDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
let __VLS_220;
const __VLS_221 = {
    /** @type {typeof __VLS_220.refresh} */
    onRefresh: (__VLS_ctx.refreshMigrateParagraph),
};
var __VLS_222;
var __VLS_218;
var __VLS_219;
const __VLS_224 = GenerateRelatedDialog;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    ...{ 'onRefresh': {} },
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_226 = __VLS_225({
    ...{ 'onRefresh': {} },
    ref: "GenerateRelatedDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
let __VLS_229;
const __VLS_230 = {
    /** @type {typeof __VLS_229.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_231;
var __VLS_227;
var __VLS_228;
// @ts-ignore
[title, apiType, apiType, apiType, refresh, refresh, refreshMigrateParagraph,];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_205 = __VLS_204, __VLS_214 = __VLS_213, __VLS_223 = __VLS_222, __VLS_232 = __VLS_231;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
