<template>
  <div class="overview">
    <header>
      <div class="overview__info">
        <input
          type="text"
          name="title"
          placeholder="标题"
          autocomplete="off"
          class="overview__title"
          v-model="activePage.title"
          @input="handleUpdatePage"
        >
        <input
          type="text"
          name="desc"
          placeholder="描述"
          autocomplete="off"
          class="overview__desc"
          v-model="activePage.desc"
          @input="handleUpdatePage"
        >
      </div>
      <div>
        <i class="el-icon-close overview__close" @click="handleRemovePage"></i>
        <i class="el-icon-plus overview__close" @click="handleAddRecord"></i>
      </div>
    </header>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, toRefs } from 'vue'
import { cloneDeep } from 'lodash'
import { useMutations } from '@/utils'
import MutationTypes from '@/store/mutation-types'
import Record from '@/models/Record'
import { useRouter } from 'vue-router'

export default {
  name: 'Overview',
  setup () {
    const store = useStore()
    const router = useRouter()

    const [
      setActivePage, updatePage, removePage,
      addRecord
    ] = useMutations([
      MutationTypes.SET_ACTIVE_PAGE,
      MutationTypes.UPDATE_PAGE,
      MutationTypes.REMOVE_PAGE,
      MutationTypes.ADD_RECORD
    ])

    const state = reactive({
      socket: computed(() => store.state.socket),
      activePage: computed(() => cloneDeep(store.getters.activePage || {}))
    })

    const methods = reactive({
      handleUpdatePage: () => {
        updatePage({ id: state.activePage.id, page: state.activePage })
      },
      handleRemovePage: () => {
        removePage({ id: state.activePage.id })
        setActivePage()
      },
      handleAddRecord: () => {
        const record = new Record({ parentId: state.activePage.id })
        addRecord({ record })
        router.push({ name: 'Record', params: { id: state.activePage.id, index: state.activePage.children.length - 1 } })
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

.overview {

  header {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 16px;
    z-index: 2;
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
    font-size: 24px;
    font-weight: bold;
    margin: 12px 0;
  }

  &__desc {
    color: #2c3e50;
    font-size: 14px;
    margin: 0;
  }
}
</style>
