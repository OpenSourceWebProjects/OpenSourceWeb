import { memoize, memoizeAsync, memoizeSync } from './memoize.api';
import { measureTimeMs, measureTimeMsAsync } from './shared';

describe('Memoize functions by type', () => {
    const functionTypes = {
        function: function add(a: number, b: number) {
            jest.advanceTimersByTime(50000);
            return a + b;
        },
        'anonymous-function': function (a: number, b: number) {
            jest.advanceTimersByTime(50000);
            return a + b;
        },
        'fat-arrow-function': (a: number, b: number) => {
            jest.advanceTimersByTime(50000);
            return a + b;
        },
    };

    it('Each function should be memoized', () => {
        jest.useFakeTimers();
        Object.values(functionTypes).forEach((fn) => {
            const memoized = memoizeSync(fn);
            const time = measureTimeMs(() => memoized(1, 2));
            const memoizedTime = measureTimeMs(() => memoized(1, 2));
            expect(time).toBeGreaterThan(memoizedTime);
        });
    });

    const asyncFunctionTypes = {
        'async-function': async function add(a: number, b: number) {
            jest.advanceTimersByTime(50000);
            return Promise.resolve(a + b);
        },
        'anonymous-async-function': async function (a: number, b: number) {
            jest.advanceTimersByTime(50000);
            return Promise.resolve(a + b);
        },
        'fat-arrow-async-function': async (a: number, b: number) => {
            jest.advanceTimersByTime(50000);
            return Promise.resolve(a + b);
        },
    };

    it('Each async function should be memoized', async () => {
        jest.useFakeTimers();
        Object.values(asyncFunctionTypes).forEach(async (fn) => {
            const memoized = memoizeAsync(fn);
            const time = await measureTimeMsAsync(() => memoized(1, 2));
            const memoizedTime = await measureTimeMsAsync(() => memoized(1, 2));
            expect(time).toBeGreaterThan(memoizedTime);
        });
    });

    it('Each function should be memoized with the correct sync/async type detected', async () => {
        jest.useFakeTimers();

        Object.values(functionTypes).forEach((fn) => {
            const memoized = memoize(fn);
            const time = measureTimeMs(() => memoized(1, 2));
            const memoizedTime = measureTimeMs(() => memoized(1, 2));
            expect(time).toBeGreaterThan(memoizedTime);
        });
        Object.values(asyncFunctionTypes).forEach(async (fn) => {
            const memoized = memoize(fn);
            const time = await measureTimeMsAsync(() => memoized(1, 2));
            const memoizedTime = await measureTimeMsAsync(() => memoized(1, 2));
            expect(time).toBeGreaterThan(memoizedTime);
        });
    });

    const genertorFunctionTypes = {
        'function*': function* add(a: number, b: number) {
            jest.advanceTimersByTime(50000);
            yield a + b;
            yield 99999;
        },
        'anonymous-function*': function* (a: number, b: number) {
            jest.advanceTimersByTime(50000);
            yield a + b;
            yield 99999;
        },
    };

    it('Each generator function type should be memoized', () => {
        jest.useFakeTimers();
        Object.values(genertorFunctionTypes).forEach((fn) => {
            const memoized = memoizeSync(fn);
            const memoizedGenerator = memoized(1, 2);
            const generator = fn(1, 2);
            const time = measureTimeMs(() => memoizedGenerator.next());
            const memoizedTime = measureTimeMs(() => generator.next());
            // The generator acts as a singleton so it will return only the next value, memoizing it will not improve the performance or will improve it only by a small amount
            expect(time).toBeGreaterThanOrEqual(memoizedTime);

            expect(memoizedGenerator.next()).toStrictEqual(generator.next());
            expect(memoized(1, 2).next()).not.toBe(fn(1, 2).next());
        });
    });

    const asyncGeneratorFunctionTypes = {
        'async-function*': async function* add(a: number, b: number) {
            jest.advanceTimersByTime(50000);
            yield Promise.resolve(a + b);
            yield Promise.resolve(99999);
        },
        'anonymous-async-function*': async function* (a: number, b: number) {
            jest.advanceTimersByTime(50000);
            yield Promise.resolve(a + b);
            yield Promise.resolve(99999);
        },
    };

    it('Each async generator function should be memoized', async () => {
        jest.useFakeTimers();
        Object.values(asyncGeneratorFunctionTypes).forEach(async (fn) => {
            const memoized = memoizeSync(fn);

            const memoizedGenerator = memoized(1, 2);
            const generator = fn(1, 2);
            const time = measureTimeMs(() => memoized(1, 2));
            const memoizedTime = measureTimeMs(async () => memoized(1, 2));
            // The generator acts as a singleton so it will return only the next value, memoizing it will not improve the performance or will improve it only by a small amount
            expect(time).toBeGreaterThanOrEqual(memoizedTime);

            expect(await memoizedGenerator.next()).toStrictEqual(await generator.next());
            expect(await memoized(1, 2).next()).not.toBe(await fn(1, 2).next());
        });
    });
});
