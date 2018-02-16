import './polyfill';
import { TestModule, XService } from "./testmodule/module";
import { Injector } from './di/injector';
import { Module } from './metadata/module';

class Platform{

    _registeredProviders = [];

    bootstrapModule(module : any){

        this.compileModule(module);
      
    }


    private compileModule(module : Module)
    {   
        this._getModuleExportedInjectables(module);
        console.log(this._registeredProviders);
    }


    private _getModuleExportedInjectables(module : any)
    {
        let metadata = this._getModuleMetadata(module)

        if(metadata.services && metadata.services.length > 0){
            this._registeredProviders.push(...metadata.services);
        }
        
        module._injector = new Injector([...(metadata.services || []),...(metadata.declarations || [])]);

        
        let exports = (metadata.exports || []).map(module => {
            return this._getModuleExportedInjectables(module)
        });
        

        let injectables = [];
        let imported = [];

        if(exports.length > 0)
        {
            injectables.push(...exports);
        }

        if((metadata.services || [] ).length > 0)
        {
            injectables.push(...metadata.services);
        }
        
    
        
        return [].concat(...injectables);
    }

    private _getModuleMetadata(module : any) : Module
    {
        return Reflect.getMetadata('module', module) as Module;
    }
}

let platform = new Platform();
platform.bootstrapModule(TestModule)

