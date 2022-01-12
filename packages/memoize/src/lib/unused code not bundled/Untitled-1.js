function aa(a:number){
    return Promise.resolve( a + 1)
}
// (a: number) =>Promise.resolve( a + 1)
const a = memoizeAsync(aa);
a()
export function memoizeRecursive<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
) {
    return memoizeRecursion(callback, options);
}

function memoizeRecursion<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>,
    store: MemoizeStore<ReturnType<T>> = new MemoizeStore(options)
) {
    const visited = new Set<string>();

    const fn = (...args: Parameters<typeof callback>): ReturnType<T> => {
        const key = stringify(args);
        const value = store.get(key);
        if (value) return value;

        const result = visited.has(key) ? callback(...args) : fn(...args);
        store.set(key, result);
        return result;
    };

    return fn;
}

// function interceptMethodCalls<T extends (...args: unknown[]) => ReturnType<T>>(
//     obj: Record<string | symbol, unknown>,
//     callback: T
// ) {
//     return new Proxy(obj, {
//         get(target, prop) {
//             // (A)
//             if (typeof target[prop] === 'function') {
//                 return new Proxy(target[prop] as T, {
//                     apply: (target, thisArg, argumentsList) => {
//                         // (B)
//                         // callback(prop, argumentsList);
//                         // return Reflect.apply(target, thisArg, argumentsList);
//                         return callback(prop, argumentsList);
//                     },
//                 });
//             } else {
//                 return Reflect.get(target, prop);
//             }
//         },
//     });
// }

// function a (){
//     // Redefine Function.prototype.bind
// // to provide access to bound objects.
// // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
// var _bind = Function.prototype.apply.bind(Function.prototype.bind);
// Object.defineProperty(Function.prototype, 'bind', {
//     value: function(obj) {
//         var boundFunction = _bind(this, arguments);
//         boundFunction.boundObject = obj;
//         return boundFunction;
//     }
// });

// // Assumes the parameters for the function,
// // f, can be consistently mapped.
// function memo(f){
//   if (!(f instanceof Function))
//     throw TypeError('Argument is not an instance of Function.');

//   // Generate random variable names
//   // to avoid conflicts with unknown
//   // source code
//   function randomKey(numBytes=8){
//       let ranges = [[48, 10], [65, 26], [97, 26]];
//       let key = '_';

//       for (let i=0; i<numBytes; i++){
//           let idx = Math.floor(Math.random() * ranges.length);
//           key += String.fromCharCode(ranges[idx][0] + Math.random() * ranges[idx][1]);
//       }

//       return key;
//   }

//   let fName = f.name;
//   let boundObject;
//   let fCode;

//   const nativeCodeStr = '(){[nativecode]}';

//   // Possible Proxy
//   try {
//     fCode = f.toString();

//   } catch(error){
//     if (error.constructor == TypeError){
//       if (Function(`return ${ fName }.toString()`)() != nativeCodeStr){
//         throw TypeError(`Possible Proxy detected: function has a name but no accessible source code. Consider memoizing the target function, ${ fName }.`);

//       } else {
//         throw TypeError(`Function has a name but no accessible source code. Applying toString() to its name, ${ fName }, returns '[native code]'.`);
//       }

//     } else {
//       throw Error('Unexpected error calling toString on the argument.');
//     }
//   }

//   if (!fName){
//     throw Error('Function name is falsy.');

//   // Bound functions
//   // Assumes we've monkey-patched
//   // Function.prototype.bind previously
//   } else if (fCode.replace(/^[^(]+|\s+/g, '') == nativeCodeStr){
//     if (/^bound /.test(fName)){
//       fName = fName.substr(6);
//       boundObject = f.boundObject;
//       // Bound functions return '[native code]' for
//       // their toString method call so get the code
//       // from the original function.
//       fCode = Function(`return ${ fName }.toString()`)();

//     } else {
//       throw Error("Cannot access source code, '[native code]' provided.");
//     }
//   }

//   const fNameRegex = new RegExp('(\\W)' + fName + '(\\W)', 'g');
//   const cacheName = randomKey();
//   const recursionName = randomKey();
//   const keyName = randomKey();

//   fCode = fCode.replace(/[^\(]+/,'')
//     .replace(fNameRegex, '$1' + recursionName + '$2')
//     .replace(/return/g, `return ${ cacheName }[${ keyName }] =`)
//     .replace(/{/, `{\n  const ${ keyName } = Array.from(arguments);\n\n  if (${ cacheName }[${ keyName }])\n    return ${ cacheName }[${ keyName }];\n`);

//   const code = `function(){\nconst ${ cacheName } = {};\n\nfunction ${ recursionName + fCode }\n\nreturn ${ recursionName }.apply(${ recursionName }, arguments);}`;

//   let g = Function('"use strict";return ' + code)();

//   if (boundObject){
//     let h = (g).bind(boundObject);
//     h.toString = () => code;
//     return h;

//   } else {
//     return g;
//   }
// } // End memo function

// function fib(n) {
//   if (n <= 1) return 1;
//   return fib(n - 1) + fib(n - 2);
// }

// const h = fib.bind({a: 37});
// const g = memo(h);

// console.log(`g(100): ${ g(100) }`);
// console.log(`g.boundObject:`, g.boundObject);
// console.log(`g.toString():`, g.toString());

// try{
//   memo(function(){});

// } catch(e){
//   console.log('Caught error memoizing anonymous function.', e)
// }

// const p = new Proxy(fib, {
//   apply: function(target, that, args){
//     console.log('Proxied fib called.');
//     return target.apply(target, args);
//   }
// });

// console.log('Calling proxied fib.');
// console.log(`p(2):`, p(2));

// let memoP;

// try {
//   memoP = memo(p);

// } catch (e){
//   console.log('Caught error memoizing proxied function.', e)
// }
// }