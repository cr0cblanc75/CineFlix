import { defineStore } from "pinia";
import { getMovieById, searchMovies } from "../api/omdb";

// OMDb has no endpoint "tendances" : with use a fine set selection of films
const TRENDING_IDS = [
    "tt15398776", // Oppenheimer
    "tt33764258", // L'Odyssé
    "tt7526136", // Heart of the Beast
    "tt28535715", // Whalefall
    "tt28553375", // La Bataille de deGaulle
];

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
        // storing results
        trending: [],
        results: [],
        // result pagination
        page: 1,
        totalResults: 0,
        loadingMore: false,
        // result gaether
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
            this.page = 1;
            this.totalResults = 0;
            this.results = [];
            this.error = null;

            if (!query.trim()) {
                this.loading = false;
                return;
            }

            this.loading = true;

            try {
                const data = await searchMovies(query.trim(), 1);

                this.totalResults = data.totalResults;

                this.results = await Promise.all(data.movies.map((movie) => getMovieById(movie.imdbID)));
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },

        async loadMore() {
            if (this.loading || this.loadingMore || this.results.length >= this.totalResults) {
                return;
            }

            const requestedPage = this.page + 1;
            this.loadingMore = true;
            this.error = null;

            try {
                const data = await searchMovies(this.query.trim(), requestedPage);

                const movies = await Promise.all(data.movies.map((movie) => getMovieById(movie.imdbID)));

                this.results.push(...movies);
                this.page = requestedPage;
                this.totalResults = data.totalResults;
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loadingMore = false;
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
