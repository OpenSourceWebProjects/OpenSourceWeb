import { performance } from 'perf_hooks';

export function generateStringArr(size = 10000) {
  const alphabet = [
    'a',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    ' ',
  ];
  return Array(size)
    .fill(0)
    .map(
      (_, i) =>
        alphabet[(i * Math.random() * 12345678901412341) % alphabet.length]
    );
}

export function generateNumberArr(size = 10000) {
  return Array(size)
    .fill(0)
    .map(() => Math.floor(Math.random() * 12345678901412341));
}

export function generateBooleanArr(size = 10000) {
  return Array(size)
    .fill(0)
    .map(() => Math.floor(Math.random() * 12345678901412341) % 2 === 0);
}

export function generateNullUndefinedArr(size = 10000) {
  return Array(size)
    .fill(0)
    .map(() =>
      Math.floor(Math.random() * 12345678901412341) % 2 === 0 ? null : undefined
    );
}

export function generateMixedPrimitiveArray(size = 10000) {
  return [
    ...generateStringArr(size / 4),
    ...generateNumberArr(size / 4),
    ...generateBooleanArr(size / 4),
    ...generateNullUndefinedArr(size / 4),
  ];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function measureTime(callback: () => void) {
  const time = performance.now();
  callback();
  return performance.now() - time;
}
