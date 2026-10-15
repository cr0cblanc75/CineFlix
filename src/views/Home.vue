<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMoviesStore } from '../stores/movies'
import NavBar from '../components/NavBar.vue'
import HeroSearch from '../components/HeroSearch.vue'
import MovieGrid from '../components/MovieGrid.vue'

const store = useMoviesStore()
const view = ref('discover')

const gridTitle = computed(() =>
  store.isSearching ? `Résultats pour « ${store.query} »` : 'Trending Now',
)

onMounted(() => store.fetchTrending())
</script>

<template>
  <NavBar :view="view" @change="view = $event" />

  <template v-if="view === 'discover'">
    <HeroSearch />
    <MovieGrid :title="gridTitle" :movies="store.displayed" :loading="store.loading" :error="store.error" empty-text="Aucun film trouvé." />
  </template>

  <MovieGrid v-else title="My Lists" :movies="store.favorites" empty-text="Ta liste est vide : clique sur le cœur d'une affiche pour ajouter un film." />
</template>
