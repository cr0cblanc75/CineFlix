<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '../stores/movies'
import { idFromSlug } from '../utils/slug'
import NavBar from '../components/NavBar.vue'
import { useLibraryStore } from '../stores/library'
import MoveToLibraryDialog from '../components/MoveToLibraryDialog.vue'

const library = useLibraryStore()
const showPicker = ref(false)

const route = useRoute()
const store = useMoviesStore()
const tab = ref('story')

watch(
  () => route.params.slug,
  (slug) => {
    tab.value = 'story'
    store.fetchMovie(idFromSlug(String(slug)))
  },
  { immediate: true },
)

const val = (v) => (v && v !== 'N/A' ? v : null)

const movie = computed(() => store.current)
const hasPoster = computed(() => !!val(movie.value?.Poster))
const tag = computed(() => val(movie.value?.Genre)?.split(', ').slice(0, 2).join(' • '))
const meta = computed(() => [val(movie.value?.Year), val(movie.value?.Runtime)].filter(Boolean).join(' • '))
const plot = computed(() => val(movie.value?.Plot))
const ratings = computed(() => movie.value?.Ratings || [])

const wins = computed(() => {
  const awards = val(movie.value?.Awards)
  if (!awards) return null
  const m = /(\d+)\s+wins?/i.exec(awards) || /Won\s+(\d+)/i.exec(awards)
  return m ? m[1] : '—'
})

const moreInfo = computed(() => {
  const m = movie.value
  if (!m) return []
  return [
    { label: 'Production', value: val(m.Production) },
    { label: 'Box Office', value: val(m.BoxOffice) },
    { label: 'Languages', value: val(m.Language) },
    { label: 'Country', value: val(m.Country) },
    { label: 'Rated', value: val(m.Rated) },
  ].filter((i) => i.value)
})
</script>

<template>
  <NavBar />
  <MoveToLibraryDialog v-if="showPicker && movie" :movie="movie" @close="showPicker = false" />

  <main class="mx-auto max-w-[1280px] px-4 py-8">
    <RouterLink to="/" class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Movies
    </RouterLink>

    <!-- Loading -->
    <div v-if="store.detailLoading" class="mt-10 grid animate-pulse gap-12 md:grid-cols-[330px_1fr]">
      <div class="aspect-[2/3] rounded-2xl bg-slate-200"></div>
      <div class="space-y-4">
        <div class="h-5 w-40 rounded bg-slate-200"></div>
        <div class="h-12 w-2/3 rounded bg-slate-200"></div>
        <div class="h-4 w-full rounded bg-slate-200"></div>
        <div class="h-4 w-5/6 rounded bg-slate-200"></div>
      </div>
    </div>

    <!-- Erreur -->
    <p v-else-if="store.detailError" class="mt-10 rounded-lg bg-red-50 p-4 text-sm text-red-700">
      {{ store.detailError }}
    </p>

    <template v-else-if="movie">
      <div class="mt-8 grid gap-10 md:grid-cols-[330px_1fr] md:gap-12">
        <!-- Poster -->
        <div>
          <img v-if="hasPoster" :src="movie.Poster" :alt="movie.Title" class="w-full rounded-2xl object-cover shadow-xl" />
          <div v-else class="flex aspect-[2/3] items-center justify-center rounded-2xl bg-slate-200 text-sm text-slate-500">
            No poster available
          </div>
        </div>



        <!-- Upper -->
        <div>
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <span v-if="tag" class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-brand">{{ tag }}</span>
            <span class="text-slate-500">{{ meta }}</span>
          </div>

          <h1 class="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl text-[var(--color-text-LB)]">{{ movie.Title }}</h1>

          <p v-if="plot" class="mt-4 mb-6 line-clamp-3 text-base leading-relaxed text-slate-500">
            {{ plot }}
          </p>


          <!-- Movie Details -->
          <div class="mt-8 space-y-6">

            <!-- Director / Release -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div v-if="val(movie.Director)" class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="var(--color-slate-600)" stroke-width="1.8">
                    <rect x="3" y="7" width="18" height="14" rx="2" />
                    <path d="M7 7V4h10v3M8 12h8M8 16h5" />
                  </svg>
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Director
                  </p>
                  <p class="mt-1 text-sm font-semibold text-[var(--color-text-LB)]">
                    {{ movie.Director }}
                  </p>
                </div>
              </div>

              <div v-if="val(movie.Released)" class="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Release date
                  </p>
                  <p class="mt-1 text-sm font-semibold text-[var(--color-text-LB)]">
                    {{ movie.Released }}
                  </p>
                </div>
              </div>
            </div>


            <!-- Cast -->
            <div v-if="val(movie.Actors)" class="flex items-start gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Cast
                </p>
                <p class="mt-1 text-sm leading-relaxed text-slate-700">
                  {{ movie.Actors }}
                </p>
              </div>
            </div>

            <!-- Rating -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div v-if="val(movie.imdbRating)" class="flex items-center gap-4 rounded-xl border border-amber-200/70 bg-amber-50/60 dark:bg-amber-900/40 dark:border-amber-600/50 p-3">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                  <svg viewBox="0 0 24 24" class="h-7 w-7" fill="currentColor">
                    <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
                  </svg>
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-medium uppercase tracking-wider text-amber-800">
                    IMDb rating
                  </p>
                  <p class="mt-0.5 text-2xl font-extrabold tracking-tight text-[var(--color-text-LB)]">
                    {{ movie.imdbRating }}
                    <span class="text-sm font-medium text-slate-500">/ 10</span>
                  </p>
                  <p v-if="val(movie.imdbVotes)" class="mt-0.5 text-xs text-slate-500">
                    {{ movie.imdbVotes }} votes
                  </p>
                </div>
              </div>

              <!-- Awards -->
              <div v-if="wins" class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                    <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
                  </svg>
                </div>

                <div class="min-w-0">
                  <p class="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Awards
                  </p>
                  <p class="mt-0.5 text-2xl font-extrabold tracking-tight text-[var(--color-text-LB)]">
                    {{ wins }}
                  </p>
                  <p class="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {{ movie.Awards }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3 border-t border-[var(--color-slate-300)] pt-5 sm:flex-row">

              <button class="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5" :class="store.isFavorite(movie.imdbID)
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                : 'bg-brand text-white shadow-sm hover:bg-brand-dark'" @click="store.toggleFavorite(movie)">
                <svg viewBox="0 0 24 24" class="h-5 w-5" :fill="store.isFavorite(movie.imdbID) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                </svg>
                {{ store.isFavorite(movie.imdbID)
                  ? 'In Favourites'
                  : 'Add to Favourites' }}
              </button>

              <button class="inline-flex items-center gap-2 rounded-full border border-[var(--color-slate-300)] bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-slate-50" @click="showPicker = true">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path v-if="library.librariesOf(movie.imdbID).length" d="M5 12l5 5L20 7" />
                  <path v-else d="M12 5v14M5 12h14" />
                </svg>
                {{ library.librariesOf(movie.imdbID).length ? 'In a Library' : 'Add to List' }}
              </button>
            </div>

          </div>

        </div>
      </div>



      <!-- Bottom -->
      <div class="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">

        <!-- Story / Reviews -->
        <div class="min-w-0">
          <div class="flex gap-6 border-b border-[var(--color-slate-300)] text-sm">
            <button v-for="t in [
              { id: 'story', label: 'Story' },
              { id: 'reviews', label: 'Reviews' },
            ]" :key="t.id" class="border-b-2 pb-3 transition-colors" :class="tab === t.id
              ? 'border-brand font-semibold text-[var(--color-slate-900)]'
              : 'border-transparent text-[var(--color-slate-500)] hover:text-[var(--color-slate-900)]'" @click="tab = t.id">
              {{ t.label }}
            </button>
          </div>

          <!-- Story -->
          <section v-if="tab === 'story'" class="mt-6">
            <h2 class="text-2xl font-bold tracking-tight">Story</h2>
            <p class="mt-3 max-w-4xl leading-relaxed text-slate-500">
              {{ plot || 'No plot summary available.' }}
            </p>
          </section>

          <!-- Reviews -->
          <section v-else class="mt-6">
            <h2 class="text-2xl font-bold tracking-tight">Reviews</h2>

            <p v-if="!ratings.length" class="mt-3 text-slate-500">
              No reviews available.
            </p>

            <div v-else class="mt-4 grid gap-4 sm:grid-cols-2">
              <div v-for="r in ratings" :key="r.Source" class="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p class="text-xs text-slate-500">{{ r.Source }}</p>
                <p class="mt-1 text-xl font-bold">{{ r.Value }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- More Info -->
        <aside v-if="moreInfo.length" class="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h2 class="text-xl font-bold tracking-tight">More Info</h2>

          <div class="mt-4 divide-y divide-slate-100">
            <div v-for="info in moreInfo" :key="info.label" class="py-3 first:pt-0 last:pb-0">
              <p class="text-xs text-[var(--color-slate-500)]">{{ info.label }}</p>
              <p class="mt-1 break-words text-sm font-semibold text-[var(--color-text-LB)]">
                {{ info.value }}
              </p>
            </div>
          </div>
        </aside>

      </div>


    </template>
  </main>
</template>
