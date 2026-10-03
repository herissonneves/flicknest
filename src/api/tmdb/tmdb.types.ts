export interface TmdbMovieDto {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview: string
  vote_average: number
  vote_count: number
}

export interface TmdbTvDto {
  id: number
  name: string
  first_air_date: string
  poster_path: string | null
  overview: string
  vote_average: number
  vote_count: number
}

export interface TmdbPaginatedResponse<TItem> {
  page: number
  results: TItem[]
  total_pages: number
  total_results: number
}
