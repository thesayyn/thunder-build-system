import { Provider } from './provider'

export class Injector{

    private records : Map<any, Record> = new Map();

    constructor(public parent? : Injector | null)
    {
        this.records.set(Injector, { useValue : true , instance : this })
    }

    create(){
       return new Injector(this);
    }

    register(provider : Provider)
    {
        let record : Record = {  };
        if(provider.useValue)
        {
            record.useValue = true;
            record.instance = provider.useValue;
        }
        else if(provider.useClass)
        {
            record.useNew = true;
            record.instance = provider.useClass;
            record.parameters = this.getConstructorParameters(provider.useClass);
        }
        else if(provider.useFactory)
        {
            record.instance = provider.useFactory;
            record.parameters = (provider.deps as Provider[]).map((provider : Provider , index : number)=>{
                return <TargetParameter>{
                    provider : provider,
                    index : index
                }
            })
        }
        this.records.set(provider.provide, record);
    }

    resolve(provider : any) : any{
      return this.resolveInternal(provider, this);
    }

    resolveInternal(provider : any, injector : Injector) : any{
        let _ : Record = this.records.get(provider);
        if(!_){
            if(!this.parent){
                throw new Error('No Provider for '+provider);
            }
            return this.parent.resolveInternal(provider, injector);
        }

        if(_.resolved){
            return _.instance;
        }

        
        _.instance =  this.instantiate(_,injector)
        _.resolved = true;
        this.records.set(provider, _);
        return _.instance;
    }

    instantiate(record : Record, injector : Injector)
    {
        let params = (record.parameters || []).map( parameter => this.resolveInternal(parameter.provider, injector))
        if(record.useNew)
        {
            return new record.instance(...params)
        }
        if(record.useValue)
        {
            return record.instance;
        }
        return record.instance(...params);
    }

    getConstructorParameters(target : any) : TargetParameter[]
    {
        let rawParameters : any[] = Reflect.getOwnMetadata('design:paramtypes', target) || [];
        return this.convertTargetParams(rawParameters)
    }

    convertTargetParams(rawParameters : any[]) : TargetParameter[]
    {     
        return rawParameters.map((value : any, index: number)=>{
            return <TargetParameter>{
                provider : value,
                index : index
            }
        })

    }
}

interface TargetParameter{
    provider : Provider,
    index : number;
}

interface Record{
    instance? : any;
    useNew? : boolean;
    useValue? : boolean;
    parameters? : TargetParameter[]
    resolved? : boolean;
}