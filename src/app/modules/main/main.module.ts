import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { HomeComponent } from './home/home.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentComponent } from './document/document.component';
import { DocumentFilterComponent } from './document-filter/document-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule
  ],
  declarations: [
    MainPage,
    HomeComponent, 
    DocumentListComponent, 
    DocumentComponent,
    DocumentFilterComponent
  ]
})
export class MainPageModule {}
