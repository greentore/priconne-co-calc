function formatMillions(input) {
  const number = (input / 1e6).toPrecision(3);
  return `${number}m`;
}
function parseMillions(input) {
  if (!input)
    return 0;
  const number = input.slice(-1) === "m" ? parseFloat(input) * 1e6 : parseInt(input);
  return isNaN(number) ? 0 : number;
}
function getRemaining(mochikoshi) {
  const minutes = Math.floor(mochikoshi / 60).toString().padStart(2, "0");
  const seconds = Math.floor(mochikoshi % 60).toString().padStart(2, "0");
  let milliseconds = mochikoshi % 1;
  if (milliseconds) {
    milliseconds = milliseconds.toPrecision(3).slice(1);
  } else {
    milliseconds = "";
  }
  return `${minutes}:${seconds}${milliseconds}`;
}
function getUntil(mochikoshi) {
  let until = 90 - Math.ceil(mochikoshi) + 1;
  if (until <= 0)
    until = 1;
  if (until > 90)
    until = 90;
  const minutes = Math.floor(until / 60).toString().padStart(2, "0");
  const seconds = Math.floor(until % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
function calculateMochikoshi(hp, leadingHits, lastHit) {
  let mochikoshi = 90 - 90 * (hp - leadingHits) / lastHit;
  mochikoshi = mochikoshi > 0 ? mochikoshi + 20 : 0;
  const remaining = getRemaining(mochikoshi);
  const until = getUntil(mochikoshi);
  return { remaining, until };
}

function getElement(name, selector) {
  const elem = document.querySelector(selector);
  if (!elem) {
    throw new ReferenceError(`\`${name}\` not found`);
  }
  return elem;
}
function getDomElements(elements) {
  const domElements = {};
  for (const [name, selector] of elements) {
    domElements[name] = getElement(name, selector);
  }
  return domElements;
}

const elements = [
  ["form", "form#co-calculator__form"],
  ["nameElem", "input#co-calculator__name"],
  ["bossHpElem", "input#co-calculator__hp"],
  ["leadingHitsElem", "input#co-calculator__leading-hits"],
  ["lastHitElem", "input#co-calculator__last-hit"],
  ["resultElem", "div#co-calculator__result"]
];
let dom;
function initDom() {
  dom = getDomElements(elements);
}

const defaultTitle = "Carryover Calculator";
let title = "";
function changeTitle() {
  title = dom.nameElem.value;
  document.title = title ? `${title} - ${defaultTitle}` : defaultTitle;
}
function setQuery() {
  const params = new URLSearchParams();
  const hp = dom.bossHpElem.value, leadingHits = dom.leadingHitsElem.value, lastHit = dom.lastHitElem.value;
  if (title)
    params.append("name", title);
  if (hp)
    params.append("hp", hp);
  if (leadingHits)
    params.append("leading_hits", leadingHits);
  if (lastHit)
    params.append("last_hit", lastHit);
  const paramString = params.toString();
  if (paramString && "?" + paramString !== location.search) {
    console.debug("history push");
    history.pushState(null, "", `${location.pathname}?${paramString}`);
  } else if (!paramString && location.search) {
    console.debug("resetting history");
    history.pushState(null, "", "/");
  }
}
function calculate(e) {
  if (e)
    e.preventDefault();
  const hp = parseMillions(dom.bossHpElem.value);
  const leadingHits = dom.leadingHitsElem.value.split(" ").map(parseMillions).reduce((prev, curr) => prev + curr);
  const lastHit = parseMillions(dom.lastHitElem.value);
  const { remaining, until } = calculateMochikoshi(hp, leadingHits, lastHit);
  const leftover = hp - leadingHits;
  const overkillRatio = leftover ? (lastHit / leftover).toFixed(2) : "0.00";
  const output = `estimated carryover is ${remaining}
battle until ${until}
${formatMillions(leftover)} overkilled ${overkillRatio} times`;
  dom.resultElem.innerText = output;
  setQuery();
}
function resetCalc() {
  title = "";
  dom.form.reset();
  dom.resultElem.innerText = "";
}
function restoreState() {
  resetCalc();
  const params = new URLSearchParams(location.search);
  if (!params.size)
    return;
  console.debug("restoring state");
  let i = 0;
  if (params.has("name")) {
    dom.nameElem.value = params.get("name");
    changeTitle();
  }
  if (params.has("hp")) {
    dom.bossHpElem.value = params.get("hp");
    i++;
  }
  if (params.has("leading_hits")) {
    dom.leadingHitsElem.value = params.get("leading_hits");
    i++;
  }
  if (params.has("last_hit")) {
    dom.lastHitElem.value = params.get("last_hit");
    i++;
  }
  if (i) {
    calculate();
  }
}
function init() {
  console.debug("init");
  initDom();
  dom.form.addEventListener("submit", calculate);
  dom.nameElem.addEventListener("input", changeTitle);
}
addEventListener("DOMContentLoaded", init);
addEventListener("load", restoreState);
addEventListener("popstate", restoreState);

const index = '';
