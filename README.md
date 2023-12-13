[![CI](https://github.com/jameslanska/markdown-formatter/actions/workflows/main.yml/badge.svg)](https://github.com/jameslanska/markdown-formatter/actions/workflows/main.yml) [![version](https://img.shields.io/vscode-marketplace/v/james-lanska.markdown-formatter?label=vscode%20marketplace)](https://marketplace.visualstudio.com/items?itemName=james-lanska.markdown-formatter) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

# Markdown Formatter

A Visual Studio Code extension that includes

- comprehensive whitespace formatting,
- table formatting,
- ordered list renumbering, and
- autofixing of several common errors.

Markdown Formatter is fully compliant with

- [Commonmark specification](https://spec.commonmark.org/0.30/)
- [GitHub Flavored Markdown (GFM) tables extension](https://github.github.com/gfm/#tables-extension-)
- [Unicode 15.1.0](https://unicode.org/versions/Unicode15.1.0/)
- [Unicode Standard Annex \#11](https://www.unicode.org/reports/tr11/tr11-11.html)
- [Unicode Standard Annex \#29](https://unicode.org/reports/tr29/)

## Getting Started

This repository will be posted to the VS Code Marketplace shortly once a name conflict has been resolved.

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=james-lanska.markdown-formatter) or search `james-lanska.markdownformatter` in the Extensions tab of VS Code.

Set this extension as the formatter for Markdown documents.

```typescript
"[markdown]": {
    "editor.defaultFormatter": "james-lanska.markdownformatter",
}
```

Turn on "format on save".

```typescript
"editor.formatOnSave": true,
```

To only turn on "format on save" for Markdown documents, instead use

```typescript
"[markdown]": {
    "editor.formatOnSave": true,
}
```

## Table Formatting

Table formatting conforms to the [GitHub Flavored Markdown (GFM) table specification](https://github.github.com/gfm/#tables-extension-).  For example,

```markdown
| A | B | C |
| :--- | :---: | ---: |
| C | D | E |
```

is formatted to

```markdown
| A    |   B   |    C |
| :--- | :---: | ---: |
| C    |   D   |    E |
```

The table formatter is fully compliant with *Unicode 15.1.0*.  The table formatter correctly handles double width characters such as emojis (🤯) and ideographic CJK (Chinese, Japanese, Korean) characters.

```markdown
| 🤯  | 🤯  |
| --- | --- |
```

Actual alignment of characters in your text editor will depend on the editor and the fonts used.  If you are unsure whether the implementation is correct, open the file in vim.

Since *correct* table formatting is a computationally expensive operation, this code is written in Rust and compiled to WebAssembly.  For further details, see [markdown-table-formatter](https://github.com/jameslanska/markdown-table-formatter).

VS Code allows wrapping of text onto the next line to improve readability of text.  This can make it difficult to read Markdown tables that have lots of text in each element. Toggle word wrap with <kbd>option</kbd> <kbd>z</kbd> on macOS or type "word wrap" into the command palette.

## Ordered List Formatting

List numbers are automatically fixed, e.g.

```markdown
2. A
1. B
3. C

D

1. E
0. F
```

is formatted to

```markdown
1. A
2. B
3. C

D

1. E
2. F
```

## Design Philosophy

1. **Focused** - exclusively a formatter with no other features (e.g. no linting)
2. **Complete** - no other extensions need to be installed to achieve all common markdown formatting tasks
3. **Sensible defaults** - the defaults should be sufficient for most users
4. **Configurable** - Markdown is intentionally general, so different styles may be appropriate for different circumstances (see "feature contributions" in the extension page and the [docs](./docs/))
5. **Few dependencies** - `markdownlint` is the only third-party dependency

## Acknowledgements

I would like to express my deep and sincere gratitude to [Joe Lanska](https://github.com/josephlanska) for his unwavering support and for all the time he spent helping me improve the documentation.

I would also like to thank [David Anson](https://github.com/davidanson) for his work building and maintaining [markdownlint](https://github.com/DavidAnson/markdownlint).  The `markdownlint` wrapper code was adapted from <https://github.com/DavidAnson/markdownlint/blob/main/helpers/helpers.js>.  Documentation about `markdownlint` rules was adapted from <https://github.com/DavidAnson/markdownlint/tree/main/doc>.

## Support

If you would like to support further development, please consider [buying me a coffee](https://www.buymeacoffee.com/lanskajames).
