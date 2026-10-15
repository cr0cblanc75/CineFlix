<script setup>
const links = [
  { to: '/', label: 'Discover', exact: true },
  { to: '/lists', label: 'My Lists' },
]
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto grid h-[62px] max-w-[1280px] grid-cols-3 items-center px-6">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
          </svg>
        </span>
        <span class="text-xl font-extrabold tracking-tight">CineFlix</span>
      </RouterLink>

      <!-- Navigation -->
      <nav class="flex justify-center gap-8 text-sm font-medium">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-slate-500 transition-colors hover:text-slate-900"
          :active-class="link.exact ? '' : '!font-semibold !text-slate-900'"
          :exact-active-class="link.exact ? '!font-semibold !text-slate-900' : ''"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Avatar -->
      <div class="flex justify-end">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
          JD
        </span>
      </div>
    </div>
  </header>
</template>
