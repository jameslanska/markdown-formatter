/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
// read in the default config of package.json

import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";

export const TEST_WORKSPACE_PATH = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "test_workspace",
);
export const Test_Workspace_URI = vscode.Uri.file(TEST_WORKSPACE_PATH);
export const Test_Md_File_Path = vscode.Uri.joinPath(
    Test_Workspace_URI,
    "test.md",
);

/**
 * Read in the properties from package.json to get the default configuration for testing
 *
 * @Remarks
 * This function aims to prevent testing problems from having two independent places where the default configuration is defined.
 */
export function get_default_config(): Map<
    string,
    boolean | number | string[] | string
> {
    const package_json_path = path.resolve(
        __dirname,
        "../../../../package.json",
    );

    const package_json: string = fs.readFileSync(package_json_path, "utf-8");
    const package_obj: any = JSON.parse(package_json);
    const properties = package_obj.contributes.configuration.properties;

    const default_config = new Map();

    for (const key in properties) {
        default_config.set(key, properties[key]["default"]);
    }

    return default_config;
}

/**
 * Apply the default config settings
 */
export async function reset_config(): Promise<void> {
    const default_config: Map<string, any> = get_default_config();
    const workspace = vscode.workspace.getConfiguration();
    await apply_settings(default_config, workspace);
}

/**
 * Apply the setting_id and value to the workspace config (not global settings)
 *
 * @param setting_id - full setting id
 */
export async function apply_setting_to_workspace_config(
    setting_id: string,
    value: any,
): Promise<void> {
    await vscode.workspace
        .getConfiguration()
        .update(setting_id, value, vscode.ConfigurationTarget.Workspace);
}

/**
 * Apply the settings to the given `vscode.WorkspaceConfiguration`
 */
export async function apply_settings(
    settings: Map<string, any>,
    workspace_config: vscode.WorkspaceConfiguration,
): Promise<void> {
    // apply settings
    for (const [key, value] of settings) {
        await workspace_config.update(
            key,
            value,
            vscode.ConfigurationTarget.Workspace,
        );
    }
}
