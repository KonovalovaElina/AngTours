export type ITourTypes = 'all' | 'single' | 'multi';
export interface ITour {
  id: string;
  name: string;
  description: string;
  tourOperator: string;
  price: string;
  img: string;
  type?: string;
  date?: string;
  locationId?: string;
  country?: ICountriesResponseItem;
  code?: string;
  inBasket?: boolean;
}

export interface IToursServerRes {
  tours: Omit<ITour, 'country' | 'inBasket'>[];
}

export interface ICountriesResponseItem {
  iso_code2: string;
  iso_code3: string;
  name_ru: string;
  flag_url: string;
}

export interface ILocation {
  lat: number;
  lng: number;
}

export type Coords = {
  latlng: [number, number]
}

export interface IWeatherData {
  isDay: number;
  snowfall: number;
  rain: number;
  currentWeather: number;
}

export interface ICountryWeather {
  countryData: Coords;
  weatherData: IWeatherData;
}
