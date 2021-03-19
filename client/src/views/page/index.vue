<template>
  <div class="page">

    <aside class="page__aside">
      <div class="page__name">
        <h3>M-Doc</h3>
        <div class="page__menus">
          <i class="el-icon-sell" @click="handleStorage"></i>
          <i class="el-icon-plus" @click="handleAddPage"></i>
        </div>
      </div>
      <div class="page__tree">
        <el-tree
          :data="source"
          :props="treeProps"
          node-key="id"
          :default-expand-keys="[activePage.id, activeRecord.id]"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </aside>

    <section>
      <router-view></router-view>
    </section>

  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MutationTypes from '@/store/mutation-types'
import Page from '@/models/Page'
import Record from '@/models/Record'
import { useMutations } from '@/utils'

export default {
  name: 'Page',
  setup () {
    const store = useStore()
    const router = useRouter()

    const [
      addPage, setActivePage, setRecordIndex
    ] = useMutations([
      MutationTypes.ADD_PAGE,
      MutationTypes.SET_ACTIVE_PAGE,
      MutationTypes.SET_RECORD_INDEX
    ])

    const state = reactive({
      source: computed(() => store.state.source),
      socket: computed(() => store.state.socket),
      activePage: computed(() => store.getters.activePage || {}),
      activeRecord: computed(() => store.getters.activeRecord || {}),
      treeProps: {
        children: 'children',
        label: 'title'
      }
    })

    const methods = reactive({
      handleStorage: () => {
        state.socket.emit('STORAGE', { source: state.source })
      },
      handleAddPage: () => {
        const page = new Page({})
        addPage({ page })
        setActivePage({ id: page.id })
        router.push({ name: 'Overview', params: { id: page.id } })
      },
      handleNodeClick: (node) => {
        if (node.type === 'PAGE') {
          if (node.id !== state.activePage.id) {
            setRecordIndex({ index: 0 })
          }
          setActivePage({ id: node.id })
          router.push({ name: 'Overview', params: { id: node.id } })
        } else {
          const { id, children } = state.source.find(page => page.id === node.parentId)
          setActivePage({ id })
          const index = children.findIndex(record => record.id === node.id)
          setRecordIndex({ index })
          router.push({ name: 'Record', params: { id, index } })
        }
      }
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

.page {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  aside {
    flex: none;
    width: 320px;
    background: $back-color;
  }

  section {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background: white;
    box-sizing: border-box;
    padding: 12px 48px;
  }

  &__menus {
    i + i {
      margin-left: 12px;
    }

    i:hover {
      color: $primary-dark;
    }
  }

  &__name {
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    box-sizing: border-box;
    padding: 0 16px;

    h3 {
      color: $primary-dark;
    }

    i {
      font-size: 16px;
      cursor: pointer;
    }
  }

  &__tree {
    height: calc(100vh - 56px);
    box-sizing: border-box;
    padding: 16px;

    .el-tree {
      background: transparent;
    }
  }

}
</style>
