import { stringify } from '@osw/better-stringify';

import { MemoizeOptions } from './memoize.interface';
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
    const store = new MemoizeStore(options);
    return (...args: Parameters<typeof callback>) => {
        const key = stringify(args);
        const value = store.get(key);
        if (value) return value;
        const result = callback(...args);
        store.set(key, result);
        return result;
    };
}
