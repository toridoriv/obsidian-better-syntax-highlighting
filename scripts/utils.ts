import fs from "node:fs";
import { createRequire } from "node:module";
import nodePath from "node:path";

import { colors } from "@cliffy/ansi/colors";
import type { PluginManifest } from "obsidian";
import { Logger } from "tslog";

export type PackageJson = typeof import("../package.json");
export type FileContent<T = string> = {
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

export const manifest: FileContent<PluginManifest> = {
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

export const styles: FileContent = {
  name: "styles.css",
  content: fs.readFileSync("./assets/styles.css", { encoding: "utf-8" }),
};

export const source: FileContent = {
  name: "main.js",
  get content() {
    return fs.readFileSync(`./dist/${this.name}`, { encoding: "utf-8" });
  },
};

export const hotReload: FileContent = {
  name: ".hotreload",
  content: "",
};

/**
 * Writes files to a given directory, creating the directory if it doesn't exist.
 *
 * @param dir   - The directory to write the files to.
 * @param files - An array of objects containing the file name and content.
 */
export function writeIntoDir(dir: string, files: FileContent<unknown>[]) {
  for (const file of files) {
    const path = file.name.includes(dir)
      ? file.name
      : [dir, file.name].join("/").replaceAll("//", "/");
    const baseDir = nodePath.dirname(path);

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const isStringContent = typeof file.content === "string";
    const isBase64Content = isStringContent && isBase64(file.content);

    let data: string | Buffer = isStringContent
      ? (file.content as string)
      : JSON.stringify(file.content, null, 2);

    if (isBase64Content) {
      data = Buffer.from(data, "base64");
    }

    fs.writeFileSync(path, data, { encoding: isBase64Content ? "base64" : "utf-8" });

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

export type ReadDirectoryOptions = {
  maxDepth?: number;
  include?: RegExp;
  exclude?: RegExp;
  includeDirectories?: boolean;
  includeFiles?: boolean;
  cache?: string[];
  depth?: number;
};

export function readDirectory(
  path: string,
  {
    maxDepth = 1,
    exclude = /^\b$/,
    include = /[\s\S]*/,
    includeDirectories = true,
    includeFiles = true,
    cache = [],
    depth = 0,
  }: ReadDirectoryOptions,
) {
  const entries = fs.readdirSync(path, { withFileTypes: true });

  for (const entry of entries) {
    const fullpath = [path, entry.name].join("/");
    const shouldInclude = include.test(fullpath);

    if (exclude.test(fullpath)) continue;

    if (entry.isDirectory()) {
      if (includeDirectories && shouldInclude) {
        cache.push(fullpath);
      }

      if (depth < maxDepth) {
        readDirectory(fullpath, {
          maxDepth,
          exclude,
          include,
          includeDirectories,
          includeFiles,
          cache,
          depth: depth + 1,
        });

        continue;
      }
    }

    if (!shouldInclude) continue;

    if (entry.isFile() && includeFiles) {
      cache.push(fullpath);
    }
  }

  return cache;
}

export function readFile<T extends BufferEncoding = "utf-8">(
  path: string,
  encoding: BufferEncoding = "utf-8",
): FileContent<T extends `utf${string}` ? string : Buffer> {
  return {
    name: path,
    content: fs.readFileSync(path, encoding) as T extends `utf${string}`
      ? string
      : Buffer,
  };
}

export function isBase64(value: unknown) {
  if (typeof value !== "string") return false;

  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(
    value,
  );
}
