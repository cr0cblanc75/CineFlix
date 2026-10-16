/**
 * URL of a film : title readable + IMDb identifier.
 * Ex. "Oppenheimer" (tt15398776) -> "oppenheimer-tt15398776"
 * The identifier at the end avoids ambiguities between films of the same title
 * and allows to find the film in OMDb.
 */
export function movieSlug(movie) {
  const title = (movie.Title || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // erase the accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return title ? `${title}-${movie.imdbID}` : movie.imdbID
}

/** "oppenheimer-tt15398776" -> "tt15398776" (ou null si invalide) */
export function idFromSlug(slug) {
  const match = /(tt\d+)$/.exec(slug || '')
  return match ? match[1] : null
}
