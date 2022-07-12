import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AuthParamsInterface } from 'src/app/interface/auth.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public passwordType: string = "password";
  public passwordIcon: string = "eye-outline";

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private loadigCtrl:LoadingController,
    private navCtrl:NavController,
    private alertCtrl:AlertController
  ) { 
    this.form = this.fb.group({
      login:     ['', Validators.required],
      password: ['', Validators.required],
      db:      ['', Validators.required]
    });
  }

  ngOnInit():void {
   
  }

  ngOnDestroy(): void {

  }

  async onSubmit(){
    const loading = await this.loadigCtrl.create({
      message: "Accesso in corso..."
    });
    await loading.present();


    var params:AuthParamsInterface = {
      db: this.form.get('db').value,
      login: this.form.get('login').value,
      password: this.form.get('password').value
    }

    this.authService.auth(params)
    .pipe(
      finalize(()=>{
        loading.dismiss();
      })
    )
    .subscribe(async (data:any)=>{
      if(data.error){
        const alert = await this.alertCtrl.create({
          header: "Attenzione",
          message: "Credenziali errate o server non raggiungibile.",
          buttons: ["OK"]
        });
        await alert.present();
      }else{
        this.navCtrl.navigateRoot("home", {state: data});
      }
    });
  }

  togglePasswordInputType():void{
    if (this.passwordType == "password") {
      this.passwordType = "text";
      this.passwordIcon = "eye-off-outline";
    } else {
      this.passwordIcon = "eye-outline";
      this.passwordType = "password";
    }
  }



}


