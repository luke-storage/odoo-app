import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentComponent } from './document/document.component';
import { HomeComponent } from './home/home.component';

import { MainPage } from './main.page';

const routes: Routes = [
  { path: '', component: MainPage, children: [
    { path: 'home', component: HomeComponent },
    { path: 'document-list', component: DocumentListComponent },
    { path: 'document', component: DocumentComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
