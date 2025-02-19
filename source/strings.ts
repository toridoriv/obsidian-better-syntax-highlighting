import { first } from "./collections.ts";

/**
 * Finds all matches of a given pattern in the input string and returns an array of the
 * matched substrings.
 *
 * @param pattern - The pattern to match against, either as a string or a regular
 *                expression.
 * @param value   - The input string to search for matches.
 * @returns An array of all the substrings that match the given pattern.
 */
export function matchAll(pattern: string | RegExp, value: string): string[] {
  const regex =
    typeof pattern === "string"
      ? new RegExp(pattern, "g")
      : new RegExp(pattern.source, pattern.flags || "g");
  const matches = [...value.matchAll(regex)].map(first);

  return matches;
}
