# memoize

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build memoize` to build the library.

## Running unit tests

Run `nx test memoize` to execute the unit tests via [Jest](https://jestjs.io).

Roadmap

-   ~~Add scheduled cleaning of expired entries~~.
-   Add logging capabilities
-   Add unintrusive getLength function to sync the length with the internal store in cases that the custom store is updated externally.
-   ~~Add async/await memoization~~
-   ~~Add recursive memoization~~
-   Improve recursive memoization to support:
    -   async functions
    -   generator functions
    -   anonymous functions
    -   outer scope variables
-   Add rxjs operator
