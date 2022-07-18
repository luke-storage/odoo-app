import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { OdooRPCService } from '../api-odoo/api-odoo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService:OdooRPCService
  ) { }

  auth(db:string, login:string, password:string) {
    return this.apiService.login(db, login, password);
  }

}
