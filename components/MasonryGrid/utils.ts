// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumber = (v: any): boolean =>
  typeof v === "number" && isFinite(v);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPercentageNumber = (v: any): boolean =>
  typeof v === "string" && /^\d+(\.\d+)?%$/.test(v);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createArray = (v: any, l: number) => {
  const array = [];
  for (let i = 0; i < l; i += 1) array.push(v);
  return array;
};

// https://stackoverflow.com/a/16436975 : check if two arrays are equal
export function arrayOfObjectsEqual(a: object[], b: object[]) {
  // if (a === b) return true;
  if (a === null || b === null) return false;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    // if (a[i] !== b[i]) return false;
    if (!objectsEqual(a[i], b[i])) return false;
  }
  return true;
}

// https://stackoverflow.com/a/55256318 : compare arrays of objects
// https://stackoverflow.com/a/57088282 : index has 'any' type ts bug fix
// https:stackoverflow.com/a/43188775 : deep copy object
export const objectsEqual = (o1: object, o2: object) => {
  return (
    o1 &&
    o2 &&
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every(
      (p: string) => o1[p as keyof typeof o1] === o2[p as keyof typeof o2]
    )
  );
};
