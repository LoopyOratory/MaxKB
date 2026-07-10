/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set, cloneDeep } from 'lodash';
import AppEdge from '@/workflow/common/edge';
import { ref, onMounted, onUnmounted, inject } from 'vue';
import LogicFlow from '@logicflow/core';
import Dagre from '@/workflow/plugins/dagre';
import { initDefaultShortcut } from '@/workflow/common/shortcut';
import LoopBodyContainer from '@/workflow/nodes/loop-body-node/LoopBodyContainer.vue';
import { WorkflowMode } from '@/enums/application';
import { WorkFlowInstance, KnowledgeWorkFlowInstance } from '@/workflow/common/validate';
import { t } from '@/locales';
import { disconnectByFlow } from '@/workflow/common/teleport';
const loop_workflow_mode = inject('loopWorkflowMode') || WorkflowMode.ApplicationLoop;
const nodes = import.meta.glob('@/workflow/nodes/**/index.ts', { eager: true });
const props = defineProps();
const containerRef = ref();
const LoopBodyContainerRef = ref();
const validate = () => {
    const workflow = loop_workflow_mode == WorkflowMode.ApplicationLoop
        ? new WorkFlowInstance(lf.value.getGraphData(), WorkflowMode.ApplicationLoop)
        : new KnowledgeWorkFlowInstance(lf.value.getGraphData(), WorkflowMode.KnowledgeLoop);
    return Promise.all(lf.value.graphModel.nodes.map((element) => element?.validate?.()))
        .then(() => {
        const loop_node_id = props.nodeModel.properties.loop_node_id;
        const loop_node = props.nodeModel.graphModel.getNodeModelById(loop_node_id);
        try {
            workflow.is_loop_valid();
            if (loop_node.properties.node_data.loop_type == 'LOOP' && !workflow.exist_break_node()) {
                return Promise.reject({
                    node: loop_node,
                    errMessage: t('workflow.validate.loopNodeBreakNodeRequired'),
                });
            }
            return Promise.resolve({});
        }
        catch (e) {
            return Promise.reject({ node: loop_node, errMessage: e });
        }
    })
        .catch((e) => {
        props.nodeModel.graphModel.selectNodeById(props.nodeModel.id);
        props.nodeModel.graphModel.transformModel.focusOn(props.nodeModel.x, props.nodeModel.y, props.nodeModel.width, props.nodeModel.height);
        throw e;
    });
};
const set_loop_body = () => {
    const loop_node_id = props.nodeModel.properties.loop_node_id;
    const loop_node = props.nodeModel.graphModel.getNodeModelById(loop_node_id);
    loop_node.properties.node_data.loop = {
        x: props.nodeModel.x,
        y: props.nodeModel.y,
    };
    loop_node.properties.node_data.loop_body = lf.value.getGraphData();
};
const refresh_loop_fields = (fields) => {
    const loop_node_id = props.nodeModel.properties.loop_node_id;
    const loop_node = props.nodeModel.graphModel.getNodeModelById(loop_node_id);
    if (loop_node) {
        loop_node.properties.config.fields = fields;
        loop_node.clear_next_node_field(true);
    }
};
const lf = ref();
const renderGraphData = (data) => {
    const container = containerRef.value;
    if (container) {
        lf.value = new LogicFlow({
            plugins: [Dagre],
            textEdit: false,
            adjustEdge: false,
            adjustEdgeStartAndEnd: false,
            background: {
                backgroundColor: '#f5f6f7',
            },
            grid: {
                size: 10,
                type: 'dot',
                config: {
                    color: '#DEE0E3',
                    thickness: 1,
                },
            },
            keyboard: {
                enabled: true,
            },
            isSilentMode: false,
            container: container,
        });
        lf.value.setTheme({
            bezier: {
                stroke: '#afafaf',
                strokeWidth: 1,
            },
        });
        function HtmlPointToCanvasPoint(point) {
            let scaleX = lf.value.graphModel.transformModel.SCALE_X;
            let scaleY = lf.value.graphModel.transformModel.SCALE_Y;
            let translateX = lf.value.graphModel.transformModel.TRANSLATE_X;
            let translateY = lf.value.graphModel.transformModel.TRANSLATE_Y;
            const [x, y] = point;
            props.nodeModel.graphModel.transformModel;
            scaleX *= props.nodeModel.graphModel.transformModel.SCALE_X;
            scaleY *= props.nodeModel.graphModel.transformModel.SCALE_Y;
            translateX *= props.nodeModel.graphModel.transformModel.SCALE_X;
            translateY *= props.nodeModel.graphModel.transformModel.SCALE_Y;
            return [(x - translateX) / scaleX, (y - translateY) / scaleY];
        }
        lf.value.graphModel.transformModel.HtmlPointToCanvasPoint = HtmlPointToCanvasPoint.bind(lf.value.graphModel.transformModel);
        initDefaultShortcut(lf.value, lf.value.graphModel);
        lf.value.graphModel.get_provide = (node, graph) => {
            return {
                getNode: () => node,
                getGraph: () => graph,
                workflowMode: loop_workflow_mode,
            };
        };
        lf.value.graphModel.refresh_loop_fields = refresh_loop_fields;
        lf.value.graphModel.get_parent_nodes = () => {
            return props.nodeModel.graphModel.nodes;
        };
        lf.value.graphModel.get_up_node_field_list = props.nodeModel.get_up_node_field_list;
        lf.value.batchRegister([...Object.keys(nodes).map((key) => nodes[key].default), AppEdge]);
        lf.value.setDefaultEdgeType('app-edge');
        lf.value.render(data ? data : {});
        lf.value.graphModel.eventCenter.on('delete_edge', (id_list) => {
            id_list.forEach((id) => {
                lf.value.deleteEdge(id);
            });
        });
        lf.value.graphModel.eventCenter.on('anchor:drop', (data) => {
            // Clear all caches of child nodes under the current node
            data.nodeModel.clear_next_node_field(false);
        });
        lf.value.graphModel.eventCenter.on('anchor:drop', (data) => {
            // Clear all caches of child nodes under the current node
            data.nodeModel.clear_next_node_field(false);
        });
        setTimeout(() => {
            lf.value?.fitView();
        }, 500);
    }
};
const loopLayout = () => {
    LoopBodyContainerRef.value?.zoom();
    lf.value?.extension?.dagre.layout();
};
const selectOn = (node, kw) => {
    lf.value?.graphModel.getNodeModelById(node.id).selectOn(kw);
};
const focusOn = (node, kw) => {
    lf.value?.graphModel.transformModel.focusOn(node.x, node.y, lf.value?.container.clientWidth, lf.value?.container.clientHeight);
    lf.value?.graphModel.getNodeModelById(node.id).focusOn(kw);
};
const getSelectNodes = (kw) => {
    const graph_data = lf.value?.getGraphData();
    return graph_data.nodes.filter((node) => node.properties.stepName.includes(kw));
};
const onSearchSelect = (node, kw) => {
    lf.value?.graphModel.getNodeModelById(node.id).selectOn(kw);
};
const onClearSearchSelect = (node, kw) => {
    lf.value?.graphModel.getNodeModelById(node.id).clearSelectOn(kw);
};
const clearSelectElements = () => {
    lf.value.graphModel.clearSelectElements();
};
onMounted(() => {
    renderGraphData(cloneDeep(props.nodeModel.properties.workflow));
    set(props.nodeModel, 'validate', validate);
    set(props.nodeModel, 'set_loop_body', set_loop_body);
    set(props.nodeModel, 'loopLayout', loopLayout);
    set(props.nodeModel, 'getSelectNodes', getSelectNodes);
    set(props.nodeModel, 'focusOn', (event) => {
        focusOn(event.node, event.kw);
    });
    set(props.nodeModel, 'selectOn', (event) => {
        selectOn(event.node, event.kw);
    });
    set(props.nodeModel, 'clearSelectOn', (event) => {
        onSearchSelect(event.node, event.kw);
    });
    set(props.nodeModel, 'clearSelectElements', clearSelectElements);
    set(props.nodeModel, 'onClearSearchSelect', (event) => {
        onClearSearchSelect(event.node, event.kw);
    });
});
onUnmounted(() => {
    disconnectByFlow(lf.value.graphModel.flowId);
    lf.value = null;
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = LoopBodyContainer || LoopBodyContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    nodeModel: (__VLS_ctx.nodeModel),
    ref: "LoopBodyContainerRef",
}));
const __VLS_2 = __VLS_1({
    nodeModel: (__VLS_ctx.nodeModel),
    ref: "LoopBodyContainerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onWheel: () => { } },
    ref: "containerRef",
    ...{ style: {} },
});
// @ts-ignore
[nodeModel,];
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
