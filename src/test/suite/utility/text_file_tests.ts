/**
 * Accept a formatting function as an argument
 *
 * Return a function that runs a test given a specific set of files and settings
 */

import * as path from "node:path";
import * as assert from "node:assert/strict";
import * as fs from "node:fs";

export type Test_Runner = (
    preformatted_filename: string,
    formatted_filename: string,
) => void;

type Formatter = (doc: string) => string;

/**
 * Get the text of file `filename` in the `test_text_snippets` directory
 */
function get_file_text(filename: string): string {
    // the following line is broken
    const test_text_snippets_dir = path.resolve(
        __dirname,
        "../integration/test_text_snippets",
    );
    const file_path = path.join(test_text_snippets_dir, filename);

    // this may throw an error if the filepath doesn't work
    const text: string = fs.readFileSync(file_path, "utf8");
    return text;
}

/**
 * Assemble and return a function that accepts the filenames of two text files and then runs the formatter specified in this assembler function on the preformatted text, and then asserts that the two strings match.
 */
export function get_test_runner(formatter: Formatter): Test_Runner {
    function test_formatter(
        preformatted_filename: string,
        formatted_filename: string,
    ) {
        const preformatted: string = get_file_text(preformatted_filename);
        const correctly_formatted: string = get_file_text(formatted_filename);

        const test_formatted = formatter(preformatted);
        assert.equal(
            test_formatted,
            correctly_formatted,
            "The text didn't format properly",
        );

        // check that the operation is idempotent
        const formatted_again = formatter(test_formatted);
        assert.equal(
            test_formatted,
            formatted_again,
            "The operation is not idempotent",
        );
    }

    return test_formatter;
}
