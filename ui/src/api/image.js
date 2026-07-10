import { post } from '@/request/index';
const prefix = '/oss/file';
/**
 * UploadImage
 * @param Parameters  file:file
 */
const postImage = (data) => {
    return post(`${prefix}`, data);
};
export default {
    postImage
};
