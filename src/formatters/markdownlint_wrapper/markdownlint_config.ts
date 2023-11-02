import { get_markdownlint_settings } from "../../utilities/utilities";

/**
 * Default rule settings as set by markdownlint that aren't changed by Markdown Formatter
 *
 * This object is not strictly necessary, but improves readability and makes the code less implicit and "magic".
 */
const MARKDOWNLINT_DEFAULTS = {
    /** Inconsistent indentation for list items at the same level */
    MD005: true,

    /** deprecated by markdownlint */
    MD006: false,

    /** Reversed link syntax */
    MD011: true,

    /** No space after hash on atx style heading */
    MD018: true,

    /** Multiple spaces after hash on atx style heading */
    MD019: true,

    /** No space inside hashes on closed atx style heading */
    MD020: true,

    /** Multiple spaces inside hashes on closed atx style heading */
    MD021: true,

    /** Headings should be surrounded by blank lines */
    MD022: {
        lines_above: 1,
        lines_below: 1,
    },

    /** Headings must start at the beginning of the line */
    MD023: true,

    /** Lists should be surrounded by blank lines */
    MD032: true,

    /** Spaces inside emphasis markers */
    MD037: true,

    /** force the removal of spaces at the bounds of link text */
    MD039: true,

    /** Files should end with a single newline character */
    MD047: true,
};

/**
 * Default configurations that differ from those given by markdownlint itself
 * 
 * @see {@link https://github.com/jameslanska/markdown-formatter/blob/main/docs/differences_between_markdown_lint_defaults.md | Differences Between Markdownlint Defaults}
 */
const MARKDOWN_FORMATTER_DEFAULTS = {
    /** Unordered list style */
    MD004: { style: "dash" },

    /** Unordered list indentation */
    MD007: { indent: 2 },

    /**
     * No trailing spaces
     *
     * - "br_spaces" sets the number of trailing spaces to make a line break.  The default for "br_spaces" is 2.  Setting it to 1, turns it off.
     * - "strict" turns off some other rule exceptions
     */
    MD009: { strict: true, br_spaces: 1 },

    // MD010 doesn't have a default because tab size is dynamic

    /** No consecutive blank lines */
    MD012: {
        maximum: 1,
    },

    /** Remove dollar signs used before shell commands in a shell code block when no output is shown */
    MD014: true,

    /** turn off rule limiting punctuation in heading.  It is common to have question marks in headers. */
    MD026: false,

    /** spacing after list item markers */
    MD030: {
        ol_single: 1,
        ul_single: 1,
        ol_multi: 1,
        ul_multi: 1,
    },

    /** Fenced code blocks should be surrounded by blank lines */
    MD031: {
        /** Set the list_items parameter to false to disable this rule for list items. Disabling this behavior for lists can be useful if it is necessary to create a [tight](https://spec.commonmark.org/0.29/#tight) list containing a code fence. */
        list_items: true,
    },

    /** Add `<>` to bare URLs */
    MD034: true,

    /** allow spaces at the bounds of backtick envs */
    MD038: false,

    /** Capitalization of proper names is a content problem, not a markdown style or syntax problem. */
    MD044: false,

    /** italics style (as opposed to underscore) */
    MD049: { style: "asterisk" },

    /** bold style (as opposed to underscore) */
    MD050: { style: "asterisk" },

    /** Turn off deletion of link and image defintions if there are no references */
    MD053: false,
};

/**
 * Process all VS Code user configuration settings and return of Map object conforming to the markdownlint configuration requirements.
 */
function get_user_markdownlint_config(
    tab_size: number,
): Map<string, boolean | object> {
    const markdownlint_user_settings = get_markdownlint_settings();

    const user_config: Map<string, object | boolean> = new Map();

    // Unordered lists are preceded by dashes (not asterisks or plus)
    if (markdownlint_user_settings.get("MD004.enabled") === false) {
        user_config.set("MD004", false);
    }

    // Unordered list indentation
    if (markdownlint_user_settings.get("MD007.indent") === 4) {
        user_config.set("MD007", { indent: 4 });
    }

    // Hard tabs
    const MD010_code_blocks: boolean = markdownlint_user_settings.get(
        "MD010.code_blocks",
        true,
    );
    const MD010_code_languages = markdownlint_user_settings.get(
        "MD010.code_languages",
        ["go", "golang"],
    );
    user_config.set("MD010", {
        code_blocks: MD010_code_blocks,
        ignore_code_languages: MD010_code_languages,
        spaces_per_tab: tab_size,
    });

    // allow consecutive blank lines (necessary if you want more than one line after a header)
    if (markdownlint_user_settings.get("MD012.enabled") === false) {
        user_config.set("MD012", false);
    }

    // Remove unnecessary spaces after blockquote symbol
    user_config.set(
        "MD027",
        markdownlint_user_settings.get("MD027.enabled", true),
    );

    // Spaces after list markers
    if (markdownlint_user_settings.get("MD030.enabled") === false) {
        user_config.set("MD030", false);
    }

    // italics style
    if (markdownlint_user_settings.get("MD049.enabled") === false) {
        user_config.set("MD049", false);
    }

    // bold style
    if (markdownlint_user_settings.get("MD050.enabled") === false) {
        user_config.set("MD050", false);
    }

    return user_config;
}

/**
 * Get the configuration object to pass to `markdownlint`.  Merges the default config and the user config defined in VS Code settings.
 */
export function get_markdownlint_config(tab_size: number): object {
    // Merge default config and the user config
    const configuration = Object.fromEntries([
        ...Object.entries(MARKDOWNLINT_DEFAULTS),
        ...Object.entries(MARKDOWN_FORMATTER_DEFAULTS),
        ...get_user_markdownlint_config(tab_size),
    ]);

    return configuration;
}
