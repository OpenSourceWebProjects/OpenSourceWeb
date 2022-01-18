# memoize

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build memoize` to build the library.

## Running unit tests

Run `nx test memoize` to execute the unit tests via [Jest](https://jestjs.io).

# Roadmap

-   ~~Add scheduled cleaning of expired entries~~.
-   Add logging capabilities
-   Add unintrusive getLength function to sync the length with the internal store in cases that the custom store is updated externally.
-   ~~Add async/await memoization~~
-   ~~Add recursive memoization~~
-   Improve recursive memoization to support:
    -   async functions - ~~implementation, tests~~
    -   generator functions - ~~implementation~~, tests
    -   anonymous functions - ~~implementation~~, tests
    -   outer scope variables - ~~implementation~~, tests
-   Add rxjs operator
-   Add onAdd, onDelete events

## Nice to have

-   Recursive function memoization without needing additional parameters
-   Autodetect async functions
-   Unite all memoization types under the same API with correct type inference
-   Disable input for env.
-   Statistics - E.g. https://github.com/medikoo/memoizee#profiling--statistics

# Limitations

-   Recursive functions need to have as a last parameter an optional parameter that is the recursive callback
-   generator functions are supported through the `memoize` function for both sync and async functions. FOr the same parameters they will return the cached generator so the `next` value will not be restarted when you create a new generator.

```typescript
    function* add(a: number, b: number) {
        yield a + b;
        yield 99999;
    },

    const memoized = memoize(fn);
    const memoizedGenerator = memoized(1, 2);
    const newMemoizedGenerator = memoized(1, 2);

    memoizedGenerator.next() // Return  { "done": false, "value": 3}
    newMemoizedGenerator.next() // Return  { "done": false, "value": 99999}
```
