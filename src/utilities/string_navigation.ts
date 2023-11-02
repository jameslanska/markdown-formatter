/**
 * Return the content of the line before the current line.  If the current line is the first line in the document, return `null`.
 *
 * @param doc - string separated by `\n` (not CRLF)
 * @param offset - zero based index of a the start of the current line
 */
export function get_previous_line(
    doc: string,
    offset: number,
): { line: string; offset: number } | null {
    if (offset === 0) {
        return null;
    }

    const previous_newline_index = indexOfBackward(doc, "\n", offset);

    if (previous_newline_index === -1) {
        return null;
    }

    const second_previous_newline_index = indexOfBackward(
        doc,
        "\n",
        previous_newline_index - 1,
    );

    if (second_previous_newline_index === -1) {
        return {
            line: doc.substring(0, previous_newline_index),
            offset: 0,
        };
    } else {
        return {
            line: doc.substring(
                second_previous_newline_index + 1,
                previous_newline_index,
            ),
            offset: second_previous_newline_index + 1,
        };
    }
}

/**
 * Return the first index `searchChar` is found in `doc` starting at `position` and working backwards.
 *
 * @param searchChar - string of length 1 to be looking for
 * @param position - zero index of the character to start looking at (this position is not skipped)
 *
 * @throws Error - if `position` is not within the bounds of `doc`.
 */
export function indexOfBackward(
    doc: string,
    searchChar: string,
    position?: number,
): number {
    // validation
    if (position === undefined) {
        position = doc.length - 1;
    }

    if (position < 0 || position >= doc.length) {
        throw Error("invalid position");
    }

    for (let i = position; i >= 0; i--) {
        if (doc[i] === searchChar) {
            return i;
        }
    }

    return -1;
}

/**
 * Return the content of the line after the current line.  If the current line is the last line in the document, return `null`.
 *
 * @param doc - string separated by `\n` (not CRLF)
 * @param offset - zero based index of a position in the current line
 */
export function get_next_line(
    doc: string,
    offset: number,
): { line: string; offset: number } | null {
    const line_end_index = doc.indexOf("\n", offset);
    if (line_end_index === -1) {
        return null;
    }

    const second_end_index = doc.indexOf("\n", line_end_index + 1);

    if (second_end_index === -1) {
        return {
            line: doc.substring(line_end_index),
            offset: line_end_index + 1,
        };
    } else {
        return {
            line: doc.substring(line_end_index, second_end_index),
            offset: line_end_index + 1,
        };
    }
}

/**
 * Returns a generator that can be used to iterate over the lines in the string, along with the string offset at the start of the line.
 *
 * @Remarks
 * This generator may yield an object that includes an invalid offset.  If the last character in the string is `\n`, it will yield an empty string and an offset equivalent to the string length.
 *
 * This is the correct behavior to regenerate the string with a `join` method, but it can cause other bugs.
 *
 * @param doc - string separated by `\n` (not CRLF)
 */
export function* generate_lines_with_offsets(
    doc: string,
): Generator<{ line: string; offset: number }> {
    let index = 0;

    while (index < doc.length) {
        const line_end_index = doc.indexOf("\n", index);

        if (line_end_index === -1) {
            yield { line: doc.substring(index), offset: index };
            index = doc.length;
        } else {
            yield {
                line: doc.substring(index, line_end_index),
                offset: index,
            };
            index = line_end_index + 1;
        }
    }

    // return the last line if it is empty
    if (doc.endsWith("\n")) {
        yield { line: "", offset: doc.length };
    }
}
