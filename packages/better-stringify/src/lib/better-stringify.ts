export function stringify(obj) {
  if (obj === null || obj === undefined) return `${obj}`;
  if (Array.isArray(obj)) return `[${obj.map(stringify).join(',')}]`;
  if (typeof obj === 'symbol') return `${obj.toString()}`;
  if (typeof obj === 'object') {
    let str = '';
    Object.keys(obj).forEach((key) => {
      str += `"${key}":${stringify(obj[key])},`;
    });
    return `{${str}}`;
  }
  return `${obj}`;
}
