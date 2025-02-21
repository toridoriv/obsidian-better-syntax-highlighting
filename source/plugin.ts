import { loadPrism, MarkdownView, Plugin } from "obsidian";
import { Announcer } from "./announcer.ts";
import { patchCodeMirror, patchPrism } from "./patches.ts";

export class BetterCodeBlocksPlugin extends Plugin {
  onload(): Promise<void> | void {
    Announcer.initialize(this);

    this.app.workspace.onLayoutReady(async () => {
      try {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        const Prism = await loadPrism();

        patchCodeMirror();
        patchPrism(Prism);

        console.log({ view });

        if (view && view.file) {
          view.previewMode.rerender(true);
        }

        Prism.highlightAll();
      } catch (e) {
        if (e instanceof Error) {
          Announcer.instance.error(e?.message, e);
          return;
        }

        Announcer.instance.error("Something went wrong", e as Error);
      }
    });
  }
}
