import { IMemoizeStoreOptions } from './store/memoize-store.interface';

export interface MemoizeOptions<T = unknown> extends IMemoizeStoreOptions<T> {
    /** Defaults to: @ows/better-stringify */
    stringify?: (value: unknown) => string;
    /** Defaults to: True */
    sortedArgs?: boolean;
}

export type FunctionCallback<T extends any = never> = (...args: never[]) => T;
