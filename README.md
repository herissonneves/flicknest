# FlickNest

Aplicação para descobrir e organizar filmes e séries em uma biblioteca pessoal. O projeto é desenvolvido como prática de React e TypeScript, com implementação gradual e decisões documentadas.

## Estado atual

A estrutura atual inclui:

- Home, Busca, Minha biblioteca e página não encontrada;
- navegação com React Router, com indicação da página ativa;
- layout compartilhado com cabeçalho, navegação e conteúdo principal;
- temas claro e escuro que acompanham a preferência do sistema;
- tokens de design baseados no tema Material Design 3 e estilos com CSS Modules;
- modelo de domínio `MediaItem`, compartilhado entre filmes e séries;
- componente `MediaCard` reutilizável para apresentar filmes e séries;
- cliente HTTP da TMDB com tratamento de erro e cancelamento;
- serviços de filmes e séries populares, com conversão dos dados da TMDB para o modelo do FlickNest.
- busca de filmes e séries por título, com filtros Todos, Filmes e Séries;
- contexto da busca na URL, preservando termo, filtro e página;
- paginação com controles Anterior e Próxima.

A Home consulta filmes e séries populares pela TMDB e apresenta os resultados em seções com grades responsivas. Trata carregamento, sucesso, listas vazias e erro, além de cancelar as consultas ao sair da página.

A SearchBar permite enviar um título por Enter ou pelo botão Buscar.
A página de busca consulta a TMDB conforme os parâmetros `q`, `type`
e `page`, com filtros para Todos, Filmes e Séries. Refresh, URL copiada
e histórico recuperam o contexto e os resultados.

A busca apresenta carregamento, resultados, vazio por página e erro.
Os controles de paginação preservam termo e filtro; uma nova busca ou
mudança de filtro reinicia a página em 1.

A biblioteca pessoal com persistência em `localStorage` permanece no
plano da V1.

## Stack

- React e TypeScript;
- Vite;
- React Router em modo declarativo;
- Fetch API;
- CSS Modules e CSS custom properties;
- ESLint, Prettier e EditorConfig;
- pnpm.

## Executar localmente

Com Node.js e pnpm disponíveis, instale as dependências na raiz do repositório:

```bash
pnpm install
```

Crie o arquivo local de configuração a partir do exemplo:

```bash
cp -n .env.example .env.local
```

A opção `-n` preserva o arquivo caso `.env.local` já exista. Abra `.env.local` no editor e preencha a variável com seu **API Read Access Token**, obtido nas configurações de API da TMDB. A [documentação de autenticação da TMDB](https://developer.themoviedb.org/docs/authentication-application) descreve esse token e seu uso no cabeçalho `Authorization: Bearer`.

```dotenv
TMDB_READ_ACCESS_TOKEN=cole_aqui_seu_token_de_leitura
```

O valor acima é ilustrativo. `.env.example` mantém apenas o nome da variável, sem credencial; `.env.local` é ignorado pelo Git pela regra `*.local`.

Inicie o servidor:

```bash
pnpm dev
```

Abra o endereço informado pelo Vite no terminal. Reinicie o servidor após alterar `.env.local`. A configuração atual exige um token preenchido para iniciar o servidor de desenvolvimento.

O projeto registra `pnpm@12.6.0` no campo `packageManager` do [package.json](package.json). O comando `pnpm dev` executa o script `dev` do projeto. Esse script chama o Vite instalado localmente nas dependências de desenvolvimento.

## Integração com a TMDB

O navegador consulta caminhos relativos sob `/api/tmdb/`. Durante o desenvolvimento, o proxy configurado em [vite.config.ts](vite.config.ts) encaminha essas requisições para `https://api.themoviedb.org/3/` e adiciona o token ao cabeçalho da chamada feita pelo servidor.

`TMDB_READ_ACCESS_TOKEN` é lido na configuração do Vite com `loadEnv`. A variável não usa o prefixo `VITE_`, que expõe valores ao código do navegador. O cliente HTTP não recebe a credencial.

### Responsabilidades

- [media.ts](src/types/media.ts): define `MediaType`, `MediaItem` e
  `MediaSearchResult`, com itens, página atual e total de páginas.
- [tmdb.client.ts](src/api/tmdb/tmdb.client.ts): centraliza `fetch`,
  caminho base, verificação de erro HTTP e encaminhamento de `AbortSignal`.
- [tmdb.types.ts](src/api/tmdb/tmdb.types.ts): descreve os DTOs,
  a resposta paginada e a união discriminada da busca Multi.
- [tmdb.mappers.ts](src/api/tmdb/tmdb.mappers.ts): transforma filmes
  e séries em `MediaItem`.
- [movies.service.ts](src/api/tmdb/movies.service.ts): fornece
  `getPopularMovies` e `searchMovies`.
- [tv.service.ts](src/api/tmdb/tv.service.ts): fornece
  `getPopularTvShows` e `searchTvShows`.
- [search.service.ts](src/api/tmdb/search.service.ts): fornece
  `searchAllMedia`, aproveitando filmes e séries da busca Multi.

Os serviços de populares retornam `Promise<MediaItem[]>` da primeira
página em pt-BR. Os serviços de busca retornam
`Promise<MediaSearchResult>`, recebendo termo, página e `AbortSignal`
opcional. Termos vazios retornam sem requisição; páginas devem ser
inteiros entre 1 e 500.

A busca Todos usa `/search/multi` e descarta pessoas, preservando a ordem
dos filmes e séries restantes. A página e o total de páginas pertencem
à resposta original da API, com limite de 500. Por isso, uma página
pode ficar vazia após a filtragem e ainda haver outras páginas disponíveis.

Os mapeadores tratam data ausente, poster nulo, sinopse vazia e ausência
de votos. Nota `0` é preservada quando existem votos. Os posters usam
URLs com tamanho `w500`.

`tmdbGet` lança um erro quando a resposta HTTP não é bem-sucedida. Erros de rede e cancelamento são propagados. Os tipos e a asserção sobre o JSON descrevem o formato esperado, sem validar a resposta em tempo de execução.

A camada usa `fetch` para praticar requisição, erro, cancelamento e transformação de dados. Axios e TanStack Query não foram adicionados; TanStack Query permanece como evolução posterior para estudar cache e estado remoto a partir deste fluxo já compreendido.

### Desenvolvimento e deploy

O proxy desta etapa funciona com `pnpm dev`. `pnpm build` e `pnpm preview` não exigem o token na configuração atual, mas também não disponibilizam a rota `/api/tmdb/`.

Antes do deploy na Vercel, será necessário implementar uma rota serverless `/api/tmdb/*` para encaminhar as chamadas e manter o token no servidor. Essa rota ainda não foi criada.

Referências: [Vite — variáveis de ambiente](https://vite.dev/guide/env-and-mode), [Vite — proxy do servidor](https://vite.dev/config/server-options#server-proxy) e [TMDB — URLs de imagens](https://developer.themoviedb.org/docs/image-basics).

## Comandos

| Comando             | Finalidade                                                             |
| ------------------- | ---------------------------------------------------------------------- |
| `pnpm dev`          | Inicia o servidor de desenvolvimento com o proxy da TMDB.              |
| `pnpm build`        | Verifica os tipos com TypeScript e gera o build em `dist`.             |
| `pnpm preview`      | Serve o build gerado, sem o proxy da TMDB; execute `pnpm build` antes. |
| `pnpm lint`         | Verifica as regras do ESLint.                                          |
| `pnpm lint:fix`     | Aplica as correções automáticas disponíveis no ESLint.                 |
| `pnpm format`       | Aplica a formatação com Prettier.                                      |
| `pnpm format:check` | Confere a formatação sem alterar arquivos.                             |

## Organização inicial

```text
src/
├── api/
│   └── tmdb/
│       ├── movies.service.ts
│       ├── search.service.ts
│       ├── tmdb.client.ts
│       ├── tmdb.mappers.ts
│       ├── tmdb.types.ts
│       └── tv.service.ts
├── app/
│   ├── AppShell.tsx
│   └── AppShell.module.css
├── components/
│   ├── MediaCard/
│   │   ├── MediaCard.tsx
│   │   └── MediaCard.module.css
│   ├── Pagination/
│   │   ├── Pagination.tsx
│   │   └── Pagination.module.css
│   └── SearchBar/
│       ├── SearchBar.tsx
│       └── SearchBar.module.css
├── features/
│   ├── home/
│   │   ├── HomePage.tsx
│   │   └── HomePage.module.css
│   ├── search/
│   │   ├── SearchPage.tsx
│   │   ├── SearchPage.module.css
│   │   ├── SearchResults.tsx
│   │   └── SearchResults.module.css
│   └── library/LibraryPage.tsx
├── styles/tokens.css
├── types/media.ts
├── App.tsx
├── NotFoundPage.tsx
├── index.css
└── main.tsx
```

`main.tsx` inicia o React e disponibiliza o `BrowserRouter`. `App.tsx` associa os endereços às páginas, e `AppShell` fornece o layout compartilhado usando composição com `children`.

[MediaCard.tsx](src/components/MediaCard/MediaCard.tsx) recebe a prop `media: MediaItem` e apresenta pôster, título, tipo, ano e nota. Quando falta a URL do pôster, mostra “Pôster não disponível”. Ano e nota ausentes também têm mensagens próprias; a verificação explícita de `undefined` preserva a nota `0`, exibida como `0.0 / 10`. O componente usa CSS Modules e os tokens do tema.

[HomePage.tsx](src/features/home/HomePage.tsx) mantém filmes, séries, carregamento e erro em estado local com `useState`. Um `useEffect` inicia as duas consultas com `Promise.all` e um AbortSignal compartilhado. A limpeza do efeito cancela as consultas; verificações de `signal.aborted` impedem atualizações de estado após o cancelamento.

Carregamento e erro são compartilhados: os resultados aparecem quando as duas consultas têm sucesso; se uma falhar, a Home apresenta o erro geral. Cada seção trata sua lista vazia separadamente. `Promise.all` não cancela automaticamente a outra consulta quando uma falha.

A Home controla a disposição dos cards com CSS Grid e tokens de espaçamento. Cada MediaCard organiza seu próprio conteúdo. As listas usam chaves estáveis por tipo e ID (`${media.type}-${media.id}`), e a hierarquia usa `h1` para a página, `h2` para as seções e `h3` para os títulos dos cards.

[SearchBar.tsx](src/components/SearchBar/SearchBar.tsx) controla o texto digitado e comunica o envio por `onSearch`. O formulário possui label associado ao campo por `useId`, impede o envio padrão com `preventDefault()` e ignora termos vazios ou somente com espaços. A Home codifica o termo com `URLSearchParams` e navega com `useNavigate`.

### Busca e paginação

SearchPage deriva termo, filtro e página de `useSearchParams`.
A SearchBar mantém o rascunho local e recebe o termo inicial da URL;
digitar não inicia uma consulta até o submit.

SearchResults seleciona o serviço pelo filtro e mantém resultado e erro
em estado local. Sua chave combina termo, filtro, página e tentativa
de envio, reiniciando o componente quando esse contexto muda.
Reenviar o mesmo termo permite repetir a consulta.

A limpeza do efeito chama `abort()`. As verificações de
`signal.aborted` protegem as atualizações do resultado, do erro e
dos metadados de paginação.

SearchResults comunica o término da consulta por `onSettled`.
SearchPage associa os metadados à chave da busca para evitar usar
limites de uma consulta anterior.

Pagination recebe página, total, carregamento e callback por props.
Permanece fora do componente que reinicia, preservando seus elementos
durante a consulta. Os botões usam `aria-disabled`, estilos próprios
e guardas nos eventos para impedir ações indisponíveis sem remover
o foco.

Ao mudar o contexto da busca, SearchPage limpa os metadados anteriores,
inclusive quando o histórico retorna a uma busca já visitada.
Os controles aguardam o término da nova consulta antes de usar seus limites.

## Validação

Após alterações de código, execute:

```bash
pnpm format:check
pnpm lint
pnpm build
```

Na integração inicial da TMDB, foram verificados manualmente: filmes e séries populares convertidos para `MediaItem[]`, erro HTTP 404, cancelamento com `AbortController`, campos opcionais ausentes, extração do ano e preservação de nota zero quando existem votos.

No `MediaCard`, foram verificados manualmente: apresentação nos temas claro e escuro, ano e nota ausentes, preservação da nota zero e mensagem quando falta a URL do pôster. A lista de exemplos da Home também foi conferida com títulos longos, largura de 320 px, zoom de 200% e um filme e uma série com o mesmo ID numérico, sem avisos de chaves duplicadas no console.

Na Home, foram validados manualmente: filmes e séries reais, filmes vazios com séries disponíveis, séries vazias com filmes disponíveis e ambas as listas vazias. Também foram testados erro HTTP em cada serviço separadamente e cancelamento das duas consultas ao sair da página. As simulações temporárias foram removidas.

Na SearchBar, foram verificados label, foco por teclado, botão desativado para texto vazio, envio por Enter e clique, termos com espaços, acentos e `&` e retorno pelo histórico. Home e SearchBar foram conferidas nos temas claro e escuro, em telas estreitas e largas e com zoom de 200%.

Na busca, foram verificados filtros, envio por submit, sincronização
com a URL, refresh, URL copiada, histórico e reenvio do mesmo termo.
Também foram conferidos paginação, preservação de termo e filtro,
reinício da página, teclado, temas e telas estreitas.

Foram testados ausência de resultados, parâmetros de página inválidos,
página acima do total disponível e erro HTTP com recuperação.
O endpoint original foi restaurado após a simulação.

Respostas atrasadas foram usadas para verificar mudanças de termo,
filtro e página e saída da busca. Respostas de contextos abandonados
não substituíram os resultados atuais nem seus metadados de paginação.
O cancelamento não foi apresentado como erro. O atraso e os registros
temporários foram removidos após os testes.

Os testes automatizados permanecem no plano da V1.

## Documentação

- [Design e interface](docs/design/README.md): tema, tokens, tipografia, layout e critérios de UX.
- [Tema Material em JSON](docs/design/material-theme.json): export utilizado como referência para as cores.
- [Desenvolvimento no WebStorm](docs/webstorm.md): configuração do editor, formatação e validação.
