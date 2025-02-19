import builtins from "builtin-modules";
import esbuild from "esbuild";
import { readFileSync } from "node:fs";

const environment = process.env.NODE_ENV || "production";

const banner = `//@ts-nocheck`;

const templates = {} satisfies Record<string, string>;

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: ["source/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins,
  ],
  format: "cjs",
  target: "esnext",
  logLevel: "info",
  sourcemap: false,
  treeShaking: true,
  outfile: "dist/main.js",
  minify: environment !== "development",
  minifySyntax: environment !== "development",
  minifyWhitespace: environment !== "development",
  keepNames: true,
  charset: "utf8",
  define: {
    "process.env.NODE_ENV": `"${environment}"`,
  },
  plugins: [
    {
      name: "insert-html",
      setup(build) {
        build.onLoad({ filter: /\.ts/ }, async (args) => {
          let contents = readFileSync(args.path, "utf-8");

          for (const placeholder in templates) {
            if (contents.includes(placeholder)) {
              const template = templates[placeholder as keyof typeof templates];
              const replacement = ["`", template, "`"].join("\n");

              contents = contents.replaceAll(`"${placeholder}"`, replacement);
            }
            // const replacement = ["`", template.html, "`"].join("\n");
            // contents = contents.replace(`"${template.placeholder}"`, replacement);
          }

          return { contents, loader: "ts" };
        });
      },
    },
    {
      name: "generate-assets",
      setup(build) {
        build.onEnd(async (result) => {
          if (result.errors.length) return;

          await import("./scripts/generate/assets.ts");
        });
      },
    },
    {
      name: "update-example",
      setup(build) {
        build.onEnd(async (result) => {
          if (result.errors.length) return;

          await import("./scripts/generate/example.ts");
        });
      },
    },
  ],
});

console.info("Building files...");

await context.rebuild();

if (environment !== "development") {
  process.exit(0);
}
