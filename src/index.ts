import {
  calculateMochikoshi,
  formatMillions,
  parseMillions,
} from "./lib/mochikoshi.ts";
import { dom, initDom } from "./dom.ts";

const defaultTitle = "Carryover Calculator";
let title = "";

function changeTitle() {
  title = dom.nameElem.value;
  document.title = title ? `${title} - ${defaultTitle}` : defaultTitle;
}

function setQuery() {
  const params = new URLSearchParams();
  const hp = dom.bossHpElem.value,
    leadingHits = dom.leadingHitsElem.value,
    lastHit = dom.lastHitElem.value;

  if (title) params.append("name", title);
  if (hp) params.append("hp", hp);
  if (leadingHits) params.append("leading_hits", leadingHits);
  if (lastHit) params.append("last_hit", lastHit);

  const paramString = params.toString();
  if (paramString && "?" + paramString !== location.search) {
    console.debug("history push");
    history.pushState(null, "", `${location.pathname}?${paramString}`);
  } else if (!paramString && location.search) {
    console.debug("resetting history");
    history.pushState(null, "", "/");
  }
}

function calculate(e?: Event) {
  if (e) e.preventDefault();
  const hp = parseMillions(dom.bossHpElem.value);
  const leadingHits = dom.leadingHitsElem.value
    .split(" ")
    .map(parseMillions)
    .reduce((prev, curr) => prev + curr);
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
  if (!params.size) return;
  console.debug("restoring state");

  let i = 0;
  if (params.has("name")) {
    dom.nameElem.value = params.get("name")!;
    changeTitle();
  }
  if (params.has("hp")) {
    dom.bossHpElem.value = params.get("hp")!;
    i++;
  }
  if (params.has("leading_hits")) {
    dom.leadingHitsElem.value = params.get("leading_hits")!;
    i++;
  }
  if (params.has("last_hit")) {
    dom.lastHitElem.value = params.get("last_hit")!;
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
