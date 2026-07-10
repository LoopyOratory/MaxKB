import { get, put } from '@/request/index';
const prefix = '/system/resource/application';
/**
 * workflowHistoryVersion
 */
const getWorkFlowVersion = (application_id, loading) => {
    return get(`${prefix}/${application_id}/application_version`, undefined, loading);
};
/**
 * workflowHistoryVersionDetails
 */
const getWorkFlowVersionDetail = (application_id, application_version_id, loading) => {
    return get(`${prefix}/${application_id}/application_version/${application_version_id}`, undefined, loading);
};
/**
 * ModificationworkflowHistoryVersion
 */
const putWorkFlowVersion = (application_id, application_version_id, data, loading) => {
    return put(`${prefix}/${application_id}/application_version/${application_version_id}`, data, undefined, loading);
};
export default {
    getWorkFlowVersion,
    getWorkFlowVersionDetail,
    putWorkFlowVersion,
};
