export function splitAtFirstInstance(str: string, delimiter: string) {
    const idx = str.indexOf(delimiter);
    return [str.slice(0, idx), str.slice(idx + 1)];
}
