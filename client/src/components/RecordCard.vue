<template>
  <div class="record-card">
    <div class="record-card__content">
      <div class="record-card__board" ref="board"></div>
      <div class="record-card__map" ref="map"></div>
    </div>
    <footer class="record-card__footer">
      <div class="record-card__info">
        <h3>{{ recordNo }}</h3>
        <div class="record-card__inputs">
          <input
            type="text"
            name="title"
            placeholder="标题"
            autocomplete="off"
            v-model="record.title"
            @input="handleUpdateRecord"
          >
          <input
            type="text"
            name="desc"
            placeholder="描述"
            autocomplete="off"
            v-model="record.desc"
            @input="handleUpdateRecord"
          >
        </div>
      </div>
      <div class="record-card__actions">
        <i class="el-icon-delete" @click="handleRemove"></i>
        <i class="el-icon-files" @click="handleSave"></i>
        <i class="el-icon-toilet-paper" @click="handleClear"></i>
      </div>
    </footer>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
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
      handleUpdateRecord: () => {
        updateRecord({ id: data.value.id, record: state.record })
      },
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
        autoResize: true,
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
  height: calc(100vh - 169px);
  border-radius: 4px;
  background: rgba(255, 255, 255, .4);
  box-shadow: 0 16px 48px #e7ebf6;
  margin-bottom: 24px;

  &__content {
    position: relative;
    display: flex;
    height: calc(100vh - 233px);
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
    height: 205px;
    top: 0;
    right: 0;
    z-index: 1;
    border: 1px solid $primary-light;
    border-radius: 4px;
    overflow: hidden;
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
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    width: 200px;

    i {
      cursor: pointer;

      &:hover {
        color: $primary;
      }
    }
  }
}
</style>
