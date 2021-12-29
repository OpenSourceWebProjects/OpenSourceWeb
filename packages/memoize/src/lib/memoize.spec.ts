import { performance } from 'perf_hooks';

import { memoize } from './memoize';

function wait(ms: number) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}
function measureTimeMs(callback: () => unknown) {
    const time = performance.now();
    callback();
    return performance.now() - time;
}

describe('memoize', () => {
    it('memoize add', () => {
        const add = (a: number, b: number) => {
            wait(5);
            return a + b;
        };
        const memoizedAdd = memoize(add);
        const addTime = measureTimeMs(() => memoizedAdd(1, 2));
        const memoizedAddTime = measureTimeMs(() => memoizedAdd(1, 2));
        expect(addTime).toBeGreaterThan(memoizedAddTime);
    });
});
