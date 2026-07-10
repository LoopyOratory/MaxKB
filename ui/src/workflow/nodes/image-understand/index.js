import ImageUnderstandNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class RerankerNode extends AppNode {
    constructor(props) {
        super(props, ImageUnderstandNodeVue);
    }
}
export default {
    type: 'image-understand-node',
    model: AppNodeModel,
    view: RerankerNode
};
