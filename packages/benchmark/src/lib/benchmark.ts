



export class Benchmark {
    suites:Array<{
        name:string,
        fn:(...args:any[])=>unknown,
        testData:any[][],
        times:number[]
    }> = [];
    // constructor(options: any) {}

    add(name: string, fn: (...args:any[])=>unknown,testData:any[][]) {
        this.suites.push({name,fn,testData,times:[]});
        return this;
    }

    run() {
// testData = [[1,2,3],[4,5,6],[7,8,9]]
        for(let i=0; i<1000; i++) {
        this.suites.forEach(suite => {
            suite.testData.forEach(data => {
               suite.times.push(measureTimeMs( () => suite.fn(...data)));
            })
        });
    }
        return this;
    }
    
    statistics(){
        const averageTimesWithName =  this.suites.map(suite => {
            const sum = suite.times.reduce((previousVal, currentVal) => {return previousVal + currentVal}, 0);
            const avg = sum / suite.times.length;
            return {
                name: suite.name,
                avgTime:avg
            }
        }).sort((a,b) => a.avgTime - b.avgTime);

        averageTimesWithName.forEach(suite => {
            console.log(`${suite.name}: ${suite.avgTime}ms`);
        });

        return this;
    }
}

// export function createBenchmark(options: any) {
//     return new Benchmark(options);
// }

//  export class A {
//     total = 0;
//     add(a: number) {
//         this.total += a;
//         return this;
//     }

//     subtract(a: number) {
//         this.total -= a;
//         return this;
//     }

//     showTotal(){
//         return this.total;
//     }
// }
 

// import { performance as nodePerformance } from 'perf_hooks';

export function measureTimeMs(
    callback: () => unknown,
    performance = (globalThis as any).performance 
) {
    const time = performance.now();
    callback();
    return performance.now() - time;
}