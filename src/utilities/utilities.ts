import * as vscode from "vscode";
import { get_next_line, get_previous_line } from "./string_navigation";

export const EXT_NAME = "markdown-formatter";
export const htmlCommentBegin = "<!--";
export const htmlCommentEnd = "-->";

/**
 * Get the markdownlint_rules settings object.
 */
export function get_markdownlint_settings(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(`${EXT_NAME}.markdownlint_rules`);
}

/**
 * Return `true` if the `offset` is inside a code block.
 *
 * If the offset is equal to the text string length (EOD), return `false`.
 */
export function offset_in_code_block(text: string, offset: number): boolean {
    if (offset === text.length) {
        return false;
    }

    const code_block_regex = /```[\s\S]*?```/gu;
    let match: RegExpExecArray | null;
    while ((match = code_block_regex.exec(text)) !== null) {
        if (offset > match.index && offset < match.index + match[0].length) {
            return true;
        }
    }

    return false;
}

/**
 * Return `true` if the `offset` is inside an HTML comment.
 *
 * If the offset is equal to the text string length (EOD), return `false`.
 */
export function offset_in_html_comment(text: string, offset: number): boolean {
    if (offset === text.length) {
        return false;
    }

    const code_block_regex = /<!--[\s\S]*?-->/gu;
    let match: RegExpExecArray | null;
    while ((match = code_block_regex.exec(text)) !== null) {
        if (offset > match.index && offset < match.index + match[0].length) {
            return true;
        }
    }

    return false;
}

/**
 * Check if the line specified by the `offset` is surrounded by empty lines.
 *
 * @param doc - entire text
 * @param offset - string offset of `doc` at the beginning of the line in question
 */
export function line_is_surrounded_by_empty_lines(
    doc: string,
    offset: number,
): boolean {
    const previous_line = get_previous_line(doc, offset);
    const next_line = get_next_line(doc, offset);

    if (previous_line === null || next_line === null) {
        return false;
    }

    return previous_line.line.trim() === "" && next_line.line.trim() === "";
}

/**
 * Returns true iff the input line is blank (contains nothing, whitespace, or
 * comments (unclosed start/end comments allowed)).
 *
 * @param line - Input line.
 * @returns True iff line is blank.
 */
export function is_blank_line(line: string): boolean {
    const startComment = "<!--";
    const endComment = "-->";
    function removeComments(s: string): string {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const start = s.indexOf(startComment);
            const end = s.indexOf(endComment);
            if (end !== -1 && (start === -1 || end < start)) {
                // Unmatched end comment is first
                s = s.slice(end + endComment.length);
            } else if (start !== -1 && end !== -1) {
                // Start comment is before end comment
                s = s.slice(0, start) + s.slice(end + endComment.length);
            } else if (start !== -1 && end === -1) {
                // Unmatched start comment is last
                s = s.slice(0, start);
            } else {
                // No more comments to remove
                return s;
            }
        }
    }
    return (
        !line || !line.trim() || !removeComments(line).replace(/>/g, "").trim()
    );
}
