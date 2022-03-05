import { memoizeAsync, memoizeAsyncRecursive, memoizeLast, memoizeSync, memoizeSyncRecursive } from './memoize.api';
import { measureTimeMs, measureTimeMsAsync } from './shared';

describe('Memoize - all default APIs should work as expected', () => {
    it('Memoize last should hold only the last value', () => {
        jest.useFakeTimers();

        const store = new Map();

        const add = (a: number, b: number) => {
            jest.advanceTimersByTime(500);
            return a + b;
        };
        const memoizedAdd = memoizeLast(add, { store });
        memoizedAdd(1, 2);
        memoizedAdd(2, 3);
        expect(Array.from(store.keys()).length).toBe(1);
        expect(Array.from(store.keys())[0]).toBe('[2,3]');
    });

    it('Async memoization', async () => {
        jest.useFakeTimers();
        let counter = 0;

        const store = new Map();
        async function asyncAdd(a: number, b: number) {
            jest.advanceTimersByTime(500);
            counter++;
            return Promise.resolve(a + b);
        }

        const memoized = memoizeAsync(asyncAdd, { store });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unMemoizedTime = await measureTimeMsAsync(() => memoized(10, 11));
        const memoizedTime = await measureTimeMsAsync(() => memoized(10, 11));

        expect(store.size).toBe(1);
        expect(counter).toBe(1); // Only one call to the async function
        expect(unMemoizedTime).toBeGreaterThan(memoizedTime);
    });

    it('Recursive memoization of an anonymous function', () => {
        jest.useFakeTimers();
        const store = new Map();

        const fib = memoizeSync(
            (x: number): number => {
                jest.advanceTimersByTime(500);

                return x < 2 ? 1 : fib(x - 1) + fib(x - 2);
            },
            { store }
        );
        const unMemoizedTime = measureTimeMs(() => fib(10));
        const memoizedTime = measureTimeMs(() => fib(11));

        expect(store.size).toBe(12);
        expect(unMemoizedTime).toBeGreaterThan(memoizedTime);
    });

    it('Recursive memoization with default callback', () => {
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

        const memoizedRecursiveFibonacci = memoizeSyncRecursive(fibonacci, { store: recursiveStore });
        const unMemoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(10));
        const memoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(11));

        const memoizedFibonacci = memoizeSync(fibonacci, { store });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unMemoizedTime = measureTimeMs(() => memoizedFibonacci(10));
        const memoizedTime = measureTimeMs(() => memoizedFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });

    it('Recursive memoization with optional callback', () => {
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

        const memoizedRecursiveFibonacci = memoizeSyncRecursive(fibonacci, { store: recursiveStore });
        const unMemoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(10));
        const memoizedRecursiveTime = measureTimeMs(() => memoizedRecursiveFibonacci(11));

        const memoizedFibonacci = memoizeSync(fibonacci, { store });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unMemoizedTime = measureTimeMs(() => memoizedFibonacci(10));
        const memoizedTime = measureTimeMs(() => memoizedFibonacci(11));

        expect(store.size).toBe(2);
        expect(recursiveStore.size).toBe(12);
        expect(unMemoizedRecursiveTime).toBeGreaterThan(memoizedRecursiveTime);
        expect(memoizedTime).toBeGreaterThan(memoizedRecursiveTime);
    });

    it('Async recursive memoization of an anonymous function', async () => {
        jest.useFakeTimers();
        const store = new Map();

        const fib = memoizeAsync(
            async (x: number): Promise<number> => {
                jest.advanceTimersByTime(500);

                return x < 2 ? 1 : (await fib(x - 1)) + (await fib(x - 2));
            },
            { store }
        );
        const unMemoizedTime = await measureTimeMsAsync(() => fib(10));
        const memoizedTime = await measureTimeMsAsync(() => fib(11));

        expect(store.size).toBe(12);
        expect(unMemoizedTime).toBeGreaterThan(memoizedTime);
    });

    it('Async recursive memoization with default callback', async () => {
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
    it('Async recursive memoization with optional callback', async () => {
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
