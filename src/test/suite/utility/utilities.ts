import * as vscode from "vscode";

/**
 * Pauses for a while.
 * @param ms - Time to pause in millisecond.
 * @example
 * await sleep(1000);
 */
export function sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Opens a document with the corresponding editor.
 * @param file - A Uri or file system path which identifies the resource.
 */
export const open_document = async (
    file: vscode.Uri,
): Promise<readonly [vscode.TextDocument, vscode.TextEditor]> => {
    const document = await vscode.workspace.openTextDocument(file);
    const editor = await vscode.window.showTextDocument(document);
    return [document, editor];
};
