import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITour } from '../models/tour';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private readonly basketKey = 'basket';
  private basketStore: ITour[] = this.loadFromStore();

  private basketSubject = new BehaviorSubject(this.basketStore);
  basketStore$ = this.basketSubject.asObservable();

  constructor() {}

  private loadFromStore(): ITour[] {
    try {
      const raw = localStorage.getItem(this.basketKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      localStorage.removeItem(this.basketKey);
      return [];
    }
  }

  private saveToStore(): void {
    localStorage.setItem(this.basketKey, JSON.stringify(this.basketStore));
  }

  setItemToBasket(item: ITour): void {
    if (this.basketStore.some((tour) => tour.id === item.id)) return; // защита от дублей

    this.basketStore.push(item);
    item.inBasket = true;
    this.saveToStore();
    this.basketSubject.next(this.basketStore);
  }

  removeItemFromBasket(item: ITour): void {
    this.basketStore = this.basketStore.filter((tour) => tour.id !== item.id);
    item.inBasket = false;
    this.saveToStore();
    this.basketSubject.next(this.basketStore);
  }

  clearBasket(): void {
    this.basketStore = [];
    localStorage.removeItem(this.basketKey);
    this.basketSubject.next(this.basketStore);
  }
}