import { MemoizeStore } from './memoize-store';

describe('store', () => {
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

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(1);
        expect(map.size).toBe(1);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(1);
        expect(map.get('a')).toBe(1);
    });

    it('store delete', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map });
        store.set('a', 1);
        store.delete('a');

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(0);
        expect(map.size).toBe(0);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(undefined);
        expect(map.get('a')).toBe(undefined);
    });

    it('store clear', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map });
        store.set('a', 1);
        store.set('b', 1);
        store.clear();

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(0);
        expect(map.size).toBe(0);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(undefined);
        expect(map.get('a')).toBe(undefined);
    });

    it('store max size', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, size: { max: 1 } });
        store.set('a', 1);
        store.set('b', 1);

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(1);
        expect(map.size).toBe(1);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(undefined);
        expect(map.get('a')).toBe(undefined);

        expect(store.get('b')).toBe(map.get('b'));
        expect(store.get('b')).toBe(1);
        expect(map.get('b')).toBe(1);
    });

    it('store max size - clear all', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, size: { max: 2, removeStrategy: 'clear' } });
        store.set('a', 1);
        store.set('b', 1);
        store.set('c', 1);

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(1);
        expect(map.size).toBe(1);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(undefined);
        expect(map.get('a')).toBe(undefined);

        expect(store.get('b')).toBe(map.get('b'));
        expect(store.get('b')).toBe(undefined);
        expect(map.get('b')).toBe(undefined);

        expect(store.get('c')).toBe(map.get('c'));
        expect(store.get('c')).toBe(1);
        expect(map.get('c')).toBe(1);
    });

    it('store max size - delete oldest', () => {
        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, size: { max: 2, removeStrategy: 'oldest' } });
        store.set('a', 1);
        store.set('b', 1);
        store.set('c', 1);

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(2);
        expect(map.size).toBe(2);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(undefined);
        expect(map.get('a')).toBe(undefined);

        expect(store.get('b')).toBe(map.get('b'));
        expect(store.get('b')).toBe(1);
        expect(map.get('b')).toBe(1);

        expect(store.get('c')).toBe(map.get('c'));
        expect(store.get('c')).toBe(1);
        expect(map.get('c')).toBe(1);
    });

    it('store max time', () => {
        const wait = (ms: number) => {
            const start = Date.now();
            let now = start;
            while (now - start < ms) {
                now = Date.now();
            }
        };

        const map = new Map<string, number>();
        const store = new MemoizeStore({ store: map, time: { max: 3, unit: 's' } });
        store.set('a', 1);
        store.set('b', 1);

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(2);
        expect(map.size).toBe(2);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(1);
        expect(map.get('a')).toBe(1);

        expect(store.get('b')).toBe(map.get('b'));
        expect(store.get('b')).toBe(1);
        expect(map.get('b')).toBe(1);

        wait(3000);

        expect(store.get('a')).toBe(map.get('a'));
        expect(store.get('a')).toBe(undefined);
        expect(map.get('a')).toBe(undefined);

        expect(store.get('b')).toBe(map.get('b'));
        expect(store.get('b')).toBe(undefined);
        expect(map.get('b')).toBe(undefined);

        expect(store.length).toBe(map.size);
        expect(store.length).toBe(0);
        expect(map.size).toBe(0);
    });
});
