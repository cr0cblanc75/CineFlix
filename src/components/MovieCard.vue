<script setup>
import { computed } from 'vue'
import { useMoviesStore } from '../stores/movies'

const props = defineProps({ movie: { type: Object, required: true } })
const store = useMoviesStore()

const hasPoster = computed(() => props.movie.Poster && props.movie.Poster !== 'N/A')
// "Sci-Fi, Action, Drama" -> "Sci-Fi, Action"
const genres = computed(() => (props.movie.Genre || '').split(', ').slice(0, 2).join(', '))
const director = computed(() => (props.movie.Director || '').split(', ')[0])
</script>

<template>
  <article class="group">
    <div class="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-200 shadow-sm">
      <img v-if="hasPoster" :src="movie.Poster" :alt="movie.Title" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div v-else class="flex h-full items-center justify-center p-4 text-center text-sm text-slate-500">
        Pas d'affiche
      </div>

      <button class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70" :class="{ '!opacity-100': store.isFavorite(movie.imdbID) }" :aria-label="store.isFavorite(movie.imdbID) ? 'Retirer de mes listes' : 'Ajouter à mes listes'" @click="store.toggleFavorite(movie)">
        <svg viewBox="0 0 24 24" class="h-5 w-5" :fill="store.isFavorite(movie.imdbID) ? '#f97316' : 'none'" :stroke="store.isFavorite(movie.imdbID) ? '#f97316' : 'currentColor'" stroke-width="2">
          <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21Z" />
        </svg>
      </button>
    </div>

    <h3 class="mt-4 text-base font-semibold leading-tight">{{ movie.Title }}</h3>
    <p class="mt-1 text-sm text-slate-500">
      {{ movie.Year }}<template v-if="genres"> • {{ genres }}</template>
    </p>
    <p v-if="director && director !== 'N/A'" class="mt-1 text-sm text-brand">Directed by {{ director }}</p>
  </article>
</template>
