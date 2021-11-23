// JSON.stringify() serializable primitives: string, number, boolean, undefined, and null.
// Non-serializable primitives: bigint, symbol
export function stringifyPrimitive(obj: unknown): string {
  if (typeof obj === 'string') {
    return `"${obj}"`;
  }
  if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null) {
    return `${obj}`;
  }
  if (obj === undefined) return 'null';
}
