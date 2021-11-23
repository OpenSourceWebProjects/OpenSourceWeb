# Better Stringify

Fastest Javascript serialization library available. It maintains 100% compatibility to `JSON.stringify()` and it's as easy to use, without additional setup like `fast-json-stringify` or `slow-json-stringify`.

# Benchmarks

- TODO

# Additional options

- schema
- parallel serialization
- create benchmark tests to measure the performance between JSON.stringify vs custom implementation

# Discoveries

- Custom serialization for primitive types is faster than JSON.stringify()
- JSON.stringify serializes faster an array of primitives
- String literal is faster than string constructor
