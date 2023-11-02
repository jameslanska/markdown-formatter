import { remove_leading_whitespace_from_paragraph } from "../../../formatters/leading_whitespace_formatter";
import { Test_Runner, get_test_runner } from "../utility/text_file_tests";

const test_formatter: Test_Runner = get_test_runner(
    remove_leading_whitespace_from_paragraph,
);

suite(
    "Remove single leading space from paragraph with surrounding empty lines",
    function () {
        test("Remove single space", function () {
            test_formatter(
                "paragraph_with_single_leading_space.txt",
                "paragraph_with_single_leading_space_fixed.txt",
            );
        });
    },
);
