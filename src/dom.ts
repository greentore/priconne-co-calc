import getDomElements from "./utils/getDomElements.ts";

const elements = [
  ["form", "form#co-calculator__form"],
  ["nameElem", "input#co-calculator__name"],
  ["bossHpElem", "input#co-calculator__hp"],
  ["leadingHitsElem", "input#co-calculator__leading-hits"],
  ["lastHitElem", "input#co-calculator__last-hit"],
  ["resultElem", "div#co-calculator__result"],
] as const;

export let dom: ReturnType<typeof getDomElements<typeof elements>>;

export function initDom() {
  dom = getDomElements(elements);
}
