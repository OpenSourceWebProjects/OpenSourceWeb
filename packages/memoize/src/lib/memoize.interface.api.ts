import { IMemoizeStoreOptions } from './memoize-store/memoize-store.interface.api';
import { MemoizeStringify } from './memoize/memoize.interface';

export interface MemoizeBaseOptions<T = unknown> extends IMemoizeStoreOptions<T> {
    thisArg?: any;
    stringify?: MemoizeStringify;
}

export interface MemoizeOptions<T = unknown> extends MemoizeBaseOptions<T> {
    async?: boolean;
    recursive?: boolean;
}
