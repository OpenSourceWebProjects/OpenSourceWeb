export function stringify(obj: unknown): string {
    return JSON.stringify(obj);
}
// const typesCountSerialization = {
//   'undefined': [0,() => ] ,
//   'null': 'null',

// // }
// export function stringify(obj: unknown): string {
//     // a++;
//     if (obj === null || obj === undefined) {
//         return JSON.stringify(obj);
//     }
//     if (Array.isArray(obj)) {
//         const hasOnlyPrimitives = obj.every((item) => typeof item !== 'object');
//         // console.log(obj, hasOnlyPrimitives);
//         if (hasOnlyPrimitives) return JSON.stringify(obj);
//         //obj.toString();
//         //`[${obj.map(stringify).join(',')}]`;
//         else return `[${obj.map(stringify).join(',')}]`;
//     }

//     if (typeof obj === 'symbol') return `${obj.toString()}`;
//     if (obj instanceof Date) return `"${obj.toISOString()}"`;
//     if (obj instanceof Number) return `${obj.valueOf()}`;
//     if (obj instanceof Boolean) return `${obj.valueOf()}`;
//     if (obj instanceof String) return `"${obj.valueOf()}"`;
//     if (typeof obj === 'object') {
//         let str = '';
//         Object.keys(obj).forEach((key) => {
//             str += `"${key}":${stringify(obj[key])},`;
//         });
//         return `{${str}}`;
//     }
//     if (typeof obj === 'string') return `"${obj}"`;
//     return `${obj}`;
// }

// try array instead of string because immutability
// try worker for big objects
// try schema for know parameters ( and flag to parse only those values, or mixed approach))
// without schema parse to the best possible
// flag without schema that marks the object or nested objects/arrays as having only primitives
// test using the benckmarks from the fast-stringify, slow stringify , and mdn json.stringify

// export function stringifyy(obj) {
//     // a++;
//     const arr: string[] = [];
//     const str = (obj) => {
//         console.log(a);
//         if (obj === null || obj === undefined) {
//             arr.push(`${obj}`);
//             return;
//         }
//         if (Array.isArray(obj)) {
//             const hasOnlyPrimitives = obj.every((item) => typeof item !== 'object');
//             // console.log(obj, hasOnlyPrimitives);
//             if (hasOnlyPrimitives) arr.push(JSON.stringify(obj));
//             //obj.toString();
//             //`[${obj.map(stringify).join(',')}]`;
//             else arr.push(`[${obj.map(str).join(',')}]`);
//             return;
//         }

//         if (typeof obj === 'symbol') arr.push(`${obj.toString()}`);
//         if (typeof obj === 'object') {
//             const strArr: string[] = [];
//             Object.keys(obj).forEach((key) => {
//                 strArr.push(`"${key}":${str(obj[key])},`);
//             });
//             arr.push(`{${strArr.join('')}}`);
//             return;
//         }
//         arr.push(`${obj}`);
//         return;
//     };
//     str(obj);
//     return arr.join('');
// }
