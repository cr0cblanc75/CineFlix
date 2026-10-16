<script setup>
import { computed } from 'vue'

const props = defineProps({ library: { type: Object, required: true } })

// 4 emplacements fixes, vides si la bibliothèque a moins de 4 films
const slots = computed(() => Array.from({ length: 4 }, (_, i) => props.library.movies[i] || null))
const poster = (m) => (m && m.Poster && m.Poster !== 'N/A' ? m.Poster : null)
const n = computed(() => props.library.movies.length)
</script>

<template>
    <article class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
                </svg>
            </span>
            <h3 class="min-w-0 flex-1 truncate text-sm font-semibold">{{ library.name }}</h3>
            <span class="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-brand">
                {{ n }} film{{ n === 1 ? '' : 's' }}
            </span>
        </div>

        <p class="mt-3 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-500">
            {{ library.description || 'No description.' }}
        </p>

        <div class="mt-4 grid grid-cols-4 gap-2">
            <div v-for="(m, i) in slots" :key="i" class="aspect-[2/3] overflow-hidden rounded-md bg-slate-100">
                <img v-if="poster(m)" :src="poster(m)" :alt="m.Title" loading="lazy" class="h-full w-full object-cover" />
            </div>
        </div>

        <RouterLink :to="`/lists/${library.id}`" class="mt-4 block rounded-full border border-slate-200 py-2 text-center text-xs font-semibold transition-colors hover:bg-slate-50">
            Open library
        </RouterLink>
    </article>
</template>