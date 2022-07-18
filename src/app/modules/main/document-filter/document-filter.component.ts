import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DocumentStateEnum } from 'src/app/enums/document-state.enum';
import { DocumentFilterInterface } from 'src/app/interfaces/document-filter.interface';

@Component({
  selector: 'app-document-filter',
  templateUrl: './document-filter.component.html',
  styleUrls: ['./document-filter.component.scss'],
})
export class DocumentFilterComponent implements OnInit {

  public filterData:DocumentFilterInterface;
  public states: typeof DocumentStateEnum = DocumentStateEnum;

  constructor(
    private modalCtrl:ModalController
  ) { }

  ngOnInit() {

  }

  filter(data){
    var value = data.detail.value;
    var res = [];

    if(value){
      for(let i = 1; i < value.length; i++){
        res.push(
          "|"
        );
      }
    }

    value?.forEach(element => {
      res.push(
        ["state", "=", element]
      );
    });

    this.modalCtrl.dismiss(res);
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

}
