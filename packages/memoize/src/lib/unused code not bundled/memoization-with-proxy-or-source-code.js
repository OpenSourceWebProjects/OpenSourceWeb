// // Recursive memoization
// // If the function is on an object / has a this. and is called recursively using this. then we can just add a proxy to it
// // Otherwise force users to rewrite the function using a callback with default parameters as the same function so we can replace it
// // This is a bit of a hack but it works
// type MemoizedObject<T> = { [key: string]: unknown | T };
// export function memoizeObjFn<
//     O extends MemoizedObject<T>,
//     K extends keyof O,
//     T extends (...args: never[]) => ReturnType<T>
// >(obj: Record<string, unknown | T>, key: K, options?: MemoizeOptions<ReturnType<T>>) {
//     //@ts-ignore
//     // const fn = memoizeWithStore(obj[key], options, new MemoizeStore(options), obj);
//     const store = new MemoizeStore(options);
//     // const proxyFn = new Proxy(obj[`${key}`] as T, {
//     //     apply(target, thisArg, args: Parameters<T>): ReturnType<T> {
//     //         const key = stringify(args);
//     //         const value = store.get(key);
//     //         if (value) return value;

//     //         const result = target.bind(thisArg)(...args);
//     //         store.set(key, result);
//     //         return result;
//     //     },
//     // });
//     // const proxyFn = new Proxy(obj[`${key}`] as T, {
//     //     apply(target, thisArg, args: Parameters<T>): ReturnType<T> {
//     //         console.log(target, thisArg, args, obj);
//     //         const key = stringify(args);
//     //         const value = store.get(key);
//     //         if (value) return value;

//     //         const result = target.bind(obj)(...args);
//     //         store.set(key, result);
//     //         return result;
//     //     },
//     // });
//     // const proxy = new Proxy(obj, {
//     //     get(target, propKey: string): unknown {
//     //         console.log(target, propKey);
//     //         if (propKey === key) return proxyFn;
//     //         return target[propKey];
//     //     },
//     // });
//     // return proxy[key];
//     //@ts-ignore
//     // return proxyFn;
//     return memoizeWithStore(obj[key], options, new MemoizeStore(options), obj);
// }

// type VariableCallback<T extends never[], K, R> = (...args: [...T, K]) => R;

// export function memoizeRecursiveE<T extends VariableCallback<never[], T | undefined, ReturnType<T>>>(
//     callback: T,
//     options?: MemoizeOptions<ReturnType<T>>,
//     store: MemoizeStore<ReturnType<T>> = new MemoizeStore(options)
// ) {
//     const getParams: (args: unknown[], length: number) => Parameters<typeof callback> = (args, len) =>
//         (len === args.length ? [...args.slice(0, len - 1), fn] : [...args, fn]) as Parameters<typeof callback>;

//     const fn = (...args: Parameters<typeof callback>): ReturnType<typeof callback> => {
//         const key = stringify(args);
//         const value = store.get(key);
//         if (value) return value;

//         const result = callback(...getParams(args, callback.length));
//         store.set(key, result);
//         return result;
//     };

//     return fn;
// }
// function a() {
//     return 2;
// }
// const b = memoizeRecursiveE(a);

// function memoizeRecursion<T extends (...args: never[]) => ReturnType<T>>(
//     callback: T,
//     options?: MemoizeOptions<ReturnType<T>>,
//     store: MemoizeStore<ReturnType<T>> = new MemoizeStore(options),
//     optionalObjects: Record<string, unknown> = {}
// ): (...args: Parameters<T>) => ReturnType<T> {
//     // const functionObj: Record<string, (...args: Parameters<T>) => ReturnType<T>> = {};
//     // functionObj[callback.name] = callback.bind(functionObj);
//     // functionObj['memoizedFunction'] = memoizeWithStore(functionObj[callback.name] as T, options, store);

//     // return functionObj['memoizedFunction'];

//     // return new Function(
//     //     '__memoizeRecursiveFunction,__memoizeRecursiveFunctionCallback,__memoizeRecursiveFunctionOptions',
//     //     `'use strict'; let ${callback.name} = __memoizeRecursiveFunction(Function(__memoizeRecursiveFunctionCallback.name,"'use strict'; return "+__memoizeRecursiveFunctionCallback.toString())(${callback.name}),__memoizeRecursiveFunctionOptions); return ${callback.name}`
//     // )(memoizeWithStore, callback, options);

//     // if there is a this, then there is an object and we can use a proxy on it, otherwise eh...

//     // Maybe something like this
//     //'function a () {return 2;}'
//     // 'function x(xx){console.log(xx.name);  return xx();}'
//     // new Function('x',`'use strict'; let ${a.name} = () => 5; return x(${a.name})`)

//     const a = changeToRecursiveMemoization(callback, options, store, optionalObjects);
//     console.log(a.toString());
//     return a;
//     // function fn(): (...args: Parameters<typeof callback>) => ReturnType<typeof callback> {
//     //     return memoizeWithStore(changeToRecursiveMemoization(callback, fn), options, store);
//     // }
//     // return fn();
//     // {
//     //     // const obj = { callback };
//     // const proxy = new Proxy(obj.callback, {
//     //     apply(target, innerThis, argsList: Parameters<T>) {
//     //         console.log(target, innerThis, argsList);
//     //         return memoizeWithStore(target, options, store)(...argsList);
//     //     },
//     // });
//     //     // return new Proxy(proxy, {
//     //     //     apply(target, innerThis, argsList: Parameters<T>) {
//     //     //         console.log(target, innerThis, argsList);
//     //     //         return memoizeWithStore(target.callback, options, store)(...argsList);
//     //     //     },
//     //     // }).callback;
//     //     // }
//     //     // return proxy;
//     //     // return memoize(callback, { ...options, store });}
//     // }

//     // const proo = new Proxy(b.a, {
//     //     get(target, propKey) {
//     //         console.log(target, propKey);
//     //         return target[propKey];
//     //     },
//     //     apply(target, innerThis, argsList) {
//     //         console.log(target, innerThis, argsList);
//     //         return target(...argsList);
//     //     },
//     // });
// }

// function changeToRecursiveMemoization<T extends (...args: never[]) => ReturnType<T>>(
//     callback: T,
//     options?: MemoizeOptions<ReturnType<T>>,
//     store: MemoizeStore<ReturnType<T>> = new MemoizeStore(options),

//     optionalObjects: Record<string, unknown> = {}
// ): (...args: Parameters<T>) => ReturnType<T> {
//     const newFunctionParameterName = 'memoizedCallback';
//     const functionObj = { [newFunctionParameterName]: memoizeWithStore(callback, options) };
//     let canBeRecursivelyMemoized = true;
//     const errorMessages = [];
//     const nativeCodeStr = '(){[nativecode]}';
//     const functionName = callback.name;
//     let functionCode;

//     try {
//         functionCode = callback.toString();
//     } catch (error) {
//         if ((error as Error).constructor == TypeError) {
//             if (Function(`return ${functionName}.toString()`)() != nativeCodeStr) {
//                 errorMessages.push(
//                     `Possible Proxy detected: function has a name but no accessible source code. Consider memoizing the target function, ${functionName}.`
//                 );
//             } else {
//                 errorMessages.push(
//                     `Function has a name but no accessible source code. Applying toString() to its name, ${functionName}, returns '[native code]'.`
//                 );
//             }
//         } else {
//             errorMessages.push('Unexpected error calling toString on the argument.');
//         }

//         canBeRecursivelyMemoized = false;
//     }
//     if (!functionCode || functionCode.replace(/^[^(]+|\s+/g, '') === nativeCodeStr) {
//         errorMessages.push(`Cannot access source code, '[native code]' provided.`);
//         canBeRecursivelyMemoized = false;
//     }
//     if (!canBeRecursivelyMemoized) {
//         console.warn('The function cannot be memoized recursively, it will use sequential memoization instead.');
//         return functionObj[newFunctionParameterName];
//     }

//     if (functionCode) {
//         console.log(functionCode, functionName);
//         const [functionCodeStart, functionCodeEnd] = splitAtFirstInstance(functionCode, '(');
//         if (functionCodeStart.includes('function')) {
//             // function or function generator detected

//             const functionNameRegex = new RegExp(`\\b${functionName}\\b`, 'gi');
//             const code =
//                 functionCodeStart + '(' + functionCodeEnd.replaceAll(functionNameRegex, newFunctionParameterName);
//             console.log(functionNameRegex, '\n', code);
//             const adjustedCallback = Function(
//                 newFunctionParameterName,
//                 'store',
//                 ...Object.keys(optionalObjects),
//                 '"use strict";return ' + code
//             );
//             console.log(
//                 'callback',
//                 adjustedCallback.toString(),
//                 adjustedCallback(
//                     functionObj[newFunctionParameterName],
//                     store,
//                     Object.values(optionalObjects)
//                 ).toString()
//             );
//             functionObj[newFunctionParameterName] = memoizeWithStore(
//                 adjustedCallback(functionObj[newFunctionParameterName], store, Object.values(optionalObjects)),
//                 options,
//                 store
//             ).bind(functionObj);
//             return functionObj[newFunctionParameterName];
//         }
//     } else {
//         // anonimous function detected
//     }
//     return functionObj[newFunctionParameterName];
// }
