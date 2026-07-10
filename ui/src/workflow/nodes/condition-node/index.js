import ConditioNodeVue from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class ConditioNode extends AppNode {
    constructor(props) {
        super(props, ConditioNodeVue);
    }
}
const get_up_index_height = (condition_list, index) => {
    return condition_list
        .filter((item, i) => i < index)
        .map((item) => item.height + 8)
        .reduce((x, y) => x + y, 0);
};
class ConditionModel extends AppNodeModel {
    refreshBranch() {
        // Update the path of connected edges for the node
        this.incoming.edges.forEach((edge) => {
            // Call custom update scheme
            edge.updatePathByAnchor();
        });
        this.outgoing.edges.forEach((edge) => {
            edge.updatePathByAnchor();
        });
    }
    getDefaultAnchor() {
        const { id, x, y, width, height, properties: { branch_condition_list } } = this;
        if (this.height === undefined) {
            this.height = 200;
        }
        const showNode = this.properties.showNode === undefined ? true : this.properties.showNode;
        const anchors = [];
        anchors.push({
            x: x - width / 2 + 10,
            y: showNode ? y : y - 15,
            id: `${id}_left`,
            edgeAddable: false,
            type: 'left'
        });
        if (branch_condition_list) {
            for (let index = 0; index < branch_condition_list.length; index++) {
                const element = branch_condition_list[index];
                const h = get_up_index_height(branch_condition_list, index);
                anchors.push({
                    x: x + width / 2 - 10,
                    y: showNode ? y - height / 2 + 75 + h + element.height / 2 : y - 15,
                    id: `${id}_${element.id}_right`,
                    type: 'right'
                });
            }
        }
        return anchors;
    }
}
export default {
    type: 'condition-node',
    model: ConditionModel,
    view: ConditioNode
};
