import { Benchmark } from './benchmark';

// import { A } from './benchmark';
describe('benchmark', () => {
    // it('should work', () => {
    //     expect(benchmark()).toEqual('benchmark');
    // });

    // it('A', () => {
    //     // const a = new A();
    //    console.log(a.add(1).subtract(10).add(100).showTotal());
    //    const bench = new Benchmark();

    //    bench.addSuite('A', () => {
    //     // expect().toEqual(1);
    //     // expect(benchmark()).toEqual('benchmark');
    // });

     it('should work', () => {
       const bench = new Benchmark();
       bench.add('A', (a,b) => {
            return a**b**5000;
       },[[14,3],[22,22],[15,5]])
       .add('B', (a,b) => {return a*5*b},[[14,3],[22,22],[15,5]])
       .run()
       .statistics();
        
    });

});
