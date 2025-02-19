import { matchAll } from "./strings.ts";

/**
 * Converts a string to an HTML fragment.
 *
 * @param message - The string to convert.
 * @returns The HTML fragment.
 */
export function getMessageFragment(message: string) {
  const words = message.split(/<\S*>/);
  const tags = matchAll(/<\S*>.*<\/\S*>/, message);
  const fragment = document.createDocumentFragment();

  for (const word of words) {
    const tag = tags.find((x) => x.includes(word));
    const el = tag ? stringToHtml(tag) : stringToHtml(`<span>${word}</span>`);

    fragment.appendChild(el);
  }

  return fragment;
}

/**
 * Converts a string to an HTML element.
 *
 * @param value - The string to convert.
 * @returns The HTML element.
 */
export function stringToHtml(value: string) {
  const parser = new DOMParser();
  const el = parser.parseFromString(value.trim(), "text/html");
  const body = el.getElementsByTagName("body");

  return body[0].firstChild || document.createElement("span");
}
