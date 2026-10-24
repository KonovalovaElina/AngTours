import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ILocation, ITour, IWeatherData } from '../../models/tour';
import { FiltersService, FiltersState } from '../../services/filters.service';
import { HighlightActiveDirective } from '../../shared/directives/highlight-active.directive';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MapComponent } from '../../shared/components/map/map.component';
import { BasketService } from '../../services/basket.service';

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
    NgIf,
    NzModalModule,
    MapComponent
  ],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToursComponent implements OnInit, AfterViewInit {
  
  constructor(
    private toursService: ToursService,
    private filtersService: FiltersService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private basketService: BasketService,
  ) {}

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  tours: ITour[] = [];
  toursCopy: ITour[] = [];
  isLoading = true;

  // Фильтры
  currentFilters: FiltersState | null = null;
  
  private destroy$ = new Subject<void>();
  public showModal = false;
  public mapCountryName: string = null;
  location: ILocation;
  weatherData: IWeatherData;


  ngOnInit(): void {
    this.toursService.getTours().subscribe((toursData) => {
      this.tours = toursData;
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
      const filterDate = this.toStartOfDay(new Date(this.currentFilters.tourDate));

      if (isNaN(filterDate.getTime())) {
        console.warn('[Debug] Невалидная дата в фильтре');
        return;
      }

      console.log('[Debug] Фильтр по дате (timestamp):', filterDate.getTime());

      result = result.filter((tour) => {
        if (!tour.date) return false;

        const tourDate = this.toStartOfDay(new Date(tour.date));
        if (isNaN(tourDate.getTime())) return false;

        return tourDate.getTime() === filterDate.getTime();
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

  private toStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
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

  onEnter(ev: {el: HTMLElement, index: number}) {
    const tourId = ev.el.getAttribute('data-tour-id');
    if (tourId) {
      this.goToTour({id: tourId} as ITour);
    }
    console.log('tourId', tourId)
  }

  showMap(ev: Event, tour: ITour, code: string): void {
    ev.stopPropagation();
    this.mapCountryName = tour.country?.name_ru;
    
    this.toursService.getCountryByCode(code).subscribe((data) => {
      if (!data || !data.countryData?.latlng?.length) return;

      this.location = { lat: data.countryData.latlng[0], lng: data.countryData.latlng[1] };
      this.weatherData = data.weatherData;

      this.showModal = true;
      this.cdr.markForCheck();
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  setItemToBasket(ev: Event, item: ITour): void {
    ev.stopPropagation();
    this.basketService.setItemToBasket(item);
    this.cdr.markForCheck();
  }

  removeItemFromBasket(ev: Event, item: ITour): void {
    ev.stopPropagation();
    this.basketService.removeItemFromBasket(item);
    this.cdr.markForCheck();
  }
}
