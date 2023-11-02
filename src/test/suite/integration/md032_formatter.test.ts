import { run_markdownlint_rules } from "../../../formatters/markdownlint_wrapper/markdownlint_wrapper";
import { empty_line_after_lists_formatter } from "../../../formatters/markdownlint_wrapper/md032_extension";
import { Test_Runner, get_test_runner } from "../utility/text_file_tests";

function format(text: string): string {
    text = empty_line_after_lists_formatter(text);
    text = run_markdownlint_rules(text, {
        tabSize: 4,
        insertSpaces: true,
    });
    return text;
}

const test_formatter: Test_Runner = get_test_runner(format);

suite("MD032 Add empty lines around lists", function () {
    test("Add empty lines around lists", function () {
        test_formatter(
            "empty_lines_around_lists.txt",
            "empty_lines_around_lists_fixed.txt",
        );
    });

    test("Don't add empty lines around nested list items", function () {
        test_formatter(
            "ordered_list_nested_in_unordered_list.txt",
            "ordered_list_nested_in_unordered_list.txt",
        );
    });

    test("Don't add empty lines around nested list items 2", function () {
        test_formatter(
            "unordered_list_nested_in_ordered_list_2.txt",
            "unordered_list_nested_in_ordered_list_2_fixed.txt",
        );
    });

    test("Don't add new lines between multiline items", function () {
        test_formatter(
            "empty_lines_around_lists_with_multiline_items.txt",
            "empty_lines_around_lists_with_multiline_items_fixed.txt",
        );
    });

    test("Consider a line with only an HTML comment an empty line", function () {
        test_formatter(
            "list_surrounding_html_comment.txt",
            "list_surrounding_html_comment.txt",
        );
    });
});
