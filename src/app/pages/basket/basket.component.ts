import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ITour } from '../../models/tour';

@Component({
  selector: 'app-basket',
  imports: [AsyncPipe, MatTableModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent {
  basketItems$ = inject(BasketService).basketStore$;
  displayedColumns: string[] = ['name', 'price', 'date', 'actions'];

  constructor(private basketService: BasketService) {}

  removeItemFromBasket(item: ITour): void {
    this.basketService.removeItemFromBasket(item);
  }
}
