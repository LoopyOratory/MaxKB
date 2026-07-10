import LoopNode from './index.vue';
import { t } from '@/locales';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
class LoopBodyNodeView extends AppNode {
    constructor(props) {
        super(props, LoopNode);
    }
    getNodeName() {
        return t('workflow.nodes.loopBodyNode.label');
    }
    get_up_node_field_list(contain_self, use_cache) {
        const loop_node_id = this.props.model.properties.loop_node_id;
        const loop_node = this.props.graphModel.getNodeModelById(loop_node_id);
        return loop_node.get_up_node_field_list(contain_self, use_cache);
    }
}
class LoopBodyModel extends AppNodeModel {
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
        const { id, x, y, width, height } = this;
        const showNode = this.properties.showNode === undefined ? true : this.properties.showNode;
        const anchors = [];
        anchors.push({
            edgeAddable: false,
            x: x,
            y: y - height / 2 + 10,
            id: `${id}_children`,
            type: 'children',
        });
        return anchors;
    }
    setHeight(height) {
        this.properties['height'] = height;
        this.outgoing.edges.forEach((edge) => {
            // Call custom update scheme
            edge.updatePathByAnchor();
        });
        this.incoming.edges.forEach((edge) => {
            // Call custom update scheme
            edge.updatePathByAnchor();
        });
    }
}
export default {
    type: 'loop-body-node',
    model: LoopBodyModel,
    view: LoopBodyNodeView,
};
