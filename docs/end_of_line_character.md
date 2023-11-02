# End of Line Character

Many markdown formatters, including the table formatter in Markdown All in One and markdownlint, are not explicit about how they handle EOL characters.

Markdown Formatter forcibly changes all EOL characters.  If the user has set the VSCode setting `file.eol`, it will respect that.  If not, it defaults to the appropriate ending for the user's operating system.

If you are working collaboratively on a project across operating systems, use `.gitattributes` to ensure proper normalization in the git index.  <https://git-scm.com/docs/gitattributes>
