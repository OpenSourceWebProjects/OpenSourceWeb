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

## Nice to have

-   Recursive function memoization without needing additional parameters
-   Autodetect async functions
-   Unite all memoization types under the same API with correct type inference
