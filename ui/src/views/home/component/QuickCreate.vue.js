/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, shallowRef, nextTick, computed } from 'vue';
import CreateApplicationDialog from '@/views/application/component/CreateApplicationDialog.vue';
import ApplicationApi from '@/api/application/application';
import CreateKnowledgeDialog from '@/views/knowledge/create-component/CreateKnowledgeDialog.vue';
import CreateWebKnowledgeDialog from '@/views/knowledge/create-component/CreateWebKnowledgeDialog.vue';
import CreateLarkKnowledgeDialog from '@/views/knowledge/create-component/CreateLarkKnowledgeDialog.vue';
import CreateWorkflowKnowledgeDialog from '@/views/knowledge/create-component/CreateWorkflowKnowledgeDialog.vue';
import knowledgeApi from '@/api/knowledge/knowledge';
import ToolFormDrawer from '@/views/tool/ToolFormDrawer.vue';
import WorkflowFormDialog from '@/views/tool/WorkflowFormDialog.vue';
import McpToolFormDrawer from '@/views/tool/McpToolFormDrawer.vue';
import SkillToolFormDrawer from '@/views/tool/SkillToolFormDrawer.vue';
import DataSourceToolFormDrawer from '@/views/tool/DataSourceToolFormDrawer.vue';
import toolApi from '@/api/tool/tool';
import CreateModelDialog from '@/views/model/component/CreateModelDialog.vue';
import SelectProviderDialog from '@/views/model/component/SelectProviderDialog.vue';
import { allObj } from '@/views/model/component/data';
import { MsgConfirm } from '@/utils/message';
import { useRouter } from 'vue-router';
import useStore from '@/stores';
import { t } from '@/locales';
import permissionMap from '@/permission';
const { user, tool } = useStore();
const router = useRouter();
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    tokenUsage: {
        type: Array,
        default: () => [],
    },
    topQuestions: {
        type: Array,
        default: () => [],
    },
});
const permissionPrecise = computed(() => {
    return permissionMap;
});
const importLoading = ref(false);
// AgentQuickMethod
const isDropdownVisible = ref('');
const handleVisibleChange = (val, visible) => {
    isDropdownVisible.value = visible ? val : '';
};
const CreateApplicationDialogRef = ref();
function openCreateApplicationDialog(type) {
    CreateApplicationDialogRef.value.open(user.getWorkspaceId() ?? 'default', type);
}
const ApplicationUploadRef = ref();
const importApplication = (file) => {
    const formData = new FormData();
    formData.append('file', file.raw, file.name);
    ApplicationUploadRef.value.clearFiles();
    ApplicationApi.importApplication(user.getWorkspaceId() ?? 'default', formData)
        .then(async (res) => {
        if (res?.data) {
            user.profile();
            router.push({ path: `/application` });
        }
    })
        .catch((e) => {
        if (e.code === 400) {
            MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
                cancelButtonText: t('common.confirm'),
                confirmButtonText: t('common.professional'),
            }).then(() => {
                window.open('https://maxkb.cn/pricing.html', '_blank');
            });
        }
    });
};
// KnowledgeDatabaseQuickMethod
const CreateKnowledgeDialogRef = ref();
const currentCreateDialog = shallowRef(null);
function openCreateKnowledgeDialog(data) {
    currentCreateDialog.value = data;
    nextTick(() => {
        CreateKnowledgeDialogRef.value.open({ id: user.getWorkspaceId() ?? 'default' });
    });
}
const importKnowledgeUploadRef = ref();
function importKnowledgeBundle(file) {
    const formData = new FormData();
    formData.append('file', file.raw);
    const folderId = user.getWorkspaceId() ?? 'default';
    formData.append('folder_id', folderId);
    importKnowledgeUploadRef.value.clearFiles();
    knowledgeApi
        .importKnowledgeBundle(formData, importLoading)
        .then(async (res) => {
        if (res?.data) {
            const knowledgeId = res.data.knowledge_id;
            const knowledgeType = res.data.type;
            const folderId = user.getWorkspaceId() ?? 'default';
            await user.profile();
            router.push({
                path: `/knowledge/${knowledgeId}/${folderId}/${knowledgeType}/document`,
                query: { imported: 'true' },
            });
        }
    })
        .catch((e) => {
        if (e.code === 400) {
            MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
                cancelButtonText: t('common.confirm'),
                confirmButtonText: t('common.professional'),
            }).then(() => {
                window.open('https://maxkb.cn/pricing.html', '_blank');
            });
        }
    });
}
// ToolsQuickMethod
const ToolUploadRef = ref();
function importTool(file) {
    const formData = new FormData();
    formData.append('file', file.raw, file.name);
    formData.append('folder_id', user.getWorkspaceId() ?? 'default');
    ToolUploadRef.value.clearFiles();
    toolApi
        .postImportTool(formData, importLoading)
        .then(async (res) => {
        if (res?.data) {
            tool.setToolList([]);
            return user.profile().then(() => {
                router.push({ path: `/tool` });
            });
        }
    })
        .catch((e) => {
        if (e.code === 400) {
            MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
                cancelButtonText: t('common.confirm'),
                confirmButtonText: t('common.professional'),
            }).then(() => {
                window.open('https://maxkb.cn/pricing.html', '_blank');
            });
        }
    });
}
const ToolFormDrawerRef = ref();
const ToolDrawertitle = ref('');
function openCreateToolDialog() {
    ToolDrawertitle.value = t('views.tool.createTool');
    ToolFormDrawerRef.value.open();
}
function toolRefresh() {
    router.push({ path: `/tool` });
}
const workflowFormDialogRef = ref();
const workflowFormDialogTitle = ref('');
const openCreateWorkflowDialog = () => {
    workflowFormDialogTitle.value = t('views.tool.toolWorkflow.creatToolWorkflow');
    workflowFormDialogRef.value?.open();
};
const SkillToolFormDrawerRef = ref();
const SkillToolDrawertitle = ref('');
function openCreateSkillDialog() {
    SkillToolDrawertitle.value = t('views.tool.skill.createSkillTool');
    SkillToolFormDrawerRef.value.open();
}
const McpToolDrawertitle = ref('');
const McpToolFormDrawerRef = ref();
function openCreateMcpDialog() {
    McpToolDrawertitle.value = t('views.tool.mcp.createMcpTool');
    McpToolFormDrawerRef.value.open();
}
const DataSourceToolDrawertitle = ref('');
const DataSourceToolFormDrawerRef = ref();
function openCreateDataSourceDialog() {
    DataSourceToolFormDrawerRef.value.open();
}
// ModelQuickMethod
const createModelRef = ref();
const selectProviderRef = ref();
const openCreateModel = (provider, model_type) => {
    if (provider && provider.provider) {
        createModelRef.value?.open(provider, model_type);
    }
    else {
        selectProviderRef.value?.open();
    }
};
function modelRefresh() {
    router.push({ path: `/model` });
}
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
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (16),
}));
const __VLS_2 = __VLS_1({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, modifiers: { fullscreen: true, lock: true, }, value: (__VLS_ctx.importLoading) }, null, null);
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.permissionPrecise.application.workspace.create()) {
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }));
    const __VLS_8 = __VLS_7({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_11 } = __VLS_9.slots;
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        ...{ 'onVisibleChange': {} },
        trigger: "hover",
        ...{ class: "w-full" },
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onVisibleChange': {} },
        trigger: "hover",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_17;
    const __VLS_18 = {
        /** @type {typeof __VLS_17.visibleChange} */
        onVisibleChange: ((visible) => __VLS_ctx.handleVisibleChange('application', visible)),
    };
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_19 } = __VLS_15.slots;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }));
    const __VLS_22 = __VLS_21({
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['quick-create-card']} */ ;
    const { default: __VLS_25 } = __VLS_23.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/home/icon_create-agent.svg",
        alt: "",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('home.createAgent'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary font-small mt-8 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('home.createAgentDescribe'));
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ...{ class: "arrow-icon" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.isDropdownVisible === 'application' }) },
    }));
    const __VLS_28 = __VLS_27({
        ...{ class: "arrow-icon" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.isDropdownVisible === 'application' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['rotate-180']} */ ;
    const { default: __VLS_31 } = __VLS_29.slots;
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
    ArrowDown;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({}));
    const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    // @ts-ignore
    [vLoading, importLoading, permissionPrecise, handleVisibleChange, $t, $t, isDropdownVisible,];
    var __VLS_29;
    // @ts-ignore
    [];
    var __VLS_23;
    {
        const { dropdown: __VLS_37 } = __VLS_15.slots;
        let __VLS_38;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            ...{ class: "create-dropdown" },
        }));
        const __VLS_40 = __VLS_39({
            ...{ class: "create-dropdown" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        /** @type {__VLS_StyleScopedClasses['create-dropdown']} */ ;
        const { default: __VLS_43 } = __VLS_41.slots;
        let __VLS_44;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
            ...{ 'onClick': {} },
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_49;
        const __VLS_50 = {
            /** @type {typeof __VLS_49.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.application.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateApplicationDialog('SIMPLE');
                // @ts-ignore
                [openCreateApplicationDialog,];
            },
        };
        const { default: __VLS_51 } = __VLS_47.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        let __VLS_52;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
            shape: "square",
            ...{ class: "avatar-blue mt-4" },
            size: (32),
        }));
        const __VLS_54 = __VLS_53({
            shape: "square",
            ...{ class: "avatar-blue mt-4" },
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        /** @type {__VLS_StyleScopedClasses['avatar-blue']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        const { default: __VLS_57 } = __VLS_55.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/application/icon_simple_application.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_55;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.application.simpleAgent'));
        let __VLS_58;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }));
        const __VLS_60 = __VLS_59({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        const { default: __VLS_63 } = __VLS_61.slots;
        (__VLS_ctx.$t('views.application.simplePlaceholder'));
        // @ts-ignore
        [$t, $t,];
        var __VLS_61;
        // @ts-ignore
        [];
        var __VLS_47;
        var __VLS_48;
        let __VLS_64;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
            ...{ 'onClick': {} },
        }));
        const __VLS_66 = __VLS_65({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        let __VLS_69;
        const __VLS_70 = {
            /** @type {typeof __VLS_69.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.application.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateApplicationDialog('WORK_FLOW');
                // @ts-ignore
                [openCreateApplicationDialog,];
            },
        };
        const { default: __VLS_71 } = __VLS_67.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        let __VLS_72;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
            shape: "square",
            ...{ class: "avatar-orange mt-4" },
            size: (32),
        }));
        const __VLS_74 = __VLS_73({
            shape: "square",
            ...{ class: "avatar-orange mt-4" },
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        /** @type {__VLS_StyleScopedClasses['avatar-orange']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        const { default: __VLS_77 } = __VLS_75.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/application/icon_workflow_application.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_75;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.application.AdvancedAgent'));
        let __VLS_78;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }));
        const __VLS_80 = __VLS_79({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_79));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        const { default: __VLS_83 } = __VLS_81.slots;
        (__VLS_ctx.$t('views.application.advancedPlaceholder'));
        // @ts-ignore
        [$t, $t,];
        var __VLS_81;
        // @ts-ignore
        [];
        var __VLS_67;
        var __VLS_68;
        let __VLS_84;
        /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
        elUpload;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
            ...{ class: "import-button" },
            ref: "ApplicationUploadRef",
            fileList: ([]),
            action: "#",
            multiple: true,
            autoUpload: (false),
            showFileList: (false),
            limit: (1),
            onChange: ((file, fileList) => __VLS_ctx.importApplication(file)),
        }));
        const __VLS_86 = __VLS_85({
            ...{ class: "import-button" },
            ref: "ApplicationUploadRef",
            fileList: ([]),
            action: "#",
            multiple: true,
            autoUpload: (false),
            showFileList: (false),
            limit: (1),
            onChange: ((file, fileList) => __VLS_ctx.importApplication(file)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        var __VLS_89;
        /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
        const { default: __VLS_91 } = __VLS_87.slots;
        let __VLS_92;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({}));
        const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
        const { default: __VLS_97 } = __VLS_95.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        let __VLS_98;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }));
        const __VLS_100 = __VLS_99({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_99));
        const { default: __VLS_103 } = __VLS_101.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/icon_import.svg",
            alt: "",
        });
        // @ts-ignore
        [importApplication,];
        var __VLS_101;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.application.importApplication'));
        // @ts-ignore
        [$t,];
        var __VLS_95;
        // @ts-ignore
        [];
        var __VLS_87;
        // @ts-ignore
        [];
        var __VLS_41;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_15;
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_9;
}
if (__VLS_ctx.permissionPrecise.knowledge.workspace.create()) {
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }));
    const __VLS_106 = __VLS_105({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_109 } = __VLS_107.slots;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        ...{ 'onVisibleChange': {} },
        trigger: "hover",
        ...{ class: "w-full" },
    }));
    const __VLS_112 = __VLS_111({
        ...{ 'onVisibleChange': {} },
        trigger: "hover",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    let __VLS_115;
    const __VLS_116 = {
        /** @type {typeof __VLS_115.visibleChange} */
        onVisibleChange: ((visible) => __VLS_ctx.handleVisibleChange('knowledge', visible)),
    };
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_117 } = __VLS_113.slots;
    let __VLS_118;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }));
    const __VLS_120 = __VLS_119({
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['quick-create-card']} */ ;
    const { default: __VLS_123 } = __VLS_121.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/home/icon_create-knowledge.svg",
        alt: "",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('home.createKnowledge'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary font-small mt-8 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('home.createKnowledgeDescribe'));
    let __VLS_124;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
        ...{ class: "arrow-icon" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.isDropdownVisible === 'knowledge' }) },
    }));
    const __VLS_126 = __VLS_125({
        ...{ class: "arrow-icon" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.isDropdownVisible === 'knowledge' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['rotate-180']} */ ;
    const { default: __VLS_129 } = __VLS_127.slots;
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
    ArrowDown;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({}));
    const __VLS_132 = __VLS_131({}, ...__VLS_functionalComponentArgsRest(__VLS_131));
    // @ts-ignore
    [permissionPrecise, handleVisibleChange, $t, $t, isDropdownVisible,];
    var __VLS_127;
    // @ts-ignore
    [];
    var __VLS_121;
    {
        const { dropdown: __VLS_135 } = __VLS_113.slots;
        let __VLS_136;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
            ...{ class: "create-dropdown" },
        }));
        const __VLS_138 = __VLS_137({
            ...{ class: "create-dropdown" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        /** @type {__VLS_StyleScopedClasses['create-dropdown']} */ ;
        const { default: __VLS_141 } = __VLS_139.slots;
        let __VLS_142;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
            ...{ 'onClick': {} },
        }));
        const __VLS_144 = __VLS_143({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_143));
        let __VLS_147;
        const __VLS_148 = {
            /** @type {typeof __VLS_147.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.knowledge.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateKnowledgeDialog(CreateKnowledgeDialog);
                // @ts-ignore
                [openCreateKnowledgeDialog,];
            },
        };
        const { default: __VLS_149 } = __VLS_145.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        let __VLS_150;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
            ...{ class: "avatar-blue mt-4" },
            shape: "square",
            size: (32),
        }));
        const __VLS_152 = __VLS_151({
            ...{ class: "avatar-blue mt-4" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_151));
        /** @type {__VLS_StyleScopedClasses['avatar-blue']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        const { default: __VLS_155 } = __VLS_153.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/knowledge/icon_document.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_153;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.knowledge.knowledgeType.generalKnowledge'));
        let __VLS_156;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }));
        const __VLS_158 = __VLS_157({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        const { default: __VLS_161 } = __VLS_159.slots;
        (__VLS_ctx.$t('views.knowledge.knowledgeType.generalInfo'));
        // @ts-ignore
        [$t, $t,];
        var __VLS_159;
        // @ts-ignore
        [];
        var __VLS_145;
        var __VLS_146;
        let __VLS_162;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
            ...{ 'onClick': {} },
        }));
        const __VLS_164 = __VLS_163({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_163));
        let __VLS_167;
        const __VLS_168 = {
            /** @type {typeof __VLS_167.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.knowledge.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateKnowledgeDialog(CreateWebKnowledgeDialog);
                // @ts-ignore
                [openCreateKnowledgeDialog,];
            },
        };
        const { default: __VLS_169 } = __VLS_165.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        let __VLS_170;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
            ...{ class: "avatar-purple mt-4" },
            shape: "square",
            size: (32),
        }));
        const __VLS_172 = __VLS_171({
            ...{ class: "avatar-purple mt-4" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_171));
        /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        const { default: __VLS_175 } = __VLS_173.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/knowledge/icon_web.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_173;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.knowledge.knowledgeType.webKnowledge'));
        let __VLS_176;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }));
        const __VLS_178 = __VLS_177({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        const { default: __VLS_181 } = __VLS_179.slots;
        (__VLS_ctx.$t('views.knowledge.knowledgeType.webInfo'));
        // @ts-ignore
        [$t, $t,];
        var __VLS_179;
        // @ts-ignore
        [];
        var __VLS_165;
        var __VLS_166;
        if (__VLS_ctx.user.isPE() || __VLS_ctx.user.isEE()) {
            let __VLS_182;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
                ...{ 'onClick': {} },
            }));
            const __VLS_184 = __VLS_183({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_183));
            let __VLS_187;
            const __VLS_188 = {
                /** @type {typeof __VLS_187.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.permissionPrecise.knowledge.workspace.create()))
                        throw 0;
                    if (!(__VLS_ctx.user.isPE() || __VLS_ctx.user.isEE()))
                        throw 0;
                    return __VLS_ctx.openCreateKnowledgeDialog(CreateLarkKnowledgeDialog);
                    // @ts-ignore
                    [openCreateKnowledgeDialog, user, user,];
                },
            };
            const { default: __VLS_189 } = __VLS_185.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            let __VLS_190;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
                ...{ class: "avatar-purple mt-4" },
                shape: "square",
                size: (32),
                ...{ style: {} },
            }));
            const __VLS_192 = __VLS_191({
                ...{ class: "avatar-purple mt-4" },
                shape: "square",
                size: (32),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_191));
            /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            const { default: __VLS_195 } = __VLS_193.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/knowledge/logo_lark.svg",
                alt: "",
            });
            // @ts-ignore
            [];
            var __VLS_193;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "pre-wrap ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.$t('views.knowledge.knowledgeType.larkKnowledge'));
            let __VLS_196;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
                type: "info",
                size: "small",
                ...{ class: "color-secondary" },
            }));
            const __VLS_198 = __VLS_197({
                type: "info",
                size: "small",
                ...{ class: "color-secondary" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_197));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            const { default: __VLS_201 } = __VLS_199.slots;
            (__VLS_ctx.$t('views.knowledge.knowledgeType.larkInfo'));
            // @ts-ignore
            [$t, $t,];
            var __VLS_199;
            // @ts-ignore
            [];
            var __VLS_185;
            var __VLS_186;
        }
        let __VLS_202;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
            ...{ 'onClick': {} },
        }));
        const __VLS_204 = __VLS_203({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_203));
        let __VLS_207;
        const __VLS_208 = {
            /** @type {typeof __VLS_207.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.knowledge.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateKnowledgeDialog(CreateWorkflowKnowledgeDialog);
                // @ts-ignore
                [openCreateKnowledgeDialog,];
            },
        };
        const { default: __VLS_209 } = __VLS_205.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        let __VLS_210;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
            ...{ class: "avatar-purple mt-4" },
            shape: "square",
            size: (32),
        }));
        const __VLS_212 = __VLS_211({
            ...{ class: "avatar-purple mt-4" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_211));
        /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        const { default: __VLS_215 } = __VLS_213.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/workflow/logo_workflow.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_213;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.knowledge.knowledgeType.workflowKnowledge'));
        let __VLS_216;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }));
        const __VLS_218 = __VLS_217({
            type: "info",
            size: "small",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        const { default: __VLS_221 } = __VLS_219.slots;
        (__VLS_ctx.$t('views.knowledge.knowledgeType.workflowInfo'));
        // @ts-ignore
        [$t, $t,];
        var __VLS_219;
        // @ts-ignore
        [];
        var __VLS_205;
        var __VLS_206;
        let __VLS_222;
        /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
        elUpload;
        // @ts-ignore
        const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
            ref: "importKnowledgeUploadRef",
            fileList: ([]),
            action: "#",
            multiple: true,
            autoUpload: (false),
            showFileList: (false),
            limit: (1),
            accept: ".zip",
            onChange: ((file) => __VLS_ctx.importKnowledgeBundle(file)),
            ...{ class: "import-button" },
        }));
        const __VLS_224 = __VLS_223({
            ref: "importKnowledgeUploadRef",
            fileList: ([]),
            action: "#",
            multiple: true,
            autoUpload: (false),
            showFileList: (false),
            limit: (1),
            accept: ".zip",
            onChange: ((file) => __VLS_ctx.importKnowledgeBundle(file)),
            ...{ class: "import-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_223));
        var __VLS_227;
        /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
        const { default: __VLS_229 } = __VLS_225.slots;
        let __VLS_230;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({}));
        const __VLS_232 = __VLS_231({}, ...__VLS_functionalComponentArgsRest(__VLS_231));
        const { default: __VLS_235 } = __VLS_233.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        let __VLS_236;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }));
        const __VLS_238 = __VLS_237({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        const { default: __VLS_241 } = __VLS_239.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/icon_import.svg",
            alt: "",
        });
        // @ts-ignore
        [importKnowledgeBundle,];
        var __VLS_239;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('common.importCreate'));
        // @ts-ignore
        [$t,];
        var __VLS_233;
        // @ts-ignore
        [];
        var __VLS_225;
        // @ts-ignore
        [];
        var __VLS_139;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_113;
    var __VLS_114;
    // @ts-ignore
    [];
    var __VLS_107;
}
if (__VLS_ctx.permissionPrecise.tool.workspace.create()) {
    let __VLS_242;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }));
    const __VLS_244 = __VLS_243({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_243));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_247 } = __VLS_245.slots;
    let __VLS_248;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
        ...{ 'onVisibleChange': {} },
        trigger: "hover",
        ...{ class: "w-full" },
    }));
    const __VLS_250 = __VLS_249({
        ...{ 'onVisibleChange': {} },
        trigger: "hover",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    let __VLS_253;
    const __VLS_254 = {
        /** @type {typeof __VLS_253.visibleChange} */
        onVisibleChange: ((visible) => __VLS_ctx.handleVisibleChange('tool', visible)),
    };
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_255 } = __VLS_251.slots;
    let __VLS_256;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }));
    const __VLS_258 = __VLS_257({
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['quick-create-card']} */ ;
    const { default: __VLS_261 } = __VLS_259.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/home/icon_create-tool.svg",
        alt: "",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('home.createTool'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary font-small mt-8 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('home.createToolDescribe'));
    let __VLS_262;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
        ...{ class: "arrow-icon" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.isDropdownVisible === 'tool' }) },
    }));
    const __VLS_264 = __VLS_263({
        ...{ class: "arrow-icon" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.isDropdownVisible === 'tool' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['rotate-180']} */ ;
    const { default: __VLS_267 } = __VLS_265.slots;
    let __VLS_268;
    /** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
    ArrowDown;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({}));
    const __VLS_270 = __VLS_269({}, ...__VLS_functionalComponentArgsRest(__VLS_269));
    // @ts-ignore
    [permissionPrecise, handleVisibleChange, $t, $t, isDropdownVisible,];
    var __VLS_265;
    // @ts-ignore
    [];
    var __VLS_259;
    {
        const { dropdown: __VLS_273 } = __VLS_251.slots;
        let __VLS_274;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
            ...{ class: "create-dropdown" },
        }));
        const __VLS_276 = __VLS_275({
            ...{ class: "create-dropdown" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_275));
        /** @type {__VLS_StyleScopedClasses['create-dropdown']} */ ;
        const { default: __VLS_279 } = __VLS_277.slots;
        let __VLS_280;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
            ...{ 'onClick': {} },
        }));
        const __VLS_282 = __VLS_281({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_281));
        let __VLS_285;
        const __VLS_286 = {
            /** @type {typeof __VLS_285.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.tool.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateToolDialog();
                // @ts-ignore
                [openCreateToolDialog,];
            },
        };
        const { default: __VLS_287 } = __VLS_283.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_288;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
            ...{ class: "avatar-green" },
            shape: "square",
            size: (32),
        }));
        const __VLS_290 = __VLS_289({
            ...{ class: "avatar-green" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
        const { default: __VLS_293 } = __VLS_291.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/tool/icon_tool.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_291;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.tool.title'));
        // @ts-ignore
        [$t,];
        var __VLS_283;
        var __VLS_284;
        let __VLS_294;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
            ...{ 'onClick': {} },
        }));
        const __VLS_296 = __VLS_295({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_295));
        let __VLS_299;
        const __VLS_300 = {
            /** @type {typeof __VLS_299.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.tool.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateWorkflowDialog();
                // @ts-ignore
                [openCreateWorkflowDialog,];
            },
        };
        const { default: __VLS_301 } = __VLS_297.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_302;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_303 = __VLS_asFunctionalComponent1(__VLS_302, new __VLS_302({
            ...{ class: "avatar-green mt-4" },
            shape: "square",
            size: (32),
        }));
        const __VLS_304 = __VLS_303({
            ...{ class: "avatar-green mt-4" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_303));
        /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        const { default: __VLS_307 } = __VLS_305.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/workflow/logo_workflow.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_305;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('workflow.workflow'));
        // @ts-ignore
        [$t,];
        var __VLS_297;
        var __VLS_298;
        let __VLS_308;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
            ...{ 'onClick': {} },
        }));
        const __VLS_310 = __VLS_309({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_309));
        let __VLS_313;
        const __VLS_314 = {
            /** @type {typeof __VLS_313.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.tool.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateSkillDialog();
                // @ts-ignore
                [openCreateSkillDialog,];
            },
        };
        const { default: __VLS_315 } = __VLS_311.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_316;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
            shape: "square",
            size: (32),
        }));
        const __VLS_318 = __VLS_317({
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        const { default: __VLS_321 } = __VLS_319.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/tool/icon_skill.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_319;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        // @ts-ignore
        [];
        var __VLS_311;
        var __VLS_312;
        let __VLS_322;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_323 = __VLS_asFunctionalComponent1(__VLS_322, new __VLS_322({
            ...{ 'onClick': {} },
        }));
        const __VLS_324 = __VLS_323({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_323));
        let __VLS_327;
        const __VLS_328 = {
            /** @type {typeof __VLS_327.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.tool.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateMcpDialog();
                // @ts-ignore
                [openCreateMcpDialog,];
            },
        };
        const { default: __VLS_329 } = __VLS_325.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_330;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_331 = __VLS_asFunctionalComponent1(__VLS_330, new __VLS_330({
            shape: "square",
            size: (32),
        }));
        const __VLS_332 = __VLS_331({
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_331));
        const { default: __VLS_335 } = __VLS_333.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/tool/icon_mcp.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_333;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        // @ts-ignore
        [];
        var __VLS_325;
        var __VLS_326;
        let __VLS_336;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
            ...{ 'onClick': {} },
        }));
        const __VLS_338 = __VLS_337({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_337));
        let __VLS_341;
        const __VLS_342 = {
            /** @type {typeof __VLS_341.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.tool.workspace.create()))
                    throw 0;
                return __VLS_ctx.openCreateDataSourceDialog();
                // @ts-ignore
                [openCreateDataSourceDialog,];
            },
        };
        const { default: __VLS_343 } = __VLS_339.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_344;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_345 = __VLS_asFunctionalComponent1(__VLS_344, new __VLS_344({
            ...{ class: "avatar-purple" },
            shape: "square",
            size: (32),
        }));
        const __VLS_346 = __VLS_345({
            ...{ class: "avatar-purple" },
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_345));
        /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
        const { default: __VLS_349 } = __VLS_347.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/tool/icon_datasource.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [];
        var __VLS_347;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('views.tool.dataSource.title'));
        // @ts-ignore
        [$t,];
        var __VLS_339;
        var __VLS_340;
        let __VLS_350;
        /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
        elUpload;
        // @ts-ignore
        const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
            ref: "ToolUploadRef",
            fileList: ([]),
            action: "#",
            multiple: true,
            autoUpload: (false),
            showFileList: (false),
            limit: (1),
            onChange: ((file, fileList) => __VLS_ctx.importTool(file)),
            ...{ class: "import-button" },
        }));
        const __VLS_352 = __VLS_351({
            ref: "ToolUploadRef",
            fileList: ([]),
            action: "#",
            multiple: true,
            autoUpload: (false),
            showFileList: (false),
            limit: (1),
            onChange: ((file, fileList) => __VLS_ctx.importTool(file)),
            ...{ class: "import-button" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_351));
        var __VLS_355;
        /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
        const { default: __VLS_357 } = __VLS_353.slots;
        let __VLS_358;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_359 = __VLS_asFunctionalComponent1(__VLS_358, new __VLS_358({}));
        const __VLS_360 = __VLS_359({}, ...__VLS_functionalComponentArgsRest(__VLS_359));
        const { default: __VLS_363 } = __VLS_361.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        let __VLS_364;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_365 = __VLS_asFunctionalComponent1(__VLS_364, new __VLS_364({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }));
        const __VLS_366 = __VLS_365({
            shape: "square",
            size: (32),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_365));
        const { default: __VLS_369 } = __VLS_367.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/icon_import.svg",
            alt: "",
        });
        // @ts-ignore
        [importTool,];
        var __VLS_367;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pre-wrap ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.$t('common.importCreate'));
        // @ts-ignore
        [$t,];
        var __VLS_361;
        // @ts-ignore
        [];
        var __VLS_353;
        // @ts-ignore
        [];
        var __VLS_277;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_251;
    var __VLS_252;
    // @ts-ignore
    [];
    var __VLS_245;
}
if (__VLS_ctx.permissionPrecise.model.workspace.create()) {
    let __VLS_370;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_371 = __VLS_asFunctionalComponent1(__VLS_370, new __VLS_370({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }));
    const __VLS_372 = __VLS_371({
        xs: (12),
        sm: (12),
        md: (12),
        lg: (6),
        xl: (6),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_371));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_375 } = __VLS_373.slots;
    let __VLS_376;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent1(__VLS_376, new __VLS_376({
        ...{ 'onClick': {} },
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }));
    const __VLS_378 = __VLS_377({
        ...{ 'onClick': {} },
        shadow: "never",
        ...{ class: "cursor w-full quick-create-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_377));
    let __VLS_381;
    const __VLS_382 = {
        /** @type {typeof __VLS_381.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.permissionPrecise.model.workspace.create()))
                throw 0;
            return __VLS_ctx.openCreateModel(__VLS_ctx.allObj);
            // @ts-ignore
            [permissionPrecise, openCreateModel, allObj,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['quick-create-card']} */ ;
    const { default: __VLS_383 } = __VLS_379.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/home/icon_create-model.svg",
        alt: "",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ style: {} },
    });
    (__VLS_ctx.$t('home.createModel'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-secondary font-small lighter mt-4" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    (__VLS_ctx.$t('home.createModelDescribe'));
    // @ts-ignore
    [$t, $t,];
    var __VLS_379;
    var __VLS_380;
    // @ts-ignore
    [];
    var __VLS_373;
}
// @ts-ignore
[];
var __VLS_3;
const __VLS_384 = CreateApplicationDialog;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent1(__VLS_384, new __VLS_384({
    ref: "CreateApplicationDialogRef",
}));
const __VLS_386 = __VLS_385({
    ref: "CreateApplicationDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_385));
var __VLS_389;
var __VLS_387;
const __VLS_391 = (__VLS_ctx.currentCreateDialog);
// @ts-ignore
const __VLS_392 = __VLS_asFunctionalComponent1(__VLS_391, new __VLS_391({
    ref: "CreateKnowledgeDialogRef",
}));
const __VLS_393 = __VLS_392({
    ref: "CreateKnowledgeDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_392));
var __VLS_396;
var __VLS_394;
const __VLS_398 = ToolFormDrawer;
// @ts-ignore
const __VLS_399 = __VLS_asFunctionalComponent1(__VLS_398, new __VLS_398({
    ...{ 'onRefresh': {} },
    ref: "ToolFormDrawerRef",
    title: (__VLS_ctx.ToolDrawertitle),
}));
const __VLS_400 = __VLS_399({
    ...{ 'onRefresh': {} },
    ref: "ToolFormDrawerRef",
    title: (__VLS_ctx.ToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_399));
let __VLS_403;
const __VLS_404 = {
    /** @type {typeof __VLS_403.refresh} */
    onRefresh: (__VLS_ctx.toolRefresh),
};
var __VLS_405;
var __VLS_401;
var __VLS_402;
const __VLS_407 = WorkflowFormDialog || WorkflowFormDialog;
// @ts-ignore
const __VLS_408 = __VLS_asFunctionalComponent1(__VLS_407, new __VLS_407({
    ref: "workflowFormDialogRef",
    title: (__VLS_ctx.workflowFormDialogTitle),
}));
const __VLS_409 = __VLS_408({
    ref: "workflowFormDialogRef",
    title: (__VLS_ctx.workflowFormDialogTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_408));
var __VLS_412;
var __VLS_410;
const __VLS_414 = SkillToolFormDrawer;
// @ts-ignore
const __VLS_415 = __VLS_asFunctionalComponent1(__VLS_414, new __VLS_414({
    ...{ 'onRefresh': {} },
    ref: "SkillToolFormDrawerRef",
    title: (__VLS_ctx.SkillToolDrawertitle),
}));
const __VLS_416 = __VLS_415({
    ...{ 'onRefresh': {} },
    ref: "SkillToolFormDrawerRef",
    title: (__VLS_ctx.SkillToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_415));
let __VLS_419;
const __VLS_420 = {
    /** @type {typeof __VLS_419.refresh} */
    onRefresh: (__VLS_ctx.toolRefresh),
};
var __VLS_421;
var __VLS_417;
var __VLS_418;
const __VLS_423 = McpToolFormDrawer;
// @ts-ignore
const __VLS_424 = __VLS_asFunctionalComponent1(__VLS_423, new __VLS_423({
    ...{ 'onRefresh': {} },
    ref: "McpToolFormDrawerRef",
    title: (__VLS_ctx.McpToolDrawertitle),
}));
const __VLS_425 = __VLS_424({
    ...{ 'onRefresh': {} },
    ref: "McpToolFormDrawerRef",
    title: (__VLS_ctx.McpToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_424));
let __VLS_428;
const __VLS_429 = {
    /** @type {typeof __VLS_428.refresh} */
    onRefresh: (__VLS_ctx.toolRefresh),
};
var __VLS_430;
var __VLS_426;
var __VLS_427;
const __VLS_432 = DataSourceToolFormDrawer;
// @ts-ignore
const __VLS_433 = __VLS_asFunctionalComponent1(__VLS_432, new __VLS_432({
    ...{ 'onRefresh': {} },
    ref: "DataSourceToolFormDrawerRef",
    title: (__VLS_ctx.DataSourceToolDrawertitle),
}));
const __VLS_434 = __VLS_433({
    ...{ 'onRefresh': {} },
    ref: "DataSourceToolFormDrawerRef",
    title: (__VLS_ctx.DataSourceToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_433));
let __VLS_437;
const __VLS_438 = {
    /** @type {typeof __VLS_437.refresh} */
    onRefresh: (__VLS_ctx.toolRefresh),
};
var __VLS_439;
var __VLS_435;
var __VLS_436;
const __VLS_441 = CreateModelDialog || CreateModelDialog;
// @ts-ignore
const __VLS_442 = __VLS_asFunctionalComponent1(__VLS_441, new __VLS_441({
    ...{ 'onSubmit': {} },
    ...{ 'onChange': {} },
    ref: "createModelRef",
}));
const __VLS_443 = __VLS_442({
    ...{ 'onSubmit': {} },
    ...{ 'onChange': {} },
    ref: "createModelRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_442));
let __VLS_446;
const __VLS_447 = {
    /** @type {typeof __VLS_446.submit} */
    onSubmit: (__VLS_ctx.modelRefresh),
};
const __VLS_448 = {
    /** @type {typeof __VLS_446.change} */
    onChange: (...[$event]) => {
        return __VLS_ctx.openCreateModel($event);
        // @ts-ignore
        [openCreateModel, currentCreateDialog, ToolDrawertitle, toolRefresh, toolRefresh, toolRefresh, toolRefresh, workflowFormDialogTitle, SkillToolDrawertitle, McpToolDrawertitle, DataSourceToolDrawertitle, modelRefresh,];
    },
};
var __VLS_449;
var __VLS_444;
var __VLS_445;
const __VLS_451 = SelectProviderDialog || SelectProviderDialog;
// @ts-ignore
const __VLS_452 = __VLS_asFunctionalComponent1(__VLS_451, new __VLS_451({
    ...{ 'onChange': {} },
    ref: "selectProviderRef",
}));
const __VLS_453 = __VLS_452({
    ...{ 'onChange': {} },
    ref: "selectProviderRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_452));
let __VLS_456;
const __VLS_457 = {
    /** @type {typeof __VLS_456.change} */
    onChange: ((provider, modelType) => __VLS_ctx.openCreateModel(provider, modelType)),
};
var __VLS_458;
var __VLS_454;
var __VLS_455;
// @ts-ignore
var __VLS_90 = __VLS_89, __VLS_228 = __VLS_227, __VLS_356 = __VLS_355, __VLS_390 = __VLS_389, __VLS_397 = __VLS_396, __VLS_406 = __VLS_405, __VLS_413 = __VLS_412, __VLS_422 = __VLS_421, __VLS_431 = __VLS_430, __VLS_440 = __VLS_439, __VLS_450 = __VLS_449, __VLS_459 = __VLS_458;
// @ts-ignore
[openCreateModel,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        tokenUsage: {
            type: Array,
            default: () => [],
        },
        topQuestions: {
            type: Array,
            default: () => [],
        },
    },
});
export default {};
