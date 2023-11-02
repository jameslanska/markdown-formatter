import * as assert from "assert/strict";
import { empty_line_after_lists_formatter } from "../../../formatters/markdownlint_wrapper/md032_extension";

const example_1 = `
1. Some
2. List
Some Text
`;

const example_1_fixed = `
1. Some
2. List

Some Text
`;

const example_2 = `
- Some
- List
Some Text
`;

const example_2_fixed = `
- Some
- List

Some Text
`;

const example_3 = `
1. Some
2. List
 Some Text
`;

const example_3_fixed = `
1. Some
2. List

 Some Text
`;

const example_4 = `
1. Some
2. List
   Some Text
`;

const example_5 = `
1. Foo
   * Bar
2. Baz
`;

const example_6 = `
- Some
  1. demo
- List
`;

const example_7 = `
- Some
- List
<!-- HTML comment -->
`;

function check_formatting(preformatted: string, formatted: string): void {
    assert.deepEqual(empty_line_after_lists_formatter(preformatted), formatted);
}

suite("md032_extension function", function () {
    test("Ordered list", function () {
        check_formatting(example_1, example_1_fixed);
    });

    test("Unordered list", function () {
        check_formatting(example_2, example_2_fixed);
    });

    test("Ordered list followed by line with leading space", function () {
        check_formatting(example_3, example_3_fixed);
    });

    test("Ordered list followed by line with 3 leading spaces", function () {
        check_formatting(example_4, example_4);
    });

    test("nested unordered list with nonstandard formatting", function () {
        check_formatting(example_5, example_5);
    });

    test("ordered list nested inside unordered list", function () {
        check_formatting(example_6, example_6);
    });

    test("list followed by an HTML comment", function () {
        check_formatting(example_7, example_7);
    });
});
