import { exec } from 'child_process'

let path = 'C:/Users/scope/Documents/angular_projects/angular4-test';

exec('cd "'+path+'" && ng build --prod --aot', (error : Error, output : string , err : string) => {
    console.log(error, output);
});