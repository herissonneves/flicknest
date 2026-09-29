export type MediaType = 'movie' | 'tv'

export interface MediaItem {
  id: number
  type: MediaType
  title: string
  year?: number
  posterUrl?: string
  overview?: string
  rating?: number
}
