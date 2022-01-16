import { measureTimeMs, measureTimeMsAsync } from '../shared';
import { memoize, memoizeAsync } from './memoize';

describe('memoize', () => {
    it('memoize should be correct', () => {
        jest.useFakeTimers();
        const add = (a: number, b: number) => {
            jest.advanceTimersByTime(500);
            return a + b;
        };
        const memoizedAdd = memoize(add);
        expect(memoizedAdd(1, 2)).toBe(memoizedAdd(1, 2));
    });

    it('memoize should be faster', () => {
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

    it('async memoize should be faster', async () => {
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
});
