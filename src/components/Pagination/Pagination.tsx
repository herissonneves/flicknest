import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number | null
  isLoading: boolean
  onPageChange: (page: number) => void
}

function Pagination({
  page,
  totalPages,
  isLoading,
  onPageChange,
}: PaginationProps) {
  const canGoPrevious = !isLoading && page > 1
  const canGoNext = !isLoading && totalPages !== null && page < totalPages

  return (
    <nav
      className={styles.pagination}
      aria-label="Paginação dos resultados"
      aria-busy={isLoading}
    >
      <button
        className={styles.button}
        type="button"
        aria-disabled={!canGoPrevious}
        onClick={() => {
          if (canGoPrevious) onPageChange(page - 1)
        }}
      >
        Anterior
      </button>

      <p role="status">
        Página {page}{' '}
        {totalPages !== null && totalPages > 0 && ` de ${totalPages}`}
      </p>

      <button
        className={styles.button}
        type="button"
        aria-disabled={!canGoNext}
        onClick={() => {
          if (canGoNext) onPageChange(page + 1)
        }}
      >
        Próxima
      </button>
    </nav>
  )
}

export default Pagination
