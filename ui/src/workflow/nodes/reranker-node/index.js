import RerankerNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class RerankerNode extends AppNode {
    constructor(props) {
        super(props, RerankerNodeVue);
    }
}
export default {
    type: 'reranker-node',
    model: AppNodeModel,
    view: RerankerNode
};
