import VariableSplittingNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class VariableSplittingNode extends AppNode {
    constructor(props) {
        super(props, VariableSplittingNodeVue);
    }
    getConfig(props) {
        return props.model.properties.config;
    }
}
export default {
    type: 'variable-splitting-node',
    model: AppNodeModel,
    view: VariableSplittingNode,
};
