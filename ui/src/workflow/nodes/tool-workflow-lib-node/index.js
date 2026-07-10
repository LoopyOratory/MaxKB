import ToolWorkflowLibNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class ToolWorkflowLibNode extends AppNode {
    constructor(props) {
        super(props, ToolWorkflowLibNodeVue);
    }
    getConfig(props) {
        return props.model.properties.config;
    }
}
export default {
    type: 'tool-workflow-lib-node',
    model: AppNodeModel,
    view: ToolWorkflowLibNode,
};
