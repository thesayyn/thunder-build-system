import { Provider } from "../di/provider";
import { Type } from "../di/type";

export interface Module{
    id? : string
    imports?: Array<Type<any>|any[]>;
    exports?: Array<Type<any>|any[]>;
    declarations?: Array<Type<any>|any[]>;
    services?: Provider[];
}



export function Module(module : Module){
    return function (target) {
      Reflect.defineMetadata('module', module, target);
    };
};