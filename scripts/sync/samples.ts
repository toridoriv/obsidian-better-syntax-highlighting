#!/usr/bin/env node --experimental-transform-types --no-warnings=ExperimentalWarnings
import * as utils from "../utils.ts";

const sourceDir = "./example/Without the Plugin";

const files = utils
  .readDirectory(sourceDir, {
    maxDepth: 3,
    includeDirectories: false,
    include: /\.png$|\.md$/,
  })
  .map((path) => {
    const file = utils.readFile<"utf-8" | "base64">(
      path,
      path.endsWith(".png") ? "base64" : "utf-8",
    );

    file.name = file.name.replace(sourceDir + "/", "");

    return file;
  });

utils.writeIntoDir(`./example/${utils.manifest.content.name}`, files);
