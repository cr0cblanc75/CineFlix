import { defineStore } from "pinia";
import { getMovieById, searchMovies } from "../api/omdb";

// OMDb has no endpoint "tendances" : with use a fine set selection of films
const TRENDING_IDS = [
    "tt15398776", // Oppenheimer
    "tt1160419", // Dune
    "tt1375666", // Inception
    "tt0816692", // Interstellar
    "tt1856101", // Blade Runner 2049
];

const MAX_RESULTS = 20;

function load(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
        return [];
    }
}

function toggleIn(list, movie) {
    const i = list.findIndex((m) => m.imdbID === movie.imdbID);
    if (i >= 0) list.splice(i, 1);
    else list.push(movie);
}

export const useMoviesStore = defineStore("movies", {
    state: () => ({
        trending: [],
        results: [],
        query: "",
        loading: false,
        error: null,
        // Detail page
        current: null,
        detailLoading: false,
        detailError: null,
        detailsCache: {},
        // User lists
        favorites: load("cineflix:favorites"),
        watchlist: load("cineflix:watchlist"),
    }),

    getters: {
        isFavorite: (state) => (id) => state.favorites.some((m) => m.imdbID === id),
        isInWatchlist: (state) => (id) => state.watchlist.some((m) => m.imdbID === id),
        isSearching: (state) => state.query.trim().length > 0,
        // What is displayed under the hero : search results or trends
        displayed: (state) => (state.query.trim() ? state.results : state.trending),
    },

    actions: {
        async fetchTrending() {
            this.loading = true;
            this.error = null;
            try {
                this.trending = await Promise.all(TRENDING_IDS.map((id) => getMovieById(id)));
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },

        async search(query) {
            this.query = query;
            if (!query.trim()) {
                this.results = [];
                this.error = null;
                return;
            }
            this.loading = true;
            this.error = null;
            try {
                const list = await searchMovies(query.trim());
                // The search don't return genre/director : we fetch the details
                this.results = await Promise.all(list.slice(0, MAX_RESULTS).map((m) => getMovieById(m.imdbID)));
            } catch (e) {
                this.results = [];
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },

        /** Load a film for the Detail page (with a cache to avoid re-consuming the quota) */
        async fetchMovie(imdbID) {
            this.detailError = null;
            if (!imdbID) {
                this.current = null;
                this.detailError = "Film introuvable.";
                return;
            }
            if (this.detailsCache[imdbID]) {
                this.current = this.detailsCache[imdbID];
                return;
            }
            this.current = null;
            this.detailLoading = true;
            try {
                const movie = await getMovieById(imdbID, "full");
                this.detailsCache[imdbID] = movie;
                this.current = movie;
            } catch (e) {
                this.detailError = e.message;
            } finally {
                this.detailLoading = false;
            }
        },

        toggleFavorite(movie) {
            toggleIn(this.favorites, movie);
            localStorage.setItem("cineflix:favorites", JSON.stringify(this.favorites));
        },

        toggleWatchlist(movie) {
            toggleIn(this.watchlist, movie);
            localStorage.setItem("cineflix:watchlist", JSON.stringify(this.watchlist));
        },
    },
});
