/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { datetimeFormat } from '@/utils/time';
import { MsgSuccess, MsgError } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
const route = useRoute();
const { params: { id, folderId }, } = route;
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
const permissionPrecise = computed(() => {
    return permissionMap['knowledge'][apiType.value];
});
const emit = defineEmits(['click', 'refreshVersion']);
const loading = ref(false);
const LogData = ref([]);
const mouseId = ref('');
function mouseenter(row) {
    mouseId.value = row.id;
}
function clickListHandle(item) {
    emit('click', item);
}
function refreshVersion(item) {
    emit('refreshVersion', item);
}
function openEditVersion(item) {
    item['writeStatus'] = true;
}
function closeWrite(item) {
    item['writeStatus'] = false;
}
const isShared = computed(() => {
    return folderId === 'share';
});
function editName(val, item) {
    if (val) {
        const obj = {
            name: val,
        };
        loadSharedApi({ type: 'tool', isShared: isShared.value, systemType: apiType.value })
            .updateToolWorkflowVersion(id, item.id, obj, loading)
            .then(() => {
            MsgSuccess(t('common.modifySuccess'));
            item['writeStatus'] = false;
            getList();
        });
    }
    else {
        MsgError(t('workflow.tip.nameMessage'));
    }
}
function getList() {
    loadSharedApi({ type: 'tool', isShared: isShared.value, systemType: apiType.value })
        .listToolWorkflowVersion(id, loading)
        .then((res) => {
        LogData.value = res.data;
    });
}
onMounted(() => {
    getList();
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "workflow-publish-history border-l white-bg" },
});
/** @type {__VLS_StyleScopedClasses['workflow-publish-history']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l']} */ ;
/** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "border-b p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
(__VLS_ctx.$t('workflow.setting.releaseHistory'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "list-height pt-0" },
});
/** @type {__VLS_StyleScopedClasses['list-height']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8 pt-0" },
});
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.LogData),
    ...{ class: "mt-8" },
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.LogData),
    ...{ class: "mt-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.click} */
    onClick: (__VLS_ctx.clickListHandle),
};
const __VLS_13 = {
    /** @type {typeof __VLS_11.mouseenter} */
    onMouseenter: (__VLS_ctx.mouseenter),
};
const __VLS_14 = {
    /** @type {typeof __VLS_11.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.mouseId = '';
        // @ts-ignore
        [$t, LogData, clickListHandle, mouseenter, mouseId,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
const { default: __VLS_15 } = __VLS_9.slots;
{
    const { default: __VLS_16 } = __VLS_9.slots;
    const [{ row, index }] = __VLS_vSlot(__VLS_16);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: (index === 0 ? 'primary' : '') },
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_17;
    /** @ts-ignore @type { | typeof __VLS_components.ReadWrite} */
    ReadWrite;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        ...{ 'onChange': {} },
        ...{ 'onClose': {} },
        data: (row.name || __VLS_ctx.datetimeFormat(row.update_time)),
        trigger: "manual",
        write: (row.writeStatus),
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onChange': {} },
        ...{ 'onClose': {} },
        data: (row.name || __VLS_ctx.datetimeFormat(row.update_time)),
        trigger: "manual",
        write: (row.writeStatus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        /** @type {typeof __VLS_22.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.editName($event, row);
            // @ts-ignore
            [vLoading, loading, datetimeFormat, editName,];
        },
    };
    const __VLS_24 = {
        /** @type {typeof __VLS_22.close} */
        onClose: (...[$event]) => {
            return __VLS_ctx.closeWrite(row);
            // @ts-ignore
            [closeWrite,];
        },
    };
    var __VLS_20;
    var __VLS_21;
    if (index === 0) {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            ...{ class: "default-tag ml-4" },
        }));
        const __VLS_27 = __VLS_26({
            ...{ class: "default-tag ml-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        /** @type {__VLS_StyleScopedClasses['default-tag']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_30 } = __VLS_28.slots;
        (__VLS_ctx.$t('workflow.setting.latestRelease'));
        // @ts-ignore
        [$t,];
        var __VLS_28;
    }
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        type: "info",
        ...{ class: "color-secondary flex align-center mt-8" },
    }));
    const __VLS_33 = __VLS_32({
        type: "info",
        ...{ class: "color-secondary flex align-center mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    const { default: __VLS_36 } = __VLS_34.slots;
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        size: (20),
        ...{ class: "avatar-grey mr-4" },
    }));
    const __VLS_39 = __VLS_38({
        size: (20),
        ...{ class: "avatar-grey mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    /** @type {__VLS_StyleScopedClasses['avatar-grey']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_42 } = __VLS_40.slots;
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
    const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.UserFilled} */
    UserFilled;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    // @ts-ignore
    [];
    var __VLS_46;
    // @ts-ignore
    [];
    var __VLS_40;
    (row.publish_user_name);
    // @ts-ignore
    [];
    var __VLS_34;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.mouseId === row.id) }, null, null);
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        trigger: "click",
        teleported: (false),
    }));
    const __VLS_56 = __VLS_55({
        trigger: "click",
        teleported: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    const { default: __VLS_59 } = __VLS_57.slots;
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        text: true,
    }));
    const __VLS_62 = __VLS_61({
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const { default: __VLS_65 } = __VLS_63.slots;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        iconName: "app-more",
    }));
    const __VLS_68 = __VLS_67({
        iconName: "app-more",
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    // @ts-ignore
    [mouseId,];
    var __VLS_63;
    {
        const { dropdown: __VLS_71 } = __VLS_57.slots;
        let __VLS_72;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({}));
        const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
        const { default: __VLS_77 } = __VLS_75.slots;
        if (__VLS_ctx.permissionPrecise.workflow_edit(__VLS_ctx.id)) {
            let __VLS_78;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
                ...{ 'onClick': {} },
            }));
            const __VLS_80 = __VLS_79({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_79));
            let __VLS_83;
            const __VLS_84 = {
                /** @type {typeof __VLS_83.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.permissionPrecise.workflow_edit(__VLS_ctx.id)))
                        throw 0;
                    return __VLS_ctx.openEditVersion(row);
                    // @ts-ignore
                    [permissionPrecise, id, openEditVersion,];
                },
            };
            const { default: __VLS_85 } = __VLS_81.slots;
            let __VLS_86;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
                iconName: "app-edit",
                ...{ class: "color-secondary" },
            }));
            const __VLS_88 = __VLS_87({
                iconName: "app-edit",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_87));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            (__VLS_ctx.$t('common.edit'));
            // @ts-ignore
            [$t,];
            var __VLS_81;
            var __VLS_82;
        }
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
                return __VLS_ctx.refreshVersion(row);
                // @ts-ignore
                [refreshVersion,];
            },
        };
        const { default: __VLS_98 } = __VLS_94.slots;
        let __VLS_99;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
            ...{ class: "color-secondary" },
        }));
        const __VLS_101 = __VLS_100({
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        const { default: __VLS_104 } = __VLS_102.slots;
        let __VLS_105;
        /** @ts-ignore @type { | typeof __VLS_components.RefreshLeft} */
        RefreshLeft;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
        const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
        // @ts-ignore
        [];
        var __VLS_102;
        (__VLS_ctx.$t('workflow.setting.restoreCurrentVersion'));
        // @ts-ignore
        [$t,];
        var __VLS_94;
        var __VLS_95;
        // @ts-ignore
        [];
        var __VLS_75;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_57;
    // @ts-ignore
    [];
}
{
    const { empty: __VLS_110 } = __VLS_9.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        type: "info",
    }));
    const __VLS_113 = __VLS_112({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    const { default: __VLS_116 } = __VLS_114.slots;
    (__VLS_ctx.$t('aiChat.noHistory'));
    // @ts-ignore
    [$t,];
    var __VLS_114;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
});
export default {};
