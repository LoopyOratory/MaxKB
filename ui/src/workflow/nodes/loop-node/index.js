import LoopNode from './index.vue';
import { AppNode, AppNodeModel } from '@/workflow/common/app-node';
import { WorkflowType } from '@/enums/application';
class LoopNodeView extends AppNode {
    constructor(props) {
        const config = props.model.properties.config;
        super(props, LoopNode);
        props.model.properties.config = config;
    }
}
class LoopModel extends AppNodeModel {
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
        if (this.type !== WorkflowType.Base) {
            if (this.type !== WorkflowType.Start) {
                anchors.push({
                    x: x - width / 2 + 10,
                    y: showNode ? y : y - 15,
                    id: `${id}_left`,
                    edgeAddable: false,
                    type: 'left',
                });
            }
            anchors.push({
                x: x + width / 2 - 10,
                y: showNode ? y : y - 15,
                id: `${id}_right`,
                type: 'right',
            });
        }
        anchors.push({
            x: x,
            y: y + height / 2 - 25,
            id: `${id}_children`,
            type: 'children',
        });
        return anchors;
    }
}
export default {
    type: 'loop-node',
    model: LoopModel,
    view: LoopNodeView,
};
