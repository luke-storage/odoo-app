import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

class Cookies {
  // cookies doesn't work with Android default browser / Ionic

  private session_id: string | null = null;

  delete_sessionId(): void {
    this.session_id = null;
    document.cookie = 'session_id=; expires=Wed, 29 Jun 2016 00:00:00 UTC';
  }

  get_sessionId(): string {
    return (
      document.cookie
        .split('; ')
        .filter((x) => {
          return x.indexOf('session_id') === 0;
        })
        .map((x) => {
          return x.split('=')[1];
        })
        .pop() ||
      this.session_id ||
      ''
    );
  }

  set_sessionId(val: string): void {
    document.cookie = `session_id=${val}`;
    this.session_id = val;
  }
}

class ParamsCall {
  public args?: any;
  public kwargs?: any;
  public method?: string;
  public model?: string;
  public domain?: (string | string[])[];
  public fields?: string[];
  public limit?: number;
  public offset?: number;
  public context?: any;
}

class ParamsLogin {
  public db?: string;
  public login?: string;
  public password?: string;
}
class ParamsEmpty {}

type Params = ParamsCall | ParamsLogin | ParamsEmpty;

class ErrorObj extends Error {
  public override name = 'errorObj';
  public title?: string;

  constructor(message: string, title?: string) {
    super();
    this.title = title;
    this.message = message;
  }

  public override toString(): string {
    return 'Title: ' + this.title + '; Message: ' + this.message;
  }
}

class Configs {
  public odoo_server?: string;
  public http_auth?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OdooRPCService {
  private odoo_server: string = environment.url;
  private http_auth: string | null = null;
  private cookies: Cookies;
  private uniq_id_counter = 0;
  private shouldManageSessionId = false; // try without first
  private context: any = JSON.parse(
    localStorage.getItem('user_context') ?? 'null'
  ) || { lang: 'en_US' };
  private headers: HttpHeaders | null = null;

  constructor(@Inject(HttpClient) private http: HttpClient) {
    this.cookies = new Cookies();
  }

  private buildRequest(params: any) {
    this.uniq_id_counter += 1;
    if (this.shouldManageSessionId) {
      params.session_id = this.cookies.get_sessionId();
    }
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Openerp-Session-Id': "ee09eca22dd0f4113bce29ffd97b9c6c9c9a55cf",
      Authorization: 'Basic ' + btoa(`${this.http_auth}`),
    });
    return JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: params, // payload
    });
  }

  private handleOdooErrors(response: any) {
    console.log(response);
    if (!response.error) return response.result;
    const error = response.error;
    const errorObj = new ErrorObj('', '    ');
    if (
      error.code === 200 &&
      error.message === 'Odoo Server Error' &&
      error.data.name === 'werkzeug.exceptions.NotFound'
    ) {
      errorObj.title = 'page_not_found';
      errorObj.message = 'HTTP Error';
    } else if (
      (error.code === 100 && error.message === 'Odoo Session Expired') || // v8
      (error.code === 300 &&
        error.message === 'OpenERP WebClient Error' &&
        error.data.debug.match('SessionExpiredException')) // v7
    ) {
      errorObj.title = 'session_expired';
      this.cookies.delete_sessionId();
    } else if (
      error.message === 'Odoo Server Error' &&
      RegExp('/FATAL: {2}database "(.+)" does not exist/').test(
        error.data.message
      )
    ) {
      errorObj.title = 'database_not_found';
      errorObj.message = error.data.message;
    } else if (error.data.name === 'openerp.exceptions.AccessError') {
      errorObj.title = 'AccessError';
      errorObj.message = error.data.message;
    } else {
      const split = ('' + error.data.fault_code).split('\n')[0].split(' -- ');
      if (split.length > 1) {
        error.type = split.shift();
        error.data.fault_code = error.data.fault_code.substr(
          error.type.length + 4
        );
      }
      if (error.code === 200 && error.type) {
        errorObj.title = error.type;
        errorObj.message = error.data.fault_code.replace(/\n/g, '<br />');
      } else {
        errorObj.title = error.message;
        errorObj.message = error.data.debug.replace(/\n/g, '<br />');
      }
    }
    throw new Error(errorObj.toString());
  }

  public init(configs: Configs): void {
    this.odoo_server = configs.odoo_server || '';
    this.http_auth = configs.http_auth || null;
  }

  public sendRequest(url: string, params: Params): Observable<any> {
    const body = this.buildRequest(params);
    return this.http
      .post(this.odoo_server + url, body, {
        headers: this.headers ?? undefined,
      })
      .pipe(map(this.handleOdooErrors));
  }

  public getServerInfo(): Observable<any> {
    return this.sendRequest('/web/webclient/version_info', {});
  }

  public getSessionInfo(): Observable<any> {
    return this.sendRequest('/web/session/get_session_info', {});
  }

  public login(db: string, login: string, password: string): Observable<any> {
    const params: ParamsLogin = {
      db: db,
      login: login,
      password: password,
    };
    return this.sendRequest('/web/session/authenticate', params).pipe(
      map((result: any) => {
        if (!result.uid) {
          this.cookies.delete_sessionId();
          throw new Error("Username and password don't match");
        }
        this.context = result.user_context;
        localStorage.setItem('user_context', JSON.stringify(this.context));
        console.log(result)
        //this.cookies.set_sessionId(result.session_id);
        //console.log(result.cookies["session_id"]);
        console.log(document.cookie);
        return result;
      })
    );
  }

  public isLoggedIn(force = true): Observable<boolean> {
    if (!force) {
      return of(this.cookies.get_sessionId().length > 0);
    }
    return this.getSessionInfo().pipe(
      map((result) => {
        this.cookies.set_sessionId(result.session_id);
        return !!result.uid;
      })
    );
  }

  public logout(force = true): Observable<any> {
    this.cookies.delete_sessionId();
    if (force) {
      return this.getSessionInfo().pipe(
        mergeMap((r) => {
          if (r.db) {
            return this.login(r.db, '', '');
          }
          return of(null);
        })
      );
    } else {
      return of([]);
    }
  }

  public searchRead(
    model: string,
    domain: (string | string[])[],
    fields: string[] = [],
    limit: number,
    context: any = {}
  ): Observable<any> {
    const params: ParamsCall = {
      model: model,
      domain: domain,
      fields: fields,
      limit: limit,
      context: context || this.context,
    };
    return this.sendRequest('/web/dataset/search_read', params);
  }

  public updateContext(context: any): void {
    this.context = context;
    localStorage.setItem('user_context', JSON.stringify(context));
    const args = [[(<any>this.context).uid], context];
    this.call('res.users', 'write', args, {});
  }

  public getContext(): any {
    return this.context;
  }

  public getServer(): string {
    return this.odoo_server;
  }

  public call(
    model: string,
    method: string,
    args: any,
    kwargs: any
  ): Observable<any> {
    kwargs = kwargs || {};
    kwargs.context = kwargs.context || {};
    (<any>Object).assign(kwargs.context, this.context);

    const params: ParamsCall = {
      model: model,
      method: method,
      args: args,
      kwargs: kwargs,
    };
    return this.sendRequest('/web/dataset/call_kw', params);
  }
}
