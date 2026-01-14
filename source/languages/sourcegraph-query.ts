import { Language } from "./utils.ts";

export const sourcegraphQuery = new Language("Sourcegraph Query")
  .addAliases("sgq", "sourcegraph")
  .addToken({
    name: "property",
    pattern: /(repo|file):/gm,
  })
  .addToken({
    name: "operator",
    pattern: /AND|OR|-/gm,
  });
