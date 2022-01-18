import { memoize, memoizeRecursive } from '@osw/memoize';
import { BroadcastChannel, isMainThread, Worker, workerData } from 'worker_threads';

import { aggregateConsoleLog, benchmark, benchmarkAsync } from './app/shared';

const fib: (x: number) => number = (x: number, fibFn: typeof fib = fib) => {
    return x < 2 ? 1 : fibFn(x - 1) + fibFn(x - 2);
};

const memoizeFibStore = new Map();
const memoizedFib = memoize(fib, { store: memoizeFibStore });

const memoizedRecursionAnonymousFibStore = new Map();
const memoizedRecursionAnonymousFib = memoize(
    (x: number): number => {
        return x < 2 ? 1 : memoizedRecursionAnonymousFib(x - 1) + memoizedRecursionAnonymousFib(x - 2);
    },
    { store: memoizedRecursionAnonymousFibStore }
);

const memoizedRecursionFibStore = new Map();
const memoizedRecursionFib = memoizeRecursive(fib, { store: memoizedRecursionFibStore });

function runSequentialBenchmark(n: number, m: number) {
    const arrResults = [];
    if (n <= 40 && m <= 40) {
        arrResults.push(benchmark(fib, n, m, 'Unmemoized Fib'));
        arrResults.push(benchmark(memoizedFib, n, m, 'Memoized Fib'));
    }
    arrResults.push(benchmark(memoizedRecursionFib, n, m, 'Memoized Recursive Fib'));
    arrResults.push(benchmark(memoizedRecursionAnonymousFib, n, m, 'Memoized Recursive Anonymous Fib'));
    aggregateConsoleLog(arrResults);
}

if (isMainThread) {
    runSequentialBenchmark(40, 39);
    runSequentialBenchmark(100, 99);
}
runThreadedBenchmark(40, 39);

async function runThreadedBenchmark(n: number, m: number) {
    const bc = new BroadcastChannel('bc');

    const store = new Map();
    const fibParallel = memoize(
        (x: number): number => {
            const result = x < 2 ? 1 : fibParallel(x - 1) + fibParallel(x - 2);
            bc.postMessage({ serializedStore: { [x]: result } });
            return result;
        },
        { store }
    );
    aggregateConsoleLog([
        await benchmarkAsync((n: number) => runCluster(n, store, fibParallel, bc), n, m, 'Parallel Fib'),
    ]);
}

function runCluster(
    goal: number,
    store: Map<string, number>,
    fibParallel: (x: number) => number,
    bc: BroadcastChannel
): Promise<number> {
    if (store.has(`${goal}`)) return Promise.resolve(store.get(`${goal}`) as number);
    return new Promise((resolve, reject) => {
        if (isMainThread) {
            const workerCount = goal / 10;
            const workers: Worker[] = [];

            for (let i = 0; i < workerCount; i++) {
                const worker: Worker = new Worker(__filename, { workerData: { goal: (i + 1) * 10 } });
                workers.push(worker);
            }

            bc.onmessage = (ev: any) => {
                const data = ev.data as { result?: number; serializedStore?: Record<string, number> };
                if (data.serializedStore) {
                    Object.entries(data.serializedStore).forEach(([key, value]) => {
                        store.set(key, value);
                    });
                }
                if (store.has(`${goal}`)) {
                    bc.close();
                    workers.forEach((worker) => worker.terminate());
                    resolve(store.get(`${goal}`) as number);
                }
            };
        } else {
            const goal = workerData.goal;
            bc.onmessage = (ev: any) => {
                const data = ev.data as { result?: number; serializedStore?: Record<string, number> };

                if (data.serializedStore) {
                    Object.entries(data.serializedStore).forEach(([key, value]) => {
                        store.set(key, value);
                    });
                }
            };
            bc.postMessage({ result: fibParallel(goal) });
        }
    });
}
