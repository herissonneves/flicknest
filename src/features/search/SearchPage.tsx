import { useSearchParams } from 'react-router'
import SearchBar from '../../components/SearchBar/SearchBar.tsx'
import { useCallback, useId, useState } from 'react'
import styles from './SearchPage.module.css'
import SearchResults from './SearchResults.tsx'
import type { MediaSearchResult } from '../../types/media.ts'
import Pagination from '../../components/Pagination/Pagination.tsx'

const mediaTypeLabels = {
  all: 'Todos',
  movie: 'Filmes',
  tv: 'Séries',
}

interface PaginationInfo {
  searchKey: string
  totalPages: number | null
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchAttempt, setSearchAttempt] = useState(0)
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null,
  )
  const query = searchParams.get('q')?.trim() ?? ''
  const filterId = useId()

  const rawType = searchParams.get('type')
  const mediaType = rawType === 'movie' || rawType === 'tv' ? rawType : 'all'

  const rawPage = searchParams.get('page')
  const parsedPage =
    rawPage !== null && /^\d+$/.test(rawPage) ? Number(rawPage) : NaN

  const page =
    Number.isSafeInteger(parsedPage) && parsedPage >= 1 && parsedPage <= 500
      ? parsedPage
      : 1

  const searchKey = JSON.stringify([query, mediaType, page, searchAttempt])

  const [previousSearchKey, setPreviousSearchKey] = useState(searchKey)

  if (previousSearchKey !== searchKey) {
    setPreviousSearchKey(searchKey)
    setPaginationInfo(null)
  }

  const currentPagination =
    paginationInfo?.searchKey === searchKey ? paginationInfo : null

  const handleSearchSettled = useCallback(
    (result: MediaSearchResult | null) => {
      setPaginationInfo({
        searchKey,
        totalPages: result?.totalPages ?? null,
      })
    },
    [searchKey],
  )

  function handlePageChange(nextPage: number) {
    if (
      !Number.isInteger(nextPage) ||
      nextPage < 1 ||
      nextPage > 500 ||
      nextPage === page
    ) {
      return
    }

    setSearchParams({
      q: query,
      type: mediaType,
      page: String(nextPage),
    })
  }

  function handleSearch(submittedQuery: string) {
    setSearchParams({ q: submittedQuery, type: mediaType, page: '1' })
    setSearchAttempt((previous) => previous + 1)
  }

  function handleTypeChange(selectedType: string) {
    const nextType =
      selectedType === 'movie' || selectedType === 'tv' ? selectedType : 'all'

    setSearchParams({ q: query, type: nextType, page: '1' })
  }

  return (
    <>
      <h1>Buscar</h1>
      <p>Encontre filmes e séries para sua próxima história.</p>

      <SearchBar key={query} initialQuery={query} onSearch={handleSearch} />

      <div className={styles.filter}>
        <label className={styles.label} htmlFor={filterId}>
          Tipo de conteúdo
        </label>

        <select
          className={styles.select}
          id={filterId}
          name="type"
          value={mediaType}
          onChange={(event) => handleTypeChange(event.currentTarget.value)}
        >
          <option value="all">{mediaTypeLabels.all}</option>
          <option value="movie">{mediaTypeLabels.movie}</option>
          <option value="tv">{mediaTypeLabels.tv}</option>
        </select>
      </div>

      {query === '' ? (
        <p>Digite um título para iniciar sua busca.</p>
      ) : (
        <>
          <p>
            Termo da busca: <strong>{query}</strong>
          </p>

          <Pagination
            page={page}
            totalPages={currentPagination?.totalPages ?? null}
            isLoading={currentPagination === null}
            onPageChange={handlePageChange}
          />

          <SearchResults
            key={searchKey}
            query={query}
            mediaType={mediaType}
            page={page}
            onSettled={handleSearchSettled}
          />
        </>
      )}
    </>
  )
}

export default SearchPage
