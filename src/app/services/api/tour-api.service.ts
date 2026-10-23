import { inject, Injectable } from "@angular/core";
import { API } from "../../shared/api";
import { HttpClient } from "@angular/common/http";
import { Coords, ICountriesResponseItem, ICountryWeather, ITour, IToursServerRes } from "../../models/tour";
import { LoaderService } from "../loader.service";
import { catchError, delay, finalize, map, Observable, of, switchMap } from "rxjs";
import { MapService } from "../map.service";

@Injectable({
  providedIn: 'root'
})
export class TourApiService {
  private api = inject(API);
  private http = inject(HttpClient);
  private loaderService = inject(LoaderService);
  private mapService = inject(MapService);

  private readonly mockCodes = [
    "MX", "IT", "EG", "PH", "TZ", "US", "ID", "LK", "PE", "JP"
  ] as const;

  constructor() {}

  getTours(): Observable<IToursServerRes> {
    this.loaderService.setLoader(true);
    return this.http.get<IToursServerRes>(`${this.api.tours}`).pipe(
      delay(3000),
      finalize(() => {
        this.loaderService.setLoader(false);
      })
    );
  }

  getCountries(): Observable<ICountriesResponseItem[]> {
    this.loaderService.setLoader(true);
    return this.http.get<ICountriesResponseItem[]>(`${this.api.countries}`).pipe(
      catchError(() => of([])),
      delay(2000),
      finalize(() => {
        this.loaderService.setLoader(false);
      })
    );
  }

  getCountryByCode(code: string): Observable<ICountryWeather> {
    if (this.mockCodes.includes(code as any)) {
      return of(this.createMockCountryWeather(code)).pipe(delay(100));
    }

    return this.http.get<Coords[]>(this.api.countryByCode, {params:{codes:code}}).pipe(

      map((countryDataArr) => countryDataArr[0]),
      switchMap((countryData) => {
        console.log('countryData', countryData);
        
        const coords = {lat: countryData.latlng[0], lng: countryData.latlng[1]};

        return this.mapService.getWeather(coords).pipe(
          map((weatherResponse) => {
            const current = weatherResponse.current;
            const hourly = weatherResponse.hourly;

            const weatherData = {
              isDay: current.is_day,
              snowfall: current.snowfall,
              rain: current.rain,
              currentWeather: hourly.temperature_2m[15]
            };

            console.log('weatherData', weatherData)
            return {countryData, weatherData};
          })
        )
      }),
    )
  }

  private createMockCountryWeather(code: string): ICountryWeather {
    const mocks: Record<string, Coords> = {
      MX: { latlng: [19.4326, -99.1332] }, // Мехико
      IT: { latlng: [41.9028, 12.4964] },   // Рим
      EG: { latlng: [30.0444, 31.2357] },   // Каир
      PH: { latlng: [14.5995, 120.9842] },  // Манила
      TZ: { latlng: [-3.3869, 36.6828] },   // Аруша (рядом с Килиманджаро)
      US: { latlng: [36.1699, -115.1398] }, // Лас-Вегас
      ID: { latlng: [-8.5476, 115.2691] },  // Бали
      LK: { latlng: [6.9271, 79.8612] },    // Коломбо
      PE: { latlng: [-13.5319, -71.9674] }, // Куско
      JP: { latlng: [35.6762, 139.6503] }   // Токио
    };

    const countryData = mocks[code] || { latlng: [0, 0] };

    // Генерируем погоду: разные «климаты» по странам
    const baseTempByCountry: Record<string, number> = {
      MX: 24, IT: 22, EG: 32, PH: 30, TZ: 26, US: 20, ID: 28, LK: 29, PE: 18, JP: 16
    };
    const baseTemp = baseTempByCountry[code] ?? 20;

    const randomOffset = Math.floor(Math.random() * 10) - 5; // -5…+5
    const randomTemp = baseTemp + randomOffset;

    const isRain = Math.random() > 0.7 ? 1 : 0;
    const isSnow = Math.random() > 0.9 ? 1 : 0;
    const isDay = Math.random() > 0.3 ? 1 : 0;

    const hourlyTemps: number[] = [];
    for (let i = 0; i < 24; i++) {
      // Плавное изменение температуры в течение суток
      hourlyTemps.push(randomTemp + (i - 12) * 0.6);
    }

    return {
      countryData,
      weatherData: {
        isDay,
        snowfall: isSnow,
        rain: isRain,
        currentWeather: hourlyTemps[15]
      }
    };
  }
}