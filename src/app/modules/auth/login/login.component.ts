import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { OdooRPCService } from 'src/app/core/services/api-odoo/api-odoo.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public passwordType: string = "password";
  public passwordIcon: string = "eye-outline";
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loadigCtrl: LoadingController,
    private service: OdooRPCService,
    private navCtrl: NavController,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      db: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  async onSubmit() {
    const loading = await this.loadigCtrl.create({
      message: "Accesso in corso..."
    });
    await loading.present();

    var params = {
      db: this.form.get('db').value,
      login: this.form.get('login').value,
      password: this.form.get('password').value,
      url: this.form.get('url').value
    }

    this.service.init({ odoo_server: environment.url });
    
    this.service.login(params.db, params.login, params.password)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(()=>{
          loading.dismiss();
        })
      )
      .subscribe((data) => {
        this.navCtrl.navigateRoot("main/document-list");
    });
  }

  togglePasswordInputType(): void {
    if (this.passwordType == "password") {
      this.passwordType = "text";
      this.passwordIcon = "eye-off-outline";
    } else {
      this.passwordIcon = "eye-outline";
      this.passwordType = "password";
    }
  }



}


