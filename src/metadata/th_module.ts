import { Provider } from "../di/provider";

export interface ThModule{
    id? : string
    imports?: any[];
    exports?: any[];
    declarations?: any[];
    providers?: Provider[];
}



export function thModule(thModule : ThModule){
    return function (target) {
      Reflect.defineMetadata('thModule', thModule, target);
      console.log(thModule.imports);
    };
};