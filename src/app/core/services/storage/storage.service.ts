import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public async setString(key: string, value: string):Promise<any> {
    return Storage.set({key, value});
  }

  public async getString(key: string):Promise<any> {
    return Storage.get({key});
  }

  public async setObject(key: string, value: any):Promise<any> {
    return Storage.set({key, value:JSON.stringify(value)});
  }

  public async getObject(key: string):Promise<any>{
    var data = await Storage.get({key});
    return JSON.parse(data.value);
  }

  public async remove(key:string):Promise<any>{
    return Storage.remove({key});
  }

}
