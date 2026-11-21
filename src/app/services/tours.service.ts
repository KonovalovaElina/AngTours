import { inject, Injectable } from "@angular/core";
import { TourApiService } from "./api/tour-api.service";
import { BehaviorSubject, catchError, delay, forkJoin, map, Observable, of, Subject, withLatestFrom } from "rxjs";
import { ICountriesResponseItem, ITour, ITourRes, ITourTypes } from "../models/tour";
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
  private apiUrl = 'http://localhost:3000/tours/';
  private tourUpdateSubject = new BehaviorSubject<ITour[]>([]);
  readonly tourUpdateSubject$ = this.tourUpdateSubject.asObservable();

  constructor(
    private toursApi: TourApiService,
    private http: HttpClient,
    private basketService: BasketService
  ) {}

  updateToursList(data: ITour[]) {
    this.tourUpdateSubject.next(data);
  }
  
  getTours(): Observable<ITour[]> {
    const countries$ = this.toursApi.getCountries();
    const tours$ = this.toursApi.getTours();

    return forkJoin<[ICountriesResponseItem[], ITour[]]>([countries$, tours$]).pipe(
      delay(1000),
      withLatestFrom(this.basketService.basketStore$),
      map(([data, basketData]) => {
        console.log('data', data);

        const toursArr = data[1];
        const countriesMap = new Map<string, ICountriesResponseItem>();

        data[0].forEach((country) => {
          countriesMap.set(country.iso_code2, country);
        });

        let toursWithCountries: ITour[] = [];

        if (Array.isArray(toursArr)) {
          toursWithCountries = toursArr.map<ITour>((tour: any) => ({
            ...tour,
            // маппинг идентификатора: монго отдаёт _id, фронт ждёт id
            id: tour._id ?? tour.id,
            country: countriesMap.get(tour.code) || null,
            inBasket: basketData.some((basketTour) => basketTour.id === (tour._id ?? tour.id)),
          }));
        }

        console.log('toursWithCountries', toursWithCountries);
        return toursWithCountries;
      }),
      catchError((err) => {
        console.log('err', err);
        return of([] as ITour[]);
      })
    );
  }

  getCountryByCode(code: string) {
    return this.toursApi.getCountryByCode(code);
  }

  createTour(formData: FormData): Observable<ITourRes> {
    return this.http.post<ITourRes>(this.apiUrl, formData);
  }
}