import { inject, Injectable } from "@angular/core";
import { API } from "../shared/api";
import { HttpClient } from "@angular/common/http";
import { ILocation } from "../models/tour";
import { Observable } from "rxjs";
import { IWeatherResponse } from "../models/map";

@Injectable({
  providedIn: 'root'
})

export class MapService {
  api = inject(API);

  constructor(private http: HttpClient) {}

  getWeather(coord: ILocation): Observable<IWeatherResponse> {
    const params = {
      "latitude": coord.lat,
      "longitude": coord.lng,
      "hourly": "temperature_2m",
      "current": ["is_day", "snowfall", "rain"],
      "forecast_days": 1
    };

    return this.http.get<IWeatherResponse>(this.api.getWeather,{params})
  }
}