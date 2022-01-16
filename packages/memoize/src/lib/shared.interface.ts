export type VariableArgs<T = never, ARR extends never[] = never[]> = [...ARR, T | undefined];
