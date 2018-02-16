import { Module } from '../metadata/module'
import { Injectable } from '../metadata/injectable';

@Injectable()
export class XService{}

@Injectable()
export class TestService{
    constructor(xservice : XService)
    {}
}

@Module({
    services : [
         XService,
         TestService
    ]
 })
 export class Test3Module{}

 @Module({
    services : [
        { provide : 'test', useValue : 'dsadsadsa'}
    ]
 })
 export class Test4Module{}

@Module({
    imports : [
        Test3Module,
        Test4Module,
    ],
    exports : [
        Test3Module,
        Test4Module,
    ]
 })
 export class Test2Module{}
 

@Module({
    imports : [ Test2Module ],
    exports : [ Test2Module ]
})
export class TestModule{}




 
 
