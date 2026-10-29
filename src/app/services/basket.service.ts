import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ITour } from "../models/tour";

@Injectable({
  providedIn: 'root'
})

export class BasketService {
  private basketStore: ITour[] = [];
  private basketSubject = new BehaviorSubject(this.basketStore);
  basketStore$ = this.basketSubject.asObservable();

  readonly instanceId = Math.random().toString(36).slice(2, 8);

  constructor() {
    console.log('BasketService создан, instance id:', this.instanceId);
  }

  setItemToBasket(item: ITour): void {
    this.basketStore.push(item);
    item.inBasket = true;
    console.log('addItem called, instance id:', Math.random());
    this.basketSubject.next(this.basketStore);
  }

  removeItemFromBasket(item: ITour): void {
    this.basketStore = this.basketStore.filter((tour) => tour !== item);
    item.inBasket = false;
    this.basketSubject.next(this.basketStore);
  }
}