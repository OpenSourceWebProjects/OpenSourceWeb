import { performance as nodePerformance } from 'perf_hooks';

export function splitAtFirstInstance(str: string, delimiter: string) {
    const idx = str.indexOf(delimiter);
    return [str.slice(0, idx), str.slice(idx + 1)];
}

export function measureTimeMs(
    callback: () => unknown,
    performance = (globalThis as any).performance ?? nodePerformance
) {
    const time = performance.now();
    callback();
    return performance.now() - time;
}

export async function measureTimeMsAsync(
    callback: () => Promise<unknown>,
    performance = (globalThis as any).performance ?? nodePerformance
) {
    const time = performance.now();
    await callback();
    return performance.now() - time;
}

function isGeneratorFunction(fn: Function) {
    const generatorFunction = function* () {
        yield undefined;
    }.constructor;
    return fn instanceof generatorFunction;
}

function isAsyncFunction(fn: Function) {
    const asyncFunction = async function () {
        return Promise.resolve();
    }.constructor;
    return fn instanceof asyncFunction;
}
