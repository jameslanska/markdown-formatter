# Contributing to Markdown Formatter

First off, thank you for considering contributing to Markdown Formatter.  This document will help answer common questions you may have during your first contribution.

## Issue Reporting

Not every contribution comes in the form of code. Submitting, confirming, and triaging issues is an important task for any project.

We use GitHub to track all project issues.  If you

- discover bugs,
- have ideas for improvements or new features,
- think there is a style issue with Markdown Formatter's output, or
- notice a problem with the documentation,

please start by opening an issue on this repository.  We use issues to centralize the discussion and agree on a plan of action before spending time and effort writing code that might not get used.

If you find a security vulnerability, do ***NOT*** open an issue.  Follow the instructions in `SECURITY.md`.

### Submitting An Issue

1. Check that the issue has not already been reported.
2. Select the appropriate issue type, open an issue with a descriptive title, and follow the template.
3. Be clear, concise, and precise using grammatically correct, complete sentences in your summary of the problem.
4. Include any relevant code, markdown input, and markdown output in the issue.

## Code Contributions

Markdown Formatter follows a [forking workflow](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) with the following contribution process

1. Open an issue on the [project repository](https://github.com/jameslanska/markdown-formatter/issues), if appropriate.
2. Fork the project <https://github.com/jameslanska/markdown-formatter/fork>.
3. Create your feature branch `git checkout -b my-new-feature`.
4. Commit your changes git `commit -am 'Add some feature'`.
5. Push to the branch `git push origin my-new-feature`.
6. Create a [GitHub Pull Request](https://help.github.com/articles/about-pull-requests/) for your change following instructions in the pull request template.
7. Participate in a Code Review with the project maintainer on the pull request.

Pull request response times from the maintainer should in general be very quick.  Releases will most likely follow quickly after merging into `main`.

### What We Are Looking For

- bug fixes
- documentation improvements
- formatting style improvements
- new formatting rules
- code style improvements
- localization improvements
- esbuild or webpack bundling (esbuild seems to struggle with wasm dependencies)
- extraction of JS functionality to Rust with WASM
- etc.

### What We Are Not Looking For

We are not not looking for expanded configuration choices.  This project actively tries to minimize the number of configuration choices in this project.  This minimizes the cognitive load on the user and limits the bug surface for the project.

A pull request that only serves to add a new configuration choice will almost certainly be rejected.

## Running Tests

Run `deploy.sh` from the project root to set up the development environment and install the package to VS Code.  Then open a VS Code workspace at the extension root.

The integration tests run in an instance of VSCode without any extensions.

Open the "Run and Debug" sidebar (<kbd>SHIFT</kbd> <kbd>COMMAND</kbd> <kbd>D</kbd> on macOS)

From the dropdown box to the right of the green triangle button, select "Run Extension Tests".

If you don't have the most recent version of VS Code downloaded and installed, the test system may download a new version exclusively for the testing.

A new VSCode window should open and then close a few seconds later.  If the debug console doesn't open automatically open after the testing window closes, open manually.  Check that all tests passed.

## Coding conventions

Start reading the code and you'll get the hang of it.  We optimize for readability:

- snake_case (words can be visually separated faster than with camelCase)
- every change must have corresponding tests
- every function must be documented with [TSDoc](https://tsdoc.org/)
- version numbers follow [Semantic Versioning](https://semver.org/)
