import { format_ordered_list_numbering } from "../../../formatters/ordered_list_formatter";
import { Test_Runner, get_test_runner } from "../utility/text_file_tests";
import {
    apply_setting_to_workspace_config,
    reset_config,
} from "../utility/user_config";

const test_formatter: Test_Runner = get_test_runner(
    format_ordered_list_numbering,
);

suite("format_ordered_list_numbering function", function () {
    this.beforeEach(async function () {
        // this test can take up to 5 seconds (often times out with default 2 seconds on GitHub Actions)
        this.timeout(10000); 

        await reset_config();
    });

    this.afterEach(async function () {
        await reset_config();
    });

    suite("default settings", function () {
        test("fix right aligned ordered lists", function () {
            test_formatter(
                "right_align_ordered_list.txt",
                "left_align_ordered_list.txt",
            );
        });

        test("ordered list nested in unordered list", function () {
            test_formatter(
                "ordered_list_nested_in_unordered_list.txt",
                "ordered_list_nested_in_unordered_list.txt",
            );
        });

        test("list nested inside a pathological code block", function () {
            test_formatter(
                "list_nested_inside_a_pathological_code_block.txt",
                "list_nested_inside_a_pathological_code_block.txt",
            );
        });

        test("list nested inside an HTML comment", function () {
            test_formatter(
                "list_nested_inside_HTML_comment.txt",
                "list_nested_inside_HTML_comment.txt",
            );
        });
    });

    suite("right align setting", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.ordered_lists.right_align",
                true,
            );
        });

        test("fix left aligned ordered lists", function () {
            test_formatter(
                "left_align_ordered_list.txt",
                "right_align_ordered_list.txt",
            );
        });
    });
});
