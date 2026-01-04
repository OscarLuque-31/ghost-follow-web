import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { name: string }
  }),
  actions: {
    login(name: string) {
      this.user = { name }
    },
    logout() {
      this.user = null
    }
  }
})
