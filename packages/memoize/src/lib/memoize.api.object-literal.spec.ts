import { memoizeAsyncRecursive, memoizeRecursive } from '..';
import { memoize, memoizeAsync } from './memoize.api';
import { measureTimeMs, measureTimeMsAsync } from './shared';

describe('Memoized functions should reference this in object literal', () => {
    const obj: {
        count: {
            fib: number;
            anonymousFib: number;
            asyncFib: number;
            anonymousAsyncFib: number;
        };
        fib: (n: number, cb?: typeof obj.fib) => number;
        anonymousFib: (n: number, cb?: typeof obj.anonymousFib) => number;
        asyncFib: (n: number, cb?: typeof obj.asyncFib) => Promise<number>;
        anonymousAsyncFib: (n: number, cb?: typeof obj.anonymousAsyncFib) => Promise<number>;
    } = {
        count: {
            fib: 0,
            anonymousFib: 0,
            asyncFib: 0,
            anonymousAsyncFib: 0,
        },
        fib: function fib(n: number, cb = fib): number {
            jest.advanceTimersByTime(50000);

            obj.count.fib++;
            return n < 2 ? n : cb(n - 1) + cb(n - 2);
        },
        anonymousFib: function (n: number, cb = obj.anonymousFib): number {
            jest.advanceTimersByTime(50000);

            obj.count.anonymousFib++;
            return n < 2 ? n : cb(n - 1) + cb(n - 2);
        },
        asyncFib: async function asyncFib(n: number, cb = asyncFib): Promise<number> {
            jest.advanceTimersByTime(50000);

            obj.count.asyncFib++;
            return n < 2 ? n : (await cb(n - 1)) + (await cb(n - 2));
        },

        anonymousAsyncFib: async function (n: number, cb = obj.anonymousAsyncFib): Promise<number> {
            jest.advanceTimersByTime(50000);

            obj.count.anonymousAsyncFib++;
            return n < 2 ? n : (await cb(n - 1)) + (await cb(n - 2));
        },
    };

    it('Named functions', () => {
        jest.useFakeTimers();
        const memoized = memoize(obj.fib);
        const memoizedRecursive = memoizeRecursive(obj.fib);

        let time = measureTimeMs(() => memoized(30));
        expect(obj.count.fib).toBeGreaterThan(0);

        let lastCount = obj.count.fib;
        let memoizedTime = measureTimeMs(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count.fib).toBe(lastCount);

        time = measureTimeMs(() => memoizedRecursive(30));
        expect(obj.count.fib).toBeGreaterThan(lastCount);
        lastCount = obj.count.fib;
        memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count.fib).toBe(lastCount);
    });

    it('Anonymous functions', () => {
        jest.useFakeTimers();
        const memoized = memoize(obj.anonymousFib);
        const memoizedRecursive = memoizeRecursive(obj.anonymousFib);

        let time = measureTimeMs(() => memoized(30));
        expect(obj.count.anonymousFib).toBeGreaterThan(0);

        let lastCount = obj.count.anonymousFib;
        let memoizedTime = measureTimeMs(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count.anonymousFib).toBe(lastCount);

        time = measureTimeMs(() => memoizedRecursive(30));
        expect(obj.count.anonymousFib).toBeGreaterThan(lastCount);
        lastCount = obj.count.anonymousFib;
        memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count.anonymousFib).toBe(lastCount);
    });

    it('Async functions', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(obj.asyncFib);
        const memoizedRecursive = memoizeAsyncRecursive(obj.asyncFib);

        let time = await measureTimeMsAsync(() => memoized(30));
        expect(obj.count.asyncFib).toBeGreaterThan(0);

        let lastCount = obj.count.asyncFib;
        let memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count.asyncFib).toBe(lastCount);

        time = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(obj.count.asyncFib).toBeGreaterThan(lastCount);
        lastCount = obj.count.asyncFib;
        memoizedTime = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count.asyncFib).toBe(lastCount);
    });

    it('Anonymous async functions', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(obj.anonymousAsyncFib);
        const memoizedRecursive = memoizeAsyncRecursive(obj.anonymousAsyncFib);

        let time = await measureTimeMsAsync(() => memoized(30));
        expect(obj.count.anonymousAsyncFib).toBeGreaterThan(0);

        let lastCount = obj.count.anonymousAsyncFib;
        let memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThan(memoizedTime);
        expect(obj.count.anonymousAsyncFib).toBe(lastCount);

        time = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(obj.count.anonymousAsyncFib).toBeGreaterThan(lastCount);
        lastCount = obj.count.anonymousAsyncFib;
        memoizedTime = await measureTimeMsAsync(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(obj.count.anonymousAsyncFib).toBe(lastCount);
    });
});
