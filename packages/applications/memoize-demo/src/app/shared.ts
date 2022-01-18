import { performance } from 'perf_hooks';

export function aggregateConsoleLog(arr: { title: string; data: string }[]) {
    arr.forEach((element) => {
        console.group('\x1b[31m', element.title);
        console.log('\x1b[36m%s\x1b[0m', element.data);
        console.groupEnd();
    });
}

export function measureTimeMs(callback: () => unknown) {
    const time = performance.now();
    callback();
    return performance.now() - time;
}

export function benchmark(cb: (x: number) => number, n: number, m: number, title: string) {
    const time = measureTimeMs(() => cb(n)).toFixed(3);
    const memoizedTime = measureTimeMs(() => cb(n)).toFixed(3);
    const secondTime = measureTimeMs(() => cb(m)).toFixed(3);
    return {
        title,
        data: `\nFirst Run(${n}) -> ${time}ms \nSecond Run(${n}) -> ${memoizedTime}ms \nDifferent Arg Run(${m}) -> ${secondTime}ms\n`,
    };
}

export async function measureTimeMsAsync(callback: () => Promise<unknown>) {
    const time = performance.now();
    await callback();
    return performance.now() - time;
}

export async function benchmarkAsync(cb: (x: number) => Promise<number>, n: number, m: number, title: string) {
    const time = (await measureTimeMsAsync(() => cb(n))).toFixed(3);
    const memoizedTime = (await measureTimeMsAsync(() => cb(n))).toFixed(3);
    const secondTime = (await measureTimeMsAsync(() => cb(m))).toFixed(3);
    return {
        title,
        data: `\nFirst Run(${n}) -> ${time}ms \nSecond Run(${n}) -> ${memoizedTime}ms \nDifferent Arg Run(${m}) -> ${secondTime}ms\n`,
    };
}
