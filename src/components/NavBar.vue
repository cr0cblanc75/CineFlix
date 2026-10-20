<script setup>
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
const links = [
  { to: '/', label: 'Discover', exact: true },
  { to: '/lists', label: 'My Lists' },
]
</script>

<template>
  <header class="border-b border-slate-200 dark:border-white/20">
    <div class="mx-auto grid h-[62px] max-w-[1280px] grid-cols-3 items-center px-6">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
          </svg>
        </span>
        <span class="text-xl font-extrabold tracking-tight text-[var(--color-text-LB)]">CineFlix</span>
      </RouterLink>

      <!-- Navigation -->
      <nav class="flex justify-center gap-8 text-sm font-medium">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-gray-300" :active-class="link.exact ? '' : '!font-semibold !text-[var(--color-text-LB)]'" :exact-active-class="link.exact ? '!font-semibold !text-[var(--color-text-LB)]' : ''">
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Theme + Avatar -->
      <div class="flex items-center justify-end gap-3">
        <!-- Theme Toggle -->
        <button type="button" class="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-LB)] transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-gray-600 dark:hover:text-gray-300" :aria-label="theme.themeName === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'" @click="theme.toggleTheme()">
          <svg v-if="theme.themeName === 'dark'" viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        </button>

        <!-- Avatar -->
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-400 text-xs font-semibold text-[var(--color-text-LB)]">
          JD
        </span>
      </div>
    </div>
  </header>
</template>
