import { performance } from 'perf_hooks';

import { memoizeRecursive } from '..';
import { memoize, memoizeAsync } from './memoize';

function measureTimeMs(callback: () => unknown) {
    const time = performance.now();
    callback();
    return performance.now() - time;
}

async function measureTimeMsAsync(callback: () => Promise<unknown>) {
    const time = performance.now();
    await callback();
    return performance.now() - time;
}

describe('memoize', () => {
    it('memoize add', () => {
        jest.useFakeTimers();
        const add = (a: number, b: number) => {
            jest.advanceTimersByTime(500);
            return a + b;
        };
        const memoizedAdd = memoize(add);
        expect(memoizedAdd(1, 2)).toBe(memoizedAdd(1, 2));
    });

    it('memoize add faster than add', () => {
        jest.useFakeTimers();
        const add = (a: number, b: number) => {
            jest.advanceTimersByTime(500);
            return a + b;
        };
        const memoizedAdd = memoize(add);
        const addTime = measureTimeMs(() => memoizedAdd(1, 2));
        const memoizedAddTime = measureTimeMs(() => memoizedAdd(1, 2));
        expect(addTime).toBeGreaterThan(memoizedAddTime);
    });

    it('async memoize add faster than async add', async () => {
        jest.useFakeTimers();
        const add = async (a: number, b: number) => {
            jest.advanceTimersByTime(500);
            return Promise.resolve(a + b);
        };
        const memoizedAdd = memoizeAsync(add);
        const addTime = await measureTimeMsAsync(() => memoizedAdd(1, 2));
        const memoizedAddTime = await measureTimeMsAsync(() => memoizedAdd(1, 2));
        expect(addTime).toBeGreaterThan(memoizedAddTime);
    });

    it('memoize recursive fibbonaci', () => {
        jest.useFakeTimers();
        function fibonacci(num: number): number {
            jest.advanceTimersByTime(500);

            if (num < 2) {
                return num;
            } else {
                return fibonacci(num - 1) + fibonacci(num - 2);
            }
        }
        const memoizedRecursiveFibbonaci = memoizeRecursive(fibonacci, {}, { jest });
        const unMemoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibbonaci(35));
        const memoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibbonaci(34));

        const memoizedFibbonaci = memoize(fibonacci);
        const unMemoizedTime = measureTimeMs(() => memoizedFibbonaci(35));
        const memoizedTime = measureTimeMs(() => memoizedFibbonaci(34));

        console.log(unMemoizedRecursiveTime, memoizedRecursiveTime, unMemoizedTime, memoizedTime);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });
});
