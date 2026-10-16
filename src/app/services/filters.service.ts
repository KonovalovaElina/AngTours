import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FiltersState {
  searchText?: string;
  tourType?: string | null;
  tourDate?: Date | null;
}

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private stateSubject = new BehaviorSubject<FiltersState>({
    searchText: null,
    tourType: null,
    tourDate: null
  });

  state$ = this.stateSubject.asObservable();

  update(partial: Partial<FiltersState>) {
    const current = this.stateSubject.value;
    this.stateSubject.next({ ...current, ...partial });
  }

  reset() {
    this.stateSubject.next({
      searchText: null,
      tourType: null,
      tourDate: null
    });
  }
}