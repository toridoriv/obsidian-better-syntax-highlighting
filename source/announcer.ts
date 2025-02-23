import { Notice } from "obsidian";
import type { BetterSyntaxHighlighting } from "./plugin.ts";
import { getMessageFragment } from "./html.ts";

export class Announcer {
  static #instance: Announcer | null = null;
  static plugin: BetterSyntaxHighlighting;

  static initialize(plugin: BetterSyntaxHighlighting) {
    if (this.#instance) return;

    this.plugin = plugin;
    this.#instance = new Announcer(this.plugin);
  }

  static get instance() {
    if (!this.#instance) {
      throw new Error("Announcer not initialized");
    }

    return this.#instance;
  }

  private constructor(readonly plugin: BetterSyntaxHighlighting) {}

  /**
   * Creates a notice with the plugin's name.
   *
   * @param message  - The message to display.
   * @param duration - The duration of the notice in milliseconds. Use `0` for a
   *                 permanent notice.
   * @returns The notice element.
   */
  createNotice(message: string | DocumentFragment, duration = 10_000) {
    const messageEl = typeof message === "string" ? getMessageFragment(message) : message;
    const signature = document.createElement("footer");

    signature.textContent = this.plugin.manifest.name + " Plugin";
    signature.style.fontSize = "xx-small";
    signature.style.opacity = "0.5";
    signature.style.borderTop = "1px solid var(--text-muted)";
    signature.style.marginTop = "1em";
    signature.style.paddingTop = "0.5em";
    signature.style.textAlign = "right";

    messageEl.appendChild(signature);

    return new Notice(messageEl, duration);
  }

  /**
   * Shows a success notice.
   *
   * @param message  - The message to display.
   * @param duration - The duration of the notice in milliseconds. Use `0` for a
   *                 permanent notice.
   * @returns The notice element.
   */
  success(message: string, duration = 15000) {
    return this.createNotice(`✨ ${message}`, duration);
  }

  /**
   * Shows an informational notice.
   *
   * @param message  - The message to display.
   * @param duration - The duration of the notice in milliseconds. Use `0` for a
   *                 permanent notice.
   * @returns The notice element.
   */
  info(message: string, duration = 15000) {
    return this.createNotice(`💬 ${message}`, duration);
  }

  /**
   * Shows a failure notice.
   *
   * @param message  - The message to display.
   * @param duration - The duration of the notice in milliseconds. Use `0` for a
   *                 permanent notice.
   * @returns The notice element.
   */
  failure(message: string, duration = 15000) {
    return this.createNotice(`❌ ${message}`, duration);
  }

  /**
   * Shows a warning notice.
   *
   * @param message  - The message to display.
   * @param duration - The duration of the notice in milliseconds. Use `0` for a
   *                 permanent notice.
   * @returns The notice element.
   */
  warn(message: string, duration = 10_000) {
    const fragment = document.createDocumentFragment();
    const emoji = document.createElement("span");

    emoji.innerHTML = "⚠️";
    emoji.classList.add("emoji");

    fragment.append(emoji, " ", getMessageFragment(message));

    return this.createNotice(fragment, duration);
  }

  /**
   * Shows a notice for a task that cannot run.
   *
   * @param task   - The name of the task.
   * @param reason - The reason why the task cannot run.
   * @returns The notice element.
   */
  cannotRun(task: string, reason: string) {
    return this.warn(`The task <strong><u>${task}</u></strong> cannot be run ${reason}.`);
  }

  /**
   * Shows an error notice.
   *
   * @param message  - The message to display.
   * @param error    - The error object.
   * @param duration - The duration of the notice in milliseconds. Use `0` for a
   *                 permanent notice.
   * @returns The notice element.
   */
  error(message: string, error: Error, duration = 20_000) {
    return this.failure(
      `<p>${message}</p><code>${JSON.stringify({ name: error.name, message: error.message, cause: error.cause }, null, 2)}</code>`,
      duration,
    );
  }
}
