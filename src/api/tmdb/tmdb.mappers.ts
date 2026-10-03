import type { TmdbMovieDto, TmdbTvDto } from './tmdb.types.ts'
import type { MediaItem } from '../../types/media.ts'

function extractYear(date: string): number | undefined {
  const year = date.slice(0, 4)

  if (!/^\d{4}$/.test(year) || year === '0000') {
    return undefined
  }

  return Number(year)
}

function buildPosterUrl(path: string | null): string | undefined {
  if (!path) {
    return undefined
  }

  return `https://image.tmdb.org/t/p/w500${path}`
}

export function mapTvToMediaItem(tv: TmdbTvDto): MediaItem {
  return {
    id: tv.id,
    type: 'tv',
    title: tv.name,
    year: extractYear(tv.first_air_date),
    posterUrl: buildPosterUrl(tv.poster_path),
    overview: tv.overview.trim() || undefined,
    rating: tv.vote_count > 0 ? tv.vote_average : undefined,
  }
}

export function mapMovieToMediaItem(movie: TmdbMovieDto): MediaItem {
  return {
    id: movie.id,
    type: 'movie',
    title: movie.title,
    year: extractYear(movie.release_date),
    posterUrl: buildPosterUrl(movie.poster_path),
    overview: movie.overview.trim() || undefined,
    rating: movie.vote_count > 0 ? movie.vote_average : undefined,
  }
}
