import { IMemoizeStoreOptions } from './memoize-store/memoize-store.interface.api';
import { MemoizeStringify } from './memoize/memoize.interface';

export interface MemoizeOptions<T = unknown> extends IMemoizeStoreOptions<T> {
    thisArg?: any;
    stringify?: MemoizeStringify;
}
