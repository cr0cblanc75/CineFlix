<script setup>
import { nextTick, onBeforeUnmount, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMoviesStore } from '../stores/movies'
import { useLibraryStore } from '../stores/library'
import NavBar from '../components/NavBar.vue'
import FilmTile from '../components/FilmTile.vue'
import LibraryCard from '../components/LibraryCard.vue'
import CreateLibraryDialog from '../components/CreateLibraryDialog.vue'


const router = useRouter()
const movies = useMoviesStore()
const library = useLibraryStore()
const creating = ref(false)

const observer = new ResizeObserver(updateArrows)
const scroller = ref(null)
const canLeft = ref(false)
const canRight = ref(false)


function create(data) {
  const lib = library.createLibrary(data)
  creating.value = false
  router.push(`/lists/${lib.id}`)
}

/* FAVORITE SCROLL */
watch(scroller, (el, prev) => {
  if (prev) observer.unobserve(prev)
  if (el) {
    observer.observe(el)
    updateArrows()
  }
})

function updateArrows() {
  const el = scroller.value
  if (!el) return
  canLeft.value = el.scrollLeft > 4
  canRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

function scrollByPage(dir) {
  const el = scroller.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}

// Recalcule when the list of Favorite changes
watch(
  () => movies.favorites.length,
  () => nextTick(updateArrows),
)
onBeforeUnmount(() => observer.disconnect())

// Fade of 72px on the border left/right, only when there is content on that side
const fadeMask = computed(() => {
  const left = canLeft.value ? 'transparent 0px, #000 72px' : '#000 0px, #000 72px'
  const right = canRight.value ? '#000 calc(100% - 72px), transparent 100%' : '#000 calc(100% - 72px), #000 100%'
  const mask = `linear-gradient(to right, ${left}, ${right})`
  return { maskImage: mask, WebkitMaskImage: mask }
})

</script>

<template>
  <NavBar />

  <main class="mx-auto max-w-[1280px] px-6 py-10 md:px-10">
    <h1 class="text-3xl font-extrabold tracking-tight">Library Hub</h1>
    <p class="mt-2 text-sm text-slate-500">
      Browse every collection you've built and jump straight into your favourites.
    </p>

    <!-- Favourites -->
    <section class="mt-10">
      <div class="flex items-baseline justify-between">
        <h2 class="text-lg font-bold">Favourites library</h2>
        <RouterLink to="/lists/favourites" class="text-xs font-medium text-brand hover:underline">
          {{ movies.favorites.length }} film{{ movies.favorites.length === 1 ? '' : 's' }} • view all
        </RouterLink>
      </div>

      <p v-if="!movies.favorites.length" class="mt-5 text-sm text-slate-500">
        No favourites : click on « Add to Favourite » on the film page, or on the heart icon on a movie poster.
      </p>
      <div v-else class="relative mt-5">
        <button v-if="canLeft" class="absolute -left-5 top-[45%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-colors hover:bg-slate-50 md:-left-7" aria-label="Scroll left" @click="scrollByPage(-1)">
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div ref="scroller" class="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" :style="fadeMask" @scroll.passive="updateArrows">
          <div v-for="m in movies.favorites" :key="m.imdbID" class="w-40 shrink-0 snap-start md:w-44 lg:w-[calc((100%-5rem)/5)]">
            <FilmTile :movie="m" />
          </div>
        </div>

        <button v-if="canRight" class="absolute -right-5 top-[45%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-colors hover:bg-slate-50 md:-right-7" aria-label="Scroll right" @click="scrollByPage(1)">
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>

    <!-- My libraries -->
    <section class="mt-12">
      <div class="flex items-baseline justify-between">
        <h2 class="text-lg font-bold">My libraries</h2>
        <span class="text-xs font-medium text-brand">
          {{ library.libraries.length }} collection{{ library.libraries.length === 1 ? '' : 's' }}
        </span>
      </div>

      <button class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:cursor-pointer hover:brightness-110" @click="creating = true">
        <span class="text-base leading-none">+</span> Create library
      </button>

      <p v-if="!library.libraries.length" class="mt-6 text-sm text-slate-500">
        No library yet : create one per theme (Sci-Fi, Watch Later…).
      </p>
      <div v-else class="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <LibraryCard v-for="lib in library.libraries" :key="lib.id" :library="lib" />
      </div>
    </section>

    <CreateLibraryDialog v-if="creating" @close="creating = false" @submit="create" />
  </main>
</template>