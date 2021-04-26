<template>
  <ul class="anchor">
    <li
      v-for="(anchor, i) of value"
      :key="i"
      :class="['anchor__item', { 'anchor__item--active': index === i }]"
      @click="handleClick(i)"
    >
      {{ anchor }}
    </li>
  </ul>
</template>

<script>
import { nextTick, onMounted, reactive, toRefs, watch } from 'vue'

export default {
  name: 'Anchor',
  props: {
    root: {
      type: String,
      default: 'record__panel'
    },
    target: {
      type: String,
      default: 'doc-panel'
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  setup (props) {
    const { value, target, root } = toRefs(props)

    const state = reactive({
      rootElement: null,
      elements: [],
      observer: null,
      entryRatio: new WeakMap(),
      entryIndex: new WeakMap(),
      index: 0
    })

    const buildThresholdList = () => {
      const thresholds = []
      const numSteps = 20

      for (let i = 1.0; i <= numSteps; i++) {
        const ratio = i / numSteps
        thresholds.push(ratio)
      }

      thresholds.push(0)
      return thresholds
    }

    const observeElements = () => {
      nextTick(() => {
        const elements = document.getElementsByClassName(target.value)
        state.elements = elements || []
        state.entryIndex = new WeakMap()

        elements.forEach((element, i) => {
          state.entryIndex.set(element, i)
          state.observer.observe(element)
        })
      })
    }

    const setActive = () => {
      const [index] = [...state.elements].reduce((acc, cur) => {
        if (state.entryRatio.has(cur)) {
          const ratio = state.entryRatio.get(cur)
          if (ratio > 0) {
            acc.push(state.entryIndex.get(cur))
          }
        }
        return acc
      }, []).sort((a, b) => a - b)

      state.index = index || 0
    }

    const handleClick = (index) => {
      const element = state.elements[index]
      const { top } = state.rootElement.getBoundingClientRect()
      const { top: targetTop } = element.getBoundingClientRect()
      state.rootElement.scroll(0, state.rootElement.scrollTop + (targetTop - top))
    }

    onMounted(() => {
      const [rootElement] = document.getElementsByClassName(root.value)
      state.rootElement = rootElement

      const options = {
        root: rootElement,
        rootMargin: '0px',
        threshold: buildThresholdList()
      }

      state.observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, intersectionRatio }) => {
          state.entryRatio.set(target, intersectionRatio)
        })
        setActive()
      }, options)

      observeElements()
    })

    watch(value, () => {
      observeElements()
    })

    return {
      ...toRefs(state),
      handleClick
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/theme';

.anchor {
  position: fixed;
  box-sizing: border-box;
  padding: 0 12px;
  margin: 0;
  border-left: 2px solid #f0f0f0;

  &:before {
    position: relative;
    display: block;
    width: 2px;
    height: 100%;
    margin: 0 auto;
    background-color: #f0f0f0;
    content: '';
  }

  &__item {
    position: relative;
    list-style: none;
    text-align: left;
    line-height: 2em;
    cursor: pointer;
    margin-left: 6px;

    &:before {
      position: absolute;
      display: none;
      width: 4px;
      height: 4px;
      border: 2px solid $primary;
      border-radius: 4px;
      top: calc(50% - 2px);
      left: -23px;
      background: white;
      content: '';
    }

    &--active {
      color: $primary;

      &.anchor__item:before {
        display: block;
      }
    }
  }
}
</style>
