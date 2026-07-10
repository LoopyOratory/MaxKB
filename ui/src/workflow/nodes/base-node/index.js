import BaseNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class BaseNode extends AppNode {
    constructor(props) {
        super(props, BaseNodeVue);
    }
}
class BaseModel extends AppNodeModel {
    constructor(data, graphModel) {
        super(data, graphModel);
    }
    get_width() {
        return 600;
    }
}
export default {
    type: 'base-node',
    model: BaseModel,
    view: BaseNode,
};
