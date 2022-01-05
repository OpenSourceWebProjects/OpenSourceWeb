import {
    IMemoizeStore,
    IMemoizeStoreMetadata,
    IMemoizeStoreOptions,
    IMemoizeStoreSize,
    IMemoizeStoreTime,
} from './memoize-store.interface';
import { getTimeInMilliseconds, isExpired, STORE_OPTIONS } from './memoize-store.static';

export class MemoizeStore<T> implements IMemoizeStore<T> {
    public length = 0;
    private data: IMemoizeStore<T>;
    private metadata: Map<string, IMemoizeStoreMetadata> = new Map();
    private setStrategies: Array<(key: string) => void> = [];
    private getConditions: Array<(key: string) => boolean> = [];

    private maxTime: number;
    private size: Required<IMemoizeStoreSize> | undefined;
    private time: Required<IMemoizeStoreTime> | undefined;

    constructor(options?: IMemoizeStoreOptions<T>) {
        this.data = options?.store ?? new Map<string, T>();

        this.size = options?.size
            ? { ...(STORE_OPTIONS.size as Required<IMemoizeStoreSize>), ...options.size }
            : undefined;

        this.time = options?.time
            ? { ...(STORE_OPTIONS.time as Required<IMemoizeStoreTime>), ...options.time }
            : undefined;

        this.maxTime = this.time ? getTimeInMilliseconds(this.time.max, this.time.unit) : NaN;
        this.createStrategy();
    }

    public get(key: string): T | undefined | null {
        if (this.getConditions.length && this.getConditions.some((condition) => condition(key))) return undefined;

        return this.data.get(key);
    }

    public set(key: string, value: T): void {
        this.setStrategies.forEach((strategy) => strategy(key));
        this.data.set(key, value);
        this.length++;
    }

    public delete(key: string): void {
        this.data.delete(key);
        this.metadata.delete(key);
        this.length--;
    }

    public clear() {
        this.data.clear();
        this.metadata.clear();
        this.length = 0;
    }

    private createStrategy() {
        if (this.time) {
            this.getConditions.push((key) => {
                const entry = this.metadata.get(key);
                if (entry?.addedOn) {
                    const isExpiredEntry = isExpired(entry.addedOn, this.maxTime);
                    if (isExpiredEntry) this.delete(key);
                    return isExpiredEntry;
                }
                return false;
            });
        }

        if (this.size) {
            this.setStrategies.push(() => {
                if (this.size && this.length >= this.size.max) {
                    // Map iterates in insertion order, so oldest item will be first - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
                    if (this.size.removeStrategy === 'oldest') {
                        const key = this.metadata.keys().next().value;
                        this.delete(key);
                    } else {
                        this.clear();
                    }
                }
            });
        }

        if (this.time || this.size?.removeStrategy === 'oldest') {
            this.setStrategies.push((key) => this.metadata.set(key, { addedOn: new Date().getTime() }));
        }
    }
}
