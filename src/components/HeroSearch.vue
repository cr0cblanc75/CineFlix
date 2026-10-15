<script setup>
import { ref } from 'vue'
import { useMoviesStore } from '../stores/movies'

const store = useMoviesStore()
const input = ref('')

function submit() {
  store.search(input.value)
}
</script>

<template>
  <section class="relative overflow-hidden bg-slate-950">
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('../../public/hero.jpg')"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-orange-950/40 to-black/80"></div>

    <div class="relative mx-auto max-w-[1280px] px-6 py-22">
      <h1 class="text-2xl font-extrabold tracking-tight text-white md:text-5xl">
        Find your next favorite film.
      </h1>
      <p class="mt-6 text-base text-white/90">
        Discover new releases, hidden gems, and timeless classics from around the world.
      </p>

      <form class="mt-8 flex max-w-[720px] items-center gap-3 rounded-full bg-white p-2 pl-6 shadow-lg" @submit.prevent="submit">
        <!-- SVG hard code to have a fast loading for the browser -->
        <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input v-model="input" type="text" placeholder="Search for movies" class="min-w-0 flex-1 bg-transparent text-slate-900 placeholder:text-slate-500 focus:outline-none" />
        <button type="submit" class="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          Search
        </button>
      </form>
    </div>
  </section>
</template>
