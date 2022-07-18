import { Injectable } from '@angular/core';
import { OdooRPCService } from '../api-odoo/api-odoo.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  params

  constructor(
    private apiService:OdooRPCService
  ) { }

  getList(domain = []) {
    return this.apiService.searchRead(
      "mrp.workorder",
      domain,
      [],
      80, 
      //1,
      {
        "lang": "it_IT",
        "tz": "Europe/Rome",
        "uid": 2
    }
    );
  }

}
