import type { ParseSelector } from "npm:typed-query-selector@2.11.0/parser";

type InputElementTuple = readonly [name: string, selector: string];
type inputElements = readonly InputElementTuple[];
type Elements<T extends inputElements> = {
  [elem in T[number] as elem[0]]: ParseSelector<elem[1]>;
};

function getElement(name: string, selector: string) {
  const elem = document.querySelector(selector);
  if (!elem) {
    throw new ReferenceError(`\`${name}\` not found`);
  }
  return elem;
}

export function getDomElements<T extends inputElements>(
  elements: T,
): Elements<T> {
  const domElements: Record<string, Element> = {};
  for (const [name, selector] of elements) {
    domElements[name] = getElement(name, selector);
  }
  return domElements as Elements<T>;
}

export default getDomElements;
