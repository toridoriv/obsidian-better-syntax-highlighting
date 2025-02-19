export function patchCodeMirror() {
  const token = "if (stream != state.thisLine.stream)";
  const { CodeMirror } = window;
  const markdownMode = CodeMirror.modes.markdown.toString();
  const index = markdownMode.indexOf(token);
  const firstHalf = markdownMode
    .substring(0, index)
    .replace("function(cmCfg, modeCfg)", "");
  const secondHalf = markdownMode.substring(index);
  const fix = "state.quote = 0;";
  const corrected = [firstHalf, fix, secondHalf].join("");

  if (markdownMode.includes(fix + token)) return;

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

  CodeMirror.defineMode("markdown", markdownModeFactory);
}

declare global {
  interface Window {
    CodeMirror: CodeMirror;
  }

  type CodeMirror = typeof import("codemirror");
}
