import { stringify } from './better-stringify';

describe('stringify', () => {
  it('a', () => {
    const a = {
      a: 1,
      i: [1, 2, 3],
      b: 'aaa',
      c: true,
      d: null,
      e: undefined,
      f: () => {},
      h: {
        a: 1,
      },
      g: new Map().set('a', 1),
      j: new Set([1, 2, 3]),
      k: new WeakMap(),
      l: new WeakSet(),
      o: Symbol('a'),
      p: Symbol.for('a'),
      q: new Int16Array([1, 2, 3]),
      // r: new Array(),
      s: new ArrayBuffer(2600),
      t: new Uint8Array([1, 2, 3]),
      u: new Uint8ClampedArray([1, 2, 3]),
      v: new Uint16Array([1, 2, 3]),
      w: new Uint32Array([1, 2, 3]),
      x: new Int8Array([1, 2, 3]),
    };

    console.time('JsonStringify');
    console.log(JSON.stringify(a));
    console.timeEnd('JsonStringify');

    console.time('JsonStringify2');
    console.log(stringify(a));
    console.timeEnd('JsonStringify2');
  });

  it('', () => {
    JSON.stringify({}); // '{}'
    JSON.stringify(true); // 'true'
    JSON.stringify('foo'); // '"foo"'
    JSON.stringify([1, 'false', false]); // '[1,"false",false]'
    JSON.stringify([NaN, null, Infinity]); // '[null,null,null]'
    JSON.stringify({ x: 5 }); // '{"x":5}'

    JSON.stringify(new Date(2006, 0, 2, 15, 4, 5));
    // '"2006-01-02T15:04:05.000Z"'

    JSON.stringify({ x: 5, y: 6 });
    // '{"x":5,"y":6}'
    JSON.stringify([new Number(3), new String('false'), new Boolean(false)]);
    // '[3,"false",false]'

    // String-keyed array elements are not enumerable and make no sense in JSON
    let a = ['foo', 'bar'];
    a['baz'] = 'quux'; // a: [ 0: 'foo', 1: 'bar', baz: 'quux' ]
    JSON.stringify(a);
    // '["foo","bar"]'

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

    // TypedArray
    JSON.stringify([
      new Int8Array([1]),
      new Int16Array([1]),
      new Int32Array([1]),
    ]);
    // '[{"0":1},{"0":1},{"0":1}]'
    JSON.stringify([
      new Uint8Array([1]),
      new Uint8ClampedArray([1]),
      new Uint16Array([1]),
      new Uint32Array([1]),
    ]);
    // '[{"0":1},{"0":1},{"0":1},{"0":1}]'
    JSON.stringify([new Float32Array([1]), new Float64Array([1])]);
    // '[{"0":1},{"0":1}]'

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
    JSON.stringify({ [Symbol.for('foo')]: 'foo' }, [Symbol.for('foo')]);
    // '{}'
    JSON.stringify({ [Symbol.for('foo')]: 'foo' }, function (k, v) {
      if (typeof k === 'symbol') {
        return 'a symbol';
      }
    });
    // undefined

    // Non-enumerable properties:
    JSON.stringify(
      Object.create(null, {
        x: { value: 'x', enumerable: false },
        y: { value: 'y', enumerable: true },
      })
    );
    // '{"y":"y"}'

    // BigInt values throw
    JSON.stringify({ x: 2n });
    // TypeError: BigInt value can't be serialized in JSON
  });
});
