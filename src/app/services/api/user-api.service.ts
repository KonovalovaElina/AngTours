import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IAuthorization } from "../../models/authorization";
import { IRegistration } from "../../models/registration";

@Injectable ({
  providedIn: 'root'
})

export class UserApiService {
  private api = API;
  private http = inject(HttpClient);

  constructor() {}

  auth(body: IAuthorization): Observable<IAuthorization> {
    return this.http.post<IAuthorization>(this.api.auth, body)
  }

  register(body: IRegistration): Observable<IRegistration> {
    return this.http.post<IRegistration>(this.api.register, body);
  }
}