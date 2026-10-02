import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { ITour } from "../../models/tour";

@Injectable({
  providedIn: 'root'
})
export class TourItemApiService {
  private api = API;
  private http = inject(HttpClient);
  constructor() {}

  getTour(id: string | number) {
    const url = `${this.api.tourItemBase}/${id}`;
    return this.http.get<ITour>(url);
  }
}