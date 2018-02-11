import "./polyfill"
import { Injector } from "./di/injector";

export function Injectable()
{
    return (target)=>{
    }
}

@Injectable()
export class Service{
    constructor()
    {   

    }

    sayHi()
    {
        console.log('sayHi from Service');
    }
}

@Injectable()
export class Service2{
    service : Service;
    constructor(public injector : Injector)
    {
        this.service = injector.resolve(Service);
        this.service.sayHi();
    }

    sayHi()
    {
      this.service.sayHi();
      console.log(this.service);
    }
}


let injector = new Injector();
injector.register({ provide : Service , useClass : Service})

let injector2 = injector.create();
injector2.register({ provide : Service2 , useClass : Service2})

let service = injector2.resolve(Service2)
service.sayHi();