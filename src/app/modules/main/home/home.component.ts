import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OdooRPCService } from 'src/app/core/services/api-odoo/api-odoo.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  data:any;

  constructor(
    private router:Router,
    private service:OdooRPCService
  ) { 
    var data = data = this.router.getCurrentNavigation().extras.state;
    this.data = JSON.stringify(data);
  }

  ngOnInit() {
    
  }

}
