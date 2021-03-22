<template>
  <div class="markdown-panel">
    <textarea class="markdown-panel__editor" :value="modelValue" @input="handleContentChange"></textarea>
    <el-divider direction="vertical" style="height: 100%"></el-divider>
    <article class="markdown-panel__content markdown-body" v-html="html"></article>
  </div>
</template>

<script>
import { ref, toRefs, watch } from 'vue'
import marked from 'marked'
import hl from 'highlight.js'
import 'highlight.js/scss/vs.scss'

export default {
  name: 'MarkdownPanel',
  props: ['modelValue'],
  setup (props, { emit }) {
    const { modelValue } = toRefs(props)
    const html = ref('')
    marked.setOptions({
      breaks: true,
      highlight: function (code, language) {
        const validLanguage = hl.getLanguage(language) ? language : 'plaintext'
        return hl.highlight(validLanguage, code).value
      }
    })

    const handleContentChange = (event) => {
      emit('update:modelValue', event.target.value)
    }

    watch(modelValue, (val) => {
      html.value = marked(val)
    }, { immediate: true })

    return {
      html,
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
    font-size: 16px;
    line-height: 32px;
    resize: none;
    border-radius: 4px;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
  }

  &__content {
    flex: 1;
    box-sizing: border-box;
    padding: 16px;
    text-align: left;
    background: white;
    overflow: auto;
  }
}
</style>
