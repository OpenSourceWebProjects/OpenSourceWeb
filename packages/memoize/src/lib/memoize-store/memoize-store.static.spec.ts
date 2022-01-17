import { getTimeInMilliseconds, isExpired } from './memoize-store.static';

describe('store static functions', () => {
    it('getTimeInMilliseconds', () => {
        expect(getTimeInMilliseconds(10, 'ms')).toBe(10);
        expect(getTimeInMilliseconds(10, 's')).toBe(10000);
        expect(getTimeInMilliseconds(10, 'm')).toBe(600000);
        expect(getTimeInMilliseconds(10, 'h')).toBe(36000000);
        expect(getTimeInMilliseconds(10, 'd')).toBe(864000000);
    });

    it('isExpired', () => {
        expect(isExpired(10, 5)).toBe(true);
    });
});
