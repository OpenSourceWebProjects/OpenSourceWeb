// import { memoize } from '@osw/memoize';
// import { performance } from 'perf_hooks';
// import { getEnvironmentData, isMainThread, setEnvironmentData } from 'worker_threads';
import { main } from './main';


// function measureTimeMs(callback: () => unknown) {
//     const time = performance.now();
//     callback();
//     return performance.now() - time;
// }

// function fibonacci(num: number): number {
//     if (num < 2) {
//         return num;
//     } else {
//         return fibonacci(num - 1) + fibonacci(num - 2);
//     }
// }

// const memoizedFibbonaci = memoize(fibonacci);

// if (isMainThread) {
//     setEnvironmentData('Hello', 'World!');
// } else {
//     console.log(getEnvironmentData('Hello')); // Prints 'World!'.
// }

describe('demo', () => {
    it('should work', () => {
        main();
        expect(true).toBe(true);
    });
});

