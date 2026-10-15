<script setup>
import MovieCard from './MovieCard.vue'

defineProps({
  title: { type: String, required: true },
  movies: { type: Array, default: () => [] },
  loading: Boolean,
  error: String,
  emptyText: { type: String, default: 'Aucun film à afficher.' },
})
</script>

<template>
  <section class="mx-auto max-w-[1280px] px-6 py-12">
    <h2 class="text-2xl font-bold tracking-tight">{{ title }}</h2>

    <!-- Chargement : squelettes -->
    <div v-if="loading" class="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      <div v-for="n in 5" :key="n" class="animate-pulse">
        <div class="aspect-[2/3] rounded-xl bg-slate-200"></div>
        <div class="mt-4 h-4 w-3/4 rounded bg-slate-200"></div>
        <div class="mt-2 h-3 w-1/2 rounded bg-slate-200"></div>
      </div>
    </div>

    <p v-else-if="error" class="mt-8 rounded-lg bg-red-50 p-4 text-sm text-red-700">{{ error }}</p>

    <p v-else-if="!movies.length" class="mt-8 text-slate-500">{{ emptyText }}</p>

    <div v-else class="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      <MovieCard v-for="movie in movies" :key="movie.imdbID" :movie="movie" />
    </div>
  </section>
</template>
