/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SetRules from './upload/SetRules.vue';
import ResultSuccess from './upload/ResultSuccess.vue';
import UploadComponent from './upload/UploadComponent.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { MsgConfirm, MsgError, MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import useStore from '@/stores';
const { knowledge } = useStore();
const documentsFiles = computed(() => knowledge.documentsFiles);
const documentsType = computed(() => knowledge.documentsType);
const router = useRouter();
const route = useRoute();
const { params: { folderId, type }, query: { id },
/*
id is knowledgeID, hasid isUploadDocument; typeisKnowledgeDatabaseTypeType
folderId Can distinguish resource-management sharedOr workspace
*/
 } = route;
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
const SetRulesRef = ref();
const UploadComponentRef = ref();
const loading = ref(false);
const disabled = ref(false);
const active = ref(0);
const successInfo = ref(null);
const uploadComponentUploading = computed(() => UploadComponentRef.value?.uploadingCount > 0);
async function next() {
    if (uploadComponentUploading.value)
        return;
    if (!documentsFiles.value?.length) {
        MsgError(t('views.document.upload.noSuccessFileMessage'));
        return;
    }
    disabled.value = true;
    if (await UploadComponentRef.value.validate()) {
        if (documentsType.value === 'QA') {
            const fd = new FormData();
            documentsFiles.value.forEach((item) => {
                if (item?.raw) {
                    fd.append('file', item?.raw);
                }
            });
            if (id) {
                // QADocumentUpload
                loadSharedApi({ type: 'document', systemType: apiType.value })
                    .postQADocument(id, fd, loading)
                    .then(() => {
                    MsgSuccess(t('common.submitSuccess'));
                    clearStore();
                    router.push({
                        path: `/knowledge/${id}/${folderId}/${type}/document`,
                    });
                });
            }
        }
        else if (documentsType.value === 'table') {
            const fd = new FormData();
            documentsFiles.value.forEach((item) => {
                if (item?.raw) {
                    fd.append('file', item?.raw);
                }
            });
            if (id) {
                // tableDocumentUpload
                loadSharedApi({ type: 'document', systemType: apiType.value })
                    .postTableDocument(id, fd, loading)
                    .then(() => {
                    MsgSuccess(t('common.submitSuccess'));
                    clearStore();
                    router.push({
                        path: `/knowledge/${id}/${folderId}/${type}/document`,
                    });
                });
            }
        }
        else {
            if (active.value++ > 2)
                active.value = 0;
        }
    }
    else {
        disabled.value = false;
    }
}
const prev = () => {
    active.value = 0;
};
function clearStore() {
    knowledge.saveDocumentsFile([]);
    knowledge.saveDocumentsType('');
}
function submit() {
    loading.value = true;
    const documents = [];
    SetRulesRef.value?.paragraphList.map((item) => {
        if (!SetRulesRef.value?.checkedConnect) {
            item.content.map((v) => {
                delete v['problem_list'];
            });
        }
        documents.push({
            name: item.name,
            paragraphs: item.content,
            source_file_id: item.source_file_id,
        });
    });
    if (id) {
        // UploadDocument
        loadSharedApi({ type: 'document', systemType: apiType.value })
            .putMulDocument(id, documents)
            .then(() => {
            MsgSuccess(t('common.submitSuccess'));
            clearStore();
            router.push({
                path: `/knowledge/${id}/${folderId}/${type}/document`,
            });
        })
            .catch(() => {
            loading.value = false;
        });
    }
}
function back() {
    if (documentsFiles.value?.length > 0) {
        MsgConfirm(t('common.tip'), t('views.document.tip.saveMessage'), {
            confirmButtonText: t('common.confirm'),
        })
            .then(() => {
            router.go(-1);
            clearStore();
        })
            .catch(() => { });
    }
    else {
        router.go(-1);
    }
}
onUnmounted(() => {
    clearStore();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document p-12-24" },
});
/** @type {__VLS_StyleScopedClasses['upload-document']} */ ;
/** @type {__VLS_StyleScopedClasses['p-12-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button'] | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button']} */
backButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.back),
};
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ style: {} },
});
(__VLS_ctx.$t('views.document.uploadDocument'));
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__main flex" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['upload-document__main']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-document__component main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['upload-document__component']} */ ;
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
if (__VLS_ctx.active === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "upload-component p-24" },
    });
    /** @type {__VLS_StyleScopedClasses['upload-component']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-24']} */ ;
    const __VLS_19 = UploadComponent;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ref: "UploadComponentRef",
    }));
    const __VLS_21 = __VLS_20({
        ref: "UploadComponentRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    var __VLS_24;
    var __VLS_22;
}
else if (__VLS_ctx.active === 1) {
    const __VLS_26 = SetRules;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ref: "SetRulesRef",
    }));
    const __VLS_28 = __VLS_27({
        ref: "SetRulesRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    var __VLS_31;
    var __VLS_29;
}
else if (__VLS_ctx.active === 2) {
    const __VLS_33 = ResultSuccess;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        data: (__VLS_ctx.successInfo),
    }));
    const __VLS_35 = __VLS_34({
        data: (__VLS_ctx.successInfo),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
}
// @ts-ignore
[back, $t, vLoading, loading, active, active, active, successInfo,];
var __VLS_16;
// @ts-ignore
[];
var __VLS_10;
if (__VLS_ctx.active !== 2) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "upload-document__footer text-right border-t" },
    });
    /** @type {__VLS_StyleScopedClasses['upload-document__footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading),
    }));
    const __VLS_40 = __VLS_39({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    const __VLS_44 = {
        /** @type {typeof __VLS_43.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.active !== 2))
                throw 0;
            return __VLS_ctx.router.go(-1);
            // @ts-ignore
            [loading, active, SetRulesRef, router,];
        },
    };
    const { default: __VLS_45 } = __VLS_41.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_41;
    var __VLS_42;
    if (__VLS_ctx.active === 1) {
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading),
        }));
        const __VLS_48 = __VLS_47({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        let __VLS_51;
        const __VLS_52 = {
            /** @type {typeof __VLS_51.click} */
            onClick: (__VLS_ctx.prev),
        };
        const { default: __VLS_53 } = __VLS_49.slots;
        (__VLS_ctx.$t('common.steps.prev'));
        // @ts-ignore
        [$t, loading, active, SetRulesRef, prev,];
        var __VLS_49;
        var __VLS_50;
    }
    if (__VLS_ctx.active === 0) {
        let __VLS_54;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading || __VLS_ctx.uploadComponentUploading),
        }));
        const __VLS_56 = __VLS_55({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading || __VLS_ctx.uploadComponentUploading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_55));
        let __VLS_59;
        const __VLS_60 = {
            /** @type {typeof __VLS_59.click} */
            onClick: (__VLS_ctx.next),
        };
        const { default: __VLS_61 } = __VLS_57.slots;
        (__VLS_ctx.documentsType === 'txt' ? __VLS_ctx.$t('common.steps.next') : __VLS_ctx.$t('views.document.buttons.import'));
        // @ts-ignore
        [$t, $t, loading, active, SetRulesRef, uploadComponentUploading, next, documentsType,];
        var __VLS_57;
        var __VLS_58;
    }
    if (__VLS_ctx.active === 1) {
        let __VLS_62;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading),
        }));
        const __VLS_64 = __VLS_63({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (__VLS_ctx.SetRulesRef?.loading || __VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        let __VLS_67;
        const __VLS_68 = {
            /** @type {typeof __VLS_67.click} */
            onClick: (__VLS_ctx.submit),
        };
        const { default: __VLS_69 } = __VLS_65.slots;
        (__VLS_ctx.$t('views.document.buttons.import'));
        // @ts-ignore
        [$t, loading, active, SetRulesRef, submit,];
        var __VLS_65;
        var __VLS_66;
    }
}
// @ts-ignore
var __VLS_25 = __VLS_24, __VLS_32 = __VLS_31;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
