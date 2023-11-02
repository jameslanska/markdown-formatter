import { format_tables } from "@jameslanska/markdown-table-formatter";
import { get_test_runner, Test_Runner } from "../utility/text_file_tests";

const test_formatter: Test_Runner = get_test_runner(format_tables);

suite("format_markdown_tables function", function () {
    test("basic table", function () {
        test_formatter("basic_table.txt", "basic_table_fixed.txt");
    });

    test("table alignment", function () {
        test_formatter("table_alignment.txt", "table_alignment_fixed.txt");
    });

    test("table with empty cells", function () {
        test_formatter(
            "table_with_empty_cells.txt",
            "table_with_empty_cells_fixed.txt",
        );
    });

    test("table width expansion", function () {
        test_formatter(
            "table_width_expansion.txt",
            "table_width_expansion_fixed.txt",
        );
    });

    test("table width reduction", function () {
        test_formatter(
            "table_width_reduction.txt",
            "table_width_reduction_fixed.txt",
        );
    });

    test("table with | in code block", function () {
        test_formatter(
            "table_with_pipe_in_code_block.txt",
            "table_with_pipe_in_code_block_fixed.txt",
        );
    });

    test("table with trailing text", function () {
        test_formatter(
            "table_with_trailing_text.txt",
            "table_with_trailing_text_fixed.txt",
        );
    });
});
