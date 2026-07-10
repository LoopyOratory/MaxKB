import { get } from '@/request/index';
const prefix = '/system/shared';
const getResourceMapping = (workspace_id, resource, resource_id, page, params, loading) => {
    return get(`${prefix}/resource_mapping/${resource}/${resource_id}/${page.current_page}/${page.page_size}`, params, loading);
};
const getMappingResource = (workspace_id, resource, resource_id, page, params, loading) => {
    return get(`${prefix}/mapping_resource/${resource}/${resource_id}/${page.current_page}/${page.page_size}`, params, loading);
};
export default {
    getResourceMapping,
    getMappingResource,
};
