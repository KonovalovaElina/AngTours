import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { delay, finalize, Observable } from "rxjs";
import { IAuthUser, IAuthUserRes, IRegisterUser, IRegUserRes } from "../../models/user";
import { LoaderService } from "../loader.service";

@Injectable ({
  providedIn: 'root'
})

export class UserApiService {
  private api = API;
  private http = inject(HttpClient);
  private loaderService = inject(LoaderService);

  constructor() {}

  auth(body: IAuthUser): Observable<IAuthUserRes> {
    this.loaderService.setLoader(true);
    return this.http.post<IAuthUserRes>(this.api.auth, body).pipe(
      delay(1000),
      finalize(() => {
        this.loaderService.setLoader(false);
      })
    );
  }

  register(body: IRegisterUser): Observable<IRegUserRes> {
    this.loaderService.setLoader(true);
    return this.http.post<IRegUserRes>(this.api.register, body).pipe(
      delay(1000),
      finalize(() => {
        this.loaderService.setLoader(false);
      })
    );
  }
}