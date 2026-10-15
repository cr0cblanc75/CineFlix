import { defineStore } from 'pinia'
import { getMovieById, searchMovies } from '../api/omdb'

// OMDb has no endpoint "tendances" sur we use a smart selection of movies
const TRENDING_IDS = [
  'tt15398776', // Oppenheimer
  'tt1160419', // Dune
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt1856101', // Blade Runner 2049
]

const MAX_RESULTS = 20

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    trending: [],
    results: [],
    query: '',
    loading: false,
    error: null,
    favorites: JSON.parse(localStorage.getItem('cineflix:favorites') || '[]'),
  }),

  getters: {
    isFavorite: (state) => (id) => state.favorites.some((m) => m.imdbID === id),
    isSearching: (state) => state.query.trim().length > 0,
    // What is display under the Hero section: trending movies or search results
    displayed: (state) => (state.query.trim() ? state.results : state.trending),
  },

  actions: {
    async fetchTrending() {
      this.loading = true
      this.error = null
      try {
        this.trending = await Promise.all(TRENDING_IDS.map(getMovieById))
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async search(query) {
      this.query = query
      if (!query.trim()) {
        this.results = []
        this.error = null
        return
      }
      this.loading = true
      this.error = null
      try {
        const list = await searchMovies(query.trim())
        // The search does not return genre/director : we fetch the details
        this.results = await Promise.all(
          list.slice(0, MAX_RESULTS).map((m) => getMovieById(m.imdbID)),
        )
      } catch (e) {
        this.results = []
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    toggleFavorite(movie) {
      const i = this.favorites.findIndex((m) => m.imdbID === movie.imdbID)
      if (i >= 0) this.favorites.splice(i, 1)
      else this.favorites.push(movie)
      localStorage.setItem('cineflix:favorites', JSON.stringify(this.favorites))
    },
  },
})
