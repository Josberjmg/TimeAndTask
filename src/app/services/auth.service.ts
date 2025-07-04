import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ResponseSignIn } from '../interfaces/response-sign-in.interface';
import { SignUp } from '../interfaces/sign-up.interface';
import { IUser } from '../interfaces/user.entity';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) { }

  get getToken() {
    return localStorage.getItem("token") ?? "";
  }
  get headers() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken}`
    });

    let options = { headers: headers };

    return options
  }

  signIn(email: string, password: string): Observable<ResponseSignIn> {
    return this.http.post<ResponseSignIn>(`${this.url}/sign-in`, { email, password }).pipe(
      tap((user) => [
        localStorage.setItem("token", user.token)
      ])
    )
  }

  signUp(userData: SignUp): Observable<IUser> {
    return this.http.post<IUser>(`${this.url}/sign-up`, userData)
  }
}
