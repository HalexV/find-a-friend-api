export function extractProperties(properties: string[], target: any) {
  const myObj = {};

  if (typeof target !== 'object') return null;

  properties.forEach((property) => {
    if (Reflect.has(target, property)) {
      if (target[property]) {
        Reflect.defineProperty(myObj, property, {
          value: target[property],
          enumerable: true,
        });
      }
    }
  });

  if (Object.keys(myObj).length === 0) return null;

  return myObj;
}
