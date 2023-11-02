# List Behavior

Add multiple paragraphs in a list item by indenting all subsequent lines so that they match the start of the text on the first line

```markdown
- a

  b

- c
```

or

```markdown
- a
  b
- c
```

For ordered lists, this will be 3 spaces indented

```markdown
1. a

   b

2. c
```

or

```markdown
1. a
   b
2. c
```

If there is not sufficient indentation such that the render treats it as two separate lists, the formatter will add unwanted additional newlines.

See: Ciro Santilli's [Markdown Style Guide](https://cirosantilli.com/markdown-style-guide#indentation-of-content-inside-lists)
