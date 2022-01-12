import { stringify } from '@osw/better-stringify';

import { MemoizeRecursiveCallback } from '..';
import {
    MemoizeAsyncCallback,
    MemoizeCallback,
    MemoizedAsyncFunction,
    MemoizedFunction,
    MemoizedRecursiveFunction,
    MemoizeOptions,
} from './memoize.interface';
import { MemoizeStore } from './store/memoize-store';

export function memoizeLast<T extends MemoizeCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedFunction<T> {
    return memoize(callback, { ...options, size: { max: 1 } });
}

export function memoize<T extends MemoizeCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedFunction<T> {
    return memoizeWithStore(callback, options, new MemoizeStore(options));
}

export function memoizeAsync<T extends MemoizeAsyncCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedAsyncFunction<T> {
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

function memoizeWithStore<T extends MemoizeCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>,
    store: MemoizeStore<ReturnType<T>> = new MemoizeStore(options)
): MemoizedFunction<T> {
    return (...args: Parameters<typeof callback>): ReturnType<typeof callback> => {
        const key = stringify(args);
        const value = store.get(key);
        if (value) return value;

        const result = callback(...args);
        store.set(key, result);
        return result;
    };
}

export function memoizeRecursive<T extends MemoizeRecursiveCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedRecursiveFunction<T> {
    const store = new MemoizeStore(options);

    const fn = (...args: Parameters<typeof callback>): ReturnType<typeof callback> => {
        const key = stringify(args);
        const value = store.get(key);
        if (value) return value;
        const result = callback(...([...args, fn] as Parameters<typeof callback>));
        store.set(key, result);
        return result;
    };

    return fn;
}
