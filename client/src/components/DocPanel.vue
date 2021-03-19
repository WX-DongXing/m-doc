<template>
  <div class="doc-panel" v-for="(doc, index) in docs" :key="index">
    <h3 class="doc-panel__title">{{ doc.name }}</h3>

    <p class="doc-panel__desc">{{ doc.desc }}</p>

    <div class="doc-panel__row" v-if="doc.params.length">
      <p class="doc-panel__subtitle">Params</p>
      <div class="doc-panel__params">
        <el-table
          :data="doc.params"
          border
          size="small">
          <el-table-column
            prop="value"
            label="Value"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type"
            label="Type"
            width="180">
          </el-table-column>
          <el-table-column
            prop="desc"
            label="Description">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="doc-panel__row" v-if="doc.returns">
      <p class="doc-panel__subtitle">Returns</p>
      <div class="doc-panel__content">
        <p class="doc-panel__returns">
          <b>{{ doc.returns.type }}: </b>
          <span>{{ doc.returns.desc }}</span>
        </p>
      </div>
    </div>

    <div  class="doc-panel__row" v-if="doc.example">
      <p class="doc-panel__subtitle">Example</p>
      <div class="doc-panel__example">{{ doc.example }}</div>
    </div>

    <div class="doc-panel__row" v-if="doc.file && doc.file.filename">
      <p class="doc-panel__subtitle">Path</p>
      <div class="doc-panel__content">
        <p class="doc-panel__filename">{{ doc.file.filename }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import { cloneDeep, uniqWith } from 'lodash'
import { computed, reactive, toRefs, watch } from 'vue'

export default {
  name: 'DocPanel',
  props: ['data'],
  setup (prop) {
    const { data } = toRefs(prop)

    const state = reactive({
      docs: []
    })

    watch(data, (val) => {
      const nodes = uniqWith(val.nodes || [], (val, other) => other.name === val.name && other.comment.file.filename === val.comment.file.filename)
      state.docs = nodes.map(node => node.comment)
    }, { immediate: true })

    return {
      ...toRefs(state)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/theme';

.doc-panel {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 24px;
  border-radius: 4px;
  border: 2px dashed #e7e7ea;
  box-sizing: border-box;
  padding: 16px;

  &__row {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }

  &__title {
    font-size: 18px;
    margin: 0 0 6px;
  }

  &__desc {
    position: relative;
    font-size: 14px;
    box-sizing: border-box;
    padding-left: 16px;
    text-align: left;

    &:before {
      position: absolute;
      display: block;
      content: '';
      width: 4px;
      height: 100%;
      left: 0;
      background: $primary-light;
    }
  }

  &__subtitle {
    font-size: 14px;
    font-weight: bold;
    color: $primary;
    margin: 12px 0;
  }

  &__params {
    width: 100%;

    .el-table {
      font-size: 14px;
    }
  }

  &__example {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    width: 100%;
    border-radius: 4px;
    background: $back-color;
    box-sizing: border-box;
    padding: 12px;
    margin-bottom: 6px;
  }

  &__returns {
    margin: 0 0 6px;
    box-sizing: border-box;
  }

  &__content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    width: 100%;
    border-radius: 4px;
    border: 2px solid $back-color;
    box-sizing: border-box;
    padding: 12px;
    margin-bottom: 6px;
  }

  &__filename {
    margin: 0;

    &:hover {
      cursor: pointer;
      color: $primary;
      text-decoration: underline;
    }
  }
}
</style>
