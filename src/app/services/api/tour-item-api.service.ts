import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { ITour } from "../../models/tour";

@Injectable({
  providedIn: 'root'
})
export class TourItemApiService {
  private apiUrl = 'http://localhost:3000/tours';
  private http = inject(HttpClient);
  constructor() {}

  getTour(id: string | number) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ITour>(url);
  }
}