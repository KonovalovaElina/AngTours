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

  ngOnInit(): void {
    this.toursService.getTours().subscribe((data) => {
      console.log('data tours', data)
    })
  }
}
