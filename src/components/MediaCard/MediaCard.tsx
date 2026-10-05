import type { MediaItem } from '../../types/media.ts'
import styles from './MediaCard.module.css'

interface MediaCardProps {
  media: MediaItem
}

function MediaCard({ media }: MediaCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.poster}>
        {media.posterUrl ? (
          <img
            className={styles.posterImage}
            src={media.posterUrl}
            alt={`Pôster de ${media.title}`}
          />
        ) : (
          <span className={styles.posterFallback}>Pôster não disponível</span>
        )}
      </div>
      <h2>{media.title}</h2>
      <p>{media.type === 'movie' ? 'Filme' : 'Série'}</p>
      <p>
        {media.year !== undefined ? `Ano: ${media.year}` : 'Ano não informado'}
      </p>
      <p>
        {media.rating !== undefined
          ? `Nota: ${media.rating.toFixed(1)} / 10`
          : 'Sem avaliação'}
      </p>
    </article>
  )
}

export default MediaCard
