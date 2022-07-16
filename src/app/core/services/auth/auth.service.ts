import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInterface } from 'src/app/interface/auth.interface';
import { environment } from 'src/environments/environment';
import { AuthParamsInterface } from 'src/app/interface/auth-params.interface';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  auth(params:AuthParamsInterface) {
    var data:AuthInterface = {
      jsonrpc: "2.0",
      params: params
    }

    return this.httpClient.post(
      environment.url + "session/authenticate",
      data,
    )
    .pipe(
      map((response:any)=>{
        if(response.error){
          throw new Error();
        }else
          return response;
      })
    );
  }

}
