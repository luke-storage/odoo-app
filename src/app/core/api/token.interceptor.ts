import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core'; 
import { AuthService } from 'src/app/core/services/auth/auth.service';


@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private authService:AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var cloned = req.clone({
            headers: cloned.headers.set('Content-Type', 'application/json')
        });
        return next.handle(cloned);
    }
}