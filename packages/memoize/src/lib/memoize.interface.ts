import { IMemoizeStoreOptions } from './store/memoize-store.interface';

export interface MemoizeOptions<T = unknown> extends IMemoizeStoreOptions<T> {
    /** Defaults to: @ows/better-stringify */
    stringify?: (value: unknown) => string;
    /** Defaults to: True */
    sortedArgs?: boolean;
}
export type MemoizeCallback<
    T extends (...args: P) => R = (...args: never[]) => never,
    P extends never[] = never[],
    R extends never = never
> = (...args: Parameters<T>) => ReturnType<T>;
export type MemoizeAsyncCallback<
    T extends (...args: P) => Promise<R> = (...args: never[]) => Promise<never>,
    P extends never[] = never[],
    R extends Promise<never> = Promise<never>
> = (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;

export type MemoizedFunction<T extends MemoizeCallback> = (...args: Parameters<T>) => ReturnType<T>;
export type MemoizedAsyncFunction<T extends MemoizeAsyncCallback> = (
    ...args: Parameters<T>
) => Promise<Awaited<ReturnType<T>>>;
