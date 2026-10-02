import { Component, inject, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgxMasonryModule } from 'ngx-masonry';
import { Router } from '@angular/router';
import { ITour } from '../../models/tour';
import { HighlightActiveDirective } from '../../shared/directives/highlight-active.directive';

@Component({
  selector: 'app-tours',
  imports: [MatCardModule, CommonModule, MatButtonModule, NgxMasonryModule, HighlightActiveDirective],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent implements OnInit {
  private toursService = inject(ToursService);
  private router = inject(Router);
  tours: ITour[] = [];

  ngOnInit(): void {
    this.toursService.getTours().subscribe((data: any) => {
      this.tours = data.tours;
    })
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
}
