import { Plugin } from "obsidian";
import { Announcer } from "./announcer.ts";
import { patchCodeMirror } from "./patches.ts";

export class BetterCodeBlocksPlugin extends Plugin {
  onload(): Promise<void> | void {
    Announcer.initialize(this);
    patchCodeMirror();

    Announcer.instance.info("Better Code Blocks plugin loaded!", 3_000);
  }
}
