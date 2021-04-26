<template>
  <div class="doc-panel" v-for="(doc, index) in docs" :key="index">
    <div class="doc-panel__header">
      <h3 class="doc-panel__title">{{ doc.name }}</h3>
      <div class="doc-panel__editor">
        <img :src="vscode" alt="" @click="handleOpenFile({ type: 'vscode', doc })">
        <img :src="webstorm" alt="" @click="handleOpenFile({ type: 'webstorm', doc })">
      </div>
    </div>

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
        <span class="doc-panel__position">{{ doc.loc.start.line }}:{{ doc.loc.start.column }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import vscode from '@/assets/image/vscode.png'
import webstorm from '@/assets/image/webstorm.png'

export default {
  name: 'DocPanel',
  props: ['docs'],
  setup () {
    const state = reactive({
      vscode,
      webstorm
    })

    const handleOpenFile = ({ type, doc: { file, loc: { start: { line, column } } } }) => {
      const link = document.createElement('a')
      const event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, true)
      switch (type) {
        case 'vscode':
          link.href = `vscode://file/${file.filename}:${line}:${column}`
          link.dispatchEvent(event)
          break
        case 'webstorm':
          link.href = `webstorm://open?file=${file.filename}&line=${line}`
          link.dispatchEvent(event)
          break
        default:
          break
      }
    }

    return {
      ...toRefs(state),
      handleOpenFile
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

  &__header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 6px;
  }

  &__row {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }

  &__title {
    font-size: 18px;
    margin: 0;
  }

  &__editor{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    width: 120px;
    height: 24px;

    img {
      height: 100%;
      cursor: pointer;
      opacity: 0;
      transition: .35s ease-in-out;

      &:nth-of-type(2) {
        height: 20px;
        margin-left: 12px;
      }
    }
  }

  &:hover &__editor img {
    opacity: 1;
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
    justify-content: space-between;
    align-items: center;
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

  &__position {
    color: $primary;
  }
}
</style>
