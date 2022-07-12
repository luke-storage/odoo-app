import { Routes } from "@angular/router";
import { AuthPage } from "./auth.page";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '', component: AuthPage, children:[
    { path: 'login', component: LoginComponent }
  ]},
  
 
];