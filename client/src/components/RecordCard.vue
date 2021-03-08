<template>
  <div class="record-card">
    <div class="record-card__content">
      <div class="record-card__board" ref="board"></div>
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
      </div>
    </footer>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { computed, reactive, toRefs, onMounted, onUnmounted } from 'vue'
import { Graph } from '@antv/x6'
import { Layout } from '@antv/layout'
import { useMutations } from '@/utils'
import MutationTypes from '@/store/mutation-types'
import { FnGroup } from '@/utils/X6'

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
  setup (props) {
    const { data, index } = toRefs(props)

    const [updateRecord] = useMutations([
      MutationTypes.UPDATE_RECORD
    ])

    const state = reactive({
      board: null,
      graph: {},
      record: computed(() => cloneDeep(data.value)),
      recordNo: computed(() => index)
    })

    const methods = reactive({
      handleUpdateRecord: () => {
        updateRecord({ id: data.value.id, record: state.record })
      }
    })

    onMounted(() => {
      state.graph = new Graph({
        container: state.board,
        autoResize: true,
        grid: true
      })

      const model = {
        nodes: [
          {
            id: 'node1', // String，可选，节点的唯一标识
            shape: 'fn-group',
            x: 40, // Number，必选，节点位置的 x 值
            y: 40, // Number，必选，节点位置的 y 值
            width: 180, // Number，可选，节点大小的 width 值
            height: 180, // Number，可选，节点大小的 height 值
            attrs: {
              title: { text: 'init' },
              desc: { text: '初始化' }
            }
          },
          {
            id: 'node2', // String，可选，节点的唯一标识
            shape: 'fn-group',
            x: 360, // Number，必选，节点位置的 x 值
            y: 40, // Number，必选，节点位置的 y 值
            width: 180, // Number，可选，节点大小的 width 值
            height: 180, // Number，可选，节点大小的 height 值
            attrs: {
              title: { text: 'getDetail' },
              desc: {
                text: '获取详情'
              }
            }
          }
        ],
        edges: [
          {
            source: 'node1',
            target: 'node2',
            router: {
              name: 'orth'
            },
            attrs: {
              line: {
                targetMarker: {
                  args: { size: 6 },
                  name: 'block'
                },
                stroke: '#200097',
                strokeWidth: 1
              }
            }
          }
        ]
      }

      const dagreLayout = new Layout({
        type: 'dagre',
        rankdir: 'LR',
        align: 'DR',
        ranksep: 100,
        nodesep: 100,
        controlPoints: true
      })

      const layoutModel = dagreLayout.layout(model)

      state.graph.fromJSON(layoutModel)

      state.graph.on('node:collapse', ({ node }) => {
        node.toggleCollapse()
        const collapsed = node.isCollapsed()
        // eslint-disable-next-line no-unused-vars
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
    })

    onUnmounted(() => {
      state.graph.dispose()
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
    display: flex;
    height: calc(100vh - 233px);
    box-sizing: border-box;
    padding: 16px;
  }

  &__board {
    flex: 1;
    height: 100%;
    width: 100%;
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
}
</style>
