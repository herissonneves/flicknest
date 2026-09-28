# Desenvolvimento no WebStorm

Abra a raiz do repositório `flicknest` no WebStorm.

## Responsabilidade de cada ferramenta

- Prettier formata o código: indentação, aspas, quebras de linha e espaçamento.
- ESLint verifica problemas de código e regras do React; algumas correções podem ser aplicadas automaticamente.
- TypeScript verifica tipos, com `strict: true` nos dois projetos TypeScript.
- EditorConfig mantém indentação, codificação e finais de linha consistentes entre editores.

O Prettier é uma dependência local com versão exata registrada no projeto. Assim, editor e terminal usam a mesma versão. Optamos por ele em vez de depender apenas do formatador do WebStorm para que o padrão acompanhe o repositório. O custo é uma dependência de desenvolvimento adicional. As regras atuais do ESLint não definem estilo de formatação, então não precisamos de um plugin para executar Prettier dentro do ESLint.

## Configuração do projeto

- `.prettierrc.json`: dois espaços, aspas simples em JavaScript/TypeScript, sem ponto e vírgula, largura de referência de 80 caracteres e finais de linha LF. JSX e JSON mantêm aspas duplas.
- `.editorconfig`: UTF-8, dois espaços e nova linha ao final do arquivo.
- `.prettierignore`: exclui dependências, builds, cobertura, configurações locais do editor e o lockfile gerado pelo pnpm.
- `.idea/` permanece ignorada pelo Git. As regras compartilhadas ficam nos arquivos acima.

## Preferências do WebStorm

Abra Settings com `Cmd+,` no macOS. Os nomes dos menus podem variar conforme a versão; use a busca das configurações.

### Node.js e pnpm

Na configuração JavaScript Runtime (ou Node.js), selecione o Node.js local e o pnpm como gerenciador de pacotes. O projeto declara `pnpm@12.6.0` em `packageManager`. Na configuração TypeScript, use a instalação em `node_modules/typescript` do projeto.

### Prettier

Em Languages & Frameworks → JavaScript → Prettier:

1. Selecione Automatic Prettier configuration.
2. Ative Run on save e, quando disponível, Run on 'Reformat Code' action.
3. Em Run for files, use `**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,json,jsonc,css,html,md,yml,yaml}`.

Isso faz o WebStorm usar o Prettier local e respeitar as configurações e exclusões do repositório, inclusive para CSS e Markdown.

### ESLint

Em Languages & Frameworks → JavaScript → Code Quality Tools → ESLint:

1. Selecione Automatic ESLint configuration.
2. Ative Run eslint --fix on save.

O arquivo `eslint.config.js` já usa o formato flat config. Erros sem correção automática continuam aparecendo no editor e em `pnpm lint`.

### Actions on Save

Em Tools → Actions on Save, mantenha a formatação com Prettier e as correções do ESLint. Deixe o Reformat code genérico desativado para não encadear outro formatador ao salvar. Não é necessário habilitar Optimize imports ou Code cleanup para esta etapa.

## Comandos

| Comando             | Efeito                                     |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Inicia o servidor local.                   |
| `pnpm format`       | Aplica a formatação.                       |
| `pnpm format:check` | Confere a formatação sem alterar arquivos. |
| `pnpm lint`         | Verifica as regras do ESLint.              |
| `pnpm lint:fix`     | Aplica as correções automáticas do ESLint. |
| `pnpm build`        | Verifica TypeScript e gera o build.        |

## Validação

Após uma alteração, execute `pnpm format:check`, `pnpm lint` e `pnpm build`. Para verificar o editor, altere o espaçamento de uma linha, salve e confirme que o Prettier o normaliza.

## Documentação

- [Prettier no WebStorm](https://www.jetbrains.com/help/webstorm/prettier.html)
- [ESLint no WebStorm](https://www.jetbrains.com/help/webstorm/eslint.html)
- [Configuração do Prettier](https://prettier.io/docs/configuration)
