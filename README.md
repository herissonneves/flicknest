# FlickNest

Aplicação para descobrir e organizar filmes e séries em uma biblioteca pessoal. O projeto é desenvolvido como prática de React e TypeScript, com implementação gradual e decisões documentadas.

## Estado atual

A estrutura inicial inclui:

- Home, Busca, Minha biblioteca e página não encontrada;
- navegação com React Router, com indicação da página ativa;
- layout compartilhado com cabeçalho, navegação e conteúdo principal;
- temas claro e escuro que acompanham a preferência do sistema;
- tokens de design baseados no tema Material Design 3 e estilos com CSS Modules.

As páginas ainda têm conteúdo inicial. A integração com a TMDB, a busca de títulos e a biblioteca pessoal com persistência em `localStorage` fazem parte do plano da V1 e ainda serão implementadas.

## Stack

- React e TypeScript;
- Vite;
- React Router em modo declarativo;
- CSS Modules e CSS custom properties;
- ESLint, Prettier e EditorConfig;
- pnpm.

## Executar localmente

Com Node.js e pnpm disponíveis, execute na raiz do repositório:

```bash
pnpm install
pnpm dev
```

Abra o endereço informado pelo Vite no terminal. O projeto registra `pnpm@12.6.0` no campo `packageManager` do [package.json](package.json).

O comando `pnpm dev` executa o script `dev` do projeto. Esse script chama o Vite instalado localmente nas dependências de desenvolvimento.

## Comandos

| Comando             | Finalidade                                                               |
| ------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`          | Inicia o servidor de desenvolvimento.                                    |
| `pnpm build`        | Verifica os tipos com TypeScript e gera o build em `dist`.               |
| `pnpm preview`      | Serve o build gerado para conferência local; execute `pnpm build` antes. |
| `pnpm lint`         | Verifica as regras do ESLint.                                            |
| `pnpm lint:fix`     | Aplica as correções automáticas disponíveis no ESLint.                   |
| `pnpm format`       | Aplica a formatação com Prettier.                                        |
| `pnpm format:check` | Confere a formatação sem alterar arquivos.                               |

## Organização inicial

```text
src/
├── app/
│   ├── AppShell.tsx
│   └── AppShell.module.css
├── features/
│   ├── home/HomePage.tsx
│   ├── search/SearchPage.tsx
│   └── library/LibraryPage.tsx
├── styles/tokens.css
├── App.tsx
├── NotFoundPage.tsx
├── index.css
└── main.tsx
```

`main.tsx` inicia o React e disponibiliza o `BrowserRouter`. `App.tsx` associa os endereços às páginas, e `AppShell` fornece o layout compartilhado usando composição com `children`.

## Documentação

- [Design e interface](docs/design/README.md): tema, tokens, tipografia, layout e critérios de UX.
- [Tema Material em JSON](docs/design/material-theme.json): export utilizado como referência para as cores.
- [Desenvolvimento no WebStorm](docs/webstorm.md): configuração do editor, formatação e validação.
