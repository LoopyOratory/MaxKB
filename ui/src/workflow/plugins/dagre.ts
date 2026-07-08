import { DagreLayout, type DagreLayoutOptions } from '@antv/layout'

export default class Dagre {
  static pluginName = 'dagre'
  lf: any
  option: DagreLayoutOptions | any
  render(lf: any) {
    this.lf = lf
  }

  /**
   * option: {
   *   rankdir: "TB", // layout direction, options: TB, BT, LR, RL
   *   align: undefined, // node alignment, options: UL, UR, DL, DR
   *   nodeSize: undefined, // node size
   *   nodesepFunc: undefined, // horizontal node spacing (px)
   *   ranksepFunc: undefined, // spacing between each layer of nodes
   *   nodesep: 40, // horizontal node spacing (px) - Note: if using grid, nodesep must be a multiple of grid
   *   ranksep: 40, // spacing between each layer - Note: if using grid, ranksep must be a multiple of grid
   *   controlPoints: false, // whether to preserve control points of layout edges
   *   radial: false, // whether to use radial layout based on dagre
   *   focusNode: null, // effective when radial is true, the focused node
   * };
   */
  layout(option = {}) {
    const { nodes, edges, gridSize } = this.lf.graphModel
    // To ensure generated nodes align to gridSize, some processing is needed.
    let nodesep = 40
    let ranksep = 40
    if (gridSize > 20) {
      nodesep = gridSize * 2
      ranksep = gridSize * 2
    }
    this.option = {
      type: 'dagre',
      rankdir: 'LR',
      // align: 'UL',
      // align: 'UR',
      align: 'DR',
      nodesep,
      ranksep,
      begin: [120, 120],
      ...option,
    }
    const layoutInstance = new DagreLayout(this.option)
    const layoutData = layoutInstance.layout({
      nodes: nodes.map((node: any) => ({
        id: node.id,
        size: {
          width: node.width,
          height: node.height,
        },
        model: node,
      })),
      edges: edges.map((edge: any) => ({
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        model: edge,
      })),
    })

    layoutData.nodes?.forEach((node: any) => {
      // @ts-ignore: pass node data
      const { model } = node
      model.set_position({ x: node.x, y: node.y })
    })
    this.lf.fitView()
  }
}
