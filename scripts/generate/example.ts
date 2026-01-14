#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import * as utils from "../utils.ts";

utils.logger.info("Updating example...");

utils.writeIntoDir(utils.getPathToPlugin(`./example/${utils.manifest.content.name}`), [
  utils.manifest,
  utils.styles,
  utils.source,
  utils.hotReload,
]);
