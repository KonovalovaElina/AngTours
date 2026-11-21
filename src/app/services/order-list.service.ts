import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IOrder, IOrderResp, IOrdersResponse } from "../models/order";

@Injectable({providedIn: 'root'})
export class OrderListService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  getOrders(page = 1, limit = 20): Observable<IOrdersResponse> {
    return this.http.get<IOrdersResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  postOrder(orderBody: IOrder): Observable<IOrderResp> {
    return this.http.post<IOrderResp>(this.apiUrl, orderBody);
  }
}