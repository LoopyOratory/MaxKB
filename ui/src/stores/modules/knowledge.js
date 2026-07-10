import { defineStore } from 'pinia';
const useKnowledgeStore = defineStore('knowledge', {
    state: () => ({
        baseInfo: null,
        webInfo: null,
        documentsType: '',
        documentsFiles: [],
        knowledgeList: [],
    }),
    actions: {
        saveBaseInfo(info) {
            this.baseInfo = info;
        },
        saveWebInfo(info) {
            this.webInfo = info;
        },
        saveDocumentsType(val) {
            this.documentsType = val;
        },
        saveDocumentsFile(file) {
            this.documentsFiles = file;
        },
        setKnowledgeList(list) {
            this.knowledgeList = list;
        },
    },
});
export default useKnowledgeStore;
