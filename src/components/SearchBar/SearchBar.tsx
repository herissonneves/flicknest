import type { SubmitEvent } from 'react'
import { useId, useState } from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  onSearch: (query: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) {
  const inputId = useId()
  const [query, setQuery] = useState<string>('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (trimmedQuery.length === 0) {
      return
    }

    onSearch(trimmedQuery)
  }

  return (
    <form
      className={styles.form}
      role="search"
      aria-label="Buscar filmes e séries"
      onSubmit={handleSubmit}
    >
      <label className={styles.label} htmlFor={inputId}>
        Buscar por título
      </label>

      <input
        className={styles.input}
        id={inputId}
        name="q"
        type="search"
        placeholder="Ex.: Interestelar"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        required
      />

      <button
        className={styles.button}
        type="submit"
        disabled={query.trim().length === 0}
      >
        Buscar
      </button>
    </form>
  )
}

export default SearchBar
