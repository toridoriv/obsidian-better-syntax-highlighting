#!/usr/bin/env node --experimental-transform-types --no-warnings=ExperimentalWarnings
import * as utils from "../utils.ts";

utils.logger.info("Generating assets...");

utils.writeIntoDir("./dist", [utils.manifest, utils.styles]);
