import { inject, Injectable } from "@angular/core";
import { TourItemApiService } from "./api/tour-item-api.service";

@Injectable({
  providedIn: 'root'
})
export class TourItemService {
  private tourApi = inject(TourItemApiService);
  constructor() {}

  getTour(id: string | number) {
    return this.tourApi.getTour(id);
  }
}