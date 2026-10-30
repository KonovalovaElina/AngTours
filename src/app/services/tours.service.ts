import { inject, Injectable } from "@angular/core";
import { TourApiService } from "./api/tour-api.service";
import { catchError, delay, forkJoin, map, Observable, of, Subject, withLatestFrom } from "rxjs";
import { ICountriesResponseItem, ITour, IToursServerRes, ITourTypes } from "../models/tour";
import { IOrder, IOrderResp } from "../models/order";
import { API } from "../shared/api";
import { HttpClient } from "@angular/common/http";
import { IConfig } from "../models/config";
import { BasketService } from "./basket.service";

@Injectable({
  providedIn: 'root'
})
export class ToursService {
  private tourDateSubject = new Subject<ITourTypes>();
  readonly tourDate$ = this.tourDateSubject.asObservable();
  private api = inject<IConfig>(API);
  constructor(
    private toursApi: TourApiService,
    private http: HttpClient,
    private basketService: BasketService
  ) {}

  getTours(): Observable<ITour[]> {
    const countries$ = this.toursApi.getCountries();
    const tours$ = this.toursApi.getTours();

    return forkJoin<[ICountriesResponseItem[], IToursServerRes]>([countries$, tours$]).pipe(
      delay(1000),
      withLatestFrom(this.basketService.basketStore$),
      map(([data, basketData]) => {
        console.log('data', data);

        let toursWithCountries = [] as ITour[];

        const toursArr = data[1].tours;
        const countriesMap = new Map();

        data[0].forEach(country => {
          countriesMap.set(country.iso_code2, country);
        });

        if (Array.isArray(toursArr)) {
          toursWithCountries = toursArr.map<ITour>((tour) => {
            return {
              ...tour,
              country: countriesMap.get(tour.code) || null,
              inBasket: basketData.some((basketTour) => basketTour.id === tour.id),
            }
          });
        }
        console.log('toursWithCountries', toursWithCountries)
        return toursWithCountries
      }),

      catchError((err) => {
        console.log('err', err);
        return of([]);
      })
    )
  }

  getCountryByCode(code: string) {
    return this.toursApi.getCountryByCode(code);
  }

  postOrder(orderBody: IOrder): Observable<IOrderResp> {
    return this.http.post<IOrderResp>(this.api.order, orderBody);
  }
}