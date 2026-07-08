import { BaseEdgeModel, BaseNodeModel, GraphModel } from '@logicflow/core'
import { defineComponent, h, reactive, isVue3, Teleport, markRaw, Fragment } from 'vue-demi'

let active = false
const items = reactive<{ [key: string]: any }>({})

export function connect(
  id: string,
  component: any,
  container: HTMLDivElement,
  node: BaseNodeModel | BaseEdgeModel,
  graph: GraphModel,
  get_props?: any,
  get_provide?: any,
) {
  if (!get_props) {
    get_props = (node: BaseNodeModel | BaseEdgeModel, graph: GraphModel) => {
      return { nodeModel: node, graph }
    }
  }
  if (!get_provide) {
    get_provide = (node: BaseNodeModel | BaseEdgeModel, graph: GraphModel) => ({
      getNode: () => node,
      getGraph: () => graph,
    })
  }
  if (active) {
    items[id] = markRaw(
      defineComponent({
        render: () => h(Teleport, { to: container } as any, [h(component, get_props(node, graph))]),
        provide: () => get_provide(node, graph),
      }),
    )
  }
}

export function disconnect(id: string) {
  if (active) {
    delete items[id]
  }
}
export function disconnectByFlow(flowId: string) {
  Object.keys(items).forEach((key) => {
    if (key.startsWith(flowId)) {
      delete items[key]
    }
  })
}
export function disconnectAll() {
  Object.keys(items).forEach((key) => {
    delete items[key]
  })
}

export function isActive() {
  return active
}

export function getTeleport(): any {
  if (!isVue3) {
    throw new Error('teleport is only available in Vue3')
  }
  active = true

  return defineComponent({
    props: {
      flowId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      return () => {
        const children: Record<string, any>[] = []
        Object.keys(items).forEach((id) => {
          // https://github.com/didi/LogicFlow/issues/1768
          // Multiple different VueNodeViews connect and register into items, so items may store data from multiple flowId diagrams
          // When using multiple LogicFlows, multiple flowIds are created + KeepAlive is used simultaneously
          // Each items change triggers setup() for different flowIds; since each setup() iteration traverses items, elements get rendered multiple times
          // i.e., items[0] executes in both Page1 and Page2 setup(), producing two instances of items[0]

          // Compare with the current display flowId; only update items[current_page_flowId:nodeId] data
          // For example, if items[0] belongs to Page1, Page2 cannot execute items[0] regardless of active=true/false

          children.push(items[id])
        })
        return h(
          Fragment,
          {},
          children.map((item) => h(item)),
        )
      }
    },
  })
}
