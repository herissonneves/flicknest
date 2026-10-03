import { tmdbGet } from './tmdb.client.ts'
import type { TmdbMovieDto, TmdbPaginatedResponse } from './tmdb.types.ts'
import { mapMovieToMediaItem } from './tmdb.mappers.ts'
import type { MediaItem } from '../../types/media.ts'

export async function getPopularMovies(
  signal?: AbortSignal,
): Promise<MediaItem[]> {
  const response = await tmdbGet<TmdbPaginatedResponse<TmdbMovieDto>>(
    '/movie/popular?language=pt-BR&page=1',
    signal,
  )

  return response.results.map(mapMovieToMediaItem)
}
