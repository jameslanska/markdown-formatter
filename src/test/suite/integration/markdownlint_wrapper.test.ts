import { run_markdownlint_rules } from "../../../formatters/markdownlint_wrapper/markdownlint_wrapper";
import { Test_Runner, get_test_runner } from "../utility/text_file_tests";
import {
    apply_setting_to_workspace_config,
    reset_config,
} from "../utility/user_config";

/**
 * Run markdownlint on the given text.
 */
function run_markdownlint(doc: string): string {
    return run_markdownlint_rules(doc, {
        tabSize: 4,
        insertSpaces: true,
    });
}

const test_formatter: Test_Runner = get_test_runner(run_markdownlint);

suite("markdownlint wrapper", function () {
    this.beforeEach(async function () {
        await reset_config();
    });

    this.afterEach(async function () {
        await reset_config();
    });

    suite("default settings", function () {
        test("MD004 fix asterisk unordered lists", function () {
            test_formatter(
                "asterisk_unordered_list.txt",
                "dash_unordered_list.txt",
            );
        });

        test("MD007 fix unordered list indentation", function () {
            test_formatter(
                "3_spaces_indent_unordered_list.txt",
                "2_spaces_indent_unordered_list.txt",
            );
        });

        test("MD007 ignore the indentation of an unordered list when nested in an ordered list", function () {
            test_formatter(
                "unordered_list_nested_in_ordered_list.txt",
                "unordered_list_nested_in_ordered_list.txt",
            );
        });

        test("MD0012 Remove unnecessary blank lines", function () {
            test_formatter(
                "extra_blank_lines.txt",
                "extra_blank_lines_fixed.txt",
            );
        });

        test("MD027 Extra spaces after blockquote symbol", function () {
            test_formatter(
                "extra_spaces_after_blockquote_symbol.txt",
                "extra_spaces_after_blockquote_symbol_fixed.txt",
            );
        });

        test("MD030 Fix extra spacing after list markers", function () {
            test_formatter(
                "extra_spacing_after_list_markers.txt",
                "extra_spacing_after_list_markers_fixed.txt",
            );
        });

        test("MD031 Add newlines around code blocks", function () {
            test_formatter(
                "spacing_around_code_blocks.txt",
                "spacing_around_code_blocks_fixed.txt",
            );
        });

        test("MD034 fix bare urls", function () {
            test_formatter("bare_links.txt", "bare_links_fixed.txt");
        });

        test("MD049 Fix italics styling", function () {
            test_formatter("italics_styling.txt", "italics_styling_fixed.txt");
        });

        test("MD050 Fix bold styling", function () {
            test_formatter("bold_styling.txt", "bold_styling_fixed.txt");
        });
    });

    suite("disable MD004", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.markdownlint_rules.MD004.enabled",
                false,
            );
        });

        test("asterisk unordered list without MD004", function () {
            test_formatter(
                "asterisk_unordered_list.txt",
                "asterisk_unordered_list.txt",
            );
        });
    });

    suite("MD007 indent 4 spaces", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.markdownlint_rules.MD007.indent",
                4,
            );
        });

        test("MD007 indent 4 spaces test", function () {
            test_formatter(
                "3_spaces_indent_unordered_list.txt",
                "4_spaces_indent_unordered_list.txt",
            );
        });
    });

    suite("disable MD012", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.markdownlint_rules.MD012.enabled",
                false,
            );
        });

        test("Extra blank lines", function () {
            test_formatter("extra_blank_lines.txt", "extra_blank_lines.txt");
        });
    });

    suite("disable MD027", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.markdownlint_rules.MD027.enabled",
                false,
            );
        });

        test("Extra spaces after blockquote symbol", function () {
            test_formatter(
                "extra_spaces_after_blockquote_symbol.txt",
                "extra_spaces_after_blockquote_symbol.txt",
            );
        });
    });

    suite("disable MD030", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.markdownlint_rules.MD030.enabled",
                false,
            );
        });

        test("Ignore extra spacing after list markers", function () {
            test_formatter(
                "extra_spacing_after_list_markers.txt",
                "extra_spacing_after_list_markers.txt",
            );
        });
    });

    suite("disable MD049", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.markdownlint_rules.MD049.enabled",
                false,
            );
        });

        test("MD049 Ignore italics styling", function () {
            test_formatter("italics_styling.txt", "italics_styling.txt");
        });
    });

    suite("disable MD050", function () {
        this.beforeEach(async function () {
            await apply_setting_to_workspace_config(
                "markdown-formatter.markdownlint_rules.MD050.enabled",
                false,
            );
        });

        test("MD050 Ignore bold styling", function () {
            test_formatter("bold_styling.txt", "bold_styling.txt");
        });
    });
});
