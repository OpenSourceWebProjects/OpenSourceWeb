import { memoizeAsyncRecursive, memoizeRecursive } from '..';
import { memoize, memoizeAsync } from './memoize.api';
import { measureTimeMs, measureTimeMsAsync } from './shared';

describe('Memoized functions should reference this in object literal', () => {
    const obj: {
        count: number[];
        fib: (n: number, cb?: typeof obj.fib) => number;
        anonymousFib: (n: number, cb?: typeof obj.anonymousFib) => number;
        asyncFib: (n: number, cb?: typeof obj.asyncFib) => Promise<number>;
        anonymousAsyncFib: (n: number, cb?: typeof obj.anonymousAsyncFib) => Promise<number>;
    } = {
        count: [0, 0, 0, 0],
        fib: function fib(n: number, cb = fib): number {
            jest.advanceTimersByTime(50000);

            obj.count[0]++;
            return n < 2 ? n : cb(n - 1) + cb(n - 2);
        },
        anonymousFib: function (n: number, cb = obj.anonymousFib): number {
            jest.advanceTimersByTime(50000);

            obj.count[1]++;
            return n < 2 ? n : cb(n - 1) + cb(n - 2);
        },
        asyncFib: async function asyncFib(n: number, cb = asyncFib): Promise<number> {
            jest.advanceTimersByTime(50000);

            obj.count[2]++;
            return n < 2 ? n : (await cb(n - 1)) + (await cb(n - 2));
        },

        anonymousAsyncFib: async function (n: number, cb = obj.anonymousAsyncFib): Promise<number> {
            jest.advanceTimersByTime(50000);

            obj.count[2]++;
            return n < 2 ? n : (await cb(n - 1)) + (await cb(n - 2));
        },
    };

    it('Named functions', () => {
        jest.useFakeTimers();
        const memoized = memoize(obj.fib);
        const memoizedRecursive = memoizeRecursive(obj.fib);

        let time = measureTimeMs(() => memoized(30));
        expect(obj.count[0]).toBeGreaterThan(0);

        let lastCount = obj.count[0];
        let memoizedTime = measureTimeMs(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count[0]).toBe(lastCount);

        time = measureTimeMs(() => memoizedRecursive(30));
        expect(obj.count[0]).toBeGreaterThan(lastCount);
        lastCount = obj.count[0];
        memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count[0]).toBe(lastCount);
    });

    it('Anonymous functions', () => {
        jest.useFakeTimers();
        const memoized = memoize(obj.anonymousFib);
        const memoizedRecursive = memoizeRecursive(obj.anonymousFib);

        let time = measureTimeMs(() => memoized(30));
        expect(obj.count[1]).toBeGreaterThan(0);

        let lastCount = obj.count[1];
        let memoizedTime = measureTimeMs(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count[1]).toBe(lastCount);

        time = measureTimeMs(() => memoizedRecursive(30));
        expect(obj.count[1]).toBeGreaterThan(lastCount);
        lastCount = obj.count[1];
        memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count[1]).toBe(lastCount);
    });

    it('Async functions', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(obj.asyncFib);
        const memoizedRecursive = memoizeAsyncRecursive(obj.asyncFib);

        let time = await measureTimeMsAsync(() => memoized(30));
        expect(obj.count[2]).toBeGreaterThan(0);

        let lastCount = obj.count[2];
        let memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count[2]).toBe(lastCount);

        time = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(obj.count[2]).toBeGreaterThan(lastCount);
        lastCount = obj.count[2];
        memoizedTime = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count[2]).toBe(lastCount);
    });

    it('Anonymous async functions', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(obj.anonymousAsyncFib);
        const memoizedRecursive = memoizeAsyncRecursive(obj.anonymousAsyncFib);

        let time = await measureTimeMsAsync(() => memoized(30));
        expect(obj.count[3]).toBeGreaterThan(0);

        let lastCount = obj.count[3];
        let memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count[3]).toBe(lastCount);

        time = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(obj.count[3]).toBeGreaterThan(lastCount);
        lastCount = obj.count[3];
        memoizedTime = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count[3]).toBe(lastCount);
    });
});
