it('memoize fibonacci', () => {
    jest.useFakeTimers();
    let a = 200;
    function fibonacci(num: number): number {
        console.log(a++);
        if (num < 2) {
            return num;
        } else {
            return fibonacci(num - 1) + fibonacci(num - 2);
        }
    }

    const memoizedFibbonaci = memoize(fibonacci);

    console.log(memoizedFibbonaci.name + ' AAAAAAAAA', '\n', memoizedFibbonaci.toString());
    // console.log(measureTimeMs(() => memoizedFibbonaci(10)) / 1000);
    // console.log(measureTimeMs(() => memoizedFibbonaci(42)) / 1000);
    // console.log(measureTimeMs(() => memoizedFibbonaci(41)) / 1000);
    // console.log(measureTimeMs(() => memoizedFibbonaci(43)) / 1000);
    // const addTime = measureTimeMs(() => memoizedFibbonaci(50));
    // const memoizedFibbonaciTime = measureTimeMs(() => memoizedFibbonaci(50));

    // expect(addTime).toBeGreaterThan(memoizedFibbonaciTime);
});