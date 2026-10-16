const BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

async function request(params) {
    if (!API_KEY || API_KEY === "ta_cle_omdb_ici") {
        throw new Error("API OMDb key missing : log as VITE_OMDB_API_KEY in a file .env at the root of the project");
    }
    const url = new URL(BASE_URL);
    url.search = new URLSearchParams({ apikey: API_KEY, ...params }).toString();

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur réseau (${res.status})`);
    const data = await res.json();
    if (data.Response === "False") throw new Error(data.Error || "Aucun résultat");
    return data;
}

/** Get full details of a movie (genre, director, etc.) */
export function getMovieById(imdbID) {
    return request({ i: imdbID });
}

/** Search by title : return a "small" list (no gender or director) */
export async function searchMovies(query, page = 1) {
    const data = await request({ s: query, type: "movie", page });

    return {
        movies: data.Search || [],
        totalResults: Number(data.totalResults || 0),
    };
}
