import { defineStore } from 'pinia';
import { DeviceType } from '@/enums/common';
import userApi from '@/api/system/user-manage';
const useCommonStore = defineStore('common', {
    state: () => ({
        breadcrumb: null,
        // Search and pagination cache
        paginationConfig: {},
        search: {},
        device: DeviceType.Desktop
    }),
    actions: {
        saveBreadcrumb(data) {
            this.breadcrumb = data;
        },
        savePage(val, data) {
            this.paginationConfig[val] = data;
        },
        saveCondition(val, data) {
            this.search[val] = data;
        },
        toggleDevice(value) {
            this.device = value;
        },
        isMobile() {
            return this.device === DeviceType.Mobile;
        },
        async asyncGetValid(valid_type, valid_count, loading) {
            return new Promise((resolve, reject) => {
                userApi
                    .getValid(valid_type, valid_count, loading)
                    .then((data) => {
                    resolve(data);
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        }
    }
});
export default useCommonStore;
