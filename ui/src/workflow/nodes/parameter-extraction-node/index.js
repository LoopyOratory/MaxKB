import ParameterExtractionNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class ParameterExtractionNode extends AppNode {
    constructor(props) {
        super(props, ParameterExtractionNodeVue);
    }
    getConfig(props) {
        return props.model.properties.config;
    }
}
export default {
    type: 'parameter-extraction-node',
    model: AppNodeModel,
    view: ParameterExtractionNode,
};
