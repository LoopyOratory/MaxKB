import FormNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class FormNode extends AppNode {
    constructor(props) {
        super(props, FormNodeVue);
    }
    getConfig(props) {
        return props.model.properties.config;
    }
}
export default {
    type: 'form-node',
    model: AppNodeModel,
    view: FormNode,
};
