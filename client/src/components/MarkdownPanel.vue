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
      editor: null,
      render: null,
      view: null,
      html: '',
      doc: modelValue.value,
      source: [],
      tagNames: []
    })

    marked.setOptions({
      breaks: true,
      highlight: function (code, lang) {
        const language = hl.getLanguage(lang) ? lang : 'plaintext'
        return hl.highlight(code, { language }).value
      }
    })

    const handleLineSource = () => {
      store.source = []
      store.tagNames = [0]
      const lines = store.doc.split('\n')
      if (lines.length && store.render) {
        let index = 0
        let top = 0
        let childIndex = 0
        const rect = store.render.getBoundingClientRect()
        for (const line of lines) {
          if (!line.trim()) {
            store.source.push(top)
            continue
          }
          const element = store.render.children[index]
          const elementRect = element.getBoundingClientRect()
          if (element && /(BLOCKQUOTE|PRE|TABLE|UL|OL)/.test(element.tagName)) {
            let size = 0
            let lineHeight
            if (/BLOCKQUOTE/.test(element.tagName)) {
              lineHeight = 24
              size = Math.floor(elementRect.height / lineHeight)
            }
            if (/PRE/.test(element.tagName)) {
              lineHeight = 17.5
              size = Math.floor(elementRect.height / lineHeight)
            }
            if (/TABLE/.test(element.tagName)) {
              lineHeight = 36
              size = Math.floor(elementRect.height / lineHeight)
            }
            if (/(UL|OL)/.test(element.tagName)) {
              lineHeight = 26
              size = Math.floor(elementRect.height / lineHeight)
            }
            top += lineHeight
            childIndex += 1
            if (childIndex > size - 1) {
              childIndex = 0
              index += 1
            }
            store.source.push(top)
            store.tagNames.push(element.tagName)
          } else {
            top = elementRect.top - rect.top
            index += 1
            store.source.push(top)
            store.tagNames.push('common')
          }
        }
        // console.log('lines: ', lines)
        // console.log('source: ', store.source)
        // console.log('element: ', store.render.children)
      }
    }

    const handleScroll = (event) => {
      if (store.source.length === 1) {
        handleLineSource()
      }
      const [container] = document.getElementsByClassName('cm-scroller')
      const line = Math.round(container.scrollTop / 22)
      const top = store.source[line]
      const tagName = store.tagNames[line]
      console.log(line, tagName)
      store.render.scroll(0, top)
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

      const [container] = document.getElementsByClassName('cm-scroller')
      container.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      const [container] = document.getElementsByClassName('cm-scroller')
      container && container.removeEventListener('scroll', handleScroll)
    })

    watch(modelValue, (val) => {
      store.html = marked(val)
      handleLineSource()
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
