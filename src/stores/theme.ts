import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const themeName = ref<'light' | 'dark'>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  )

  function applyTheme() {
    document.documentElement.classList.toggle('dark', themeName.value === 'dark')
  }

  watch(
    themeName,
    (value) => {
      localStorage.setItem('theme', value)
      applyTheme()
    },
    { immediate: true },
  )

  function toggleTheme() {
    themeName.value = themeName.value === 'light' ? 'dark' : 'light'
  }

  return { themeName, toggleTheme }
})
