# this must be run from the project root

## Install global build tools

npm install -g @vscode/vsce

## ENVIRONMENT SETUP

# delete previous dependencies and build artifacts to ensure a clean build every time
rm *.vsix
rm package-lock.json
rm -rf node_modules
rm -rf table_formatter_wasm/pkg
rm -rf table_formatter_wasm/target

# Delete TypeScript compilation output 
# this step is essential because the text files for testing are copied to `out`, but do not override existing files
rm -rf out

## PACKAGE AND INSTALL

# install dependencies
npm install

npm run compile

# package extension
vsce package

# Reinstall package
code --uninstall-extension "james-lanska.markdown-formatter"
code --install-extension mark*
