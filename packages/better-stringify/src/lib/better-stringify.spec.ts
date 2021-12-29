// import { stringify, stringifyy } from './better-stringify';

// const alphabet = [
//   'a',
//   'c',
//   'd',
//   'e',
//   'f',
//   'g',
//   'h',
//   'i',
//   'j',
//   'k',
//   'l',
//   'm',
//   'n',
//   'o',
//   'p',
//   'q',
//   'r',
//   's',
//   't',
//   'u',
//   'v',
//   'w',
//   'x',
//   'y',
//   'z',
//   ' ',
// ];
// const str = Array(10000)
//   .fill(0)
//   .map(
//     (_, i) =>
//       alphabet[(i * Math.random() * 12345678901412341) % alphabet.length]
//   )
//   .join('');
// const testArr = Array(1000)
//   .fill(0)
//   .map(() => ({
//     a: Math.random() * 12345678901412341,
//     b: Math.random() * 12345678901412341,
//     c: Math.random() * 12345678901412341,
//   }));

// const testArr2 = Array(10000)
//   .fill(0)
//   .map(() => Math.random() * 12345678901412341);
// describe('stringify', () => {
//   test('a', () => {
//     const a = {
//       // a: 1,
//       // i: [1, 2, 3],
//       // b: `${str}`,
//       // c: true,
//       // d: null,
//       // e: undefined,
//       // f: () => {},
//       // h: {
//       //   a: 1,
//       // },
//       // g: new Map().set('a', 1),
//       // j: new Set([1, 2, 3]),
//       // k: [...testArr],
//       l: [...testArr2],
//     };

//     console.time('JsonStringify');
//     JSON.stringify(a);
//     console.timeEnd('JsonStringify');

//     console.time('JsonStringify2');
//     stringifyy(a);
//     console.timeEnd('JsonStringify2');

//     console.time('JsonStringify3');
//     const stringfy = sjs({
//       a: attr('number'),
//       i: attr('array'),
//       b: attr('string'),
//       c: attr('boolean'),
//       d: attr('null'),
//       e: attr('null'),
//       f: attr('string', (value) => `${value}`),
//       h: {
//         a: attr('number'),
//       },
//       g: {
//         a: attr('number'),
//       },
//       j: attr('array'),
//       k: {
//         a: attr('array'),
//         b: attr('array'),
//         c: attr('array'),
//       },
//       l: attr('array'),
//     });
//     stringfy(a);
//     console.timeEnd('JsonStringify3');
//   });

//   test('JSON.stringify compatibility', () => {
//     const boolean = true;
//     expect(stringify(boolean)).toBe(JSON.stringify(boolean)); // 'true'

//     const string = 'foo';
//     expect(stringify(string)).toBe(JSON.stringify(string)); // '"foo"'

//     const number = 123;
//     expect(stringify(number)).toBe(JSON.stringify(number)); // '123'

//     const date = new Date(2006, 0, 2, 15, 4, 5);
//     expect(stringify(date)).toBe(JSON.stringify(date)); // '"2006-01-02T15:04:05.000Z"'

//     const numberArray = [1, 2, 3];
//     expect(stringify(numberArray)).toBe(JSON.stringify(numberArray)); // '[1,2,3]'

//     const mixedTypeArray = [1, '2', 3, 'false', false];
//     expect(stringify(mixedTypeArray)).toBe(JSON.stringify(mixedTypeArray)); // '[1,"2",3,"false",false]'

//     const arrayOfPrimordialCreatingObjects = [
//       new Number(3),
//       new String('false'),
//       new Boolean(false),
//     ];
//     expect(stringify(arrayOfPrimordialCreatingObjects)).toBe(
//       JSON.stringify(arrayOfPrimordialCreatingObjects)
//     ); // '[3,"false",false]'

//     const emptyObject = {};
//     expect(stringify(emptyObject)).toBe(JSON.stringify(emptyObject)); // '{}'

//     const obj = { x: 5 };
//     expect(stringify(obj)).toBe(JSON.stringify(obj)); // '{"x":5}'

//     const obj2 = { x: 5, y: 6 };
//     expect(stringify(obj2)).toBe(JSON.stringify(obj2)); // '{"x":5,"y":6}'

//     // String-keyed array elements are not enumerable and make no sense in JSON
//     const a = ['foo', 'bar'];
//     a['baz'] = 'quux'; // a: [ 0: 'foo', 1: 'bar', baz: 'quux' ]
//     expect(stringify(a)).toBe(JSON.stringify(a)); // '["foo","bar"]'

//     // TypedArray
//     const typedArray = [
//       new Int8Array([1]),
//       new Int16Array([1]),
//       new Int32Array([1]),
//     ];
//     expect(stringify(typedArray)).toBe(JSON.stringify(typedArray)); // '[{"0":1},{"0":1},{"0":1}]'
//     const typedArray2 = [
//       new Uint8Array([1]),
//       new Uint8ClampedArray([1]),
//       new Uint16Array([1]),
//       new Uint32Array([1]),
//     ];
//     expect(stringify(typedArray2)).toBe(JSON.stringify(typedArray2)); // '[{"0":1},{"0":1},{"0":1},{"0":1}]'

//     const typedArray3 = [new Float32Array([1]), new Float64Array([1])];
//     expect(stringify(typedArray3)).toBe(JSON.stringify(typedArray3)); // '[{"0":1},{"0":1}]'

//     const nonEnumerable = Object.create(null, {
//       x: { value: 'x', enumerable: false },
//       y: { value: 'y', enumerable: true },
//     });
//     expect(stringify(nonEnumerable)).toBe(JSON.stringify(nonEnumerable)); // '{"y":"y"}'
//   });

//   test('JSON.stringify - incompatibility', () => {
//     const undefinedValuesArray = [NaN, null, Infinity, undefined];
//     expect(stringify(undefinedValuesArray)).toBe(
//       JSON.stringify(undefinedValuesArray)
//     ); // '[null,null,null,null]'
//     JSON.stringify({ x: [10, undefined, function () {}, Symbol('')] });
//     // '{"x":[10,null,null,null]}'

//     // Standard data structures
//     JSON.stringify([
//       new Set([1]),
//       new Map([[1, 2]]),
//       new WeakSet([{ a: 1 }]),
//       new WeakMap([[{ a: 1 }, 2]]),
//     ]);
//     // '[{},{},{},{}]'

//     // toJSON()
//     JSON.stringify({
//       x: 5,
//       y: 6,
//       toJSON() {
//         return this.x + this.y;
//       },
//     });
//     // '11'

//     // Symbols:
//     JSON.stringify({ x: undefined, y: Object, z: Symbol('') });
//     // '{}'
//     JSON.stringify({ [Symbol('foo')]: 'foo' });
//     // '{}'
//     JSON.stringify({ [Symbol.for('foo')]: 'foo' }, function (k, v) {
//       if (typeof k === 'symbol') {
//         return 'a symbol';
//       }
//     });
//     // undefined

//     // BigInt values throw
//     JSON.stringify({ x: 2n });
//     // TypeError: BigInt value can't be serialized in JSON
//   });
// });
