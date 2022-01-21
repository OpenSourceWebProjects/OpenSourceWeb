# Memoize Demo App

This app serves as a demonstration of this libraries capabilities and usabilities.

# How to run it

In the root of the repositori run

-   `npm i`
-   `nx serve applications-memoize-demo`

# Output example

```
 Unmemoized Fib

  First Run(40) -> 1375.159ms
  Second Run(40) -> 1387.399ms
  Different Arg Run(39) -> 890.061ms

 Memoized Fib

  First Run(40) -> 1408.978ms
  Second Run(40) -> 0.018ms
  Different Arg Run(39) -> 830.243ms

 Memoized Recursive Fib

  First Run(40) -> 0.260ms
  Second Run(40) -> 0.003ms
  Different Arg Run(39) -> 0.001ms

 Memoized Recursive Anonymous Fib

  First Run(40) -> 0.108ms
  Second Run(40) -> 0.002ms
  Different Arg Run(39) -> 0.001ms

 Memoized Recursive Fib

  First Run(100) -> 0.143ms
  Second Run(100) -> 0.024ms
  Different Arg Run(99) -> 0.002ms

 Memoized Recursive Anonymous Fib

  First Run(100) -> 0.138ms
  Second Run(100) -> 0.003ms
  Different Arg Run(99) -> 0.001ms

 Parallel Fib

  First Run(40) -> 96.110ms
  Second Run(40) -> 0.019ms
  Different Arg Run(39) -> 0.012ms
```
