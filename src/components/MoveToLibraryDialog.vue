<script setup>
import { computed, ref } from 'vue'
import { useLibraryStore } from '../stores/library'
import BaseModal from './BaseModal.vue'
import CreateLibraryDialog from './CreateLibraryDialog.vue'
import LibraryIcon from '@/assets/Library-Icon.svg?component'

const props = defineProps({ movie: { type: Object, required: true } })
const emit = defineEmits(['close'])
const library = useLibraryStore()

const selected = ref(library.librariesOf(props.movie.imdbID).map((l) => l.id))
const search = ref('')
const creating = ref(false)

const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return q ? library.libraries.filter((l) => l.name.toLowerCase().includes(q)) : library.libraries
})

function toggle(id) {
    const i = selected.value.indexOf(id)
    if (i >= 0) selected.value.splice(i, 1)
    else selected.value.push(id)
}

function onCreate(data) {
    const lib = library.createLibrary(data)
    selected.value.push(lib.id)
    creating.value = false
}

function confirm() {
    library.setMovieLibraries(props.movie, selected.value)
    emit('close')
}
</script>

<template>
    <BaseModal @close="emit('close')">
        <h2 class="text-sm font-bold">Move to film library</h2>
        <p class="mt-0.5 truncate text-xs text-slate-500">{{ movie.Title }}</p>

        <input v-model="search" placeholder="Search film collections" class="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-brand focus:outline-none" />

        <div class="mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span>All collections</span>
            <span>{{ library.libraries.length }} collections</span>
        </div>

        <ul class="mt-2 max-h-64 space-y-2 overflow-y-auto">
            <li v-for="lib in filtered" :key="lib.id">
                <button class="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors" :class="selected.includes(lib.id) ? 'border-brand bg-orange-50/50' : 'border-slate-200 hover:bg-slate-50'" @click="toggle(lib.id)">
                    <LibraryIcon class="h-8 w-8 shrink-0 text-slate-400" />
                    <span class="min-w-0 flex-1">
                        <span class="block truncate text-xs font-semibold">{{ lib.name }}</span>
                        <span class="block text-[11px] text-slate-500">
                            {{ lib.movies.length }} film{{ lib.movies.length === 1 ? '' : 's' }}
                        </span>
                    </span>
                    <span class="flex h-5 w-5 items-center justify-center rounded-full border" :class="selected.includes(lib.id) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'">
                        <svg v-if="selected.includes(lib.id)" viewBox="0 0 24 24" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="3">
                            <path d="M5 12l5 5L20 7" />
                        </svg>
                    </span>
                </button>
            </li>
            <li v-if="!filtered.length" class="py-6 text-center text-xs text-slate-500">
                No Library. Create one below.
            </li>
        </ul>

        <div class="mt-5 flex items-center justify-between">
            <button class="text-xs font-medium text-brand hover:text-brand-dark" @click="creating = true">
                + New library
            </button>
            <div class="flex items-center gap-3">
                <button class="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900" @click="emit('close')">
                    Cancel
                </button>
                <button class="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white" @click="confirm">
                    Add to collection
                </button>
            </div>
        </div>

        <CreateLibraryDialog v-if="creating" title="Move to New Library" subtitle="Create a new library to move this film into, or choose from existing collections above." confirm-label="Create & Move" @close="creating = false" @submit="onCreate" />
    </BaseModal>
</template>