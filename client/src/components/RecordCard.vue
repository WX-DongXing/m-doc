<template>
  <div class="record-card">
    <div class="record-card__content">
      <div class="record-card__board" ref="board"></div>
      <div class="record-card__map" ref="map"></div>
    </div>
    <div class="record-card__actions">
      <i class="el-icon-delete" @click="handleRemove"></i>
      <i class="el-icon-files" @click="handleSave"></i>
      <i class="el-icon-toilet-paper" @click="handleClear"></i>
    </div>
  </div>
</template>

<script>
import { cloneDeep, uniqWith } from 'lodash'
import {
  computed, reactive, toRefs, onMounted,
  nextTick, watch
} from 'vue'
import { Graph } from '@antv/x6'
import { formatEdges, useMutations } from '@/utils'
import MutationTypes from '@/store/mutation-types'
import { FnGroup } from '@/utils/X6'
import { Layout } from '@antv/layout'

export default {
  name: 'RecordCard',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    const { data, index } = toRefs(props)

    const [updateRecord] = useMutations([
      MutationTypes.UPDATE_RECORD
    ])

    const state = reactive({
      board: null,
      map: null,
      graph: {},
      record: computed(() => cloneDeep(data.value)),
      recordNo: computed(() => index)
    })

    const methods = reactive({
      render: () => {
        if (state.graph && state.record) {
          const { nodes, edges } = state.record
          const { needLayoutNodes, layoutNodes } = nodes.reduce((acc, cur) => {
            if (cur.position) {
              acc.layoutNodes.push(cur)
            } else {
              acc.needLayoutNodes.push(cur)
            }
            return acc
          }, { needLayoutNodes: [], layoutNodes: [] })
          let model = { nodes: [], edges: [] }
          if (needLayoutNodes.length) {
            const calcEdges = formatEdges(needLayoutNodes)
            const dagreLayout = new Layout({ type: 'dagre' })
            model = dagreLayout.layout({ nodes: needLayoutNodes, edges: calcEdges })
            if (layoutNodes.length) {
              const maxX = Math.max(...layoutNodes.map(node => node.position.x))
              model.nodes.forEach(node => {
                node.x += maxX + 120
              })
            }
          }
          state.graph.fromJSON({
            nodes: [...layoutNodes, ...model.nodes],
            edges: [...edges, ...model.edges]
          })
          nextTick(() => state.graph.centerContent())
        }
      },
      handleUpdateRecord: () => {
        updateRecord({ id: data.value.id, record: state.record })
      },
      handleRemove: () => emit('remove', { id: state.record.id }),
      handleSave: () => {
        const { cells } = state.graph.toJSON()
        const { nodes, edges } = cells.reduce((acc, cur) => {
          if (cur.type && cur.type === 'NODE') {
            acc.nodes.push(cur)
          } else {
            acc.edges.push(cur)
          }
          return acc
        }, { nodes: [], edges: [] })
        const record = Object.assign(cloneDeep(state.record), { nodes, edges })
        updateRecord({ id: state.record.id, record })
      },
      handleClear: () => {
        const record = Object.assign(cloneDeep(state.record), { nodes: [], edges: [] })
        updateRecord({ id: state.record.id, record })
        methods.render()
      }
    })

    onMounted(() => {
      state.graph = new Graph({
        container: state.board,
        autoResize: false,
        grid: true,
        scroller: true,
        panning: true,
        minimap: {
          enabled: true,
          container: state.map
        },
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl', 'meta']
        }
      })
      state.graph.on('node:collapse', ({ node }) => {
        node.toggleCollapse()
        const collapsed = node.isCollapsed()
        const collapse = (parent) => {
          const cells = parent.getChildren()
          if (cells) {
            cells.forEach((cell) => {
              if (collapsed) {
                cell.hide()
              } else {
                cell.show()
              }

              if (cell instanceof FnGroup) {
                if (!cell.isCollapsed()) {
                  collapse(cell)
                }
              }
            })
          }
        }
      })

      methods.render()
    })

    watch(() => state.record, (val, oldVal) => {
      methods.render()
    })

    return {
      ...toRefs(state),
      ...toRefs(methods)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/theme';

.record-card {
  width: 100%;
  height: calc(100vh - 160px);
  border-radius: 4px;
  background: #f5f5fa;

  &__content {
    position: relative;
    display: flex;
    height: calc(100vh - 160px);
    box-sizing: border-box;
    padding: 16px;
    overflow: hidden;
  }

  &__board {
    flex: 1;
    height: 100%;
    width: 100%;
  }

  &__map {
    position: absolute;
    width: 300px;
    top: 16px;
    right: 16px;
    z-index: 1;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 16px 32px #cbcfdb, -16px 0 32px #cbcfdb;
  }

  &__footer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 64px;
    background: $primary-light;
    border-radius: 4px;
  }

  &__info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 0 16px;

    h3 {
      font-size: 36px;
      font-weight: normal;
      margin: 0;
    }
  }

  &__inputs {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: flex-start;
    margin: 0 16px;

    input {
      background: transparent;
      border: none;
      outline: none;

      &:nth-of-type(1) {
        font-size: 16px;
      }

      &:nth-of-type(2) {
        font-size: 12px;
        color: $grey;
      }
    }
  }

  &__actions {
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    height: 200px;
    width: 36px;
    z-index: 2;
    top: 16px;
    left: 16px;
    background: rgba(255, 255, 255, .8);
    border-radius: 4px;
    box-shadow: 0 16px 32px #cbcfdb, -16px 0 32px #cbcfdb;

    i {
      cursor: pointer;

      &:hover {
        color: $primary;
      }
    }
  }
}
</style>
