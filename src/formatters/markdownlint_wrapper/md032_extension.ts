"use strict";

/** At the start of the string there are 1 or more numerals followed by a period and a space */
const ordered_list_item_at_line_start = /^[\d]+[.] /;

/** At the start of the line there is either an asterisk `*`, a plus sign `+`, or a dash `-`.  This is followed by a space. */
const unordered_list_item_at_line_start = /^[-+*] /;

/**
 * Ensure that there is an empty line (html comments are ignored in the consideration of empty) after each non-nested ordered and unordered list
 *
 * @Example
 *
 * Ordered list example
 *
 * ```markdown
 * 1. Some
 * 2. List
 * Some text
 * ```
 *
 * Unordered list example
 *
 * ```markdown
 * - Some
 * - List
 * Some text
 * ```
 *
 * An empty line should be added before "Some text" in both situations
 *
 * @Remarks
 * Lines without a list item symbol or sufficient spaces to denote a follow-up paragraph will not be considered part of this list.  This deviates from the behavior of CommonMark!
 *
 * This function does not support nested lists.
 *
 * This function performs no actions on lists that are followed by an HTML comment
 *
 * @param doc - text of the entire document
 * @returns - text of the entire document with properly formatted ordered lists
 */
export function empty_line_after_lists_formatter(doc: string): string {
    function next_line(line: string, list_status: boolean) {
        fixed_lines = fixed_lines.concat(line);
        in_list = list_status;
    }

    // split lines with either CRLF or LF
    const lines = doc.split(/\r?\n/);

    let fixed_lines: string[] = [];
    let in_code_block = false;

    /** the previous line was an ordered list item or unordered list item with no spaces before the list identifier */
    let in_list = false;

    for (const line of lines) {
        // check if we are in a code block
        if (line.trim().startsWith("```")) {
            in_code_block = !in_code_block;
        }

        if (in_code_block) {
            next_line(line, false);
            continue;
        }

        if (line.trim() === "") {
            next_line(line, false);
            continue;
        }

        // if in list item at start of line
        if (
            ordered_list_item_at_line_start.test(line) ||
            line.startsWith("- ")
        ) {
            next_line(line, true);
            continue;
            // if previous line was a list item at start of line
        } else if (in_list) {
            // if following line is an HTML comment
            if (line.trim().startsWith("<!--")) {
                next_line(line, false);
                continue;
            }

            // if in a list item indented at least one spaces
            if (
                ordered_list_item_at_line_start.test(line.trim()) ||
                unordered_list_item_at_line_start.test(line.trim())
            ) {
                next_line(line, false);
                continue;
            }

            /*
             * 3 spaces if nesting in an ordered list or 2 for an unordered list
             * 2 spaces for an ordered list will be accepted as well even though it isn't necessarily correct or ideal
             */
            if (line.startsWith("  ") && line.trim() !== "") {
                next_line(line, false);
                continue;
            }

            fixed_lines = fixed_lines.concat("");
            fixed_lines = fixed_lines.concat(line);
            continue;
        } else {
            next_line(line, false);
            continue;
        }
    }

    // the correct ending will be added by the eol formatter
    doc = fixed_lines.join("\n");

    return doc;
}
