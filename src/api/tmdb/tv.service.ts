import { tmdbGet } from './tmdb.client.ts'
import type { TmdbPaginatedResponse, TmdbTvDto } from './tmdb.types.ts'
import { mapTvToMediaItem } from './tmdb.mappers.ts'
import type { MediaItem } from '../../types/media.ts'

export async function getPopularTvShows(
  signal?: AbortSignal,
): Promise<MediaItem[]> {
  const response = await tmdbGet<TmdbPaginatedResponse<TmdbTvDto>>(
    '/tv/popular?language=pt-BR&page=1',
    signal,
  )

  return response.results.map(mapTvToMediaItem)
}
