import { get } from '@/request/index';
const prefix = '/workspace';
/**
 * Resource mapping relationships under each workspace
 * @query Parameters
 */
const getResourceMapping = (workspace_id, resource, resource_id, page, params, loading) => {
    return get(`${prefix}/${workspace_id}/resource_mapping/${resource}/${resource_id}/${page.current_page}/${page.page_size}`, params, loading);
};
/**
 * Dependencies
 * @param workspace_id
 * @param resource
 * @param resource_id
 * @param page
 * @param params
 * @param loading
 * @returns
 */
const getMappingResource = (workspace_id, resource, resource_id, page, params, loading) => {
    return get(`${prefix}/${workspace_id}/mapping_resource/${resource}/${resource_id}/${page.current_page}/${page.page_size}`, params, loading);
};
export default {
    getResourceMapping,
    getMappingResource,
};
