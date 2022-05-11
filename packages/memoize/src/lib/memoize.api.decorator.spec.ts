import { Memoize, memoizeAsync, memoizeAsyncRecursive, memoizeSync, memoizeSyncRecursive } from './memoize.api';
import { measureTimeMs, measureTimeMsAsync } from './shared';

class Test {
    count = { add: 0, asyncAdd: 0, fib: 0, asyncFib: 0, decoratedAdd: 0 };

    @Memoize()
    add(a: number, b: number) {
        jest.advanceTimersByTime(500);
        this.count.add++;

        return a + b;
    }

    @Memoize()
    async asyncAdd(a: number, b: number) {
        jest.advanceTimersByTime(500);
        this.count.asyncAdd++;
        return Promise.resolve(a + b);
    }

    @Memoize()
    fib(n: number, cb = this.fib): number {
        jest.advanceTimersByTime(50000);

        this.count.fib++;
        return n < 2 ? n : cb(n - 1) + cb(n - 2);
    }

    @Memoize()
    async asyncFib(n: number, cb?: typeof this.asyncFib): Promise<number> {
        jest.advanceTimersByTime(50000);

        this.count.asyncFib++;
        return n < 2 ? n : (await (cb ?? this.asyncFib)(n - 1)) + (await (cb ?? this.asyncFib)(n - 2));
    }

    memoizedRecursiveFib = memoizeSyncRecursive(this.fib, { thisArg: this });
    memoizedAsyncRecursiveFib = memoizeAsyncRecursive(this.asyncFib, { thisArg: this });

    // cannot keep reference to this
    memoizedFib = memoizeSync(this.fib, { thisArg: this });

    // cannot keep reference to this
    memoizedAsyncFib = memoizeAsync(this.asyncFib, { thisArg: this });
}

describe('Memoized methods should reference this in classes', () => {
    const test = new Test();
    it('Error - Recursive methods memoized using memoize instead of memoizeSyncRecursive should fail keeping this', async () => {
        jest.useFakeTimers();

        expect(() => test.memoizedFib(30)).toThrowError();
        expect(async () => await test.memoizedAsyncFib(30)).rejects.toThrowError();
    });

    it('Error - Recursive methods memoized using memoize instead of memoizeSyncRecursive should fail keeping reference to bound this', async () => {
        jest.useFakeTimers();

        const memoized = memoizeSync(test.fib, { thisArg: test });
        const memoizedAsync = memoizeSync(test.asyncFib, { thisArg: test });
        expect(() => memoized(30)).toThrowError();
        expect(async () => await memoizedAsync(30)).rejects.toThrowError();
    });

    it('Memoize methods', () => {
        jest.useFakeTimers();
        const time = measureTimeMs(() => test.add(30, 60));
        expect(test.count.add).toBeGreaterThan(0);

        const lastCount = test.count.add;
        const memoizedTime = measureTimeMs(() => test.add(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.add).toBe(lastCount);
    });

    it('Memoize methods by reference', () => {
        jest.useFakeTimers();
        const memoized = test.add;
        const time = measureTimeMs(() => memoized(30, 60));
        expect(test.count.add).toBeGreaterThan(0);

        const lastCount = test.count.add;
        const memoizedTime = measureTimeMs(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.add).toBe(lastCount);
    });

    it('Memoize class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoized = memoizeSync(test.add, { thisArg: test });
        const time = measureTimeMs(() => memoized(30, 60));
        expect(test.count.add).toBeGreaterThan(0);

        const lastCount = test.count.add;
        const memoizedTime = measureTimeMs(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.add).toBe(lastCount);
    });

    it('Memoize class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoized = memoizeSync(test.add.bind(test));
        const time = measureTimeMs(() => memoized(30, 60));
        expect(test.count.add).toBeGreaterThan(0);

        const lastCount = test.count.add;
        const memoizedTime = measureTimeMs(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.add).toBe(lastCount);
    });

    it('Error - Memoize class methods without binding the object', () => {
        const memoized = memoizeSync(test.add);
        expect(() => memoized(30, 60)).toThrowError();
    });

    it('Memoize recursive methods', () => {
        jest.useFakeTimers();
        const time = measureTimeMs(() => test.memoizedRecursiveFib(30));
        expect(test.count.fib).toBeGreaterThan(0);

        const lastCount = test.count.fib;
        const memoizedTime = measureTimeMs(() => test.memoizedRecursiveFib(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.fib).toBe(lastCount);
    });

    it('Memoize recursive methods by reference', () => {
        jest.useFakeTimers();
        const memoizedRecursive = test.memoizedRecursiveFib;
        const time = measureTimeMs(() => memoizedRecursive(30));
        expect(test.count.fib).toBeGreaterThan(0);

        const lastCount = test.count.fib;
        const memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.fib).toBe(lastCount);
    });

    it('Memoize recursive class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoizedRecursive = memoizeSyncRecursive(test.fib, { thisArg: test });
        const time = measureTimeMs(() => memoizedRecursive(30));
        expect(test.count.fib).toBeGreaterThan(0);

        const lastCount = test.count.fib;
        const memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.fib).toBe(lastCount);
    });

    it('Memoize recursive class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoizedRecursive = memoizeSyncRecursive(test.fib.bind(test));
        const time = measureTimeMs(() => memoizedRecursive(30));
        expect(test.count.fib).toBeGreaterThan(0);

        const lastCount = test.count.fib;
        const memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.fib).toBe(lastCount);
    });

    it('Error - Memoize recursive class methods without binding the object', () => {
        const memoized = memoizeSyncRecursive(test.fib);
        expect(() => memoized(30)).toThrowError();
    });

    it('Memoize async methods', async () => {
        jest.useFakeTimers();

        const time = await measureTimeMsAsync(() => test.asyncAdd(30, 60));
        expect(test.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = test.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => test.asyncAdd(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async methods by reference', async () => {
        jest.useFakeTimers();
        const memoized = test.asyncAdd;

        const time = await measureTimeMsAsync(() => memoized(30, 60));
        expect(test.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = test.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(test.asyncAdd, { thisArg: test });

        const time = await measureTimeMsAsync(() => memoized(30, 60));
        expect(test.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = test.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(test.asyncAdd.bind(test));

        const time = await measureTimeMsAsync(() => memoized(30, 60));
        expect(test.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = test.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncAdd).toBe(lastCount);
    });

    it('Error - Memoize async class methods without binding the object', async () => {
        const memoized = memoizeAsync(test.asyncAdd);
        expect(async () => await memoized(30, 60)).rejects.toThrowError();
    });

    it('Memoize async recursive methods', async () => {
        jest.useFakeTimers();

        const time = await measureTimeMsAsync(() => test.memoizedAsyncRecursiveFib(30));
        expect(test.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = test.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => test.memoizedAsyncRecursiveFib(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async recursive methods by reference', async () => {
        jest.useFakeTimers();
        const memoized = test.memoizedAsyncRecursiveFib;

        const time = await measureTimeMsAsync(() => memoized(30));
        expect(test.count.asyncFib).toBeGreaterThan(0);

        const lastCount = test.count.asyncFib;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncFib).toBe(lastCount);
    });

    it('Memoize async recursive class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsyncRecursive(test.asyncFib, { thisArg: test });

        const time = await measureTimeMsAsync(() => memoized(30));
        expect(test.count.asyncFib).toBeGreaterThan(0);

        const lastCount = test.count.asyncFib;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncFib).toBe(lastCount);
    });

    it('Memoize async recursive class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsyncRecursive(test.asyncFib.bind(test));

        const time = await measureTimeMsAsync(() => memoized(30));
        expect(test.count.asyncFib).toBeGreaterThan(0);

        const lastCount = test.count.asyncFib;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(test.count.asyncFib).toBe(lastCount);
    });

    it('Error - Memoize async recursive class methods without binding the object', async () => {
        const memoized = memoizeAsyncRecursive(test.asyncFib);
        expect(async () => await memoized(30)).rejects.toThrowError();
    });
});
