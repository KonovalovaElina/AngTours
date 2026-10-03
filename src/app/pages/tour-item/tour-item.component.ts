import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { TourItemService } from '../../services/tour-item.service';
import { ITour } from '../../models/tour';

@Component({
  selector: 'app-tour-item',
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './tour-item.component.html',
  styleUrl: './tour-item.component.scss',
})
export class TourItemComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private tourItemService = inject(TourItemService);
  private router = inject(Router);
  tour: ITour | null = null;

  ngOnInit(): void {
    const tourId = this.route.snapshot.paramMap.get('id');

    this.tourItemService.getTour(tourId).subscribe((data: any) => {
      this.tour = data;
    })
  }

  goToOrder(): void {
    const tourId = this.route.snapshot.paramMap.get('id');
    if (!tourId) return;

    this.router.navigate(['/order'], {
      queryParams: { tourId },
    });
  }
}
