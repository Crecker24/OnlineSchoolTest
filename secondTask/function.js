function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  let copy;

  if (value instanceof Date) {
    copy = new Date(value);
  } else if (value instanceof RegExp) {
    copy = new RegExp(value.source, value.flags);
    copy.lastIndex = value.lastIndex;
  } else if (value instanceof Map) {
    copy = new Map();
    seen.set(value, copy);

    for (const [key, item] of value) {
      copy.set(deepClone(key, seen), deepClone(item, seen));
    }
  } else if (value instanceof Set) {
    copy = new Set();
    seen.set(value, copy);

    for (const item of value) {
      copy.add(deepClone(item, seen));
    }
  } else if (value instanceof ArrayBuffer) {
    copy = value.slice(0);
    seen.set(value, copy);
  } else if (value instanceof DataView) {
    const bufferCopy = deepClone(value.buffer, seen);
    copy = new DataView(bufferCopy, value.byteOffset, value.byteLength);
  } else if (ArrayBuffer.isView(value)) {
    const bufferCopy = deepClone(value.buffer, seen);
    copy = new value.constructor(
      bufferCopy,
      value.byteOffset,
      value.length
    );
  } else if (Array.isArray(value)) {
    copy = new Array(value.length);
  } else {
    copy = Object.create(Object.getPrototypeOf(value));
  }

  seen.set(value, copy);

  for (const key of Reflect.ownKeys(value)) {
    if (Array.isArray(value) && key === "length") continue;

    const descriptor = Object.getOwnPropertyDescriptor(value, key);

    if ("value" in descriptor) {
      descriptor.value = deepClone(descriptor.value, seen);
    }

    Object.defineProperty(copy, key, descriptor);
  }

  return copy;
}