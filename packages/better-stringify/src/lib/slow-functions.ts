import { stringifyPrimitive } from './stringify-methods';

// Depricated but kept as reference for testing as it it slower than JSON.stringify()
export function stringifyPrimitiveArray(arr: unknown[]): string {
  return `[${arr.map(stringifyPrimitive).join(',')}]`;
}
