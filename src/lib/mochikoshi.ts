export function formatMillions(input: number) {
  const number = (input / 1000000).toPrecision(3);
  return `${number}m`;
}

export function parseMillions(input: string | null) {
  if (!input) return 0;
  const number = input.slice(-1) === "m"
    ? parseFloat(input) * 1000000
    : parseInt(input);

  return (isNaN(number)) ? 0 : number;
}

function getRemaining(mochikoshi: number) {
  const minutes = Math.floor(mochikoshi / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(mochikoshi % 60)
    .toString()
    .padStart(2, "0");
  let milliseconds: number | string = mochikoshi % 1;
  if (milliseconds) {
    milliseconds = milliseconds.toPrecision(3).slice(1);
  } else {
    milliseconds = "";
  }
  return `${minutes}:${seconds}${milliseconds}`;
}

function getUntil(mochikoshi: number) {
  let until = 90 - Math.ceil(mochikoshi) + 1;
  if (until <= 0) until = 1;
  if (until > 90) until = 90;
  const minutes = Math.floor(until / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(until % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function calculateMochikoshi(
  hp: number,
  leadingHits: number,
  lastHit: number,
) {
  let mochikoshi = 90 - (90 * (hp - leadingHits)) / lastHit;
  mochikoshi = mochikoshi > 0 ? mochikoshi + 20 : 0;

  const remaining = getRemaining(mochikoshi);
  const until = getUntil(mochikoshi);

  return { remaining, until };
}
