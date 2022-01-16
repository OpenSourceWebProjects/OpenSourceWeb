import { stringify } from '@osw/better-stringify';

import { MemoizeStringify } from './memoize.interface';

export const MEMOIZE_STRINGIFY_OPTIONS: MemoizeStringify = {
    stringify: stringify,
    args: [],
};
