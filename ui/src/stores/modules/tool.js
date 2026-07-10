import { defineStore } from 'pinia';
const useToolStore = defineStore('tool', {
    state: () => ({
        toolList: [],
        tool_type: '',
    }),
    actions: {
        setToolList(list) {
            this.toolList = list;
        },
        setToolType(type) {
            this.tool_type = type;
        },
    },
});
export default useToolStore;
