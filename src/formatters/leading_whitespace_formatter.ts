import { generate_lines_with_offsets } from "../utilities/string_navigation";
import {
    line_is_surrounded_by_empty_lines,
    offset_in_code_block,
    offset_in_html_comment,
} from "../utilities/utilities";

/**
 * Standard text lines should not start with whitespace that doesn't impact the render.  In other words, if a line has an equivalent render if its starting whitespace is removed, remove it.
 */
export function remove_leading_whitespace_from_paragraph(doc: string): string {
    const fixed_lines: string[] = [];

    for (const { line, offset } of generate_lines_with_offsets(doc)) {
        /** At the start of the line is a single space followed by any alphabetic unicode character regardless of case
         *
         * Numerals are not supported
         */
        const single_leading_space_regex = /^[ ]\p{Letter}/gu;
        const single_leading_space = single_leading_space_regex.test(line);

        if (
            single_leading_space &&
            offset_in_code_block(doc, offset) === false &&
            offset_in_html_comment(doc, offset) === false &&
            line_is_surrounded_by_empty_lines(doc, offset)
        ) {
            fixed_lines.push(line.trimStart());
        } else {
            fixed_lines.push(line);
        }
    }

    // the correct ending will be added by the eol formatter
    doc = fixed_lines.join("\n");

    return doc;
}
