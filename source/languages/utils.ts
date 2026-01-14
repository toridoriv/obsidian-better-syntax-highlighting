import type { Prism } from "obsidian";
import type { Grammar, GrammarValue, TokenObject } from "prismjs";

export function codemirrorKeyword(type: string) {
  return { type: type, style: "keyword" };
}

export type LanguageTokenProperties = {
  name: string;
  pattern: RegExp;
  aliases?: string[];
};

export class LanguageToken {
  public readonly aliases: string[] = [];

  public static from(properties: LanguageTokenProperties): LanguageToken {
    return Object.create(
      LanguageToken.prototype,
      Object.getOwnPropertyDescriptors(properties),
    );
  }

  public constructor(
    public name: string,
    public pattern: RegExp,
  ) {}

  public setAliases(...values: string[]) {
    this.aliases.push(...values);
    return this;
  }

  public toLanguageDefinition(): TokenObject {
    return {
      alias: this.aliases,
      pattern: this.pattern,
    };
  }

  public toModeRule(): CodeMirror.SimpleMode.Rule {
    return {
      regex: this.pattern,
      token: this.name,
    };
  }
}

export type AnyLanguageConstructor = typeof Language;

export class Language {
  public readonly tokens: LanguageToken[] = [];
  public readonly aliases: string[] = [];

  public constructor(public name: string) {}

  public get modeName() {
    return this.name.toLowerCase().replaceAll(" ", "-");
  }

  public addToken(token: LanguageToken | LanguageTokenProperties) {
    if (!(token instanceof LanguageToken)) {
      token = LanguageToken.from(token);
    }

    this.tokens.push(token as LanguageToken);

    return this;
  }

  public addAliases(...values: string[]) {
    this.aliases.push(...values);
    return this;
  }

  public registerOn(library: CodeMirror | Prism) {
    if (isCodemirror(library)) {
      return this.registerOnCodemirror(library);
    }

    return this.registerOnPrism(library);
  }

  protected isThisModeInfo = (info: CodeMirror.ModeInfo) => {
    return info.mode === this.modeName || info.name.toLowerCase() === this.modeName;
  };

  protected registerOnCodemirror(cm: CodeMirror) {
    cm.defineSimpleMode(this.modeName, this.toCodeMirrorSimpleMode());

    const modeInfo = this.toCodemirrorModeInfo(cm.modeInfo.find(this.isThisModeInfo));
    cm.defineMIME(modeInfo.mime, this.modeName);
    cm.modeInfo.push(modeInfo);
  }

  protected registerOnPrism(prism: Prism) {
    prism.languages[this.modeName] = this.toPrismDefinition();
  }

  public toPrismDefinition(): Grammar {
    const definition: Record<string, GrammarValue> = {};

    for (const token of this.tokens) {
      definition[token.name] = token.toLanguageDefinition();
    }

    return definition;
  }

  public toCodeMirrorSimpleMode(): CodeMirror.SimpleMode {
    const rules: CodeMirror.SimpleMode.Rule[] = [];

    for (const token of this.tokens) {
      rules.push(token.toModeRule());
    }

    return {
      start: rules,
    };
  }

  public toCodemirrorModeInfo(current?: CodeMirror.ModeInfo): CodeMirror.ModeInfo {
    if (current) return current;

    return {
      name: this.name,
      mode: this.modeName,
      mime: `text/x-${this.modeName}`,
      ext: this.aliases,
      alias: [...this.aliases, this.modeName],
    };
  }
}

function isCodemirror(value: unknown): value is CodeMirror {
  return typeof value === "function" && value.name === "CodeMirror";
}
