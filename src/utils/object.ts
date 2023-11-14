import { Prettify } from "@/types";

export const pick = <T, SelectedKeys extends (keyof T)[]>(obj: T, keys: SelectedKeys): Pick<T, SelectedKeys[number]> => {
  const newObj = {} as T;
  keys.forEach(key => {
    newObj[key] = obj[key];
  })
  return newObj
}

export const omit = <T extends Object, SelectedKeys extends (keyof T)[]>(obj: T, keys: SelectedKeys): Omit<T, SelectedKeys[number]> => {
  const newObj = {} as T;
  Object.keys(obj).forEach(_key => {
    const key = _key as keyof T;
    if(!keys.includes(key)) {
      newObj[key] = obj[key];
    }
  })
  return newObj
}
