/**
 * URL d'un film : titre lisible + identifiant IMDb.
 * Ex. "Oppenheimer" (tt15398776) -> "oppenheimer-tt15398776"
 * L'identifiant à la fin évite les ambiguïtés entre films de même titre
 * et permet de retrouver le film dans OMDb.
 */
export function movieSlug(movie) {
  const title = (movie.Title || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return title ? `${title}-${movie.imdbID}` : movie.imdbID
}

/** "oppenheimer-tt15398776" -> "tt15398776" (ou null si invalide) */
export function idFromSlug(slug) {
  const match = /(tt\d+)$/.exec(slug || '')
  return match ? match[1] : null
}
