# Design e interface

## Direção visual

O FlickNest adota Material Design 3 como base para papéis de cor, hierarquia tipográfica, formas e estados de interação. A identidade do produto está na ideia de um espaço pessoal para histórias, com violeta, superfícies discretas e foco no conteúdo e na biblioteca.

O tema também inclui tons dourados para destaques futuros. A interface atual usa apenas os papéis necessários ao layout existente.

Princípios das Human Interface Guidelines da Apple orientam decisões de usabilidade adaptadas à web:

- **Hierarquia:** marca, título da página, navegação e texto têm funções visuais distintas.
- **Consistência:** o cabeçalho e os destinos principais permanecem disponíveis entre as páginas.
- **Feedback:** o menu indica a página atual, enquanto o contorno de foco indica o elemento alcançado pelo teclado.
- **Acessibilidade:** seleção reconhecível além da cor, foco visível, texto escalável e layout adaptável à largura disponível.

A implementação usa React, CSS Modules e variáveis CSS. Isso permite estudar diretamente os componentes e as decisões visuais; exige também cuidar dos estados de interação e da acessibilidade de cada componente criado.

## Origem e uso do tema

O arquivo [material-theme.json](material-theme.json) foi exportado pelo Material Theme Builder. Seus metadados registram a exportação em 28/09/2026 às 10:41:36.

A cor de origem, `seed`, é `#635BFF`. Os valores usados na interface vêm de `schemes`: por exemplo, o papel `primary` é `#5A5892` no tema claro e `#C3C0FF` no escuro. A cor de origem e os papéis resultantes têm funções diferentes.

O export contém seis esquemas: claro e escuro, cada um com variantes de contraste padrão, médio e alto. Atualmente, a aplicação utiliza `light` e `dark`.

Os papéis selecionados foram copiados para [tokens.css](../../src/styles/tokens.css). O JSON é a referência de design e não é importado pela aplicação em tempo de execução. Ao atualizar o tema, confira também os valores CSS dos dois esquemas e os pares de fundo e conteúdo.

| Papel no JSON          | Uso atual                         |
| ---------------------- | --------------------------------- |
| `surface`              | Fundo da aplicação.               |
| `onSurface`            | Texto principal sobre esse fundo. |
| `onSurfaceVariant`     | Texto secundário.                 |
| `primary`              | Marca e links.                    |
| `secondaryContainer`   | Fundo do item de navegação ativo. |
| `onSecondaryContainer` | Texto do item de navegação ativo. |

O tema claro é definido no primeiro `:root`. A consulta `prefers-color-scheme: dark` substitui as cores quando o sistema ou navegador informa preferência pelo tema escuro. `color-scheme` informa ao navegador qual esquema está ativo para os elementos que ele desenha.

## Tokens do projeto

As cores seguem o prefixo `--md-sys-color-`. Decisões próprias do FlickNest usam `--fn-`. Introduzimos tokens conforme aparecem usos reais no layout.

### Espaçamento e largura

A escala tem como referência uma unidade de `0.25rem`:

| Token                    | Valor     |
| ------------------------ | --------- |
| `--fn-space-3`           | `0.75rem` |
| `--fn-space-4`           | `1rem`    |
| `--fn-space-6`           | `1.5rem`  |
| `--fn-space-8`           | `2rem`    |
| `--fn-space-12`          | `3rem`    |
| `--fn-content-max-width` | `64rem`   |

`rem` acompanha o tamanho da fonte do elemento raiz. Centralizar as medidas permite ajustar uma decisão e refletir essa mudança em todos os seus usos.

### Tipografia e formas

A família atual é `system-ui, sans-serif`. Os tokens tipográficos agrupam peso, tamanho, altura de linha e família para uso com a propriedade `font`.

| Token               | Função                      | Peso  | Tamanho    | Altura de linha |
| ------------------- | --------------------------- | ----- | ---------- | --------------- |
| `--fn-font-brand`   | Nome FlickNest no cabeçalho | `700` | `1.25rem`  | `1.5`           |
| `--fn-font-body`    | Texto comum                 | `400` | `1rem`     | `1.5`           |
| `--fn-font-heading` | Título da página            | `400` | `1.75rem`  | `2.25rem`       |
| `--fn-font-label`   | Rótulos do menu             | `500` | `0.875rem` | `1.25rem`       |

Uma altura de linha sem unidade, como `1.5`, multiplica o tamanho da fonte do próprio elemento.

`--fn-radius-full: 999px` produz as extremidades arredondadas dos itens de navegação. `--fn-control-min-height: 3rem` define uma altura mínima para os links do menu e da marca, permitindo crescimento com o conteúdo.

## Organização dos estilos

- [tokens.css](../../src/styles/tokens.css): decisões visuais compartilhadas e troca de cores entre os temas.
- [index.css](../../src/index.css): tipografia e cores básicas, modelo de caixa e estilos globais dos links.
- [AppShell.module.css](../../src/app/AppShell.module.css): estilos da estrutura compartilhada, cabeçalho, marca, menu e conteúdo inicial.

CSS Modules dá escopo local aos nomes das classes. As variáveis definidas no `:root` continuam disponíveis por herança. Seletores como `.app h1` ainda alcançam os títulos descendentes da estrutura, inclusive os renderizados por outros componentes.

O item ativo usa o seletor `[aria-current='page']`, atributo fornecido pelo `NavLink`. Isso evita depender de uma classe global `active` dentro do CSS Module. O fundo e o sublinhado indicam seleção; `:focus-visible` mantém o foco do teclado perceptível.

## Composição do layout

[AppShell](../../src/app/AppShell.tsx) contém o cabeçalho, o link da marca, a navegação e o elemento `main`. Ele recebe `children`, tipado como `ReactNode`, e renderiza esse conteúdo dentro de `main`.

[App](../../src/App.tsx) coloca `Routes` entre as tags de `AppShell`. Assim, `Routes` é recebido como `children` e escolhe a página de acordo com a URL. As páginas compartilham a estrutura porque suas rotas estão dentro desse mesmo layout.

| Caminho    | Página                |
| ---------- | --------------------- |
| `/`        | Home                  |
| `/search`  | Busca                 |
| `/library` | Minha biblioteca      |
| `*`        | Página não encontrada |

O cabeçalho começa em coluna. A partir de `48rem`, marca e navegação ficam lado a lado. O menu permite quebra de linha, e a largura máxima mantém o conteúdo limitado em telas maiores.

## Validação de alterações visuais

Ao alterar o tema ou o layout, conferir:

1. Temas claro e escuro, incluindo textos, links, seleção e foco.
2. Navegação entre as páginas, retorno pela marca e histórico com Voltar/Avançar.
3. Uso por teclado com `Tab` e `Enter`.
4. Janelas estreitas e largas e zoom de 200%, sem conteúdo cortado ou sobreposto.
5. Contraste das combinações efetivamente usadas. O arquivo de tema é uma referência; a acessibilidade também depende de como as cores e os componentes são aplicados.

Se forem adicionadas animações, respeitar a preferência por movimento reduzido.

Após mudanças de código, executar:

```bash
pnpm format:check
pnpm lint
pnpm build
```

## Referências

- [Material: cores](https://material-web.dev/theming/color/)
- [Material: tipografia](https://material-web.dev/theming/typography/)
- [Material: formas](https://material-web.dev/theming/shape/)
- [Apple: Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [React: composição com children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
- [Vite: CSS Modules](https://vite.dev/guide/features.html#css-modules)
