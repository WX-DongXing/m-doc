<template>
  <div class="markdown-panel">
    <div class="markdown-panel__editor" ref="editor" id="editor"></div>
    <article class="markdown-panel__content markdown-body" ref="render" v-html="html"></article>
  </div>
</template>

<script>
import { ref, toRefs, watch, onMounted, reactive, onUnmounted, nextTick } from 'vue'
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
      parser: new DOMParser(),
      editor: null,
      render: null,
      view: null,
      html: '',
      doc: modelValue.value,
      source: []
    })

    marked.setOptions({
      breaks: true,
      highlight: function (code, lang) {
        const language = hl.getLanguage(lang) ? lang : 'plaintext'
        return hl.highlight(code, { language }).value
      }
    })

    const handleScroll = () => {
      const [container] = document.getElementsByClassName('cm-scroller')
      const line = Math.round(container.scrollTop / 22)
      const text = new Array(line).fill('').reduce((acc, cur, index) => {
        acc += (store.view.state.doc.line(index + 1).text + '\n')
        return acc
      }, '')
      const doc = store.parser.parseFromString(marked(text), 'text/html')
      const elements = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table, div')
      const top = store.source[elements.length]
      store.render.scroll(0, top)
    }

    const getLinesTop = () => {
      const elements = store.render?.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table, div') || []
      if (!elements.length || !store.render) {
        return
      }
      const { top } = store.render.getBoundingClientRect()
      let offset = 0
      store.source = [...elements].map((element, index) => {
        const { top: elementTop } = element.getBoundingClientRect()
        const lineTop = elementTop - top
        if (index === 0 && lineTop !== 0) {
          offset = lineTop
        }
        return lineTop - offset
      })
    }

    onMounted(() => {
      const onUpdate = () =>
        EditorView.updateListener.of(({ state }) => {
          store.doc = state.doc.toString()
          emit('update:modelValue', store.doc)
        })

      const state = EditorState.create({
        doc: modelValue.value,
        extensions: [
          basicSetup,
          oneDark,
          markdown(),
          onUpdate()
        ]
      })

      store.view = new EditorView({
        state,
        parent: store.editor
      })

      getLinesTop()

      const [container] = document.getElementsByClassName('cm-scroller')
      container.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      const [container] = document.getElementsByClassName('cm-scroller')
      container && container.removeEventListener('scroll', handleScroll)
    })

    watch(modelValue, (val) => {
      store.html = marked(val)
      getLinesTop()
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
    width: 50%;
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
    width: 50%;
    box-sizing: border-box;
    padding: 0 16px;
    text-align: left;
    background: white;
    overflow: auto;
    scroll-behavior: smooth;
  }
}
</style>
