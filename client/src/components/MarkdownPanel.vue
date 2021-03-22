<template>
  <div class="markdown-panel">
    <textarea class="markdown-panel__editor" :value="modelValue" @input="handleContentChange"></textarea>
    <el-divider direction="vertical" style="height: 100%"></el-divider>
    <article class="markdown-panel__content markdown-body" v-html="html"></article>
  </div>
</template>

<script>
import { toRefs, watch } from 'vue'
import { throttle } from 'lodash'

export default {
  name: 'MarkdownPanel',
  props: ['modelValue', 'html'],
  setup (props, { emit }) {
    const { modelValue } = toRefs(props)

    const handleContentChange = (event) => {
      emit('update:modelValue', event.target.value)
    }

    watch(modelValue, throttle(val => {
      emit('changed', val)
    }, 200))

    return {
      handleContentChange
    }
  }
}
</script>

<style scoped lang="scss">
.markdown-panel {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;

  &__editor {
    flex: 1;
    background: #fcf6e3;
    border: none;
    outline: none;
    box-sizing: border-box;
    padding: 16px;
    font-size: 14px;
    resize: none;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
  }

  &__content {
    flex: 1;
    box-sizing: border-box;
    padding: 16px;
    text-align: left;
    background: whitesmoke;
    overflow: auto;
  }
}
</style>
