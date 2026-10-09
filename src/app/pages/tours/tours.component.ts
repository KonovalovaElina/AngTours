import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ITour } from '../../models/tour';
import { HighlightActiveDirective } from '../../shared/directives/highlight-active.directive';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
export class ToursComponent implements OnInit {
  private toursService = inject(ToursService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  tours: ITour[] = [];
  toursCopy: ITour[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.toursService.getTours().subscribe((data: any) => {
      this.tours = data.tours;
      this.toursCopy = [...this.tours];
      this.isLoading = false;
      this.cdr.detectChanges();
    })
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

  sort(item1: HTMLElement, item2: HTMLElement): number {
    if(parseFloat(item1.style.top) == parseFloat(item2.style.top)) {
      return parseFloat(item1.style.left) < parseFloat(item2.style.left) ? -1 : 1;
    } else {
      return parseFloat(item1.style.top) - parseFloat(item2.style.top);
    }
  }

  onEnter(ev: {el: HTMLElement, index: number}) {
    const tourId = ev.el.getAttribute('data-tour-id');
    if (tourId) {
      this.goToTour({id: tourId} as ITour);
    }
    console.log('tourId', tourId)
  }

  searchTours(ev: Event): void {
    const searchValue = (ev.target as HTMLInputElement).value;
    const regExp = new RegExp(searchValue, 'i');

    if (!searchValue) {
      this.tours = [...this.toursCopy];
    } else {
      this.tours = this.toursCopy.filter((el) => {
        return regExp.test(el.name);
      });
    }

    setTimeout(() => {})
  }
}
