import { memoizeAsyncRecursive, memoizeRecursive } from '..';
import { memoize, memoizeAsync } from './memoize.api';
import { measureTimeMs, measureTimeMsAsync } from './shared';

describe('memoize', () => {
    it('memoize should be correct', () => {
        jest.useFakeTimers();
        const add = (a: number, b: number) => {
            jest.advanceTimersByTime(50000);
            return a + b;
        };
        const memoizedAdd = memoize(add);
        expect(memoizedAdd(1, 2)).toBe(memoizedAdd(1, 2));
    });

    it('memoize should be faster', () => {
        jest.useFakeTimers();
        const add = (a: number, b: number) => {
            jest.advanceTimersByTime(50000);
            return a + b;
        };
        const memoizedAdd = memoize(add);
        const addTime = measureTimeMs(() => memoizedAdd(1, 2));
        const memoizedAddTime = measureTimeMs(() => memoizedAdd(1, 2));
        expect(addTime).toBeGreaterThan(memoizedAddTime);
    });

    it('async memoization should be faster', async () => {
        jest.useFakeTimers();
        const add = async (a: number, b: number) => {
            jest.advanceTimersByTime(50000);
            return Promise.resolve(a + b);
        };
        const memoizedAdd = memoizeAsync(add);
        const addTime = await measureTimeMsAsync(() => memoizedAdd(1, 2));
        const memoizedAddTime = await measureTimeMsAsync(() => memoizedAdd(1, 2));
        expect(addTime).toBeGreaterThan(memoizedAddTime);
    });

    it('recursive memoization with default callback', () => {
        jest.useFakeTimers();

        const recursiveStore = new Map();
        const store = new Map();
        function fibonacci(num: number, callback = fibonacci): number {
            jest.advanceTimersByTime(50000);

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unMemoizedTime = measureTimeMs(() => memoizedFibonacci(10));
        const memoizedTime = measureTimeMs(() => memoizedFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });

    it('recursive memoization with optional callback', () => {
        jest.useFakeTimers();

        const recursiveStore = new Map();
        const store = new Map();
        function fibonacci(num: number, callback?: typeof fibonacci): number {
            jest.advanceTimersByTime(50000);

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unMemoizedTime = measureTimeMs(() => memoizedFibonacci(10));
        const memoizedTime = measureTimeMs(() => memoizedFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });
    it('async recursive memoization with default callback', async () => {
        jest.useFakeTimers();

        const recursiveStore = new Map();
        const store = new Map();
        async function fibonacci(num: number, callback = fibonacci): Promise<number> {
            jest.advanceTimersByTime(50000);

            if (num < 2) {
                return Promise.resolve(num);
            } else {
                return (await callback(num - 1)) + (await callback(num - 2));
            }
        }

        const memoizedAsyncRecursiveFibonacci = memoizeAsyncRecursive(fibonacci, { store: recursiveStore });
        const unMemoizedAsyncRecursiveTime = await measureTimeMsAsync(() => memoizedAsyncRecursiveFibonacci(10));
        const memoizedAsyncRecursiveTime = await measureTimeMsAsync(() => memoizedAsyncRecursiveFibonacci(11));

        const memoizedAsyncFibonacci = memoizeAsync(fibonacci, { store });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unMemoizedTime = await measureTimeMsAsync(() => memoizedAsyncFibonacci(10));
        const memoizedTime = await measureTimeMsAsync(() => memoizedAsyncFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedAsyncRecursiveTime).toBeGreaterThan(memoizedAsyncRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedAsyncRecursiveTime);
    });
    it('async recursive memoization with optional callback', async () => {
        jest.useFakeTimers();

        const recursiveStore = new Map();
        const store = new Map();
        async function fibonacci(num: number, callback?: typeof fibonacci): Promise<number> {
            jest.advanceTimersByTime(50000);

            if (num < 2) {
                return Promise.resolve(num);
            } else {
                return (await (callback ?? fibonacci)(num - 1)) + (await (callback ?? fibonacci)(num - 2));
            }
        }

        const memoizedRecursiveFibonacci = memoizeAsyncRecursive(fibonacci, { store: recursiveStore });
        const unMemoizedRecursiveTime = await measureTimeMsAsync(() => memoizedRecursiveFibonacci(10));
        const memoizedRecursiveTime = await measureTimeMsAsync(() => memoizedRecursiveFibonacci(11));

        const memoizedFibonacci = memoizeAsync(fibonacci, { store });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unMemoizedTime = await measureTimeMsAsync(() => memoizedFibonacci(10));
        const memoizedTime = await measureTimeMsAsync(() => memoizedFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });
});
