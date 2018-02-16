import { Provider, ClassProvider, FactoryProvider, ValueProvider } from './provider'

export class Injector{

    private records: Map<any, Record> = new Map();

    constructor(providers: Provider[],private parent?: Injector | null)
    {
        this.records.set(Injector, { fn:null, deps: [] , useNew: false , value: this })
        providers.forEach(provider => { this.processProvider(provider)})
    }

    create(providers: Provider[]): Injector{
       return new Injector(providers,this);
    }

    private processProvider(provider: Provider)
    {
        let record: Record|undefined = { fn: null, value: null, deps: [], useNew: false };
        if('provide' in provider){
            if('useValue' in provider)
            {
                record.value = (provider as ValueProvider).useValue;
            }
            else if((provider as ClassProvider).useClass)
            {
                record.useNew = true;
                record.fn = (provider as ClassProvider).useClass;
                record.deps = this.getConstructorParameters((provider as ClassProvider).useClass);
            }
            else if((provider as FactoryProvider).useFactory)
            {
                record.fn = (provider as FactoryProvider).useFactory;
                record.deps = (provider as FactoryProvider).deps.map((token: Provider)=>{
                    return <DependencyRecord>{
                        token: token,
                    }
                })
            }
        }
        else{
            record.useNew = true;
            record.fn = provider as Function;
            record.deps = this.getConstructorParameters(provider);
            this.records.set(provider, record);
        }
    }

    get<T>(token: any): T{
        let  record : Record = this.records.get(token);
        if(!record){
            if(!this.parent){
                throw new Error('No Provider for '+token);
            }
            return this.parent.get(token);
        }

        if(record.value){
            return record.value;
        }

        record.value =  this.resolve(record)

        return record.value as T;
    }

    private resolve(record: Record)
    {
        let deps = (record.deps || []).map( dep => this.get(dep.token))
        if(record.useNew)
        {
            return new (record.fn as any)(...deps)
        }

        if (record.fn && !record.useNew)
        {
            return (record.fn as any)(...deps)
        }
        return record.value;
    }

    private getConstructorParameters(target: any): DependencyRecord[]
    {
        let rawParameters: any[] = Reflect.getOwnMetadata('design:paramtypes', target) || [];
        return this.convertTargetParams(rawParameters)
    }

    private convertTargetParams(rawParameters: any[]): DependencyRecord[]
    {     
        return rawParameters.map((value: any)=>{
            return <DependencyRecord>{
                token: value
            }
        })

    }
}

interface DependencyRecord{
    token: any,
}

interface Record{
    fn: Function;
    useNew: boolean;
    deps: DependencyRecord[]
    value:  any;
}