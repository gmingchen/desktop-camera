import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => {
    return {
      counter: 0
    }
  },
  getters: {},
  actions: {}
})
