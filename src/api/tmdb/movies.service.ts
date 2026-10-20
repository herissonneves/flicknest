import { tmdbGet } from './tmdb.client.ts'
import type { TmdbMovieDto, TmdbPaginatedResponse } from './tmdb.types.ts'
import { mapMovieToMediaItem } from './tmdb.mappers.ts'
import type { MediaItem, MediaSearchResult } from '../../types/media.ts'

export async function getPopularMovies(
  signal?: AbortSignal,
): Promise<MediaItem[]> {
  const response = await tmdbGet<TmdbPaginatedResponse<TmdbMovieDto>>(
    '/movie/popular?language=pt-BR&page=1',
    signal,
  )

  return response.results.map(mapMovieToMediaItem)
}

export async function searchMovies(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<MediaSearchResult> {
  const trimmedQuery = query.trim()

  if (trimmedQuery === '') {
    return {
      items: [],
      page: 1,
      totalPages: 0,
    }
  }

  if (!Number.isInteger(page) || page <= 0 || page > 500) {
    throw new RangeError('A página deve ser um inteiro entre 1 e 500.')
  }

  const params = new URLSearchParams({
    query: trimmedQuery,
    language: 'pt-BR',
    page: String(page),
    include_adult: 'false',
  })

  const response = await tmdbGet<TmdbPaginatedResponse<TmdbMovieDto>>(
    `/search/movie?${params.toString()}`,
    signal,
  )

  return {
    items: response.results.map(mapMovieToMediaItem),
    page: response.page,
    totalPages: Math.min(response.total_pages, 500),
  }
}
