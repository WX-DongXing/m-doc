import { omit } from 'lodash'
import { createStore } from 'vuex'
import MutationTypes from '@/store/mutation-types'
import { Layout } from '@antv/layout'
import { formatEdges } from '@/utils'
import { nextTick } from 'vue'

export default createStore({
  state: {
    source: [],
    pageIndex: 0,
    recordIndex: 0,
    graph: null
  },
  mutations: {
    // 添加一页
    [MutationTypes.ADD_PAGE] (state, payload) {
      state.source.push(payload.page)
    },
    // 移除一页
    [MutationTypes.REMOVE_PAGE] (state, payload) {
      const pageIndex = state.source.findIndex(page => page.id === payload.id)
      if (~pageIndex) {
        state.source.splice(pageIndex, 1)
      }
    },
    // 设置激活页
    [MutationTypes.SET_ACTIVE_PAGE] (state, payload) {
      if (!payload) {
        state.pageIndex = 0
        return
      }
      const { index, id } = payload
      if (index && index >= 0) {
        state.pageIndex = index
      }
      if (id) {
        const pageIndex = state.source.findIndex(page => page.id === id)
        if (~pageIndex) {
          state.pageIndex = pageIndex
        }
      }
    },
    // 更新页信息
    [MutationTypes.UPDATE_PAGE] (state, payload) {
      const { index, id, page } = payload
      if (index && index >= 0) {
        state.source.splice(index, 1, page)
      }
      if (id) {
        const target = state.source.find(item => item.id === id)
        Object.assign(target, omit(page, 'id'))
      }
    },
    // 设置页索引
    [MutationTypes.SET_PAGE_INDEX] (state, payload) {
      state.pageIndex = payload.index
    },
    // 添加一条记录
    [MutationTypes.ADD_RECORD] (state, payload) {
      const activePage = state.source[state.pageIndex]
      if (!activePage) return
      state.source[state.pageIndex].children.push(payload.record)
    },
    // 移除一条记录
    [MutationTypes.REMOVE_RECORD] (state, payload) {
      if (!state.source[state.pageIndex]) return
      const recordIndex = state.source[state.pageIndex].children.findIndex(record => record.id === payload.id)
      if (~recordIndex) {
        state.source[state.pageIndex].children.splice(recordIndex, 1)
      }
    },
    // 设置激活记录
    [MutationTypes.SET_ACTIVE_RECORD] (state, payload) {
      if (!state.source[state.pageIndex]) return
      const { index, id } = payload
      if (index >= 0) {
        state.recordIndex = index
      }
      if (id) {
        const recordIndex = state.source[state.pageIndex].children.findIndex(record => record.id === id)
        if (~recordIndex) {
          state.pageIndex = recordIndex
        }
      }
    },
    // 更新记录
    [MutationTypes.UPDATE_RECORD] (state, payload) {
      if (!state.source[state.pageIndex]) return
      const { index, id, record } = payload
      if (index >= 0) {
        state.source[state.pageIndex].children.splice(index, 1, record)
      }
      if (id) {
        const target = state.source[state.pageIndex].children.find(item => item.id === id)
        Object.assign(target, omit(record, 'id'))
      }
    },
    // 设置记录索引
    [MutationTypes.SET_RECORD_INDEX] (state, payload) {
      state.recordIndex = payload.index
    },
    // 更新绘制对象
    [MutationTypes.UPDATE_GRAPH] (state, payload) {
      const updateGraphData = () => {
        const activePage = state.source[state.pageIndex]
        if (!activePage) return
        const activeRecord = activePage.children[state.recordIndex]
        if (activeRecord && state.graph) {
          const { nodes } = activeRecord
          const dagreLayout = new Layout({ type: 'dagre' })
          const edges = formatEdges(nodes)
          const layoutModel = dagreLayout.layout({ nodes, edges })
          state.graph.fromJSON(layoutModel)
          nextTick(() => state.graph.centerContent())
        }
      }
      if (payload && payload.graph) {
        state.graph = payload.graph
        updateGraphData()
      } else {
        updateGraphData()
      }
    }
  },
  getters: {
    activePage: state => state.source[state.pageIndex],
    activeRecord: state => state.source[state.pageIndex]?.children[state.recordIndex]
  },
  actions: {
  },
  modules: {
  }
})
