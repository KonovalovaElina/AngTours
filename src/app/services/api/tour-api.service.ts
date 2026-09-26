import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { ITour } from "../../models/tour";

@Injectable({
  providedIn: 'root'
})
export class TourApiService {
  private api = API;
  private http = inject(HttpClient);
  constructor() {}

  getTours() {
    return this.http.get<ITour>(`${this.api.tours}`);
  }
}