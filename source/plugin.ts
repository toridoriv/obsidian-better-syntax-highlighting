import { Plugin } from "obsidian";
import { Announcer } from "./announcer.ts";
import { patchCodeMirror, patchPrism } from "./patches.ts";

export class BetterCodeBlocksPlugin extends Plugin {
  onload(): Promise<void> | void {
    Announcer.initialize(this);
    patchCodeMirror();

    patchPrism()
      .then(() => {
        Announcer.instance.info("Prism.js loaded!", 3_000);
      })
      .catch((err) => {
        Announcer.instance.error(err.message, err, 3_000);
      });

    Announcer.instance.info("Better Code Blocks plugin loaded!", 3_000);
  }
}
