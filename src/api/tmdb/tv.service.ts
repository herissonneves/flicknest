import { tmdbGet } from './tmdb.client.ts'
import type { TmdbPaginatedResponse, TmdbTvDto } from './tmdb.types.ts'
import { mapTvToMediaItem } from './tmdb.mappers.ts'
import type { MediaItem, MediaSearchResult } from '../../types/media.ts'

export async function getPopularTvShows(
  signal?: AbortSignal,
): Promise<MediaItem[]> {
  const response = await tmdbGet<TmdbPaginatedResponse<TmdbTvDto>>(
    '/tv/popular?language=pt-BR&page=1',
    signal,
  )

  return response.results.map(mapTvToMediaItem)
}

export async function searchTvShows(
  query: string,
  page = 1,
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

  const response = await tmdbGet<TmdbPaginatedResponse<TmdbTvDto>>(
    `/search/tv?${params.toString()}`,
    signal,
  )

  return {
    items: response.results.map(mapTvToMediaItem),
    page: response.page,
    totalPages: Math.min(response.total_pages, 500),
  }
}
