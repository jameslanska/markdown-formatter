import * as vscode from "vscode";
import { format_document } from "./formatters/main_formatter";

/**
 * Create and register a Markdown formatting edit provider to VS Code upon extension activation.
 */
export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            { language: "markdown", scheme: "file" },
            {
                provideDocumentFormattingEdits: format_document,
            },
        ),
    );
}
