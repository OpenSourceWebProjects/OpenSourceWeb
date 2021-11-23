import { stringify } from './better-stringify';
import { stringifyPrimitiveArray } from './slow-functions';
import { stringifyPrimitive } from './stringify-methods';
import { generateMixedPrimitiveArray, generateStringArr, measureTime } from './utils';

describe('Benchmark methods - JSON.stringify() vs custom implementations', () => {
  test('String Literal - String constructor performance compared to string literal', () => {
    const strArr = generateStringArr();

    const performanceStringLiteral = measureTime(() => {
      for (const str of strArr) {
        `${str}`;
      }
    });

    const performanceStringConstructor = measureTime(() => {
      for (const str of strArr) {
        new String(str);
      }
    });

    expect(performanceStringLiteral).toBeLessThan(performanceStringConstructor);
    console.log(
      performanceStringConstructor.toFixed(2),
      performanceStringLiteral.toFixed(2)
    );
  });

  test('Custom Stringify - JSON.stringify() performance compared to Custom Stringify for individual primitive values', () => {
    const arr = generateMixedPrimitiveArray();

    const customTime = measureTime(() => {
      for (const value of arr) {
        stringifyPrimitive(value);
      }
    });
    const jsonStringifyTime = measureTime(() => {
      for (const value of arr) {
        JSON.stringify(value);
      }
    });

    expect(customTime).toBeLessThan(jsonStringifyTime);
    console.log(customTime.toFixed(2), jsonStringifyTime.toFixed(2));
  });

  test('JSON.stringify() - JSON.stringify() performance compared to custom Stringify for entire Array of primitive values', () => {
    const matrix = new Array(1000)
      .fill(0)
      .map(() => generateMixedPrimitiveArray());

    const customStrArr = [];
    const customTime = measureTime(() => {
      for (const arr of matrix) {
        customStrArr.push(stringifyPrimitiveArray(arr));
      }
    });

    const jsonStringifyStrArr = [];

    const jsonStringifyTime = measureTime(() => {
      for (const arr of matrix) {
        jsonStringifyStrArr.push(JSON.stringify(arr));
      }
    });

    expect(customStrArr).toEqual(jsonStringifyStrArr);
    expect(jsonStringifyTime).toBeLessThan(customTime);
    console.log(customTime.toFixed(2), jsonStringifyTime.toFixed(2));
  });

  it('is JSON.stringify more', () => {
    const boolean = true;
    expect(stringify(boolean)).toBe(JSON.stringify(boolean)); // 'true'

    const string = 'foo';
    expect(stringify(string)).toBe(JSON.stringify(string)); // '"foo"'

    const number = 123;
    expect(stringify(number)).toBe(JSON.stringify(number)); // '123'

    const date = new Date(2006, 0, 2, 15, 4, 5);
    expect(stringify(date)).toBe(JSON.stringify(date)); // '"2006-01-02T15:04:05.000Z"'

    const numberArray = [1, 2, 3];
    expect(stringify(numberArray)).toBe(JSON.stringify(numberArray)); // '[1,2,3]'

    const mixedTypeArray = [1, '2', 3, 'false', false];
    expect(stringify(mixedTypeArray)).toBe(JSON.stringify(mixedTypeArray)); // '[1,"2",3,"false",false]'

    const arrayOfPrimordialCreatingObjects = [
      new Number(3),
      new String('false'),
      new Boolean(false),
    ];
    expect(stringify(arrayOfPrimordialCreatingObjects)).toBe(
      JSON.stringify(arrayOfPrimordialCreatingObjects)
    ); // '[3,"false",false]'

    const emptyObject = {};
    expect(stringify(emptyObject)).toBe(JSON.stringify(emptyObject)); // '{}'

    const obj = { x: 5 };
    expect(stringify(obj)).toBe(JSON.stringify(obj)); // '{"x":5}'

    const obj2 = { x: 5, y: 6 };
    expect(stringify(obj2)).toBe(JSON.stringify(obj2)); // '{"x":5,"y":6}'

    // String-keyed array elements are not enumerable and make no sense in JSON
    const a = ['foo', 'bar'];
    a['baz'] = 'quux'; // a: [ 0: 'foo', 1: 'bar', baz: 'quux' ]
    expect(stringify(a)).toBe(JSON.stringify(a)); // '["foo","bar"]'

    // TypedArray
    const typedArray = [
      new Int8Array([1]),
      new Int16Array([1]),
      new Int32Array([1]),
    ];
    expect(stringify(typedArray)).toBe(JSON.stringify(typedArray)); // '[{"0":1},{"0":1},{"0":1}]'
    const typedArray2 = [
      new Uint8Array([1]),
      new Uint8ClampedArray([1]),
      new Uint16Array([1]),
      new Uint32Array([1]),
    ];
    expect(stringify(typedArray2)).toBe(JSON.stringify(typedArray2)); // '[{"0":1},{"0":1},{"0":1},{"0":1}]'

    const typedArray3 = [new Float32Array([1]), new Float64Array([1])];
    expect(stringify(typedArray3)).toBe(JSON.stringify(typedArray3)); // '[{"0":1},{"0":1}]'

    const nonEnumerable = Object.create(null, {
      x: { value: 'x', enumerable: false },
      y: { value: 'y', enumerable: true },
    });
    expect(stringify(nonEnumerable)).toBe(JSON.stringify(nonEnumerable)); // '{"y":"y"}'
  });

  it('JSON.stringify - incompatibility', () => {
    const undefinedValuesArray = [NaN, null, Infinity, undefined];
    expect(stringify(undefinedValuesArray)).toBe(
      JSON.stringify(undefinedValuesArray)
    ); // '[null,null,null,null]'
    JSON.stringify({ x: [10, undefined, function () {}, Symbol('')] });
    // '{"x":[10,null,null,null]}'

    // Standard data structures
    JSON.stringify([
      new Set([1]),
      new Map([[1, 2]]),
      new WeakSet([{ a: 1 }]),
      new WeakMap([[{ a: 1 }, 2]]),
    ]);
    // '[{},{},{},{}]'

    // toJSON()
    JSON.stringify({
      x: 5,
      y: 6,
      toJSON() {
        return this.x + this.y;
      },
    });
    // '11'

    // Symbols:
    JSON.stringify({ x: undefined, y: Object, z: Symbol('') });
    // '{}'
    JSON.stringify({ [Symbol('foo')]: 'foo' });
    // '{}'
    JSON.stringify({ [Symbol.for('foo')]: 'foo' }, function (k, v) {
      if (typeof k === 'symbol') {
        return 'a symbol';
      }
    });
    // undefined

    // BigInt values throw
    JSON.stringify({ x: 2n });
    // TypeError: BigInt value can't be serialized in JSON
  });
});
