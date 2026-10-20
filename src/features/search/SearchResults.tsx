import { useEffect, useId, useState } from 'react'
import { searchMovies } from '../../api/tmdb/movies.service.ts'
import { searchTvShows } from '../../api/tmdb/tv.service.ts'
import { searchAllMedia } from '../../api/tmdb/search.service.ts'
import MediaCard from '../../components/MediaCard/MediaCard.tsx'
import type { MediaSearchResult, MediaType } from '../../types/media.ts'
import styles from './SearchResults.module.css'

interface SearchResultsProps {
  query: string
  mediaType: 'all' | MediaType
  page: number
  onSettled: (result: MediaSearchResult | null) => void
}

const searchServices = {
  all: searchAllMedia,
  movie: searchMovies,
  tv: searchTvShows,
}

function SearchResults({
  query,
  mediaType,
  page,
  onSettled,
}: SearchResultsProps) {
  const [result, setResult] = useState<MediaSearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const headingId = useId()

  useEffect(() => {
    const controller = new AbortController()

    searchServices[mediaType](query, page, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          setResult(response)
          onSettled(response)
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os resultados.',
        )
        onSettled(null)
      })

    return () => controller.abort()
  }, [query, mediaType, page, onSettled])

  if (error !== null) {
    return <p role="alert">{error}</p>
  }

  if (result === null) {
    return <p role="status">Carregando resultados...</p>
  }

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <h2 className={styles.heading} id={headingId}>
        Resultados
      </h2>

      {result.items.length === 0 ? (
        <p role="status">Nenhum filme ou série nesta página.</p>
      ) : (
        <div className={styles.mediaGrid}>
          {result.items.map((media) => (
            <MediaCard key={`${media.type}-${media.id}`} media={media} />
          ))}
        </div>
      )}
    </section>
  )
}

export default SearchResults
