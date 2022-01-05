import { MemoizeStore } from './memoize-store';

describe('store', () => {
    function checkStore<T>(store: MemoizeStore<T>, map: Map<string, T>, key: string, value: T | undefined | null) {
        expect(store.get(key)).toBe(map.get(key));
        expect(store.get(key)).toBe(value);
        expect(map.get(key)).toBe(value);
    }

    function checkStoreLength<T>(store: MemoizeStore<T>, map: Map<string, T>, length: number) {
        expect(store.length).toBe(map.size);
        expect(store.length).toBe(length);
        expect(map.size).toBe(length);
    }

    it('store get', () => {
        const map = new Map<string, number>();
        map.set('a', 1);
        const store = new MemoizeStore({ store: map });

        expect(store.get('a')).toBe(map.get('a'));
    });

    it('store add', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map });
        store.set('a', 1);

        checkStoreLength(store, map, 1);
        checkStore(store, map, 'a', 1);
    });

    it('store delete', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map });
        store.set('a', 1);
        store.delete('a');

        checkStoreLength(store, map, 0);
        checkStore(store, map, 'a', undefined);
    });

    it('store clear', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map });
        store.set('a', 1);
        store.set('b', 1);
        store.clear();

        checkStoreLength(store, map, 0);
        checkStore(store, map, 'a', undefined);
    });

    it('store max size', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, size: { max: 1 } });
        store.set('a', 1);
        store.set('b', 1);

        checkStoreLength(store, map, 1);
        checkStore(store, map, 'a', undefined);
        checkStore(store, map, 'b', 1);
    });

    it('store max size - clear all', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, size: { max: 2, removeStrategy: 'clear' } });
        store.set('a', 1);
        store.set('b', 1);
        store.set('c', 1);

        checkStoreLength(store, map, 1);
        checkStore(store, map, 'a', undefined);
        checkStore(store, map, 'b', undefined);
        checkStore(store, map, 'c', 1);
    });

    it('store max size - delete oldest', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, size: { max: 2, removeStrategy: 'oldest' } });
        store.set('a', 1);
        store.set('b', 1);
        store.set('c', 1);

        checkStoreLength(store, map, 2);
        checkStore(store, map, 'a', undefined);
        checkStore(store, map, 'b', 1);
        checkStore(store, map, 'c', 1);
    });

    it('store max time', () => {
        jest.useFakeTimers();

        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, time: { max: 3, unit: 's' } });
        store.set('a', 1);
        store.set('b', 1);

        checkStoreLength(store, map, 2);
        checkStore(store, map, 'a', 1);
        checkStore(store, map, 'b', 1);

        jest.advanceTimersByTime(10000);

        checkStore(store, map, 'a', undefined);
        checkStore(store, map, 'b', undefined);

        // Deleted after trying to get it
        checkStoreLength(store, map, 0);
    });

    it('store scheduled cleanup', () => {
        jest.useFakeTimers();

        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, time: { max: 3, unit: 's', period: 5 } });
        store.set('a', 1);
        store.set('b', 1);

        checkStoreLength(store, map, 2);
        checkStore(store, map, 'a', 1);
        checkStore(store, map, 'b', 1);

        jest.advanceTimersByTime(10000);

        // deleted by the scheduled cleanup
        checkStoreLength(store, map, 0);
    });
});
