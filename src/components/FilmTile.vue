<script setup>
import { computed, ref } from 'vue'
import { useMoviesStore } from '../stores/movies'
import { useLibraryStore } from '../stores/library'
import { movieSlug } from '../utils/slug'
import FolderIcon from '@/assets/Folder-Icon.svg?component'
import HeartIcon from '@/assets/Heart-Icon.svg?component'
import TrashIcon from '@/assets/Trash-Icon.svg?component'

const props = defineProps({
    movie: { type: Object, required: true },
    actions: Boolean, // displays the menu ⋮ and the Move / Remove buttons
    showFavorite: { type: Boolean, default: true },
    removeLabel: { type: String, default: 'Remove from library' },
})
const emit = defineEmits(['move', 'remove'])

const movies = useMoviesStore()
const library = useLibraryStore()
const menu = ref(false)

const poster = computed(() => (props.movie.Poster && props.movie.Poster !== 'N/A' ? props.movie.Poster : null))
const genres = computed(() => (props.movie.Genre || '').split(', ').slice(0, 2).join(', '))
const to = computed(() => ({ name: 'movie', params: { slug: movieSlug(props.movie) } }))
const fav = computed(() => movies.isFavorite(props.movie.imdbID))
const watched = computed(() => library.isWatched(props.movie.imdbID))

function act(name) {
    menu.value = false
    emit(name)
}
</script>

<template>
    <article>
        <div class="relative aspect-[2/3]">
            <RouterLink :to="to" class="block h-full w-full overflow-hidden rounded-xl bg-slate-200 shadow-sm">
                <img v-if="poster" :src="poster" :alt="movie.Title" loading="lazy" class="h-full w-full object-cover" />
                <div v-else class="flex h-full items-center justify-center p-4 text-center text-xs text-slate-500">
                    No poster available
                </div>
            </RouterLink>

            <!-- Menu -->
            <div v-if="actions" class="absolute left-2 top-2">
                <button class="flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75" aria-label="Actions" @click="menu = !menu">
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
                        <circle cx="12" cy="5" r="1.6" />
                        <circle cx="12" cy="12" r="1.6" />
                        <circle cx="12" cy="19" r="1.6" />
                    </svg>
                </button>


                <template v-if="menu">
                    <div class="fixed inset-0 z-10" @click="menu = false"></div>
                    <ul class="absolute left-0 z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 text-xs shadow-lg">
                        <li v-if="showFavorite">
                            <button class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50" @click="movies.toggleFavorite(movie); menu = false">
                                <HeartIcon class="h-4 w-4 shrink-0" />
                                {{ fav ? 'Remove from Favourites' : 'Add to Favourites' }}
                            </button>
                        </li>
                        <li>
                            <button class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50" @click="act('move')">
                                <FolderIcon class="h-4 w-4 shrink-0" />
                                Move to library
                            </button>
                        </li>
                        <li>
                            <button class="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50" @click="act('remove')">
                                <TrashIcon class="h-4 w-4 shrink-0" />
                                {{ removeLabel }}
                            </button>
                        </li>
                    </ul>
                </template>
            </div>

            <!-- Badge favorite -->
            <span v-if="fav" class="pointer-events-none absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
                <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="currentColor">
                    <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21Z" />
                </svg>
            </span>

            <!-- Badge watched / not watched (clickable) -->
            <button class="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white" :class="watched ? 'bg-emerald-500' : 'bg-black/70'" @click="library.toggleWatched(movie.imdbID)">
                {{ watched ? 'Watched' : 'Not watched' }}
            </button>
        </div>

        <!-- Text info of the film (under film poster)-->
        <h3 class="mt-3 truncate text-sm font-semibold">
            <RouterLink :to="to" class="hover:text-brand">{{ movie.Title }}</RouterLink>
        </h3>
        <p class="mt-0.5 truncate text-[11px] text-slate-500">
            {{ movie.Year }}<template v-if="genres"> • {{ genres }}</template>
        </p>

        <!-- Action Buttons (under film poster)-->
        <div v-if="actions" class="mt-2 flex gap-2">
            <button class="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium hover:bg-slate-50" @click="emit('move')">
                Move
            </button>
            <button class="rounded-md border border-red-200 bg-white px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50" @click="emit('remove')">
                Remove
            </button>
        </div>
    </article>
</template>