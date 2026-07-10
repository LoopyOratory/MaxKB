/// <reference types="../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import LogicFlow from '@logicflow/core';
import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue';
import AppEdge from './common/edge';
import loopEdge from './common/loopEdge';
import Control from './common/NodeControl.vue';
import { SelectionSelect } from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css';
import '@logicflow/core/dist/style/index.css';
import { initDefaultShortcut } from '@/workflow/common/shortcut';
import Dagre from '@/workflow/plugins/dagre';
import { disconnectAll, getTeleport } from '@/workflow/common/teleport';
import { WorkflowMode } from '@/enums/application';
import NodeSearch from '@/workflow/common/NodeSearch.vue';
const nodes = import.meta.glob('./nodes/**/index.ts', { eager: true });
const workflow_mode = inject('workflowMode') || WorkflowMode.Application;
const loop_workflow_mode = inject('loopWorkflowMode') || WorkflowMode.ApplicationLoop;
const nodeSearchRef = ref();
defineOptions({ name: 'WorkFlow' });
const TeleportContainer = getTeleport();
const flowId = ref('');
const props = defineProps({
    data: Object || null,
});
const lf = ref();
onMounted(() => {
    renderGraphData();
});
onUnmounted(() => {
    disconnectAll();
});
const render = (data) => {
    lf.value.render(data);
};
const renderGraphData = (data) => {
    const container = document.querySelector('#container');
    if (container) {
        lf.value = new LogicFlow({
            plugins: [Dagre, SelectionSelect],
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
        lf.value.on('graph:rendered', () => {
            flowId.value = lf.value.graphModel.flowId;
        });
        lf.value.on('node:delete', () => {
            nodeSearchRef.value?.reSearch();
        });
        initDefaultShortcut(lf.value, lf.value.graphModel);
        lf.value.batchRegister([
            ...Object.keys(nodes).map((key) => nodes[key].default),
            AppEdge,
            loopEdge,
        ]);
        lf.value.setDefaultEdgeType('app-edge');
        lf.value.render(data ? data : {});
        lf.value.graphModel.get_provide = (node, graph) => {
            return {
                getNode: () => node,
                getGraph: () => graph,
                workflowMode: workflow_mode,
                loopWorkflowMode: loop_workflow_mode,
            };
        };
        lf.value.graphModel.eventCenter.on('delete_edge', (id_list) => {
            id_list.forEach((id) => {
                lf.value.deleteEdge(id);
            });
        });
        lf.value.graphModel.eventCenter.on('anchor:drop', (data) => {
            // Clear all caches of child nodes under the current node
            data.nodeModel.clear_next_node_field(false);
        });
        setTimeout(() => {
            if (lf.value.graphModel?.nodes.length > 1) {
                lf.value?.fitView();
            }
            else {
                lf.value?.translateCenter();
            }
        }, 500);
    }
};
const validate = () => {
    return Promise.all(lf.value.graphModel.nodes.map((element) => element?.validate?.()));
};
const getGraphData = () => {
    const graph_data = lf.value.getGraphData();
    graph_data.nodes.forEach((node) => {
        if (node.type === 'loop-body-node') {
            const node_model = lf.value.getNodeModelById(node.id);
            node_model.set_loop_body();
        }
    });
    const _graph_data = lf.value.getGraphData();
    _graph_data.nodes = _graph_data.nodes.filter((node) => node.type !== 'loop-body-node');
    _graph_data.edges = graph_data.edges.filter((node) => node.type !== 'loop-edge');
    return _graph_data;
};
const onmousedown = (shapeItem) => {
    if (shapeItem.type) {
        lf.value.dnd.startDrag({
            type: shapeItem.type,
            properties: { ...shapeItem.properties },
        });
    }
    if (shapeItem.callback) {
        shapeItem.callback(lf.value);
    }
};
const addNode = (shapeItem) => {
    lf.value.clearSelectElements();
    const { virtualRectCenterPositionX, virtualRectCenterPositionY } = lf.value.graphModel.getVirtualRectSize();
    const newNode = lf.value.graphModel.addNode({
        type: shapeItem.type,
        properties: shapeItem.properties,
        x: virtualRectCenterPositionX,
        y: virtualRectCenterPositionY - lf.value.graphModel.height / 2,
    });
    newNode.isSelected = true;
    newNode.isHovered = true;
    lf.value.toFront(newNode.id);
};
const clearGraphData = () => {
    return lf.value.clearData();
};
const fitView = () => {
    nextTick(() => {
        lf.value?.fitView();
    });
};
const __VLS_exposed = {
    onmousedown,
    validate,
    getGraphData,
    addNode,
    clearGraphData,
    renderGraphData,
    render,
    fitView,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    className: "workflow-app",
    id: "container",
});
if (__VLS_ctx.lf) {
    const __VLS_0 = Control || Control;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "workflow-control" },
        lf: (__VLS_ctx.lf),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "workflow-control" },
        lf: (__VLS_ctx.lf),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['workflow-control']} */ ;
}
let __VLS_5;
/** @ts-ignore @type { | typeof __VLS_components.TeleportContainer} */
TeleportContainer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    flowId: (__VLS_ctx.flowId),
}));
const __VLS_7 = __VLS_6({
    flowId: (__VLS_ctx.flowId),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_10 = NodeSearch || NodeSearch;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    lf: (__VLS_ctx.lf),
    ref: "nodeSearchRef",
}));
const __VLS_12 = __VLS_11({
    lf: (__VLS_ctx.lf),
    ref: "nodeSearchRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
var __VLS_15;
var __VLS_13;
// @ts-ignore
var __VLS_16 = __VLS_15;
// @ts-ignore
[lf, lf, lf, flowId,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    props: {
        data: Object || null,
    },
});
export default {};
