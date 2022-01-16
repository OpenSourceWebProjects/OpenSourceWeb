import {
    IMemoizeStoreOptions,
    IMemoizeStoreSize,
    IMemoizeStoreTime,
    IMemoizeStoreTimeUnits,
} from './memoize-store.interface.api';

export const STORE_OPTIONS: IMemoizeStoreOptions = {
    size: {
        max: NaN,
        removeStrategy: 'oldest',
    } as Required<IMemoizeStoreSize>,
    time: {
        max: NaN,
        unit: 'ms',
    } as Required<IMemoizeStoreTime>,
};

export function getTimeInMilliseconds(time: number, timeUnit: IMemoizeStoreTimeUnits) {
    switch (timeUnit) {
        case 'ms':
            return time;
        case 's':
            return time * 1000;
        case 'm':
            return time * 1000 * 60;
        case 'h':
            return time * 1000 * 60 * 60;
        case 'd':
            return time * 1000 * 60 * 60 * 24;
        default:
            return 0;
    }
}

export function isExpired(addedOn: number, maxTime: number) {
    const now = new Date().getTime();
    return now - addedOn > maxTime;
}
