type Primitive = string | number | boolean | null | undefined;
type Mappable = Primitive | Mappable[] | { [key: string]: Mappable };

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function mapKeys<T>(obj: T, transform: (key: string) => string): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => mapKeys(item, transform)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, Mappable> = {};
    for (const [key, value] of Object.entries(obj as Record<string, Mappable>)) {
      const newKey = transform(key);
      result[newKey] = mapKeys(value, transform);
    }
    return result as T;
  }
  return obj;
}

export function responseToCamel<T>(data: T): T {
  return mapKeys(data, snakeToCamel);
}

export function requestToSnake<T>(data: T): T {
  return mapKeys(data, camelToSnake);
}
