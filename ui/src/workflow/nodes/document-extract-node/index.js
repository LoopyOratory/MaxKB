import DocumentExtractNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class RerankerNode extends AppNode {
    constructor(props) {
        super(props, DocumentExtractNodeVue);
    }
}
export default {
    type: 'document-extract-node',
    model: AppNodeModel,
    view: RerankerNode
};
