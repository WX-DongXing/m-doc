<template>
  <div class="record">
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
        <i class="el-icon-close record__close" @click="handleRemoveRecord"></i>
        <i class="el-icon-plus record__close" @click="handleAddRecord"></i>
      </div>
    </header>

    <el-tabs v-model="tab">
      <el-tab-pane label="流程图" name="GRAPH">
        <record-card :data="activeRecord" v-if="activeRecord.id"></record-card>
      </el-tab-pane>
      <el-tab-pane label="文档" name="DOCS">Docs</el-tab-pane>
      <el-tab-pane label="Markdown" name="MARKDOWN">markdown</el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { cloneDeep } from 'lodash'
import { useStore } from 'vuex'
import { useMutations } from '@/utils'
import MutationTypes from '@/store/mutation-types'
import Record from '@/models/Record'
import RecordCard from '@/components/RecordCard'

export default {
  name: 'Record',
  components: { RecordCard },
  setup () {
    const store = useStore()

    const [
      updateRecord, removeRecord, addRecord
    ] = useMutations([
      MutationTypes.UPDATE_RECORD,
      MutationTypes.REMOVE_RECORD,
      MutationTypes.ADD_RECORD
    ])

    const state = reactive({
      socket: computed(() => store.state.socket),
      activePage: computed(() => cloneDeep(store.getters.activePage || {})),
      activeRecord: computed(() => cloneDeep(store.getters.activeRecord || {})),
      tab: 'GRAPH'
    })

    const methods = reactive({
      handleUpdateRecord: () => {
        updateRecord({ id: state.activeRecord.id, record: state.activeRecord })
      },
      handleRemoveRecord: () => {
        removeRecord({ id: state.activeRecord.id })
      },
      handleAddRecord: () => {
        const record = new Record({ parentId: state.activePage.id })
        addRecord({ record })
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
}
</style>