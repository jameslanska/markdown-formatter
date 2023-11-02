"use strict";

import * as vscode from "vscode";
import {
    EXT_NAME,
    offset_in_code_block,
    offset_in_html_comment,
} from "../utilities/utilities";
import { generate_lines_with_offsets } from "../utilities/string_navigation";

/** At the start of the string there are 0-1 spaces followed by 1 or more numerals followed by a period and a space */
const ordered_list_item_regex = /^[ ]?[\d]+[.] /;

/**
 * Fix ordered list numbering for nonnested ordered lists
 *
 * This function performs no action on nested ordered lists.
 *
 * @param doc - text of the entire document
 * @returns - text of the entire document with properly formatted ordered lists
 */
export function format_ordered_list_numbering(doc: string): string {
    let fixed_lines: string[] = [];
    let counter = 1;

    for (const { line, offset } of generate_lines_with_offsets(doc)) {
        // check if we are in a code block
        if (
            offset_in_code_block(doc, offset) ||
            line.trim().startsWith("```")
        ) {
            fixed_lines = fixed_lines.concat(line);
            continue;
        }

        // check if we are in an HTML comment
        if (offset_in_html_comment(doc, offset)) {
            fixed_lines = fixed_lines.concat(line);
            continue;
        }

        let fixed_line = line;
        const result = line.match(ordered_list_item_regex);
        if (result !== null) {
            fixed_line = line.replace(ordered_list_item_regex, `${counter}. `);
            counter++;
        } else if (
            // ignore empty lines or indented lines
            line.trim() === "" ||
            (line.length > 2 && line.substring(0, 2) === "  ")
        ) {
            // do nothing
        } else {
            counter = 1;
        }

        fixed_lines = fixed_lines.concat(fixed_line);
    }

    // the correct ending will be added by the eol formatter
    doc = fixed_lines.join("\n");

    const ordered_list_config = vscode.workspace.getConfiguration(
        `${EXT_NAME}.ordered_lists`,
    );

    if (ordered_list_config.get("right_align") === true) {
        return right_align_numbers(doc);
    }

    return doc;
}

/**
 * Add an extra space before the ordered list numbers on lists that extend past nine so they are aligned at the start of the content instead of aligned at the start of the numbers.
 *
 * @param doc - text of the entire document
 */
function right_align_numbers(doc: string): string {
    const reversed_lines = doc.split("\n").reverse();
    let fixed_lines: string[] = [];
    let in_code_block = false;
    let in_double_digit_list = false;

    for (const line of reversed_lines) {
        // check if we are in a code block
        if (line.trim().startsWith("```")) {
            in_code_block = !in_code_block;
        }

        if (in_code_block) {
            fixed_lines = [line].concat(...fixed_lines);
            continue;
        }

        let fixed_line = line;
        if (ordered_list_item_regex.test(line)) {
            // is double digit number
            if (/\d/.test(line.charAt(1))) {
                in_double_digit_list = true;
            }

            if (in_double_digit_list && line.charAt(1) === ".") {
                fixed_line = " " + line;
            }

            if (line.startsWith("1. ")) {
                in_double_digit_list = false;
            }
        }

        fixed_lines = [fixed_line].concat(...fixed_lines);
    }

    return fixed_lines.join("\n");
}
