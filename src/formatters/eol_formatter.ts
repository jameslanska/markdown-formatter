import * as os from "node:os";
import * as vscode from "vscode";

/**
 * Fix EOL for the entire file.
 *
 * Order of precedence:
 *
 * 1. `files.eol` VS Code setting
 * 2. OS EOL
 *
 * @param doc - The text to fix (presumably the entire document).
 */
export function format_eol(doc: string): string {
    // Figure out the correct EOL for the document.

    // Get the VS Code EOL setting.
    const vscode_global_eol: string | null | undefined = vscode.workspace
        .getConfiguration("files")
        .get("eol");

    let EOL: string;

    // Handle the "auto" setting or invalid setting.
    if (vscode_global_eol === "\r\n" || vscode_global_eol === "\n") {
        EOL = vscode_global_eol;
    } else {
        EOL = os.EOL;
    }

    // Replace document eof with OS EOL.
    return doc.replace(/\r?\n/g, EOL);
}
