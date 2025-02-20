import { loadPrism } from "obsidian";
import type { Grammar, GrammarRest, GrammarValue, TokenObject } from "prismjs";

type PrismGrammar = GrammarRest & Record<string, GrammarValue>;

function getGrammarToken(grammar: PrismGrammar, key: string): TokenObject {
  const def = grammar[key];
  const fallback = { pattern: /^\b$/ };

  if (!def) return fallback;
  if (def instanceof RegExp) return { pattern: def };
  if (Array.isArray(def)) return fallback;

  return def;
}

export function patchCodeMirror() {
  const token = "if (stream != state.thisLine.stream)";
  const { CodeMirror } = window;
  const markdownMode = CodeMirror.modes.markdown;

  if (markdownMode.isPatch) return;

  const markdownModeBody = markdownMode.toString();
  const index = markdownModeBody.indexOf(token);
  const firstHalf = markdownModeBody
    .substring(0, index)
    .replace("function(cmCfg, modeCfg)", "");
  const secondHalf = markdownModeBody.substring(index);
  const fix = "state.quote = 0;";
  const corrected = [firstHalf, fix, secondHalf]
    .join("")
    .replace("modeCfg.strikethrough = false;", "modeCfg.strikethrough = true;");

  const createMdFactory = new Function(
    "cmCfg",
    "modeCfg",
    `"use strict"; return function markdown(cmCfg, modeCfg) ${corrected};`,
  ) as () => CodeMirror.ModeFactory<any>;
  const markdownModeFactory = createMdFactory();

  Object.defineProperty(markdownModeFactory, "dependencies", {
    enumerable: true,
    configurable: true,
    value: ["xml"],
  });

  Object.defineProperty(markdownModeFactory, "isPatch", {
    enumerable: false,
    configurable: false,
    value: true,
  });

  CodeMirror.defineMode("markdown", markdownModeFactory);
}

export async function patchPrism() {
  const Prism = await loadPrism();
  const markdown = Prism.languages.markdown as PrismGrammar;
  const bold = {
    ...getGrammarToken(markdown, "bold"),
    pattern: /\*{2}[^\n\r]+\*{2}|_{2}[^\n\r]+_{2}/gm,
    alias: ["inline"],
  };
  const italic = {
    ...getGrammarToken(markdown, "italic"),
    pattern:
      /\*{1}[^\n\r *]{1,}[^\n\r*]+[^\n\r *]{1,}\*{1}(?!.*\*)|_{1}[^\n\r _]{1,}[^\n\r_]+[^\n\r _]{1,}_{1}(?!.*_)/gm,
    alias: ["inline"],
  };
  const grammar: PrismGrammar = {
    blockquote: {
      alias: ["block", "thematic-break"],
      pattern: /^>{1,} ?[^\n\r]*[\n|\r]{0,}/gm,
      inside: {
        bold,
        italic,
      },
    },
    bold,
    italic,
    list: {
      ...getGrammarToken(markdown, "list"),
      alias: ["block", "thematic-break"],
      pattern: /^[ \t]{0,}(\d{1,}\. [^\n\r]*[\n|\r]{0,1}|[-*+] [^\n\r]*[\n|\r]{0,1})/gm,
      greedy: false,
      lookbehind: false,
      inside: {
        bold,
        italic,
      },
    },
  };

  Prism.languages["markdown"] = Prism.languages.extend("markdown", grammar);
  Prism.languages["md"] = Prism.languages.extend("md", grammar);

  if (process.env.NODE_ENV === "development") {
    Prism.highlightAll();
  }
}

declare global {
  interface Window {
    CodeMirror: CodeMirror;
  }

  type CodeMirror = typeof import("codemirror");

  namespace CodeMirror {
    interface ModeFactory<T> {
      dependencies: string[];
      isPatch: boolean;
    }
  }
}

declare module "obsidian" {
  type Prism = typeof import("prismjs");

  export function loadPrism(): Promise<Prism>;
}
