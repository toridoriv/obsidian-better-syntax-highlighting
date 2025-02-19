import { createRequire } from "node:module";
import { Logger } from "tslog";
import { colors } from "@toridoriv/cliffy";
import fs from "node:fs";
import type { PluginManifest } from "obsidian";

export type PackageJson = typeof import("../package.json");
export type TextFile<T = string> = {
  name: string;
  content: T;
};

const require = createRequire(import.meta.url);

export const logger = new Logger({
  type: "pretty",
  prettyLogTimeZone: "local",
  minLevel: 0,
});

export const packageJson: PackageJson = require("../package.json");

export const manifest: TextFile<PluginManifest> = {
  name: "manifest.json",
  content: {
    id: packageJson.displayName.toLowerCase().replaceAll(" ", "-"),
    name: packageJson.displayName,
    version: packageJson.version,
    description: packageJson.description,
    author: packageJson.author.name,
    authorUrl: packageJson.author.url,
    minAppVersion: "0.15.0",
    isDesktopOnly: false,
  },
};

export const styles: TextFile = {
  name: "styles.css",
  content: fs.readFileSync("./assets/styles.css", { encoding: "utf-8" }),
};

export const source: TextFile = {
  name: "main.js",
  get content() {
    return fs.readFileSync(`./dist/${this.name}`, { encoding: "utf-8" });
  },
};

export const hotReload: TextFile = {
  name: ".hotreload",
  content: "",
};

/**
 * Writes files to a given directory, creating the directory if it doesn't exist.
 *
 * @param dir   - The directory to write the files to.
 * @param files - An array of objects containing the file name and content.
 */
export function writeIntoDir(dir: string, files: TextFile<unknown>[]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const file of files) {
    const path = [dir, file.name].join("/").replaceAll("//", "/");

    fs.writeFileSync(
      path,
      typeof file.content !== "string"
        ? JSON.stringify(file.content, null, 2)
        : file.content,
      { encoding: "utf-8" },
    );

    logger.info(`File written to ${formatPath(path)}`);
  }
}

/**
 * Formats a path with color for better readability.
 *
 * @param name
 * @returns The formatted path.
 */
export function formatPath(name: string) {
  return colors.bold.yellow(name);
}

export function getPathToPlugin(base: string) {
  return [base, ".obsidian", "plugins", manifest.content.id]
    .join("/")
    .replaceAll("//", "/");
}
