import { memoizeAsyncRecursive, memoizeRecursive } from '..';
import { memoize, memoizeAsync } from './memoize.api';
import { measureTimeMs, measureTimeMsAsync } from './shared';

describe('Memoized methods should reference this in classes', () => {
    const clss = new (class Test {
        count = { add: 0, asyncAdd: 0, fib: 0, asyncFib: 0 };
        add(a: number, b: number) {
            jest.advanceTimersByTime(500);
            this.count.add++;

            return a + b;
        }

        async asyncAdd(a: number, b: number) {
            jest.advanceTimersByTime(500);
            this.count.asyncAdd++;
            return Promise.resolve(a + b);
        }

        memoizedAdd = memoize(this.add, { thisArg: this });

        memoizedAsyncAdd = memoizeAsync(this.asyncAdd, { thisArg: this });

        fib(n: number, cb = this.fib): number {
            jest.advanceTimersByTime(50000);

            this.count.fib++;
            return n < 2 ? n : cb(n - 1) + cb(n - 2);
        }
        async asyncFib(n: number, cb?: typeof this.asyncFib): Promise<number> {
            jest.advanceTimersByTime(50000);

            this.count.asyncFib++;
            return n < 2 ? n : (await (cb ?? this.asyncFib)(n - 1)) + (await (cb ?? this.asyncFib)(n - 2));
        }

        memoizedRecursiveFib = memoizeRecursive(this.fib, { thisArg: this });
        memoizedAsyncRecursiveFib = memoizeAsyncRecursive(this.asyncFib, { thisArg: this });

        // cannot keep reference to this
        memoizedFib = memoize(this.fib, { thisArg: this });

        // cannot keep reference to this
        memoizedAsyncFib = memoizeAsync(this.asyncFib, { thisArg: this });
    })();
    it('Error - Recursive methods memoized using memoize instead of memoizeRecursive should fail keeping this', async () => {
        jest.useFakeTimers();

        expect(() => clss.memoizedFib(30)).toThrowError();
        expect(async () => await clss.memoizedAsyncFib(30)).rejects.toThrowError();
    });

    it('Error - Recursive methods memoized using memoize instead of memoizeRecursive should fail keeping reference to bound this', async () => {
        jest.useFakeTimers();

        const memoized = memoize(clss.fib, { thisArg: clss });
        const memoizedAsync = memoize(clss.asyncFib, { thisArg: clss });
        expect(() => memoized(30)).toThrowError();
        expect(async () => await memoizedAsync(30)).rejects.toThrowError();
    });

    it('Memoize methods', () => {
        jest.useFakeTimers();
        const time = measureTimeMs(() => clss.memoizedAdd(30, 60));
        expect(clss.count.add).toBeGreaterThan(0);

        const lastCount = clss.count.add;
        const memoizedTime = measureTimeMs(() => clss.memoizedAdd(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.add).toBe(lastCount);
    });

    it('Memoize methods by reference', () => {
        jest.useFakeTimers();
        const memoized = clss.memoizedAdd;
        const time = measureTimeMs(() => memoized(30, 60));
        expect(clss.count.add).toBeGreaterThan(0);

        const lastCount = clss.count.add;
        const memoizedTime = measureTimeMs(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.add).toBe(lastCount);
    });

    it('Memoize class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoized = memoize(clss.add, { thisArg: clss });
        const time = measureTimeMs(() => memoized(30, 60));
        expect(clss.count.add).toBeGreaterThan(0);

        const lastCount = clss.count.add;
        const memoizedTime = measureTimeMs(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.add).toBe(lastCount);
    });

    it('Memoize class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoized = memoize(clss.add.bind(clss));
        const time = measureTimeMs(() => memoized(30, 60));
        expect(clss.count.add).toBeGreaterThan(0);

        const lastCount = clss.count.add;
        const memoizedTime = measureTimeMs(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.add).toBe(lastCount);
    });

    it('Error - Memoize class methods without binding the object', () => {
        const memoized = memoize(clss.add);
        expect(() => memoized(30, 60)).toThrowError();
    });

    it('Memoize recursive methods', () => {
        jest.useFakeTimers();
        const time = measureTimeMs(() => clss.memoizedRecursiveFib(30));
        expect(clss.count.fib).toBeGreaterThan(0);

        const lastCount = clss.count.fib;
        const memoizedTime = measureTimeMs(() => clss.memoizedRecursiveFib(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.fib).toBe(lastCount);
    });

    it('Memoize recursive methods by reference', () => {
        jest.useFakeTimers();
        const memoizedRecursive = clss.memoizedRecursiveFib;
        const time = measureTimeMs(() => memoizedRecursive(30));
        expect(clss.count.fib).toBeGreaterThan(0);

        const lastCount = clss.count.fib;
        const memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.fib).toBe(lastCount);
    });

    it('Memoize recursive class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoizedRecursive = memoizeRecursive(clss.fib, { thisArg: clss });
        const time = measureTimeMs(() => memoizedRecursive(30));
        expect(clss.count.fib).toBeGreaterThan(0);

        const lastCount = clss.count.fib;
        const memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.fib).toBe(lastCount);
    });

    it('Memoize recursive class methods by binding the object', () => {
        jest.useFakeTimers();
        const memoizedRecursive = memoizeRecursive(clss.fib.bind(clss));
        const time = measureTimeMs(() => memoizedRecursive(30));
        expect(clss.count.fib).toBeGreaterThan(0);

        const lastCount = clss.count.fib;
        const memoizedTime = measureTimeMs(() => memoizedRecursive(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.fib).toBe(lastCount);
    });

    it('Error - Memoize recursive class methods without binding the object', () => {
        const memoized = memoizeRecursive(clss.fib);
        expect(() => memoized(30)).toThrowError();
    });

    it('Memoize async methods', async () => {
        jest.useFakeTimers();

        const time = await measureTimeMsAsync(() => clss.memoizedAsyncAdd(30, 60));
        expect(clss.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = clss.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => clss.memoizedAsyncAdd(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async methods by reference', async () => {
        jest.useFakeTimers();
        const memoized = clss.memoizedAsyncAdd;

        const time = await measureTimeMsAsync(() => memoized(30, 60));
        expect(clss.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = clss.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(clss.asyncAdd, { thisArg: clss });

        const time = await measureTimeMsAsync(() => memoized(30, 60));
        expect(clss.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = clss.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsync(clss.asyncAdd.bind(clss));

        const time = await measureTimeMsAsync(() => memoized(30, 60));
        expect(clss.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = clss.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30, 60));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncAdd).toBe(lastCount);
    });

    it('Error - Memoize async class methods without binding the object', async () => {
        const memoized = memoizeAsync(clss.asyncAdd);
        expect(async () => await memoized(30, 60)).rejects.toThrowError();
    });

    it('Memoize async recursive methods', async () => {
        jest.useFakeTimers();

        const time = await measureTimeMsAsync(() => clss.memoizedAsyncRecursiveFib(30));
        expect(clss.count.asyncAdd).toBeGreaterThan(0);

        const lastCount = clss.count.asyncAdd;
        const memoizedTime = await measureTimeMsAsync(() => clss.memoizedAsyncRecursiveFib(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncAdd).toBe(lastCount);
    });

    it('Memoize async recursive methods by reference', async () => {
        jest.useFakeTimers();
        const memoized = clss.memoizedAsyncRecursiveFib;

        const time = await measureTimeMsAsync(() => memoized(30));
        expect(clss.count.asyncFib).toBeGreaterThan(0);

        const lastCount = clss.count.asyncFib;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncFib).toBe(lastCount);
    });

    it('Memoize async recursive class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsyncRecursive(clss.asyncFib, { thisArg: clss });

        const time = await measureTimeMsAsync(() => memoized(30));
        expect(clss.count.asyncFib).toBeGreaterThan(0);

        const lastCount = clss.count.asyncFib;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncFib).toBe(lastCount);
    });

    it('Memoize async recursive class methods by binding the object', async () => {
        jest.useFakeTimers();
        const memoized = memoizeAsyncRecursive(clss.asyncFib.bind(clss));

        const time = await measureTimeMsAsync(() => memoized(30));
        expect(clss.count.asyncFib).toBeGreaterThan(0);

        const lastCount = clss.count.asyncFib;
        const memoizedTime = await measureTimeMsAsync(() => memoized(30));
        expect(time).toBeGreaterThanOrEqual(memoizedTime);
        expect(clss.count.asyncFib).toBe(lastCount);
    });

    it('Error - Memoize async recursive class methods without binding the object', async () => {
        const memoized = memoizeAsyncRecursive(clss.asyncFib);
        expect(async () => await memoized(30)).rejects.toThrowError();
    });
});
