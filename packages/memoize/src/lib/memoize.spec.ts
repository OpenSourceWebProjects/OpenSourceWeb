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

    it('memoize recursive fibonacci - default callback', () => {
        jest.useFakeTimers();

        const recursiveStore = new Map();
        const store = new Map();
        function fibonacci(num: number, callback = fibonacci): number {
            jest.advanceTimersByTime(500);

            if (num < 2) {
                return num;
            } else {
                return callback(num - 1) + callback(num - 2);
            }
        }

        const memoizedRecursiveFibonacci = memoizeRecursive(fibonacci, { store: recursiveStore });
        const unMemoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(10));
        const memoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(11));

        const memoizedFibonacci = memoize(fibonacci, { store });
        const unMemoizedTime = measureTimeMs(() => memoizedFibonacci(10));
        const memoizedTime = measureTimeMs(() => memoizedFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });

    it('memoize recursive fibonacci - optional callback', () => {
        jest.useFakeTimers();

        const recursiveStore = new Map();
        const store = new Map();
        function fibonacci(num: number, callback?: typeof fibonacci): number {
            jest.advanceTimersByTime(500);

            if (num < 2) {
                return num;
            } else {
                return (callback ?? fibonacci)(num - 1) + (callback ?? fibonacci)(num - 2);
            }
        }

        const memoizedRecursiveFibonacci = memoizeRecursive(fibonacci, { store: recursiveStore });
        const unMemoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(10));
        const memoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(11));

        const memoizedFibonacci = memoize(fibonacci, { store });
        const unMemoizedTime = measureTimeMs(() => memoizedFibonacci(10));
        const memoizedTime = measureTimeMs(() => memoizedFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });
});
