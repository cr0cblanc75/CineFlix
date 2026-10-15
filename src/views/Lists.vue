<script setup>
import { useMoviesStore } from '../stores/movies'
import NavBar from '../components/NavBar.vue'
import MovieGrid from '../components/MovieGrid.vue'

const store = useMoviesStore()
</script>

<template>
  <NavBar />
  <MovieGrid title="Favourites" :movies="store.favorites" empty-text="No favourites : click on « Add to Favourite » on the film page, or on the heart icon on a movie poster." />
  <MovieGrid title="My List" :movies="store.watchlist" empty-text="Your list is empty : click on « Add to List » on the film page." />
</template>
