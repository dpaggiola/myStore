import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {User, CreateUserDTO} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl: string = `${environment.API_URL}/api/users`;

  constructor(private httpClient: HttpClient) { }

  create(dto: CreateUserDTO) {
    return this.httpClient.post<User>(this.apiUrl, dto);
  }

  getAll() {
    return this.httpClient.get<User[]>(this.apiUrl);
  }

}
