import * as path from "path";
import Mocha from "mocha";

/*
 * Version 10 (the most current as of April 11, 2023) of glob moves has changed the import style used, so
 *
 * import * as glob from "glob";
 *
 * no longer works.  Version 7 (used in the documentation for VSCode extension testing is still the most popular version on npmjs.org, but I am attempting to future proof this code to the extent possible)
 */
import { glob } from "glob";
import { Test_Md_File_Path, reset_config } from "./utility/user_config";
import { open_document, sleep } from "./utility/utilities";

export async function run(): Promise<void> {
    // Let VS Code load the test workspace.
    await open_document(Test_Md_File_Path);
    await sleep(2000);
    await reset_config();

    // Create the mocha test
    const mocha = new Mocha({
        color: true,
        ui: "tdd",
    });

    // Load the test suite.
    const test_suite_root = path.resolve(__dirname);
    const glob_options = { cwd: test_suite_root };

    // the glob v10 dependency uses a two argument call instead of a three argument call in v7, so this implementation is different than the one in the VS Code docs
    const unit_tests = glob.sync("unit/**/*.test.js", glob_options);
    const integration_tests = glob.sync(
        "integration/**/*.test.js",
        glob_options,
    );

    // add the test files
    unit_tests.forEach((f) => mocha.addFile(path.resolve(test_suite_root, f))); // Run unit tests first.
    integration_tests.forEach((f) =>
        mocha.addFile(path.resolve(test_suite_root, f)),
    );

    // run tests
    return new Promise((resolve, reject): void => {
        try {
            // Run the mocha test
            mocha.run((failures) => {
                // Ensure the control returns only after tests finished.
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                }
                resolve();
            });
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}
