export interface Controller{
}

export function Controller(controller? : Controller){
    return function (target) {
      Reflect.defineMetadata('Controller', controller, target);
    };
};