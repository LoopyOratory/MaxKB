import { get, put } from '@/request/index';
const prefix = 'system/workspace';
/**
 * SystemResourceAuthorizationGetResourcePermission
 * @query Parameters
 */
const getResourceAuthorization = (workspace_id, target, resource, page, params, loading) => {
    return get(`${prefix}/${workspace_id}/resource_management/resource/${target}/resource/${resource}/${page.current_page}/${page.page_size}`, params, loading);
};
/**
 * SystemResourceAuthorizationModificationMemberPermission
 * @param Parameters member_id
 * @param Parameters {
     [
      {
        "target_id": "string",
        "permission": "NOT_AUTH"
      }
    ]
        }
 */
const putResourceAuthorization = (workspace_id, target, resource, body, loading) => {
    return put(`${prefix}/${workspace_id}/resource_management/resource/${target}/resource/${resource}`, body, {}, loading);
};
export default {
    getResourceAuthorization,
    putResourceAuthorization,
};
