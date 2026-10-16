import { defineStore } from "pinia";

const LS_LIBS = "cineflix:libraries";
const LS_WATCHED = "cineflix:watched";

function load(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const useLibraryStore = defineStore("library", {
    state: () => ({
        libraries: load(LS_LIBS, []), // { id, name, description, movies: [] }
        watched: load(LS_WATCHED, {}), // { [imdbID]: true }
    }),

    getters: {
        byId: (s) => (id) => s.libraries.find((l) => l.id === id),
        isWatched: (s) => (imdbID) => !!s.watched[imdbID],
        librariesOf: (s) => (imdbID) => s.libraries.filter((l) => l.movies.some((m) => m.imdbID === imdbID)),
    },

    actions: {
        persist() {
            localStorage.setItem(LS_LIBS, JSON.stringify(this.libraries));
            localStorage.setItem(LS_WATCHED, JSON.stringify(this.watched));
        },

        createLibrary({ name, description = "" }) {
            const lib = { id: uid(), name, description, movies: [] };
            this.libraries.push(lib);
            this.persist();
            return lib;
        },

        renameLibrary(id, { name, description }) {
            const lib = this.byId(id);
            if (!lib) return;
            lib.name = name;
            lib.description = description;
            this.persist();
        },

        deleteLibrary(id) {
            this.libraries = this.libraries.filter((l) => l.id !== id);
            this.persist();
        },

        removeMovie(id, imdbID) {
            const lib = this.byId(id);
            if (!lib) return;
            lib.movies = lib.movies.filter((m) => m.imdbID !== imdbID);
            this.persist();
        },

        /** Le film sera présent dans exactement les bibliothèques de `ids` */
        setMovieLibraries(movie, ids) {
            for (const lib of this.libraries) {
                const has = lib.movies.some((m) => m.imdbID === movie.imdbID);
                const should = ids.includes(lib.id);
                if (should && !has) lib.movies.push(movie);
                if (!should && has) lib.movies = lib.movies.filter((m) => m.imdbID !== movie.imdbID);
            }
            this.persist();
        },

        toggleWatched(imdbID) {
            if (this.watched[imdbID]) delete this.watched[imdbID];
            else this.watched[imdbID] = true;
            this.persist();
        },
    },
});
