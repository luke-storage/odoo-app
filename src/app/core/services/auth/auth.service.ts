import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInterface, AuthParamsInterface } from 'src/app/interface/auth.interface';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private alertCtrl: AlertController
  ) { }

  

  auth(params:AuthParamsInterface) {
    var data:AuthInterface = {
      jsonrpc: "2.0",
      params: params
    }

    return this.httpClient.post(
      "http://localhost:8080/http://localhost:8069/web/session/authenticate",
      data,
    );
  }

}
