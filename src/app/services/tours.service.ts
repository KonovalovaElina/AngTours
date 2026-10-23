import { inject, Injectable } from "@angular/core";
import { TourApiService } from "./api/tour-api.service";
import { catchError, delay, forkJoin, map, Observable, of, Subject } from "rxjs";
import { ICountriesResponseItem, ITour, IToursServerRes, ITourTypes } from "../models/tour";

@Injectable({
  providedIn: 'root'
})
export class ToursService {
  private toursApi = inject(TourApiService);
  private tourDateSubject = new Subject<ITourTypes>();
  readonly tourDate$ = this.tourDateSubject.asObservable();
  constructor() {}

  getTours(): Observable<ITour[]> {
    const countries$ = this.toursApi.getCountries();
    const tours$ = this.toursApi.getTours();

    return forkJoin<[ICountriesResponseItem[], IToursServerRes]>([countries$, tours$]).pipe(
      delay(1000),

      map((data
        
      ) => {
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
              country: countriesMap.get(tour.code) || null
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
}