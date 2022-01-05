export interface IMemoizeStore<T = unknown> {
    /** Retrieves the value from the store */
    get: (key: string) => T | undefined | null;
    /** Sets a value in the store */
    set: (key: string, value: T) => void;
    /** Removes the specified entry */
    delete: (key: string) => void;
    /** Clears the entire store */
    clear: () => void;
}

export interface IMemoizeStoreMetadata {
    addedOn: number;
}

export interface IMemoizeStoreOptions<T = unknown> {
    /** Defaults to: Map */
    store?: IMemoizeStore<T>;
    /** Defaults to: undefined - infinite size */
    size?: IMemoizeStoreSize;
    /** Defaults to: undefined - infinite time span */
    time?: IMemoizeStoreTime;
}

export interface IMemoizeStoreSize {
    /** Defaults to: 'NaN' */
    max: number;
    /** Defaults to: 'oldest' */
    removeStrategy?: IMemoizeStoreRemoveStrategy;
}

export interface IMemoizeStoreTime {
    /** Defaults to: 'NaN' */
    max: number;
    /** Defaults to: 'ms' */
    unit?: IMemoizeStoreTimeUnits;
    /** Periodically clear the expired entries */
    schedule?: {};
}

export type IMemoizeStoreTimeUnits = 'ms' | 's' | 'm' | 'h' | 'd';
export type IMemoizeStoreRemoveStrategy = 'clear' | 'oldest';
