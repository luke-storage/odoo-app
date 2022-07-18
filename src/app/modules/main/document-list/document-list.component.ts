import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProductionService } from 'src/app/core/services/production/production.service';
import { ProductionItemInterface } from 'src/app/interfaces/production-item.interface';
import { DocumentFilterComponent } from '../document-filter/document-filter.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {

  public productionItems:ProductionItemInterface[] = [];
  public filterData

  constructor(
    private productionService:ProductionService,
    private modalCtrl:ModalController
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(domain = []){
    this.productionService.getList(domain).subscribe((data)=>{
      this.productionItems = data.records;
    });
  }



  async openFilterModal(){
    const modal = await this.modalCtrl.create({
      component: DocumentFilterComponent,
      componentProps:{
        filterData: this.filterData
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();

    if(data){
      this.getData(data)
    }
  }

}
