import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {environment} from "../../environments/environment";
import {Auth} from "../models/auth.model";
import {User} from "../models/user.model";
import {TokensService} from "./tokens.service";
import {switchMap, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl: string = `${environment.API_URL}/api/auth`;

  constructor(private httpClient: HttpClient, private tokenService: TokensService) {
  }

  login(email: string, password: string) {
    return this.httpClient.post<Auth>(`${this.apiUrl}/login`, {email, password})
      .pipe(
        tap(response => this.tokenService.saveToken(response.access_token))
      );
  }

  getProfile() {
    //const headers = new HttpHeaders();
    //headers.set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<User>(`${this.apiUrl}/profile`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   //'Content-type': 'application/json'
      // }
    });
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
      .pipe(
        switchMap(() => this.getProfile())
      );
  }

}
