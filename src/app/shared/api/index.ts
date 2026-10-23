import { InjectionToken } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IConfig } from "../../models/config";

export const apiData = {
  auth: `${environment.server}/auth`,
  register: `${environment.server}/register`,
  tours: `${environment.server}/tours`,
  tourItemBase: `${environment.server}/tour`,
  countries: `${environment.server}/countries`,
  countryByCode: 'https://restcountries.com/v3.1/alpha',
  getWeather: 'https://api.open-meteo.com/v1/forecast',
} as const;

export const API = new InjectionToken<IConfig>('app.config', {
  providedIn: 'root',
  factory: () => apiData
});