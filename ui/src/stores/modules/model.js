import { defineStore } from 'pinia';
import ProviderApi from '@/api/model/provider';
import ModelApi from '@/api/model/model';
const useModelStore = defineStore('model', {
    state: () => ({}),
    actions: {
        // Only inApplicationDropdownListUse, notSharedResource
        async asyncGetSelectModel(data, loading) {
            return new Promise((resolve, reject) => {
                ModelApi.getSelectModelList(data, loading)
                    .then((res) => {
                    resolve(res);
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
        async asyncGetProvider(loading) {
            return new Promise((resolve, reject) => {
                ProviderApi.getProvider(loading)
                    .then((res) => {
                    resolve(res);
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        },
    },
});
export default useModelStore;
