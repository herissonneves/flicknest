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

Os serviços foram validados manualmente no console do navegador. A Home apresenta uma lista de exemplos locais com `MediaCard` e ainda não consulta os serviços da TMDB. A integração da Home com esses serviços, a busca de títulos e a biblioteca pessoal com persistência em `localStorage` permanecem no plano da V1.

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

- [media.ts](src/types/media.ts): define `MediaType` e o modelo interno `MediaItem`.
- [tmdb.client.ts](src/api/tmdb/tmdb.client.ts): centraliza `fetch`, o caminho base, a verificação de erro HTTP e o encaminhamento de `AbortSignal`.
- [tmdb.types.ts](src/api/tmdb/tmdb.types.ts): descreve os DTOs de filmes e séries e a resposta paginada da TMDB.
- [tmdb.mappers.ts](src/api/tmdb/tmdb.mappers.ts): transforma DTOs em `MediaItem`, unificando título, ano, poster, sinopse e nota.
- [movies.service.ts](src/api/tmdb/movies.service.ts): fornece `getPopularMovies(signal?)`.
- [tv.service.ts](src/api/tmdb/tv.service.ts): fornece `getPopularTvShows(signal?)`.

Os dois serviços retornam `Promise<MediaItem[]>`. Isso permite que os componentes usem o formato do FlickNest: por exemplo, filmes e séries têm `title`, embora a TMDB use `name` para séries. A configuração HTTP fica no cliente, e a transformação fica nos mappers.

Nesta etapa, os serviços consultam a primeira página com idioma `pt-BR`. A paginação da resposta permanece dentro da camada da TMDB. Os mappers tratam ano ausente, poster nulo, sinopse vazia e ausência de votos; nota `0` é preservada quando existem votos. Os posters usam URLs com tamanho `w500`.

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
│       ├── tmdb.client.ts
│       ├── tmdb.types.ts
│       ├── tmdb.mappers.ts
│       ├── movies.service.ts
│       └── tv.service.ts
├── app/
│   ├── AppShell.tsx
│   └── AppShell.module.css
├── components/
│   └── MediaCard/
│       ├── MediaCard.tsx
│       └── MediaCard.module.css
├── features/
│   ├── home/HomePage.tsx
│   ├── search/SearchPage.tsx
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

[HomePage.tsx](src/features/home/HomePage.tsx) renderiza os exemplos com `.map()` e fornece uma `key` estável formada por tipo e ID (`${media.type}-${media.id}`). Assim, um filme e uma série com o mesmo ID numérico têm chaves distintas na lista, como `movie-1` e `tv-1`.

## Validação

Após alterações de código, execute:

```bash
pnpm format:check
pnpm lint
pnpm build
```

Na integração inicial da TMDB, foram verificados manualmente: filmes e séries populares convertidos para `MediaItem[]`, erro HTTP 404, cancelamento com `AbortController`, campos opcionais ausentes, extração do ano e preservação de nota zero quando existem votos.

No `MediaCard`, foram verificados manualmente: apresentação nos temas claro e escuro, ano e nota ausentes, preservação da nota zero e mensagem quando falta a URL do pôster. A lista de exemplos da Home também foi conferida com títulos longos, largura de 320 px, zoom de 200% e um filme e uma série com o mesmo ID numérico, sem avisos de chaves duplicadas no console.

Os testes automatizados permanecem no plano da V1.

## Documentação

- [Design e interface](docs/design/README.md): tema, tokens, tipografia, layout e critérios de UX.
- [Tema Material em JSON](docs/design/material-theme.json): export utilizado como referência para as cores.
- [Desenvolvimento no WebStorm](docs/webstorm.md): configuração do editor, formatação e validação.
