<template>
  <div class="markdown-panel">
    <div class="markdown-panel__editor" ref="editor"></div>
    <article class="markdown-panel__content markdown-body" v-html="html"></article>
  </div>
</template>

<script>
import { ref, toRefs, watch, onMounted, reactive } from 'vue'
import marked from 'marked'
import hl from 'highlight.js'
import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import 'highlight.js/scss/vs.scss'

export default {
  name: 'MarkdownPanel',
  props: ['modelValue'],
  setup (props, { emit }) {
    const { modelValue } = toRefs(props)

    const store = reactive({
      editor: null,
      view: null,
      html: ''
    })

    marked.setOptions({
      breaks: true,
      highlight: function (code, lang) {
        const language = hl.getLanguage(lang) ? lang : 'plaintext'
        return hl.highlight(code, { language }).value
      }
    })

    onMounted(() => {
      const onUpdate = () =>
        EditorView.updateListener.of(({ state }) => {
          const doc = state.doc.toString()
          emit('update:modelValue', doc)
        })

      const state = EditorState.create({
        doc: modelValue.value,
        extensions: [
          basicSetup,
          markdown(),
          oneDark,
          onUpdate()
        ]
      })

      store.view = new EditorView({
        state,
        parent: store.editor
      })
    })

    watch(modelValue, (val) => {
      store.html = marked(val)
    }, { immediate: true })

    return {
      ...toRefs(store)
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
    //box-sizing: border-box;
    //padding: 16px;
    font-size: 16px;
    line-height: 32px;
    resize: none;
    border-radius: 4px;
    text-align: left;
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
