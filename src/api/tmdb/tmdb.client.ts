const TMDB_BASE_PATH = '/api/tmdb'

export async function tmdbGet<TResponse>(
  path: string,
  signal?: AbortSignal,
): Promise<TResponse> {
  const response = await fetch(`${TMDB_BASE_PATH}${path}`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Erro ao consultar a TMDB: ${response.status}`)
  }

  return (await response.json()) as TResponse
}
