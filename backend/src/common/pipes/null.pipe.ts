import { PipeTransform, Injectable } from '@nestjs/common';

const NULL = 'null';

export function walkArray(arr: unknown[]): unknown[] {
  arr.forEach((el, i) => {
    if (el === NULL) {
      return (arr[i] = null);
    }
    if (Array.isArray(el)) {
      return walkArray(el);
    }
    if (typeof el === 'object') {
      return walkObject(el as Record<string, unknown>);
    }
  });
  return arr;
}

function walkObject(value: Record<string, unknown>): Record<string, unknown> {
  for (const k in value) {
    if (Object.prototype.hasOwnProperty.call(value, k)) {
      if (value[k] === NULL) {
        value[k] = null;
        continue;
      }
      if (typeof value[k] === 'object') {
        if (Array.isArray(value[k])) {
          walkArray(value[k] as unknown[]);
          continue;
        }
        walkObject(value[k] as Record<string, unknown>);
      }
    }
  }

  return value;
}

@Injectable()
export class NullPipe implements PipeTransform {
  public transform(value: unknown) {
    return walkArray([value])[0];
  }
}
