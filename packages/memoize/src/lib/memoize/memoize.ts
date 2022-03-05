import { MemoizeStore } from '../memoize-store/memoize-store.api';
import { MemoizeBaseOptions } from '../memoize.interface.api';
import {
    MemoizeAsyncCallback,
    MemoizeCallback,
    MemoizedAsyncFunction,
    MemoizedFunction,
    MemoizeStringify,
} from './memoize.interface';
import { MEMOIZE_STRINGIFY_OPTIONS } from './memoize.static';

export function memoize<T extends MemoizeCallback>(
    callback: T,
    options?: MemoizeBaseOptions<ReturnType<T>>,
    referenceItself = false
): MemoizedFunction<T> {
    const stringify: MemoizeStringify = options?.stringify ?? MEMOIZE_STRINGIFY_OPTIONS;
    const store = new MemoizeStore(options);
    const getArgs = referenceItself ? (args: Parameters<T>) => [...args, fn] : (args: Parameters<T>) => args;
    const callbackFn = callback.bind(options?.thisArg);
    const fn = function (...args: Parameters<typeof callback>): ReturnType<typeof callback> {
        const key = stringify.stringify(args, ...(stringify.args ?? []));
        const value = store.get(key);
        if (value) return value;

        const result = callbackFn(...getArgs(args));
        store.set(key, result);
        return result;
    };

    return fn;
}

export function memoizeAsync<T extends MemoizeAsyncCallback>(
    callback: T,
    options?: MemoizeBaseOptions<ReturnType<T>>,
    referenceItself = false
): MemoizedAsyncFunction<T> {
    const stringify: MemoizeStringify = options?.stringify ?? MEMOIZE_STRINGIFY_OPTIONS;
    const store = new MemoizeStore(options);
    const getArgs = referenceItself ? (args: Parameters<T>) => [...args, fn] : (args: Parameters<T>) => args;
    const callbackFn = callback.bind(options?.thisArg);

    const fn = async (...args: Parameters<typeof callback>): Promise<Awaited<ReturnType<typeof callback>>> => {
        const key = stringify.stringify(args, ...(stringify.args ?? []));
        const value = store.get(key);
        if (value) return await Promise.resolve(value);

        const result = await callbackFn(...getArgs(args));
        store.set(key, result);
        return result;
    };
    return fn;
}
