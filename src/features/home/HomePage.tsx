import type { MediaItem } from '../../types/media.ts'
import MediaCard from '../../components/MediaCard/MediaCard.tsx'

const mediaExamples: MediaItem[] = [
  {
    id: 1,
    type: 'movie',
    title: 'Filme de teste',
    year: 2024,
    rating: 0,
    posterUrl:
      'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
  },
  {
    id: 1,
    type: 'tv',
    title:
      'Uma série de teste com um título longo para verificar a quebra de linhas',
  },
]

function HomePage() {
  return (
    <>
      <h1>FlickNest</h1>
      <p>Seu lugar para descobrir e organizar filmes e séries</p>

      {mediaExamples.map((media) => (
        <MediaCard key={`${media.type}-${media.id}`} media={media} />
      ))}
    </>
  )
}

export default HomePage
