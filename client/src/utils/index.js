import { mapMutations, useStore } from 'vuex'

export function useMutations (mutations) {
  const $store = useStore()
  if (!Array.isArray(mutations)) {
    console.error('[useMutations]: mapper parameter must be either an Array')
    return
  }
  return Object.values(mapMutations({ ...mutations })).map(fn => fn.bind({ $store }))
}
