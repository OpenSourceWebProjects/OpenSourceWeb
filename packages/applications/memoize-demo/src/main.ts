import { memoize, memoizeRecursive } from '@osw/memoize';
import { Worker } from 'cluster';
import { performance } from 'perf_hooks';

const aggregateConsoleLog = (arr: { title: string; data: string }[]) => {
    console.clear();
    arr.forEach((element) => {
        console.group('\x1b[31m', element.title);
        console.log('\x1b[36m%s\x1b[0m', element.data);
        console.groupEnd();
    });
};

function measureTimeMs(callback: () => unknown) {
    const time = performance.now();
    callback();
    return performance.now() - time;
}

function benchmark(cb: typeof memoizedRecursionAnonymousFib, n: number, m: number, title: string) {
    const time = measureTimeMs(() => cb(n)).toFixed(3);
    const memoizedTime = measureTimeMs(() => cb(n)).toFixed(3);
    const secondTime = measureTimeMs(() => cb(m)).toFixed(3);
    return {
        title,
        data: `\nFirst Run(${n}) -> ${time}ms \nSecond Run(${n}) -> ${memoizedTime}ms \nDifferent Arg Run(${m}) -> ${secondTime}ms\n`,
    };
}

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

// process.exit(0);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cluster = require('cluster');
function main(n: number, m: number) {
    const arrResults = [];
    if (cluster.isPrimary) {
        if (n < 40 && m < 40) {
            arrResults.push(benchmark(fib, n, m, 'Unmemoized Fib'));
            arrResults.push(benchmark(memoizedFib, n, m, 'Memoized Fib'));
        }
        arrResults.push(benchmark(memoizedRecursionFib, n, m, 'Memoized Recursive Fib'));
        arrResults.push(benchmark(memoizedRecursionAnonymousFib, n, m, 'Memoized Recursive Anonymous Fib'));

        const store = new Map();
        const fibParallel = memoize(
            (x: number): number => {
                const result = x < 2 ? 1 : fib(x - 1) + fib(x - 2);
                (process as any).send({ x: result });
                return result;
            },
            { store }
        );

        arrResults.push(benchmark((n: number) => runCluster(n, store, fibParallel), n, m, 'Parallel Fib'));
        aggregateConsoleLog(arrResults);
        console.log(store);
    }
}

function runCluster(goal: number, store: Map<string, number>, fibParallel: typeof fib): number {
    const workerCount = goal / 10;
    const workers: Worker[] = [];

    if (store.has(`${goal}`)) return store.get(`${goal}`) as number;
    // Sync the store
    cluster.on(
        'message',
        ({ result, serializedStore }: { result: number; serializedStore: Record<string, number> }) => {
            console.log(result, serializedStore);
            if (result === goal) {
                workers.forEach((worker) => {
                    worker.kill();
                    cluster.disconnect();
                });
            }
            Object.entries(serializedStore).forEach(([key, value]) => {
                store.set(key, value);
            });

            workers.forEach((worker) => {
                worker.send(serializedStore);
            });
        }
    );

    for (let i = 0; i < workerCount; i++) {
        const worker: Worker = cluster.fork();
        worker.on(
            'message',
            ({ result, serializedStore }: { result?: number; serializedStore: Record<string, number> }) => {
                console.log(result, serializedStore);

                Object.entries(serializedStore).forEach(([key, value]) => {
                    store.set(key, value);
                });
            }
        );
        worker.send({ result: fibParallel((i + 1) * 10) });
        workers.push(worker);
    }
    return store.get(`${goal}`) as number;
}

main(10, 10);
// main(100, 99);
