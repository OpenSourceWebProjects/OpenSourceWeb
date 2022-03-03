export class Benchmark {
    constructor(options: any) {}

    add(name: string, fn: Function) {
        console.log(name, fn);
        return this;
    }

    run() {
        return this;
    }
}

export function createBenchmark(options: any) {
    return new Benchmark(options);
}
