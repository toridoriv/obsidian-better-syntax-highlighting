#!/usr/bin/env -S node --experimental-transform-types --disable-warning=ExperimentalWarning
import * as utils from "../utils.ts";

utils.logger.info("Generating assets...");

utils.writeIntoDir("./dist", [utils.manifest, utils.styles]);
