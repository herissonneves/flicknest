import { tmdbGet } from './tmdb.client.ts'
import type { TmdbMultiResultDto, TmdbPaginatedResponse } from './tmdb.types.ts'
import { mapMovieToMediaItem, mapTvToMediaItem } from './tmdb.mappers.ts'
import type { MediaItem, MediaSearchResult } from '../../types/media.ts'

export async function searchAllMedia(
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

  const response = await tmdbGet<TmdbPaginatedResponse<TmdbMultiResultDto>>(
    `/search/multi?${params.toString()}`,
    signal,
  )

  const items: MediaItem[] = []

  for (const result of response.results) {
    if (result.media_type === 'movie') {
      items.push(mapMovieToMediaItem(result))
    } else if (result.media_type === 'tv') {
      items.push(mapTvToMediaItem(result))
    }
  }

  return {
    items,
    page: response.page,
    totalPages: Math.min(response.total_pages, 500),
  }
}
