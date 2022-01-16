import { MemoizeOptions } from './memoize.interface.api';
import { memoize as memoizeFn, memoizeAsync as memoizeAsyncFn } from './memoize/memoize';
import {
    MemoizeAsyncCallback,
    MemoizeAsyncRecursiveCallback,
    MemoizeCallback,
    MemoizedAsyncFunction,
    MemoizedAsyncRecursiveFunction,
    MemoizedFunction,
    MemoizedRecursiveFunction,
    MemoizeRecursiveCallback,
} from './memoize/memoize.interface';

export function memoize<T extends MemoizeCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedFunction<T> {
    return memoizeFn(callback, options);
}

export function memoizeLast<T extends MemoizeCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedFunction<T> {
    return memoize(callback, { ...options, size: { max: 1 } });
}

export function memoizeAsync<T extends MemoizeAsyncCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedAsyncFunction<T> {
    return memoizeAsyncFn(callback, options);
}

export function memoizeRecursive<T extends MemoizeRecursiveCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedRecursiveFunction<T> {
    return memoizeFn(callback, options, true);
}

export function memoizeAsyncRecursive<T extends MemoizeAsyncRecursiveCallback>(
    callback: T,
    options?: MemoizeOptions<ReturnType<T>>
): MemoizedAsyncRecursiveFunction<T> {
    return memoizeAsyncFn(callback, options, true);
}
