import { Type } from "../util/type";
export declare function propObject<T>(entity: Type<T>): (target: Object, propertyKey: string, parameterIndex?: any) => void;
