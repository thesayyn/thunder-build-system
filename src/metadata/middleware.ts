export interface Middleware{
}


export function Middleware(middleware? : Middleware){
    return function (target) {
      Reflect.defineMetadata('Middleware', middleware, target);
    };
};

export interface CanDeactivate{
  canDeactivate(): boolean | Promise<boolean>
}

export interface CanActivate{
  canActivate(): boolean | Promise<boolean>
}