<script setup>
import MovieCard from './MovieCard.vue'

defineProps({
  title: { type: String, required: true },
  movies: { type: Array, default: () => [] },
  loading: Boolean,
  loadingMore: Boolean,
  hasMore: Boolean,
  error: String,
  emptyText: { type: String, default: 'Aucun film à afficher.' },
})

defineEmits(['load-more'])
</script>

<template>
  <section class="mx-auto max-w-[1280px] px-6 py-12">
    <h2 class="text-2xl font-bold tracking-tight text-[var(--color-text-LB)]">{{ title }}</h2>

    <!-- Init fetch -->
    <div v-if="loading && !movies.length" class="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      <div v-for="n in 10" :key="n" class="animate-pulse">
        <div class="aspect-[2/3] rounded-xl bg-slate-200"></div>
        <div class="mt-4 h-4 w-3/4 rounded bg-slate-200"></div>
        <div class="mt-2 h-3 w-1/2 rounded bg-slate-200"></div>
      </div>
    </div>

    <p v-else-if="error && !movies.length" class="mt-8 rounded-lg bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </p>

    <p v-else-if="!movies.length" class="mt-8 text-slate-500">
      {{ emptyText }}
    </p>

    <template v-else>
      <!-- Already loaded films -->
      <div class="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        <MovieCard v-for="movie in movies" :key="movie.imdbID" :movie="movie" />
      </div>

      <!-- Error when loading more -->
      <p v-if="error" class="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {{ error }}
      </p>

      <!-- Bouton Load More -->
      <div v-if="hasMore" class="mt-10 flex justify-center">
        <button @click="$emit('load-more')" :disabled="loadingMore" class="rounded-full bg-white px-8 py-3 font-semibold text-slate-900
                 shadow transition hover:bg-slate-100
                 disabled:cursor-not-allowed disabled:opacity-50">
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>

      <p v-else-if="!loadingMore" class="mt-10 text-center text-sm text-slate-500">
        Every results have been loaded
      </p>
    </template>
  </section>
</template>
