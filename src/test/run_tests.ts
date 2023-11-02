import * as path from "path";

import { runTests } from "@vscode/test-electron";
import { TEST_WORKSPACE_PATH } from "./suite/utility/user_config";

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, "../../");

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, "./suite/index");

        const launchArgs = [TEST_WORKSPACE_PATH];

        // Download VS Code, unzip it and run the integration test
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            version: "stable",
            launchArgs,
        });
    } catch (err) {
        console.log(err);
        console.error("Failed to run tests");
        process.exit(1);
    }
}

main();
