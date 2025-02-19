#!/usr/bin/env node --experimental-transform-types --no-warnings=ExperimentalWarnings
import * as utils from "../utils.ts";

utils.logger.info("Updating example...");

utils.writeIntoDir(utils.getPathToPlugin("./example"), [
  utils.manifest,
  utils.styles,
  utils.source,
  utils.hotReload,
]);
