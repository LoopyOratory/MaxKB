import { defineStore } from 'pinia';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const useFolderStore = defineStore('folder', {
    state: () => ({
        currentFolder: {},
    }),
    actions: {
        setCurrentFolder(folder) {
            this.currentFolder = folder;
        },
        async asyncGetFolder(source, data, systemType, loading) {
            return new Promise((resolve, reject) => {
                loadSharedApi({
                    type: 'folder',
                    systemType,
                })
                    .getFolder(source, data, loading)
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
export default useFolderStore;
