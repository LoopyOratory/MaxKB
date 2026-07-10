import { ElMessageBox, ElMessage } from 'element-plus';
import { t } from '@/locales';
export const MsgSuccess = (message) => {
    ElMessage.success({
        message: message,
        type: 'success',
        showClose: true,
        duration: 3000,
    });
};
export const MsgInfo = (message) => {
    ElMessage.info({
        message: message,
        type: 'info',
        showClose: true,
        duration: 3000,
    });
};
export const MsgWarning = (message) => {
    ElMessage.warning({
        message: message,
        type: 'warning',
        showClose: true,
        duration: 3000,
    });
};
export const MsgError = (message) => {
    ElMessage.error({
        message: message,
        type: 'error',
        showClose: true,
        duration: 3000,
    });
};
export const MsgAlert = (title, description, options) => {
    const defaultOptions = {
        confirmButtonText: t('common.confirm'),
        ...options,
    };
    return ElMessageBox.alert(description, title, defaultOptions);
};
/**
 * DeletionKnowledge base
 * @param title
 * @param description
 * @param options
 */
export const MsgConfirm = (title, description, options) => {
    const defaultOptions = {
        showCancelButton: true,
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        ...options,
    };
    return ElMessageBox.confirm(description, title, defaultOptions);
};
