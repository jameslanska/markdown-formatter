import * as vscode from "vscode";
import { format_eol } from "./eol_formatter";
import { remove_leading_whitespace_from_paragraph } from "./leading_whitespace_formatter";
import { run_markdownlint_rules } from "./markdownlint_wrapper/markdownlint_wrapper";
import { empty_line_after_lists_formatter } from "./markdownlint_wrapper/md032_extension";
import { format_ordered_list_numbering } from "./ordered_list_formatter";
import { format_tables } from "@jameslanska/markdown-table-formatter";

/**
 * Perform the format action according to the VS Code formatting specification.
 *
 * @Remarks
 * Markdownlint does not directly support the VS Code formatting API, so this function uses a single edit that replaces the entire content of the document if there are any changes at all.  It doesn't try to figure out diffs or add any additional complexity in that regard.
 */
export function format_document(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    // token: vscode.CancellationToken,
): vscode.TextEdit[] {
    const original_text = document.getText();

    const formatted_text = format(original_text, options);

    if (original_text === formatted_text) {
        return [];
    }

    // provide single edit to the formatting API which replaces the original document text with the formatted text
    const start = document.lineAt(0).range.start;
    const end = document.lineAt(document.lineCount - 1).range.end;
    const entire_doc: vscode.Range = new vscode.Range(start, end);
    const replacements: vscode.TextEdit[] = [
        vscode.TextEdit.replace(entire_doc, formatted_text),
    ];
    return replacements;
}

/**
 * Run all formatting rules on the `doc` string.
 *
 * @param doc - string containing the entire contents of the document
 * @param options - this object should be provided by VS Code in all production contexts
 */
export function format(doc: string, options: vscode.FormattingOptions): string {
    // replace all CRLF with LF for consistent processing
    let text: string = doc.replace(/\r\n/g, "\n");

    text = format_ordered_list_numbering(text);
    text = empty_line_after_lists_formatter(text);
    text = run_markdownlint_rules(text, options);

    // certain things need a second run with markdownlint (adding lines after headers, for example)
    text = run_markdownlint_rules(text, options);
    text = format_tables(text);
    text = remove_leading_whitespace_from_paragraph(text);

    // set EOL to the user's settings
    text = format_eol(text);

    return text;
}
