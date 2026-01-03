/**
 * Adapted from https://github.com/DavidAnson/markdownlint/blob/main/helpers/helpers.js
 */

import * as vscode from "vscode";
import {
    FixInfo,
    LintError,
    LintResults,
    Options,
    RuleOnErrorFixInfo,
} from "markdownlint";
import { lint } from "markdownlint/sync";
import { get_markdownlint_config } from "./markdownlint_config";

/**
 * Normalizes the fields of a `RuleOnErrorFixInfo` instance (convert the optional fields to concrete fields)
 *
 * @param fix_info - `RuleOnErrorFixInfo` instance
 * @param line_number - Optional line number
 * @returns  Normalized `RuleOnErrorFixInfo` instance
 */
function normalize_fix_info(
    fix_info: FixInfo,
    line_number?: number,
): Complete_Fix_Info {
    return {
        lineNumber: fix_info.lineNumber ?? line_number ?? 0,
        editColumn: fix_info.editColumn ?? 1,
        deleteCount: fix_info.deleteCount ?? 0,
        insertText: fix_info.insertText ?? "",
    };
}

/** Fix information */
type Complete_Fix_Info = {
    /** Line number (1-based). */
    lineNumber: number;

    /** Column of the fix (1-based). */
    editColumn: number;

    /** Count of characters to delete. */
    deleteCount: number;

    /** Text to insert (after deleting). */
    insertText: string;
};

/**
 * Applies as many fixes as possible to Markdown content
 *
 * @param input - Lines of Markdown content
 * @param errors - RuleOnErrorInfo instances
 * @returns - Corrected content
 */
export function apply_fixes(input: string, errors: LintError[]): string {
    const line_ending = "\n";
    const lines: string[] = input.split(line_ending);
    const fixed_lines: (string | null)[] = lines;

    // Remove fixInfo objects without `fixInfo` or `lineNumber`
    let fix_infos: Complete_Fix_Info[] = [];
    for (const error of errors) {
        if (
            "fixInfo" in error &&
            error.fixInfo &&
            "lineNumber" in error &&
            error.lineNumber !== undefined
        ) {
            fix_infos.push(normalize_fix_info(error.fixInfo, error.lineNumber));
        }
    }

    // Sort bottom-to-top, line-deletes last, right-to-left, long-to-short
    fix_infos.sort((a, b) => {
        const a_deleting_line = a.deleteCount === -1;
        const b_deleting_line: boolean = b.deleteCount === -1;
        return (
            b.lineNumber - a.lineNumber ||
            (a_deleting_line ? 1 : b_deleting_line ? -1 : 0) ||
            b.editColumn - a.editColumn ||
            b.insertText.length - a.insertText.length
        );
    });

    if (fix_infos.length === 0) {
        return input;
    } else if (fix_infos.length > 1) {
        // Remove duplicate entries (needed for following collapse step)
        let last_fix_info: Complete_Fix_Info = fix_infos[0];
        fix_infos = [last_fix_info].concat(
            ...fix_infos.slice(1).filter((fixInfo) => {
                const unique =
                    fixInfo.lineNumber !== last_fix_info.lineNumber ||
                    fixInfo.editColumn !== last_fix_info.editColumn ||
                    fixInfo.deleteCount !== last_fix_info.deleteCount ||
                    fixInfo.insertText !== last_fix_info.insertText;
                last_fix_info = fixInfo;
                return unique;
            }),
        );
    }

    // Collapse insert/no-delete and no-insert/delete for same line/column
    let last_fix_info: FixInfo = {
        lineNumber: -1,
    };
    for (const fixInfo of fix_infos) {
        if (
            fixInfo.lineNumber === last_fix_info.lineNumber &&
            fixInfo.editColumn === last_fix_info.editColumn &&
            !fixInfo.insertText &&
            fixInfo.deleteCount > 0 &&
            last_fix_info.insertText &&
            !last_fix_info.deleteCount
        ) {
            fixInfo.insertText = last_fix_info.insertText;
            last_fix_info.lineNumber = 0;
        }
        last_fix_info = fixInfo;
    }
    fix_infos = fix_infos.filter((fixInfo) => fixInfo.lineNumber);

    // Apply all (remaining/updated) fixes
    let last_line_index = -1;
    let last_edit_index = -1;
    for (const fix_info of fix_infos) {
        const { lineNumber, editColumn, deleteCount } = fix_info;
        const lineIndex = lineNumber - 1;
        const editIndex = editColumn - 1;
        if (
            lineIndex !== last_line_index ||
            deleteCount === -1 ||
            editIndex + deleteCount <=
                last_edit_index - (deleteCount > 0 ? 0 : 1)
        ) {
            const fixed_line = apply_fix(
                lines[lineIndex],
                fix_info,
                line_ending,
            );
            if (fixed_line === null) {
                fixed_lines[lineIndex] = null;
            } else {
                lines[lineIndex] = fixed_line;
            }
        }
        last_line_index = lineIndex;
        last_edit_index = editIndex;
    }

    const corrected_lines: string[] = [];
    for (const line of fixed_lines) {
        if (line !== null) {
            corrected_lines.push(line);
        }
    }

    // Return corrected input
    return corrected_lines.join(line_ending);
}

/**
 * Fixes the specified error on a line of Markdown content.
 *
 * @param line - Line of Markdown content.
 * @param fix_info - RuleOnErrorFixInfo instance.
 * @param line_ending - Line ending to use.
 * @returns Fixed content
 */
function apply_fix(
    line: string,
    fix_info: RuleOnErrorFixInfo,
    line_ending: string,
): string | null {
    const { editColumn, deleteCount, insertText } =
        normalize_fix_info(fix_info);
    const edit_index = editColumn - 1;

    if (deleteCount === -1) {
        return null;
    } else {
        return (
            line.slice(0, edit_index) +
            insertText.replace(/\n/g, line_ending || "\n") +
            line.slice(edit_index + deleteCount)
        );
    }
}

/**
 * Wrap getting markdownlint options and calling markdownlint
 *
 * @param document - object pointing to the document.  This object is the destination for the formatted text, but its current contents are not used.
 * @param preformatted_text - The text in not `document` object is not used because the table and ordered list formatters were already applied to the string but not inserted into the `document` object
 *
 * @throws `Error` - If any error is thrown by markdownlint, it is not handled in this function.  If no action is taken, i.e. markdownlint returns `undefined` for both the results and the errors variables, then an error is raised as well.
 *
 * @returns markdownlint.LintResults - a object containing the fix information from markdownlint
 */
export function get_markdownlint_results(
    preformatted_text: string,
    tab_size: number,
): LintResults {
    const options: Options = {
        strings: {
            preformatted_text,
        },
        config: get_markdownlint_config(tab_size),
        configParsers: undefined,
        customRules: undefined,
        resultVersion: 3,
    };

    let lint_results: LintResults | undefined = lint(options);

    if (lint_results === undefined) {
        throw new Error("markdownlint returned undefined");
    }

    return lint_results;
}

/**
 * Try to run the markdownlint rules on `text`.  If an error occurs, show an VS Code Error Message and return the unchanged text.
 */
export function run_markdownlint_rules(
    text: string,
    options: vscode.FormattingOptions,
): string {
    try {
        // apply markdownlint formatting to the preformatted text
        const lint_results: LintResults = get_markdownlint_results(
            text,
            options.tabSize,
        );
        // new variable name for `text` exists to assist in debugging
        const linted_text: string = apply_fixes(
            text,
            lint_results.preformatted_text,
        );

        return linted_text;
    } catch {
        vscode.window.showErrorMessage(
            "An error occurred when attempting to run markdownlint on this text.",
        );
        return text;
    }
}
