import { mapMutations, useStore } from 'vuex'
import { cloneDeep } from 'lodash'
import { EDGE_PROPS } from './constants'

export function useMutations (mutations) {
  const $store = useStore()
  if (!Array.isArray(mutations)) {
    console.error('[useMutations]: mapper parameter must be either an Array')
    return
  }
  return Object.values(mapMutations({ ...mutations })).map(fn => fn.bind({ $store }))
}

/**
 * 格式化节点结构计算边对象
 * @param params
 * @returns {[]}
 */
export function formatEdges (params) {
  const nodes = cloneDeep(params)
  const edges = []

  const getNodeTree = (node) => {
    if (node?.fnList?.length) {
      node.children = node.fnList.map(fn => {
        const index = nodes.findIndex(item => item.name === fn.name)
        if (~index) {
          const [target] = nodes.splice(index, 1)
          return target
        }
        return fn
      })

      if (node?.children.length) {
        for (const part of node.children) {
          if (part.id) {
            edges.push({ source: node.id, target: part.id, ...EDGE_PROPS })
          }
          getNodeTree(part)
        }
      }
    }
  }

  while (nodes.length) {
    const [node] = nodes.splice(0, 1)
    getNodeTree(node)
  }
  return edges
}
