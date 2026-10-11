import type { MediaItem } from '../../types/media.ts'
import MediaCard from '../../components/MediaCard/MediaCard.tsx'
import { useEffect, useState } from 'react'
import { getPopularMovies } from '../../api/tmdb/movies.service.ts'
import { getPopularTvShows } from '../../api/tmdb/tv.service.ts'
import styles from './HomePage.module.css'
import { useNavigate } from 'react-router'
import SearchBar from '../../components/SearchBar/SearchBar.tsx'

function HomePage() {
  const [movies, setMovies] = useState<MediaItem[]>([])
  const [tvShows, setTvShows] = useState<MediaItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  function handleSearch(query: string) {
    const searchParams = new URLSearchParams({ q: query })

    navigate(`/search?${searchParams.toString()}`)
  }

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      getPopularMovies(controller.signal),
      getPopularTvShows(controller.signal),
    ])
      .then(([movieResults, tvResults]) => {
        if (!controller.signal.aborted) {
          setMovies(movieResults)
          setTvShows(tvResults)
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os conteúdos populares.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <>
      <h1>FlickNest</h1>
      <p>Seu lugar para descobrir e organizar filmes e séries</p>

      <SearchBar onSearch={handleSearch} />

      {isLoading && <p role="status">Carregando conteúdos populares...</p>}

      {!isLoading && error !== null && <p role="alert">{error}</p>}

      {!isLoading && error === null && (
        <>
          <section
            className={styles.section}
            aria-labelledby="popular-movies-heading"
          >
            <h2 className={styles.sectionTitle} id="popular-movies-heading">
              Filmes populares
            </h2>

            {movies.length === 0 ? (
              <p role="status">Nenhum filme popular encontrado.</p>
            ) : (
              <div className={styles.mediaGrid}>
                {movies.map((media) => (
                  <MediaCard key={`${media.type}-${media.id}`} media={media} />
                ))}
              </div>
            )}
          </section>

          <section
            className={styles.section}
            aria-labelledby="popular-tv-heading"
          >
            <h2 className={styles.sectionTitle} id="popular-tv-heading">
              Séries populares
            </h2>

            {tvShows.length === 0 ? (
              <p role="status">Nenhuma série popular encontrada.</p>
            ) : (
              <div className={styles.mediaGrid}>
                {tvShows.map((media) => (
                  <MediaCard key={`${media.type}-${media.id}`} media={media} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}

export default HomePage
