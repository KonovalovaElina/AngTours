import { Component, inject, OnInit } from '@angular/core';
import { ToursService } from '../../services/tours.service';

@Component({
  selector: 'app-tours',
  imports: [],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent implements OnInit {
  private toursService = inject(ToursService);
  tours: any;

  ngOnInit(): void {
    this.toursService.getTours().subscribe((data: any) => {
      this.tours = data.tours;
    })
  }
}
