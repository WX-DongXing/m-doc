<template>
  <div class="record" v-if="activeRecord">
    <header>
      <div class="record__info">
        <input
          type="text"
          name="title"
          placeholder="标题"
          autocomplete="off"
          class="record__title"
          v-model="activeRecord.title"
          @input="handleUpdateRecord"
        >
        <input
          type="text"
          name="desc"
          placeholder="描述"
          autocomplete="off"
          class="record__desc"
          v-model="activeRecord.desc"
          @input="handleUpdateRecord"
        >
      </div>
      <div>
        <i class="el-icon-delete record__close" @click="handleRemoveRecord"></i>
        <i class="el-icon-plus record__close" @click="handleAddRecord"></i>
      </div>
    </header>

    <el-tabs v-model="tab">
      <el-tab-pane label="流程图" name="GRAPH">
        <record-card :data="activeRecord" v-if="activeRecord.id"></record-card>
      </el-tab-pane>
      <el-tab-pane label="文档" name="DOCS" class="record__panel">
        <div class="record__docs">
          <doc-panel :data="activeRecord" v-if="activeRecord.id"></doc-panel>
        </div>
        <div class="record__actions"></div>
      </el-tab-pane>
      <el-tab-pane label="Markdown" name="MARKDOWN">markdown</el-tab-pane>
    </el-tabs>
  </div>

  <div class="empty" v-else>
    <i class="el-icon-reading"></i>
    <p>暂无记录</p>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, reactive, toRefs } from 'vue'
import { cloneDeep, isEmpty } from 'lodash'
import { useStore } from 'vuex'
import { useMutations } from '@/utils'
import MutationTypes from '@/store/mutation-types'
import Record from '@/models/Record'
import RecordCard from '@/components/RecordCard'
import DocPanel from '@/components/DocPanel'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Record',
  components: {
    RecordCard,
    DocPanel
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const [
      updateRecord, removeRecord, addRecord,
      setActivePage, setRecordIndex
    ] = useMutations([
      MutationTypes.UPDATE_RECORD,
      MutationTypes.REMOVE_RECORD,
      MutationTypes.ADD_RECORD,
      MutationTypes.SET_ACTIVE_PAGE,
      MutationTypes.SET_RECORD_INDEX
    ])

    const state = reactive({
      socket: computed(() => store.state.socket),
      source: computed(() => store.state.source),
      activePage: computed(() => store.getters.activePage || {}),
      activeRecord: computed(() => cloneDeep(store.getters.activeRecord)),
      tab: 'GRAPH',
      docs: []
    })

    const methods = reactive({
      routerToPage: () => {
        if (!state.source.length || isEmpty(state.activePage)) {
          router.push({ name: 'Empty' })
        } else {
          if (state.activePage.children.length) {
            const { children, id } = state.activePage
            router.push({ name: 'Record', params: { id, index: children.length - 1 } })
          } else {
            router.push({ name: 'Overview', params: { id: state.activePage.id } })
          }
        }
      },
      handleUpdateRecord: () => {
        updateRecord({ id: state.activeRecord.id, record: state.activeRecord })
      },
      handleRemoveRecord: () => {
        removeRecord({ id: state.activeRecord.id })
        methods.routerToPage()
      },
      handleAddRecord: () => {
        const record = new Record({ parentId: state.activePage.id })
        addRecord({ record })
        router.push({ name: 'Record', params: { id: state.activePage.id, index: state.activePage.children.length - 1 } })
      }
    })

    onMounted(() => {
      const { id, index } = route.params
      id && setActivePage({ id })
      index >= 0 && setRecordIndex({ index })
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

.record {

  header {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 12px;
  }

  .el-tabs {
    height: calc(100vh - 102px);
  }

  .el-tab-pane {
    height: calc(100vh - 160px);
  }

  &__info {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;

    input {
      background: transparent;
      border: none;
      outline: none;
    }
  }

  &__close {
    font-size: 24px;
    cursor: pointer;

    &:hover {
      color: $primary;
    }

    & + & {
      margin-left: 16px;
    }
  }

  &__title {
    color: $primary;
    font-size: 20px;
    font-weight: bold;
    margin: 12px 0 6px 0;
  }

  &__desc {
    color: #2c3e50;
    font-size: 12px;
    margin: 0;
  }

  &__panel {
    display: flex;
    flex-flow: row nowrap;
    overflow: auto;
  }

  &__docs {
    flex: 1;
    box-sizing: border-box;
    padding-right: 24px;
  }

  &__actions {
    flex: none;
    width: 280px;
  }
}

.empty {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  i {
    font-size: 56px;
  }
}
</style>
