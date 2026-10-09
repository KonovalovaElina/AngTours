import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { ITour } from "../../models/tour";
import { LoaderService } from "../loader.service";
import { delay, finalize } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TourApiService {
  private api = API;
  private http = inject(HttpClient);
  private loaderService = inject(LoaderService);
  constructor() {}

  getTours() {
    this.loaderService.setLoader(true);
    return this.http.get<ITour>(`${this.api.tours}`).pipe(
      delay(3000),
      finalize(() => {
        this.loaderService.setLoader(false);
      })
    );
  }
}