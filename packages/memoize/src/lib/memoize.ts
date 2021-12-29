import { stringify } from '@osw/better-stringify';

export function memoize<T extends (...args: never[]) => ReturnType<T>>(callback: T) {
    const cache: { [key: string]: ReturnType<T> } = {};

    return (...args: Parameters<typeof callback>) => {
        const key = stringify(args);
        if (key in cache) return cache[key];
        const result = callback(...args);
        cache[key] = result;
        return result;
    };
}
