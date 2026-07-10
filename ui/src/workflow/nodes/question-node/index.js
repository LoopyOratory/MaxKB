import QuestionNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class QuestionNode extends AppNode {
    constructor(props) {
        super(props, QuestionNodeVue);
    }
}
export default {
    type: 'question-node',
    model: AppNodeModel,
    view: QuestionNode
};
