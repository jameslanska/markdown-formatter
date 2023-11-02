# Divergences from Markdownlint Defaults

Markdownlint is primarily a linter, not a formatter.  As such, its defaults and configuration choices reflect that.  The Markdown Formatter defaults are designed to enable a plug and play experience for the vast majority of users.

All divergences from the `markdownlint` defaults and configuration choices are enumerated below.

## MD004 Unordered list style

Markdown Formatter only offers a simple on/off toggle with the `dash` configuration.  This simplifies configuration choices.

Markdownlint defaults to `consistent`.  The `asterisk` configuration is not offered because asterisks are also used for italics and bold.  This project tries not each pattern or character only perform one role.  The `plus` configuration is not offered because it is less common and is more visually busy.

## MD007 Unordered list indentation

Spaces for indent configuration choices have been limited from all integers to 2 or 4 (default 2).  Indenting by 2 spaces allows the content of a nested list to be in line with the start of the content of the parent list when a single space is used after the list marker. Indenting by 4 spaces is consistent with code blocks.

## MD009 No Trailing spaces

Markdownlint offers significant (and potentially confusing) customization of trailing spaces behavior, since trailing spaces can (in some parsers) be used to generate line breaks.

Markdown Formatter removes all configuration possibilities and automatically removes all trailing whitespace outside of code blocks.

## MD010 No Hard Tabs

Markdown Formatter defaults to using the VS Code `tabSize` setting instead of markdownlint's original one space per tab default.  In addition, `go` and `golang` have been added to the previously empty default list of ignored code blocks.

## MD012 Multiple Consecutive Blank Lines

Markdownlint allows customization with the `maximum` parameter.  Markdown Formatter removes this configuration option (uses 1 line internally), only allowing the entire rule to be turned off.

## MD022 Headings should be surrounded by blank lines

Markdown Formatter removes all configuration possibilities and uses one line below and one line above.

## MD026 Trailing punctuation in heading

This rule has been turned off and all configuration removed.  Question marks are common in headings.

## MD030 Spaces between list markers and content

Markdown Formatter removes all configuration choices, only leaving a toggle to turn the entire rule off.  Configuration choices of `ol_multi` beyond the defaults may make the formatter no longer idempotent.

Furthermore, the following alignment style is not supported by MD030.

```markdown
9.  item
10. item
```

If there is sufficient interest, the above alignment style will be added as a configurable option.

## MD031 Fenced code blocks should be surrounded by blank lines

Markdownlint included a configuration item to disable this rule for code blocks in list items to allow a user to get a tight list with a code block inside.

This configuration option was removed since the use case is too niche.  If a code block needs to be in a tight list, use an inline code block.  If a list needs the resources of a full code block, use the extra spaces.  If this situation occurs, please consider refactoring the markdown to pull the code block out of the list to improve readability.

## MD032

Consider the list from markdownlint MD032 docs

```markdown
1. Some
2. List
Some text
```

The MD032 formatter from `markdownlint` doesn't automatically add a new line before "Some text" despite the official MD032 rule documentation showing that adding a new line is the appropriate way to solve the lint error.

The CommonMark spec doesn't actually discuss the topic of a trailing line without spaces after an ordered or unordered list thoroughly, but the VSCode render considers "Some text" to be a part of element `2.`  Therefore, the formatter adding a newline would change the structure of the document.  `markdownlint` correctly declines to make this change.

Markdown Formatter assumes that a second paragraph will have the appropriate spacing, especially as multi paragraph lists should be a rare item in properly designed Markdown.  As such, Markdown Formatter adds the extra line before "Some text" and similar situations.

## MD038 Spaces inside code span elements

This rule has been turned off and all configuration removed.  There are valid situations where space immediately inside a code span element is justified.  Since markdownlint cannot distinguish between the two, this rule is a potential source for unwanted changes.

## MD049, MD050 Emphasis and Bold

Markdown Formatter defaults to asterisks for italics and bold.  If you want to use underscores, turn these two rules off using the rule toggle.

## MD053 Link Definitions

This rule has been turned off.  Depending on workflow, this rule can cause unwanted deletions of text.

## Forced Rules

The following markdown rules are turned on and do not have corresponding configuration toggles to turn them off.

- MD005 (Violations of this rule can lead to improperly rendered content.)
- MD009 (Except when being used to create a line break, trailing whitespace has no purpose and does not affect the rendering of content.  Use newline to create linebreaks)
- MD010 (Hard tabs are unnecessary in Markdown outside of code blocks) can be configured, but not turned off
- MD011 (This fixes incorrect Markdown)
- MD014 (Aesthetics and simplicity of configuration)
- MD018 (Violations of this rule can lead to improperly rendered content.)
- MD019 (Violations of this rule can lead to improperly rendered content.)
- MD020 (Violations of this rule can lead to improperly rendered content.)
- MD021 (Violations of this rule can lead to improperly rendered content.)
- MD022 (Headers should have at least one line of whitespace surrounding them for readability.)
- MD023 (Headings that don't start at the beginning of the line will not be parsed as headings, and will instead appear as regular text.)
- MD031 (Aesthetics and readability)
- MD032 (Aside from aesthetic reasons, some parsers, including kramdown, will not parse lists that don't have blank lines before and after them.)
- MD034 (Without angle brackets, a bare URL or email isn't converted into a link by some Markdown parsers.)
- MD037 (Emphasis is only parsed as such when the asterisks/underscores aren't surrounded by spaces.)
- MD039 (spaces at the bounds of link text are not rendered and decrease readability of source)
- MD047 (Moving the `EOF` to its own line simplifies the git diff.)
