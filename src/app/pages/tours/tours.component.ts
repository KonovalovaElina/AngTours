import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ITour } from '../../models/tour';
import { FiltersService, FiltersState } from '../../services/filters.service';
import { HighlightActiveDirective } from '../../shared/directives/highlight-active.directive';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// RxJS
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tours',
  imports: [
    MatCardModule,
    CommonModule,
    MatButtonModule,
    HighlightActiveDirective,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToursComponent implements OnInit, AfterViewInit {
  private toursService = inject(ToursService);
  private filtersService = inject(FiltersService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  tours: ITour[] = [];
  toursCopy: ITour[] = [];
  isLoading = true;

  // Фильтры
  currentFilters: FiltersState | null = null;
  
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.toursService.getTours().subscribe((data: any) => {
      this.tours = data.tours;
      this.toursCopy = [...this.tours];
      this.isLoading = false;
      this.applyFilters();
      this.cdr.markForCheck();
    });

    this.filtersService.state$
      .pipe(
        tap(state => console.log('Фильтры изменились:', state)),
        takeUntil(this.destroy$)
      )
      .subscribe((state: FiltersState) => {
        this.currentFilters = state;
        this.applyFilters();
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    if (this.searchInput?.nativeElement) {
      fromEvent(this.searchInput.nativeElement, 'input')
        .pipe(
          debounceTime(300),
          map((ev: Event) => (ev.target as HTMLInputElement).value),
          takeUntil(this.destroy$)
        )
        .subscribe((value: string) => {
          const searchValue = value.trim() === '' ? null : value;
          this.filtersService.update({ searchText: searchValue });
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    if (!this.currentFilters) return; 

    let result = [...this.toursCopy];

    // Поиск по тексту
    if (this.currentFilters.searchText) {
      const regExp = new RegExp(this.currentFilters.searchText, 'i');
      result = result.filter((tour) => tour.name && regExp.test(tour.name));
    }

    // Фильтр по типу
    if (this.currentFilters.tourType) {
      console.log('[Debug] Фильтруем по типу:', this.currentFilters.tourType);
      const typeLower = this.currentFilters.tourType.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.type &&
          tour.type.toLowerCase() === typeLower
      );
    }

    // Фильтр по дате
    if (this.currentFilters.tourDate) {
      const filterDay = this.normalizeDateForFilter(this.currentFilters.tourDate);
      if (!filterDay) {
        console.warn('[Debug] Невалидная дата в фильтре');
        return;
      }

      console.log(
        '[Debug] Фильтр по дате (локальные Y-M-D):',
        `${filterDay.y}-${filterDay.m.toString().padStart(2, '0')}-${filterDay.d.toString().padStart(2, '0')}`
      );

      result = result.filter((tour) => {
        if (!tour.date) return false;
        const tourDay = this.normalizeDateForFilter(tour.date);
        if (!tourDay) return false;

        return (
          tourDay.y === filterDay.y &&
          tourDay.m === filterDay.m &&
          tourDay.d === filterDay.d
        );
      });
    }

    const isAllCleared = (
      !this.currentFilters.searchText && 
      !this.currentFilters.tourType && 
      !this.currentFilters.tourDate
    );

    if (isAllCleared) {
      this.clearSearchInput();
    }

    console.log('[Debug] Результат фильтрации, длина:', result.length);
    this.tours = result;
    this.cdr.markForCheck();
  }

  private normalizeDateForFilter(date: Date | string): { y: number; m: number; d: number } | null {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return null;

    return {
      y: d.getFullYear(),
      m: d.getMonth() + 1,
      d: d.getDate()
    };
  }

  clearSearchInput(): void {
    if (this.searchInput?.nativeElement) {
      const input = this.searchInput.nativeElement;
      if (input.value !== '') {
        input.value = '';
      }
    }
  }

  get hasResults(): boolean {
    return this.tours.length > 0;
  }

  get isEmptyAfterSearch(): boolean {
    // «ничего не нашлось» только если уже загружено и список пустой
    return !this.isLoading && this.tours.length === 0 && this.toursCopy.length > 0;
  }

  goToTour(tour: ITour): void {
    if(tour?.id) {
      this.router.navigate([`tour/${tour.id}`]);
    }
  }

  // sort(item1: HTMLElement, item2: HTMLElement): number {
  //   if(parseFloat(item1.style.top) == parseFloat(item2.style.top)) {
  //     return parseFloat(item1.style.left) < parseFloat(item2.style.left) ? -1 : 1;
  //   } else {
  //     return parseFloat(item1.style.top) - parseFloat(item2.style.top);
  //   }
  // }

  onEnter(ev: {el: HTMLElement, index: number}) {
    const tourId = ev.el.getAttribute('data-tour-id');
    if (tourId) {
      this.goToTour({id: tourId} as ITour);
    }
    console.log('tourId', tourId)
  }

//   searchTours(ev: Event): void {
//     const searchValue = (ev.target as HTMLInputElement).value;
//     const regExp = new RegExp(searchValue, 'i');

//     if (!searchValue) {
//       this.tours = [...this.toursCopy];
//     } else {
//       this.tours = this.toursCopy.filter((el) => {
//         return regExp.test(el.name);
//       });
//     }
//   }
// }
}
