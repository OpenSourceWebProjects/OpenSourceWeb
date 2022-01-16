import { performance } from 'perf_hooks';

export function splitAtFirstInstance(str: string, delimiter: string) {
    const idx = str.indexOf(delimiter);
    return [str.slice(0, idx), str.slice(idx + 1)];
}

export function measureTimeMs(callback: () => unknown) {
    const time = performance.now();
    callback();
    return performance.now() - time;
}

export async function measureTimeMsAsync(callback: () => Promise<unknown>) {
    const time = performance.now();
    await callback();
    return performance.now() - time;
}
