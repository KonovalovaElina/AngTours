import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IAuthUser, IAuthUserRes, IRegisterUser, IRegUserRes } from "../../models/user";

@Injectable ({
  providedIn: 'root'
})

export class UserApiService {
  private api = API;
  private http = inject(HttpClient);

  constructor() {}

  auth(body: IAuthUser): Observable<IAuthUserRes> {
    return this.http.post<IAuthUserRes>(this.api.auth, body)
  }

  register(body: IRegisterUser): Observable<IRegUserRes> {
    return this.http.post<IRegUserRes>(this.api.register, body);
  }
}