import { stringify } from '@osw/better-stringify';

import { MemoizeOptions } from './memoize.interface';
import { splitAtFirstInstance } from './shared';
import { MemoizeStore } from './store/memoize-store';

export function memoizeLast<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
) {
    return memoize(callback, { ...options, size: { max: 1 } });
}

export function memoize<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
) {
    return memoizeWithStore(callback, options, new MemoizeStore(options));
}

export function memoizeAsync<T extends (...args: never[]) => Promise<Awaited<ReturnType<T>>>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
) {
    const store = new MemoizeStore(options);
    return async (...args: Parameters<typeof callback>): Promise<Awaited<ReturnType<typeof callback>>> => {
        const key = stringify(args);
        const value = store.get(key);
        if (value) return await Promise.resolve(value);

        const result = await callback(...args);
        store.set(key, result);
        return result;
    };
}

export function memoizeRecursive<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
) {
    return memoizeRecursion(callback, options, new MemoizeStore(options));
}

function memoizeWithStore<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>,
    store: MemoizeStore<ReturnType<T>> = new MemoizeStore(options)
) {
    return (...args: Parameters<typeof callback>): ReturnType<typeof callback> => {
        const key = stringify(args);
        const value = store.get(key);
        if (value) return value;

        const result = callback(...args);
        store.set(key, result);
        return result;
    };
}

function memoizeRecursion<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>,
    store: MemoizeStore<ReturnType<T>> = new MemoizeStore(options)
) {
    function fn(): (...args: Parameters<typeof callback>) => ReturnType<typeof callback> {
        return memoizeWithStore(changeToRecursiveMemoization(callback, fn), options, store);
    }
    return fn();
    // const obj = { callback };

    // const proxy = new Proxy(obj.callback, {
    //     apply(target, innerThis, argsList: Parameters<T>) {
    //         console.log(target, innerThis, argsList);
    //         return memoizeWithStore(target, options, store)(...argsList);
    //     },
    // });

    // return new Proxy(proxy, {
    //     apply(target, innerThis, argsList: Parameters<T>) {
    //         console.log(target, innerThis, argsList);
    //         return memoizeWithStore(target.callback, options, store)(...argsList);
    //     },
    // }).callback;
    // }

    // return proxy;

    // return memoize(callback, { ...options, store });
}

function changeToRecursiveMemoization<T extends (...args: never[]) => ReturnType<T>>(
    callback: T,
    
    memoizedCallback: () => (...args: Parameters<T>) => ReturnType<T>
): T {
    let canBeRecursivelyMemoized = true;
    const errorMessages = [];
    const nativeCodeStr = '(){[nativecode]}';
    const functionName = callback.name;
    let functionCode;

    try {
        functionCode = callback.toString();
    } catch (error) {
        if ((error as Error).constructor == TypeError) {
            if (Function(`return ${functionName}.toString()`)() != nativeCodeStr) {
                errorMessages.push(
                    `Possible Proxy detected: function has a name but no accessible source code. Consider memoizing the target function, ${functionName}.`
                );
            } else {
                errorMessages.push(
                    `Function has a name but no accessible source code. Applying toString() to its name, ${functionName}, returns '[native code]'.`
                );
            }
        } else {
            errorMessages.push('Unexpected error calling toString on the argument.');
        }

        canBeRecursivelyMemoized = false;
    }
    if (!functionCode || functionCode.replace(/^[^(]+|\s+/g, '') === nativeCodeStr) {
        errorMessages.push(`Cannot access source code, '[native code]' provided.`);
        canBeRecursivelyMemoized = false;
    }
    if (!canBeRecursivelyMemoized) {
        console.warn('The function cannot be memoized recursively, it will use sequential memoization instead.');
        return memoizedCallback as any;
    }

    if (functionCode) {
        console.log(functionCode, functionName);
        const [functionCodeStart, functionCodeEnd] = splitAtFirstInstance(functionCode, '(');
        if (functionCodeStart.includes('function')) {
            // function or function generator detected

            const functionNameRegex = new RegExp(`\\b${functionName}\\b`, 'gi');
            const code = functionCodeStart + '(' + functionCodeEnd.replaceAll(functionNameRegex, memoizedCallback.name);
            console.log(functionNameRegex, '\n', code);

            return Function('"use strict";return ' + code)();
        }
    }
    return memoizedCallback as any;
}
