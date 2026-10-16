<script setup>
import { ref } from 'vue'
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

function create(data) {
  const lib = library.createLibrary(data)
  creating.value = false
  router.push(`/lists/${lib.id}`)
}
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
      <div v-else class="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        <FilmTile v-for="m in movies.favorites.slice(0, 5)" :key="m.imdbID" :movie="m" />
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

      <button class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark" @click="creating = true">
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