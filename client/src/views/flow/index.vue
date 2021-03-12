<template>
  <div class="flow">

    <!-- S aside -->
    <aside class="flow__aside">
      <div class="flow__name">
        <h3>Flow</h3>
        <i class="el-icon-plus" @click="handleAddPage"></i>
      </div>
      <div class="flow__tree">
        <el-tree :data="source" :props="treeProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </aside>
    <!-- E aside -->

    <div class="flow__container">
      <div class="flow__header" v-if="activePage">
        <div class="flow__info">
          <input
            type="text"
            name="title"
            placeholder="标题"
            autocomplete="off"
            class="flow__title"
            v-model="activePage.title"
            @input="handleUpdatePage"
          >
          <input
            type="text"
            name="desc"
            placeholder="描述"
            autocomplete="off"
            class="flow__desc"
            v-model="activePage.desc"
            @input="handleUpdatePage"
          >
        </div>
        <div>
          <i class="el-icon-close flow__close" @click="handleRemovePage"></i>
          <i class="el-icon-plus flow__close" @click="handleAddRecord"></i>
        </div>
      </div>
      <!-- / page header -->

      <!-- S page content -->
      <section class="flow__page" ref="container" v-if="activePage">
        <div class="flow__content" v-if="activePage?.children.length > 0">
          <record-card
            v-for="(record, index) of records"
            :key="record.id"
            :index="index + 1"
            :data="record"
            :ref="el => { recordRefs[index] = el }"
          />
        </div>
        <!-- / page content -->
        <div class="flow__content flow__none" v-else>
          <i class="el-icon-news"></i>
          <p>暂无记录</p>
        </div>

      </section>
      <!-- E page content -->

      <!-- S none page -->
      <section class="flow__none" v-else>
        <i class="el-icon-files"></i>
        <p>暂无数据</p>
      </section>
      <!-- E none page -->
    </div>

    <!-- S page actions -->
    <div class="flow__actions" v-if="activePage?.children.length > 0">
      <el-button type="primary" icon="el-icon-top" circle :disabled="recordIndex === 0" @click="handlePrevious"
      ></el-button>
      <el-button type="primary" icon="el-icon-bottom" circle :disabled="recordIndex === records.length - 1" @click="handleNext"></el-button>
    </div>
    <!-- E page actions -->

  </div>
</template>

<script>
import { cloneDeep, throttle } from 'lodash'
import { computed, reactive, toRefs, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import MutationTypes from '@/store/mutation-types'
import Page from '@/models/Page'
import Record from '@/models/Record'
import { useMutations } from '@/utils'
import RecordCard from '@/components/RecordCard'

export default {
  name: 'Flow',
  components: {
    RecordCard
  },
  setup () {
    const store = useStore()

    const [
      addPage, setActivePage, updatePage, removePage,
      addRecord, setRecordIndex, updateGraph
    ] = useMutations([
      MutationTypes.ADD_PAGE,
      MutationTypes.SET_ACTIVE_PAGE,
      MutationTypes.UPDATE_PAGE,
      MutationTypes.REMOVE_PAGE,
      MutationTypes.ADD_RECORD,
      MutationTypes.SET_RECORD_INDEX,
      MutationTypes.UPDATE_GRAPH
    ])

    const state = reactive({
      container: null,
      source: computed(() => store.state.source),
      activePage: computed(() => cloneDeep(store.getters.activePage)),
      activeRecord: computed(() => cloneDeep(store.getters.activeRecord)),
      records: computed(() => store.getters.activePage?.children),
      recordIndex: computed(() => store.state.recordIndex),
      treeProps: {
        children: 'children',
        label: 'title'
      },
      recordRefs: []
    })

    const methods = reactive({
      handleAddPage: () => {
        const page = new Page({})
        addPage({ page })
        setActivePage({ id: page.id })
      },
      handleNodeClick: (node) => {
        if (node.type === 'PAGE') {
          if (node.id !== state.activePage.id) {
            setRecordIndex({ index: 0 })
          }
          setActivePage({ id: node.id })
        } else {
          const { id, children } = state.source.find(page => page.id === node.parentId)
          setActivePage({ id })
          const index = children.findIndex(record => record.id === node.id)
          setRecordIndex({ index })
        }
      },
      handleUpdatePage: () => {
        updatePage({ id: state.activePage.id, page: state.activePage })
      },
      handleRemovePage: () => {
        removePage({ id: state.activePage.id })
        setActivePage()
      },
      handleAddRecord: () => {
        const record = new Record({ parentId: state.activePage.id })
        if (state.records.length) {
          setRecordIndex({ index: state.recordIndex + 1 })
        }
        addRecord({ record })
        nextTick(() => {
          const { recordIndex, recordRefs } = state
          if (recordIndex === 0 && recordRefs.length) {
            updateGraph(recordRefs[0])
          }
        })
      },
      handlePrevious: throttle(() => {
        setRecordIndex({ index: state.recordIndex - 1 })
      }, 1000),
      handleNext: throttle(() => {
        setRecordIndex({ index: state.recordIndex + 1 })
      }, 1000)
    })

    watch(() => state.recordIndex, (val, oldVal) => {
      updateGraph(state.recordRefs[val])
      const { height } = state.container.parentNode.getBoundingClientRect()
      state.container.style.transformOrigin = `center ${oldVal * height + ((height - 145) / 2 + 121)}px`
      state.container.animate([
        { transform: `translate3d(0, -${oldVal * (height - 145)}px, 0) rotateX(0)`, offset: 0 },
        { transform: `translate3d(0, -${(oldVal + (val - oldVal) * 0.3) * (height - 145)}px, 0) rotateX(${(val - oldVal) * 2}deg)`, offset: 0.3 },
        { transform: `translate3d(0, -${(oldVal + (val - oldVal) * 0.7) * (height - 145)}px, 0) rotateX(${(val - oldVal) * 2}deg)`, offset: 0.7 },
        { transform: `translate3d(0, -${val * (height - 145)}px, 0) rotateX(0)`, offset: 1 }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        iterations: 1,
        fill: 'forwards'
      })
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

.flow {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  &__container{
    height: 100vh;
    width: 100%;
    perspective: 1200px;
    transform-style: preserve-3d;
    overflow: hidden;
  }

  &__aside {
    width: 240px;
    background: white;
  }

  &__page {
    width: 100%;
  }

  &__header {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 12px 64px;
    margin-bottom: 16px;
    z-index: 2;
    background: $white;
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
  }

  &__title {
    color: $primary;
    font-size: 24px;
    font-weight: bold;
    margin: 12px 0;
  }

  &__desc {
    color: #2c3e50;
    font-size: 14px;
    margin: 0;
  }

  &__none {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-content: center;
    height: 100%;
    width: 100%;

    i {
      font-size: 64px;
    }
  }

  &__content {
    min-height: calc(100vh - 121px);
    box-sizing: border-box;
    padding: 0 48px;
  }

  &__actions {
    position: fixed;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    height: 150px;
    width: 56px;
    z-index: 1;
    top: calc(50% - 75px);
    right: 24px;

    button {
      font-size: 18px;
      border: none;
      box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 rgb(0 0 0 / 12%);
    }
  }
}
</style>
