<template>
  <aside>
    <i class="el-icon-bangzhu logo"></i>

    <div class="menu">
      <el-tooltip effect="dark" content="文档" placement="right">
        <router-link to="/" class="menu__item">
          <i class="el-icon-reading"></i>
        </router-link>
      </el-tooltip>
      <el-tooltip effect="dark" content="历史" placement="right">
        <router-link to="/history" class="menu__item">
          <i class="el-icon-timer"></i>
        </router-link>
      </el-tooltip>
    </div>
  </aside>

  <main class="main">
    <router-view></router-view>
  </main>
</template>

<script>
import { reactive, computed, toRefs, onMounted, onUnmounted } from 'vue'
import { cloneDeep } from 'lodash'
import { useMutations } from '@/utils'
import MutationTypes from '@/store/mutation-types'
import { useStore } from 'vuex'
import Node from '@/models/Node'

export default {
  setup () {
    const store = useStore()

    const state = reactive({
      socket: null,
      source: computed(() => cloneDeep(store.state.source)),
      activePage: computed(() => cloneDeep(store.getters.activePage)),
      activeRecord: computed(() => cloneDeep(store.getters.activeRecord)),
      recordIndex: computed(() => store.state.recordIndex)
    })

    const [updateSource, setSocket, updateRecord] = useMutations([
      MutationTypes.UPDATE_SOURCE,
      MutationTypes.SET_SOCKET,
      MutationTypes.UPDATE_RECORD
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
        }
      })
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
  color: #2c3e50;

  input {
    font-family: alibaba, Avenir, Helvetica, Arial, sans-serif;
  }
}

aside {
  flex: none;
  height: 100vh;
  width: 56px;
  background: $white;

  i {
    font-size: 24px;
    color: #2c3e50;
  }

  .logo {
    margin-top: 16px;
  }

  .menu {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: 24px;

    &__item {
      height: 48px;
      width: calc(100% - 4px);
      cursor: pointer;
      line-height: 56px;
      text-decoration: none;
      border-right: 2px solid transparent;
      border-left: 2px solid transparent;

      &:hover {
        background: #ecf5ff;
      }

      &.router-link-exact-active {
        border-right: 2px solid $primary;

        i {
          color: $primary;
        }
      }
    }
  }
}

main {
  height: 100vh;
  width: 100%;
  background: #f7fafc;
}
</style>
