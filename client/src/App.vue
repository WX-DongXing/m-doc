<template>
  <main class="main">
    <router-view></router-view>
  </main>
</template>

<script>
import { reactive, computed, toRefs, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue'
import { cloneDeep } from 'lodash'
import { useMutations } from '@/utils'
import MutationTypes from '@/store/mutation-types'
import { useStore } from 'vuex'
import Node from '@/models/Node'
import { useRoute } from 'vue-router'

export default {
  setup () {
    const instance = getCurrentInstance()
    const store = useStore()
    const route = useRoute()

    const state = reactive({
      socket: null,
      source: computed(() => cloneDeep(store.state.source)),
      activePage: computed(() => cloneDeep(store.getters.activePage)),
      activeRecord: computed(() => cloneDeep(store.getters.activeRecord)),
      recordIndex: computed(() => store.state.recordIndex),
      pageId: computed(() => route.params.id),
      index: computed(() => route.params.index)
    })

    const [
      updateSource, setSocket, updateRecord,
      setPageIndex, setRecordIndex
    ] = useMutations([
      MutationTypes.UPDATE_SOURCE,
      MutationTypes.SET_SOCKET,
      MutationTypes.UPDATE_RECORD,
      MutationTypes.SET_PAGE_INDEX,
      MutationTypes.SET_RECORD_INDEX
    ])

    onMounted(() => {
      state.socket = new WebSocket('ws://localhost:12149')

      setSocket(state.socket)

      state.socket.addEventListener('open', () => {
        state.socket.emit('CONNECTED', 'Server Socket was opened!')
        state.socket.emit('FETCH')
      })

      state.socket.addEventListener('message', message => {
        const [event, data] = message.data.split('|')
        switch (event) {
          case 'UPDATE':
            updateSource(JSON.parse(data))
            break
          case 'STORAGE':
            state.socket.emit('STORAGE', state.source)
            break
          case 'RECORD':
            if (state.activePage && state.activeRecord) {
              const record = cloneDeep(state.activeRecord)
              record.nodes.push(new Node(JSON.parse(data)))
              updateRecord({ index: state.recordIndex, record })
            }
            break
          case 'NOTIFICATION': {
            const message = JSON.parse(data)
            instance.$notify(message)
          }
            break
          default:
            break
        }
      })
    })

    watch(() => [state.pageId, state.index, state.source], ([id, index, source]) => {
      if (source && source.length) {
        if (id) {
          const pageIndex = state.source.findIndex(page => page.id === id)
          if (~pageIndex) {
            setPageIndex({ index: pageIndex })
          }
        }
        if (+index >= 0) setRecordIndex({ index })
      }
    })

    onUnmounted(() => {
      if (state.socket) {
        state.socket.close()
      }
    })

    return {
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/theme';

html, body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-family: alibaba, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(35, 38, 59);

  input {
    font-family: alibaba, Avenir, Helvetica, Arial, sans-serif;
  }
}

main {
  height: 100vh;
  width: 100%;
}
</style>
