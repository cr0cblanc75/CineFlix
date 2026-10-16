<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesStore } from '../stores/movies'
import { useLibraryStore } from '../stores/library'
import NavBar from '../components/NavBar.vue'
import FilmTile from '../components/FilmTile.vue'
import CreateLibraryDialog from '../components/CreateLibraryDialog.vue'
import MoveToLibraryDialog from '../components/MoveToLibraryDialog.vue'

const route = useRoute()
const router = useRouter()
const movies = useMoviesStore()
const library = useLibraryStore()

// /lists/favourites = special (the favourites), the others come from the store
const isFavourites = computed(() => route.params.id === 'favourites')
const lib = computed(() =>
    isFavourites.value
        ? { id: 'favourites', name: 'Favourites', description: 'Films you love the most.', movies: movies.favorites }
        : library.byId(String(route.params.id)),
)

const search = ref('')
const sort = ref('az')
const filterOpen = ref(false)
const renaming = ref(false)
const moving = ref(null)

const sorts = [
    { id: 'az', label: 'A-Z' },
    { id: 'za', label: 'Z-A' },
    { id: 'year', label: 'Year' },
    { id: 'unwatched', label: 'Unwatched → Watched' },
]

const visible = computed(() => {
    const q = search.value.trim().toLowerCase()
    const list = (lib.value?.movies ?? []).filter((m) => m.Title.toLowerCase().includes(q))
    const year = (m) => parseInt(m.Year) || 0
    const seen = (m) => (library.isWatched(m.imdbID) ? 1 : 0)
    return [...list].sort((a, b) => {
        switch (sort.value) {
            case 'za':
                return b.Title.localeCompare(a.Title)
            case 'year':
                return year(b) - year(a)
            case 'unwatched':
                return seen(a) - seen(b) || a.Title.localeCompare(b.Title)
            default:
                return a.Title.localeCompare(b.Title)
        }
    })
})

const total = computed(() => lib.value?.movies.length ?? 0)
const watchedCount = computed(() => (lib.value?.movies ?? []).filter((m) => library.isWatched(m.imdbID)).length)

function remove(movie) {
    if (isFavourites.value) movies.toggleFavorite(movie)
    else library.removeMovie(lib.value.id, movie.imdbID)
}

function rename(data) {
    library.renameLibrary(lib.value.id, data)
    renaming.value = false
}

function destroy() {
    if (confirm(`Supprimer la bibliothèque « ${lib.value.name} » ?`)) {
        library.deleteLibrary(lib.value.id)
        router.push('/lists')
    }
}
</script>

<template>
    <NavBar />

    <main class="mx-auto max-w-[1280px] px-6 py-8 md:px-10">
        <div v-if="!lib" class="py-20 text-center text-slate-500">
            Library not found.
            <RouterLink to="/lists" class="text-brand hover:underline">Return to My Lists</RouterLink>
        </div>

        <template v-else>
            <nav class="text-xs text-slate-500">
                <RouterLink to="/lists" class="hover:text-slate-900">My libraries</RouterLink>
                <span class="mx-1.5">/</span>
                <span class="font-semibold text-slate-900">{{ lib.name }}</span>
            </nav>

            <div class="mt-6 flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand">
                        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
                        </svg>
                    </span>
                    <div>
                        <h1 class="text-3xl font-extrabold tracking-tight">{{ lib.name }}</h1>
                        <p v-if="lib.description" class="mt-1 text-sm text-slate-500">{{ lib.description }}</p>
                    </div>
                </div>

                <div v-if="!isFavourites" class="flex gap-2">
                    <button class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50" @click="renaming = true">
                        Rename
                    </button>
                    <button class="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50" @click="destroy">
                        Delete library
                    </button>
                </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center gap-5 text-xs text-slate-500">
                <span class="rounded-full bg-orange-50 px-2.5 py-1 font-medium text-brand">
                    {{ total }} film{{ total === 1 ? '' : 's' }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                    <i class="h-1.5 w-1.5 rounded-full bg-emerald-500"></i>{{ watchedCount }} watched
                </span>
                <span class="inline-flex items-center gap-1.5">
                    <i class="h-1.5 w-1.5 rounded-full bg-slate-400"></i>{{ total - watchedCount }} not watched
                </span>
            </div>

            <!-- Search + Filter -->
            <div class="mt-6 flex items-center gap-3">
                <input v-model="search" placeholder="Search films..." class="w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-brand focus:outline-none" />
                <div class="relative">
                    <button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50" @click="filterOpen = !filterOpen">
                        Filter ▾
                    </button>
                    <template v-if="filterOpen">
                        <div class="fixed inset-0 z-10" @click="filterOpen = false"></div>
                        <ul class="absolute left-0 z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 text-xs shadow-lg">
                            <li v-for="s in sorts" :key="s.id">
                                <button class="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-50" :class="sort === s.id ? 'bg-orange-50 font-semibold text-brand' : ''" @click="sort = s.id; filterOpen = false">
                                    {{ s.label }}
                                    <span v-if="sort === s.id">✓</span>
                                </button>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>

            <!-- Grid -->
            <p v-if="!visible.length" class="mt-10 text-sm text-slate-500">
                {{ total ? 'No film matches your search.' : 'This library is empty : add films from the movie page (« Add to List »).' }}
            </p>
            <div v-else class="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
                <FilmTile v-for="m in visible" :key="m.imdbID" :movie="m" actions :show-favorite="!isFavourites" :remove-label="isFavourites ? 'Remove from Favourites' : 'Remove from library'" @move="moving = m" @remove="remove(m)" />
            </div>
        </template>

        <CreateLibraryDialog v-if="renaming && lib" title="Rename Library" subtitle="Change the name or description of this library." confirm-label="Save" :initial-name="lib.name" :initial-description="lib.description" @close="renaming = false" @submit="rename" />
        <MoveToLibraryDialog v-if="moving" :movie="moving" @close="moving = null" />
    </main>
</template>