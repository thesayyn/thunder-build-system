import { InjectionToken } from "./injection_token";

export interface Provider {
    provide: InjectionToken<any> | any;
    useClass?: ConstructorFn;
    useValue?: any;
    useFactory?: any;
    deps?: Provider[] | any;
}


export interface ConstructorFn{
    new (...args: any[]): any;
}